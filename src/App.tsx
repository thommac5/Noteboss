import { useEffect, useState } from 'react';
import { Segmented } from './components/ui';
import { AppProvider } from './lib/store';
import { Goals } from './tabs/Goals';
import { Groceries } from './tabs/Groceries';
import { Recipes } from './tabs/Recipes';
import { Week } from './tabs/Week';
import { Workouts } from './tabs/Workouts';

type Tab = 'meals' | 'groceries' | 'workouts' | 'goals';
type MealsView = 'week' | 'recipes';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'meals', label: 'Meals', icon: '🍽️' },
  { id: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: 'workouts', label: 'Workouts', icon: '🏋️' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
];

const TITLES: Record<Tab, string> = { meals: 'Meal Planner', groceries: 'Grocery List', workouts: 'Workouts', goals: 'Goals' };

function Shell() {
  const [tab, setTab] = useState<Tab>('meals');
  const [mealsView, setMealsView] = useState<MealsView>('week');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab, mealsView]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="app">
      <header className="top">
        <h1>{TITLES[tab]}</h1>
        {tab === 'meals' && (
          <Segmented
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'recipes', label: 'Recipes' },
            ]}
            value={mealsView}
            onChange={setMealsView}
          />
        )}
      </header>

      <main className="content">
        {tab === 'meals' && mealsView === 'week' && <Week onBrowse={() => setMealsView('recipes')} />}
        {tab === 'meals' && mealsView === 'recipes' && <Recipes onAdded={(name) => setToast(`Added ${name} to this week`)} />}
        {tab === 'groceries' && (
          <Groceries
            onPlan={() => {
              setTab('meals');
              setMealsView('week');
            }}
          />
        )}
        {tab === 'workouts' && <Workouts />}
        {tab === 'goals' && <Goals />}
      </main>

      {toast && <div className="toast">{toast}</div>}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)} aria-current={tab === t.id}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
