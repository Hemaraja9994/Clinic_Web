-- Sri Rudra Clinic admin: initial schema (Cloudflare D1 / SQLite).

-- Staff accounts. role: 'admin' | 'therapist' | 'reception'.
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'therapist', 'reception')),
  qualification TEXT,            -- e.g. "MASLP", shown on signed reports
  rci_number    TEXT,            -- RCI registration number, shown on signed reports
  password_hash TEXT NOT NULL,   -- pbkdf2$<iterations>$<salt b64>$<hash b64>
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Login sessions. Only a SHA-256 of the cookie token is stored.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Failed login attempts, used to slow down password guessing.
CREATE TABLE login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  key        TEXT NOT NULL,      -- "ip:<address>" or "user:<username>"
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_login_attempts_key ON login_attempts(key, created_at);

CREATE TABLE patients (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  reg_no          TEXT NOT NULL UNIQUE,  -- clinic registration number, e.g. SR-2026-0001
  name            TEXT NOT NULL,
  dob             TEXT,
  age             TEXT,
  sex             TEXT,
  phone           TEXT,
  alt_phone       TEXT,
  address         TEXT,
  languages       TEXT,                  -- e.g. "Telugu, English"
  referred_by     TEXT,
  chief_complaint TEXT,
  case_history    TEXT,
  created_by      INTEGER REFERENCES users(id),
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_phone ON patients(phone);

-- Booking requests from the public website and appointments added by staff.
-- status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'.
CREATE TABLE appointments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id  INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  age         TEXT,
  phone       TEXT NOT NULL,
  service     TEXT,
  concern     TEXT,
  date        TEXT NOT NULL,             -- YYYY-MM-DD
  time        TEXT,                      -- e.g. "10:00 AM"; empty for Sunday call-back requests
  status      TEXT NOT NULL DEFAULT 'requested'
              CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled', 'no_show')),
  source      TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'staff')),
  staff_notes TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_appointments_date ON appointments(date, time);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Clinical reports. type: 'audiology' | 'speech_language'.
-- data holds the structured findings as JSON (thresholds, tympanometry, test results...).
CREATE TABLE reports (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id  INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('audiology', 'speech_language')),
  report_date TEXT NOT NULL,
  data        TEXT NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final')),
  clinician_id INTEGER REFERENCES users(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_reports_patient ON reports(patient_id, report_date);

-- Editable public-website content, one JSON value per key.
CREATE TABLE site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_by INTEGER REFERENCES users(id),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Who changed what, for accountability on patient records.
CREATE TABLE audit_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  action     TEXT NOT NULL,      -- e.g. "patient.create", "report.finalise"
  entity     TEXT,
  entity_id  INTEGER,
  detail     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_audit_created ON audit_log(created_at);
