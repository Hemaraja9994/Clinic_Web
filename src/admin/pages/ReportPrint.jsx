import React, { useEffect, useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';

import { api, formatDate } from '../api.js';
import { EARS, REFLEX_FREQS, TYMP_MEANING, earSummary } from '../clinical.js';
import { Audiogram, AudiogramKey, Tympanogram } from '../components/Charts.jsx';
import { Alert } from '../components/ui.jsx';
import { SLP_SECTIONS } from './ReportEditor.jsx';

const CLINIC = {
  name: 'Sri Rudra Speech & Hearing Clinic',
  nameTe: 'శ్రీ రుద్ర స్పీచ్ & హియరింగ్ క్లినిక్',
  tagline: 'Audiology · Speech-Language Pathology · Hearing Aids',
  address: 'Flat No. 211 & 212, HIG-207/4, Bhavana Heights, MVP Double Road, Visakhapatnam – 530017',
  contact: 'Ph: 9849848516 · 9032389666 · srirudraspeechandhearing@gmail.com',
};

const TITLES = { audiology: 'Audiological Evaluation Report', speech_language: 'Speech-Language Evaluation Report' };

export default function ReportPrint({ id }) {
  const [d, setD] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/reports/${id}`).then(setD).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (d) document.title = `${d.patient.reg_no} ${d.patient.name} – ${TITLES[d.report.type]}`;
  }, [d]);

  if (error) return <div className="p-8"><Alert>{error}</Alert></div>;
  if (!d) return <p className="p-8 text-clinic-clay">Loading…</p>;
  const { report, patient } = d;
  const data = report.data || {};

  return (
    <div className="min-h-screen bg-clinic-parchment py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] justify-between px-4">
        <a href={`#/reports/${report.id}`} className="a-btn-secondary"><ArrowLeft className="h-4 w-4" />Back to report</a>
        <div className="flex items-center gap-3">
          {report.status !== 'final' && <span className="text-xs font-semibold text-amber-700">DRAFT – not finalised</span>}
          <button type="button" className="a-btn-primary" onClick={() => window.print()}><Printer className="h-4 w-4" />Print / Save as PDF</button>
        </div>
      </div>

      <article className="print-sheet mx-auto max-w-[210mm] bg-white px-10 py-8 text-[12.5px] leading-relaxed text-clinic-ink shadow-soft">
        <header className="flex items-center gap-4 border-b-2 border-clinic-maroon pb-3">
          <img src="/clinic-logo-mobile.png" alt="" className="h-16 w-16 object-contain" />
          <div className="flex-1">
            <p className="font-heading text-xl font-semibold text-clinic-maroon">{CLINIC.name}</p>
            <p className="text-[11px] text-clinic-umber">{CLINIC.nameTe}</p>
            <p className="text-[10.5px] text-clinic-clay">{CLINIC.tagline}</p>
          </div>
          <div className="max-w-[60mm] text-right text-[10px] leading-snug text-clinic-umber">
            <p>{CLINIC.address}</p>
            <p>{CLINIC.contact}</p>
          </div>
        </header>

        <h1 className="mt-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-clinic-maroon">
          {TITLES[report.type]}
          {report.status !== 'final' && <span className="ml-2 text-amber-700">(Draft)</span>}
        </h1>

        <table className="mt-3 w-full border border-clinic-sand text-[11.5px]">
          <tbody>
            <tr>
              <Td label="Name">{patient.name}</Td>
              <Td label="Reg. no.">{patient.reg_no}</Td>
              <Td label="Date">{formatDate(report.report_date)}</Td>
            </tr>
            <tr>
              <Td label="Age / Sex">{[patient.age, patient.sex].filter(Boolean).join(' / ')}</Td>
              <Td label="Referred by">{patient.referred_by}</Td>
              <Td label="Phone">{patient.phone}</Td>
            </tr>
          </tbody>
        </table>

        {report.type === 'audiology' ? <AudiologyBody data={data} patient={patient} /> : <SpeechLanguageBody data={data} />}

        <footer className="avoid-break mt-10 flex items-end justify-between">
          <p className="max-w-[95mm] text-[9.5px] text-clinic-clay">
            This report reflects findings on the date of evaluation and should be interpreted by a qualified professional alongside clinical history.
          </p>
          <div className="text-right">
            <div className="mb-1 h-10" />
            <p className="border-t border-clinic-ink pt-1 font-semibold">{report.clinician_name}</p>
            <p className="text-[11px] text-clinic-umber">{report.clinician_qualification}</p>
            {report.clinician_rci && <p className="text-[11px] text-clinic-umber">RCI Reg. No. {report.clinician_rci}</p>}
          </div>
        </footer>
      </article>
    </div>
  );
}

function Td({ label, children }) {
  return (
    <td className="border border-clinic-sand px-2 py-1">
      <span className="text-clinic-clay">{label}: </span>
      <span className="font-semibold">{children || '—'}</span>
    </td>
  );
}

