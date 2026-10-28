import { useEffect, type ReactNode } from 'react';
import type { Macros } from '../data/types';

export function Sheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="sheet-grabber" />
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Stepper({ value, onChange, min = 1, max = 30, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string }) {
  return (
    <div className="stepper" aria-label={label}>
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Fewer">
        −
      </button>
      <span>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="More">
        +
      </button>
    </div>
  );
}

export function MacroChips({ m, compact }: { m: Macros; compact?: boolean }) {
  return (
    <div className={`macro-chips${compact ? ' compact' : ''}`}>
      <span className="chip kcal">{Math.round(m.kcal)} cal</span>
      <span className="chip protein">{Math.round(m.protein)}g protein</span>
      {!compact && (
        <>
          <span className="chip">{Math.round(m.carbs)}g carbs</span>
          <span className="chip">{Math.round(m.fat)}g fat</span>
        </>
      )}
    </div>
  );
}

export function Progress({ value, target, label, unit }: { value: number; target: number; label: string; unit: string }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const state = value >= target * 0.95 ? 'good' : value >= target * 0.8 ? 'close' : 'low';
  return (
    <div className="progress">
      <div className="progress-label">
        <span>{label}</span>
        <span>
          {Math.round(value)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${state}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={o.value === value} className={o.value === value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
