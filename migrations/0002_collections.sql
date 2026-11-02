-- Daily collections (money taken, split by service) and a note on the staff dashboard.

CREATE TABLE clinics (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  group_name TEXT,
  city       TEXT,
  phone      TEXT,
  address    TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO clinics (id, name, group_name, city, phone, address) VALUES (
  'sri-rudra-mvp',
  'Sri Rudra · MVP Double Road',
  'Sri Rudra',
  'Visakhapatnam',
  '9849848516',
  'Flat No. 211 & 212, HIG-207/4, Second Floor, Beside Kotak Mahindra Bank, Bhavana Heights, MVP Double Road, Visakhapatnam-530017, Andhra Pradesh.'
);

CREATE TABLE collections (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  clinic_id       TEXT NOT NULL REFERENCES clinics(id),
  collection_date TEXT NOT NULL,
  category        TEXT NOT NULL,
  amount_paise    INTEGER NOT NULL,
  method          TEXT NOT NULL DEFAULT 'cash',
  phone           TEXT,
  reference       TEXT,
  notes           TEXT,
  created_by      INTEGER REFERENCES users(id),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_collections_date ON collections(collection_date, clinic_id);

CREATE TABLE dashboard_notes (
  note_date  TEXT PRIMARY KEY,
  body       TEXT NOT NULL DEFAULT '',
  updated_by INTEGER REFERENCES users(id),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
