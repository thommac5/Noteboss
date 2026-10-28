import type { Ingredient } from './types';

/**
 * Nutrition: per 100 g for weighed items, per item for counted items.
 * Prices: approximate regular (non-sale) shelf prices at Save-On-Foods in
 * British Columbia, in CAD. Close enough to budget with – sales will beat them.
 */
const list: Ingredient[] = [
  // Meat & Fish
  { id: 'chicken_breast', name: 'Chicken breast, boneless skinless', aisle: 'Meat & Fish', unit: 'g', kcal: 120, protein: 22.5, carbs: 0, fat: 2.6, pack: { size: 1000, label: '1 kg value pack', price: 16.5 } },
  { id: 'chicken_thigh', name: 'Chicken thighs, boneless skinless', aisle: 'Meat & Fish', unit: 'g', kcal: 150, protein: 18, carbs: 0, fat: 8.5, pack: { size: 1000, label: '1 kg value pack', price: 14.5 } },
  { id: 'ground_beef', name: 'Lean ground beef', aisle: 'Meat & Fish', unit: 'g', kcal: 215, protein: 18.6, carbs: 0, fat: 15, pack: { size: 454, label: '454 g pack', price: 9.49 } },
  { id: 'ground_turkey', name: 'Lean ground turkey', aisle: 'Meat & Fish', unit: 'g', kcal: 150, protein: 18.7, carbs: 0, fat: 8.3, pack: { size: 454, label: '454 g pack', price: 8.99 } },
  { id: 'italian_sausage', name: 'Mild Italian sausage', aisle: 'Meat & Fish', unit: 'g', kcal: 300, protein: 15, carbs: 2, fat: 26, pack: { size: 450, label: '450 g pack (5 links)', price: 8.49 } },
  { id: 'sirloin', name: 'Top sirloin steak', aisle: 'Meat & Fish', unit: 'g', kcal: 160, protein: 21, carbs: 0, fat: 8, pack: { size: 454, label: '454 g pack', price: 13.99 } },
  { id: 'salmon', name: 'Salmon fillets', aisle: 'Meat & Fish', unit: 'g', kcal: 208, protein: 20, carbs: 0, fat: 13, pack: { size: 454, label: '454 g pack', price: 14.99 } },
  { id: 'cod', name: 'Cod fillets (frozen)', aisle: 'Frozen', unit: 'g', kcal: 82, protein: 18, carbs: 0, fat: 0.7, pack: { size: 454, label: '454 g bag', price: 11.99 } },
  { id: 'shrimp', name: 'Raw shrimp, peeled (frozen)', aisle: 'Frozen', unit: 'g', kcal: 85, protein: 20, carbs: 0, fat: 0.5, pack: { size: 400, label: '400 g bag', price: 12.99 }, allergens: ['shellfish'] },
  { id: 'tuna', name: 'Chunk light tuna in water', aisle: 'Canned & Jarred', unit: 'g', kcal: 116, protein: 26, carbs: 0, fat: 0.8, pack: { size: 120, label: '170 g can (120 g drained)', price: 2.29 } },

  // Dairy & Eggs
  { id: 'eggs', name: 'Large eggs', aisle: 'Dairy & Eggs', unit: 'each', each: 'egg', kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8, pack: { size: 12, label: 'dozen', price: 5.29 } },
  { id: 'egg_whites', name: 'Liquid egg whites', aisle: 'Dairy & Eggs', unit: 'g', kcal: 52, protein: 11, carbs: 0.7, fat: 0.2, pack: { size: 500, label: '500 g carton', price: 4.99 } },
  { id: 'greek_yogurt', name: 'Plain Greek yogurt 2%', aisle: 'Dairy & Eggs', unit: 'g', kcal: 80, protein: 9, carbs: 4, fat: 2.5, pack: { size: 750, label: '750 g tub', price: 7.49 } },
  { id: 'cottage_cheese', name: 'Cottage cheese 2%', aisle: 'Dairy & Eggs', unit: 'g', kcal: 81, protein: 10.5, carbs: 4.8, fat: 2.3, pack: { size: 500, label: '500 g tub', price: 5.49 } },
  { id: 'milk', name: 'Milk 2%', aisle: 'Dairy & Eggs', unit: 'g', kcal: 50, protein: 3.3, carbs: 4.8, fat: 2, pack: { size: 2000, label: '2 L jug', price: 5.49 } },
  { id: 'mozzarella', name: 'Shredded mozzarella', aisle: 'Dairy & Eggs', unit: 'g', kcal: 254, protein: 24, carbs: 2.8, fat: 16, pack: { size: 320, label: '320 g bag', price: 7.99 } },
  { id: 'parmesan', name: 'Grated Parmesan', aisle: 'Dairy & Eggs', unit: 'g', kcal: 431, protein: 38, carbs: 4, fat: 29, pack: { size: 200, label: '200 g tub', price: 7.99 } },
  { id: 'ricotta', name: 'Ricotta (light)', aisle: 'Dairy & Eggs', unit: 'g', kcal: 138, protein: 11.4, carbs: 5.1, fat: 7.9, pack: { size: 475, label: '475 g tub', price: 5.99 } },
  { id: 'cheddar', name: 'Shredded cheddar', aisle: 'Dairy & Eggs', unit: 'g', kcal: 403, protein: 25, carbs: 1.3, fat: 33, pack: { size: 320, label: '320 g bag', price: 7.99 } },
  { id: 'feta', name: 'Crumbled feta', aisle: 'Dairy & Eggs', unit: 'g', kcal: 264, protein: 14, carbs: 4, fat: 21, pack: { size: 200, label: '200 g tub', price: 6.49 } },
  { id: 'cream_cheese', name: 'Cream cheese', aisle: 'Dairy & Eggs', unit: 'g', kcal: 342, protein: 6, carbs: 4, fat: 34, pack: { size: 250, label: '250 g brick', price: 4.49 } },
  { id: 'butter', name: 'Butter', aisle: 'Dairy & Eggs', unit: 'g', kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, pack: { size: 454, label: '454 g block', price: 6.99 } },
  { id: 'cheese_stick', name: 'Mozzarella cheese strings', aisle: 'Dairy & Eggs', unit: 'each', each: 'stick', kcal: 80, protein: 7, carbs: 1, fat: 6, pack: { size: 12, label: '12-pack', price: 8.49 } },

  // Produce
  { id: 'banana', name: 'Bananas', aisle: 'Produce', unit: 'each', each: 'banana', kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, pack: { size: 1, label: 'each', price: 0.35 } },
  { id: 'apple', name: 'Apples', aisle: 'Produce', unit: 'each', each: 'apple', kcal: 95, protein: 0.5, carbs: 25, fat: 0.3, pack: { size: 1, label: 'each', price: 1.0 } },
  { id: 'lemon', name: 'Lemons', aisle: 'Produce', unit: 'each', each: 'lemon', kcal: 17, protein: 0.6, carbs: 5.4, fat: 0.2, pack: { size: 1, label: 'each', price: 0.89 } },
  { id: 'lime', name: 'Limes', aisle: 'Produce', unit: 'each', each: 'lime', kcal: 13, protein: 0.3, carbs: 4.7, fat: 0.1, pack: { size: 1, label: 'each', price: 0.59 } },
  { id: 'avocado', name: 'Avocados', aisle: 'Produce', unit: 'each', each: 'avocado', kcal: 240, protein: 3, carbs: 12.8, fat: 22, pack: { size: 1, label: 'each', price: 1.79 } },
  { id: 'bell_pepper', name: 'Bell peppers', aisle: 'Produce', unit: 'each', each: 'pepper', kcal: 46, protein: 1.5, carbs: 9, fat: 0.4, pack: { size: 1, label: 'each', price: 1.79 } },
  { id: 'onion', name: 'Yellow onions', aisle: 'Produce', unit: 'each', each: 'onion', kcal: 60, protein: 1.6, carbs: 14, fat: 0.2, pack: { size: 1, label: 'each', price: 0.75 } },
  { id: 'garlic', name: 'Garlic', aisle: 'Produce', unit: 'each', each: 'clove', kcal: 4.5, protein: 0.2, carbs: 1, fat: 0, pack: { size: 10, label: 'head (~10 cloves)', price: 0.79 } },
  { id: 'zucchini', name: 'Zucchini', aisle: 'Produce', unit: 'each', each: 'zucchini', kcal: 34, protein: 2.4, carbs: 6.2, fat: 0.6, pack: { size: 1, label: 'each', price: 1.49 } },
  { id: 'cucumber', name: 'English cucumber', aisle: 'Produce', unit: 'each', each: 'cucumber', kcal: 45, protein: 2, carbs: 11, fat: 0.3, pack: { size: 1, label: 'each', price: 1.49 } },
  { id: 'spinach', name: 'Baby spinach', aisle: 'Produce', unit: 'g', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, pack: { size: 312, label: '312 g clamshell', price: 5.99 } },
  { id: 'romaine', name: 'Romaine hearts', aisle: 'Produce', unit: 'g', kcal: 17, protein: 1.2, carbs: 3.3, fat: 0.3, pack: { size: 600, label: '3-pack', price: 4.99 } },
  { id: 'broccoli', name: 'Broccoli crowns', aisle: 'Produce', unit: 'g', kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, pack: { size: 500, label: '~500 g (2 crowns)', price: 3.99 } },
  { id: 'cherry_tomatoes', name: 'Cherry tomatoes', aisle: 'Produce', unit: 'g', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, pack: { size: 340, label: '340 g pint', price: 3.99 } },
  { id: 'mushrooms', name: 'Sliced mushrooms', aisle: 'Produce', unit: 'g', kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, pack: { size: 227, label: '227 g pack', price: 2.99 } },
  { id: 'potatoes', name: 'Baby potatoes', aisle: 'Produce', unit: 'g', kcal: 77, protein: 2, carbs: 17, fat: 0.1, pack: { size: 1360, label: '1.36 kg (3 lb) bag', price: 5.49 } },
  { id: 'sweet_potato', name: 'Sweet potatoes', aisle: 'Produce', unit: 'g', kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, pack: { size: 1000, label: '~1 kg (3 medium)', price: 4.39 } },
  { id: 'carrots', name: 'Baby carrots', aisle: 'Produce', unit: 'g', kcal: 35, protein: 0.6, carbs: 8, fat: 0.1, pack: { size: 907, label: '907 g (2 lb) bag', price: 3.49 } },

  // Bakery
  { id: 'tortilla', name: 'Large flour tortillas (10")', aisle: 'Bakery', unit: 'each', each: 'tortilla', kcal: 210, protein: 6, carbs: 35, fat: 5, pack: { size: 10, label: '10-pack', price: 5.49 } },
  { id: 'english_muffin', name: 'Whole wheat English muffins', aisle: 'Bakery', unit: 'each', each: 'muffin', kcal: 134, protein: 6, carbs: 26, fat: 1.4, pack: { size: 6, label: '6-pack', price: 3.99 } },
  { id: 'bagel', name: 'Plain bagels', aisle: 'Bakery', unit: 'each', each: 'bagel', kcal: 270, protein: 10, carbs: 53, fat: 1.5, pack: { size: 6, label: '6-pack', price: 4.49 } },
  { id: 'bread', name: 'Whole wheat bread', aisle: 'Bakery', unit: 'each', each: 'slice', kcal: 100, protein: 5, carbs: 17, fat: 1.3, pack: { size: 20, label: '675 g loaf', price: 3.99 } },
  { id: 'naan', name: 'Naan bread', aisle: 'Bakery', unit: 'each', each: 'naan', kcal: 260, protein: 8, carbs: 45, fat: 5, pack: { size: 4, label: '4-pack', price: 4.49 } },

  // Pasta, Rice & Grains
  { id: 'pasta', name: 'Dry pasta', aisle: 'Pasta, Rice & Grains', unit: 'g', kcal: 371, protein: 13, carbs: 75, fat: 1.5, pack: { size: 900, label: '900 g box', price: 3.49 } },
  { id: 'orzo', name: 'Orzo', aisle: 'Pasta, Rice & Grains', unit: 'g', kcal: 371, protein: 13, carbs: 75, fat: 1.5, pack: { size: 900, label: '900 g box', price: 3.99 } },
  { id: 'gnocchi', name: 'Potato gnocchi (shelf-stable)', aisle: 'Pasta, Rice & Grains', unit: 'g', kcal: 150, protein: 3.5, carbs: 32, fat: 0.5, pack: { size: 500, label: '500 g pack', price: 3.99 } },
  { id: 'rice', name: 'Jasmine rice', aisle: 'Pasta, Rice & Grains', unit: 'g', kcal: 360, protein: 7, carbs: 79, fat: 0.6, pack: { size: 2000, label: '2 kg bag', price: 7.49 } },
  { id: 'oats', name: 'Large flake oats', aisle: 'Pasta, Rice & Grains', unit: 'g', kcal: 379, protein: 13, carbs: 68, fat: 6.5, pack: { size: 1000, label: '1 kg bag', price: 5.49 } },
  { id: 'breadcrumbs', name: 'Italian breadcrumbs', aisle: 'Pasta, Rice & Grains', unit: 'g', kcal: 380, protein: 12, carbs: 78, fat: 2.5, pack: { size: 425, label: '425 g canister', price: 3.49 } },

  // Canned & Jarred
  { id: 'marinara', name: 'Marinara / tomato basil pasta sauce', aisle: 'Canned & Jarred', unit: 'g', kcal: 55, protein: 1.6, carbs: 8, fat: 1.8, pack: { size: 680, label: '650 mL jar', price: 4.49 } },
  { id: 'crushed_tomatoes', name: 'Crushed tomatoes', aisle: 'Canned & Jarred', unit: 'g', kcal: 32, protein: 1.6, carbs: 6, fat: 0.3, pack: { size: 796, label: '796 mL can', price: 2.49 } },
  { id: 'tomato_paste', name: 'Tomato paste', aisle: 'Canned & Jarred', unit: 'g', kcal: 82, protein: 4.3, carbs: 19, fat: 0.5, pack: { size: 156, label: '156 mL can', price: 1.29 } },
  { id: 'pesto', name: 'Basil pesto', aisle: 'Canned & Jarred', unit: 'g', kcal: 430, protein: 5, carbs: 7, fat: 42, pack: { size: 190, label: '190 g jar', price: 5.49 } },
  { id: 'sun_dried_tomatoes', name: 'Sun-dried tomatoes in oil', aisle: 'Canned & Jarred', unit: 'g', kcal: 213, protein: 5, carbs: 23, fat: 14, pack: { size: 240, label: '270 mL jar', price: 5.99 } },
  { id: 'black_beans', name: 'Black beans', aisle: 'Canned & Jarred', unit: 'g', kcal: 130, protein: 8.5, carbs: 23, fat: 0.5, pack: { size: 400, label: '540 mL can', price: 1.79 } },
  { id: 'white_beans', name: 'White kidney beans (cannellini)', aisle: 'Canned & Jarred', unit: 'g', kcal: 120, protein: 7.5, carbs: 21, fat: 0.4, pack: { size: 400, label: '540 mL can', price: 1.79 } },
  { id: 'salsa', name: 'Salsa (medium)', aisle: 'Canned & Jarred', unit: 'g', kcal: 36, protein: 1.5, carbs: 7, fat: 0.2, pack: { size: 650, label: '650 mL jar', price: 4.49 } },
  { id: 'broth', name: 'Chicken broth (low sodium)', aisle: 'Canned & Jarred', unit: 'g', kcal: 6, protein: 0.6, carbs: 0.4, fat: 0.2, pack: { size: 900, label: '900 mL carton', price: 2.99 } },
  { id: 'hummus', name: 'Hummus', aisle: 'Dairy & Eggs', unit: 'g', kcal: 166, protein: 7.9, carbs: 14.3, fat: 9.6, pack: { size: 450, label: '450 g tub', price: 6.49 } },
  { id: 'caesar', name: 'Creamy Caesar dressing', aisle: 'Canned & Jarred', unit: 'g', kcal: 480, protein: 2, carbs: 4, fat: 50, pack: { size: 460, label: '475 mL bottle', price: 4.99 } },
  { id: 'peanut_butter', name: 'Peanut butter (natural)', aisle: 'Canned & Jarred', unit: 'g', kcal: 588, protein: 25, carbs: 20, fat: 50, pack: { size: 1000, label: '1 kg jar', price: 8.49 } },
  { id: 'honey', name: 'Liquid honey', aisle: 'Canned & Jarred', unit: 'g', kcal: 304, protein: 0.3, carbs: 82, fat: 0, pack: { size: 500, label: '500 g bottle', price: 7.99 } },

  // Frozen
  { id: 'berries', name: 'Frozen mixed berries', aisle: 'Frozen', unit: 'g', kcal: 50, protein: 0.7, carbs: 12, fat: 0.3, pack: { size: 600, label: '600 g bag', price: 5.99 } },
  { id: 'peas', name: 'Frozen peas', aisle: 'Frozen', unit: 'g', kcal: 81, protein: 5.4, carbs: 14, fat: 0.4, pack: { size: 750, label: '750 g bag', price: 3.99 } },
  { id: 'tofu', name: 'Extra-firm tofu', aisle: 'Produce', unit: 'g', kcal: 144, protein: 17.3, carbs: 2.8, fat: 8.7, pack: { size: 350, label: '350 g block', price: 3.49 } },

  // Pantry (staples start as "have it")
  { id: 'olive_oil', name: 'Olive oil', aisle: 'Pantry', unit: 'g', kcal: 884, protein: 0, carbs: 0, fat: 100, pack: { size: 916, label: '1 L bottle', price: 14.99 }, staple: true },
  { id: 'italian_seasoning', name: 'Italian seasoning', aisle: 'Pantry', unit: 'g', kcal: 0, protein: 0, carbs: 0, fat: 0, pack: { size: 30, label: 'jar', price: 3.49 }, staple: true },
  { id: 'chili_flakes', name: 'Chili flakes', aisle: 'Pantry', unit: 'g', kcal: 0, protein: 0, carbs: 0, fat: 0, pack: { size: 40, label: 'jar', price: 3.29 }, staple: true },
  { id: 'paprika', name: 'Smoked paprika', aisle: 'Pantry', unit: 'g', kcal: 0, protein: 0, carbs: 0, fat: 0, pack: { size: 50, label: 'jar', price: 3.99 }, staple: true },
  { id: 'soy_sauce', name: 'Soy sauce (low sodium)', aisle: 'Pantry', unit: 'g', kcal: 53, protein: 8, carbs: 5, fat: 0.6, pack: { size: 500, label: '500 mL bottle', price: 3.99 } },
  { id: 'taco_seasoning', name: 'Taco seasoning', aisle: 'Pantry', unit: 'g', kcal: 330, protein: 6, carbs: 55, fat: 6, pack: { size: 24, label: '24 g packet', price: 1.49 } },
  { id: 'choc_chips', name: 'Mini chocolate chips', aisle: 'Pantry', unit: 'g', kcal: 480, protein: 4.2, carbs: 63, fat: 30, pack: { size: 300, label: '300 g bag', price: 4.49 } },
  { id: 'chia', name: 'Chia seeds', aisle: 'Pantry', unit: 'g', kcal: 486, protein: 17, carbs: 42, fat: 31, pack: { size: 340, label: '340 g bag', price: 6.99 } },

  // Snacks & Supplements
  { id: 'whey', name: 'Whey protein powder (vanilla or chocolate)', aisle: 'Snacks & Supplements', unit: 'g', kcal: 400, protein: 78, carbs: 8, fat: 6, pack: { size: 908, label: '2 lb tub', price: 44.99 } },
  { id: 'granola', name: 'Granola', aisle: 'Snacks & Supplements', unit: 'g', kcal: 470, protein: 10, carbs: 64, fat: 20, pack: { size: 500, label: '500 g bag', price: 5.99 } },
  { id: 'almonds', name: 'Almonds', aisle: 'Snacks & Supplements', unit: 'g', kcal: 579, protein: 21, carbs: 22, fat: 50, pack: { size: 400, label: '400 g bag', price: 8.99 } },
];

export const INGREDIENTS: Record<string, Ingredient> = Object.fromEntries(list.map((i) => [i.id, i]));

export function ingredient(id: string): Ingredient {
  const i = INGREDIENTS[id];
  if (!i) throw new Error(`Unknown ingredient: ${id}`);
  return i;
}
