import React, { useState } from 'react';

import {
  CATEGORIES,
  PAYMENT_METHODS,
  SERVICE_GROUPS,
  SERVICE_PRESETS,
  applyPreset,
  buildCollectionRows,
  categoryLabel,
  formatRupees,
  localDateISO,
} from './collectionCatalog.js';
import { Field, Input, Select, TextArea } from '../admin/components/ui.jsx';

const emptyLine = (category) => ({ category, amount: '' });

export function CollectionEditor({ clinics, initial, onSubmit, onClose, billingIds }) {
  const editing = Boolean(initial?.id);
  const [form, setForm] = useState(() => {
    const allowed = Array.isArray(billingIds) ? billingIds : null;
    const preferred = initial?.category || 'pta';
    const category = !initial?.id && allowed && !allowed.includes(preferred) ? (allowed[0] || preferred) : preferred;
    return {
      collection_date: initial?.collection_date || localDateISO(),
      clinic_id: initial?.clinic_id || clinics[0]?.id || '',
      category,
      amount: initial?.amount ?? '',
      method: initial?.method || 'cash',
      phone: initial?.phone || '',
      reference: initial?.reference || '',
      notes: initial?.notes || '',
      mode: 'single',
    };
  });
  const [lines, setLines] = useState([]);
  const [error, setError] = useState('');
  const allowedIds = Array.isArray(billingIds) ? new Set(billingIds) : null;
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const categoryOptions = (() => {
    const base = allowedIds ? CATEGORIES.filter(([id]) => allowedIds.has(id)) : CATEGORIES;
    if (editing && form.category && !base.some(([id]) => id === form.category)) {
      return [[form.category, categoryLabel(form.category)], ...base];
    }
    return base;
  })();

  const save = (event) => {
    event.preventDefault();
    setError('');
    try {
      const ticked = lines.filter((line) => line.category && (!allowedIds || allowedIds.has(line.category)));
      let rows;
      if (!editing && ticked.length) {
        rows = buildCollectionRows({ ...form, mode: 'multi', lines: ticked });
      } else if (!editing && allowedIds && !allowedIds.has(form.category)) {
        throw new Error('Tick a test under Billing before saving it on the bill.');
      } else if (!editing && String(form.amount).trim() === '') {
        throw new Error('Click a test and enter its amount, or choose one category and an amount.');
      } else {
        rows = buildCollectionRows({ ...form, mode: 'single' });
      }
      onSubmit(rows);
    } catch (err) {
      setError(err.message);
    }
  };

  const summary = lines
    .filter((line) => Number(line.amount) > 0)
    .map((line) => `${categoryLabel(line.category)} ${formatRupees(line.amount)}`)
    .join(' · ');

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <form onSubmit={save} onClick={(event) => event.stopPropagation()} className="a-card my-4 grid w-full max-w-2xl gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{editing ? 'Edit collection' : 'New collection'}</h2>
          <p className="mt-1 text-sm text-clinic-clay">Money taken in, with the phone number and what it was for.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date *">
            <Input type="date" value={form.collection_date} onChange={set('collection_date')} required />
          </Field>
          <Field label="Clinic *">
            <Select value={form.clinic_id} onChange={set('clinic_id')} options={clinics.map((clinic) => [clinic.id, clinic.name])} />
          </Field>
        </div>

        {editing ? (
          <SingleCategory form={form} set={set} options={categoryOptions} />
        ) : categoryOptions.length === 0 ? (
          <p className="text-sm text-clinic-clay">Tick at least one test under Billing. Only those tests can be added to the bill.</p>
        ) : (
          <>
            <TestChecklist lines={lines} onChange={setLines} allowedIds={allowedIds} />
            {summary && <p className="text-sm text-clinic-ink">{summary}</p>}
            <details className="rounded-xl border border-clinic-sand bg-clinic-parchment/50 px-3 py-2">
              <summary className="cursor-pointer text-sm font-semibold text-clinic-maroon">Or save as one category</summary>
              <div className="mt-3">
                <SingleCategory form={form} set={set} options={categoryOptions} />
              </div>
            </details>
          </>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <Input data-testid="phone" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="off" placeholder="10-digit mobile" />
          </Field>
          <Field label="Received as">
            <Select value={form.method} onChange={set('method')} options={PAYMENT_METHODS} />
          </Field>
        </div>
        <Field label="Reference">
          <Input value={form.reference} onChange={set('reference')} placeholder="UPI reference, receipt, doctor…" />
        </Field>
        <Field label="Notes">
          <TextArea value={form.notes} onChange={set('notes')} rows={2} placeholder="Optional note for this collection" />
        </Field>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" className="a-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" data-testid="save-collection" className="a-btn-primary">Save</button>
        </div>
      </form>

    </div>
  );
}

function TestChecklist({ lines, onChange, allowedIds }) {
  const selected = new Set(lines.map((line) => line.category));
  const groups = SERVICE_GROUPS
    .map((group) => ({ ...group, ids: group.ids.filter((id) => !allowedIds || allowedIds.has(id)) }))
    .filter((group) => group.ids.length);
  const presets = SERVICE_PRESETS.filter((preset) => preset.services.some((id) => !allowedIds || allowedIds.has(id)));
  const toggle = (id) => {
    onChange(selected.has(id) ? lines.filter((line) => line.category !== id) : [...lines, emptyLine(id)]);
  };
  const setAmount = (id, amount) => {
    onChange(lines.map((line) => (line.category === id ? { ...line, amount } : line)));
  };

  return (
    <div data-testid="test-checklist">
      <p className="text-sm font-semibold text-clinic-ink">Click a test to add it</p>
      <p className="mt-1 text-sm text-clinic-clay">Tick every test that was paid for. Each one gets its own amount. Phone, reference, and note are copied onto each row.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            data-testid={`preset-${preset.id}`}
            className="a-btn-secondary"
            onClick={() => onChange(applyPreset(lines, preset).filter((line) => !allowedIds || allowedIds.has(line.category)))}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <fieldset key={group.title} className="min-w-0">
            <legend className="text-xs font-semibold uppercase tracking-wider text-clinic-umber">{group.title}</legend>
            <div className="mt-2 grid gap-1.5">
              {group.ids.map((id) => {
                const line = lines.find((item) => item.category === id);
                const on = selected.has(id);
                return (
                  <div key={id} className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${on ? 'border-clinic-maroon bg-clinic-saffronSoft/60' : 'border-clinic-sand/80 bg-white'}`}>
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        data-testid={`service-${id}`}
                        checked={on}
                        onChange={() => toggle(id)}
                      />
                      <span className="text-sm">{categoryLabel(id)}</span>
                    </label>
                    {on && (
                      <input
                        className="a-input w-24"
                        data-testid={`service-amount-${id}`}
                        inputMode="decimal"
                        placeholder="₹"
                        aria-label={`Amount for ${categoryLabel(id)}`}
                        value={line?.amount ?? ''}
                        onChange={(event) => setAmount(id, event.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function SingleCategory({ form, set, options }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Category *">
        <Select data-testid="category" value={form.category} onChange={set('category')} options={options} />
      </Field>
      <Field label="Amount (₹) *">
        <Input data-testid="amount" value={form.amount} onChange={set('amount')} inputMode="decimal" placeholder="0.00" />
      </Field>
    </div>
  );
}
