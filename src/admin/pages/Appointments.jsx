import React, { useEffect, useState } from 'react';
import { MessageCircle, Plus, UserPlus } from 'lucide-react';

import { api, formatDate, todayISO } from '../api.js';
import { APPOINTMENT_STATUSES, SERVICE_NAMES, SLOT_TIMES, timeKey, whatsappLink } from '../constants.js';
import { Alert, Field, Input, PageHeader, Select, StatusBadge, TextArea } from '../components/ui.jsx';
import { navigate, useUser } from '../session.js';

const VIEWS = [
  ['upcoming', 'Upcoming'],
  ['requested', 'New requests'],
  ['today', 'Today'],
  ['past', 'Past'],
  ['all', 'All'],
];

function queryFor(view, q) {
  const today = todayISO();
  const p = new URLSearchParams();
  if (view === 'upcoming') p.set('from', today);
  if (view === 'requested') p.set('status', 'requested');
  if (view === 'today') { p.set('from', today); p.set('to', today); }
  if (view === 'past') p.set('to', todayISO(new Date(Date.now() - 864e5)));
  if (q) p.set('q', q);
  return p.toString();
}

export default function Appointments() {
  const user = useUser();
  const [view, setView] = useState('upcoming');
  const [q, setQ] = useState('');
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // appointment being edited, or {} for new

  const load = () => api(`/appointments?${queryFor(view, q)}`)
    .then((d) => {
      const rows = d.appointments;
      // Upcoming views read best soonest-first; history views newest-first.
      const asc = ['upcoming', 'today', 'requested'].includes(view);
      rows.sort((a, b) => (a.date === b.date ? timeKey(a.time) - timeKey(b.time) : (a.date < b.date ? -1 : 1) * (asc ? 1 : -1)));
      setList(rows);
    })
    .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = async (a, status) => {
    try {
      await api(`/appointments/${a.id}`, { method: 'PATCH', body: { status } });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  // Turn a website request into a registered patient, then link the appointment to them.
  const register = async (a) => {
    try {
      const { id } = await api('/patients', { method: 'POST', body: { name: a.name, age: a.age, phone: a.phone, chief_complaint: a.concern } });
      await api(`/appointments/${a.id}`, { method: 'PATCH', body: { patient_id: id } });
      navigate(`/patients/${id}`);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Appointments"
        subtitle="Website bookings arrive here as “Requested”. Confirm them, then message the patient on WhatsApp."
        actions={<button type="button" className="a-btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" />Add appointment</button>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {VIEWS.map(([v, label]) => (
          <button key={v} type="button" onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${view === v ? 'bg-clinic-maroon text-clinic-ivory' : 'bg-white text-clinic-umber ring-1 ring-clinic-sand'}`}>
            {label}
          </button>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="ml-auto flex gap-2">
          <input className="a-input w-56" placeholder="Search name or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="a-btn-secondary" type="submit">Search</button>
        </form>
      </div>
      <Alert>{error}</Alert>

      <div className="a-card overflow-x-auto p-0">
        <table className="a-table">
          <thead><tr><th>Date</th><th>Time</th><th>Name / age</th><th>Phone</th><th>Service & concern</th><th>Status</th><th /></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-clinic-clay">No appointments.</td></tr>}
            {list.map((a) => (
              <tr key={a.id}>
                <td className="whitespace-nowrap">{formatDate(a.date)}</td>
                <td className="whitespace-nowrap">{a.time || <span className="text-clinic-clay">Call to fix</span>}</td>
                <td>
                  {a.patient_id ? <a href={`#/patients/${a.patient_id}`} className="font-semibold text-clinic-maroon underline">{a.name}</a> : <span className="font-semibold">{a.name}</span>}
                  {a.age && <span className="text-clinic-clay"> · {a.age}</span>}
                  <span className="block text-xs text-clinic-clay">{a.source === 'website' ? 'Website booking' : 'Added by staff'}</span>
                </td>
                <td className="whitespace-nowrap">{a.phone}</td>
                <td className="max-w-xs">
                  {a.service}
                  {a.concern && <span className="block text-xs text-clinic-clay">{a.concern}</span>}
                  {a.staff_notes && <span className="block text-xs italic text-clinic-umber">Note: {a.staff_notes}</span>}
                </td>
                <td><StatusBadge status={a.status} /></td>
                <td className="whitespace-nowrap">
                  <div className="flex flex-wrap justify-end gap-1">
                    {a.status === 'requested' && <button type="button" className="a-btn-primary min-h-8 px-3 text-xs" onClick={() => setStatus(a, 'confirmed')}>Confirm</button>}
                    {a.status === 'confirmed' && <button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setStatus(a, 'completed')}>Mark seen</button>}
                    <a
                      className="a-btn-secondary min-h-8 px-3 text-xs"
                      target="_blank"
                      rel="noreferrer"
                      href={whatsappLink(a.phone, `Namaste ${a.name}, your appointment at Sri Rudra Speech & Hearing Clinic is ${a.status === 'requested' ? 'requested' : 'confirmed'} for ${formatDate(a.date)}${a.time ? ` at ${a.time}` : ''}. Address: MVP Double Road, Visakhapatnam. Call 9849848516 for any change.`)}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />WhatsApp
                    </a>
                    {!a.patient_id && <button type="button" title="Register as patient" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => register(a)}><UserPlus className="h-3.5 w-3.5" /></button>}
                    <button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setEditing(a)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <AppointmentForm appt={editing} isAdmin={user.role === 'admin'} onClose={(changed) => { setEditing(null); if (changed) load(); }} />}
    </>
  );
}

function AppointmentForm({ appt, isAdmin, onClose }) {
  const isNew = !appt.id;
  const [form, setForm] = useState({ date: todayISO(), time: '10:00 AM', service: SERVICE_NAMES[0], ...appt });
  const [error, setError] = useState('');
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const save = async (e) => {
    e.preventDefault();
    try {
      if (isNew) await api('/appointments', { method: 'POST', body: form });
      else await api(`/appointments/${appt.id}`, { method: 'PATCH', body: { status: form.status, date: form.date, time: form.time, staff_notes: form.staff_notes } });
      onClose(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      await api(`/appointments/${appt.id}`, { method: 'DELETE' });
      onClose(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4" onClick={() => onClose(false)}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="a-card grid w-full max-w-lg gap-4">
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{isNew ? 'Add appointment' : `Appointment – ${appt.name}`}</h2>
        {isNew && (
          <>
            <div className="grid grid-cols-[1fr_6rem] gap-3">
              <Field label="Name *"><Input value={form.name} onChange={set('name')} required /></Field>
              <Field label="Age"><Input value={form.age} onChange={set('age')} /></Field>
            </div>
            <Field label="Phone *"><Input value={form.phone} onChange={set('phone')} required /></Field>
            <Field label="Service"><Select value={form.service} onChange={set('service')} options={SERVICE_NAMES} /></Field>
            <Field label="Concern"><TextArea value={form.concern} onChange={set('concern')} rows={2} /></Field>
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><Input type="date" value={form.date} onChange={set('date')} required /></Field>
          <Field label="Time">
            <Select value={form.time || ''} onChange={set('time')} options={[['', 'Call to fix'], ...SLOT_TIMES.map((t) => [t, t]), ...(form.time && !SLOT_TIMES.includes(form.time) ? [[form.time, form.time]] : [])]} />
          </Field>
        </div>
        {!isNew && <Field label="Status"><Select value={form.status} onChange={set('status')} options={APPOINTMENT_STATUSES} /></Field>}
        <Field label="Staff notes (not shown to patient)"><TextArea value={form.staff_notes} onChange={set('staff_notes')} rows={2} /></Field>
        <Alert>{error}</Alert>
        <div className="flex flex-wrap justify-between gap-2">
          {!isNew && isAdmin ? <button type="button" className="a-btn-danger" onClick={remove}>Delete</button> : <span />}
          <div className="flex gap-2">
            <button type="button" className="a-btn-secondary" onClick={() => onClose(false)}>Cancel</button>
            <button type="submit" className="a-btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}
