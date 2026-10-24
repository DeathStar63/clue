import './ui.css';
import { useEffect, useState, type ReactNode } from 'react';

export interface RingProps {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  /** Centre content. */
  children?: ReactNode;
}

const clamp = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

export function Ring({ value, size = 120, stroke, color = 'var(--accent)', children }: RingProps) {
  const sw = stroke ?? Math.max(6, Math.round(size * 0.11));
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  // Start empty, then fill on the next frame so the transition plays on mount.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(clamp(value)));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div className="ui-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={sw} />
        <circle
          className="ui-ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          opacity={shown === 0 ? 0 : 1}
        />
      </svg>
      {children !== undefined && <div className="ui-ring__center">{children}</div>}
    </div>
  );
}
