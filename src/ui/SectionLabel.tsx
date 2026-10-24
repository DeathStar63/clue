import './ui.css';
import type { ReactNode } from 'react';

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="ui-label">{children}</h2>;
}
