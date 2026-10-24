import { useId, useState, type KeyboardEvent } from 'react';
import { areaLabel, type BodyArea } from '../data/bodyAreas';
import { Chip } from './Chip';
import { SectionLabel } from './SectionLabel';
import './BodyMap.css';

export interface BodyMapProps {
  selected: BodyArea[];
  onToggle: (area: BodyArea) => void;
}

type Side = 'front' | 'back';
type Part = 'head' | 'torso' | 'arm' | 'leg';

/**
 * One tappable region. `d` is a loose band that gets clipped to the smooth
 * silhouette of `clip`, so region edges inside the body stay simple while the
 * outline stays soft. Paired regions are drawn on the screen-left half and
 * mirrored into their own element for the other side.
 */
interface Region {
  area: BodyArea;
  d: string;
  clip?: Part;
  paired?: boolean;
}

// Figure drawn in a 200 x 460 box, centred on x = 100. Silhouette parts are the screen-left half.
const SIL = {
  head: ['M100,14 C112,14 120,24 120,38 C120,53 111,64 100,64 C89,64 80,53 80,38 C80,24 88,14 100,14 Z'],
  torso: [
    'M93,58 C93,68 92,74 89,79 C80,81 70,83 63,88 C60,100 64,110 66,124 C68,150 72,172 71,192 C70,210 63,224 62,240 C62,250 64,258 70,264 L100,266 L100,58 Z',
  ],
  arm: [
    'M66,86 C56,86 49,94 48,106 C46,128 42,148 40,164 C38,190 35,212 33,240 L50,240 C51,214 55,192 57,168 C59,150 62,132 64,114 Z',
  ],
  leg: [
    'M62,238 C60,270 64,305 69,338 C71,352 70,368 72,384 C74,400 77,414 79,430 L91,430 C91,414 90,400 91,384 C92,368 93,354 93,340 C95,310 98,285 99,262 Z',
  ],
} satisfies Record<Part, string[]>;

const HAND = 'M33,238 C31,248 29,260 33,270 C36,277 44,278 47,271 C51,262 52,250 50,238 Z';
const FOOT = 'M79,426 C77,434 71,441 68,446 C66,451 73,454 82,453 C88,452 92,449 92,443 L91,426 Z';

const ARMS: Region[] = [
  { area: 'upper_arms', clip: 'arm', paired: true, d: 'M70,80 L44,86 L38,150 L62,150 Z' },
  { area: 'elbows', clip: 'arm', paired: true, d: 'M64,150 L36,150 L33,176 L60,176 Z' },
  { area: 'forearms_wrists', clip: 'arm', paired: true, d: 'M61,176 L32,176 L28,241 L54,241 Z' },
  { area: 'hands', paired: true, d: HAND },
];

const LEGS: Region[] = [
  { area: 'thighs', clip: 'leg', paired: true, d: 'M56,234 L102,234 L98,334 L64,334 Z' },
  { area: 'knees', clip: 'leg', paired: true, d: 'M62,334 L98,334 L96,360 L64,360 Z' },
  { area: 'shins', clip: 'leg', paired: true, d: 'M64,360 L96,360 L94,428 L74,428 Z' },
  { area: 'feet', paired: true, d: FOOT },
];

const NECK: Region = { area: 'neck', clip: 'torso', d: 'M84,60 L116,60 L116,80 C110,85 90,85 84,80 Z' };

const FRONT: Region[] = [
  ...LEGS,
  { area: 'scalp', clip: 'head', d: 'M76,10 L124,10 L124,31 C116,26 108,24 100,24 C92,24 84,26 76,31 Z' },
  { area: 'face', clip: 'head', d: 'M76,31 C84,26 92,24 100,24 C108,24 116,26 124,31 L124,66 L76,66 Z' },
  { area: 'chest', clip: 'torso', d: 'M52,76 L148,76 L148,148 L52,148 Z' },
  NECK,
  { area: 'abdomen', clip: 'torso', d: 'M52,148 L148,148 L148,208 L52,208 Z' },
  { area: 'groin', clip: 'torso', d: 'M52,208 L148,208 L148,268 L52,268 Z' },
  { area: 'genitals', d: 'M94,250 C94,244 106,244 106,250 L105,257 C103,264 97,264 95,257 Z' },
  ...ARMS,
  { area: 'armpits', paired: true, d: 'M64,96 C70,100 71,110 68,120 C64,118 62,108 64,96 Z' },
];

