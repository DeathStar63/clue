import { useEffect, useRef, type ReactNode } from 'react';
import { Screen } from '../../ui';
import { EMERGENCY, HELPLINES, HELPLINES_CHECKED } from '../helplines';
import type { Helpline, RiskKind, RiskResult } from '../types';
import type { CrisisScreenProps } from './props';
import './mind.css';

const TELE_MANAS = HELPLINES.find((h) => h.tel === '14416') ?? HELPLINES[0];
const DOCTOR_TODAY: RiskKind[] = ['psychosis', 'mania', 'postpartum', 'eating', 'withdrawal', 'confusion'];

/** Simple phone glyph (the shared Icon set has no phone). */
export function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      className="mind-phone-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

/** One-tap call button. */
export function CallLink({ line, big, primary }: { line: Helpline; big?: boolean; primary?: boolean }) {
  const cls = ['mind-call', big ? 'mind-call--big' : '', primary ? 'mind-call--primary' : ''].filter(Boolean).join(' ');
  return (
    <a className={cls} href={`tel:${line.tel}`}>
      <span className="mind-call__icon">
        <PhoneIcon size={big ? 26 : 20} />
      </span>
      <span className="mind-call__text">
        <span className="mind-call__name">
          {big ? `Call ${line.number}` : line.name}
        </span>
        <span className="mind-call__meta">{big ? `${line.name} · ${line.hours}` : `${line.number} · ${line.hours}`}</span>
      </span>
    </a>
  );
}

/** Id of the crisis screen heading, for aria-labelledby on a dialog wrapping it. */
export const CRISIS_TITLE_ID = 'mind-crisis-title';

/** Turns toll-free numbers written in a note (e.g. 1-800-891-4416) into tap-to-call links. */
function NoteText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\b1-800-\d{3}-\d{4}\b/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    parts.push(text.slice(last, at));
    parts.push(
      <a key={at} className="mind-link" href={`tel:${m[0].replace(/\D/g, '')}`}>
        {m[0]}
      </a>,
    );
    last = at + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

/**
 * Plain-words line that matches the kind of risk found. Renders nothing when there are no flags.
 * `hideSuicideLine` drops the "call now" line when the screen already says it.
 */
export function RiskMessage({ risk, hideSuicideLine }: { risk?: RiskResult; hideSuicideLine?: boolean }) {
  if (!risk || risk.level === 'none' || risk.flags.length === 0) return null;
  const kinds = new Set(risk.flags.map((f) => f.kind));
  const doctorToday = DOCTOR_TODAY.some((k) => kinds.has(k));
  const suicideLine = kinds.has('suicide') && !hideSuicideLine;
  if (!suicideLine && !doctorToday) return null;
  return (
    <div className="mind-risk-msg">
      {suicideLine && (
        <p>
          <strong>If you might act on thoughts of harming yourself, call now.</strong> Tele-MANAS (14416) is free,
          private and open all day and night.
        </p>
      )}
      {doctorToday && (
        <p>
          <strong>These signs need a doctor today.</strong> Go to the nearest hospital emergency or call 112 / 14416.
        </p>
      )}
    </div>
  );
}

export function CrisisScreen({ risk, onClose }: CrisisScreenProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  // Move focus to the heading so screen readers and keyboards start here.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const others = HELPLINES.filter((h) => h.tel !== TELE_MANAS.tel && h.tel !== EMERGENCY.tel);

  return (
    <Screen
      right={
        <button type="button" className="mind-close" onClick={onClose}>
          Close
        </button>
      }
    >
      <div className="mind-crisis">
        <h1 id={CRISIS_TITLE_ID} ref={titleRef} tabIndex={-1} className="mind-crisis__title">
          You don't have to handle this alone.
        </h1>
        <p className="mind-crisis__lead">
          If you might act on thoughts of harming yourself, or someone is in danger, call now.
        </p>

        <RiskMessage risk={risk} hideSuicideLine />

        <div className="mind-crisis__calls">
          <CallLink line={TELE_MANAS} big primary />
          {TELE_MANAS.note && (
            <p className="mind-small">
              <NoteText text={TELE_MANAS.note} />
            </p>
          )}
          <CallLink line={EMERGENCY} big />
        </div>

        {others.length > 0 && (
          <div className="mind-crisis__others">
            <h2 className="mind-crisis__h2">Other free helplines</h2>
            {others.map((h) => (
              <div key={h.tel}>
                <CallLink line={h} />
                {h.note && (
                  <p className="mind-small mind-small--indent">
                    <NoteText text={h.note} />
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mind-crisis__steps">
          <h2 className="mind-crisis__h2">Right now, it can help to</h2>
          <ul>
            <li>Stay with someone you trust or go where people are.</li>
            <li>Put distance between you and anything you could use to hurt yourself.</li>
            <li>Tell someone: “I'm not okay and I need help.”</li>
          </ul>
        </div>

        <p className="mind-crisis__law">
          In India, attempting suicide is not treated as a crime — you can safely ask for help. (Mental Healthcare Act,
          2017)
        </p>

        <p className="mind-small">Numbers last checked: {HELPLINES_CHECKED}</p>
      </div>
    </Screen>
  );
}
