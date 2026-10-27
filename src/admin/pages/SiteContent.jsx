import React, { useEffect, useState } from 'react';

import { api } from '../api.js';
import { SERVICE_NAMES } from '../constants.js';
import { Alert, Field, Input, PageHeader, TextArea } from '../components/ui.jsx';

// Each card edits one content key shown on the public website. Blank fields keep the website's built-in text.
export default function SiteContent() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/content').then(setContent).catch((e) => setError(e.message));
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!content) return <p className="text-clinic-clay">Loading…</p>;

  return (
    <>
      <PageHeader title="Website content" subtitle="Changes appear on srirudraspeechandhearing.com within about a minute. Leave a field blank to keep the website's original text." />
      <div className="grid gap-6">
        <ContentCard
          title="Announcement banner"
          contentKey="announcement"
          initial={content.announcement || { active: false, text: '', text_te: '' }}
          render={(v, set) => (
            <>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={Boolean(v.active)} onChange={(e) => set({ ...v, active: e.target.checked })} />
                Show banner at the top of the website
              </label>
              <Field label="Message (English)"><Input value={v.text} onChange={(t) => set({ ...v, text: t })} placeholder="e.g. Clinic closed on 1 Nov for Diwali" /></Field>
              <Field label="Message (Telugu)"><Input value={v.text_te} onChange={(t) => set({ ...v, text_te: t })} /></Field>
            </>
          )}
        />
        <ContentCard
          title="Clinic timings"
          contentKey="hours"
          initial={content.hours || {}}
          render={(v, set) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Monday – Saturday"><Input value={v.weekdays} onChange={(t) => set({ ...v, weekdays: t })} placeholder="10:00 AM – 9:00 PM" /></Field>
              <Field label="Sunday"><Input value={v.sunday} onChange={(t) => set({ ...v, sunday: t })} placeholder="Prior call only" /></Field>
              <Field label="Timings line in Telugu" className="sm:col-span-2"><Input value={v.te} onChange={(t) => set({ ...v, te: t })} placeholder="సోమ – శని: ఉ. 10 నుండి రా. 9 వరకు • ఆదివారం ముందస్తు కాల్‌తో" /></Field>
            </div>
          )}
        />
        <ContentCard
          title="Service descriptions"
          contentKey="services"
          initial={content.services || {}}
          render={(v, set) => (
            <div className="grid gap-3">
              {SERVICE_NAMES.slice(0, 4).map((name) => (
                <Field key={name} label={name}>
                  <TextArea value={v[name]} onChange={(t) => set({ ...v, [name]: t })} rows={2} placeholder="Leave blank to keep the current website text" />
                </Field>
              ))}
            </div>
          )}
        />
        <p className="text-xs text-clinic-clay">Gallery photos are part of the website code for now; uploading photos from here needs Cloudflare R2 storage and can be added next.</p>
      </div>
    </>
  );
}

function ContentCard({ title, contentKey, initial, render }) {
  const [value, setValue] = useState(initial);
  const [msg, setMsg] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api(`/content/${contentKey}`, { method: 'PUT', body: { value } });
      setMsg({ tone: 'ok', text: 'Saved.' });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    }
  };

  return (
    <form onSubmit={save} className="a-card grid gap-4">
      <h2 className="font-heading text-lg font-semibold text-clinic-maroon">{title}</h2>
      {render(value, setValue)}
      <div className="flex items-center justify-end gap-3">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        <button type="submit" className="a-btn-primary">Save</button>
      </div>
    </form>
  );
}
