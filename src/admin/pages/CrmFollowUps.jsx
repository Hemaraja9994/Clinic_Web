import React, { useEffect, useState } from 'react';

import { api, todayISO } from '../api.js';
import { Alert, PageHeader } from '../components/ui.jsx';
import { ContactLinks, CrmTabs, DoneForm, KIND_ICON, RescheduleSelect, StageBadge, dueTone } from '../components/crm.jsx';
import { displayPhone, dueLabel, groupFollowUps } from '../../shared/crm.js';

const GROUPS = [
  ['overdue', 'Overdue', 'Promised calls that slipped – do these first.'],
  ['today', 'Today', ''],
  ['week', 'Next 7 days', ''],
  ['later', 'Later', ''],
];

// Every open next action, soonest first. "Done" records what happened and sets the next one.
export default function CrmFollowUps() {
  const today = todayISO();
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState(false);
  const [error, setError] = useState('');
  const [doing, setDoing] = useState(null);

  const load = () => api(`/crm/followups${mine ? '?mine=1' : ''}`)
    .then((d) => setItems(d.followUps))
    .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, [mine]); // eslint-disable-line react-hooks/exhaustive-deps

  const reschedule = async (item, due) => {
    setError('');
    try {
      await api(`/crm/activities/${item.id}`, { method: 'PATCH', body: { due_date: due } });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const groups = groupFollowUps(items || [], today);

  return (
    <>
      <PageHeader title="CRM" subtitle="Calls and messages promised to enquirers and customers. Clear Overdue and Today first." />
      <CrmTabs current="followups" refreshKey={items} />

      <div className="mb-4 flex flex-wrap gap-2">
        {[[false, 'Everyone'], [true, 'Only mine']].map(([value, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => setMine(value)}
            className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold ${mine === value ? 'border-transparent bg-clinic-maroonDeep text-[#fff6ee]' : 'border-[#c4ad96] bg-[#fffdfb] text-clinic-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <Alert>{error}</Alert>

      {items === null ? (
        !error && <p className="text-clinic-clay">Loading…</p>
      ) : (
        GROUPS.map(([id, label, hint]) => {
          const rows = groups[id];
          if (!rows.length && id !== 'today') return null;
          return (
            <section key={id} className="a-card mb-5 p-0">
              <header className="flex flex-wrap items-baseline justify-between gap-2 px-5 pb-3 pt-4">
                <h2 className={`font-heading text-xl font-semibold ${id === 'overdue' ? 'text-[#b42318]' : 'text-clinic-maroon'}`}>
                  {label} <span className="text-base font-normal text-clinic-clay">({rows.length})</span>
                </h2>
                {hint && <p className="text-sm text-clinic-clay">{hint}</p>}
              </header>
              {rows.length === 0 ? (
                <p className="px-5 pb-5 text-clinic-clay">Nothing due today.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="a-table">
                    <thead><tr><th>When</th><th>Who</th><th>What to do</th><th>Deal</th><th>Assigned to</th><th /></tr></thead>
                    <tbody>
                      {rows.map((item) => {
                        const Icon = KIND_ICON[item.kind] || KIND_ICON.call;
                        return (
                          <tr key={item.id}>
                            <td className={`whitespace-nowrap font-semibold ${dueTone(item.due_date, today)}`}>{dueLabel(item.due_date, today)}</td>
                            <td className="min-w-[10rem]">
                              <a href={`#/crm/contacts/${item.contact_id}`} className="font-semibold text-clinic-maroon underline">{item.contact_name}</a>
                              <span className="block whitespace-nowrap text-xs text-clinic-clay">{displayPhone(item.contact_phone)}</span>
                            </td>
                            <td className="min-w-[14rem] max-w-md">
                              <span className="flex items-start gap-1.5"><Icon className="mt-1 h-4 w-4 shrink-0 text-clinic-clay" />{item.body}</span>
                            </td>
                            <td className="min-w-[9rem]">
                              {item.deal_title ? (
                                <>
                                  <span className="block text-sm">{item.deal_title}</span>
                                  <StageBadge stage={item.deal_stage} />
                                </>
                              ) : <span className="text-sm text-clinic-clay">–</span>}
                            </td>
                            <td className="whitespace-nowrap text-sm">{item.assigned_name || <span className="text-clinic-clay">Unassigned</span>}</td>
                            <td>
                              <div className="flex flex-wrap justify-end gap-1">
                                <ContactLinks phone={item.contact_phone} name={item.contact_name} />
                                <button type="button" className="a-btn-primary min-h-8 px-3 text-xs" onClick={() => setDoing(item)}>Done</button>
                                <RescheduleSelect onPick={(due) => reschedule(item, due)} label="Move" />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })
      )}

      {doing && <DoneForm item={doing} onClose={(changed) => { setDoing(null); if (changed) load(); }} />}
    </>
  );
}
