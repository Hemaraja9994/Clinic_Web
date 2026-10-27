// Audiogram and tympanogram drawings (SVG), used on screen and in printed reports.
// Symbols follow ASHA (1990) conventions: right ear red, left ear blue.

import React from 'react';
import { AC_FREQS, BC_FREQS, parseThreshold } from '../clinical.js';

const RED = '#c0262d';
const BLUE = '#1f4fb3';
const GRID = '#d9cdbf';
const INK = '#4a3f36';

const W = 360;
const H = 330;
const PAD = { left: 44, right: 14, top: 30, bottom: 34 };
const DB_MIN = -10;
const DB_MAX = 120;

const freqLabel = (f) => (f >= 1000 ? `${f / 1000}k` : String(f));
// Octave-spaced x axis; 3k and 6k fall between their octaves.
const xFor = (f) => PAD.left + (Math.log2(f / 250) / Math.log2(8000 / 250)) * (W - PAD.left - PAD.right);
const yFor = (db) => PAD.top + ((db - DB_MIN) / (DB_MAX - DB_MIN)) * (H - PAD.top - PAD.bottom);

function Symbol({ kind, x, y, color }) {
  const s = 6;
  const common = { stroke: color, strokeWidth: 1.8, fill: 'none' };
  switch (kind) {
    case 'O': return <circle cx={x} cy={y} r={s} {...common} />;
    case 'X': return <path d={`M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`} {...common} />;
    case 'triangle': return <path d={`M${x} ${y - s}L${x + s} ${y + s * 0.8}L${x - s} ${y + s * 0.8}Z`} {...common} />;
    case 'square': return <rect x={x - s} y={y - s} width={s * 2} height={s * 2} {...common} />;
    // BC symbols sit beside the frequency line: right ear to the left, left ear to the right.
    case '<': return <path d={`M${x - 3} ${y - s}L${x - 3 - s} ${y}L${x - 3} ${y + s}`} {...common} />;
    case '>': return <path d={`M${x + 3} ${y - s}L${x + 3 + s} ${y}L${x + 3} ${y + s}`} {...common} />;
    case '[': return <path d={`M${x - 4} ${y - s}H${x - 9}V${y + s}H${x - 4}`} {...common} />;
    case ']': return <path d={`M${x + 4} ${y - s}H${x + 9}V${y + s}H${x + 4}`} {...common} />;
    default: return null;
  }
}

function NoResponseArrow({ x, y, color, side }) {
  const dx = side === 'right' ? -1 : 1;
  const ex = x + dx * 9;
  const ey = y + 16;
  return <path d={`M${x + dx * 2} ${y + 6}L${ex} ${ey}M${ex} ${ey}l${-dx * 1} -5M${ex} ${ey}l${-dx * 5} -1`} stroke={color} strokeWidth={1.5} fill="none" />;
}

function plotPoints(values, freqs) {
  return freqs
    .map((f) => ({ f, t: parseThreshold(values?.[f]) }))
    .filter((p) => p.t)
    .map((p) => ({ ...p, x: xFor(p.f), y: yFor(p.t.value) }));
}

