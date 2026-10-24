import './ui.css';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  tone?: 'default' | 'raised' | 'tinted';
  /** Any CSS colour; used by tone="tinted" for a soft background + edge. */
  tint?: string;
  className?: string;
}

export function Card({ children, onClick, tone = 'default', tint, className }: CardProps) {
  const cls = ['ui-card', `ui-card--${tone}`, onClick ? 'ui-card--tap' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  const style = tint ? ({ '--tint': tint } as CSSProperties) : undefined;

  if (!onClick) {
    return (
      <div className={cls} style={style}>
        {children}
      </div>
    );
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <div className={cls} style={style} role="button" tabIndex={0} onClick={onClick} onKeyDown={onKey}>
      {children}
    </div>
  );
}
