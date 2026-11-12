// Pieces shared by the CRM pages: tabs, badges, the "next action" line and the pop-up forms.
import React, { useEffect, useState } from 'react';
import {
  ArrowRightLeft,
  BellRing,
  CalendarClock,
  CircleAlert,
  Footprints,
  KanbanSquare,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  StickyNote,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react';

import { api, formatDate, todayISO } from '../api.js';
import { SERVICE_NAMES, whatsappLink } from '../constants.js';
import { navigate, useUser } from '../session.js';
import {
  ACTIVITY_KINDS,
  CONTACT_STATUSES,
  CRM_STAGES,
  DEAL_TYPES,
  FOR_WHOM,
  LEAD_SOURCES,
  LOST_REASONS,
  QUICK_DUES,
  addDays,
  crmPhone,
  dueLabel,
  followUpBucket,
  labelOf,
  stageLabel,
} from '../../shared/crm.js';
import { Alert, Field, Input, Select, TextArea } from './ui.jsx';

export const LANGUAGES = ['', 'Telugu', 'English', 'Hindi', 'Odia', 'Tamil', 'Kannada', 'Other'];

export const KIND_ICON = {
  call: Phone,
  whatsapp: MessageCircle,
  visit: Footprints,
  sms: MessageSquare,
  email: Mail,
  note: StickyNote,
  stage: ArrowRightLeft,
};

// Staff list for "owner" and "assigned to" boxes.
export function useStaff() {
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    api('/crm/staff').then((d) => setStaff(d.staff)).catch(() => {});
  }, []);
  return staff;
}

export function staffOptions(staff, emptyLabel = 'Unassigned') {
  return [['', emptyLabel], ...staff.map((s) => [String(s.id), s.full_name])];
}

const TABS = [
  ['pipeline', '/crm', 'Pipeline', KanbanSquare],
  ['followups', '/crm/followups', 'Follow-ups', BellRing],
  ['contacts', '/crm/contacts', 'Leads & customers', UsersRound],
];

// refreshKey: pass the page's data so the follow-up count updates after the page reloads it.
export function CrmTabs({ current, refreshKey }) {
  const [due, setDue] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api(`/crm/summary?today=${todayISO()}`)
      .then((d) => setDue(d.followUps.overdue + d.followUps.today))
      .catch(() => {});
  }, [refreshKey]);

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {TABS.map(([id, href, label, Icon]) => (
        <a
          key={id}
          href={`#${href}`}
          aria-current={current === id ? 'page' : undefined}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
            current === id ? 'border-transparent bg-clinic-maroon text-[#fff6ee]' : 'border-[#c4ad96] bg-[#fffdfb] text-clinic-ink hover:border-clinic-maroon'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
          {id === 'followups' && due > 0 && (
            <span className="rounded-full bg-[#b42318] px-2 text-xs font-bold leading-6 text-white" title="Overdue or due today">{due}</span>
          )}
        </a>
      ))}
      <button type="button" className="a-btn-primary sm:ml-auto" onClick={() => setAdding(true)}>
        <UserRoundPlus className="h-4 w-4" />New lead
      </button>
      {adding && <ContactForm onClose={(id) => { setAdding(false); if (typeof id === 'number') navigate(`/crm/contacts/${id}`); }} />}
    </div>
  );
}

const STAGE_STYLES = {
  new: 'bg-[#f6e6d4] text-[#6b3a12]',
  contacted: 'bg-[#f3e2c4] text-[#5c3d0b]',
  booked: 'bg-[#e4ecf4] text-[#1e3a5f]',
  assessed: 'bg-[#e3eeee] text-[#1f4a52]',
  proposal: 'bg-[#efe3f0] text-[#5a2a5e]',
  won: 'bg-[#e7f2e4] text-[#1b4332]',
  lost: 'bg-[#e8ded1] text-[#3e2715]',
};

export function StageBadge({ stage }) {
  if (!stage) return <span className="text-sm text-clinic-clay">No deal</span>;
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${STAGE_STYLES[stage] || STAGE_STYLES.lost}`}>{stageLabel(stage)}</span>;
}

const STATUS_STYLES = {
  lead: 'bg-[#f6e6d4] text-[#6b3a12]',
  customer: 'bg-[#e7f2e4] text-[#1b4332]',
  inactive: 'bg-[#e8ded1] text-[#3e2715]',
};

export function ContactStatusBadge({ status }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.inactive}`}>{labelOf(CONTACT_STATUSES, status)}</span>;
}

