import { useEffect, useMemo, useState } from 'react';
import { Button, Icon, Screen, SectionLabel } from '../ui';
import { extractAreas, extractFeatures } from '../engine';
import { featureLabel } from '../data/features';
import { areaLabel } from '../data/bodyAreas';
import type { Answers, BodyArea, FeatureId } from '../types';
import type { DescribeScreenProps } from './props';
import './screensA.css';

export function DescribeScreen({ state, update, onNext, onBack }: DescribeScreenProps) {
  const [text, setText] = useState(state.complaint);
  const [debounced, setDebounced] = useState(state.complaint);
  const [removedFeatures, setRemovedFeatures] = useState<FeatureId[]>([]);
  const [removedAreas, setRemovedAreas] = useState<BodyArea[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(text), 300);
    return () => window.clearTimeout(id);
  }, [text]);

  const features = useMemo(
    () => (debounced.trim() ? extractFeatures(debounced) : []).filter((f) => !removedFeatures.includes(f)),
    [debounced, removedFeatures],
  );
  const areas = useMemo(
    () => (debounced.trim() ? extractAreas(debounced) : []).filter((a) => !removedAreas.includes(a)),
    [debounced, removedAreas],
  );

  const next = () => {
    // Use the latest text, even if the debounce hasn't fired yet.
    const finalText = text.trim();
    const feats = finalText
      ? extractFeatures(finalText).filter((f) => !removedFeatures.includes(f))
      : [];
    const found = finalText ? extractAreas(finalText).filter((a) => !removedAreas.includes(a)) : [];
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
      title="Tell us in your own words"
      onBack={onBack}
      footer={
        <Button full onClick={next}>
          {text.trim() ? 'Next' : 'Skip'}
        </Button>
      }
    >
      <p className="sa-lead">What does it look and feel like? When did it start? Anything that makes it better or worse?</p>
      <textarea
        className="sa-textarea"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. itchy red rings on my thigh for 3 weeks, worse when sweaty"
        aria-label="Describe it in your own words"
      />

      {hasPicks && (
        <section className="sa-picks" aria-live="polite">
          <SectionLabel>We picked up:</SectionLabel>
          <div className="sa-chips">
            {areas.map((a) => (
              <span key={`a-${a}`} className="sa-pick sa-pick--area">
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
      {!hasPicks && <p className="sa-muted">Not sure what to write? You can skip this — we’ll ask simple questions next.</p>}
    </Screen>
  );
}
