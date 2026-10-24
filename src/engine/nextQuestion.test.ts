import { describe, expect, it } from 'vitest';
import { applyAnswer, isApplicable, pickNextQuestion, progressEstimate } from './nextQuestion';
import { rankConditions } from './scoring';
import { ALL, QUESTIONS, alopecia, makeState, psoriasis, scabies } from './fixtures.test-helpers';
import type { CaseState, Question, RankedCondition } from '../types';

const q = (id: string) => QUESTIONS.find((x) => x.id === id)!;
const next = (s: CaseState, qs: Question[] = QUESTIONS, max?: number) =>
  pickNextQuestion(s, qs, rankConditions(s, ALL), max ? { maxQuestions: max } : undefined);

describe('isApplicable', () => {
  it('handles showIf by area or yes-feature', () => {
    expect(isApplicable(q('q_itch'), makeState())).toBe(true);
    expect(isApplicable(q('q_scalp_core'), makeState())).toBe(false);
    expect(isApplicable(q('q_scalp_core'), makeState({ areas: ['scalp'] }))).toBe(true);
    expect(isApplicable(q('q_night'), makeState({ answers: { itchy: 'no' } }))).toBe(false);
    expect(isApplicable(q('q_night'), makeState({ answers: { itchy: 'yes' } }))).toBe(true);
  });
});

describe('applyAnswer', () => {
  it('yesno sets the feature, immutably, no duplicate asked', () => {
    const s0 = makeState();
    const s1 = applyAnswer(s0, q('q_itch'), 'yes');
    expect(s1.answers.itchy).toBe('yes');
    expect(s0.answers.itchy).toBeUndefined();
    expect(s1.asked).toEqual(['q_itch']);
    expect(applyAnswer(s1, q('q_itch'), 'no').asked).toEqual(['q_itch']);
    expect(s1.updatedAt).not.toBe(s0.updatedAt);
  });

  it("single sets picked 'yes' and all other options 'no'", () => {
    const s = applyAnswer(makeState(), q('q_duration'), [1]);
    expect(s.answers).toEqual({ duration_under_2w: 'no', duration_2_to_6w: 'yes', duration_over_6w: 'no' });
  });

  it("multi sets only picked 'yes'", () => {
    const s = applyAnswer(makeState(), q('q_triggers'), [0]);
    expect(s.answers).toEqual({ family_also_itchy: 'yes' });
  });
});

describe('pickNextQuestion', () => {
  it('asks applicable core questions first, in order', () => {
    let s = makeState({ areas: ['scalp'] });
    expect(next(s)?.id).toBe('q_itch');
    s = applyAnswer(s, q('q_itch'), 'yes');
    expect(next(s)?.id).toBe('q_duration');
    s = applyAnswer(s, q('q_duration'), [2]);
    expect(next(s)?.id).toBe('q_scalp_core');
    s = applyAnswer(s, q('q_scalp_core'), [1]);
    expect(next(s)?.phase).toBe('detail');
  });

  it('detail picks the question that splits the top conditions', () => {
    // Groin + itchy: ringworm vs scabies-like. Ring shape (3 vs -1/0) splits; teen splits nothing.
    let s = makeState({ areas: ['groin', 'elbows'], answers: { itchy: 'yes' }, asked: ['q_itch', 'q_duration'] });
    const picked = next(s)!;
    expect(['q_ring', 'q_scale']).toContain(picked.id);
    expect(picked.id).not.toBe('q_irrelevant');
    // Once ring and scale are answered, the irrelevant question is never picked.
    s = applyAnswer(s, q('q_ring'), 'no');
    s = applyAnswer(s, q('q_scale'), 'no');
    s = applyAnswer(s, q('q_night'), 'no');
    s = applyAnswer(s, q('q_triggers'), [1]);
    expect(next(s)).toBeNull();
  });

  it('skips detail questions whose features are already answered', () => {
    const s = makeState({
      areas: ['groin'],
      answers: { itchy: 'yes', ring_shaped_clear_centre: 'yes' },
      asked: ['q_itch', 'q_duration'],
    });
    expect(next(s)?.id).not.toBe('q_ring');
  });

  it('stops at maxQuestions', () => {
    const s = makeState({ asked: ['a', 'b', 'c'] });
    expect(next(s, QUESTIONS, 3)).toBeNull();
  });

  it('stops when the top is strong, clearly ahead, after ≥6 detail questions', () => {
    const detail: Question[] = Array.from({ length: 8 }, (_, i) => ({
      id: `d${i}`,
      text: '',
      why: '',
      kind: 'yesno' as const,
      feature: (['burrows', 'nail_pitting', 'patchy_hair_loss_smooth', 'raised_plaques', 'well_defined_edges', 'eyebrow_beard_loss', 'thick_silvery_scale', 'scaly_patch_broken_hairs'] as const)[i],
      phase: 'detail' as const,
    }));
    // Synthetic ranking: psoriasis-like strong and 0.3 ahead of alopecia-like.
    const mk = (condition: RankedCondition['condition'], match: number, band: RankedCondition['band']): RankedCondition => ({
      condition, match, band, score: match, fitsBecause: [], againstBecause: [], confirmWith: [],
    });
    const ranked = [mk(psoriasis, 0.85, 'strong'), mk(alopecia, 0.55, 'possible'), mk(scabies, 0.4, 'possible')];
    const base = makeState({ areas: ['scalp'] });

    const after5 = { ...base, asked: ['d0', 'd1', 'd2', 'd3', 'd4'] };
    expect(pickNextQuestion(after5, detail, ranked)).not.toBeNull();
    const after6 = { ...base, asked: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'] };
    expect(pickNextQuestion(after6, detail, ranked)).toBeNull();
    // Not clearly ahead → keep asking.
    const close = [mk(psoriasis, 0.85, 'strong'), mk(alopecia, 0.7, 'possible'), mk(scabies, 0.4, 'possible')];
    expect(pickNextQuestion(after6, detail, close)).not.toBeNull();
  });

  it('stops when no question has value > 0.2', () => {
    const s = makeState({ asked: ['q_itch', 'q_duration'] });
    const onlyIrrelevant = QUESTIONS.filter((x) => x.phase === 'core' || x.id === 'q_irrelevant');
    expect(next(s, onlyIrrelevant)).toBeNull();
  });
});

describe('progressEstimate', () => {
  it('grows with asked questions and stays below 1', () => {
    const p0 = progressEstimate(makeState(), QUESTIONS);
    const p1 = progressEstimate(makeState({ asked: ['q_itch', 'q_duration'] }), QUESTIONS);
    const pMax = progressEstimate(makeState({ asked: Array.from({ length: 30 }, (_, i) => `x${i}`) }), QUESTIONS);
    expect(p0).toBe(0);
    expect(p1).toBeGreaterThan(p0);
    expect(pMax).toBeLessThan(1);
  });
});

describe('core questions already answered in free text', () => {
  it('skips a yes/no core question whose feature is already answered', () => {
    const q: Question = { id: 'q_itch', text: 'Itchy?', why: '', kind: 'yesno', feature: 'itchy', phase: 'core' };
    const q2: Question = { id: 'q_pain', text: 'Painful?', why: '', kind: 'yesno', feature: 'painful_tender', phase: 'core' };
    const state = makeState({ answers: { itchy: 'yes' } });
    expect(pickNextQuestion(state, [q, q2], [])?.id).toBe('q_pain');
  });
});
