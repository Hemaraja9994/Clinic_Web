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
import { filterCollections, normalizeCollection, slugClinicId } from '../src/shared/collectionCatalog.js';
import {
  CLOSED_STAGE_IDS,
  addDays,
  indiaToday,
  normalizeActivity,
  normalizeContact,
  normalizeDeal,
  stageChangeNote,
  websiteLead,
} from '../src/shared/crm.js';
import { HttpError, clientIp, isDate, json, readJson, required, text } from './http.js';

const ALL_STAFF = ['admin', 'therapist', 'reception'];
const CLINICAL = ['admin', 'therapist'];
const APPOINTMENT_STATUSES = ['requested', 'confirmed', 'completed', 'cancelled', 'no_show'];
const REPORT_TYPES = ['audiology', 'speech_language'];
const CONTENT_KEYS = ['announcement', 'hours', 'services', 'hero', 'facilities', 'trust', 'testimonials', 'faq', 'contact'];

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

// Website bookings go into the clinic's main staff portal (admin.srirudraspeechandhearing.com),
// which reads the D1 database bound as PORTAL_DB. Insert-only: this code never updates or deletes there.
const PORTAL_CLINIC_ID = 5; // "Sri Rudra · MVP Double Road" in the portal's clinics table
const PORTAL_SERVICE = {
  'Diagnostic Audiology': 'audio',
  'Audiology Facilities': 'audio',
  'Hearing Aid Services': 'aid',
  'Pediatric Speech Therapy': 'ped',
  'Adult Rehabilitation': 'adult',
  'Speech-Language Pathology': 'adult',
};

