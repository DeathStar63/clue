// Questionnaire data for the Mind section.
//
// Notes for the engine lane (design choices made here):
// - Yes/No items use YES_NO: Yes = 1, No = 0 (listed Yes first).
// - ASRS-6 (asrs6): the official tool is shown Never..Very often, but positivity uses the
//   "shaded box" rule. We encode that in the values: items 1–3 score 1 for Sometimes/Often/Very often,
//   items 4–6 score 1 for Often/Very often, everything else 0. Scoring is 'count'. Labels are unchanged.
// - PC-PTSD-5 (pcptsd5): pcptsd5_0 is the official trauma-exposure gate. If pcptsd5_0 = 0, skip
//   pcptsd5_1..5 (screen negative). The score must EXCLUDE pcptsd5_0 (sum of items 1–5 only);
//   bands and positiveAt are written for that 0–5 score. gw_trauma asks only pcptsd5_0, so when it
//   opens pcptsd5 the engine should reuse that answer rather than ask it again. The instrument stem is
//   empty: pcptsd5_0 has its own lead-in, and items 1–5 start with "In the past month, have you…".
// - ASQ (asq): asq_5 (acute) is only asked if any of asq_1..asq_4 is Yes. The score is the sum of
//   asq_1..asq_4 only (bands still cover 0–5 in case asq_5 is summed in). ASQ has no gateway: the
//   engine should queue it when phq9_9 or epds_10 fires a suicide risk rule.
// - AUDIT (audit): officially, if audit_1 = Never (0), skip to audit_9 and audit_10 (treat 2–8 as 0).
// - Gateways reuse items: answers to a gateway's items should be carried into the full instrument.
// - gw_body asks the 1-item 'clue_body' check, which opens PHQ-15 (no PHQ-15 subset is validated).
// - Withdrawal has its own gateway (gw_withdrawal, right after gw_drugs) because a gateway can only
//   open one instrument. Its risk items fire directly. The engine may choose to ask it only when
//   AUDIT-C / drugs are positive or context 'heavy_alcohol' is true.
// - gw_memory is marked onlyIf 'adult'; the engine should further limit it to age 60+.
// - Band urgency for risk-type Clue checks is 'today'; the real escalation is via riskItems.
// - Follow-up items use `askIf` (e.g. clue_highs_2/3 only after a Yes to clue_highs_1). Not asked → 0.
// - GATEWAYS are ordered most important first; the quick check asks them in that order.
import type { GatewayCheck, Instrument, ResponseOption } from './types';

const YES_NO: ResponseOption[] = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
];

const PHQ_OPTIONS: ResponseOption[] = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

const PHQ_LICENCE = 'PHQ © Pfizer Inc. No permission required to reproduce, translate, display or distribute.';
const CLUE_LICENCE = "Clue's own questions — not a validated test.";

// ASRS shaded-box encoding (see top-of-file note).
const ASRS_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];
const asrsOptions = (shadedFrom: number): ResponseOption[] =>
  ASRS_LABELS.map((label, i) => ({ label, value: i >= shadedFrom ? 1 : 0 }));
const ASRS_A = asrsOptions(2); // items 1–3: Sometimes or more
const ASRS_B = asrsOptions(3); // items 4–6: Often or more

const AUDIT_FREQ: ResponseOption[] = [
  { label: 'Never', value: 0 },
  { label: 'Less than monthly', value: 1 },
  { label: 'Monthly', value: 2 },
  { label: 'Weekly', value: 3 },
  { label: 'Daily or almost daily', value: 4 },
];
const AUDIT_YES: ResponseOption[] = [
  { label: 'No', value: 0 },
  { label: 'Yes, but not in the last year', value: 2 },
  { label: 'Yes, during the last year', value: 4 },
];

const opts = (...pairs: [string, number][]): ResponseOption[] =>
  pairs.map(([label, value]) => ({ label, value }));

