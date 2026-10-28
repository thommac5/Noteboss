export type Activity = 'sedentary' | 'light' | 'moderate' | 'very' | 'athlete';

export const ACTIVITY: Record<Activity, { label: string; detail: string; factor: number }> = {
  sedentary: { label: 'Sedentary', detail: 'Desk/class all day, no workouts', factor: 1.2 },
  light: { label: 'Lightly active', detail: '1–3 workouts a week', factor: 1.375 },
  moderate: { label: 'Moderately active', detail: '3–5 workouts a week + walking campus', factor: 1.55 },
  very: { label: 'Very active', detail: '6–7 hard workouts a week', factor: 1.725 },
  athlete: { label: 'Athlete', detail: 'Training twice a day or physical job', factor: 1.9 },
};

export const RATES = [
  { value: 0.25, label: 'Lean', detail: 'Slowest, least fat gain' },
  { value: 0.5, label: 'Steady', detail: 'Recommended for most people' },
  { value: 0.75, label: 'Fast', detail: 'Quicker, a bit more fat' },
  { value: 1, label: 'Aggressive', detail: 'Hard-gainer mode' },
];

export interface Profile {
  sex: 'male' | 'female';
  age: number;
  heightIn: number;
  weightLb: number;
  goalWeightLb: number;
  activity: Activity;
  /** Target weight change per week, lb. */
  rate: number;
  /** Grams of protein per lb of current bodyweight. */
  proteinPerLb: number;
  /** Optional manual overrides. */
  customKcal?: number;
  customProtein?: number;
}

export const DEFAULT_PROFILE: Profile = {
  sex: 'male',
  age: 20,
  heightIn: 71,
  weightLb: 155,
  goalWeightLb: 185,
  activity: 'moderate',
  rate: 0.5,
  proteinPerLb: 1,
};

export interface Targets {
  bmr: number;
  maintenance: number;
  surplus: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  weeksToGoal: number;
  goalDate: Date | null;
}

const round = (n: number, to: number) => Math.round(n / to) * to;

/** Mifflin-St Jeor BMR × activity, plus a surplus sized to the chosen weekly gain (3500 kcal ≈ 1 lb). */
export function calcTargets(p: Profile, today = new Date()): Targets {
  const kg = p.weightLb * 0.4536;
  const cm = p.heightIn * 2.54;
  const bmr = 10 * kg + 6.25 * cm - 5 * p.age + (p.sex === 'male' ? 5 : -161);
  const maintenance = bmr * ACTIVITY[p.activity].factor;
  const gaining = p.goalWeightLb > p.weightLb;
  const surplus = gaining ? (p.rate * 3500) / 7 : p.goalWeightLb < p.weightLb ? -(p.rate * 3500) / 7 : 0;

  const kcal = p.customKcal || round(maintenance + surplus, 50);
  const protein = p.customProtein || round(p.weightLb * p.proteinPerLb, 5);
  const fat = round((kcal * 0.25) / 9, 5);
  const carbs = Math.max(0, round((kcal - protein * 4 - fat * 9) / 4, 5));

  const diff = Math.abs(p.goalWeightLb - p.weightLb);
  const weeksToGoal = p.rate > 0 ? Math.ceil(diff / p.rate) : 0;
  const goalDate = weeksToGoal > 0 ? new Date(today.getTime() + weeksToGoal * 7 * 86_400_000) : null;

  return { bmr: Math.round(bmr), maintenance: Math.round(maintenance), surplus: Math.round(surplus), kcal, protein, carbs, fat, weeksToGoal, goalDate };
}

export interface WeighIn {
  date: string;
  lb: number;
}

/**
 * Average weekly change across the log (needs ≥ 2 weeks of data).
 * Positive = gaining.
 */
export function weeklyTrend(log: WeighIn[]): number | null {
  if (log.length < 2) return null;
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const days = (Date.parse(last.date) - Date.parse(first.date)) / 86_400_000;
  if (days < 14) return null;
  return ((last.lb - first.lb) / days) * 7;
}
