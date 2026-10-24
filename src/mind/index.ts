// Mind public API: pure engine functions plus wrappers bound to the real data.
import {
  allResults,
  completeGateway,
  completeInstrument,
  ensureSafetyQueue,
  gatewayAnswered,
  instrumentsLeft,
  nextStep,
  rankMindConditions,
} from './engine';
import { evaluateMindRisk, isUrgent } from './risk';
import { INSTRUMENTS, GATEWAYS } from './instruments';
import { MIND_CONDITIONS } from './conditions';
import type { GatewayCheck, MindCase } from './types';

export {
  allResults,
  answerItem,
  applicableGateways,
  completeGateway,
  completeInstrument,
  conditionEligible,
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
  showsAsScreen,
} from './engine';
export type { MindStep } from './engine';
export { evaluateMindRisk, hasSuicideSignal, isUrgent } from './risk';

export const mindNextStep = (state: MindCase) => nextStep(state, GATEWAYS, INSTRUMENTS);
export const mindResults = (state: MindCase) => allResults(state, INSTRUMENTS);
export const mindRank = (state: MindCase) =>
  rankMindConditions(state, allResults(state, INSTRUMENTS), MIND_CONDITIONS, INSTRUMENTS);
export const mindRisk = (state: MindCase) => evaluateMindRisk(state, INSTRUMENTS);
export const mindIsUrgent = (state: MindCase) => isUrgent(state, INSTRUMENTS);
export const mindCompleteGateway = (state: MindCase, g: GatewayCheck) => completeGateway(state, g, INSTRUMENTS);
export const mindCompleteInstrument = (state: MindCase, instrumentId: string) =>
  completeInstrument(state, instrumentId, INSTRUMENTS);
export const mindGatewayAnswered = (state: MindCase, g: GatewayCheck) => gatewayAnswered(g, state, INSTRUMENTS);
export const mindInstrumentsLeft = (state: MindCase, exceptId?: string) => instrumentsLeft(state, INSTRUMENTS, exceptId);
export const mindEnsureSafety = (state: MindCase) => ensureSafetyQueue(state, INSTRUMENTS);
