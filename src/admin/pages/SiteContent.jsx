import React, { useEffect, useState } from 'react';

import { api } from '../api.js';
import { Alert, Field, Input, PageHeader, TextArea } from '../components/ui.jsx';
import {
  defaultContact,
  defaultFacilities,
  defaultFaqs,
  defaultHero,
  defaultServices,
  defaultTestimonials,
  defaultTrust,
} from '../../content-defaults.js';

// Each card edits one content key shown on the public website. Blank fields keep the website's built-in text.
export default function SiteContent() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/content').then(setContent).catch((e) => setError(e.message));
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!content) return <p className="text-clinic-clay">Loading…</p>;

  const services = initialServices(content.services);
  const facilities = Array.isArray(content.facilities) && content.facilities.length ? content.facilities : clone(defaultFacilities);
  const trust = {
    title: content.trust?.title || '',
    text: content.trust?.text || '',
    allies: Array.isArray(content.trust?.allies) && content.trust.allies.length ? content.trust.allies : [...defaultTrust.allies],
  };
  const testimonials = Array.isArray(content.testimonials) && content.testimonials.length ? content.testimonials : clone(defaultTestimonials);
  const faq = Array.isArray(content.faq) && content.faq.length ? content.faq : clone(defaultFaqs);

  return (
    <>
      <PageHeader title="Website content" subtitle="Edit the hero, services, clinical lists, trust section, testimonials, FAQ, and contact details. Leave a single field blank to keep the original text. Use Add to create a new line." />
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
          title="Hero"
          contentKey="hero"
          initial={content.hero || { headline: '', headline_te: '', body: '' }}
          render={(v, set) => (
            <>
              <Field label="Headline"><Input value={v.headline} onChange={(t) => set({ ...v, headline: t })} placeholder={defaultHero.headline} /></Field>
              <Field label="Headline (Telugu)"><Input value={v.headline_te} onChange={(t) => set({ ...v, headline_te: t })} placeholder={defaultHero.headline_te} /></Field>
              <Field label="Supporting paragraph"><TextArea value={v.body} onChange={(t) => set({ ...v, body: t })} rows={4} placeholder={defaultHero.body} /></Field>
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
          title="Service cards"
          contentKey="services"
          initial={services}
          render={(v, set) => (
            <div className="grid gap-4">
              {defaultServices.map((service) => (
                <div key={service.title} className="grid gap-3 rounded-xl border border-clinic-sand p-3">
                  <p className="font-semibold text-clinic-maroon">{service.title}</p>
                  <Field label="Telugu label"><Input value={v[service.title]?.te} onChange={(t) => set({ ...v, [service.title]: { ...v[service.title], te: t } })} placeholder={service.te} /></Field>
                  <Field label="Description"><TextArea value={v[service.title]?.text} onChange={(t) => set({ ...v, [service.title]: { ...v[service.title], text: t } })} rows={3} placeholder={service.text} /></Field>
                </div>
              ))}
            </div>
          )}
        />
        <ContentCard
          title="Clinical service lists"
          contentKey="facilities"
          initial={facilities}
          render={(v, set) => (
            <div className="grid gap-4">
              {v.map((group, groupIndex) => (
                <div key={groupIndex} className="grid gap-3 rounded-xl border border-clinic-sand p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Group title"><Input value={group.title} onChange={(t) => set(updateAt(v, groupIndex, { ...group, title: t }))} /></Field>
                    <Field label="Group title (Telugu)"><Input value={group.te} onChange={(t) => set(updateAt(v, groupIndex, { ...group, te: t }))} /></Field>
                  </div>
                  <ItemList
                    items={group.items || []}
                    fields={[{ key: 'en', label: 'Service (English)' }, { key: 'te', label: 'Service (Telugu)' }]}
                    addLabel="Add service"
                    blank={{ en: '', te: '' }}
                    onChange={(items) => set(updateAt(v, groupIndex, { ...group, items }))}
                  />
                </div>
              ))}
              <button type="button" className="a-btn-secondary justify-self-start" onClick={() => set([...v, { title: '', te: '', items: [{ en: '', te: '' }] }])}>Add service group</button>
            </div>
          )}
        />
        <ContentCard
          title="Trust section"
          contentKey="trust"
          initial={trust}
          render={(v, set) => (
            <>
              <Field label="Heading"><TextArea value={v.title} onChange={(t) => set({ ...v, title: t })} rows={2} placeholder={defaultTrust.title} /></Field>
              <Field label="Paragraph"><TextArea value={v.text} onChange={(t) => set({ ...v, text: t })} rows={3} placeholder={defaultTrust.text} /></Field>
              <ItemList
                items={(v.allies || []).map((label) => ({ label }))}
                fields={[{ key: 'label', label: 'Allied support' }]}
                addLabel="Add allied support"
                blank={{ label: '' }}
                onChange={(items) => set({ ...v, allies: items.map((item) => item.label) })}
              />
            </>
          )}
        />
        <ContentCard
          title="Testimonials"
          contentKey="testimonials"
          initial={testimonials}
          render={(v, set) => (
            <ItemList
              items={v}
              fields={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'quote', label: 'Quote', rows: 3 }]}
              addLabel="Add testimonial"
              blank={{ name: '', role: '', quote: '' }}
              onChange={set}
            />
          )}
        />
        <ContentCard
          title="FAQ"
          contentKey="faq"
          initial={faq}
          render={(v, set) => (
            <ItemList
              items={v}
              fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', rows: 3 }]}
              addLabel="Add question"
              blank={{ question: '', answer: '' }}
              onChange={set}
            />
          )}
        />
        <ContentCard
          title="Contact, call, and footer"
          contentKey="contact"
          initial={content.contact || { phones: '', email: '', address: '', address_te: '', title: '', description: '' }}
          render={(v, set) => (
            <>
              <Field label="Visit heading"><Input value={v.title} onChange={(t) => set({ ...v, title: t })} placeholder={defaultContact.title} /></Field>
              <Field label="Visit description"><TextArea value={v.description} onChange={(t) => set({ ...v, description: t })} rows={3} placeholder={defaultContact.description} /></Field>
              <Field label="Phone numbers"><Input value={v.phones} onChange={(t) => set({ ...v, phones: t })} placeholder={defaultContact.phones} /></Field>
              <Field label="Email"><Input value={v.email} onChange={(t) => set({ ...v, email: t })} placeholder={defaultContact.email} /></Field>
              <Field label="Address"><TextArea value={v.address} onChange={(t) => set({ ...v, address: t })} rows={3} placeholder={defaultContact.address} /></Field>
              <Field label="Address (Telugu)"><TextArea value={v.address_te} onChange={(t) => set({ ...v, address_te: t })} rows={3} placeholder={defaultContact.address_te} /></Field>
            </>
          )}
        />
        <p className="text-xs text-clinic-clay">Gallery photos stay in the website code. Phone numbers here also update the call and WhatsApp buttons.</p>
      </div>
    </>
  );
}

