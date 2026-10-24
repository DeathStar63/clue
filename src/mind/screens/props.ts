// Props contract for Mind screens. App.tsx owns state and navigation.
import type { InstrumentResult, MindCase, RankedMindCondition, RiskResult } from '../types';

export interface MindStepProps {
  state: MindCase;
  update: (next: MindCase) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Privacy note, age, sex, perinatal. Under 18 → youth notice (still allowed, crisis help always shown). */
export type MindIntroScreenProps = MindStepProps;

/** Quick check: every applicable gateway, one item per page. Call onRisk the moment risk becomes 'urgent'. */
export interface MindGatewayScreenProps extends MindStepProps {
  onRisk: () => void;
}

/** Full instruments from state.queue, one item per page. Call onRisk the moment risk becomes 'urgent'. */
export interface MindInstrumentsScreenProps extends MindStepProps {
  onRisk: () => void;
}

/** Duration, impact, substances, medical, family, etc. */
export type MindContextScreenProps = MindStepProps;

export interface MindResultsScreenProps {
  state: MindCase;
  results: InstrumentResult[];
  ranked: RankedMindCondition[];
  risk: RiskResult;
  onOpenCondition: (id: string) => void;
  onSummary: () => void;
  onCrisis: () => void;
  onBack: () => void;
  onHome: () => void;
}

export interface MindConditionScreenProps {
  item: RankedMindCondition;
  onBack: () => void;
}

export interface MindSummaryScreenProps {
  state: MindCase;
  results: InstrumentResult[];
  ranked: RankedMindCondition[];
  risk: RiskResult;
  onBack: () => void;
}

/** Full-screen crisis panel. Shown from anywhere. */
export interface CrisisScreenProps {
  risk?: RiskResult;
  onClose: () => void;
}

export interface MindHistoryScreenProps {
  cases: MindCase[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}
