import { cp, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const release = path.join(root, 'release', 'sri-rudra-desk');
const outZip = path.join(root, 'public', 'downloads', 'Sri-Rudra-Desk-Windows.zip');

const builtHtml = path.join(release, 'desk.html');
await rename(builtHtml, path.join(release, 'index.html'));
await cp(path.join(root, 'public', 'sw.js'), path.join(release, 'sw.js'));
await cp(path.join(root, 'public', 'clinic-logo-mobile.png'), path.join(release, 'clinic-logo-mobile.png'));
await cp(path.join(root, 'scripts', 'serve-desk.ps1'), path.join(release, 'serve.ps1'));
const bat = await readFile(path.join(root, 'scripts', 'Start Sri Rudra Desk.bat'), 'utf8');
await writeFile(path.join(release, 'Start Sri Rudra Desk.bat'), bat.replace(/\r?\n/g, '\r\n'));

const manifest = {
  name: 'Sri Rudra Clinic Desk',
  short_name: 'Sri Rudra',
  description: 'Daily collections for Sri Rudra Speech & Hearing Clinic. Works on this PC with the internet off.',
  start_url: './index.html',
  scope: './',
  display: 'standalone',
  background_color: '#F8F5F1',
  theme_color: '#6B1F2A',
  icons: [{ src: './clinic-logo-mobile.png', sizes: '192x192', type: 'image/png', purpose: 'any' }],
};
await writeFile(path.join(release, 'desk.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);

const readme = `Sri Rudra Speech & Hearing Clinic — desk for Windows
========================================================

This folder runs the clinic desk on this computer. Collections, the daily
note, and clinic details are saved in this browser on this PC. After the
first open, it keeps working with the internet switched off.

Clinic already filled in
------------------------
Sri Rudra · MVP Double Road
Flat No. 211 & 212, HIG-207/4, Second Floor, Beside Kotak Mahindra Bank,
Bhavana Heights, MVP Double Road, Visakhapatnam-530017.
Phones: 9849848516 · 9032389666 · 7032054275
Email: srirudraspeechandhearing@gmail.com

How to start
------------
1. Unzip this folder somewhere you can find it (for example the Desktop).
2. Double-click "Start Sri Rudra Desk.bat".
3. Leave the black window open while you work. Closing it stops the desk.
4. The browser opens. The first time, create a username and password for
   this computer. It is not filled in again after you sign out.

What you can record
-------------------
- One service, including PTA + Impedance, PTA + Impedance + Tinnitus,
  and BERA & OAE.
- Several services from one visit (Choose services). Presets fill
  PTA and Impedance, or those two plus Tinnitus, or BERA and OAE.
  Huggies, ear tips and domes are in the same list for every clinic.
- A phone number on each collection.
- A note on the dashboard for the day.

Phone
-----
On the clinic Wi-Fi, open this address in Chrome on the phone:

  https://srirudraspeechandhearing.com/desk.html

Tap the browser menu, then Install app (Android) or Share, then
Add to Home Screen (iPhone). Open it once while you are online.
After that the icon opens without internet. Records on the phone
stay on the phone until you export them.

Moving records between the PC and a phone
------------------------------------------
Collections → Export backup. Send that file (WhatsApp, USB, or mail).
On the other device: Collections → Import backup.

This desk is separate from the online admin portal. Export a backup
if you need the same rows in both places.
`;
await writeFile(path.join(release, 'README.txt'), readme);

await mkdir(path.dirname(outZip), { recursive: true });
execFileSync('python3', ['-c', `
import pathlib, zipfile, sys
src = pathlib.Path(sys.argv[1])
dest = pathlib.Path(sys.argv[2])
if dest.exists():
    dest.unlink()
with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for path in src.rglob('*'):
        if path.is_file():
            zf.write(path, pathlib.Path('Sri Rudra Desk') / path.relative_to(src))
print(dest, dest.stat().st_size)
`, release, outZip], { stdio: 'inherit' });

const html = await readFile(path.join(release, 'index.html'), 'utf8');
if (!html.includes('./assets/')) {
  throw new Error('Standalone desk HTML is missing relative asset URLs.');
}
