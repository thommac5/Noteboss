import { RECIPE_BY_ID, RECIPES } from '../data/recipes';
import type { Macros, MealType, Recipe } from '../data/types';
import { addMacros, defaultSwap, servingMacros, ZERO } from './nutrition';

export type Slot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export const SLOTS: Slot[] = ['breakfast', 'lunch', 'dinner', 'snack'];
export const SLOT_LABEL: Record<Slot, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snacks' };
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** A recipe you're cooking this week, and how many servings of it. */
export interface Batch {
  id: string;
  recipeId: string;
  servings: number;
  swapTo?: string;
}

export interface Plan {
  weekStart: string; // ISO date of the Monday
  batches: Batch[];
  /** key `${day}-${slot}` → batch ids eaten in that slot (snacks can hold several). */
  slots: Record<string, string[]>;
}

export const slotKey = (day: number, slot: Slot) => `${day}-${slot}`;

export function slotMeal(slot: Slot): MealType {
  return slot === 'lunch' || slot === 'dinner' ? 'main' : slot;
}

/** Monday of the week being planned: tomorrow if today is Sunday, otherwise this week's Monday. */
export function planningMonday(today = new Date()): string {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dow = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() + (dow === 0 ? 1 : 1 - dow));
  return toIso(d);
}

export function toIso(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function dayDate(weekStart: string, day: number): Date {
  const [y, m, d] = weekStart.split('-').map(Number);
  return new Date(y, m - 1, d + day);
}

export function emptyPlan(today = new Date()): Plan {
  return { weekStart: planningMonday(today), batches: [], slots: {} };
}

let counter = 0;
export function newBatch(recipe: Recipe, servings = recipe.batch): Batch {
  counter += 1;
  return { id: `b${Date.now().toString(36)}${counter}`, recipeId: recipe.id, servings, swapTo: defaultSwap(recipe) };
}

export function assignedCount(plan: Plan, batchId: string): number {
  return Object.values(plan.slots).reduce((n, ids) => n + ids.filter((id) => id === batchId).length, 0);
}

export function remaining(plan: Plan, batch: Batch): number {
  return batch.servings - assignedCount(plan, batch.id);
}

export function batchMacros(batch: Batch): Macros {
  return servingMacros(RECIPE_BY_ID[batch.recipeId], batch.swapTo);
}

export function dayMacros(plan: Plan, day: number): Macros {
  const byId = new Map(plan.batches.map((b) => [b.id, b]));
  let total = ZERO;
  for (const slot of SLOTS) {
    for (const id of plan.slots[slotKey(day, slot)] ?? []) {
      const b = byId.get(id);
      if (b) total = addMacros(total, batchMacros(b));
    }
  }
  return total;
}

/** Add a serving to a slot; if the batch is fully assigned, cook one more serving. */
export function assign(plan: Plan, day: number, slot: Slot, batchId: string): Plan {
  const key = slotKey(day, slot);
  const current = plan.slots[key] ?? [];
  const slots = { ...plan.slots, [key]: slot === 'snack' ? [...current, batchId] : [batchId] };
  const next = { ...plan, slots };
  return {
    ...next,
    batches: next.batches.map((b) => (b.id === batchId && assignedCount(next, b.id) > b.servings ? { ...b, servings: assignedCount(next, b.id) } : b)),
  };
}

export function unassign(plan: Plan, day: number, slot: Slot, index: number): Plan {
  const key = slotKey(day, slot);
  const ids = [...(plan.slots[key] ?? [])];
  ids.splice(index, 1);
  return { ...plan, slots: { ...plan.slots, [key]: ids } };
}

export function removeBatch(plan: Plan, batchId: string): Plan {
  const slots = Object.fromEntries(Object.entries(plan.slots).map(([k, ids]) => [k, ids.filter((id) => id !== batchId)]));
  return { ...plan, batches: plan.batches.filter((b) => b.id !== batchId), slots };
}

/** Lowering servings below what's assigned frees the latest assignments. */
export function setServings(plan: Plan, batchId: string, servings: number): Plan {
  const target = Math.max(1, Math.round(servings));
  let next: Plan = { ...plan, batches: plan.batches.map((b) => (b.id === batchId ? { ...b, servings: target } : b)) };
  let over = assignedCount(next, batchId) - target;
  for (let day = 6; day >= 0 && over > 0; day--) {
    for (let s = SLOTS.length - 1; s >= 0 && over > 0; s--) {
      const key = slotKey(day, SLOTS[s]);
      const ids = next.slots[key] ?? [];
      const idx = ids.lastIndexOf(batchId);
      if (idx >= 0) {
        next = unassign(next, day, SLOTS[s], idx);
        over--;
        s++; // re-check this slot (snacks may hold several)
      }
    }
  }
  return next;
}

/**
 * Spread unassigned servings into empty slots. Mains alternate between batches
 * so lunch and dinner on the same day aren't the same meal when possible.
 */
export function autoFill(plan: Plan): Plan {
  let next = plan;
  const left = new Map(plan.batches.map((b) => [b.id, remaining(plan, b)]));
  const ofMeal = (meal: MealType) => next.batches.filter((b) => RECIPE_BY_ID[b.recipeId].meal === meal);

  for (let day = 0; day < 7; day++) {
    for (const slot of ['breakfast', 'lunch', 'dinner'] as Slot[]) {
      if ((next.slots[slotKey(day, slot)] ?? []).length) continue;
      const avoid = slot === 'dinner' ? next.slots[slotKey(day, 'lunch')]?.[0] : undefined;
      const candidates = ofMeal(slotMeal(slot))
        .filter((b) => (left.get(b.id) ?? 0) > 0)
        .sort((a, b) => (left.get(b.id) ?? 0) - (left.get(a.id) ?? 0));
      const pick = candidates.find((b) => b.id !== avoid) ?? candidates[0];
      if (pick) {
        next = { ...next, slots: { ...next.slots, [slotKey(day, slot)]: [pick.id] } };
        left.set(pick.id, (left.get(pick.id) ?? 0) - 1);
      }
    }
    for (const b of ofMeal('snack')) {
      if ((left.get(b.id) ?? 0) <= 0) continue;
      const key = slotKey(day, 'snack');
      next = { ...next, slots: { ...next.slots, [key]: [...(next.slots[key] ?? []), b.id] } };
      left.set(b.id, (left.get(b.id) ?? 0) - 1);
    }
  }
  return next;
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a whole week: 3 batch-cooked mains (at least one Italian) for 14
 * lunches/dinners, 2 breakfasts, and enough snacks to get near the calorie target.
 */
export function generateWeek(weekStart: string, targetKcal: number, rand: () => number = Math.random): Plan {
  const by = (meal: MealType) => shuffle(RECIPES.filter((r) => r.meal === meal), rand);
  const mains = by('main');
  const italian = mains.find((r) => r.cuisine === 'Italian')!;
  const others = mains.filter((r) => r.id !== italian.id && r.cuisine !== italian.cuisine);
  const chosenMains = [italian, others[0], others.find((r) => r.cuisine !== others[0].cuisine) ?? others[1]];

  const breakfasts = by('breakfast').slice(0, 2);
  const batches: Batch[] = [
    newBatch(chosenMains[0], 5),
    newBatch(chosenMains[1], 5),
    newBatch(chosenMains[2], 4),
    newBatch(breakfasts[0], 4),
    newBatch(breakfasts[1], 3),
  ];

  const snacks = by('snack');
  const base = batches.reduce((sum, b) => sum + batchMacros(b).kcal * b.servings, 0) / 7;
  let daily = base;
  for (const snack of snacks.slice(0, 3)) {
    if (daily >= targetKcal - 150) break;
    const s = newBatch(snack, 7);
    batches.push(s);
    daily += batchMacros(s).kcal;
  }

  return autoFill({ weekStart, batches, slots: {} });
}
