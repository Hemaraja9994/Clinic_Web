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
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-clinic-ink">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-base leading-7 text-clinic-clay">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Alert({ children, tone = 'error' }) {
  if (!children) return null;
  const styles = tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return <p className={`rounded-xl border px-4 py-3 text-base ${styles}`}>{children}</p>;
}

const STATUS_STYLES = {
  requested: 'bg-[#f6e6d4] text-[#6b3a12]',
  confirmed: 'bg-[#e5f0ea] text-[#145239]',
  completed: 'bg-[#e7f2e4] text-[#1b4332]',
  cancelled: 'bg-[#e8ded1] text-[#3e2715]',
  no_show: 'bg-[#f8e4e4] text-[#7f1d1d]',
  draft: 'bg-[#f6e6d4] text-[#6b3a12]',
  final: 'bg-[#e7f2e4] text-[#1b4332]',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${STATUS_STYLES[status] || 'bg-[#e8ded1] text-[#3e2715]'}`}>
      {String(status).replace('_', '-')}
    </span>
  );
}
