import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CRM_STAGES,
  OPEN_STAGE_IDS,
  addDays,
  contactsToCsv,
  crmPhone,
  daysInStage,
  dealTypeForService,
  displayPhone,
  dueLabel,
  filterDeals,
  followUpBucket,
  formatRupees,
  groupFollowUps,
  indiaToday,
  nextStage,
  normalizeActivity,
  normalizeContact,
  normalizeDeal,
  pickNextAction,
  stageChangeNote,
  summarizePipeline,
  websiteLead,
} from './crm.js';

test('pipeline has the agreed stages, in order', () => {
  assert.deepEqual(CRM_STAGES.map((s) => s.label), [
    'New enquiry', 'Contacted', 'Appointment booked', 'Assessed', 'Trial / proposal', 'Won', 'Lost',
  ]);
  assert.deepEqual(OPEN_STAGE_IDS, ['new', 'contacted', 'booked', 'assessed', 'proposal']);
});

test('next stage walks left to right and stops at won / lost', () => {
  assert.equal(nextStage('new'), 'contacted');
  assert.equal(nextStage('assessed'), 'proposal');
  assert.equal(nextStage('proposal'), 'won');
  assert.equal(nextStage('won'), null);
  assert.equal(nextStage('lost'), null);
});

test('phone numbers are stored the same way however they are typed', () => {
  assert.equal(crmPhone('+91 98498 48516'), '9849848516');
  assert.equal(crmPhone('098498-48516'), '9849848516');
  assert.equal(crmPhone('9849848516'), '9849848516');
  assert.equal(crmPhone(''), '');
  assert.equal(displayPhone('9849848516'), '98498 48516');
});

test('a contact needs a name and a phone; lists are checked', () => {
  assert.throws(() => normalizeContact({ phone: '9849848516' }), /Name is required/);
  assert.throws(() => normalizeContact({ name: 'Ravi' }), /phone number/);
  assert.throws(() => normalizeContact({ name: 'Ravi', phone: '9849848516', status: 'vip' }), /Unknown status/);
  assert.throws(() => normalizeContact({ name: 'Ravi', phone: '9849848516', source: 'tv' }), /Unknown lead source/);
  assert.throws(() => normalizeContact({ name: 'Ravi', phone: '9849848516', email: 'not-an-email' }), /email/);
  const c = normalizeContact({ name: '  Ravi Kumar ', phone: '+91 98498 48516', source: 'doctor', referred_by: 'Dr Suneel', owner_id: '2' });
  assert.equal(c.name, 'Ravi Kumar');
  assert.equal(c.phone, '9849848516');
  assert.equal(c.status, 'lead');
  assert.equal(c.owner_id, 2);
  assert.equal(c.alt_phone, null);
});

test('deal value accepts Indian commas and is stored in paise', () => {
  const d = normalizeDeal({ deal_type: 'hearing_aid', value: '1,25,000', stage: 'proposal' });
  assert.equal(d.value_paise, 12500000);
  assert.equal(d.title, 'Hearing aids'); // title falls back to the type
  assert.equal(d.lost_reason, null);
  assert.throws(() => normalizeDeal({ value: '-5' }), /deal value/);
  assert.throws(() => normalizeDeal({ stage: 'maybe' }), /Unknown pipeline stage/);
  assert.throws(() => normalizeDeal({ expected_close: '2026-02-30' }), /expected closing date/);
  assert.equal(normalizeDeal({ stage: 'lost', lost_reason: 'Price / budget' }).lost_reason, 'Price / budget');
  assert.equal(normalizeDeal({ stage: 'won', lost_reason: 'Price / budget' }).lost_reason, null);
});

test('a follow-up needs words or a date; staff cannot write stage entries', () => {
  assert.throws(() => normalizeActivity({ kind: 'call' }), /follow-up date/);
  assert.throws(() => normalizeActivity({ kind: 'stage', body: 'x' }), /Unknown activity type/);
  assert.throws(() => normalizeActivity({ body: 'x', due_date: '13-11-2026' }), /valid follow-up date/);
  const a = normalizeActivity({ kind: 'whatsapp', due_date: '2026-11-20' });
  assert.equal(a.body, 'Send a WhatsApp message');
  assert.equal(a.due_date, '2026-11-20');
});

test('follow-up dates are grouped and labelled around today', () => {
  const today = '2026-11-13';
  assert.equal(followUpBucket('2026-11-12', today), 'overdue');
  assert.equal(followUpBucket('2026-11-13', today), 'today');
  assert.equal(followUpBucket('2026-11-20', today), 'week');
  assert.equal(followUpBucket('2026-11-21', today), 'later');
  assert.equal(followUpBucket(null, today), 'none');
  assert.equal(dueLabel('2026-11-10', today), 'Overdue 3 days');
  assert.equal(dueLabel('2026-11-12', today), 'Overdue 1 day');
  assert.equal(dueLabel('2026-11-13', today), 'Today');
  assert.equal(dueLabel('2026-11-14', today), 'Tomorrow');
  assert.equal(dueLabel('2026-11-20', today), 'Fri 20 Nov');
  assert.equal(dueLabel('2027-01-04', today), 'Mon 4 Jan 2027');
  const g = groupFollowUps([{ due_date: '2026-11-01' }, { due_date: '2026-11-13' }, { due_date: '2026-12-25' }], today);
  assert.deepEqual([g.overdue.length, g.today.length, g.week.length, g.later.length], [1, 1, 0, 1]);
});

