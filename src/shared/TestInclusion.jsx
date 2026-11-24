import React, { useState } from 'react';

import {
  CATEGORIES,
  SERVICE_GROUPS,
  categoryLabel,
  defaultTestInclusion,
  includedIds,
  normalizeTestInclusion,
  setTestPurpose,
  toggleTestInclusion,
} from './collectionCatalog.js';

const STORAGE_KEY = 'sri-rudra-included-tests';

export function loadTestInclusion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTestInclusion();
    return normalizeTestInclusion(JSON.parse(raw));
  } catch {
    return defaultTestInclusion();
  }
}

export function saveTestInclusion(inclusion) {
  const next = normalizeTestInclusion(inclusion);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The bill still follows the selection held in memory for this page.
  }
  return next;
}

export function useTestInclusion() {
  const [inclusion, setInclusion] = useState(loadTestInclusion);
  const replace = (next) => {
    const saved = saveTestInclusion(next);
    setInclusion(saved);
    return saved;
  };
  const toggle = (purpose, categoryId) => {
    setInclusion((current) => saveTestInclusion(toggleTestInclusion(current, purpose, categoryId)));
  };
  const setPurpose = (purpose, ids) => {
    setInclusion((current) => saveTestInclusion(setTestPurpose(current, purpose, ids)));
  };
  return { inclusion, replace, toggle, setPurpose };
}

function PurposeSwitch({ purpose, onSet }) {
  const label = purpose === 'billing' ? 'Billing' : 'Report';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-clinic-umber">{label}</span>
      <button type="button" className="a-btn-secondary" data-testid={`${purpose}-all`} onClick={() => onSet(purpose, CATEGORIES.map(([id]) => id))}>All</button>
      <button type="button" className="a-btn-secondary" data-testid={`${purpose}-none`} onClick={() => onSet(purpose, [])}>None</button>
    </div>
  );
}

export function TestInclusionPicker({ inclusion, onToggle, onSetPurpose }) {
  const billing = new Set(includedIds(inclusion, 'billing'));
  const report = new Set(includedIds(inclusion, 'report'));

  return (
    <div data-testid="test-inclusion">
      <div className="flex flex-wrap gap-3">
        <PurposeSwitch purpose="billing" onSet={onSetPurpose} />
        <PurposeSwitch purpose="report" onSet={onSetPurpose} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {SERVICE_GROUPS.map((group) => (
          <fieldset key={group.title} className="min-w-0">
            <legend className="text-xs font-semibold uppercase tracking-wider text-clinic-umber">{group.title}</legend>
            <div className="mt-2 grid gap-1.5">
              {group.ids.map((id) => (
                <div key={id} className="flex flex-col gap-2 rounded-xl border border-clinic-sand/80 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-clinic-ink">{categoryLabel(id)}</span>
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        data-testid={`bill-${id}`}
                        checked={billing.has(id)}
                        onChange={() => onToggle('billing', id)}
                      />
                      Billing
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        data-testid={`report-${id}`}
                        checked={report.has(id)}
                        onChange={() => onToggle('report', id)}
                      />
                      Report
                    </label>
                  </span>
                </div>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export function IncludedTestNames({ inclusion, purpose, testId, empty }) {
  const names = includedIds(inclusion, purpose).map((id) => categoryLabel(id));
  return (
    <p data-testid={testId} className="text-sm leading-6 text-clinic-ink">
      {names.length ? names.join(', ') : empty}
    </p>
  );
}
