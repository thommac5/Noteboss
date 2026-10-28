import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { INGREDIENTS } from '../data/ingredients';
import { calcTargets, DEFAULT_PROFILE, type Profile, type Targets, type WeighIn } from './goals';
import { emptyPlan, type Plan } from './plan';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`noteboss:${key}`);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function loadArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(`noteboss:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function usePersisted<T>(key: string, initial: () => T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      localStorage.setItem(`noteboss:${key}`, JSON.stringify(value));
    } catch {
      // Storage full or blocked (private mode) – app still works for this session.
    }
  }, [key, value]);
  return [value, setValue];
}

const defaultPantry = () => Object.fromEntries(Object.values(INGREDIENTS).filter((i) => i.staple).map((i) => [i.id, true]));

interface AppState {
  profile: Profile;
  setProfile: (p: Profile | ((prev: Profile) => Profile)) => void;
  targets: Targets;
  plan: Plan;
  setPlan: (p: Plan | ((prev: Plan) => Plan)) => void;
  /** Ingredients you already have at home (excluded from cost). */
  pantry: Record<string, boolean>;
  setPantry: (p: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  /** Ingredients checked off while shopping. */
  bought: Record<string, boolean>;
  setBought: (p: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  weighIns: WeighIn[];
  setWeighIns: (w: WeighIn[] | ((prev: WeighIn[]) => WeighIn[])) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersisted('profile', () => load('profile', DEFAULT_PROFILE));
  const [plan, setPlan] = usePersisted('plan', () => load('plan', emptyPlan()));
  const [pantry, setPantry] = usePersisted('pantry', () => load('pantry', defaultPantry()));
  const [bought, setBought] = usePersisted('bought', () => load<Record<string, boolean>>('bought', {}));
  const [weighIns, setWeighIns] = usePersisted('weighIns', () => loadArray<WeighIn>('weighIns', []));
  const targets = calcTargets(profile);

  return (
    <Ctx.Provider value={{ profile, setProfile, targets, plan, setPlan, pantry, setPantry, bought, setBought, weighIns, setWeighIns }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
