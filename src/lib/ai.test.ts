import { afterEach, describe, expect, it, vi } from 'vitest';
import { AI_MAX_CHARS, AiError, aiExtract } from './ai';

const BASE = 'https://relay.example';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('aiExtract', () => {
  it('keeps only known feature and area ids', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        features: ['red_inflamed', 'made_up_thing', 'red_inflamed', 'ring_shaped_clear_centre'],
        areas: ['thighs', 'tail'],
        provider: 'gemini',
      }),
    );
    const out = await aiExtract('  itchy red rings on my thigh  ', { fetchImpl, baseUrl: `${BASE}/` });
    expect(out).toEqual({
      features: ['red_inflamed', 'ring_shaped_clear_centre'],
      areas: ['thighs'],
      provider: 'gemini',
    });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/extract`);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ text: 'itchy red rings on my thigh' });
  });

  it('throws AiError on a non-200 reply', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ error: 'rate limited' }, 429));
    await expect(aiExtract('rash', { fetchImpl, baseUrl: BASE })).rejects.toBeInstanceOf(AiError);
  });

  it('throws AiError on bad JSON', async () => {
    const fetchImpl = vi.fn(async () => new Response('not json', { status: 200 }));
    await expect(aiExtract('rash', { fetchImpl, baseUrl: BASE })).rejects.toBeInstanceOf(AiError);
  });

  it('throws AiError on a network failure', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(aiExtract('rash', { fetchImpl, baseUrl: BASE })).rejects.toBeInstanceOf(AiError);
  });

  it('times out after 12 seconds with AiError', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    ) as unknown as typeof fetch;
    const p = aiExtract('rash', { fetchImpl, baseUrl: BASE });
    const check = expect(p).rejects.toBeInstanceOf(AiError);
    await vi.advanceTimersByTimeAsync(12_000);
    await check;
  });

  it('throws AiError when the caller aborts', async () => {
    const ctrl = new AbortController();
    const fetchImpl = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    ) as unknown as typeof fetch;
    const p = aiExtract('rash', { fetchImpl, baseUrl: BASE, signal: ctrl.signal });
    ctrl.abort();
    await expect(p).rejects.toBeInstanceOf(AiError);
  });

  it('caps the text at 1200 characters', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ features: [], areas: [], provider: 'claude' }));
    await aiExtract('a'.repeat(5000), { fetchImpl, baseUrl: BASE });
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect((JSON.parse(init.body as string) as { text: string }).text).toHaveLength(AI_MAX_CHARS);
  });
});
