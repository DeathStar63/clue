import type { ReactNode } from 'react';
import type { Band } from '../types';
import type { ConditionScreenProps } from './props';
import { Card, Icon, Ring, Screen, SectionLabel, type IconName } from '../ui';
import { areaLabel } from '../data/bodyAreas';
import './screensB.css';

const BAND_WORD: Record<Band, string> = {
  strong: 'Strong match',
  possible: 'Possible match',
  less_likely: 'Less likely',
};

const BAND_COLOR: Record<Band, string> = {
  strong: 'var(--accent)',
  possible: 'var(--blue)',
  less_likely: 'var(--text-3)',
};

function Section({ label, icon, children }: { label: string; icon?: IconName; children: ReactNode }) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <Card>
        {icon ? (
          <div className="sb-row sb-row--top">
            <span className="sb-iconwrap">
              <Icon name={icon} />
            </span>
            <div className="sb-grow">{children}</div>
          </div>
        ) : (
          children
        )}
      </Card>
    </>
  );
}

function Bullets({ items, icon }: { items: string[]; icon?: IconName }) {
  return (
    <ul className={`sb-list${icon ? ' sb-list--icon' : ' sb-list--dots'}`}>
      {items.map((t, i) => (
        <li key={i}>
          {icon && <Icon name={icon} size={16} />}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function ConditionScreen({ item, onBack }: ConditionScreenProps) {
  const { condition: c, band } = item;
  const card = c.card;

  return (
    <Screen title={c.name} onBack={onBack}>
      <header className="sb-hero">
        <Ring value={item.match} size={108} color={BAND_COLOR[band]}>
          <span className="sb-ringword sb-ringword--lg">{BAND_WORD[band].split(' ')[0]}</span>
        </Ring>
        <div className="sb-grow">
          <p className="sb-eyebrow" style={{ color: BAND_COLOR[band] }}>
            {BAND_WORD[band]}
          </p>
          <h2 className="sb-h2">{c.name}</h2>
          {c.aka && c.aka.length > 0 && <p className="sb-muted">Also called {c.aka.join(', ')}</p>}
        </div>
      </header>

      <Section label="What it is" icon="info">
        <p>{card.summary}</p>
      </Section>

      <Section label="What it usually looks like" icon="image">
        <Bullets items={card.looksLike} />
      </Section>

      <Section label="How it usually develops" icon="clock">
        <p>{card.progression}</p>
      </Section>

      <Section label="Why it happens" icon="sparkle">
        <p>{card.why}</p>
      </Section>

      {card.tests.length > 0 && (
        <Section label="Tests a doctor may suggest" icon="flask">
          <ul className="sb-deflist">
            {card.tests.map((t, i) => (
              <li key={i}>
                <strong>{t.name}</strong>
                <span className="sb-muted">{t.why}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section label="Who to see" icon="doctor">
        <p>
          <strong>{card.doctor.type}</strong>
        </p>
        <p className="sb-muted">{card.doctor.when}</p>
      </Section>

      <div className="sb-twocol">
        <div>
          <SectionLabel>Do</SectionLabel>
          <Card>
            <Bullets items={card.dos} icon="check" />
          </Card>
        </div>
        <div>
          <SectionLabel>Don’t</SectionLabel>
          <Card>
            <Bullets items={card.donts} icon="close" />
          </Card>
        </div>
      </div>

      {card.skinToneNote && (
        <Section label="On brown and darker skin" icon="body">
          <p>{card.skinToneNote}</p>
        </Section>
      )}

      <Section label="Why Clue thinks this" icon="list">
        <dl className="sb-why sb-why--loose">
          <div>
            <dt>Fits:</dt>
            <dd>{item.fitsBecause.length > 0 ? item.fitsBecause.join(', ') : 'Nothing specific yet'}</dd>
          </div>
          {item.againstBecause.length > 0 && (
            <div>
              <dt>Against:</dt>
              <dd>{item.againstBecause.join(', ')}</dd>
            </div>
          )}
          {item.confirmWith.length > 0 && (
            <div>
              <dt>Would help confirm:</dt>
              <dd>{item.confirmWith.join(', ')}</dd>
            </div>
          )}
        </dl>
      </Section>

      {c.alsoCheck.length > 0 && (
        <Section label="Places this often shows up too" icon="body">
          <ul className="sb-deflist">
            {c.alsoCheck.map((a, i) => (
              <li key={i}>
                <strong>{areaLabel(a.area)}</strong>
                <span className="sb-muted">{a.reason}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {card.sources.length > 0 && (
        <>
          <SectionLabel>Sources</SectionLabel>
          <Card>
            <ul className="sb-list sb-list--links">
              {card.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <span>{s.label}</span>
                    <Icon name="chevron" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <p className="sb-note">
        <Icon name="info" size={16} /> Clue never suggests medicines. A doctor can advise treatment.
      </p>
    </Screen>
  );
}
