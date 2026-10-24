import './ui.css';
import type { CSSProperties } from 'react';
import type { UrgencyLevel } from '../types';
import { Icon } from './Icon';
import { URGENCY_INFO, URGENCY_ORDER } from './urgency';

export interface UrgencyCardProps {
  level: UrgencyLevel;
  reasons?: string[];
}

export function UrgencyCard({ level, reasons }: UrgencyCardProps) {
  const info = URGENCY_INFO[level];
  const step = URGENCY_ORDER.indexOf(level);
  const urgent = level === 'today' || level === 'emergency';
  return (
    <section
      className={`ui-urgency ui-urgency--${level}`}
      style={{ '--u': info.color } as CSSProperties}
      role={urgent ? 'alert' : undefined}
    >
      <div className="ui-urgency__top">
        <span className="ui-urgency__badge">
          <Icon name={urgent ? 'alert' : level === 'self_care' ? 'sparkle' : 'doctor'} size={22} />
        </span>
        <div className="ui-urgency__scale" aria-hidden="true">
          {URGENCY_ORDER.map((l, i) => (
            <span key={l} className={i <= step ? 'on' : ''} />
          ))}
        </div>
      </div>
      <h2 className="ui-urgency__title">{info.title}</h2>
      <p className="ui-urgency__short">{info.short}</p>
      {reasons && reasons.length > 0 && (
        <ul className="ui-urgency__reasons">
          {reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
