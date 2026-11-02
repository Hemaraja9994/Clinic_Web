import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (err) => errors.push(String(err)));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

async function fillLocked(testId, value) {
  const field = page.getByTestId(testId);
  await field.click();
  await field.fill(value);
}

await page.goto('http://127.0.0.1:8734/', { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Set up this device' }).waitFor();
await fillLocked('setup-username', 'prasad');
await fillLocked('setup-password', 'testing123');
await page.getByTestId('setup-confirm').fill('testing123');
await page.getByTestId('setup-submit').click();
await page.getByRole('heading', { name: 'Good day.' }).waitFor();
await page.getByText('Sri Rudra · MVP Double Road').waitFor();
await page.getByText('Visakhapatnam-530017').waitFor();
await page.getByText('9849848516').waitFor();

await page.getByTestId('note').fill('Cover for the afternoon camp.');
await page.getByTestId('save-note').click();
await page.getByText('Saved on this device.').waitFor();

await page.goto('http://127.0.0.1:8734/#/collections');
await page.getByRole('heading', { name: 'Collections' }).waitFor();
await page.getByTestId('record-collection').click();
await page.getByRole('heading', { name: 'New collection' }).waitFor();
await page.getByTestId('test-checklist').waitFor();
await page.getByTestId('preset-pta_impedance').click();
await page.getByTestId('preset-bera_oae').click();
await page.getByTestId('service-huggies').check();
await page.getByTestId('service-amount-pta').fill('300');
await page.getByTestId('service-amount-impedance').fill('150');
await page.getByTestId('service-amount-bera').fill('800');
await page.getByTestId('service-amount-oae').fill('450');
await page.getByTestId('service-amount-huggies').fill('40');
await page.getByTestId('phone').fill('+91 70320 54275');
await page.getByLabel('Reference').fill('Dr suneel');
await page.getByLabel('Notes').fill('Combined visit');
await page.getByTestId('save-collection').click();
await page.getByText('Saved 5 collections.').waitFor();

const table = await page.locator('[data-testid="collection-row"]').allTextContents();
if (table.length !== 5) throw new Error(`expected 5 rows, got ${table.length}: ${table.join(' | ')}`);
const joined = table.join('\n');
for (const label of ['PTA', 'Impedance', 'BERA', 'OAE', 'Huggies', '7032054275', 'Dr suneel', 'Combined visit']) {
  if (!joined.includes(label)) throw new Error(`missing ${label} in ${joined}`);
}

await page.getByTestId('record-collection').click();
await page.getByText('Or save as one category').click();
await page.getByTestId('category').selectOption({ label: 'PTA + Impedance' });
const options = await page.getByTestId('category').locator('option').allTextContents();
for (const label of ['PTA + Impedance', 'PTA + Impedance + Tinnitus', 'BERA & OAE', 'Ear tips', 'Domes']) {
  if (!options.includes(label)) throw new Error(`category list missing ${label}`);
}
await page.getByTestId('amount').fill('500');
await page.getByTestId('phone').fill('9032389666');
await page.getByTestId('save-collection').click();
await page.getByText('Saved.').waitFor();
await page.getByRole('cell', { name: 'PTA + Impedance', exact: true }).waitFor();

await page.getByTestId('filter-category').selectOption({ label: 'Huggies' });
await page.waitForTimeout(100);
const filtered = await page.locator('[data-testid="collection-row"]').count();
if (filtered !== 1) throw new Error(`huggies filter expected 1 row, got ${filtered}`);

await page.goto('http://127.0.0.1:8734/#/clinics');
await page.getByText('Hearing aid supplies').first().waitFor();
const clinicText = await page.locator('article').first().innerText();
if (!clinicText.includes('Huggies') || !clinicText.includes('Ear tips') || !clinicText.includes('Domes')) {
  throw new Error(`clinic card missing supplies: ${clinicText}`);
}
if (!clinicText.includes('PTA + Impedance + Tinnitus') || !clinicText.includes('BERA & OAE')) {
  throw new Error(`clinic card missing combinations: ${clinicText}`);
}
await page.getByTestId('clinic-name').fill('Camp clinic');
await page.getByTestId('add-clinic').click();
await page.getByRole('heading', { name: 'Camp clinic' }).waitFor();

await page.getByTestId('sign-out').click();
await page.getByRole('heading', { name: 'Sign in' }).waitFor();
const userValue = await page.getByTestId('login-username').inputValue();
const passValue = await page.getByTestId('login-password').inputValue();
if (userValue !== '' || passValue !== '') throw new Error(`sign-in was prefilled user=${userValue}`);
const userAuto = await page.getByTestId('login-username').getAttribute('autocomplete');
const passAuto = await page.getByTestId('login-password').getAttribute('autocomplete');
if (userAuto !== 'off' || passAuto !== 'new-password') throw new Error(`autocomplete user=${userAuto} pass=${passAuto}`);

await fillLocked('login-username', 'prasad');
await fillLocked('login-password', 'testing123');
await page.getByTestId('login-submit').click();
await page.getByRole('heading', { name: 'Clinics' }).waitFor();
await page.goto('http://127.0.0.1:8734/#/');
await page.getByRole('heading', { name: 'Good day.' }).waitFor();
const note = await page.getByTestId('note').inputValue();
if (note !== 'Cover for the afternoon camp.') throw new Error(`note was not kept: ${note}`);

await page.goto('http://127.0.0.1:8734/#/collections');
await page.getByTestId('filter-category').selectOption({ label: 'All' });
await page.getByText('6 records').waitFor();

if (errors.length) throw new Error(errors.join('\n'));
await page.screenshot({ path: '/tmp/desk-collections.png', fullPage: true });
console.log('DESK FLOW OK');
await browser.close();
