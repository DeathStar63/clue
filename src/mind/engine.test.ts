import { describe, expect, it } from 'vitest';
import {
  allResults,
  answerItem,
  applicableGateways,
  completeGateway,
  completeInstrument,
  contextKeysCovered,
  ensureSafetyQueue,
  gatewayAnswered,
  gatewayItems,
  gatewayPositive,
  instrumentsLeft,
  itemsToAsk,
  knownContext,
  nextStep,
  rankMindConditions,
  resultText,
  scoreInstrument,
} from './engine';
import { INSTRUMENTS as REAL_INSTRUMENTS, GATEWAYS as REAL_GATEWAYS } from './instruments';
import { MIND_CONDITIONS } from './conditions';
import type { GatewayCheck, Instrument, MindCase, MindCondition, ScoreBand } from './types';

// ---- Tiny fixtures mirroring the real conventions ----

const freq = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];
const yesNo = [
  { label: 'No', value: 0 },
  { label: 'Yes', value: 1 },
];
const band = (min: number, max: number, label: string, urgency: ScoreBand['urgency']): ScoreBand => ({
  min,
  max,
  label,
  urgency,
});

function inst(id: string, n: number, extra: Partial<Instrument> = {}): Instrument {
  return {
    id,
    name: id,
    shortName: id.toUpperCase(),
    topic: 'test',
    origin: 'official',
    stem: '',
    options: freq,
    items: Array.from({ length: n }, (_, i) => ({ id: `${id}_${i + 1}`, text: `q${i + 1}` })),
    scoring: 'sum',
    bands: [band(0, 4, 'Minimal', 'self_care'), band(5, 9, 'Mild', 'routine'), band(10, 99, 'Moderate', 'soon')],
    positiveAt: 10,
    citation: '',
    licenceNote: '',
    ...extra,
  };
}

const phq9 = inst('phq9', 9, {
  shortName: 'PHQ-9',
  topic: 'mood',
  riskItems: [{ itemId: 'phq9_9', atLeast: 1, kind: 'suicide', level: 'elevated' }],
});
const asq = inst('asq', 5, {
  options: yesNo,
  bands: [band(0, 0, 'Negative', 'self_care'), band(1, 4, 'Positive', 'today')],
  positiveAt: 1,
  riskItems: [{ itemId: 'asq_5', atLeast: 1, kind: 'suicide', level: 'urgent' }],
});
const pcptsd5: Instrument = {
  ...inst('pcptsd5', 5, { options: yesNo, positiveAt: 4 }),
  items: Array.from({ length: 6 }, (_, i) => ({ id: `pcptsd5_${i}`, text: `t${i}` })),
  bands: [band(0, 3, 'Below cut-off', 'self_care'), band(4, 5, 'Above cut-off', 'soon')],
};
const asrs = inst('asrs6', 6, {
  scoring: 'count',
  positiveAt: 4,
  bands: [band(0, 3, 'Below', 'self_care'), band(4, 6, 'Above', 'routine')],
});
const highs = inst('clue_highs', 3, {
  origin: 'clue',
  topic: 'high mood',
  options: yesNo,
  positiveAt: 2,
  bands: [band(0, 1, 'Few signs', 'self_care'), band(2, 3, 'Some signs', 'soon')],
});
const memory = inst('clue_memory', 2, { options: yesNo, positiveAt: 1 });
const epds = inst('epds', 10);
const audit = inst('audit', 10, { positiveAt: 8, bands: [band(0, 7, 'Lower', 'self_care'), band(8, 40, 'Higher', 'routine')] });
const postpartum = inst('clue_postpartum', 2, { options: yesNo, positiveAt: 1 });
const withdrawal = inst('clue_withdrawal', 2, { options: yesNo, positiveAt: 1 });
const INSTRUMENTS = [phq9, asq, pcptsd5, asrs, highs, memory, epds, audit, postpartum, withdrawal];

