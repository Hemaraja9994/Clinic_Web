import React, { useEffect, useState } from 'react';
import { Ear, MessageSquareText, Pencil } from 'lucide-react';

import { api, formatDate } from '../api.js';
import { Alert, Field, Input, PageHeader, Select, StatusBadge, TextArea } from '../components/ui.jsx';
import { canEditClinical, navigate, useUser } from '../session.js';

const CASE_HISTORY_PROMPT = `Onset & duration:
Associated complaints (tinnitus, vertigo, ear discharge, otalgia):
Birth & developmental history (for children):
Medical / surgical history:
Family history:
Educational / occupational status:
Previous assessments / devices / therapy:`;

const REPORT_LABEL = { audiology: 'Audiological evaluation', speech_language: 'Speech-language evaluation' };

export default function PatientDetail({ id }) {
  const user = useUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const load = () => api(`/patients/${id}`).then(setData).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <Alert>{error}</Alert>;
  if (!data) return <p className="text-clinic-clay">Loading…</p>;
  const p = data.patient;

  if (editing) return <PatientForm patient={p} onSaved={() => { setEditing(false); load(); }} onCancel={() => setEditing(false)} />;

  return (
    <>
      <PageHeader
        title={p.name}
        subtitle={`${p.reg_no} · registered ${formatDate(p.created_at)}`}
        actions={
          <>
            <button type="button" className="a-btn-secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Edit details</button>
            {canEditClinical(user) && (
              <>
                <button type="button" className="a-btn-primary" onClick={() => navigate(`/patients/${p.id}/reports/new/audiology`)}><Ear className="h-4 w-4" />New audiology report</button>
                <button type="button" className="a-btn-primary" onClick={() => navigate(`/patients/${p.id}/reports/new/speech_language`)}><MessageSquareText className="h-4 w-4" />New speech-language report</button>
              </>
            )}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="a-card">
          <h2 className="font-heading text-lg font-semibold text-clinic-maroon">Details</h2>
          <dl className="mt-3 grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2 text-sm">
            {[
              ['Age / DOB', [p.age, p.dob && formatDate(p.dob)].filter(Boolean).join(' · ')],
              ['Sex', p.sex],
              ['Phone', [p.phone, p.alt_phone].filter(Boolean).join(', ')],
              ['Address', p.address],
              ['Languages', p.languages],
              ['Referred by', p.referred_by],
              ['Chief complaint', p.chief_complaint],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="text-clinic-clay">{k}</dt>
                <dd className="whitespace-pre-wrap">{v || '—'}</dd>
              </React.Fragment>
            ))}
          </dl>
          {canEditClinical(user) && (
            <>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-clinic-umber">Case history</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm">{p.case_history || '—'}</p>
            </>
          )}
        </section>

        <div className="grid content-start gap-6">
          {canEditClinical(user) && (
            <section className="a-card">
              <h2 className="font-heading text-lg font-semibold text-clinic-maroon">Reports</h2>
              {data.reports.length === 0 && <p className="mt-2 text-sm text-clinic-clay">No reports yet.</p>}
              <ul className="mt-2 divide-y divide-clinic-sand/60">
                {data.reports.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                    <a href={`#/reports/${r.id}`} className="font-semibold text-clinic-maroon underline">{REPORT_LABEL[r.type]}</a>
                    <span className="text-clinic-clay">{formatDate(r.report_date)} · {r.clinician}</span>
                    <span className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      <a href={`#/reports/${r.id}/print`} className="text-xs text-clinic-maroon underline">Print</a>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="a-card">
            <h2 className="font-heading text-lg font-semibold text-clinic-maroon">Appointments</h2>
            {data.appointments.length === 0 && <p className="mt-2 text-sm text-clinic-clay">No linked appointments.</p>}
            <ul className="mt-2 divide-y divide-clinic-sand/60">
              {data.appointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span>{formatDate(a.date)} {a.time}</span>
                  <span className="text-clinic-clay">{a.service}</span>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

export function PatientForm({ patient, onSaved, onCancel }) {
  const user = useUser();
  const [form, setForm] = useState(patient || {});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = patient
        ? await api(`/patients/${patient.id}`, { method: 'PUT', body: form })
        : await api('/patients', { method: 'POST', body: form });
      onSaved(patient ? { id: patient.id } : result);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="a-card grid gap-4">
      <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{patient ? `Edit – ${patient.reg_no}` : 'Register new patient'}</h2>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <Field label="Full name *"><Input value={form.name} onChange={set('name')} required /></Field>
        <Field label="Age"><Input value={form.age} onChange={set('age')} placeholder="e.g. 4 y 6 m" /></Field>
        <Field label="Date of birth"><Input type="date" value={form.dob} onChange={set('dob')} /></Field>
        <Field label="Sex"><Select value={form.sex} onChange={set('sex')} options={[['', '—'], 'Male', 'Female', 'Other']} /></Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Phone"><Input value={form.phone} onChange={set('phone')} /></Field>
        <Field label="Alternate phone"><Input value={form.alt_phone} onChange={set('alt_phone')} /></Field>
        <Field label="Languages known"><Input value={form.languages} onChange={set('languages')} placeholder="Telugu, English" /></Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Field label="Address"><Input value={form.address} onChange={set('address')} /></Field>
        <Field label="Referred by"><Input value={form.referred_by} onChange={set('referred_by')} placeholder="e.g. Dr. ENT, self" /></Field>
      </div>
      <Field label="Chief complaint"><TextArea value={form.chief_complaint} onChange={set('chief_complaint')} rows={2} /></Field>
      {canEditClinical(user) && (
        <Field label="Case history"><TextArea value={form.case_history} onChange={set('case_history')} rows={8} placeholder={CASE_HISTORY_PROMPT} /></Field>
      )}
      <Alert>{error}</Alert>
      <div className="flex justify-end gap-2">
        <button type="button" className="a-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}