export const INSTRUMENTS: Instrument[] = [
  // ---------------- OFFICIAL ----------------
  {
    id: 'phq9',
    name: 'Patient Health Questionnaire-9',
    shortName: 'PHQ-9',
    topic: 'low mood',
    origin: 'official',
    stem: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    options: PHQ_OPTIONS,
    items: [
      { id: 'phq9_1', text: 'Little interest or pleasure in doing things' },
      { id: 'phq9_2', text: 'Feeling down, depressed, or hopeless' },
      { id: 'phq9_3', text: 'Trouble falling or staying asleep, or sleeping too much' },
      { id: 'phq9_4', text: 'Feeling tired or having little energy' },
      { id: 'phq9_5', text: 'Poor appetite or overeating' },
      {
        id: 'phq9_6',
        text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      },
      {
        id: 'phq9_7',
        text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      },
      {
        id: 'phq9_8',
        text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
      },
      {
        id: 'phq9_9',
        text: 'Thoughts that you would be better off dead or of hurting yourself in some way',
      },
    ],
    scoring: 'sum',
    bands: [
      { min: 0, max: 4, label: 'Minimal', urgency: 'self_care' },
      { min: 5, max: 9, label: 'Mild', urgency: 'routine' },
      { min: 10, max: 14, label: 'Moderate', urgency: 'soon' },
      { min: 15, max: 19, label: 'Moderately severe', urgency: 'soon' },
      { min: 20, max: 27, label: 'Severe', urgency: 'soon' },
    ],
    positiveAt: 10,
    riskItems: [{ itemId: 'phq9_9', atLeast: 1, kind: 'suicide', level: 'elevated' }],
    citation:
      'Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606–613.',
    licenceNote: PHQ_LICENCE,
  },
  {
    id: 'gad7',
    name: 'Generalized Anxiety Disorder-7',
    shortName: 'GAD-7',
    topic: 'worry and anxiety',
    origin: 'official',
    stem: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
    options: PHQ_OPTIONS,
    items: [
      { id: 'gad7_1', text: 'Feeling nervous, anxious, or on edge' },
      { id: 'gad7_2', text: 'Not being able to stop or control worrying' },
      { id: 'gad7_3', text: 'Worrying too much about different things' },
      { id: 'gad7_4', text: 'Trouble relaxing' },
      { id: 'gad7_5', text: 'Being so restless that it is hard to sit still' },
      { id: 'gad7_6', text: 'Becoming easily annoyed or irritable' },
      { id: 'gad7_7', text: 'Feeling afraid, as if something awful might happen' },
    ],
    scoring: 'sum',
    bands: [
      { min: 0, max: 4, label: 'Minimal', urgency: 'self_care' },
      { min: 5, max: 9, label: 'Mild', urgency: 'routine' },
      { min: 10, max: 14, label: 'Moderate', urgency: 'soon' },
      { min: 15, max: 21, label: 'Severe', urgency: 'soon' },
    ],
    positiveAt: 10,
    citation:
      'Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092–1097.',
    licenceNote: PHQ_LICENCE,
  },
  {
    id: 'phq15',
    name: 'Patient Health Questionnaire-15',
    shortName: 'PHQ-15',
    topic: 'body symptoms',
    origin: 'official',
    stem: 'During the past 4 weeks, how much have you been bothered by any of the following problems?',
    options: [
      { label: 'Not bothered at all', value: 0 },
      { label: 'Bothered a little', value: 1 },
      { label: 'Bothered a lot', value: 2 },
    ],
    items: [
      { id: 'phq15_1', text: 'Stomach pain' },
      { id: 'phq15_2', text: 'Back pain' },
      { id: 'phq15_3', text: 'Pain in your arms, legs, or joints (knees, hips, etc.)' },
      { id: 'phq15_4', text: 'Menstrual cramps or other problems with your periods' },
      { id: 'phq15_5', text: 'Headaches' },
      { id: 'phq15_6', text: 'Chest pain' },
      { id: 'phq15_7', text: 'Dizziness' },
      { id: 'phq15_8', text: 'Fainting spells' },
      { id: 'phq15_9', text: 'Feeling your heart pound or race' },
      { id: 'phq15_10', text: 'Shortness of breath' },
      { id: 'phq15_11', text: 'Pain or problems during sexual intercourse' },
      { id: 'phq15_12', text: 'Constipation, loose bowels, or diarrhea' },
      { id: 'phq15_13', text: 'Nausea, gas, or indigestion' },
      { id: 'phq15_14', text: 'Feeling tired or having low energy' },
      { id: 'phq15_15', text: 'Trouble sleeping' },
    ],
    scoring: 'sum',
    bands: [
      { min: 0, max: 4, label: 'Minimal', urgency: 'self_care' },
      { min: 5, max: 9, label: 'Low', urgency: 'routine' },
      { min: 10, max: 14, label: 'Medium', urgency: 'routine' },
      { min: 15, max: 30, label: 'High', urgency: 'soon' },
    ],
    positiveAt: 10,
    citation:
      'Kroenke K, Spitzer RL, Williams JBW. The PHQ-15: validity of a new measure for evaluating the severity of somatic symptoms. Psychosom Med. 2002;64(2):258–266.',
    licenceNote: PHQ_LICENCE,
  },
  {
    id: 'asrs6',
    name: 'Adult ADHD Self-Report Scale (ASRS v1.1) Screener',
    shortName: 'ASRS-6',
    topic: 'focus and restlessness',
    origin: 'official',
    stem: 'How you have felt and conducted yourself over the past 6 months:',
    options: ASRS_A,
    items: [
      {
        id: 'asrs6_1',
        text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
        options: ASRS_A,
      },
      {
        id: 'asrs6_2',
        text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
        options: ASRS_A,
      },
      {
        id: 'asrs6_3',
        text: 'How often do you have problems remembering appointments or obligations?',
        options: ASRS_A,
      },
      {
        id: 'asrs6_4',
        text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
        options: ASRS_B,
      },
      {
        id: 'asrs6_5',
        text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
        options: ASRS_B,
      },
      {
        id: 'asrs6_6',
        text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
        options: ASRS_B,
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 3, label: 'Not suggestive', urgency: 'self_care' },
      { min: 4, max: 6, label: 'Suggestive — worth discussing', urgency: 'routine' },
    ],
    positiveAt: 4,
    citation:
      'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS). Psychol Med. 2005;35(2):245–256.',
    licenceNote:
      '© World Health Organization; Kessler et al. 2005. Free to use unchanged with this copyright notice; do not alter.',
  },
  {
    id: 'audit',
    name: 'Alcohol Use Disorders Identification Test',
    shortName: 'AUDIT',
    topic: 'alcohol use',
    origin: 'official',
    stem: 'Questions about your use of alcoholic beverages during the past year.',
    options: AUDIT_FREQ,
    items: [
      {
        id: 'audit_1',
        text: 'How often do you have a drink containing alcohol?',
        options: opts(
          ['Never', 0],
          ['Monthly or less', 1],
          ['2 to 4 times a month', 2],
          ['2 to 3 times a week', 3],
          ['4 or more times a week', 4],
        ),
      },
      {
        id: 'audit_2',
        text: 'How many drinks containing alcohol do you have on a typical day when you are drinking?',
        options: opts(['1 or 2', 0], ['3 or 4', 1], ['5 or 6', 2], ['7, 8, or 9', 3], ['10 or more', 4]),
      },
      { id: 'audit_3', text: 'How often do you have six or more drinks on one occasion?', options: AUDIT_FREQ },
      {
        id: 'audit_4',
        text: 'How often during the last year have you found that you were not able to stop drinking once you had started?',
        options: AUDIT_FREQ,
      },
      {
        id: 'audit_5',
        text: 'How often during the last year have you failed to do what was normally expected from you because of drinking?',
        options: AUDIT_FREQ,
      },
      {
        id: 'audit_6',
        text: 'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?',
        options: AUDIT_FREQ,
      },
      {
        id: 'audit_7',
        text: 'How often during the last year have you had a feeling of guilt or remorse after drinking?',
        options: AUDIT_FREQ,
      },
      {
        id: 'audit_8',
        text: 'How often during the last year have you been unable to remember what happened the night before because you had been drinking?',
        options: AUDIT_FREQ,
      },
      {
        id: 'audit_9',
        text: 'Have you or someone else been injured as a result of your drinking?',
        options: AUDIT_YES,
      },
      {
        id: 'audit_10',
        text: 'Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?',
        options: AUDIT_YES,
      },
    ],
    scoring: 'sum',
    bands: [
      { min: 0, max: 7, label: 'Low risk', urgency: 'self_care' },
      { min: 8, max: 15, label: 'Hazardous drinking', urgency: 'routine' },
      { min: 16, max: 19, label: 'Harmful drinking', urgency: 'soon' },
      { min: 20, max: 40, label: 'Possible dependence', urgency: 'soon' },
    ],
    positiveAt: 8,
    citation:
      'Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. AUDIT: The Alcohol Use Disorders Identification Test. Guidelines for Use in Primary Care. 2nd ed. World Health Organization; 2001.',
    licenceNote: 'World Health Organization. Free to use and reproduce.',
  },
  {
    id: 'pcptsd5',
    name: 'Primary Care PTSD Screen for DSM-5',
    shortName: 'PC-PTSD-5',
    topic: 'after stressful events',
    origin: 'official',
    stem: '',
    options: YES_NO,
    items: [
      // Gate item: not part of the score. If No, skip the rest (see top-of-file note).
      {
        id: 'pcptsd5_0',
        text: 'Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire; a physical or sexual assault or abuse; an earthquake or flood; a war; seeing someone be killed or seriously injured; having a loved one die through homicide or suicide. Have you ever experienced this kind of event?',
      },
      {
        id: 'pcptsd5_1',
        text: 'In the past month, have you had nightmares about the event(s) or thought about the event(s) when you did not want to?',
      },
      {
        id: 'pcptsd5_2',
        text: 'In the past month, have you tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?',
      },
      { id: 'pcptsd5_3', text: 'In the past month, have you been constantly on guard, watchful, or easily startled?' },
      { id: 'pcptsd5_4', text: 'In the past month, have you felt numb or detached from people, activities, or your surroundings?' },
      {
        id: 'pcptsd5_5',
        text: 'In the past month, have you felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?',
      },
    ],
    // Score = sum of pcptsd5_1..5 only (engine excludes pcptsd5_0).
    scoring: 'sum',
    bands: [
      { min: 0, max: 2, label: 'Below the screening cut-off', urgency: 'self_care' },
      { min: 3, max: 5, label: 'Positive screen', urgency: 'routine' },
    ],
    positiveAt: 3,
    citation:
      'Prins A, Bovin MJ, Smolenski DJ, et al. The Primary Care PTSD Screen for DSM-5 (PC-PTSD-5): development and evaluation within a veteran primary care sample. J Gen Intern Med. 2016;31(10):1206–1211.',
    licenceNote: 'US Department of Veterans Affairs, National Center for PTSD. Public domain.',
  },
  {
    id: 'epds',
    name: 'Edinburgh Postnatal Depression Scale',
    shortName: 'EPDS',
    topic: 'mood during pregnancy or after birth',
    origin: 'official',
    stem: 'In the past 7 days:',
    options: opts(['Yes, most of the time', 3], ['Yes, sometimes', 2], ['Not very often', 1], ['No, not at all', 0]),
    items: [
      {
        id: 'epds_1',
        text: 'I have been able to laugh and see the funny side of things',
        options: opts(
          ['As much as I always could', 0],
          ['Not quite so much now', 1],
          ['Definitely not so much now', 2],
          ['Not at all', 3],
        ),
      },
      {
        id: 'epds_2',
        text: 'I have looked forward with enjoyment to things',
        options: opts(
          ['As much as I ever did', 0],
          ['Rather less than I used to', 1],
          ['Definitely less than I used to', 2],
          ['Hardly at all', 3],
        ),
      },
      {
        id: 'epds_3',
        text: 'I have blamed myself unnecessarily when things went wrong',
        options: opts(['Yes, most of the time', 3], ['Yes, some of the time', 2], ['Not very often', 1], ['No, never', 0]),
      },
      {
        id: 'epds_4',
        text: 'I have been anxious or worried for no good reason',
        options: opts(['No, not at all', 0], ['Hardly ever', 1], ['Yes, sometimes', 2], ['Yes, very often', 3]),
      },
      {
        id: 'epds_5',
        text: 'I have felt scared or panicky for no very good reason',
        options: opts(['Yes, quite a lot', 3], ['Yes, sometimes', 2], ['No, not much', 1], ['No, not at all', 0]),
      },
      {
        id: 'epds_6',
        text: 'Things have been getting on top of me',
        options: opts(
          ["Yes, most of the time I haven't been able to cope at all", 3],
          ["Yes, sometimes I haven't been coping as well as usual", 2],
          ['No, most of the time I have coped quite well', 1],
          ['No, I have been coping as well as ever', 0],
        ),
      },
      {
        id: 'epds_7',
        text: 'I have been so unhappy that I have had difficulty sleeping',
        options: opts(['Yes, most of the time', 3], ['Yes, sometimes', 2], ['Not very often', 1], ['No, not at all', 0]),
      },
      {
        id: 'epds_8',
        text: 'I have felt sad or miserable',
        options: opts(['Yes, most of the time', 3], ['Yes, quite often', 2], ['Not very often', 1], ['No, not at all', 0]),
      },
      {
        id: 'epds_9',
        text: 'I have been so unhappy that I have been crying',
        options: opts(['Yes, most of the time', 3], ['Yes, quite often', 2], ['Only occasionally', 1], ['No, never', 0]),
      },
      {
        id: 'epds_10',
        text: 'The thought of harming myself has occurred to me',
        options: opts(['Yes, quite often', 3], ['Sometimes', 2], ['Hardly ever', 1], ['Never', 0]),
      },
    ],
    scoring: 'sum',
    // Cut-off 13 is the original; Indian validation studies have used 9–13.
    bands: [
      { min: 0, max: 9, label: 'Below the screening cut-off', urgency: 'self_care' },
      { min: 10, max: 12, label: 'Possible depression', urgency: 'routine' },
      { min: 13, max: 30, label: 'Likely depression', urgency: 'soon' },
    ],
    positiveAt: 13,
    riskItems: [{ itemId: 'epds_10', atLeast: 1, kind: 'suicide', level: 'elevated' }],
    citation:
      'Cox JL, Holden JM, Sagovsky R. Detection of postnatal depression: development of the 10-item Edinburgh Postnatal Depression Scale. Br J Psychiatry. 1987;150:782–786.',
    licenceNote: 'Free to reproduce with the citation (Cox, Holden & Sagovsky 1987).',
  },
  {
    id: 'asq',
    name: 'Ask Suicide-Screening Questions',
    shortName: 'ASQ',
    topic: 'thoughts of suicide',
    origin: 'official',
    stem: 'Please answer each question.',
    options: YES_NO,
    items: [
      { id: 'asq_1', text: 'In the past few weeks, have you wished you were dead?' },
      {
        id: 'asq_2',
        text: 'In the past few weeks, have you felt that you or your family would be better off if you were dead?',
      },
      { id: 'asq_3', text: 'In the past week, have you been having thoughts about killing yourself?' },
      { id: 'asq_4', text: 'Have you ever tried to kill yourself?' },
      // Acute question: only asked if any of asq_1..asq_4 is Yes. Not part of the score.
      { id: 'asq_5', text: 'Are you having thoughts of killing yourself right now?' },
    ],
    scoring: 'sum',
    bands: [
      { min: 0, max: 0, label: 'Negative screen', urgency: 'self_care' },
      { min: 1, max: 5, label: 'Positive screen', urgency: 'today' },
    ],
    positiveAt: 1,
    riskItems: [
      { itemId: 'asq_1', atLeast: 1, kind: 'suicide', level: 'elevated' },
      { itemId: 'asq_2', atLeast: 1, kind: 'suicide', level: 'elevated' },
      { itemId: 'asq_3', atLeast: 1, kind: 'suicide', level: 'elevated' },
      { itemId: 'asq_4', atLeast: 1, kind: 'suicide', level: 'elevated' },
      { itemId: 'asq_5', atLeast: 1, kind: 'suicide', level: 'urgent' },
    ],
    citation:
      'Horowitz LM, Bridge JA, Teach SJ, et al. Ask Suicide-Screening Questions (ASQ). Arch Pediatr Adolesc Med. 2012;166(12):1170–1176. National Institute of Mental Health.',
    licenceNote: 'National Institute of Mental Health (NIMH). Public domain.',
  },
  {
    id: 'scoff',
    name: 'SCOFF Questionnaire',
    shortName: 'SCOFF',
    topic: 'eating and weight',
    origin: 'official',
    stem: 'Please answer each question.',
    options: YES_NO,
    items: [
      { id: 'scoff_1', text: 'Do you make yourself sick because you feel uncomfortably full?' },
      { id: 'scoff_2', text: 'Do you worry you have lost control over how much you eat?' },
      { id: 'scoff_3', text: 'Have you recently lost more than 6 kg in a 3 month period?' },
      { id: 'scoff_4', text: 'Do you believe yourself to be fat when others say you are too thin?' },
      { id: 'scoff_5', text: 'Would you say that food dominates your life?' },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 1, label: 'Below the screening cut-off', urgency: 'self_care' },
      { min: 2, max: 5, label: 'Positive screen', urgency: 'routine' },
    ],
    positiveAt: 2,
    citation:
      'Morgan JF, Reid F, Lacey JH. The SCOFF questionnaire: assessment of a new screening tool for eating disorders. BMJ. 1999;319(7223):1467–1468. ("One stone" changed to "more than 6 kg" for India; capital-letter mnemonic dropped.)',
    licenceNote: 'Published in the BMJ; free to use with citation.',
  },

  // ---------------- CLUE'S OWN CHECKS ----------------
  {
    id: 'clue_body',
    name: 'Clue body-symptoms check',
    shortName: 'Body check',
    topic: 'body symptoms',
    origin: 'clue',
    stem: 'Thinking about the last month:',
    options: YES_NO,
    items: [
      {
        id: 'clue_body_1',
        text: "In the last month, have body problems like aches, weakness, tiredness, palpitations or 'ghabrahat' bothered you a lot, even after a doctor found nothing wrong?",
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'Not a big problem', urgency: 'self_care' },
      { min: 1, max: 1, label: 'Worth looking at more', urgency: 'routine' },
    ],
    positiveAt: 1,
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_highs',
    name: 'Clue highs check',
    shortName: 'Highs check',
    topic: 'unusual highs',
    origin: 'clue',
    stem: 'Some people have times when they feel much more "up" than usual.',
    options: YES_NO,
    items: [
      {
        id: 'clue_highs_1',
        text: "Have you ever had a period of several days when you felt so good, high, or full of energy that others thought you weren't your normal self?",
      },
      {
        id: 'clue_highs_2',
        text: "During a time like that, did you need much less sleep than usual but didn't feel tired?",
        askIf: { itemId: 'clue_highs_1', atLeast: 1 },
      },
      { id: 'clue_highs_3', text: 'Is this happening right now?', askIf: { itemId: 'clue_highs_1', atLeast: 1 } },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 1, label: 'Not suggestive', urgency: 'self_care' },
      { min: 2, max: 3, label: 'Worth discussing with a doctor', urgency: 'routine' },
    ],
    positiveAt: 2,
    riskItems: [{ itemId: 'clue_highs_3', atLeast: 1, kind: 'mania', level: 'elevated' }],
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_psychosis',
    name: 'Clue unusual experiences check',
    shortName: 'Unusual experiences',
    topic: 'unusual experiences',
    origin: 'clue',
    stem: 'These experiences are more common than people think. Lately, have you…',
    options: YES_NO,
    items: [
      { id: 'clue_psychosis_1', text: 'Heard voices or seen things that other people around you could not?' },
      {
        id: 'clue_psychosis_2',
        text: 'Felt that you were being watched, followed or targeted, or that people were trying to harm you?',
      },
      {
        id: 'clue_psychosis_3',
        text: 'Felt that your thoughts were being controlled or put into your head, or that the TV, radio or your phone was sending you special messages?',
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'None reported', urgency: 'self_care' },
      { min: 1, max: 3, label: 'Worth seeing a doctor about', urgency: 'soon' },
    ],
    positiveAt: 1,
    riskItems: [
      { itemId: 'clue_psychosis_1', atLeast: 1, kind: 'psychosis', level: 'elevated' },
      { itemId: 'clue_psychosis_2', atLeast: 1, kind: 'psychosis', level: 'elevated' },
      { itemId: 'clue_psychosis_3', atLeast: 1, kind: 'psychosis', level: 'elevated' },
    ],
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_sleep',
    name: 'Clue sleep check',
    shortName: 'Sleep check',
    topic: 'sleep',
    origin: 'clue',
    stem: 'Over the last month, how often have you…',
    options: opts(['Never', 0], ['Rarely', 1], ['Sometimes', 2], ['Most nights', 3], ['Every night', 4]),
    items: [
      { id: 'clue_sleep_1', text: 'Had trouble falling asleep?' },
      { id: 'clue_sleep_2', text: 'Woken up in the night or too early and not been able to get back to sleep?' },
      { id: 'clue_sleep_3', text: 'Felt tired during the day because of poor sleep?' },
    ],
    scoring: 'sum',
    bands: [
      { min: 0, max: 4, label: 'Few sleep problems', urgency: 'self_care' },
      { min: 5, max: 8, label: 'Some sleep problems', urgency: 'self_care' },
      { min: 9, max: 12, label: 'A lot of sleep problems', urgency: 'routine' },
    ],
    positiveAt: 6,
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_drugs',
    name: 'Clue drugs and medicines check',
    shortName: 'Drugs check',
    topic: 'drugs and medicines',
    origin: 'clue',
    stem: 'There are no wrong answers here, and nothing is shared.',
    options: YES_NO,
    items: [
      {
        id: 'clue_drugs_1',
        text: 'In the last year, have you used cannabis (bhang, ganja, charas), any other drugs, or medicines in a way they were not prescribed?',
      },
      {
        id: 'clue_drugs_2',
        text: 'Have you felt you should cut down, or have people close to you been worried about it?',
        askIf: { itemId: 'clue_drugs_1', atLeast: 1 },
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'None reported', urgency: 'self_care' },
      { min: 1, max: 2, label: 'Worth talking about', urgency: 'routine' },
    ],
    positiveAt: 1,
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_withdrawal',
    name: 'Clue stopping-safely check',
    shortName: 'Stopping safely',
    topic: 'stopping alcohol or sleeping pills',
    origin: 'clue',
    stem: 'Stopping some things suddenly can be risky, so we ask:',
    options: YES_NO,
    items: [
      {
        id: 'clue_withdrawal_1',
        text: 'If you drink alcohol or take sleeping pills daily, have you had shaking, sweating, seeing things or a fit when you stopped or cut down?',
      },
      {
        id: 'clue_withdrawal_2',
        text: 'Are you planning to stop heavy daily drinking or sleeping pills suddenly?',
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'No warning signs', urgency: 'self_care' },
      { min: 1, max: 2, label: 'Needs a doctor before stopping', urgency: 'today' },
    ],
    positiveAt: 1,
    riskItems: [
      { itemId: 'clue_withdrawal_1', atLeast: 1, kind: 'withdrawal', level: 'urgent' },
      { itemId: 'clue_withdrawal_2', atLeast: 1, kind: 'withdrawal', level: 'elevated' },
    ],
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_postpartum',
    name: 'Clue after-birth warning signs check',
    shortName: 'After-birth check',
    topic: 'warning signs after birth',
    origin: 'clue',
    stem: 'Since giving birth, have you…',
    options: YES_NO,
    items: [
      {
        id: 'clue_postpartum_1',
        text: 'Felt confused, seen or heard things others could not, or had very strange or frightening thoughts?',
      },
      { id: 'clue_postpartum_2', text: 'Not been able to sleep for days, even when the baby was asleep?' },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'No warning signs', urgency: 'self_care' },
      { min: 1, max: 2, label: 'Warning sign — needs help now', urgency: 'today' },
    ],
    positiveAt: 1,
    riskItems: [
      { itemId: 'clue_postpartum_1', atLeast: 1, kind: 'postpartum', level: 'urgent' },
      { itemId: 'clue_postpartum_2', atLeast: 1, kind: 'postpartum', level: 'urgent' },
    ],
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_eating_danger',
    name: 'Clue eating warning signs check',
    shortName: 'Eating warning signs',
    topic: 'eating warning signs',
    origin: 'clue',
    stem: 'One more important question:',
    options: YES_NO,
    items: [
      {
        id: 'clue_eating_danger_1',
        text: 'Recently, have you fainted, had chest pain, vomited blood, or stopped eating or drinking for days?',
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'No warning signs', urgency: 'self_care' },
      { min: 1, max: 1, label: 'Warning sign — needs help now', urgency: 'today' },
    ],
    positiveAt: 1,
    riskItems: [{ itemId: 'clue_eating_danger_1', atLeast: 1, kind: 'eating', level: 'urgent' }],
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
  {
    id: 'clue_memory',
    name: 'Clue memory check',
    shortName: 'Memory check',
    topic: 'memory and thinking',
    origin: 'clue',
    stem: 'About memory and thinking:',
    options: YES_NO,
    items: [
      {
        id: 'clue_memory_1',
        text: 'Over the last few months, has your memory or thinking become much worse than before (you or your family have noticed)?',
      },
      {
        id: 'clue_memory_2',
        text: 'In the last few hours or days, have you (or the person you are asking for) suddenly become confused or not yourself?',
      },
    ],
    scoring: 'count',
    bands: [
      { min: 0, max: 0, label: 'No changes reported', urgency: 'self_care' },
      { min: 1, max: 2, label: 'Worth checking with a doctor', urgency: 'routine' },
    ],
    positiveAt: 1,
    riskItems: [{ itemId: 'clue_memory_2', atLeast: 1, kind: 'confusion', level: 'urgent' }],
    citation: 'Clue',
    licenceNote: CLUE_LICENCE,
  },
];

