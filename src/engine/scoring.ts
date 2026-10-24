// Deterministic, explainable ranking of conditions from what the user told us.
// Every number here is a tuning knob; they are grouped at the top on purpose.
import type { Band, CaseState, Condition, FeatureId, Prevalence, RankedCondition } from '../types';
import { featureLabel } from '../data/features';
import { areaLabel } from '../data/bodyAreas';

export const PRIOR: Record<Prevalence, number> = {
  very_common: 1.0,
  common: 0.6,
  uncommon: 0.2,
  rare: -0.3,
};

/** Per-area site weight multiplier. */
export const SITE_FACTOR = 0.6;
/** Applied when the user picked areas and none of them is a site for this condition. */
export const SITE_MISMATCH_PENALTY = -2.5;
/** 'no' to a feature with weight ≥ STRONG_FEATURE subtracts weight × NO_FACTOR. */
export const STRONG_FEATURE = 2;
export const NO_FACTOR = 0.7;
/** 'no' to a contra-feature (negative weight) mildly fits. */
export const NO_CONTRA_BONUS = 0.3;
/** Score gap → match falloff. Bigger = flatter. */
export const TEMPERATURE = 1.5;
/** Top condition's match: base + per unit of positive 'yes' evidence, capped. Never 100%. */
export const TOP_MATCH_BASE = 0.3;
export const TOP_MATCH_PER_EVIDENCE = 0.1;
export const TOP_MATCH_CAP = 0.92;

export const STRONG_MATCH = 0.6;
export const STRONG_MIN_HITS = 2;
export const POSSIBLE_MATCH = 0.3;

/** When the more specific feature (key) fits, its general form (value) is dropped from "fits because". */
export const MORE_SPECIFIC: Partial<Record<FeatureId, FeatureId>> = {
  itch_worse_night: 'itchy',
  thick_silvery_scale: 'scaly_flaky',
  grouped_blisters: 'blisters',
  complete_colour_loss: 'lighter_patches',
  hives_fade_24h: 'hives',
};

interface Scored {
  condition: Condition;
  score: number;
  positiveHits: number;
  positiveEvidence: number;
}

function entries(c: Condition): [FeatureId, number][] {
  return Object.entries(c.evidence) as [FeatureId, number][];
}

function scoreOne(state: CaseState, c: Condition): Scored {
  let score = PRIOR[c.prevalence];

  if (state.areas.length > 0) {
    let overlap = false;
    for (const area of state.areas) {
      const w = c.sites[area];
      if (w) {
        score += w * SITE_FACTOR;
        overlap = true;
      }
    }
    if (!overlap) score += SITE_MISMATCH_PENALTY;
  }

  let positiveHits = 0;
  let positiveEvidence = 0;
  for (const [f, w] of entries(c)) {
    const a = state.answers[f];
    if (a === 'yes') {
      score += w;
      if (w > 0) {
        positiveHits++;
        positiveEvidence += w;
      }
    } else if (a === 'no') {
      if (w >= STRONG_FEATURE) score -= w * NO_FACTOR;
      else if (w < 0) score += NO_CONTRA_BONUS;
    }
  }
  return { condition: c, score, positiveHits, positiveEvidence };
}

function bandFor(match: number, hits: number): Band {
  if (match >= STRONG_MATCH && hits >= STRONG_MIN_HITS) return 'strong';
  if (match >= POSSIBLE_MATCH) return 'possible';
  return 'less_likely';
}

function explain(state: CaseState, c: Condition) {
  const ev = entries(c);

  const fitIds = ev.filter(([f, w]) => w > 0 && state.answers[f] === 'yes');
  const covered = new Set(fitIds.map(([f]) => MORE_SPECIFIC[f]).filter(Boolean));
  const fitFeatures = fitIds
    .filter(([f]) => !covered.has(f))
    .sort((a, b) => b[1] - a[1])
    .map(([f]) => featureLabel(f));
  const fitSites = state.areas
    .filter((a) => c.sites[a])
    .sort((a, b) => (c.sites[b] ?? 0) - (c.sites[a] ?? 0))
    .map((a) => areaLabel(a).toLowerCase());
  const siteLine = fitSites.length > 0 ? [`a usual place for it: ${fitSites.join(', ')}`] : [];
  const fitsBecause = [...fitFeatures.slice(0, 4), ...siteLine];

  const against = [
    ...ev
      .filter(([f, w]) => w < 0 && state.answers[f] === 'yes')
      .sort((a, b) => a[1] - b[1])
      .map(([f]) => `you said: ${featureLabel(f)}`),
    ...ev
      .filter(([f, w]) => w >= STRONG_FEATURE && state.answers[f] === 'no')
      .sort((a, b) => b[1] - a[1])
      .map(([f]) => `no ${featureLabel(f)}`),
  ];
  const againstBecause = against.slice(0, 4);

  const confirmWith = ev
    .filter(([f, w]) => w >= STRONG_FEATURE && state.answers[f] === undefined)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => featureLabel(f));

  return { fitsBecause, againstBecause, confirmWith };
}

export function rankConditions(state: CaseState, conditions: Condition[]): RankedCondition[] {
  if (conditions.length === 0) return [];
  // Array.prototype.sort is stable, so ties keep input order.
  const scored = conditions.map((c) => scoreOne(state, c)).sort((a, b) => b.score - a.score);

  const top = scored[0];
  const topMatch = Math.min(
    TOP_MATCH_CAP,
    TOP_MATCH_BASE + TOP_MATCH_PER_EVIDENCE * top.positiveEvidence,
  );

  return scored.map((s) => {
    // Softmax relative to the top: exp((s - top)/T) is p_i / p_top.
    const match = topMatch * Math.exp((s.score - top.score) / TEMPERATURE);
    return {
      condition: s.condition,
      score: s.score,
      match,
      band: bandFor(match, s.positiveHits),
      ...explain(state, s.condition),
    };
  });
}
