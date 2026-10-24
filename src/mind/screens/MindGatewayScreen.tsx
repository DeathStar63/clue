import { Button, Card, Screen } from '../../ui';
import { applicableGateways, mindNextStep } from '../index';
import { GATEWAYS } from '../instruments';
import type { MindCase } from '../types';
import { CrisisButton } from './CrisisButton';
import { MindStepPager } from './MindInstrumentsScreen';
import type { MindGatewayScreenProps } from './props';
import './mind.css';

const gatewaysLeft = (s: MindCase) => applicableGateways(s, GATEWAYS).length > 0;

export function MindGatewayScreen({ state, update, onNext, onBack, onRisk }: MindGatewayScreenProps) {
  const step = mindNextStep(state);
  // The engine may put the safety questions before the remaining gateways; ask them here too.
  const askHere = step.kind === 'gateway' || (step.kind === 'instrument' && gatewaysLeft(state));

  if (askHere) {
    return (
      <MindStepPager
        state={state}
        update={update}
        onBack={onBack}
        onRisk={onRisk}
        onFinished={(next) => {
          if (!gatewaysLeft(next)) onNext();
        }}
      />
    );
  }

  return (
    <Screen title="Quick check" onBack={onBack} right={<CrisisButton />}>
      <Card>
        <h2 className="mind-h2">Quick check done</h2>
        <p className="mind-p">Thank you. Next come a few more questions, based on your answers.</p>
      </Card>
      <Button full onClick={onNext}>
        Continue
      </Button>
    </Screen>
  );
}
