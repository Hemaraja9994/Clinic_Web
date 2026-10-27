// Clinical calculations for audiology reports.
// Every value here is a suggestion shown to the clinician, who can override it.

export const AC_FREQS = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
export const BC_FREQS = [250, 500, 1000, 2000, 3000, 4000];
export const REFLEX_FREQS = [500, 1000, 2000, 4000];
export const EARS = ['right', 'left'];

// Threshold entry: a number in dB HL, optionally followed by "NR" (no response at that level).
// "NR" alone means no response at the audiometer limit.
export function parseThreshold(raw) {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim().toUpperCase();
  if (!s) return null;
  const m = s.match(/^(-?\d{1,3})?\s*(NR)?$/);
  if (!m || (!m[1] && !m[2])) return null;
  const value = m[1] !== undefined ? Number(m[1]) : 120;
  if (value < -10 || value > 130) return null;
  return { value, nr: Boolean(m[2]) };
}

// Pure-tone average over 500, 1000 and 2000 Hz.
export function pta(thresholds = {}) {
  const vals = [500, 1000, 2000].map((f) => parseThreshold(thresholds[f]));
  if (vals.some((v) => !v)) return null;
  return Math.round(vals.reduce((sum, v) => sum + v.value, 0) / 3);
}

// Degree of hearing loss by PTA – Clark (1981) modification of Goodman (1965).
export function degree(ptaValue) {
  if (ptaValue === null || ptaValue === undefined) return '';
  if (ptaValue <= 15) return 'Normal hearing sensitivity';
  if (ptaValue <= 25) return 'Slight';
  if (ptaValue <= 40) return 'Mild';
  if (ptaValue <= 55) return 'Moderate';
  if (ptaValue <= 70) return 'Moderately severe';
  if (ptaValue <= 90) return 'Severe';
  return 'Profound';
}

// Suggested type of loss from AC and BC PTAs; an air–bone gap of 15 dB or more is treated as significant.
export function lossType(acPta, bcPta) {
  if (acPta === null) return '';
  if (acPta <= 25) return 'Hearing sensitivity within normal limits';
  if (bcPta === null) return `${degree(acPta)} hearing loss (type to be confirmed – BC not recorded)`;
  const gap = acPta - bcPta;
  let type = 'sensorineural';
  if (gap >= 15) type = bcPta <= 25 ? 'conductive' : 'mixed';
  return `${degree(acPta)} ${type} hearing loss`;
}

export function earSummary(ear) {
  const ac = pta(ear?.ac);
  const bc = pta(ear?.bc);
  return { ac, bc, gap: ac !== null && bc !== null ? ac - bc : null, impression: lossType(ac, bc) };
}

// Jerger (1970) tympanogram type from peak pressure (daPa) and peak compliance (ml).
// Adult norms: pressure −100 to +50 daPa, compliance 0.3–1.6 ml.
export function tympType(tymp) {
  if (!tymp) return '';
  if (tymp.noPeak) return 'B';
  const pressure = Number(tymp.pressure);
  const compliance = Number(tymp.compliance);
  if (tymp.pressure === '' || tymp.compliance === '' || Number.isNaN(pressure) || Number.isNaN(compliance)) return '';
  if (pressure < -100) return 'C';
  if (compliance < 0.3) return 'As';
  if (compliance > 1.6) return 'Ad';
  return 'A';
}

export const TYMP_MEANING = {
  A: 'Normal middle ear pressure and compliance',
  As: 'Reduced compliance (stiff system, e.g. otosclerosis)',
  Ad: 'Hypercompliant (e.g. ossicular discontinuity, flaccid TM)',
  B: 'Flat – no peak (e.g. middle ear effusion; check ECV for perforation/patent grommet)',
  C: 'Negative middle ear pressure (Eustachian tube dysfunction)',
};
