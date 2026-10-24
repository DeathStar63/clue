// Red-flag safety layer for Clue.
// These are fixed, human-readable rules — not AI guesses. They are checked
// first and always override condition matching. A doctor should review any change.
import type { Question, RedFlagRule } from '../types';

/**
 * Quick yes/no screening, asked before anything else.
 * Shown together as one checklist screen. Ordered most dangerous first.
 */
export const RED_FLAG_QUESTIONS: Question[] = [
  {
    id: 'rf_trouble_breathing',
    text: 'Is there any trouble breathing, wheezing or a tight throat?',
    why: 'Breathing trouble with a rash can be a serious allergic reaction.',
    kind: 'yesno',
    feature: 'trouble_breathing',
    phase: 'core',
  },
  {
    id: 'rf_lips_tongue_swelling',
    text: 'Are the lips, tongue or face swelling up?',
    why: 'Swelling of the lips, tongue or face can block the airway and needs help fast.',
    kind: 'yesno',
    feature: 'lips_tongue_swelling',
    phase: 'core',
  },
  {
    id: 'rf_rash_not_fading_glass',
    text: 'Does the rash stay visible when you press a clear glass on it?',
    why: 'Spots that don’t fade under pressure can be a sign of a serious blood infection.',
    hint: 'Press the side of a clear drinking glass firmly on the spots and look through it. If the spots don’t fade, that is urgent. On darker skin, also check paler areas like the palms, soles of the feet or inside the eyelids.',
    kind: 'yesno',
    feature: 'rash_not_fading_glass',
    phase: 'core',
  },
  {
    id: 'rf_skin_peeling_sheets',
    text: 'Is the skin blistering badly or peeling off in sheets?',
    why: 'Skin coming away in sheets can mean a severe reaction that needs hospital care.',
    kind: 'yesno',
    feature: 'skin_peeling_sheets',
    phase: 'core',
  },
  {
    id: 'rf_newborn_or_infant',
    text: 'Is this for a baby under 3 months old?',
    why: 'Very young babies can get seriously ill quickly, so we take extra care.',
    kind: 'yesno',
    feature: 'newborn_or_infant',
    phase: 'core',
  },
  {
    id: 'rf_fever_now',
    text: 'Is there a fever right now?',
    why: 'A fever with a skin problem can mean an infection that has spread.',
    kind: 'yesno',
    feature: 'fever_now',
    phase: 'core',
  },
  {
    id: 'rf_feels_very_unwell',
    text: 'Do you feel very unwell — for example very weak, drowsy or confused?',
    why: 'Feeling very unwell along with a rash can mean the whole body is affected.',
    kind: 'yesno',
    feature: 'feels_very_unwell',
    phase: 'core',
  },
  {
    id: 'rf_spreading_fast_hours',
    text: 'Is it spreading fast, over a few hours?',
    why: 'Fast spread can mean a serious infection or reaction.',
    kind: 'yesno',
    feature: 'spreading_fast_hours',
    phase: 'core',
  },
  {
    id: 'rf_sores_mouth_eyes_genitals',
    text: 'Are there sores in the mouth, eyes or genitals?',
    why: 'Sores in these places along with a rash can be an early sign of a severe reaction.',
    kind: 'yesno',
    feature: 'sores_mouth_eyes_genitals',
    phase: 'core',
  },
  {
    id: 'rf_eye_pain_vision',
    text: 'Is there eye pain or blurry vision?',
    why: 'Eye pain or vision changes need checking quickly to protect your sight.',
    kind: 'yesno',
    feature: 'eye_pain_vision',
    phase: 'core',
  },
  {
    id: 'rf_near_eye',
    text: 'Is it near the eye or on the tip of the nose?',
    why: 'Some rashes in this area can affect the eye.',
    kind: 'yesno',
    feature: 'near_eye',
    phase: 'core',
  },
  {
    id: 'rf_weak_immunity',
    text: 'Is the immune system weak — for example from chemotherapy, a transplant or strong medicines?',
    why: 'A weak immune system makes infections more serious and faster to spread.',
    kind: 'yesno',
    feature: 'weak_immunity',
    phase: 'core',
  },
];

const EMERGENCY_ACTION = 'Call 112 (or 108 for an ambulance) or go to the nearest emergency department now.';
const TODAY_ACTION = 'See a doctor today. If you can’t, go to an emergency department.';

