// All /api/* endpoints. Each route lists the roles allowed to call it.
//
// Roles:
//   admin     – everything, including staff accounts and website content
//   therapist – appointments, patients and clinical reports
//   reception – appointments and patient registration (no clinical reports or case history)

import {
  assertNotLockedOut,
  checkPasswordStrength,
  createSession,
  currentUser,
  destroySession,
  hashPassword,
  recordAttempt,
  requireRole,
  verifyPassword,
} from './auth.js';
import { HttpError, clientIp, isDate, json, readJson, required, text } from './http.js';

const ALL_STAFF = ['admin', 'therapist', 'reception'];
const CLINICAL = ['admin', 'therapist'];
const APPOINTMENT_STATUSES = ['requested', 'confirmed', 'completed', 'cancelled', 'no_show'];
const REPORT_TYPES = ['audiology', 'speech_language'];
const CONTENT_KEYS = ['announcement', 'hours', 'services'];

async function audit(db, user, action, entity, entityId, detail) {
  await db.prepare('INSERT INTO audit_log (user_id, action, entity, entity_id, detail) VALUES (?, ?, ?, ?, ?)')
    .bind(user?.id ?? null, action, entity ?? null, entityId ?? null, detail ?? null)
    .run();
}

function publicUser(u) {
  return { id: u.id, username: u.username, full_name: u.full_name, role: u.role, qualification: u.qualification, rci_number: u.rci_number };
}

// ---------- auth ----------

async function setupStatus({ db }) {
  const row = await db.prepare('SELECT COUNT(*) AS n FROM users').first();
  return json({ needsSetup: row.n === 0 });
}

// Creates the first admin account. Works only while there are no users at all,
// and only with the SETUP_TOKEN secret configured in Cloudflare.
async function setup({ db, env, request }) {
  if (!env.SETUP_TOKEN) throw new HttpError(403, 'Setup is disabled. Add a SETUP_TOKEN secret in Cloudflare first.');
  const body = await readJson(request);
  if (body.setupToken !== env.SETUP_TOKEN) throw new HttpError(403, 'Setup token is incorrect.');
  const row = await db.prepare('SELECT COUNT(*) AS n FROM users').first();
  if (row.n > 0) throw new HttpError(409, 'An admin account already exists.');
  checkPasswordStrength(body.password);
  const username = required(body.username, 'Username', 40).toLowerCase();
  const result = await db.prepare(
    'INSERT INTO users (username, full_name, role, qualification, rci_number, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
  ).bind(username, required(body.full_name, 'Full name', 120), 'admin', text(body.qualification, 120), text(body.rci_number, 60), await hashPassword(body.password)).run();
  const user = { id: result.meta.last_row_id };
  await audit(db, user, 'user.setup_admin', 'user', user.id);
  return json({ ok: true }, 201, { 'set-cookie': await createSession(db, request, user.id) });
}

async function login({ db, request }) {
  const body = await readJson(request);
  const username = String(body.username || '').trim().toLowerCase();
  const ip = clientIp(request);
  await assertNotLockedOut(db, [[`ip:${ip}`, 20], [`user:${username}`, 5]], 15);
  const user = await db.prepare('SELECT * FROM users WHERE username = ? AND active = 1').bind(username).first();
  const ok = user && (await verifyPassword(String(body.password || ''), user.password_hash));
  if (!ok) {
    await recordAttempt(db, `ip:${ip}`);
    await recordAttempt(db, `user:${username}`);
    throw new HttpError(401, 'Incorrect username or password.');
  }
  await db.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(new Date().toISOString()).run();
  await audit(db, user, 'user.login', 'user', user.id);
  return json({ user: publicUser(user) }, 200, { 'set-cookie': await createSession(db, request, user.id) });
}

async function logout({ db, request }) {
  return json({ ok: true }, 200, { 'set-cookie': await destroySession(db, request) });
}

async function me({ user }) {
  if (!user) throw new HttpError(401, 'Please log in.');
  return json({ user });
}

