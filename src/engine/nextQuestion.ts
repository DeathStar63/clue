// Adaptive questioning: core questions first, then the detail question that best
// splits the current top conditions.
import type { Answer, CaseState, FeatureId, Question, RankedCondition } from '../types';

export const DEFAULT_MAX_QUESTIONS = 18;
/** A detail question must be worth more than this to be asked. */
export const MIN_QUESTION_VALUE = 0.2;
/** How many top conditions a detail question tries to split. */
export const SPLIT_POOL = 5;
/** Confident-stop: top is 'strong', leads #2 by this much, after this many detail questions. */
export const STOP_MARGIN = 0.25;
export const STOP_MIN_DETAIL = 6;
/** Rough number of detail questions a typical case needs, for the progress bar. */
export const EXPECTED_DETAIL = 6;

/** True when the user's own words already answered this (single choice: any option picked). */
function alreadyAnswered(q: Question, state: CaseState): boolean {
  const feats = questionFeatures(q);
  if (q.kind === 'single') return feats.some((f) => state.answers[f] === 'yes');
  if (q.kind === 'multi') return false;
  return feats.every((f) => state.answers[f] !== undefined);
}

export function questionFeatures(q: Question): FeatureId[] {
  if (q.kind === 'yesno') return q.feature ? [q.feature] : [];
  return [...new Set((q.options ?? []).flatMap((o) => o.sets))];
}

export function isApplicable(q: Question, state: CaseState): boolean {
  const s = q.showIf;
  if (!s) return true;
  const areaHit = (s.anyAreas ?? []).some((a) => state.areas.includes(a));
  const featHit = (s.anyFeatures ?? []).some((f) => state.answers[f] === 'yes');
  return areaHit || featHit;
}

/** Weighted variance of each unanswered feature's evidence weight across the pool, summed. */
function splitValue(q: Question, state: CaseState, pool: RankedCondition[]): number {
  const feats = questionFeatures(q).filter((f) => state.answers[f] === undefined);
  if (feats.length === 0 || pool.length === 0) return 0;
  const total = pool.reduce((s, r) => s + r.match, 0);
  const weights = pool.map((r) => (total > 0 ? r.match / total : 1 / pool.length));
  let value = 0;
  for (const f of feats) {
    const ws = pool.map((r) => r.condition.evidence[f] ?? 0);
    if (ws.every((w) => w === 0)) continue;
    const mean = ws.reduce((s, w, i) => s + w * weights[i], 0);
    value += ws.reduce((s, w, i) => s + weights[i] * (w - mean) ** 2, 0);
  }
  return value;
}

/**
 * Stop rule (returns null) — checked in this order:
 *  1. asked.length ≥ maxQuestions (default 18).
 *  2. Unasked applicable core questions are always asked next (array order).
 *  3. Confident stop: top band 'strong', top.match − second.match ≥ 0.25,
 *     and ≥ 6 detail questions already asked.
 *  4. No unasked applicable detail question has split value > 0.2.
 */
export function pickNextQuestion(
  state: CaseState,
  questions: Question[],
  ranked: RankedCondition[],
  opts?: { maxQuestions?: number },
): Question | null {
  const max = opts?.maxQuestions ?? DEFAULT_MAX_QUESTIONS;
  if (state.asked.length >= max) return null;

  const asked = new Set(state.asked);
  const open = questions.filter((q) => !asked.has(q.id) && isApplicable(q, state));

  // Skip core questions the user already answered in their own words.
  const core = open.find(
    (q) => q.phase === 'core' && !alreadyAnswered(q, state),
  );
  if (core) return core;

  const detailAsked = questions.filter((q) => q.phase === 'detail' && asked.has(q.id)).length;
  const [first, second] = ranked;
  if (
    first &&
    first.band === 'strong' &&
    first.match - (second?.match ?? 0) >= STOP_MARGIN &&
    detailAsked >= STOP_MIN_DETAIL
  ) {
    return null;
  }

  const pool = ranked.slice(0, SPLIT_POOL);
  let best: Question | null = null;
  let bestValue = MIN_QUESTION_VALUE;
  for (const q of open) {
    if (q.phase !== 'detail') continue;
    const v = splitValue(q, state, pool);
    if (v > bestValue) {
      best = q;
      bestValue = v;
    }
  }
  return best;
}

export function applyAnswer(state: CaseState, q: Question, value: Answer | number[]): CaseState {
  const answers = { ...state.answers };

  if (q.kind === 'yesno') {
    if (q.feature && typeof value === 'string') answers[q.feature] = value;
  } else if (Array.isArray(value)) {
    const options = q.options ?? [];
    const picked = new Set(value);
    if (q.kind === 'single') {
      options.forEach((o, i) => {
        if (!picked.has(i)) for (const f of o.sets) answers[f] = 'no';
      });
    }
    options.forEach((o, i) => {
      if (picked.has(i)) for (const f of o.sets) answers[f] = 'yes';
    });
  }
  // A string answer to single/multi (e.g. 'unsure') records the question as asked only.

  return {
    ...state,
    answers,
    asked: state.asked.includes(q.id) ? state.asked : [...state.asked, q.id],
    updatedAt: new Date().toISOString(),
  };
}

/** 0..1 for a progress bar. Never reaches 1 on its own; the UI shows 1 when done. */
export function progressEstimate(state: CaseState, questions: Question[]): number {
  const coreCount = questions.filter((q) => q.phase === 'core' && isApplicable(q, state)).length;
  const expected = Math.min(DEFAULT_MAX_QUESTIONS, coreCount + EXPECTED_DETAIL);
  if (expected <= 0) return 0;
  return Math.min(0.95, state.asked.length / expected);
}