const BACK: Region[] = [
  ...LEGS,
  { area: 'scalp', clip: 'head', d: 'M76,10 L124,10 L124,66 L76,66 Z' },
  { area: 'back', clip: 'torso', d: 'M52,76 L148,76 L148,208 L52,208 Z' },
  NECK,
  { area: 'buttocks', clip: 'torso', d: 'M52,208 L148,208 L148,268 L52,268 Z' },
  ...ARMS,
];

const SMALL_AREAS: BodyArea[] = [
  'eyebrows_beard',
  'ears',
  'mouth',
  'fingernails',
  'finger_webs',
  'toenails',
  'toe_webs',
];

const MIRROR = 'translate(200 0) scale(-1 1)';

/** The screen-left half is the person's right in front view and their left in back view. */
function sideName(view: Side, mirrored: boolean): string {
  const screenLeft = !mirrored;
  const front = view === 'front';
  return front === screenLeft ? 'right' : 'left';
}

export function BodyMap({ selected, onToggle }: BodyMapProps) {
  const [side, setSide] = useState<Side>('front');
  const uid = useId().replace(/:/g, '');
  const isOn = (a: BodyArea) => selected.includes(a);
  const regions = side === 'front' ? FRONT : BACK;
  const clipId = (p: Part) => `bm-${uid}-${p}`;

  const onKey = (e: KeyboardEvent<SVGGElement>, area: BodyArea) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(area);
    }
  };

  const renderRegion = (r: Region, mirrored: boolean) => {
    const on = isOn(r.area);
    const label = r.paired ? `${areaLabel(r.area)} (${sideName(side, mirrored)})` : areaLabel(r.area);
    return (
      <g
        key={`${r.area}${mirrored ? '-m' : ''}`}
        className={`ui-bodymap__region${on ? ' is-on' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={on}
        aria-label={label}
        data-area={r.area}
        transform={mirrored ? MIRROR : undefined}
        onClick={() => onToggle(r.area)}
        onKeyDown={(e) => onKey(e, r.area)}
      >
        <title>{label}</title>
        <g clipPath={r.clip ? `url(#${clipId(r.clip)})` : undefined}>
          <path d={r.d} />
        </g>
      </g>
    );
  };

  return (
    <div className="ui-bodymap">
      <div className="ui-seg" role="tablist" aria-label="Body side">
        {(['front', 'back'] as Side[]).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={side === s}
            className={`ui-seg__btn${side === s ? ' is-active' : ''}`}
            onClick={() => setSide(s)}
          >
            {s === 'front' ? 'Front' : 'Back'}
          </button>
        ))}
        <span className={`ui-seg__thumb${side === 'back' ? ' is-right' : ''}`} aria-hidden="true" />
      </div>

      <svg
        className="ui-bodymap__figure"
        viewBox="0 0 200 460"
        role="group"
        aria-label={`Body, ${side} view. Tap an area to select it.`}
      >
        <defs>
          {(Object.keys(SIL) as Part[]).map((p) => (
            <clipPath key={p} id={clipId(p)} clipPathUnits="userSpaceOnUse">
              {SIL[p].map((d, i) => (
                <path key={i} d={d} />
              ))}
              {p !== 'arm' && p !== 'leg' && SIL[p].map((d, i) => <path key={`m${i}`} d={d} transform={MIRROR} />)}
            </clipPath>
          ))}
        </defs>

        {/* Soft base silhouette so no seams show between regions. */}
        <g className="ui-bodymap__base" aria-hidden="true">
          {[...SIL.head, ...SIL.torso, ...SIL.arm, ...SIL.leg, HAND, FOOT].map((d, i) => (
            <g key={i}>
              <path d={d} />
              <path d={d} transform={MIRROR} />
            </g>
          ))}
        </g>

        {regions.map((r) => (r.paired ? [renderRegion(r, false), renderRegion(r, true)] : renderRegion(r, false)))}

        {side === 'back' && (
          <path className="ui-bodymap__detail" d="M100,226 C100,240 100,252 100,264" aria-hidden="true" />
        )}
      </svg>

      <div className="ui-bodymap__small">
        <SectionLabel>Small areas</SectionLabel>
        <div className="ui-bodymap__chips">
          {SMALL_AREAS.map((a) => (
            <Chip key={a} selected={isOn(a)} onClick={() => onToggle(a)}>
              {areaLabel(a)}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
