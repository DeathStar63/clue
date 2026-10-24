import type { Condition } from '../../types';
import { SKIN_CONDITIONS } from './skin';
import { HAIR_NAIL_CONDITIONS } from './hairNails';

export const CONDITIONS: Condition[] = [...SKIN_CONDITIONS, ...HAIR_NAIL_CONDITIONS];

export function conditionById(id: string): Condition | undefined {
  return CONDITIONS.find((c) => c.id === id);
}
