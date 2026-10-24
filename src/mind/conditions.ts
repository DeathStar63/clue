// Mind conditions: plain-words cards for possible mental-health conditions.
// Educational only. No diagnosis, no medicine names. For clinical review.
import type { MindCondition } from './types';

// ---- Shared pieces ----

const TELE_MANAS = 'Tele-MANAS: call 14416 (free, 24×7). Trained counsellors listen, help, and can refer you to a doctor near you.';
const DMHP = 'District Mental Health Programme clinic at your district hospital (free or very low cost).';
const GOVT_OPD = 'Psychiatry OPD at a government medical college or district hospital (low cost).';
const INSTITUTES = 'Big mental-health institutes like NIMHANS (Bengaluru) and similar government institutes in many states.';
const DEADDICTION = 'Government de-addiction centre (often inside the district hospital or medical college).';

const BASE_FREE_HELP = [TELE_MANAS, DMHP, GOVT_OPD, INSTITUTES];

const SELF_HARM_NOW = 'If you have thoughts of harming yourself, call 14416 or 112 now.';

const DONT_MEDS = "Don't stop or start any medicine on your own. Talk to your doctor first.";
const DONT_ALCOHOL = "Don't use alcohol or drugs to cope. They make most of these problems worse.";
const DONT_WAIT = "Don't wait for it to \"go away by itself\" if it has been going on for weeks.";
const DONT_AI = "Don't rely on the internet or AI chatbots as treatment. They can't replace a real check.";
const DONT_SHAME = "Don't feel ashamed. This is common, and it can be treated.";

const DO_SLEEP = 'Keep a regular sleep time and wake time, even on weekends.';
const DO_MOVE = 'Move your body every day — a 20–30 minute walk counts.';
const DO_TELL = 'Tell one person you trust how you are really feeling.';
const DO_DIARY = 'Keep a simple diary of your mood and sleep to show the doctor.';
const DO_LIMIT_ALCOHOL = 'Cut down on alcohol, or avoid it.';
const DO_SAVE_TELEMANAS = 'Save Tele-MANAS (14416) in your phone.';

const THYROID = { name: 'Thyroid test (TSH)', why: 'An over- or under-active thyroid can change mood, energy, sleep and worry.' };
const BLOOD_COUNT = { name: 'Blood count (CBC)', why: 'Anaemia (low blood) can cause tiredness, weakness and low mood.' };
const B12 = { name: 'Vitamin B12 level', why: 'Low B12 can cause tiredness, low mood, memory problems and tingling.' };
const VIT_D = { name: 'Vitamin D level', why: 'Low vitamin D is common in India and can add to tiredness and aches.' };
const SUGAR = { name: 'Blood sugar', why: 'Diabetes or sugar swings can cause tiredness, shakiness and mood changes.' };
const ECG = { name: 'ECG (heart tracing)', why: 'To make sure a fast or pounding heart is not a heart problem.' };
const LIVER = { name: 'Liver tests (LFT)', why: 'Alcohol and some drugs can harm the liver. This shows how it is doing.' };

const PSYCHIATRIST = 'Psychiatrist (a doctor for mental health — can also check physical causes)';
const PSYCHOLOGIST = 'Clinical psychologist (talk therapy like CBT)';

// ---- Conditions ----

