/* ChipLife UI — the main game screen: header, stat chips, journal, dock, age-up and action flows. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const UI = CL.UI;
  const h = UI.h;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let busy = false;
  UI.isBusy = () => busy;

  // Every screen shares the sheet layer and toast area.
  UI.frame = function (...kids) {
    UI.closeSheet && UI.$('#layer') && UI.closeSheet();
    UI.$('#app').replaceChildren(...kids, h('div.layer#layer', [h('div.scrim', { onclick: () => UI.closeSheet() }), h('div.sheet')]), h('div.toasts#toasts'));
  };

  UI.occupation = function (L) {
    if (!L.alive) return L.cause === 'age' ? 'Rest in peace' : 'Rest in peace';
    if (L.prison) return `In jail · ${U.plural(L.prison.left, 'year')} left`;
    if (L.job) return L.job.title;
    if (L.edu.stage === 'college') return `${G.majorLabel(L.edu.major)} student`;
    if (L.edu.stage === 'grad') return `${CL.GRAD[L.edu.program].label} student`;
    if (G.inKidSchool(L)) return `${G.classLabel(L)} student`;
    if (L.retired) return 'Retired';
    if (L.partTime) return L.partTime.title;
    if (L.age < 2) return 'Baby';
    if (L.age < 5) return L.edu.stage === 'preschool' ? 'Preschooler' : 'Toddler';
    if (L.age < 18) return 'Kid';
    return 'Looking for work';
  };
  function pathTab(L) {
    if (L.prison) return ['⛓️', 'Jail'];
    if (L.age < 5) return ['🧸', 'Growing'];
    if (G.inSchoolAny(L) || L.age < 18) return ['🎒', 'School'];
    return ['💼', 'Career'];
  }

  UI.showGame = function () {
    UI.screen = 'game';
    jState.lifeId = null;
    const tab = (id, emoji, label) => h('button.tab', { 'data-tab': id, onclick: () => UI.openTab(id) }, [h('span', emoji), h('b', label)]);
    UI.frame(h('div.game', [
      h('header.top', [
        h('button.me#meBtn', { onclick: () => UI.openTab('profile'), 'aria-label': 'Your profile' }),
        h('div.who', [h('div.nm#nm'), h('div.sub#sub')]),
        h('div.cash', [h('small', 'Money'), h('b#cash')]),
        h('button.icon-btn', { onclick: () => UI.openTab('menu'), 'aria-label': 'Menu' }, '☰'),
      ]),
      h('div.chips#chips'),
      h('main.journal#journal'),
      h('nav.dock', [
        tab('path', '🎒', 'School'),
        tab('people', '👪', 'People'),
        h('button.age#ageBtn', { onclick: () => UI.ageUp(), 'aria-label': 'Age up one year' }, [h('span', '🌰'), h('b', 'Age +1')]),
        tab('stuff', '🏠', 'Stuff'),
        tab('do', '🎯', 'Activities'),
      ]),
    ]));
    UI.render(true);
    UI.afterAnything();
  };

  UI.render = function (scroll) {
    const L = G.life;
    if (!L || UI.screen !== 'game' || !UI.$('#nm')) return;
    const C = G.country(L.country);
    UI.$('#meBtn').textContent = G.myFace(L);
    UI.$('#nm').textContent = `${L.first} ${L.last}`;
    UI.$('#sub').replaceChildren(UI.em(C.flag), ` Age ${L.age} · ${UI.occupation(L)}`);
    const cash = UI.$('#cash');
    cash.textContent = U.money(L.money);
    cash.classList.toggle('neg', L.money < 0);
    UI.$('#chips').replaceChildren(...CL.STATS.map((s) => {
      const v = L.stats[s.id];
      return h('button.chip' + (v < 25 ? '.low' : ''), { style: { '--c': `var(--${s.id})` }, title: `${s.label}: ${v}`, 'aria-label': `${s.label} ${v}`, onclick: () => UI.openTab('profile') }, [
        h('i', { style: { width: v + '%' } }), h('span', s.emoji), h('span', String(v)),
      ]);
    }));
    const [pe, pl] = pathTab(L);
    const pt = document.querySelector('.dock [data-tab="path"]');
    if (pt) { pt.firstChild.textContent = pe; pt.lastChild.textContent = pl; }
    const ab = UI.$('#ageBtn');
    const waiting = L.pending.length > 0;
    ab.classList.toggle('wait', waiting);
    ab.firstChild.textContent = !L.alive ? '🕊️' : waiting ? '❓' : '🌰';
    ab.lastChild.textContent = !L.alive ? 'The End' : waiting ? 'Decide' : 'Age +1';
    renderJournal(L, scroll);
  };

  // ---------------------------------------------------------------- journal (only the newest year gets rebuilt)
  const jState = { lifeId: null, years: 0 };
  function yearEl(y) {
    const items = y.items.length ? y.items : [{ e: '🍃', t: 'A quiet, cozy year.', k: 'info' }];
    return h('section.year', [
      h('h3', [h('span', y.age === 0 ? 'Born' : `Age ${y.age}`), h('span.yr', String(y.year))]),
      h('ul', items.map((it) => h('li.' + (it.k || 'info'), [
        h('span.e', UI.em(it.e)),
        h('div', [it.q ? h('span.q', it.q) : null, h('div.t', [it.c ? h('span.c', it.c) : null, it.t]), UI.deltaChips(it.d)]),
      ]))),
    ]);
  }
  UI.yearEl = yearEl;
  function renderJournal(L, scroll) {
    const j = UI.$('#journal');
    if (!j) return;
    if (jState.lifeId !== L.id || L.log.length < jState.years || j.children.length !== jState.years) {
      j.replaceChildren();
      jState.lifeId = L.id;
      jState.years = 0;
    }
    if (jState.years > 0) { j.lastElementChild.remove(); jState.years--; }
    const frag = document.createDocumentFragment();
    for (let i = jState.years; i < L.log.length; i++) frag.appendChild(yearEl(L.log[i]));
    j.appendChild(frag);
    jState.years = L.log.length;
    if (scroll) requestAnimationFrame(() => { j.scrollTop = j.scrollHeight; });
    if (scroll) j.scrollTop = j.scrollHeight;
  }

  // ---------------------------------------------------------------- flows
  UI.ageUp = async function () {
    const L = G.life;
    if (busy || UI.modalOpen || !L) return;
    if (!L.alive) return UI.showEnd();
    if (L.pending.length) return UI.afterAnything();
    busy = true;
    try {
      UI.closeSheet();
      const btn = UI.$('#ageBtn');
      btn.classList.remove('spin');
      void btn.offsetWidth;
      btn.classList.add('spin');
      UI.sfx.age();
      G.ageUp();
      UI.render(true);
      await UI.afterAnything(true);
    } finally {
      busy = false;
    }
  };
  // Resolve queued decisions (events, court), then celebrate acorns, then check for the end.
  UI.afterAnything = async function () {
    let guard = 0;
    while (G.life && G.life.alive && G.life.pending.length && guard++ < 12) {
      const view = G.pendingView(G.life.pending[0]);
      if (!view) { G.life.pending.shift(); continue; }
      UI.render(true);
      const idx = await UI.choose(view);
      const r = G.resolvePending(idx);
      UI.render(true);
      if (r) await UI.result(r);
    }
    UI.acornToasts();
    UI.render();
    UI.refreshSheet();
    if (G.life && !G.life.alive) {
      await sleep(500);
      UI.showEnd();
    }
  };
  UI.acornToasts = function () {
    const fresh = CL.meta.fresh.splice(0);
    if (!fresh.length) return;
    if (fresh.length > 3) UI.toast(`🌰 ${fresh.length} acorns earned! ${fresh.slice(0, 3).map((a) => a.emoji).join(' ')} …`, 'acorn');
    else for (const a of fresh) UI.toast(`🌰 Acorn earned! ${a.emoji} ${a.label}`, 'acorn');
    G.save();
  };
  UI.doAct = async function (id) {
    if (busy || UI.modalOpen) return;
    const a = G.actById(id);
    if (!a) return;
    const st = G.actState(a);
    if (!st.ok) { UI.toast(st.why || "You can't do that right now."); return; }
    busy = true;
    try {
      const args = await UI.runSteps(a.steps);
      if (!args) return;
      const r = G.runAct(id, args);
      UI.render(true);
      UI.refreshSheet();
      await UI.result(r);
      await UI.afterAnything();
    } finally {
      busy = false;
    }
  };
  UI.doInteract = async function (pid, iid) {
    if (busy || UI.modalOpen) return;
    const p = G.person(pid);
    const it = G.interById(iid);
    if (!p || !it) return;
    const st = G.interactState(G.life, p, it);
    if (!st.ok) { UI.toast(st.why || "You can't do that right now."); return; }
    busy = true;
    try {
      if (it.confirm && !(await UI.confirm(it.confirm))) return;
      const args = await UI.runSteps(it.steps);
      if (!args) return;
      const r = G.interact(pid, iid, args);
      UI.render(true);
      UI.refreshSheet();
      await UI.result(r);
      await UI.afterAnything();
    } finally {
      busy = false;
    }
  };
  // Engine calls that return a result directly (buying, applying...).
  UI.doCall = async function (fn) {
    if (busy || UI.modalOpen) return;
    busy = true;
    try {
      const r = await fn();
      UI.render(true);
      UI.refreshSheet();
      if (r) await UI.result(r);
      await UI.afterAnything();
    } finally {
      busy = false;
    }
  };

  document.addEventListener('keydown', (e) => {
    if (UI.screen !== 'game' || UI.modalOpen || busy || e.target.closest('input,select,textarea')) return;
    if ((e.key === ' ' || e.key === 'Enter') && !UI.sheetOpen() && !e.target.closest('button')) { e.preventDefault(); UI.ageUp(); }
    if (e.key === 'Escape' && UI.sheetOpen()) UI.closeSheet();
  });
})(globalThis.CL);
