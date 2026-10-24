import { useState } from 'react';
import { Button, Icon, Screen, UrgencyCard } from '../ui';
import type { EmergencyScreenProps } from './props';
import './screensA.css';

export function EmergencyScreen({ triage, onBack, onContinue }: EmergencyScreenProps) {
  const [ack, setAck] = useState(false);
  const emergency = triage.level === 'emergency';
  const level = emergency ? 'emergency' : 'today';

  return (
    <Screen title={emergency ? 'This may be an emergency' : 'Please see a doctor today'}>
      <div className={`sa-alarm sa-alarm--${level}`}>
        <UrgencyCard level={level} />

        {triage.triggered.map((r) => (
          <section key={r.id} className="sa-alarm__rule">
            <h2 className="sa-alarm__title">{r.title}</h2>
            <p className="sa-alarm__msg">{r.message}</p>
            <p className="sa-alarm__action">
              <Icon name="alert" size={18} /> {r.action}
            </p>
          </section>
        ))}

        <div className="sa-calls">
          {emergency ? (
            <>
              <a className="sa-call sa-call--primary" href="tel:112">
                Call 112
                <span>Emergency</span>
              </a>
              <a className="sa-call" href="tel:108">
                Call 108
                <span>Ambulance</span>
              </a>
            </>
          ) : (
            <>
              <div className="sa-call sa-call--primary sa-call--static">
                See a doctor today
                <span>A clinic, urgent care or your own doctor</span>
              </div>
              <a className="sa-call" href="tel:112">
                Call 112
                <span>If it gets worse</span>
              </a>
            </>
          )}
        </div>

        <Button full variant="secondary" onClick={onBack}>
          Change my answers
        </Button>

        <label className="sa-ack">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
          <span>I understand this may be urgent</span>
        </label>
        <Button full variant="ghost" disabled={!ack} onClick={onContinue}>
          Continue to learn more
        </Button>
        <p className="sa-disclaimer">For learning only — not a diagnosis or medical advice.</p>
      </div>
    </Screen>
  );
}
