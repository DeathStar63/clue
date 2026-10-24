import './ui.css';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

export interface ScreenProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Screen({ title, onBack, right, children, footer }: ScreenProps) {
  const hasBar = Boolean(title || onBack || right);
  return (
    <div className="ui-screen">
      {hasBar && (
        <header className="ui-topbar">
          <div className={`ui-topbar__inner${right ? ' ui-topbar__inner--right' : ''}`}>
            <div className="ui-topbar__side ui-topbar__side--left">
              {onBack && (
                <button type="button" className="ui-iconbtn" onClick={onBack} aria-label="Back">
                  <Icon name="back" size={24} />
                </button>
              )}
            </div>
            {title ? (
              <h1 className="ui-topbar__title" title={title}>
                {title}
              </h1>
            ) : (
              <span aria-hidden="true" />
            )}
            <div className="ui-topbar__side ui-topbar__side--right">{right}</div>
          </div>
        </header>
      )}
      <main className={`ui-screen__body${hasBar ? '' : ' ui-screen__body--nobar'}`}>{children}</main>
      {footer && (
        <footer className="ui-screen__footer">
          <div className="ui-screen__footer-inner">{footer}</div>
        </footer>
      )}
    </div>
  );
}
