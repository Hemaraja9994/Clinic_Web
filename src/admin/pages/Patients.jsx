import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { api, formatDate } from '../api.js';
import { Alert, PageHeader } from '../components/ui.jsx';
import { navigate } from '../session.js';
import { PatientForm } from './PatientDetail.jsx';

export default function Patients() {
  const [q, setQ] = useState('');
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  const load = () => api(`/patients${q ? `?q=${encodeURIComponent(q)}` : ''}`).then((d) => setList(d.patients)).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader
        title="Patients"
        subtitle="Search by name, phone or registration number."
        actions={<button type="button" className="a-btn-primary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" />Register patient</button>}
      />
      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mb-4 flex max-w-lg gap-2">
        <input className="a-input" placeholder="Name, phone or SR-2026-…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
        <button type="submit" className="a-btn-secondary">Search</button>
      </form>
      <Alert>{error}</Alert>
      <div className="a-card overflow-x-auto p-0">
        <table className="a-table">
          <thead><tr><th>Reg. no.</th><th>Name</th><th>Age / sex</th><th>Phone</th><th>Registered</th></tr></thead>
          <tbody>
            {list && list.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-clinic-clay">No patients found.</td></tr>}
            {list?.map((p) => (
              <tr key={p.id} className="cursor-pointer hover:bg-clinic-ivory" onClick={() => navigate(`/patients/${p.id}`)}>
                <td className="whitespace-nowrap font-mono text-xs">{p.reg_no}</td>
                <td className="font-semibold text-clinic-maroon">{p.name}</td>
                <td>{[p.age, p.sex].filter(Boolean).join(' / ')}</td>
                <td>{p.phone}</td>
                <td className="whitespace-nowrap">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {adding && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4" onClick={() => setAdding(false)}>
          <div className="mx-auto my-8 max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <PatientForm onSaved={({ id }) => navigate(`/patients/${id}`)} onCancel={() => setAdding(false)} />
          </div>
        </div>
      )}
    </>
  );
}
