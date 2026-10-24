import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CaseState } from './types';
import type { MindCase } from './mind/types';
import { CONDITIONS } from './data/conditions';
import { evaluateTriage, rankConditions } from './engine';
import {
  deleteCase,
  deleteMindCase,
  eraseEverything,
  listCases,
  listMindCases,
  newCase,
  newMindCase,
  saveCase,
  saveMindCase,
} from './store/cases';
import { mindRank, mindResults, mindRisk } from './mind';

import { HomeScreen } from './screens/HomeScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { WhereScreen } from './screens/WhereScreen';
import { DescribeScreen } from './screens/DescribeScreen';
import { QuestionsScreen } from './screens/QuestionsScreen';
import { PhotosScreen } from './screens/PhotosScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ConditionScreen } from './screens/ConditionScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { AboutScreen } from './screens/AboutScreen';

import { CrisisScreen } from './mind/screens/CrisisScreen';
import { MindIntroScreen } from './mind/screens/MindIntroScreen';
import { MindGatewayScreen } from './mind/screens/MindGatewayScreen';
import { MindInstrumentsScreen } from './mind/screens/MindInstrumentsScreen';
import { MindContextScreen } from './mind/screens/MindContextScreen';
import { MindResultsScreen } from './mind/screens/MindResultsScreen';
import { MindConditionScreen } from './mind/screens/MindConditionScreen';
import { MindSummaryScreen } from './mind/screens/MindSummaryScreen';
import { MindHistoryScreen } from './mind/screens/MindHistoryScreen';