function initialServices(saved) {
  const out = {};
  for (const service of defaultServices) {
    const raw = saved?.[service.title];
    if (typeof raw === 'string') out[service.title] = { text: raw, te: '' };
    else if (raw && typeof raw === 'object') out[service.title] = { text: raw.text || '', te: raw.te || '' };
    else out[service.title] = { text: '', te: '' };
  }
  return out;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function updateAt(list, index, next) {
  return list.map((item, i) => (i === index ? next : item));
}

function ItemList({ items, onChange, fields, addLabel, blank }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  return (
    <div className="grid gap-3">
      {(items || []).map((item, index) => (
        <div key={index} className="grid gap-2 rounded-xl border border-dashed border-clinic-sand p-3">
          {fields.map((field) => (
            <Field key={field.key} label={field.label}>
              {field.rows
                ? <TextArea rows={field.rows} value={item[field.key]} onChange={(t) => update(index, { [field.key]: t })} />
                : <Input value={item[field.key]} onChange={(t) => update(index, { [field.key]: t })} />}
            </Field>
          ))}
          <button type="button" className="a-btn-secondary justify-self-start" onClick={() => onChange(items.filter((_, i) => i !== index))}>Remove</button>
        </div>
      ))}
      <button type="button" className="a-btn-secondary justify-self-start" onClick={() => onChange([...(items || []), blank])}>{addLabel}</button>
    </div>
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
