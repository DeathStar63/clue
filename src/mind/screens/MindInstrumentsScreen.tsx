import { useEffect, useRef } from 'react';
import { Button, Card, Screen } from '../../ui';
import {
  answerItem,
  applicableGateways,
  itemsToAsk,
  mindCompleteGateway,
  mindCompleteInstrument,
  mindEnsureSafety,
  mindGatewayAnswered,
  mindInstrumentsLeft,
  mindNextStep,
  mindRisk,
} from '../index';
import { GATEWAYS, instrumentById } from '../instruments';
import type { InstrumentItem, MindCase } from '../types';
import { CrisisButton } from './CrisisButton';
import type { MindInstrumentsScreenProps } from './props';
import { QuestionPager } from './QuestionPager';
import './mind.css';

interface MindStepPagerProps {
  state: MindCase;
  update: (next: MindCase) => void;
  onBack: () => void;
  onRisk: () => void;
  /** Called after a gateway or instrument is finished (and saved via update). */
  onFinished: (next: MindCase) => void;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Asks whatever gateway or instrument step the engine gives next, one item per page.
 * Shared by the quick-check and questionnaire screens, because the engine can put the
 * safety questions in front of anything else.
 */
export function MindStepPager({ state, update, onBack, onRisk, onFinished }: MindStepPagerProps) {
  const latest = useRef<MindCase>(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  const step = mindNextStep(state);
  if (step.kind !== 'gateway' && step.kind !== 'instrument') return null;

  const instrument = step.kind === 'gateway' ? instrumentById(step.gateway.instrumentId) : step.instrument;
  const instId = step.kind === 'gateway' ? step.gateway.instrumentId : step.instrument.id;
  const items = step.items;
  const answers = state.responses[instId] ?? {};
  const optionsFor = (item: InstrumentItem) => item.options ?? instrument?.options ?? [];

  const handleAnswer = (itemId: string, value: number) => {
    const before = latest.current;
    const wasUrgent = mindRisk(before).level === 'urgent';
    let next = answerItem(before, instId, itemId, value);
    let finished: boolean;
    if (step.kind === 'gateway') {
      // Recheck against the new answers: a "No" or "Never" can leave nothing else to ask.
      finished = mindGatewayAnswered(next, step.gateway);
      if (finished) next = mindEnsureSafety(mindCompleteGateway(next, step.gateway));
    } else {
      finished = itemsToAsk(step.instrument, next.responses[instId]).length === 0;
      if (finished) next = mindEnsureSafety(mindCompleteInstrument(next, instId));
    }
    latest.current = next;
    update(next);
    // Interrupt only when risk has just become urgent, so coming back from the help screen doesn't loop.
    if (!wasUrgent && mindRisk(next).level === 'urgent') {
      onRisk();
      return;
    }
    if (finished) onFinished(next);
  };

  if (step.kind === 'gateway') {
    const done = state.completed.filter((id) => GATEWAYS.some((g) => g.id === id)).length;
    const remaining = applicableGateways(state, GATEWAYS).length;
    const within = items.length ? items.filter((i) => answers[i.id] !== undefined).length / items.length : 0;
    const progress = (done + within) / Math.max(1, done + remaining);
    return (
      <Screen title="Quick check" onBack={onBack} right={<CrisisButton />}>
        <QuestionPager
          key={step.gateway.id}
          title={step.gateway.label}
          stem={instrument?.stem}
          items={items}
          values={answers}
          optionsFor={optionsFor}
          onAnswer={handleAnswer}
          progress={progress}
        />
        <p className="mind-small mind-center">There are no right or wrong answers. Go with your first feeling.</p>
      </Screen>
    );
  }

  const inst = step.instrument;
  const total = inst.items.length;
  const answeredCount = inst.items.filter((i) => answers[i.id] !== undefined).length;
  const left = mindInstrumentsLeft(state, inst.id);
  const badge = (
    <span className={`mind-badge mind-badge--${inst.origin}`}>
      {inst.origin === 'official' ? 'Standard questionnaire' : 'Clue check'}
    </span>
  );

  return (
    <Screen title={inst.shortName} onBack={onBack} right={<CrisisButton />}>
      <QuestionPager
        key={inst.id}
        title={cap(inst.topic)}
        subtitle={left > 0 ? `${left} more ${left === 1 ? 'set' : 'sets'} of questions after this` : undefined}
        badge={badge}
        stem={inst.stem}
        items={items}
        values={answers}
        optionsFor={optionsFor}
        onAnswer={handleAnswer}
        progress={total ? answeredCount / total : 0}
        countLabel={`Question ${Math.min(answeredCount + 1, total)} of ${total}`}
      />
      {inst.origin === 'clue' && (
        <p className="mind-small mind-center">These are Clue's own check questions, not a standard questionnaire.</p>
      )}
    </Screen>
  );
}

export function MindInstrumentsScreen({ state, update, onNext, onBack, onRisk }: MindInstrumentsScreenProps) {
  const step = mindNextStep(state);
  const worried = mindRisk(state).level !== 'none';

  if (step.kind === 'gateway' || step.kind === 'instrument') {
    return (
      <MindStepPager
        state={state}
        update={update}
        onBack={onBack}
        onRisk={onRisk}
        onFinished={(next) => {
          const after = mindNextStep(next).kind;
          if (after === 'context' || after === 'done') onNext();
        }}
      />
    );
  }

  return (
    <Screen title="Questions" onBack={onBack} right={<CrisisButton />}>
      <Card>
        <h2 className="mind-h2">{worried ? 'Questions finished' : 'Questionnaires done'}</h2>
        <p className="mind-p">
          {worried
            ? 'Thank you for answering. Your results are next — help is always one tap away.'
            : 'Thank you for answering. Almost there.'}
        </p>
      </Card>
      <Button full onClick={onNext}>
        Continue
      </Button>
    </Screen>
  );
}
