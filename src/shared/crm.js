// CRM rules shared by the server (server/routes.js) and the staff portal pages.
// No imports and no browser APIs, so the same file runs on Cloudflare and under `node --test`.
//
// Words used here:
//   contact   – a person who enquired (a "lead") or has bought from the clinic (a "customer")
//   deal      – one thing they might buy (hearing aids, a therapy package…), moving through the pipeline
//   follow-up – a dated next action ("call back", "send trial reminder"); done or still open
//   next action – a contact's open follow-up with the earliest date

export const CRM_STAGES = [
  { id: 'new', label: 'New enquiry', hint: 'Enquiry received – not spoken to yet' },
  { id: 'contacted', label: 'Contacted', hint: 'Spoken to – need understood' },
  { id: 'booked', label: 'Appointment booked', hint: 'Visit or test date fixed' },
  { id: 'assessed', label: 'Assessed', hint: 'Tested – recommendation given' },
  { id: 'proposal', label: 'Trial / proposal', hint: 'Hearing-aid trial, quote or therapy plan shared' },
  { id: 'won', label: 'Won', hint: 'Aid fitted, package paid or service taken' },
  { id: 'lost', label: 'Lost', hint: 'Did not go ahead' },
];
export const STAGE_IDS = CRM_STAGES.map((s) => s.id);
export const CLOSED_STAGE_IDS = ['won', 'lost'];
export const OPEN_STAGE_IDS = STAGE_IDS.filter((id) => !CLOSED_STAGE_IDS.includes(id));
export const STAGE_LABEL = Object.fromEntries(CRM_STAGES.map((s) => [s.id, s.label]));

export const CONTACT_STATUSES = [
  ['lead', 'Lead'],
  ['customer', 'Customer'],
  ['inactive', 'Inactive'],
];

export const LEAD_SOURCES = [
  ['website', 'Website booking'],
  ['phone', 'Phone call'],
  ['walk_in', 'Walk-in'],
  ['whatsapp', 'WhatsApp'],
  ['doctor', 'Doctor referral'],
  ['patient', 'Patient / family referral'],
  ['camp', 'Screening camp'],
  ['google', 'Google search / Maps'],
  ['social', 'Facebook / Instagram / YouTube'],
  ['existing', 'Existing patient'],
  ['other', 'Other'],
];

export const DEAL_TYPES = [
  ['hearing_aid', 'Hearing aids'],
  ['therapy', 'Therapy package'],
  ['assessment', 'Assessment / tests'],
  ['accessories', 'Accessories & batteries'],
  ['service', 'Repair / service'],
  ['other', 'Other'],
];

// Kinds staff can choose. 'stage' is written only by the server ("Moved to Assessed").
export const ACTIVITY_KINDS = [
  ['call', 'Call'],
  ['whatsapp', 'WhatsApp'],
  ['visit', 'Clinic visit'],
  ['sms', 'SMS'],
  ['email', 'Email'],
  ['note', 'Note'],
];

export const FOR_WHOM = ['Self', 'Child', 'Parent', 'Spouse', 'Other family member', 'Other'];

export const LOST_REASONS = [
  'Price / budget',
  'Bought elsewhere',
  'Not interested now',
  'Could not reach',
  'Referred to ENT / doctor',
  'Moved away',
  'Other',
];

// Quick picks for a follow-up date: [label, days from today].
export const QUICK_DUES = [
  ['Today', 0],
  ['Tomorrow', 1],
  ['In 3 days', 3],
  ['In 1 week', 7],
  ['In 2 weeks', 14],
  ['In 1 month', 30],
];

const ids = (list) => list.map(([id]) => id);
const CONTACT_STATUS_IDS = ids(CONTACT_STATUSES);
const SOURCE_IDS = ids(LEAD_SOURCES);
const DEAL_TYPE_IDS = ids(DEAL_TYPES);
const ACTIVITY_KIND_IDS = ids(ACTIVITY_KINDS);
const MAX_DEAL_RUPEES = 10000000; // ₹1 crore

export function labelOf(list, id) {
  const hit = list.find(([value]) => value === id);
  return hit ? hit[1] : id || '';
}

export function stageLabel(id) {
  return STAGE_LABEL[id] || id || '';
}

// The stage after this one, or null at the end (won / lost).
export function nextStage(stage) {
  const i = OPEN_STAGE_IDS.indexOf(stage);
  if (i === -1) return null;
  return i === OPEN_STAGE_IDS.length - 1 ? 'won' : OPEN_STAGE_IDS[i + 1];
}

// ---------- text, phone and dates ----------

function clean(value, max) {
  const text = String(value ?? '').trim();
  return text ? text.slice(0, max) : null;
}

