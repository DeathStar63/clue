// Shared contract for the Mind section. Every Mind lane codes against these names.
import type { ConditionCard, UrgencyLevel } from '../types';

export interface ResponseOption {
  label: string;
  value: number;
}

export interface InstrumentItem {
  id: string;
  text: string;
  /** Overrides the instrument's default options for this item. */
  options?: ResponseOption[];
  /** Only ask this item when an earlier item in the same instrument was answered >= atLeast. Unasked → treated as 0. */
  askIf?: { itemId: string; atLeast: number };
}

export interface ScoreBand {
  min: number; // inclusive
  max: number; // inclusive
  /** Plain words, e.g. "Mild". Never a diagnosis. */
  label: string;
  /** How much this score should push toward seeing someone. */
  urgency: UrgencyLevel;
}

/** Item-level rule that fires the risk flow regardless of total score. */
export interface RiskItemRule {
  itemId: string;
  /** Fires when the response value is >= this. */
  atLeast: number;
  kind: RiskKind;
  level: RiskLevel;
}

export interface Instrument {
  id: string;
  /** Full official name, e.g. "Patient Health Questionnaire-9". */
  name: string;
  /** Short name shown in UI, e.g. "PHQ-9". */
  shortName: string;
  /** What it checks, plain words: "low mood". */
  topic: string;
  /** 'official' = validated tool, used word for word. 'clue' = Clue's own check questions, not a validated tool. */
  origin: 'official' | 'clue';
  /** Lead-in shown above items, e.g. "Over the last 2 weeks, how often have you been bothered by…" */
  stem: string;
  options: ResponseOption[];
  items: InstrumentItem[];
  /** How to total. 'sum' = add all values; 'count' = number of items with value > 0. */
  scoring: 'sum' | 'count';
  bands: ScoreBand[];
  /** Score at or above which this counts as a positive screen. */
  positiveAt: number;
  riskItems?: RiskItemRule[];
  citation: string;
  licenceNote: string;
}

/** A short gateway check that opens a full instrument when positive. */
export interface GatewayCheck {
  id: string;
  /** Instrument whose items are asked here (often a subset, e.g. PHQ-2 = first 2 items of PHQ-9). */
  instrumentId: string;
  itemIds: string[];
  /** Sum of these items at or above which we queue `opens`. */
  positiveAt: number;
  /** Full instrument to ask next when positive. */
  opens?: string;
  /** Plain label, e.g. "Mood". */
  label: string;
  /** Only ask when this is true for the case (e.g. perinatal). */
  onlyIf?: 'perinatal' | 'adult';
}

export type RiskKind = 'suicide' | 'psychosis' | 'mania' | 'postpartum' | 'eating' | 'withdrawal' | 'confusion';
export type RiskLevel = 'urgent' | 'elevated';

export interface RiskFlag {
  kind: RiskKind;
  level: RiskLevel;
  /** Plain-words reason, no diagnosis. */
  reason: string;
}

export interface RiskResult {
  level: 'none' | RiskLevel;
  flags: RiskFlag[];
}

export interface InstrumentResult {
  instrumentId: string;
  score: number;
  maxScore: number;
  band: ScoreBand;
  positive: boolean;
}

export interface MindCondition {
  id: string;
  name: string;
  aka?: string[];
  /** Instruments whose positive result points toward this. */
  linkedInstruments: string[];
  /** Context answers that strengthen it (context key → value that supports). */
  supportingContext?: Partial<Record<ContextKey, boolean>>;
  baseUrgency: UrgencyLevel;
  /** Same shape as skin cards; `tests` = physical checks a doctor may do; `doctor` = who to see. */
  card: ConditionCard;
  /** Extra Mind-only notes. */
  whenUrgent?: string[];
  /** Free / low-cost places to go, plain words. */
  freeHelp?: string[];
}

export type ContextKey =
  | 'over_2_weeks'
  | 'over_6_months'
  | 'affects_daily_life'
  | 'since_childhood'
  | 'after_trauma'
  | 'recent_childbirth'
  | 'pregnant'
  | 'heavy_alcohol'
  | 'drug_use'
  | 'cannabis_use'
  | 'medical_illness'
  | 'new_medicine'
  | 'family_history'
  | 'past_episode'
  | 'past_highs'
  | 'body_symptoms_checked_normal'
  | 'age_over_60'
  | 'memory_worse';

export interface ContextQuestion {
  key: ContextKey;
  text: string;
  why: string;
  onlyIf?: 'perinatal' | 'adult';
}

export interface MindCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  age?: number;
  sex?: 'female' | 'male' | 'other';
  /** Pregnant or gave birth in the last year. */
  perinatal?: boolean;
  /** instrumentId → itemId → value */
  responses: Record<string, Record<string, number>>;
  context: Partial<Record<ContextKey, boolean>>;
  /** Full instruments still to ask, in order. */
  queue: string[];
  /** Gateway checks and instruments finished. */
  completed: string[];
}

export interface RankedMindCondition {
  condition: MindCondition;
  /** 0..1 */
  match: number;
  band: 'strong' | 'possible' | 'less_likely';
  /** e.g. "PHQ-9 score 14 (moderate)", "lasted more than 2 weeks". */
  fitsBecause: string[];
}

export interface Helpline {
  name: string;
  number: string;
  /** tel: link target, digits only with optional leading + */
  tel: string;
  hours: string;
  note?: string;
}
