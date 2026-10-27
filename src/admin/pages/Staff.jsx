import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { api } from '../api.js';
import { Alert, Field, Input, PageHeader, Select } from '../components/ui.jsx';
import { useUser } from '../session.js';

const ROLES = [
  ['therapist', 'Audiologist / SLP – patients, reports, appointments'],
  ['reception', 'Reception – appointments and registration only'],
  ['admin', 'Admin – everything, incl. staff and website'],
];
const ROLE_SHORT = { admin: 'Admin', therapist: 'Audiologist / SLP', reception: 'Reception' };

export default function Staff() {
  const me = useUser();
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => {
    api('/users').then((d) => setUsers(d.users)).catch((e) => setError(e.message));
    api('/audit').then((d) => setAudit(d.entries)).catch(() => {});
  };
  useEffect(load, []);

  return (
    <>
      <PageHeader
        title="Staff accounts"
        subtitle="Each person should have their own login. Deactivate accounts when someone leaves."
        actions={<button type="button" className="a-btn-primary" onClick={() => setEditing({ role: 'therapist' })}><Plus className="h-4 w-4" />Add staff</button>}
      />
      <Alert>{error}</Alert>
      <div className="a-card overflow-x-auto p-0">
        <table className="a-table">
          <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Qualification / RCI</th><th>Status</th><th /></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-semibold">{u.full_name}</td>
                <td className="font-mono text-xs">{u.username}</td>
                <td>{ROLE_SHORT[u.role]}</td>
                <td>{[u.qualification, u.rci_number && `RCI ${u.rci_number}`].filter(Boolean).join(' · ')}</td>
                <td>{u.active ? 'Active' : <span className="text-red-700">Deactivated</span>}</td>
                <td className="text-right"><button type="button" className="a-btn-secondary min-h-8 px-3 text-xs" onClick={() => setEditing(u)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 font-heading text-2xl font-semibold text-clinic-maroon">Audit log</h2>
      <p className="mb-3 text-sm text-clinic-clay">Latest 200 actions: logins and every change to patients, reports, appointments, staff and website.</p>
      <div className="a-card max-h-[28rem] overflow-auto p-0">
        <table className="a-table">
          <thead><tr><th>When (UTC)</th><th>Who</th><th>Action</th><th>Record</th></tr></thead>
          <tbody>
            {audit.map((a) => (
              <tr key={a.id}>
                <td className="whitespace-nowrap text-xs">{a.created_at}</td>
                <td>{a.user_name || '—'}</td>
                <td className="font-mono text-xs">{a.action}</td>
                <td className="text-xs">{a.entity ? `${a.entity} #${a.entity_id ?? ''}` : ''} {a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <StaffForm user={editing} isSelf={editing.id === me.id} onClose={(changed) => { setEditing(null); if (changed) load(); }} />}
    </>
  );
}

function StaffForm({ user, isSelf, onClose }) {
  const isNew = !user.id;
  const [form, setForm] = useState({ ...user, password: '' });
  const [error, setError] = useState('');
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const save = async (e) => {
    e.preventDefault();
    try {
      if (isNew) await api('/users', { method: 'POST', body: form });
      else {
        const body = { full_name: form.full_name, role: form.role, qualification: form.qualification, rci_number: form.rci_number, active: Boolean(form.active) };
        if (form.password) body.password = form.password;
        await api(`/users/${user.id}`, { method: 'PATCH', body });
      }
      onClose(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4" onClick={() => onClose(false)}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="a-card grid w-full max-w-lg gap-4">
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{isNew ? 'Add staff member' : `Edit – ${user.full_name}`}</h2>
        <Field label="Full name"><Input value={form.full_name} onChange={set('full_name')} required /></Field>
        {isNew && <Field label="Username (for login)"><Input value={form.username} onChange={set('username')} required placeholder="e.g. priya.slp" /></Field>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Qualification"><Input value={form.qualification} onChange={set('qualification')} placeholder="e.g. BASLP, MSc (Aud)" /></Field>
          <Field label="RCI reg. no."><Input value={form.rci_number} onChange={set('rci_number')} /></Field>
        </div>
        <Field label="Role"><Select value={form.role} onChange={set('role')} options={ROLES} disabled={isSelf} /></Field>
        <Field label={isNew ? 'Password (min. 10 characters)' : 'Reset password (leave blank to keep)'}>
          <Input type="password" value={form.password} onChange={set('password')} required={isNew} autoComplete="new-password" />
        </Field>
        {!isNew && !isSelf && (
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(form.active)} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Account active
          </label>
        )}
        <Alert>{error}</Alert>
        <div className="flex justify-end gap-2">
          <button type="button" className="a-btn-secondary" onClick={() => onClose(false)}>Cancel</button>
          <button type="submit" className="a-btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
