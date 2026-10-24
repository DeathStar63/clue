import type { Helpline } from './types';

// Recheck every 3 months. Do NOT add KIRAN (1800-599-0019): merged into Tele-MANAS in Feb 2024.
export const HELPLINES_CHECKED = '23 Oct 2026';

export const EMERGENCY: Helpline = {
  name: 'Emergency',
  number: '112',
  tel: '112',
  hours: '24×7',
  note: 'Police, ambulance, fire — anywhere in India.',
};

export const HELPLINES: Helpline[] = [
  {
    name: 'Tele-MANAS (Government of India)',
    number: '14416',
    tel: '14416',
    hours: '24×7, free, 20 languages',
    note: 'Also 1-800-891-4416. Trained counsellors; can connect you to a psychiatrist.',
  },
  EMERGENCY,
  {
    name: 'AASRA',
    number: '+91 22 2754 6669',
    tel: '+912227546669',
    hours: '24×7, English and Hindi',
  },
  {
    name: 'iCall (TISS)',
    number: '9152987821',
    tel: '9152987821',
    hours: 'Mon–Sat, 8 am–10 pm',
    note: 'Free counselling by trained professionals. Email icall@tiss.edu.',
  },
];
