import type { MouseEvent } from 'react';
import { Card, Icon, Screen, SectionLabel } from '../ui';
import { areaLabel } from '../data/bodyAreas';
import { CrisisButton } from '../mind/screens/CrisisButton';
import type { CaseState } from '../types';
import type { HomeScreenProps } from './props';
import './screensA.css';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function caseTitle(c: CaseState): string {
  const text = c.complaint.trim();
  if (text) return text.length > 70 ? `${text.slice(0, 68).trimEnd()}…` : text;
  if (c.areas.length > 0) return c.areas.map(areaLabel).join(', ');
  return 'Skin check';
}

export function HomeScreen({
  cases,
  mindCount,
  onNewSkin,
  onNewMind,
  onOpen,
  onDelete,
  onAbout,
  onMindHistory,
}: HomeScreenProps) {
  const sorted = [...cases].sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));

  const remove = (e: MouseEvent, c: CaseState) => {
    e.stopPropagation();
    if (window.confirm('Delete this saved check? This can’t be undone.')) onDelete(c.id);
  };

  return (
    <Screen right={<CrisisButton />}>
      <header className="sa-hero">
        <h1 className="sa-wordmark">Clue</h1>
        <p className="sa-promise">Understand what might be going on — and who to see.</p>
      </header>

      <div className="sa-sections">
        <Card onClick={onNewSkin} tone="raised" className="sa-section">
          <span className="sa-section__icon sa-section__icon--skin" aria-hidden="true">
            <Icon name="body" size={26} />
          </span>
          <div className="sa-section__text">
            <h2 className="sa-section__title">Skin, hair &amp; nails</h2>
            <p className="sa-section__sub">Rashes, spots, hair loss, nail changes</p>
          </div>
          <Icon name="chevron" size={20} />
        </Card>

        <Card onClick={onNewMind} tone="raised" className="sa-section">
          <span className="sa-section__icon sa-section__icon--mind" aria-hidden="true">
            <Icon name="sparkle" size={26} />
          </span>
          <div className="sa-section__text">
            <h2 className="sa-section__title">Mind</h2>
            <p className="sa-section__sub">Mood, worry, sleep, stress</p>
          </div>
          <Icon name="chevron" size={20} />
        </Card>
        {mindCount > 0 && (
          <button type="button" className="sa-link sa-link--right" onClick={onMindHistory}>
            {mindCount} saved mind {mindCount === 1 ? 'check' : 'checks'} →
          </button>
        )}
      </div>

      <section className="sa-saved">
        <SectionLabel>Your saved checks</SectionLabel>
        {sorted.length === 0 ? (
          <p className="sa-muted">Nothing saved yet. Your checks stay on this device only.</p>
        ) : (
          <ul className="sa-list">
            {sorted.map((c) => (
              <li key={c.id}>
                <Card onClick={() => onOpen(c.id)} className="sa-case">
                  <div className="sa-case__text">
                    <span className="sa-case__date">{formatDate(c.updatedAt || c.createdAt)}</span>
                    <span className="sa-case__title">{caseTitle(c)}</span>
                    {c.photos.length > 0 && (
                      <span className="sa-case__meta">
                        <Icon name="camera" size={14} /> {c.photos.length}{' '}
                        {c.photos.length === 1 ? 'photo' : 'photos'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="sa-trash"
                    aria-label="Delete this check"
                    onClick={(e) => remove(e, c)}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="sa-homefoot">
        <button type="button" className="sa-link" onClick={onAbout}>
          About &amp; privacy
        </button>
        <p className="sa-disclaimer">For learning only — not a diagnosis or medical advice.</p>
      </footer>
    </Screen>
  );
}
