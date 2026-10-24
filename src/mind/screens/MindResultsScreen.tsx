import { Button, Card, ProgressBar, Ring, Screen, SectionLabel, UrgencyCard, URGENCY_ORDER } from '../../ui';
import type { UrgencyLevel } from '../../types';
import { EMERGENCY, HELPLINES } from '../helplines';
import { resultText, showsAsScreen } from '../index';
import { instrumentById } from '../instruments';
import type { RiskResult } from '../types';
import { CallLink, RiskMessage } from './CrisisScreen';
import { CrisisButton } from './CrisisButton';
import type { MindResultsScreenProps } from './props';
import './mind.css';

const TELE_MANAS = HELPLINES.find((h) => h.tel === '14416') ?? HELPLINES[0];

const maxLevel = (a: UrgencyLevel, b: UrgencyLevel): UrgencyLevel =>
  URGENCY_ORDER.indexOf(a) >= URGENCY_ORDER.indexOf(b) ? a : b;

const BAND_WORD = { strong: 'Strong', possible: 'Possible', less_likely: 'Less likely' } as const;
const BAND_COLOR = { strong: 'var(--accent)', possible: 'var(--blue)', less_likely: 'var(--text-3)' } as const;

function RiskCard({ risk, onCrisis }: { risk: RiskResult; onCrisis: () => void }) {
  const urgent = risk.level === 'urgent';
  return (
    <Card tone="tinted" tint="var(--red)" className="mind-riskcard">
      <div role="alert">
        <h2 className="mind-h2">{urgent ? 'Please get help now' : 'Please talk to someone soon'}</h2>
        <p className="mind-p">
          {urgent
            ? 'Some of your answers suggest you may not be safe right now. You deserve support today — calling is free and private.'
            : "Some of your answers suggest it would really help to talk to someone. You don't have to wait until things get worse."}
        </p>
        <RiskMessage risk={risk} />
        {risk.flags.length > 0 && (
          <ul className="mind-list mind-list--tight">
            {risk.flags.map((f, i) => (
              <li key={i}>{f.reason}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="mind-stack">
        <CallLink line={TELE_MANAS} big primary />
        <CallLink line={EMERGENCY} big />
        <Button variant="secondary" full onClick={onCrisis}>
          Open help screen
        </Button>
      </div>
    </Card>
  );
}

export function MindResultsScreen({
  results,
  ranked,
  risk,
  onOpenCondition,
  onSummary,
  onCrisis,
  onBack,
  onHome,
}: MindResultsScreenProps) {
  const shown = ranked.filter((r) => r.band === 'strong' || r.band === 'possible');

  let level: UrgencyLevel = 'self_care';
  for (const r of results) level = maxLevel(level, r.band.urgency);
  for (const r of shown) if (r.band === 'strong') level = maxLevel(level, r.condition.baseUrgency);
  if (risk.level === 'elevated') level = maxLevel(level, 'today');
  if (risk.level === 'urgent') level = 'emergency';

  const reasons = results
    .filter((r) => r.positive)
    .map((r) => `${instrumentById(r.instrumentId)?.shortName ?? r.instrumentId}: ${r.band.label}`);

  return (
    <Screen
      title="Your results"
      onBack={onBack}
      right={<CrisisButton onOpen={onCrisis} />}
      footer={
        <div className="mind-row mind-row--footer">
          <Button variant="secondary" full onClick={onSummary}>
            Doctor summary
          </Button>
          <Button onClick={onHome}>
            Done
          </Button>
        </div>
      }
    >
      {risk.level !== 'none' && <RiskCard risk={risk} onCrisis={onCrisis} />}

      <UrgencyCard level={level} reasons={reasons.length ? reasons : undefined} />

      <SectionLabel>Your answers are similar to people who have…</SectionLabel>
      {shown.length === 0 ? (
        <Card>
          <p className="mind-p">
            Your answers did not closely match the patterns Clue checks for. That's good to hear — but if you are
            struggling, talking to someone still helps.
          </p>
        </Card>
      ) : (
        shown.map((r) => (
          <Card key={r.condition.id} onClick={() => onOpenCondition(r.condition.id)}>
            <div className="mind-match">
              <Ring value={r.match} size={64} color={BAND_COLOR[r.band]}>
                <span className="mind-match__word">{BAND_WORD[r.band]}</span>
              </Ring>
              <div className="mind-match__body">
                <h3 className="mind-h3">{r.condition.name}</h3>
                <p className="mind-small">{r.condition.card.summary}</p>
                {r.fitsBecause.length > 0 && (
                  <p className="mind-small mind-small--muted">Because: {r.fitsBecause.slice(0, 3).join(' · ')}</p>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
      {shown.length > 0 && (
        <p className="mind-small">This is not a diagnosis. Only a doctor or psychologist who talks with you can say.</p>
      )}

      {results.length > 0 && (
        <>
          <SectionLabel>Your scores</SectionLabel>
          <Card>
            <div className="mind-scores">
              {results.map((r) => {
                const inst = instrumentById(r.instrumentId);
                return (
                  <div key={r.instrumentId} className="mind-score">
                    <div className="mind-score__top">
                      <span className="mind-score__name">
                        {inst?.shortName ?? r.instrumentId}
                        {inst && <span className="mind-small mind-small--muted"> · {inst.topic}</span>}
                      </span>
                      <span className="mind-score__val">{resultText(r, inst)}</span>
                    </div>
                    {!(inst && showsAsScreen(inst)) && (
                      <ProgressBar
                        value={r.maxScore ? r.score / r.maxScore : 0}
                        color={r.positive ? 'var(--orange)' : 'var(--accent)'}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mind-small mind-small--muted">
              A questionnaire can be wrong either way. If you feel unsafe, get help even if your score is low.
            </p>
          </Card>
        </>
      )}

      <SectionLabel>Where to get help</SectionLabel>
      <Card>
        <h3 className="mind-h3">Free or low-cost</h3>
        <ul className="mind-list">
          <li>
            <strong>Tele-MANAS — call 14416.</strong> Free, 24×7, many languages. Trained counsellors who can connect
            you to a psychiatrist.
          </li>
          <li>
            <strong>District hospital mental-health clinic</strong> (District Mental Health Programme, DMHP). Free or
            very low cost. Ask at the district hospital OPD.
          </li>
          <li>
            <strong>Government medical college — psychiatry OPD.</strong> Low cost. You can usually walk in without
            a referral.
          </li>
        </ul>
        <h3 className="mind-h3">Paid options</h3>
        <ul className="mind-list">
          <li>
            <strong>Psychiatrist</strong> — a medical doctor for mental health. Best when things are severe, unusual,
            or also affecting your body.
          </li>
          <li>
            <strong>Clinical psychologist</strong> — trained (RCI-registered) to assess and give talking therapy such
            as CBT.
          </li>
          <li>
            <strong>Counsellor</strong> — listens and helps you cope with stress and life problems. Training varies,
            so ask about it.
          </li>
        </ul>
        <CallLink line={TELE_MANAS} />
      </Card>
    </Screen>
  );
}
