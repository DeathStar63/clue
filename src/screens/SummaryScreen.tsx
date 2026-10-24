import { useEffect, useState } from 'react';
import type { Band, FeatureId, PhotoDistance } from '../types';
import type { SummaryScreenProps } from './props';
import { Button, Card, Icon, Screen, SectionLabel, URGENCY_INFO } from '../ui';
import { areaLabel } from '../data/bodyAreas';
import { FEATURES, featureLabel, type FeatureGroup } from '../data/features';
import './screensB.css';

const GROUPS: { id: Exclude<FeatureGroup, 'alarm'>; label: string }[] = [
  { id: 'timing', label: 'How long / timing' },
  { id: 'look', label: 'How it looks' },
  { id: 'feel', label: 'How it feels' },
  { id: 'hair', label: 'Hair' },
  { id: 'nails', label: 'Nails' },
  { id: 'history', label: 'Background and triggers' },
];

const BAND_WORD: Record<Band, string> = {
  strong: 'strong match',
  possible: 'possible',
  less_likely: 'less likely',
};

const DISTANCE_LABEL: Record<PhotoDistance, string> = { far: 'Far', mid: 'Middle', close: 'Close' };
const SEX_LABEL = { female: 'Female', male: 'Male', other: 'Other' } as const;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function SummaryScreen({ state, ranked, triage, onBack }: SummaryScreenProps) {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const entries = Object.entries(state.answers) as [FeatureId, 'yes' | 'no' | 'unsure'][];
  const groupOf = (id: FeatureId): FeatureGroup => FEATURES[id].group;
  const yesBy = GROUPS.map((g) => ({
    ...g,
    items: entries.filter(([id, a]) => a === 'yes' && groupOf(id) === g.id).map(([id]) => featureLabel(id)),
  })).filter((g) => g.items.length > 0);
  const unsure = entries.filter(([, a]) => a === 'unsure').map(([id]) => featureLabel(id));
  const alarmYes = entries.filter(([id, a]) => a === 'yes' && groupOf(id) === 'alarm').map(([id]) => featureLabel(id));
  const alarmNo = entries.filter(([id, a]) => a === 'no' && groupOf(id) === 'alarm').map(([id]) => featureLabel(id));

  const likely = ranked.filter((r) => r.band !== 'less_likely');
  const causes = (likely.length > 0 ? likely : ranked).slice(0, 5);
  const urgency = URGENCY_INFO[triage.level];

  const who = [state.age !== undefined ? `${state.age} years` : null, state.sex ? SEX_LABEL[state.sex] : null]
    .filter(Boolean)
    .join(', ');

  const plainText = () => {
    const L: string[] = [];
    L.push('Skin summary for my doctor (made with Clue)');
    L.push(`Date: ${fmtDate(state.createdAt)}`);
    if (who) L.push(`Age / sex: ${who}`);
    L.push('');
    L.push(`Main complaint: ${state.complaint || '—'}`);
    if (state.areas.length) L.push(`Where: ${state.areas.map(areaLabel).join(', ')}`);
    for (const g of yesBy) L.push(`${g.label}: ${g.items.join(', ')}`);
    if (unsure.length) L.push(`Not sure: ${unsure.join(', ')}`);
    L.push('');
    L.push(`Safety check: ${urgency.title}`);
    for (const r of triage.triggered) L.push(`- ${r.title}`);
    if (alarmYes.length) L.push(`Warning signs reported: ${alarmYes.join(', ')}`);
    if (alarmNo.length) L.push(`Safety checks — none of these: ${alarmNo.join(', ')}`);
    if (state.photos.length) L.push(`Photos: ${state.photos.length} on my phone`);
    L.push('');
    L.push('Possible causes (not a diagnosis — for discussion):');
    for (const r of causes) L.push(`- ${r.condition.name} (${BAND_WORD[r.band]})`);
    return L.join('\n');
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast('Copied to clipboard');
    } catch {
      setToast('Could not copy. Try Save as PDF instead.');
    }
  };

  const share = async () => {
    const text = plainText();
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Skin summary for my doctor', text });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }
    await copy(text);
  };

  return (
    <Screen
      title="For your doctor"
      onBack={onBack}
      footer={
        <div className="sb-btnrow">
          <Button variant="secondary" onClick={() => void share()}>
            <Icon name="share" /> Share
          </Button>
          <Button onClick={() => window.print()}>Save as PDF / Print</Button>
        </div>
      }
    >
      <article className="sb-summary">
        <header className="sb-summary__head">
          <h2 className="sb-h2">Skin summary for my doctor</h2>
          <p className="sb-muted">
            {fmtDate(state.createdAt)}
            {who && ` · ${who}`}
          </p>
        </header>

        <SectionLabel>Main complaint</SectionLabel>
        <Card>
          <p className="sb-quote">{state.complaint ? `“${state.complaint}”` : '—'}</p>
        </Card>

        {state.areas.length > 0 && (
          <>
            <SectionLabel>Where</SectionLabel>
            <Card>
              <p>{state.areas.map(areaLabel).join(', ')}</p>
            </Card>
          </>
        )}

        {(yesBy.length > 0 || unsure.length > 0) && (
          <>
            <SectionLabel>What I noticed</SectionLabel>
            <Card>
              <dl className="sb-why sb-why--loose">
                {yesBy.map((g) => (
                  <div key={g.id}>
                    <dt>{g.label}:</dt>
                    <dd>{cap(g.items.join(', '))}</dd>
                  </div>
                ))}
                {unsure.length > 0 && (
                  <div>
                    <dt>Not sure:</dt>
                    <dd>{cap(unsure.join(', '))}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </>
        )}

        <SectionLabel>Safety check</SectionLabel>
        <Card tone="tinted" tint={urgency.color}>
          <p>
            <strong>{urgency.title}</strong>
          </p>
          {triage.triggered.length > 0 && (
            <ul className="sb-list sb-list--dots">
              {triage.triggered.map((r) => (
                <li key={r.id}>
                  <span>{r.title}</span>
                </li>
              ))}
            </ul>
          )}
          {alarmYes.length > 0 && <p className="sb-small">Warning signs reported: {alarmYes.join(', ')}</p>}
          {alarmNo.length > 0 && (
            <p className="sb-small">Safety checks — none of these: {alarmNo.join(', ')}</p>
          )}
        </Card>

        {state.photos.length > 0 && (
          <>
            <SectionLabel>Photos</SectionLabel>
            <div className="sb-thumbs sb-thumbs--summary">
              {state.photos.map((p) => (
                <figure key={p.id} className="sb-thumb">
                  <img src={p.dataUrl} alt={`${areaLabel(p.area)}, ${DISTANCE_LABEL[p.distance].toLowerCase()}`} />
                  <figcaption>
                    {areaLabel(p.area)} · {DISTANCE_LABEL[p.distance]}
                    <br />
                    {fmtDate(p.takenAt)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {causes.length > 0 && (
          <>
            <SectionLabel>Possible causes — not a diagnosis, for discussion</SectionLabel>
            <Card>
              <ul className="sb-list sb-list--dots">
                {causes.map((r) => (
                  <li key={r.condition.id}>
                    <span>
                      {r.condition.name} <span className="sb-muted">({BAND_WORD[r.band]})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        <p className="sb-note">
          Made with Clue, an educational app. This is not a diagnosis. Only a doctor who examines you can diagnose.
        </p>
      </article>

      {toast && (
        <div className="sb-toast" role="status">
          {toast}
        </div>
      )}
    </Screen>
  );
}
