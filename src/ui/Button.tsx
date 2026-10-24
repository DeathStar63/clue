import './ui.css';
import type { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  full?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({ children, onClick, variant = 'primary', full, disabled, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn--${variant}${full ? ' ui-btn--full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
