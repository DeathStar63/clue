import { describe, expect, it } from 'vitest';
import { evaluateMindRisk, hasSuicideSignal, isUrgent } from './risk';
import type { Instrument, MindCase } from './types';

const yesNo = [
  { label: 'No', value: 0 },
  { label: 'Yes', value: 1 },
];

function inst(id: string, n: number, riskItems: Instrument['riskItems'] = []): Instrument {
  return {
    id,
    name: id,
    shortName: id,
    topic: 'test',
    origin: 'official',
    stem: '',
    options: yesNo,
    items: Array.from({ length: n }, (_, i) => ({ id: `${id}_${i + 1}`, text: `q${i + 1}` })),
    scoring: 'sum',
    bands: [{ min: 0, max: 99, label: 'Any', urgency: 'routine' }],
    positiveAt: 1,
    riskItems,
    citation: '',
    licenceNote: '',
  };
}

const phq9 = inst('phq9', 9, [{ itemId: 'phq9_9', atLeast: 1, kind: 'suicide', level: 'elevated' }]);
const asq = inst('asq', 5, [{ itemId: 'asq_5', atLeast: 1, kind: 'suicide', level: 'urgent' }]);
const scoff = inst('scoff', 5, [{ itemId: 'scoff_2', atLeast: 1, kind: 'eating', level: 'elevated' }]);
const highs = inst('clue_highs', 3);
const psychosis = inst('clue_psychosis', 3, [{ itemId: 'clue_psychosis_1', atLeast: 1, kind: 'psychosis', level: 'elevated' }]);
const INSTRUMENTS = [phq9, asq, scoff, highs, psychosis];

function makeCase(responses: MindCase['responses'], over: Partial<MindCase> = {}): MindCase {
  return {
    id: 'c',
    createdAt: '',
    updatedAt: '',
    responses,
    context: {},
    queue: [],
    completed: [],
    ...over,
  };
}

describe('evaluateMindRisk', () => {
  it('none when nothing fires', () => {
    expect(evaluateMindRisk(makeCase({ phq9: { phq9_9: 0 } }), INSTRUMENTS)).toEqual({ level: 'none', flags: [] });
  });

  it('fires item rules at threshold with plain reasons', () => {
    const r = evaluateMindRisk(makeCase({ scoff: { scoff_2: 1 } }), INSTRUMENTS);
    expect(r.level).toBe('elevated');
    expect(r.flags).toEqual([{ kind: 'eating', level: 'elevated', reason: expect.any(String) }]);
    expect(r.flags[0].reason).toMatch(/^You said/);
  });

  it('phq9_9 >= 1 is elevated suicide, even with no instrument data', () => {
    for (const v of [1, 2, 3]) {
      const r = evaluateMindRisk(makeCase({ phq9: { phq9_9: v } }), []);
      expect(r.level).toBe('elevated');
      expect(r.flags).toHaveLength(1);
      expect(r.flags[0]).toMatchObject({ kind: 'suicide', level: 'elevated' });
    }
  });

  it('asq_5 yes is urgent and dedupes with phq9_9 into one suicide flag', () => {
    const c = makeCase({ phq9: { phq9_9: 2 }, asq: { asq_1: 1, asq_2: 0, asq_3: 0, asq_4: 0, asq_5: 1 } });
    const r = evaluateMindRisk(c, INSTRUMENTS);
    expect(r.level).toBe('urgent');
    expect(r.flags.filter((f) => f.kind === 'suicide')).toEqual([
      { kind: 'suicide', level: 'urgent', reason: "You said you are having thoughts of killing yourself right now." },
    ]);
    expect(isUrgent(c, INSTRUMENTS)).toBe(true);
    expect(isUrgent(c, [])).toBe(true);
  });

  it('asq yes to 1–4 without item 5 is elevated, not urgent', () => {
    const c = makeCase({ asq: { asq_1: 0, asq_2: 1, asq_3: 0, asq_4: 0, asq_5: 0 } });
    expect(evaluateMindRisk(c, INSTRUMENTS).level).toBe('elevated');
    expect(hasSuicideSignal(c, INSTRUMENTS)).toBe(true);
  });

  it('mania combo: highs items 2 and 3 both yes → urgent', () => {
    expect(evaluateMindRisk(makeCase({ clue_highs: { clue_highs_1: 1, clue_highs_2: 1, clue_highs_3: 1 } }), INSTRUMENTS)).toMatchObject({
      level: 'urgent',
      flags: [{ kind: 'mania', level: 'urgent' }],
    });
    expect(evaluateMindRisk(makeCase({ clue_highs: { clue_highs_1: 1, clue_highs_2: 1, clue_highs_3: 0 } }), INSTRUMENTS).level).toBe(
      'none',
    );
  });

  it('psychosis yes while perinatal → postpartum urgent; otherwise only the item rule', () => {
    const responses = { clue_psychosis: { clue_psychosis_2: 1 } };
    const peri = evaluateMindRisk(makeCase(responses, { perinatal: true }), INSTRUMENTS);
    expect(peri.level).toBe('urgent');
    expect(peri.flags[0]).toMatchObject({ kind: 'postpartum', level: 'urgent' });
    expect(evaluateMindRisk(makeCase(responses), INSTRUMENTS).level).toBe('none');
  });

  it('urgent flags come first', () => {
    const c = makeCase({ scoff: { scoff_2: 1 }, clue_highs: { clue_highs_1: 1, clue_highs_2: 1, clue_highs_3: 1 } });
    const r = evaluateMindRisk(c, INSTRUMENTS);
    expect(r.flags.map((f) => f.kind)).toEqual(['mania', 'eating']);
  });

  it('reasons never use diagnosis words', () => {
    const c = makeCase(
      {
        phq9: { phq9_9: 3 },
        asq: { asq_5: 1 },
        scoff: { scoff_2: 1 },
        clue_highs: { clue_highs_1: 1, clue_highs_2: 1, clue_highs_3: 1 },
        clue_psychosis: { clue_psychosis_1: 1 },
      },
      { perinatal: true },
    );
    for (const f of evaluateMindRisk(c, INSTRUMENTS).flags) {
      expect(f.reason).not.toMatch(/depress|bipolar|mania|psychosis|psychotic|anorexia|bulimia|disorder/i);
    }
  });
});

describe('stale follow-up answers', () => {
  it('ignores highs follow-ups once the lead question is No', () => {
    const c = makeCase({ clue_highs: { clue_highs_1: 0, clue_highs_2: 1, clue_highs_3: 1 } });
    expect(evaluateMindRisk(c, INSTRUMENTS).flags.some((f) => f.kind === 'mania')).toBe(false);
  });
});