const gwMood: GatewayCheck = {
  id: 'gw_mood',
  instrumentId: 'phq9',
  itemIds: ['phq9_1', 'phq9_2'],
  positiveAt: 3,
  opens: 'phq9',
  label: 'Mood',
};
const gwPerinatal: GatewayCheck = {
  id: 'gw_perinatal',
  instrumentId: 'epds',
  itemIds: ['epds_1'],
  positiveAt: 1,
  opens: 'epds',
  label: 'After birth',
  onlyIf: 'perinatal',
};
const gwAdult: GatewayCheck = {
  id: 'gw_focus',
  instrumentId: 'asrs6',
  itemIds: ['asrs6_1'],
  positiveAt: 1,
  opens: 'asrs6',
  label: 'Focus',
  onlyIf: 'adult',
};
const gwMemory: GatewayCheck = {
  id: 'gw_memory',
  instrumentId: 'clue_memory',
  itemIds: ['clue_memory_1'],
  positiveAt: 1,
  opens: 'clue_memory',
  label: 'Memory',
};
const GATEWAYS = [gwMood, gwPerinatal, gwAdult, gwMemory];

function makeCase(over: Partial<MindCase> = {}): MindCase {
  return {
    id: 'c1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    responses: {},
    context: {},
    queue: [],
    completed: [],
    ...over,
  };
}

const fill = (prefix: string, values: number[], start = 1) =>
  Object.fromEntries(values.map((v, i) => [`${prefix}_${i + start}`, v]));

// ---- Scoring ----

describe('scoreInstrument', () => {
  it('sums items, picks the band and positive flag', () => {
    const r = scoreInstrument(phq9, fill('phq9', [2, 2, 2, 2, 2, 1, 1, 1, 1]));
    expect(r).toMatchObject({ score: 14, maxScore: 27, positive: true });
    expect(r?.band.label).toBe('Moderate');
  });

  it('returns null when an item is missing', () => {
    expect(scoreInstrument(phq9, fill('phq9', [1, 1]))).toBeNull();
    expect(scoreInstrument(phq9, undefined)).toBeNull();
  });

  it('count scoring counts non-zero answers', () => {
    const r = scoreInstrument(asrs, fill('asrs6', [1, 0, 1, 1, 1, 0]));
    expect(r).toMatchObject({ score: 4, maxScore: 6, positive: true });
  });

  it('pcptsd5: gate "no" scores 0 without the rest; gate excluded from score', () => {
    expect(scoreInstrument(pcptsd5, {})).toBeNull();
    expect(scoreInstrument(pcptsd5, { pcptsd5_0: 0 })).toMatchObject({ score: 0, maxScore: 5, positive: false });
    expect(scoreInstrument(pcptsd5, { pcptsd5_0: 1, ...fill('pcptsd5', [1, 1, 1, 1]) })).toBeNull();
    expect(scoreInstrument(pcptsd5, { pcptsd5_0: 1, ...fill('pcptsd5', [1, 1, 1, 1, 0]) })).toMatchObject({
      score: 4,
      positive: true,
    });
  });

  it('asq: asq_5 is not part of the score', () => {
    const r = scoreInstrument(asq, { ...fill('asq', [1, 0, 0, 0]), asq_5: 1 });
    expect(r).toMatchObject({ score: 1, maxScore: 4, positive: true });
    expect(scoreInstrument(asq, fill('asq', [0, 0, 0, 0]))).toMatchObject({ score: 0, positive: false });
  });
});

describe('AUDIT skip', () => {
  it('audit_1 = Never: only 9 and 10 asked, 2–8 count as 0', () => {
    expect(itemsToAsk(audit, {}).map((i) => i.id)).toEqual(['audit_1']);
    expect(itemsToAsk(audit, { audit_1: 0 }).map((i) => i.id)).toEqual(['audit_9', 'audit_10']);
    expect(scoreInstrument(audit, { audit_1: 0 })).toBeNull();
    expect(scoreInstrument(audit, { audit_1: 0, audit_2: 3, audit_9: 2, audit_10: 0 })).toMatchObject({ score: 2 });
    expect(itemsToAsk(audit, { audit_1: 1, audit_2: 1, audit_3: 0 })).toHaveLength(7);
  });

  it('gateway: audit_1 = Never makes AUDIT-C negative and hides 2–3', () => {
    const gwAlcohol: GatewayCheck = {
      id: 'gw_alcohol', instrumentId: 'audit', itemIds: ['audit_1', 'audit_2', 'audit_3'], positiveAt: 4, opens: 'audit', label: 'Alcohol',
    };
    const c = makeCase({ responses: { audit: { audit_1: 0, audit_2: 4, audit_3: 4 } } });
    expect(gatewayPositive(gwAlcohol, c)).toBe(false);
    const step = nextStep(makeCase({ responses: { audit: { audit_1: 0 } } }), [gwAlcohol], INSTRUMENTS);
    expect(step.kind === 'gateway' && step.items.map((i) => i.id)).toEqual(['audit_1']);
  });
});

