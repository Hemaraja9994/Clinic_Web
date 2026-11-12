/* Exam Quest: a tickable self-study map for the December 2026 theory exams.
   Progress stays in this browser only. */
"use strict";

const QUEST_KEY = "baslp-exam-quest-2026";

function questLoad() {
  try {
    const raw = JSON.parse(localStorage.getItem(QUEST_KEY) || "{}");
    return {
      campaign: raw.campaign || "sem1",
      selected: raw.selected || "",
      cleared: raw.cleared && typeof raw.cleared === "object" ? raw.cleared : {}
    };
  } catch (err) {
    return { campaign: "sem1", selected: "", cleared: {} };
  }
}

function questSave(state) {
  localStorage.setItem(QUEST_KEY, JSON.stringify(state));
}

function questToday() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function questCampaign(state) {
  return STUDY_PLAN.campaigns.find((c) => c.id === state.campaign) || STUDY_PLAN.campaigns[0];
}

function questKey(campaign, iso) {
  return campaign.id + ":" + iso;
}

function questClearedCount(state, campaign) {
  return campaign.levels.filter((lv) => state.cleared[questKey(campaign, lv.iso)]).length;
}

function questBossesDone(state, campaign) {
  const bosses = campaign.levels.filter((lv) => lv.kind === "boss");
  return bosses.length > 0 && bosses.every((lv) => state.cleared[questKey(campaign, lv.iso)]);
}

function questBadgeOn(state, campaign, badge) {
  if (badge.need === "bosses") return questBossesDone(state, campaign);
  return questClearedCount(state, campaign) >= badge.need;
}

function questPickLevel(campaign, state) {
  const chosen = campaign.levels.find((lv) => lv.iso === state.selected);
  if (chosen) return chosen;
  const today = questToday();
  const exact = campaign.levels.find((lv) => lv.iso === today);
  if (exact) return exact;
  const upcoming = campaign.levels.find((lv) => lv.iso >= today);
  return upcoming || campaign.levels[campaign.levels.length - 1];
}

