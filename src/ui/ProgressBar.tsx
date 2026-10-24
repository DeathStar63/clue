import './ui.css';
export interface ProgressBarProps {
  /** 0..1 */
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = 'var(--accent)' }: ProgressBarProps) {
  const v = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  return (
    <div
      className="ui-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
    >
      <div className="ui-progress__fill" style={{ transform: `scaleX(${v})`, background: color }} />
    </div>
  );
}