export function Audiogram({ ear, data = {}, masking = {} }) {
  const color = ear === 'right' ? RED : BLUE;
  const acSymbol = masking.ac ? (ear === 'right' ? 'triangle' : 'square') : ear === 'right' ? 'O' : 'X';
  const bcSymbol = masking.bc ? (ear === 'right' ? '[' : ']') : ear === 'right' ? '<' : '>';
  const ac = plotPoints(data.ac, AC_FREQS);
  const bc = plotPoints(data.bc, BC_FREQS);
  // Lines join responses only; points marked NR are not connected.
  const line = ac.filter((p) => !p.t.nr).map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join('');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${ear} ear audiogram`}>
      <text x={W / 2} y={14} textAnchor="middle" fontSize="12" fontWeight="700" fill={color} letterSpacing="2">
        {ear === 'right' ? 'RIGHT EAR' : 'LEFT EAR'}
      </text>
      {/* normal hearing band */}
      <rect x={PAD.left} y={yFor(DB_MIN)} width={W - PAD.left - PAD.right} height={yFor(25) - yFor(DB_MIN)} fill="#f3ece2" />
      {Array.from({ length: (DB_MAX - DB_MIN) / 10 + 1 }, (_, i) => DB_MIN + i * 10).map((db) => (
        <g key={db}>
          <line x1={PAD.left} x2={W - PAD.right} y1={yFor(db)} y2={yFor(db)} stroke={GRID} strokeWidth={db === 0 ? 1.4 : 0.7} />
          <text x={PAD.left - 6} y={yFor(db) + 3.5} textAnchor="end" fontSize="9" fill={INK}>{db}</text>
        </g>
      ))}
      {AC_FREQS.map((f) => (
        <g key={f}>
          <line x1={xFor(f)} x2={xFor(f)} y1={PAD.top} y2={H - PAD.bottom} stroke={GRID} strokeWidth={0.7} strokeDasharray={[3000, 6000].includes(f) ? '3 3' : undefined} />
          <text x={xFor(f)} y={PAD.top - 6} textAnchor="middle" fontSize="9" fill={INK}>{freqLabel(f)}</text>
        </g>
      ))}
      <text x={W / 2 + PAD.left / 2} y={H - 10} textAnchor="middle" fontSize="9" fill={INK} letterSpacing="1">FREQUENCY (Hz)</text>
      <text transform={`translate(11 ${(PAD.top + H - PAD.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="9" fill={INK} letterSpacing="1">HEARING LEVEL (dB HL)</text>
      <path d={line} stroke={color} strokeWidth={1.5} fill="none" />
      {ac.map((p) => (
        <g key={`ac${p.f}`}>
          <Symbol kind={acSymbol} x={p.x} y={p.y} color={color} />
          {p.t.nr && <NoResponseArrow x={p.x} y={p.y} color={color} side={ear} />}
        </g>
      ))}
      {bc.map((p) => (
        <g key={`bc${p.f}`}>
          <Symbol kind={bcSymbol} x={p.x} y={p.y} color={color} />
          {p.t.nr && <NoResponseArrow x={p.x} y={p.y} color={color} side={ear} />}
        </g>
      ))}
    </svg>
  );
}

export function AudiogramKey() {
  const items = [
    ['O', RED, 'R air'], ['X', BLUE, 'L air'], ['triangle', RED, 'R air masked'], ['square', BLUE, 'L air masked'],
    ['<', RED, 'R bone'], ['>', BLUE, 'L bone'], ['[', RED, 'R bone masked'], [']', BLUE, 'L bone masked'],
  ];
  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-1 text-[11px] text-clinic-umber">
      {items.map(([kind, color, label]) => (
        <span key={label} className="inline-flex items-center gap-1">
          <svg width="22" height="16" viewBox="0 0 22 16"><Symbol kind={kind} x={11} y={8} color={color} /></svg>
          {label}
        </span>
      ))}
    </div>
  );
}

// Tympanogram drawn as a smooth peak at the recorded pressure and compliance (flat for type B).
export function Tympanogram({ ear, tymp = {} }) {
  const color = ear === 'right' ? RED : BLUE;
  const w = 300;
  const h = 190;
  const pad = { left: 36, right: 10, top: 22, bottom: 30 };
  const P_MIN = -400;
  const P_MAX = 200;
  const C_MAX = 2;
  const x = (p) => pad.left + ((p - P_MIN) / (P_MAX - P_MIN)) * (w - pad.left - pad.right);
  const y = (c) => pad.top + (1 - Math.min(c, C_MAX) / C_MAX) * (h - pad.top - pad.bottom);

  const peakP = Number(tymp.pressure);
  const peakC = Number(tymp.compliance);
  const hasPeak = !tymp.noPeak && tymp.pressure !== '' && tymp.compliance !== '' && !Number.isNaN(peakP) && !Number.isNaN(peakC);
  const hasData = hasPeak || tymp.noPeak;
  const base = 0.12;
  let path = '';
  if (hasData) {
    for (let p = P_MIN; p <= P_MAX; p += 10) {
      const c = hasPeak ? base + Math.max(peakC - base, 0) * Math.exp(-(((p - peakP) / 70) ** 2)) : base + 0.04;
      path += `${p === P_MIN ? 'M' : 'L'}${x(p).toFixed(1)} ${y(c).toFixed(1)}`;
    }
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={`${ear} ear tympanogram`}>
      <text x={w / 2} y={12} textAnchor="middle" fontSize="11" fontWeight="700" fill={color} letterSpacing="2">
        {ear === 'right' ? 'RIGHT EAR' : 'LEFT EAR'}
      </text>
      {/* normal region for type A */}
      <rect x={x(-100)} y={y(1.6)} width={x(50) - x(-100)} height={y(0.3) - y(1.6)} fill="#f3ece2" />
      {[-400, -300, -200, -100, 0, 100, 200].map((p) => (
        <g key={p}>
          <line x1={x(p)} x2={x(p)} y1={pad.top} y2={h - pad.bottom} stroke={GRID} strokeWidth={p === 0 ? 1.2 : 0.6} />
          <text x={x(p)} y={h - pad.bottom + 12} textAnchor="middle" fontSize="8.5" fill={INK}>{p}</text>
        </g>
      ))}
      {[0, 0.5, 1, 1.5, 2].map((c) => (
        <g key={c}>
          <line x1={pad.left} x2={w - pad.right} y1={y(c)} y2={y(c)} stroke={GRID} strokeWidth={0.6} />
          <text x={pad.left - 5} y={y(c) + 3} textAnchor="end" fontSize="8.5" fill={INK}>{c}</text>
        </g>
      ))}
      <text x={(pad.left + w) / 2} y={h - 4} textAnchor="middle" fontSize="8.5" fill={INK} letterSpacing="1">PRESSURE (daPa)</text>
      <text transform={`translate(9 ${(pad.top + h - pad.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="8.5" fill={INK}>ml</text>
      {path && <path d={path} stroke={color} strokeWidth={1.8} fill="none" />}
      {!hasData && <text x={w / 2} y={h / 2} textAnchor="middle" fontSize="10" fill="#9a8a7c">Not recorded</text>}
    </svg>
  );
}
