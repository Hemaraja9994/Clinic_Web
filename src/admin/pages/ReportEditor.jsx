import React, { useEffect, useState } from 'react';
import { Printer, Wand2 } from 'lucide-react';

import { api, todayISO } from '../api.js';
import { AC_FREQS, BC_FREQS, EARS, REFLEX_FREQS, TYMP_MEANING, earSummary, tympType } from '../clinical.js';
import { Audiogram, AudiogramKey, Tympanogram } from '../components/Charts.jsx';
import { Alert, Field, Input, PageHeader, Select, StatusBadge, TextArea } from '../components/ui.jsx';
import { navigate, useUser } from '../session.js';

const TITLES = { audiology: 'Audiological evaluation', speech_language: 'Speech-language evaluation' };

// Read/write a nested value such as data.right.ac[500] by path ['right', 'ac', 500].
function getIn(obj, path) {
  return path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setIn(obj, path, value) {
  const [k, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  copy[k] = rest.length ? setIn(copy[k], rest, value) : value;
  return copy;
}

export default function ReportEditor({ id, patientId, type: newType }) {
  const user = useUser();
  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [data, setData] = useState({});
  const [date, setDate] = useState(todayISO());
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) {
      api(`/reports/${id}`)
        .then((d) => { setReport(d.report); setPatient(d.patient); setData(d.report.data); setDate(d.report.report_date); })
        .catch((e) => setMsg({ tone: 'error', text: e.message }));
    } else {
      api(`/patients/${patientId}`).then((d) => setPatient(d.patient)).catch((e) => setMsg({ tone: 'error', text: e.message }));
    }
  }, [id, patientId]);

  const type = report?.type || newType;
  const locked = report?.status === 'final' && user.role !== 'admin';
  const bind = (...path) => ({ value: getIn(data, path) ?? '', onChange: (v) => setData((d) => setIn(d, path, v)) });

  const save = async (status) => {
    setBusy(true);
    setMsg(null);
    try {
      if (report) {
        await api(`/reports/${report.id}`, { method: 'PUT', body: { data, report_date: date, status } });
        setReport({ ...report, status, report_date: date });
        setMsg({ tone: 'ok', text: status === 'final' ? 'Report finalised and locked.' : 'Saved.' });
      } else {
        const { id: newId } = await api('/reports', { method: 'POST', body: { patient_id: Number(patientId), type, report_date: date, data } });
        if (status === 'final') await api(`/reports/${newId}`, { method: 'PUT', body: { status: 'final' } });
        navigate(`/reports/${newId}`);
      }
    } catch (e) {
      setMsg({ tone: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this report permanently?')) return;
    try {
      await api(`/reports/${report.id}`, { method: 'DELETE' });
      navigate(`/patients/${report.patient_id}`);
    } catch (e) {
      setMsg({ tone: 'error', text: e.message });
    }
  };

  if (!patient) return msg ? <Alert>{msg.text}</Alert> : <p className="text-clinic-clay">Loading…</p>;

  return (
    <>
      <PageHeader
        title={TITLES[type]}
        subtitle={<span><a className="underline" href={`#/patients/${patient.id}`}>{patient.name}</a> · {patient.reg_no} {report && <StatusBadge status={report.status} />}</span>}
        actions={report && <a className="a-btn-secondary" href={`#/reports/${report.id}/print`}><Printer className="h-4 w-4" />Print / PDF</a>}
      />
      {locked && <div className="mb-4"><Alert tone="ok">This report is final and locked. An admin can reopen it if a correction is needed.</Alert></div>}

      <fieldset disabled={locked} className="grid gap-6">
        <div className="a-card grid max-w-xs gap-3">
          <Field label="Date of evaluation"><Input type="date" value={date} onChange={setDate} /></Field>
        </div>
        {type === 'audiology' ? <AudiologyForm data={data} setData={setData} bind={bind} /> : <SpeechLanguageForm bind={bind} />}
      </fieldset>

      <div className="no-print sticky bottom-0 mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-clinic-sand bg-clinic-ivory/95 py-3 backdrop-blur">
        <div className="mr-auto">{msg && <Alert tone={msg.tone}>{msg.text}</Alert>}</div>
        {report && user.role === 'admin' && <button type="button" className="a-btn-danger" onClick={remove}>Delete</button>}
        {report?.status === 'final' && user.role === 'admin' && (
          <button type="button" className="a-btn-secondary" disabled={busy} onClick={() => save('draft')}>Reopen as draft</button>
        )}
        {!locked && report?.status !== 'final' && (
          <>
            <button type="button" className="a-btn-secondary" disabled={busy} onClick={() => save('draft')}>Save draft</button>
            <button type="button" className="a-btn-primary" disabled={busy} onClick={() => { if (window.confirm('Finalise this report? It will be locked for editing.')) save('final'); }}>Save & finalise</button>
          </>
        )}
        {report?.status === 'final' && user.role === 'admin' && (
          <button type="button" className="a-btn-primary" disabled={busy} onClick={() => save('final')}>Save changes</button>
        )}
      </div>
    </>
  );
}

function Section({ title, children, note }) {
  return (
    <section className="a-card">
      <h2 className="font-heading text-lg font-semibold text-clinic-maroon">{title}</h2>
      {note && <p className="mt-1 text-xs text-clinic-clay">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Cell(props) {
  return <input className="a-cell" value={props.value} onChange={(e) => props.onChange(e.target.value)} inputMode="numeric" aria-label={props.label} />;
}

function AudiologyForm({ data, setData, bind }) {
  const fillImpression = () => {
    let next = data;
    for (const ear of EARS) {
      const s = earSummary(data[ear]);
      const t = tympType(data.tymp?.[ear]);
      const parts = [];
      if (s.impression) parts.push(`${s.impression}${s.ac !== null ? ` (AC PTA ${s.ac} dB HL${s.bc !== null ? `, BC PTA ${s.bc} dB HL` : ''})` : ''}.`);
      if (t) parts.push(`'${t}' type tympanogram – ${TYMP_MEANING[t].charAt(0).toLowerCase()}${TYMP_MEANING[t].slice(1)}.`);
      next = setIn(next, ['impression', ear], parts.join(' '));
      if (t && !getIn(data, ['tymp', ear, 'type'])) next = setIn(next, ['tymp', ear, 'type'], t);
    }
    setData(next);
  };

  return (
    <>
      <Section title="History & otoscopy">
        <div className="grid gap-3">
          <Field label="Relevant history / complaint"><TextArea {...bind('history')} rows={2} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Otoscopy – right"><Input {...bind('otoscopy', 'right')} placeholder="e.g. TM intact, cone of light present" /></Field>
            <Field label="Otoscopy – left"><Input {...bind('otoscopy', 'left')} /></Field>
          </div>
        </div>
      </Section>

      <Section title="Pure tone audiometry" note='Enter thresholds in dB HL. Type "NR" for no response at the limit, or e.g. "110NR".'>
        <div className="grid gap-6 xl:grid-cols-2">
          {EARS.map((ear) => {
            const s = earSummary(data[ear]);
            return (
              <div key={ear}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[30rem] text-xs">
                    <thead>
                      <tr>
                        <th className={`w-16 py-1 text-left ${ear === 'right' ? 'text-red-700' : 'text-blue-700'}`}>{ear === 'right' ? 'RIGHT' : 'LEFT'}</th>
                        {AC_FREQS.map((f) => <th key={f} className="py-1 font-semibold text-clinic-clay">{f >= 1000 ? `${f / 1000}k` : f}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[['ac', 'Air', AC_FREQS], ['bc', 'Bone', BC_FREQS]].map(([kind, label, freqs]) => (
                        <tr key={kind}>
                          <td className="pr-2 font-semibold text-clinic-umber">{label}</td>
                          {AC_FREQS.map((f) => (
                            <td key={f} className="p-0.5">{freqs.includes(f) ? <Cell label={`${ear} ${label} ${f}`} {...bind(ear, kind, f)} /> : null}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-clinic-umber">
                  {['ac', 'bc'].map((k) => (
                    <label key={k} className="inline-flex items-center gap-1.5">
                      <input type="checkbox" checked={Boolean(data.masking?.[ear]?.[k])} onChange={(e) => setData((d) => setIn(d, ['masking', ear, k], e.target.checked))} />
                      {k === 'ac' ? 'Air conduction masked' : 'Bone conduction masked'}
                    </label>
                  ))}
                </div>
                <div className="mx-auto mt-3 max-w-md"><Audiogram ear={ear} data={data[ear]} masking={data.masking?.[ear]} /></div>
                <p className="mt-1 text-center text-xs text-clinic-umber">
                  AC PTA: <b>{s.ac ?? '–'}</b> · BC PTA: <b>{s.bc ?? '–'}</b> · Air–bone gap: <b>{s.gap ?? '–'}</b> dB
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4"><AudiogramKey /></div>
      </Section>

      <Section title="Speech audiometry">
        <div className="grid gap-3 sm:grid-cols-2">
          {EARS.map((ear) => (
            <div key={ear} className="grid grid-cols-3 gap-2">
              <Field label={`${ear} SRT (dB HL)`}><Input {...bind('speech', ear, 'srt')} /></Field>
              <Field label={`${ear} SIS / SDS (%)`}><Input {...bind('speech', ear, 'sds')} /></Field>
              <Field label={`${ear} UCL (dB HL)`}><Input {...bind('speech', ear, 'ucl')} /></Field>
            </div>
          ))}
        </div>
        <div className="mt-3"><Field label="Speech test material / remarks"><Input {...bind('speech', 'note')} placeholder="e.g. Telugu PB word list, live voice" /></Field></div>
      </Section>

      <Section title="Immittance audiometry" note="Probe tone 226 Hz. Type is suggested from pressure and compliance (Jerger) – you can change it.">
        <div className="grid gap-6 xl:grid-cols-2">
          {EARS.map((ear) => {
            const tymp = data.tymp?.[ear] || {};
            const suggested = tympType(tymp);
            return (
              <div key={ear}>
                <div className="grid grid-cols-4 gap-2">
                  <Field label="Peak (daPa)"><Input {...bind('tymp', ear, 'pressure')} disabled={tymp.noPeak} /></Field>
                  <Field label="SC (ml)"><Input {...bind('tymp', ear, 'compliance')} disabled={tymp.noPeak} /></Field>
                  <Field label="ECV (ml)"><Input {...bind('tymp', ear, 'ecv')} /></Field>
                  <Field label={`Type${suggested ? ` (≈${suggested})` : ''}`}>
                    <Select {...bind('tymp', ear, 'type')} options={[['', '—'], 'A', 'As', 'Ad', 'B', 'C']} />
                  </Field>
                </div>
                <label className="mt-2 inline-flex items-center gap-1.5 text-xs text-clinic-umber">
                  <input type="checkbox" checked={Boolean(tymp.noPeak)} onChange={(e) => setData((d) => setIn(d, ['tymp', ear, 'noPeak'], e.target.checked))} />
                  No peak (flat)
                </label>
                <div className="mx-auto mt-2 max-w-sm"><Tympanogram ear={ear} tymp={tymp} /></div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-clinic-umber">Acoustic reflexes – {ear} probe (dB HL, or "Absent")</p>
                <table className="mt-1 w-full text-xs">
                  <thead><tr><th /> {REFLEX_FREQS.map((f) => <th key={f} className="text-clinic-clay">{f >= 1000 ? `${f / 1000}k` : f}</th>)}</tr></thead>
                  <tbody>
                    {['ipsi', 'contra'].map((k) => (
                      <tr key={k}>
                        <td className="pr-2 font-semibold capitalize text-clinic-umber">{k}</td>
                        {REFLEX_FREQS.map((f) => <td key={f} className="p-0.5"><Cell label={`${ear} ${k} ${f}`} {...bind('reflexes', ear, k, f)} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Other tests">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="OAE – right"><Select {...bind('oae', 'right')} options={[['', 'Not done'], 'Pass', 'Refer']} /></Field>
          <Field label="OAE – left"><Select {...bind('oae', 'left')} options={[['', 'Not done'], 'Pass', 'Refer']} /></Field>
        </div>
        <div className="mt-3"><Field label="Other findings (tuning fork, ABR, tinnitus matching…)"><TextArea {...bind('other_tests')} rows={2} /></Field></div>
      </Section>

      <Section title="Impression & recommendations">
        <button type="button" className="a-btn-secondary mb-3" onClick={fillImpression}><Wand2 className="h-4 w-4" />Suggest impression from results</button>
        <p className="mb-3 text-xs text-clinic-clay">Degree: Clark (1981) on PTA of 0.5, 1 and 2 kHz. Air–bone gap ≥ 15 dB treated as significant. Please review before finalising.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Impression – right ear"><TextArea {...bind('impression', 'right')} rows={3} /></Field>
          <Field label="Impression – left ear"><TextArea {...bind('impression', 'left')} rows={3} /></Field>
        </div>
        <div className="mt-3"><Field label="Recommendations"><TextArea {...bind('recommendations')} rows={4} placeholder="e.g. ENT consultation; hearing aid trial (BTE, binaural); re-evaluation after 6 months" /></Field></div>
      </Section>
    </>
  );
}

export const SLP_SECTIONS = [
  ['referral', 'Reason for referral / presenting complaint', 2],
  ['tests_used', 'Assessment tools used', 2, 'e.g. REELS, 3D-LAT, LPT, Telugu Articulation Test, SSI-4, GRBAS, MPT & s/z ratio, MASA, FOIS'],
  ['oromotor', 'Oral peripheral / oromotor examination', 2],
  ['receptive', 'Receptive language', 2],
  ['expressive', 'Expressive language', 2],
  ['speech', 'Speech – articulation / phonology / intelligibility', 2],
  ['fluency', 'Fluency', 2],
  ['voice', 'Voice & resonance', 2],
  ['swallowing', 'Feeding / swallowing', 2],
  ['cognition', 'Cognitive-communication / pragmatics', 2],
  ['diagnosis', 'Provisional diagnosis', 2],
  ['recommendations', 'Recommendations', 4, 'e.g. Speech-language therapy 3 sessions/week × 45 min; home programme; re-assessment after 3 months'],
  ['prognosis', 'Prognosis', 1],
];

function SpeechLanguageForm({ bind }) {
  return (
    <Section title="Findings" note="Leave any domain blank if not assessed – blank sections are left out of the printed report.">
      <div className="grid gap-4 lg:grid-cols-2">
        {SLP_SECTIONS.map(([key, label, rows, placeholder]) => (
          <Field key={key} label={label} className={rows > 2 ? 'lg:col-span-2' : ''}>
            <TextArea {...bind(key)} rows={rows + 1} placeholder={placeholder} />
          </Field>
        ))}
      </div>
    </Section>
  );
}