async function changePassword({ db, user, request }) {
  requireRole(user);
  const body = await readJson(request);
  const row = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first();
  if (!(await verifyPassword(String(body.currentPassword || ''), row.password_hash))) {
    throw new HttpError(400, 'Current password is incorrect.');
  }
  checkPasswordStrength(body.newPassword);
  await db.batch([
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(await hashPassword(body.newPassword), user.id),
    db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id),
  ]);
  await audit(db, user, 'user.change_password', 'user', user.id);
  return json({ ok: true }, 200, { 'set-cookie': await createSession(db, request, user.id) });
}

// ---------- public website ----------

async function publicContent({ db }) {
  const { results } = await db.prepare(`SELECT key, value FROM site_content WHERE key IN (${CONTENT_KEYS.map(() => '?').join(',')})`)
    .bind(...CONTENT_KEYS)
    .all();
  const content = Object.fromEntries(results.map((r) => [r.key, JSON.parse(r.value)]));
  return json(content, 200, { 'cache-control': 'public, max-age=60' });
}

async function publicBooking({ db, request }) {
  const body = await readJson(request);
  if (body.website) return json({ ok: true }, 201); // honeypot field filled → likely a bot; pretend success
  const ip = clientIp(request);
  await assertNotLockedOut(db, [[`book:${ip}`, 6]], 60);
  const phone = required(body.phone, 'Phone', 20);
  if (!/^[0-9+\-\s]{10,15}$/.test(phone)) throw new HttpError(400, 'Enter a valid phone number.');
  if (!isDate(body.date)) throw new HttpError(400, 'Pick a valid date.');
  await recordAttempt(db, `book:${ip}`);
  const result = await db.prepare(
    'INSERT INTO appointments (name, age, phone, service, concern, date, time, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(required(body.name, 'Name', 120), text(body.age, 20), phone, text(body.service, 120), text(body.concern, 1000), body.date, text(body.time, 20), 'website').run();
  return json({ ok: true, id: result.meta.last_row_id }, 201);
}

// ---------- dashboard ----------

async function dashboard({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const today = url.searchParams.get('today') || new Date().toISOString().slice(0, 10);
  const monthStart = `${today.slice(0, 7)}-01`;
  const [todayAppts, pending, patients, reports] = await db.batch([
    db.prepare("SELECT * FROM appointments WHERE date = ? AND status IN ('requested','confirmed','completed') ORDER BY time").bind(today),
    db.prepare("SELECT COUNT(*) AS n FROM appointments WHERE status = 'requested'"),
    db.prepare('SELECT COUNT(*) AS n FROM patients'),
    db.prepare('SELECT COUNT(*) AS n FROM reports WHERE report_date >= ?').bind(monthStart),
  ]);
  return json({
    today: todayAppts.results,
    pendingRequests: pending.results[0].n,
    patientCount: patients.results[0].n,
    reportsThisMonth: reports.results[0].n,
  });
}

// ---------- appointments ----------

async function listAppointments({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const where = [];
  const args = [];
  const status = url.searchParams.get('status');
  if (status && APPOINTMENT_STATUSES.includes(status)) { where.push('status = ?'); args.push(status); }
  const from = url.searchParams.get('from');
  if (isDate(from)) { where.push('date >= ?'); args.push(from); }
  const to = url.searchParams.get('to');
  if (isDate(to)) { where.push('date <= ?'); args.push(to); }
  const q = text(url.searchParams.get('q'), 60);
  if (q) { where.push('(name LIKE ? OR phone LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  const sql = `SELECT * FROM appointments ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY date DESC, time LIMIT 300`;
  const { results } = await db.prepare(sql).bind(...args).all();
  return json({ appointments: results });
}

async function createAppointment({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  if (!isDate(body.date)) throw new HttpError(400, 'Pick a valid date.');
  const result = await db.prepare(
    `INSERT INTO appointments (patient_id, name, age, phone, service, concern, date, time, status, source, staff_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 'staff', ?)`,
  ).bind(body.patient_id || null, required(body.name, 'Name', 120), text(body.age, 20), required(body.phone, 'Phone', 20), text(body.service, 120), text(body.concern, 1000), body.date, text(body.time, 20), text(body.staff_notes, 1000)).run();
  await audit(db, user, 'appointment.create', 'appointment', result.meta.last_row_id);
  return json({ id: result.meta.last_row_id }, 201);
}

async function updateAppointment({ db, user, request, params }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  const current = await db.prepare('SELECT * FROM appointments WHERE id = ?').bind(params.id).first();
  if (!current) throw new HttpError(404, 'Appointment not found.');
  const status = body.status ?? current.status;
  if (!APPOINTMENT_STATUSES.includes(status)) throw new HttpError(400, 'Unknown status.');
  const date = body.date ?? current.date;
  if (!isDate(date)) throw new HttpError(400, 'Pick a valid date.');
  await db.prepare(
    `UPDATE appointments SET status = ?, date = ?, time = ?, patient_id = ?, staff_notes = ?, updated_at = datetime('now') WHERE id = ?`,
  ).bind(
    status,
    date,
    body.time !== undefined ? text(body.time, 20) : current.time,
    body.patient_id !== undefined ? body.patient_id || null : current.patient_id,
    body.staff_notes !== undefined ? text(body.staff_notes, 1000) : current.staff_notes,
    params.id,
  ).run();
  await audit(db, user, 'appointment.update', 'appointment', Number(params.id), `status=${status}`);
  return json({ ok: true });
}

async function deleteAppointment({ db, user, params }) {
  requireRole(user, 'admin');
  await db.prepare('DELETE FROM appointments WHERE id = ?').bind(params.id).run();
  await audit(db, user, 'appointment.delete', 'appointment', Number(params.id));
  return json({ ok: true });
}

// ---------- patients ----------

const PATIENT_FIELDS = {
  name: 120, dob: 10, age: 20, sex: 20, phone: 20, alt_phone: 20, address: 500,
  languages: 120, referred_by: 120, chief_complaint: 1000, case_history: 8000,
};

function patientValues(body, user) {
  if (!text(body.name)) throw new HttpError(400, 'Patient name is required.');
  const values = {};
  for (const [field, max] of Object.entries(PATIENT_FIELDS)) values[field] = text(body[field], max);
  // Reception staff register demographics only; clinical history is entered by clinicians.
  if (user.role === 'reception') delete values.case_history;
  return values;
}

function stripClinical(patient, user) {
  if (user.role === 'reception' && patient) delete patient.case_history;
  return patient;
}

async function nextRegNo(db) {
  const year = new Date().getFullYear();
  const row = await db.prepare("SELECT reg_no FROM patients WHERE reg_no LIKE ? ORDER BY id DESC LIMIT 1").bind(`SR-${year}-%`).first();
  const last = row ? Number(row.reg_no.split('-')[2]) : 0;
  return `SR-${year}-${String(last + 1).padStart(4, '0')}`;
}

async function listPatients({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const q = text(url.searchParams.get('q'), 60);
  const stmt = q
    ? db.prepare('SELECT id, reg_no, name, age, sex, phone, created_at FROM patients WHERE name LIKE ? OR phone LIKE ? OR reg_no LIKE ? ORDER BY id DESC LIMIT 200').bind(`%${q}%`, `%${q}%`, `%${q}%`)
    : db.prepare('SELECT id, reg_no, name, age, sex, phone, created_at FROM patients ORDER BY id DESC LIMIT 200');
  const { results } = await stmt.all();
  return json({ patients: results });
}

async function createPatient({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const values = patientValues(await readJson(request), user);
  const cols = Object.keys(values);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const regNo = await nextRegNo(db);
    try {
      const result = await db.prepare(
        `INSERT INTO patients (reg_no, ${cols.join(', ')}, created_by) VALUES (?, ${cols.map(() => '?').join(', ')}, ?)`,
      ).bind(regNo, ...cols.map((c) => values[c]), user.id).run();
      await audit(db, user, 'patient.create', 'patient', result.meta.last_row_id, regNo);
      return json({ id: result.meta.last_row_id, reg_no: regNo }, 201);
    } catch (err) {
      if (!String(err.message).includes('UNIQUE')) throw err; // two registrations at once → retry with the next number
    }
  }
  throw new HttpError(409, 'Could not allocate a registration number, please retry.');
}

async function getPatient({ db, user, params }) {
  requireRole(user, ...ALL_STAFF);
  const patient = await db.prepare('SELECT * FROM patients WHERE id = ?').bind(params.id).first();
  if (!patient) throw new HttpError(404, 'Patient not found.');
  const [appts, reports] = await db.batch([
    db.prepare('SELECT * FROM appointments WHERE patient_id = ? ORDER BY date DESC').bind(params.id),
    db.prepare(
      `SELECT r.id, r.type, r.report_date, r.status, u.full_name AS clinician
         FROM reports r LEFT JOIN users u ON u.id = r.clinician_id
        WHERE r.patient_id = ? ORDER BY r.report_date DESC, r.id DESC`,
    ).bind(params.id),
  ]);
  return json({
    patient: stripClinical(patient, user),
    appointments: appts.results,
    reports: CLINICAL.includes(user.role) ? reports.results : [],
  });
}

async function updatePatient({ db, user, request, params }) {
  requireRole(user, ...ALL_STAFF);
  const values = patientValues(await readJson(request), user);
  const cols = Object.keys(values);
  const result = await db.prepare(
    `UPDATE patients SET ${cols.map((c) => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`,
  ).bind(...cols.map((c) => values[c]), params.id).run();
  if (!result.meta.changes) throw new HttpError(404, 'Patient not found.');
  await audit(db, user, 'patient.update', 'patient', Number(params.id));
  return json({ ok: true });
}

// ---------- clinical reports ----------

async function loadReport(db, id) {
  const report = await db.prepare(
    `SELECT r.*, u.full_name AS clinician_name, u.qualification AS clinician_qualification, u.rci_number AS clinician_rci
       FROM reports r LEFT JOIN users u ON u.id = r.clinician_id WHERE r.id = ?`,
  ).bind(id).first();
  if (!report) throw new HttpError(404, 'Report not found.');
  report.data = JSON.parse(report.data);
  return report;
}

function reportData(body) {
  const data = body.data && typeof body.data === 'object' ? body.data : {};
  const s = JSON.stringify(data);
  if (s.length > 60000) throw new HttpError(400, 'Report is too large.');
  return s;
}

async function createReport({ db, user, request }) {
  requireRole(user, ...CLINICAL);
  const body = await readJson(request);
  if (!REPORT_TYPES.includes(body.type)) throw new HttpError(400, 'Unknown report type.');
  if (!isDate(body.report_date)) throw new HttpError(400, 'Pick a valid report date.');
  const patient = await db.prepare('SELECT id FROM patients WHERE id = ?').bind(body.patient_id).first();
  if (!patient) throw new HttpError(404, 'Patient not found.');
  const result = await db.prepare(
    'INSERT INTO reports (patient_id, type, report_date, data, clinician_id) VALUES (?, ?, ?, ?, ?)',
  ).bind(patient.id, body.type, body.report_date, reportData(body), user.id).run();
  await audit(db, user, 'report.create', 'report', result.meta.last_row_id, body.type);
  return json({ id: result.meta.last_row_id }, 201);
}

async function getReport({ db, user, params }) {
  requireRole(user, ...CLINICAL);
  const report = await loadReport(db, params.id);
  const patient = await db.prepare('SELECT * FROM patients WHERE id = ?').bind(report.patient_id).first();
  return json({ report, patient });
}

async function updateReport({ db, user, request, params }) {
  requireRole(user, ...CLINICAL);
  const body = await readJson(request);
  const report = await loadReport(db, params.id);
  // A finalised report is a signed clinical record: only an admin can reopen it.
  if (report.status === 'final' && user.role !== 'admin') {
    throw new HttpError(403, 'This report is final. Ask an admin to reopen it.');
  }
  const status = body.status ?? report.status;
  if (!['draft', 'final'].includes(status)) throw new HttpError(400, 'Unknown status.');
  const date = body.report_date ?? report.report_date;
  if (!isDate(date)) throw new HttpError(400, 'Pick a valid report date.');
  await db.prepare(`UPDATE reports SET data = ?, report_date = ?, status = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(body.data !== undefined ? reportData(body) : JSON.stringify(report.data), date, status, params.id)
    .run();
  const action = status !== report.status ? (status === 'final' ? 'report.finalise' : 'report.reopen') : 'report.update';
  await audit(db, user, action, 'report', Number(params.id));
  return json({ ok: true });
}

async function deleteReport({ db, user, params }) {
  requireRole(user, ...CLINICAL);
  const report = await loadReport(db, params.id);
  if (report.status === 'final' && user.role !== 'admin') throw new HttpError(403, 'Final reports can only be deleted by an admin.');
  await db.prepare('DELETE FROM reports WHERE id = ?').bind(params.id).run();
  await audit(db, user, 'report.delete', 'report', Number(params.id));
  return json({ ok: true });
}

// ---------- website content ----------

async function getContent({ db, user }) {
  requireRole(user, 'admin');
  const { results } = await db.prepare('SELECT key, value, updated_at FROM site_content').all();
  return json(Object.fromEntries(results.map((r) => [r.key, JSON.parse(r.value)])));
}

async function putContent({ db, user, request, params }) {
  requireRole(user, 'admin');
  if (!CONTENT_KEYS.includes(params.key)) throw new HttpError(404, 'Unknown content section.');
  const value = JSON.stringify((await readJson(request)).value ?? null);
  if (value.length > 20000) throw new HttpError(400, 'Content is too long.');
  await db.prepare(
    `INSERT INTO site_content (key, value, updated_by, updated_at) VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).bind(params.key, value, user.id).run();
  await audit(db, user, 'content.update', 'content', null, params.key);
  return json({ ok: true });
}

// ---------- staff accounts ----------

async function listUsers({ db, user }) {
  requireRole(user, 'admin');
  const { results } = await db.prepare('SELECT id, username, full_name, role, qualification, rci_number, active, created_at FROM users ORDER BY id').all();
  return json({ users: results });
}

async function createUser({ db, user, request }) {
  requireRole(user, 'admin');
  const body = await readJson(request);
  if (!ALL_STAFF.includes(body.role)) throw new HttpError(400, 'Unknown role.');
  checkPasswordStrength(body.password);
  const username = required(body.username, 'Username', 40).toLowerCase();
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw new HttpError(400, 'Username: 3–40 letters, numbers, dot, dash or underscore.');
  try {
    const result = await db.prepare(
      'INSERT INTO users (username, full_name, role, qualification, rci_number, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
    ).bind(username, required(body.full_name, 'Full name', 120), body.role, text(body.qualification, 120), text(body.rci_number, 60), await hashPassword(body.password)).run();
    await audit(db, user, 'user.create', 'user', result.meta.last_row_id, `${username} (${body.role})`);
    return json({ id: result.meta.last_row_id }, 201);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) throw new HttpError(409, 'That username is taken.');
    throw err;
  }
}

async function updateUser({ db, user, request, params }) {
  requireRole(user, 'admin');
  const body = await readJson(request);
  const target = await db.prepare('SELECT * FROM users WHERE id = ?').bind(params.id).first();
  if (!target) throw new HttpError(404, 'User not found.');
  const role = body.role ?? target.role;
  if (!ALL_STAFF.includes(role)) throw new HttpError(400, 'Unknown role.');
  const active = body.active !== undefined ? (body.active ? 1 : 0) : target.active;
  if (target.id === user.id && (role !== 'admin' || !active)) throw new HttpError(400, 'You cannot remove your own admin access.');
  const statements = [
    db.prepare('UPDATE users SET full_name = ?, role = ?, qualification = ?, rci_number = ?, active = ? WHERE id = ?').bind(
      body.full_name !== undefined ? required(body.full_name, 'Full name', 120) : target.full_name,
      role,
      body.qualification !== undefined ? text(body.qualification, 120) : target.qualification,
      body.rci_number !== undefined ? text(body.rci_number, 60) : target.rci_number,
      active,
      target.id,
    ),
  ];
  if (body.password) {
    checkPasswordStrength(body.password);
    statements.push(db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(await hashPassword(body.password), target.id));
  }
  // Role change, deactivation or password reset logs the person out everywhere.
  if (body.password || role !== target.role || !active) statements.push(db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(target.id));
  await db.batch(statements);
  await audit(db, user, 'user.update', 'user', target.id, body.password ? 'password reset' : null);
  return json({ ok: true });
}

async function listAudit({ db, user }) {
  requireRole(user, 'admin');
  const { results } = await db.prepare(
    `SELECT a.*, u.full_name AS user_name FROM audit_log a LEFT JOIN users u ON u.id = a.user_id ORDER BY a.id DESC LIMIT 200`,
  ).all();
  return json({ entries: results });
}

// ---------- routing ----------

const routes = [
  ['GET', '/api/setup', setupStatus],
  ['POST', '/api/setup', setup],
  ['POST', '/api/auth/login', login],
  ['POST', '/api/auth/logout', logout],
  ['GET', '/api/auth/me', me],
  ['POST', '/api/auth/password', changePassword],
  ['GET', '/api/public/content', publicContent],
  ['POST', '/api/public/appointments', publicBooking],
  ['GET', '/api/dashboard', dashboard],
  ['GET', '/api/appointments', listAppointments],
  ['POST', '/api/appointments', createAppointment],
  ['PATCH', '/api/appointments/:id', updateAppointment],
  ['DELETE', '/api/appointments/:id', deleteAppointment],
  ['GET', '/api/patients', listPatients],
  ['POST', '/api/patients', createPatient],
  ['GET', '/api/patients/:id', getPatient],
  ['PUT', '/api/patients/:id', updatePatient],
  ['POST', '/api/reports', createReport],
  ['GET', '/api/reports/:id', getReport],
  ['PUT', '/api/reports/:id', updateReport],
  ['DELETE', '/api/reports/:id', deleteReport],
  ['GET', '/api/content', getContent],
  ['PUT', '/api/content/:key', putContent],
  ['GET', '/api/users', listUsers],
  ['POST', '/api/users', createUser],
  ['PATCH', '/api/users/:id', updateUser],
  ['GET', '/api/audit', listAudit],
].map(([method, pattern, handler]) => {
  const keys = [];
  const regex = new RegExp(`^${pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '(\\d+|[a-z_]+)'; })}$`);
  return { method, regex, keys, handler };
});

export async function handleApi(request, env) {
  const url = new URL(request.url);
  try {
    if (!env.DB) throw new HttpError(500, 'Database is not connected. Add the D1 binding named DB in Cloudflare.');
    // Block cross-site form posts: state-changing requests must come from this site.
    if (request.method !== 'GET') {
      const origin = request.headers.get('origin');
      if (origin && origin !== url.origin) throw new HttpError(403, 'Cross-site request blocked.');
    }
    for (const route of routes) {
      if (route.method !== request.method) continue;
      const match = url.pathname.match(route.regex);
      if (!match) continue;
      const params = Object.fromEntries(route.keys.map((k, i) => [k, match[i + 1]]));
      const user = await currentUser(env.DB, request);
      return await route.handler({ db: env.DB, env, request, url, params, user });
    }
    throw new HttpError(404, 'Not found.');
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error(err);
    return json({ error: 'Server error. Please try again.' }, 500);
  }
}
