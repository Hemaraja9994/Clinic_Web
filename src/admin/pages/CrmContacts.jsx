import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

import { api, todayISO } from '../api.js';
import { Alert, PageHeader, Select } from '../components/ui.jsx';
import { ContactStatusBadge, CrmTabs, NextAction, StageBadge, formatSavedDate } from '../components/crm.jsx';
import { LEAD_SOURCES, contactsToCsv, displayPhone, formatRupees, labelOf } from '../../shared/crm.js';

const VIEWS = [
  ['', 'All'],
  ['lead', 'Leads'],
  ['customer', 'Customers'],
  ['inactive', 'Inactive'],
];

// Everyone in the CRM, with the next action promised to each. Leads with no next action are the ones slipping away.
export default function CrmContacts() {
  const today = todayISO();
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [noNext, setNoNext] = useState(false);
  const [q, setQ] = useState('');
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (source) p.set('source', source);
    if (noNext) p.set('next', 'none');
    if (q.trim()) p.set('q', q.trim());
    return api(`/crm/contacts?${p}`).then((d) => setList(d.contacts)).catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, [status, source, noNext]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader
        title="CRM"
        subtitle="Leads become customers when a deal is won. Anyone without a next action is easy to forget – give them one."
        actions={list?.length ? (
          <button type="button" className="a-btn-secondary" onClick={() => downloadCsv(list)}><Download className="h-4 w-4" />Export CSV</button>
        ) : null}
      />
      <CrmTabs current="contacts" />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {VIEWS.map(([value, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => setStatus(value)}
            className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold ${status === value ? 'border-transparent bg-clinic-maroonDeep text-[#fff6ee]' : 'border-[#c4ad96] bg-[#fffdfb] text-clinic-ink'}`}
          >
            {label}
          </button>
        ))}
        <label className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#c4ad96] bg-[#fffdfb] px-4 text-sm font-semibold">
          <input type="checkbox" className="h-4 w-4" checked={noNext} onChange={(e) => setNoNext(e.target.checked)} />
          No next action
        </label>
        <div className="w-full sm:w-60"><Select value={source} onChange={setSource} options={[['', 'All sources'], ...LEAD_SOURCES]} aria-label="Lead source" /></div>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex w-full gap-2 sm:ml-auto sm:w-auto">
          <input className="a-input sm:w-60" placeholder="Name, phone, area, doctor" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search contacts" />
          <button className="a-btn-secondary" type="submit">Search</button>
        </form>
      </div>
      <Alert>{error}</Alert>

      <div className="a-card overflow-x-auto p-0">
        <table className="a-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Interested in</th><th>Stage</th><th>Next action</th><th>Source</th><th>Looked after by</th></tr>
          </thead>
          <tbody>
            {list === null && !error && <tr><td colSpan={7} className="py-8 text-center text-clinic-clay">Loading…</td></tr>}
            {list?.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-clinic-clay">No one here yet. Use “New lead” to add an enquiry.</td></tr>}
            {list?.map((c) => (
              <tr key={c.id}>
                <td className="min-w-[11rem]">
                  <a href={`#/crm/contacts/${c.id}`} className="font-semibold text-clinic-maroon underline">{c.name}</a>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <ContactStatusBadge status={c.status} />
                    {(c.age || c.for_whom) && <span className="text-xs text-clinic-clay">{[c.for_whom, c.age].filter(Boolean).join(' · ')}</span>}
                  </span>
                </td>
                <td className="whitespace-nowrap">{displayPhone(c.phone)}</td>
                <td className="min-w-[10rem]">
                  {c.interest || <span className="text-clinic-clay">–</span>}
                  {c.open_value > 0 && <span className="block text-sm font-semibold">{formatRupees(c.open_value)}</span>}
                </td>
                <td><StageBadge stage={c.stage} /></td>
                <td className="min-w-[14rem] max-w-xs">
                  <NextAction due={c.next_due} body={c.next_body} kind={c.next_kind} today={today} empty={c.status === 'lead' ? 'No next action set' : 'None planned'} />
                </td>
                <td className="text-sm">
                  {labelOf(LEAD_SOURCES, c.source)}
                  {c.referred_by && <span className="block text-xs text-clinic-clay">{c.referred_by}</span>}
                </td>
                <td className="whitespace-nowrap text-sm">
                  {c.owner_name || <span className="text-clinic-clay">Unassigned</span>}
                  <span className="block text-xs text-clinic-clay">Added {formatSavedDate(c.created_at)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function downloadCsv(rows) {
  const blob = new Blob([contactsToCsv(rows)], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `crm-contacts-${todayISO()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
