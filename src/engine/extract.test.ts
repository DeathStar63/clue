import { describe, expect, it } from 'vitest';
import { extractAreas, extractFeatures, parseDurationDays } from './extract';

describe('extractFeatures', () => {
  it('maps casual phrasing', () => {
    expect(extractFeatures('Pimples on my face')).toEqual(expect.arrayContaining(['pustules', 'small_bumps']));
    expect(extractFeatures('bahut khujli hai')).toContain('itchy');
    expect(extractFeatures('itchy dandruff')).toEqual(expect.arrayContaining(['itchy', 'dandruff_flakes', 'scalp_itch']));
    expect(extractFeatures('round bald patch on head')).toContain('patchy_hair_loss_smooth');
    expect(extractFeatures('white patches on arms')).toContain('lighter_patches');
    expect(extractFeatures('red ring on my thigh')).toEqual(expect.arrayContaining(['red_inflamed', 'ring_shaped_clear_centre']));
    expect(extractFeatures('small water bubbles on fingers')).toContain('blisters');
    expect(extractFeatures('dark spots and pigmentation')).toContain('dark_patches');
    expect(extractFeatures('scaly and peeling skin, it hurts')).toEqual(expect.arrayContaining(['scaly_flaky', 'painful_tender']));
    expect(extractFeatures('hives that comes and goes')).toEqual(expect.arrayContaining(['hives', 'comes_and_goes']));
  });

  it('chooses sudden_shedding only with heavy-shedding words', () => {
    expect(extractFeatures('hair fall')).toContain('diffuse_thinning');
    expect(extractFeatures('hair fall')).not.toContain('sudden_shedding');
    expect(extractFeatures('hairfall suddenly, handfuls in the shower')).toContain('sudden_shedding');
  });

  it('night only counts with itch words', () => {
    expect(extractFeatures('itching worse at night')).toContain('itch_worse_night');
    expect(extractFeatures('red spots appear at night')).not.toContain('itch_worse_night');
  });

  it('respects negation within 3 words', () => {
    expect(extractFeatures('no itch')).not.toContain('itchy');
    expect(extractFeatures('not itchy at all')).not.toContain('itchy');
    expect(extractFeatures("it doesn't itch")).not.toContain('itchy');
    expect(extractFeatures('it doesn’t itch but is painful')).toEqual(['painful_tender']);
    expect(extractFeatures('no pain, very itchy')).toEqual(['itchy']);
    // negator far away does not count
    expect(extractFeatures('no idea why but now it is itchy')).toContain('itchy');
  });

  it('parses durations', () => {
    expect(extractFeatures('since 3 days')).toContain('duration_under_2w');
    expect(extractFeatures('for 2 weeks')).toContain('duration_2_to_6w');
    expect(extractFeatures('about a month')).toContain('duration_2_to_6w');
    expect(extractFeatures('for 2 months')).toContain('duration_over_6w');
    expect(extractFeatures('since months')).toContain('duration_over_6w');
    expect(extractFeatures('for years')).toContain('duration_over_6w');
    expect(parseDurationDays('a few days')).toBe(3);
    expect(parseDurationDays('apply twice a day')).toBeNull();
    expect(parseDurationDays('itchy')).toBeNull();
  });
});

describe('extractAreas', () => {
  it('maps body words', () => {
    expect(extractAreas('rash on my cheek and forehead')).toEqual(['face']);
    expect(extractAreas('hair fall')).toEqual(['scalp']);
    expect(extractAreas('yellow nails')).toEqual(['fingernails']);
    expect(extractAreas('thick toe nail')).toEqual(['toenails']);
    expect(extractAreas('itching between toes')).toEqual(['toe_webs']);
    expect(extractAreas('itchy groin and inner thigh')).toEqual(['groin']);
    expect(extractAreas('spots on back and chest')).toEqual(expect.arrayContaining(['back', 'chest']));
    expect(extractAreas('it keeps coming back')).toEqual([]);
    expect(extractAreas('palm and fingers')).toEqual(['hands']);
    expect(extractAreas('elbows and knees')).toEqual(['elbows', 'knees']);
    expect(extractAreas('dry legs and shin')).toEqual(['shins']);
    expect(extractAreas('lips cracked')).toEqual(['mouth']);
    expect(extractAreas('patch in my beard')).toEqual(['eyebrows_beard']);
    expect(extractAreas('dark underarms')).toEqual(['armpits']);
    expect(extractAreas('rash on tummy')).toEqual(['abdomen']);
    expect(extractAreas('itching in private parts')).toEqual(['genitals']);
    expect(extractAreas('boils on butt')).toEqual(['buttocks']);
    expect(extractAreas('cracked soles of feet')).toEqual(['feet']);
  });

  it('pimples alone imply the face', () => {
    expect(extractAreas('so many pimples')).toEqual(['face']);
    expect(extractAreas('pimples on my back')).toEqual(['back']);
  });
});