// Saved times are UTC ("2026-11-12 20:15:00"). These give the date as it was at the clinic (browser time),
// so something saved at 1 am IST is not shown as "yesterday".
export function savedDateISO(ts) {
  if (!ts) return '';
  const s = String(ts);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(`${s.replace(' ', 'T')}Z`);
  return Number.isNaN(d.getTime()) ? s.slice(0, 10) : todayISO(d);
}

export function formatSavedDate(ts) {
  const iso = savedDateISO(ts);
  return iso ? formatDate(iso) : '';
}

export function dueTone(due, today) {
  const bucket = followUpBucket(due, today);
  if (bucket === 'overdue') return 'text-[#b42318]';
  if (bucket === 'today') return 'text-[#8a4b08]';
  return 'text-clinic-clay';
}

// "Today · Call to confirm…" in one place, with the date coloured red when overdue.
export function NextAction({ due, body, kind, today, empty = 'No next action set' }) {
  if (!due) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-semibold text-[#9f1239]">
        <CircleAlert className="h-4 w-4 shrink-0" />{empty}
      </p>
    );
  }
  const Icon = KIND_ICON[kind] || CalendarClock;
  return (
    <div className="text-sm">
      <p className={`flex items-center gap-1.5 font-semibold ${dueTone(due, today)}`}>
        <Icon className="h-4 w-4 shrink-0" />{dueLabel(due, today)}
      </p>
      <p className="mt-0.5 line-clamp-2 text-clinic-ink">{body}</p>
    </div>
  );
}

export function ContactLinks({ phone, name }) {
  if (!phone) return null;
  const message = `Namaste ${name || ''}, this is Sri Rudra Speech & Hearing Clinic, MVP Double Road, Visakhapatnam. `;
  return (
    <span className="inline-flex flex-wrap gap-1">
      <a className="a-btn-secondary min-h-8 px-3 text-xs" href={`tel:${phone.length === 10 ? `+91${phone}` : phone}`}>
        <Phone className="h-3.5 w-3.5" />Call
      </a>
      <a className="a-btn-secondary min-h-8 px-3 text-xs" target="_blank" rel="noreferrer" href={whatsappLink(phone, message)}>
        <MessageCircle className="h-3.5 w-3.5" />WhatsApp
      </a>
    </span>
  );
}

export function Modal({ title, onClose, onSubmit, children, width = 'max-w-lg' }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4" onClick={() => onClose()}>
      <form onSubmit={onSubmit} onClick={(e) => e.stopPropagation()} className={`a-card my-6 grid w-full ${width} gap-4`} role="dialog" aria-label={title}>
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{title}</h2>
        {children}
      </form>
    </div>
  );
}