describe('itemsToAsk', () => {
  it('pcptsd5 asks only the gate first, then nothing if no trauma', () => {
    expect(itemsToAsk(pcptsd5, {}).map((i) => i.id)).toEqual(['pcptsd5_0']);
    expect(itemsToAsk(pcptsd5, { pcptsd5_0: 0 })).toEqual([]);
    expect(itemsToAsk(pcptsd5, { pcptsd5_0: 1 })).toHaveLength(5);
  });

  it('asq_5 only appears after a yes to items 1–4', () => {
    expect(itemsToAsk(asq, {}).map((i) => i.id)).toEqual(['asq_1', 'asq_2', 'asq_3', 'asq_4']);
    expect(itemsToAsk(asq, fill('asq', [0, 0, 0, 0]))).toEqual([]);
    expect(itemsToAsk(asq, fill('asq', [0, 1, 0, 0])).map((i) => i.id)).toEqual(['asq_5']);
  });

  it('skips answered items (gateway answers carry over)', () => {
    expect(itemsToAsk(phq9, { phq9_1: 2, phq9_2: 2 })).toHaveLength(7);
  });
});

// ---- Gateways and queue ----

describe('gateways', () => {
  it('onlyIf filtering: perinatal, adult, memory 60+', () => {
    const ids = (c: MindCase) => applicableGateways(c, GATEWAYS).map((g) => g.id);
    expect(ids(makeCase())).toEqual(['gw_mood', 'gw_focus']);
    expect(ids(makeCase({ perinatal: true, age: 30 }))).toEqual(['gw_mood', 'gw_perinatal', 'gw_focus']);
    expect(ids(makeCase({ age: 15 }))).toEqual(['gw_mood']);
    expect(ids(makeCase({ age: 59 }))).not.toContain('gw_memory');
    expect(ids(makeCase({ age: 60 }))).toContain('gw_memory');
    expect(ids(makeCase({ completed: ['gw_mood'] }))).not.toContain('gw_mood');
  });

  it('positive gateway queues the full instrument (and the highs check after mood)', () => {
    let c = makeCase();
    c = answerItem(c, 'phq9', 'phq9_1', 2);
    c = answerItem(c, 'phq9', 'phq9_2', 1);
    expect(gatewayPositive(gwMood, c)).toBe(true);
    c = completeGateway(c, gwMood, INSTRUMENTS);
    expect(c.completed).toContain('gw_mood');
    expect(c.queue).toEqual(['phq9', 'clue_highs']);
    // No double queueing.
    expect(completeGateway(c, gwMood, INSTRUMENTS).queue).toEqual(['phq9', 'clue_highs']);
  });

  it('negative gateway queues nothing', () => {
    const c = completeGateway(answerItem(makeCase(), 'phq9', 'phq9_1', 1), gwMood, INSTRUMENTS);
    expect(c.queue).toEqual([]);
    expect(c.completed).toEqual(['gw_mood']);
  });

  it('answerItem is immutable and updates updatedAt', () => {
    const c = makeCase();
    const next = answerItem(c, 'phq9', 'phq9_1', 3);
    expect(c.responses).toEqual({});
    expect(next.responses.phq9.phq9_1).toBe(3);
    expect(next.updatedAt).not.toBe(c.updatedAt);
  });
});

describe('withdrawal gateway', () => {
  const gwAlcohol: GatewayCheck = {
    id: 'gw_alcohol', instrumentId: 'audit', itemIds: ['audit_1', 'audit_2', 'audit_3'], positiveAt: 4, opens: 'audit', label: 'Alcohol',
  };
  const gwWithdrawal: GatewayCheck = {
    id: 'gw_withdrawal', instrumentId: 'clue_withdrawal', itemIds: ['clue_withdrawal_1', 'clue_withdrawal_2'], positiveAt: 1, label: 'Withdrawal',
  };
  const gws = [gwAlcohol, gwWithdrawal];
  const ids = (c: MindCase) => applicableGateways(c, gws).map((g) => g.id);

  it('only applies after a positive alcohol/drugs gateway or heavy drinking context', () => {
    expect(ids(makeCase())).toEqual(['gw_alcohol']);
    const neg = makeCase({ completed: ['gw_alcohol'], responses: { audit: { audit_1: 1, audit_2: 0, audit_3: 0 } } });
    expect(ids(neg)).toEqual([]);
    const pos = makeCase({ completed: ['gw_alcohol'], responses: { audit: { audit_1: 2, audit_2: 1, audit_3: 1 } } });
    expect(ids(pos)).toEqual(['gw_withdrawal']);
    expect(ids({ ...neg, context: { heavy_alcohol: true } })).toEqual(['gw_withdrawal']);
  });
});

