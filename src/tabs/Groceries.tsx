import { useState } from 'react';
import { buyLabel, groceryItems, groupByAisle, type GroceryItem } from '../lib/grocery';
import { formatQty, money } from '../lib/nutrition';
import { useApp } from '../lib/store';

export function Groceries({ onPlan }: { onPlan: () => void }) {
  const { plan, pantry, setPantry, bought, setBought } = useApp();
  const [copied, setCopied] = useState(false);
  const all = groceryItems(plan.batches);
  const toBuy = all.filter((i) => !pantry[i.ingredient.id]);
  const have = all.filter((i) => pantry[i.ingredient.id]);
  const total = toBuy.reduce((s, i) => s + i.cost, 0);
  const left = toBuy.filter((i) => !bought[i.ingredient.id]);
  const servings = plan.batches.reduce((n, b) => n + b.servings, 0);

  if (!plan.batches.length) {
    return (
      <div className="card empty">
        <div className="empty-emoji">🛒</div>
        <h2>No groceries yet</h2>
        <p className="muted">Add recipes to this week’s cook list and your grocery list builds itself, scaled to the servings you choose.</p>
        <button className="btn primary" onClick={onPlan}>
          Plan my week
        </button>
      </div>
    );
  }

  const asText = () =>
    groupByAisle(toBuy)
      .map((s) => `${s.aisle.toUpperCase()}\n${s.items.map((i) => `☐ ${i.ingredient.name} – ${buyLabel(i)}`).join('\n')}`)
      .join('\n\n') + `\n\nEst. total ${money(total)}`;

  const share = async () => {
    const text = asText();
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Grocery list', text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed – nothing to do.
    }
  };

  return (
    <div className="stack">
      <div className="card total-card">
        <div>
          <div className="eyebrow">Estimated total</div>
          <div className="big-number">{money(total)}</div>
          <div className="small muted">
            {servings} servings · ≈ {money(total / Math.max(1, servings))}/serving · {left.length} of {toBuy.length} items left
          </div>
        </div>
        <button className="btn small-btn" onClick={share}>
          {copied ? 'Copied ✓' : 'Share list'}
        </button>
      </div>
      <p className="small muted">Approximate regular prices at Save-On-Foods (BC). Sales and More Rewards points will usually bring it down. You buy whole packs, so leftovers roll into next week.</p>

      {groupByAisle(toBuy).map((section) => (
        <section key={section.aisle} className="card grocery-section">
          <h3 className="tight">{section.aisle}</h3>
          <ul className="grocery-list">
            {section.items.map((item) => (
              <GroceryRow
                key={item.ingredient.id}
                item={item}
                checked={!!bought[item.ingredient.id]}
                onToggle={() => setBought((b) => ({ ...b, [item.ingredient.id]: !b[item.ingredient.id] }))}
                onHave={() => setPantry((p) => ({ ...p, [item.ingredient.id]: true }))}
              />
            ))}
          </ul>
        </section>
      ))}

      {have.length > 0 && (
        <section className="card grocery-section have">
          <h3 className="tight">Already have at home</h3>
          <p className="small muted">Not counted in the total. Tap “Need it” if you’re running low.</p>
          <ul className="grocery-list">
            {have.map((item) => (
              <li key={item.ingredient.id} className="grocery-row">
                <div className="grow">
                  <div>{item.ingredient.name}</div>
                  <div className="small muted">uses {formatQty(item.ingredient.id, item.needed)} this week</div>
                </div>
                <button className="btn ghost small-btn" onClick={() => setPantry((p) => ({ ...p, [item.ingredient.id]: false }))}>
                  Need it
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function GroceryRow({ item, checked, onToggle, onHave }: { item: GroceryItem; checked: boolean; onToggle: () => void; onHave: () => void }) {
  return (
    <li className={`grocery-row${checked ? ' done' : ''}`}>
      <button className="check" role="checkbox" aria-checked={checked} onClick={onToggle} aria-label={`Bought ${item.ingredient.name}`}>
        {checked ? '✓' : ''}
      </button>
      <div className="grow" onClick={onToggle}>
        <div className="grocery-name">{item.ingredient.name}</div>
        <div className="small">
          <strong>Buy {buyLabel(item)}</strong> <span className="muted">· need {formatQty(item.ingredient.id, item.needed)}</span>
        </div>
        <div className="small muted for">for {item.usedFor.join(', ')}</div>
      </div>
      <div className="grocery-side">
        <span className="price">{money(item.cost)}</span>
        <button className="link-btn" onClick={onHave}>
          Have it
        </button>
      </div>
    </li>
  );
}
