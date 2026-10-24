// Mind engine: scoring, question flow and ranking. Pure, deterministic, data passed in.
import { URGENCY_ORDER } from '../engine/triage';
import type {
  ContextKey,
  GatewayCheck,
  Instrument,
  InstrumentItem,
  InstrumentResult,
  MindCase,
  MindCondition,
  RankedMindCondition,
} from './types';
import { hasSuicideSignal } from './risk';

type Responses = Record<string, number> | undefined;

// ---- Gate and skip conventions ----------------------------------------------
// Yes = 1, No = 0 everywhere. Answers to gateway items live in state.responses[instrumentId],
// so a full instrument only asks what is still unanswered.
//
// Follow-up items carry `askIf` in the data: they are hidden until the item they depend on is
// answered at or above `atLeast`, and count as 0 when not asked.

/**
 * Built-in gates (work even without askIf in the data). While a gate is unanswered, only the gate is asked.
 * - PC-PTSD-5: pcptsd5_0 "trauma ever?" — if No, items 1–5 are skipped (screen negative).
 * - AUDIT: audit_1 "how often do you drink?" — if Never, items 2–8 count as 0 and are skipped.
 */
const GATES: Record<string, { gate: string; skipsIfZero: string[] }> = {
  pcptsd5: { gate: 'pcptsd5_0', skipsIfZero: ['pcptsd5_1', 'pcptsd5_2', 'pcptsd5_3', 'pcptsd5_4', 'pcptsd5_5'] },
  audit: {
    gate: 'audit_1',
    skipsIfZero: ['audit_2', 'audit_3', 'audit_4', 'audit_5', 'audit_6', 'audit_7', 'audit_8'],
  },
};
/** ASQ: asq_5 (acute) is asked only if any of items 1–4 is Yes (askIf only handles one item). */
const CONDITIONAL_ITEM: Record<string, { itemId: string; ifAnyOf: string[] }> = {
  asq: { itemId: 'asq_5', ifAnyOf: ['asq_1', 'asq_2', 'asq_3', 'asq_4'] },
};
/** Items asked but never part of the total. */
const UNSCORED: Record<string, string[]> = { pcptsd5: ['pcptsd5_0'], asq: ['asq_5'] };

const SAFETY_INSTRUMENT = 'asq';
const HIGHS_CHECK = 'clue_highs';
const MOOD_INSTRUMENT = 'phq9';
const POSTPARTUM_CHECK = 'clue_postpartum';
const MEMORY_GATEWAY = 'gw_memory';
const WITHDRAWAL_GATEWAY = 'gw_withdrawal';
const WITHDRAWAL_TRIGGERS = ['gw_alcohol', 'gw_drugs'];

/**
 * Items not asked given the answers so far (they count as 0): built-in gates, the ASQ rule, and
 * askIf follow-ups (when the instrument data is given) still waiting on, or failing, their condition.
 */
function skippedItems(instrumentId: string, r: Record<string, number>, inst?: Instrument): Set<string> {
  const out = new Set<string>();
  const g = GATES[instrumentId];
  if (g && r[g.gate] === 0) g.skipsIfZero.forEach((id) => out.add(id));
  const cond = CONDITIONAL_ITEM[instrumentId];
  if (cond && !cond.ifAnyOf.some((id) => (r[id] ?? 0) >= 1)) out.add(cond.itemId);
  for (const item of inst?.items ?? []) {
    if (item.askIf && !((r[item.askIf.itemId] ?? -1) >= item.askIf.atLeast)) out.add(item.id);
  }
  return out;
}

/** Items that count toward the total. */
function scoredItems(inst: Instrument): InstrumentItem[] {
  const unscored = UNSCORED[inst.id] ?? [];
  return inst.items.filter((i) => !unscored.includes(i.id));
}

const optionsOf = (inst: Instrument, item: InstrumentItem) => item.options ?? inst.options;

function maxScoreOf(inst: Instrument): number {
  const items = scoredItems(inst);
  if (inst.scoring === 'count') return items.length;
  return items.reduce((sum, item) => sum + Math.max(0, ...optionsOf(inst, item).map((o) => o.value)), 0);
}

function bandFor(inst: Instrument, score: number) {
  return inst.bands.find((b) => score >= b.min && score <= b.max) ?? inst.bands[inst.bands.length - 1];
}

