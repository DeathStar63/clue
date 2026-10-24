import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ProgressBar } from '../../ui';
import type { InstrumentItem, ResponseOption } from '../types';
import './mind.css';

export interface QuestionPagerProps {
  stem?: string;
  title: string;
  subtitle?: string;
  /**
   * Items to page through. May be the full list (answered ones are skipped forward, reachable with
   * "Previous") or only the unanswered ones (the list shrinks as answers come in) — both work.
   */
  items: InstrumentItem[];
  optionsFor: (item: InstrumentItem) => ResponseOption[];
  onAnswer: (itemId: string, value: number) => void;
  /** 0..1 overall progress shown at the top. */
  progress: number;
  /** Answers already given (itemId → value). Used to resume and to show the picked option. */
  values?: Record<string, number>;
  /** Small extra content next to the title, e.g. an origin badge. */
  badge?: ReactNode;
  /** Overrides "Question X of N" (useful when `items` only holds the unanswered ones). */
  countLabel?: string;
}

const ADVANCE_MS = 280;

function firstOpen(items: InstrumentItem[], values: Record<string, number> | undefined, skipId?: string, after = -1) {
  const isOpen = (it: InstrumentItem) => it.id !== skipId && values?.[it.id] === undefined;
  // Prefer the next open item after `after`, then wrap round to any open one.
  return items.find((it, i) => i > after && isOpen(it)) ?? items.find(isOpen);
}

/** One item per page, big full-width options, auto-advances on tap. Key it by instrument/gateway id. */
export function QuestionPager({
  stem,
  title,
  subtitle,
  items,
  optionsFor,
  onAnswer,
  progress,
  values,
  badge,
  countLabel,
}: QuestionPagerProps) {
  const [currentId, setCurrentId] = useState<string | null>(() => firstOpen(items, values)?.id ?? items[0]?.id ?? null);
  const [pending, setPending] = useState<{ item: InstrumentItem; value: number } | null>(null);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const timer = useRef<number | null>(null);
  const latest = useRef({ items, values });

  useEffect(() => {
    latest.current = { items, values };
  }, [items, values]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const resolved =
    items.find((it) => it.id === currentId) ?? firstOpen(items, values) ?? items[items.length - 1];
  const item = pending?.item ?? resolved;
  if (!item) return null;

  const position = items.findIndex((it) => it.id === item.id);
  const options = optionsFor(item);
  const shown = pending ? pending.value : values?.[item.id];

  const pick = (value: number) => {
    if (timer.current !== null) return; // still moving on from the last tap
    const answered = item;
    setPending({ item: answered, value });
    onAnswer(answered.id, value);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const { items: nowItems, values: nowValues } = latest.current;
      const at = nowItems.findIndex((it) => it.id === answered.id);
      const next = firstOpen(nowItems, nowValues, answered.id, at);
      setDir('fwd');
      setCurrentId(next?.id ?? answered.id);
      setPending(null);
    }, ADVANCE_MS);
  };

  const goBack = () => {
    if (position <= 0 || timer.current !== null) return;
    setDir('back');
    setCurrentId(items[position - 1].id);
  };

  return (
    <div className="mind-pager">
      <div className="mind-pager__head">
        <ProgressBar value={progress} />
        <div className="mind-pager__titlerow">
          <h2 className="mind-pager__title">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="mind-pager__subtitle">{subtitle}</p>}
      </div>

      <div key={item.id} className={`mind-pager__page mind-pager__page--${dir}`}>
        {stem && <p className="mind-pager__stem">{stem}</p>}
        <p className="mind-pager__q">{item.text}</p>
        <p className="mind-pager__count">
          {countLabel ?? `Question ${Math.max(position, 0) + 1} of ${items.length}`}
        </p>
        <div className="mind-pager__options" role="radiogroup" aria-label={item.text}>
          {options.map((o) => {
            const on = shown === o.value;
            return (
              <button
                key={`${o.value}-${o.label}`}
                type="button"
                role="radio"
                aria-checked={on}
                className={`mind-option${on ? ' is-on' : ''}`}
                onClick={() => pick(o.value)}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {position > 0 && !pending && (
        <button type="button" className="mind-textbtn" onClick={goBack}>
          Previous question
        </button>
      )}
    </div>
  );
}
