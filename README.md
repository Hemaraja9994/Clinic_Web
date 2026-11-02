# Sri Rudra Clinic Website

Finalized Vite + React website for Sri Rudra Speech & Hearing Clinic.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The deployable static output is generated in `dist/`.

## Clinic desk (offline)

`/desk.html` is a collections desk for clinic staff. It records combined tests
(PTA + Impedance, PTA + Impedance + Tinnitus, BERA & OAE), hearing-aid parts
(including Huggies, ear tips and domes), a phone number, and a note on the
dashboard. On a new collection, click a test in the checklist to add it.

It stores its data in the browser, so it keeps working without internet after
it has been opened once. Install it on a phone from the browser menu. The
Windows folder is `public/downloads/Sri-Rudra-Desk-Windows.zip` (rebuild with
`npm run pack:desk`). Sri Rudra · MVP Double Road is already filled in.

The same collection checklist, phone field and dashboard note
are in the staff portal at `/admin/` (`#/collections`). Signing out leaves the
username and password blank.

## Staff portal

The site includes a staff portal at `/admin/` (appointments, patient records, audiology and
speech-language reports, website content) backed by Cloudflare Pages Functions and a D1 database.
See [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md) for setup and roles.
