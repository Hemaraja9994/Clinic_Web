import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CATEGORY_LABEL,
  SERVICE_PRESETS,
  SRI_RUDRA_CLINIC,
  applyPreset,
  buildCollectionRows,
  collectionsToCsv,
  filterCollections,
  mergeDeskBackup,
  normalizePhone,
} from './collectionCatalog.js';

const base = {
  collection_date: '2026-11-02',
  clinic_id: SRI_RUDRA_CLINIC.id,
  method: 'cash',
  phone: '9849848516',
  reference: 'Dr suneel',
  notes: 'Morning',
};

test('combination categories and hearing-aid parts are on the list', () => {
  for (const id of ['pta_impedance', 'pta_impedance_tinnitus', 'bera_oae', 'huggies', 'ear_tips', 'domes']) {
    assert.ok(CATEGORY_LABEL[id], id);
  }
  assert.equal(CATEGORY_LABEL.pta_impedance, 'PTA + Impedance');
  assert.equal(CATEGORY_LABEL.bera_oae, 'BERA & OAE');
});

test('presets only mention real services', () => {
  for (const preset of SERVICE_PRESETS) {
    for (const id of preset.services) assert.ok(CATEGORY_LABEL[id], `${preset.id}:${id}`);
  }
});

test('one category becomes one collection row', () => {
  const [row] = buildCollectionRows({ ...base, mode: 'single', category: 'pta_impedance', amount: '400' });
  assert.equal(row.category, 'pta_impedance');
  assert.equal(row.amount, 400);
  assert.equal(row.phone, '9849848516');
});

test('several services become one row each, sharing phone and note', () => {
  const rows = buildCollectionRows({
    ...base,
    mode: 'multi',
    lines: [
      { category: 'pta', amount: '300' },
      { category: 'impedance', amount: '150.5' },
      { category: 'huggies', amount: '50' },
    ],
  });
  assert.deepEqual(rows.map((row) => row.category), ['pta', 'impedance', 'huggies']);
  assert.deepEqual(rows.map((row) => row.amount), [300, 150.5, 50]);
  assert.ok(rows.every((row) => row.phone === '9849848516' && row.notes === 'Morning'));
});

test('preset adds services without dropping ones already ticked', () => {
  const lines = applyPreset([{ category: 'huggies', amount: '20' }], SERVICE_PRESETS[0]);
  assert.deepEqual(lines.map((line) => line.category), ['pta', 'impedance', 'huggies']);
  assert.equal(lines.find((line) => line.category === 'huggies').amount, '20');
});

test('phone is optional and accepts +91', () => {
  assert.equal(normalizePhone(''), '');
  assert.equal(normalizePhone('+91 70320 54275'), '7032054275');
  assert.throws(() => normalizePhone('123'), /10-digit/);
});

test('a service with no amount is refused', () => {
  assert.throws(
    () => buildCollectionRows({ ...base, mode: 'multi', lines: [{ category: 'bera', amount: '' }, { category: 'oae', amount: '0' }] }),
    /BERA/,
  );
});

test('filters match phone, note, clinic, and category', () => {
  const rows = [
    { ...base, category: 'batteries', amount: 100, clinic_name: 'Sri Rudra · MVP Double Road' },
    { ...base, collection_date: '2026-10-01', category: 'domes', amount: 80, phone: '9032389666', notes: 'stock' },
  ];
  assert.equal(filterCollections(rows, { from: '2026-11-01', to: '2026-11-02' }).length, 1);
  assert.equal(filterCollections(rows, { category: 'domes' }).length, 1);
  assert.equal(filterCollections(rows, { q: '54275' }).length, 0);
  assert.equal(filterCollections(rows, { q: '98498' }).length, 1);
  assert.equal(filterCollections(rows, { q: 'stock' }).length, 1);
});

test('csv keeps commas inside notes quoted', () => {
  const csv = collectionsToCsv([{ ...base, category: 'ear_tips', amount: 25, notes: 'left, right' }]);
  assert.match(csv, /Ear tips/);
  assert.match(csv, /"left, right"/);
});

test('backup merge keeps device sign-ins out and combines rows', () => {
  const merged = mergeDeskBackup(
    {
      clinics: [SRI_RUDRA_CLINIC],
      collections: [{ id: 'a', amount: 1 }],
      notes: { '2026-11-02': 'old' },
    },
    {
      kind: 'sri-rudra-desk',
      clinics: [{ id: 'branch', name: 'Camp clinic' }],
      collections: [{ id: 'a', amount: 2 }, { id: 'b', amount: 3 }],
      notes: { '2026-11-02': 'today' },
      users: [{ username: 'should-not-apply' }],
    },
  );
  assert.equal(merged.clinics.length, 2);
  assert.equal(merged.collections.find((row) => row.id === 'a').amount, 2);
  assert.equal(merged.collections.length, 2);
  assert.equal(merged.notes['2026-11-02'], 'today');
  assert.equal(merged.users, undefined);
});

test('Sri Rudra MVP details are the seeded clinic', () => {
  assert.match(SRI_RUDRA_CLINIC.name, /MVP Double Road/);
  assert.equal(SRI_RUDRA_CLINIC.phones.length, 3);
  assert.match(SRI_RUDRA_CLINIC.address, /Visakhapatnam/);
});
