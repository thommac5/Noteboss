import { describe, expect, it } from 'vitest';
import { INGREDIENTS } from '../../data/ingredients';
import { RECIPE_BY_ID, RECIPES } from '../../data/recipes';
import { calcTargets, DEFAULT_PROFILE, weeklyTrend } from '../goals';
import { buyLabel, groceryItems } from '../grocery';
import { fraction, hasShellfish, servingMacros } from '../nutrition';
import { assign, autoFill, dayMacros, emptyPlan, generateWeek, newBatch, planningMonday, remaining, setServings, slotKey, SLOTS } from '../plan';

describe('recipe data', () => {
  it('only references known ingredients', () => {
    for (const r of RECIPES) {
      for (const ri of r.ingredients) expect(INGREDIENTS[ri.id], `${r.id} → ${ri.id}`).toBeDefined();
      for (const o of r.swap?.options ?? []) expect(INGREDIENTS[o.id]).toBeDefined();
    }
  });

  it('has unique ids', () => {
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });

  it('keeps every lunch/dinner high-calorie, high-protein and ≤ 30 min', () => {
    for (const r of RECIPES.filter((r) => r.meal === 'main')) {
      const m = servingMacros(r, r.swap?.options[0].id);
      expect(m.kcal, r.name).toBeGreaterThanOrEqual(640);
      expect(m.protein, r.name).toBeGreaterThanOrEqual(40);
      expect(r.minutes, r.name).toBeLessThanOrEqual(30);
    }
  });

  it('gives every shellfish recipe a swap that removes the shellfish', () => {
    for (const r of RECIPES) {
      if (!hasShellfish(r)) continue;
      expect(r.swap, r.name).toBeDefined();
      for (const o of r.swap!.options) expect(hasShellfish(r, o.id), `${r.name} with ${o.id}`).toBe(false);
    }
  });
});

describe('grocery list', () => {
  it('scales with servings and combines ingredients across recipes', () => {
    const a = { ...newBatch(RECIPE_BY_ID['tuscan-chicken-pasta'], 4) };
    const b = { ...newBatch(RECIPE_BY_ID['chicken-caesar-wraps'], 2) };
    const chicken = groceryItems([a, b]).find((i) => i.ingredient.id === 'chicken_breast')!;
    expect(chicken.needed).toBe(170 * 4 + 200 * 2);
    expect(chicken.packs).toBe(2); // 1080 g → two 1 kg packs
    expect(chicken.usedFor).toHaveLength(2);
  });

  it('uses the swap protein instead of shrimp', () => {
    const batch = newBatch(RECIPE_BY_ID['shrimp-scampi'], 3);
    const ids = groceryItems([batch]).map((i) => i.ingredient.id);
    expect(ids).not.toContain('shrimp');
    expect(ids).toContain(batch.swapTo);
  });

  it('labels loose produce by count', () => {
    const items = groceryItems([newBatch(RECIPE_BY_ID['pb-banana-smoothie'], 7)]);
    expect(buyLabel(items.find((i) => i.ingredient.id === 'banana')!)).toBe('7 bananas');
  });

  it("doesn't over-buy from fractional rounding", () => {
    const items = groceryItems([newBatch(RECIPE_BY_ID['chicken-burrito-bowl'], 3)]);
    expect(items.find((i) => i.ingredient.id === 'avocado')!.packs).toBe(1);
  });
});

describe('planner', () => {
  it('plans on Sunday for the next Monday', () => {
    expect(planningMonday(new Date(2026, 10, 1))).toBe('2026-11-02'); // Sunday
    expect(planningMonday(new Date(2026, 9, 28))).toBe('2026-10-26'); // Wednesday
  });

  it('auto-fills lunches and dinners without exceeding servings', () => {
    const a = newBatch(RECIPE_BY_ID['beef-bolognese'], 7);
    const b = newBatch(RECIPE_BY_ID['chicken-burrito-bowl'], 7);
    const plan = autoFill({ ...emptyPlan(), batches: [a, b] });
    expect(remaining(plan, a)).toBe(0);
    expect(remaining(plan, b)).toBe(0);
    for (let d = 0; d < 7; d++) expect(plan.slots[slotKey(d, 'lunch')]).not.toEqual(plan.slots[slotKey(d, 'dinner')]);
  });

  it('cooks one more serving when you assign past the batch size', () => {
    const a = newBatch(RECIPE_BY_ID['beef-bolognese'], 1);
    let plan = { ...emptyPlan(), batches: [a] };
    plan = assign(plan, 0, 'lunch', a.id);
    plan = assign(plan, 0, 'dinner', a.id);
    expect(plan.batches[0].servings).toBe(2);
  });

  it('frees placed servings when you lower the batch size', () => {
    const a = newBatch(RECIPE_BY_ID['beef-bolognese'], 5);
    let plan = autoFill({ ...emptyPlan(), batches: [a] });
    plan = setServings(plan, a.id, 2);
    const placed = Object.values(plan.slots).flat().length;
    expect(placed).toBe(2);
  });

  it('generates a full week near the calorie target', () => {
    const target = calcTargets(DEFAULT_PROFILE).kcal;
    const plan = generateWeek('2026-11-02', target, mulberry(42));
    for (let d = 0; d < 7; d++) {
      for (const slot of SLOTS.slice(0, 3)) expect(plan.slots[slotKey(d, slot)]?.length, `${d} ${slot}`).toBe(1);
      expect(dayMacros(plan, d).kcal).toBeGreaterThan(target * 0.8);
    }
  });
});

describe('goals', () => {
  it('calculates a lean-bulk target for the default profile', () => {
    const t = calcTargets(DEFAULT_PROFILE);
    expect(t.maintenance).toBeGreaterThan(2500);
    expect(t.maintenance).toBeLessThan(2900);
    expect(t.kcal - t.maintenance).toBeGreaterThan(200);
    expect(t.protein).toBe(155);
    expect(t.weeksToGoal).toBe(60);
  });

  it('respects custom overrides', () => {
    const t = calcTargets({ ...DEFAULT_PROFILE, customKcal: 3200, customProtein: 180 });
    expect(t.kcal).toBe(3200);
    expect(t.protein).toBe(180);
  });

  it('needs two weeks of weigh-ins for a trend', () => {
    expect(weeklyTrend([{ date: '2026-11-01', lb: 155 }, { date: '2026-11-08', lb: 156 }])).toBeNull();
    expect(weeklyTrend([{ date: '2026-11-01', lb: 155 }, { date: '2026-11-15', lb: 156 }])).toBeCloseTo(0.5);
  });
});

it('formats fractions', () => {
  expect(fraction(0.25)).toBe('¼');
  expect(fraction(1.5)).toBe('1½');
  expect(fraction(1.32)).toBe('1⅓');
  expect(fraction(3)).toBe('3');
});

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
