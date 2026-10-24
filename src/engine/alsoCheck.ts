// "Could you also check…" prompts for other body areas that help confirm or rule out.
import type { AlsoCheckPrompt, BodyArea, CaseState, RankedCondition } from '../types';

/**
 * From the top 4 non-less_likely conditions, collect alsoCheck areas not already
 * selected or photographed. Duplicates merge by area (names combined, first reason kept).
 * Ordered by summed match of the conditions that want the area (so shared areas
 * naturally rise), ties broken by number of conditions.
 */
export function alsoCheckPrompts(
  state: CaseState,
  ranked: RankedCondition[],
  max = 4,
): AlsoCheckPrompt[] {
  const seen = new Set<BodyArea>([...state.areas, ...state.photos.map((p) => p.area)]);
  const merged = new Map<BodyArea, AlsoCheckPrompt & { sum: number; order: number }>();

  const top = ranked.filter((r) => r.band !== 'less_likely').slice(0, 4);
  for (const r of top) {
    for (const ac of r.condition.alsoCheck) {
      if (seen.has(ac.area)) continue;
      const existing = merged.get(ac.area);
      if (existing) {
        if (!existing.forConditions.includes(r.condition.name)) {
          existing.forConditions.push(r.condition.name);
          existing.sum += r.match;
        }
      } else {
        merged.set(ac.area, {
          area: ac.area,
          reason: ac.reason,
          forConditions: [r.condition.name],
          sum: r.match,
          order: merged.size,
        });
      }
    }
  }

  return [...merged.values()]
    .sort(
      (a, b) =>
        b.sum - a.sum || b.forConditions.length - a.forConditions.length || a.order - b.order,
    )
    .slice(0, max)
    .map(({ area, reason, forConditions }) => ({ area, reason, forConditions }));
}