// ---- Scoring ----------------------------------------------------------------

/** Null until every scored, non-skipped item is answered. Skipped items count as 0. */
export function scoreInstrument(inst: Instrument, responses: Responses): InstrumentResult | null {
  const r = responses ?? {};
  const g = GATES[inst.id];
  if (g && r[g.gate] === undefined) return null;
  const skipped = skippedItems(inst.id, r, inst);
  const items = scoredItems(inst);
  if (items.some((i) => !skipped.has(i.id) && r[i.id] === undefined)) return null;
  // A follow-up only counts as "not asked" once the item it depends on is answered.
  if (items.some((i) => i.askIf && r[i.askIf.itemId] === undefined)) return null;
  const value = (id: string) => (skipped.has(id) ? 0 : r[id]);
  const score =
    inst.scoring === 'count'
      ? items.filter((i) => value(i.id) > 0).length
      : items.reduce((sum, i) => sum + value(i.id), 0);
  return {
    instrumentId: inst.id,
    score,
    maxScore: maxScoreOf(inst),
    band: bandFor(inst, score),
    positive: score >= inst.positiveAt,
  };
}

/** Items still unanswered, with gates, askIf and skips applied. If a gate is unanswered, only the gate is returned. */
export function itemsToAsk(inst: Instrument, responses: Responses): InstrumentItem[] {
  const r = responses ?? {};
  const g = GATES[inst.id];
  if (g && r[g.gate] === undefined) return inst.items.filter((i) => i.id === g.gate);
  const skipped = skippedItems(inst.id, r, inst);
  return inst.items.filter((i) => r[i.id] === undefined && !skipped.has(i.id));
}

/** The gateway's items that apply given the answers so far (answered ones included, skipped ones removed). */
export function gatewayItems(g: GatewayCheck, state: MindCase, instruments: Instrument[]): InstrumentItem[] {
  const inst = instruments.find((i) => i.id === g.instrumentId);
  if (!inst) return [];
  const skipped = skippedItems(inst.id, state.responses[inst.id] ?? {}, inst);
  return inst.items.filter((i) => g.itemIds.includes(i.id) && !skipped.has(i.id));
}

/** True once nothing is left to ask in this gateway (e.g. audit_1 = Never leaves nothing else). */
export function gatewayAnswered(g: GatewayCheck, state: MindCase, instruments: Instrument[]): boolean {
  const r = state.responses[g.instrumentId] ?? {};
  return gatewayItems(g, state, instruments).every((i) => r[i.id] !== undefined);
}

// ---- State updates ----------------------------------------------------------

const now = () => new Date().toISOString();

export function answerItem(state: MindCase, instrumentId: string, itemId: string, value: number): MindCase {
  return {
    ...state,
    responses: { ...state.responses, [instrumentId]: { ...state.responses[instrumentId], [itemId]: value } },
    updatedAt: now(),
  };
}

function gatewayApplies(state: MindCase, g: GatewayCheck, gateways: GatewayCheck[]): boolean {
  if (g.id === MEMORY_GATEWAY) return state.age !== undefined && state.age >= 60;
  if (g.id === WITHDRAWAL_GATEWAY) {
    const triggered = gateways.some(
      (t) => WITHDRAWAL_TRIGGERS.includes(t.id) && state.completed.includes(t.id) && gatewayPositive(t, state),
    );
    if (!triggered && state.context.heavy_alcohol !== true) return false;
  }
  if (g.onlyIf === 'perinatal') return state.perinatal === true;
  if (g.onlyIf === 'adult') return state.age === undefined || state.age >= 18;
  return true;
}

export function applicableGateways(state: MindCase, gateways: GatewayCheck[]): GatewayCheck[] {
  return gateways.filter((g) => !state.completed.includes(g.id) && gatewayApplies(state, g, gateways));
}

/** Sum of the gateway's items (skipped items count as 0) at or above positiveAt. */
export function gatewayPositive(g: GatewayCheck, state: MindCase, instruments: Instrument[] = []): boolean {
  const r = state.responses[g.instrumentId] ?? {};
  const skipped = skippedItems(g.instrumentId, r, instruments.find((i) => i.id === g.instrumentId));
  return g.itemIds.reduce((sum, id) => sum + (skipped.has(id) ? 0 : (r[id] ?? 0)), 0) >= g.positiveAt;
}

