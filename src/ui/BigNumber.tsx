import './ui.css';
import type { ReactNode } from 'react';

export interface BigNumberProps {
  children: ReactNode;
  unit?: string;
}

export function BigNumber({ children, unit }: BigNumberProps) {
  return (
    <span className="ui-bignum">
      {children}
      {unit && <span className="ui-bignum__unit">{unit}</span>}
    </span>
  );
}
