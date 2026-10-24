import type { AboutScreenProps } from './props';
import { Button, Card, Icon, Screen, SectionLabel } from '../ui';
import './screensB.css';

const SOURCES = [
  { label: 'NHS — Health A to Z', url: 'https://www.nhs.uk/conditions/' },
  { label: 'DermNet', url: 'https://dermnetnz.org/' },
  { label: 'American Academy of Dermatology (AAD)', url: 'https://www.aad.org/public/diseases' },
];

export function AboutScreen({ onBack, onEraseAll }: AboutScreenProps) {
  const erase = () => {
    if (window.confirm('Erase everything Clue saved on this phone? This cannot be undone.')) onEraseAll();
  };

  return (
    <Screen title="About Clue" onBack={onBack}>
      <Card tone="raised">
        <h2 className="sb-h2">What Clue is</h2>
        <p className="sb-muted">
          Clue helps you understand a skin, hair or nail problem and get ready to talk to a doctor. It asks you
          questions, explains what it could be in plain words, and makes a short summary you can show your doctor.
        </p>
      </Card>

      <SectionLabel>What Clue is not</SectionLabel>
      <Card>
        <ul className="sb-list sb-list--icon">
          <li>
            <Icon name="close" size={16} />
            <span>Not a doctor.</span>
          </li>
          <li>
            <Icon name="close" size={16} />
            <span>Not a diagnosis. Only a doctor who examines you can diagnose.</span>
          </li>
          <li>
            <Icon name="close" size={16} />
            <span>Never suggests medicines. A doctor can advise treatment.</span>
          </li>
        </ul>
      </Card>

      <SectionLabel>How it works</SectionLabel>
      <Card>
        <ul className="sb-list sb-list--icon">
          <li>
            <Icon name="doctor" size={16} />
            <span>It asks the kind of questions a doctor would ask.</span>
          </li>
          <li>
            <Icon name="alert" size={16} />
            <span>Safety rules are written by people, not guessed by a computer, and always come first.</span>
          </li>
          <li>
            <Icon name="check" size={16} />
            <span>Condition cards are checked by a medical student.</span>
          </li>
        </ul>
      </Card>

      <SectionLabel>Privacy</SectionLabel>
      <Card>
        <p>Everything stays on this phone. No account, no tracking.</p>
      </Card>
      <Button full variant="danger" onClick={erase}>
        <Icon name="trash" /> Erase everything on this phone
      </Button>

      <SectionLabel>Sources</SectionLabel>
      <Card>
        <ul className="sb-list sb-list--links">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                <span>{s.label}</span>
                <Icon name="chevron" size={16} />
              </a>
            </li>
          ))}
        </ul>
        <p className="sb-small">Questionnaires used in the Mind section are credited there.</p>
      </Card>

      <p className="sb-note sb-center">Clue v0.1</p>
    </Screen>
  );
}