function instrumentDone(state: MindCase, id: string, instruments: Instrument[]): boolean {
  if (state.completed.includes(id)) return true;
  const inst = instruments.find((i) => i.id === id);
  return inst ? itemsToAsk(inst, state.responses[id]).length === 0 : false;
}

/**
 * Safety ordering. Puts ASQ first when any suicide signal exists and ASQ isn't done,
 * queues the highs check whenever the mood questionnaire is in play (bipolar check),
 * and always queues the postpartum check for perinatal users. Queued instruments with
 * nothing left to ask (e.g. the highs check already answered in the quick check) are
 * dropped from the queue and marked completed.
 */
export function ensureSafetyQueue(original: MindCase, instruments: Instrument[]): MindCase {
  let state = original;
  const answeredAlready = state.queue.filter(
    (id) => !state.completed.includes(id) && instruments.some((i) => i.id === id) && instrumentDone(state, id, instruments),
  );
  if (answeredAlready.length) state = { ...state, completed: [...state.completed, ...answeredAlready] };
  let queue = state.queue.filter((id) => !answeredAlready.includes(id));
  const suicideSignal =
    (state.responses.phq9?.phq9_9 ?? 0) >= 1 ||
    (state.responses.epds?.epds_10 ?? 0) >= 1 ||
    hasSuicideSignal(state, instruments);
  if (suicideSignal && !instrumentDone(state, SAFETY_INSTRUMENT, instruments)) {
    queue = [SAFETY_INSTRUMENT, ...queue.filter((id) => id !== SAFETY_INSTRUMENT)];
  }
  const moodInPlay = queue.includes(MOOD_INSTRUMENT) || state.completed.includes(MOOD_INSTRUMENT);
  if (moodInPlay && !queue.includes(HIGHS_CHECK) && !instrumentDone(state, HIGHS_CHECK, instruments)) {
    const at = queue.indexOf(MOOD_INSTRUMENT);
    if (at >= 0) queue.splice(at + 1, 0, HIGHS_CHECK);
    else queue.push(HIGHS_CHECK);
  }
  // Perinatal: always ask the postpartum check, whatever the EPDS score.
  if (state.perinatal === true && !queue.includes(POSTPARTUM_CHECK) && !instrumentDone(state, POSTPARTUM_CHECK, instruments)) {
    queue.push(POSTPARTUM_CHECK);
  }
  const same =
    answeredAlready.length === 0 && queue.length === state.queue.length && queue.every((id, i) => id === state.queue[i]);
  return same ? original : { ...state, queue, updatedAt: now() };
}

export function completeGateway(state: MindCase, g: GatewayCheck, instruments: Instrument[]): MindCase {
  const completed = state.completed.includes(g.id) ? state.completed : [...state.completed, g.id];
  let queue = state.queue;
  if (gatewayPositive(g, state, instruments) && g.opens && !queue.includes(g.opens) && !completed.includes(g.opens)) {
    queue = [...queue, g.opens];
  }
  return ensureSafetyQueue({ ...state, completed, queue, updatedAt: now() }, instruments);
}

export function completeInstrument(state: MindCase, instrumentId: string, instruments: Instrument[] = []): MindCase {
  const next: MindCase = {
    ...state,
    queue: state.queue.filter((id) => id !== instrumentId),
    completed: state.completed.includes(instrumentId) ? state.completed : [...state.completed, instrumentId],
    updatedAt: now(),
  };
  return ensureSafetyQueue(next, instruments);
}

// ---- Flow -------------------------------------------------------------------

export type MindStep =
  | { kind: 'gateway'; gateway: GatewayCheck; items: InstrumentItem[] }
  | { kind: 'instrument'; instrument: Instrument; items: InstrumentItem[] }
  | { kind: 'context' }
  | { kind: 'done' };

/**
 * Order: ASQ if a suicide signal exists (before anything else), then gateways, then the queue,
 * then context (if none answered yet), then done. Queued instruments with nothing left to ask
 * are skipped. Gateway steps return all their items minus any skipped by answers so far
 * (e.g. AUDIT 2–3 after audit_1 = Never, or askIf follow-ups after a No). The UI should
 * recheck with gatewayAnswered after every answer and call completeGateway as soon as it is true.
 */
