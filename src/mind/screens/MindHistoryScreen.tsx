import { Card, Icon, Screen } from '../../ui';
import { CrisisButton } from './CrisisButton';
import type { MindHistoryScreenProps } from './props';
import './mind.css';

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export function MindHistoryScreen({ cases, onOpen, onDelete, onBack }: MindHistoryScreenProps) {
  const sorted = [...cases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <Screen title="Past checks" onBack={onBack} right={<CrisisButton />}>
      {sorted.length === 0 ? (
        <Card>
          <p className="mind-p">No saved checks yet. They are kept only on this phone.</p>
        </Card>
      ) : (
        <>
          <p className="mind-small mind-small--muted">Saved only on this phone.</p>
          {sorted.map((c) => {
            const n = Object.keys(c.responses).length;
            return (
              <Card key={c.id} onClick={() => onOpen(c.id)}>
                <div className="mind-hist">
                  <div className="mind-hist__body">
                    <p className="mind-hist__date">{fmt(c.updatedAt)}</p>
                    <p className="mind-small mind-small--muted">
                      {n} {n === 1 ? 'questionnaire' : 'questionnaires'} answered
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ui-iconbtn"
                    aria-label="Delete this check"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this check from this phone?')) onDelete(c.id);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <Icon name="trash" size={20} />
                  </button>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}
