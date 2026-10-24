// Triage: fixed red-flag rules always win over condition matching.
import { RED_FLAG_RULES } from '../data/redflags';
import type { Answers, RankedCondition, RedFlagRule, TriageResult, UrgencyLevel } from '../types';

/** Lowest to highest. */
export const URGENCY_ORDER: UrgencyLevel[] = ['self_care', 'routine', 'soon', 'today', 'emergency'];

const rank = (level: UrgencyLevel) => URGENCY_ORDER.indexOf(level);

export function maxUrgency(...levels: UrgencyLevel[]): UrgencyLevel {
  return levels.reduce<UrgencyLevel>((best, l) => (rank(l) > rank(best) ? l : best), 'self_care');
}

function fires(rule: RedFlagRule, answers: Answers): boolean {
  return rule.allOf.length > 0 && rule.allOf.every((f) => answers[f] === 'yes');
}

export function evaluateTriage(answers: Answers, ranked: RankedCondition[] = []): TriageResult {
  const triggered = RED_FLAG_RULES.filter((r) => fires(r, answers))
    // Stable sort: emergency first, original (data) order kept within a level.
    .sort((a, b) => rank(b.level) - rank(a.level));

  const conditionLevels = ranked
    .filter((r) => r.band === 'strong' || r.band === 'possible')
    .map((r) => r.condition.baseUrgency);

  return {
    level: maxUrgency(...triggered.map((r) => r.level), ...conditionLevels),
    triggered,
  };
}

export function hasEmergency(answers: Answers): boolean {
  return RED_FLAG_RULES.some((r) => r.level === 'emergency' && fires(r, answers));
}
