// Mind risk evaluation. Pure and deterministic. Safety first: when in doubt, flag.
import type { Instrument, MindCase, RiskFlag, RiskKind, RiskLevel, RiskResult } from './types';

const LEVEL_RANK: Record<RiskLevel, number> = { elevated: 1, urgent: 2 };

/** Plain-words reasons for specific items. No diagnosis words. */
const ITEM_REASONS: Record<string, string> = {
  phq9_9: "You said you've had thoughts that you'd be better off dead or of hurting yourself.",
  epds_10: "You said the thought of harming yourself has come to you.",
  asq_5: "You said you are having thoughts of killing yourself right now.",
};

const KIND_REASONS: Record<RiskKind, Record<RiskLevel, string>> = {
  suicide: {
    urgent: "You said you've had thoughts of harming yourself, and they feel close right now.",
    elevated: "You said you've had thoughts of harming yourself.",
  },
  psychosis: {
    urgent: "You said you've been seeing, hearing or believing things others don't, and it feels hard to manage.",
    elevated: "You said you've been seeing, hearing or believing things others don't.",
  },
  mania: {
    urgent: "You said you've had very high energy with little need for sleep, and it is causing problems.",
    elevated: "You said you've had times of unusually high energy or mood.",
  },
  postpartum: {
    urgent: "You said you've noticed big changes in how you see or hear things since pregnancy or birth.",
    elevated: "You said you've been struggling since pregnancy or birth.",
  },
  eating: {
    urgent: "You said your eating or weight has reached a point that may be dangerous for your body.",
    elevated: "You said food and weight have been taking over a lot of your life.",
  },
  withdrawal: {
    urgent: "You said you've had shaking, fits or confusion when stopping alcohol or drugs.",
    elevated: "You said you feel unwell when you cut down on alcohol or drugs.",
  },
  confusion: {
    urgent: "You said there has been sudden confusion or a big change in thinking.",
    elevated: "You said your thinking or memory has been changing.",
  },
};

function reasonFor(kind: RiskKind, level: RiskLevel, itemId?: string): string {
  if (itemId && ITEM_REASONS[itemId]) return ITEM_REASONS[itemId];
  return KIND_REASONS[kind][level];
}

const val = (state: MindCase, instrumentId: string, itemId: string): number | undefined =>
  state.responses[instrumentId]?.[itemId];

const atLeast = (state: MindCase, instrumentId: string, itemId: string, n: number): boolean => {
  const v = val(state, instrumentId, itemId);
  return v !== undefined && v >= n;
};

export function evaluateMindRisk(state: MindCase, instruments: Instrument[]): RiskResult {
  const raw: RiskFlag[] = [];
  const add = (kind: RiskKind, level: RiskLevel, itemId?: string) =>
    raw.push({ kind, level, reason: reasonFor(kind, level, itemId) });

  // 1. Data-driven item rules.
  for (const inst of instruments) {
    for (const rule of inst.riskItems ?? []) {
      // A follow-up left over from before its lead question was changed to "No" doesn't count.
      const gate = inst.items.find((i) => i.id === rule.itemId)?.askIf;
      if (gate && !atLeast(state, inst.id, gate.itemId, gate.atLeast)) continue;
      if (atLeast(state, inst.id, rule.itemId, rule.atLeast)) add(rule.kind, rule.level, rule.itemId);
    }
  }

  // 2. Hard-coded safety nets. These fire even if instrument data is missing or wrong.
  // Any non-zero answer on PHQ-9 item 9 or EPDS item 10 needs follow-up.
  if (atLeast(state, 'phq9', 'phq9_9', 1)) add('suicide', 'elevated', 'phq9_9');
  if (atLeast(state, 'epds', 'epds_10', 1)) add('suicide', 'elevated', 'epds_10');
  // ASQ: any "yes" to items 1–4 = positive screen; "yes" to item 5 = acute (urgent).
  if (['asq_1', 'asq_2', 'asq_3', 'asq_4'].some((id) => atLeast(state, 'asq', id, 1))) add('suicide', 'elevated');
  if (atLeast(state, 'asq', 'asq_5', 1)) add('suicide', 'urgent', 'asq_5');

  // 3. Combinations.
  if (
    atLeast(state, 'clue_highs', 'clue_highs_1', 1) &&
    atLeast(state, 'clue_highs', 'clue_highs_2', 1) &&
    atLeast(state, 'clue_highs', 'clue_highs_3', 1)
  ) {
    add('mania', 'urgent');
  }
  const psychosisAnswers = Object.values(state.responses.clue_psychosis ?? {});
  if (state.perinatal && psychosisAnswers.some((v) => v >= 1)) add('postpartum', 'urgent');

  // Dedupe by kind, keeping the highest level (first reason at that level wins).
  const byKind = new Map<RiskKind, RiskFlag>();
  for (const f of raw) {
    const prev = byKind.get(f.kind);
    if (!prev || LEVEL_RANK[f.level] > LEVEL_RANK[prev.level]) byKind.set(f.kind, f);
  }
  const flags = [...byKind.values()].sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
  const level: RiskResult['level'] = flags.some((f) => f.level === 'urgent')
    ? 'urgent'
    : flags.length > 0
      ? 'elevated'
      : 'none';
  return { level, flags };
}

export function isUrgent(state: MindCase, instruments: Instrument[]): boolean {
  return evaluateMindRisk(state, instruments).level === 'urgent';
}

/** True when anything points to thoughts of self-harm. */
export function hasSuicideSignal(state: MindCase, instruments: Instrument[]): boolean {
  return evaluateMindRisk(state, instruments).flags.some((f) => f.kind === 'suicide');
}
