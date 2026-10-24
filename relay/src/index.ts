// Clue relay: turns a free-text symptom description into Clue's symptom ids.
// The model API key lives only here, as a Worker secret. User text is never logged.

import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import * as z from 'zod/v4';
import { FEATURE_IDS, type FeatureId } from '../../src/data/features';
import { BODY_AREA_IDS, type BodyArea } from '../../src/data/bodyAreas';
import { SYSTEM } from './prompt';
import { cleanResult } from './validate';

export interface Env {
  PROVIDER?: string;
  GEMINI_MODEL?: string;
  CLAUDE_MODEL?: string;
  ALLOWED_ORIGINS?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

type Provider = 'gemini' | 'claude';
type Extracted = { features: string[]; areas: string[] };

const DEFAULT_ORIGINS = 'https://deathstar63.github.io,http://localhost:5174';
const MAX_TEXT = 1200;
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

/** A failure we turn into `{ error }` with a given status. */
class RelayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ---------- rate limit (best-effort: per isolate, in memory) ----------

const hits = new Map<string, { count: number; start: number }>();

function rateLimited(ip: string, now = Date.now()): boolean {
  const entry = hits.get(ip);
  if (!entry || now - entry.start >= RATE_WINDOW_MS) {
    hits.set(ip, { count: 1, start: now });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now - value.start >= RATE_WINDOW_MS) hits.delete(key);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

/** For tests only. */
export function resetRateLimit(): void {
  hits.clear();
}

// ---------- helpers ----------

function providerOf(env: Env): Provider {
  return env.PROVIDER === 'claude' ? 'claude' : 'gemini';
}

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? DEFAULT_ORIGINS)
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

// ---------- providers ----------

async function extractWithGemini(text: string, env: Env): Promise<unknown> {
  if (!env.GEMINI_API_KEY) throw new RelayError(502, 'Relay is missing GEMINI_API_KEY');
  const model = env.GEMINI_MODEL ?? 'gemini-3.8-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: 'user', parts: [{ text }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          features: { type: 'ARRAY', items: { type: 'STRING', enum: [...FEATURE_IDS] } },
          areas: { type: 'ARRAY', items: { type: 'STRING', enum: [...BODY_AREA_IDS] } },
        },
        required: ['features', 'areas'],
      },
    },
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify(body),
    });
  } catch {
    throw new RelayError(502, 'Could not reach the model');
  }
  if (res.status === 429) throw new RelayError(429, 'Model is busy, try again shortly');
  if (!res.ok) throw new RelayError(502, `Model error (${res.status})`);

  let data: {
    promptFeedback?: { blockReason?: string };
    candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
  };
  try {
    data = await res.json();
  } catch {
    throw new RelayError(502, 'Model returned an unreadable response');
  }
  if (data.promptFeedback?.blockReason) throw new RelayError(502, 'Model declined this text');
  const candidate = data.candidates?.[0];
  const out = candidate?.content?.parts?.[0]?.text;
  if (!out) {
    throw new RelayError(502, candidate?.finishReason === 'SAFETY' ? 'Model declined this text' : 'Model returned no answer');
  }
  try {
    return JSON.parse(out);
  } catch {
    throw new RelayError(502, 'Model returned malformed output');
  }
}

async function extractWithClaude(text: string, env: Env): Promise<unknown> {
  if (!env.ANTHROPIC_API_KEY) throw new RelayError(502, 'Relay is missing ANTHROPIC_API_KEY');
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const schema = z.object({
    features: z.array(z.enum(FEATURE_IDS as [FeatureId, ...FeatureId[]])),
    areas: z.array(z.enum(BODY_AREA_IDS as [BodyArea, ...BodyArea[]])),
  });
  try {
    const response = await client.messages.parse({
      model: env.CLAUDE_MODEL ?? 'claude-opus-5-5',
      max_tokens: 2000,
      system: SYSTEM,
      messages: [{ role: 'user', content: text }],
      output_config: { effort: 'low', format: zodOutputFormat(schema) },
    });
    if (response.stop_reason === 'refusal') throw new RelayError(502, 'Model declined this text');
    if (!response.parsed_output) throw new RelayError(502, 'Model returned no answer');
    return response.parsed_output;
  } catch (err) {
    if (err instanceof RelayError) throw err;
    if (err instanceof Anthropic.RateLimitError) throw new RelayError(429, 'Model is busy, try again shortly');
    if (err instanceof Anthropic.APIError) throw new RelayError(502, `Model error (${err.status ?? 'network'})`);
    throw new RelayError(502, 'Model returned malformed output');
  }
}

// ---------- request handling ----------

async function readText(request: Request): Promise<string> {
  const length = Number(request.headers.get('Content-Length') ?? '0');
  if (length > MAX_BODY_BYTES) throw new RelayError(413, 'Text is too long');
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    throw new RelayError(400, 'Could not read the request');
  }
  if (raw.length > MAX_BODY_BYTES) throw new RelayError(413, 'Text is too long');
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new RelayError(400, 'Body must be JSON like {"text": "..."}');
  }
  const text = body && typeof body === 'object' ? (body as { text?: unknown }).text : undefined;
  if (typeof text !== 'string') throw new RelayError(400, 'Body must be JSON like {"text": "..."}');
  const trimmed = text.trim();
  if (!trimmed) throw new RelayError(400, 'Text is empty');
  if (trimmed.length > MAX_TEXT) throw new RelayError(413, `Text must be ${MAX_TEXT} characters or fewer`);
  return trimmed;
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const originOk = origin !== null && allowedOrigins(env).includes(origin);
  const provider = providerOf(env);

  if (url.pathname === '/health' && request.method === 'GET') {
    return json({ ok: true, provider }, 200, originOk ? origin : null);
  }

  if (url.pathname !== '/extract') return json({ error: 'Not found' }, 404, originOk ? origin : null);

  // Browsers always send Origin on cross-site requests; anything else is refused.
  if (!originOk) return json({ error: 'Origin not allowed' }, 403, null);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== 'POST') return json({ error: 'Use POST' }, 405, origin);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (rateLimited(ip)) return json({ error: 'Too many requests, wait a minute' }, 429, origin);

  try {
    const text = await readText(request);
    const raw = provider === 'claude' ? await extractWithClaude(text, env) : await extractWithGemini(text, env);
    const cleaned: Extracted = cleanResult(raw);
    return json({ ...cleaned, provider }, 200, origin);
  } catch (err) {
    if (err instanceof RelayError) return json({ error: err.message }, err.status, origin);
    return json({ error: 'Something went wrong' }, 502, origin);
  }
}

export default {
  fetch: (request: Request, env: Env) => handleRequest(request, env),
} satisfies ExportedHandler<Env>;
