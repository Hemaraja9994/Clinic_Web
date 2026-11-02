import { SRI_RUDRA_CLINIC, deskBackup, mergeDeskBackup } from '../shared/collectionCatalog.js';

const KEY = 'sri-rudra-desk-v1';
const SESSION = 'sri-rudra-desk-session';

function seed() {
  return {
    users: [],
    clinics: [{ ...SRI_RUDRA_CLINIC }],
    collections: [],
    notes: {},
  };
}

export function loadDesk() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    const next = {
      users: Array.isArray(data.users) ? data.users : [],
      clinics: Array.isArray(data.clinics) && data.clinics.length ? data.clinics : [{ ...SRI_RUDRA_CLINIC }],
      collections: Array.isArray(data.collections) ? data.collections : [],
      notes: data.notes && typeof data.notes === 'object' ? data.notes : {},
    };
    if (!next.clinics.some((clinic) => clinic.id === SRI_RUDRA_CLINIC.id)) {
      next.clinics = [{ ...SRI_RUDRA_CLINIC }, ...next.clinics];
    }
    return next;
  } catch {
    return seed();
  }
}

export function saveDesk(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

export function currentSession() {
  return sessionStorage.getItem(SESSION) || '';
}

export function setSession(username) {
  if (username) sessionStorage.setItem(SESSION, username);
  else sessionStorage.removeItem(SESSION);
}

function bytesToB64(bytes) {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

function b64ToBytes(text) {
  const raw = atob(text);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  return new Uint8Array(bits);
}

export async function createDeskUser(state, username, password) {
  const name = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,40}$/.test(name)) throw new Error('Username: 3–40 letters, numbers, dot, dash or underscore.');
  if (String(password || '').length < 8) throw new Error('Use at least 8 characters.');
  if (state.users.some((user) => user.username === name)) throw new Error('That username is already on this device.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  const hash = await derive(password, salt, iterations);
  const users = [...state.users, { username: name, salt: bytesToB64(salt), hash: bytesToB64(hash), iterations }];
  return { ...state, users };
}

export async function checkDeskPassword(state, username, password) {
  const name = String(username || '').trim().toLowerCase();
  const user = state.users.find((item) => item.username === name);
  if (!user) throw new Error('Username or password is incorrect.');
  const hash = await derive(password, b64ToBytes(user.salt), user.iterations);
  const expected = b64ToBytes(user.hash);
  let diff = hash.length === expected.length ? 0 : 1;
  for (let i = 0; i < hash.length; i += 1) diff |= hash[i] ^ (expected[i] || 0);
  if (diff !== 0) throw new Error('Username or password is incorrect.');
  return name;
}

export function exportBackup(state) {
  return JSON.stringify(deskBackup(state), null, 2);
}

export function importBackup(state, text) {
  let incoming;
  try {
    incoming = JSON.parse(text);
  } catch {
    throw new Error('That file is not a Sri Rudra desk backup.');
  }
  const merged = mergeDeskBackup(state, incoming);
  return { ...state, ...merged, users: state.users };
}

export function newId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
