import { useState } from 'react';
import { Button, Screen } from '../../ui';
import { CONTEXT_QUESTIONS } from '../context';
import { resultText } from '../index';
import { instrumentById } from '../instruments';
import type { Instrument, InstrumentResult, MindCase } from '../types';
import { CrisisButton } from './CrisisButton';
import type { MindSummaryScreenProps } from './props';
import './mind.css';

const SEX_WORD = { female: 'Female', male: 'Male', other: 'Other' } as const;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function labelFor(inst: Instrument, itemId: string, value: number): string {
  const item = inst.items.find((i) => i.id === itemId);
  const opts = item?.options ?? inst.options;
  return opts.find((o) => o.value === value)?.label ?? String(value);
}

interface Block {
  id: string;
  inst?: Instrument;
  result?: InstrumentResult;
  rows: { q: string; a: string }[];
}

function buildBlocks(state: MindCase, results: InstrumentResult[]): Block[] {
  return Object.entries(state.responses).map(([id, answers]) => {
    const inst = instrumentById(id);
    const order = inst ? inst.items.map((i) => i.id) : Object.keys(answers);
    const rows = order
      .filter((itemId) => answers[itemId] !== undefined)
      .map((itemId) => ({
        q: inst?.items.find((i) => i.id === itemId)?.text ?? itemId,
        a: inst ? labelFor(inst, itemId, answers[itemId]) : String(answers[itemId]),
      }));
    return { id, inst, result: results.find((r) => r.instrumentId === id), rows };
  });
}

export function MindSummaryScreen({ state, results, ranked, risk, onBack }: MindSummaryScreenProps) {
  const [copied, setCopied] = useState(false);
  const blocks = buildBlocks(state, results);
  const possible = ranked.filter((r) => r.band !== 'less_likely');
  const contextRows = CONTEXT_QUESTIONS.filter((q) => state.context[q.key] !== undefined).map((q) => ({
    q: q.text,
    a: state.context[q.key] ? 'Yes' : 'No',
  }));
  const safety =
    risk.level === 'none' || risk.flags.length === 0
      ? ['No safety concerns reported — but please ask.']
      : risk.flags.map((f) => `${f.level === 'urgent' ? 'Urgent' : 'Needs attention'}: ${f.reason}`);
  const about = [
    state.age !== undefined ? `Age ${state.age}` : 'Age not given',
    state.sex ? SEX_WORD[state.sex] : 'Sex not given',
    state.perinatal === true ? 'Pregnant or had a baby in the last year' : null,
  ].filter(Boolean) as string[];

  const asText = () => {
    const out: string[] = [`For your doctor — Clue Mind check, ${fmtDate(state.updatedAt)}`, about.join(' · '), ''];
    out.push('Safety:', ...safety.map((s) => `- ${s}`), '');
    for (const b of blocks) {
      const head = b.inst ? `${b.inst.shortName} (${b.inst.name})` : b.id;
      out.push(b.result ? `${head}: ${resultText(b.result, b.inst)}` : `${head}: partly answered`);
      for (const r of b.rows) out.push(`  ${r.q} — ${r.a}`);
      out.push('');
    }
    if (contextRows.length) out.push('Background:', ...contextRows.map((r) => `- ${r.q} ${r.a}`), '');
    if (possible.length) {
      out.push('For discussion, not a diagnosis:', ...possible.map((r) => `- ${r.condition.name} (${r.band})`), '');
    }
    out.push('Screening questionnaires only. Not a diagnosis.');
    return out.join('\n');
  };

  const share = async () => {
    const text = asText();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Check summary', text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  const citations = blocks.filter((b) => b.inst).map((b) => b.inst as Instrument);

  return (
    <Screen
      title="For your doctor"
      onBack={onBack}
      right={<CrisisButton />}
      footer={
        <div className="mind-row mind-noprint">
          <Button variant="secondary" full onClick={share}>
            {copied ? 'Copied' : 'Share'}
          </Button>
          <Button full onClick={() => window.print()}>
            Print / Save as PDF
          </Button>
        </div>
      }
    >
      <article className="mind-summary">
        <header className="mind-summary__head">
          <h1 className="mind-summary__title">For your doctor</h1>
          <p className="mind-small">
            Clue Mind check · {fmtDate(state.updatedAt)} · {about.join(' · ')}
          </p>
          <p className="mind-small mind-small--muted">
            Screening questionnaires filled in by the person. Not a diagnosis.
          </p>
        </header>

        <section className="mind-summary__sec">
          <h2 className="mind-summary__h">Safety</h2>
          <ul className="mind-list mind-list--tight">
            {safety.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        {blocks.map((b) => (
          <section key={b.id} className="mind-summary__sec">
            <h2 className="mind-summary__h">
              {b.inst ? b.inst.shortName : b.id}
              {b.result ? (
                <span className="mind-summary__score">
                  {' '}
                  — {resultText(b.result, b.inst)}
                </span>
              ) : (
                <span className="mind-summary__score"> — partly answered (quick check)</span>
              )}
            </h2>
            {b.inst && <p className="mind-small mind-small--muted">{b.inst.name}</p>}
            <table className="mind-table">
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.q}</td>
                    <td>{r.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        {contextRows.length > 0 && (
          <section className="mind-summary__sec">
            <h2 className="mind-summary__h">Background</h2>
            <table className="mind-table">
              <tbody>
                {contextRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.q}</td>
                    <td>{r.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {possible.length > 0 && (
          <section className="mind-summary__sec">
            <h2 className="mind-summary__h">Possible patterns (for discussion, not a diagnosis)</h2>
            <ul className="mind-list mind-list--tight">
              {possible.map((r) => (
                <li key={r.condition.id}>
                  {r.condition.name} — {r.band === 'strong' ? 'strong' : 'possible'} match
                  {r.fitsBecause.length > 0 && <span className="mind-small"> ({r.fitsBecause.join('; ')})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {citations.length > 0 && (
          <section className="mind-summary__sec">
            <h2 className="mind-summary__h">Questionnaires used</h2>
            <ul className="mind-list mind-list--tight mind-small">
              {citations.map((c) => (
                <li key={c.id}>
                  {c.shortName}
                  {c.origin === 'clue' ? ' (Clue check questions, not a validated tool)' : ''}: {c.citation}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </Screen>
  );
}