describe('perinatal', () => {
  it('always queues the postpartum check, even with a low EPDS', () => {
    const gw: GatewayCheck = { ...gwPerinatal, opens: 'clue_postpartum', positiveAt: 10 };
    let c = makeCase({ perinatal: true, responses: { epds: { epds_1: 0 } } });
    c = completeGateway(c, gw, INSTRUMENTS);
    expect(c.queue).toContain('clue_postpartum');
    expect(ensureSafetyQueue(makeCase({ perinatal: false }), INSTRUMENTS).queue).not.toContain('clue_postpartum');
  });
});

describe('safety queue', () => {
  it('phq9_9 >= 1 puts asq at the front of the queue', () => {
    let c = makeCase({ queue: ['phq9', 'asrs6'], completed: ['gw_mood'] });
    c = { ...c, responses: { phq9: fill('phq9', [2, 2, 1, 1, 1, 1, 1, 1, 1]) } };
    c = completeInstrument(c, 'phq9', INSTRUMENTS);
    expect(c.queue[0]).toBe('asq');
    expect(c.queue).not.toContain('phq9');
  });

  it('works even without instrument data (hard-coded signal)', () => {
    const c = completeInstrument(makeCase({ queue: ['phq9'], responses: { phq9: { phq9_9: 1 } } }), 'phq9');
    expect(c.queue[0]).toBe('asq');
  });

  it('epds_10 >= 1 also triggers asq first; existing asq moved to front', () => {
    const c = ensureSafetyQueue(
      makeCase({ queue: ['epds', 'asq'], responses: { epds: { epds_10: 1 } } }),
      INSTRUMENTS,
    );
    expect(c.queue).toEqual(['asq', 'epds']);
  });

  it('does not re-queue asq once done', () => {
    const c = ensureSafetyQueue(
      makeCase({ completed: ['asq'], responses: { phq9: { phq9_9: 2 } } }),
      INSTRUMENTS,
    );
    expect(c.queue).not.toContain('asq');
  });

  it('nextStep jumps to asq ahead of gateways when a suicide signal exists', () => {
    const c = makeCase({ responses: { phq9: { phq9_9: 1 } } });
    const step = nextStep(c, GATEWAYS, INSTRUMENTS);
    expect(step.kind).toBe('instrument');
    if (step.kind === 'instrument') expect(step.instrument.id).toBe('asq');
  });

  it('after asq yes, nextStep asks asq_5', () => {
    const c = makeCase({ queue: ['asq'], responses: { asq: fill('asq', [1, 0, 0, 0]) } });
    const step = nextStep(c, [], INSTRUMENTS);
    expect(step.kind === 'instrument' && step.items.map((i) => i.id)).toEqual(['asq_5']);
  });
});

describe('nextStep order', () => {
  it('gateways, then queue, then context, then done', () => {
    let c = makeCase({ age: 30 });
    let step = nextStep(c, GATEWAYS, INSTRUMENTS);
    expect(step.kind === 'gateway' && step.gateway.id).toBe('gw_mood');
    expect(step.kind === 'gateway' && step.items.map((i) => i.id)).toEqual(['phq9_1', 'phq9_2']);

    c = answerItem(answerItem(c, 'phq9', 'phq9_1', 2), 'phq9', 'phq9_2', 2);
    c = completeGateway(c, gwMood, INSTRUMENTS);
    step = nextStep(c, GATEWAYS, INSTRUMENTS);
    expect(step.kind === 'gateway' && step.gateway.id).toBe('gw_focus');

    c = completeGateway(answerItem(c, 'asrs6', 'asrs6_1', 0), gwAdult, INSTRUMENTS);
    step = nextStep(c, GATEWAYS, INSTRUMENTS);
    expect(step.kind === 'instrument' && step.instrument.id).toBe('phq9');
    expect(step.kind === 'instrument' && step.items).toHaveLength(7);

    c = { ...c, responses: { ...c.responses, phq9: fill('phq9', [2, 2, 1, 1, 1, 1, 1, 1, 0]) } };
    c = completeInstrument(c, 'phq9', INSTRUMENTS);
    step = nextStep(c, GATEWAYS, INSTRUMENTS);
    expect(step.kind === 'instrument' && step.instrument.id).toBe('clue_highs');

    c = completeInstrument({ ...c, responses: { ...c.responses, clue_highs: fill('clue_highs', [0, 0, 0]) } }, 'clue_highs');
    expect(nextStep(c, GATEWAYS, INSTRUMENTS).kind).toBe('context');
    expect(nextStep({ ...c, context: { over_2_weeks: true } }, GATEWAYS, INSTRUMENTS).kind).toBe('done');
  });
});