type Route =
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'safety' }
  | { name: 'emergency'; then: Route }
  | { name: 'where' }
  | { name: 'describe' }
  | { name: 'questions' }
  | { name: 'photos' }
  | { name: 'results' }
  | { name: 'condition'; id: string }
  | { name: 'summary' }
  | { name: 'mindIntro' }
  | { name: 'mindGateway' }
  | { name: 'mindInstruments' }
  | { name: 'mindContext' }
  | { name: 'mindResults' }
  | { name: 'mindCondition'; id: string }
  | { name: 'mindSummary' }
  | { name: 'mindHistory' }
  | { name: 'crisis'; back: Route };

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [skin, setSkin] = useState<CaseState | null>(null);
  const [mind, setMind] = useState<MindCase | null>(null);
  const [skinCases, setSkinCases] = useState<CaseState[]>([]);
  const [mindCases, setMindCases] = useState<MindCase[]>([]);

  const refresh = useCallback(() => {
    listCases().then(setSkinCases);
    listMindCases().then(setMindCases);
  }, []);
  useEffect(refresh, [refresh]);

  // Each new screen starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const go = (r: Route) => setRoute(r);
  const goHome = () => {
    refresh();
    go({ name: 'home' });
  };

  // A check is only saved to the phone once it has reached its results,
  // so abandoned or emergency-exited checks don't pile up in the list.
  const savedIds = useRef(new Set<string>());

  const updateSkin = (next: CaseState) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    setSkin(stamped);
    if (savedIds.current.has(stamped.id)) saveCase(stamped);
  };
  const updateMind = (next: MindCase) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    setMind(stamped);
    if (savedIds.current.has(stamped.id)) saveMindCase(stamped);
  };

  useEffect(() => {
    if (route.name === 'results' && skin && !savedIds.current.has(skin.id)) {
      savedIds.current.add(skin.id);
      saveCase(skin);
    }
    if (route.name === 'mindResults' && mind && !savedIds.current.has(mind.id)) {
      savedIds.current.add(mind.id);
      saveMindCase(mind);
    }
  }, [route, skin, mind]);

  const ranked = useMemo(() => (skin ? rankConditions(skin, CONDITIONS) : []), [skin]);
  const triage = useMemo(() => evaluateTriage(skin?.answers ?? {}, ranked), [skin, ranked]);

  const mindRes = useMemo(() => (mind ? mindResults(mind) : []), [mind]);
  const mindRanked = useMemo(() => (mind ? mindRank(mind) : []), [mind]);
  const risk = useMemo(() => (mind ? mindRisk(mind) : { level: 'none' as const, flags: [] }), [mind]);

  const crisisFrom = (back: Route) => go({ name: 'crisis', back });

  switch (route.name) {
    case 'home':
      return (
        <HomeScreen
          cases={skinCases}
          mindCount={mindCases.length}
          onNewSkin={() => {
            setSkin(newCase());
            go({ name: 'describe' });
          }}
          onNewMind={() => {
            setMind(newMindCase());
            go({ name: 'mindIntro' });
          }}
          onOpen={(id) => {
            const c = skinCases.find((x) => x.id === id);
            if (c) {
              savedIds.current.add(c.id);
              setSkin(c);
              go({ name: 'results' });
            }
          }}
          onDelete={(id) => deleteCase(id).then(refresh)}
          onAbout={() => go({ name: 'about' })}
          onMindHistory={() => go({ name: 'mindHistory' })}
        />
      );

    case 'about':
      return (
        <AboutScreen
          onBack={goHome}
          onEraseAll={() => {
            eraseEverything().then(() => {
              setSkin(null);
              setMind(null);
              goHome();
            });
          }}
        />
      );

    case 'crisis':
      return <CrisisScreen risk={mind ? risk : undefined} onClose={() => go(route.back)} />;
  }

  // ---- Skin flow ----
  if (skin) {
    const step = { state: skin, update: updateSkin };
    switch (route.name) {
      case 'safety':
        return (
          <SafetyScreen
            {...step}
            onBack={() => go({ name: 'describe' })}
            onNext={() => go({ name: 'where' })}
            onAlarm={() => go({ name: 'emergency', then: { name: 'where' } })}
          />
        );
      case 'emergency':
        return (
          <EmergencyScreen
            triage={triage}
            onBack={() => go({ name: 'safety' })}
            onContinue={() => go(route.then)}
          />
        );
      case 'where':
        return <WhereScreen {...step} onBack={() => go({ name: 'safety' })} onNext={() => go({ name: 'questions' })} />;
      case 'describe':
        return <DescribeScreen {...step} onBack={goHome} onNext={() => go({ name: 'safety' })} />;
      case 'questions':
        return (
          <QuestionsScreen
            {...step}
            ranked={ranked}
            onBack={() => go({ name: 'where' })}
            onNext={() => go({ name: 'photos' })}
            onAlarm={() => go({ name: 'emergency', then: { name: 'questions' } })}
          />
        );
      case 'photos':
        return (
          <PhotosScreen {...step} ranked={ranked} onBack={() => go({ name: 'questions' })} onNext={() => go({ name: 'results' })} />
        );
      case 'results':
        return (
          <ResultsScreen
            state={skin}
            ranked={ranked}
            triage={triage}
            onOpenCondition={(id) => go({ name: 'condition', id })}
            onPhotos={() => go({ name: 'photos' })}
            onSummary={() => go({ name: 'summary' })}
            onBack={() => go({ name: 'questions' })}
            onHome={goHome}
          />
        );
      case 'condition': {
        const item = ranked.find((r) => r.condition.id === route.id);
        if (item) return <ConditionScreen item={item} onBack={() => go({ name: 'results' })} />;
        break;
      }
      case 'summary':
        return <SummaryScreen state={skin} ranked={ranked} triage={triage} onBack={() => go({ name: 'results' })} />;
    }
  }

  // ---- Mind flow ----
  if (route.name === 'mindHistory') {
    return (
      <MindHistoryScreen
        cases={mindCases}
        onOpen={(id) => {
          const c = mindCases.find((x) => x.id === id);
          if (c) {
            savedIds.current.add(c.id);
            setMind(c);
            go({ name: 'mindResults' });
          }
        }}
        onDelete={(id) => deleteMindCase(id).then(refresh)}
        onBack={goHome}
      />
    );
  }

  if (mind) {
    const step = { state: mind, update: updateMind };
    switch (route.name) {
      case 'mindIntro':
        return <MindIntroScreen {...step} onBack={goHome} onNext={() => go({ name: 'mindGateway' })} />;
      case 'mindGateway':
        return (
          <MindGatewayScreen
            {...step}
            onBack={() => go({ name: 'mindIntro' })}
            onNext={() => go({ name: 'mindInstruments' })}
            onRisk={() => crisisFrom({ name: 'mindGateway' })}
          />
        );
      case 'mindInstruments':
        return (
          <MindInstrumentsScreen
            {...step}
            onBack={() => go({ name: 'mindGateway' })}
            onNext={() => go({ name: 'mindContext' })}
            onRisk={() => crisisFrom({ name: 'mindInstruments' })}
          />
        );
      case 'mindContext':
        return <MindContextScreen {...step} onBack={() => go({ name: 'mindInstruments' })} onNext={() => go({ name: 'mindResults' })} />;
      case 'mindResults':
        return (
          <MindResultsScreen
            state={mind}
            results={mindRes}
            ranked={mindRanked}
            risk={risk}
            onOpenCondition={(id) => go({ name: 'mindCondition', id })}
            onSummary={() => go({ name: 'mindSummary' })}
            onCrisis={() => crisisFrom({ name: 'mindResults' })}
            onBack={() => go({ name: 'mindContext' })}
            onHome={goHome}
          />
        );
      case 'mindCondition': {
        const item = mindRanked.find((r) => r.condition.id === route.id);
        if (item) return <MindConditionScreen item={item} onBack={() => go({ name: 'mindResults' })} />;
        break;
      }
      case 'mindSummary':
        return (
          <MindSummaryScreen state={mind} results={mindRes} ranked={mindRanked} risk={risk} onBack={() => go({ name: 'mindResults' })} />
        );
    }
  }

  // Unknown state (e.g. reload mid-flow): go home.
  queueMicrotask(goHome);
  return null;
}
