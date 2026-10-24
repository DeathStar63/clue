// Short yes/no background questions. They never change a score; they help Clue
// decide which explanations fit better and who to suggest seeing.
import type { ContextQuestion } from './types';

export const CONTEXT_QUESTIONS: ContextQuestion[] = [
  {
    key: 'over_2_weeks',
    text: 'Has this been going on for more than 2 weeks?',
    why: 'Feelings that last a couple of weeks or more are more likely to need support than a bad few days.',
  },
  {
    key: 'over_6_months',
    text: 'Has it been going on for more than 6 months?',
    why: 'Some patterns only make sense when they have lasted a long time.',
  },
  {
    key: 'affects_daily_life',
    text: 'Is it getting in the way of work, studies, home life or relationships?',
    why: 'How much it affects your day is one of the best signs of whether to get help.',
  },
  {
    key: 'since_childhood',
    text: 'Have you been like this since you were a child (before about age 12)?',
    why: 'Some conditions, like focus problems, usually start in childhood.',
    onlyIf: 'adult',
  },
  {
    key: 'after_trauma',
    text: 'Did this start after something very frightening or upsetting happened?',
    why: 'Stressful events can leave a lasting mark, and that changes what kind of help fits.',
  },
  {
    key: 'recent_childbirth',
    text: 'Have you given birth in the last year?',
    why: 'Mood and sleep can change a lot after having a baby, and there is special help for this time.',
    onlyIf: 'perinatal',
  },
  {
    key: 'pregnant',
    text: 'Are you pregnant right now?',
    why: 'Pregnancy affects which kind of care and which doctor is best.',
    onlyIf: 'perinatal',
  },
  {
    key: 'heavy_alcohol',
    text: 'Do you drink alcohol most days, or a lot at one time?',
    why: 'Alcohol can cause or worsen low mood, worry and poor sleep, and stopping suddenly can be unsafe.',
  },
  {
    key: 'drug_use',
    text: 'Do you use any drugs, or take medicines in a way they were not prescribed?',
    why: 'Some substances can cause feelings or experiences that look like other problems.',
  },
  {
    key: 'cannabis_use',
    text: 'Do you use cannabis — bhang, ganja or charas?',
    why: 'Cannabis can affect mood and, in some people, cause unusual experiences.',
  },
  {
    key: 'medical_illness',
    text: 'Do you have a long-term health problem, like thyroid, diabetes, heart, or another illness?',
    why: 'Some body illnesses can cause tiredness, low mood or worry, so a doctor may want to check them.',
  },
  {
    key: 'new_medicine',
    text: 'Did you start or change any medicine shortly before this began?',
    why: 'Some medicines can affect mood, sleep or energy as a side effect.',
  },
  {
    key: 'family_history',
    text: 'Has anyone in your close family had a mental health problem?',
    why: 'Some conditions run in families, which can make them a little more likely.',
  },
  {
    key: 'past_episode',
    text: 'Have you felt like this before, at an earlier time in your life?',
    why: 'Coming back after a better spell is a useful pattern for a doctor to know.',
  },
  {
    key: 'past_highs',
    text: 'Have you ever had a time when you felt unusually high, energetic or needed very little sleep?',
    why: 'Past highs can change what kind of help is safest for low mood.',
  },
  {
    key: 'body_symptoms_checked_normal',
    text: 'Has a doctor checked your body symptoms and found nothing wrong?',
    why: 'When tests are normal, stress or mood can sometimes be behind body symptoms — and that is real, too.',
  },
  {
    key: 'age_over_60',
    text: 'Are you 60 or older?',
    why: 'Some changes, like memory problems, are more common later in life.',
    onlyIf: 'adult',
  },
  {
    key: 'memory_worse',
    text: 'Have you or your family noticed your memory getting worse?',
    why: 'Memory changes can have many causes, and some of them can be treated.',
    onlyIf: 'adult',
  },
];