describe('allResults', () => {
  it('includes only fully answered instruments, not gateway subsets', () => {
    const c = makeCase({
      responses: { phq9: { phq9_1: 2, phq9_2: 2 }, asrs6: fill('asrs6', [1, 1, 1, 1, 0, 0]) },
    });
    expect(allResults(c, INSTRUMENTS).map((r) => r.instrumentId)).toEqual(['asrs6']);
  });
});

// ---- Ranking ----

const card = { summary: '', looksLike: [], tests: [], doctor: '' } as unknown as MindCondition['card'];
const cond = (id: string, linked: string[], ctx?: MindCondition['supportingContext']): MindCondition => ({
  id,
  name: id,
  linkedInstruments: linked,
  supportingContext: ctx,
  baseUrgency: 'routine',
  card,
});
const depression = cond('depression', ['phq9'], { over_2_weeks: true });
const bipolar = cond('bipolar', ['clue_highs', 'phq9'], { past_highs: true });
const adhd = cond('adhd', ['asrs6'], { since_childhood: true });
const CONDITIONS = [depression, bipolar, adhd];

describe('rankMindConditions', () => {
  const phqPos = { phq9: fill('phq9', [2, 2, 2, 2, 2, 1, 1, 1, 1]) };

  it('positive screen + context gives strong, with plain reasons', () => {
    const c = makeCase({ responses: phqPos, context: { over_2_weeks: true } });
    const ranked = rankMindConditions(c, allResults(c, INSTRUMENTS), [depression, adhd], INSTRUMENTS);
    expect(ranked[0].condition.id).toBe('depression');
    expect(ranked[0].band).toBe('strong');
    expect(ranked[0].fitsBecause).toEqual(['Mood questionnaire (PHQ-9): 14 — moderate', 'lasted more than 2 weeks']);
    expect(ranked[1]).toMatchObject({ band: 'less_likely', match: 0 });
  });

  it('negative linked screen lowers match', () => {
    const c = makeCase({ responses: { asrs6: fill('asrs6', [0, 0, 0, 0, 0, 0]) }, context: { since_childhood: true } });
    const ranked = rankMindConditions(c, allResults(c, INSTRUMENTS), [adhd], INSTRUMENTS);
    expect(ranked[0].match).toBe(0);
    expect(ranked[0].band).toBe('less_likely');
  });

  it('bipolar ranks above depression when the highs check is positive', () => {
    const c = makeCase({
      responses: { ...phqPos, clue_highs: fill('clue_highs', [1, 1, 0]) },
      context: { over_2_weeks: true },
    });
    const ranked = rankMindConditions(c, allResults(c, INSTRUMENTS), CONDITIONS, INSTRUMENTS);
    const ids = ranked.map((r) => r.condition.id);
    expect(ids.indexOf('bipolar')).toBeLessThan(ids.indexOf('depression'));
    expect(ranked.find((r) => r.condition.id === 'depression')!.fitsBecause.some((f) => /bipolar/i.test(f))).toBe(true);
  });

  it('match is capped at 0.9', () => {
    const c = makeCase({
      responses: { ...phqPos, clue_highs: fill('clue_highs', [1, 1, 1]) },
      context: { past_highs: true, over_2_weeks: true },
    });
    for (const r of rankMindConditions(c, allResults(c, INSTRUMENTS), CONDITIONS, INSTRUMENTS)) {
      expect(r.match).toBeLessThanOrEqual(0.9);
    }
  });
});

