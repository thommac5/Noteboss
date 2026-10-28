import { ingredient } from '../data/ingredients';
import { RECIPE_BY_ID } from '../data/recipes';
import { AISLE_ORDER, type Aisle, type Ingredient } from '../data/types';
import { effectiveIngredients, plural } from './nutrition';
import type { Batch } from './plan';

export interface GroceryItem {
  ingredient: Ingredient;
  /** Total needed for the week, in grams or count. */
  needed: number;
  /** Packages to buy, rounded up. */
  packs: number;
  cost: number;
  usedFor: string[];
}

export interface GrocerySection {
  aisle: Aisle;
  items: GroceryItem[];
}

export function groceryItems(batches: Batch[]): GroceryItem[] {
  const map = new Map<string, { needed: number; usedFor: Set<string> }>();
  for (const batch of batches) {
    const recipe = RECIPE_BY_ID[batch.recipeId];
    if (!recipe || batch.servings <= 0) continue;
    for (const ri of effectiveIngredients(recipe, batch.swapTo)) {
      const entry = map.get(ri.id) ?? { needed: 0, usedFor: new Set<string>() };
      entry.needed += ri.qty * batch.servings;
      entry.usedFor.add(recipe.name);
      map.set(ri.id, entry);
    }
  }
  return [...map.entries()].map(([id, { needed, usedFor }]) => {
    const ing = ingredient(id);
    // Small epsilon so 3 × ⅓ avocado doesn't round up to 2 avocados.
    const packs = Math.max(1, Math.ceil(needed / ing.pack.size - 0.02));
    return { ingredient: ing, needed, packs, cost: packs * ing.pack.price, usedFor: [...usedFor] };
  });
}

export function groupByAisle(items: GroceryItem[]): GrocerySection[] {
  return AISLE_ORDER.map((aisle) => ({
    aisle,
    items: items.filter((i) => i.ingredient.aisle === aisle).sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name)),
  })).filter((s) => s.items.length > 0);
}

/** "2 × 454 g pack" or "3 bananas" for items sold individually. */
export function buyLabel(item: GroceryItem): string {
  const { pack, unit, each } = item.ingredient;
  if (unit === 'each' && pack.size === 1) return `${item.packs} ${item.packs > 1 ? plural(each ?? 'item') : each}`;
  return `${item.packs} × ${pack.label}`;
}