// Date box with quick picks underneath (Today, Tomorrow, In 1 week…).
export function DueDatePicker({ value, onChange, label = 'Follow-up date' }) {
  const today = todayISO();
  return (
    <div>
      <Field label={label}><Input type="date" value={value} onChange={onChange} min={today} /></Field>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {QUICK_DUES.map(([text, days]) => {
          const date = addDays(today, days);
          return (
            <button
              key={text}
              type="button"
              onClick={() => onChange(date)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${value === date ? 'border-transparent bg-clinic-maroon text-[#fff6ee]' : 'border-[#c4ad96] bg-[#fffdfb] text-clinic-ink'}`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const INTEREST_SUGGESTIONS = [...SERVICE_NAMES.filter((s) => !/not sure/i.test(s)), 'Hearing aid trial', 'Hearing aid batteries', 'Speech therapy package', 'Hearing aid repair'];

// New lead (with its first deal and first follow-up) or edit an existing contact.
export function ContactForm({ contact, onClose }) {
  const user = useUser();
  const staff = useStaff();
  const isNew = !contact?.id;
  const [form, setForm] = useState(() => (isNew
    ? { source: 'phone', status: 'lead', owner_id: String(user.id) }
    : { ...contact, owner_id: contact.owner_id ? String(contact.owner_id) : '' }));
  const [deal, setDeal] = useState({ deal_type: 'assessment', stage: 'new', value: '' });
  const [next, setNext] = useState({ kind: 'call', due_date: todayISO(), body: '' });
  const [duplicate, setDuplicate] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // Warn (but don't block) when the phone number is already in the CRM – families often share one phone.
  const checkPhone = async () => {
    const digits = crmPhone(form.phone);
    if (digits.length < 10) { setDuplicate(null); return; }
    try {
      const { contacts } = await api(`/crm/contacts?q=${digits}`);
      setDuplicate(contacts.find((c) => c.id !== contact?.id && (c.phone === digits || c.alt_phone === digits)) || null);
    } catch {
      setDuplicate(null);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isNew) {
        const { id } = await api('/crm/contacts', { method: 'POST', body: { ...form, deal, next } });
        onClose(id);
      } else {
        await api(`/crm/contacts/${contact.id}`, { method: 'PATCH', body: form });
        onClose(true);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={isNew ? 'New lead' : `Edit – ${contact.name}`} onClose={() => onClose(false)} onSubmit={save} width="max-w-2xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name *"><Input value={form.name} onChange={set('name')} required autoFocus /></Field>
        <Field label="Phone *"><Input value={form.phone} onChange={set('phone')} onBlur={checkPhone} inputMode="tel" required /></Field>
      </div>
      {duplicate && (
        <p className="rounded-xl border border-[#e8c48f] bg-[#fff6e5] px-4 py-3 text-sm text-[#6b3a12]">
          This phone number is already saved for <a className="font-semibold underline" href={`#/crm/contacts/${duplicate.id}`} onClick={() => onClose(false)}>{duplicate.name}</a>.
          Open that record instead, or save anyway if this is a different person (for example a second child).
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Age"><Input value={form.age} onChange={set('age')} placeholder="e.g. 62 or 4 yrs" /></Field>
        <Field label="Enquiry is for"><Select value={form.for_whom} onChange={set('for_whom')} options={['', ...FOR_WHOM]} /></Field>
        <Field label="Preferred language"><Select value={form.language} onChange={set('language')} options={LANGUAGES} /></Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="How they found us"><Select value={form.source} onChange={set('source')} options={LEAD_SOURCES} /></Field>
        <Field label="Referred by (doctor / person)"><Input value={form.referred_by} onChange={set('referred_by')} /></Field>
        <Field label="Interested in">
          <Input value={form.interest} onChange={set('interest')} list="crm-interest" placeholder="e.g. Hearing aids for both ears" />
          <datalist id="crm-interest">{INTEREST_SUGGESTIONS.map((s) => <option key={s} value={s} />)}</datalist>
        </Field>
        <Field label="Area / locality"><Input value={form.area} onChange={set('area')} /></Field>
        <Field label="Second phone"><Input value={form.alt_phone} onChange={set('alt_phone')} inputMode="tel" /></Field>
        <Field label="Looked after by"><Select value={form.owner_id} onChange={set('owner_id')} options={staffOptions(staff)} /></Field>
        {!isNew && <Field label="Status"><Select value={form.status} onChange={set('status')} options={CONTACT_STATUSES} /></Field>}
      </div>
      <Field label="Notes (no clinical findings – those go in the patient's report)"><TextArea value={form.notes} onChange={set('notes')} rows={2} /></Field>

      {isNew && (
        <>
          <fieldset className="grid gap-3 rounded-xl border border-[#ddcbb8] p-4 sm:grid-cols-3">
            <legend className="px-1 text-sm font-semibold text-clinic-maroon">Deal – what they may take</legend>
            <Field label="Type"><Select value={deal.deal_type} onChange={(v) => setDeal({ ...deal, deal_type: v })} options={DEAL_TYPES} /></Field>
            <Field label="Stage"><Select value={deal.stage} onChange={(v) => setDeal({ ...deal, stage: v })} options={CRM_STAGES.filter((s) => s.id !== 'won' && s.id !== 'lost').map((s) => [s.id, s.label])} /></Field>
            <Field label="Likely value ₹ (optional)"><Input value={deal.value} onChange={(v) => setDeal({ ...deal, value: v })} inputMode="numeric" placeholder="e.g. 45,000" /></Field>
          </fieldset>
          <fieldset className="grid gap-3 rounded-xl border border-[#ddcbb8] p-4">
            <legend className="px-1 text-sm font-semibold text-clinic-maroon">Next action</legend>
            <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
              <Field label="How"><Select value={next.kind} onChange={(v) => setNext({ ...next, kind: v })} options={ACTIVITY_KINDS} /></Field>
              <Field label="What to do"><Input value={next.body} onChange={(v) => setNext({ ...next, body: v })} placeholder="e.g. Call to fix PTA appointment" /></Field>
            </div>
            <DueDatePicker value={next.due_date} onChange={(v) => setNext({ ...next, due_date: v })} />
          </fieldset>
        </>
      )}

      <Alert>{error}</Alert>
      <div className="flex justify-end gap-2">
        <button type="button" className="a-btn-secondary" onClick={() => onClose(false)}>Cancel</button>
        <button type="submit" className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : isNew ? 'Save lead' : 'Save'}</button>
      </div>
    </Modal>
  );
}

// Add or edit a deal. Moving it to "Lost" asks for the reason.
export function DealForm({ deal, contactId, onClose }) {
  const user = useUser();
  const staff = useStaff();
  const isNew = !deal?.id;
  const [form, setForm] = useState(() => (isNew
    ? { deal_type: 'hearing_aid', stage: 'contacted', value: '', owner_id: String(user.id) }
    : { ...deal, value: deal.value || '', owner_id: deal.owner_id ? String(deal.owner_id) : '' }));
  const [error, setError] = useState('');
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (form.stage === 'lost' && !form.lost_reason) { setError('Choose why the deal was lost.'); return; }
    const body = {
      title: form.title,
      deal_type: form.deal_type,
      stage: form.stage,
      value: form.value,
      expected_close: form.expected_close || null,
      lost_reason: form.lost_reason,
      owner_id: form.owner_id,
    };
    try {
      if (isNew) await api('/crm/deals', { method: 'POST', body: { ...body, contact_id: contactId } });
      else await api(`/crm/deals/${deal.id}`, { method: 'PATCH', body });
      onClose(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this deal? Its history entries stay on the contact.')) return;
    try {
      await api(`/crm/deals/${deal.id}`, { method: 'DELETE' });
      onClose(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal title={isNew ? 'Add deal' : 'Edit deal'} onClose={() => onClose(false)} onSubmit={save}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Type"><Select value={form.deal_type} onChange={set('deal_type')} options={DEAL_TYPES} /></Field>
        <Field label="Title"><Input value={form.title} onChange={set('title')} placeholder={labelOf(DEAL_TYPES, form.deal_type)} /></Field>
        <Field label="Stage"><Select value={form.stage} onChange={set('stage')} options={CRM_STAGES.map((s) => [s.id, s.label])} /></Field>
        <Field label="Value ₹"><Input value={form.value} onChange={set('value')} inputMode="numeric" placeholder="e.g. 85,000" /></Field>
        <Field label="Expected to close by"><Input type="date" value={form.expected_close} onChange={set('expected_close')} /></Field>
        <Field label="Looked after by"><Select value={form.owner_id} onChange={set('owner_id')} options={staffOptions(staff)} /></Field>
      </div>
      {form.stage === 'lost' && (
        <Field label="Why was it lost? *"><Select value={form.lost_reason || ''} onChange={set('lost_reason')} options={['', ...LOST_REASONS]} /></Field>
      )}
      <Alert>{error}</Alert>
      <div className="flex flex-wrap justify-between gap-2">
        {!isNew && user.role === 'admin' ? <button type="button" className="a-btn-danger" onClick={remove}>Delete deal</button> : <span />}
        <div className="flex gap-2">
          <button type="button" className="a-btn-secondary" onClick={() => onClose(false)}>Cancel</button>
          <button type="submit" className="a-btn-primary">Save</button>
        </div>
      </div>
    </Modal>
  );
}

export function LostReasonModal({ deal, onClose }) {
  const [reason, setReason] = useState('');
  return (
    <Modal
      title={`Mark as lost – ${deal.contact_name || deal.title}`}
      onClose={() => onClose(null)}
      onSubmit={(e) => { e.preventDefault(); if (reason) onClose(reason); }}
      width="max-w-md"
    >
      <Field label="Why did it not go ahead?"><Select value={reason} onChange={setReason} options={[['', 'Choose a reason'], ...LOST_REASONS]} required /></Field>
      <p className="text-sm text-clinic-clay">Knowing why deals are lost shows what to improve (price, follow-up speed, trial experience).</p>
      <div className="flex justify-end gap-2">
        <button type="button" className="a-btn-secondary" onClick={() => onClose(null)}>Cancel</button>
        <button type="submit" className="a-btn-primary" disabled={!reason}>Mark lost</button>
      </div>
    </Modal>
  );
}

// Close a follow-up: what happened, optionally move the deal, and set the next follow-up in one step.
export function DoneForm({ item, onClose }) {
  const staff = useStaff();
  const [outcome, setOutcome] = useState('');
  const [planNext, setPlanNext] = useState(true);
  const [next, setNext] = useState({ kind: item.kind === 'note' ? 'call' : item.kind, body: '', due_date: addDays(todayISO(), 3), assigned_to: item.assigned_to ? String(item.assigned_to) : '' });
  const [stage, setStage] = useState(item.deal_stage || '');
  const [lostReason, setLostReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const losing = stage === 'lost' && stage !== item.deal_stage;

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (losing && !lostReason) { setError('Choose why the deal was lost.'); return; }
    setBusy(true);
    try {
      if (item.deal_id && stage && stage !== item.deal_stage) {
        await api(`/crm/deals/${item.deal_id}`, { method: 'PATCH', body: { stage, lost_reason: lostReason || null } });
      }
      await api(`/crm/activities/${item.id}`, {
        method: 'PATCH',
        body: { done: true, outcome, ...(planNext ? { next } : {}) },
      });
      onClose(true);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={`Done – ${item.contact_name || ''}`} onClose={() => onClose(false)} onSubmit={save} width="max-w-xl">
      <p className="rounded-xl bg-[#f6ecdf] px-4 py-3 text-base">{item.body}</p>
      <Field label="What happened?"><TextArea value={outcome} onChange={setOutcome} rows={2} placeholder="e.g. Spoke to son; they will come Saturday 11 am" autoFocus /></Field>
      {item.deal_id && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={`Deal stage${item.deal_title ? ` – ${item.deal_title}` : ''}`}>
            <Select value={stage} onChange={setStage} options={CRM_STAGES.map((s) => [s.id, s.id === item.deal_stage ? `${s.label} (no change)` : s.label])} />
          </Field>
          {losing && <Field label="Why was it lost? *"><Select value={lostReason} onChange={setLostReason} options={['', ...LOST_REASONS]} /></Field>}
        </div>
      )}
      <label className="flex items-center gap-2 text-base font-semibold">
        <input type="checkbox" className="h-5 w-5" checked={planNext} onChange={(e) => setPlanNext(e.target.checked)} />
        Set the next follow-up
      </label>
      {planNext && (
        <fieldset className="grid gap-3 rounded-xl border border-[#ddcbb8] p-4">
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
            <Field label="How"><Select value={next.kind} onChange={(v) => setNext({ ...next, kind: v })} options={ACTIVITY_KINDS} /></Field>
            <Field label="What to do"><Input value={next.body} onChange={(v) => setNext({ ...next, body: v })} placeholder="e.g. Remind about Saturday visit" /></Field>
          </div>
          <DueDatePicker value={next.due_date} onChange={(v) => setNext({ ...next, due_date: v })} />
          <Field label="Assigned to"><Select value={next.assigned_to} onChange={(v) => setNext({ ...next, assigned_to: v })} options={staffOptions(staff, 'Same as before')} /></Field>
        </fieldset>
      )}
      <Alert>{error}</Alert>
      <div className="flex justify-end gap-2">
        <button type="button" className="a-btn-secondary" onClick={() => onClose(false)}>Cancel</button>
        <button type="submit" className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Mark done'}</button>
      </div>
    </Modal>
  );
}

// "Move to…" box for a follow-up date.
export function RescheduleSelect({ onPick, label = 'Reschedule' }) {
  const today = todayISO();
  return (
    <select
      aria-label={label}
      className="h-[2.6rem] rounded-[0.85rem] border-[1.5px] border-clinic-maroon bg-[#fffdfb] px-2 text-[0.95rem] font-semibold text-clinic-maroon"
      value=""
      onChange={(e) => { if (e.target.value) onPick(e.target.value); }}
    >
      <option value="">{label}…</option>
      {QUICK_DUES.filter(([, days]) => days > 0).map(([text, days]) => (
        <option key={text} value={addDays(today, days)}>{text}</option>
      ))}
    </select>
  );
}
