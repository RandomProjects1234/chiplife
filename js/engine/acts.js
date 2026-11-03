/* ChipLife engine — the action framework. Every button that "does something" (study, gym,
   heists, prison chores...) is an act: { id, cat, label, emoji, desc, minAge, cost, steps, run }.
   steps are collected by the UI first: {type:'pick', key, title, options(L)} | {type:'quiz', set, count}
   | {type:'mini', mini:'dial'|'sneak', opts(L,args)} | {type:'confirm', text}. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  G.ACTS = [];
  G.act = (def) => { G.ACTS.push(def); return def; };
  G.actById = (id) => G.ACTS.find((a) => a.id === id);
  G.use = (key) => { const L = G.life; const n = L.uses[key] || 0; L.uses[key] = n + 1; return n; };
  G.used = (key) => (G.life.uses[key] || 0);
  G.dim = (n) => 1 / (1 + 0.6 * n); // diminishing returns for repeating something in one year

  G.costOf = function (a, L) {
    let c = typeof a.cost === 'function' ? a.cost(L) : a.cost || 0;
    if (a.parentsPay && L.age < 18 && L.home === 'parents' && G.parents(L).length) c = 0;
    return c;
  };
  G.actState = function (a, L = G.life) {
    if (!L || !L.alive) return { ok: false, hidden: true };
    if (a.cat === 'prison' && !L.prison) return { ok: false, hidden: true };
    if (a.cat !== 'prison' && L.prison) return { ok: false, why: "Not while you're in jail", hidden: true };
    if (a.show && !a.show(L)) return { ok: false, hidden: true };
    if (a.maxAge != null && L.age > a.maxAge) return { ok: false, why: 'Not at your age', hidden: true };
    if (a.minAge && L.age < a.minAge) return { ok: false, why: `Unlocks at age ${a.minAge}` };
    const cost = G.costOf(a, L);
    if (a.avail) {
      const w = a.avail(L);
      if (w !== true && w) return { ok: false, why: w, cost };
    }
    if (a.perYear && G.used('act:' + a.id) >= a.perYear) return { ok: false, why: a.perYear === 1 ? 'Done for this year' : `Max ${a.perYear}× a year`, cost };
    if (cost > 0 && L.money < cost) return { ok: false, why: `Costs ${U.money(cost)}`, cost };
    return { ok: true, cost };
  };
  G.runAct = function (id, args = {}) {
    const L = G.life;
    const a = G.actById(id);
    if (!a || !L) return null;
    const st = G.actState(a, L);
    if (!st.ok) return { emoji: '🚫', title: a.label, text: st.why || "You can't do that right now.", tone: 'info', d: [], silent: true };
    const n = G.use('act:' + a.id);
    if (st.cost > 0) L.money -= st.cost;
    let r = a.run(L, args, n) || {};
    if (r.refund) {
      L.uses['act:' + a.id] = n;
      if (st.cost > 0) L.money += st.cost;
    }
    r = Object.assign({ emoji: a.emoji, title: a.label, tone: 'info', d: [] }, r);
    if (st.cost > 0 && !r.refund) r.d.unshift({ k: 'money', v: -st.cost });
    if (!r.silent && r.text) G.say(r.text, r.emoji, r.tone, r.d);
    if (CL.meta) CL.meta.check();
    G.save();
    return r;
  };

  // A finished result: apply effects, pick the tone automatically.
  G.res = function (emoji, text, fx, ctx, extra) {
    const d = G.fx(fx, ctx || {});
    return Object.assign({ emoji, text, d, tone: G.toneOf(d) }, extra || {});
  };
  G.fail = (text, emoji) => ({ emoji: emoji || '🤷', text, tone: 'info', d: [], silent: true, refund: true });

  // 0..100 skill/stat score -> a text bucket, with some luck mixed in.
  G.bucket4 = function (score) {
    const r = score + U.ri(-28, 28);
    return r >= 78 ? 'great' : r >= 48 ? 'good' : r >= 22 ? 'meh' : 'bad';
  };
  G.text = function (group, key, bucket, ctx, fallback) {
    return U.fill(U.line(group, key, bucket, fallback), Object.assign({ name: G.life.first, city: G.life.city }, ctx || {}));
  };
})(globalThis.CL);