// "10:00 AM" / "4:30 PM" / "16:30" -> "HH:MM" (24h), or null if it can't be read.
function to24h(value) {
  const m = /^\s*(\d{1,2}):(\d{2})\s*([AaPp][Mm])?\s*$/.exec(String(value || ''));
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  if (m[3]) {
    const pm = m[3].toLowerCase() === 'pm';
    if (h === 12) h = pm ? 12 : 0;
    else if (pm) h += 12;
  }
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

async function publicBooking({ db, env, request }) {
  const body = await readJson(request);
  if (body.website) return json({ ok: true }, 201); // honeypot field filled → likely a bot; pretend success
  const ip = clientIp(request);
  await assertNotLockedOut(db, [[`book:${ip}`, 6]], 60);
  const phone = required(body.phone, 'Phone', 20);
  if (!/^[0-9+\-\s]{10,15}$/.test(phone)) throw new HttpError(400, 'Enter a valid phone number.');
  if (!isDate(body.date)) throw new HttpError(400, 'Pick a valid date.');
  if (!env.PORTAL_DB) throw new HttpError(500, 'Booking database is not connected.');
  await recordAttempt(db, `book:${ip}`);

  const name = required(body.name, 'Name', 120);
  const age = text(body.age, 20);
  const service = text(body.service, 120);
  const concern = text(body.concern, 1000);
  const rawTime = text(body.time, 20);
  const time = to24h(rawTime);
  const notes = [
    'Website booking request - please call to confirm.',
    service ? `Service: ${service}` : null,
    age ? `Age: ${age}` : null,
    time ? null : 'Preferred time: not given (please confirm on call)',
    concern ? `Concern: ${concern}` : null,
  ].filter(Boolean).join(' | ');

  // Source of truth: the main portal's appointments table.
  const result = await env.PORTAL_DB.prepare(
    "INSERT INTO appointments (clinic_id, scheduled_for, patient_name, patient_phone, service, duration_min, status, notes) VALUES (?, ?, ?, ?, ?, 45, 'scheduled', ?)",
  ).bind(PORTAL_CLINIC_ID, `${body.date}T${time || '10:00'}`, name, phone, PORTAL_SERVICE[service] || 'other', notes).run();

  // Secondary copy in this site's own database (best effort; failures don't affect the booking).
  try {
    await db.prepare(
      'INSERT INTO appointments (name, age, phone, service, concern, date, time, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(name, age, phone, service, concern, body.date, rawTime, 'website').run();
  } catch {}

  // The booking also becomes a CRM lead with a "call to confirm" follow-up (best effort, like the copy above).
  try {
    await leadFromWebsiteBooking(db, { name, age, phone, service, concern, date: body.date, time: rawTime });
  } catch (err) {
    console.error('CRM: could not add the website lead', err?.message);
  }

  return json({ ok: true, id: result.meta.last_row_id }, 201);
}

// Same phone number as an existing contact → add the follow-up to that contact instead of a duplicate.
// A new deal is opened only if the person has no open deal already.
async function leadFromWebsiteBooking(db, booking) {
  const lead = websiteLead(booking, indiaToday());
  const c = lead.contact;
  const existing = c.phone
    ? await db.prepare('SELECT id FROM crm_contacts WHERE phone = ? ORDER BY id DESC LIMIT 1').bind(c.phone).first()
    : null;
  let contactId = existing?.id;
  if (contactId) {
    await db.prepare(
      "UPDATE crm_contacts SET status = CASE WHEN status = 'inactive' THEN 'lead' ELSE status END, updated_at = datetime('now') WHERE id = ?",
    ).bind(contactId).run();
  } else {
    const r = await db.prepare(
      'INSERT INTO crm_contacts (name, phone, age, source, interest, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ).bind(c.name, c.phone, c.age, c.source, c.interest, c.status, c.notes).run();
    contactId = r.meta.last_row_id;
  }
  let deal = await db.prepare(
    "SELECT id FROM crm_deals WHERE contact_id = ? AND stage NOT IN ('won', 'lost') ORDER BY id DESC LIMIT 1",
  ).bind(contactId).first();
  if (!deal) {
    const r = await db.prepare('INSERT INTO crm_deals (contact_id, title, deal_type, stage) VALUES (?, ?, ?, ?)')
      .bind(contactId, lead.deal.title, lead.deal.deal_type, lead.deal.stage).run();
    deal = { id: r.meta.last_row_id };
  }
  await db.prepare('INSERT INTO crm_activities (contact_id, deal_id, kind, body, due_date) VALUES (?, ?, ?, ?, ?)')
    .bind(contactId, deal.id, lead.followUp.kind, lead.followUp.body, lead.followUp.due_date).run();
  await audit(db, null, 'crm.lead_from_website', 'crm_contact', contactId);
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
  if (value.length > 80000) throw new HttpError(400, 'Content is too long.');
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

// ---------- collections ----------

function readCollection(body) {
  try {
    return normalizeCollection(body);
  } catch (err) {
    throw new HttpError(400, err.message);
  }
}

function toPaise(amount) {
  return Math.round(Number(amount) * 100);
}

function publicCollection(row) {
  return {
    id: row.id,
    clinic_id: row.clinic_id,
    clinic_name: row.clinic_name || '',
    collection_date: row.collection_date,
    category: row.category,
    amount: row.amount_paise / 100,
    method: row.method,
    phone: row.phone || '',
    reference: row.reference || '',
    notes: row.notes || '',
  };
}

async function assertClinic(db, clinicId) {
  const clinic = await db.prepare('SELECT id FROM clinics WHERE id = ?').bind(clinicId).first();
  if (!clinic) throw new HttpError(400, 'Choose a clinic.');
}

async function listClinics({ db, user }) {
  requireRole(user, ...ALL_STAFF);
  const { results } = await db.prepare('SELECT * FROM clinics ORDER BY name').all();
  return json({ clinics: results });
}

async function createClinic({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  const name = required(body.name, 'Clinic name', 120);
  let id = slugClinicId(name);
  const taken = await db.prepare('SELECT id FROM clinics WHERE id = ?').bind(id).first();
  if (taken) id = `${id}-${Date.now().toString(36)}`.slice(0, 48);
  await db.prepare(
    'INSERT INTO clinics (id, name, group_name, city, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
  ).bind(id, name, text(body.group_name, 120), text(body.city, 80), text(body.phone, 20), text(body.address, 400)).run();
  await audit(db, user, 'clinic.create', 'clinic', null, name);
  return json({ id }, 201);
}

async function listCollections({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const { results } = await db.prepare(
    `SELECT c.*, cl.name AS clinic_name
     FROM collections c LEFT JOIN clinics cl ON cl.id = c.clinic_id
     ORDER BY c.collection_date DESC, c.id DESC LIMIT 1000`,
  ).all();
  const collections = filterCollections(results.map(publicCollection), {
    from: url.searchParams.get('from') || '',
    to: url.searchParams.get('to') || '',
    clinicId: url.searchParams.get('clinic_id') || '',
    category: url.searchParams.get('category') || '',
    method: url.searchParams.get('method') || '',
    q: url.searchParams.get('q') || '',
  });
  return json({ collections });
}

async function createCollections({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  const rows = Array.isArray(body.rows) ? body.rows : [body];
  if (!rows.length || rows.length > 20) throw new HttpError(400, 'Record between 1 and 20 services at a time.');
  const ids = [];
  for (const raw of rows) {
    const row = readCollection(raw);
    await assertClinic(db, row.clinic_id);
    const result = await db.prepare(
      `INSERT INTO collections (clinic_id, collection_date, category, amount_paise, method, phone, reference, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      row.clinic_id,
      row.collection_date,
      row.category,
      toPaise(row.amount),
      row.method,
      row.phone || null,
      row.reference || null,
      row.notes || null,
      user.id,
    ).run();
    ids.push(result.meta.last_row_id);
    await audit(db, user, 'collection.create', 'collection', result.meta.last_row_id, row.category);
  }
  return json({ ids }, 201);
}

async function updateCollection({ db, user, request, params }) {
  requireRole(user, ...ALL_STAFF);
  const current = await db.prepare('SELECT * FROM collections WHERE id = ?').bind(params.id).first();
  if (!current) throw new HttpError(404, 'Collection not found.');
  const row = readCollection({ ...publicCollection(current), ...(await readJson(request)) });
  await assertClinic(db, row.clinic_id);
  await db.prepare(
    `UPDATE collections
     SET clinic_id = ?, collection_date = ?, category = ?, amount_paise = ?, method = ?, phone = ?, reference = ?, notes = ?
     WHERE id = ?`,
  ).bind(row.clinic_id, row.collection_date, row.category, toPaise(row.amount), row.method, row.phone || null, row.reference || null, row.notes || null, params.id).run();
  await audit(db, user, 'collection.update', 'collection', Number(params.id), row.category);
  return json({ ok: true });
}

async function deleteCollection({ db, user, params }) {
  requireRole(user, 'admin');
  const current = await db.prepare('SELECT id FROM collections WHERE id = ?').bind(params.id).first();
  if (!current) throw new HttpError(404, 'Collection not found.');
  await db.prepare('DELETE FROM collections WHERE id = ?').bind(params.id).run();
  await audit(db, user, 'collection.delete', 'collection', Number(params.id));
  return json({ ok: true });
}

async function dashboardNote({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
  if (!isDate(date)) throw new HttpError(400, 'Pick a valid date.');
  const row = await db.prepare('SELECT body, updated_at FROM dashboard_notes WHERE note_date = ?').bind(date).first();
  return json({ date, body: row?.body || '', updated_at: row?.updated_at || null });
}

async function saveDashboardNote({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  if (!isDate(body.date)) throw new HttpError(400, 'Pick a valid date.');
  const note = text(body.body, 2000) || '';
  await db.prepare(
    `INSERT INTO dashboard_notes (note_date, body, updated_by, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(note_date) DO UPDATE SET body = excluded.body, updated_by = excluded.updated_by, updated_at = datetime('now')`,
  ).bind(body.date, note, user.id).run();
  await audit(db, user, 'dashboard.note', 'dashboard_note', null, body.date);
  return json({ ok: true });
}

// ---------- CRM: leads, deals (sales pipeline) and follow-ups ----------
// All staff can use the CRM. Only an admin can delete a contact or a deal.
// Website bookings arrive here on their own (see leadFromWebsiteBooking above).

const CONTACT_FIELDS = ['name', 'phone', 'alt_phone', 'email', 'age', 'for_whom', 'area', 'language', 'source', 'referred_by', 'interest', 'status', 'owner_id', 'patient_id', 'notes'];
const DEAL_FIELDS = ['title', 'deal_type', 'stage', 'value_paise', 'expected_close', 'lost_reason', 'owner_id'];

// Adds next_id / next_kind / next_body / next_due: the contact's open follow-up with the earliest date.
const NEXT_ACTION_COLS = 'n.id AS next_id, n.kind AS next_kind, n.body AS next_body, n.due_date AS next_due';
const nextActionJoin = (contactColumn) => `LEFT JOIN crm_activities n ON n.id = (
  SELECT a.id FROM crm_activities a
   WHERE a.contact_id = ${contactColumn} AND a.done_at IS NULL AND a.due_date IS NOT NULL
   ORDER BY a.due_date, a.id LIMIT 1)`;

function readCrm(normalize, body) {
  try {
    return normalize(body);
  } catch (err) {
    throw new HttpError(400, err.message);
  }
}

function positiveId(value, what) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `Choose a ${what}.`);
  return n;
}

// Same format as SQLite's datetime('now'), in UTC.
function nowSql() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function crmToday(url) {
  const today = url.searchParams.get('today');
  return isDate(today) ? today : indiaToday();
}

function publicDeal(row) {
  const { value_paise: paise, ...rest } = row;
  return { ...rest, value: (paise || 0) / 100 };
}

async function assertStaffMember(db, id) {
  if (!id) return;
  const row = await db.prepare('SELECT id FROM users WHERE id = ? AND active = 1').bind(id).first();
  if (!row) throw new HttpError(400, 'Choose an active staff member.');
}

async function loadContact(db, id) {
  const contact = await db.prepare('SELECT * FROM crm_contacts WHERE id = ?').bind(id).first();
  if (!contact) throw new HttpError(404, 'Contact not found.');
  return contact;
}

async function loadDeal(db, id) {
  const deal = await db.prepare('SELECT * FROM crm_deals WHERE id = ?').bind(id).first();
  if (!deal) throw new HttpError(404, 'Deal not found.');
  return deal;
}

async function loadActivity(db, id) {
  const activity = await db.prepare('SELECT * FROM crm_activities WHERE id = ?').bind(id).first();
  if (!activity) throw new HttpError(404, 'Entry not found.');
  return activity;
}

function touchContact(db, id) {
  return db.prepare("UPDATE crm_contacts SET updated_at = datetime('now') WHERE id = ?").bind(id);
}

// Saves a deal and writes "New deal at …" into the contact's history. A won deal makes the contact a customer.
async function insertDeal(db, user, contactId, deal) {
  const now = nowSql();
  const result = await db.prepare(
    `INSERT INTO crm_deals (contact_id, ${DEAL_FIELDS.join(', ')}, stage_changed_at, closed_at, created_by)
     VALUES (?, ${DEAL_FIELDS.map(() => '?').join(', ')}, ?, ?, ?)`,
  ).bind(contactId, ...DEAL_FIELDS.map((f) => deal[f]), now, CLOSED_STAGE_IDS.includes(deal.stage) ? now : null, user.id).run();
  const dealId = result.meta.last_row_id;
  const statements = [
    db.prepare("INSERT INTO crm_activities (contact_id, deal_id, kind, body, done_at, created_by) VALUES (?, ?, 'stage', ?, ?, ?)")
      .bind(contactId, dealId, `${deal.title}: ${stageChangeNote(null, deal.stage, deal.lost_reason)}`, now, user.id),
    touchContact(db, contactId),
  ];
  if (deal.stage === 'won') statements.push(db.prepare("UPDATE crm_contacts SET status = 'customer' WHERE id = ?").bind(contactId));
  await db.batch(statements);
  return dealId;
}

async function crmStaff({ db, user }) {
  requireRole(user, ...ALL_STAFF);
  const { results } = await db.prepare('SELECT id, full_name, role FROM users WHERE active = 1 ORDER BY full_name').all();
  return json({ staff: results });
}

async function crmSummary({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const today = crmToday(url);
  // Saved times are UTC; the clinic's month starts at midnight IST (18:30 UTC the day before).
  const monthStart = new Date(Date.parse(`${today.slice(0, 7)}-01T00:00:00+05:30`)).toISOString().slice(0, 19).replace('T', ' ');
  const [stages, due, leads, won, top] = await db.batch([
    db.prepare("SELECT stage, COUNT(*) AS n, COALESCE(SUM(value_paise), 0) AS v FROM crm_deals WHERE stage NOT IN ('won', 'lost') GROUP BY stage"),
    db.prepare(
      `SELECT COALESCE(SUM(due_date < ?), 0) AS overdue, COALESCE(SUM(due_date = ?), 0) AS today,
              COALESCE(SUM(due_date > ? AND due_date <= ?), 0) AS week
         FROM crm_activities WHERE done_at IS NULL AND due_date IS NOT NULL`,
    ).bind(today, today, today, addDays(today, 7)),
    db.prepare('SELECT COUNT(*) AS n FROM crm_contacts WHERE created_at >= ?').bind(monthStart),
    db.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(value_paise), 0) AS v FROM crm_deals WHERE stage = 'won' AND closed_at >= ?").bind(monthStart),
    db.prepare(
      `SELECT a.id, a.kind, a.body, a.due_date, a.contact_id, c.name AS contact_name, c.phone AS contact_phone
         FROM crm_activities a JOIN crm_contacts c ON c.id = a.contact_id
        WHERE a.done_at IS NULL AND a.due_date IS NOT NULL AND a.due_date <= ?
        ORDER BY a.due_date, a.id LIMIT 6`,
    ).bind(today),
  ]);
  const counts = due.results[0] || {};
  return json({
    stages: Object.fromEntries(stages.results.map((r) => [r.stage, { count: r.n, value: r.v / 100 }])),
    followUps: { overdue: counts.overdue || 0, today: counts.today || 0, week: counts.week || 0 },
    leadsThisMonth: leads.results[0].n,
    wonThisMonth: { count: won.results[0].n, value: won.results[0].v / 100 },
    due: top.results,
  });
}

async function listCrmContacts({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const where = [];
  const args = [];
  const status = url.searchParams.get('status');
  if (['lead', 'customer', 'inactive'].includes(status)) { where.push('c.status = ?'); args.push(status); }
  const source = text(url.searchParams.get('source'), 40);
  if (source) { where.push('c.source = ?'); args.push(source); }
  if (url.searchParams.get('mine')) { where.push('c.owner_id = ?'); args.push(user.id); }
  if (url.searchParams.get('next') === 'none') where.push('n.id IS NULL');
  const q = text(url.searchParams.get('q'), 60);
  if (q) {
    const like = `%${q}%`;
    const digits = q.replace(/\D/g, '');
    const byPhone = digits.length >= 3;
    where.push(`(c.name LIKE ? OR c.area LIKE ? OR c.interest LIKE ? OR c.referred_by LIKE ?${byPhone ? ' OR c.phone LIKE ? OR c.alt_phone LIKE ?' : ''})`);
    args.push(like, like, like, like);
    if (byPhone) args.push(`%${digits}%`, `%${digits}%`);
  }
  const { results } = await db.prepare(
    `SELECT c.*, u.full_name AS owner_name,
            (SELECT COUNT(*) FROM crm_deals d WHERE d.contact_id = c.id AND d.stage NOT IN ('won', 'lost')) AS open_deals,
            (SELECT COALESCE(SUM(d.value_paise), 0) FROM crm_deals d WHERE d.contact_id = c.id AND d.stage NOT IN ('won', 'lost')) AS open_value_paise,
            (SELECT d.stage FROM crm_deals d WHERE d.contact_id = c.id ORDER BY d.stage IN ('won', 'lost'), d.updated_at DESC, d.id DESC LIMIT 1) AS stage,
            ${NEXT_ACTION_COLS}
       FROM crm_contacts c
       LEFT JOIN users u ON u.id = c.owner_id
       ${nextActionJoin('c.id')}
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY n.due_date IS NULL, n.due_date, c.updated_at DESC
      LIMIT 500`,
  ).bind(...args).all();
  return json({
    contacts: results.map(({ open_value_paise: paise, ...row }) => ({ ...row, open_value: (paise || 0) / 100 })),
  });
}

async function createCrmContact({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  const contact = readCrm(normalizeContact, { owner_id: user.id, ...body });
  await assertStaffMember(db, contact.owner_id);
  const deal = body.deal ? readCrm(normalizeDeal, { owner_id: contact.owner_id, ...body.deal }) : null;
  if (deal) await assertStaffMember(db, deal.owner_id);
  const next = body.next && (body.next.due_date || body.next.body) ? readCrm(normalizeActivity, body.next) : null;
  if (next && !next.due_date) throw new HttpError(400, 'Pick a date for the first follow-up.');
  if (next) await assertStaffMember(db, next.assigned_to);

  const result = await db.prepare(
    `INSERT INTO crm_contacts (${CONTACT_FIELDS.join(', ')}, created_by) VALUES (${CONTACT_FIELDS.map(() => '?').join(', ')}, ?)`,
  ).bind(...CONTACT_FIELDS.map((f) => contact[f]), user.id).run();
  const id = result.meta.last_row_id;
  const dealId = deal ? await insertDeal(db, user, id, deal) : null;
  if (next) {
    await db.prepare('INSERT INTO crm_activities (contact_id, deal_id, kind, body, due_date, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, dealId, next.kind, next.body, next.due_date, next.assigned_to || contact.owner_id || user.id, user.id).run();
  }
  await audit(db, user, 'crm.contact.create', 'crm_contact', id, contact.source);
  return json({ id }, 201);
}

async function getCrmContact({ db, user, params }) {
  requireRole(user, ...ALL_STAFF);
  const contact = await db.prepare(
    `SELECT c.*, u.full_name AS owner_name, p.reg_no AS patient_reg_no
       FROM crm_contacts c
       LEFT JOIN users u ON u.id = c.owner_id
       LEFT JOIN patients p ON p.id = c.patient_id
      WHERE c.id = ?`,
  ).bind(params.id).first();
  if (!contact) throw new HttpError(404, 'Contact not found.');
  const [deals, activities] = await db.batch([
    db.prepare(
      `SELECT d.*, u.full_name AS owner_name FROM crm_deals d LEFT JOIN users u ON u.id = d.owner_id
        WHERE d.contact_id = ? ORDER BY d.stage IN ('won', 'lost'), d.updated_at DESC, d.id DESC`,
    ).bind(contact.id),
    db.prepare(
      `SELECT a.*, cu.full_name AS created_name, au.full_name AS assigned_name, d.title AS deal_title
         FROM crm_activities a
         LEFT JOIN users cu ON cu.id = a.created_by
         LEFT JOIN users au ON au.id = a.assigned_to
         LEFT JOIN crm_deals d ON d.id = a.deal_id
        WHERE a.contact_id = ?
        ORDER BY COALESCE(a.done_at, a.created_at) DESC, a.id DESC
        LIMIT 300`,
    ).bind(contact.id),
  ]);
  return json({ contact, deals: deals.results.map(publicDeal), activities: activities.results });
}

async function updateCrmContact({ db, user, request, params }) {
  requireRole(user, ...ALL_STAFF);
  const current = await loadContact(db, params.id);
  const contact = readCrm(normalizeContact, { ...current, ...(await readJson(request)) });
  if (contact.owner_id !== current.owner_id) await assertStaffMember(db, contact.owner_id);
  if (contact.patient_id && contact.patient_id !== current.patient_id) {
    const patient = await db.prepare('SELECT id FROM patients WHERE id = ?').bind(contact.patient_id).first();
    if (!patient) throw new HttpError(400, 'Patient not found.');
  }
  await db.prepare(`UPDATE crm_contacts SET ${CONTACT_FIELDS.map((f) => `${f} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...CONTACT_FIELDS.map((f) => contact[f]), current.id).run();
  await audit(db, user, 'crm.contact.update', 'crm_contact', current.id, contact.status !== current.status ? `status=${contact.status}` : null);
  return json({ ok: true });
}

async function deleteCrmContact({ db, user, params }) {
  requireRole(user, 'admin');
  const current = await loadContact(db, params.id);
  await db.batch([
    db.prepare('DELETE FROM crm_activities WHERE contact_id = ?').bind(current.id),
    db.prepare('DELETE FROM crm_deals WHERE contact_id = ?').bind(current.id),
    db.prepare('DELETE FROM crm_contacts WHERE id = ?').bind(current.id),
  ]);
  await audit(db, user, 'crm.contact.delete', 'crm_contact', current.id);
  return json({ ok: true });
}

// The pipeline board: every open deal, plus deals won or lost in the last 60 days.
async function listCrmDeals({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const since = addDays(crmToday(url), -60);
  const { results } = await db.prepare(
    `SELECT d.*, c.name AS contact_name, c.phone AS contact_phone, c.status AS contact_status, u.full_name AS owner_name,
            ${NEXT_ACTION_COLS}
       FROM crm_deals d
       JOIN crm_contacts c ON c.id = d.contact_id
       LEFT JOIN users u ON u.id = d.owner_id
       ${nextActionJoin('d.contact_id')}
      WHERE d.stage NOT IN ('won', 'lost') OR d.closed_at >= ?
      ORDER BY n.due_date IS NULL, n.due_date, d.updated_at DESC
      LIMIT 800`,
  ).bind(since).all();
  return json({ deals: results.map(publicDeal), closedSince: since });
}

async function createCrmDeal({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  const contact = await loadContact(db, positiveId(body.contact_id, 'contact'));
  const deal = readCrm(normalizeDeal, { owner_id: contact.owner_id || user.id, ...body });
  await assertStaffMember(db, deal.owner_id);
  const id = await insertDeal(db, user, contact.id, deal);
  await audit(db, user, 'crm.deal.create', 'crm_deal', id, deal.stage);
  return json({ id }, 201);
}

// Moving a deal to another stage records it in the contact's history; "won" makes the contact a customer.
async function updateCrmDeal({ db, user, request, params }) {
  requireRole(user, ...ALL_STAFF);
  const current = await loadDeal(db, params.id);
  const deal = readCrm(normalizeDeal, { ...publicDeal(current), ...(await readJson(request)) });
  if (deal.owner_id !== current.owner_id) await assertStaffMember(db, deal.owner_id);
  const moved = deal.stage !== current.stage;
  const closed = CLOSED_STAGE_IDS.includes(deal.stage);
  const now = nowSql();
  const statements = [
    db.prepare(`UPDATE crm_deals SET ${DEAL_FIELDS.map((f) => `${f} = ?`).join(', ')}, stage_changed_at = ?, closed_at = ?, updated_at = ? WHERE id = ?`)
      .bind(
        ...DEAL_FIELDS.map((f) => deal[f]),
        moved ? now : current.stage_changed_at,
        closed ? (moved ? now : current.closed_at || now) : null,
        now,
        current.id,
      ),
    touchContact(db, current.contact_id),
  ];
  if (moved) {
    statements.push(
      db.prepare("INSERT INTO crm_activities (contact_id, deal_id, kind, body, done_at, created_by) VALUES (?, ?, 'stage', ?, ?, ?)")
        .bind(current.contact_id, current.id, `${deal.title}: ${stageChangeNote(current.stage, deal.stage, deal.lost_reason)}`, now, user.id),
    );
    if (deal.stage === 'won') statements.push(db.prepare("UPDATE crm_contacts SET status = 'customer' WHERE id = ?").bind(current.contact_id));
  }
  await db.batch(statements);
  await audit(db, user, 'crm.deal.update', 'crm_deal', current.id, moved ? `${current.stage}->${deal.stage}` : null);
  return json({ ok: true });
}

async function deleteCrmDeal({ db, user, params }) {
  requireRole(user, 'admin');
  const current = await loadDeal(db, params.id);
  await db.batch([
    db.prepare('UPDATE crm_activities SET deal_id = NULL WHERE deal_id = ?').bind(current.id),
    db.prepare('DELETE FROM crm_deals WHERE id = ?').bind(current.id),
    touchContact(db, current.contact_id),
  ]);
  await audit(db, user, 'crm.deal.delete', 'crm_deal', current.id);
  return json({ ok: true });
}

// Open follow-ups (next actions), soonest first. ?mine=1 → only those assigned to me.
async function listCrmFollowUps({ db, user, url }) {
  requireRole(user, ...ALL_STAFF);
  const where = ['a.done_at IS NULL', 'a.due_date IS NOT NULL'];
  const args = [];
  if (url.searchParams.get('mine')) { where.push('a.assigned_to = ?'); args.push(user.id); }
  const { results } = await db.prepare(
    `SELECT a.*, c.name AS contact_name, c.phone AS contact_phone, c.status AS contact_status,
            d.title AS deal_title, d.stage AS deal_stage, au.full_name AS assigned_name
       FROM crm_activities a
       JOIN crm_contacts c ON c.id = a.contact_id
       LEFT JOIN crm_deals d ON d.id = a.deal_id
       LEFT JOIN users au ON au.id = a.assigned_to
      WHERE ${where.join(' AND ')}
      ORDER BY a.due_date, a.id
      LIMIT 500`,
  ).bind(...args).all();
  return json({ followUps: results });
}

// With a due_date it is a follow-up (open until marked done); without, it is a logged call / visit / note.
async function createCrmActivity({ db, user, request }) {
  requireRole(user, ...ALL_STAFF);
  const body = await readJson(request);
  const contact = await loadContact(db, positiveId(body.contact_id, 'contact'));
  const activity = readCrm(normalizeActivity, body);
  if (activity.deal_id) {
    const deal = await db.prepare('SELECT id FROM crm_deals WHERE id = ? AND contact_id = ?').bind(activity.deal_id, contact.id).first();
    if (!deal) throw new HttpError(400, 'That deal belongs to another contact.');
  }
  await assertStaffMember(db, activity.assigned_to);
  const followUp = Boolean(activity.due_date);
  const result = await db.prepare(
    'INSERT INTO crm_activities (contact_id, deal_id, kind, body, due_date, done_at, outcome, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(
    contact.id,
    activity.deal_id,
    activity.kind,
    activity.body,
    activity.due_date,
    followUp ? null : nowSql(),
    activity.outcome,
    followUp ? activity.assigned_to || contact.owner_id || user.id : user.id,
    user.id,
  ).run();
  await touchContact(db, contact.id).run();
  await audit(db, user, followUp ? 'crm.followup.create' : 'crm.activity.log', 'crm_activity', result.meta.last_row_id);
  return json({ id: result.meta.last_row_id }, 201);
}

// Mark done ({done: true, outcome}), reopen ({done: false}), reschedule ({due_date}) or edit.
// {next: {kind, body, due_date}} adds the following follow-up in the same step.
async function updateCrmActivity({ db, user, request, params }) {
  requireRole(user, ...ALL_STAFF);
  const current = await loadActivity(db, params.id);
  if (current.kind === 'stage') throw new HttpError(400, 'Pipeline history cannot be edited.');
  const body = await readJson(request);
  const activity = readCrm(normalizeActivity, {
    kind: body.kind ?? current.kind,
    body: body.body ?? current.body,
    due_date: body.due_date !== undefined ? body.due_date : current.due_date,
    outcome: body.outcome !== undefined ? body.outcome : current.outcome,
    assigned_to: body.assigned_to !== undefined ? body.assigned_to : current.assigned_to,
    deal_id: current.deal_id,
  });
  if (activity.assigned_to !== current.assigned_to) await assertStaffMember(db, activity.assigned_to);
  const now = nowSql();
  const doneAt = body.done === true ? current.done_at || now : body.done === false ? null : current.done_at;
  if (!doneAt && !activity.due_date) throw new HttpError(400, 'An open follow-up needs a date.');
  const statements = [
    db.prepare('UPDATE crm_activities SET kind = ?, body = ?, due_date = ?, outcome = ?, assigned_to = ?, done_at = ? WHERE id = ?')
      .bind(activity.kind, activity.body, activity.due_date, activity.outcome, activity.assigned_to, doneAt, current.id),
    touchContact(db, current.contact_id),
  ];
  let next = null;
  if (body.next) {
    next = readCrm(normalizeActivity, body.next);
    if (!next.due_date) throw new HttpError(400, 'Pick a date for the next follow-up.');
    await assertStaffMember(db, next.assigned_to);
    statements.push(
      db.prepare('INSERT INTO crm_activities (contact_id, deal_id, kind, body, due_date, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(current.contact_id, current.deal_id, next.kind, next.body, next.due_date, next.assigned_to || current.assigned_to || user.id, user.id),
    );
  }
  await db.batch(statements);
  const action = body.done === true && !current.done_at ? 'crm.followup.done' : 'crm.followup.update';
  await audit(db, user, action, 'crm_activity', current.id, next ? `next ${next.due_date}` : null);
  return json({ ok: true });
}

async function deleteCrmActivity({ db, user, params }) {
  requireRole(user, ...ALL_STAFF);
  const current = await loadActivity(db, params.id);
  if (user.role !== 'admin' && (current.kind === 'stage' || current.created_by !== user.id)) {
    throw new HttpError(403, 'Only the person who added this entry, or an admin, can delete it.');
  }
  await db.batch([db.prepare('DELETE FROM crm_activities WHERE id = ?').bind(current.id), touchContact(db, current.contact_id)]);
  await audit(db, user, 'crm.activity.delete', 'crm_activity', current.id);
  return json({ ok: true });
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
  ['GET', '/api/dashboard-note', dashboardNote],
  ['PUT', '/api/dashboard-note', saveDashboardNote],
  ['GET', '/api/clinics', listClinics],
  ['POST', '/api/clinics', createClinic],
  ['GET', '/api/collections', listCollections],
  ['POST', '/api/collections', createCollections],
  ['PATCH', '/api/collections/:id', updateCollection],
  ['DELETE', '/api/collections/:id', deleteCollection],
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
  ['GET', '/api/crm/summary', crmSummary],
  ['GET', '/api/crm/staff', crmStaff],
  ['GET', '/api/crm/contacts', listCrmContacts],
  ['POST', '/api/crm/contacts', createCrmContact],
  ['GET', '/api/crm/contacts/:id', getCrmContact],
  ['PATCH', '/api/crm/contacts/:id', updateCrmContact],
  ['DELETE', '/api/crm/contacts/:id', deleteCrmContact],
  ['GET', '/api/crm/deals', listCrmDeals],
  ['POST', '/api/crm/deals', createCrmDeal],
  ['PATCH', '/api/crm/deals/:id', updateCrmDeal],
  ['DELETE', '/api/crm/deals/:id', deleteCrmDeal],
  ['GET', '/api/crm/followups', listCrmFollowUps],
  ['POST', '/api/crm/activities', createCrmActivity],
  ['PATCH', '/api/crm/activities/:id', updateCrmActivity],
  ['DELETE', '/api/crm/activities/:id', deleteCrmActivity],
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
    // New code reached Cloudflare before its database migration was applied.
    if (/no such table/i.test(String(err?.message))) {
      console.error(err);
      return json({ error: 'This part of the portal needs a database update. Apply the latest migration (docs/ADMIN_SETUP.md → “Updating the database”).' }, 503);
    }
    console.error(err);
    return json({ error: 'Server error. Please try again.' }, 500);
  }
}
