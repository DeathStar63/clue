import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanResult, MAX_AREAS, MAX_FEATURES } from './validate';
import { handleRequest, resetRateLimit, type Env } from './index';
import { FEATURE_IDS } from '../../src/data/features';

const ORIGIN = 'http://localhost:5174';
const env: Env = {
  PROVIDER: 'gemini',
  GEMINI_MODEL: 'gemini-3.8-flash',
  ALLOWED_ORIGINS: 'https://deathstar63.github.io,http://localhost:5174',
  GEMINI_API_KEY: 'test-key',
};

function extract(text: unknown, origin: string | null = ORIGIN): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'CF-Connecting-IP': '1.2.3.4' };
  if (origin) headers.Origin = origin;
  return new Request('https://relay.test/extract', { method: 'POST', headers, body: JSON.stringify({ text }) });
}

function geminiReply(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('cleanResult', () => {
  it('drops unknown ids and non-strings, dedupes', () => {
    expect(
      cleanResult({ features: ['itchy', 'itchy', 'made_up', 7, 'duration_over_6w'], areas: ['scalp', 'moon', 'scalp'] }),
    ).toEqual({ features: ['itchy', 'duration_over_6w'], areas: ['scalp'] });
  });

  it('handles junk input', () => {
    expect(cleanResult(null)).toEqual({ features: [], areas: [] });
    expect(cleanResult('hi')).toEqual({ features: [], areas: [] });
    expect(cleanResult({ features: 'itchy' })).toEqual({ features: [], areas: [] });
    expect(cleanResult({ features: ['toString', '__proto__'] })).toEqual({ features: [], areas: [] });
  });

  it('caps list sizes', () => {
    const out = cleanResult({
      features: FEATURE_IDS.slice(0, 40),
      areas: ['scalp', 'face', 'neck', 'chest', 'back', 'abdomen', 'armpits', 'groin', 'hands', 'feet', 'knees', 'shins'],
    });
    expect(out.features).toHaveLength(MAX_FEATURES);
    expect(out.areas).toHaveLength(MAX_AREAS);
  });
});

describe('handleRequest', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    resetRateLimit();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('rejects other origins with 403', async () => {
    const res = await handleRequest(extract('itchy scalp', 'https://evil.example'), env);
    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(await res.json()).toHaveProperty('error');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers preflight for allowed origins', async () => {
    const res = await handleRequest(
      new Request('https://relay.test/extract', { method: 'OPTIONS', headers: { Origin: ORIGIN } }),
      env,
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
  });

  it('returns 400 for empty text and 413 for long text', async () => {
    expect((await handleRequest(extract('   '), env)).status).toBe(400);
    expect((await handleRequest(extract(42), env)).status).toBe(400);
    const res = await handleRequest(extract('a'.repeat(1201)), env);
    expect(res.status).toBe(413);
    expect(await res.json()).toHaveProperty('error');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('Gemini happy path returns cleaned ids', async () => {
    fetchMock.mockResolvedValueOnce(
      geminiReply({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify({ features: ['itchy', 'bogus', 'itchy', 'dandruff_flakes'], areas: ['scalp', 'nowhere'] }) }],
            },
          },
        ],
      }),
    );
    const res = await handleRequest(extract('  khujli on my scalp with flakes  '), env);
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
    expect(await res.json()).toEqual({ features: ['itchy', 'dandruff_flakes'], areas: ['scalp'], provider: 'gemini' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/models/gemini-3.8-flash:generateContent');
    expect(init.headers['x-goog-api-key']).toBe('test-key');
    const sent = JSON.parse(init.body);
    expect(sent.contents[0].parts[0].text).toBe('khujli on my scalp with flakes');
    expect(sent.generationConfig.responseMimeType).toBe('application/json');
  });

  it('Gemini blocked prompt returns 502', async () => {
    fetchMock.mockResolvedValueOnce(geminiReply({ promptFeedback: { blockReason: 'SAFETY' } }));
    const res = await handleRequest(extract('itchy arms'), env);
    expect(res.status).toBe(502);
    expect(await res.json()).toHaveProperty('error');
  });

  it('Gemini with no candidates returns 502', async () => {
    fetchMock.mockResolvedValueOnce(geminiReply({ candidates: [] }));
    expect((await handleRequest(extract('itchy arms'), env)).status).toBe(502);
  });

  it('rate limits after 20 requests per minute per IP', async () => {
    fetchMock.mockImplementation(async () =>
      geminiReply({ candidates: [{ content: { parts: [{ text: '{"features":[],"areas":[]}' }] } }] }),
    );
    for (let i = 0; i < 20; i++) expect((await handleRequest(extract('itchy'), env)).status).toBe(200);
    expect((await handleRequest(extract('itchy'), env)).status).toBe(429);
  });

  it('health reports the provider', async () => {
    const res = await handleRequest(new Request('https://relay.test/health'), env);
    expect(await res.json()).toEqual({ ok: true, provider: 'gemini' });
  });
});
