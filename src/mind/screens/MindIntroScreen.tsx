import { useState } from 'react';
import { Button, Card, Chip, Screen, SectionLabel } from '../../ui';
import type { MindCase } from '../types';
import { CrisisButton } from './CrisisButton';
import type { MindIntroScreenProps } from './props';
import './mind.css';

const SEXES: { value: MindCase['sex']; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: undefined, label: 'Prefer not to say' },
];

export function MindIntroScreen({ state, update, onNext, onBack }: MindIntroScreenProps) {
  const [ageText, setAgeText] = useState(state.age !== undefined ? String(state.age) : '');
  const [sexAnswered, setSexAnswered] = useState(state.sex !== undefined);

  const set = (patch: Partial<MindCase>) =>
    update({ ...state, ...patch, updatedAt: new Date().toISOString() });

  const onAge = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '').slice(0, 3);
    setAgeText(clean);
    const n = Number(clean);
    set({ age: clean && n > 0 && n < 120 ? n : undefined });
  };

  // Only once sex is chosen, and only for female or other.
  const showPerinatal = sexAnswered && (state.sex === 'female' || state.sex === 'other');
  const under18 = state.age !== undefined && state.age < 18;

  return (
    <Screen title="Mind check" onBack={onBack} right={<CrisisButton />}>
      <div className="mind-hero">
        <h1 className="mind-hero__title">How have you been feeling?</h1>
        <p className="mind-p">
          A short check of mood, worry, sleep, stress and more. It takes about 5–8 minutes and uses questionnaires
          that doctors use.
        </p>
      </div>

      <Card>
        <ul className="mind-list">
          <li>
            <strong>Not a diagnosis.</strong> It shows what your answers are similar to, and where to get help.
          </li>
          <li>
            <strong>Private.</strong> Your answers stay on this phone. Nothing is sent anywhere.
          </li>
          <li>
            <strong>Help is always one tap away.</strong> Tap “Need help now?” at any time.
          </li>
        </ul>
      </Card>

      <SectionLabel>About you</SectionLabel>
      <Card>
        <label className="mind-field">
          <span className="mind-field__label">Age</span>
          <input
            className="mind-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Years"
            value={ageText}
            onChange={(e) => onAge(e.target.value)}
            aria-label="Age in years"
          />
        </label>

        <div className="mind-field">
          <span className="mind-field__label">Sex</span>
          <div className="mind-chips">
            {SEXES.map((s) => (
              <Chip
                key={s.label}
                selected={sexAnswered && state.sex === s.value}
                onClick={() => {
                  setSexAnswered(true);
                  set({
                    sex: s.value,
                    perinatal: s.value === 'female' || s.value === 'other' ? state.perinatal : undefined,
                  });
                }}
              >
                {s.label}
              </Chip>
            ))}
          </div>
        </div>

        {showPerinatal && (
          <div className="mind-field">
            <span className="mind-field__label">Are you pregnant or did you have a baby in the last year?</span>
            <div className="mind-chips">
              <Chip selected={state.perinatal === true} onClick={() => set({ perinatal: true })}>
                Yes
              </Chip>
              <Chip selected={state.perinatal === false} onClick={() => set({ perinatal: false })}>
                No
              </Chip>
              <Chip selected={state.perinatal === undefined} onClick={() => set({ perinatal: undefined })}>
                Skip
              </Chip>
            </div>
          </div>
        )}
      </Card>

      {under18 && (
        <Card tone="tinted" tint="var(--blue)">
          <p className="mind-p">
            This check is designed for adults. You can still use it — and you can always call{' '}
            <a className="mind-link" href="tel:14416">
              14416
            </a>{' '}
            for free, private help.
          </p>
        </Card>
      )}

      <Button full onClick={onNext}>
        Start
      </Button>
      <p className="mind-small mind-center">You can skip anything you don't want to answer.</p>
    </Screen>
  );
}
