import { useState } from 'react';
import { Button, Card, Chip, Screen } from '../../ui';
import { CONTEXT_QUESTIONS } from '../context';
import { contextKeysCovered, knownContext } from '../index';
import type { ContextKey, ContextQuestion, MindCase } from '../types';
import { CrisisButton } from './CrisisButton';
import type { MindContextScreenProps } from './props';
import './mind.css';

const isAdult = (s: MindCase) => s.age === undefined || s.age >= 18;

function applies(q: ContextQuestion, s: MindCase, covered: Set<ContextKey>): boolean {
  if (covered.has(q.key)) return false; // already known from the questionnaires or age
  if (q.onlyIf === 'perinatal') return s.perinatal === true;
  if (q.onlyIf === 'adult') return isAdult(s);
  return true;
}

export function MindContextScreen({ state, update, onNext, onBack }: MindContextScreenProps) {
  const [openWhy, setOpenWhy] = useState<ContextKey | null>(null);
  const covered = contextKeysCovered(state);
  const questions = CONTEXT_QUESTIONS.filter((q) => applies(q, state, covered));

  const setAnswer = (key: ContextKey, value: boolean | undefined) => {
    const context = { ...state.context };
    if (value === undefined) delete context[key];
    else context[key] = value;
    update({ ...state, context, updatedAt: new Date().toISOString() });
  };

  const finish = () => {
    const context = { ...state.context, ...knownContext(state) };
    // Mark the step as seen even if every question was skipped, so the flow moves on.
    if (Object.keys(context).length === 0) context.affects_daily_life = undefined;
    update({ ...state, context, updatedAt: new Date().toISOString() });
    onNext();
  };

  return (
    <Screen
      title="A bit more about you"
      onBack={onBack}
      right={<CrisisButton />}
      footer={
        <Button full onClick={finish}>
          Continue
        </Button>
      }
    >
      <p className="mind-p">
        These don't change your scores. They help Clue suggest the right kind of help. Skip any you'd rather not
        answer.
      </p>
      {questions.map((q) => {
        const v = state.context[q.key];
        const why = openWhy === q.key;
        return (
          <Card key={q.key}>
            <p className="mind-ctx__q">{q.text}</p>
            <div className="mind-chips">
              <Chip selected={v === true} onClick={() => setAnswer(q.key, true)}>
                Yes
              </Chip>
              <Chip selected={v === false} onClick={() => setAnswer(q.key, false)}>
                No
              </Chip>
              <Chip selected={v === undefined} onClick={() => setAnswer(q.key, undefined)}>
                Skip
              </Chip>
            </div>
            <button
              type="button"
              className="mind-textbtn mind-textbtn--left"
              aria-expanded={why}
              onClick={() => setOpenWhy(why ? null : q.key)}
            >
              {why ? 'Hide' : 'Why we ask'}
            </button>
            {why && <p className="mind-small">{q.why}</p>}
          </Card>
        );
      })}
    </Screen>
  );
}