// ---- Smoke test against the real data ----

describe('real data smoke test', () => {
  it('every instrument has bands covering 0..maxScore and positiveAt within range', () => {
    for (const i of REAL_INSTRUMENTS) {
      const zero = Object.fromEntries(i.items.map((it) => [it.id, 0]));
      const r = scoreInstrument(i, zero);
      expect(r, i.id).not.toBeNull();
      for (let s = 0; s <= r!.maxScore; s++) {
        expect(i.bands.some((b) => s >= b.min && s <= b.max), `${i.id} score ${s}`).toBe(true);
      }
      expect(i.positiveAt, i.id).toBeLessThanOrEqual(r!.maxScore);
    }
  });

  it('every gateway points at real instruments and items', () => {
    for (const g of REAL_GATEWAYS) {
      const i = REAL_INSTRUMENTS.find((x) => x.id === g.instrumentId);
      expect(i, g.id).toBeDefined();
      expect(g.itemIds.length, g.id).toBeGreaterThan(0);
      for (const id of g.itemIds) expect(i!.items.some((it) => it.id === id), `${g.id}/${id}`).toBe(true);
      if (g.opens) expect(REAL_INSTRUMENTS.some((x) => x.id === g.opens), g.id).toBe(true);
    }
  });

  it('every condition links only to real instruments', () => {
    for (const c of MIND_CONDITIONS) {
      for (const id of c.linkedInstruments) expect(REAL_INSTRUMENTS.some((x) => x.id === id), `${c.id}/${id}`).toBe(true);
    }
  });

  it('a full walk answering everything "0" reaches done without asking ASQ', () => {
    let c = makeCase({ age: 65, perinatal: true });
    for (let guard = 0; guard < 200; guard++) {
      const step = nextStep(c, REAL_GATEWAYS, REAL_INSTRUMENTS);
      if (step.kind === 'done') break;
      if (step.kind === 'context') {
        c = { ...c, context: { over_2_weeks: false } };
      } else if (step.kind === 'gateway') {
        for (const it of step.items) c = answerItem(c, step.gateway.instrumentId, it.id, 0);
        c = completeGateway(c, step.gateway, REAL_INSTRUMENTS);
      } else {
        expect(step.instrument.id).not.toBe('asq');
        for (const it of step.items) c = answerItem(c, step.instrument.id, it.id, 0);
        if (itemsToAsk(step.instrument, c.responses[step.instrument.id]).length === 0) {
          c = completeInstrument(c, step.instrument.id, REAL_INSTRUMENTS);
        }
      }
    }
    expect(nextStep(c, REAL_GATEWAYS, REAL_INSTRUMENTS).kind).toBe('done');
    expect(c.completed).toContain('gw_memory');
    expect(c.completed).not.toContain('gw_withdrawal');
    expect(c.completed).toContain('clue_postpartum');
    expect(rankMindConditions(c, allResults(c, REAL_INSTRUMENTS), MIND_CONDITIONS, REAL_INSTRUMENTS)).toHaveLength(
      MIND_CONDITIONS.length,
    );
  });

  it('real data: phq9_9 yes sends the walk to ASQ next', () => {
    const c = makeCase({ responses: { phq9: { phq9_1: 2, phq9_2: 2, phq9_9: 1 } } });
    const step = nextStep(c, REAL_GATEWAYS, REAL_INSTRUMENTS);
    expect(step.kind === 'instrument' && step.instrument.id).toBe('asq');
  });
});

// ---- Click-through fixes ----

const realInst = (id: string) => REAL_INSTRUMENTS.find((i) => i.id === id)!;
const realGw = (id: string) => REAL_GATEWAYS.find((g) => g.id === id)!;

