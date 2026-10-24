import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Icon, Screen, SectionLabel } from '../ui';
import { extractAreas, extractFeatures } from '../engine';
import { featureLabel } from '../data/features';
import { areaLabel } from '../data/bodyAreas';
import type { Answers, BodyArea, FeatureId } from '../types';
import type { DescribeScreenProps } from './props';
import { aiAvailable, aiExtract, aiOptIn, setAiOptIn } from '../lib/ai';
import './screensA.css';

export function DescribeScreen({ state, update, onNext, onBack }: DescribeScreenProps) {
  const [text, setText] = useState(state.complaint);
  const [debounced, setDebounced] = useState(state.complaint);
  const [removedFeatures, setRemovedFeatures] = useState<FeatureId[]>([]);
  const [removedAreas, setRemovedAreas] = useState<BodyArea[]>([]);

  // Optional AI reading. Only exists when the relay URL is configured.
  const showAi = aiAvailable();
  const [aiOn, setAiOn] = useState(() => showAi && aiOptIn());
  const [aiFeatures, setAiFeatures] = useState<FeatureId[]>([]);
  const [aiAreas, setAiAreas] = useState<BodyArea[]>([]);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const aiCtrl = useRef<AbortController | null>(null);

  useEffect(() => () => aiCtrl.current?.abort(), []);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(text), 300);
    return () => window.clearTimeout(id);
  }, [text]);

  const keywordFeatures = useMemo(() => (debounced.trim() ? extractFeatures(debounced) : []), [debounced]);
  const keywordAreas = useMemo(() => (debounced.trim() ? extractAreas(debounced) : []), [debounced]);
  const features = useMemo(
    () => union(keywordFeatures, aiFeatures).filter((f) => !removedFeatures.includes(f)),
    [keywordFeatures, aiFeatures, removedFeatures],
  );
  const areas = useMemo(
    () => union(keywordAreas, aiAreas).filter((a) => !removedAreas.includes(a)),
    [keywordAreas, aiAreas, removedAreas],
  );

  const toggleAi = () => {
    const on = !aiOn;
    setAiOn(on);
    setAiOptIn(on);
    if (!on) {
      aiCtrl.current?.abort();
      aiCtrl.current = null;
      setAiFeatures([]);
      setAiAreas([]);
      setAiStatus('idle');
    }
  };

  const readWithAi = async () => {
    aiCtrl.current?.abort();
    const ctrl = new AbortController();
    aiCtrl.current = ctrl;
    setAiStatus('loading');
    try {
      const out = await aiExtract(text, { signal: ctrl.signal });
      if (ctrl.signal.aborted) return;
      setAiFeatures(out.features);
      setAiAreas(out.areas);
      setAiStatus('idle');
    } catch {
      if (!ctrl.signal.aborted) setAiStatus('error');
    } finally {
      if (aiCtrl.current === ctrl) aiCtrl.current = null;
    }
  };

  const next = () => {
    // Next never waits for the AI: use whatever is picked right now.
    aiCtrl.current?.abort();
    aiCtrl.current = null;
    // Use the latest text, even if the debounce hasn't fired yet.
    const finalText = text.trim();
    const useAi = aiOn && finalText !== '';
    const feats = finalText
      ? union(extractFeatures(finalText), useAi ? aiFeatures : []).filter((f) => !removedFeatures.includes(f))
      : [];
    const found = finalText
      ? union(extractAreas(finalText), useAi ? aiAreas : []).filter((a) => !removedAreas.includes(a))
      : [];
    const answers: Answers = { ...state.answers };
    for (const f of feats) if (answers[f] === undefined) answers[f] = 'yes';
    const allAreas = [...state.areas];
    for (const a of found) if (!allAreas.includes(a)) allAreas.push(a);
    update({ ...state, complaint: finalText, answers, areas: allAreas, updatedAt: new Date().toISOString() });
    onNext();
  };

  const hasPicks = features.length > 0 || areas.length > 0;

  return (
    <Screen
      title="What’s bothering you?"
      onBack={onBack}
      footer={
        <Button full onClick={next}>
          {text.trim() ? 'Next' : 'Skip'}
        </Button>
      }
    >
      <p className="sa-lead">Tell us in your own words. Where is it, what does it look and feel like, when did it start, and what makes it better or worse?</p>
      <textarea
        className="sa-textarea"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. itchy red rings on my thigh for 3 weeks, worse when sweaty"
        aria-label="Describe it in your own words"
      />

      {showAi && (
        <Card className="sa-ai">
          <div className="sa-ai__row">
            <span className="sa-ai__label" id="sa-ai-label">
              Use AI to understand my words
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={aiOn}
              aria-labelledby="sa-ai-label"
              className={`sa-switch${aiOn ? ' sa-switch--on' : ''}`}
              onClick={toggleAi}
            >
              <span className="sa-switch__thumb" />
            </button>
          </div>
          <p className="sa-ai__note">
            Sends only what you type here to an AI service (Google Gemini or Anthropic Claude) through Clue’s server, to
            pick out your symptoms. Don’t include your name or phone number. The AI never decides anything — Clue’s
            safety rules and questions do.
          </p>
          {aiOn && text.trim() !== '' && (
            <div className="sa-ai__action">
              <Button variant="secondary" onClick={readWithAi} disabled={aiStatus === 'loading'}>
                <Icon name="sparkle" size={18} />
                {aiStatus === 'loading' ? 'Reading…' : 'Read it with AI'}
              </Button>
            </div>
          )}
          {aiOn && aiStatus === 'error' && (
            <p className="sa-muted" role="status">
              Couldn’t reach the AI — we’ll use Clue’s built-in reading instead.
            </p>
          )}
        </Card>
      )}

      {hasPicks && (
        <section className="sa-picks" aria-live="polite">
          <SectionLabel>We picked up:</SectionLabel>
          <div className="sa-chips">
            {areas.map((a) => (
              <span key={`a-${a}`} className="sa-pick sa-pick--area">
                {aiOn && aiAreas.includes(a) && !keywordAreas.includes(a) && <AiMark />}
                {areaLabel(a)}
                <button
                  type="button"
                  aria-label={`Remove ${areaLabel(a)}`}
                  onClick={() => setRemovedAreas((r) => [...r, a])}
                >
                  <Icon name="close" size={14} />
                </button>
              </span>
            ))}
            {features.map((f) => (
              <span key={`f-${f}`} className="sa-pick">
                {aiOn && aiFeatures.includes(f) && !keywordFeatures.includes(f) && <AiMark />}
                {featureLabel(f)}
                <button
                  type="button"
                  aria-label={`Remove ${featureLabel(f)}`}
                  onClick={() => setRemovedFeatures((r) => [...r, f])}
                >
                  <Icon name="close" size={14} />
                </button>
              </span>
            ))}
          </div>
          <p className="sa-muted">Tap × on anything we got wrong.</p>
        </section>
      )}
      {!hasPicks && <p className="sa-muted">Not sure what to write? You can skip this. Next we’ll do a quick safety check, then ask simple questions.</p>}
    </Screen>
  );
}

function union<T>(a: T[], b: T[]): T[] {
  const out = [...a];
  for (const x of b) if (!out.includes(x)) out.push(x);
  return out;
}

/** Small sparkle on chips the AI found (and the keyword reading didn't). */
function AiMark() {
  return (
    <span className="sa-pick__ai" title="Found by AI">
      <Icon name="sparkle" size={13} />
      <span className="visually-hidden">Found by AI: </span>
    </span>
  );
}
