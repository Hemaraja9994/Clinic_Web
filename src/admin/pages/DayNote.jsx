import React, { useEffect, useState } from 'react';

import { api, todayISO } from '../api.js';

export default function DayNote() {
  const date = todayISO();
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/dashboard-note?date=${date}`).then((data) => setBody(data.body || '')).catch((err) => setError(err.message));
  }, [date]);

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    try {
      await api('/dashboard-note', { method: 'PUT', body: { date, body } });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={save} className="a-card mt-6">
      <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Today’s note</h2>
      <p className="mt-1 text-sm text-clinic-clay">A note for the clinic today. Everyone who can open the dashboard can read and update it.</p>
      <textarea className="a-input mt-3 py-2" rows={4} value={body} onChange={(event) => { setBody(event.target.value); setSaved(false); }} placeholder="Write a note for today" />
      {error && <p className="mt-2 text-sm text-red-800">{error}</p>}
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" className="a-btn-primary">Save note</button>
        {saved && <p className="text-sm text-emerald-800">Saved.</p>}
      </div>
    </form>
  );
}