describe('askIf follow-ups', () => {
  const highsReal = realInst('clue_highs');
  const drugsReal = realInst('clue_drugs');

  it('follow-ups wait for their controller and are skipped after a No', () => {
    expect(itemsToAsk(highsReal, {}).map((i) => i.id)).toEqual(['clue_highs_1']);
    expect(itemsToAsk(highsReal, { clue_highs_1: 0 })).toEqual([]);
    expect(itemsToAsk(highsReal, { clue_highs_1: 1 }).map((i) => i.id)).toEqual(['clue_highs_2', 'clue_highs_3']);
    expect(itemsToAsk(drugsReal, { clue_drugs_1: 0 })).toEqual([]);
  });

  it('unasked follow-ups score 0; unanswered controller means no score yet', () => {
    expect(scoreInstrument(highsReal, {})).toBeNull();
    expect(scoreInstrument(highsReal, { clue_highs_1: 0 })).toMatchObject({ score: 0, positive: false });
    // Stale follow-up answers don't count once the controller is No.
    expect(scoreInstrument(highsReal, { clue_highs_1: 0, clue_highs_2: 1, clue_highs_3: 1 })).toMatchObject({ score: 0 });
    expect(scoreInstrument(highsReal, { clue_highs_1: 1, clue_highs_2: 1 })).toBeNull();
    expect(scoreInstrument(drugsReal, { clue_drugs_1: 0 })).toMatchObject({ score: 0 });
  });
});

describe('gateway completes as soon as nothing is left to ask', () => {
  it('alcohol: Never after "How often do you have a drink" finishes the gateway in one tap', () => {
    const g = realGw('gw_alcohol');
    const before = makeCase();
    expect(gatewayAnswered(g, before, REAL_INSTRUMENTS)).toBe(false);
    const c = answerItem(before, 'audit', 'audit_1', 0);
    expect(gatewayItems(g, c, REAL_INSTRUMENTS).map((i) => i.id)).toEqual(['audit_1']);
    expect(gatewayAnswered(g, c, REAL_INSTRUMENTS)).toBe(true);
    expect(gatewayAnswered(g, answerItem(before, 'audit', 'audit_1', 2), REAL_INSTRUMENTS)).toBe(false);
  });

  it('trauma: No to pcptsd5_0 finishes; highs: No to the first question finishes', () => {
    expect(gatewayAnswered(realGw('gw_trauma'), answerItem(makeCase(), 'pcptsd5', 'pcptsd5_0', 0), REAL_INSTRUMENTS)).toBe(true);
    const highsGw = realGw('gw_highs');
    expect(gatewayItems(highsGw, makeCase(), REAL_INSTRUMENTS).map((i) => i.id)).toEqual(['clue_highs_1']);
    expect(gatewayAnswered(highsGw, answerItem(makeCase(), 'clue_highs', 'clue_highs_1', 0), REAL_INSTRUMENTS)).toBe(true);
    const yes = answerItem(makeCase(), 'clue_highs', 'clue_highs_1', 1);
    expect(gatewayAnswered(highsGw, yes, REAL_INSTRUMENTS)).toBe(false);
    expect(gatewayItems(highsGw, yes, REAL_INSTRUMENTS)).toHaveLength(3);
  });

  it('asq with all No has nothing left (no asq_5)', () => {
    expect(itemsToAsk(realInst('asq'), fill('asq', [0, 0, 0, 0]))).toEqual([]);
  });
});

describe('queue stays accurate', () => {
  it('highs answered in the quick check drops clue_highs from the queue', () => {
    let c = makeCase({ age: 28 });
    c = answerItem(answerItem(c, 'phq9', 'phq9_1', 2), 'phq9', 'phq9_2', 2);
    c = completeGateway(c, realGw('gw_mood'), REAL_INSTRUMENTS);
    expect(c.queue).toEqual(['phq9', 'clue_highs']);
    expect(instrumentsLeft(c, REAL_INSTRUMENTS, 'phq9')).toBe(1);
    c = completeGateway(answerItem(c, 'clue_highs', 'clue_highs_1', 0), realGw('gw_highs'), REAL_INSTRUMENTS);
    expect(c.queue).toEqual(['phq9']);
    expect(c.completed).toContain('clue_highs');
    expect(instrumentsLeft(c, REAL_INSTRUMENTS, 'phq9')).toBe(0);
  });

  it('gateway order puts the most important areas first', () => {
    expect(REAL_GATEWAYS.map((g) => g.id).slice(0, 4)).toEqual(['gw_mood', 'gw_worry', 'gw_highs', 'gw_psychosis']);
    expect(REAL_GATEWAYS[REAL_GATEWAYS.length - 1].id).toBe('gw_memory');
  });
});

