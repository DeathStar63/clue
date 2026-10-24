import './ui.css';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function Chip({ children, selected, onClick }: ChipProps) {
  if (!onClick) {
    return <span className={`ui-chip${selected ? ' is-selected' : ''}`}>{children}</span>;
  }
  return (
    <button
      type="button"
      className={`ui-chip ui-chip--tap${selected ? ' is-selected' : ''}`}
      aria-pressed={!!selected}
      onClick={onClick}
    >
      {selected && <Icon name="check" size={16} />}
      {children}
    </button>
  );
}
