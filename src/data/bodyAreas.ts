export const BODY_AREAS = {
  scalp: 'Scalp',
  face: 'Face',
  eyebrows_beard: 'Eyebrows / beard',
  ears: 'Ears (and behind)',
  mouth: 'Inside the mouth',
  neck: 'Neck',
  chest: 'Chest',
  back: 'Back',
  abdomen: 'Tummy / belly button',
  armpits: 'Armpits',
  groin: 'Groin / inner thighs',
  genitals: 'Genitals',
  buttocks: 'Buttocks / between buttocks',
  upper_arms: 'Upper arms',
  elbows: 'Elbows',
  forearms_wrists: 'Forearms / wrists',
  hands: 'Hands / palms',
  finger_webs: 'Between the fingers',
  fingernails: 'Fingernails',
  thighs: 'Thighs',
  knees: 'Knees (front and back)',
  shins: 'Shins / lower legs',
  feet: 'Feet / soles',
  toe_webs: 'Between the toes',
  toenails: 'Toenails',
} as const;

export type BodyArea = keyof typeof BODY_AREAS;

export const BODY_AREA_IDS = Object.keys(BODY_AREAS) as BodyArea[];

export function areaLabel(area: BodyArea): string {
  return BODY_AREAS[area];
}
