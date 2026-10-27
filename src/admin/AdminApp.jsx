import React, { useEffect, useState } from 'react';
import { CalendarCheck, ClipboardList, Globe, LayoutDashboard, LogOut, Menu, ShieldCheck, UsersRound, X } from 'lucide-react';

import { api } from './api.js';
import { Alert, Field, Input } from './components/ui.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Appointments from './pages/Appointments.jsx';
import Patients from './pages/Patients.jsx';
import PatientDetail from './pages/PatientDetail.jsx';
import ReportEditor from './pages/ReportEditor.jsx';
import ReportPrint from './pages/ReportPrint.jsx';
import SiteContent from './pages/SiteContent.jsx';
import Staff from './pages/Staff.jsx';
import { UserContext } from './session.js';

// Pages are addressed by the part of the URL after "#", e.g. #/patients/12.
function useHashRoute() {
  const read = () => (window.location.hash.replace(/^#/, '') || '/').split('?')[0];
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

const NAV = [
  ['/', 'Dashboard', LayoutDashboard, ['admin', 'therapist', 'reception']],
  ['/appointments', 'Appointments', CalendarCheck, ['admin', 'therapist', 'reception']],
  ['/patients', 'Patients', ClipboardList, ['admin', 'therapist', 'reception']],
  ['/content', 'Website content', Globe, ['admin']],
  ['/staff', 'Staff & audit log', UsersRound, ['admin']],
];

const ROLE_LABEL = { admin: 'Admin', therapist: 'Audiologist / SLP', reception: 'Reception' };

function matchPage(route, user) {
  let m;
  if (route === '/') return <Dashboard />;
  if (route === '/appointments') return <Appointments />;
  if (route === '/patients') return <Patients />;
  if ((m = route.match(/^\/patients\/(\d+)$/))) return <PatientDetail id={m[1]} />;
  if (user.role !== 'reception') {
    if ((m = route.match(/^\/patients\/(\d+)\/reports\/new\/(audiology|speech_language)$/))) return <ReportEditor patientId={m[1]} type={m[2]} />;
    if ((m = route.match(/^\/reports\/(\d+)$/))) return <ReportEditor id={m[1]} />;
    if ((m = route.match(/^\/reports\/(\d+)\/print$/))) return <ReportPrint id={m[1]} />;
  }
  if (user.role === 'admin') {
    if (route === '/content') return <SiteContent />;
    if (route === '/staff') return <Staff />;
  }
  return <p className="text-clinic-clay">Page not found.</p>;
}

export default function AdminApp() {
  const [state, setState] = useState({ loading: true, user: null, needsSetup: false });
  const route = useHashRoute();

  const refresh = async () => {
    try {
      const { user } = await api('/auth/me');
      setState({ loading: false, user, needsSetup: false });
    } catch (err) {
      let needsSetup = false;
      try {
        ({ needsSetup } = await api('/setup'));
      } catch {
        // server unreachable – the login form will show the error
      }
      setState({ loading: false, user: null, needsSetup });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (state.loading) return <p className="p-10 text-center text-clinic-clay">Loading…</p>;
  if (!state.user) return state.needsSetup ? <Setup onDone={refresh} /> : <Login onDone={refresh} />;

  const user = state.user;
  const isPrint = /\/print$/.test(route);

  return (
    <UserContext.Provider value={user}>
      {isPrint ? (
        matchPage(route, user)
      ) : (
        <Shell user={user} route={route} onLogout={async () => { await api('/auth/logout', { method: 'POST' }); refresh(); }}>
          {matchPage(route, user)}
        </Shell>
      )}
    </UserContext.Provider>
  );
}

function Shell({ user, route, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const active = (path) => (path === '/' ? route === '/' : route.startsWith(path) || (path === '/patients' && route.startsWith('/reports')));

  const nav = (
    <nav className="grid gap-1">
      {NAV.filter(([, , , roles]) => roles.includes(user.role)).map(([path, label, Icon]) => (
        <a
          key={path}
          href={`#${path}`}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            active(path) ? 'bg-clinic-ivory text-clinic-maroon' : 'text-clinic-ivory/80 hover:bg-white/10 hover:text-clinic-ivory'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="no-print hidden min-h-screen flex-col bg-clinic-maroonDeep p-5 text-clinic-ivory lg:flex">
        <Brand />
        <div className="mt-8 flex-1">{nav}</div>
        <UserBox user={user} onLogout={onLogout} />
      </aside>

      <header className="no-print flex items-center justify-between bg-clinic-maroonDeep px-4 py-3 text-clinic-ivory lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-lg p-2 hover:bg-white/10">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>
      {open && (
        <div className="no-print bg-clinic-maroonDeep px-4 pb-4 text-clinic-ivory lg:hidden">
          {nav}
          <div className="mt-4"><UserBox user={user} onLogout={onLogout} /></div>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}

function Brand() {
  return (
    <a href="#/" className="flex items-center gap-3">
      <img src="/clinic-logo-mobile.png" alt="" className="h-10 w-10 rounded-xl bg-clinic-ivory object-contain p-1" />
      <div className="leading-tight">
        <p className="text-sm font-semibold">Sri Rudra Clinic</p>
        <p className="text-xs text-clinic-saffronSoft/80">Staff portal</p>
      </div>
    </a>
  );
}

function UserBox({ user, onLogout }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 text-sm">
      <p className="font-semibold">{user.full_name}</p>
      <p className="text-xs text-clinic-saffronSoft/80">{ROLE_LABEL[user.role]}</p>
      <div className="mt-3 flex gap-2">
        <ChangePasswordButton />
        <button type="button" onClick={onLogout} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-clinic-ivory/80 hover:bg-white/10">
          <LogOut className="h-3.5 w-3.5" /> Log out
        </button>
      </div>
    </div>
  );
}

function ChangePasswordButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api('/auth/password', { method: 'POST', body: form });
      setMsg({ tone: 'ok', text: 'Password changed.' });
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-clinic-ivory/80 hover:bg-white/10">
        <ShieldCheck className="h-3.5 w-3.5" /> Password
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 text-clinic-ink" onClick={() => setOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="a-card grid w-full max-w-sm gap-4">
            <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Change password</h2>
            <Field label="Current password"><Input type="password" value={form.currentPassword} onChange={(v) => setForm({ ...form, currentPassword: v })} autoComplete="current-password" /></Field>
            <Field label="New password (min. 10 characters)"><Input type="password" value={form.newPassword} onChange={(v) => setForm({ ...form, newPassword: v })} autoComplete="new-password" /></Field>
            {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
            <div className="flex justify-end gap-2">
              <button type="button" className="a-btn-secondary" onClick={() => setOpen(false)}>Close</button>
              <button type="submit" className="a-btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function AuthCard({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-clinic-parchment p-4">
      <div className="a-card w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <img src="/clinic-logo-mobile.png" alt="" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <p className="font-semibold text-clinic-maroon">Sri Rudra Speech & Hearing Clinic</p>
            <p className="text-xs text-clinic-clay">Staff portal</p>
          </div>
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-clinic-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-clinic-clay">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function Login({ onDone }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/auth/login', { method: 'POST', body: form });
      onDone();
    } catch (err) {
      setError(err.status === 404 || err.status === 405 ? 'The clinic server is not reachable from this address.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Staff login" subtitle="For clinic staff only. Patient information is confidential.">
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Username"><Input value={form.username} onChange={(v) => setForm({ ...form, username: v })} autoComplete="username" autoFocus /></Field>
        <Field label="Password"><Input type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} autoComplete="current-password" /></Field>
        <Alert>{error}</Alert>
        <button type="submit" className="a-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a href="/" className="text-center text-xs text-clinic-clay hover:text-clinic-maroon">← Back to clinic website</a>
      </form>
    </AuthCard>
  );
}

function Setup({ onDone }) {
  const [form, setForm] = useState({ setupToken: '', username: '', full_name: '', qualification: '', rci_number: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api('/setup', { method: 'POST', body: form });
      onDone();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard title="Create the first admin account" subtitle="One-time step. Use the SETUP_TOKEN you saved in Cloudflare.">
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Setup token"><Input type="password" value={form.setupToken} onChange={set('setupToken')} /></Field>
        <Field label="Full name"><Input value={form.full_name} onChange={set('full_name')} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Qualification"><Input value={form.qualification} onChange={set('qualification')} placeholder="e.g. MASLP" /></Field>
          <Field label="RCI reg. no."><Input value={form.rci_number} onChange={set('rci_number')} /></Field>
        </div>
        <Field label="Username"><Input value={form.username} onChange={set('username')} autoComplete="username" /></Field>
        <Field label="Password (min. 10 characters)"><Input type="password" value={form.password} onChange={set('password')} autoComplete="new-password" /></Field>
        <Alert>{error}</Alert>
        <button type="submit" className="a-btn-primary">Create admin account</button>
      </form>
    </AuthCard>
  );
}