function H2({ children }) {
  return <h2 className="mb-1 mt-4 border-b border-clinic-sand pb-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-clinic-maroon">{children}</h2>;
}

function Para({ label, children }) {
  if (!children) return null;
  return (
    <p className="mt-1 whitespace-pre-wrap">
      {label && <span className="font-semibold">{label}: </span>}
      {children}
    </p>
  );
}

const has = (obj) => obj && Object.values(obj).some((v) => (typeof v === 'object' ? has(v) : v !== '' && v !== undefined && v !== null && v !== false));

function AudiologyBody({ data, patient }) {
  return (
    <>
      {(data.history || patient.chief_complaint) && (
        <>
          <H2>History</H2>
          <Para>{data.history || patient.chief_complaint}</Para>
        </>
      )}
      {has(data.otoscopy) && (
        <>
          <H2>Otoscopy</H2>
          <Para label="Right">{data.otoscopy.right}</Para>
          <Para label="Left">{data.otoscopy.left}</Para>
        </>
      )}

      {(has(data.right) || has(data.left)) && (
        <section className="avoid-break">
          <H2>Pure tone audiometry</H2>
          <div className="grid grid-cols-2 gap-4">
            {EARS.map((ear) => {
              const s = earSummary(data[ear]);
              return (
                <div key={ear}>
                  <Audiogram ear={ear} data={data[ear]} masking={data.masking?.[ear]} />
                  <p className="text-center text-[11px]">AC PTA <b>{s.ac ?? '–'}</b> dB HL · BC PTA <b>{s.bc ?? '–'}</b> dB HL</p>
                </div>
              );
            })}
          </div>
          <div className="mt-2"><AudiogramKey /></div>
        </section>
      )}

      {has(data.speech) && (
        <section className="avoid-break">
          <H2>Speech audiometry</H2>
          <table className="w-full text-center text-[11.5px]">
            <thead><tr className="text-clinic-clay"><th className="text-left">Ear</th><th>SRT (dB HL)</th><th>SIS / SDS (%)</th><th>UCL (dB HL)</th></tr></thead>
            <tbody>
              {EARS.map((ear) => (
                <tr key={ear}>
                  <td className="text-left font-semibold capitalize">{ear}</td>
                  <td>{data.speech?.[ear]?.srt || '—'}</td>
                  <td>{data.speech?.[ear]?.sds || '—'}</td>
                  <td>{data.speech?.[ear]?.ucl || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Para label="Remarks">{data.speech?.note}</Para>
        </section>
      )}

      {(has(data.tymp) || has(data.reflexes)) && (
        <section className="avoid-break">
          <H2>Immittance audiometry (226 Hz)</H2>
          <div className="grid grid-cols-2 gap-4">
            {EARS.map((ear) => {
              const t = data.tymp?.[ear] || {};
              return (
                <div key={ear}>
                  <Tympanogram ear={ear} tymp={t} />
                  <p className="text-center text-[11px]">
                    Type <b>{t.type || '—'}</b> · Peak {t.noPeak ? 'none' : `${t.pressure || '—'} daPa`} · SC {t.noPeak ? '—' : `${t.compliance || '—'} ml`} · ECV {t.ecv || '—'} ml
                  </p>
                  {t.type && <p className="text-center text-[10px] text-clinic-clay">{TYMP_MEANING[t.type]}</p>}
                  {has(data.reflexes?.[ear]) && (
                    <table className="mx-auto mt-1 text-center text-[10.5px]">
                      <thead><tr className="text-clinic-clay"><th className="pr-2 text-left">Reflex</th>{REFLEX_FREQS.map((f) => <th key={f} className="px-1.5">{f >= 1000 ? `${f / 1000}k` : f}</th>)}</tr></thead>
                      <tbody>
                        {['ipsi', 'contra'].map((k) => (
                          <tr key={k}>
                            <td className="pr-2 text-left capitalize">{k}</td>
                            {REFLEX_FREQS.map((f) => <td key={f} className="px-1.5">{data.reflexes?.[ear]?.[k]?.[f] || '—'}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(has(data.oae) || data.other_tests) && (
        <>
          <H2>Other tests</H2>
          {has(data.oae) && <Para label="OAE">Right: {data.oae?.right || 'Not done'} · Left: {data.oae?.left || 'Not done'}</Para>}
          <Para>{data.other_tests}</Para>
        </>
      )}

      <section className="avoid-break">
        <H2>Impression</H2>
        <Para label="Right ear">{data.impression?.right}</Para>
        <Para label="Left ear">{data.impression?.left}</Para>
        {data.recommendations && (
          <>
            <H2>Recommendations</H2>
            <Para>{data.recommendations}</Para>
          </>
        )}
      </section>
    </>
  );
}

function SpeechLanguageBody({ data }) {
  return SLP_SECTIONS.filter(([key]) => data[key]).map(([key, label]) => (
    <section key={key} className="avoid-break">
      <H2>{label}</H2>
      <Para>{data[key]}</Para>
    </section>
  ));
}
