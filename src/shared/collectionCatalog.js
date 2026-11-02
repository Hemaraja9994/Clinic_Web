// Services recorded when money is taken at the clinic.
// Combination rows (PTA + Impedance, and so on) are one receipt.
// The "several services" dialog records each ticked service as its own row.

export const CATEGORIES = [
  ['pta', 'PTA'],
  ['impedance', 'Impedance'],
  ['pta_impedance', 'PTA + Impedance'],
  ['pta_impedance_tinnitus', 'PTA + Impedance + Tinnitus'],
  ['bera', 'BERA'],
  ['oae', 'OAE'],
  ['bera_oae', 'BERA & OAE'],
  ['tinnitus_evaluation', 'Tinnitus Evaluation'],
  ['hearing_aids', 'Hearing Aids'],
  ['hearing_aid_advance', 'Hearing Aid Advance'],
  ['ha_repair', 'HA Repair'],
  ['batteries', 'Batteries'],
  ['moulds', 'Moulds'],
  ['receivers', 'Receivers'],
  ['shell_receivers', 'Shell Receivers'],
  ['huggies', 'Huggies'],
  ['ear_tips', 'Ear tips'],
  ['domes', 'Domes'],
  ['speech_therapy', 'Speech Therapy'],
  ['backup_audiologist', 'Backup Audiologist'],
  ['other', 'Other'],
];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES);

export const SERVICE_GROUPS = [
  {
    title: 'Hearing tests',
    ids: ['pta', 'impedance', 'pta_impedance', 'pta_impedance_tinnitus', 'bera', 'oae', 'bera_oae', 'tinnitus_evaluation'],
  },
  {
    title: 'Hearing aid supplies',
    ids: ['hearing_aids', 'hearing_aid_advance', 'ha_repair', 'batteries', 'moulds', 'receivers', 'shell_receivers', 'huggies', 'ear_tips', 'domes'],
  },
  {
    title: 'Other',
    ids: ['speech_therapy', 'backup_audiologist', 'other'],
  },
];

// One click fills the multi-service dialog with these tests. Each still gets its own amount.
export const SERVICE_PRESETS = [
  { id: 'pta_impedance', label: 'PTA + Impedance', services: ['pta', 'impedance'] },
  { id: 'pta_impedance_tinnitus', label: 'PTA + Impedance + Tinnitus', services: ['pta', 'impedance', 'tinnitus_evaluation'] },
  { id: 'bera_oae', label: 'BERA & OAE', services: ['bera', 'oae'] },
];

export const PAYMENT_METHODS = [
  ['cash', 'Cash'],
  ['upi', 'UPI'],
  ['card', 'Card'],
  ['bank', 'Bank'],
];

const METHOD_LABEL = Object.fromEntries(PAYMENT_METHODS);

export const SRI_RUDRA_CLINIC = {
  id: 'sri-rudra-mvp',
  name: 'Sri Rudra · MVP Double Road',
  group_name: 'Sri Rudra',
  city: 'Visakhapatnam',
  phone: '9849848516',
  phones: ['9849848516', '9032389666', '7032054275'],
  email: 'srirudraspeechandhearing@gmail.com',
  address: 'Flat No. 211 & 212, HIG-207/4, Second Floor, Beside Kotak Mahindra Bank, Bhavana Heights, MVP Double Road, Visakhapatnam-530017, Andhra Pradesh.',
};

export function categoryLabel(id) {
  return CATEGORY_LABEL[id] || id || '';
}

export function methodLabel(id) {
  return METHOD_LABEL[id] || id || '';
}

