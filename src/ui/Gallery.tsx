import { useState } from 'react';
import type { BodyArea, UrgencyLevel } from '../types';
import {
  BigNumber,
  BodyMap,
  Button,
  Card,
  Chip,
  Icon,
  ProgressBar,
  Ring,
  Screen,
  SectionLabel,
  URGENCY_INFO,
  URGENCY_ORDER,
  UrgencyCard,
  type IconName,
} from './index';

const ICONS: IconName[] = [
  'back', 'chevron', 'close', 'check', 'alert', 'info', 'camera', 'image', 'share',
  'plus', 'trash', 'doctor', 'flask', 'clock', 'list', 'sparkle', 'body',
];

/** Dev-only showcase of every UI component. Not wired into the app. */
export function Gallery() {
  const [areas, setAreas] = useState<BodyArea[]>(['face', 'hands', 'fingernails']);
  const [chip, setChip] = useState(true);
  const [level, setLevel] = useState<UrgencyLevel>('soon');
  const [ring, setRing] = useState(0.72);

  const toggle = (a: BodyArea) =>
    setAreas((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  return (
    <Screen
      title="Gallery"
      onBack={() => {}}
      right={
        <button type="button" className="ui-iconbtn" aria-label="Share">
          <Icon name="share" />
        </button>
      }
      footer={
        <Button full onClick={() => setRing(Math.round(Math.random() * 100) / 100)}>
          Shuffle ring
        </Button>
      }
    >
      <SectionLabel>Rings + big numbers</SectionLabel>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Ring value={ring} size={112}>
            <BigNumber unit="%">{Math.round(ring * 100)}</BigNumber>
          </Ring>
          <Ring value={0.4} size={64} color={URGENCY_INFO.routine.color} />
          <Ring value={0.9} size={44} stroke={6} color={URGENCY_INFO.self_care.color} />
          <div>
            <BigNumber unit="days">3</BigNumber>
            <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>Since it started</p>
          </div>
        </div>
      </Card>

      <SectionLabel>Cards</SectionLabel>
      <Card onClick={() => {}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="doctor" />
          <div style={{ flex: 1 }}>
            <strong>Tappable card</strong>
            <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Press to see the scale effect.</p>
          </div>
          <Icon name="chevron" size={18} />
        </div>
      </Card>
      <Card tone="raised">Raised card</Card>
      <Card tone="tinted" tint={URGENCY_INFO.today.color}>
        Tinted card (today orange)
      </Card>

      <SectionLabel>Buttons</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button full>Primary</Button>
        <Button full variant="secondary">
          <Icon name="camera" /> Secondary
        </Button>
        <Button full variant="ghost">Ghost</Button>
        <Button full variant="danger">
          <Icon name="trash" /> Danger
        </Button>
        <Button full disabled>
          Disabled
        </Button>
      </div>

      <SectionLabel>Chips + progress</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Chip selected={chip} onClick={() => setChip(!chip)}>
          Itchy
        </Chip>
        <Chip onClick={() => {}}>Scaly</Chip>
        <Chip>Static chip</Chip>
      </div>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ProgressBar value={0.35} />
          <ProgressBar value={0.8} color={URGENCY_INFO.routine.color} />
        </div>
      </Card>

      <SectionLabel>Icons</SectionLabel>
      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {ICONS.map((n) => (
            <span key={n} title={n}>
              <Icon name={n} />
            </span>
          ))}
        </div>
      </Card>

      <SectionLabel>Urgency</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {URGENCY_ORDER.map((l) => (
          <Chip key={l} selected={l === level} onClick={() => setLevel(l)}>
            {l}
          </Chip>
        ))}
      </div>
      <UrgencyCard
        level={level}
        reasons={['The rash is spreading quickly', 'You have a fever as well']}
      />

      <SectionLabel>Body map</SectionLabel>
      <Card>
        <BodyMap selected={areas} onToggle={toggle} />
      </Card>
    </Screen>
  );
}
