import React from 'react';

export function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="a-label">{label}</span>
      {children}
    </label>
  );
}

export function Input({ value, onChange, ...props }) {
  return <input className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props} />;
}

export function TextArea({ value, onChange, rows = 3, ...props }) {
  return <textarea className="a-input py-2" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props} />;
}

export function Select({ value, onChange, options, ...props }) {
  return (
    <select className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props}>
      {options.map((o) => {
        const [v, label] = Array.isArray(o) ? o : [o, o];
        return <option key={v} value={v}>{label}</option>;
      })}
    </select>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-clinic-maroon">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-clinic-clay">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Alert({ children, tone = 'error' }) {
  if (!children) return null;
  const styles = tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return <p className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</p>;
}

const STATUS_STYLES = {
  requested: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-sky-100 text-sky-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-stone-200 text-stone-700',
  no_show: 'bg-red-100 text-red-800',
  draft: 'bg-amber-100 text-amber-800',
  final: 'bg-emerald-100 text-emerald-800',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] || 'bg-stone-100'}`}>
      {String(status).replace('_', '-')}
    </span>
  );
}
