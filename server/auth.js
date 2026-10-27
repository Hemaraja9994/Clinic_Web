// Password hashing, login sessions and role checks.
//
// Passwords are stored as PBKDF2-SHA256 hashes (never in plain text).
// A login creates a random session token kept in an HttpOnly cookie, so
// page scripts cannot read it; the database keeps only a hash of it.

import { HttpError } from './http.js';

const ITERATIONS = 100000; // Cloudflare Workers' maximum for PBKDF2
const SESSION_DAYS = 7;
export const COOKIE_NAME = 'sr_session';

const enc = new TextEncoder();

function toB64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromB64(s) {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, iter, salt, hash] = String(stored).split('$');
  if (scheme !== 'pbkdf2') return false;
  const actual = new Uint8Array(await pbkdf2(password, fromB64(salt), Number(iter)));
  const expected = fromB64(hash);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i += 1) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

export function checkPasswordStrength(password) {
  if (typeof password !== 'string' || password.length < 10) {
    throw new HttpError(400, 'Password must be at least 10 characters.');
  }
}

async function sha256(s) {
  return toB64(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

function cookieFlags(request) {
  // Secure is dropped only for plain-http local development.
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `Path=/; HttpOnly; SameSite=Strict${secure}`;
}

export async function createSession(db, request, userId) {
  const token = toB64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' })[c]);
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(await sha256(token), userId, expires)
    .run();
  return `${COOKIE_NAME}=${token}; ${cookieFlags(request)}; Max-Age=${SESSION_DAYS * 86400}`;
}

export async function destroySession(db, request) {
  const token = readCookie(request, COOKIE_NAME);
  if (token) await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  return `${COOKIE_NAME}=; ${cookieFlags(request)}; Max-Age=0`;
}

// Returns the logged-in user, or null.
export async function currentUser(db, request) {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return null;
  const row = await db.prepare(
    `SELECT u.id, u.username, u.full_name, u.role, u.qualification, u.rci_number
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1`,
  ).bind(await sha256(token), new Date().toISOString()).first();
  return row || null;
}

export function requireRole(user, ...roles) {
  if (!user) throw new HttpError(401, 'Please log in.');
  if (roles.length && !roles.includes(user.role)) throw new HttpError(403, 'Your role does not allow this.');
  return user;
}

// Slow down password guessing: too many recent failures for this IP or username → refuse.
// limits: [[key, maxFailures], ...]
export async function assertNotLockedOut(db, limits, minutes) {
  const since = sqlTime(Date.now() - minutes * 60000);
  for (const [key, max] of limits) {
    const row = await db.prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE key = ? AND created_at > ?').bind(key, since).first();
    if (row.n >= max) throw new HttpError(429, 'Too many attempts. Please wait 15 minutes and try again.');
  }
}

// Same format as SQLite's datetime('now'), so the two compare correctly.
export function sqlTime(ms) {
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
}

export async function recordAttempt(db, key) {
  await db.prepare('INSERT INTO login_attempts (key) VALUES (?)').bind(key).run();
}
