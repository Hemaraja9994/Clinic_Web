import React, { useEffect, useState } from 'react';
import { CalendarCheck, ClipboardList, FileText, Inbox } from 'lucide-react';

import { api, formatDate, todayISO } from '../api.js';
import { timeKey } from '../constants.js';
import { Alert, PageHeader, StatusBadge } from '../components/ui.jsx';
import { useUser } from '../session.js';

export default function Dashboard() {
  const user = useUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/dashboard?today=${todayISO()}`).then(setData).catch((e) => setError(e.message));
  }, []);

  const today = [...(data?.today || [])].sort((a, b) => timeKey(a.time) - timeKey(b.time));

  return (
    <>
      <PageHeader title={`Welcome, ${user.full_name.split(' ')[0]}`} subtitle={formatDate(todayISO())} />
      <Alert>{error}</Alert>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CalendarCheck} label="Today's appointments" value={data ? today.length : '–'} href="#/appointments" />
        <Stat icon={Inbox} label="New website requests" value={data?.pendingRequests ?? '–'} href="#/appointments" highlight={data?.pendingRequests > 0} />
        <Stat icon={ClipboardList} label="Registered patients" value={data?.patientCount ?? '–'} href="#/patients" />
        <Stat icon={FileText} label="Reports this month" value={data?.reportsThisMonth ?? '–'} href="#/patients" />
      </div>

      <section className="a-card mt-6">
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Today's schedule</h2>
        {data && today.length === 0 && <p className="mt-3 text-sm text-clinic-clay">No appointments today.</p>}
        {today.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="a-table">
              <thead><tr><th>Time</th><th>Name</th><th>Service</th><th>Phone</th><th>Status</th></tr></thead>
              <tbody>
                {today.map((a) => (
                  <tr key={a.id}>
                    <td className="whitespace-nowrap font-semibold">{a.time || 'Call to fix'}</td>
                    <td>{a.patient_id ? <a className="text-clinic-maroon underline" href={`#/patients/${a.patient_id}`}>{a.name}</a> : a.name}</td>
                    <td>{a.service}</td>
                    <td className="whitespace-nowrap">{a.phone}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ icon: Icon, label, value, href, highlight }) {
  return (
    <a href={href} className={`a-card flex items-center gap-4 transition hover:border-clinic-maroon ${highlight ? 'ring-2 ring-clinic-saffron' : ''}`}>
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-clinic-saffronSoft text-clinic-maroon"><Icon className="h-6 w-6" /></span>
      <span>
        <span className="block text-2xl font-semibold text-clinic-ink">{value}</span>
        <span className="text-xs text-clinic-clay">{label}</span>
      </span>
    </a>
  );
}
