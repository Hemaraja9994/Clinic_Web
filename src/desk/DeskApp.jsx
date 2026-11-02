import React, { useEffect, useMemo, useState } from 'react';
import { Banknote, Building2, LayoutDashboard, LogOut } from 'lucide-react';

import { CollectionEditor } from '../shared/CollectionEditor.jsx';
import {
  CATEGORIES,
  PAYMENT_METHODS,
  SERVICE_GROUPS,
  SRI_RUDRA_CLINIC,
  categoryLabel,
  collectionsToCsv,
  filterCollections,
  formatRupees,
  localDateISO,
  methodLabel,
  monthStartISO,
  slugClinicId,
} from '../shared/collectionCatalog.js';
import { Field, Input, TextArea } from '../admin/components/ui.jsx';
import {
  checkDeskPassword,
  createDeskUser,
  currentSession,
  exportBackup,
  importBackup,
  loadDesk,
  newId,
  saveDesk,
  setSession,
} from './store.js';

function useHashPage() {
  const read = () => (window.location.hash.replace(/^#/, '') || '/').split('?')[0];
  const [page, setPage] = useState(read);
  useEffect(() => {
    const onChange = () => setPage(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return page;
}

export default function DeskApp() {
  const [state, setState] = useState(null);
  const [user, setUser] = useState('');
  const page = useHashPage();

  useEffect(() => {
    setState(loadDesk());
    setUser(currentSession());
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return undefined;
    const url = new URL('sw.js', window.location.href);
    navigator.serviceWorker.register(url).catch(() => {});
    return undefined;
  }, []);

  const update = (next) => {
    setState(saveDesk(next));
  };

  if (!state) return <p className="p-10 text-center text-clinic-clay">Loading…</p>;
  if (!user) {
    return (
      <AuthScreen
        state={state}
        onReady={(next, username) => {
          update(next);
          setSession(username);
          setUser(username);
        }}
      />
    );
  }

  const signOut = () => {
    setSession('');
    setUser('');
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-clinic-maroonDeep p-5 text-clinic-ivory lg:flex">
        <Brand />
        <div className="mt-8">
          <Nav page={page} />
        </div>
        <div className="mt-auto">
          <SignOut user={user} onSignOut={signOut} />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-3 bg-clinic-maroonDeep px-4 py-3 text-clinic-ivory lg:hidden">
          <Brand />
          <button type="button" onClick={signOut} className="inline-flex items-center gap-1 text-sm">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 lg:hidden">
          <Nav page={page} light />
        </div>
        <main className="px-4 py-6 sm:px-8">
          {page.startsWith('/collections') && <CollectionsPage state={state} update={update} />}
          {page.startsWith('/clinics') && <ClinicsPage state={state} update={update} />}
          {!page.startsWith('/collections') && !page.startsWith('/clinics') && <DashboardPage state={state} update={update} user={user} />}
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <a href="#/" className="flex items-center gap-3">
      <img src="clinic-logo-mobile.png" alt="" className="h-10 w-10 rounded-xl bg-clinic-ivory object-contain p-1" />
      <div className="leading-tight">
        <p className="text-sm font-semibold">Sri Rudra</p>
        <p className="text-xs text-clinic-saffronSoft/80">Clinic desk · offline</p>
      </div>
    </a>
  );
}

function Nav({ page, light }) {
  const items = [
    ['/', 'Dashboard', LayoutDashboard],
    ['/collections', 'Collections', Banknote],
    ['/clinics', 'Clinics', Building2],
  ];
  return (
    <nav className={light ? 'flex gap-2' : 'grid content-start gap-1'}>
      {items.map(([path, label, Icon]) => {
        const active = path === '/' ? page === '/' : page.startsWith(path);
        const tone = light
          ? (active ? 'bg-clinic-maroon text-clinic-ivory' : 'bg-white text-clinic-umber ring-1 ring-clinic-sand')
          : (active ? 'bg-clinic-ivory text-clinic-maroon' : 'text-clinic-ivory/80 hover:bg-white/10');
        return (
          <a key={path} href={`#${path}`} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${tone}`}>
            <Icon className="h-4 w-4" /> {label}
          </a>
        );
      })}
    </nav>
  );
}

function SignOut({ user, onSignOut }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 text-sm">
      <p className="font-semibold">{user}</p>
      <p className="text-xs text-clinic-saffronSoft/80">Saved on this device</p>
      <button type="button" data-testid="sign-out" onClick={onSignOut} className="mt-3 inline-flex items-center gap-1 text-xs text-clinic-ivory/80">
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
    </div>
  );
}

function DashboardPage({ state, update, user }) {
  const today = localDateISO();
  const [note, setNote] = useState(state.notes[today] || '');
  const [saved, setSaved] = useState(false);
  const todays = state.collections.filter((row) => row.collection_date === today);
  const total = todays.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const clinic = state.clinics.find((item) => item.id === SRI_RUDRA_CLINIC.id) || state.clinics[0];

  const saveNote = (event) => {
    event.preventDefault();
    update({ ...state, notes: { ...state.notes, [today]: note.slice(0, 2000) } });
    setSaved(true);
  };

  return (
    <>
      <h1 className="font-heading text-3xl font-semibold text-clinic-maroon">Good day.</h1>
      <p className="mt-1 text-sm text-clinic-clay">{today} · signed in as {user}. This desk keeps working with the internet off.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={saveNote} className="a-card">
          <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Today’s note</h2>
          <p className="mt-1 text-sm text-clinic-clay">A note for the day — reminders, who is covering, anything the next person should see.</p>
          <textarea
            data-testid="note"
            className="a-input mt-3 py-2"
            rows={4}
            value={note}
            onChange={(event) => { setNote(event.target.value); setSaved(false); }}
            placeholder="Write a note for today"
          />
          <div className="mt-3 flex items-center gap-3">
            <button type="submit" data-testid="save-note" className="a-btn-primary">Save note</button>
            {saved && <p className="text-sm text-emerald-800">Saved on this device.</p>}
          </div>
        </form>
        <section className="a-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-clinic-umber">Collected today</p>
          <p className="mt-2 font-heading text-3xl text-clinic-maroon">{formatRupees(total)}</p>
          <p className="mt-1 text-sm text-clinic-clay">{todays.length} record{todays.length === 1 ? '' : 's'}</p>
          <a href="#/collections" className="a-btn-secondary mt-4">Open collections</a>
        </section>
      </div>

      {clinic && (
        <section className="a-card mt-4">
          <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{clinic.name}</h2>
          <p className="mt-2 text-sm leading-6 text-clinic-ink">{clinic.address}</p>
          <p className="mt-2 text-sm text-clinic-clay">
            Call / WhatsApp: {(clinic.phones || [clinic.phone]).filter(Boolean).join(' · ')}
            {clinic.email ? ` · ${clinic.email}` : ''}
          </p>
        </section>
      )}

      <section className="a-card mt-4">
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Install</h2>
        <p className="mt-2 text-sm leading-6 text-clinic-clay">
          On a phone, open this page in Chrome and use Install app or Add to Home Screen. After it has opened once online, it can be used without internet. Records stay on that phone.
        </p>
        {/desk\.html|\/desk\/?$/.test(window.location.pathname) && (
          <a className="a-btn-secondary mt-3" href="downloads/Sri-Rudra-Desk-Windows.zip">Download the Windows package</a>
        )}
      </section>
    </>
  );
}

function CollectionsPage({ state, update }) {
  const today = localDateISO();
  const [filters, setFilters] = useState({
    from: monthStartISO(today),
    to: today,
    clinicId: 'all',
    category: 'all',
    method: 'all',
    q: '',
  });
  const [draftQ, setDraftQ] = useState('');
  const [editor, setEditor] = useState(null);
  const [message, setMessage] = useState('');

  const rows = useMemo(() => {
    const named = state.collections.map((row) => ({
      ...row,
      clinic_name: state.clinics.find((clinic) => clinic.id === row.clinic_id)?.name || row.clinic_id,
    }));
    return filterCollections(named, filters)
      .slice()
      .sort((a, b) => (a.collection_date < b.collection_date ? 1 : a.collection_date > b.collection_date ? -1 : String(b.id).localeCompare(String(a.id))));
  }, [state, filters]);

  const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  const saveRows = (incoming) => {
    if (editor?.id) {
      const [row] = incoming;
      update({
        ...state,
        collections: state.collections.map((item) => (item.id === editor.id ? { ...item, ...row } : item)),
      });
    } else {
      update({
        ...state,
        collections: [
          ...incoming.map((row) => ({ ...row, id: newId() })),
          ...state.collections,
        ],
      });
    }
    setEditor(null);
    setMessage(incoming.length > 1 ? `Saved ${incoming.length} collections.` : 'Saved.');
  };

  const remove = (id) => {
    if (!window.confirm('Delete this collection?')) return;
    update({ ...state, collections: state.collections.filter((row) => row.id !== id) });
  };

  const download = (filename, text, type) => {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      update(importBackup(state, await file.text()));
      setMessage('Backup imported onto this device.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-clinic-maroon">Collections</h1>
          <p className="mt-1 text-sm text-clinic-clay">Money taken in each day, split by what it was for.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="a-btn-secondary" onClick={() => download(`collections-${today}.csv`, collectionsToCsv(rows), 'text/csv')}>Export CSV</button>
          <button type="button" className="a-btn-secondary" onClick={() => download(`sri-rudra-desk-${today}.json`, exportBackup(state), 'application/json')}>Export backup</button>
          <label className="a-btn-secondary cursor-pointer">
            Import backup
            <input data-testid="import-backup" type="file" accept="application/json,.json" className="hidden" onChange={onImport} />
          </label>
          <button type="button" data-testid="record-collection" className="a-btn-primary" onClick={() => setEditor({})}>Record collection</button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Filter label="From"><input className="a-input" type="date" value={filters.from} onChange={setFilter('from')} /></Filter>
        <Filter label="To"><input className="a-input" type="date" value={filters.to} onChange={setFilter('to')} /></Filter>
        <Filter label="Clinic">
          <select className="a-input" value={filters.clinicId} onChange={setFilter('clinicId')}>
            <option value="all">All</option>
            {state.clinics.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}
          </select>
        </Filter>
        <Filter label="Category">
          <select className="a-input" data-testid="filter-category" value={filters.category} onChange={setFilter('category')}>
            <option value="all">All</option>
            {CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </Filter>
        <Filter label="Method">
          <select className="a-input" value={filters.method} onChange={setFilter('method')}>
            <option value="all">All</option>
            {PAYMENT_METHODS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </Filter>
        <Filter label="Search">
          <form onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, q: draftQ })); }}>
            <input data-testid="search" className="a-input" placeholder="Phone, reference or note…" value={draftQ} onChange={(event) => setDraftQ(event.target.value)} />
          </form>
        </Filter>
      </div>

      {message && <p className="mb-3 text-sm text-clinic-umber">{message}</p>}

      <div className="a-card overflow-x-auto p-0">
        <table className="a-table">
          <thead>
            <tr>
              <th>Date</th><th>Clinic</th><th>Category</th><th>Method</th><th>Phone</th><th>Reference</th><th>Notes</th><th>Amount</th><th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-clinic-clay">No collections in this range.</td></tr>}
            {rows.map((row) => (
              <tr key={row.id} data-testid="collection-row">
                <td className="whitespace-nowrap">{row.collection_date.split('-').reverse().join('-')}</td>
                <td>{row.clinic_name}</td>
                <td>{categoryLabel(row.category)}</td>
                <td>{methodLabel(row.method)}</td>
                <td className="whitespace-nowrap">{row.phone || '—'}</td>
                <td>{row.reference || '—'}</td>
                <td>{row.notes || '—'}</td>
                <td className="whitespace-nowrap font-semibold">{formatRupees(row.amount)}</td>
                <td className="whitespace-nowrap">
                  <button type="button" className="text-sm font-semibold text-clinic-maroon" onClick={() => setEditor(row)}>Edit</button>
                  <button type="button" className="ml-3 text-sm text-red-700" onClick={() => remove(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-clinic-clay">{rows.length} record{rows.length === 1 ? '' : 's'} · {formatRupees(total)}</p>

      {editor && (
        <CollectionEditor clinics={state.clinics} initial={editor.id ? editor : null} onSubmit={saveRows} onClose={() => setEditor(null)} />
      )}
    </>
  );
}

function Filter({ label, children }) {
  return (
    <label className="block">
      <span className="a-label">{label}</span>
      {children}
    </label>
  );
}

function ClinicsPage({ state, update }) {
  const [form, setForm] = useState({ name: '', city: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const add = (event) => {
    event.preventDefault();
    setError('');
    const name = form.name.trim();
    if (!name) {
      setError('Clinic name is required.');
      return;
    }
    let id = slugClinicId(name);
    if (state.clinics.some((clinic) => clinic.id === id)) id = `${id}-${state.clinics.length + 1}`;
    update({
      ...state,
      clinics: [...state.clinics, { id, name, group_name: '', city: form.city.trim(), phone: form.phone.trim(), address: form.address.trim() }],
    });
    setForm({ name: '', city: '', phone: '', address: '' });
  };

  return (
    <>
      <h1 className="font-heading text-3xl font-semibold text-clinic-maroon">Clinics</h1>
      <p className="mt-1 max-w-2xl text-sm text-clinic-clay">
        Every clinic can record the same services, including Huggies, ear tips and domes, and the combined tests (PTA + Impedance, PTA + Impedance + Tinnitus, BERA & OAE).
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {state.clinics.map((clinic) => (
          <article key={clinic.id} className="a-card">
            <h2 className="font-heading text-xl font-semibold text-clinic-maroon">{clinic.name}</h2>
            {clinic.city && <p className="text-sm text-clinic-clay">{clinic.city}</p>}
            {clinic.address && <p className="mt-2 text-sm leading-6">{clinic.address}</p>}
            {clinic.phone && <p className="mt-2 text-sm">Phone: {clinic.phone}</p>}
            <div className="mt-4 grid gap-3">
              {SERVICE_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-clinic-umber">{group.title}</p>
                  <p className="mt-1 text-sm leading-6 text-clinic-ink">{group.ids.map((id) => categoryLabel(id)).join(' · ')}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <form onSubmit={add} className="a-card mt-4 grid max-w-xl gap-3">
        <h2 className="font-heading text-xl font-semibold text-clinic-maroon">Add a clinic</h2>
        <Field label="Clinic name *"><Input data-testid="clinic-name" value={form.name} onChange={set('name')} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="City"><Input value={form.city} onChange={set('city')} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={set('phone')} /></Field>
        </div>
        <Field label="Address"><TextArea value={form.address} onChange={set('address')} rows={2} /></Field>
        {error && <p className="text-sm text-red-800">{error}</p>}
        <button type="submit" data-testid="add-clinic" className="a-btn-primary justify-self-start">Add clinic</button>
      </form>
    </>
  );
}

function AuthScreen({ state, onReady }) {
  const setup = state.users.length === 0;
  return (
    <div className="grid min-h-screen place-items-center bg-clinic-parchment p-4">
      <div className="a-card w-full max-w-md p-8">
        <div className="flex items-center gap-3">
          <img src="clinic-logo-mobile.png" alt="" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <p className="font-semibold text-clinic-maroon">Sri Rudra Speech & Hearing Clinic</p>
            <p className="text-xs text-clinic-clay">Desk · works without internet</p>
          </div>
        </div>
        {setup ? <SetupForm state={state} onReady={onReady} /> : <LoginForm state={state} onReady={onReady} />}
        {/desk\.html|\/desk\/?$/.test(window.location.pathname) && (
          <a className="mt-4 inline-flex text-sm font-semibold text-clinic-maroon" href="downloads/Sri-Rudra-Desk-Windows.zip">Download the Windows package</a>
        )}
      </div>
    </div>
  );
}

function LockedFields({ username, password, setUsername, setPassword, usernameTestId, passwordTestId }) {
  const [armed, setArmed] = useState(false);
  const arm = () => setArmed(true);
  return (
    <>
      <Field label="Username">
        <Input
          name="sr-desk-user"
          data-testid={usernameTestId}
          value={username}
          onChange={setUsername}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          readOnly={!armed}
          onFocus={(event) => { event.currentTarget.readOnly = false; arm(); }}
          required
        />
      </Field>
      <Field label="Password">
        <Input
          name="sr-desk-secret"
          type="password"
          data-testid={passwordTestId}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          readOnly={!armed}
          onFocus={(event) => { event.currentTarget.readOnly = false; arm(); }}
          required
        />
      </Field>
    </>
  );
}

function SetupForm({ state, onReady }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const next = await createDeskUser(state, username, password);
      onReady(next, username.trim().toLowerCase());
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={submit} className="mt-6 grid gap-4">
      <h1 className="font-heading text-2xl font-semibold">Set up this device</h1>
      <p className="text-sm text-clinic-clay">Create a sign-in for the staff who use this computer or phone. It is stored only on this device, and the browser is not asked to fill it in later.</p>
      <LockedFields username={username} password={password} setUsername={setUsername} setPassword={setPassword} usernameTestId="setup-username" passwordTestId="setup-password" />
      <Field label="Confirm password">
        <Input name="sr-desk-confirm" type="password" data-testid="setup-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" required />
      </Field>
      {error && <p className="text-sm text-red-800">{error}</p>}
      <button type="submit" data-testid="setup-submit" className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Create sign-in'}</button>
    </form>
  );
}

function LoginForm({ state, onReady }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const name = await checkDeskPassword(state, username, password);
      onReady(state, name);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={submit} className="mt-6 grid gap-4">
      <h1 className="font-heading text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-clinic-clay">Use the username and password created on this device. Signing out leaves these boxes empty.</p>
      <LockedFields username={username} password={password} setUsername={setUsername} setPassword={setPassword} usernameTestId="login-username" passwordTestId="login-password" />
      {error && <p className="text-sm text-red-800">{error}</p>}
      <button type="submit" data-testid="login-submit" className="a-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
