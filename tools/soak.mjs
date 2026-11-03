// Headless soak test: plays many random lives through the real engine (no DOM).
//   node tools/soak.mjs [lives=200] [seed=1]
// Reports crashes, NaN/out-of-range values, unfilled {tokens} in the journal, and balance stats.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIVES = +(process.argv[2] || 200);
const SEED = +(process.argv[3] || 1);

export function loadGame() {
  const ctx = vm.createContext({ console, Date, Math, JSON });
  const run = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  run('js/core.js');
  for (const f of fs.readdirSync(path.join(root, 'js/content')).filter((f) => f.endsWith('.js')).sort()) run('js/content/' + f);
  for (const f of ['life', 'events', 'acts', 'school', 'work', 'money', 'people', 'activities', 'crime', 'meta']) run(`js/engine/${f}.js`);
  return ctx.CL;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const CL = loadGame();
  const { G, util: U } = CL;
  U.seed(SEED);
  CL.meta.init();

  const errors = new Map();
  const tokenLeaks = new Map();
  const stat = { ages: [], worth: [], heists: 0, jailed: 0, degrees: { highschool: 0, bachelor: 0, adv: 0 }, chips: {}, events: new Set(), kids: 0, pets: 0, jobs: 0, logItems: 0, fame80: 0 };
  const note = (where, e) => {
    const key = `${where}: ${e && e.message}`;
    if (!errors.has(key)) errors.set(key, (e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : String(e)));
  };
  function fakeArgs(steps, L) {
    const a = {};
    for (const s of steps || []) {
      if (s.type === 'pick') {
        const opts = s.options(L, a).filter((o) => !o.disabled);
        if (!opts.length) return null;
        a[s.key] = U.pick(opts).id;
      } else if (s.type === 'quiz') a.correct = U.ri(0, s.count);
      else if (s.type === 'mini') {
        if (s.opts) s.opts(L, a);
        a.mini = { success: U.chance(0.6) };
      }
    }
    return a;
  }
  function resolveAll() {
    let guard = 0;
    while (G.life && G.life.pending.length && guard++ < 20) {
      const v = G.pendingView(G.life.pending[0]);
      try { G.resolvePending(v ? U.ri(0, v.choices.length - 1) : 0); } catch (e) { note('resolvePending', e); G.life.pending.shift(); }
    }
  }
  function check(L, where) {
    for (const [k, v] of Object.entries(L.stats)) if (!Number.isInteger(v) || v < 0 || v > 100) note(where, new Error(`stat ${k}=${v}`));
    for (const [k, v] of Object.entries(L.skills)) if (!Number.isFinite(v) || v < 0 || v > 100) note(where, new Error(`skill ${k}=${v}`));
    if (!Number.isFinite(L.money)) note(where, new Error(`money=${L.money}`));
    for (const k of ['fame', 'notoriety', 'followers']) if (!Number.isFinite(L[k])) note(where, new Error(`${k}=${L[k]}`));
    for (const p of L.people) if (!Number.isFinite(p.age) || !Number.isFinite(p.bond)) note(where, new Error(`person ${p.kind} age=${p.age} bond=${p.bond}`));
    for (const a of L.assets) if (!Number.isFinite(a.value)) note(where, new Error(`asset ${a.name} value=${a.value}`));
  }

  const t0 = Date.now();
  for (let i = 0; i < LIVES; i++) {
    try { G.newLife(i % 3 === 0 ? { perks: ['sly', 'bright'] } : {}); } catch (e) { note('newLife', e); continue; }
    let generations = 0;
    while (G.life) {
      const L = G.life;
      // the bot plays a year
      resolveAll();
      const tries = U.ri(2, 7);
      for (let k = 0; k < tries && L.alive; k++) {
        const acts = G.ACTS.filter((a) => { try { return G.actState(a, L).ok; } catch (e) { note('actState ' + a.id, e); return false; } });
        if (!acts.length) break;
        // heists are rare for the bot so lives stay varied
        const a = U.pick(acts.filter((x) => x.cat !== 'mischief' || U.chance(0.15)));
        if (!a) continue;
        try {
          const args = fakeArgs(a.steps, L);
          if (args) G.runAct(a.id, args);
        } catch (e) { note('act ' + a.id, e); }
        resolveAll();
      }
      // people
      for (const p of U.sample(L.people, 2)) {
        const its = G.INTERACTIONS.filter((it) => G.interactState(L, p, it).ok);
        const it = U.pick(its);
        if (!it) continue;
        try { G.interact(p.id, it.id, fakeArgs(it.steps, L) || {}); } catch (e) { note('interact ' + it.id, e); }
      }
      // jobs & shopping for adults
      if (L.age >= 18 && !L.job && !G.inSchoolAny(L) && !L.prison && !L.retired && U.chance(0.7)) {
        const ok = CL.content.jobs.filter((j) => G.canApply(L, j) === true);
        if (ok.length) {
          try {
            const best = ok.sort((x, y) => y.salary[0] - x.salary[0])[U.ri(0, Math.min(3, ok.length - 1))];
            const r = G.applyJob(best.id);
            if (r && r.question) G.finishInterview(best.id, U.pick(r.question.a).s);
          } catch (e) { note('jobs', e); }
        }
      }
      if (L.age >= 14 && L.age < 22 && !L.job && !L.partTime && U.chance(0.3)) {
        const pj = U.pick(CL.content.partTimeJobs);
        try { if (pj) G.applyPartTime(pj.id); } catch (e) { note('partTime', e); }
      }
      if (L.age >= 16 && U.chance(0.3)) {
        const kind = U.pick(['items', 'vehicles', 'houses']);
        const it = U.pick(CL.content.catalog[kind].filter((x) => x.price < L.money * 0.5));
        try { if (it) G.buy(kind, it.id, kind === 'houses' && U.chance(0.5) ? 'mortgage' : 'cash'); } catch (e) { note('buy', e); }
      }
      if (U.chance(0.05) && L.assets.length) { try { G.sellAsset(U.pick(L.assets).id); } catch (e) { note('sell', e); } }
      try { G.ageUp(); } catch (e) { note('ageUp', e); G.die('age'); }
      check(L, 'age ' + L.age);
      if (L.age > 125) { note('immortal', new Error('age > 125')); break; }
      if (!L.alive) {
        stat.ages.push(L.age);
        stat.worth.push(G.estate(L));
        stat.heists += L.totals.heists;
        if (L.totals.prisonYears) stat.jailed++;
        if (L.edu.degrees.includes('highschool')) stat.degrees.highschool++;
        if (L.edu.degrees.includes('bachelor')) stat.degrees.bachelor++;
        if (L.edu.degrees.some((d) => ['law', 'medical', 'phd', 'business'].includes(d))) stat.degrees.adv++;
        stat.kids += L.totals.kids;
        stat.pets += L.totals.pets;
        if (L.career.length || L.job) stat.jobs++;
        if ((L.totals.peakFame || 0) >= 80) stat.fame80++;
        const chip = L.chip ? L.chip.id : '?';
        stat.chips[chip] = (stat.chips[chip] || 0) + 1;
        for (const y of L.log) for (const it of y.items) {
          stat.logItems++;
          const m = it.t.match(/\{(\w+)\}/);
          if (m) tokenLeaks.set(m[0], (tokenLeaks.get(m[0]) || '') || it.t.slice(0, 140));
          if (/undefined|NaN|\[object/.test(it.t)) tokenLeaks.set('bad:' + it.t.slice(0, 40), it.t.slice(0, 160));
        }
        for (const id of Object.keys(L.once)) stat.events.add(id);
        for (const id of L.recent) stat.events.add(id);
        const heirs = G.heirs(L);
        if (heirs.length && generations < 2 && U.chance(0.7)) {
          generations++;
          try { G.continueAs(U.pick(heirs).id); } catch (e) { note('continueAs', e); G.life = null; }
        } else G.life = null;
      }
    }
  }
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)] || 0; };
  console.log(`\n${stat.ages.length} lives finished in ${((Date.now() - t0) / 1000).toFixed(1)}s, ${stat.logItems} journal lines`);
  console.log(`age: avg ${avg(stat.ages).toFixed(1)}, median ${med(stat.ages)}, min ${Math.min(...stat.ages)}, max ${Math.max(...stat.ages)}`);
  console.log(`estate: median ${U.money(med(stat.worth))}, avg ${U.money(avg(stat.worth))}`);
  console.log(`edu: HS ${stat.degrees.highschool}, BA ${stat.degrees.bachelor}, advanced ${stat.degrees.adv} | worked: ${stat.jobs} | heists ${stat.heists} | ever jailed ${stat.jailed} | kids ${stat.kids} | pets ${stat.pets} | fame80 ${stat.fame80}`);
  console.log(`distinct events seen: ${stat.events.size} / ${CL.content.events.length}`);
  console.log('life chips:', JSON.stringify(stat.chips));
  console.log(`acorns earned (meta): ${Object.keys(G.meta.ach).length} / ${CL.meta.ACORNS.length}`);
  if (tokenLeaks.size) { console.log(`\nTEXT PROBLEMS (${tokenLeaks.size}):`); for (const [k, v] of [...tokenLeaks].slice(0, 25)) console.log(`  ${k} :: ${v}`); }
  if (errors.size) { console.log(`\nERRORS (${errors.size}):`); for (const [k, v] of [...errors].slice(0, 25)) console.log(`  ${k}\n     ${v}`); }
  else console.log('\nno errors');
}
