import { useMemo, useState } from 'react';
import { Button, Card, Chip, Icon, ProgressBar, Ring, Screen } from '../ui';
import { evaluateTriage, hasEmergency, applyAnswer, pickNextQuestion, progressEstimate } from '../engine';
import { QUESTIONS } from '../data/questions';
import type { Answer, Question, RankedCondition } from '../types';
import type { QuestionsScreenProps } from './props';
import './screensA.css';

const SKIP_AFTER = 5;

function TopStrip({ ranked }: { ranked: RankedCondition[] }) {
  const top = ranked.slice(0, 3);
  if (top.length === 0) return null;
  return (
    <section className="sa-top" aria-label="Top possibilities so far">
      <span className="sa-top__label">Top possibilities so far</span>
      <ul className="sa-top__list">
        {top.map((r) => (
          <li key={r.condition.id} className="sa-top__item">
            <Ring value={r.match} size={24} stroke={4} />
            <span className="sa-top__name">{r.condition.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface AskProps {
  q: Question;
  onAnswer: (value: Answer | number[]) => void;
  /** multi only: picked option indexes (owned by the screen so Done can sit in the footer). */
  multi: number[];
  onToggle: (i: number) => void;
}

/** One question. Keyed by q.id so local state (disclosure) resets per question. */
function Ask({ q, onAnswer, multi, onToggle }: AskProps) {
  const [whyOpen, setWhyOpen] = useState(false);
  const options = q.options ?? [];

  return (
    <div className="sa-ask">
      <h2 className="sa-ask__text">{q.text}</h2>
      {q.hint && <p className="sa-hint">{q.hint}</p>}
      <button
        type="button"
        className="sa-link sa-link--small"
        aria-expanded={whyOpen}
        onClick={() => setWhyOpen((o) => !o)}
      >
        <Icon name="info" size={16} /> Why we ask
      </button>
      {whyOpen && <p className="sa-why">{q.why}</p>}

      {q.kind === 'yesno' && (
        <div className="sa-answers">
          <button type="button" className="sa-answer" onClick={() => onAnswer('yes')}>
            Yes
          </button>
          <button type="button" className="sa-answer" onClick={() => onAnswer('no')}>
            No
          </button>
          <button type="button" className="sa-answer sa-answer--quiet" onClick={() => onAnswer('unsure')}>
            Not sure
          </button>
        </div>
      )}

      {q.kind === 'single' && (
        <div className="sa-answers">
          {options.map((o, i) => (
            <button key={i} type="button" className="sa-answer sa-answer--option" onClick={() => onAnswer([i])}>
              {o.label}
              <Icon name="chevron" size={18} />
            </button>
          ))}
          <button type="button" className="sa-answer sa-answer--quiet" onClick={() => onAnswer('unsure')}>
            Not sure
          </button>
        </div>
      )}

      {q.kind === 'multi' && (
        <>
          <p className="sa-muted">Pick all that fit.</p>
          <div className="sa-chips">
            {options.map((o, i) => (
              <Chip key={i} selected={multi.includes(i)} onClick={() => onToggle(i)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function QuestionsScreen({ state, update, onNext, onBack, ranked, onAlarm }: QuestionsScreenProps) {
  const q = useMemo(() => pickNextQuestion(state, QUESTIONS, ranked), [state, ranked]);
  const progress = q ? progressEstimate(state, QUESTIONS) : 1;
  // Red-flag checklist ids are also in `asked`; count only questions from this screen.
  const askedHere = useMemo(() => {
    const ids = new Set(QUESTIONS.map((x) => x.id));
    return state.asked.filter((id) => ids.has(id)).length;
  }, [state.asked]);

  // Multi picks, tied to the question they belong to so they reset per question.
  const [picks, setPicks] = useState<{ qid: string; list: number[] }>({ qid: '', list: [] });
  const multi = q && picks.qid === q.id ? picks.list : [];
  const toggle = (i: number) => {
    if (!q) return;
    setPicks({ qid: q.id, list: multi.includes(i) ? multi.filter((x) => x !== i) : [...multi, i] });
  };

  const answer = (value: Answer | number[]) => {
    if (!q) return;
    const next = applyAnswer(state, q, value);
    update(next);
    if (hasEmergency(next.answers) || evaluateTriage(next.answers).level === 'emergency') onAlarm();
  };

  return (
    <Screen
      title="A few questions"
      onBack={onBack}
      footer={
        q?.kind === 'multi' || (q && askedHere >= SKIP_AFTER) ? (
          <>
            {q.kind === 'multi' && (
              <div className="sa-footrow">
                <Button disabled={multi.length === 0} onClick={() => answer([...multi].sort((a, b) => a - b))}>
                  {multi.length > 0 ? `Done (${multi.length})` : 'Done'}
                </Button>
                <Button variant="secondary" onClick={() => answer([])}>
                  None of these
                </Button>
              </div>
            )}
            {askedHere >= SKIP_AFTER && (
              <Button full variant="ghost" onClick={onNext}>
                Skip to results
              </Button>
            )}
          </>
        ) : undefined
      }
    >
      <ProgressBar value={progress} />
      <TopStrip ranked={ranked} />

      {q ? (
        <div key={q.id} className="sa-fade">
          <Ask q={q} onAnswer={answer} multi={multi} onToggle={toggle} />
        </div>
      ) : (
        <div className="sa-fade">
          <Card tone="raised">
            <div className="sa-done">
              <span className="sa-done__icon" aria-hidden="true">
                <Icon name="check" size={28} />
              </span>
              <h2 className="sa-done__title">That’s enough to go on</h2>
              <p className="sa-muted">Thanks — we have what we need to show you some possibilities.</p>
              <Button full onClick={onNext}>
                Continue
              </Button>
            </div>
          </Card>
        </div>
      )}

      {q && (
        <p className="sa-disclaimer">
          “Not sure” is always fine. You can stop and see results at any time after a few questions.
        </p>
      )}
    </Screen>
  );
}
