# Noteboss

A personal app for a busy student who's bulking: a high-protein **meal planner + grocery list**, with a **workout planner** coming next.

It's a web app that installs onto your iPhone's home screen and behaves like a native app (full screen, works offline). Your data is stored on your phone.

## What's in it

- **Meals → Recipes**: 46 recipes (30 lunch/dinner, 8 breakfasts, 8 snacks), Italian-heavy, all ≤ 30 min. Every main is roughly 650–980 cal and 43–71 g protein per serving. Each one shows macros, cost per serving, equipment, fridge/freezer life, steps and "calorie boosters".
- **Shellfish swaps**: shrimp recipes default to chicken breast and also offer cod, salmon or tofu. Macros, cost and the grocery list update to match.
- **Meals → This Week**: the Sunday cook list. Pick recipes and how many servings to batch-cook, then place them into breakfast / lunch / dinner / snack slots Mon–Sun. **✨ Plan my week for me** builds a full week sized to your calorie target. Daily totals are tracked against your goals.
- **Groceries**: built from your servings. Ingredients are combined across recipes, rounded up to real package sizes, grouped by aisle, and priced from approximate Save-On-Foods (BC) prices. Check items off in the store, mark pantry items as "have it", and share the list to Notes or Messages.
- **Goals**: height, weight, goal weight, activity and gain rate → calories, protein, carbs and fat (Mifflin-St Jeor + surplus). Weekly weigh-ins with trend feedback. Custom overrides are supported.
- **Workouts**: placeholder, coming next.

## Run it on your MacBook

```bash
npm install
npm run dev
```

Open the "Local" URL it prints. To try it on your iPhone, connect to the same Wi-Fi and open the "Network" URL in Safari.

## Put it on your iPhone permanently (GitHub Pages)

1. Merge this branch into `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Each push to `main` deploys to `https://<username>.github.io/<repo>/`.
4. Open that URL in **Safari** on your iPhone → Share button → **Add to Home Screen**.

## Develop

```bash
npm test         # unit tests (macros, grocery math, planner, goals)
npm run build    # type-check + production build
```

- `src/data/ingredients.ts`: ingredients with nutrition and BC prices. Update prices here.
- `src/data/recipes.ts`: recipes. All quantities are **per serving**, so adding a recipe is just adding an entry.
- `src/lib/`: macro, grocery, planner and goal logic.
- `src/tabs/`: one file per screen.
