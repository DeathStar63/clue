import { describe, expect, it } from 'vitest';
import { alsoCheckPrompts } from './alsoCheck';
import { ALL, alopecia, psoriasis, ringworm, makeState } from './fixtures.test-helpers';
import type { RankedCondition } from '../types';

function rc(condition: RankedCondition['condition'], match: number, band: RankedCondition['band'] = 'possible'): RankedCondition {
  return { condition, match, band, score: match, fitsBecause: [], againstBecause: [], confirmWith: [] };
}

describe('alsoCheckPrompts', () => {
  it('merges duplicate areas and prefers shared ones', () => {
    const ranked = [rc(psoriasis, 0.5), rc(ringworm, 0.4), rc(alopecia, 0.3)];
    const out = alsoCheckPrompts(makeState(), ranked);
    expect(out[0].area).toBe('fingernails');
    expect(out[0].forConditions).toEqual(['Psoriasis-like', 'Ringworm-like', 'Alopecia-like']);
    expect(out[0].reason).toBe('Tiny pits in nails support psoriasis.');
    expect(out.filter((p) => p.area === 'fingernails')).toHaveLength(1);
  });

  it('skips areas already selected or photographed, and less_likely conditions', () => {
    const ranked = [rc(psoriasis, 0.5), rc(ringworm, 0.4), rc(ALL[0], 0.1, 'less_likely')];
    const state = makeState({
      areas: ['elbows'],
      photos: [{ id: 'p', area: 'fingernails', distance: 'mid', dataUrl: '', takenAt: '' }],
    });
    const out = alsoCheckPrompts(state, ranked);
    expect(out.map((p) => p.area)).toEqual(['feet']);
  });

  it('respects max', () => {
    const ranked = ALL.map((c, i) => rc(c, 0.9 - i * 0.1));
    expect(alsoCheckPrompts(makeState(), ranked, 2)).toHaveLength(2);
  });
});