export function localDateISO(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function monthStartISO(iso = localDateISO()) {
  return `${String(iso).slice(0, 7)}-01`;
}

export function roundRupees(value) {
  const n = Number(String(value ?? '').replace(/,/g, '').trim());
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

export function formatRupees(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

// Empty is allowed. A filled number must be a 10-digit Indian mobile, with or without +91.
export function normalizePhone(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) throw new Error('Enter a 10-digit mobile number, or leave phone blank.');
  return local;
}

function sharedFields(input) {
  const date = String(input.collection_date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Pick a date.');
  const clinicId = String(input.clinic_id || '').trim();
  if (!clinicId) throw new Error('Choose a clinic.');
  const method = String(input.method || 'cash');
  if (!METHOD_LABEL[method]) throw new Error('Choose how the money was received.');
  return {
    collection_date: date,
    clinic_id: clinicId,
    method,
    phone: normalizePhone(input.phone),
    reference: String(input.reference || '').trim().slice(0, 120),
    notes: String(input.notes || '').trim().slice(0, 1000),
  };
}

function oneLine(category, amount) {
  if (!CATEGORY_LABEL[category]) throw new Error('Choose a service from the list.');
  const rupees = roundRupees(amount);
  if (!(rupees > 0)) throw new Error(`Enter the amount for ${categoryLabel(category)}.`);
  if (rupees > 10000000) throw new Error('Amount looks too large.');
  return { category, amount: rupees };
}

/**
 * Turn the new-collection form into one row, or one row per ticked service.
 * Each row is money taken for a single category, so the day still splits by what it was for.
 */
export function buildCollectionRows(input) {
  const shared = sharedFields(input);
  const mode = input.mode === 'multi' ? 'multi' : input.mode === 'single' || input.mode == null ? 'single' : input.mode;
  switch (mode) {
    case 'single':
      return [{ ...shared, ...oneLine(input.category, input.amount) }];
    case 'multi': {
      const lines = Array.isArray(input.lines) ? input.lines.filter((line) => line && line.category) : [];
      if (!lines.length) throw new Error('Tick at least one service and enter its amount.');
      return lines.map((line) => ({ ...shared, ...oneLine(line.category, line.amount) }));
    }
    default: {
      const unknown = mode;
      throw new Error(`Unknown recording mode: ${String(unknown)}`);
    }
  }
}

export function normalizeCollection(input) {
  return buildCollectionRows({ ...input, mode: 'single' })[0];
}

export function filterCollections(rows, filters = {}) {
  const from = filters.from || '';
  const to = filters.to || '';
  const clinicId = filters.clinicId || filters.clinic_id || '';
  const category = filters.category || '';
  const method = filters.method || '';
  const query = String(filters.q || '').trim().toLowerCase();
  return rows.filter((row) => {
    if (from && row.collection_date < from) return false;
    if (to && row.collection_date > to) return false;
    if (clinicId && clinicId !== 'all' && row.clinic_id !== clinicId) return false;
    if (category && category !== 'all' && row.category !== category) return false;
    if (method && method !== 'all' && row.method !== method) return false;
    if (query) {
      const hay = [row.phone, row.reference, row.notes, categoryLabel(row.category), row.clinic_name]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function csvCell(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function collectionsToCsv(rows, clinicName = (id) => id) {
  const header = ['Date', 'Clinic', 'Category', 'Method', 'Phone', 'Reference', 'Notes', 'Amount'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push([
      row.collection_date,
      row.clinic_name || clinicName(row.clinic_id),
      categoryLabel(row.category),
      methodLabel(row.method),
      row.phone,
      row.reference,
      row.notes,
      row.amount,
    ].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}

export function slugClinicId(name) {
  const slug = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return slug || 'clinic';
}

export function deskBackup(data) {
  return {
    kind: 'sri-rudra-desk',
    version: 1,
    clinics: data.clinics || [],
    collections: data.collections || [],
    notes: data.notes || {},
  };
}

export function mergeDeskBackup(current, incoming) {
  if (!incoming || incoming.kind !== 'sri-rudra-desk') {
    throw new Error('That file is not a Sri Rudra desk backup.');
  }
  const clinics = new Map((current.clinics || []).map((clinic) => [clinic.id, clinic]));
  for (const clinic of incoming.clinics || []) {
    if (!clinic || !clinic.id || !clinic.name) continue;
    clinics.set(clinic.id, { ...clinics.get(clinic.id), ...clinic });
  }
  const collections = new Map((current.collections || []).map((row) => [row.id, row]));
  for (const row of incoming.collections || []) {
    if (!row || !row.id) continue;
    collections.set(row.id, { ...collections.get(row.id), ...row });
  }
  const notes = { ...(current.notes || {}) };
  for (const [date, body] of Object.entries(incoming.notes || {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) notes[date] = String(body ?? '').slice(0, 2000);
  }
  return {
    clinics: [...clinics.values()],
    collections: [...collections.values()],
    notes,
  };
}

export function applyPreset(lines, preset) {
  const map = new Map((lines || []).filter((line) => line?.category).map((line) => [line.category, line]));
  for (const id of preset.services) {
    if (!map.has(id)) map.set(id, { category: id, amount: '' });
  }
  return CATEGORIES.map(([id]) => map.get(id)).filter(Boolean);
}
