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

export function CollectionEditor({ clinics, initial, onSubmit, onClose }) {
  const editing = Boolean(initial?.id);
  const [form, setForm] = useState(() => ({
    collection_date: initial?.collection_date || localDateISO(),
    clinic_id: initial?.clinic_id || clinics[0]?.id || '',
    category: initial?.category || 'pta',
    amount: initial?.amount ?? '',
    method: initial?.method || 'cash',
    phone: initial?.phone || '',
    reference: initial?.reference || '',
    notes: initial?.notes || '',
    mode: 'single',
  }));
  const [lines, setLines] = useState([]);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const save = (event) => {
    event.preventDefault();
    setError('');
    try {
      const rows = buildCollectionRows(form.mode === 'multi' && !editing
        ? { ...form, mode: 'multi', lines }
        : { ...form, mode: 'single' });
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
      <form onSubmit={save} onClick={(event) => event.stopPropagation()} className="a-card my-4 grid w-full max-w-lg gap-4">
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
          <SingleCategory form={form} set={set} />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={form.mode === 'single' ? 'a-btn-primary' : 'a-btn-secondary'} onClick={() => setForm((current) => ({ ...current, mode: 'single' }))}>
                One category
              </button>
              <button type="button" data-testid="mode-multi" className={form.mode === 'multi' ? 'a-btn-primary' : 'a-btn-secondary'} onClick={() => { setForm((current) => ({ ...current, mode: 'multi' })); setServicesOpen(true); }}>
                Several services
              </button>
            </div>
            {form.mode === 'single' ? <SingleCategory form={form} set={set} /> : (
              <div className="rounded-xl border border-clinic-sand bg-clinic-parchment/60 p-3">
                <p className="text-sm text-clinic-ink">{summary || 'No services chosen yet.'}</p>
                <button type="button" data-testid="open-services" className="a-btn-secondary mt-3" onClick={() => setServicesOpen(true)}>
                  Choose services
                </button>
              </div>
            )}
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

      {servicesOpen && (
        <ServiceDialog
          lines={lines}
          onChange={setLines}
          onClose={() => setServicesOpen(false)}
        />
      )}
    </div>
  );
}

function SingleCategory({ form, set }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Category *">
        <Select data-testid="category" value={form.category} onChange={set('category')} options={CATEGORIES} />
      </Field>
      <Field label="Amount (₹) *">
        <Input data-testid="amount" value={form.amount} onChange={set('amount')} inputMode="decimal" placeholder="0.00" />
      </Field>
    </div>
  );
}

function ServiceDialog({ lines, onChange, onClose }) {
  const selected = new Set(lines.map((line) => line.category));
  const toggle = (id) => {
    onChange(selected.has(id) ? lines.filter((line) => line.category !== id) : [...lines, emptyLine(id)]);
  };
  const setAmount = (id, amount) => {
    onChange(lines.map((line) => (line.category === id ? { ...line, amount } : line)));
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/50 p-4" onClick={(event) => { event.stopPropagation(); onClose(); }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="a-card my-4 w-full max-w-xl"
      >
        <h2 id="service-dialog-title" className="font-heading text-xl font-semibold text-clinic-maroon">Services for this visit</h2>
        <p className="mt-1 text-sm text-clinic-clay">Tick every service that was paid for. Each one is saved with its own amount. Phone, reference, and note are copied onto each row.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SERVICE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-testid={`preset-${preset.id}`}
              className="a-btn-secondary"
              onClick={() => onChange(applyPreset(lines, preset))}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4">
          {SERVICE_GROUPS.map((group) => (
            <fieldset key={group.title}>
              <legend className="text-xs font-semibold uppercase tracking-wider text-clinic-umber">{group.title}</legend>
              <div className="mt-2 grid gap-2">
                {group.ids.map((id) => {
                  const line = lines.find((item) => item.category === id);
                  return (
                    <label key={id} className="flex items-center gap-3 rounded-xl border border-clinic-sand/80 bg-white px-3 py-2">
                      <input
                        type="checkbox"
                        data-testid={`service-${id}`}
                        checked={selected.has(id)}
                        onChange={() => toggle(id)}
                      />
                      <span className="min-w-0 flex-1 text-sm">{categoryLabel(id)}</span>
                      {selected.has(id) && (
                        <input
                          className="a-input w-28"
                          data-testid={`service-amount-${id}`}
                          inputMode="decimal"
                          placeholder="₹"
                          aria-label={`Amount for ${categoryLabel(id)}`}
                          value={line?.amount ?? ''}
                          onChange={(event) => setAmount(id, event.target.value)}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" data-testid="services-done" className="a-btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
