import assert from 'node:assert/strict';
import test from 'node:test';

import { TYMP_C_MAX, TYMP_P_LEFT, TYMP_P_RIGHT, tympX, tympY } from './clinical.js';

const plot = { left: 36, width: 254, top: 22, height: 138 };

test('tympanogram pressure runs positive on the left and negative on the right', () => {
  const left = tympX(TYMP_P_LEFT, plot);
  const right = tympX(TYMP_P_RIGHT, plot);
  assert.equal(left, plot.left);
  assert.equal(right, plot.left + plot.width);
  assert.ok(tympX(200, plot) < tympX(0, plot));
  assert.ok(tympX(0, plot) < tympX(-200, plot));
  assert.ok(tympX(-200, plot) < tympX(-400, plot));
});

test('tympanogram compliance rises upward, in ml', () => {
  const bottom = tympY(0, plot);
  const top = tympY(TYMP_C_MAX, plot);
  assert.equal(bottom, plot.top + plot.height);
  assert.equal(top, plot.top);
  assert.ok(tympY(1, plot) < tympY(0.3, plot));
  assert.equal(tympY(5, plot), plot.top);
});
