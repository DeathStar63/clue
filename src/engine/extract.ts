// Offline understanding of the user's own words: keyword/synonym rules, no AI.
// Handles casual Indian English, simple negation ("no itch", "doesn't itch") and durations.
import type { BodyArea, FeatureId } from '../types';

interface Rule<T> {
  re: RegExp;
  out: T[];
}

const NEGATORS = new Set([
  'no', 'not', 'never', 'without', 'nor', 'hardly', 'zero',
  'dont', "don't", 'doesnt', "doesn't", 'didnt', "didn't",
  'isnt', "isn't", 'arent', "aren't", 'wasnt', "wasn't", 'cant', "can't",
]);

function norm(text: string): string {
  return text.toLowerCase().replace(/[’‘`]/g, "'");
}

/** True if one of the 3 words before `index` (within the same clause) is a negator. */
function isNegated(text: string, index: number): boolean {
  const before = text.slice(0, index);
  const clause = before.split(/[,.;:!?\n]|\bbut\b|\bthough\b|\bhowever\b/).pop() ?? '';
  const words = clause.split(/\s+/).filter(Boolean).slice(-3);
  return words.some((w) => NEGATORS.has(w));
}

/** First non-negated match of `re` in text, or null. */
function find(text: string, re: RegExp): RegExpExecArray | null {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let m: RegExpExecArray | null;
  while ((m = g.exec(text))) {
    if (!isNegated(text, m.index)) return m;
    if (m[0].length === 0) g.lastIndex++;
  }
  return null;
}

function applyRules<T>(text: string, rules: Rule<T>[]): T[] {
  const out: T[] = [];
  for (const r of rules) if (find(text, r.re)) out.push(...r.out);
  return out;
}

// ---------- Features ----------

const ITCH = /\b(itch|itches|itchy|itching|itchiness|khujli|khujali|kharish|kharash)\b/;

const FEATURE_RULES: Rule<FeatureId>[] = [
  { re: ITCH, out: ['itchy'] },
  { re: /\b(pimples?|acne|zits?|breakouts?|daane|dane)\b/, out: ['pustules', 'small_bumps'] },
  { re: /\b(blackheads?|whiteheads?)\b/, out: ['blackheads_whiteheads'] },
  { re: /\b(dandruff|scalp flakes|flakes in (my )?hair)\b/, out: ['dandruff_flakes'] },
  { re: /\b(scaly|scales|scaling|flaky|flakes|flaking|peeling|peels)\b/, out: ['scaly_flaky'] },
  {
    re: /\b(bald (patch|patches|spot|spots)|coin[- ]?(shaped|sized) (bald|patch)|patchy hair ?(loss|fall))\b/,
    out: ['patchy_hair_loss_smooth'],
  },
  { re: /\b(white|whitish|light|lighter|pale) (patch|patches|spot|spots|marks?)\b/, out: ['lighter_patches'] },
  { re: /\b(rings?|ring[- ]shaped|circular|circles?|round patch(es)?)\b/, out: ['ring_shaped_clear_centre'] },
  { re: /\b(blisters?|water(y)? bubbles?|water[- ]filled|fluid[- ]filled|watery bumps?)\b/, out: ['blisters'] },
  { re: /\b(pus|pus[- ]filled|pustules?)\b/, out: ['pustules'] },
  {
    re: /\b(dark (spots?|patch(es)?|marks?|skin)|pigmentation|hyperpigmentation|blackish|tanning)\b/,
    out: ['dark_patches'],
  },
  { re: /\b(red|redness|reddish|inflamed|inflammation)\b/, out: ['red_inflamed'] },
  { re: /\b(pain|painful|hurts?|hurting|sore|tender|aching|aches?)\b/, out: ['painful_tender'] },
  { re: /\b(hives|welts?|urticaria)\b/, out: ['hives'] },
  {
    re: /\b(comes? and goes?|coming and going|on and off|off and on|keeps? coming back|appears? and disappears?)\b/,
    out: ['comes_and_goes'],
  },
  { re: /\b(bumps?|small spots|tiny spots|rash(es)?)\b/, out: ['small_bumps'] },
  { re: /\b(dry|dryness|rough)\b/, out: ['dry_rough_skin'] },
  { re: /\b(oozing|oozes?|weeping|discharge|wet and sticky)\b/, out: ['oozing_weeping'] },
  { re: /\b(crusts?|crusty|crusting|honey[- ]colou?red)\b/, out: ['honey_crust'] },
  { re: /\b(burning|tingling|tingly)\b/, out: ['burning_tingling_first'] },
  { re: /\b(suddenly|overnight|all of a sudden)\b/, out: ['onset_sudden'] },
  { re: /\b(fever|feverish|bukhar)\b/, out: ['fever_now'] },
  { re: /\b(oily skin|oily face|greasy skin)\b/, out: ['oily_skin'] },
  { re: /\b(steroid|betnovate|panderm|quadriderm|fair(ness)? cream|mixed cream)\b/, out: ['used_steroid_cream'] },
  {
    re: /\b(family|everyone at home|whole family|brother|sister|kids|children|roommates?) (is |are |also |too )*(itch|itchy|itching|scratching)\b/,
    out: ['family_also_itchy'],
  },
  { re: /\b(thick|yellow|crumbly) (toe ?)?nails?\b/, out: ['nail_thick_yellow'] },
];

const HAIR_FALL =
  /\b(hair ?fall|hairfall|hair loss|losing (my )?hair|hair (is )?(falling|fall(s)?) out|hair (is )?falling|thinning hair|hair (is )?thinning)\b/;
const HEAVY_SHEDDING = /\b(sudden|suddenly|a lot|lots|handfuls?|clumps?|so much|too much|bunches)\b/;
const NIGHT = /\b(night|nights|nighttime|at night|while sleeping|in bed)\b/;

const NUM_WORDS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, few: 3, 'a few': 3, couple: 2, 'a couple': 2, 'a couple of': 2,
  several: 4,
};
const UNIT_DAYS: Record<string, number> = { day: 1, week: 7, month: 30, year: 365 };

/** Parse a simple duration into days, or null. Exported for tests. */
export function parseDurationDays(text: string): number | null {
  const t = norm(text);
  const m = t.match(
    /(?<!\b(?:per|once|twice|thrice|times|every) )\b(\d+(?:\.\d+)?|a couple of|a couple|a few|couple|few|several|an?|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:or so\s*)?(day|week|month|year)s?\b/,
  );
  if (m) {
    const n = /^\d/.test(m[1]) ? parseFloat(m[1]) : NUM_WORDS[m[1]];
    return n * UNIT_DAYS[m[2]];
  }
  // Bare plurals: "since months", "for years", "for weeks", "few days".
  const bare = t.match(/\b(days|weeks|months|years)\b/);
  if (bare) return { days: 4, weeks: 21, months: 90, years: 730 }[bare[1]] ?? null;
  if (/\b(yesterday|today|last night)\b/.test(t)) return 1;
  if (/\b(since childhood|since i was (a )?(kid|child|young)|whole life|all my life)\b/.test(t)) return 3650;
  return null;
}

function durationFeature(days: number): FeatureId {
  if (days < 14) return 'duration_under_2w';
  if (days <= 42) return 'duration_2_to_6w';
  return 'duration_over_6w';
}

export function extractFeatures(text: string): FeatureId[] {
  const t = norm(text);
  const out = applyRules(t, FEATURE_RULES);

  if (find(t, HAIR_FALL)) out.push(HEAVY_SHEDDING.test(t) ? 'sudden_shedding' : 'diffuse_thinning');
  if (out.includes('itchy') && NIGHT.test(t)) out.push('itch_worse_night');
  if (out.includes('dandruff_flakes') && out.includes('itchy')) out.push('scalp_itch');
  if (/\b(since childhood|since i was (a )?(kid|child))\b/.test(t)) out.push('started_childhood');

  const days = parseDurationDays(t);
  if (days !== null) out.push(durationFeature(days));

  return [...new Set(out)];
}

// ---------- Body areas ----------

const AREA_RULES: Rule<BodyArea>[] = [
  { re: /\b(face|facial|cheeks?|forehead|chin|nose|jaw ?line|temples?)\b/, out: ['face'] },
  { re: /\b(scalp|head|hair|hairline)\b/, out: ['scalp'] },
  { re: /\b(beard|moustache|mustache|eyebrows?|brows?)\b/, out: ['eyebrows_beard'] },
  { re: /\b(ears?|earlobes?)\b/, out: ['ears'] },
  { re: /\b(lips?|mouth|tongue|gums?)\b/, out: ['mouth'] },
  { re: /\b(neck)\b/, out: ['neck'] },
  { re: /\b(chest|breasts?)\b/, out: ['chest'] },
  { re: /(?<!\b(?:comes?|coming|came|goes|going|went|keeps?|grows?|growing|grew|is|are) )\bback\b/, out: ['back'] },
  { re: /\b(tummy|belly|stomach|abdomen|navel|belly button)\b/, out: ['abdomen'] },
  { re: /\b(armpits?|underarms?|under arms?)\b/, out: ['armpits'] },
  { re: /\b(groin|thigh folds?|inner thighs?|jock)\b/, out: ['groin'] },
  {
    re: /\b(private parts?|privates|genitals?|genital area|penis|vagina|vulva|scrotum|testicles?)\b/,
    out: ['genitals'],
  },
  { re: /\b(butt|buttocks?|bum|hips?)\b/, out: ['buttocks'] },
  { re: /\b(upper arms?|arms?|shoulders?)\b/, out: ['upper_arms'] },
  { re: /\b(elbows?)\b/, out: ['elbows'] },
  { re: /\b(forearms?|wrists?)\b/, out: ['forearms_wrists'] },
  { re: /\bbetween (my |the )?fingers\b/, out: ['finger_webs'] },
  { re: /\b(hands?|palms?|fingers?|knuckles?)\b/, out: ['hands'] },
  { re: /\b(thighs?)\b/, out: ['thighs'] },
  { re: /\b(knees?)\b/, out: ['knees'] },
  { re: /\b(legs?|shins?|calf|calves|ankles?)\b/, out: ['shins'] },
  { re: /\bbetween (my |the )?toes\b/, out: ['toe_webs'] },
  { re: /\b(feet|foot|soles?|heels?)\b/, out: ['feet'] },
];

const TOENAIL = /\b(toe ?nails?|nails? (on|of) (my )?(toes?|feet|foot)|toe)\b/;
const NAIL = /\b(nails?|fingernails?|finger nails?)\b/;
const ACNE_WORDS = /\b(pimples?|acne|zits?|breakouts?|blackheads?|whiteheads?)\b/;

export function extractAreas(text: string): BodyArea[] {
  const t = norm(text);
  // "inner thigh" is groin, not thighs.
  let out = applyRules(t, AREA_RULES);
  if (out.includes('groin') && !/\bthighs?\b(?!\s*folds?)/.test(t.replace(/inner thighs?/g, ''))) {
    out = out.filter((a) => a !== 'thighs');
  }
  // "between fingers"/"between toes" shouldn't also count as hands/feet unless said separately.
  if (out.includes('finger_webs') && !/\b(hands?|palms?)\b/.test(t)) out = out.filter((a) => a !== 'hands');

  if (find(t, NAIL) || /\btoe ?nails?\b/.test(t)) {
    if (TOENAIL.test(t)) {
      out.push('toenails');
      if (!/\b(feet|foot|soles?|heels?)\b/.test(t.replace(/nails? (on|of) (my )?(feet|foot)/g, ''))) {
        out = out.filter((a) => a !== 'feet');
      }
    } else {
      out.push('fingernails');
    }
  }
  // "hair" in "facial hair" is beard, not scalp.
  if (/\bfacial hair\b/.test(t) && !/\b(scalp|head|hairline)\b/.test(t)) {
    out = out.filter((a) => a !== 'scalp');
    if (!out.includes('eyebrows_beard')) out.push('eyebrows_beard');
  }
  if (out.length === 0 && ACNE_WORDS.test(t)) out.push('face');
  if (out.length === 0 && /\bdandruff\b/.test(t)) out.push('scalp');

  return [...new Set(out)];
}
