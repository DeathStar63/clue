// Keeps only ids Clue knows about. The model's output is never trusted as-is.

import { FEATURES } from '../../src/data/features';
import { BODY_AREAS } from '../../src/data/bodyAreas';

export const MAX_FEATURES = 25;
export const MAX_AREAS = 10;

function pick(list: unknown, known: object, max: number): string[] {
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  for (const item of list) {
    if (typeof item !== 'string') continue;
    if (!Object.prototype.hasOwnProperty.call(known, item)) continue;
    if (out.includes(item)) continue;
    out.push(item);
    if (out.length >= max) break;
  }
  return out;
}

export function cleanResult(raw: unknown): { features: string[]; areas: string[] } {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    features: pick(obj.features, FEATURES, MAX_FEATURES),
    areas: pick(obj.areas, BODY_AREAS, MAX_AREAS),
  };
}
