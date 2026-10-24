// The shared vocabulary of things a user can report.
// `label` is how it reads in "fits because…" lists, so keep it short and plain.

export type FeatureGroup = 'look' | 'hair' | 'nails' | 'feel' | 'timing' | 'history' | 'alarm';

export const FEATURES = {
  // How it looks
  red_inflamed: { label: 'red or inflamed skin', group: 'look' },
  scaly_flaky: { label: 'scaly or flaky', group: 'look' },
  thick_silvery_scale: { label: 'thick silvery-white scale', group: 'look' },
  greasy_yellow_scale: { label: 'greasy yellowish flakes', group: 'look' },
  well_defined_edges: { label: 'sharp, clear edges', group: 'look' },
  ring_shaped_clear_centre: { label: 'ring shape with a clearer centre', group: 'look' },
  raised_plaques: { label: 'raised, thickened patches', group: 'look' },
  small_bumps: { label: 'small bumps', group: 'look' },
  pustules: { label: 'pus-filled spots', group: 'look' },
  blackheads_whiteheads: { label: 'blackheads or whiteheads', group: 'look' },
  deep_painful_lumps: { label: 'deep, painful lumps', group: 'look' },
  blisters: { label: 'fluid-filled blisters', group: 'look' },
  grouped_blisters: { label: 'small blisters in a cluster', group: 'look' },
  honey_crust: { label: 'honey-coloured crusts', group: 'look' },
  oozing_weeping: { label: 'oozing or weeping', group: 'look' },
  dry_rough_skin: { label: 'dry, rough skin', group: 'look' },
  thickened_leathery: { label: 'thickened, leathery skin', group: 'look' },
  lighter_patches: { label: 'lighter patches', group: 'look' },
  complete_colour_loss: { label: 'milk-white patches (total colour loss)', group: 'look' },
  dark_patches: { label: 'darker patches', group: 'look' },
  symmetric_face_brown: { label: 'brown patches on both cheeks', group: 'look' },
  fine_scale_patches_trunk: { label: 'many small patches with fine scale on chest/back', group: 'look' },
  purple_flat_bumps: { label: 'purplish, shiny, flat-topped bumps', group: 'look' },
  lacy_white_mouth: { label: 'lacy white lines inside the cheeks', group: 'look' },
  burrows: { label: 'tiny wavy lines (burrows)', group: 'look' },
  hives: { label: 'raised itchy welts (hives)', group: 'look' },
  hives_fade_24h: { label: 'each welt fades within a day', group: 'look' },
  herald_patch: { label: 'one bigger patch came first', group: 'look' },
  christmas_tree_pattern: { label: 'oval patches along the ribs', group: 'look' },
  band_one_side: { label: 'stripe or band on one side only', group: 'look' },
  warm_swollen_spreading: { label: 'warm, swollen, spreading redness', group: 'look' },
  mole_changing: { label: 'a mole that is changing', group: 'look' },
  mole_irregular: { label: 'mole with uneven border or colours', group: 'look' },
  mole_bleeding: { label: 'mole that bleeds or crusts', group: 'look' },
  pearly_bump: { label: 'shiny, pearly bump that doesn’t heal', group: 'look' },
  rough_skin_growth: { label: 'rough, skin-coloured growth', group: 'look' },
  dome_with_dimple: { label: 'small smooth domes with a dimple in the middle', group: 'look' },
  facial_flushing: { label: 'flushing / redness of cheeks and nose', group: 'look' },
  visible_vessels: { label: 'tiny visible blood vessels', group: 'look' },
  target_spots: { label: 'target-like spots', group: 'look' },

  // Hair
  patchy_hair_loss_smooth: { label: 'round smooth bald patches', group: 'hair' },
  diffuse_thinning: { label: 'thinning all over', group: 'hair' },
  widening_parting: { label: 'widening parting / thinning on top', group: 'hair' },
  receding_hairline: { label: 'receding hairline or thinning crown', group: 'hair' },
  sudden_shedding: { label: 'sudden heavy shedding', group: 'hair' },
  scaly_patch_broken_hairs: { label: 'scaly patch with broken hairs', group: 'hair' },
  scalp_itch: { label: 'itchy scalp', group: 'hair' },
  dandruff_flakes: { label: 'dandruff flakes', group: 'hair' },
  boggy_scalp_swelling: { label: 'soft, swollen, pus-filled scalp area', group: 'hair' },
  eyebrow_beard_loss: { label: 'patches lost in eyebrows or beard', group: 'hair' },
  tight_hairstyles: { label: 'tight braids, buns or ponytails', group: 'hair' },

  // Nails
  nail_pitting: { label: 'tiny pits in the nails', group: 'nails' },
  nail_lifting: { label: 'nail lifting off the nail bed', group: 'nails' },
  nail_thick_yellow: { label: 'thick, yellow, crumbly nails', group: 'nails' },
  nail_ridges: { label: 'ridges or splitting nails', group: 'nails' },
  nail_spoon: { label: 'spoon-shaped (scooped) nails', group: 'nails' },
  nail_clubbing: { label: 'rounded, bulging fingertips (clubbing)', group: 'nails' },
  nail_dark_streak: { label: 'dark streak along the nail', group: 'nails' },
  nail_fold_swollen: { label: 'red, swollen, sore skin around the nail', group: 'nails' },
  nail_white_spots: { label: 'white spots or patches on the nail', group: 'nails' },

  // How it feels
  itchy: { label: 'itchy', group: 'feel' },
  itch_worse_night: { label: 'itch worse at night', group: 'feel' },
  painful_tender: { label: 'painful or tender', group: 'feel' },
  burning_tingling_first: { label: 'burning or tingling before it appeared', group: 'feel' },
  no_symptoms: { label: 'doesn’t itch or hurt', group: 'feel' },

  // Timing
  onset_sudden: { label: 'came on suddenly', group: 'timing' },
  duration_under_2w: { label: 'less than 2 weeks', group: 'timing' },
  duration_2_to_6w: { label: '2–6 weeks', group: 'timing' },
  duration_over_6w: { label: 'more than 6 weeks', group: 'timing' },
  comes_and_goes: { label: 'comes and goes', group: 'timing' },
  started_childhood: { label: 'started in childhood', group: 'timing' },
  worse_in_winter: { label: 'worse in winter / dry weather', group: 'timing' },

  // History and triggers
  family_also_itchy: { label: 'others at home are itchy too', group: 'history' },
  family_history_same: { label: 'family members have the same problem', group: 'history' },
  used_steroid_cream: { label: 'used a steroid or mixed cream', group: 'history' },
  new_product_contact: { label: 'new soap, cosmetic, jewellery or chemical', group: 'history' },
  new_medicine: { label: 'started a new medicine recently', group: 'history' },
  worse_sweat_heat: { label: 'worse with sweat or heat', group: 'history' },
  worse_stress: { label: 'worse with stress', group: 'history' },
  worse_in_sun: { label: 'worse in the sun', group: 'history' },
  better_in_sun: { label: 'better in the sun', group: 'history' },
  recent_illness: { label: 'illness, fever, surgery or childbirth in the last 3 months', group: 'history' },
  asthma_hayfever: { label: 'asthma, hay fever or eczema history', group: 'history' },
  diabetes: { label: 'diabetes', group: 'history' },
  oily_skin: { label: 'oily skin', group: 'history' },
  teen_young_adult: { label: 'teenager or young adult', group: 'history' },
  joint_pain: { label: 'joint pain or stiffness', group: 'history' },
  wet_work: { label: 'hands often wet or frequent hand-washing', group: 'history' },
  shared_towels_sport: { label: 'shared towels, gym or contact sport', group: 'history' },
  pets_animals: { label: 'contact with pets or animals', group: 'history' },
  tired_weight_change: { label: 'tiredness or weight change', group: 'history' },
  heavy_periods: { label: 'heavy periods', group: 'history' },
  pregnant: { label: 'pregnant', group: 'history' },
  hormonal_flare: { label: 'flares around periods', group: 'history' },
  sun_damage_history: { label: 'lots of sun exposure over the years', group: 'history' },

  // Alarm signs (used by red-flag rules)
  fever_now: { label: 'fever now', group: 'alarm' },
  feels_very_unwell: { label: 'feeling very unwell', group: 'alarm' },
  rash_not_fading_glass: { label: 'rash doesn’t fade when a glass is pressed on it', group: 'alarm' },
  skin_peeling_sheets: { label: 'skin blistering or peeling off in sheets', group: 'alarm' },
  sores_mouth_eyes_genitals: { label: 'sores in the mouth, eyes or genitals', group: 'alarm' },
  lips_tongue_swelling: { label: 'swelling of lips, tongue or face', group: 'alarm' },
  trouble_breathing: { label: 'trouble breathing or wheezing', group: 'alarm' },
  spreading_fast_hours: { label: 'spreading fast over hours', group: 'alarm' },
  near_eye: { label: 'near the eye or on the tip of the nose', group: 'alarm' },
  eye_pain_vision: { label: 'eye pain or blurry vision', group: 'alarm' },
  weak_immunity: { label: 'weak immune system (e.g. chemo, transplant)', group: 'alarm' },
  newborn_or_infant: { label: 'baby under 3 months', group: 'alarm' },
} as const satisfies Record<string, { label: string; group: FeatureGroup }>;

export type FeatureId = keyof typeof FEATURES;

export const FEATURE_IDS = Object.keys(FEATURES) as FeatureId[];

export function featureLabel(id: FeatureId): string {
  return FEATURES[id].label;
}