function optionalId(value, what) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Choose a valid ${what}.`);
  return n;
}

// Keeps digits only; drops a leading 91 or 0 from Indian numbers so "+91 98498 48516",
// "098498 48516" and "9849848516" are all stored (and matched) as 9849848516.
export function crmPhone(value) {
  let digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export function displayPhone(value) {
  const digits = String(value ?? '');
  return /^\d{10}$/.test(digits) ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

export function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromIso, toIso) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 864e5);
}

// Today's date in India (UTC+5:30). Cloudflare runs on UTC, which is "yesterday" until 5:30 am IST.
export function indiaToday(now = Date.now()) {
  return new Date(now + 330 * 60000).toISOString().slice(0, 10);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function prettyDate(iso, { withYear = true } = {}) {
  if (!isIsoDate(iso)) return iso || '';
  const [y, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]}${withYear ? ` ${y}` : ''}`;
}

// Where a follow-up date falls compared with today.
export function followUpBucket(due, today) {
  if (!due) return 'none';
  if (due < today) return 'overdue';
  if (due === today) return 'today';
  if (due <= addDays(today, 7)) return 'week';
  return 'later';
}

// Short, plain words for a due date: "Overdue 3 days", "Today", "Tomorrow", "Fri 20 Nov".
export function dueLabel(due, today) {
  if (!due) return 'No date';
  const diff = daysBetween(today, due);
  if (diff < 0) return `Overdue ${-diff} ${diff === -1 ? 'day' : 'days'}`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  const weekday = WEEKDAYS[new Date(`${due}T00:00:00Z`).getUTCDay()];
  return `${weekday} ${prettyDate(due, { withYear: due.slice(0, 4) !== today.slice(0, 4) })}`;
}

// Whole days since a stage change ("2026-11-10 08:15:00" or "2026-11-10").
export function daysInStage(changedAt, today) {
  if (!changedAt) return 0;
  return Math.max(0, daysBetween(String(changedAt).slice(0, 10), today));
}

