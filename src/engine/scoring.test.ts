import { describe, expect, it } from 'vitest';
import { rankConditions } from './scoring';
import { ALL, makeState } from './fixtures.test-helpers';

const top = (r: ReturnType<typeof rankConditions>) => r[0].condition.id;

describe('rankConditions', () => {
  it('moves the condition with hallmark answers to the top', () => {
    const r = rankConditions(
      makeState({ areas: ['hands'], answers: { itchy: 'yes', itch_worse_night: 'yes', family_also_itchy: 'yes' } }),
      ALL,
    );
    expect(top(r)).toBe('scabies');

    const p = rankConditions(
      makeState({ areas: ['elbows'], answers: { thick_silvery_scale: 'yes', raised_plaques: 'yes' } }),
      ALL,
    );
    expect(top(p)).toBe('psoriasis');
  });

  it('demotes conditions with no site overlap', () => {
    const r = rankConditions(makeState({ areas: ['scalp'], answers: { itchy: 'yes' } }), ALL);
    const ids = r.map((x) => x.condition.id);
    // scabies and ringworm have no scalp site
    expect(ids.indexOf('alopecia')).toBeLessThan(ids.indexOf('scabies'));
    expect(ids.indexOf('psoriasis')).toBeLessThan(ids.indexOf('ringworm'));
    const sc = r.find((x) => x.condition.id === 'scabies')!;
    expect(sc.band).toBe('less_likely');
  });

  it('never shows 100% and keeps matches in 0..1, top first', () => {
    const r = rankConditions(
      makeState({ areas: ['groin'], answers: { ring_shaped_clear_centre: 'yes', itchy: 'yes', scaly_flaky: 'yes', used_steroid_cream: 'yes', shared_towels_sport: 'yes' } }),
      ALL,
    );
    expect(r[0].match).toBeLessThanOrEqual(0.92);
    for (let i = 1; i < r.length; i++) {
      expect(r[i].score).toBeLessThanOrEqual(r[i - 1].score);
      expect(r[i].match).toBeGreaterThanOrEqual(0);
    }
  });

  it('band strong needs ≥2 positive hits; one hit is at most possible', () => {
    const one = rankConditions(makeState({ areas: ['groin'], answers: { ring_shaped_clear_centre: 'yes' } }), ALL);
    expect(one[0].condition.id).toBe('ringworm');
    expect(one[0].band).not.toBe('strong');

    const many = rankConditions(
      makeState({ areas: ['groin'], answers: { ring_shaped_clear_centre: 'yes', itchy: 'yes', scaly_flaky: 'yes' } }),
      ALL,
    );
    expect(many[0].condition.id).toBe('ringworm');
    expect(many[0].band).toBe('strong');
    expect(many[many.length - 1].band).toBe('less_likely');
  });

  it('nothing answered → top is only possible', () => {
    const r = rankConditions(makeState(), ALL);
    expect(r[0].band).toBe('possible');
  });

  it("'no' to a hallmark lowers the score", () => {
    const base = rankConditions(makeState({ areas: ['hands'] }), ALL).find((x) => x.condition.id === 'scabies')!;
    const no = rankConditions(makeState({ areas: ['hands'], answers: { burrows: 'no' } }), ALL).find(
      (x) => x.condition.id === 'scabies',
    )!;
    expect(no.score).toBeCloseTo(base.score - 3 * 0.7);
    expect(no.againstBecause).toContain('no tiny wavy lines (burrows)');
  });

  it('builds explanations', () => {
    const r = rankConditions(
      makeState({ areas: ['hands'], answers: { itchy: 'yes', itch_worse_night: 'yes', thick_silvery_scale: 'yes' } }),
      ALL,
    );
    const sc = r.find((x) => x.condition.id === 'scabies')!;
    expect(sc.fitsBecause[0]).toBe('itch worse at night');
    // 'itchy' is covered by the more specific 'itch worse at night'.
    expect(sc.fitsBecause).not.toContain('itchy');
    expect(sc.fitsBecause).toContain('a usual place for it: hands / palms');
    expect(sc.againstBecause).toContain('you said: thick silvery-white scale');
    expect(sc.confirmWith).toEqual(['others at home are itchy too', 'tiny wavy lines (burrows)']);
  });

  it('joins matching sites into one line', () => {
    const r = rankConditions(makeState({ areas: ['hands', 'abdomen'], answers: { itchy: 'yes' } }), ALL);
    const sc = r.find((x) => x.condition.id === 'scabies')!;
    const siteLines = sc.fitsBecause.filter((x) => x.startsWith('a usual place for it: '));
    expect(siteLines).toHaveLength(1);
    expect(siteLines[0]).toMatch(/^a usual place for it: [^:]+, [^:]+$/);
    expect(sc.fitsBecause).toContain('itchy');
  });

  it('is stable for ties and handles empty input', () => {
    expect(rankConditions(makeState(), [])).toEqual([]);
    const a = { ...ALL[0], id: 'a', evidence: {}, sites: {} };
    const b = { ...ALL[0], id: 'b', evidence: {}, sites: {} };
    expect(rankConditions(makeState(), [a, b]).map((x) => x.condition.id)).toEqual(['a', 'b']);
  });
});
