import { ingredient } from '../data/ingredients';
import type { Macros, Recipe, RecipeIngredient } from '../data/types';

export const ZERO: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function addMacros(a: Macros, b: Macros, times = 1): Macros {
  return {
    kcal: a.kcal + b.kcal * times,
    protein: a.protein + b.protein * times,
    carbs: a.carbs + b.carbs * times,
    fat: a.fat + b.fat * times,
  };
}

/** Recipe ingredients (per serving) with the chosen protein swap applied. */
export function effectiveIngredients(recipe: Recipe, swapTo?: string): RecipeIngredient[] {
  if (!recipe.swap || !swapTo || swapTo === recipe.swap.from) return recipe.ingredients;
  const option = recipe.swap.options.find((o) => o.id === swapTo);
  if (!option) return recipe.ingredients;
  return recipe.ingredients.map((ri) => (ri.id === recipe.swap!.from ? { id: option.id, qty: option.qty, note: ri.note } : ri));
}

/** How much of the package-price a quantity of an ingredient represents. */
function factor(id: string, qty: number): number {
  return ingredient(id).unit === 'g' ? qty / 100 : qty;
}

export function ingredientMacros(id: string, qty: number): Macros {
  const ing = ingredient(id);
  const f = factor(id, qty);
  return { kcal: ing.kcal * f, protein: ing.protein * f, carbs: ing.carbs * f, fat: ing.fat * f };
}

export function servingMacros(recipe: Recipe, swapTo?: string): Macros {
  return effectiveIngredients(recipe, swapTo).reduce((m, ri) => addMacros(m, ingredientMacros(ri.id, ri.qty)), ZERO);
}

/** Cost of the ingredients actually used in one serving (CAD). */
export function servingCost(recipe: Recipe, swapTo?: string): number {
  return effectiveIngredients(recipe, swapTo).reduce((sum, ri) => {
    const ing = ingredient(ri.id);
    return sum + (ri.qty / ing.pack.size) * ing.pack.price;
  }, 0);
}

export function hasShellfish(recipe: Recipe, swapTo?: string): boolean {
  return effectiveIngredients(recipe, swapTo).some((ri) => ingredient(ri.id).allergens?.includes('shellfish'));
}

/** Default swap for a recipe: the first safe option, since shellfish is an allergy. */
export function defaultSwap(recipe: Recipe): string | undefined {
  return recipe.swap?.options[0]?.id;
}

const LIQUIDS = new Set(['milk', 'broth', 'egg_whites']);

/** Human-friendly amount, e.g. "640 g", "1.2 kg", "350 mL", "½ onion", "3 eggs". */
export function formatQty(id: string, qty: number): string {
  const ing = ingredient(id);
  if (ing.unit === 'g') {
    const liquid = LIQUIDS.has(id);
    if (qty >= 1000) return `${trim(qty / 1000, 2)} ${liquid ? 'L' : 'kg'}`;
    return `${Math.round(qty)} ${liquid ? 'mL' : 'g'}`;
  }
  const label = ing.each ?? 'item';
  return `${fraction(qty)} ${qty > 1 ? plural(label) : label}`;
}

export function plural(word: string): string {
  if (/(ch|sh)$/.test(word)) return `${word}es`;
  return `${word}s`;
}

function trim(n: number, digits: number): string {
  return Number(n.toFixed(digits)).toString();
}

/** 0.25 → "¼", 1.5 → "1½", 2.33 → "2⅓" */
export function fraction(n: number): string {
  const whole = Math.floor(n + 1e-9);
  const rest = n - whole;
  const glyphs: [number, string][] = [
    [0, ''],
    [0.25, '¼'],
    [0.33, '⅓'],
    [0.5, '½'],
    [0.66, '⅔'],
    [0.75, '¾'],
    [1, ''],
  ];
  let best = glyphs[0];
  for (const g of glyphs) if (Math.abs(rest - g[0]) < Math.abs(rest - best[0])) best = g;
  const w = best[0] === 1 ? whole + 1 : whole;
  if (!best[1]) return String(w);
  return w === 0 ? best[1] : `${w}${best[1]}`;
}

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}