test('dates roll over months and years, and "today" is India time', () => {
  assert.equal(addDays('2026-11-30', 1), '2026-12-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(indiaToday(Date.parse('2026-11-12T20:00:00Z')), '2026-11-13'); // 1:30 am IST
  assert.equal(indiaToday(Date.parse('2026-11-12T18:00:00Z')), '2026-11-12'); // 11:30 pm IST
  assert.equal(daysInStage('2026-11-10 08:15:00', '2026-11-13'), 3);
});

test('the next action is the earliest open follow-up', () => {
  const next = pickNextAction([
    { id: 1, due_date: '2026-11-10', done_at: '2026-11-10 10:00:00' },
    { id: 2, due_date: null, done_at: null },
    { id: 3, due_date: '2026-11-18', done_at: null },
    { id: 4, due_date: '2026-11-15', done_at: null },
    { id: 5, due_date: '2026-11-15', done_at: null },
  ]);
  assert.equal(next.id, 4);
  assert.equal(pickNextAction([{ id: 1, due_date: '2026-11-10', done_at: 'x' }]), null);
});

test('a website booking becomes a lead with a call-to-confirm follow-up due today', () => {
  const lead = websiteLead({
    name: 'Lakshmi', age: '64', phone: '+91 98765 43210', service: 'Hearing Aid Services',
    concern: 'Difficulty on phone calls', date: '2026-11-15', time: '10:45 AM',
  }, '2026-11-13');
  assert.equal(lead.contact.phone, '9876543210');
  assert.equal(lead.contact.source, 'website');
  assert.equal(lead.deal.deal_type, 'hearing_aid');
  assert.equal(lead.deal.stage, 'new');
  assert.equal(lead.followUp.due_date, '2026-11-13');
  assert.match(lead.followUp.body, /Call to confirm the website booking for Lakshmi, age 64 on 15 Nov 2026, 10:45 AM\./);
  assert.match(lead.followUp.body, /Concern: Difficulty on phone calls/);
  const unsure = websiteLead({ name: 'X', phone: '9876543210', service: 'Not sure - please advise', date: '2026-11-15' }, '2026-11-13');
  assert.equal(unsure.deal.title, 'Website enquiry');
  assert.equal(unsure.deal.deal_type, 'other');
});

test('website services map to sensible deal types', () => {
  assert.equal(dealTypeForService('Diagnostic Audiology'), 'assessment');
  assert.equal(dealTypeForService('Hearing Aid Services'), 'hearing_aid');
  assert.equal(dealTypeForService('Pediatric Speech Therapy'), 'therapy');
  assert.equal(dealTypeForService('Adult Rehabilitation'), 'therapy');
});

test('pipeline totals count open deals only', () => {
  const s = summarizePipeline([
    { stage: 'new', value: 0 },
    { stage: 'proposal', value: 85000 },
    { stage: 'proposal', value: 40000 },
    { stage: 'won', value: 60000 },
  ]);
  assert.deepEqual(s.byStage.proposal, { count: 2, value: 125000 });
  assert.deepEqual(s.open, { count: 3, value: 125000 });
  assert.equal(s.byStage.won.value, 60000);
});

test('board filters by name, phone, owner and type', () => {
  const deals = [
    { id: 1, contact_name: 'Lakshmi', contact_phone: '9876543210', title: 'Hearing aids', owner_id: 2, deal_type: 'hearing_aid' },
    { id: 2, contact_name: 'Ravi', contact_phone: '9849848516', title: 'Speech therapy', owner_id: 3, deal_type: 'therapy' },
  ];
  assert.deepEqual(filterDeals(deals, { q: 'laks' }).map((d) => d.id), [1]);
  assert.deepEqual(filterDeals(deals, { q: '98498' }).map((d) => d.id), [2]);
  assert.deepEqual(filterDeals(deals, { ownerId: 3 }).map((d) => d.id), [2]);
  assert.deepEqual(filterDeals(deals, { type: 'hearing_aid' }).map((d) => d.id), [1]);
});

test('money and notes read naturally', () => {
  assert.equal(formatRupees(125000), '₹1,25,000');
  assert.equal(formatRupees(1250000), '₹12,50,000');
  assert.equal(formatRupees(500), '₹500');
  assert.equal(stageChangeNote('booked', 'assessed'), 'Moved from Appointment booked to Assessed');
  assert.equal(stageChangeNote('proposal', 'lost', 'Price / budget'), 'Moved from Trial / proposal to Lost – Price / budget');
  assert.equal(stageChangeNote(null, 'new'), 'New deal at New enquiry');
});

test('CSV export quotes commas and blocks spreadsheet formulas', () => {
  const csv = contactsToCsv([{
    name: 'Rao, K', phone: '9849848516', status: 'lead', source: 'doctor', referred_by: '=HYPERLINK("x")',
    interest: 'Hearing aids', stage: 'proposal', open_value: 85000, next_body: 'Call "after" trial', next_due: '2026-11-15',
    owner_name: 'Reception', created_at: '2026-11-13 04:00:00',
  }]);
  const [, line] = csv.trim().split('\n');
  assert.ok(line.startsWith('"Rao, K",9849848516,Lead,Doctor referral,"\'=HYPERLINK(""x"")",'));
  assert.ok(line.includes('Trial / proposal,85000,"Call ""after"" trial",2026-11-15,Reception,2026-11-13'));
});
