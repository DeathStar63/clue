import { describe, expect, it } from 'vitest';
import { RED_FLAG_QUESTIONS, RED_FLAG_RULES } from '../data/redflags';
import { FEATURES } from '../data/features';
import type { Answers, Band, Condition, RankedCondition, UrgencyLevel } from '../types';
import { evaluateTriage, hasEmergency, maxUrgency, URGENCY_ORDER } from './triage';

function allYes(features: readonly string[]): Answers {
  return Object.fromEntries(features.map((f) => [f, 'yes'])) as Answers;
}

function ranked(baseUrgency: UrgencyLevel, band: Band): RankedCondition {
  const condition = { id: `c_${baseUrgency}_${band}`, name: 'Test', baseUrgency } as unknown as Condition;
  return { condition, score: 1, match: 1, band, fitsBecause: [], againstBecause: [], confirmWith: [] };
}

const emergencyRules = RED_FLAG_RULES.filter((r) => r.level === 'emergency');

describe('red-flag data', () => {
  it('has one yes/no core question per alarm feature', () => {
    const alarm = Object.entries(FEATURES).filter(([, v]) => v.group === 'alarm').map(([k]) => k);
    const asked = RED_FLAG_QUESTIONS.map((q) => q.feature);
    expect(new Set(asked)).toEqual(new Set(alarm));
    for (const q of RED_FLAG_QUESTIONS) {
      expect(q.id.startsWith('rf_')).toBe(true);
      expect(q.kind).toBe('yesno');
      expect(q.phase).toBe('core');
    }
  });

  it('rules have unique rule_ ids and known features', () => {
    const ids = RED_FLAG_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of RED_FLAG_RULES) {
      expect(r.id.startsWith('rule_')).toBe(true);
      expect(r.allOf.length).toBeGreaterThan(0);
      for (const f of r.allOf) expect(FEATURES).toHaveProperty(f);
    }
  });
});

describe('evaluateTriage', () => {
  it('returns self_care when nothing is answered', () => {
    expect(evaluateTriage({})).toEqual({ level: 'self_care', triggered: [] });
  });

  it.each(emergencyRules.map((r) => [r.id, r] as const))('%s fires as emergency', (_id, rule) => {
    const result = evaluateTriage(allYes(rule.allOf));
    expect(result.level).toBe('emergency');
    expect(result.triggered.map((r) => r.id)).toContain(rule.id);
    expect(hasEmergency(allYes(rule.allOf))).toBe(true);
  });

  it.each(RED_FLAG_RULES.map((r) => [r.id, r] as const))('%s fires on yes only', (_id, rule) => {
    expect(evaluateTriage(allYes(rule.allOf)).triggered.map((r) => r.id)).toContain(rule.id);
    for (const other of ['no', 'unsure'] as const) {
      const answers = Object.fromEntries(rule.allOf.map((f) => [f, other])) as Answers;
      expect(evaluateTriage(answers).triggered.map((r) => r.id)).not.toContain(rule.id);
    }
  });

  it('a partial allOf does not fire', () => {
    const multi = RED_FLAG_RULES.filter((r) => r.allOf.length > 1);
    expect(multi.length).toBeGreaterThan(0);
    for (const rule of multi) {
      const answers = allYes(rule.allOf.slice(1));
      answers[rule.allOf[0]] = 'unsure';
      expect(evaluateTriage(answers).triggered.map((r) => r.id)).not.toContain(rule.id);
    }
  });

  it('newborn alone or fever alone is not an emergency', () => {
    expect(hasEmergency({ newborn_or_infant: 'yes' })).toBe(false);
    expect(hasEmergency({ fever_now: 'yes' })).toBe(false);
    expect(hasEmergency({ newborn_or_infant: 'yes', fever_now: 'yes' })).toBe(true);
  });

  it('sorts triggered rules emergency first', () => {
    const result = evaluateTriage({ eye_pain_vision: 'yes', sores_mouth_eyes_genitals: 'yes', trouble_breathing: 'yes' });
    expect(result.level).toBe('emergency');
    expect(result.triggered[0].level).toBe('emergency');
    const levels = result.triggered.map((r) => URGENCY_ORDER.indexOf(r.level));
    expect([...levels].sort((a, b) => b - a)).toEqual(levels);
  });

  it('a today rule gives today', () => {
    expect(evaluateTriage({ eye_pain_vision: 'yes' }).level).toBe('today');
  });

  it('a strong condition with baseUrgency soon lifts the level to soon', () => {
    expect(evaluateTriage({}, [ranked('soon', 'strong')]).level).toBe('soon');
    expect(evaluateTriage({}, [ranked('routine', 'possible'), ranked('soon', 'strong')]).level).toBe('soon');
  });

  it('less_likely conditions do not lift the level', () => {
    expect(evaluateTriage({}, [ranked('today', 'less_likely')]).level).toBe('self_care');
  });

  it('emergency rules override conditions', () => {
    const result = evaluateTriage({ trouble_breathing: 'yes' }, [ranked('routine', 'strong'), ranked('soon', 'possible')]);
    expect(result.level).toBe('emergency');
  });

  it('a soon condition does not lower a today rule', () => {
    expect(evaluateTriage({ eye_pain_vision: 'yes' }, [ranked('soon', 'strong')]).level).toBe('today');
  });
});

describe('maxUrgency', () => {
  it('orders levels', () => {
    expect(URGENCY_ORDER).toEqual(['self_care', 'routine', 'soon', 'today', 'emergency']);
    expect(maxUrgency()).toBe('self_care');
    expect(maxUrgency('routine', 'soon', 'self_care')).toBe('soon');
    expect(maxUrgency('today', 'emergency', 'soon')).toBe('emergency');
  });
});
