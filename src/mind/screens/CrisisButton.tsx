import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CRISIS_TITLE_ID, CrisisScreen, PhoneIcon } from './CrisisScreen';
import './mind.css';

export interface CrisisButtonProps {
  /** If given, the app handles showing the crisis screen. Otherwise this opens its own overlay. */
  onOpen?: () => void;
}

export function CrisisButton({ onOpen }: CrisisButtonProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const button = trigger.current;
    return () => {
      document.body.style.overflow = prev;
      // Give focus back to the button that opened the help screen.
      button?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="mind-crisis-btn"
        aria-haspopup={onOpen ? undefined : 'dialog'}
        onClick={() => (onOpen ? onOpen() : setOpen(true))}
      >
        <PhoneIcon size={16} />
        <span>Need help now?</span>
      </button>
      {open &&
        createPortal(
          <div className="mind-overlay" role="dialog" aria-modal="true" aria-labelledby={CRISIS_TITLE_ID}>
            <CrisisScreen onClose={() => setOpen(false)} />
          </div>,
          document.body,
        )}
    </>
  );
}