export function formatRupees(value) {
  const n = Math.round(Number(value) || 0);
  const s = String(Math.abs(n));
  // Indian grouping: 1,25,000 and 12,50,000.
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${n < 0 ? '-' : ''}₹${rest ? `${rest},${last3}` : last3}`;
}

// ---------- checking what staff type in ----------

export function normalizeContact(input = {}) {
  const name = clean(input.name, 120);
  if (!name) throw new Error('Name is required.');
  const phone = crmPhone(input.phone);
  if (phone.length < 6 || phone.length > 15) throw new Error('Enter a phone number so the clinic can follow up.');
  const altPhone = crmPhone(input.alt_phone);
  if (altPhone && (altPhone.length < 6 || altPhone.length > 15)) throw new Error('The second phone number looks wrong.');
  const email = clean(input.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('The email address looks wrong.');
  const status = input.status || 'lead';
  if (!CONTACT_STATUS_IDS.includes(status)) throw new Error('Unknown status.');
  const source = input.source || 'other';
  if (!SOURCE_IDS.includes(source)) throw new Error('Unknown lead source.');
  return {
    name,
    phone,
    alt_phone: altPhone || null,
    email,
    age: clean(input.age, 20),
    for_whom: clean(input.for_whom, 40),
    area: clean(input.area, 120),
    language: clean(input.language, 60),
    source,
    referred_by: clean(input.referred_by, 120),
    interest: clean(input.interest, 200),
    status,
    owner_id: optionalId(input.owner_id, 'owner'),
    patient_id: optionalId(input.patient_id, 'patient'),
    notes: clean(input.notes, 2000),
  };
}

export function parseRupees(value) {
  if (value === null || value === undefined || value === '') return 0;
  return Number(String(value).replace(/[,₹\s]/g, ''));
}

export function normalizeDeal(input = {}) {
  const dealType = input.deal_type || 'other';
  if (!DEAL_TYPE_IDS.includes(dealType)) throw new Error('Unknown deal type.');
  const stage = input.stage || 'new';
  if (!STAGE_IDS.includes(stage)) throw new Error('Unknown pipeline stage.');
  const rupees = parseRupees(input.value);
  if (!Number.isFinite(rupees) || rupees < 0 || rupees > MAX_DEAL_RUPEES) {
    throw new Error('Enter the deal value in rupees (0 to 1,00,00,000).');
  }
  const expected = input.expected_close ? String(input.expected_close) : null;
  if (expected && !isIsoDate(expected)) throw new Error('Pick a valid expected closing date.');
  return {
    title: clean(input.title, 160) || labelOf(DEAL_TYPES, dealType),
    deal_type: dealType,
    stage,
    value_paise: Math.round(rupees * 100),
    expected_close: expected,
    lost_reason: stage === 'lost' ? clean(input.lost_reason, 200) : null,
    owner_id: optionalId(input.owner_id, 'owner'),
  };
}

const DEFAULT_ACTION = {
  call: 'Call back',
  whatsapp: 'Send a WhatsApp message',
  visit: 'Clinic visit',
  sms: 'Send an SMS',
  email: 'Send an email',
  note: 'Follow up',
};

export function normalizeActivity(input = {}) {
  const kind = input.kind || 'call';
  if (!ACTIVITY_KIND_IDS.includes(kind)) throw new Error('Unknown activity type.');
  const due = input.due_date ? String(input.due_date) : null;
  if (due && !isIsoDate(due)) throw new Error('Pick a valid follow-up date.');
  const body = clean(input.body, 1000);
  if (!body && !due) throw new Error('Write what happened, or pick a follow-up date.');
  return {
    kind,
    body: body || DEFAULT_ACTION[kind],
    due_date: due,
    outcome: clean(input.outcome, 1000),
    assigned_to: optionalId(input.assigned_to, 'staff member'),
    deal_id: optionalId(input.deal_id, 'deal'),
  };
}

export function stageChangeNote(from, to, lostReason) {
  const base = from ? `Moved from ${stageLabel(from)} to ${stageLabel(to)}` : `New deal at ${stageLabel(to)}`;
  return to === 'lost' && lostReason ? `${base} – ${lostReason}` : base;
}

// ---------- reading the data ----------

// The open follow-up with the earliest date (ties: the one written first).
export function pickNextAction(activities = []) {
  return activities
    .filter((a) => !a.done_at && a.due_date)
    .sort((a, b) => (a.due_date === b.due_date ? a.id - b.id : a.due_date < b.due_date ? -1 : 1))[0] || null;
}

export function groupFollowUps(items = [], today) {
  const groups = { overdue: [], today: [], week: [], later: [] };
  for (const item of items) {
    const bucket = followUpBucket(item.due_date, today);
    if (groups[bucket]) groups[bucket].push(item);
  }
  return groups;
}

export function summarizePipeline(deals = []) {
  const byStage = Object.fromEntries(STAGE_IDS.map((id) => [id, { count: 0, value: 0 }]));
  for (const deal of deals) {
    const slot = byStage[deal.stage];
    if (!slot) continue;
    slot.count += 1;
    slot.value += Number(deal.value) || 0;
  }
  const open = OPEN_STAGE_IDS.reduce(
    (sum, id) => ({ count: sum.count + byStage[id].count, value: sum.value + byStage[id].value }),
    { count: 0, value: 0 },
  );
  return { byStage, open };
}

export function filterDeals(deals = [], { q = '', ownerId = null, type = '' } = {}) {
  const needle = q.trim().toLowerCase();
  const digits = crmPhone(q);
  return deals.filter((d) => {
    if (ownerId && d.owner_id !== ownerId) return false;
    if (type && d.deal_type !== type) return false;
    if (!needle) return true;
    if (digits.length >= 3 && String(d.contact_phone || '').includes(digits)) return true;
    return [d.contact_name, d.title].some((v) => String(v || '').toLowerCase().includes(needle));
  });
}

// Which deal type a website service most likely leads to.
export function dealTypeForService(service) {
  const s = String(service || '').toLowerCase();
  if (s.includes('hearing aid')) return 'hearing_aid';
  if (s.includes('therapy') || s.includes('rehabilitation') || s.includes('speech')) return 'therapy';
  if (s.includes('audiology') || s.includes('test') || s.includes('assessment')) return 'assessment';
  return 'other';
}

// A website booking becomes: a lead, a deal at "New enquiry", and a "call to confirm" follow-up due today.
export function websiteLead({ name, age, phone, service, concern, date, time } = {}, today) {
  const cleanService = clean(service, 120);
  const known = cleanService && !/not sure/i.test(cleanService);
  const when = [prettyDate(date), clean(time, 20)].filter(Boolean).join(', ');
  const who = [clean(name, 120), clean(age, 20) ? `age ${clean(age, 20)}` : null].filter(Boolean).join(', ');
  const parts = [
    `Call to confirm the website booking${who ? ` for ${who}` : ''}${when ? ` on ${when}` : ''}.`,
    cleanService ? `Service: ${cleanService}.` : null,
    clean(concern, 600) ? `Concern: ${clean(concern, 600)}` : null,
  ];
  return {
    contact: {
      name: clean(name, 120) || 'Website enquiry',
      phone: crmPhone(phone),
      age: clean(age, 20),
      source: 'website',
      interest: cleanService,
      status: 'lead',
      notes: clean(concern, 1000) ? `Concern given on the website: ${clean(concern, 1000)}` : null,
    },
    deal: {
      title: known ? cleanService : 'Website enquiry',
      deal_type: dealTypeForService(cleanService),
      stage: 'new',
    },
    followUp: {
      kind: 'call',
      due_date: today,
      body: parts.filter(Boolean).join(' ').slice(0, 1000),
    },
  };
}

// ---------- export ----------

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@]/.test(text)) text = `'${text}`; // stop spreadsheet programs treating it as a formula
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function contactsToCsv(rows = []) {
  const header = ['Name', 'Phone', 'Status', 'Source', 'Referred by', 'Interest', 'Stage', 'Open deal value (Rs)', 'Next action', 'Next action due', 'Owner', 'Added on'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push([
      row.name,
      row.phone,
      labelOf(CONTACT_STATUSES, row.status),
      labelOf(LEAD_SOURCES, row.source),
      row.referred_by,
      row.interest,
      stageLabel(row.stage),
      row.open_value || 0,
      row.next_body,
      row.next_due,
      row.owner_name,
      String(row.created_at || '').slice(0, 10),
    ].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}
