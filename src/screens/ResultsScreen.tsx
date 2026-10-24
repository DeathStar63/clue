import { useState } from 'react';
import type { Band, RankedCondition } from '../types';
import type { ResultsScreenProps } from './props';
import { Button, Card, Icon, Ring, Screen, SectionLabel, URGENCY_INFO, UrgencyCard } from '../ui';
import { alsoCheckPrompts } from '../engine';
import { areaLabel } from '../data/bodyAreas';
import './screensB.css';

const BAND_WORD: Record<Band, string> = {
  strong: 'Strong',
  possible: 'Possible',
  less_likely: 'Less likely',
};

const BAND_COLOR: Record<Band, string> = {
  strong: 'var(--accent)',
  possible: 'var(--blue)',
  less_likely: 'var(--text-3)',
};

function CauseCard({ item, onOpen }: { item: RankedCondition; onOpen: () => void }) {
  const { condition: c, band } = item;
  return (
    <Card onClick={onOpen}>
      <div className="sb-cause">
        <Ring value={item.match} size={68} stroke={7} color={BAND_COLOR[band]}>
          <span className="sb-ringword">{BAND_WORD[band]}</span>
        </Ring>
        <div className="sb-grow">
          <h3 className="sb-h3">{c.name}</h3>
          <p className="sb-muted">{c.card.summary.split(/(?<=\.)\s/)[0]}</p>
        </div>
        <Icon name="chevron" size={18} />
      </div>
      <dl className="sb-why">
        {item.fitsBecause.length > 0 && (
          <div>
            <dt>Fits:</dt>
            <dd>{item.fitsBecause.slice(0, 3).join(', ')}</dd>
          </div>
        )}
        {item.againstBecause.length > 0 && (
          <div>
            <dt>Against:</dt>
            <dd>{item.againstBecause.slice(0, 2).join(', ')}</dd>
          </div>
        )}
        {item.confirmWith.length > 0 && (
          <div>
            <dt>Would help confirm:</dt>
            <dd>{item.confirmWith.join(', ')}</dd>
          </div>
        )}
      </dl>
    </Card>
  );
}

export function ResultsScreen({
  state,
  ranked,
  triage,
  onOpenCondition,
  onPhotos,
  onSummary,
  onBack,
  onHome,
}: ResultsScreenProps) {
  const [showLess, setShowLess] = useState(false);

  // Always the top 3 as full cards, then at most 5 more in a collapsed list.
  const top = ranked.slice(0, 3);
  const less = ranked.slice(3, 8);
  const prompts = alsoCheckPrompts(state, ranked);

  const first = top[0];
  const reasons =
    triage.triggered.length > 0
      ? triage.triggered.map((r) => r.title)
      : first
        ? [`For ${first.condition.name}, the usual advice is: ${URGENCY_INFO[first.condition.baseUrgency].title.toLowerCase()}.`]
        : [];

  return (
    <Screen
      title="Possible causes"
      onBack={onBack}
      footer={
        <div className="sb-btnrow sb-btnrow--footer">
          <Button onClick={onSummary}>
            <Icon name="list" /> Doctor summary
          </Button>
          <Button variant="secondary" onClick={onHome}>
            Done
          </Button>
        </div>
      }
    >
      <UrgencyCard level={triage.level} reasons={reasons} />

      <SectionLabel>Possible causes to discuss with a doctor</SectionLabel>
      {top.length === 0 && (
        <Card>
          <p className="sb-muted">Clue could not match this to anything it knows. A doctor can take a proper look.</p>
        </Card>
      )}
      {top.map((r) => (
        <CauseCard key={r.condition.id} item={r} onOpen={() => onOpenCondition(r.condition.id)} />
      ))}

      {less.length > 0 && (
        <>
          <button
            type="button"
            className="sb-disclosure"
            aria-expanded={showLess}
            onClick={() => setShowLess((v) => !v)}
          >
            <span>Other possibilities ({less.length})</span>
            <span className={`sb-disclosure__chev${showLess ? ' is-open' : ''}`}>
              <Icon name="chevron" size={18} />
            </span>
          </button>
          {showLess && (
            <Card>
              <ul className="sb-list sb-list--tap">
                {less.map((r) => (
                  <li key={r.condition.id}>
                    <button type="button" onClick={() => onOpenCondition(r.condition.id)}>
                      <span className="sb-grow">{r.condition.name}</span>
                      <span className="sb-bandword">{BAND_WORD[r.band]}</span>
                      <Icon name="chevron" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      {prompts.length > 0 && (
        <>
          <SectionLabel>Also check here</SectionLabel>
          {prompts.map((p) => (
            <Card key={p.area} onClick={onPhotos}>
              <div className="sb-row">
                <span className="sb-iconwrap">
                  <Icon name="body" />
                </span>
                <div className="sb-grow">
                  <h3 className="sb-h3">{areaLabel(p.area)}</h3>
                  <p className="sb-muted">{p.reason}</p>
                  <p className="sb-small">Helps check for: {p.forConditions.join(', ')}</p>
                </div>
                <Icon name="chevron" size={18} />
              </div>
            </Card>
          ))}
        </>
      )}

      <div className="sb-addphotos">
        <Button full variant="secondary" onClick={onPhotos}>
          <Icon name="camera" /> Add photos
        </Button>
      </div>

      <p className="sb-note">
        <Icon name="info" size={16} /> This is not a diagnosis. Only a doctor who examines you can diagnose.
      </p>
    </Screen>
  );
}