/** Fire only when every `allOf` feature is answered exactly 'yes'. */
export const RED_FLAG_RULES: RedFlagRule[] = [
  // ---- Emergency ----
  {
    id: 'rule_non_fading_rash',
    level: 'emergency',
    allOf: ['rash_not_fading_glass'],
    title: 'A rash that doesn’t fade under a glass',
    message: 'Spots that don’t fade when pressed can be a sign of a serious infection in the blood. It needs a doctor straight away.',
    action: EMERGENCY_ACTION,
  },
  {
    id: 'rule_lips_tongue_swelling',
    level: 'emergency',
    allOf: ['lips_tongue_swelling'],
    title: 'Swelling of the lips, tongue or face',
    message: 'This can be a severe allergic reaction and can make breathing hard. It needs help straight away.',
    action: EMERGENCY_ACTION,
  },
  {
    id: 'rule_trouble_breathing',
    level: 'emergency',
    allOf: ['trouble_breathing'],
    title: 'Trouble breathing',
    message: 'Breathing trouble with a skin problem can be a severe allergic reaction. It needs help straight away.',
    action: EMERGENCY_ACTION,
  },
  {
    id: 'rule_skin_peeling_sheets',
    level: 'emergency',
    allOf: ['skin_peeling_sheets'],
    title: 'Skin blistering or peeling off in sheets',
    message: 'Skin coming away in sheets can mean a severe reaction (often to a medicine) where the skin stops protecting the body. It needs hospital care straight away.',
    action: EMERGENCY_ACTION,
  },
  {
    // Redundant with rule_skin_peeling_sheets on its own, but kept so the
    // classic SJS/TEN picture is named explicitly if that rule is ever relaxed.
    id: 'rule_peeling_with_sores',
    level: 'emergency',
    allOf: ['skin_peeling_sheets', 'sores_mouth_eyes_genitals'],
    title: 'Peeling skin with sores in the mouth, eyes or genitals',
    message: 'Together, these signs can mean a severe reaction affecting the skin and the inside of the body. It needs hospital care straight away.',
    action: EMERGENCY_ACTION,
  },
  {
    id: 'rule_fever_unwell_spreading',
    level: 'emergency',
    allOf: ['fever_now', 'feels_very_unwell', 'spreading_fast_hours'],
    title: 'Fever, feeling very unwell, and fast spread',
    message: 'These signs together can mean a serious infection that is spreading through the body. It needs a doctor straight away.',
    action: EMERGENCY_ACTION,
  },
  {
    id: 'rule_infant_fever',
    level: 'emergency',
    allOf: ['newborn_or_infant', 'fever_now'],
    title: 'Fever in a baby under 3 months',
    message: 'Any fever in a very young baby needs to be checked by a doctor straight away.',
    action: EMERGENCY_ACTION,
  },

  // ---- Today ----
  {
    id: 'rule_sores_mouth_eyes_genitals',
    level: 'today',
    allOf: ['sores_mouth_eyes_genitals'],
    title: 'Sores in the mouth, eyes or genitals',
    message: 'Sores in these places can be an early sign of a serious reaction or infection. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_spreading_redness_fever',
    level: 'today',
    allOf: ['warm_swollen_spreading', 'fever_now'],
    title: 'Warm, spreading redness with fever',
    message: 'Warm, swollen, spreading redness with a fever can mean a skin infection that is getting deeper. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_spreading_redness',
    level: 'today',
    allOf: ['warm_swollen_spreading'],
    title: 'Warm, swollen, spreading redness',
    message: 'Redness that is warm, swollen and spreading can be a skin infection. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_spreading_fast',
    level: 'today',
    allOf: ['spreading_fast_hours'],
    title: 'Spreading fast over hours',
    message: 'A rash that spreads over hours should be checked by a doctor today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_band_near_eye',
    level: 'today',
    allOf: ['near_eye', 'band_one_side'],
    title: 'A one-sided band of rash near the eye',
    message: 'A rash in a band on one side near the eye or nose tip can affect the eye. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_blisters_near_eye',
    level: 'today',
    allOf: ['near_eye', 'grouped_blisters'],
    title: 'Clustered blisters near the eye',
    message: 'Small clustered blisters near the eye or nose tip can affect the eye. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_eye_pain_vision',
    level: 'today',
    allOf: ['eye_pain_vision'],
    title: 'Eye pain or blurry vision',
    message: 'Eye pain or changes in vision need checking quickly to protect your sight. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_weak_immunity_fever',
    level: 'today',
    allOf: ['weak_immunity', 'fever_now'],
    title: 'Fever with a weak immune system',
    message: 'With a weak immune system, a fever can mean an infection that gets serious quickly. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_fever_very_unwell',
    level: 'today',
    allOf: ['fever_now', 'feels_very_unwell'],
    title: 'Fever and feeling very unwell',
    message: 'A rash with fever and feeling very unwell can mean the whole body is affected. A doctor should look today.',
    action: TODAY_ACTION,
  },
  {
    id: 'rule_new_medicine_fever_unwell',
    level: 'today',
    allOf: ['new_medicine', 'fever_now', 'feels_very_unwell'],
    title: 'A new medicine, fever and feeling very unwell',
    message: 'A rash with fever and feeling very unwell after starting a new medicine can be a reaction to that medicine. A doctor should look today. Don’t stop a prescribed medicine on your own — ask the doctor.',
    action: TODAY_ACTION,
  },
  {
    // Judgment call: a boggy, pus-filled scalp swelling (often kerion, a fungal
    // scalp infection in children) is usually not an emergency and is left to the
    // condition's own baseUrgency. With a fever it may be a deeper bacterial
    // infection or abscess, so it is lifted to 'today'.
    id: 'rule_scalp_swelling_fever',
    level: 'today',
    allOf: ['boggy_scalp_swelling', 'fever_now'],
    title: 'A swollen, pus-filled scalp area with fever',
    message: 'A soft, swollen scalp area with a fever can mean a deeper infection. A doctor should look today.',
    action: TODAY_ACTION,
  },
];
