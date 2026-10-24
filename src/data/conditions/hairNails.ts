import type { Condition } from '../../types';

// Hair and nail conditions. Educational only: basic care, never medicines or doses.

export const HAIR_NAIL_CONDITIONS: Condition[] = [
  // ---------------------------------------------------------------- HAIR
  {
    id: 'alopecia_areata',
    name: 'Alopecia areata',
    aka: ['Patchy hair loss', 'Spot baldness'],
    category: 'hair',
    prevalence: 'common',
    evidence: {
      patchy_hair_loss_smooth: 3,
      eyebrow_beard_loss: 2,
      onset_sudden: 1,
      nail_pitting: 1,
      no_symptoms: 1,
      family_history_same: 1,
      worse_stress: 1,
      asthma_hayfever: 1,
      scalp_itch: -1,
      scaly_flaky: -2,
      scaly_patch_broken_hairs: -2,
      boggy_scalp_swelling: -3,
      tight_hairstyles: -1,
    },
    sites: { scalp: 3, eyebrows_beard: 2 },
    alsoCheck: [
      { area: 'fingernails', reason: 'Tiny pits or ridges in the nails often come with this kind of hair loss.' },
      { area: 'eyebrows_beard', reason: 'Round bald patches can also appear in the eyebrows, eyelashes or beard.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Alopecia areata causes round or oval patches where hair suddenly falls out. The skin underneath looks normal and smooth.',
      looksLike: [
        'One or more smooth, round bald patches, often coin-sized',
        'Skin in the patch looks normal — not red, scaly or scarred',
        'Short broken hairs at the edge that get thinner towards the root ("exclamation mark" hairs)',
        'Can affect eyebrows, eyelashes or beard',
        'Sometimes tiny pits or ridges in the nails',
      ],
      progression:
        'Patches usually appear over a few weeks. Hair often grows back by itself within months, sometimes white at first. New patches can come and go over years. Rarely, it spreads to the whole scalp or body.',
      why:
        'The body’s immune system mistakenly attacks the hair roots (follicles), which pushes them into a resting state so the hair falls out. The roots are not destroyed, so hair can grow back. It runs in families and is more common in people with other immune conditions like thyroid disease or vitiligo.',
      tests: [
        { name: 'Look at the scalp with a magnifier (dermoscopy / trichoscopy)', why: 'Shows typical signs like "exclamation mark" hairs and yellow dots, and helps rule out fungal infection.' },
        { name: 'Pull test', why: 'Gently pulling hair at the edge of a patch shows if the patch is still active and spreading.' },
        { name: 'Blood tests: thyroid, and sometimes iron or vitamin D', why: 'Thyroid problems often travel with alopecia areata and can add to hair loss.' },
      ],
      doctor: {
        type: 'Dermatologist (or GP first)',
        when: 'Book a routine visit, sooner if patches are spreading quickly, eyebrows or eyelashes are affected, or it is a child.',
      },
      dos: [
        'Take a dated photo of each patch so you can see if it grows back or spreads',
        'Protect bare patches from the sun with a hat',
        'Be gentle with the hair that is there — soft brush, loose styles',
        'Seek support if it is affecting your mood; it is common to feel upset',
      ],
      donts: [
        'Don’t use steroid or mixed creams from a shop without a doctor checking first',
        'Don’t pull or pick at the hairs at the edge of a patch',
        'Don’t wear very tight hairstyles over the patches',
        'Don’t blame yourself — it is not caused by poor hygiene',
      ],
      skinToneNote:
        'On brown and dark skin the bald patch may look slightly lighter or show the scalp clearly; regrowing hair can come back lighter or white for a while before darkening.',
      sources: [
        { label: 'DermNet: Alopecia areata', url: 'https://dermnetnz.org/topics/alopecia-areata' },
        { label: 'NHS: Hair loss', url: 'https://www.nhs.uk/conditions/hair-loss/' },
      ],
    },
  },
  {
    id: 'androgenetic_alopecia',
    name: 'Pattern hair loss',
    aka: ['Androgenetic alopecia', 'Male pattern baldness', 'Female pattern hair loss'],
    category: 'hair',
    prevalence: 'very_common',
    evidence: {
      receding_hairline: 2,
      widening_parting: 2,
      family_history_same: 2,
      duration_over_6w: 1,
      diffuse_thinning: 1,
      no_symptoms: 1,
      patchy_hair_loss_smooth: -2,
      onset_sudden: -2,
      sudden_shedding: -1,
      scaly_patch_broken_hairs: -2,
      boggy_scalp_swelling: -3,
    },
    sites: { scalp: 3 },
    alsoCheck: [
      { area: 'eyebrows_beard', reason: 'Pattern hair loss leaves eyebrows and beard alone; loss there points to another cause.' },
      { area: 'face', reason: 'In women, acne or extra facial hair with thinning can mean a hormone imbalance worth checking.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Pattern hair loss is slow thinning of hair in a typical pattern, linked to genes and hormones. It is the most common cause of hair loss in both men and women.',
      looksLike: [
        'Men: hairline moving back at the temples and/or thinning at the crown',
        'Women: widening parting and thinning on top, with the front hairline usually kept',
        'Hairs get finer and shorter over time',
        'Scalp skin looks normal — no redness, scale or bald round patches',
        'Often others in the family have the same pattern',
      ],
      progression:
        'Develops slowly over years, often starting from the late teens or twenties in men and more often after menopause in women. It tends to keep slowly progressing without treatment.',
      why:
        'In people with certain genes, hair roots on the top of the head are sensitive to male-type hormones (androgens). Over time these roots shrink, making thinner, shorter hairs until some stop growing visible hair. The roots on the back and sides are less sensitive, so that hair is kept.',
      tests: [
        { name: 'Look at the scalp with a magnifier (dermoscopy / trichoscopy)', why: 'Shows hairs of many different thicknesses, which is typical of this kind of thinning.' },
        { name: 'Blood tests: iron (ferritin), thyroid, sometimes vitamin B12/D', why: 'Low iron or thyroid problems can add to thinning and are worth fixing.' },
        { name: 'Hormone blood tests (women)', why: 'If there are irregular periods, acne or extra body hair, a hormone condition like PCOS may be checked.' },
      ],
      doctor: {
        type: 'GP or Dermatologist',
        when: 'Routine visit if it bothers you. Women with irregular periods, acne or extra facial hair should mention it.',
      },
      dos: [
        'Take photos every few months in the same light to track changes',
        'Eat a balanced diet with enough protein and iron-rich foods',
        'Treat hair gently: wide-tooth comb, low heat',
        'Ask a doctor early if you want treatment — it works best when started sooner',
      ],
      donts: [
        'Don’t buy hair-loss products online without a doctor’s advice',
        'Don’t wear tight hairstyles that add pulling stress',
        'Don’t ignore sudden or patchy loss — that is usually a different problem',
      ],
      sources: [
        { label: 'NHS: Hair loss', url: 'https://www.nhs.uk/conditions/hair-loss/' },
        { label: 'DermNet: Male pattern hair loss', url: 'https://dermnetnz.org/topics/male-pattern-hair-loss' },
        { label: 'DermNet: Female pattern hair loss', url: 'https://dermnetnz.org/topics/female-pattern-hair-loss' },
      ],
    },
  },
  {
    id: 'telogen_effluvium',
    name: 'Telogen effluvium',
    aka: ['Stress shedding', 'Hair shedding after illness or childbirth'],
    category: 'hair',
    prevalence: 'common',
    evidence: {
      sudden_shedding: 3,
      recent_illness: 3,
      diffuse_thinning: 2,
      tired_weight_change: 1,
      heavy_periods: 1,
      new_medicine: 1,
      worse_stress: 1,
      no_symptoms: 1,
      patchy_hair_loss_smooth: -2,
      scaly_patch_broken_hairs: -2,
      receding_hairline: -1,
      boggy_scalp_swelling: -3,
    },
    sites: { scalp: 3 },
    alsoCheck: [
      { area: 'fingernails', reason: 'A line across the nails (Beau’s line) can show the same past illness or shock to the body.' },
      { area: 'eyebrows_beard', reason: 'Shedding is mostly on the scalp; patches in the brows or beard suggest a different cause.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Telogen effluvium is heavy, even shedding of hair that starts a few months after a shock to the body, like fever, surgery, childbirth, a crash diet or big stress.',
      looksLike: [
        'Lots of hair coming out when washing or brushing, often whole hairs with a small white bulb at the end',
        'Thinning all over the scalp rather than in patches',
        'Ponytail feels thinner',
        'Scalp skin looks normal',
        'Started about 2–4 months after an illness, childbirth, operation, weight loss or stress',
      ],
      progression:
        'Shedding usually lasts a few months, then slows. New short hairs grow back over 6–12 months. If the trigger keeps going (like low iron or thyroid problems), it can carry on longer.',
      why:
        'Each hair has a growing phase and a resting phase. A shock to the body can push many hairs into the resting phase at the same time. About 2–3 months later, these resting hairs all fall out together, which is why the shedding starts long after the trigger.',
      tests: [
        { name: 'Pull test', why: 'Gently pulling a small bunch of hair shows if more hairs than usual come out easily.' },
        { name: 'Blood tests: iron (ferritin), thyroid, vitamin B12/D, full blood count', why: 'Low iron, thyroid problems or low vitamins can trigger or keep the shedding going.' },
        { name: 'Look at the scalp with a magnifier (trichoscopy)', why: 'Helps tell this apart from pattern hair loss, which can look similar.' },
      ],
      doctor: {
        type: 'GP',
        when: 'Routine visit, especially if shedding lasts more than 6 months, or you feel tired, have heavy periods or lost weight.',
      },
      dos: [
        'Think back 2–4 months for a trigger (illness, birth, surgery, diet, stress, new medicine)',
        'Eat regular balanced meals with enough protein and iron-rich foods',
        'Be patient — regrowth takes months and short new hairs are a good sign',
        'Handle hair gently while it is shedding',
      ],
      donts: [
        'Don’t crash diet — fast weight loss is a common trigger',
        'Don’t stop a prescribed medicine on your own because of hair loss; ask your doctor',
        'Don’t panic-buy hair products; most shedding settles once the trigger is gone',
      ],
      sources: [
        { label: 'DermNet: Telogen effluvium', url: 'https://dermnetnz.org/topics/telogen-effluvium' },
        { label: 'NHS: Hair loss', url: 'https://www.nhs.uk/conditions/hair-loss/' },
      ],
    },
  },
  {
    id: 'tinea_capitis',
    name: 'Scalp ringworm',
    aka: ['Tinea capitis', 'Fungal scalp infection', 'Kerion (swollen form)'],
    category: 'hair',
    prevalence: 'common',
    evidence: {
      scaly_patch_broken_hairs: 3,
      boggy_scalp_swelling: 2,
      scaly_flaky: 1,
      scalp_itch: 1,
      pets_animals: 1,
      family_also_itchy: 1,
      pustules: 1,
      patchy_hair_loss_smooth: -1,
      thick_silvery_scale: -1,
      diffuse_thinning: -1,
    },
    sites: { scalp: 3, neck: 1 },
    alsoCheck: [
      { area: 'scalp', reason: 'Check family members’ scalps too — it spreads easily between children at home and school.' },
      { area: 'face', reason: 'Ringworm can also show as a ring-shaped patch on the face or body.' },
      { area: 'neck', reason: 'Swollen glands at the back of the neck often come with scalp ringworm.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Scalp ringworm is a fungal infection of the scalp and hair, mostly in children. It causes scaly patches where hairs break off. It is not caused by a worm.',
      looksLike: [
        'Scaly, itchy patch with hair loss',
        'Hairs broken off close to the scalp, sometimes like black dots',
        'Patch may grow slowly outwards',
        'Sometimes a soft, swollen, tender lump with pus (kerion)',
        'Swollen glands at the back of the neck',
      ],
      progression:
        'Patches grow and spread over weeks and do not go away by themselves. A kerion can leave a permanent bald scar if not treated early, so it needs prompt medical care.',
      why:
        'A fungus that lives on skin, animals or soil gets into the hair shaft. It weakens the hair so it snaps, and the body’s reaction causes scaling and swelling. It spreads by close contact, shared combs, hats or pillows, and from pets like cats and dogs.',
      tests: [
        { name: 'Fungal scraping and plucked hairs (microscopy and culture)', why: 'Confirms the fungus and shows which type, which guides treatment and tells if pets or family are the source.' },
        { name: 'Wood’s lamp (UV light)', why: 'Some types of this fungus glow under UV light.' },
        { name: 'Dermoscopy (trichoscopy)', why: 'Shows broken, comma- or corkscrew-shaped hairs typical of fungal infection.' },
      ],
      doctor: {
        type: 'GP or Dermatologist',
        when: 'Within a few days. Go sooner if there is a swollen, boggy, painful lump (kerion).',
      },
      dos: [
        'Check everyone at home, especially other children',
        'Wash combs, brushes, hats and pillowcases often',
        'Get pets checked by a vet if they have bald or scaly patches',
        'Keep going with any treatment a doctor gives for the full time',
      ],
      donts: [
        'Don’t share combs, brushes, hats, towels or pillows',
        'Don’t use steroid or mixed creams — they can make fungal infection worse',
        'Don’t shave the head or squeeze a kerion',
        'Don’t rely on skin creams alone; scalp ringworm usually needs a doctor’s treatment',
      ],
      skinToneNote:
        'It is especially common in children with Afro-textured hair. Patches may look grey and scaly rather than red, and black dots of broken hair can be easy to miss.',
      sources: [
        { label: 'DermNet: Tinea capitis', url: 'https://dermnetnz.org/topics/tinea-capitis' },
        { label: 'NHS: Ringworm', url: 'https://www.nhs.uk/conditions/ringworm/' },
      ],
    },
  },
  {
    id: 'scalp_seborrhoeic_dermatitis',
    name: 'Dandruff / scalp seborrhoeic dermatitis',
    aka: ['Dandruff', 'Seborrhoeic dermatitis of the scalp', 'Cradle cap (babies)'],
    category: 'hair',
    prevalence: 'very_common',
    evidence: {
      dandruff_flakes: 3,
      greasy_yellow_scale: 2,
      scalp_itch: 2,
      oily_skin: 1,
      comes_and_goes: 1,
      worse_stress: 1,
      worse_in_winter: 1,
      red_inflamed: 1,
      thick_silvery_scale: -2,
      well_defined_edges: -1,
      scaly_patch_broken_hairs: -2,
      patchy_hair_loss_smooth: -2,
    },
    sites: { scalp: 3, eyebrows_beard: 2, ears: 2, face: 2, chest: 1 },
    alsoCheck: [
      { area: 'face', reason: 'Greasy flakes beside the nose and on the eyebrows often come with scalp flaking.' },
      { area: 'ears', reason: 'Flaking in and behind the ears is common with this condition.' },
      { area: 'chest', reason: 'A flaky patch in the middle of the chest can be part of the same problem.' },
      { area: 'elbows', reason: 'Thick scaly patches on elbows would point more to psoriasis instead.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Dandruff is flaking of the scalp. When it comes with redness and greasy yellow flakes, it is called seborrhoeic dermatitis. It is very common and not infectious.',
      looksLike: [
        'White or yellowish flakes on the scalp, hair and shoulders',
        'Greasy, yellow scale with some redness',
        'Itchy scalp',
        'Flaking on eyebrows, beside the nose, behind the ears or in the beard',
        'Thick yellow crusts on a baby’s scalp (cradle cap)',
      ],
      progression:
        'Long-lasting and tends to come and go. Often worse in winter, with stress or tiredness. It can usually be kept under control but may return.',
      why:
        'A yeast that normally lives on everyone’s skin feeds on scalp oil. In some people the skin reacts to it with mild inflammation, so skin cells turn over faster and clump into flakes. Oily areas like the scalp, face and chest are affected most.',
      tests: [
        { name: 'Usually none — a doctor can tell by looking', why: 'The look and places it affects are typical.' },
        { name: 'Fungal scraping (in children)', why: 'In children a scaly scalp may be ringworm instead, so a sample may be checked.' },
      ],
      doctor: {
        type: 'Pharmacist or GP; Dermatologist if severe',
        when: 'See a GP if it is very red, spreading, not settling with regular washing, or there is hair loss.',
      },
      dos: [
        'Wash hair regularly to clear oil and flakes',
        'Gently remove flakes rather than scratching',
        'Ask a pharmacist or doctor what to use if regular washing is not enough',
        'Manage stress and sleep — flares often follow them',
      ],
      donts: [
        'Don’t scratch hard — it can break the skin and cause infection',
        'Don’t use steroid or mixed creams long term without a doctor',
        'Don’t pile on heavy oils if flakes are greasy; they can feed the yeast',
      ],
      skinToneNote:
        'On brown and dark skin redness may be hard to see; patches can look darker or lighter than the surrounding skin. People who wash Afro-textured hair less often may notice more build-up.',
      sources: [
        { label: 'NHS: Dandruff', url: 'https://www.nhs.uk/conditions/dandruff/' },
        { label: 'NHS: Seborrhoeic dermatitis', url: 'https://www.nhs.uk/conditions/seborrhoeic-dermatitis/' },
      ],
    },
  },
  {
    id: 'scalp_psoriasis',
    name: 'Scalp psoriasis',
    category: 'hair',
    prevalence: 'common',
    evidence: {
      thick_silvery_scale: 3,
      well_defined_edges: 2,
      raised_plaques: 2,
      scalp_itch: 1,
      family_history_same: 1,
      nail_pitting: 2,
      joint_pain: 1,
      comes_and_goes: 1,
      worse_stress: 1,
      greasy_yellow_scale: -1,
      scaly_patch_broken_hairs: -1,
      patchy_hair_loss_smooth: -2,
    },
    sites: { scalp: 3, ears: 2, neck: 1, face: 1 },
    alsoCheck: [
      { area: 'elbows', reason: 'Psoriasis often shows as thick scaly patches on the elbows.' },
      { area: 'knees', reason: 'The front of the knees is another classic place for psoriasis patches.' },
      { area: 'fingernails', reason: 'Tiny pits or nails lifting off the nail bed are common with psoriasis.' },
      { area: 'ears', reason: 'Scaly patches in and behind the ears often come with scalp psoriasis.' },
      { area: 'buttocks', reason: 'A pink scaly patch between the buttocks is a hidden place psoriasis likes.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Scalp psoriasis causes thick, raised, scaly patches on the scalp. It is a long-term immune skin condition and is not infectious.',
      looksLike: [
        'Raised, red or darker patches with thick silvery-white scale',
        'Clear, sharp edges, often going past the hairline onto the forehead, neck or behind the ears',
        'Itching or soreness',
        'Scales stuck in the hair',
        'Sometimes similar patches on elbows, knees or nails',
      ],
      progression:
        'Long-lasting and comes in flares, often triggered by stress, infections or scratching. It can be controlled but usually does not go away completely. Temporary hair shedding can happen with heavy scale but hair usually regrows.',
      why:
        'The immune system becomes over-active and tells skin cells to grow much faster than normal — in days instead of weeks. The extra cells pile up into thick scaly patches. It runs in families and is linked to joint inflammation (psoriatic arthritis) in some people.',
      tests: [
        { name: 'Usually none — a doctor can tell by looking', why: 'The thick scale, sharp edges and other places it shows up are typical.' },
        { name: 'Dermoscopy', why: 'Shows a pattern of tiny red dots of blood vessels that helps tell it from dandruff.' },
        { name: 'Skin biopsy (rarely)', why: 'Only if the diagnosis is unclear.' },
      ],
      doctor: {
        type: 'GP or Dermatologist',
        when: 'Routine visit. Mention any joint pain or swelling, as this may need its own check.',
      },
      dos: [
        'Soften and remove scale gently, never by force',
        'Wash hair regularly with a mild product',
        'Look out for and mention joint pain, nail changes or patches elsewhere',
        'Manage stress, avoid smoking and limit alcohol — these can worsen psoriasis',
      ],
      donts: [
        'Don’t pick or scrape scales off — injury can trigger new patches',
        'Don’t use steroid or mixed creams without a doctor’s advice',
        'Don’t comb or brush harshly over patches',
      ],
      skinToneNote:
        'On brown and dark skin, patches often look purple, grey or dark brown rather than red, and can leave dark or light marks after healing.',
      sources: [
        { label: 'DermNet: Scalp psoriasis', url: 'https://dermnetnz.org/topics/scalp-psoriasis' },
        { label: 'NHS: Psoriasis', url: 'https://www.nhs.uk/conditions/psoriasis/' },
      ],
    },
  },
  {
    id: 'traction_alopecia',
    name: 'Traction alopecia',
    aka: ['Hair loss from tight hairstyles'],
    category: 'hair',
    prevalence: 'common',
    evidence: {
      tight_hairstyles: 3,
      receding_hairline: 1,
      small_bumps: 1,
      painful_tender: 1,
      duration_over_6w: 1,
      patchy_hair_loss_smooth: -1,
      scaly_patch_broken_hairs: -1,
      sudden_shedding: -1,
      boggy_scalp_swelling: -2,
    },
    sites: { scalp: 3 },
    alsoCheck: [
      { area: 'eyebrows_beard', reason: 'Traction loss is only where hair is pulled; loss in the brows or beard points to another cause.' },
      { area: 'fingernails', reason: 'Pits in the nails would point more to alopecia areata, which can look similar at the edges.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Traction alopecia is hair loss caused by long-term pulling on the hair from tight hairstyles, extensions, weaves or head coverings.',
      looksLike: [
        'Thinning along the front hairline and temples, or wherever hair is pulled most',
        'Often a fringe of short hairs left at the very edge of the hairline',
        'Small bumps or spots at the hair roots after styling',
        'Soreness, tightness or headache from the hairstyle',
      ],
      progression:
        'Early on, hair grows back once the pulling stops. If pulling goes on for years, the roots can scar and the loss becomes permanent.',
      why:
        'Constant tension pulls on the hair roots and inflames them. At first the roots just stop growing hair for a while, but long-term damage can replace them with scar tissue so they can no longer make hair.',
      tests: [
        { name: 'Look at the scalp with a magnifier (trichoscopy)', why: 'Shows whether roots are still alive (good chance of regrowth) or scarred.' },
        { name: 'Scalp biopsy (sometimes)', why: 'If it is unclear whether the loss is scarring or another condition.' },
      ],
      doctor: {
        type: 'Dermatologist',
        when: 'Routine visit — the earlier the better, as early loss can recover.',
      },
      dos: [
        'Switch to loose, low-tension styles and change parting often',
        'Take breaks between braids, weaves or extensions',
        'Use soft hair ties without metal parts',
        'Stop any style that hurts, causes bumps or a headache',
      ],
      donts: [
        'Don’t wear tight braids, buns, ponytails or extensions all the time',
        'Don’t put braids or extensions on already thinning edges',
        'Don’t combine tight styles with harsh chemical relaxers or high heat',
      ],
      skinToneNote:
        'Most common in people with Afro-textured hair and in anyone who wears tight styles or head coverings daily, such as dancers, athletes or people who wear turbans.',
      sources: [
        { label: 'DermNet: Traction alopecia', url: 'https://dermnetnz.org/topics/traction-alopecia' },
        { label: 'NHS: Hair loss', url: 'https://www.nhs.uk/conditions/hair-loss/' },
      ],
    },
  },
  {
    id: 'head_lice',
    name: 'Head lice',
    aka: ['Pediculosis capitis', 'Nits'],
    category: 'hair',
    prevalence: 'very_common',
    evidence: {
      scalp_itch: 3,
      family_also_itchy: 2,
      itch_worse_night: 1,
      small_bumps: 1,
      itchy: 1,
      thick_silvery_scale: -2,
      greasy_yellow_scale: -1,
      patchy_hair_loss_smooth: -2,
      diffuse_thinning: -2,
    },
    sites: { scalp: 3, neck: 2, ears: 2 },
    alsoCheck: [
      { area: 'neck', reason: 'Lice eggs and itchy bumps are most often found at the nape of the neck.' },
      { area: 'ears', reason: 'The hair behind the ears is a favourite place for lice and their eggs.' },
      { area: 'scalp', reason: 'Check everyone at home — lice spread by head-to-head contact.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Head lice are tiny insects that live in hair and feed on blood from the scalp. They are very common in school children and have nothing to do with being dirty.',
      looksLike: [
        'Itchy scalp, especially behind the ears and at the back of the neck',
        'Small grey-brown insects moving in the hair',
        'Tiny eggs (nits) stuck firmly to hairs close to the scalp; empty shells look white',
        'Small red bumps or scratch marks on the neck',
      ],
      progression:
        'Lice lay eggs that hatch in about a week. Without removal, numbers grow and spread to others at home or school. Itch can take weeks to start after the first lice arrive.',
      why:
        'Lice crawl from one head to another during close head-to-head contact; they cannot jump or fly. They bite the scalp to feed, and the itch is an allergic reaction to their saliva. They glue their eggs to hairs near the scalp, where it is warm.',
      tests: [
        { name: 'Wet combing with a fine-tooth lice comb', why: 'Finding a live louse is the only way to be sure there is an active infestation.' },
      ],
      doctor: {
        type: 'Pharmacist; GP if not clearing',
        when: 'Usually handled at home. See a GP if the scalp is broken, oozing or infected, or lice keep coming back.',
      },
      dos: [
        'Wet-comb the hair section by section with a fine-tooth comb and conditioner',
        'Repeat combing every few days for about two weeks to catch newly hatched lice',
        'Check everyone at home on the same day',
        'Ask a pharmacist about treatment options if combing is not enough',
      ],
      donts: [
        'Don’t share combs, brushes, hats or pillows until cleared',
        'Don’t treat anyone unless a live louse is found',
        'Don’t use kerosene, petrol or pet products on the head — they are dangerous',
        'Don’t keep children home from school just for lice',
      ],
      sources: [
        { label: 'NHS: Head lice and nits', url: 'https://www.nhs.uk/conditions/head-lice-and-nits/' },
        { label: 'DermNet: Head lice', url: 'https://dermnetnz.org/topics/head-lice' },
      ],
    },
  },

  // ---------------------------------------------------------------- NAILS
  {
    id: 'onychomycosis',
    name: 'Fungal nail infection',
    aka: ['Onychomycosis', 'Tinea unguium'],
    category: 'nails',
    prevalence: 'very_common',
    evidence: {
      nail_thick_yellow: 3,
      nail_lifting: 1,
      nail_white_spots: 1,
      duration_over_6w: 1,
      diabetes: 1,
      shared_towels_sport: 1,
      no_symptoms: 1,
      nail_pitting: -2,
      nail_fold_swollen: -1,
      onset_sudden: -2,
      nail_spoon: -1,
    },
    sites: { toenails: 3, fingernails: 1 },
    alsoCheck: [
      { area: 'toe_webs', reason: 'Athlete’s foot between the toes is often where the nail fungus came from.' },
      { area: 'feet', reason: 'Dry scaling on the soles can be the same fungus spreading.' },
      { area: 'groin', reason: 'The same fungus can spread to the groin as an itchy ring-shaped rash.' },
      { area: 'fingernails', reason: 'Pits in the fingernails would point more to psoriasis, which can look like fungus.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'A fungal nail infection makes nails thick, discoloured and crumbly. It is very common, especially in toenails, and gets more common with age.',
      looksLike: [
        'Nail turns yellow, white, brown or cloudy, often starting at the tip or edge',
        'Nail becomes thick and hard to cut',
        'Crumbly or chalky debris under the nail',
        'Nail may lift off the skin underneath',
        'Often only some nails affected, toenails more than fingernails',
      ],
      progression:
        'Slowly gets worse over months to years and rarely goes away on its own. It can spread to other nails. Treatment is slow because nails grow slowly.',
      why:
        'Fungi that live in warm, damp places (shoes, gym floors) get under the nail, often from athlete’s foot. They feed on keratin, the protein that makes nails, which makes the nail thick and crumbly. Diabetes, poor circulation and nail injury make it more likely.',
      tests: [
        { name: 'Nail clipping or scraping for fungal test', why: 'Many nail problems (like psoriasis or injury) look like fungus, so confirming it avoids months of the wrong treatment.' },
      ],
      doctor: {
        type: 'GP or Dermatologist',
        when: 'Routine visit if it bothers you. Sooner if you have diabetes, poor circulation or the toe becomes red, painful or swollen.',
      },
      dos: [
        'Keep feet clean and dry, especially between the toes',
        'Wear breathable shoes and change socks daily',
        'Cut nails straight across and use separate clippers for affected nails',
        'Treat athlete’s foot early so it does not spread to nails',
      ],
      donts: [
        'Don’t walk barefoot in shared showers or gyms',
        'Don’t share towels, socks, shoes or nail clippers',
        'Don’t use steroid or mixed creams — they can make fungus worse',
        'Don’t dig under the nail with sharp tools',
      ],
      sources: [
        { label: 'NHS: Fungal nail infection', url: 'https://www.nhs.uk/conditions/fungal-nail-infection/' },
        { label: 'DermNet: Fungal nail infections', url: 'https://dermnetnz.org/topics/fungal-nail-infections' },
      ],
    },
  },
  {
    id: 'nail_psoriasis',
    name: 'Nail psoriasis',
    category: 'nails',
    prevalence: 'common',
    evidence: {
      nail_pitting: 3,
      nail_lifting: 2,
      thick_silvery_scale: 2,
      joint_pain: 2,
      family_history_same: 1,
      nail_thick_yellow: 1,
      nail_ridges: 1,
      nail_fold_swollen: -1,
      nail_spoon: -1,
      onset_sudden: -1,
    },
    sites: { fingernails: 3, toenails: 2 },
    alsoCheck: [
      { area: 'scalp', reason: 'Scaly patches on the scalp or along the hairline often come with nail psoriasis.' },
      { area: 'elbows', reason: 'Thick scaly patches on the elbows would support psoriasis.' },
      { area: 'knees', reason: 'The knees are another classic place for psoriasis patches.' },
      { area: 'buttocks', reason: 'A pink patch in the fold between the buttocks is a hidden sign of psoriasis.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Psoriasis can affect the nails, causing tiny pits, discolouration and lifting. It often comes with psoriasis on the skin and sometimes with joint pain.',
      looksLike: [
        'Tiny pin-prick pits in the nail surface',
        'Nail lifting off the nail bed, often with a white or yellow area',
        'Yellow-pink "oil drop" or "salmon patch" marks under the nail',
        'Thickened or crumbly nails, ridges',
        'Usually several nails, fingernails more than toenails',
      ],
      progression:
        'Long-lasting and changes slowly. Nail changes, especially with swollen finger joints, can be a sign of psoriatic arthritis, which should be checked.',
      why:
        'The same over-active immune response that causes psoriasis on the skin affects the cells that make the nail. Faulty nail growth causes pits, while changes in the nail bed cause lifting and discolouration. Nail psoriasis is closely linked to joint inflammation.',
      tests: [
        { name: 'Nail clipping fungal test', why: 'Fungal infection looks similar and can also happen on top of psoriasis.' },
        { name: 'Dermoscopy of the nail', why: 'Shows pits and nail-bed changes in more detail.' },
        { name: 'Joint examination', why: 'Nail psoriasis is a warning sign for psoriatic arthritis.' },
      ],
      doctor: {
        type: 'Dermatologist (or GP first)',
        when: 'Routine visit. Mention any stiff, swollen or painful joints, especially in the fingers or toes.',
      },
      dos: [
        'Keep nails short and filed smooth',
        'Wear gloves for wet or dirty work',
        'Look for and mention skin patches or joint pain',
        'Be gentle — injury can make nail psoriasis worse',
      ],
      donts: [
        'Don’t dig under lifted nails or clean them with sharp tools',
        'Don’t push back or cut the cuticles',
        'Don’t pick at or bite nails',
        'Don’t use steroid or mixed creams without a doctor',
      ],
      sources: [
        { label: 'DermNet: Nail psoriasis', url: 'https://dermnetnz.org/topics/nail-psoriasis' },
        { label: 'NHS: Psoriasis', url: 'https://www.nhs.uk/conditions/psoriasis/' },
      ],
    },
  },
  {
    id: 'paronychia',
    name: 'Paronychia (infected nail fold)',
    aka: ['Whitlow', 'Nail fold infection', 'Chronic paronychia'],
    category: 'nails',
    prevalence: 'common',
    evidence: {
      nail_fold_swollen: 3,
      painful_tender: 2,
      pustules: 1,
      red_inflamed: 1,
      wet_work: 2,
      diabetes: 1,
      onset_sudden: 1,
      nail_pitting: -1,
      nail_thick_yellow: -1,
      no_symptoms: -2,
    },
    sites: { fingernails: 3, toenails: 2 },
    alsoCheck: [
      { area: 'hands', reason: 'Dry, cracked or eczema-prone hands make nail fold infections more likely.' },
      { area: 'toenails', reason: 'An ingrown toenail can cause the same red, swollen nail fold on a toe.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Paronychia is an infection or inflammation of the skin around a nail. The quick (acute) type is painful and comes on in days; the long-lasting (chronic) type is common in people whose hands are often wet.',
      looksLike: [
        'Red, swollen, painful skin beside or at the base of the nail',
        'Pus (yellow or white) under the skin near the nail',
        'Throbbing pain in the fingertip',
        'Chronic type: puffy nail fold, missing cuticle, wavy or discoloured nail, several nails',
      ],
      progression:
        'The acute type develops over a day or two, often after a small injury, and may need draining if pus collects. The chronic type lasts for weeks or months and flares with water and irritants.',
      why:
        'A small break in the skin around the nail, from biting, picking, a hangnail or cutting the cuticle, lets germs in. In the acute type, bacteria cause a quick, painful infection. In the chronic type, constant wetness damages the cuticle seal so irritants and yeast keep the fold inflamed.',
      tests: [
        { name: 'Usually none — a doctor can tell by looking', why: 'The look is typical.' },
        { name: 'Swab of pus', why: 'If it keeps coming back or is not improving, to see which germ is causing it.' },
        { name: 'Blood sugar test', why: 'Repeated infections can be a sign of diabetes.' },
      ],
      doctor: {
        type: 'GP',
        when: 'Within a day or two if there is pus, spreading redness or bad pain. Same day if you have diabetes, a weak immune system, fever, or red streaks going up the finger.',
      },
      dos: [
        'Soak the finger in warm water a few times a day in the early stage',
        'Keep hands dry and wear cotton-lined gloves for wet work',
        'Moisturise hands and nail folds regularly',
        'Keep the area clean and covered if broken',
      ],
      donts: [
        'Don’t cut, push back or peel the cuticles',
        'Don’t bite nails or pick at hangnails',
        'Don’t squeeze or cut open a pus pocket yourself',
        'Don’t suck your fingers or keep hands wet for long periods',
      ],
      sources: [
        { label: 'NHS: Paronychia', url: 'https://www.nhs.uk/conditions/paronychia/' },
        { label: 'DermNet: Acute paronychia', url: 'https://dermnetnz.org/topics/acute-paronychia' },
        { label: 'DermNet: Chronic paronychia', url: 'https://dermnetnz.org/topics/chronic-paronychia' },
      ],
    },
  },
  {
    id: 'iron_deficiency_nails',
    name: 'Iron-deficiency nail changes (spoon nails)',
    aka: ['Koilonychia', 'Spoon nails'],
    category: 'nails',
    prevalence: 'uncommon',
    evidence: {
      nail_spoon: 3,
      tired_weight_change: 2,
      heavy_periods: 2,
      pregnant: 1,
      nail_ridges: 1,
      diffuse_thinning: 1,
      sudden_shedding: 1,
      nail_pitting: -1,
      nail_thick_yellow: -1,
      nail_clubbing: -2,
    },
    sites: { fingernails: 3, toenails: 1 },
    alsoCheck: [
      { area: 'mouth', reason: 'A pale, smooth tongue or sore cracks at the corners of the mouth can also be signs of low iron.' },
      { area: 'fingernails', reason: 'Check all the fingernails — low iron usually affects many nails, not just one.' },
      { area: 'scalp', reason: 'Low iron can also cause hair shedding or thinning.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Spoon-shaped nails (koilonychia) are thin nails that curve upwards like a spoon. The most common cause is low iron in the body.',
      looksLike: [
        'Nails that are thin, soft and scooped so they could hold a drop of water',
        'Brittle nails that split or break easily',
        'Often comes with tiredness, breathlessness or pale skin',
        'Heavy periods, pregnancy or a diet low in iron',
      ],
      progression:
        'Develops slowly as iron stays low. Nails slowly return to normal over months once the cause is found and iron levels recover. In young children, mild spoon-shaped toenails can be normal.',
      why:
        'Iron is needed to make red blood cells and healthy, firm nails. When iron is low, the nail grows thin and soft and bends upwards at the edges. Common causes are blood loss (heavy periods, bleeding from the gut), pregnancy or not eating or absorbing enough iron.',
      tests: [
        { name: 'Full blood count (CBC)', why: 'Shows if you are anaemic (low red blood cells).' },
        { name: 'Ferritin (iron stores)', why: 'Shows how much iron your body has stored, even before anaemia starts.' },
        { name: 'Tests for the cause', why: 'A doctor may look for where iron is being lost, such as heavy periods or bleeding from the gut.' },
      ],
      doctor: {
        type: 'GP',
        when: 'Routine visit for blood tests. Sooner if you are very tired, short of breath, have black stools or blood in your poo.',
      },
      dos: [
        'Get blood tests before trying to fix it yourself',
        'Eat iron-rich foods (beans, lentils, leafy greens, meat, fish, eggs)',
        'Tell the doctor about heavy periods, pregnancy or any bleeding',
        'Keep nails short and wear gloves for wet work while nails are fragile',
      ],
      donts: [
        'Don’t start supplements without a doctor checking your levels first',
        'Don’t ignore heavy periods or unexplained tiredness',
        'Don’t pick or peel at fragile nails',
      ],
      sources: [
        { label: 'NHS: Iron deficiency anaemia', url: 'https://www.nhs.uk/conditions/iron-deficiency-anaemia/' },
      ],
    },
  },
  {
    id: 'nail_clubbing',
    name: 'Nail clubbing',
    aka: ['Clubbed fingers'],
    category: 'nails',
    prevalence: 'uncommon',
    evidence: {
      nail_clubbing: 3,
      tired_weight_change: 1,
      no_symptoms: 1,
      duration_over_6w: 1,
      nail_spoon: -2,
      nail_pitting: -1,
      nail_fold_swollen: -1,
      onset_sudden: -1,
    },
    sites: { fingernails: 3, toenails: 1 },
    alsoCheck: [
      { area: 'fingernails', reason: 'Do the "window test": put the nails of both index fingers back to back — normally a small diamond-shaped gap shows.' },
      { area: 'toenails', reason: 'Clubbing can affect toes as well as fingers.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Clubbing is when the fingertips become rounded and bulging and the nails curve down over them. It is not harmful itself, but it can be a sign of a heart, lung or gut problem, so a doctor should check.',
      looksLike: [
        'Fingertips wider and rounder than normal, like a drumstick',
        'Nails curve downwards over the tips',
        'The angle where the nail meets the skin is lost',
        'Nail base feels soft or spongy when pressed',
        'No gap when the backs of two fingernails are pressed together (window test)',
      ],
      progression:
        'Usually develops slowly over months or years. It may get better if the underlying cause is treated. In some families it is present from birth and harmless.',
      why:
        'In some long-term heart, lung, liver or gut conditions, changes in blood flow and growth signals reach the fingertips. This makes the soft tissue under the nail grow, pushing the nail up and rounding the tip. Sometimes it runs in families with no illness at all.',
      tests: [
        { name: 'Examination of heart and lungs', why: 'A doctor will look for signs of a heart or lung cause.' },
        { name: 'Chest X-ray', why: 'To look for lung conditions linked with clubbing.' },
        { name: 'Blood tests and oxygen level', why: 'To look for low oxygen or liver, gut or other causes.' },
      ],
      doctor: {
        type: 'GP',
        when: 'Within a couple of weeks. Sooner if you have a cough that won’t go away, coughing blood, breathlessness, weight loss or chest pain.',
      },
      dos: [
        'Book a doctor visit — the cause matters more than the nails',
        'Note any cough, breathlessness, weight loss or tummy problems to tell the doctor',
        'Mention if family members have always had the same fingertips',
        'If you smoke, getting help to stop is good for your heart and lungs',
      ],
      donts: [
        'Don’t ignore it, even if it does not hurt',
        'Don’t assume it is a nail problem — it usually is not',
        'Don’t wait if you also have breathing problems or weight loss',
      ],
      sources: [
        { label: 'NHS: Clubbed fingers', url: 'https://www.nhs.uk/conditions/clubbing/' },
      ],
    },
  },
  {
    id: 'longitudinal_melanonychia',
    name: 'Dark streak in a nail',
    aka: ['Longitudinal melanonychia', 'Brown or black nail band'],
    category: 'nails',
    prevalence: 'common',
    evidence: {
      nail_dark_streak: 3,
      no_symptoms: 1,
      mole_changing: 1,
      nail_thick_yellow: -1,
      nail_pitting: -1,
      nail_fold_swollen: -1,
    },
    sites: { fingernails: 3, toenails: 2 },
    alsoCheck: [
      { area: 'fingernails', reason: 'Bands on several nails are usually harmless in brown skin; a single band on one nail needs a closer look.' },
      { area: 'toenails', reason: 'Check if toenails have similar bands — many nails with bands points to a harmless cause.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'A brown or black line running from the base to the tip of a nail. In people with brown or dark skin it is very common and usually harmless, but a new, widening or single dark band can rarely be nail melanoma and needs checking.',
      looksLike: [
        'A brown or black stripe running the length of the nail',
        'Can be on one nail or many',
        'Harmless bands are usually thin, even in colour and stay the same',
        'Warning signs: a new band in an adult, one band that is getting wider or darker, uneven colours or blurred edges',
        'Warning sign: dark colour spreading onto the skin around the nail, or the nail splitting or bleeding',
      ],
      progression:
        'Harmless bands stay the same for years. A band that widens, darkens, changes colour or spreads onto the skin over weeks to months must be checked by a doctor.',
      why:
        'Pigment cells at the base of the nail (the nail matrix) put colour into the nail as it grows, making a stripe. This can happen because there are naturally more active pigment cells (common in darker skin), from injury, some medicines, a mole in the nail matrix, or rarely a melanoma.',
      tests: [
        { name: 'Dermoscopy of the nail', why: 'Shows the pattern and colours of the band to decide if it looks harmless or needs more tests.' },
        { name: 'Nail matrix biopsy', why: 'If the band looks worrying, a small sample from the nail base is the only way to rule out melanoma.' },
      ],
      doctor: {
        type: 'Dermatologist',
        when: 'Within a few weeks for a new single band, one that is widening or darkening, or colour spreading onto the skin. Routine check for long-standing bands on many nails.',
      },
      dos: [
        'Take a dated, close-up photo of the nail every month to track changes',
        'Measure the width of the band with a ruler',
        'Note if it followed an injury, like a stubbed toe or trapped finger',
        'Tell the doctor about any new medicines',
      ],
      donts: [
        'Don’t ignore a band that is new, single, widening or spreading onto the skin',
        'Don’t cover it with nail polish before a doctor sees it',
        'Don’t pick at or file the nail to remove the colour',
      ],
      skinToneNote:
        'Bands on several nails are very common and usually harmless in people with brown and dark skin, so many people have them from adulthood. Nail melanoma is rare but is relatively more often found on the nails, palms and soles in darker skin, so a single changing band should still be checked.',
      sources: [
        { label: 'DermNet: Longitudinal melanonychia', url: 'https://dermnetnz.org/topics/longitudinal-melanonychia' },
        { label: 'NHS: Melanoma skin cancer', url: 'https://www.nhs.uk/conditions/melanoma-skin-cancer/' },
      ],
    },
  },
  {
    id: 'brittle_nails',
    name: 'Nail ridges and brittle nails',
    aka: ['Onychoschizia', 'Splitting nails', 'Vertical nail ridges'],
    category: 'nails',
    prevalence: 'very_common',
    evidence: {
      nail_ridges: 3,
      wet_work: 2,
      worse_in_winter: 1,
      no_symptoms: 1,
      duration_over_6w: 1,
      nail_pitting: -1,
      nail_thick_yellow: -1,
      nail_fold_swollen: -1,
      nail_dark_streak: -2,
      nail_clubbing: -2,
    },
    sites: { fingernails: 3, toenails: 1 },
    alsoCheck: [
      { area: 'hands', reason: 'Dry or cracked hands from washing and wet work often go with brittle nails.' },
      { area: 'fingernails', reason: 'Spoon-shaped or pitted nails would point to iron deficiency or psoriasis instead.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Ridges running along the nail and nails that split, peel or break easily are very common. They are usually caused by age, dryness or frequent wet work, not serious illness.',
      looksLike: [
        'Fine lines running from the base to the tip of the nail',
        'Nail tips that split into layers or peel',
        'Nails that break or chip easily',
        'Usually affects several nails, mostly fingers',
      ],
      progression:
        'Long-lasting but harmless. Vertical ridges become more common with age. Splitting often improves within months of protecting nails from water and chemicals.',
      why:
        'Nails are made of layers of keratin held together by moisture and natural oils. Repeated wetting and drying, detergents and nail polish remover make the layers swell, shrink and come apart. With age, nail growth becomes less even, causing ridges.',
      tests: [
        { name: 'Usually none', why: 'Most brittle nails need no tests.' },
        { name: 'Blood tests: iron, thyroid', why: 'Sometimes checked if there are other symptoms like tiredness, hair loss or spoon-shaped nails.' },
      ],
      doctor: {
        type: 'GP',
        when: 'Only if nails change suddenly, a deep ridge goes across the nail, the nails are spoon-shaped, or you have other symptoms like tiredness.',
      },
      dos: [
        'Wear rubber gloves (with cotton liners) for washing up and cleaning',
        'Moisturise hands and nails after washing',
        'Keep nails short and file in one direction',
        'Give nails breaks from polish and false nails',
      ],
      donts: [
        'Don’t pick at, peel or bite nails',
        'Don’t cut or push back the cuticles',
        'Don’t use nails as tools to open or scrape things',
        'Don’t soak hands in water for long periods',
      ],
      sources: [
        { label: 'DermNet: Brittle nails', url: 'https://dermnetnz.org/topics/brittle-nails' },
      ],
    },
  },
];
