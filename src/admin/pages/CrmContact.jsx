import React, { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Plus, Trash2, UserPlus } from 'lucide-react';

import { api, todayISO } from '../api.js';
import { Alert, Field, Input, PageHeader, Select } from '../components/ui.jsx';
import {
  formatSavedDate,
  ContactForm,
  ContactLinks,
  ContactStatusBadge,
  DealForm,
  DoneForm,
  DueDatePicker,
  KIND_ICON,
  NextAction,
  RescheduleSelect,
  StageBadge,
  staffOptions,
  useStaff,
} from '../components/crm.jsx';
import { navigate, useUser } from '../session.js';
import {
  ACTIVITY_KINDS,
  CRM_STAGES,
  DEAL_TYPES,
  LEAD_SOURCES,
  addDays,
  displayPhone,
  followUpBucket,
  formatRupees,
  labelOf,
  prettyDate,
} from '../../shared/crm.js';

// Stored times are UTC ("2026-11-13 04:30:00"); show them in the browser's time (IST at the clinic).
function when(ts) {
  if (!ts) return '';
  const d = new Date(`${String(ts).replace(' ', 'T')}Z`);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const byDue = (a, b) => (a.due_date === b.due_date ? a.id - b.id : a.due_date < b.due_date ? -1 : 1);

// One person: their next action, deals, and everything said and done so far.
export default function CrmContact({ id }) {
  const user = useUser();
  const today = todayISO();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [dealForm, setDealForm] = useState(null); // {} for a new deal, or the deal being edited
  const [doing, setDoing] = useState(null);

  const load = () => api(`/crm/contacts/${id}`).then(setData).catch((e) => setError(e.message));

  useEffect(() => {
    setData(null);
    setError('');
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = (
    <a href="#/crm/contacts" className="mb-3 inline-flex items-center gap-1.5 text-base font-semibold text-clinic-maroon hover:text-clinic-maroonDeep">
      <ArrowLeft className="h-4 w-4" />Leads & customers
    </a>
  );

  if (!data) {
    return (
      <>
        {back}
        <Alert>{error}</Alert>
        {!error && <p className="text-clinic-clay">Loading…</p>}
      </>
    );
  }

  const { contact: c, deals, activities } = data;
  const dealStage = Object.fromEntries(deals.map((d) => [d.id, d.stage]));
  const planned = activities.filter((a) => a.due_date && !a.done_at).sort(byDue);
  const history = activities.filter((a) => !(a.due_date && !a.done_at));
  const next = planned[0];
  const asItem = (a) => ({ ...a, contact_name: c.name, deal_stage: dealStage[a.deal_id] });

  const act = async (fn) => {
    setError('');
    try {
      await fn();
      load();
    } catch (e) {
      setError(e.message);
    }
  };
  const reschedule = (a, due) => act(() => api(`/crm/activities/${a.id}`, { method: 'PATCH', body: { due_date: due } }));
  const moveDeal = (deal, stage) => {
    if (stage === deal.stage) return;
    if (stage === 'lost') { setDealForm({ ...deal, stage: 'lost' }); return; } // asks for the reason
    act(() => api(`/crm/deals/${deal.id}`, { method: 'PATCH', body: { stage } }));
  };
  const registerPatient = () => act(async () => {
    const { id: patientId } = await api('/patients', { method: 'POST', body: { name: c.name, age: c.age, phone: c.phone } });
    await api(`/crm/contacts/${c.id}`, { method: 'PATCH', body: { patient_id: patientId } });
  });
  const removeEntry = (a) => {
    if (window.confirm('Delete this entry from the history?')) act(() => api(`/crm/activities/${a.id}`, { method: 'DELETE' }));
  };
  const removeContact = async () => {
    if (!window.confirm(`Delete ${c.name} with all their deals and history from the CRM? This cannot be undone.`)) return;
    try {
      await api(`/crm/contacts/${c.id}`, { method: 'DELETE' });
      navigate('/crm/contacts');
    } catch (e) {
      setError(e.message);
    }
  };

  const details = [
    ['Phone', displayPhone(c.phone)],
    ['Second phone', displayPhone(c.alt_phone)],
    ['Age', c.age],
    ['Enquiry is for', c.for_whom],
    ['Preferred language', c.language],
    ['Area', c.area],
    ['How they found us', labelOf(LEAD_SOURCES, c.source)],
    ['Referred by', c.referred_by],
    ['Interested in', c.interest],
    ['Email', c.email],
    ['Looked after by', c.owner_name || 'Unassigned'],
    ['Added', formatSavedDate(c.created_at)],
  ];
  const urgent = !next || followUpBucket(next.due_date, today) === 'overdue';

  return (
    <>
      {back}
      <PageHeader
        title={c.name}
        subtitle={(
          <span className="flex flex-wrap items-center gap-2">
            <ContactStatusBadge status={c.status} />
            <span>{displayPhone(c.phone)}{c.interest ? ` · ${c.interest}` : ''}</span>
          </span>
        )}
        actions={(
          <>
            <ContactLinks phone={c.phone} name={c.name} />
            <button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" />Edit</button>
          </>
        )}
      />
      <Alert>{error}</Alert>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid content-start gap-5">
          <section className={`a-card border-2 ${urgent ? 'border-[#e7b4b4]' : 'border-[#e8c48f]'}`}>
            <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Next action</h2>
            {next ? (
              <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-lg">
                  <NextAction due={next.due_date} body={next.body} kind={next.kind} today={today} />
                  <p className="mt-1 text-sm text-clinic-clay">
                    {next.assigned_name ? `For ${next.assigned_name}` : 'Unassigned'}{next.deal_title ? ` · ${next.deal_title}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button type="button" className="a-btn-primary min-h-8 px-3 text-xs" onClick={() => setDoing(asItem(next))}>Done</button>
                  <RescheduleSelect onPick={(due) => reschedule(next, due)} label="Move" />
                </div>
              </div>
            ) : (
              <p className="mt-2 font-semibold text-[#9f1239]">No next action. Plan one below so {c.name} is not forgotten.</p>
            )}
            {planned.length > 1 && (
              <div className="mt-4 border-t border-[#efe3d4] pt-3">
                <p className="text-sm font-semibold text-clinic-clay">Also planned</p>
                <ul className="mt-1 divide-y divide-[#efe3d4]">
                  {planned.slice(1).map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <NextAction due={a.due_date} body={a.body} kind={a.kind} today={today} />
                      <div className="flex gap-1">
                        <button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setDoing(asItem(a))}>Done</button>
                        <RescheduleSelect onPick={(due) => reschedule(a, due)} label="Move" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <AddEntry contact={c} deals={deals} onSaved={load} />
          </section>

          <section className="a-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Deals</h2>
              <button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setDealForm({})}><Plus className="h-3.5 w-3.5" />Add deal</button>
            </div>
            {deals.length === 0 ? (
              <p className="mt-2 text-clinic-clay">No deals yet. Add one when they show interest in hearing aids, therapy or tests.</p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {deals.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2d3c2] p-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-semibold">{d.title} <StageBadge stage={d.stage} /></p>
                      <p className="text-sm text-clinic-clay">
                        {[
                          d.title !== labelOf(DEAL_TYPES, d.deal_type) ? labelOf(DEAL_TYPES, d.deal_type) : null,
                          d.value > 0 ? formatRupees(d.value) : null,
                          d.expected_close ? `close by ${prettyDate(d.expected_close)}` : null,
                          d.owner_name,
                        ].filter(Boolean).join(' · ')}
                      </p>
                      {d.stage === 'lost' && d.lost_reason && <p className="text-sm">Reason lost: {d.lost_reason}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        aria-label={`Stage for ${d.title}`}
                        className="h-[2.6rem] rounded-[0.85rem] border-[1.5px] border-[#c4ad96] bg-[#fffdfb] px-2 text-[0.95rem] font-semibold"
                        value={d.stage}
                        onChange={(e) => moveDeal(d, e.target.value)}
                      >
                        {CRM_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                      <button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setDealForm(d)}>Edit</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="a-card">
            <h2 className="font-heading text-xl font-semibold text-clinic-maroon">History</h2>
            {history.length === 0 ? (
              <p className="mt-2 text-clinic-clay">Nothing recorded yet.</p>
            ) : (
              <ol className="mt-2 divide-y divide-[#efe3d4]">
                {history.map((a) => {
                  const Icon = KIND_ICON[a.kind] || KIND_ICON.note;
                  const canDelete = a.kind !== 'stage' ? user.role === 'admin' || a.created_by === user.id : user.role === 'admin';
                  return (
                    <li key={a.id} className="flex gap-3 py-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f6ecdf] text-clinic-maroon"><Icon className="h-4 w-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className={a.kind === 'stage' ? 'font-semibold' : ''}>{a.body}</p>
                        {a.outcome && <p className="text-base text-clinic-ink">→ {a.outcome}</p>}
                        <p className="text-xs text-clinic-clay">
                          {[
                            a.kind === 'stage' ? 'Pipeline' : labelOf(ACTIVITY_KINDS, a.kind),
                            a.created_name || (a.created_by ? null : 'Website'),
                            when(a.done_at || a.created_at),
                            a.kind !== 'stage' ? a.deal_title : null,
                            a.due_date ? `was due ${prettyDate(a.due_date)}` : null,
                          ].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      {canDelete && (
                        <button type="button" className="self-start rounded-lg p-2 text-clinic-clay hover:bg-[#fde8e8] hover:text-[#9f1239]" title="Delete entry" aria-label="Delete entry" onClick={() => removeEntry(a)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="a-card">
            <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Details</h2>
            <dl className="mt-3 grid gap-2.5">
              {details.filter(([, value]) => value).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-clinic-clay">{label}</dt>
                  <dd className="font-medium text-clinic-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {c.notes && <p className="mt-3 whitespace-pre-line rounded-xl bg-[#f6ecdf] px-3 py-2 text-base">{c.notes}</p>}
            <div className="mt-4 border-t border-[#efe3d4] pt-3">
              {c.patient_id ? (
                <a href={`#/patients/${c.patient_id}`} className="font-semibold text-clinic-maroon underline">Patient record {c.patient_reg_no || ''}</a>
              ) : (
                <button type="button" className="a-btn-secondary w-full" onClick={registerPatient}><UserPlus className="h-4 w-4" />Register as patient</button>
              )}
            </div>
          </section>
          {user.role === 'admin' && (
            <section className="a-card">
              <h2 className="text-base font-semibold text-clinic-ink">Remove from CRM</h2>
              <p className="mt-1 text-sm text-clinic-clay">Deletes this person, their deals and history. Patient records are not touched.</p>
              <button type="button" className="a-btn-danger mt-3" onClick={removeContact}><Trash2 className="h-4 w-4" />Delete contact</button>
            </section>
          )}
        </aside>
      </div>

      {editing && <ContactForm contact={c} onClose={(changed) => { setEditing(false); if (changed) load(); }} />}
      {dealForm && <DealForm deal={dealForm.id ? dealForm : null} contactId={c.id} onClose={(changed) => { setDealForm(null); if (changed) load(); }} />}
      {doing && <DoneForm item={doing} onClose={(changed) => { setDoing(null); if (changed) load(); }} />}
    </>
  );
}

// Plan the next follow-up, or log a call / visit / message that already happened.
function AddEntry({ contact, deals, onSaved }) {
  const staff = useStaff();
  const openDeal = deals.find((d) => d.stage !== 'won' && d.stage !== 'lost');
  const [mode, setMode] = useState('plan');
  const [form, setForm] = useState({
    kind: 'call',
    body: '',
    due_date: addDays(todayISO(), 1),
    deal_id: openDeal ? String(openDeal.id) : '',
    assigned_to: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/crm/activities', {
        method: 'POST',
        body: {
          contact_id: contact.id,
          kind: form.kind,
          body: form.body,
          deal_id: form.deal_id || null,
          due_date: mode === 'plan' ? form.due_date : null,
          assigned_to: mode === 'plan' ? form.assigned_to || null : null,
        },
      });
      setForm((f) => ({ ...f, body: '' }));
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-5 grid gap-3 rounded-xl border border-[#ddcbb8] bg-[#fbf6ef] p-4">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="What to add">
        {[['plan', 'Plan a follow-up'], ['log', 'Log what happened']].map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
            className={`min-h-10 rounded-full border px-4 py-1.5 text-sm font-semibold ${mode === value ? 'border-transparent bg-clinic-maroon text-[#fff6ee]' : 'border-[#c4ad96] bg-[#fffdfb] text-clinic-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
        <Field label="How"><Select value={form.kind} onChange={set('kind')} options={ACTIVITY_KINDS} /></Field>
        <Field label={mode === 'plan' ? 'What to do' : 'What happened'}>
          <Input
            value={form.body}
            onChange={set('body')}
            placeholder={mode === 'plan' ? 'e.g. Remind about hearing-aid trial return' : 'e.g. Called – will visit with son on Saturday'}
          />
        </Field>
      </div>
      {mode === 'plan' && <DueDatePicker value={form.due_date} onChange={set('due_date')} />}
      <div className="grid gap-3 sm:grid-cols-2">
        {deals.length > 0 && (
          <Field label="About which deal"><Select value={form.deal_id} onChange={set('deal_id')} options={[['', 'General'], ...deals.map((d) => [String(d.id), d.title])]} /></Field>
        )}
        {mode === 'plan' && (
          <Field label="Assigned to"><Select value={form.assigned_to} onChange={set('assigned_to')} options={staffOptions(staff, 'Whoever looks after them')} /></Field>
        )}
      </div>
      <Alert>{error}</Alert>
      <div className="flex justify-end">
        <button type="submit" className="a-btn-primary" disabled={busy}>{mode === 'plan' ? 'Add follow-up' : 'Save to history'}</button>
      </div>
    </form>
  );
}
