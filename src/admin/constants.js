// Must match the services and time slots offered on the public website (src/App.jsx).
export const SERVICE_NAMES = [
  'Diagnostic Audiology',
  'Hearing Aid Services',
  'Pediatric Speech Therapy',
  'Adult Rehabilitation',
  'Not sure - please advise',
];

export const SLOT_TIMES = ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM', '4:30 PM', '5:15 PM', '6:00 PM', '6:45 PM', '7:30 PM', '8:15 PM'];

export const APPOINTMENT_STATUSES = [
  ['requested', 'Requested'],
  ['confirmed', 'Confirmed'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
  ['no_show', 'No-show'],
];

// Sort "4:30 PM" after "12:15 PM" etc.
export function timeKey(t) {
  const m = String(t || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return 9999;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}

export function whatsappLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  const full = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}