export const MIND_CONDITIONS: MindCondition[] = [
  {
    id: 'depression',
    name: 'Depression',
    aka: ['Low mood', 'Clinical depression'],
    linkedInstruments: ['phq9'],
    supportingContext: { over_2_weeks: true, affects_daily_life: true, family_history: true, past_episode: true },
    baseUrgency: 'soon',
    whenUrgent: [
      SELF_HARM_NOW,
      'You feel there is no point in living, or you are making plans to end your life.',
      'You have stopped eating, drinking or getting out of bed.',
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Depression is more than feeling sad for a day or two. It is a low mood or loss of interest that stays for at least two weeks and makes daily life hard.',
      looksLike: [
        'Feeling sad, empty or hopeless most of the day',
        'Losing interest in things you used to enjoy',
        'Sleeping much more or much less than usual',
        'Feeling tired or weak with no energy',
        'Eating much more or much less',
        'Finding it hard to think, focus or decide',
        'Feeling worthless or guilty a lot',
      ],
      progression: 'Depression often builds slowly over weeks. It can come once or come back at different times in life. Most people get better with the right help, like talk therapy, treatment from a doctor, or both.',
      why: 'Depression comes from a mix of things. Genes and brain chemistry play a part, so it can run in families. Stress, loss, trauma, money worries, illness or loneliness can set it off. It is not a weakness or a choice.',
      tests: [THYROID, BLOOD_COUNT, B12, VIT_D, SUGAR],
      doctor: {
        type: `${PSYCHIATRIST} or ${PSYCHOLOGIST}`,
        when: 'If low mood has lasted two weeks or more and is affecting work, study, family or sleep. Go today if you have any thoughts of harming yourself.',
      },
      dos: [DO_SLEEP, DO_MOVE, DO_TELL, DO_DIARY, 'Do one small thing you used to enjoy each day, even if you don\'t feel like it.', DO_SAVE_TELEMANAS],
      donts: [DONT_MEDS, DONT_ALCOHOL, DONT_WAIT, DONT_AI, DONT_SHAME],
      sources: [
        { label: 'WHO — Depression fact sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/depression' },
        { label: 'NHS — Depression in adults', url: 'https://www.nhs.uk/mental-health/conditions/depression-in-adults/' },
        { label: 'NIMH — Depression', url: 'https://www.nimh.nih.gov/health/topics/depression' },
      ],
    },
  },
  {
    id: 'bipolar',
    name: 'Bipolar disorder',
    aka: ['Manic depression', 'Mood swings with highs'],
    linkedInstruments: ['clue_highs', 'phq9'],
    supportingContext: { past_highs: true, family_history: true, past_episode: true },
    baseUrgency: 'soon',
    whenUrgent: [
      SELF_HARM_NOW,
      'Several days of very little sleep with racing thoughts, big risky plans or spending a lot of money.',
      'Hearing or seeing things others don\'t, or believing things that worry the people around you.',
      'Acting in ways that could put yourself or others in danger.',
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Bipolar disorder means having times of very low mood (depression) and times of unusual "highs" — feeling very energetic, excited or irritable, and needing little sleep. It is important to check for past highs before treating the lows.',
      looksLike: [
        'Times of low mood, like depression, lasting weeks',
        'Times of feeling unusually high, full of energy or very irritable',
        'Needing very little sleep but not feeling tired',
        'Talking fast, racing thoughts, jumping between ideas',
        'Big plans, overspending or risky choices during highs',
        'Others noticing you "aren\'t yourself" during these times',
      ],
      progression: 'Highs and lows come in episodes that can last days to months, with normal times in between. It often starts in the late teens or twenties. With the right treatment and routine, most people get better and live full lives.',
      why: 'Bipolar disorder runs strongly in families, so genes play a big part. Brain chemistry and body clocks are involved. Stress, lack of sleep, alcohol or drugs can set off an episode.',
      tests: [
        THYROID,
        SUGAR,
        { name: 'Kidney and liver tests', why: 'To check general health before a doctor plans treatment.' },
        BLOOD_COUNT,
      ],
      doctor: {
        type: PSYCHIATRIST,
        when: 'Soon, if you have had both low times and high times. Tell the doctor about any highs — treatment for low mood alone can sometimes set off a high. Go today if a high is happening now.',
      },
      dos: [
        'Keep a fixed sleep time — sleep loss can trigger highs.',
        DO_DIARY,
        'Ask a family member what they noticed during your highs, and share it with the doctor.',
        DO_TELL,
        DO_LIMIT_ALCOHOL,
        DO_SAVE_TELEMANAS,
      ],
      donts: [DONT_MEDS, DONT_ALCOHOL, "Don't make big money or life decisions during a high.", DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Bipolar disorder', url: 'https://www.nhs.uk/mental-health/conditions/bipolar-disorder/' },
        { label: 'NIMH — Bipolar disorder', url: 'https://www.nimh.nih.gov/health/topics/bipolar-disorder' },
      ],
    },
  },
  {
    id: 'generalised_anxiety',
    name: 'Generalised anxiety',
    aka: ['GAD', 'Constant worry', 'Tension'],
    linkedInstruments: ['gad7'],
    supportingContext: { over_6_months: true, affects_daily_life: true, family_history: true },
    baseUrgency: 'routine',
    whenUrgent: [
      SELF_HARM_NOW,
      'Chest pain, trouble breathing or fainting — get checked today to rule out a heart or lung problem.',
      'Worry so strong you cannot eat, sleep or leave home for days.',
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Generalised anxiety means worrying a lot, about many things, most days, for months — and finding it very hard to stop.',
      looksLike: [
        'Worrying about many things — health, money, family, work',
        'Finding it hard to stop or control the worry',
        'Feeling restless, on edge or easily tired',
        'Tight muscles, headaches or an upset stomach',
        'Trouble falling or staying asleep',
        'Getting irritated easily or finding it hard to focus',
      ],
      progression: 'It often builds slowly and can go up and down with stress. Without help it can last years. Most people get better with the right help, especially talk therapy like CBT.',
      why: 'Some people are born more sensitive to worry, and it can run in families. Brain chemistry plays a part. Long-term stress, hard life events and health problems can add to it.',
      tests: [THYROID, BLOOD_COUNT, SUGAR, { name: 'ECG (if your heart races)', why: 'To make sure a fast heartbeat is not a heart problem.' }],
      doctor: {
        type: `${PSYCHOLOGIST}; ${PSYCHIATRIST} if it is severe`,
        when: 'If worry has gone on for months and is getting in the way of daily life.',
      },
      dos: [DO_SLEEP, DO_MOVE, 'Try slow breathing: breathe in for 4, out for 6, for a few minutes.', 'Cut down on tea, coffee and energy drinks.', DO_TELL, DO_SAVE_TELEMANAS],
      donts: [DONT_MEDS, DONT_ALCOHOL, DONT_WAIT, DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Generalised anxiety disorder', url: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/' },
        { label: 'NIMH — Anxiety disorders', url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders' },
      ],
    },
  },
  {
    id: 'panic',
    name: 'Panic attacks',
    aka: ['Panic disorder', 'Ghabrahat attacks'],
    linkedInstruments: ['gad7', 'phq15'],
    supportingContext: { affects_daily_life: true, family_history: true },
    baseUrgency: 'routine',
    whenUrgent: [
      'Chest pain that spreads to the arm, jaw or back, or comes with sweating — call 112. Treat it as a heart problem until a doctor says otherwise.',
      'Fainting, or trouble breathing that does not settle.',
      'A first-ever attack, especially if you are older or have heart risks — get checked today.',
      SELF_HARM_NOW,
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'A panic attack is a sudden rush of strong fear with scary body feelings, like a pounding heart. It peaks within minutes. Panic disorder is when attacks keep coming and you worry about the next one.',
      looksLike: [
        'Sudden pounding or racing heart',
        'Feeling short of breath or choking',
        'Sweating, shaking, or feeling hot or cold',
        'Dizziness, or feeling faint or unreal',
        'Fear of dying, losing control or "going mad"',
        'Avoiding places where an attack happened',
      ],
      progression: 'Attacks usually peak within about 10 minutes and then pass. Fear of the next attack can make people avoid places and shrink their life. Most people get better with the right help — talk therapy like CBT works very well.',
      why: 'During a panic attack, the body\'s alarm system (fight or flight) goes off when there is no real danger. Genes, brain chemistry, stress and big life changes can make this alarm more sensitive. Too much caffeine can trigger it.',
      tests: [ECG, THYROID, SUGAR, BLOOD_COUNT],
      doctor: {
        type: `GP first (to check your heart and body), then ${PSYCHOLOGIST}`,
        when: 'See a GP for a heart check after your first attacks. Then see a psychologist if attacks keep coming.',
      },
      dos: [
        'Get a heart check from a GP first, so you can feel sure it is not your heart.',
        'During an attack, breathe slowly — in for 4, out for 6 — and remind yourself it will pass.',
        'Cut down on tea, coffee and energy drinks.',
        DO_MOVE,
        DO_DIARY,
        DO_SAVE_TELEMANAS,
      ],
      donts: [DONT_MEDS, DONT_ALCOHOL, "Don't keep avoiding places — avoiding makes fear grow. A therapist can help you return step by step.", DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Panic disorder', url: 'https://www.nhs.uk/mental-health/conditions/panic-disorder/' },
        { label: 'NIMH — Panic disorder', url: 'https://www.nimh.nih.gov/health/topics/panic-disorder-when-fear-overwhelms' },
      ],
    },
  },
  {
    id: 'social_anxiety',
    name: 'Social anxiety',
    aka: ['Social phobia', 'Extreme shyness'],
    linkedInstruments: ['gad7'],
    supportingContext: { over_6_months: true, affects_daily_life: true, since_childhood: true },
    baseUrgency: 'routine',
    whenUrgent: [SELF_HARM_NOW, 'You have stopped leaving home or going to work or college for weeks.'],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Social anxiety is a strong, lasting fear of being judged, watched or embarrassed by others. It is much more than normal shyness.',
      looksLike: [
        'Strong fear of talking to people, meeting new people or speaking up',
        'Worrying for days before a social event',
        'Blushing, sweating, shaking or a racing heart around others',
        'Avoiding eating, phoning or speaking in front of people',
        'Going over and over what you said afterwards',
      ],
      progression: 'It often starts in the teenage years and can last a long time if not treated. It can affect studies, work and friendships. Most people get better with the right help — CBT works well.',
      why: 'Some people are born more sensitive, and it can run in families. Being bullied, criticised or shamed when young can add to it. Avoiding situations keeps the fear going.',
      tests: [THYROID],
      doctor: {
        type: PSYCHOLOGIST,
        when: 'If fear of people is stopping you from studying, working or making friends.',
      },
      dos: [DO_TELL, 'Practise small, safe steps — like saying hello to a shopkeeper.', DO_SLEEP, DO_MOVE, DO_SAVE_TELEMANAS],
      donts: [DONT_ALCOHOL, "Don't keep avoiding — it makes the fear stronger over time.", DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Social anxiety', url: 'https://www.nhs.uk/mental-health/conditions/social-anxiety/' },
        { label: 'NIMH — Social anxiety disorder', url: 'https://www.nimh.nih.gov/health/topics/social-anxiety-disorder-more-than-just-shyness' },
      ],
    },
  },
  {
    id: 'ocd',
    name: 'Obsessive-compulsive disorder (OCD)',
    aka: ['OCD', 'Unwanted thoughts and rituals'],
    linkedInstruments: [],
    supportingContext: { affects_daily_life: true, family_history: true, since_childhood: true },
    baseUrgency: 'routine',
    whenUrgent: [SELF_HARM_NOW, 'Rituals take up most of your day, or you can\'t eat, sleep or leave home because of them.'],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'OCD means having unwanted thoughts, pictures or urges that cause a lot of worry (obsessions), and feeling you must do certain things again and again to feel better (compulsions). Clue doesn\'t screen for this yet — if this sounds like you, a psychologist can check.',
      looksLike: [
        'Unwanted, upsetting thoughts that keep coming back',
        'Fear of dirt or germs, or of harm coming to someone',
        'Washing, cleaning, checking or counting again and again',
        'Needing things to be "just right" or in a set order',
        'Knowing the thoughts don\'t make sense, but feeling unable to stop',
        'Rituals taking more than an hour a day',
      ],
      progression: 'OCD often starts in childhood or the teenage years and can come and go with stress. Without help it can last for years. Most people get better with the right help — a special talk therapy (ERP, a type of CBT) works well.',
      why: 'Genes and brain chemistry play a part, and OCD can run in families. Stress, big life changes or illness can make it worse. Having unwanted thoughts does not mean you want them or will act on them.',
      tests: [THYROID],
      doctor: {
        type: `${PSYCHOLOGIST} or ${PSYCHIATRIST}`,
        when: 'If thoughts or rituals take up a lot of time or cause a lot of distress.',
      },
      dos: [DO_TELL, DO_DIARY, DO_SLEEP, DO_MOVE, DO_SAVE_TELEMANAS],
      donts: [DONT_MEDS, "Don't ask family to help with your rituals or keep reassuring you — it keeps OCD going.", DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — OCD', url: 'https://www.nhs.uk/mental-health/conditions/obsessive-compulsive-disorder-ocd/' },
        { label: 'NIMH — OCD', url: 'https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd' },
      ],
    },
  },
  {
    id: 'ptsd',
    name: 'Post-traumatic stress (PTSD)',
    aka: ['PTSD', 'Trauma stress'],
    linkedInstruments: ['pcptsd5'],
    supportingContext: { after_trauma: true, affects_daily_life: true },
    baseUrgency: 'soon',
    whenUrgent: [
      SELF_HARM_NOW,
      'You are still in danger, or the person who hurt you is still around — call 112 (police) or 181 (women\'s helpline).',
      'Flashbacks so strong you lose track of where you are.',
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'PTSD can happen after something very frightening or harmful — like an accident, violence, abuse, disaster or a sudden loss. The mind keeps reliving it, long after the danger is over.',
      looksLike: [
        'Upsetting memories, flashbacks or nightmares about what happened',
        'Avoiding places, people or talk that bring it back',
        'Always feeling on guard or easily startled',
        'Trouble sleeping or focusing',
        'Feeling numb, cut off, guilty or ashamed',
      ],
      progression: 'Signs often start soon after the event but can also appear months later. Many people improve in the first weeks; for others it lasts longer. Most people get better with the right help — trauma-focused therapy works well.',
      why: 'After danger, the brain\'s alarm system can stay switched on. How likely this is depends on how bad the event was, past trauma, genes, and how much support you had afterwards. It is a normal brain response to an abnormal event, not a weakness.',
      tests: [THYROID, { name: 'General check-up', why: 'To look after any injuries or health problems linked to what happened.' }],
      doctor: {
        type: `${PSYCHOLOGIST} (trauma-focused therapy) or ${PSYCHIATRIST}`,
        when: 'If signs have lasted more than a month or are getting in the way of daily life.',
      },
      dos: ['Get to a safe place and stay with people you trust.', DO_TELL, DO_SLEEP, DO_MOVE, 'Try grounding: name 5 things you can see when a flashback starts.', DO_SAVE_TELEMANAS],
      donts: [DONT_ALCOHOL, DONT_MEDS, DONT_WAIT, DONT_AI, "Don't blame yourself for what happened."],
      sources: [
        { label: 'NHS — PTSD', url: 'https://www.nhs.uk/mental-health/conditions/post-traumatic-stress-disorder-ptsd/' },
        { label: 'NIMH — PTSD', url: 'https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd' },
      ],
    },
  },
  {
    id: 'adult_adhd',
    name: 'Adult ADHD',
    aka: ['ADHD', 'Attention deficit'],
    linkedInstruments: ['asrs6'],
    supportingContext: { since_childhood: true, affects_daily_life: true, family_history: true },
    baseUrgency: 'routine',
    whenUrgent: [SELF_HARM_NOW],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'ADHD is a difference in how the brain manages attention, activity and self-control. It starts in childhood but often goes unnoticed until adult life.',
      looksLike: [
        'Finding it hard to focus, finish tasks or stay organised',
        'Losing things, forgetting dates and appointments',
        'Feeling restless, fidgety or unable to sit still',
        'Acting or speaking without thinking',
        'Putting things off until the last minute',
        'These signs have been there since school days',
      ],
      progression: 'ADHD starts in childhood. Some signs, like being very active, may ease with age, while trouble focusing and organising often stays. Most people do much better with the right help — support, skills training and treatment.',
      why: 'ADHD runs strongly in families, so genes play a big part. It is linked to how certain brain areas manage attention and planning. It is not caused by bad parenting or laziness.',
      tests: [THYROID, { name: 'Sleep and hearing/eyesight check', why: 'Poor sleep or trouble hearing or seeing can look like trouble focusing.' }],
      doctor: {
        type: PSYCHIATRIST,
        when: 'If focus problems since childhood are affecting your work, studies, money or relationships.',
      },
      dos: ['Use phone reminders, lists and a calendar.', 'Break big tasks into small steps.', DO_SLEEP, DO_MOVE, 'Ask family about what you were like as a child — the doctor will ask.'],
      donts: [DONT_MEDS, DONT_ALCOHOL, DONT_AI, "Don't call yourself lazy — this is how your brain works, and it can be helped."],
      sources: [
        { label: 'NHS — ADHD in adults', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/' },
        { label: 'NIMH — ADHD', url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd' },
      ],
    },
  },
  {
    id: 'alcohol_use',
    name: 'Alcohol problem',
    aka: ['Alcohol use disorder', 'Drinking problem', 'Alcohol dependence'],
    linkedInstruments: ['audit', 'clue_withdrawal'],
    supportingContext: { heavy_alcohol: true, affects_daily_life: true, family_history: true },
    baseUrgency: 'soon',
    whenUrgent: [
      'Fits (seizures), seeing or hearing things, or deep confusion after cutting down or stopping — call 112. This can be dangerous.',
      'Very bad shaking, sweating and a racing heart after stopping drinking.',
      'Vomiting blood, black stools, or yellow eyes and skin.',
      SELF_HARM_NOW,
    ],
    freeHelp: [DEADDICTION, TELE_MANAS, GOVT_OPD, DMHP, INSTITUTES],
    card: {
      summary: 'An alcohol problem is when drinking starts to harm your health, work, money or family, and it feels hard to cut down.',
      looksLike: [
        'Drinking more, or more often, than you planned',
        'Needing more alcohol to get the same effect',
        'Shaking, sweating or feeling unwell in the morning until you drink',
        'Trying to cut down but not managing',
        'Fights, missed work or money trouble because of drinking',
        'Family or friends worried about your drinking',
      ],
      progression: 'Drinking often increases slowly over years. Over time it can harm the liver, stomach, brain and heart. Most people can cut down or stop, and get better with the right help.',
      why: 'Genes can make some people more likely to become dependent. Regular drinking changes the brain, so the body starts to need alcohol. Stress, low mood, social pressure and easy access all play a part.',
      tests: [
        LIVER,
        BLOOD_COUNT,
        SUGAR,
        { name: 'Vitamin levels (B1, B12)', why: 'Heavy drinking lowers vitamins the brain and nerves need.' },
      ],
      doctor: {
        type: `${PSYCHIATRIST} or a de-addiction centre`,
        when: 'Soon if you drink every day or can\'t cut down. If you drink heavily every day, stopping suddenly can be dangerous — see a doctor first so it can be done safely.',
      },
      dos: [
        'Talk to a doctor before stopping if you drink every day.',
        'Keep a record of how much and how often you drink.',
        'Eat regular meals and drink water.',
        DO_TELL,
        'Remove alcohol from your home.',
        DO_SAVE_TELEMANAS,
      ],
      donts: [
        "Don't stop suddenly on your own if you drink heavily every day — get medical help.",
        DONT_MEDS,
        "Don't swap alcohol for other drugs or sleeping pills.",
        DONT_WAIT,
        DONT_SHAME,
      ],
      sources: [
        { label: 'WHO — Alcohol fact sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/alcohol' },
        { label: 'NHS — Alcohol misuse', url: 'https://www.nhs.uk/conditions/alcohol-misuse/' },
      ],
    },
  },
  {
    id: 'drug_use',
    name: 'Drug use problem',
    aka: ['Substance use disorder', 'Addiction'],
    linkedInstruments: ['clue_drugs'],
    supportingContext: { drug_use: true, cannabis_use: true, affects_daily_life: true },
    baseUrgency: 'soon',
    whenUrgent: [
      'Very sleepy, hard to wake, slow or noisy breathing, or blue lips after using — call 112 now.',
      'Chest pain, fits, very high temperature or deep confusion after using.',
      'Seeing or hearing things, or feeling people are out to get you.',
      SELF_HARM_NOW,
    ],
    freeHelp: [DEADDICTION, TELE_MANAS, GOVT_OPD, DMHP, INSTITUTES],
    card: {
      summary: 'A drug use problem is when using a drug — like cannabis (ganja, bhang, charas), opioids, sleeping pills or others — starts to harm your health, mind or life, and it is hard to stop.',
      looksLike: [
        'Using more, or more often, than you meant to',
        'Strong cravings or urges to use',
        'Feeling unwell, restless or low when you don\'t use',
        'Problems at work, studies, money or home because of it',
        'Giving up things you used to enjoy',
        'Keeping on using even though it is causing harm',
      ],
      progression: 'Use often grows slowly. Over time the body and brain start to need the drug. Most people can recover with the right help, and many go on to live drug-free lives.',
      why: 'Drugs change the brain\'s reward system, so the brain starts to crave them. Genes, stress, trauma, low mood and friends who use can all make it more likely. It is a health problem, not a moral failure.',
      tests: [
        LIVER,
        { name: 'HIV and hepatitis B/C tests', why: 'Sharing needles or unsafe sex can spread these infections.' },
        BLOOD_COUNT,
        { name: 'Urine drug test', why: 'Helps the doctor know which drugs are in your body, so care is safe.' },
      ],
      doctor: {
        type: `${PSYCHIATRIST} or a de-addiction centre`,
        when: 'Soon, if you can\'t control your use or it is harming your life. Stopping some drugs suddenly can make you very unwell, so get advice first.',
      },
      dos: ['Be honest with the doctor about what you use — they are there to help, not judge.', DO_TELL, 'Stay away from places and people linked with using.', DO_SLEEP, DO_SAVE_TELEMANAS],
      donts: [DONT_MEDS, "Don't mix drugs with alcohol or sleeping pills.", "Don't share needles.", DONT_WAIT, DONT_SHAME],
      sources: [
        { label: 'NHS — Drug addiction: getting help', url: 'https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/' },
        { label: 'NIMH — Substance use and mental health', url: 'https://www.nimh.nih.gov/health/topics/substance-use-and-mental-health' },
      ],
    },
  },
  {
    id: 'insomnia',
    name: 'Insomnia (sleep problem)',
    aka: ['Can\'t sleep', 'Sleeplessness'],
    linkedInstruments: ['clue_sleep'],
    supportingContext: { affects_daily_life: true, over_2_weeks: true },
    baseUrgency: 'routine',
    whenUrgent: [
      'Several nights with almost no sleep along with racing thoughts or feeling unusually high — see a doctor today.',
      'Loud snoring with stopping breathing in sleep, or falling asleep while driving.',
      SELF_HARM_NOW,
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Insomnia means having trouble falling asleep, staying asleep or waking too early — and feeling tired in the day because of it.',
      looksLike: [
        'Lying awake for a long time before falling asleep',
        'Waking up often in the night',
        'Waking very early and not getting back to sleep',
        'Feeling tired, irritable or foggy in the day',
        'Worrying about sleep itself',
      ],
      progression: 'Short spells of poor sleep after stress are common and often pass. When it goes on for more than three months, it can become a habit of its own. Most people get better with the right help — CBT for insomnia works well.',
      why: 'Stress, worry, low mood, pain, shift work, screens and tea or coffee late in the day can upset sleep. Once poor sleep starts, worrying about sleep can keep it going. It can also be a sign of depression or anxiety.',
      tests: [THYROID, BLOOD_COUNT, { name: 'Sleep study (if you snore loudly)', why: 'To check for sleep apnoea, where breathing stops in sleep.' }],
      doctor: {
        type: `GP first, then ${PSYCHOLOGIST} (CBT for insomnia)`,
        when: 'If poor sleep has lasted more than a few weeks and is affecting your day.',
      },
      dos: [
        'Go to bed and wake up at the same time every day.',
        'Keep your bed for sleep — no phone in bed.',
        'Avoid tea, coffee and colas after the afternoon.',
        'Get daylight in the morning and move your body daily.',
        'If you can\'t sleep after 20 minutes, get up and do something calm, then try again.',
        DO_DIARY,
      ],
      donts: [DONT_MEDS, "Don't use alcohol to fall asleep — it breaks up sleep later in the night.", "Don't nap for long in the day.", DONT_AI],
      sources: [{ label: 'NHS — Insomnia', url: 'https://www.nhs.uk/conditions/insomnia/' }],
    },
  },
  {
    id: 'eating_disorder',
    name: 'Eating disorder',
    aka: ['Anorexia', 'Bulimia', 'Binge eating'],
    linkedInstruments: ['scoff', 'clue_eating_danger'],
    supportingContext: { affects_daily_life: true, family_history: true },
    baseUrgency: 'soon',
    whenUrgent: [
      'Fainting, chest pain, a very slow or uneven heartbeat — call 112.',
      'Very fast weight loss, or being too weak to stand or walk.',
      'Vomiting blood, or making yourself sick many times a day.',
      SELF_HARM_NOW,
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'An eating disorder is when worries about food, weight or body shape take over your life and harm your health. It can affect people of any size, age or gender.',
      looksLike: [
        'Eating very little, or skipping meals on purpose',
        'Eating large amounts in a short time and feeling out of control',
        'Making yourself sick, or over-exercising after eating',
        'Constant thoughts about weight, food or body shape',
        'Feeling fat even when others say you are thin',
        'Missed periods, dizziness or feeling cold all the time',
      ],
      progression: 'It often starts in the teenage or young adult years. Without help it can seriously harm the heart, bones and other organs. Most people get better with the right help, and getting help early makes a big difference.',
      why: 'Genes and brain chemistry play a part. Pressure about looks, dieting, stress, trauma or a need for control can set it off. It is a serious illness, not a lifestyle choice.',
      tests: [
        { name: 'Blood salts and kidney tests', why: 'Vomiting or not eating can upset salts like potassium, which affect the heart.' },
        ECG,
        BLOOD_COUNT,
        SUGAR,
        THYROID,
      ],
      doctor: {
        type: `GP first (body check), then ${PSYCHIATRIST} and ${PSYCHOLOGIST}`,
        when: 'Soon — eating disorders can harm the body quietly. Go today if you feel faint or very weak.',
      },
      dos: ['Eat regular meals, even small ones.', DO_TELL, 'Ask a doctor to check your heart and blood.', 'Follow people and pages that make you feel good, not worse, about your body.', DO_SAVE_TELEMANAS],
      donts: ["Don't follow crash diets or skip meals to lose weight.", "Don't use pills or other products to lose weight or empty your bowels.", DONT_WAIT, DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Eating disorders', url: 'https://www.nhs.uk/mental-health/conditions/eating-disorders/' },
        { label: 'NIMH — Eating disorders', url: 'https://www.nimh.nih.gov/health/topics/eating-disorders' },
      ],
    },
  },
  {
    id: 'psychosis_early',
    name: 'Early psychosis',
    aka: ['Losing touch with reality', 'First-episode psychosis'],
    linkedInstruments: ['clue_psychosis'],
    supportingContext: { cannabis_use: true, family_history: true, drug_use: true },
    baseUrgency: 'today',
    whenUrgent: [
      'Hearing voices that tell you to harm yourself or others — call 112 now.',
      'Feeling in danger from others and wanting to act on it.',
      'Not eating, not sleeping for days, or very confused.',
      SELF_HARM_NOW,
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Psychosis means losing some touch with what is real — like hearing or seeing things others don\'t, or holding strong beliefs that others find hard to understand. Getting help early really matters.',
      looksLike: [
        'Hearing voices or seeing things others can\'t',
        'Feeling watched, followed or that people are against you',
        'Believing special messages are meant only for you',
        'Muddled thinking or speech that is hard to follow',
        'Pulling away from family and friends',
        'Big changes in sleep, self-care or behaviour',
      ],
      progression: 'It often starts slowly, with sleep changes, worry and pulling away, before clearer signs appear. It is most common in the late teens and twenties. Most people get better with the right help, and early treatment gives the best chance.',
      why: 'Genes and brain chemistry play a part, so it can run in families. Heavy cannabis use (ganja, bhang, charas), other drugs, lack of sleep and big stress can trigger it. Some physical illnesses can cause it too, which is why doctors check the body.',
      tests: [
        THYROID,
        SUGAR,
        B12,
        { name: 'Urine drug test', why: 'Some drugs can cause these signs.' },
        { name: 'Brain scan (sometimes)', why: 'To rule out rare causes in the brain.' },
      ],
      doctor: {
        type: PSYCHIATRIST,
        when: 'Today. Go to a psychiatry OPD or emergency department. Bring a family member if you can.',
      },
      dos: ['Get seen by a psychiatrist today.', 'Stay with someone you trust.', 'Stop cannabis and other drugs.', 'Try to keep regular sleep and meals.', DO_SAVE_TELEMANAS],
      donts: ["Don't use cannabis, alcohol or other drugs.", DONT_MEDS, "Don't wait to see if it passes — early help matters.", DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Psychosis', url: 'https://www.nhs.uk/mental-health/conditions/psychosis/' },
        { label: 'NIMH — Schizophrenia', url: 'https://www.nimh.nih.gov/health/topics/schizophrenia' },
      ],
    },
  },
  {
    id: 'perinatal_depression',
    name: 'Depression in pregnancy or after birth',
    aka: ['Postnatal depression', 'Postpartum depression', 'Perinatal depression'],
    linkedInstruments: ['epds', 'clue_postpartum'],
    supportingContext: { recent_childbirth: true, pregnant: true, past_episode: true, family_history: true },
    baseUrgency: 'soon',
    whenUrgent: [
      'In the first weeks after birth: confusion, seeing or hearing things, very strange beliefs, or not sleeping at all — this may be postpartum psychosis. It is an emergency: call 112 or go to hospital now.',
      'Thoughts of harming yourself or your baby — call 14416 or 112 now.',
      'Not able to care for yourself or the baby.',
    ],
    freeHelp: ['Your obstetric / ANC clinic, or the doctor or ASHA worker who sees you in pregnancy.', ...BASE_FREE_HELP],
    card: {
      summary: 'This is depression that starts during pregnancy or in the year after giving birth. It is common and is not your fault. It is different from the "baby blues", which pass within two weeks.',
      looksLike: [
        'Feeling sad, tearful or empty most days',
        'Feeling you can\'t cope or are a "bad mother"',
        'Not enjoying things, including the baby',
        'Feeling very tired, but unable to sleep even when the baby sleeps',
        'Worrying a lot about the baby\'s health',
        'Feeling cut off from the baby or from others',
      ],
      progression: 'It can start any time in pregnancy or the first year after birth. Without help it can last months and affect the bond with the baby. Most mothers get better with the right help.',
      why: 'Big hormone changes, lack of sleep and the stress of caring for a baby all play a part. Past depression, little support, family pressure or a hard birth make it more likely. It is not caused by being a weak or bad mother.',
      tests: [THYROID, BLOOD_COUNT, B12, VIT_D],
      doctor: {
        type: `Your obstetric / ANC doctor first, then ${PSYCHIATRIST} or ${PSYCHOLOGIST}`,
        when: 'If low mood lasts more than two weeks. Go to hospital now if you have confusion, strange beliefs, or thoughts of harm.',
      },
      dos: ['Tell your ANC doctor or ASHA worker how you feel.', 'Ask family to take a night feed or a shift so you can sleep.', 'Eat regular meals and drink water.', 'Get some daylight and a short walk when you can.', DO_TELL, DO_SAVE_TELEMANAS],
      donts: [DONT_MEDS + ' This is extra important in pregnancy and breastfeeding.', "Don't hide it — many mothers feel this way.", DONT_WAIT, DONT_SHAME],
      sources: [
        { label: 'NHS — Postnatal depression', url: 'https://www.nhs.uk/mental-health/conditions/post-natal-depression/' },
        { label: 'NHS — Postpartum psychosis', url: 'https://www.nhs.uk/mental-health/conditions/post-partum-psychosis/' },
        { label: 'NIMH — Perinatal depression', url: 'https://www.nimh.nih.gov/health/publications/perinatal-depression' },
      ],
    },
  },
  {
    id: 'body_stress',
    name: 'Stress showing in the body',
    aka: ['Ghabrahat', 'Body symptoms from stress', 'Somatic symptoms'],
    linkedInstruments: ['phq15', 'clue_body'],
    supportingContext: { body_symptoms_checked_normal: true, affects_daily_life: true, over_6_months: true },
    baseUrgency: 'routine',
    whenUrgent: [
      'Chest pain, trouble breathing, fainting or sudden weakness on one side — call 112.',
      'Weight loss you can\'t explain, blood in stool or urine, or fevers — see a doctor soon.',
      SELF_HARM_NOW,
    ],
    freeHelp: BASE_FREE_HELP,
    card: {
      summary: 'Stress and worry can show up in the body as real pain and discomfort. The symptoms are real — not "all in your head". Mind and body are closely linked.',
      looksLike: [
        'Ghabrahat — a restless, uneasy feeling in the chest or stomach',
        'Aches in the body, head, back or joints',
        'Weakness or tiredness all the time',
        'Burning in the hands, feet or head',
        'Stomach upset, gas or poor appetite',
        'Many tests are normal, but you still feel unwell',
      ],
      progression: 'These symptoms often come and go with stress and can last a long time. Going from doctor to doctor without answers can be tiring. Most people get better with the right help, when both body and mind are cared for.',
      why: 'Stress keeps the body\'s alarm system switched on, which can cause pain, tight muscles, tiredness and stomach trouble. Low mood and worry make the body more sensitive to pain. Life stress, family pressure or trauma can all add to it.\n\nDhat worries: some men worry that losing semen (in urine or at night) is making them weak. Losing semen does not harm your health. These worries are common and often come with stress or low mood, and a doctor can help.',
      tests: [BLOOD_COUNT, THYROID, B12, VIT_D, SUGAR],
      doctor: {
        type: `GP first (to check the body), then ${PSYCHIATRIST} or ${PSYCHOLOGIST}`,
        when: 'If symptoms have gone on for weeks, tests are normal, and stress or worry is part of your life.',
      },
      dos: ['Get a body check from a GP first.', DO_MOVE, DO_SLEEP, 'Keep one regular doctor instead of many.', 'Notice when symptoms get worse — often with stress.', DO_TELL],
      donts: ["Don't keep repeating the same tests if they have been normal.", DONT_MEDS, "Don't believe anyone who says it is \"all in your head\" — it is real, and it can be helped.", DONT_AI, DONT_SHAME],
      sources: [
        { label: 'NHS — Medically unexplained symptoms', url: 'https://www.nhs.uk/conditions/medically-unexplained-symptoms/' },
        { label: 'WHO — Mental disorders fact sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/mental-disorders' },
      ],
    },
  },
  {
    id: 'memory_mood_older',
    name: 'Memory and mood changes in older age',
    aka: ['Forgetfulness', 'Dementia worries', 'Depression in older age'],
    linkedInstruments: ['clue_memory', 'phq9'],
    supportingContext: { age_over_60: true, memory_worse: true, medical_illness: true, new_medicine: true },
    baseUrgency: 'soon',
    whenUrgent: [
      'Sudden confusion over hours or days — not knowing where they are, very sleepy or very agitated. This may be delirium, an emergency: go to hospital now.',
      'Sudden weakness, face drooping or trouble speaking — call 112.',
      'Confusion with fever, a fall, or after starting a new medicine.',
      SELF_HARM_NOW,
    ],
    freeHelp: [...BASE_FREE_HELP, 'Geriatric (elderly care) clinic or memory clinic at a government medical college, if there is one near you.'],
    card: {
      summary: 'In older age, memory problems and low mood can come together. It could be depression, early dementia, or another health problem. A sudden change is different and may be delirium, which needs help right away.',
      looksLike: [
        'Forgetting recent things, or asking the same question again',
        'Getting lost in familiar places',
        'Low mood, loss of interest, or pulling away from people',
        'Trouble with money, cooking or daily tasks',
        'Changes in sleep or appetite',
        'Sudden confusion (this is urgent)',
      ],
      progression: 'Depression can make memory worse, and usually improves with treatment. Dementia comes on slowly over months to years. Delirium comes on suddenly over hours or days and is a medical emergency. Many causes can be treated, and good care helps people live well.',
      why: 'Depression in older age can come from loss, loneliness, illness or brain changes. Dementia comes from slow changes in the brain. Infections, dehydration, low salt, new medicines, low vitamin B12 or thyroid problems can also cause confusion — and these can be treated.',
      tests: [
        B12,
        THYROID,
        BLOOD_COUNT,
        SUGAR,
        { name: 'Blood salts and kidney tests', why: 'Low salt or kidney problems can cause confusion.' },
        { name: 'Urine test', why: 'A urine infection can cause sudden confusion in older people.' },
        { name: 'Memory check and brain scan (sometimes)', why: 'To understand the type of memory problem.' },
      ],
      doctor: {
        type: `GP first, then ${PSYCHIATRIST} or a neurologist (a doctor for the brain and nerves)`,
        when: 'Soon if memory or mood has slowly changed. Go to hospital now if confusion came on suddenly.',
      },
      dos: [
        'Bring a family member to the doctor visit.',
        'Bring a list of all medicines being taken.',
        'Keep a daily routine and stay socially active.',
        'Make sure they drink enough water and eat well.',
        'Write down changes you notice, and when they started.',
        DO_SAVE_TELEMANAS,
      ],
      donts: [DONT_MEDS, "Don't assume forgetfulness is \"just old age\" — some causes can be treated.", "Don't ignore sudden confusion — it is an emergency.", DONT_SHAME],
      sources: [
        { label: 'WHO — Dementia fact sheet', url: 'https://www.who.int/news-room/fact-sheets/detail/dementia' },
        { label: 'NHS — Dementia', url: 'https://www.nhs.uk/conditions/dementia/' },
        { label: 'WHO — Mental health of older adults', url: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-of-older-adults' },
      ],
    },
  },
];

export function mindConditionById(id: string): MindCondition | undefined {
  return MIND_CONDITIONS.find((c) => c.id === id);
}
