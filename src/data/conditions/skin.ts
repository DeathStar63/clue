// Skin conditions for Clue. Educational content only: no medicines, creams or doses.
// Evidence weights: +3 hallmark, +1 mild support, negative = argues against.
import type { Condition } from '../../types';

const DERM = 'Dermatologist (skin doctor)';
const GP = 'General physician (GP)';

export const SKIN_CONDITIONS: Condition[] = [
  // ───────────────────────── Acne ─────────────────────────
  {
    id: 'acne_vulgaris',
    name: 'Acne (pimples)',
    aka: ['Acne vulgaris', 'Pimples', 'Zits'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      blackheads_whiteheads: 3,
      pustules: 2,
      small_bumps: 1,
      deep_painful_lumps: 1,
      oily_skin: 2,
      teen_young_adult: 2,
      hormonal_flare: 1,
      duration_over_6w: 1,
      comes_and_goes: 1,
      scaly_flaky: -1,
      ring_shaped_clear_centre: -2,
      hives_fade_24h: -2,
      facial_flushing: -1,
    },
    sites: { face: 3, back: 2, chest: 2, neck: 1, upper_arms: 1 },
    alsoCheck: [
      { area: 'back', reason: 'Acne often shows up on the upper back too, which is easy to miss.' },
      { area: 'chest', reason: 'Spots on the chest help confirm acne and show how widespread it is.' },
      { area: 'neck', reason: 'Along the jaw and neck, acne can be linked to hormones.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Acne is a very common skin problem where the tiny pores that hold hair and oil get blocked. This causes blackheads, whiteheads and pimples.',
      looksLike: [
        'Blackheads (open dark dots) and whiteheads (small closed bumps)',
        'Red bumps and pus-filled spots',
        'Sometimes deep, sore lumps under the skin',
        'Mostly on the face, upper back and chest',
        'Dark marks or small pits left after spots heal',
      ],
      progression:
        'It usually starts in the early teens and often settles by the mid-twenties, though some adults keep getting it. Spots come and go in waves. Deep lumps are more likely to leave scars, so these are worth getting seen early.',
      why:
        'Hormones make the skin produce more oil. Oil and dead skin cells plug the pore, forming a blackhead or whitehead. Germs that normally live on skin grow in the blocked pore, and the body reacts with redness and pus.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'A doctor can recognise acne by looking at it.',
        },
        {
          name: 'Hormone blood tests (sometimes)',
          why: 'In women with irregular periods or extra facial hair, to check for a hormone condition such as PCOS.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If spots are deep and painful, leave scars or dark marks, or affect your confidence. Early treatment helps prevent scars.',
      },
      dos: [
        'Wash your face gently twice a day with plain water and a mild cleanser',
        'Use oil-free products labelled "non-comedogenic" (won’t block pores)',
        'Use sunscreen every day to stop dark marks getting darker',
        'Keep hair and hair oil off the face',
      ],
      donts: [
        'Don’t squeeze or pop pimples: it spreads the swelling and causes scars and dark marks',
        'Don’t scrub hard or use harsh face washes',
        'Don’t put toothpaste, lemon or other home remedies on spots',
        'Don’t use steroid or "fairness" creams on your face: they can cause acne',
      ],
      skinToneNote:
        'On brown and dark skin, spots often leave dark brown marks (post-inflammatory hyperpigmentation) that can last months after the spot itself has gone. These marks are often the main worry, so protecting from sun and not picking matters a lot.',
      sources: [
        { label: 'NHS: Acne', url: 'https://www.nhs.uk/conditions/acne/' },
        { label: 'DermNet: Acne vulgaris', url: 'https://dermnetnz.org/topics/acne-vulgaris' },
      ],
    },
  },

  // ───────────────────────── Rosacea ─────────────────────────
  {
    id: 'rosacea',
    name: 'Rosacea',
    aka: ['Facial redness', 'Acne rosacea'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      facial_flushing: 3,
      visible_vessels: 2,
      red_inflamed: 2,
      pustules: 1,
      small_bumps: 1,
      worse_in_sun: 1,
      worse_sweat_heat: 1,
      comes_and_goes: 1,
      duration_over_6w: 1,
      blackheads_whiteheads: -2,
      teen_young_adult: -1,
      ring_shaped_clear_centre: -2,
    },
    sites: { face: 3, neck: 1, chest: 1 },
    alsoCheck: [
      { area: 'face', reason: 'A close photo of the cheeks and nose helps show flushing and tiny blood vessels.' },
      { area: 'eyebrows_beard', reason: 'Flaking in the eyebrows points more towards seborrhoeic dermatitis, which can look similar.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Rosacea is a long-lasting condition that causes redness and flushing in the middle of the face. Some people also get small bumps and pus spots.',
      looksLike: [
        'Redness or flushing on the cheeks, nose, chin and forehead',
        'Tiny visible blood vessels on the cheeks or nose',
        'Small red bumps and pus spots, but no blackheads',
        'Skin that stings or burns easily',
        'Sometimes sore, gritty or red eyes',
      ],
      progression:
        'It usually starts after age 30 and comes and goes in flares. Triggers like heat, sun, spicy food, alcohol and stress can set it off. Without care it can slowly become more constant.',
      why:
        'The small blood vessels in the face widen too easily, causing flushing. The skin’s defences are also over-reactive, which leads to swelling and bumps. Tiny mites that normally live on skin may play a part.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'A doctor can usually tell by looking at the pattern on the face.',
        },
        {
          name: 'Skin scraping (sometimes)',
          why: 'To rule out a fungal infection or a reaction to steroid cream, which can look alike.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If redness is constant, bumps keep coming back, or your eyes feel sore or gritty.',
      },
      dos: [
        'Use sunscreen every day and wear a hat in strong sun',
        'Keep a note of what triggers your flushing so you can avoid it',
        'Use gentle, fragrance-free skin products',
        'Wash the face with lukewarm, not hot, water',
      ],
      donts: [
        'Don’t use steroid creams on the face without a doctor: they make rosacea worse',
        'Don’t scrub or use harsh exfoliators',
        'Don’t use products with alcohol, menthol or strong fragrance',
      ],
      skinToneNote:
        'Rosacea is often missed on brown skin because redness is harder to see. It may look darker, dusky or brownish, and the main clue can be burning, stinging and bumps rather than obvious redness.',
      sources: [
        { label: 'NHS: Rosacea', url: 'https://www.nhs.uk/conditions/rosacea/' },
        { label: 'DermNet: Rosacea', url: 'https://dermnetnz.org/topics/rosacea' },
      ],
    },
  },

  // ───────────────────────── Seborrhoeic dermatitis ─────────────────────────
  {
    id: 'seborrhoeic_dermatitis',
    name: 'Seborrhoeic dermatitis',
    aka: ['Seborrheic dermatitis', 'Seb derm', 'Dandruff (when on scalp)'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      greasy_yellow_scale: 3,
      scaly_flaky: 2,
      red_inflamed: 1,
      itchy: 1,
      dandruff_flakes: 2,
      oily_skin: 1,
      worse_stress: 1,
      worse_in_winter: 1,
      comes_and_goes: 1,
      duration_over_6w: 1,
      thick_silvery_scale: -1,
      ring_shaped_clear_centre: -2,
      blisters: -2,
    },
    sites: { scalp: 3, eyebrows_beard: 3, face: 3, ears: 2, chest: 2, back: 1, armpits: 1, groin: 1 },
    alsoCheck: [
      { area: 'scalp', reason: 'Dandruff or greasy flakes in the scalp strongly support this.' },
      { area: 'eyebrows_beard', reason: 'Flaking in the eyebrows or beard is a classic sign.' },
      { area: 'ears', reason: 'Flaky skin in and behind the ears is common with this condition.' },
      { area: 'chest', reason: 'The middle of the chest is another typical place.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Seborrhoeic dermatitis is a common, long-lasting rash in oily areas of skin. It causes greasy, yellowish flakes on mildly red skin. On the scalp it is called dandruff.',
      looksLike: [
        'Greasy, yellowish or white flakes',
        'Mild redness underneath',
        'Sides of the nose, eyebrows, beard, scalp and behind the ears',
        'Sometimes the middle of the chest',
        'Mild itch',
      ],
      progression:
        'It comes and goes over many years and often flares with stress, cold weather or illness. It can be controlled well but tends to return. Babies can get a version called cradle cap, which usually clears by itself.',
      why:
        'A yeast called Malassezia normally lives on oily skin. In some people the skin over-reacts to it, causing redness and faster skin turnover, which makes flakes. It is not caused by poor hygiene and is not contagious.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'It is usually recognised from the look and the places it appears.',
        },
        {
          name: 'Skin scraping (KOH test)',
          why: 'Sometimes done to rule out a fungal infection like ringworm.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If it is widespread, very red, not settling with gentle care, or appears suddenly and severely in an adult.',
      },
      dos: [
        'Wash the affected skin and scalp regularly',
        'Gently remove loose flakes after washing',
        'Use a gentle, fragrance-free moisturiser on dry patches',
        'Try to manage stress and sleep well',
      ],
      donts: [
        'Don’t use steroid or mixed creams on the face without a doctor',
        'Don’t scratch or pick at flakes',
        'Don’t apply heavy oils to the face or scalp: they can feed the yeast',
      ],
      skinToneNote:
        'On brown or dark skin the patches may look pink, brown or even lighter than the surrounding skin, rather than red. Light patches usually return to normal colour once the rash settles.',
      sources: [
        { label: 'NHS: Seborrhoeic dermatitis', url: 'https://www.nhs.uk/conditions/seborrhoeic-dermatitis/' },
        { label: 'DermNet: Seborrhoeic dermatitis', url: 'https://dermnetnz.org/topics/seborrhoeic-dermatitis' },
      ],
    },
  },

  // ───────────────────────── Atopic eczema ─────────────────────────
  {
    id: 'atopic_eczema',
    name: 'Eczema (atopic dermatitis)',
    aka: ['Atopic eczema', 'Atopic dermatitis'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      itchy: 3,
      dry_rough_skin: 2,
      asthma_hayfever: 2,
      started_childhood: 2,
      thickened_leathery: 1,
      red_inflamed: 1,
      oozing_weeping: 1,
      worse_in_winter: 1,
      family_history_same: 1,
      comes_and_goes: 1,
      itch_worse_night: 1,
      no_symptoms: -3,
      well_defined_edges: -1,
      ring_shaped_clear_centre: -2,
      family_also_itchy: -1,
    },
    sites: { elbows: 3, knees: 3, neck: 2, hands: 2, face: 2, forearms_wrists: 2, feet: 1, eyebrows_beard: 1 },
    alsoCheck: [
      { area: 'elbows', reason: 'The inside of the elbows is a classic place for eczema.' },
      { area: 'knees', reason: 'The backs of the knees are another classic place.' },
      { area: 'neck', reason: 'Eczema often affects the neck and can leave darker, thickened skin there.' },
      { area: 'hands', reason: 'Hands are commonly affected, especially in adults.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Eczema is a long-lasting condition where the skin is dry, itchy and easily irritated. It often starts in childhood and runs in families with asthma or hay fever.',
      looksLike: [
        'Dry, rough, very itchy skin',
        'Patches in the skin folds, like inside elbows and behind knees',
        'Thickened, leathery skin where it has been scratched a lot',
        'Sometimes weeping or crusting during a bad flare',
        'In babies, often the cheeks and outer arms and legs',
      ],
      progression:
        'It comes and goes in flares. Many children improve as they grow up, but some keep it as adults or it returns later. Scratching makes the skin thicker and itchier, which starts a cycle.',
      why:
        'The outer layer of the skin is weaker than normal, so water escapes and irritants get in more easily. The immune system then over-reacts and causes itch and redness. Genes play a big part, which is why it often runs in families.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'Eczema is diagnosed from how it looks and your history.',
        },
        {
          name: 'Patch test (sometimes)',
          why: 'If a contact allergy might be making it worse.',
        },
        {
          name: 'Swab (sometimes)',
          why: 'If the skin is weeping or crusted, to check for infection.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If itch affects sleep, the skin weeps or crusts, or it is not settling with moisturiser. See a doctor the same day if painful blisters appear in eczema with a fever.',
      },
      dos: [
        'Use a thick, fragrance-free moisturiser several times a day, especially after bathing',
        'Use lukewarm water and a soap-free wash',
        'Wear loose, soft cotton clothes',
        'Keep nails short to reduce damage from scratching',
      ],
      donts: [
        'Don’t use scented soaps, bubble bath or harsh detergents',
        'Don’t take very hot or long baths',
        'Don’t wear wool or rough fabric next to the skin',
        'Don’t use steroid or mixed creams without a doctor’s advice',
      ],
      skinToneNote:
        'On brown and dark skin, eczema may look dark brown, purple or grey rather than red, and can show as small bumps around hair follicles. It often leaves darker or lighter patches after it settles, which fade slowly.',
      sources: [
        { label: 'NHS: Atopic eczema', url: 'https://www.nhs.uk/conditions/atopic-eczema/' },
        { label: 'DermNet: Atopic dermatitis', url: 'https://dermnetnz.org/topics/atopic-dermatitis' },
      ],
    },
  },

  // ───────────────────────── Contact dermatitis ─────────────────────────
  {
    id: 'contact_dermatitis',
    name: 'Contact dermatitis (incl. hand eczema)',
    aka: ['Allergic contact dermatitis', 'Irritant contact dermatitis', 'Hand eczema', 'Skin reaction to a product'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      new_product_contact: 3,
      wet_work: 2,
      itchy: 2,
      red_inflamed: 2,
      well_defined_edges: 1,
      blisters: 1,
      oozing_weeping: 1,
      dry_rough_skin: 1,
      thickened_leathery: 1,
      asthma_hayfever: 1,
      ring_shaped_clear_centre: -2,
      family_also_itchy: -2,
      hives_fade_24h: -1,
    },
    sites: { hands: 3, face: 2, neck: 2, forearms_wrists: 2, ears: 2, finger_webs: 1, abdomen: 1, feet: 1 },
    alsoCheck: [
      { area: 'hands', reason: 'Hands are the most common place, from soaps, water and chemicals.' },
      { area: 'ears', reason: 'Earlobe rashes point to a metal (nickel) allergy from earrings.' },
      { area: 'abdomen', reason: 'A patch near the belly button can be from a metal jeans button or belt buckle.' },
      { area: 'neck', reason: 'Neck rashes can come from perfume, necklaces or hair dye.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Contact dermatitis is a rash caused by something touching the skin. It can be irritation from things like soap and water, or an allergy to things like metal, hair dye or fragrance.',
      looksLike: [
        'Red, itchy or burning skin where the product touched',
        'Often a clear shape, like a watch strap, earring or glove line',
        'Dry, cracked skin on the hands with frequent washing',
        'Small blisters or weeping in strong allergic reactions',
        'Thickened skin if it has been going on a long time',
      ],
      progression:
        'Irritation builds up slowly with repeated exposure, often over weeks. An allergic reaction usually appears 1–3 days after contact. It settles once the trigger is avoided, but returns if you touch it again.',
      why:
        'Irritants like detergents and water damage the outer layer of skin directly. In allergy, the immune system "learns" to react to a substance, such as nickel or hair dye (PPD), and then causes a rash each time it touches the skin.',
      tests: [
        {
          name: 'Patch test',
          why: 'Small amounts of common allergens are taped to the back for 2 days to find out exactly what you are allergic to.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If it keeps coming back, affects your work, or you can’t work out the cause. Get help the same day if the face or eyes swell badly after hair dye.',
      },
      dos: [
        'Try to find and avoid the trigger (new soap, jewellery, dye, cosmetics)',
        'Wear cotton-lined gloves for wet work and cleaning',
        'Use a fragrance-free moisturiser often, especially after washing hands',
        'Dry hands gently and fully after washing',
      ],
      donts: [
        'Don’t keep using a product that you think caused the rash',
        'Don’t wash hands in very hot water or with harsh soap',
        'Don’t scratch',
        'Don’t use steroid or mixed creams without a doctor',
      ],
      skinToneNote:
        'On brown and dark skin the rash may look dark brown, purple or grey rather than red. It often leaves dark marks after healing. Black henna (with PPD dye) is a common cause of severe reactions.',
      sources: [
        { label: 'NHS: Contact dermatitis', url: 'https://www.nhs.uk/conditions/contact-dermatitis/' },
        { label: 'DermNet: Contact dermatitis', url: 'https://dermnetnz.org/topics/contact-dermatitis' },
        { label: 'DermNet: Hand dermatitis', url: 'https://dermnetnz.org/topics/hand-dermatitis' },
      ],
    },
  },

  // ───────────────────────── Psoriasis ─────────────────────────
  {
    id: 'plaque_psoriasis',
    name: 'Psoriasis (plaque)',
    aka: ['Plaque psoriasis', 'Psoriasis vulgaris'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      thick_silvery_scale: 3,
      raised_plaques: 2,
      well_defined_edges: 2,
      nail_pitting: 2,
      family_history_same: 1,
      joint_pain: 1,
      worse_stress: 1,
      worse_in_winter: 1,
      better_in_sun: 1,
      duration_over_6w: 1,
      greasy_yellow_scale: -1,
      ring_shaped_clear_centre: -1,
      duration_under_2w: -1,
      blisters: -2,
    },
    sites: { elbows: 3, knees: 3, scalp: 3, buttocks: 2, back: 2, shins: 2, hands: 1, feet: 1, ears: 1, fingernails: 1 },
    alsoCheck: [
      { area: 'scalp', reason: 'Psoriasis often hides in the scalp and along the hairline.' },
      { area: 'elbows', reason: 'Thick scaly patches on the outer elbows are a classic sign.' },
      { area: 'knees', reason: 'The front of the knees is another classic place.' },
      { area: 'fingernails', reason: 'Tiny pits or lifting of the nails strongly support psoriasis.' },
      { area: 'buttocks', reason: 'A red patch in the cleft between the buttocks is a common hidden sign.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Psoriasis is a long-lasting condition where the skin grows too fast, making thick, raised patches with silvery scale. It is not contagious.',
      looksLike: [
        'Raised, thick patches with sharp edges',
        'Silvery-white scale on top',
        'Elbows, knees, scalp, lower back and buttocks',
        'Tiny pits or lifting in the fingernails',
        'Can be itchy or sore, or cause no symptoms',
      ],
      progression:
        'It usually comes and goes over a lifetime, with flares and calmer times. Stress, infections (like a sore throat), some medicines and cold weather can trigger flares. Some people also develop joint pain (psoriatic arthritis).',
      why:
        'The immune system becomes over-active and sends signals that make skin cells grow about ten times faster than normal. The cells pile up on the surface as thick scale. Genes play a part, so it often runs in families.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'A doctor can usually tell from the look of the patches and nails.',
        },
        {
          name: 'Skin biopsy (sometimes)',
          why: 'A tiny skin sample, if the diagnosis is unclear.',
        },
        {
          name: 'Skin scraping (KOH test)',
          why: 'Sometimes done to rule out a fungal infection that can look similar.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If you think you have psoriasis, it is widespread, or you have joint pain or swelling. Good treatment options exist.',
      },
      dos: [
        'Moisturise the patches often with a thick, fragrance-free moisturiser',
        'Gently soften scale after a bath instead of picking it',
        'Look after general health: stay active, avoid smoking and limit alcohol',
        'Tell the doctor about any joint pain or stiffness',
      ],
      donts: [
        'Don’t pick or peel off the scale',
        'Don’t use steroid or mixed creams without a doctor: stopping them suddenly can cause a bad flare',
        'Don’t injure the skin (tight clothes, scratching): new patches can form at injury sites',
      ],
      skinToneNote:
        'On brown and dark skin, psoriasis patches often look purple, dark brown or grey rather than pink-red, and the scale may look thicker. After healing it often leaves dark or light marks that fade slowly.',
      sources: [
        { label: 'NHS: Psoriasis', url: 'https://www.nhs.uk/conditions/psoriasis/' },
        { label: 'DermNet: Psoriasis', url: 'https://dermnetnz.org/topics/psoriasis' },
      ],
    },
  },
  // ───────────────────────── Tinea corporis / cruris ─────────────────────────
  {
    id: 'tinea_corporis_cruris',
    name: 'Ringworm (tinea)',
    aka: ['Tinea corporis', 'Tinea cruris', 'Jock itch', 'Daad', 'Fungal infection', 'Tinea incognito'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      ring_shaped_clear_centre: 3,
      itchy: 2,
      scaly_flaky: 1,
      well_defined_edges: 2,
      red_inflamed: 1,
      worse_sweat_heat: 2,
      used_steroid_cream: 2,
      family_also_itchy: 1,
      shared_towels_sport: 1,
      pets_animals: 1,
      diabetes: 1,
      no_symptoms: -2,
      thick_silvery_scale: -1,
      hives_fade_24h: -2,
    },
    sites: { groin: 3, buttocks: 2, abdomen: 2, thighs: 2, back: 2, chest: 1, neck: 1, armpits: 1, upper_arms: 1, face: 1 },
    alsoCheck: [
      { area: 'groin', reason: 'Ringworm very often affects the groin and inner thighs, even if you came in about another spot.' },
      { area: 'feet', reason: 'The same fungus often lives on the feet and spreads from there.' },
      { area: 'toe_webs', reason: 'Peeling or white soggy skin between the toes can be the hidden source.' },
      { area: 'toenails', reason: 'Thick, yellow toenails can carry the fungus and cause repeat infections.' },
      { area: 'scalp', reason: 'In children, ringworm of the scalp can cause scaly patches with broken hairs.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Ringworm is a skin infection caused by a fungus, not a worm. It makes itchy, ring-shaped patches, very often in the groin, waist and buttocks. It is extremely common in India’s hot, humid weather.',
      looksLike: [
        'Itchy, round or ring-shaped patches',
        'Raised, scaly, active edge with a clearer centre',
        'Groin, inner thighs, waist (under the belt or nada), buttocks and under the breasts',
        'Patches slowly grow outwards and can join together',
        'After steroid creams: wide patches with a weak edge that keep coming back ("tinea incognito")',
      ],
      progression:
        'Without proper treatment it slowly spreads and can pass to others at home. In India, many people use steroid or "mixed" creams from the pharmacy. These hide it for a while, but the fungus grows deeper and spreads, making it much harder to treat.',
      why:
        'Fungi called dermatophytes feed on keratin, the tough protein in the outer skin. They grow outwards in a circle, and the immune reaction at the edge causes the red, scaly ring. Heat, sweat, tight clothes and shared towels help it spread.',
      tests: [
        {
          name: 'Skin scraping (KOH test)',
          why: 'Scale from the edge is looked at under a microscope to see the fungus. Quick and painless.',
        },
        {
          name: 'Fungal culture (sometimes)',
          why: 'To find the exact fungus if it keeps coming back.',
        },
        {
          name: 'Blood sugar',
          why: 'If infections keep returning or are very widespread, to check for diabetes.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If it is widespread, keeps coming back, or you have already used steroid or mixed creams. Treatment often needs to continue for a while after the skin looks clear.',
      },
      dos: [
        'Keep the skin clean and fully dry, especially folds and groin',
        'Wear loose cotton clothes and cotton underwear; change them daily',
        'Wash clothes, towels and bedding in hot water and dry them in the sun',
        'Check and treat family members who are also itchy',
        'Change out of sweaty clothes quickly after work or exercise',
      ],
      donts: [
        'Don’t use steroid or "mixed" creams (often sold for itch or "ringworm") without a doctor: they make the fungus spread',
        'Don’t share towels, clothes, combs or beds while infected',
        'Don’t wear tight jeans, synthetic underwear or damp clothes',
        'Don’t stop treatment early just because the itch has stopped',
      ],
      skinToneNote:
        'On brown and dark skin the ring may look dark brown, grey or purplish rather than red. It often leaves a dark mark after the infection is cleared, which fades over months.',
      sources: [
        { label: 'NHS: Ringworm', url: 'https://www.nhs.uk/conditions/ringworm/' },
        { label: 'DermNet: Tinea corporis', url: 'https://dermnetnz.org/topics/tinea-corporis' },
        { label: 'DermNet: Tinea incognito', url: 'https://dermnetnz.org/topics/tinea-incognito' },
      ],
    },
  },

  // ───────────────────────── Tinea pedis ─────────────────────────
  {
    id: 'tinea_pedis',
    name: 'Athlete’s foot (tinea pedis)',
    aka: ['Tinea pedis', 'Foot fungus'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      itchy: 2,
      scaly_flaky: 2,
      worse_sweat_heat: 2,
      shared_towels_sport: 2,
      nail_thick_yellow: 1,
      dry_rough_skin: 1,
      blisters: 1,
      diabetes: 1,
      thick_silvery_scale: -1,
      started_childhood: -1,
      hives_fade_24h: -2,
    },
    sites: { toe_webs: 3, feet: 3, toenails: 1, hands: 1 },
    alsoCheck: [
      { area: 'toenails', reason: 'Thick, yellow, crumbly toenails often mean the fungus has spread to the nails.' },
      { area: 'groin', reason: 'The fungus often spreads from the feet to the groin.' },
      { area: 'hands', reason: 'Sometimes one hand gets infected too, often the hand used to scratch the feet.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Athlete’s foot is a common fungal infection of the feet, especially between the toes. It spreads easily in warm, damp places.',
      looksLike: [
        'Itchy, peeling, cracked skin between the toes',
        'White, soggy skin between the smallest toes',
        'Dry, scaly skin on the soles and sides of the feet',
        'Sometimes small itchy blisters on the instep',
      ],
      progression:
        'It often lasts a long time and comes back if feet stay damp. Cracks can let germs in, causing a bacterial skin infection (cellulitis), especially in people with diabetes.',
      why:
        'The same family of fungi that causes ringworm grows on the feet. Closed shoes and sweaty socks keep the skin warm and wet, which the fungus loves. It is picked up from damp floors, shared towels and footwear.',
      tests: [
        {
          name: 'Skin scraping (KOH test)',
          why: 'To confirm fungus under a microscope if the diagnosis is unclear.',
        },
        {
          name: 'Blood sugar',
          why: 'If foot infections keep returning, to check for diabetes.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If it isn’t improving, spreads to nails, or you have diabetes. See someone the same day if the foot becomes red, hot, swollen and painful.',
      },
      dos: [
        'Wash feet daily and dry carefully between the toes',
        'Wear cotton socks and change them every day',
        'Let shoes air out; alternate pairs if you can',
        'Wear open footwear when possible',
      ],
      donts: [
        'Don’t walk barefoot in shared bathrooms or gyms',
        'Don’t share towels, socks or shoes',
        'Don’t use steroid or mixed creams on the feet without a doctor',
      ],
      skinToneNote:
        'On brown and dark skin the redness is often hard to see. Look for peeling, white soggy skin and cracks between the toes.',
      sources: [
        { label: 'NHS: Athlete’s foot', url: 'https://www.nhs.uk/conditions/athletes-foot/' },
        { label: 'DermNet: Tinea pedis', url: 'https://dermnetnz.org/topics/tinea-pedis' },
      ],
    },
  },

  // ───────────────────────── Pityriasis versicolor ─────────────────────────
  {
    id: 'pityriasis_versicolor',
    name: 'Pityriasis versicolor',
    aka: ['Tinea versicolor', 'Sun fungus', 'White patches on the chest/back'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      fine_scale_patches_trunk: 3,
      lighter_patches: 2,
      dark_patches: 1,
      worse_sweat_heat: 2,
      oily_skin: 1,
      teen_young_adult: 1,
      no_symptoms: 1,
      comes_and_goes: 1,
      complete_colour_loss: -2,
      ring_shaped_clear_centre: -1,
      thick_silvery_scale: -2,
      raised_plaques: -2,
    },
    sites: { chest: 3, back: 3, upper_arms: 2, neck: 2, abdomen: 1, face: 1 },
    alsoCheck: [
      { area: 'back', reason: 'The upper back is the most common place and hard to see yourself.' },
      { area: 'chest', reason: 'The chest is another classic place for these patches.' },
      { area: 'upper_arms', reason: 'Patches often spread to the shoulders and upper arms.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Pityriasis versicolor is a harmless, common yeast overgrowth on the skin. It causes small patches that are lighter or darker than your normal skin, mostly on the chest and back.',
      looksLike: [
        'Many small, round patches that can join together',
        'Patches lighter, darker or pinkish compared to normal skin',
        'Fine, powdery scale when the skin is gently scratched or stretched',
        'Upper back, chest, shoulders and neck',
        'Usually no itch, or only mild itch with sweating',
      ],
      progression:
        'It often appears or worsens in hot, humid months and tends to come back. After treatment, the colour can take several months to return to normal, so patches may stay visible for a while.',
      why:
        'A yeast called Malassezia normally lives on everyone’s skin. Heat, sweat and oily skin make it overgrow. It produces substances that change how the skin makes pigment, causing lighter or darker patches. It is not caused by poor hygiene.',
      tests: [
        {
          name: 'Skin scraping (KOH test)',
          why: 'Shows the yeast under a microscope ("spaghetti and meatballs" look).',
        },
        {
          name: 'Wood’s lamp',
          why: 'A special UV light can make patches glow yellow-green.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If you are not sure what the patches are, they are widespread, or keep coming back.',
      },
      dos: [
        'Wear loose cotton clothes and change out of sweaty clothes quickly',
        'Shower after exercise or sweating',
        'Be patient: skin colour takes months to even out after treatment',
      ],
      donts: [
        'Don’t apply oils to the body: they can feed the yeast',
        'Don’t use steroid or mixed creams without a doctor',
        'Don’t worry it is vitiligo: these patches have fine scale and are not milk-white',
      ],
      skinToneNote:
        'It is very noticeable on brown skin, usually as lighter patches, because the tanned skin around them gets darker in the sun. Some people get darker brown patches instead.',
      sources: [
        { label: 'NHS: Pityriasis versicolor', url: 'https://www.nhs.uk/conditions/pityriasis-versicolor/' },
        { label: 'DermNet: Pityriasis versicolor', url: 'https://dermnetnz.org/topics/pityriasis-versicolor' },
      ],
    },
  },

  // ───────────────────────── Scabies ─────────────────────────
  {
    id: 'scabies',
    name: 'Scabies',
    aka: ['Khujli', 'Itch mite infestation'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      burrows: 3,
      itch_worse_night: 3,
      family_also_itchy: 3,
      itchy: 2,
      small_bumps: 2,
      pustules: 1,
      duration_2_to_6w: 1,
      no_symptoms: -3,
      ring_shaped_clear_centre: -1,
      thick_silvery_scale: -2,
      hives_fade_24h: -1,
    },
    sites: { finger_webs: 3, forearms_wrists: 3, genitals: 3, abdomen: 2, armpits: 2, buttocks: 2, elbows: 2, feet: 1, chest: 1, thighs: 1 },
    alsoCheck: [
      { area: 'finger_webs', reason: 'Tiny wavy lines (burrows) between the fingers are the classic sign.' },
      { area: 'forearms_wrists', reason: 'The inner wrists are a classic place for burrows and bumps.' },
      { area: 'abdomen', reason: 'Bumps around the waist and belly button are very common.' },
      { area: 'genitals', reason: 'Itchy bumps on the genitals strongly suggest scabies in adults.' },
      { area: 'feet', reason: 'In babies, the palms and soles are often affected.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Scabies is a very itchy rash caused by tiny mites that burrow into the skin. It spreads by close skin contact, so often several people in one home have it.',
      looksLike: [
        'Intense itch, much worse at night',
        'Small red bumps or spots, often scratched',
        'Tiny wavy grey or skin-coloured lines (burrows), especially between fingers',
        'Finger webs, wrists, waist, armpits, buttocks and genitals',
        'Usually spares the face in adults (but not in babies)',
      ],
      progression:
        'Itch usually starts 3–6 weeks after first catching it (sooner if you had it before). It does not go away on its own. Scratching can lead to infected sores. Itch can carry on for a few weeks even after the mites are gone.',
      why:
        'A tiny mite (Sarcoptes scabiei) digs into the top layer of skin and lays eggs. The body develops an allergy to the mites and their waste, which causes the strong itch. It spreads by prolonged skin-to-skin contact and sometimes through shared bedding.',
      tests: [
        {
          name: 'Dermoscopy',
          why: 'A doctor uses a handheld magnifier to see the mite at the end of a burrow.',
        },
        {
          name: 'Skin scraping',
          why: 'Looking under a microscope for mites or eggs.',
        },
      ],
      doctor: {
        type: GP,
        when: 'Within a few days. Everyone in the home and close contacts usually need treatment at the same time, even without itch.',
      },
      dos: [
        'Get everyone in the home checked and treated on the same day',
        'Wash clothes, towels and bedding in hot water and dry in the sun',
        'Seal items you can’t wash in a plastic bag for at least 3 days',
        'Keep nails short to reduce scratching damage',
      ],
      donts: [
        'Don’t share beds, clothes or towels until treated',
        'Don’t use steroid or mixed creams: they hide scabies and can make it spread',
        'Don’t treat only one person while others in the home are itchy',
      ],
      skinToneNote:
        'On brown and dark skin the bumps may look brown, purple or skin-coloured rather than red, and burrows can be hard to spot. Scratched areas often leave dark marks or small nodules that last weeks.',
      sources: [
        { label: 'NHS: Scabies', url: 'https://www.nhs.uk/conditions/scabies/' },
        { label: 'DermNet: Scabies', url: 'https://dermnetnz.org/topics/scabies' },
      ],
    },
  },

  // ───────────────────────── Impetigo ─────────────────────────
  {
    id: 'impetigo',
    name: 'Impetigo',
    aka: ['School sores', 'Bacterial skin infection'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      honey_crust: 3,
      oozing_weeping: 2,
      blisters: 1,
      onset_sudden: 1,
      duration_under_2w: 1,
      family_also_itchy: 1,
      asthma_hayfever: 1,
      itchy: 1,
      duration_over_6w: -2,
      thick_silvery_scale: -2,
      no_symptoms: -1,
    },
    sites: { face: 3, hands: 2, forearms_wrists: 1, neck: 1, shins: 1, buttocks: 1 },
    alsoCheck: [
      { area: 'face', reason: 'Crusts around the nose and mouth are the classic pattern.' },
      { area: 'hands', reason: 'It spreads easily to the hands from touching the sores.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Impetigo is a common, very catching bacterial skin infection, mostly in children. It causes sores that burst and form golden, honey-coloured crusts.',
      looksLike: [
        'Red sores that burst and ooze',
        'Golden-yellow, honey-coloured crusts',
        'Often around the nose and mouth',
        'Sometimes larger blisters that break easily',
        'Can be itchy; spreads with scratching',
      ],
      progression:
        'It starts quickly and spreads to other parts of the body and to other people by touch. It often clears with treatment within a week or two. It may start in skin already broken by eczema, insect bites or scabies.',
      why:
        'Bacteria (usually Staphylococcus or Streptococcus) that live on skin and in the nose get into a small break in the skin. They multiply and damage the top layer, making it blister, ooze and crust.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'It is easy to recognise by look.',
        },
        {
          name: 'Swab',
          why: 'If it keeps coming back or isn’t settling, to find the exact germ.',
        },
      ],
      doctor: {
        type: GP,
        when: 'Within a day or two, so it can be treated before it spreads. Sooner if there is fever, or it is spreading fast.',
      },
      dos: [
        'Gently wash crusts with soap and water',
        'Keep sores loosely covered',
        'Wash hands often, and keep the child’s nails short',
        'Use separate towels and wash them in hot water',
        'Keep children off school until a doctor says they are no longer infectious',
      ],
      donts: [
        'Don’t pick or scratch the crusts',
        'Don’t share towels, flannels or clothes',
        'Don’t use steroid creams on it: they can make infection worse',
      ],
      skinToneNote:
        'On brown and dark skin the redness around sores may be hard to see, but the golden crusts are still visible. Sores can leave darker or lighter marks for some weeks after healing.',
      sources: [
        { label: 'NHS: Impetigo', url: 'https://www.nhs.uk/conditions/impetigo/' },
        { label: 'DermNet: Impetigo', url: 'https://dermnetnz.org/topics/impetigo' },
      ],
    },
  },

  // ───────────────────────── Cellulitis ─────────────────────────
  {
    id: 'cellulitis',
    name: 'Cellulitis (deep skin infection)',
    aka: ['Skin infection', 'Erysipelas'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      warm_swollen_spreading: 3,
      painful_tender: 2,
      red_inflamed: 2,
      onset_sudden: 2,
      fever_now: 2,
      duration_under_2w: 1,
      diabetes: 1,
      spreading_fast_hours: 1,
      itchy: -1,
      scaly_flaky: -1,
      duration_over_6w: -3,
      comes_and_goes: -1,
      no_symptoms: -3,
    },
    sites: { shins: 3, feet: 2, face: 1, forearms_wrists: 1, hands: 1, thighs: 1 },
    alsoCheck: [
      { area: 'toe_webs', reason: 'Cracked skin from athlete’s foot is a common way germs get in.' },
      { area: 'feet', reason: 'Look for a cut, crack or bite that could be the starting point.' },
    ],
    baseUrgency: 'today',
    card: {
      summary:
        'Cellulitis is a bacterial infection of the deeper layers of skin. It causes red, hot, swollen and painful skin that spreads, and needs to be seen by a doctor the same day.',
      looksLike: [
        'Red, hot, swollen, painful area of skin',
        'Spreads over hours to days',
        'Usually on one lower leg, but can be anywhere',
        'Sometimes blisters on the swollen skin',
        'May come with fever, chills or feeling unwell',
      ],
      progression:
        'It gets worse over a day or two if not treated, and can spread to the blood, which is serious. With treatment it usually improves within a few days. It can return, especially if the cause (such as cracked feet or swelling) is not looked after.',
      why:
        'Bacteria, usually Streptococcus or Staphylococcus, get in through a break in the skin, such as a cut, insect bite, ulcer or cracks between the toes. They spread through the deeper layers of skin and the body reacts with swelling, heat and pain.',
      tests: [
        {
          name: 'Usually diagnosed by examination',
          why: 'A doctor checks the skin, temperature and pulse.',
        },
        {
          name: 'Blood tests',
          why: 'If you are very unwell, to check for infection spreading to the blood.',
        },
        {
          name: 'Blood sugar',
          why: 'Diabetes increases risk and makes infections harder to clear.',
        },
      ],
      doctor: {
        type: GP,
        when: 'Today. Go to emergency if you have high fever, feel very unwell or confused, the redness spreads fast, or it is around the eye.',
      },
      dos: [
        'See a doctor today',
        'Rest and keep the affected limb raised',
        'Mark the edge of the redness with a pen to see if it is spreading',
        'Drink plenty of fluids',
      ],
      donts: [
        'Don’t wait to see if it goes away on its own',
        'Don’t massage, squeeze or put hot packs on the area',
        'Don’t apply home remedies or creams to it',
      ],
      skinToneNote:
        'On brown and dark skin the redness may look dark brown, purple or grey, or may be hard to see at all. Pay attention to warmth, swelling, pain and how the skin feels compared to the other side.',
      sources: [
        { label: 'NHS: Cellulitis', url: 'https://www.nhs.uk/conditions/cellulitis/' },
        { label: 'DermNet: Cellulitis', url: 'https://dermnetnz.org/topics/cellulitis' },
      ],
    },
  },
  // ───────────────────────── Urticaria ─────────────────────────
  {
    id: 'urticaria',
    name: 'Hives (urticaria)',
    aka: ['Urticaria', 'Nettle rash', 'Welts', 'Sheetpitti'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      hives: 3,
      hives_fade_24h: 3,
      itchy: 2,
      onset_sudden: 2,
      comes_and_goes: 2,
      new_medicine: 1,
      recent_illness: 1,
      asthma_hayfever: 1,
      lips_tongue_swelling: 1,
      scaly_flaky: -3,
      thick_silvery_scale: -2,
      duration_over_6w: -1,
      honey_crust: -2,
    },
    sites: { chest: 2, back: 2, abdomen: 2, upper_arms: 2, thighs: 2, face: 2, neck: 1, forearms_wrists: 1, hands: 1, feet: 1 },
    alsoCheck: [
      { area: 'face', reason: 'Swelling of the lips, eyelids or face can come with hives and needs attention.' },
      { area: 'mouth', reason: 'Swelling of the tongue or throat is an emergency sign.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Hives are raised, itchy welts that appear quickly and move around. Each welt usually fades within a day without leaving a mark, but new ones can keep appearing.',
      looksLike: [
        'Raised, itchy welts or bumps, from tiny dots to large patches',
        'Pale centre with a red or pink rim, or skin-coloured swellings',
        'Each welt fades within 24 hours, often in a few hours',
        'New welts appear in different places',
        'Sometimes swelling of lips, eyelids, hands or feet',
      ],
      progression:
        'Most episodes settle within days to a few weeks. If hives keep coming on most days for more than 6 weeks, it is called chronic urticaria, which often has no single cause but can be well controlled.',
      why:
        'Special cells in the skin (mast cells) suddenly release a chemical called histamine. This makes small blood vessels leak fluid into the skin, causing a raised, itchy welt. Triggers include infections, foods, medicines, insect stings, heat, pressure and stress, but often no cause is found.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'Short-lived hives are diagnosed by their look and history.',
        },
        {
          name: 'Basic blood tests (for long-lasting hives)',
          why: 'If hives last over 6 weeks, to look for things like thyroid problems or infections.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If hives keep returning or last more than 6 weeks. Call emergency services straight away if lips, tongue or throat swell, or there is trouble breathing.',
      },
      dos: [
        'Note what you ate, took or did before hives appeared',
        'Wear loose, light clothes',
        'Use a cool compress or cool shower for itch',
        'Take photos of welts, since they may be gone by the time you see a doctor',
      ],
      donts: [
        'Don’t take hot baths or showers',
        'Don’t scratch or rub the welts',
        'Don’t start or stop any medicine on your own: ask a doctor first',
      ],
      skinToneNote:
        'On brown and dark skin the welts may be skin-coloured or slightly darker rather than red, so they are easier to feel than to see. Look for raised areas and the way they move around within hours.',
      sources: [
        { label: 'NHS: Hives', url: 'https://www.nhs.uk/conditions/hives/' },
        { label: 'DermNet: Urticaria', url: 'https://dermnetnz.org/topics/urticaria' },
      ],
    },
  },

  // ───────────────────────── Lichen planus ─────────────────────────
  {
    id: 'lichen_planus',
    name: 'Lichen planus',
    aka: ['LP'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      purple_flat_bumps: 3,
      lacy_white_mouth: 3,
      itchy: 2,
      dark_patches: 1,
      nail_ridges: 1,
      duration_over_6w: 1,
      small_bumps: 1,
      ring_shaped_clear_centre: -1,
      greasy_yellow_scale: -2,
      hives_fade_24h: -2,
      pustules: -2,
    },
    sites: { forearms_wrists: 3, shins: 3, mouth: 3, genitals: 2, back: 1, feet: 1, fingernails: 1, scalp: 1 },
    alsoCheck: [
      { area: 'mouth', reason: 'Lacy white lines inside the cheeks are a strong sign of lichen planus.' },
      { area: 'forearms_wrists', reason: 'The inner wrists are a classic place for the flat, shiny bumps.' },
      { area: 'shins', reason: 'Thick, itchy patches on the shins are common.' },
      { area: 'fingernails', reason: 'Ridges, thinning or splitting nails can be part of it.' },
      { area: 'genitals', reason: 'It can also affect the genitals, which is easy to miss.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Lichen planus is an itchy rash of small, shiny, flat-topped bumps that are purplish in colour. It can also affect the mouth, nails, scalp and genitals. It is not contagious.',
      looksLike: [
        'Small, shiny, flat-topped purplish bumps',
        'Fine white lines on the surface of the bumps',
        'Itchy, often very itchy',
        'Inner wrists, forearms, shins and lower back',
        'Lacy white lines inside the cheeks',
        'New bumps can appear along a scratch line',
      ],
      progression:
        'The skin rash often settles within 1–2 years, but usually leaves dark marks that take a long time to fade. Mouth and nail forms can last longer. A doctor should keep an eye on long-lasting mouth sores.',
      why:
        'The immune system mistakenly attacks the base of the skin or mouth lining. The exact trigger is often unknown, but it can be linked to some medicines, or to hepatitis C infection. It is an inflammation, not an infection, so it doesn’t spread to others.',
      tests: [
        {
          name: 'Skin biopsy',
          why: 'A tiny skin sample can confirm it if the diagnosis isn’t clear.',
        },
        {
          name: 'Blood test for hepatitis (sometimes)',
          why: 'Lichen planus is sometimes linked to hepatitis C.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If you have a rash like this, or mouth soreness or white lines that don’t settle. Tell the doctor about any new medicines.',
      },
      dos: [
        'Use a gentle, fragrance-free moisturiser and mild soap',
        'Keep good mouth hygiene if the mouth is affected',
        'Wear sunscreen to stop dark marks getting darker',
        'Tell your doctor about all medicines you take',
      ],
      donts: [
        'Don’t scratch: new bumps can form along scratch lines',
        'Don’t eat very spicy or acidic food if your mouth is sore',
        'Don’t smoke or chew tobacco or paan, especially with mouth involvement',
      ],
      skinToneNote:
        'On brown and dark skin the bumps often look dark brown, grey or almost black rather than purple. Lichen planus commonly leaves long-lasting dark patches (post-inflammatory hyperpigmentation). A variant that mainly causes flat dark patches on the face and neck is more common in Indian skin.',
      sources: [
        { label: 'NHS: Lichen planus', url: 'https://www.nhs.uk/conditions/lichen-planus/' },
        { label: 'DermNet: Lichen planus', url: 'https://dermnetnz.org/topics/lichen-planus' },
      ],
    },
  },

  // ───────────────────────── Pityriasis rosea ─────────────────────────
  {
    id: 'pityriasis_rosea',
    name: 'Pityriasis rosea',
    aka: ['Christmas tree rash'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      herald_patch: 3,
      christmas_tree_pattern: 3,
      scaly_flaky: 1,
      itchy: 1,
      teen_young_adult: 1,
      recent_illness: 1,
      duration_2_to_6w: 1,
      onset_sudden: 1,
      duration_over_6w: -1,
      thick_silvery_scale: -2,
      family_also_itchy: -1,
      comes_and_goes: -1,
    },
    sites: { chest: 3, back: 3, abdomen: 2, upper_arms: 2, thighs: 2, neck: 1 },
    alsoCheck: [
      { area: 'back', reason: 'Oval patches along the lines of the ribs on the back give a "Christmas tree" pattern.' },
      { area: 'chest', reason: 'Look for the first, bigger "herald" patch, often on the chest or tummy.' },
      { area: 'genitals', reason: 'Similar-looking rashes can come from other infections, so a doctor may ask about this area.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Pityriasis rosea is a harmless rash that usually starts with one larger patch, followed by many smaller oval patches on the body. It goes away by itself.',
      looksLike: [
        'One bigger oval patch first (the "herald patch")',
        'One to two weeks later, many smaller oval patches',
        'Patches line up along the ribs, like a Christmas tree on the back',
        'Fine scale around the inner edge of each patch',
        'Mild or no itch',
      ],
      progression:
        'The rash usually fades on its own in 6–12 weeks. It rarely comes back. Some people feel mildly unwell, like a cold, before it starts.',
      why:
        'It is thought to be the body reacting to a common virus (from the herpes virus family, types 6 and 7) waking up. It is not thought to be catching in the usual way.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'The pattern is usually recognised by look.',
        },
        {
          name: 'Blood test (sometimes)',
          why: 'To rule out conditions that can look similar, such as secondary syphilis.',
        },
        {
          name: 'Skin scraping (KOH test)',
          why: 'To rule out ringworm if the herald patch is unclear.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If you are not sure what it is, it lasts more than 3 months, or you are pregnant (it should be checked in pregnancy).',
      },
      dos: [
        'Use a gentle, fragrance-free moisturiser',
        'Wear loose, cotton clothes',
        'Use lukewarm water and mild soap',
      ],
      donts: [
        'Don’t scrub the patches',
        'Don’t use steroid or mixed creams without a doctor',
        'Don’t take very hot showers or exercise hard if it makes itch worse',
      ],
      skinToneNote:
        'On brown and dark skin the patches may look grey, dark brown or purplish rather than pink, and may have more bumps. It can leave dark or light marks for months after the rash clears.',
      sources: [
        { label: 'NHS: Pityriasis rosea', url: 'https://www.nhs.uk/conditions/pityriasis-rosea/' },
        { label: 'DermNet: Pityriasis rosea', url: 'https://dermnetnz.org/topics/pityriasis-rosea' },
      ],
    },
  },

  // ───────────────────────── Vitiligo ─────────────────────────
  {
    id: 'vitiligo',
    name: 'Vitiligo',
    aka: ['Leucoderma', 'Safed daag', 'White patches'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      complete_colour_loss: 3,
      lighter_patches: 2,
      well_defined_edges: 2,
      no_symptoms: 2,
      family_history_same: 1,
      duration_over_6w: 1,
      itchy: -1,
      scaly_flaky: -2,
      fine_scale_patches_trunk: -2,
      red_inflamed: -1,
      raised_plaques: -2,
    },
    sites: { face: 3, hands: 3, genitals: 2, feet: 2, elbows: 2, knees: 2, mouth: 1, forearms_wrists: 2, armpits: 1, scalp: 1 },
    alsoCheck: [
      { area: 'face', reason: 'White patches around the eyes and mouth are common and help confirm vitiligo.' },
      { area: 'hands', reason: 'Fingers, knuckles and wrists are classic places.' },
      { area: 'genitals', reason: 'Vitiligo often affects the genital area too.' },
      { area: 'scalp', reason: 'White hairs within a patch can show how active it is.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Vitiligo causes patches of skin to lose their colour completely and turn milk-white. It is not contagious, not caused by food, and is not related to leprosy.',
      looksLike: [
        'Milk-white or chalk-white patches with sharp edges',
        'No itch, pain or scale',
        'Around eyes and mouth, hands, fingers, feet, elbows, knees and genitals',
        'Often on both sides of the body in a matching way',
        'Hair growing in a patch can turn white',
      ],
      progression:
        'It can stay stable for years or slowly spread. Some patches regain colour, sometimes as small brown dots inside the patch. It can start at any age, often before 30.',
      why:
        'The immune system attacks the cells that make skin colour (melanocytes). Without them, skin can no longer make pigment and turns white. It often runs in families and can go with thyroid problems. Patches may appear where skin is injured.',
      tests: [
        {
          name: 'Wood’s lamp',
          why: 'A UV light makes vitiligo patches glow bright white, which helps tell it from other light patches.',
        },
        {
          name: 'Thyroid blood test',
          why: 'Thyroid problems are more common in people with vitiligo.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If you notice new white patches, or they are spreading. Treatment works best when started early.',
      },
      dos: [
        'Use sunscreen on white patches: they burn easily',
        'Wear clothes that cover patches in strong sun',
        'Protect the skin from cuts, burns and rubbing',
        'Seek support if it is affecting your mood or confidence',
      ],
      donts: [
        'Don’t believe myths: vitiligo is not caused by eating fish with milk, and it is not catching',
        'Don’t use bleaching creams, lemon or home remedies on the skin',
        'Don’t use tattoos to cover patches without a dermatologist’s advice: injury can cause new patches',
      ],
      skinToneNote:
        'Vitiligo is very visible on brown and dark skin because of the strong contrast between milk-white patches and normal skin. Other light patches (like pityriasis versicolor or post-eczema marks) are off-white and slightly scaly, not milk-white.',
      sources: [
        { label: 'NHS: Vitiligo', url: 'https://www.nhs.uk/conditions/vitiligo/' },
        { label: 'DermNet: Vitiligo', url: 'https://dermnetnz.org/topics/vitiligo' },
      ],
    },
  },

  // ───────────────────────── Melasma ─────────────────────────
  {
    id: 'melasma',
    name: 'Melasma',
    aka: ['Chloasma', 'Pregnancy mask', 'Jhaiyan'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      symmetric_face_brown: 3,
      dark_patches: 2,
      worse_in_sun: 2,
      pregnant: 1,
      hormonal_flare: 1,
      no_symptoms: 1,
      duration_over_6w: 1,
      used_steroid_cream: 1,
      family_history_same: 1,
      itchy: -2,
      scaly_flaky: -2,
      raised_plaques: -2,
      teen_young_adult: -1,
    },
    sites: { face: 3, forearms_wrists: 1, neck: 1 },
    alsoCheck: [
      { area: 'face', reason: 'A photo of both cheeks, forehead and upper lip shows the typical matching pattern.' },
      { area: 'neck', reason: 'Darkening of the neck can be another condition (e.g. linked to blood sugar), which is worth telling apart.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Melasma is a common condition where brown or grey-brown patches appear on the face, usually on both cheeks. It is harmless but can be stubborn.',
      looksLike: [
        'Brown or grey-brown flat patches',
        'Matching on both cheeks, forehead, nose, upper lip or chin',
        'No itch, scale or bumps',
        'Darker after time in the sun',
      ],
      progression:
        'It develops slowly and often gets darker in summer. It can fade after pregnancy or stopping hormone pills, but often lasts for years and comes back easily with sun exposure.',
      why:
        'The pigment cells in the skin become over-active and make too much colour. Sunlight (including visible light), hormones (pregnancy, pills) and genes are the main triggers. It is much more common in women and in brown skin.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'A doctor can usually tell by looking.',
        },
        {
          name: 'Wood’s lamp or dermoscopy',
          why: 'To see how deep the pigment is, which helps plan care.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If the patches bother you, or you are unsure what they are. A dermatologist can guide safe treatment.',
      },
      dos: [
        'Use a broad-spectrum sunscreen every day, even indoors and on cloudy days, and reapply',
        'Wear a wide-brimmed hat and avoid midday sun',
        'Use gentle, fragrance-free skin products',
        'Be patient: improvement takes months',
      ],
      donts: [
        'Don’t use "fairness" or mixed creams from the pharmacy: many contain steroids that damage the skin and worsen it',
        'Don’t rub lemon, toothpaste or other home remedies on the face',
        'Don’t scrub or use harsh peels at home',
      ],
      skinToneNote:
        'Melasma is especially common in Indian and other brown skin. Unsupervised steroid "fairness" creams are a big problem: they thin the skin, cause redness and acne, and the melasma returns worse when stopped.',
      sources: [
        { label: 'NHS: Melasma', url: 'https://www.nhs.uk/conditions/melasma/' },
        { label: 'DermNet: Melasma', url: 'https://dermnetnz.org/topics/melasma' },
      ],
    },
  },

  // ───────────────────────── Shingles ─────────────────────────
  {
    id: 'shingles',
    name: 'Shingles (herpes zoster)',
    aka: ['Herpes zoster', 'Zoster', 'Nagin'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      band_one_side: 3,
      burning_tingling_first: 3,
      grouped_blisters: 2,
      painful_tender: 2,
      blisters: 1,
      onset_sudden: 1,
      duration_under_2w: 1,
      weak_immunity: 1,
      family_also_itchy: -2,
      duration_over_6w: -2,
      comes_and_goes: -1,
      scaly_flaky: -1,
    },
    sites: { chest: 3, back: 3, abdomen: 2, face: 2, neck: 1, upper_arms: 1, buttocks: 1, thighs: 1, scalp: 1 },
    alsoCheck: [
      { area: 'back', reason: 'Shingles often wraps from the spine round to the front on one side.' },
      { area: 'face', reason: 'Shingles near the eye or on the tip of the nose needs urgent care.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Shingles is a painful rash caused by the chickenpox virus waking up again. It makes a band of blisters on one side of the body.',
      looksLike: [
        'Burning, tingling or pain for a few days before any rash',
        'Then red patches with small clusters of blisters',
        'In a stripe or band on one side of the body only',
        'Often on the chest, back or tummy, or one side of the face',
        'Blisters crust over in about 7–10 days',
      ],
      progression:
        'The rash usually heals in 2–4 weeks. Some people, especially older adults, have nerve pain that lasts after the rash has gone. Seeing a doctor within 3 days of the rash starting can help reduce this.',
      why:
        'After chickenpox, the virus (varicella-zoster) stays asleep in nerve roots near the spine. When immunity drops, from age, stress or illness, it wakes up and travels down one nerve to the skin. That is why the rash follows one strip of skin on one side.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'The one-sided band pattern is usually clear.',
        },
        {
          name: 'Swab of a blister (sometimes)',
          why: 'If the diagnosis is unclear.',
        },
        {
          name: 'Check for immune problems (sometimes)',
          why: 'If a young person gets shingles or it is very widespread, such as an HIV or blood sugar test.',
        },
      ],
      doctor: {
        type: GP,
        when: 'Within 1–3 days of the rash starting. Same day if it is near the eye or on the nose, you have eye pain or blurry vision, or your immunity is weak.',
      },
      dos: [
        'See a doctor early, ideally within 3 days of the rash appearing',
        'Keep the rash clean, dry and loosely covered',
        'Wear loose cotton clothes',
        'Keep away from pregnant women, newborns and people with weak immunity until blisters crust',
      ],
      donts: [
        'Don’t pop or scratch the blisters',
        'Don’t put home remedies, powders or pastes on the blisters',
        'Don’t share towels',
      ],
      skinToneNote:
        'On brown and dark skin the redness may look dark or purplish, but the one-sided band of blisters is still the key clue. Shingles often leaves darker or lighter marks, and sometimes scars, after it heals.',
      sources: [
        { label: 'NHS: Shingles', url: 'https://www.nhs.uk/conditions/shingles/' },
        { label: 'DermNet: Herpes zoster', url: 'https://dermnetnz.org/topics/herpes-zoster' },
      ],
    },
  },
  // ───────────────────────── Cold sores ─────────────────────────
  {
    id: 'cold_sores',
    name: 'Cold sores (herpes simplex)',
    aka: ['Herpes simplex', 'Fever blisters', 'HSV'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      grouped_blisters: 3,
      burning_tingling_first: 2,
      comes_and_goes: 2,
      blisters: 1,
      painful_tender: 1,
      recent_illness: 1,
      worse_in_sun: 1,
      worse_stress: 1,
      duration_under_2w: 1,
      band_one_side: -1,
      duration_over_6w: -2,
      scaly_flaky: -1,
      family_also_itchy: -1,
    },
    sites: { face: 3, mouth: 1, genitals: 2, hands: 1, buttocks: 1 },
    alsoCheck: [
      { area: 'face', reason: 'A close photo of the lips and edge of the mouth shows the cluster of blisters.' },
      { area: 'mouth', reason: 'Sores inside the mouth can be a first herpes infection, especially in children.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Cold sores are small clusters of blisters, usually on or near the lips, caused by the herpes simplex virus. They come back from time to time in the same place.',
      looksLike: [
        'Tingling, itching or burning before anything shows',
        'A small cluster of fluid-filled blisters',
        'Usually on the edge of the lip or around the mouth or nose',
        'Blisters burst, crust over and heal in 7–10 days',
        'Return in the same place now and then',
      ],
      progression:
        'Once you have the virus, it stays in the body for life and can flare from time to time. Flares are usually milder than the first time. Many people get fewer flares as they get older.',
      why:
        'The herpes simplex virus enters through the skin, often in childhood, then hides in a nerve. Triggers like a cold, fever, sun, stress or periods can wake it up, and it travels back along the nerve to the skin to make blisters.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'The look and repeating pattern are usually enough.',
        },
        {
          name: 'Swab of a blister (sometimes)',
          why: 'If the diagnosis is unclear or sores are unusual.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If sores are large, very frequent, don’t heal in 10 days, or you have weak immunity. Urgently if a baby has sores, or sores are near the eye or spread over eczema.',
      },
      dos: [
        'Wash your hands after touching the sore',
        'Use lip balm with sunscreen if sun triggers it',
        'Keep the area clean and dry',
      ],
      donts: [
        'Don’t kiss anyone, especially babies, while you have a sore',
        'Don’t share cups, towels or lip products',
        'Don’t touch the sore and then your eyes',
        'Don’t pick at the scab',
      ],
      skinToneNote:
        'On brown and dark skin the redness around the blisters can be harder to see, but the blisters and crusts look the same. A dark mark may remain for a while after healing.',
      sources: [
        { label: 'NHS: Cold sores', url: 'https://www.nhs.uk/conditions/cold-sores/' },
        { label: 'DermNet: Herpes simplex', url: 'https://dermnetnz.org/topics/herpes-simplex' },
      ],
    },
  },

  // ───────────────────────── Molluscum contagiosum ─────────────────────────
  {
    id: 'molluscum_contagiosum',
    name: 'Molluscum contagiosum',
    aka: ['Water warts'],
    category: 'skin',
    prevalence: 'common',
    evidence: {
      dome_with_dimple: 3,
      small_bumps: 2,
      no_symptoms: 1,
      asthma_hayfever: 1,
      shared_towels_sport: 1,
      duration_over_6w: 1,
      scaly_flaky: -2,
      ring_shaped_clear_centre: -1,
      pustules: -1,
      painful_tender: -1,
    },
    sites: { abdomen: 2, armpits: 2, thighs: 2, groin: 2, face: 2, chest: 1, upper_arms: 1, knees: 1, genitals: 1 },
    alsoCheck: [
      { area: 'armpits', reason: 'Molluscum often groups in the armpits and skin folds.' },
      { area: 'groin', reason: 'In adults, bumps in the groin or genitals can be spread by sexual contact.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Molluscum contagiosum is a harmless viral skin infection, common in children. It causes small, smooth, pearly bumps with a tiny dimple in the middle.',
      looksLike: [
        'Small, firm, smooth dome-shaped bumps',
        'Skin-coloured, pink or pearly',
        'A tiny dip in the centre of each bump',
        'Often in groups, in skin folds, the tummy, armpits or thighs',
        'Usually not painful; may itch or get red before healing',
      ],
      progression:
        'Bumps usually go away by themselves, though it can take 6–18 months or longer. They spread with scratching or shared towels. Redness around a bump often means it is about to clear.',
      why:
        'A poxvirus infects the top layer of skin and makes the cells grow into a small bump filled with virus. It spreads by skin contact, shared towels, baths and swimming. Children with eczema tend to get more bumps.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'The dimpled bumps are easy to recognise.',
        },
        {
          name: 'Dermoscopy',
          why: 'A magnifier can confirm the typical look if unsure.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If bumps are near the eye, there are many, they become infected, or an adult has them in the genital area or has weak immunity.',
      },
      dos: [
        'Leave the bumps alone; most clear on their own',
        'Keep bumps covered with clothing during contact sports',
        'Use separate towels and wash them often',
        'Keep eczema well moisturised to reduce spread',
      ],
      donts: [
        'Don’t squeeze, scratch or pick the bumps',
        'Don’t share baths, towels or clothes',
        'Don’t shave over the bumps',
      ],
      skinToneNote:
        'On brown and dark skin the bumps may look skin-coloured, pearly or slightly darker. They can leave small dark or light marks that fade over time.',
      sources: [
        { label: 'NHS: Molluscum contagiosum', url: 'https://www.nhs.uk/conditions/molluscum-contagiosum/' },
        { label: 'DermNet: Molluscum contagiosum', url: 'https://dermnetnz.org/topics/molluscum-contagiosum' },
      ],
    },
  },

  // ───────────────────────── Viral warts ─────────────────────────
  {
    id: 'viral_warts',
    name: 'Warts (viral warts)',
    aka: ['Common warts', 'Verrucas', 'Plantar warts', 'Masse'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      rough_skin_growth: 3,
      no_symptoms: 1,
      duration_over_6w: 1,
      shared_towels_sport: 1,
      dome_with_dimple: -1,
      itchy: -1,
      red_inflamed: -1,
      scaly_flaky: -1,
      onset_sudden: -1,
    },
    sites: { hands: 3, feet: 3, face: 1, knees: 1, fingernails: 1, genitals: 1, elbows: 1 },
    alsoCheck: [
      { area: 'feet', reason: 'Warts on the soles (verrucas) are often flat and hard, and easy to miss.' },
      { area: 'fingernails', reason: 'Warts around the nails can spread with nail biting.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Warts are small, rough growths on the skin caused by a virus. They are harmless and very common, especially on hands and feet.',
      looksLike: [
        'Rough, raised, skin-coloured bumps',
        'Tiny black dots inside (small clotted blood vessels)',
        'On the soles: flat, hard and painful to walk on (verrucas)',
        'Flat, smooth small warts on the face or hands in some people',
      ],
      progression:
        'Most warts go away by themselves over months to a couple of years, especially in children. They can spread to nearby skin or other people.',
      why:
        'A virus called human papillomavirus (HPV) gets into tiny cuts in the skin and makes the top layer grow too fast, forming a rough lump. It spreads by touch and on damp surfaces like pool floors.',
      tests: [
        {
          name: 'Usually no test needed',
          why: 'Warts are easy to recognise.',
        },
        {
          name: 'Biopsy (rarely)',
          why: 'If a growth looks unusual, bleeds, or in an older adult, to rule out other growths.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'If warts are painful, spreading, on the face or genitals, bleed, or change in look, or you have diabetes or weak immunity.',
      },
      dos: [
        'Keep warts covered in shared places like pools',
        'Keep feet dry and change socks daily',
        'Wash hands after touching a wart',
      ],
      donts: [
        'Don’t pick, bite or scratch warts',
        'Don’t share towels, shoes or razors',
        'Don’t try to cut or burn warts off at home',
        'Don’t put acids or home remedies on warts without a doctor, especially if you have diabetes',
      ],
      skinToneNote:
        'On brown and dark skin warts may be darker than the surrounding skin. Flat warts in particular can look like small brown spots. Treatment can leave light or dark marks.',
      sources: [
        { label: 'NHS: Warts and verrucas', url: 'https://www.nhs.uk/conditions/warts-and-verrucas/' },
        { label: 'DermNet: Viral warts', url: 'https://dermnetnz.org/topics/viral-wart' },
      ],
    },
  },

  // ───────────────────────── Changing mole ─────────────────────────
  {
    id: 'changing_mole',
    name: 'Changing mole (needs checking)',
    aka: ['Suspicious mole', 'Possible melanoma', 'Atypical mole'],
    category: 'skin',
    prevalence: 'uncommon',
    evidence: {
      mole_changing: 3,
      mole_irregular: 3,
      mole_bleeding: 2,
      sun_damage_history: 1,
      family_history_same: 1,
      nail_dark_streak: 1,
      duration_over_6w: 1,
      comes_and_goes: -1,
      family_also_itchy: -2,
      ring_shaped_clear_centre: -2,
    },
    sites: { back: 2, feet: 2, shins: 2, chest: 1, face: 1, hands: 1, fingernails: 1, toenails: 1, upper_arms: 1, thighs: 1 },
    alsoCheck: [
      { area: 'feet', reason: 'In brown and dark skin, melanoma is more common on the soles, so these are worth checking.' },
      { area: 'hands', reason: 'Check the palms for any new or changing dark spots.' },
      { area: 'fingernails', reason: 'A new or widening dark streak in a nail should be checked.' },
      { area: 'toenails', reason: 'Dark streaks in the toenails, especially the big toe, should be checked.' },
      { area: 'back', reason: 'The back is hard to see yourself; ask someone to look or take a photo.' },
    ],
    baseUrgency: 'soon',
    card: {
      summary:
        'Most moles are harmless. But a mole that is new in an adult, or changing in size, shape or colour, should be checked by a doctor soon, because it can be an early skin cancer (melanoma).',
      looksLike: [
        'A: Asymmetry — the two halves don’t match',
        'B: Border — uneven, blurred or jagged edge',
        'C: Colour — more than one colour, or very dark patches',
        'D: Diameter — larger than about 6 mm (a pencil eraser)',
        'E: Evolving — changing in size, shape, colour, or starting to itch, bleed or crust',
        'A new or widening dark stripe in a nail, or a dark spot on the sole or palm',
      ],
      progression:
        'Harmless moles stay the same for years. A melanoma usually changes over weeks to months. Found early, it can usually be removed completely; found late, it can spread inside the body.',
      why:
        'Moles are clusters of pigment cells. Sometimes damage to these cells, often from sunburn, makes them grow out of control. Melanoma is less common in brown skin, but when it happens it is often on the soles, palms or under nails and is found later.',
      tests: [
        {
          name: 'Dermoscopy',
          why: 'A doctor looks at the mole with a special magnifier to check its pattern.',
        },
        {
          name: 'Biopsy',
          why: 'Removing the mole (or part of it) to look at it under a microscope is the only way to be sure.',
        },
      ],
      doctor: {
        type: DERM,
        when: 'Soon, within a couple of weeks, for any mole that is new, changing, bleeding or looks different from your other moles.',
      },
      dos: [
        'Take clear photos with a ruler or coin next to the mole to track changes',
        'Check your skin once a month, including soles, palms and nails',
        'Use sunscreen and avoid sunburn',
        'Show the doctor any mole that looks different from the rest ("ugly duckling")',
      ],
      donts: [
        'Don’t try to remove or burn off a mole at home',
        'Don’t scratch or pick a mole that is bleeding',
        'Don’t wait to see if a changing mole settles by itself',
      ],
      skinToneNote:
        'In brown and dark skin, melanoma is rarer but is more often found on the soles of the feet, palms, under nails and inside the mouth, and is often noticed late. Any new dark spot in these places is worth checking.',
      sources: [
        { label: 'NHS: Melanoma skin cancer', url: 'https://www.nhs.uk/conditions/melanoma-skin-cancer/' },
        { label: 'DermNet: Melanoma', url: 'https://dermnetnz.org/topics/melanoma' },
        { label: 'AAD: Melanoma signs and symptoms', url: 'https://www.aad.org/public/diseases/skin-cancer/types/common/melanoma/symptoms' },
      ],
    },
  },

  // ───────────────────────── Miliaria ─────────────────────────
  {
    id: 'miliaria',
    name: 'Heat rash (miliaria)',
    aka: ['Prickly heat', 'Sweat rash', 'Ghamoriyan'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      worse_sweat_heat: 3,
      small_bumps: 2,
      itchy: 2,
      onset_sudden: 1,
      duration_under_2w: 1,
      newborn_or_infant: 1,
      blisters: 1,
      duration_over_6w: -2,
      scaly_flaky: -2,
      ring_shaped_clear_centre: -2,
      thick_silvery_scale: -2,
    },
    sites: { neck: 3, chest: 3, back: 3, armpits: 2, abdomen: 2, groin: 1, face: 1, upper_arms: 1 },
    alsoCheck: [
      { area: 'back', reason: 'Heat rash is common on the back where clothes trap sweat.' },
      { area: 'neck', reason: 'The neck and skin folds are classic places, especially in babies.' },
    ],
    baseUrgency: 'self_care',
    card: {
      summary:
        'Heat rash is a rash of tiny, itchy or prickly bumps that appears when sweat gets trapped in the skin. It is very common in hot, humid weather and in babies.',
      looksLike: [
        'Lots of tiny bumps or clear little blisters',
        'Prickly, stinging or itchy feeling',
        'Neck, chest, back, armpits and skin folds',
        'Areas covered by tight or synthetic clothes',
      ],
      progression:
        'It usually clears within a few days once the skin is kept cool. It returns easily in hot weather.',
      why:
        'Sweat ducts get blocked, so sweat leaks into the surrounding skin instead of reaching the surface. This causes small bumps and a prickly, itchy feeling.',
      tests: [
        {
          name: 'No test needed',
          why: 'Heat rash is recognised by its look and link to heat.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If it doesn’t settle in a few days of keeping cool, spots fill with pus, or a baby has a fever or seems unwell.',
      },
      dos: [
        'Keep cool: use fans, air conditioning or cool showers',
        'Wear loose, light cotton clothes',
        'Dress babies lightly; don’t over-wrap them',
        'Pat skin dry after bathing',
      ],
      donts: [
        'Don’t wear tight or synthetic clothes',
        'Don’t apply thick oils, creams or heavy powders that block the skin',
        'Don’t scratch',
      ],
      skinToneNote:
        'On brown and dark skin the bumps may look skin-coloured, grey or slightly darker rather than red. They are often easier to feel than to see.',
      sources: [
        { label: 'NHS: Heat rash (prickly heat)', url: 'https://www.nhs.uk/conditions/heat-rash-prickly-heat/' },
        { label: 'DermNet: Miliaria', url: 'https://dermnetnz.org/topics/miliaria' },
      ],
    },
  },

  // ───────────────────────── Intertrigo / candida ─────────────────────────
  {
    id: 'intertrigo_candida',
    name: 'Skin-fold rash (intertrigo / candida)',
    aka: ['Intertrigo', 'Candida skin infection', 'Yeast infection of the skin folds', 'Thrush of the skin'],
    category: 'skin',
    prevalence: 'very_common',
    evidence: {
      red_inflamed: 2,
      worse_sweat_heat: 2,
      oozing_weeping: 2,
      diabetes: 2,
      pustules: 1,
      itchy: 1,
      painful_tender: 1,
      ring_shaped_clear_centre: -2,
      thick_silvery_scale: -1,
      no_symptoms: -2,
    },
    sites: { groin: 3, armpits: 3, abdomen: 2, buttocks: 2, chest: 2, neck: 1, finger_webs: 1, toe_webs: 1 },
    alsoCheck: [
      { area: 'chest', reason: 'The fold under the breasts is one of the most common places.' },
      { area: 'abdomen', reason: 'Folds of the tummy and belly button often trap moisture.' },
      { area: 'groin', reason: 'Groin folds are commonly affected; this also helps tell it apart from ringworm.' },
      { area: 'finger_webs', reason: 'Soggy white skin between fingers can be candida from wet work.' },
    ],
    baseUrgency: 'routine',
    card: {
      summary:
        'Intertrigo is a rash in skin folds caused by rubbing, heat and moisture. It is often infected with candida, a type of yeast.',
      looksLike: [
        'Red, raw, moist skin in folds that touch',
        'Under the breasts, in the groin, armpits, tummy folds and between buttocks',
        'Small red spots or pus spots at the edge (with candida)',
        'Can sting, burn, itch or smell',
        'Both sides of the fold are usually affected, like a mirror image',
      ],
      progression:
        'It gets worse in hot weather and with sweating. It settles when the folds are kept dry, but often returns. It is more common and more stubborn with diabetes or excess weight.',
      why:
        'When skin rubs on skin, and sweat can’t escape, the skin softens and breaks down. Yeast (candida) and bacteria that live on skin then overgrow in the warm, wet fold, causing a red, sore rash.',
      tests: [
        {
          name: 'Skin scraping (KOH test)',
          why: 'To see if yeast is present and to rule out ringworm, which can look similar in the groin.',
        },
        {
          name: 'Blood sugar',
          why: 'Repeated skin-fold infections can be a sign of diabetes.',
        },
      ],
      doctor: {
        type: GP,
        when: 'If it doesn’t improve in a week of keeping dry, keeps coming back, or you have diabetes.',
      },
      dos: [
        'Keep folds clean and fully dry; pat dry after bathing',
        'Place a soft cotton cloth in folds to absorb sweat',
        'Wear loose, cotton clothes and change them when sweaty',
        'Keep blood sugar well controlled if you have diabetes',
      ],
      donts: [
        'Don’t use steroid or mixed creams without a doctor',
        'Don’t rub harshly or use scented soaps in the folds',
        'Don’t wear tight, synthetic clothes',
      ],
      skinToneNote:
        'On brown and dark skin the rash may look dark brown, purple or grey rather than red, and often leaves dark marks in the folds after healing.',
      sources: [
        { label: 'NHS: Intertrigo', url: 'https://www.nhs.uk/conditions/intertrigo/' },
        { label: 'DermNet: Intertrigo', url: 'https://dermnetnz.org/topics/intertrigo' },
        { label: 'DermNet: Candida skin infection', url: 'https://dermnetnz.org/topics/cutaneous-candidiasis' },
      ],
    },
  },
];
