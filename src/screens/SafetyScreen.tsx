import { useEffect, useRef, useState } from 'react';
import { Button, Card, Chip, Icon, Screen } from '../ui';
import { RED_FLAG_QUESTIONS, RED_FLAG_RULES } from '../data/redflags';
import { evaluateTriage } from '../engine';
import type { Answer, Answers, FeatureId } from '../types';
import type { SafetyScreenProps } from './props';
import './screensA.css';

const CHOICES: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' },
];

/** Features that on their own make it an emergency: a 'Yes' to one escalates at once. */
const EMERGENCY_FEATURES = new Set<FeatureId>(
  RED_FLAG_RULES.filter((r) => r.level === 'emergency' && r.allOf.length === 1).map((r) => r.allOf[0]),
);

const isEmergencyYes = (feature: FeatureId | undefined, a: Answer | undefined) =>
  a === 'yes' && !!feature && EMERGENCY_FEATURES.has(feature);

export function SafetyScreen({ state, update, onNext, onBack, onAlarm }: SafetyScreenProps) {
  // Start from anything already answered (e.g. coming back to change answers).
  const [picked, setPicked] = useState<Record<string, Answer>>(() => {
    const init: Record<string, Answer> = {};
    for (const q of RED_FLAG_QUESTIONS) {
      const a = q.feature ? state.answers[q.feature] : undefined;
      if (a) init[q.id] = a;
    }
    return init;
  });
  const [openHint, setOpenHint] = useState<string | null>(null);

  const answeredCount = RED_FLAG_QUESTIONS.filter((q) => picked[q.id]).length;
  const allAnswered = answeredCount === RED_FLAG_QUESTIONS.length;

  const bannerRef = useRef<HTMLDivElement>(null);
  const urgent = RED_FLAG_QUESTIONS.some((q) => isEmergencyYes(q.feature, picked[q.id]));

  /** Save what's answered so far into the case. */
  const save = (p: Record<string, Answer>): Answers => {
    const answers: Answers = { ...state.answers };
    const asked = [...state.asked];
    for (const q of RED_FLAG_QUESTIONS) {
      const a = p[q.id];
      if (!a) continue;
      if (q.feature) answers[q.feature] = a;
      if (!asked.includes(q.id)) asked.push(q.id);
    }
    update({ ...state, answers, asked, updatedAt: new Date().toISOString() });
    return answers;
  };

  const choose = (id: string, value: Answer) => {
    const next = { ...picked, [id]: value };
    setPicked(next);
    const q = RED_FLAG_QUESTIONS.find((x) => x.id === id);
    // Safety first: an emergency answer is saved straight away, not at the end.
    if (isEmergencyYes(q?.feature, value)) save(next);
  };

  useEffect(() => {
    if (urgent) bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [urgent]);

  const seeAlarm = () => {
    save(picked);
    onAlarm();
  };

  const submit = () => {
    const answers = save(picked);
    const triage = evaluateTriage(answers);
    if (triage.level === 'emergency' || triage.level === 'today') onAlarm();
    else onNext();
  };

  return (
    <Screen
      title="Quick safety check"
      onBack={onBack}
      footer={
        <Button full disabled={!allAnswered} onClick={submit}>
          {allAnswered ? 'Continue' : `Answer all ${RED_FLAG_QUESTIONS.length} to continue`}
        </Button>
      }
    >
      {urgent && (
        <div ref={bannerRef} className="sa-urgent" role="alert">
          <div className="sa-urgent__head">
            <Icon name="alert" size={22} />
            <p>
              <strong>This needs help now.</strong> What you said can be an emergency. Don’t wait to finish the
              questions.
            </p>
          </div>
          <a className="sa-call sa-call--primary" href="tel:112">
            Call 112
            <span>Emergency</span>
          </a>
          <Button full variant="secondary" onClick={seeAlarm}>
            See what this means
          </Button>
        </div>
      )}

      <Card tone="tinted" tint="var(--orange)">
        <div className="sa-note">
          <Icon name="alert" size={22} />
          <p>
            <strong>First, let’s make sure this isn’t urgent.</strong> Answer each one as best you can — “Not sure” is
            fine.
          </p>
        </div>
      </Card>

      <ol className="sa-flags">
        {RED_FLAG_QUESTIONS.map((q, i) => {
          const a = picked[q.id];
          const hintOpen = openHint === q.id;
          return (
            <li key={q.id} className={`sa-flag${a === 'yes' ? ' is-yes' : ''}`}>
              <div className="sa-flag__q">
                <span className="sa-flag__num">{i + 1}</span>
                <p className="sa-flag__text">{q.text}</p>
              </div>
              {q.hint && (
                <>
                  <button
                    type="button"
                    className="sa-link sa-link--small"
                    aria-expanded={hintOpen}
                    onClick={() => setOpenHint(hintOpen ? null : q.id)}
                  >
                    <Icon name="info" size={16} /> How to check
                  </button>
                  {hintOpen && <p className="sa-hint">{q.hint}</p>}
                </>
              )}
              <div className="sa-flag__chips" role="group" aria-label={q.text} data-picked={a ?? undefined}>
                {CHOICES.map((c) => (
                  <Chip key={c.value} selected={a === c.value} onClick={() => choose(q.id, c.value)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </Screen>
  );
}
