import { useState } from 'react';
import { RECIPE_BY_ID, RECIPES } from '../data/recipes';
import { ingredient } from '../data/ingredients';
import { RecipeDetail } from '../components/RecipeDetail';
import { Progress, Sheet, Stepper } from '../components/ui';
import { addMacros, defaultSwap, servingMacros, ZERO } from '../lib/nutrition';
import {
  assign,
  autoFill,
  batchMacros,
  dayDate,
  dayMacros,
  DAYS,
  emptyPlan,
  generateWeek,
  newBatch,
  remaining,
  removeBatch,
  setServings,
  SLOT_LABEL,
  slotKey,
  slotMeal,
  SLOTS,
  unassign,
  type Batch,
  type Slot,
} from '../lib/plan';
import { useApp } from '../lib/store';

const fmtDay = (d: Date) => d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });

export function Week({ onBrowse }: { onBrowse: () => void }) {
  const { plan, setPlan, targets, setBought } = useApp();
  const [picking, setPicking] = useState<{ day: number; slot: Slot } | null>(null);
  const [editing, setEditing] = useState<Batch | null>(null);

  const byId = new Map(plan.batches.map((b) => [b.id, b]));
  const days = DAYS.map((_, d) => dayMacros(plan, d));
  const weekTotal = days.reduce((t, m) => addMacros(t, m), ZERO);
  const unplaced = plan.batches.reduce((n, b) => n + Math.max(0, remaining(plan, b)), 0);
  const start = dayDate(plan.weekStart, 0);
  const end = dayDate(plan.weekStart, 6);

  const planForMe = () => {
    if (plan.batches.length && !confirm('Replace this week’s plan with a fresh auto-generated one?')) return;
    setPlan(generateWeek(plan.weekStart, targets.kcal));
    setBought({});
  };

  const newWeek = () => {
    if (!confirm('Start a new week? This clears the current plan and grocery checkmarks.')) return;
    setPlan(emptyPlan());
    setBought({});
  };

  return (
    <div className="stack">
      <div className="row between center">
        <div>
          <div className="eyebrow">Week of</div>
          <h2 className="tight">
            {fmtDay(start)} – {fmtDay(end)}
          </h2>
        </div>
        <button className="btn ghost small-btn" onClick={newWeek}>
          New week
        </button>
      </div>

      <div className="card stack-sm">
        <div className="row between center">
          <strong>Daily average vs goal</strong>
          <span className="small muted">from your plan</span>
        </div>
        <Progress label="Calories" value={weekTotal.kcal / 7} target={targets.kcal} unit="cal" />
        <Progress label="Protein" value={weekTotal.protein / 7} target={targets.protein} unit="g" />
      </div>

      <div className="row gap">
        <button className="btn primary grow" onClick={planForMe}>
          ✨ Plan my week for me
        </button>
        <button className="btn grow" onClick={onBrowse}>
          + Add recipe
        </button>
      </div>

      <section className="card stack-sm">
        <div className="row between center">
          <h3 className="tight">🧑‍🍳 Sunday cook list</h3>
          {unplaced > 0 && (
            <button className="btn small-btn" onClick={() => setPlan(autoFill(plan))}>
              Auto-fill {unplaced} serving{unplaced > 1 ? 's' : ''}
            </button>
          )}
        </div>
        {plan.batches.length === 0 ? (
          <p className="muted small">
            Pick the recipes you’ll batch-cook this week and how many servings of each. Your grocery list builds itself from this. Tap <strong>✨ Plan my week for me</strong> to start
            with a ready-made week.
          </p>
        ) : (
          <ul className="batch-list">
            {plan.batches.map((b) => {
              const r = RECIPE_BY_ID[b.recipeId];
              const left = remaining(plan, b);
              const m = batchMacros(b);
              return (
                <li key={b.id} className="batch">
                  <button className="batch-main" onClick={() => setEditing(b)}>
                    <span className="emoji">{r.emoji}</span>
                    <span className="grow">
                      <span className="batch-name">{r.name}</span>
                      <span className="small muted">
                        {Math.round(m.kcal)} cal · {Math.round(m.protein)}g protein
                        {r.swap && b.swapTo !== r.swap.from && ` · with ${ingredient(b.swapTo!).name.split(',')[0].split(' (')[0].toLowerCase()}`}
                        {r.swap && b.swapTo === r.swap.from && ' · ⚠️ shrimp'}
                      </span>
                      <span className={`small ${left > 0 ? 'accent' : 'muted'}`}>{left > 0 ? `${left} not placed yet` : 'All servings placed ✓'}</span>
                    </span>
                  </button>
                  <Stepper value={b.servings} onChange={(n) => setPlan(setServings(plan, b.id, n))} label={`${r.name} servings`} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {DAYS.map((name, d) => (
        <section key={name} className="card day">
          <div className="row between center day-head">
            <strong>
              {name} <span className="muted small">{fmtDay(dayDate(plan.weekStart, d))}</span>
            </strong>
            <span className={`small ${days[d].kcal >= targets.kcal * 0.95 ? 'good-text' : 'muted'}`}>
              {Math.round(days[d].kcal)} cal · {Math.round(days[d].protein)}g P
            </span>
          </div>
          {SLOTS.map((slot) => {
            const ids = plan.slots[slotKey(d, slot)] ?? [];
            return (
              <div key={slot} className="slot">
                <span className="slot-label">{SLOT_LABEL[slot]}</span>
                <div className="slot-items">
                  {ids.map((id, i) => {
                    const b = byId.get(id);
                    if (!b) return null;
                    const r = RECIPE_BY_ID[b.recipeId];
                    return (
                      <span key={`${id}-${i}`} className="slot-chip">
                        {r.emoji} {r.name}
                        <button aria-label={`Remove ${r.name}`} onClick={() => setPlan(unassign(plan, d, slot, i))}>
                          ×
                        </button>
                      </span>
                    );
                  })}
                  {(slot === 'snack' || ids.length === 0) && (
                    <button className="slot-add" onClick={() => setPicking({ day: d, slot })}>
                      + {ids.length ? 'Another' : 'Add'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {picking && (
        <SlotPicker
          day={picking.day}
          slot={picking.slot}
          onClose={() => setPicking(null)}
          onPick={(batchId) => {
            setPlan((p) => assign(p, picking.day, picking.slot, batchId));
            setPicking(null);
          }}
          onQuickAdd={(recipeId) => {
            const r = RECIPE_BY_ID[recipeId];
            const b = newBatch(r, 1);
            setPlan((p) => assign({ ...p, batches: [...p.batches, b] }, picking.day, picking.slot, b.id));
            setPicking(null);
          }}
        />
      )}

      {editing && (
        <RecipeDetail
          recipe={RECIPE_BY_ID[editing.recipeId]}
          servings={editing.servings}
          swapTo={editing.swapTo}
          actionLabel="Save"
          onClose={() => setEditing(null)}
          onRemove={() => {
            setPlan(removeBatch(plan, editing.id));
            setEditing(null);
          }}
          onSubmit={(servings, swapTo) => {
            const next = setServings(plan, editing.id, servings);
            setPlan({ ...next, batches: next.batches.map((b) => (b.id === editing.id ? { ...b, swapTo } : b)) });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function SlotPicker({ day, slot, onClose, onPick, onQuickAdd }: { day: number; slot: Slot; onClose: () => void; onPick: (batchId: string) => void; onQuickAdd: (recipeId: string) => void }) {
  const { plan } = useApp();
  const meal = slotMeal(slot);
  const batches = plan.batches.filter((b) => RECIPE_BY_ID[b.recipeId].meal === meal);
  const others = RECIPES.filter((r) => r.meal === meal && !batches.some((b) => b.recipeId === r.id));

  return (
    <Sheet title={`${DAYS[day]} · ${SLOT_LABEL[slot]}`} onClose={onClose}>
      {batches.length > 0 && (
        <>
          <h3>From your cook list</h3>
          <ul className="pick-list">
            {batches.map((b) => {
              const r = RECIPE_BY_ID[b.recipeId];
              const left = remaining(plan, b);
              return (
                <li key={b.id}>
                  <button onClick={() => onPick(b.id)}>
                    <span className="emoji">{r.emoji}</span>
                    <span className="grow">{r.name}</span>
                    <span className={`small ${left > 0 ? 'accent' : 'muted'}`}>{left > 0 ? `${left} left` : 'cook +1'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <h3>{batches.length ? 'Or add something new' : 'Choose a recipe'}</h3>
      <p className="small muted">Adds 1 serving to your cook list. Bump it up there to batch-cook more.</p>
      <ul className="pick-list">
        {others.map((r) => {
          const m = servingMacros(r, defaultSwap(r));
          return (
            <li key={r.id}>
              <button onClick={() => onQuickAdd(r.id)}>
                <span className="emoji">{r.emoji}</span>
                <span className="grow">
                  {r.name}
                  {r.swap && ' 🦐'}
                </span>
                <span className="small muted">
                  {Math.round(m.kcal)} cal · {Math.round(m.protein)}g
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
