/* ============================================================
   B.ASLP PORTAL - BEHAVIOR
   Renders every section from js/data.js and wires up dark mode,
   mobile menu, filters, accordions, the course modal, global
   search, scroll spy and reveal animations.
   No frameworks, no build step.
   ============================================================ */

"use strict";

/* ---------- Helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

// Semester 7 in the data covers the internship year (semesters 7 and 8)
const semLabel = (n) => (n === 7 ? "Sem 7 & 8" : "Sem " + n);

/* ============================================================
   DARK MODE
   ============================================================ */
(function initTheme() {
  const stored = localStorage.getItem("baslp-theme");
  const dark = stored ? stored === "dark"
                      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
  syncThemeIcons(dark);
})();

function syncThemeIcons(dark) {
  $("#icon-sun").classList.toggle("hidden", !dark);
  $("#icon-moon").classList.toggle("hidden", dark);
}

$("#theme-toggle").addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("baslp-theme", dark ? "dark" : "light");
  syncThemeIcons(dark);
});

/* ============================================================
   MOBILE MENU
   ============================================================ */
const menuToggle = $("#menu-toggle");
const mobileMenu = $("#mobile-menu");

function setMenu(open) {
  mobileMenu.classList.toggle("hidden", !open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  $("#icon-menu").classList.toggle("hidden", open);
  $("#icon-close").classList.toggle("hidden", !open);
}

menuToggle.addEventListener("click", () => setMenu(mobileMenu.classList.contains("hidden")));
$$(".mobile-link").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ============================================================
   NOTICE TICKER
   The list is rendered twice back to back so the CSS animation
   can translate by -50% and loop with no visible seam.
   ============================================================ */
const NOTICE_TAG = {
  CLASSES: "bg-crimson-500", BUS: "bg-teal-500", MENTOR: "bg-maroon-400",
  EXAMS: "bg-navy-400", QUEST: "bg-teal-600", CLINICS: "bg-lime-400", ATTEND: "bg-crimson-400"
};

function renderTicker() {
  const item = (nx) => `
    <span class="inline-flex items-center gap-2.5 text-sm">
      <span class="rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider text-white/95 ${NOTICE_TAG[nx.tag] || "bg-crimson-500"}">${esc(nx.tag)}</span>
      <span class="text-maroon-100">${esc(nx.text)}</span>
    </span>`;
  // two passes of the same list = a seamless loop
  const pass = NOTICES.map(item).join("");
  $("#ticker-track").innerHTML = pass + pass;

  const track = $("#ticker-track");
  const btn = $("#ticker-toggle");
  btn.addEventListener("click", () => {
    const paused = track.classList.toggle("paused");
    btn.setAttribute("aria-label", paused ? "Resume notice scrolling" : "Pause notice scrolling");
    $("#tk-pause").classList.toggle("hidden", paused);
    $("#tk-play").classList.toggle("hidden", !paused);
  });
}

/* Equaliser bars along the foot of the hero (audiology motif) */
function renderWave() {
  const host = $(".hero-wave");
  if (!host) return;
  const bars = Math.min(64, Math.max(24, Math.round(window.innerWidth / 26)));
  let html = "";
  for (let i = 0; i < bars; i++) {
    // varied delay and duration so the bars never march in lockstep
    const dur = (1.3 + (i % 7) * 0.22).toFixed(2);
    const del = ((i % 11) * 0.17).toFixed(2);
    html += `<span style="animation-duration:${dur}s;animation-delay:-${del}s"></span>`;
  }
  host.innerHTML = html;
}

/* ============================================================
   SYLLABUS - course cards, filters, detail modal
   ============================================================ */
const STREAM_STYLE = {
  SLP:       { bar: "bg-maroon-700",  chip: "bg-maroon-700/10 text-maroon-700 dark:text-maroon-300",  label: "SLP" },
  Audiology: { bar: "bg-navy-700",    chip: "bg-navy-700/10 text-navy-700 dark:text-navy-300",        label: "Audiology" },
  Allied:    { bar: "bg-teal-600",    chip: "bg-teal-600/10 text-teal-600 dark:text-teal-500",        label: "Allied" }
};

const TYPE_STYLE = {
  M:  "bg-maroon-700 text-white",
  MC: "bg-navy-700 text-white",
  MO: "bg-teal-600 text-white"
};

const KIND_ICON = {
  Theory:    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/>',
  Clinical:  '<path d="M11 2v4m2-4v4M8 6h8v5a4 4 0 0 1-8 0V6zm4 9v3a4 4 0 0 0 8 0v-2"/><circle cx="20" cy="14" r="2"/>',
  Practical: '<path d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V3M8 3h8M7.5 14h9"/>',
  "Optional Minor": '<path d="m12 2 2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.3 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5L12 2z"/>'
};

function courseMatches(c) {
  const q = $("#course-search").value.trim().toLowerCase();
  const sem = $("#filter-sem").value;
  const stream = $("#filter-stream").value;
  const kind = $("#filter-kind").value;

  if (sem !== "all" && String(c.semester) !== sem) return false;
  if (stream !== "all" && c.stream !== stream) return false;
  if (kind !== "all" && c.kind !== kind) return false;
  if (!q) return true;

  // Search the title, code and all unit/topic text
  const hay = [
    c.code, c.title,
    ...c.objectives,
    ...c.units.flatMap((u) => [u.title, ...u.topics]),
    ...c.competencies.flatMap((k) => [k.level, ...k.items])
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

function renderCourses() {
  const list = COURSES.filter(courseMatches);
  $("#course-empty").classList.toggle("hidden", list.length > 0);

  $("#course-grid").innerHTML = list.map((c) => {
    const st = STREAM_STYLE[c.stream] || STREAM_STYLE.Allied;
    const topicCount = c.units.reduce((n, u) => n + u.topics.length, 0) +
                       c.competencies.reduce((n, k) => n + k.items.length, 0);
    return `
    <article class="course-card group flex flex-col bg-white dark:bg-navy-900 rounded-2xl shadow-md ring-1 ring-gray-100 dark:ring-white/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:ring-maroon-600/40 transition-all cursor-pointer"
             data-code="${esc(c.code)}" tabindex="0" role="button"
             aria-label="Open details for ${esc(c.code)} ${esc(c.title)}">
      <div class="h-1.5 ${st.bar}" aria-hidden="true"></div>
      <div class="p-5 flex flex-col grow">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-bold tracking-widest text-gray-400 dark:text-gray-500">${esc(c.code)}</p>
            <h3 class="font-bold text-gray-900 dark:text-white leading-snug mt-1">${esc(c.title)}</h3>
          </div>
          <span class="shrink-0 grid place-items-center w-9 h-9 rounded-lg ${st.chip}" aria-hidden="true">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${KIND_ICON[c.kind] || KIND_ICON.Theory}</svg>
          </span>
        </div>

        <div class="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
          <span class="rounded-full px-2.5 py-1 ${TYPE_STYLE[c.type] || TYPE_STYLE.M}">${esc(c.type)}</span>
          <span class="rounded-full px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">${semLabel(c.semester)}</span>
          <span class="rounded-full px-2.5 py-1 ${st.chip}">${esc(st.label)}</span>
          <span class="rounded-full px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">${esc(c.kind)}</span>
        </div>

        <dl class="mt-4 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-gray-50 dark:bg-white/5 py-2">
            <dt class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Hours</dt>
            <dd class="font-bold text-gray-900 dark:text-white text-sm">${esc(c.hours)}</dd>
          </div>
          <div class="rounded-lg bg-gray-50 dark:bg-white/5 py-2">
            <dt class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Marks</dt>
            <dd class="font-bold text-gray-900 dark:text-white text-sm">${c.marks}</dd>
          </div>
          <div class="rounded-lg bg-gray-50 dark:bg-white/5 py-2">
            <dt class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Credits</dt>
            <dd class="font-bold text-gray-900 dark:text-white text-sm">${esc(c.credits)}</dd>
          </div>
        </dl>

        <p class="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 text-sm font-semibold text-crimson-600 dark:text-crimson-400 flex items-center gap-1.5 mt-auto">
          ${c.units.length ? c.units.length + " units"
            : c.competencies.length ? (c.kind === "Practical" ? "Practical tasks" : "Clinical competencies")
            : "Institution designed"}
          ${topicCount ? `<span class="text-gray-400 dark:text-gray-500 font-normal">&middot; ${topicCount} topics</span>` : ""}
          <svg class="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
        </p>
      </div>
    </article>`;
  }).join("");

  $$(".course-card").forEach((el) => {
    const open = () => openCourse(el.dataset.code);
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

["#course-search", "#filter-sem", "#filter-stream", "#filter-kind"].forEach((sel) => {
  const el = $(sel);
  el.addEventListener(el.tagName === "SELECT" ? "change" : "input", renderCourses);
});

/* ---------- Course detail modal ---------- */
const courseModal = $("#course-modal");
let lastFocused = null;

function openCourse(code) {
  const c = COURSES.find((x) => x.code === code);
  if (!c) return;
  lastFocused = document.activeElement;

  $("#cm-code").textContent = `${c.code} ${c.type}`;
  $("#cm-title").textContent = c.title;
  $("#cm-meta").textContent =
    `${semLabel(c.semester)} · ${c.kind} · ${c.hours} hours · ${c.marks} marks · ${c.credits} credits`;

  let html = "";

  if (c.objectives.length) {
    html += `<section class="mb-8">
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-crimson-600" aria-hidden="true"></span>Objectives
      </h4>
      <ul class="space-y-2">${c.objectives.map((o) => `
        <li class="flex gap-2.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <span class="text-crimson-500 shrink-0 mt-1" aria-hidden="true">&#9656;</span><span>${esc(o)}</span>
        </li>`).join("")}</ul>
    </section>`;
  }

  if (c.units.length) {
    html += `<section class="mb-8">
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-maroon-700" aria-hidden="true"></span>Course Content
      </h4>
      <div class="space-y-3">${c.units.map((u, i) => `
        <details class="group rounded-xl bg-gray-50 dark:bg-white/5 ring-1 ring-gray-100 dark:ring-white/10 overflow-hidden" ${i === 0 ? "open" : ""}>
          <summary class="cursor-pointer list-none px-4 py-3 flex items-center gap-3 font-semibold text-sm text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/5 transition-colors">
            <span class="grid place-items-center w-7 h-7 shrink-0 rounded-lg bg-maroon-700 text-white text-xs font-bold">${i + 1}</span>
            <span class="grow">${esc(u.title)}</span>
            <svg class="w-4 h-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <ul class="px-4 pb-4 pt-1 space-y-1.5 border-t border-gray-100 dark:border-white/5">${u.topics.map((t) => `
            <li class="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span class="text-gray-300 dark:text-gray-600 shrink-0 mt-1" aria-hidden="true">&#9679;</span><span>${esc(t)}</span>
            </li>`).join("")}</ul>
        </details>`).join("")}</div>
    </section>`;
  }

  if (c.competencies.length) {
    html += `<section class="mb-8">
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-navy-700" aria-hidden="true"></span>Expected Competencies
      </h4>
      <div class="space-y-4">${c.competencies.map((k) => `
        <div class="rounded-xl bg-navy-700/5 dark:bg-navy-700/15 ring-1 ring-navy-700/15 p-4">
          <p class="font-bold text-sm text-navy-800 dark:text-navy-100 mb-2">${esc(k.level)}</p>
          <ul class="space-y-1.5">${k.items.map((t) => `
            <li class="flex gap-2.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <span class="text-navy-500 shrink-0 mt-1" aria-hidden="true">&#9679;</span><span>${esc(t)}</span>
            </li>`).join("")}</ul>
        </div>`).join("")}</div>
    </section>`;
  }

  if (c.kind === "Optional Minor") {
    html += `<div class="rounded-xl bg-teal-600/5 ring-1 ring-teal-600/20 p-4 mb-8">
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        Institutions offering the B.ASLP program design the curriculum of the minor optional courses.
        The examination is conducted by the institution, but the marks awarded are entered in the university marks card.
      </p>
    </div>`;
  }

  if (c.reading.length) {
    html += `<section>
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-teal-600" aria-hidden="true"></span>Recommended Reading
      </h4>
      <ol class="space-y-2 list-decimal list-inside">${c.reading.map((r) => `
        <li class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">${esc(r)}</li>`).join("")}</ol>
    </section>`;
  }

  $("#cm-body").innerHTML = html;
  $("#cm-body").scrollTop = 0;
  courseModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("#cm-close").focus();
}

function closeCourse() {
  courseModal.classList.add("hidden");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

$("#cm-close").addEventListener("click", closeCourse);
$("#cm-backdrop").addEventListener("click", closeCourse);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !courseModal.classList.contains("hidden")) closeCourse();
});

/* ---------- Minor optional chips ---------- */
function renderMinors() {
  $("#minor-list").innerHTML = MINOR_OPTIONS.map((m) => `
    <li class="rounded-full bg-white dark:bg-navy-900 ring-1 ring-teal-600/25 px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">${esc(m)}</li>`
  ).join("");
}

/* ============================================================
   EXAM SCHEME & CREDITS
   ============================================================ */
function renderScheme() {
  const pick = $("#scheme-sem").value;
  const blocks = EXAM_SCHEME.filter((s) => pick === "all" || String(s.sem) === pick);

  $("#scheme-tables").innerHTML = blocks.map((s) => `
    <div>
      <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-3">
        ${s.sem === 7 ? "Semesters 7 &amp; 8 (Clinical Internship)" : "Semester " + s.sem}
      </h3>
      <div class="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-200 dark:ring-white/10">
        <table class="w-full min-w-[680px] text-sm text-left">
          <caption class="sr-only">Scheme of examination for semester ${s.sem}</caption>
          <thead class="bg-navy-800 dark:bg-navy-900 text-white text-xs uppercase tracking-wider">
            <tr>
              <th scope="col" class="px-4 py-3">Code</th>
              <th scope="col" class="px-4 py-3">Title of the Paper</th>
              <th scope="col" class="px-4 py-3 text-center">Practical</th>
              <th scope="col" class="px-4 py-3 text-center">IA</th>
              <th scope="col" class="px-4 py-3 text-center">Exam</th>
              <th scope="col" class="px-4 py-3 text-center">Total</th>
              <th scope="col" class="px-4 py-3 text-center">Credits</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-navy-900 divide-y divide-gray-100 dark:divide-white/5">
            ${s.rows.map((r) => `
              <tr class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">${esc(r[0])}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-300">${esc(r[1])}</td>
                <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">${esc(r[2])}</td>
                <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">${esc(r[3])}</td>
                <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">${esc(r[4])}</td>
                <td class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">${esc(r[5])}</td>
                <td class="px-4 py-3 text-center font-bold text-crimson-600 dark:text-crimson-400">${esc(r[6])}</td>
              </tr>`).join("")}
            <tr class="bg-maroon-700/5 dark:bg-maroon-700/15 font-bold">
              <td class="px-4 py-3" colspan="2">Semester Total</td>
              <td class="px-4 py-3 text-center">${esc(s.total[2])}</td>
              <td class="px-4 py-3 text-center">${esc(s.total[3])}</td>
              <td class="px-4 py-3 text-center">${esc(s.total[4])}</td>
              <td class="px-4 py-3 text-center text-gray-900 dark:text-white">${esc(s.total[5])}</td>
              <td class="px-4 py-3 text-center text-crimson-600 dark:text-crimson-400">${esc(s.total[6])}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`).join("") + (pick === "all" ? `
    <div class="rounded-2xl bg-navy-800 dark:bg-navy-950 text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
      <p class="font-bold text-lg">Program Total</p>
      <dl class="flex flex-wrap gap-6 text-sm">
        <div><dt class="text-navy-200">Practical</dt><dd class="font-bold text-xl">${esc(EXAM_GRAND_TOTAL[2])}</dd></div>
        <div><dt class="text-navy-200">IA</dt><dd class="font-bold text-xl">${esc(EXAM_GRAND_TOTAL[3])}</dd></div>
        <div><dt class="text-navy-200">Exam</dt><dd class="font-bold text-xl">${esc(EXAM_GRAND_TOTAL[4])}</dd></div>
        <div><dt class="text-navy-200">Total Marks</dt><dd class="font-bold text-xl">${esc(EXAM_GRAND_TOTAL[5])}</dd></div>
        <div><dt class="text-navy-200">Credits</dt><dd class="font-bold text-xl text-crimson-400">${esc(EXAM_GRAND_TOTAL[6])}</dd></div>
      </dl>
    </div>` : "");
}

$("#scheme-sem").addEventListener("change", renderScheme);

function renderCredits() {
  const max = Math.max(...CREDIT_STRUCTURE.map((c) => c.credits));
  $("#credit-list").innerHTML = CREDIT_STRUCTURE.map((c) => `
    <li>
      <div class="flex items-center justify-between gap-3 text-sm">
        <span class="text-gray-700 dark:text-gray-300">${esc(c.label)}</span>
        <span class="font-bold text-gray-900 dark:text-white shrink-0">${c.credits}</span>
      </div>
      <div class="mt-1.5 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <div class="h-full rounded-full bg-maroon-700" style="width:${(c.credits / max) * 100}%"></div>
      </div>
    </li>`).join("") + `
    <li class="pt-3 mt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
      <span class="font-bold text-gray-900 dark:text-white">Total</span>
      <span class="font-black text-2xl text-crimson-600 dark:text-crimson-400">160</span>
    </li>`;
}

/* ============================================================
   TIMETABLE
   ============================================================ */
const SLOT_STYLE = {
  slp:      "bg-maroon-700/10 dark:bg-maroon-700/20 border-l-4 border-maroon-700",
  aud:      "bg-navy-700/10 dark:bg-navy-700/20 border-l-4 border-navy-700",
  clinical: "bg-crimson-600/10 dark:bg-crimson-600/20 border-l-4 border-crimson-600",
  allied:   "bg-teal-600/10 dark:bg-teal-600/20 border-l-4 border-teal-600",
  self:     "bg-gray-100 dark:bg-white/5 border-l-4 border-gray-300 dark:border-white/20",
  mentor:   "bg-maroon-600/10 dark:bg-maroon-600/20 border-l-4 border-maroon-500",
  reserved: "bg-gray-50 dark:bg-white/[0.03] border-l-4 border-gray-200 dark:border-white/10"
};

function renderTimetable() {
  const m = TIMETABLE.meta;
  $("#timetable-meta").textContent =
    `${m.title} · Batch ${m.batch} · Academic year ${m.year} · ${m.timings} · Lunch ${m.lunch}`;

  $("#timetable-head").innerHTML =
    '<th scope="col" class="px-4 py-3.5 sticky left-0 bg-navy-800 dark:bg-navy-900">Day</th>' +
    TIMETABLE.slots.map((s, i) =>
      `<th scope="col" class="px-4 py-3.5 whitespace-nowrap">${esc(s)}</th>` +
      (i === 3 ? '<th scope="col" class="px-3 py-3.5 text-center bg-navy-900">Lunch</th>' : "")
    ).join("");

  const day = $("#tt-day").value;
  const days = TIMETABLE.days.filter((d) => day === "all" || d.day === day);

  $("#timetable-body").innerHTML = days.map((d) => `
    <tr>
      <th scope="row" class="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap align-top sticky left-0 bg-white dark:bg-navy-900 text-left">${esc(d.day)}</th>
      ${d.periods.map((p, i) => `
        <td class="px-2 py-2 align-top">
          <div class="rounded-lg px-3 py-2.5 h-full ${SLOT_STYLE[p.kind] || SLOT_STYLE.self}">
            <p class="font-semibold text-gray-900 dark:text-white text-[13px] leading-snug">${esc(p.subject)}</p>
            ${p.faculty ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${esc(p.faculty)}</p>` : ""}
          </div>
        </td>
        ${i === 3 ? '<td class="px-2 py-2 text-center align-middle bg-gray-50 dark:bg-white/5"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 [writing-mode:vertical-rl] rotate-180">Lunch</span></td>' : ""}
      `).join("")}
    </tr>`).join("");

  const notes = TIMETABLE.notes || [];
  const nl = $("#timetable-notes");
  if (nl) nl.innerHTML = notes.map((n) => `<li>${esc(n)}</li>`).join("");
}

$("#tt-day").addEventListener("change", renderTimetable);
$("#student-search").addEventListener("input", renderBatch);

/* ============================================================
   COLLEGE BUS / TRANSPORT
   ============================================================ */
function renderTransport() {
  const t = TRANSPORT;
  $("#transport-route").textContent =
    `Bus service between ${t.hostel} and the ${t.campus}. Timings are aligned to the ${TIMETABLE.meta.timings} class schedule.`;

  // Full class strings (not built by interpolation) so Tailwind always resolves them
  const DIR_STYLE = {
    "to-campus": { bar: "bg-maroon-700", chip: "bg-maroon-700/10 text-maroon-700 dark:text-maroon-300",
                   arrow: "M5 12h14m-6-6 6 6-6 6" },
    "to-hostel": { bar: "bg-navy-700",   chip: "bg-navy-700/10 text-navy-700 dark:text-navy-300",
                   arrow: "M19 12H5m6 6-6-6 6-6" }
  };

  $("#transport-grid").innerHTML = t.routes.map((r) => {
    const d = DIR_STYLE[r.direction] || DIR_STYLE["to-campus"];
    return `
    <article class="flex flex-col bg-gray-50 dark:bg-navy-900 rounded-2xl ring-1 ring-gray-100 dark:ring-white/10 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
      <div class="h-1.5 ${d.bar}" aria-hidden="true"></div>
      <div class="p-6 flex flex-col grow">
        <div class="flex items-center justify-between gap-3">
          <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${d.chip}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="${d.arrow}"/></svg>
            ${esc(r.label)}
          </span>
          <span class="grid place-items-center w-9 h-9 rounded-lg ${d.chip}" aria-hidden="true">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M4 16h16M4 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2m10 0v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M6 8h12M7 12h.01M17 12h.01"/></svg>
          </span>
        </div>

        <p class="mt-4 font-black text-4xl text-gray-900 dark:text-white tracking-tight">${esc(r.time)}</p>

        <div class="mt-4 space-y-2 text-sm">
          <p class="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-10 shrink-0 mt-1">From</span>
            <span class="font-medium">${esc(r.from)}</span>
          </p>
          <p class="flex items-start gap-2 text-gray-600 dark:text-gray-300">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-10 shrink-0 mt-1">To</span>
            <span class="font-medium">${esc(r.to)}</span>
          </p>
        </div>

        <p class="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-auto">${esc(r.note)}</p>
      </div>
    </article>`;
  }).join("");
}

/* ============================================================
   ACADEMIC CALENDAR - tabbed
   ============================================================ */
function renderCalendar() {
  $("#calendar-tabs").innerHTML = CALENDAR.map((c, i) => `
    <button role="tab" data-tab="${i}" aria-selected="${i === 0}" aria-controls="cal-panel-${i}"
            class="cal-tab rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${i === 0
              ? "bg-maroon-700 text-white shadow"
              : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"}">
      ${esc(c.sem.split(":")[0])}
    </button>`).join("");

  $("#calendar-panels").innerHTML = CALENDAR.map((c, i) => `
    <div id="cal-panel-${i}" role="tabpanel" class="cal-panel ${i === 0 ? "" : "hidden"}">
      <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">${esc(c.sem)}</p>
      <div class="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-200 dark:ring-white/10">
        <table class="w-full min-w-[640px] text-sm text-left">
          <caption class="sr-only">${esc(c.sem)} week by week schedule</caption>
          <thead class="bg-navy-800 dark:bg-navy-900 text-white text-xs uppercase tracking-wider">
            <tr>
              <th scope="col" class="px-4 py-3">Week</th>
              <th scope="col" class="px-4 py-3">Dates</th>
              <th scope="col" class="px-4 py-3">Activity Focus</th>
              <th scope="col" class="px-4 py-3">Key Milestones / Holidays</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-navy-900 divide-y divide-gray-100 dark:divide-white/5">
            ${c.weeks.map((w) => {
              const exam = /Exam|Assessment|Study Leave/i.test(w[2]);
              return `
              <tr class="${exam ? "bg-crimson-600/5 dark:bg-crimson-600/10" : "hover:bg-gray-50 dark:hover:bg-white/5"} transition-colors">
                <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">${esc(w[0])}</td>
                <td class="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">${esc(w[1])}</td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-200 font-medium">${esc(w[2])}</td>
                <td class="px-4 py-3 text-gray-500 dark:text-gray-400">${w[3] ? esc(w[3]) : "&mdash;"}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>`).join("");

  $$(".cal-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.tab;
      $$(".cal-tab").forEach((b) => {
        const on = b.dataset.tab === idx;
        b.setAttribute("aria-selected", String(on));
        b.className = "cal-tab rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors " + (on
          ? "bg-maroon-700 text-white shadow"
          : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10");
      });
      $$(".cal-panel").forEach((p, i) => p.classList.toggle("hidden", String(i) !== idx));
    });
  });

  $("#calendar-notes").innerHTML = CALENDAR_NOTES.map((n) => `
    <li class="flex gap-2.5">
      <span class="text-crimson-600 shrink-0 mt-1" aria-hidden="true">&#9656;</span><span>${esc(n)}</span>
    </li>`).join("");
}

/* ============================================================
   REGULATIONS - accordion
   ============================================================ */
function renderRegulations() {
  $("#regulations-accordion").innerHTML = REGULATIONS.map((r, i) => `
    <div class="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-gray-100 dark:ring-white/10 overflow-hidden">
      <button class="accordion-toggle w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-maroon-50 dark:hover:bg-white/5 transition-colors"
              aria-expanded="false" aria-controls="reg-body-${i}" id="reg-btn-${i}">
        <span class="flex items-center gap-3">
          <span class="grid place-items-center min-w-[3rem] h-8 px-2 shrink-0 rounded-lg bg-maroon-700/10 text-maroon-700 dark:text-maroon-300 text-xs font-bold">${esc(r.no)}</span>
          ${esc(r.title)}
        </span>
        <svg class="chevron w-5 h-5 shrink-0 text-maroon-700 dark:text-maroon-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="accordion-body" id="reg-body-${i}" role="region" aria-labelledby="reg-btn-${i}">
        <div>
          <p class="px-5 sm:px-6 pb-5 pt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5">${esc(r.body)}</p>
        </div>
      </div>
    </div>`).join("");

  wireAccordion("#regulations-accordion");
}

// Shared accordion behaviour: only one panel open at a time
function wireAccordion(scope) {
  $$(".accordion-toggle", $(scope)).forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = $("#" + btn.getAttribute("aria-controls"));
      const isOpen = body.classList.contains("open");
      $$(".accordion-body.open", $(scope)).forEach((b) => b.classList.remove("open"));
      $$(".accordion-toggle", $(scope)).forEach((b) => b.setAttribute("aria-expanded", "false"));
      if (!isOpen) {
        body.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ============================================================
   CODE OF CONDUCT
   ============================================================ */
const CONDUCT_ICONS = {
  star:        '<path d="m12 2 2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.3 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5L12 2z"/>',
  check:       '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  stethoscope: '<path d="M11 2v4m2-4v4M8 6h8v5a4 4 0 0 1-8 0V6zm4 9v3a4 4 0 0 0 8 0v-2"/><circle cx="20" cy="14" r="2"/>',
  coat:        '<path d="M9 2 5 4v18h14V4l-4-2-3 4-3-4zM12 6v10"/>',
  building:    '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',
  scale:       '<path d="M12 3v18M8 21h8M3 7h18M6 7l-3 6a3 3 0 0 0 6 0L6 7zm12 0-3 6a3 3 0 0 0 6 0l-3-6z"/>'
};

function renderConduct() {
  $("#conduct-grid").innerHTML = CONDUCT.map((s) => `
    <article class="bg-white/[0.06] backdrop-blur rounded-2xl ring-1 ring-white/10 p-6 hover:bg-white/10 hover:ring-crimson-500/50 transition-all">
      <div class="flex items-center gap-3 mb-4">
        <span class="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-crimson-600/20 text-crimson-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">${CONDUCT_ICONS[s.icon] || CONDUCT_ICONS.star}</svg>
        </span>
        <h3 class="font-bold text-white leading-snug">${esc(s.title)}</h3>
      </div>
      <ul class="space-y-2.5">${s.items.map((it) => `
        <li class="flex gap-2.5 text-sm text-navy-100/75 leading-relaxed">
          <span class="text-crimson-400 shrink-0 mt-1" aria-hidden="true">&#9656;</span><span>${esc(it)}</span>
        </li>`).join("")}</ul>
    </article>`).join("");
}

/* ============================================================
   INTERNSHIP
   ============================================================ */
function renderInternship() {
  $("#internship-objectives").innerHTML = INTERNSHIP.objectives.map((o) => `
    <li class="flex gap-3">
      <span class="text-crimson-300 shrink-0" aria-hidden="true">&#9679;</span><span>${esc(o)}</span>
    </li>`).join("");

  $("#internship-guidelines").innerHTML = INTERNSHIP.guidelines.map((g, i) => `
    <div class="bg-white dark:bg-navy-900 rounded-xl shadow-sm ring-1 ring-gray-100 dark:ring-white/10 overflow-hidden">
      <button class="accordion-toggle w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-maroon-50 dark:hover:bg-white/5 transition-colors"
              aria-expanded="false" aria-controls="int-body-${i}" id="int-btn-${i}">
        <span class="flex items-center gap-3">
          <span class="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-navy-700/10 text-navy-700 dark:text-navy-300 text-sm font-bold">${i + 1}</span>
          ${esc(g.title)}
        </span>
        <svg class="chevron w-5 h-5 shrink-0 text-navy-700 dark:text-navy-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="accordion-body" id="int-body-${i}" role="region" aria-labelledby="int-btn-${i}">
        <div>
          <p class="px-5 pb-5 pt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5">${esc(g.body)}</p>
        </div>
      </div>
    </div>`).join("");

  wireAccordion("#internship-guidelines");
}

/* ============================================================
   OUR BATCH
   ------------------------------------------------------------
   Student NAMES ONLY. Campus IDs, contact details, marks, hostel
   rooms and fee status are intentionally not published here -
   this site is publicly reachable. Please keep it that way.
   ============================================================ */
const AVATAR_TINTS = [
  "bg-maroon-700/10 text-maroon-700 dark:bg-maroon-300/15 dark:text-maroon-300",
  "bg-navy-700/10 text-navy-700 dark:bg-navy-300/15 dark:text-navy-300",
  "bg-teal-600/10 text-teal-600 dark:bg-teal-500/15 dark:text-teal-500",
  "bg-crimson-600/10 text-crimson-600 dark:bg-crimson-400/15 dark:text-crimson-400"
];

function renderBatch() {
  $("#batch-intro").textContent =
    `${BATCH.strength} students of ${BATCH.name}, the B.ASLP first-year batch of ${BATCH.year}. ` +
    `Listed in class register order.`;
  $("#batch-strength").textContent = BATCH.strength;
  $("#batch-hostellers").textContent = BATCH.hostellers;
  $("#batch-day").textContent = BATCH.day_scholars;

  const q = $("#student-search").value.trim().toLowerCase();
  const rows = BATCH.students
    .map((name, i) => ({ name, no: i + 1 }))
    .filter((s) => !q || s.name.toLowerCase().includes(q));

  $("#batch-empty").classList.toggle("hidden", rows.length > 0);
  $("#batch-grid").innerHTML = rows.map((s) => {
    const initials = s.name.split(/\s+/).filter((w) => w.length > 1)
                       .slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    return `
    <li class="flex items-center gap-3 bg-white dark:bg-navy-900 rounded-xl ring-1 ring-gray-100 dark:ring-white/10 px-4 py-3 hover:ring-maroon-600/40 hover:shadow-md transition-all">
      <span class="grid place-items-center w-10 h-10 shrink-0 rounded-full font-bold text-sm ${AVATAR_TINTS[(s.no - 1) % AVATAR_TINTS.length]}" aria-hidden="true">${esc(initials)}</span>
      <span class="min-w-0">
        <span class="block font-semibold text-gray-900 dark:text-white text-sm leading-snug truncate">${esc(s.name)}</span>
        <span class="block text-[11px] text-gray-400 dark:text-gray-500">Roll ${s.no}</span>
      </span>
    </li>`;
  }).join("");
}

/* ============================================================
   DOCUMENTS
   ============================================================ */
function renderDocs() {
  $("#docs-grid").innerHTML = DOCS.map((d) => `
    <article class="flex flex-col bg-gray-50 dark:bg-navy-900 rounded-2xl ring-1 ring-gray-100 dark:ring-white/10 p-6 hover:ring-maroon-600/40 hover:shadow-lg transition-all">
      <span class="grid place-items-center w-11 h-11 rounded-xl bg-crimson-600/10 text-crimson-600 mb-4" aria-hidden="true">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
      </span>
      <h3 class="font-bold text-gray-900 dark:text-white leading-snug">${esc(d.title)}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${esc(d.issuer)}</p>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-2 grow">${esc(d.note)}</p>
      <a href="assets/docs/${encodeURIComponent(d.file)}" download
         class="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold py-2.5 transition-colors"
         aria-label="Download ${esc(d.title)}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4m-4 8h16"/></svg>
        Download PDF
      </a>
    </article>`).join("");
}

/* ============================================================
   FACULTY
   ============================================================ */
const initialsOf = (name) => name
  .replace(/^(Dr|Mr|Ms|Mrs)\.?\s*/i, "")
  .split(/\s+/).slice(0, 2)
  .map((w) => w[0]).join("").toUpperCase();

function renderFaculty() {
  // Preserve the order the groups appear in the data
  const groups = [];
  FACULTY.forEach((f) => {
    let g = groups.find((x) => x.name === f.group);
    if (!g) groups.push((g = { name: f.group, people: [] }));
    g.people.push(f);
  });

  $("#faculty-grid").innerHTML = groups.map((g) => `
    <div class="mb-10 last:mb-0">
      <div class="flex items-center gap-3 mb-5">
        <h3 class="font-bold text-white text-lg">${esc(g.name)}</h3>
        <span class="rounded-full bg-white/15 text-maroon-100 text-xs font-bold px-2.5 py-1">${g.people.length}</span>
        <span class="h-px grow bg-white/15" aria-hidden="true"></span>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        ${g.people.map((f) => `
          <article class="faculty-card group flex flex-col text-left bg-white/[0.08] backdrop-blur rounded-2xl ring-1 ring-white/15 p-5 hover:bg-white/[0.14] hover:ring-crimson-400/50 hover:-translate-y-1 transition-all cursor-pointer"
                   data-name="${esc(f.name)}" tabindex="0" role="button"
                   aria-label="View profile of ${esc(f.name)}">
            <div class="flex items-start gap-3">
              <span class="grid place-items-center w-12 h-12 shrink-0 rounded-full bg-white text-maroon-700 font-bold text-sm group-hover:scale-105 transition-transform" aria-hidden="true">${esc(initialsOf(f.name))}</span>
              <div class="min-w-0">
                <h4 class="font-bold text-white text-sm leading-snug">${esc(f.name)}</h4>
                <p class="text-xs text-crimson-300 font-medium mt-0.5">${esc(f.designation)}</p>
              </div>
            </div>
            ${f.credentials ? `<p class="mt-3 text-[11px] font-semibold text-maroon-100/80 tracking-wide">${esc(f.credentials)}</p>` : ""}
            <div class="mt-3 flex flex-wrap gap-1.5">
              ${f.focus.slice(0, 3).map((x) => `<span class="rounded-full bg-white/10 text-maroon-50/80 text-[10px] font-medium px-2 py-0.5">${esc(x)}</span>`).join("")}
              ${f.focus.length > 3 ? `<span class="text-[10px] text-maroon-200/70 px-1 py-0.5">+${f.focus.length - 3}</span>` : ""}
            </div>
            <p class="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-crimson-300 flex items-center gap-1.5 mt-auto">
              View profile
              <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </p>
          </article>`).join("")}
      </div>
    </div>`).join("");

  $$(".faculty-card").forEach((el) => {
    const open = () => openFaculty(el.dataset.name);
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

/* ---------- Faculty profile modal (reuses the course modal shell) ---------- */
function openFaculty(name) {
  const f = FACULTY.find((x) => x.name === name);
  if (!f) return;
  lastFocused = document.activeElement;

  $("#cm-code").textContent = f.group;
  $("#cm-title").textContent = f.name;
  $("#cm-meta").textContent = f.credentials
    ? `${f.designation} · ${f.credentials}`
    : f.designation;

  let html = `
    <section class="mb-8">
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-crimson-600" aria-hidden="true"></span>Profile
      </h4>
      <ul class="space-y-2">${f.points.map((p) => `
        <li class="flex gap-2.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <span class="text-crimson-500 shrink-0 mt-1" aria-hidden="true">&#9656;</span><span>${esc(p)}</span>
        </li>`).join("")}</ul>
    </section>`;

  if (f.teaches) {
    html += `
    <section class="mb-8">
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-maroon-700" aria-hidden="true"></span>Where you will meet them
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed rounded-xl bg-gray-50 dark:bg-white/5 ring-1 ring-gray-100 dark:ring-white/10 px-4 py-3">${esc(f.teaches)}</p>
    </section>`;
  }

  html += `
    <section>
      <h4 class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-1.5 h-5 rounded bg-teal-600" aria-hidden="true"></span>Areas of Focus
      </h4>
      <ul class="flex flex-wrap gap-2">${f.focus.map((x) => `
        <li class="rounded-full bg-teal-600/10 ring-1 ring-teal-600/25 text-gray-700 dark:text-gray-300 text-sm font-medium px-3.5 py-1.5">${esc(x)}</li>`).join("")}</ul>
    </section>`;

  $("#cm-body").innerHTML = html;
  $("#cm-body").scrollTop = 0;
  courseModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("#cm-close").focus();
}

/* ---------- Department profile ---------- */
function renderDepartment() {
  const d = DEPARTMENT;
  $("#dept-glance").textContent = d.glance;
  $("#dept-milestones").innerHTML = d.milestones.map((m) => `
    <div class="rounded-2xl bg-white/[0.07] ring-1 ring-white/15 p-5">
      <p class="text-3xl font-black text-white">${esc(m.value)}</p>
      <p class="mt-1.5 text-xs text-maroon-100/75 leading-relaxed">${esc(m.label)}</p>
    </div>`).join("");

  $$("[data-dept-email]").forEach((el) => {
    el.textContent = d.email;
    el.setAttribute("href", "mailto:" + d.email);
  });
  $$("[data-dept-phone]").forEach((el) => {
    el.textContent = d.phone;
    el.setAttribute("href", "tel:" + d.phone.replace(/[^\d+]/g, ""));
  });
  $$("[data-dept-hours]").forEach((el) => { el.textContent = d.hours; });
  $$("[data-dept-address]").forEach((el) => { el.textContent = d.address; });
}

/* ============================================================
   IA RESULTS - class analytics plus the student marks list
   (Names / Roll No. view), published at the class coordinator's direction.
   ============================================================ */
const RESULT_BANDS = ["Below 50%", "Second class", "First class", "Distinction"];
const RESULT_BAND_STYLE = {
  "Below 50%":    "bg-navy-200 text-navy-950 dark:bg-navy-800 dark:text-white",
  "Second class": "bg-navy-400 text-navy-950 dark:bg-navy-600 dark:text-white",
  "First class":  "bg-navy-600 text-white dark:bg-navy-400 dark:text-navy-950",
  "Distinction":  "bg-navy-800 text-white dark:bg-navy-200 dark:text-navy-950"
};

function renderResults() {
  if (typeof ASSESSMENT === "undefined") return;
  const A = ASSESSMENT;
  const rows = [...A.papers, A.combined];
  $("#results-kicker").textContent = `${A.title} · ${A.dates}`;
  $("#results-intro").textContent = A.intro;
  $("#results-kpis").innerHTML = A.kpis.map((k) => `
    <div class="rounded-2xl bg-white dark:bg-navy-900 ring-1 ring-gray-100 dark:ring-white/10 p-5 shadow-sm">
      <p class="text-xs text-gray-500 dark:text-gray-400">${esc(k.label)}</p>
      <p class="text-3xl font-black text-maroon-700 dark:text-maroon-300 mt-1">${esc(k.value)}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${esc(k.sub)}</p>
    </div>`).join("");
  $("#results-averages").innerHTML = rows.map((p) => `
    <div>
      <div class="flex justify-between gap-3 text-sm">
        <span class="font-semibold text-gray-900 dark:text-white">${esc(p.name)}</span>
        <span class="text-gray-700 dark:text-gray-300 tabular-nums">${p.mean_pct.toFixed(1)}%</span>
      </div>
      <div class="relative mt-1.5 h-3 rounded-full bg-gray-100 dark:bg-white/10" role="img" aria-label="${esc(p.name)}: class average ${p.mean_pct.toFixed(1)} percent">
        <div class="h-3 rounded-full ${p.key === "T" ? "bg-maroon-700 dark:bg-maroon-400" : "bg-navy-700 dark:bg-navy-300"}" style="width:${p.mean_pct}%"></div>
        <span class="absolute -top-1 -bottom-1 w-0.5 bg-crimson-600" style="left:50%" aria-hidden="true"></span>
      </div>
      <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Mean ${p.mean.toFixed(2)} of ${p.max} · median ${p.median} · range ${p.min}–${p.max_mark}</p>
    </div>`).join("");
  $("#results-legend").innerHTML = [...RESULT_BANDS].reverse().map((b) =>
    `<span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm ${RESULT_BAND_STYLE[b]}"></span>${esc(b)}</span>`).join("");
  $("#results-bands").innerHTML = rows.map((p) => {
    const segs = RESULT_BANDS.filter((b) => p.bands[b] > 0);
    const label = RESULT_BANDS.map((b) => `${b} ${p.bands[b]}`).join(", ");
    return `
    <div>
      <p class="text-sm font-semibold text-gray-900 dark:text-white">${esc(p.name)}</p>
      <div class="mt-1.5 flex gap-0.5 h-6 rounded-md overflow-hidden" role="img" aria-label="${esc(p.name)}: ${esc(label)}">
        ${segs.map((b) => `<div class="${RESULT_BAND_STYLE[b]} grid place-items-center text-[11px] font-bold" style="width:${(p.bands[b] / A.students) * 100}%" title="${esc(b)}: ${p.bands[b]}">${p.bands[b]}</div>`).join("")}
      </div>
    </div>`;
  }).join("");
  $("#results-highlights").innerHTML = A.highlights.map((h) => `
    <li class="flex gap-2.5"><span class="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-crimson-600" aria-hidden="true"></span><span>${esc(h)}</span></li>`).join("");
  $("#results-download").href = "assets/docs/" + encodeURIComponent(A.report);
  $("#results-note").textContent = A.note;
  renderMarksTable();
}

/* Student marks table: switch between Names and Roll No. only, and filter. */
let marksView = "name";
try { marksView = localStorage.getItem("baslp-marks-view") || "name"; } catch (e) {}
function renderMarksTable() {
  const A = ASSESSMENT;
  if (!A.marks || !$("#results-marks")) return;
  const q = ($("#results-marks-search").value || "").trim().toLowerCase();
  const showName = marksView === "name";
  $$("[data-marks-namecol]").forEach((el) => el.classList.toggle("hidden", !showName));
  $$("[data-marks-view]").forEach((b) => {
    const on = b.dataset.marksView === marksView;
    b.setAttribute("aria-pressed", on);
    b.className = "px-3 py-1.5 " + (on ? "bg-maroon-700 text-white" : "bg-white dark:bg-navy-950 text-gray-700 dark:text-gray-300");
  });
  const cell = (v) => `<td class="px-3 py-2 text-right tabular-nums ${v < 12.5 ? "text-crimson-600 dark:text-crimson-400 font-bold" : "text-gray-800 dark:text-gray-100"}">${v}${v < 12.5 ? " ▲" : ""}</td>`;
  const list = A.marks.filter((m) => !q || m.roll.toLowerCase().includes(q) || (showName && m.name.toLowerCase().includes(q)));
  $("#results-marks").innerHTML = list.map((m) => `
    <tr class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <td class="px-3 py-2 font-semibold text-gray-900 dark:text-white tabular-nums">${m.rank}</td>
      <td class="px-3 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">${esc(m.roll)}</td>
      ${showName ? `<td class="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap">${esc(m.name)}</td>` : ""}
      ${cell(m.H)}${cell(m.S)}${cell(m.I)}${cell(m.A)}
      <td class="px-3 py-2 text-right font-bold tabular-nums text-maroon-700 dark:text-maroon-300">${m.total}</td>
      <td class="px-3 py-2"><span class="inline-block rounded px-2 py-0.5 text-[11px] font-bold ${RESULT_BAND_STYLE[m.band]}">${esc(m.band)}</span></td>
    </tr>`).join("") || `<tr><td colspan="9" class="px-3 py-4 text-center text-gray-500">No matching student.</td></tr>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-marks-view]");
  if (!b) return;
  marksView = b.dataset.marksView;
  try { localStorage.setItem("baslp-marks-view", marksView); } catch (err) {}
  renderMarksTable();
});
document.addEventListener("input", (e) => { if (e.target.id === "results-marks-search") renderMarksTable(); });

/* ============================================================
   ATTENDANCE - class-level summary only. Individual figures are not
   rendered on this page; the named class report is only in the
   downloadable PDF (published at the class coordinator's direction).
   ============================================================ */
function renderAttendance() {
  if (typeof ATTENDANCE === "undefined") return;
  const T = ATTENDANCE;
  $("#attendance-kicker").textContent = `${T.title} · ${T.period}`;
  $("#attendance-intro").textContent = T.intro;
  $("#attendance-kpis").innerHTML = T.kpis.map((k) => `
    <div class="rounded-2xl bg-white dark:bg-navy-900 ring-1 ring-gray-100 dark:ring-white/10 p-5 shadow-sm">
      <p class="text-xs text-gray-500 dark:text-gray-400">${esc(k.label)}</p>
      <p class="text-3xl font-black text-maroon-700 dark:text-maroon-300 mt-1">${esc(k.value)}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${esc(k.sub)}</p>
    </div>`).join("");
  $("#attendance-courses").innerHTML = T.courses.map((c) => `
    <div>
      <div class="flex justify-between gap-3 text-sm">
        <span class="font-semibold text-gray-900 dark:text-white">${esc(c.name)}${c.provisional ? " †" : ""}</span>
        <span class="text-gray-700 dark:text-gray-300 tabular-nums">${c.class_avg.toFixed(1)}%</span>
      </div>
      <div class="relative mt-1.5 h-3 rounded-full bg-gray-100 dark:bg-white/10" role="img" aria-label="${esc(c.name)}: class attendance ${c.class_avg.toFixed(1)} percent, minimum ${c.minimum} percent">
        <div class="h-3 rounded-full ${c.class_avg < c.minimum ? "bg-crimson-600" : "bg-navy-700 dark:bg-navy-300"}" style="width:${c.class_avg}%"></div>
        <span class="absolute -top-1 -bottom-1 w-0.5 bg-gray-900 dark:bg-white" style="left:${c.minimum}%" aria-hidden="true"></span>
      </div>
      <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">${esc(c.category)} · minimum ${c.minimum}% · ${c.sessions} sessions, ${c.hours} hours</p>
    </div>`).join("");
  $("#attendance-short").innerHTML = T.courses.map((c) => {
    const ok = T.students - c.below - c.borderline;
    const seg = (n, cls, label) => n > 0 ? `<div class="${cls} grid place-items-center text-[11px] font-bold" style="width:${(n / T.students) * 100}%" title="${label}: ${n}">${n}</div>` : "";
    return `
    <div>
      <p class="text-sm font-semibold text-gray-900 dark:text-white">${esc(c.name)}${c.provisional ? " †" : ""}</p>
      <div class="mt-1.5 flex gap-0.5 h-6 rounded-md overflow-hidden" role="img" aria-label="${esc(c.name)}: ${c.below} below the minimum, ${c.borderline} within 5 points, ${ok} above">
        ${seg(c.below, "bg-crimson-600 text-white", "Below the minimum")}${seg(c.borderline, "bg-amber-400 text-gray-900", "Within 5 points")}${seg(ok, "bg-navy-200 text-navy-950 dark:bg-navy-700 dark:text-white", "Above")}
      </div>
    </div>`;
  }).join("");
  $("#attendance-highlights").innerHTML = T.highlights.map((h) => `
    <li class="flex gap-2.5"><span class="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-crimson-600" aria-hidden="true"></span><span>${esc(h)}</span></li>`).join("");
  $("#attendance-download").href = "assets/docs/" + encodeURIComponent(T.report);
  $("#attendance-note").textContent = T.note;
}

/* ============================================================
   2ND INTERNAL ASSESSMENT TIMETABLE (shown in the IA section)
   ============================================================ */
function renderIASchedule() {
  if (typeof IA2_SCHEDULE === "undefined") return;
  const I = IA2_SCHEDULE;
  const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  $("#ia2-title").textContent = `${I.title} · ${I.semester}`;
  $("#ia2-sub").textContent = `${I.dates} · ${I.time}`;
  $("#ia2-rows").innerHTML = I.papers.map((p) => `
    <tr class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <td class="px-4 py-2.5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">${esc(fmt(p.date))}</td>
      <td class="px-4 py-2.5 text-gray-600 dark:text-gray-300">${esc(p.day)}</td>
      <td class="px-4 py-2.5 text-gray-800 dark:text-gray-100 font-medium">${esc(p.paper)}</td>
    </tr>`).join("");
  $("#ia2-note").textContent = `${I.note} Issued by the ${I.issued_by}.`;
}

/* ============================================================
   GLOBAL SEARCH
   ============================================================ */
function buildSearchIndex() {
  const idx = [];

  COURSES.forEach((c) => {
    idx.push({
      section: "Syllabus", anchor: "#syllabus", course: c.code,
      title: `${c.code} ${c.title}`,
      text: [semLabel(c.semester), c.kind, c.stream, ...c.objectives,
             ...c.units.flatMap((u) => [u.title, ...u.topics]),
             ...c.competencies.flatMap((k) => k.items)].join(" ")
    });
    // Index each unit separately so topic-level searches land on the right paper
    c.units.forEach((u) => idx.push({
      section: "Course content", anchor: "#syllabus", course: c.code,
      title: `${u.title} - ${c.code}`, text: u.topics.join(" ")
    }));
  });

  REGULATIONS.forEach((r) => idx.push({
    section: "Regulations", anchor: "#regulations",
    title: `${r.no} ${r.title}`, text: r.body
  }));
  CONDUCT.forEach((s) => idx.push({
    section: "Code of Conduct", anchor: "#conduct",
    title: s.title, text: s.items.join(" ")
  }));
  INTERNSHIP.guidelines.forEach((g) => idx.push({
    section: "Internship", anchor: "#internship",
    title: g.title, text: g.body
  }));
  CALENDAR.forEach((c) => c.weeks.forEach((w) => idx.push({
    section: "Calendar", anchor: "#calendar",
    title: `${w[0]} ${w[1]} - ${w[2]}`, text: w[3]
  })));
  TIMETABLE.days.forEach((d) => d.periods.forEach((p, i) => idx.push({
    section: "Timetable", anchor: "#timetable",
    title: `${p.subject} - ${d.day}`,
    text: `${TIMETABLE.slots[i] || ""} ${p.faculty}`
  })));
  TRANSPORT.routes.forEach((r) => idx.push({
    section: "College Bus", anchor: "#transport",
    title: `${r.label} - ${r.time}`,
    text: `bus shuttle hostel campus ${r.from} ${r.to} ${r.note}`
  }));
  NOTICES.forEach((nx) => idx.push({
    section: "Notice", anchor: nx.tag === "QUEST" || nx.tag === "EXAMS" ? "#roadmap" : "#home",
    title: nx.text, text: nx.tag
  }));
  if (typeof STUDY_PLAN !== "undefined") {
    idx.push({
      section: "Exam Quest", anchor: "#roadmap",
      title: "December 2026 self-study quest",
      text: "exam roadmap study plan 11 December theory semester I III V tick pdf"
    });
    STUDY_PLAN.campaigns.forEach((camp) => {
      camp.levels.forEach((lv) => idx.push({
        section: "Exam Quest", anchor: "#roadmap",
        title: `${camp.short} · ${lv.label} · ${lv.paper}`,
        text: `${lv.title} ${lv.focus.join(" ")} ${lv.recall}`
      }));
    });
  }
  BATCH.students.forEach((n, i) => idx.push({
    section: "Our Batch", anchor: "#batch",
    title: n, text: `student batch roll ${i + 1} ${BATCH.name}`
  }));
  FACULTY.forEach((f) => idx.push({
    section: f.group, anchor: "#contact", person: f.name,
    title: `${f.name} - ${f.designation}`,
    text: [f.credentials, f.teaches, ...f.points, ...f.focus].join(" ")
  }));
  DOCS.forEach((d) => idx.push({
    section: "Documents", anchor: "#documents",
    title: d.title, text: `${d.issuer} ${d.note}`
  }));

  if (typeof ASSESSMENT !== "undefined") {
    idx.push({ section: "IA Results", anchor: "#results", title: "1st IA results - all four papers",
               text: `internal assessment marks results grade bands ${ASSESSMENT.intro}` });
    ASSESSMENT.highlights.forEach((h) => idx.push({ section: "IA Results", anchor: "#results", title: h, text: "IA results" }));
  }
  if (typeof IA2_SCHEDULE !== "undefined") {
    idx.push({ section: "IA Results", anchor: "#ia2", title: "2nd Internal Assessment timetable (2-7 November 2026)",
               text: `internal assessment exam timetable schedule ${IA2_SCHEDULE.papers.map((p) => p.paper).join(" ")}` });
  }
  if (typeof ATTENDANCE !== "undefined") {
    idx.push({ section: "Attendance", anchor: "#attendance", title: "Class attendance - summary",
               text: `attendance shortage minimum 80% 90% hours ${ATTENDANCE.intro}` });
    ATTENDANCE.highlights.forEach((h) => idx.push({ section: "Attendance", anchor: "#attendance", title: h, text: "attendance" }));
  }

  return idx;
}
const SEARCH_INDEX = buildSearchIndex();

const SECTION_DOTS = {
  "Syllabus": "bg-maroon-700", "Course content": "bg-maroon-500",
  "Regulations": "bg-navy-700", "Code of Conduct": "bg-crimson-600",
  "Internship": "bg-teal-600", "Calendar": "bg-navy-500",
  "Timetable": "bg-navy-800", "Faculty": "bg-maroon-600", "Documents": "bg-teal-700",
  "College Bus": "bg-crimson-500",
  "Teaching Faculty": "bg-maroon-600", "Clinical Supervisors": "bg-navy-600",
  "Support Staff": "bg-teal-600", "Our Batch": "bg-maroon-500", "Notice": "bg-crimson-600", "IA Results": "bg-maroon-600"
};

function runSearch(query, box) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  // Title matches rank above body-text matches
  const scored = [];
  for (const item of SEARCH_INDEX) {
    const t = item.title.toLowerCase();
    const b = (item.text || "").toLowerCase();
    if (t.includes(q)) scored.push({ item, rank: 0 });
    else if (b.includes(q)) scored.push({ item, rank: 1 });
    if (scored.length > 400) break;
  }
  scored.sort((a, b) => a.rank - b.rank);
  const hits = scored.slice(0, 10).map((s) => s.item);

  box.classList.remove("hidden");
  box.innerHTML = hits.length
    ? hits.map((h) => `
        <a href="${h.anchor}" data-course="${h.course ? esc(h.course) : ""}" data-person="${h.person ? esc(h.person) : ""}"
           class="search-hit flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-maroon-50 dark:hover:bg-white/5 transition-colors" role="option">
          <span class="mt-1.5 w-2 h-2 rounded-full shrink-0 ${SECTION_DOTS[h.section] || "bg-gray-400"}" aria-hidden="true"></span>
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-gray-900 dark:text-white">${esc(h.title)}</span>
            <span class="block text-xs text-gray-400 dark:text-gray-500">${esc(h.section)}</span>
          </span>
        </a>`).join("")
    : `<p class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No results for "<span class="font-semibold">${esc(query)}</span>"</p>`;

  $$(".search-hit", box).forEach((a) => a.addEventListener("click", () => {
    box.classList.add("hidden");
    setMenu(false);
    // Jump straight into the course detail when the hit is a paper
    const code = a.dataset.course;
    const person = a.dataset.person;
    if (code) setTimeout(() => openCourse(code), 420);
    else if (person) setTimeout(() => openFaculty(person), 420);
  }));
}

const searchInput = $("#global-search");
const searchResults = $("#search-results");
searchInput.addEventListener("input", () => runSearch(searchInput.value, searchResults));
searchInput.addEventListener("focus", () => runSearch(searchInput.value, searchResults));

const mSearch = $("#mobile-search");
const mResults = $("#mobile-search-results");
mSearch.addEventListener("input", () => runSearch(mSearch.value, mResults));

document.addEventListener("click", (e) => {
  if (!e.target.closest("#global-search") && !e.target.closest("#search-results")) {
    searchResults.classList.add("hidden");
  }
});

// "/" focuses the search box, as in most documentation sites
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
  }
});

/* ============================================================
   CONTACT FORM (demo submit)
   ============================================================ */
$("#contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  let valid = true;
  $$("[required]", form).forEach((f) => {
    const ok = f.checkValidity();
    f.classList.toggle("input-error", !ok);
    if (!ok) valid = false;
  });
  if (!valid) return;
  // In production, POST to your backend or a Google Form endpoint here.
  console.log("Query:", Object.fromEntries(new FormData(form)));
  form.reset();
  const ok = $("#contact-success");
  ok.classList.remove("hidden");
  setTimeout(() => ok.classList.add("hidden"), 5000);
});

/* ============================================================
   SCROLL EFFECTS
   ============================================================ */
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = "#" + entry.target.id;
    $$(".nav-link").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
$$("main section[id]").forEach((s) => spy.observe(s));

const reveal = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
$$(".section-head").forEach((el) => { el.classList.add("reveal"); reveal.observe(el); });

const backTop = $("#back-to-top");
window.addEventListener("scroll", () => {
  backTop.classList.toggle("hidden", window.scrollY < 600);
}, { passive: true });
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

let waveTimer;
window.addEventListener("resize", () => {
  clearTimeout(waveTimer);
  waveTimer = setTimeout(renderWave, 250);
}, { passive: true });

/* ============================================================
   INITIAL RENDER
   ============================================================ */
renderTicker();
renderWave();
renderCourses();
renderMinors();
renderScheme();
renderCredits();
renderTimetable();
renderTransport();
renderCalendar();
renderRegulations();
renderConduct();
renderInternship();
renderDocs();
renderDepartment();
renderBatch();
renderFaculty();
renderResults();
renderAttendance();
renderIASchedule();

$("#hero-courses").textContent = COURSES.length;
$("#stat-courses").textContent = COURSES.length;
$("#stat-docs").textContent = DOCS.length;
$("#year").textContent = new Date().getFullYear();
