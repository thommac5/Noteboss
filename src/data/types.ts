export type Aisle =
  | 'Produce'
  | 'Meat & Fish'
  | 'Dairy & Eggs'
  | 'Bakery'
  | 'Pasta, Rice & Grains'
  | 'Canned & Jarred'
  | 'Frozen'
  | 'Pantry'
  | 'Snacks & Supplements';

export const AISLE_ORDER: Aisle[] = [
  'Produce',
  'Meat & Fish',
  'Dairy & Eggs',
  'Bakery',
  'Pasta, Rice & Grains',
  'Canned & Jarred',
  'Frozen',
  'Pantry',
  'Snacks & Supplements',
];

export type Allergen = 'shellfish';

export interface Ingredient {
  id: string;
  name: string;
  aisle: Aisle;
  /** 'g' = weighed (nutrition per 100 g), 'each' = counted (nutrition per item). */
  unit: 'g' | 'each';
  /** Singular label for counted items, e.g. "egg", "clove". */
  each?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** What you actually buy at the store. size is in grams or item count. */
  pack: { size: number; label: string; price: number };
  allergens?: Allergen[];
  /** Pantry staple most people already have – starts checked as "have it". */
  staple?: boolean;
}

export type MealType = 'breakfast' | 'main' | 'snack';
export type Equipment = 'stove' | 'oven' | 'air fryer' | 'rice cooker' | 'microwave' | 'blender' | 'no cook';

export interface RecipeIngredient {
  id: string;
  /** Per serving, in grams or item count depending on the ingredient unit. */
  qty: number;
  note?: string;
}

export interface SwapOption {
  id: string;
  qty: number;
  tip?: string;
}

export interface ProteinSwap {
  /** Ingredient id being replaced (e.g. shrimp). */
  from: string;
  options: SwapOption[];
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  meal: MealType;
  cuisine: string;
  description: string;
  minutes: number;
  equipment: Equipment[];
  /** Suggested batch size for Sunday prep. */
  batch: number;
  fridgeDays: number;
  freezes: boolean;
  ingredients: RecipeIngredient[];
  steps: string[];
  swap?: ProteinSwap;
  boosters: string[];
}

export interface Macros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}
