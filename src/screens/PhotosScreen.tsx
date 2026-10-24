import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { AlsoCheckPrompt, BodyArea, Photo, PhotoDistance } from '../types';
import type { PhotosScreenProps } from './props';
import { Button, Card, Icon, Screen, SectionLabel } from '../ui';
import { alsoCheckPrompts } from '../engine';
import { areaLabel } from '../data/bodyAreas';
import { BLUR_THRESHOLD, estimateBlur, fileToPhotoDataUrl } from '../lib/photo';
import './screensB.css';

const DISTANCES: { id: PhotoDistance; label: string }[] = [
  { id: 'far', label: 'Far' },
  { id: 'mid', label: 'Middle' },
  { id: 'close', label: 'Close' },
];

const DISTANCE_LABEL: Record<PhotoDistance, string> = {
  far: 'Far',
  mid: 'Middle',
  close: 'Close',
};

interface Target {
  area: BodyArea;
  distance: PhotoDistance;
  /** Came from an "Also check here" prompt: add the area to the case too. */
  also: boolean;
}

interface Pending extends Target {
  dataUrl: string;
}

export function PhotosScreen({ state, update, onNext, onBack, ranked }: PhotosScreenProps) {
  // Snapshot the prompts on arrival, so a prompt keeps its reason after its area
  // gets added to the case (which would drop it from a fresh alsoCheckPrompts()).
  const [prompts] = useState<AlsoCheckPrompt[]>(() => alsoCheckPrompts(state, ranked));
  const [dismissed, setDismissed] = useState<BodyArea[]>([]);
  const [chosen, setChosen] = useState<Partial<Record<BodyArea, PhotoDistance>>>({});
  const [busy, setBusy] = useState<BodyArea | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<Target | null>(null);
  // Latest case, so async work never saves over a newer version.
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  const promptAreas = new Set(prompts.map((p) => p.area));
  const mainAreas = state.areas.filter((a) => !promptAreas.has(a));

  const photosFor = (area: BodyArea) => state.photos.filter((p) => p.area === area);

  const distanceFor = (area: BodyArea): PhotoDistance => {
    const picked = chosen[area];
    if (picked) return picked;
    const have = new Set(photosFor(area).map((p) => p.distance));
    return DISTANCES.find((d) => !have.has(d.id))?.id ?? 'close';
  };

  const openPicker = (t: Target) => {
    targetRef.current = t;
    setError(null);
    inputRef.current?.click();
  };

  const save = (p: Pending) => {
    const cur = latest.current;
    const photo: Photo = {
      id: crypto.randomUUID(),
      area: p.area,
      distance: p.distance,
      dataUrl: p.dataUrl,
      takenAt: new Date().toISOString(),
    };
    const areas = p.also && !cur.areas.includes(p.area) ? [...cur.areas, p.area] : cur.areas;
    const next = { ...cur, areas, photos: [...cur.photos, photo], updatedAt: photo.takenAt };
    latest.current = next;
    update(next);
    // Move the chip on to the next missing distance.
    setChosen((c) => {
      const copy = { ...c };
      delete copy[p.area];
      return copy;
    });
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const t = targetRef.current;
    if (!file || !t) return;
    setBusy(t.area);
    try {
      const dataUrl = await fileToPhotoDataUrl(file);
      let sharp = Number.POSITIVE_INFINITY;
      try {
        sharp = await estimateBlur(dataUrl);
      } catch {
        // If the check fails, just keep the photo.
      }
      if (sharp < BLUR_THRESHOLD) setPending({ ...t, dataUrl });
      else save({ ...t, dataUrl });
    } catch {
      setError('That photo could not be read. Please try another one.');
    } finally {
      setBusy(null);
    }
  };

  const remove = (id: string) => {
    const cur = latest.current;
    const next = { ...cur, photos: cur.photos.filter((p) => p.id !== id), updatedAt: new Date().toISOString() };
    latest.current = next;
    update(next);
  };

  const renderArea = (area: BodyArea, also: boolean) => {
    const list = photosFor(area);
    const dist = distanceFor(area);
    const isBusy = busy === area;
    return (
      <div className="sb-photoarea">
        {/* Plain segmented picker, no check mark: a tick here read as "photo taken". */}
        <div className="sb-shot">
          <span className="sb-shot__label" id={`shot-${area}`}>
            Shot type:
          </span>
          <div className="sb-seg" role="group" aria-labelledby={`shot-${area}`}>
            {DISTANCES.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`sb-seg__btn${dist === d.id ? ' is-on' : ''}`}
                aria-pressed={dist === d.id}
                onClick={() => setChosen((c) => ({ ...c, [area]: d.id }))}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <Button full variant="secondary" disabled={isBusy} onClick={() => openPicker({ area, distance: dist, also })}>
          <Icon name="camera" /> {isBusy ? 'Preparing photo…' : `Add ${DISTANCE_LABEL[dist].toLowerCase()} photo`}
        </Button>
        {list.length > 0 && (
          <div className="sb-thumbs">
            {list.map((p) => (
              <figure key={p.id} className="sb-thumb">
                <img src={p.dataUrl} alt={`${areaLabel(p.area)}, ${DISTANCE_LABEL[p.distance].toLowerCase()} photo`} />
                <figcaption>{DISTANCE_LABEL[p.distance]}</figcaption>
                <button
                  type="button"
                  className="sb-thumb__del"
                  aria-label="Delete photo"
                  onClick={() => remove(p.id)}
                >
                  <Icon name="trash" size={16} />
                </button>
              </figure>
            ))}
          </div>
        )}
      </div>
    );
  };

  const visiblePrompts = prompts.filter((p) => !dismissed.includes(p.area));

  return (
    <Screen
      title="Add photos (optional)"
      onBack={onBack}
      footer={
        <Button full onClick={onNext}>
          See possible causes
        </Button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sb-hidden"
        onChange={onFile}
        tabIndex={-1}
        aria-hidden="true"
      />

      <Card tone="raised">
        <div className="sb-row">
          <span className="sb-iconwrap">
            <Icon name="camera" />
          </span>
          <div className="sb-grow">
            <h3 className="sb-h3">How to take good photos</h3>
            <p className="sb-muted">
              3 shots: far (to show where), middle, close (about 10 cm). Daylight, plain background, hold the phone
              flat to the skin, put a coin next to it for size.
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <Card tone="tinted" tint="var(--red)">
          <p>{error}</p>
        </Card>
      )}

      {pending && (
        <Card tone="tinted" tint="var(--yellow)">
          <div className="sb-blur">
            <img src={pending.dataUrl} alt="The photo you just took" className="sb-blur__img" />
            <div className="sb-grow">
              <h3 className="sb-h3">Looks a bit blurry — retake?</h3>
              <p className="sb-muted">A sharp photo helps a doctor see the detail.</p>
            </div>
          </div>
          <div className="sb-btnrow">
            <Button
              variant="secondary"
              onClick={() => {
                save(pending);
                setPending(null);
              }}
            >
              Keep
            </Button>
            <Button
              onClick={() => {
                setPending(null);
                openPicker({ area: pending.area, distance: pending.distance, also: pending.also });
              }}
            >
              Retake
            </Button>
          </div>
        </Card>
      )}

      {mainAreas.length > 0 && <SectionLabel>Your areas</SectionLabel>}
      {mainAreas.map((area) => (
        <Card key={area}>
          <h3 className="sb-h3">{areaLabel(area)}</h3>
          {renderArea(area, false)}
        </Card>
      ))}

      {visiblePrompts.length > 0 && <SectionLabel>Also check here</SectionLabel>}
      {visiblePrompts.map((p) => (
        <Card key={p.area}>
          <h3 className="sb-h3">{areaLabel(p.area)}</h3>
          <p className="sb-muted">{p.reason}</p>
          <p className="sb-small">Helps check for: {p.forConditions.join(', ')}</p>
          {renderArea(p.area, true)}
          {photosFor(p.area).length === 0 && (
            <Button full variant="ghost" onClick={() => setDismissed((d) => [...d, p.area])}>
              <Icon name="check" /> I checked — nothing there
            </Button>
          )}
        </Card>
      ))}

      <p className="sb-note">
        <Icon name="info" size={16} /> Photos stay on this phone. Clue doesn’t send them anywhere.
      </p>
    </Screen>
  );
}