export function instrumentById(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id);
}

const allItems = (id: string): string[] => instrumentById(id)?.items.map((it) => it.id) ?? [];

/** Asked first, in this order: most important first, so stopping early still covers the key areas. */
export const GATEWAYS: GatewayCheck[] = [
  { id: 'gw_mood', instrumentId: 'phq9', itemIds: ['phq9_1', 'phq9_2'], positiveAt: 3, opens: 'phq9', label: 'Mood' },
  { id: 'gw_worry', instrumentId: 'gad7', itemIds: ['gad7_1', 'gad7_2'], positiveAt: 3, opens: 'gad7', label: 'Worry' },
  { id: 'gw_highs', instrumentId: 'clue_highs', itemIds: allItems('clue_highs'), positiveAt: 2, label: 'Highs' },
  {
    id: 'gw_psychosis',
    instrumentId: 'clue_psychosis',
    itemIds: allItems('clue_psychosis'),
    positiveAt: 1,
    label: 'Unusual experiences',
  },
  { id: 'gw_sleep', instrumentId: 'clue_sleep', itemIds: allItems('clue_sleep'), positiveAt: 6, label: 'Sleep' },
  { id: 'gw_body', instrumentId: 'clue_body', itemIds: ['clue_body_1'], positiveAt: 1, opens: 'phq15', label: 'Body symptoms' },
  {
    id: 'gw_alcohol',
    instrumentId: 'audit',
    itemIds: ['audit_1', 'audit_2', 'audit_3'],
    positiveAt: 4,
    opens: 'audit',
    label: 'Alcohol',
  },
  // Only asked after a positive alcohol or drugs check (engine rule), so it may come after gw_drugs.
  {
    id: 'gw_withdrawal',
    instrumentId: 'clue_withdrawal',
    itemIds: allItems('clue_withdrawal'),
    positiveAt: 1,
    label: 'Stopping safely',
  },
  { id: 'gw_drugs', instrumentId: 'clue_drugs', itemIds: allItems('clue_drugs'), positiveAt: 1, label: 'Drugs and medicines' },
  { id: 'gw_trauma', instrumentId: 'pcptsd5', itemIds: ['pcptsd5_0'], positiveAt: 1, opens: 'pcptsd5', label: 'Stressful events' },
  {
    id: 'gw_eating',
    instrumentId: 'scoff',
    itemIds: allItems('scoff'),
    positiveAt: 2,
    opens: 'clue_eating_danger',
    label: 'Eating',
  },
  {
    id: 'gw_perinatal',
    instrumentId: 'epds',
    itemIds: allItems('epds'),
    positiveAt: 10,
    opens: 'clue_postpartum',
    label: 'Pregnancy and after birth',
    onlyIf: 'perinatal',
  },
  { id: 'gw_focus', instrumentId: 'asrs6', itemIds: allItems('asrs6'), positiveAt: 4, label: 'Focus', onlyIf: 'adult' },
  // Engine further limits this to age 60+.
  { id: 'gw_memory', instrumentId: 'clue_memory', itemIds: allItems('clue_memory'), positiveAt: 1, label: 'Memory', onlyIf: 'adult' },
];
