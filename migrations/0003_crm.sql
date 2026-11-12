-- CRM: enquiries (leads) and customers, deals in one sales pipeline, and follow-ups.
-- Additive only: three new tables. Nothing that already exists is changed.
--
-- Pipeline stages (crm_deals.stage), left to right:
--   new        New enquiry
--   contacted  Contacted
--   booked     Appointment booked
--   assessed   Assessed
--   proposal   Trial / proposal
--   won        Won
--   lost       Lost
-- Allowed values are checked in the app (src/shared/crm.js), not with CHECK constraints,
-- so a stage or lead source can be added later without rebuilding a table.
--
-- A follow-up is a crm_activities row with a due_date and no done_at.
-- A contact's "next action" is its open follow-up with the earliest due_date.

CREATE TABLE IF NOT EXISTS crm_contacts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  phone       TEXT,
  alt_phone   TEXT,
  email       TEXT,
  age         TEXT,
  for_whom    TEXT,
  area        TEXT,
  language    TEXT,
  source      TEXT NOT NULL DEFAULT 'other',
  referred_by TEXT,
  interest    TEXT,
  status      TEXT NOT NULL DEFAULT 'lead',
  owner_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  patient_id  INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  notes       TEXT,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts(status, updated_at);

CREATE TABLE IF NOT EXISTS crm_deals (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id       INTEGER NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  deal_type        TEXT NOT NULL DEFAULT 'other',
  stage            TEXT NOT NULL DEFAULT 'new',
  value_paise      INTEGER NOT NULL DEFAULT 0,
  expected_close   TEXT,
  lost_reason      TEXT,
  owner_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  stage_changed_at TEXT NOT NULL DEFAULT (datetime('now')),
  closed_at        TEXT,
  created_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage, closed_at);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON crm_deals(contact_id);

CREATE TABLE IF NOT EXISTS crm_activities (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id  INTEGER NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id     INTEGER REFERENCES crm_deals(id) ON DELETE SET NULL,
  kind        TEXT NOT NULL DEFAULT 'call',
  body        TEXT,
  due_date    TEXT,
  done_at     TEXT,
  outcome     TEXT,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_crm_activities_open ON crm_activities(done_at, due_date);
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON crm_activities(contact_id, created_at);
