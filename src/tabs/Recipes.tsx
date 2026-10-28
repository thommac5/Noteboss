import { useMemo, useState } from 'react';
import { RECIPES } from '../data/recipes';
import type { MealType, Recipe } from '../data/types';
import { RecipeDetail } from '../components/RecipeDetail';
import { MacroChips } from '../components/ui';
import { defaultSwap, money, servingCost, servingMacros } from '../lib/nutrition';
import { newBatch } from '../lib/plan';
import { useApp } from '../lib/store';

type MealFilter = 'all' | MealType;
type Sort = 'protein' | 'kcal' | 'minutes' | 'cost';

const MEAL_FILTERS: { value: MealFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'main', label: 'Lunch & Dinner' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'snack', label: 'Snacks' },
];

export function Recipes({ onAdded }: { onAdded: (name: string) => void }) {
  const { setPlan } = useApp();
  const [meal, setMeal] = useState<MealFilter>('all');
  const [query, setQuery] = useState('');
  const [italian, setItalian] = useState(false);
  const [quick, setQuick] = useState(false);
  const [freezes, setFreezes] = useState(false);
  const [sort, setSort] = useState<Sort>('protein');
  const [open, setOpen] = useState<Recipe | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = RECIPES.filter(
      (r) =>
        (meal === 'all' || r.meal === meal) &&
        (!italian || r.cuisine === 'Italian') &&
        (!quick || r.minutes <= 20) &&
        (!freezes || r.freezes) &&
        (!q || `${r.name} ${r.cuisine} ${r.description}`.toLowerCase().includes(q)),
    ).map((r) => ({ r, m: servingMacros(r, defaultSwap(r)), cost: servingCost(r, defaultSwap(r)) }));
    const key: Record<Sort, (x: (typeof rows)[number]) => number> = {
      protein: (x) => -x.m.protein,
      kcal: (x) => -x.m.kcal,
      minutes: (x) => x.r.minutes,
      cost: (x) => x.cost,
    };
    return rows.sort((a, b) => key[sort](a) - key[sort](b));
  }, [meal, query, italian, quick, freezes, sort]);

  return (
    <div className="stack">
      <input className="search" type="search" placeholder="Search recipes…" value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="chips-scroll">
        {MEAL_FILTERS.map((f) => (
          <button key={f.value} className={`pill${meal === f.value ? ' active' : ''}`} onClick={() => setMeal(f.value)}>
            {f.label}
          </button>
        ))}
        <button className={`pill${italian ? ' active' : ''}`} onClick={() => setItalian(!italian)}>
          🇮🇹 Italian
        </button>
        <button className={`pill${quick ? ' active' : ''}`} onClick={() => setQuick(!quick)}>
          ⚡ ≤ 20 min
        </button>
        <button className={`pill${freezes ? ' active' : ''}`} onClick={() => setFreezes(!freezes)}>
          🧊 Freezes
        </button>
      </div>

      <div className="row between center">
        <span className="small muted">{list.length} recipes</span>
        <label className="small muted">
          Sort{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="protein">Most protein</option>
            <option value="kcal">Most calories</option>
            <option value="minutes">Fastest</option>
            <option value="cost">Cheapest</option>
          </select>
        </label>
      </div>

      <div className="recipe-grid">
        {list.map(({ r, m, cost }) => (
          <button key={r.id} className="card recipe-card" onClick={() => setOpen(r)}>
            <div className="recipe-card-top">
              <span className="emoji">{r.emoji}</span>
              <div className="grow">
                <div className="recipe-name">{r.name}</div>
                <div className="small muted">
                  {r.cuisine} · {r.minutes} min · {money(cost)}/serving
                </div>
              </div>
            </div>
            <MacroChips m={m} compact />
            {r.swap && <span className="badge warn">🦐 Shellfish – swap included</span>}
          </button>
        ))}
      </div>

      {open && (
        <RecipeDetail
          recipe={open}
          servings={open.batch}
          swapTo={defaultSwap(open)}
          actionLabel="Add to week"
          onClose={() => setOpen(null)}
          onSubmit={(servings, swapTo) => {
            setPlan((p) => ({ ...p, batches: [...p.batches, { ...newBatch(open, servings), swapTo }] }));
            onAdded(open.name);
            setOpen(null);
          }}
        />
      )}
    </div>
  );
}