describe('ranking eligibility and bipolar cap', () => {
  const phqPos = { phq9: fill('phq9', [2, 2, 2, 2, 2, 1, 1, 1, 1]) };
  const rank = (c: MindCase) => rankMindConditions(c, allResults(c, REAL_INSTRUMENTS), MIND_CONDITIONS, REAL_INSTRUMENTS);
  const ids = (c: MindCase) => rank(c).map((r) => r.condition.id);

  it('memory_mood_older only from 60; perinatal_depression only when perinatal', () => {
    expect(ids(makeCase({ age: 28, responses: phqPos }))).not.toContain('memory_mood_older');
    expect(ids(makeCase({ responses: phqPos }))).not.toContain('memory_mood_older');
    expect(ids(makeCase({ age: 60, responses: phqPos }))).toContain('memory_mood_older');
    expect(ids(makeCase({ context: { age_over_60: true } }))).toContain('memory_mood_older');
    expect(ids(makeCase({ age: 30 }))).not.toContain('perinatal_depression');
    expect(ids(makeCase({ age: 30, perinatal: false }))).not.toContain('perinatal_depression');
    expect(ids(makeCase({ age: 30, perinatal: true }))).toContain('perinatal_depression');
    expect(ids(makeCase({ age: 30 }))).toContain('adult_adhd');
  });

  it('bipolar is at most less likely when no highs were reported', () => {
    const c = makeCase({ age: 28, responses: { ...phqPos, clue_highs: { clue_highs_1: 0 } }, context: { over_2_weeks: true } });
    const bp = rank(c).find((r) => r.condition.id === 'bipolar')!;
    expect(bp.band).toBe('less_likely');
    expect(bp.match).toBeLessThan(0.3);
    const withPast = rank({ ...c, context: { ...c.context, past_highs: true } }).find((r) => r.condition.id === 'bipolar')!;
    expect(withPast.band).not.toBe('less_likely');
  });
});

describe('results text', () => {
  it('yes/no screens show Positive/Negative, scales keep numbers', () => {
    const asqR = scoreInstrument(realInst('asq'), { ...fill('asq', [1, 0, 0, 0]), asq_5: 0 })!;
    expect(resultText(asqR, realInst('asq'))).toBe('Positive screen');
    const highsR = scoreInstrument(realInst('clue_highs'), { clue_highs_1: 0 })!;
    expect(resultText(highsR, realInst('clue_highs'))).toBe('Negative screen · Not suggestive');
    const phqR = scoreInstrument(realInst('phq9'), fill('phq9', [2, 2, 2, 2, 2, 1, 1, 1, 1]))!;
    expect(resultText(phqR, realInst('phq9'))).toBe('14/27 · Moderate');
  });
});

describe('knownContext', () => {
  it('fills background answers already given in the questionnaires', () => {
    const c = makeCase({
      age: 28,
      perinatal: false,
      responses: {
        audit: { audit_1: 0 },
        clue_drugs: { clue_drugs_1: 0 },
        clue_highs: { clue_highs_1: 1 },
        clue_body: { clue_body_1: 1 },
      },
    });
    expect(knownContext(c)).toEqual({
      age_over_60: false,
      heavy_alcohol: false,
      drug_use: false,
      cannabis_use: false,
      past_highs: true,
      body_symptoms_checked_normal: true,
      recent_childbirth: false,
      pregnant: false,
    });
  });

  it('heavy_alcohol from AUDIT-C >= 4 or AUDIT >= 8; unknown until AUDIT-C answered', () => {
    expect(knownContext(makeCase({ responses: { audit: { audit_1: 2 } } })).heavy_alcohol).toBeUndefined();
    expect(knownContext(makeCase({ responses: { audit: { audit_1: 2, audit_2: 1, audit_3: 1 } } })).heavy_alcohol).toBe(true);
    expect(knownContext(makeCase({ responses: { audit: { audit_1: 1, audit_2: 0, audit_3: 1 } } })).heavy_alcohol).toBe(false);
  });

  it('drug Yes keeps the cannabis question; perinatal answered hides both pregnancy questions', () => {
    const c = makeCase({ perinatal: true, responses: { clue_drugs: { clue_drugs_1: 1 } } });
    expect(knownContext(c)).toEqual({ drug_use: true });
    const covered = contextKeysCovered(c);
    expect(covered.has('cannabis_use')).toBe(false);
    expect(covered.has('drug_use')).toBe(true);
    expect(covered.has('pregnant')).toBe(true);
    expect(covered.has('recent_childbirth')).toBe(true);
    expect(contextKeysCovered(makeCase()).size).toBe(0);
  });
});
