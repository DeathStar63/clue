// Optional "Understand with AI" helper. Sends only the typed description to
// Clue's relay server, which asks an AI to pick out symptom ids. The AI never
// decides anything: we keep only ids Clue already knows, and the normal
// safety rules and questions run on top.
import { FEATURES, type FeatureId } from '../data/features';
import { BODY_AREAS, type BodyArea } from '../data/bodyAreas';

export const AI_MAX_CHARS = 1200;
const TIMEOUT_MS = 12_000;
const OPT_IN_KEY = 'clue.aiOptIn';

export interface AiResult {
  features: FeatureId[];
  areas: BodyArea[];
  provider: string;
}

/** Thrown for any failure; `message` is plain and safe to show. */
export class AiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiError';
  }
}

function envUrl(): string {
  const url = import.meta.env.VITE_AI_URL;
  return typeof url === 'string' ? url.trim() : '';
}

export function aiAvailable(): boolean {
  return envUrl().length > 0;
}

export function aiOptIn(): boolean {
  try {
    return localStorage.getItem(OPT_IN_KEY) === '1';
  } catch {
    return false;
  }
}

export function setAiOptIn(v: boolean): void {
  try {
    localStorage.setItem(OPT_IN_KEY, v ? '1' : '0');
  } catch {
    // Storage blocked: the choice just won't be remembered.
  }
}

function isFeature(id: unknown): id is FeatureId {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(FEATURES, id);
}

function isArea(id: unknown): id is BodyArea {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(BODY_AREAS, id);
}

function uniq<T>(list: T[]): T[] {
  return [...new Set(list)];
}

export async function aiExtract(
  text: string,
  opts: { signal?: AbortSignal; fetchImpl?: typeof fetch; baseUrl?: string } = {},
): Promise<AiResult> {
  const body = text.trim().slice(0, AI_MAX_CHARS);
  const base = (opts.baseUrl ?? envUrl()).replace(/\/+$/, '');
  if (!base) throw new AiError('AI reading isn’t set up.');
  if (!body) return { features: [], areas: [], provider: '' };

  const doFetch = opts.fetchImpl ?? fetch;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const onOuterAbort = () => ctrl.abort();
  if (opts.signal) {
    if (opts.signal.aborted) ctrl.abort();
    else opts.signal.addEventListener('abort', onOuterAbort, { once: true });
  }

  try {
    let res: Response;
    try {
      res = await doFetch(`${base}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: body }),
        signal: ctrl.signal,
      });
    } catch {
      throw new AiError(ctrl.signal.aborted ? 'The AI took too long to answer.' : 'Couldn’t reach the AI.');
    }
    if (!res.ok) throw new AiError('The AI service had a problem.');

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new AiError('The AI sent back something we couldn’t read.');
    }
    if (!data || typeof data !== 'object') throw new AiError('The AI sent back something we couldn’t read.');
    const d = data as { features?: unknown; areas?: unknown; provider?: unknown };
    const features = Array.isArray(d.features) ? uniq(d.features.filter(isFeature)) : [];
    const areas = Array.isArray(d.areas) ? uniq(d.areas.filter(isArea)) : [];
    const provider = typeof d.provider === 'string' ? d.provider : '';
    return { features, areas, provider };
  } finally {
    clearTimeout(timer);
    opts.signal?.removeEventListener('abort', onOuterAbort);
  }
}
