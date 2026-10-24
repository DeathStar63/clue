import type { ReactNode } from 'react';
import { Card, Ring, Screen } from '../../ui';
import { CrisisButton } from './CrisisButton';
import type { MindConditionScreenProps } from './props';
import './mind.css';

const BAND_WORD = { strong: 'Strong', possible: 'Possible', less_likely: 'Less likely' } as const;

function Section({ title, children, tint }: { title: string; children: ReactNode; tint?: string }) {
  return (
    <Card tone={tint ? 'tinted' : 'default'} tint={tint}>
      <h2 className="mind-h3">{title}</h2>
      {children}
    </Card>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="mind-list">
    {items.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

export function MindConditionScreen({ item, onBack }: MindConditionScreenProps) {
  const { condition, band, match, fitsBecause } = item;
  const card = condition.card;

  return (
    <Screen title="About this" onBack={onBack} right={<CrisisButton />}>
      <div className="mind-cond-head">
        <Ring value={match} size={84} color={band === 'strong' ? 'var(--accent)' : 'var(--blue)'}>
          <span className="mind-match__word">{BAND_WORD[band]}</span>
        </Ring>
        <div>
          <h1 className="mind-hero__title">{condition.name}</h1>
          {condition.aka && condition.aka.length > 0 && (
            <p className="mind-small mind-small--muted">Also called {condition.aka.join(', ')}</p>
          )}
        </div>
      </div>

      <Section title="What it is">
        <p className="mind-p">{card.summary}</p>
      </Section>

      {card.looksLike.length > 0 && (
        <Section title="Common signs">
          <Bullets items={card.looksLike} />
        </Section>
      )}

      {card.progression && (
        <Section title="How it usually goes">
          <p className="mind-p">{card.progression}</p>
        </Section>
      )}

      {card.why && (
        <Section title="Why it happens">
          <p className="mind-p">{card.why}</p>
        </Section>
      )}

      {card.tests.length > 0 && (
        <Section title="Checks a doctor may do">
          <ul className="mind-list">
            {card.tests.map((t, i) => (
              <li key={i}>
                <strong>{t.name}</strong> — {t.why}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Who to see">
        <p className="mind-p">
          <strong>{card.doctor.type}</strong>
        </p>
        <p className="mind-small">{card.doctor.when}</p>
      </Section>

      {(card.dos.length > 0 || card.donts.length > 0) && (
        <Section title="Do and don't">
          {card.dos.length > 0 && (
            <>
              <p className="mind-sub">Do</p>
              <Bullets items={card.dos} />
            </>
          )}
          {card.donts.length > 0 && (
            <>
              <p className="mind-sub">Don't</p>
              <Bullets items={card.donts} />
            </>
          )}
        </Section>
      )}

      {condition.whenUrgent && condition.whenUrgent.length > 0 && (
        <Section title="Get help today if…" tint="var(--red)">
          <Bullets items={condition.whenUrgent} />
          <p className="mind-small">
            Call{' '}
            <a className="mind-link" href="tel:14416">
              14416
            </a>{' '}
            (Tele-MANAS) or{' '}
            <a className="mind-link" href="tel:112">
              112
            </a>
            , or go to the nearest hospital emergency.
          </p>
        </Section>
      )}

      {condition.freeHelp && condition.freeHelp.length > 0 && (
        <Section title="Free or low-cost help">
          <Bullets items={condition.freeHelp} />
        </Section>
      )}

      {fitsBecause.length > 0 && (
        <Section title="Why Clue thinks this">
          <Bullets items={fitsBecause} />
          <p className="mind-small mind-small--muted">
            Your answers are similar to people who have this. It is not a diagnosis.
          </p>
        </Section>
      )}

      {card.sources.length > 0 && (
        <Section title="Sources">
          <ul className="mind-list mind-list--tight">
            {card.sources.map((s, i) => (
              <li key={i}>
                <a className="mind-link" href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <p className="mind-small mind-center">Clue never suggests medicines.</p>
    </Screen>
  );
}
