import { useState } from 'react';
import { ingredient } from '../data/ingredients';
import type { Recipe } from '../data/types';
import { effectiveIngredients, formatQty, hasShellfish, money, servingCost, servingMacros } from '../lib/nutrition';
import { MacroChips, Sheet, Stepper } from './ui';

interface Props {
  recipe: Recipe;
  servings: number;
  swapTo?: string;
  actionLabel: string;
  onSubmit: (servings: number, swapTo?: string) => void;
  onClose: () => void;
  onRemove?: () => void;
}

export function RecipeDetail({ recipe, servings: initialServings, swapTo: initialSwap, actionLabel, onSubmit, onClose, onRemove }: Props) {
  const [servings, setServings] = useState(initialServings);
  const [swapTo, setSwapTo] = useState(initialSwap);
  const macros = servingMacros(recipe, swapTo);
  const cost = servingCost(recipe, swapTo);
  const ingredients = effectiveIngredients(recipe, swapTo);
  const shellfish = hasShellfish(recipe, swapTo);
  const swapTip = recipe.swap?.options.find((o) => o.id === swapTo)?.tip;

  return (
    <Sheet
      title={recipe.name}
      onClose={onClose}
      footer={
        <div className="row gap">
          {onRemove && (
            <button className="btn ghost danger" onClick={onRemove}>
              Remove
            </button>
          )}
          <button className="btn primary grow" onClick={() => onSubmit(servings, swapTo)}>
            {actionLabel} · {servings} serving{servings > 1 ? 's' : ''}
          </button>
        </div>
      }
    >
      <div className="detail-hero">
        <span className="detail-emoji">{recipe.emoji}</span>
        <p className="muted">{recipe.description}</p>
      </div>

      <div className="meta-row">
        <span>⏱ {recipe.minutes} min</span>
        <span>🍽 {recipe.equipment.join(', ')}</span>
        <span>🧊 Fridge {recipe.fridgeDays}d{recipe.freezes ? ' · freezes' : ''}</span>
        <span>💵 {money(cost)}/serving</span>
      </div>

      <h3>Per serving</h3>
      <MacroChips m={macros} />

      {recipe.swap && (
        <div className={`swap-box${shellfish ? ' warn' : ''}`}>
          <h3>🦐 Shellfish swap</h3>
          <p className="small">This recipe is written with {ingredient(recipe.swap.from).name.toLowerCase()}. Choose a protein:</p>
          <div className="swap-options">
            {recipe.swap.options.map((o) => (
              <button key={o.id} className={`pill${swapTo === o.id ? ' active' : ''}`} onClick={() => setSwapTo(o.id)}>
                {ingredient(o.id).name.split(',')[0].split(' (')[0]}
              </button>
            ))}
            <button className={`pill${swapTo === recipe.swap.from ? ' active warn' : ''}`} onClick={() => setSwapTo(recipe.swap!.from)}>
              Original (shrimp) ⚠️
            </button>
          </div>
          {shellfish ? <p className="small warn-text">⚠️ Contains shellfish. Not safe for you.</p> : swapTip && <p className="small">Tip: {swapTip}</p>}
        </div>
      )}

      <div className="row between center">
        <h3>Servings to cook</h3>
        <Stepper value={servings} onChange={setServings} label="Servings" />
      </div>
      <p className="small muted">Suggested batch: {recipe.batch}. Ingredients below are for all {servings} servings.</p>

      <ul className="ingredients">
        {ingredients.map((ri) => (
          <li key={ri.id}>
            <span className="qty">{formatQty(ri.id, ri.qty * servings)}</span>
            <span>
              {ingredient(ri.id).name}
              {ri.note && <span className="muted">, {ri.note}</span>}
            </span>
          </li>
        ))}
      </ul>

      <h3>Steps</h3>
      <ol className="steps">
        {recipe.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>

      {recipe.boosters.length > 0 && (
        <>
          <h3>💪 Calorie boosters</h3>
          <ul className="boosters">
            {recipe.boosters.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </>
      )}
    </Sheet>
  );
}
