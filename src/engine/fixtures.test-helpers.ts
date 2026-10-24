// Inline fixtures for engine tests only. Not real medical data.
import type { CaseState, Condition, ConditionCard, Question } from '../types';

const card: ConditionCard = {
  summary: '',
  looksLike: [],
  progression: '',
  why: '',
  tests: [],
  doctor: { type: '', when: '' },
  dos: [],
  donts: [],
  sources: [],
};

export const scabies: Condition = {
  id: 'scabies',
  name: 'Scabies-like',
  category: 'skin',
  prevalence: 'common',
  evidence: { itchy: 2, itch_worse_night: 3, family_also_itchy: 3, burrows: 3, small_bumps: 1, thick_silvery_scale: -2 },
  sites: { finger_webs: 3, hands: 2, forearms_wrists: 2, genitals: 2, abdomen: 1 },
  alsoCheck: [
    { area: 'finger_webs', reason: 'Burrows often hide between the fingers.' },
    { area: 'genitals', reason: 'Bumps here are common in scabies.' },
  ],
  baseUrgency: 'routine',
  card,
};

export const psoriasis: Condition = {
  id: 'psoriasis',
  name: 'Psoriasis-like',
  category: 'skin',
  prevalence: 'common',
  evidence: { thick_silvery_scale: 3, raised_plaques: 2, well_defined_edges: 2, nail_pitting: 2, itchy: 1, ring_shaped_clear_centre: -1 },
  sites: { elbows: 3, knees: 3, scalp: 2, back: 1 },
  alsoCheck: [
    { area: 'fingernails', reason: 'Tiny pits in nails support psoriasis.' },
    { area: 'elbows', reason: 'Elbows are a classic place.' },
  ],
  baseUrgency: 'routine',
  card,
};

export const ringworm: Condition = {
  id: 'ringworm',
  name: 'Ringworm-like',
  category: 'skin',
  prevalence: 'very_common',
  evidence: { ring_shaped_clear_centre: 3, itchy: 2, scaly_flaky: 1, used_steroid_cream: 1, shared_towels_sport: 1, thick_silvery_scale: -2 },
  sites: { groin: 3, abdomen: 2, back: 2, thighs: 2, buttocks: 2 },
  alsoCheck: [
    { area: 'feet', reason: 'Fungus on the feet can spread.' },
    { area: 'fingernails', reason: 'Nail fungus can be the source.' },
  ],
  baseUrgency: 'routine',
  card,
};

export const alopecia: Condition = {
  id: 'alopecia',
  name: 'Alopecia-like',
  category: 'hair',
  prevalence: 'uncommon',
  evidence: { patchy_hair_loss_smooth: 3, eyebrow_beard_loss: 2, nail_pitting: 1, scaly_patch_broken_hairs: -2 },
  sites: { scalp: 3, eyebrows_beard: 2 },
  alsoCheck: [{ area: 'fingernails', reason: 'Nail pits sometimes go with it.' }],
  baseUrgency: 'routine',
  card,
};

export const ALL = [scabies, psoriasis, ringworm, alopecia];

export function makeState(over: Partial<CaseState> = {}): CaseState {
  return {
    id: 'c1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    complaint: '',
    areas: [],
    answers: {},
    asked: [],
    photos: [],
    ...over,
  };
}

export const QUESTIONS: Question[] = [
  { id: 'q_itch', text: 'Itchy?', why: '', kind: 'yesno', feature: 'itchy', phase: 'core' },
  {
    id: 'q_duration',
    text: 'How long?',
    why: '',
    kind: 'single',
    phase: 'core',
    options: [
      { label: '<2w', sets: ['duration_under_2w'] },
      { label: '2-6w', sets: ['duration_2_to_6w'] },
      { label: '>6w', sets: ['duration_over_6w'] },
    ],
  },
  {
    id: 'q_scalp_core',
    text: 'Hair loss pattern?',
    why: '',
    kind: 'single',
    phase: 'core',
    showIf: { anyAreas: ['scalp'] },
    options: [
      { label: 'patches', sets: ['patchy_hair_loss_smooth'] },
      { label: 'all over', sets: ['diffuse_thinning'] },
    ],
  },
  { id: 'q_night', text: 'Worse at night?', why: '', kind: 'yesno', feature: 'itch_worse_night', phase: 'detail', showIf: { anyFeatures: ['itchy'] } },
  { id: 'q_ring', text: 'Ring shape?', why: '', kind: 'yesno', feature: 'ring_shaped_clear_centre', phase: 'detail' },
  { id: 'q_scale', text: 'Silvery scale?', why: '', kind: 'yesno', feature: 'thick_silvery_scale', phase: 'detail' },
  { id: 'q_irrelevant', text: 'Teen?', why: '', kind: 'yesno', feature: 'teen_young_adult', phase: 'detail' },
  {
    id: 'q_triggers',
    text: 'Any of these?',
    why: '',
    kind: 'multi',
    phase: 'detail',
    options: [
      { label: 'family itchy', sets: ['family_also_itchy'] },
      { label: 'shared towels', sets: ['shared_towels_sport'] },
    ],
  },
];