export function nextStep(state: MindCase, gateways: GatewayCheck[], instruments: Instrument[]): MindStep {
  const safe = ensureSafetyQueue(state, instruments);
  const findInstrumentStep = (ids: string[]): MindStep | null => {
    for (const id of ids) {
      if (state.completed.includes(id)) continue;
      const inst = instruments.find((i) => i.id === id);
      if (!inst) continue;
      const items = itemsToAsk(inst, state.responses[id]);
      if (items.length > 0) return { kind: 'instrument', instrument: inst, items };
    }
    return null;
  };

  if (safe.queue[0] === SAFETY_INSTRUMENT) {
    const step = findInstrumentStep([SAFETY_INSTRUMENT]);
    if (step) return step;
  }
  for (const g of applicableGateways(state, gateways)) {
    if (!instruments.some((i) => i.id === g.instrumentId)) continue;
    return { kind: 'gateway', gateway: g, items: gatewayItems(g, state, instruments) };
  }
  const step = findInstrumentStep(safe.queue);
  if (step) return step;
  if (Object.keys(state.context).length === 0) return { kind: 'context' };
  return { kind: 'done' };
}

/** Queued instruments that still have something to ask, not counting `exceptId` (for "N more sets"). */
export function instrumentsLeft(state: MindCase, instruments: Instrument[], exceptId?: string): number {
  const safe = ensureSafetyQueue(state, instruments);
  return safe.queue.filter((id) => {
    if (id === exceptId || safe.completed.includes(id)) return false;
    const inst = instruments.find((i) => i.id === id);
    return !!inst && itemsToAsk(inst, safe.responses[id]).length > 0;
  }).length;
}

/** Results for every instrument whose scored items are all answered (gateway subsets don't qualify). */
export function allResults(state: MindCase, instruments: Instrument[]): InstrumentResult[] {
  const out: InstrumentResult[] = [];
  for (const inst of instruments) {
    if (!state.responses[inst.id]) continue;
    const r = scoreInstrument(inst, state.responses[inst.id]);
    if (r) out.push(r);
  }
  return out;
}

// ---- Ranking ----------------------------------------------------------------

const CONTEXT_PHRASES: Record<ContextKey, string> = {
  over_2_weeks: 'lasted more than 2 weeks',
  over_6_months: 'lasted more than 6 months',
  affects_daily_life: 'gets in the way of daily life',
  since_childhood: 'has been there since childhood',
  after_trauma: 'started after something frightening or upsetting happened',
  recent_childbirth: 'gave birth in the last year',
  pregnant: 'pregnant now',
  heavy_alcohol: 'drinking a lot of alcohol',
  drug_use: 'using drugs',
  cannabis_use: 'using cannabis',
  medical_illness: 'has a physical illness',
  new_medicine: 'started a new medicine',
  family_history: 'runs in the family',
  past_episode: 'has happened before',
  past_highs: 'past times of very high mood or energy',
  body_symptoms_checked_normal: 'body checks by a doctor came back normal',
  age_over_60: 'over 60',
  memory_worse: 'memory getting worse',
};

const BIPOLAR = 'bipolar';
/** Low-mood conditions that bipolar must outrank when the highs check is positive. */
const DEPRESSION_IDS = ['depression', 'perinatal_depression'];
const BIPOLAR_NOTE =
  'You also described times of very high energy. A doctor should check for bipolar disorder before treating low mood.';

/** Yes/no screens where a number score is confusing: show "Positive screen" / "Negative screen" instead. */
const YES_NO_SCREENS = ['asq', 'scoff', 'pcptsd5'];

export function showsAsScreen(inst: Pick<Instrument, 'id' | 'origin'>): boolean {
  return YES_NO_SCREENS.includes(inst.id) || inst.origin === 'clue';
}

/**
 * Score as shown to people: "14/27 · Moderate", or "Positive screen" / "Negative screen" for
 * yes/no screens (with the band label added when it says something more).
 */
export function resultText(r: InstrumentResult, inst?: Pick<Instrument, 'id' | 'origin'>): string {
  const value = inst && showsAsScreen(inst) ? (r.positive ? 'Positive screen' : 'Negative screen') : `${r.score}/${r.maxScore}`;
  return value.toLowerCase() === r.band.label.toLowerCase() ? value : `${value} · ${r.band.label}`;
}

