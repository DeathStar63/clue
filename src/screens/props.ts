// Props contract for every skin screen. App.tsx owns state and navigation.
import type { CaseState, RankedCondition, TriageResult } from '../types';

export interface HomeScreenProps {
  cases: CaseState[];
  mindCount: number;
  onNewSkin: () => void;
  onNewMind: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onAbout: () => void;
  onMindHistory: () => void;
}

/** Shared by the step-by-step screens. `update` saves the case. */
export interface StepProps {
  state: CaseState;
  update: (next: CaseState) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface SafetyScreenProps extends StepProps {
  /** Call (instead of onNext) when triage is 'emergency' or 'today' after the checklist. */
  onAlarm: () => void;
}

export interface EmergencyScreenProps {
  triage: TriageResult;
  /** Go back and change the safety answers. */
  onBack: () => void;
  /** User acknowledged the warning and wants to keep learning. */
  onContinue: () => void;
}

export type WhereScreenProps = StepProps;
export type DescribeScreenProps = StepProps;

export interface QuestionsScreenProps extends StepProps {
  ranked: RankedCondition[];
  /** Call right away if an answer makes triage 'emergency'. */
  onAlarm: () => void;
}

export interface PhotosScreenProps extends StepProps {
  ranked: RankedCondition[];
}

export interface ResultsScreenProps {
  state: CaseState;
  ranked: RankedCondition[];
  triage: TriageResult;
  onOpenCondition: (id: string) => void;
  onPhotos: () => void;
  onSummary: () => void;
  onBack: () => void;
  onHome: () => void;
}

export interface ConditionScreenProps {
  item: RankedCondition;
  onBack: () => void;
}

export interface SummaryScreenProps {
  state: CaseState;
  ranked: RankedCondition[];
  triage: TriageResult;
  onBack: () => void;
}

export interface AboutScreenProps {
  onBack: () => void;
  /** Erase all saved cases on this device, then return home. */
  onEraseAll: () => void;
}
