import type { UrgencyLevel } from '../types';

export const URGENCY_INFO: Record<UrgencyLevel, { title: string; short: string; color: string }> = {
  self_care: {
    title: 'Look after it at home',
    short: 'This usually gets better with simple care at home.',
    color: '#34C759',
  },
  routine: {
    title: 'See a doctor when convenient',
    short: 'It is worth getting checked, but there is no rush.',
    color: '#5A9CFF',
  },
  soon: {
    title: 'See a doctor within a few days',
    short: 'Book an appointment in the next few days.',
    color: '#FECC00',
  },
  today: {
    title: 'See a doctor today',
    short: 'Try to see a doctor or urgent care clinic today.',
    color: '#FF8947',
  },
  emergency: {
    title: 'Get emergency help now',
    short: 'Call your local emergency number or go to the nearest emergency department now.',
    color: '#FF453A',
  },
};

export const URGENCY_ORDER: UrgencyLevel[] = ['self_care', 'routine', 'soon', 'today', 'emergency'];
