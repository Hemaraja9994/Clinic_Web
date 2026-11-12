# Staff Portal – Setup & Use

The clinic website now includes a staff portal at **`/admin/`**
(e.g. `https://srirudraspeechandhearing.com/admin/`). It runs on **Cloudflare Pages** with a
**Cloudflare D1** database, so patient records are stored on a server and protected by login,
not in the browser.

## What it does

| Area | Who can use it | What it does |
|---|---|---|
| Dashboard | All staff | Today's schedule, new website requests, patient and report counts |
| Appointments | All staff | Website bookings arrive as *Requested*; confirm, reschedule, mark seen, WhatsApp the patient, register as a patient |
| CRM – leads | All staff | Leads, deals and follow-up dates in one sales pipeline (New enquiry → Contacted → Appointment booked → Assessed → Trial / proposal → Won / Lost). Every person has a *next action*. Website bookings become leads on their own, with "Call to confirm" due the same day. Only an admin can delete |
| Patients | All staff | Register patients (auto reg. no. `SR-2026-0001`), search, demographics. Case history is visible to clinicians only |
| Clinical reports | Admin, Audiologist/SLP | Audiology (PTA with audiogram, speech audiometry, tympanometry, reflexes, OAE) and speech-language reports; printable letterhead PDF; *Finalise* locks a report |
| Website content | Admin | Announcement banner (English + Telugu), clinic timings, service descriptions |
| Staff & audit log | Admin | Add staff with roles, reset passwords, deactivate accounts, see who changed what |

Roles: **Admin** (everything) · **Audiologist / SLP** (appointments, patients, reports) ·
**Reception** (appointments and registration only – no clinical reports or case history).

## One-time Cloudflare setup (about 15 minutes, all in the dashboard)

### 1. Create the database
1. Cloudflare dashboard → **Storage & Databases → D1 SQL Database → Create**.
2. Name: `sri-rudra-clinic-web-db`. Location: **Asia-Pacific**. Click **Create**.
3. Copy the **Database ID** shown on the next page and put it in `wrangler.toml`
   (`database_id = "..."`), or send it to whoever maintains the code.
4. Open the database → **Console** tab → paste the whole of `docs/d1-console-setup.sql` → **Execute**.
   This creates the tables. (Use this file, not `migrations/0001_init.sql`: the console joins pasted
   lines into one, so the comments in the migration file would hide the SQL.)
   Then paste `docs/d1-console-upgrade.sql` → **Execute** (collections and CRM tables).

### 2. Create the Pages project
1. **Workers & Pages → Create → Pages → Connect to Git** → choose `hemaraja9994/clinic_web`.
2. Production branch: `main`. Framework preset: *None*.
   Build command: `npm run build`. Build output directory: `dist`.
3. **Save and Deploy.** The database connection comes from `wrangler.toml`, so step 1.3 must be done first.

### 3. Add the setup secret
1. Pages project → **Settings → Variables and Secrets → Add** → type **Secret**.
2. Name `SETUP_TOKEN`, value: any long random phrase you keep private.
3. **Deployments → Retry deployment** (or push any change) so the secret takes effect.

### 4. Connect your domain
1. Pages project → **Custom domains → Set up a custom domain** → `srirudraspeechandhearing.com`,
   then repeat for `www.srirudraspeechandhearing.com`. Cloudflare creates the DNS records itself.
2. If either name is already attached to another Worker or Pages project (e.g. `sri-rudra-admin`),
   remove it there first.

### 5. Create your admin account
1. Open `https://srirudraspeechandhearing.com/admin/`.
2. The first visit shows **Create the first admin account**. Enter the `SETUP_TOKEN`, your name,
   qualification, RCI number, username and a password of at least 10 characters.
3. Setup locks itself once an account exists. You can then delete the `SETUP_TOKEN` secret.
4. Add other staff from **Staff & audit log → Add staff**.

## Updating the database (when a new feature needs new tables)
New features add tables; they never change or remove existing ones. Do this **before or right after**
publishing the new code. Until it is done, the new screens show "needs a database update" and
everything else (website bookings included) keeps working.

1. Cloudflare dashboard → **Storage & Databases → D1** → `sri-rudra-clinic-web-db` → **Console**.
2. Paste the whole of `docs/d1-console-upgrade.sql` → **Execute**.
   It is safe to run more than once: tables that already exist are left as they are.
3. Developers can instead run `npm run db:migrate:remote` — but only if the database was set up with
   wrangler migrations; if it was set up through the console, use step 2.

## Using the CRM (staff routine)
**Words used:** a *lead* is someone who enquired; a *customer* has bought (a deal was won); a *deal* is
one thing they may take (hearing aids, a therapy package, tests); a *follow-up* is a dated next action.

| Stage | Means |
|---|---|
| New enquiry | Enquiry received – not spoken to yet (website bookings start here) |
| Contacted | Spoken to – need understood |
| Appointment booked | Visit or test date fixed |
| Assessed | Tested – recommendation given |
| Trial / proposal | Hearing-aid trial, quote or therapy plan shared |
| Won / Lost | Aid fitted or package paid / did not go ahead (a reason is asked) |

**Every morning:** CRM → **Follow-ups**. Clear *Overdue*, then *Today*. After each call press **Done**,
write what happened, move the deal if it moved, and set the next follow-up (Tomorrow, In 3 days, In 1 week…).

**New phone or walk-in enquiry:** **New lead** → name, phone, how they found us, referring doctor, what they
need, likely value and the first next action. The form warns if the phone number is already saved.

**Every week:** **Leads & customers** → tick **No next action**. Give each person a follow-up or mark them
*Inactive*. The **Pipeline** tab shows where every deal stands and how long it has been there.

Keep clinical findings out of CRM notes – they belong in the patient's report. **Register as patient** on a
contact's page creates the patient record when they come in.

## Security notes
- Passwords are stored only as salted PBKDF2 hashes. Login uses an HttpOnly, SameSite=Strict cookie.
- 5 wrong passwords for a username (or 20 from one network) blocks logins for 15 minutes.
- Final reports can be changed only by an admin, and every change is recorded in the audit log.
- Patient data is health data under India's DPDP Act 2023: give each person their own login,
  deactivate accounts of staff who leave, and never share passwords.
- Back up the database regularly: D1 → your database → **Time Travel** keeps 30 days of history.

## Local development (for developers)
```bash
npm install
npm run db:migrate:local
echo 'SETUP_TOKEN=local-test-token' > .dev.vars
npm run pages:dev            # website + API at http://localhost:8788, portal at /admin/
```

## Not included yet
- Uploading gallery photos from the portal (needs Cloudflare R2 storage).
- SMS/WhatsApp messages sent automatically (the portal opens WhatsApp with a pre-filled message instead).
- Bookings made inside the main portal (admin.srirudraspeechandhearing.com) do not reach the CRM; only website
  bookings and leads typed into the CRM do.
