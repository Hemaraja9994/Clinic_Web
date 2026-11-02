import React, { useEffect, useState } from 'react';

import { api, formatDate, todayISO } from '../api.js';
import { CollectionEditor } from '../../shared/CollectionEditor.jsx';
import {
  CATEGORIES,
  PAYMENT_METHODS,
  categoryLabel,
  collectionsToCsv,
  formatRupees,
  methodLabel,
  monthStartISO,
  slugClinicId,
} from '../../shared/collectionCatalog.js';
import { Alert, Field, Input, PageHeader, TextArea } from '../components/ui.jsx';
import { useUser } from '../session.js';

export default function Collections() {
  const user = useUser();
  const today = todayISO();
  const [filters, setFilters] = useState({
    from: monthStartISO(today),
    to: today,
    clinic_id: '',
    category: '',
    method: '',
    q: '',
  });
  const [draftQ, setDraftQ] = useState('');
  const [clinics, setClinics] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState(null);
  const [addingClinic, setAddingClinic] = useState(false);

  const load = async (next = filters) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) if (value) params.set(key, value);
    try {
      const [collectionData, clinicData] = await Promise.all([
        api(`/collections?${params.toString()}`),
        api('/clinics'),
      ]);
      setRows(collectionData.collections);
      setClinics(clinicData.clinics);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (event) => {
    event?.preventDefault();
    const next = { ...filters, q: draftQ };
    setFilters(next);
    load(next);
  };

  const setFilter = (key) => (event) => {
    const next = { ...filters, [key]: event.target.value, q: draftQ };
    setFilters(next);
    load(next);
  };

  const save = async (incoming) => {
    try {
      if (editor?.id) {
        await api(`/collections/${editor.id}`, { method: 'PATCH', body: incoming[0] });
      } else {
        await api('/collections', { method: 'POST', body: { rows: incoming } });
      }
      setEditor(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      await api(`/collections/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  return (
    <>
      <PageHeader
        title="Collections"
        subtitle="Money taken in each day, split by what it was for. Record one category, or several services from the same visit."
        actions={(
          <>
            <button type="button" className="a-btn-secondary" onClick={() => downloadCsv(rows)}>Export CSV</button>
            <button type="button" className="a-btn-secondary" onClick={() => setAddingClinic(true)}>Add clinic</button>
            <button type="button" className="a-btn-primary" onClick={() => setEditor({})}>Record collection</button>
          </>
        )}
      />
      <form onSubmit={apply} className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Filter label="From"><input className="a-input" type="date" value={filters.from} onChange={setFilter('from')} /></Filter>
        <Filter label="To"><input className="a-input" type="date" value={filters.to} onChange={setFilter('to')} /></Filter>
        <Filter label="Clinic">
          <select className="a-input" value={filters.clinic_id} onChange={setFilter('clinic_id')}>
            <option value="">All</option>
            {clinics.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}
          </select>
        </Filter>
        <Filter label="Category">
          <select className="a-input" value={filters.category} onChange={setFilter('category')}>
            <option value="">All</option>
            {CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </Filter>
        <Filter label="Method">
          <select className="a-input" value={filters.method} onChange={setFilter('method')}>
            <option value="">All</option>
            {PAYMENT_METHODS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </Filter>
        <Filter label="Search">
          <span className="flex gap-2">
            <input className="a-input" placeholder="Phone, reference or note…" value={draftQ} onChange={(event) => setDraftQ(event.target.value)} />
            <button type="submit" className="a-btn-secondary">Search</button>
          </span>
        </Filter>
      </form>
      <Alert>{error}</Alert>
      <div className="a-card overflow-x-auto p-0">
        <table className="a-table">
          <thead>
            <tr>
              <th>Date</th><th>Clinic</th><th>Category</th><th>Method</th><th>Phone</th><th>Reference</th><th>Notes</th><th>Amount</th><th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-clinic-clay">No collections in this range.</td></tr>}
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="whitespace-nowrap">{formatDate(row.collection_date)}</td>
                <td>{row.clinic_name}</td>
                <td>{categoryLabel(row.category)}</td>
                <td>{methodLabel(row.method)}</td>
                <td className="whitespace-nowrap">{row.phone || '—'}</td>
                <td>{row.reference || '—'}</td>
                <td>{row.notes || '—'}</td>
                <td className="whitespace-nowrap font-semibold">{formatRupees(row.amount)}</td>
                <td className="whitespace-nowrap">
                  <button type="button" className="text-sm font-semibold text-clinic-maroon" onClick={() => setEditor(row)}>Edit</button>
                  {user.role === 'admin' && <button type="button" className="ml-3 text-sm text-red-700" onClick={() => remove(row)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-clinic-clay">{rows.length} record{rows.length === 1 ? '' : 's'} · {formatRupees(total)}</p>
      {editor && <CollectionEditor clinics={clinics} initial={editor.id ? editor : null} onSubmit={save} onClose={() => setEditor(null)} />}
      {addingClinic && <ClinicForm onClose={() => setAddingClinic(false)} onSaved={() => { setAddingClinic(false); load(); }} />}
    </>
  );
}

function Filter({ label, children }) {
  return <label className="block"><span className="a-label">{label}</span>{children}</label>;
}

function downloadCsv(rows) {
  const blob = new Blob([collectionsToCsv(rows)], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `collections-${todayISO()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function ClinicForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', city: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    try {
      await api('/clinics', { method: 'POST', body: { ...form, id: slugClinicId(form.name) } });
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <form onSubmit={save} onClick={(event) => event.stopPropagation()} className="a-card grid w-full max-w-md gap-3">
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Add clinic</h2>
        <p className="text-sm text-clinic-clay">Huggies, ear tips, domes, and the combined hearing tests are available for every clinic.</p>
        <Field label="Clinic name *"><Input value={form.name} onChange={set('name')} required /></Field>
        <Field label="City"><Input value={form.city} onChange={set('city')} /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={set('phone')} /></Field>
        <Field label="Address"><TextArea value={form.address} onChange={set('address')} rows={2} /></Field>
        <Alert>{error}</Alert>
        <div className="flex justify-end gap-2">
          <button type="button" className="a-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