function resultPhrase(r: InstrumentResult, inst?: Instrument): string {
  const band = r.band.label.toLowerCase();
  if (!inst) return `${r.instrumentId}: ${r.score} — ${band}`;
  const topic = inst.topic.charAt(0).toUpperCase() + inst.topic.slice(1);
  const kind = inst.origin === 'official' ? 'questionnaire' : 'check';
  if (showsAsScreen(inst)) {
    const word = r.positive ? 'positive screen' : 'negative screen';
    return band === word ? `${topic} ${kind} (${inst.shortName}): ${word}` : `${topic} ${kind} (${inst.shortName}): ${word} — ${band}`;
  }
  return `${topic} ${kind} (${inst.shortName}): ${r.score} — ${band}`;
}

/** Conditions that only make sense for some people. Missing → always eligible. */
const ELIGIBLE: Record<string, (s: MindCase) => boolean> = {
  memory_mood_older: (s) => (s.age !== undefined ? s.age >= 60 : s.context.age_over_60 === true),
  perinatal_depression: (s) => s.perinatal === true,
};

export function conditionEligible(state: MindCase, condition: Pick<MindCondition, 'id'>): boolean {
  return ELIGIBLE[condition.id]?.(state) ?? true;
}

/** Bipolar stays at most "less likely" unless highs were reported (check positive or past highs). */
const BIPOLAR_CAP = 0.25;

/**
 * Conditions Clue has no dedicated questionnaire for (they only borrow GAD-7 etc.).
 * They can show as "possible" at most, never "strong".
 */
const NO_OWN_CHECK = ['panic', 'social_anxiety', 'ocd'];
const NO_OWN_CHECK_CAP = 0.45;
const NO_OWN_CHECK_NOTE = "Clue has no specific check for this yet — a psychologist or psychiatrist can tell.";

const MATCH_DIVISOR = 5;
const MATCH_CAP = 0.9;

export function rankMindConditions(
  state: MindCase,
  results: InstrumentResult[],
  conditions: MindCondition[],
  instruments: Instrument[] = [],
): RankedMindCondition[] {
  const byId = new Map(results.map((r) => [r.instrumentId, r]));
  const highsPositive = byId.get(HIGHS_CHECK)?.positive === true;

  const highsReported = highsPositive || state.context.past_highs === true;

  const scored = conditions.filter((c) => conditionEligible(state, c)).map((condition) => {
    let raw = 0;
    let hasPositive = false;
    let contextHits = 0;
    const fitsBecause: string[] = [];
    for (const id of condition.linkedInstruments) {
      const r = byId.get(id);
      if (!r) continue;
      if (r.positive) {
        hasPositive = true;
        raw += 2 + Math.max(0, URGENCY_ORDER.indexOf(r.band.urgency)) * 0.5;
        fitsBecause.push(resultPhrase(r, instruments.find((i) => i.id === id)));
      } else {
        raw -= 1;
      }
    }
    for (const [key, want] of Object.entries(condition.supportingContext ?? {}) as [ContextKey, boolean][]) {
      if (state.context[key] !== undefined && state.context[key] === want) {
        raw += 0.5;
        contextHits += 1;
        fitsBecause.push(want ? CONTEXT_PHRASES[key] : `not ${CONTEXT_PHRASES[key]}`);
      }
    }
    if (condition.id === BIPOLAR && highsPositive && hasPositive) raw += 1;
    if (DEPRESSION_IDS.includes(condition.id) && highsPositive && hasPositive) fitsBecause.push(BIPOLAR_NOTE);

    let match = Math.min(MATCH_CAP, Math.max(0, raw / MATCH_DIVISOR));
    let band: RankedMindCondition['band'] = 'less_likely';
    if (!hasPositive && contextHits === 0) band = 'less_likely';
    else if (match >= 0.6 && hasPositive) band = 'strong';
    else if (match >= 0.3) band = 'possible';
    if (NO_OWN_CHECK.includes(condition.id) && band !== 'less_likely') {
      band = 'possible';
      match = Math.min(match, NO_OWN_CHECK_CAP);
      fitsBecause.push(NO_OWN_CHECK_NOTE);
    }
    if (condition.id === BIPOLAR && !highsReported) {
      band = 'less_likely';
      match = Math.min(match, BIPOLAR_CAP);
    }
    return { condition, match, band, fitsBecause, hasPositive };
  });

  const bandRank = { strong: 2, possible: 1, less_likely: 0 } as const;
  // RULE: when the highs check is positive, bipolar must rank at or above low-mood conditions.
  const bp = scored.find((s) => s.condition.id === BIPOLAR);
  const deps = scored.filter((s) => DEPRESSION_IDS.includes(s.condition.id));
  const bipolarFirst = highsPositive && !!bp?.hasPositive && deps.length > 0;
  if (bipolarFirst && bp) {
    for (const dep of deps) {
      if (bp.match < dep.match) bp.match = dep.match;
      if (bandRank[bp.band] < bandRank[dep.band]) bp.band = dep.band;
    }
  }
  const tieRank = (id: string) =>
    bipolarFirst ? (id === BIPOLAR ? 0 : DEPRESSION_IDS.includes(id) ? 1 : 2) : 2;
  scored.sort(
    (a, b) =>
      b.match - a.match ||
      bandRank[b.band] - bandRank[a.band] ||
      tieRank(a.condition.id) - tieRank(b.condition.id),
  );

  return scored.map(({ condition, match, band, fitsBecause }) => ({ condition, match, band, fitsBecause }));
}

