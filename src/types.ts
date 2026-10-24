// Shared contract for Clue. Every lane codes against these names.
import type { FeatureId } from './data/features';
import type { BodyArea } from './data/bodyAreas';

export type { FeatureId, BodyArea };

/** What the user told us about one feature. Missing = not asked yet. */
export type Answer = 'yes' | 'no' | 'unsure';
export type Answers = Partial<Record<FeatureId, Answer>>;

/** Lowest to highest. */
export type UrgencyLevel = 'self_care' | 'routine' | 'soon' | 'today' | 'emergency';

export type ConditionCategory = 'skin' | 'hair' | 'nails';
export type Prevalence = 'very_common' | 'common' | 'uncommon' | 'rare';

export interface SourceLink {
  label: string;
  url: string;
}

export interface ConditionCard {
  /** 1–2 plain sentences: what it is. */
  summary: string;
  /** Main symptoms / clinical features, plain words. */
  looksLike: string[];
  /** How it usually develops over time. */
  progression: string;
  /** Easy pathophysiology: how it comes about, 2–4 sentences. */
  why: string;
  /** Tests a doctor may suggest. */
  tests: { name: string; why: string }[];
  /** Kind of doctor to see. */
  doctor: { type: string; when: string };
  /** Basic care only. Never medicines or doses. */
  dos: string[];
  donts: string[];
  /** How it can look different on brown/dark skin. */
  skinToneNote?: string;
  sources: SourceLink[];
}

export interface AlsoCheck {
  area: BodyArea;
  /** Shown to the user: why we want a look at this place. */
  reason: string;
}

export interface Condition {
  id: string;
  name: string;
  aka?: string[];
  category: ConditionCategory;
  prevalence: Prevalence;
  /**
   * How strongly each feature points to (+) or away from (−) this condition.
   * Scale −3..+3. +3 = hallmark, +1 = mild support, −2 = strongly against.
   */
  evidence: Partial<Record<FeatureId, number>>;
  /** Where it usually shows up. Weight 1..3 (3 = classic site). */
  sites: Partial<Record<BodyArea, number>>;
  alsoCheck: AlsoCheck[];
  /** Usual urgency when nothing worrying is present. */
  baseUrgency: UrgencyLevel;
  card: ConditionCard;
}

export type QuestionKind = 'yesno' | 'single' | 'multi';

export interface QuestionOption {
  label: string;
  /** Features set to 'yes' when this option is picked. */
  sets: FeatureId[];
}

export interface Question {
  id: string;
  text: string;
  /** "Why we're asking" — one plain sentence. */
  why: string;
  kind: QuestionKind;
  /** yesno only: the feature this answers. */
  feature?: FeatureId;
  /**
   * single/multi only.
   * single: picked option's features → 'yes', every other option's features → 'no'.
   * multi: picked options' features → 'yes', others stay unanswered.
   */
  options?: QuestionOption[];
  /** Optional hint shown under the question (e.g. how to check). */
  hint?: string;
  /** Only ask when the case matches (any listed site OR any listed feature answered yes). */
  showIf?: { anyAreas?: BodyArea[]; anyFeatures?: FeatureId[] };
  /** 'core' are asked early for everyone matching showIf; 'detail' are picked to split the top conditions. */
  phase: 'core' | 'detail';
}

export interface RedFlagRule {
  id: string;
  level: 'emergency' | 'today';
  /** Fires when every listed feature is 'yes'. */
  allOf: FeatureId[];
  title: string;
  message: string;
  /** What to do right now, e.g. "Call 112 or go to the nearest emergency department." */
  action: string;
}

export interface TriageResult {
  level: UrgencyLevel;
  triggered: RedFlagRule[];
}

export type Band = 'strong' | 'possible' | 'less_likely';

export interface RankedCondition {
  condition: Condition;
  /** Raw score; only meaningful for ordering. */
  score: number;
  /** 0..1 relative match, used to fill the ring. */
  match: number;
  band: Band;
  /** Human labels of features/sites that fit. */
  fitsBecause: string[];
  /** Human labels of answers that argue against. */
  againstBecause: string[];
  /** Strong features for this condition not yet asked. */
  confirmWith: string[];
}

export type PhotoDistance = 'far' | 'mid' | 'close';

export interface Photo {
  id: string;
  area: BodyArea;
  distance: PhotoDistance;
  /** JPEG data URL, already downscaled (max 1280px). */
  dataUrl: string;
  takenAt: string; // ISO
}

export interface CaseState {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  /** The user's own words. */
  complaint: string;
  age?: number;
  sex?: 'female' | 'male' | 'other';
  areas: BodyArea[];
  answers: Answers;
  /** Question ids already asked, in order. */
  asked: string[];
  photos: Photo[];
}

export interface AlsoCheckPrompt {
  area: BodyArea;
  reason: string;
  /** Condition names this would help confirm or rule out. */
  forConditions: string[];
}
