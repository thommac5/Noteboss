const COMING = [
  ['🗓️', 'A full weekly split built for you', 'Push / pull / legs, shoulders, abs and cardio days, scheduled to how many days you can train.'],
  ['📚', 'A big exercise library', 'Every major exercise, organized by muscle group and equipment.'],
  ['🔁', 'One-tap swaps', 'Machine taken or something hurts? Swap in another exercise that hits the same muscle.'],
  ['📈', 'Track every set', 'Log weight and reps, see progress, and get nudged to add weight.'],
];

export function Workouts() {
  return (
    <div className="stack">
      <div className="card empty">
        <div className="empty-emoji">🏋️</div>
        <h2>Workout planner is next</h2>
        <p className="muted">The meal planner is live. The gym tab is being built next. Here's what's coming:</p>
      </div>
      {COMING.map(([emoji, title, body]) => (
        <div key={title} className="card row gap">
          <span className="emoji">{emoji}</span>
          <div>
            <strong>{title}</strong>
            <p className="small muted tight">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