// ---- Context already known from the questionnaires --------------------------

const answered = (state: MindCase, instrumentId: string, itemId: string): number | undefined =>
  state.responses[instrumentId]?.[itemId];

/**
 * Background answers that the questionnaires (or age) already settle, so the context step
 * doesn't ask them again. Merged into state.context when the context step is finished.
 */
export function knownContext(state: MindCase): Partial<Record<ContextKey, boolean>> {
  const out: Partial<Record<ContextKey, boolean>> = {};
  if (state.age !== undefined) out.age_over_60 = state.age >= 60;

  // Alcohol: AUDIT-C (items 1–3) >= 4, or full AUDIT >= 8. audit_1 = Never means items 2–8 count as 0.
  const a = state.responses.audit ?? {};
  if (a.audit_1 !== undefined) {
    const v = (id: string) => (a.audit_1 === 0 && id !== 'audit_9' && id !== 'audit_10' ? 0 : a[id]);
    const auditC = ['audit_1', 'audit_2', 'audit_3'].map(v);
    const full = Array.from({ length: 10 }, (_, i) => v(`audit_${i + 1}`));
    const auditCDone = auditC.every((x) => x !== undefined);
    const fullDone = full.every((x) => x !== undefined);
    const sum = (xs: (number | undefined)[]) => xs.reduce<number>((t, x) => t + (x ?? 0), 0);
    if (auditCDone || fullDone) out.heavy_alcohol = (auditCDone && sum(auditC) >= 4) || (fullDone && sum(full) >= 8);
  }

  // Drugs: one item covers cannabis, other drugs and misused medicines. A "No" settles both;
  // a "Yes" still leaves the cannabis question worth asking.
  const drugs = answered(state, 'clue_drugs', 'clue_drugs_1');
  if (drugs !== undefined) {
    out.drug_use = drugs >= 1;
    if (drugs === 0) out.cannabis_use = false;
  }

  const highs = answered(state, 'clue_highs', 'clue_highs_1');
  if (highs !== undefined) out.past_highs = highs >= 1;
  const body = answered(state, 'clue_body', 'clue_body_1');
  if (body !== undefined) out.body_symptoms_checked_normal = body >= 1;
  const memory = answered(state, 'clue_memory', 'clue_memory_1');
  if (memory !== undefined) out.memory_worse = memory >= 1;

  // Pregnancy / birth: settled by the intro question. Only "No" gives values; "Yes" just hides them.
  if (state.perinatal === false) {
    out.recent_childbirth = false;
    out.pregnant = false;
  }
  return out;
}

/** Context keys the context step should not ask (already known, or covered by the intro question). */
export function contextKeysCovered(state: MindCase): Set<ContextKey> {
  const keys = new Set(Object.keys(knownContext(state)) as ContextKey[]);
  if (state.perinatal !== undefined) {
    keys.add('recent_childbirth');
    keys.add('pregnant');
  }
  return keys;
}
