import { BodyMap, Button, Chip, Screen, SectionLabel } from '../ui';
import type { BodyArea, CaseState } from '../types';
import type { WhereScreenProps } from './props';
import './screensA.css';

type SexChoice = NonNullable<CaseState['sex']> | 'skip';

const SEX_CHOICES: { value: SexChoice; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'skip', label: 'Prefer not to say' },
];

export function WhereScreen({ state, update, onNext, onBack }: WhereScreenProps) {
  const toggle = (area: BodyArea) => {
    const areas = state.areas.includes(area) ? state.areas.filter((a) => a !== area) : [...state.areas, area];
    update({ ...state, areas, updatedAt: new Date().toISOString() });
  };

  const setAge = (raw: string) => {
    const n = parseInt(raw, 10);
    const age = Number.isFinite(n) && n >= 0 && n <= 120 ? n : undefined;
    update({ ...state, age, updatedAt: new Date().toISOString() });
  };

  const setSex = (v: SexChoice) => {
    update({ ...state, sex: v === 'skip' ? undefined : v, updatedAt: new Date().toISOString() });
  };

  const count = state.areas.length;

  return (
    <Screen
      title="Where is it?"
      onBack={onBack}
      footer={
        <Button full disabled={count === 0} onClick={onNext}>
          {count === 0 ? 'Tap at least one place' : 'Next'}
        </Button>
      }
    >
      <p className="sa-lead">Tap every place where you see it. You can pick more than one.</p>
      <BodyMap selected={state.areas} onToggle={toggle} />

      <section className="sa-about">
        <SectionLabel>A little about you (optional)</SectionLabel>
        <label className="sa-field">
          <span className="sa-field__label">Age</span>
          <input
            className="sa-input"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            placeholder="e.g. 32"
            value={state.age ?? ''}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <div className="sa-field">
          <span className="sa-field__label">Sex</span>
          <div className="sa-chips" role="group" aria-label="Sex">
            {SEX_CHOICES.map((c) => (
              <Chip
                key={c.value}
                selected={c.value === 'skip' ? false : state.sex === c.value}
                onClick={() => setSex(c.value)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
        </div>
        <p className="sa-muted">Some skin problems are more common at certain ages or in one sex.</p>
      </section>
    </Screen>
  );
}
