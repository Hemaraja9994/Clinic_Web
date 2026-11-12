import React, { useEffect, useState } from 'react';

import { api, todayISO } from '../api.js';
import { Alert, PageHeader, Select } from '../components/ui.jsx';
import { CrmTabs, LostReasonModal, NextAction, savedDateISO } from '../components/crm.jsx';
import { useUser } from '../session.js';
import {
  CRM_STAGES,
  DEAL_TYPES,
  daysInStage,
  displayPhone,
  filterDeals,
  formatRupees,
  prettyDate,
  summarizePipeline,
} from '../../shared/crm.js';

// The sales pipeline: one column per stage. Drag a card, or use its "stage" box, to move a deal.
export default function CrmPipeline() {
  const user = useUser();
  const today = todayISO();
  const [deals, setDeals] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [mine, setMine] = useState(false);
  const [losing, setLosing] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dropStage, setDropStage] = useState(null);

  const load = () => api(`/crm/deals?today=${today}`)
    .then((d) => setDeals(d.deals))
    .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const move = async (deal, stage, lostReason) => {
    if (!deal || stage === deal.stage) return;
    if (stage === 'lost' && !lostReason) { setLosing(deal); return; }
    setError('');
    const closes = stage === 'won' || stage === 'lost';
    setDeals((list) => list.map((d) => (d.id === deal.id ? { ...d, stage, stage_changed_at: today, closed_at: closes ? today : null } : d)));
    try {
      await api(`/crm/deals/${deal.id}`, { method: 'PATCH', body: { stage, ...(lostReason ? { lost_reason: lostReason } : {}) } });
    } catch (e) {
      setError(e.message);
    }
    load();
  };

  const shown = filterDeals(deals || [], { q, type, ownerId: mine ? user.id : null });
  const { byStage, open } = summarizePipeline(shown);

  return (
    <>
      <PageHeader
        title="CRM"
        subtitle="Every enquiry moves left to right until it is won or lost. Each card shows the next action promised to that person."
      />
      <CrmTabs current="pipeline" />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className="a-input w-full sm:w-72" placeholder="Search name, phone or deal" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search deals" />
        <div className="w-full sm:w-56"><Select value={type} onChange={setType} options={[['', 'All deal types'], ...DEAL_TYPES]} aria-label="Deal type" /></div>
        <label className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#c4ad96] bg-[#fffdfb] px-4 text-sm font-semibold">
          <input type="checkbox" className="h-4 w-4" checked={mine} onChange={(e) => setMine(e.target.checked)} />
          Only deals I look after
        </label>
        <p className="text-base text-clinic-ink sm:ml-auto">
          Open: <b>{open.count}</b> {open.count === 1 ? 'deal' : 'deals'} · <b>{formatRupees(open.value)}</b>
        </p>
      </div>
      <Alert>{error}</Alert>

      {deals !== null && (
        // The whole pipeline at a glance; a tap scrolls the board to that column.
        <nav aria-label="Pipeline stages" className="-mx-4 mb-3 overflow-x-auto px-4 sm:-mx-8 sm:px-8">
          <ol className="flex min-w-max items-center gap-1">
            {CRM_STAGES.map((stage, i) => (
              <li key={stage.id} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true" className="text-clinic-clay">›</span>}
                <button
                  type="button"
                  onClick={() => document.getElementById(`stage-${stage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#c4ad96] bg-[#fffdfb] px-3 text-sm font-semibold text-clinic-ink hover:border-clinic-maroon"
                >
                  {stage.label}
                  <span className={`rounded-full px-2 text-xs font-bold leading-5 ${byStage[stage.id].count ? 'bg-clinic-maroon text-[#fff6ee]' : 'bg-[#efe3d4] text-clinic-clay'}`}>{byStage[stage.id].count}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {deals === null ? (
        !error && <p className="text-clinic-clay">Loading…</p>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
          <div className="flex min-w-max items-start gap-3">
            {CRM_STAGES.map((stage) => {
              const cards = shown.filter((d) => d.stage === stage.id);
              const closed = stage.id === 'won' || stage.id === 'lost';
              return (
                <section
                  key={stage.id}
                  id={`stage-${stage.id}`}
                  aria-label={stage.label}
                  onDragOver={(e) => { e.preventDefault(); setDropStage(stage.id); }}
                  onDragLeave={() => setDropStage((s) => (s === stage.id ? null : s))}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDropStage(null);
                    move(deals.find((d) => d.id === dragId), stage.id);
                    setDragId(null);
                  }}
                  className={`flex w-[17.5rem] shrink-0 flex-col rounded-2xl border p-2.5 transition ${
                    dropStage === stage.id ? 'border-clinic-maroon bg-[#fbf0e2]' : 'border-[#ddcbb8] bg-[#f6ecdf]'
                  }`}
                >
                  <header className="px-1.5 pb-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-bold text-clinic-maroonDeep">{stage.label}</h2>
                      <span className="rounded-full bg-[#fffdfb] px-2.5 text-sm font-bold text-clinic-ink">{cards.length}</span>
                    </div>
                    <p className="text-xs text-clinic-clay">{closed ? 'Last 60 days' : stage.hint}</p>
                    {byStage[stage.id].value > 0 && <p className="mt-0.5 text-sm font-semibold text-clinic-ink">{formatRupees(byStage[stage.id].value)}</p>}
                  </header>
                  <div className="grid gap-2">
                    {cards.map((deal) => (
                      <DealCard key={deal.id} deal={deal} today={today} onMove={move} onDragStart={() => setDragId(deal.id)} />
                    ))}
                    {cards.length === 0 && (
                      <p className="rounded-xl border border-dashed border-[#c4ad96] px-3 py-4 text-center text-sm text-clinic-clay">No deals here</p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {losing && (
        <LostReasonModal
          deal={losing}
          onClose={(reason) => {
            const deal = losing;
            setLosing(null);
            if (reason) move(deal, 'lost', reason);
          }}
        />
      )}
    </>
  );
}

function DealCard({ deal, today, onMove, onDragStart }) {
  const closed = deal.stage === 'won' || deal.stage === 'lost';
  const days = daysInStage(savedDateISO(deal.stage_changed_at), today);
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(deal.id));
        onDragStart();
      }}
      className="cursor-grab rounded-xl border border-[#e2d3c2] bg-[#fffdfb] p-3 shadow-[0_8px_20px_-16px_rgba(78,20,28,0.6)] active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <a href={`#/crm/contacts/${deal.contact_id}`} className="text-base font-semibold leading-snug text-clinic-maroon hover:underline">{deal.contact_name}</a>
        {deal.value > 0 && <span className="whitespace-nowrap text-sm font-bold text-clinic-ink">{formatRupees(deal.value)}</span>}
      </div>
      <p className="text-sm text-clinic-ink">{deal.title}</p>
      <p className="text-xs text-clinic-clay">{displayPhone(deal.contact_phone)}{deal.owner_name ? ` · ${deal.owner_name}` : ''}</p>
      {!closed && (
        <div className="mt-2 border-t border-[#efe3d4] pt-2">
          <NextAction due={deal.next_due} body={deal.next_body} kind={deal.next_kind} today={today} />
        </div>
      )}
      {deal.stage === 'lost' && deal.lost_reason && <p className="mt-1.5 text-xs text-clinic-clay">Reason: {deal.lost_reason}</p>}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-xs text-clinic-clay">
          {closed
            ? `Closed ${prettyDate(savedDateISO(deal.closed_at), { withYear: false })}`
            : days === 0 ? 'In this stage since today' : `${days} ${days === 1 ? 'day' : 'days'} in this stage`}
        </span>
        <select
          aria-label={`Stage for ${deal.contact_name}`}
          className="h-9 max-w-[8.5rem] rounded-lg border border-[#c4ad96] bg-[#fffdfb] px-1.5 text-sm font-semibold text-clinic-ink"
          value={deal.stage}
          onChange={(e) => onMove(deal, e.target.value)}
        >
          {CRM_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
    </article>
  );
}