function renderRoadmap() {
  const root = $("#roadmap-root");
  if (!root || typeof STUDY_PLAN === "undefined") return;
  const state = questLoad();
  const campaign = questCampaign(state);
  const level = questPickLevel(campaign, state);
  state.selected = level.iso;

  const cleared = questClearedCount(state, campaign);
  const totalXp = campaign.levels.reduce((sum, lv) => (
    state.cleared[questKey(campaign, lv.iso)] ? sum + lv.xp : sum
  ), 0);
  const maxXp = campaign.levels.reduce((sum, lv) => sum + lv.xp, 0);
  const today = questToday();

  const tabs = STUDY_PLAN.campaigns.length < 2 ? "" : STUDY_PLAN.campaigns.map((c) => {
    const n = questClearedCount(state, c);
    const on = c.id === campaign.id;
    return `<button type="button" class="quest-tab ${on ? "is-on" : ""}" data-campaign="${esc(c.id)}" aria-pressed="${on}">
      <span class="block font-bold">${esc(c.short)}</span>
      <span class="block text-[11px] opacity-80">${n}/29 ticked</span>
    </button>`;
  }).join("");

  const stops = campaign.levels.map((lv, i) => {
    const on = lv.iso === level.iso;
    const done = !!state.cleared[questKey(campaign, lv.iso)];
    const isToday = lv.iso === today;
    const side = i % 2 === 0 ? "is-left" : "is-right";
    return `<li class="quest-stop ${side} kind-${esc(lv.kind)} ${done ? "is-done" : ""} ${on ? "is-on" : ""} ${isToday ? "is-today" : ""}">
      <button type="button" class="quest-node" data-iso="${esc(lv.iso)}" aria-current="${on ? "true" : "false"}">
        <span class="quest-dot" aria-hidden="true">${done ? "✓" : i + 1}</span>
        <span class="quest-node-copy">
          <span class="quest-kicker">${esc(lv.label)} · ${esc(lv.kindName)}${isToday ? " · today" : ""}</span>
          <span class="quest-node-title">${esc(lv.paper)}</span>
          <span class="quest-node-sub">${esc(lv.title)}</span>
        </span>
      </button>
    </li>`;
  }).join("");

  const badges = STUDY_PLAN.badges.map((b) => {
    const on = questBadgeOn(state, campaign, b);
    return `<li class="quest-badge ${on ? "is-on" : ""}">
      <span class="quest-badge-mark" aria-hidden="true">${on ? "★" : "☆"}</span>
      <span><strong>${esc(b.name)}</strong><span class="block text-[11px] opacity-75">${esc(b.text)}</span></span>
    </li>`;
  }).join("");

  const done = !!state.cleared[questKey(campaign, level.iso)];
  const blocks = (level.periods || []).map((slot) =>
    `<tr class="${slot.hold ? "is-hold" : "is-study"}"><td>${esc(slot.time)}</td><td>${esc(slot.block)}</td><td>${esc(slot.work)}</td></tr>`
  ).join("");
  const papers = campaign.papers.map((p) =>
    `<li><span>${esc(p[0])}</span><span>${esc(p[1])}</span><span>${esc(p[2])}</span></li>`
  ).join("");

  root.innerHTML = `
    <div class="quest-tabs" role="tablist" aria-label="Choose a semester campaign">${tabs}</div>
    <p class="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl">${esc(campaign.blurb)}</p>
    <ul class="quest-papers">${papers}</ul>
    <div class="quest-hud">
      <div>
        <p class="quest-hud-label">Levels ticked</p>
        <p class="quest-hud-value">${cleared}<span>/29</span></p>
      </div>
      <div class="quest-bar" role="progressbar" aria-valuemin="0" aria-valuemax="29" aria-valuenow="${cleared}" aria-label="Levels ticked in ${esc(campaign.short)}">
        <span style="width:${Math.round((cleared / 29) * 100)}%"></span>
      </div>
      <div>
        <p class="quest-hud-label">XP</p>
        <p class="quest-hud-value">${totalXp}<span>/${maxXp}</span></p>
      </div>
    </div>
    <ul class="quest-badges">${badges}</ul>
    <div class="quest-layout">
      <ol class="quest-trail">${stops}</ol>
      <article class="quest-card" aria-live="polite">
        <p class="text-crimson-600 dark:text-crimson-400 text-xs font-bold tracking-widest uppercase">${esc(level.kindName)} · ${level.xp} XP</p>
        <h3 class="font-serif text-2xl font-black text-navy-900 dark:text-white mt-1">${esc(level.label)}</h3>
        <p class="text-maroon-700 dark:text-maroon-200 font-semibold mt-1">${esc(level.paper)}</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white mt-1">${esc(level.title)}</p>
        <h4>Timetable</h4>
        <table class="quest-table">
          <thead><tr><th>Time</th><th>Block</th><th>What to do</th></tr></thead>
          <tbody>${blocks}</tbody>
        </table>
        <div class="quest-recall">
          <p class="text-xs font-bold tracking-widest uppercase text-navy-700 dark:text-navy-200">Tick only after this</p>
          <p class="mt-1">${esc(level.recall)}</p>
        </div>
        <button type="button" class="quest-tick ${done ? "is-done" : ""}" data-tick="${esc(level.iso)}">
          ${done ? "Ticked. Tap to undo." : "Tick this level clear"}
        </button>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">Ticks stay in this browser. They are not sent to the department.</p>
      </article>
    </div>
    <div class="mt-6 flex flex-wrap gap-3">
      <a class="inline-flex items-center gap-2 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-white font-semibold px-5 py-3" href="${esc(STUDY_PLAN.pdf)}" download>Download the PDF plan</a>
      <button type="button" id="quest-reset" class="rounded-lg ring-1 ring-gray-300 dark:ring-white/20 px-5 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10">Clear my ticks for this semester</button>
    </div>`;

  root.querySelectorAll("[data-campaign]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = questLoad();
      next.campaign = btn.getAttribute("data-campaign");
      next.selected = "";
      questSave(next);
      renderRoadmap();
    });
  });

  root.querySelectorAll("[data-iso]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = questLoad();
      next.campaign = campaign.id;
      next.selected = btn.getAttribute("data-iso");
      questSave(next);
      renderRoadmap();
      const card = $("#roadmap-root .quest-card");
      if (card && window.matchMedia("(max-width: 1023px)").matches) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  const tick = root.querySelector("[data-tick]");
  if (tick) {
    tick.addEventListener("click", () => {
      const next = questLoad();
      const key = campaign.id + ":" + tick.getAttribute("data-tick");
      next.campaign = campaign.id;
      next.selected = level.iso;
      if (next.cleared[key]) delete next.cleared[key];
      else next.cleared[key] = true;
      questSave(next);
      renderRoadmap();
    });
  }

  const reset = $("#quest-reset");
  if (reset) {
    reset.addEventListener("click", () => {
      const next = questLoad();
      next.campaign = campaign.id;
      next.selected = level.iso;
      campaign.levels.forEach((lv) => { delete next.cleared[campaign.id + ":" + lv.iso]; });
      questSave(next);
      renderRoadmap();
    });
  }
}

renderRoadmap();
