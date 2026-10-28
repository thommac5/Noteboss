import { useState } from 'react';
import { Segmented } from '../components/ui';
import { ACTIVITY, RATES, weeklyTrend, type Activity, type Profile } from '../lib/goals';
import { toIso } from '../lib/plan';
import { useApp } from '../lib/store';

function NumberField({ label, value, onChange, suffix, step = 1 }: { label: string; value: number | undefined; onChange: (n: number | undefined) => void; suffix?: string; step?: number }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
    </label>
  );
}

export function Goals() {
  const { profile, setProfile, targets, weighIns, setWeighIns } = useApp();
  const [todayLb, setTodayLb] = useState<number | undefined>();
  const set = (patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch }));
  const gaining = profile.goalWeightLb > profile.weightLb;
  const trend = weeklyTrend(weighIns);
  const progress = gaining && weighIns.length ? Math.max(0, Math.min(100, ((profile.weightLb - weighIns[0].lb) / (profile.goalWeightLb - weighIns[0].lb)) * 100)) : 0;

  const logWeight = () => {
    if (!todayLb) return;
    const date = toIso(new Date());
    setWeighIns((w) => [...w.filter((x) => x.date !== date), { date, lb: todayLb }].sort((a, b) => a.date.localeCompare(b.date)));
    set({ weightLb: todayLb });
    setTodayLb(undefined);
  };

  return (
    <div className="stack">
      <section className="card targets-card">
        <div className="eyebrow">Your daily targets</div>
        <div className="target-main">
          <div>
            <div className="big-number">{targets.kcal.toLocaleString()}</div>
            <div className="small muted">calories</div>
          </div>
          <div>
            <div className="big-number protein-text">{targets.protein}g</div>
            <div className="small muted">protein</div>
          </div>
        </div>
        <div className="row gap small">
          <span className="chip">{targets.carbs}g carbs</span>
          <span className="chip">{targets.fat}g fat</span>
        </div>
        <p className="small muted">
          Maintenance ≈ {targets.maintenance.toLocaleString()} cal (BMR {targets.bmr.toLocaleString()} × activity){' '}
          {targets.surplus !== 0 && (
            <>
              {targets.surplus > 0 ? '+' : '−'} {Math.abs(targets.surplus)} cal {targets.surplus > 0 ? 'surplus' : 'deficit'} for {profile.rate} lb/week
            </>
          )}
          {(profile.customKcal || profile.customProtein) && ' · using your custom numbers'}
        </p>
        {targets.goalDate && (
          <p className="small">
            🎯 {profile.weightLb} → {profile.goalWeightLb} lb in about <strong>{targets.weeksToGoal} weeks</strong> (around{' '}
            {targets.goalDate.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}).
          </p>
        )}
        {gaining && profile.goalWeightLb - profile.weightLb > 20 && (
          <p className="small muted">
            Gaining {profile.goalWeightLb - profile.weightLb} lb of mostly muscle is a long game. Newer lifters can add roughly 1–2 lb of muscle a month. Steady (0.5 lb/week) keeps
            the extra fat low, and you can bump it if the scale doesn't move.
          </p>
        )}
      </section>

      <section className="card stack-sm">
        <h3 className="tight">About you</h3>
        <Segmented
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          value={profile.sex}
          onChange={(sex) => set({ sex })}
        />
        <div className="grid-2">
          <NumberField label="Age" value={profile.age} onChange={(n) => n && set({ age: n })} suffix="yrs" />
          <div className="field">
            <span>Height</span>
            <div className="row gap-sm">
              <div className="input-wrap">
                <input type="number" inputMode="numeric" value={Math.floor(profile.heightIn / 12)} onChange={(e) => set({ heightIn: Number(e.target.value) * 12 + (profile.heightIn % 12) })} />
                <span className="suffix">ft</span>
              </div>
              <div className="input-wrap">
                <input type="number" inputMode="numeric" value={profile.heightIn % 12} onChange={(e) => set({ heightIn: Math.floor(profile.heightIn / 12) * 12 + Number(e.target.value) })} />
                <span className="suffix">in</span>
              </div>
            </div>
          </div>
          <NumberField label="Current weight" value={profile.weightLb} onChange={(n) => n && set({ weightLb: n })} suffix="lb" step={0.5} />
          <NumberField label="Goal weight" value={profile.goalWeightLb} onChange={(n) => n && set({ goalWeightLb: n })} suffix="lb" step={0.5} />
        </div>

        <label className="field">
          <span>Activity level</span>
          <select value={profile.activity} onChange={(e) => set({ activity: e.target.value as Activity })}>
            {(Object.keys(ACTIVITY) as Activity[]).map((k) => (
              <option key={k} value={k}>
                {ACTIVITY[k].label}: {ACTIVITY[k].detail}
              </option>
            ))}
          </select>
        </label>

        <div className="field">
          <span>How fast? (lb per week)</span>
          <div className="rate-grid">
            {RATES.map((r) => (
              <button key={r.value} className={`rate${profile.rate === r.value ? ' active' : ''}`} onClick={() => set({ rate: r.value })}>
                <strong>{r.value}</strong>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
          <span className="small muted">{RATES.find((r) => r.value === profile.rate)?.detail}</span>
        </div>

        <label className="field">
          <span>
            Protein: <strong>{profile.proteinPerLb.toFixed(1)} g per lb</strong> of bodyweight
          </span>
          <input type="range" min={0.7} max={1.2} step={0.1} value={profile.proteinPerLb} onChange={(e) => set({ proteinPerLb: Number(e.target.value) })} />
          <span className="small muted">0.7–1.0 g/lb is the research-backed range for building muscle. 1.0 is a simple, safe target.</span>
        </label>
      </section>

      <section className="card stack-sm">
        <h3 className="tight">Custom targets (optional)</h3>
        <p className="small muted">Leave blank to use the calculated numbers. Fill in if a coach or dietitian gave you specific targets.</p>
        <div className="grid-2">
          <NumberField label="Calories" value={profile.customKcal} onChange={(n) => set({ customKcal: n })} suffix="cal" step={50} />
          <NumberField label="Protein" value={profile.customProtein} onChange={(n) => set({ customProtein: n })} suffix="g" step={5} />
        </div>
      </section>

      <section className="card stack-sm">
        <h3 className="tight">⚖️ Weekly weigh-in</h3>
        <p className="small muted">Weigh yourself once a week, same day, first thing in the morning. Logging updates your current weight and targets.</p>
        <div className="row gap">
          <div className="input-wrap grow">
            <input type="number" inputMode="decimal" step={0.1} placeholder="Today's weight" value={todayLb ?? ''} onChange={(e) => setTodayLb(e.target.value ? Number(e.target.value) : undefined)} />
            <span className="suffix">lb</span>
          </div>
          <button className="btn primary" onClick={logWeight} disabled={!todayLb}>
            Log
          </button>
        </div>
        {gaining && weighIns.length > 0 && (
          <div className="stack-sm">
            <div className="progress-track">
              <div className="progress-fill good" style={{ width: `${progress}%` }} />
            </div>
            <span className="small muted">
              {weighIns[0].lb} lb → {profile.weightLb} lb · {Math.round(progress)}% of the way to {profile.goalWeightLb} lb
            </span>
          </div>
        )}
        {trend !== null && (
          <p className="small">
            Trend: <strong>{trend >= 0 ? '+' : ''}{trend.toFixed(2)} lb/week</strong>.{' '}
            {gaining && trend < profile.rate * 0.5
              ? 'Slower than planned. Add ~200 calories a day (a snack or a booster) and re-check in 2 weeks.'
              : gaining && trend > profile.rate * 1.6
                ? 'Faster than planned. Trim ~150 calories a day to keep it lean.'
                : 'Right on track. Keep going 💪'}
          </p>
        )}
        {weighIns.length > 0 && (
          <ul className="weigh-list">
            {[...weighIns].reverse().slice(0, 8).map((w) => (
              <li key={w.date}>
                <span>{new Date(`${w.date}T12:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                <strong>{w.lb} lb</strong>
                <button className="link-btn" onClick={() => setWeighIns((all) => all.filter((x) => x.date !== w.date))} aria-label="Delete entry">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
