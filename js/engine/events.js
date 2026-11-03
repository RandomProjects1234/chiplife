/* ChipLife engine — random life events: eligibility, token filling and choice resolution. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const PERSON_TOKENS = ['mom', 'dad', 'grandparent', 'sibling', 'friend', 'child', 'pet'];
  const ROLE_TOKEN = { siblingRole: 'sibling', childRole: 'child', petType: 'pet' };
  const POSITIVE = ['joy', 'health', 'smarts', 'style', 'kindness', 'fame', 'bond', 'grades', 'perf', 'skill'];

  G.NEEDS = {
    school: (L) => G.inKidSchool(L),
    college: (L) => L.edu.stage === 'college' || L.edu.stage === 'grad',
    job: (L) => !!(L.job || L.partTime),
    noJob: (L) => L.age >= 18 && !L.job && !L.partTime && !G.inSchoolAny(L) && !L.retired,
    prison: (L) => !!L.prison,
    car: (L) => L.assets.some((a) => a.type === 'vehicle'),
    house: (L) => L.assets.some((a) => a.type === 'house'),
    rich: (L) => L.money >= 100000,
    poor: (L) => L.money < 1000,
    famous: (L) => L.fame >= 40,
    record: (L) => L.record.length > 0,
    license: (L) => L.license,
    withParents: (L) => L.home === 'parents',
    ownPlace: (L) => L.home !== 'parents',
    retired: (L) => L.retired,
  };

  let index = null, indexLen = -1;
  G.eventById = function (id) {
    const evs = CL.content.events;
    if (!index || indexLen !== evs.length) {
      index = new Map();
      for (const ev of evs) if (ev && ev.id) index.set(ev.id, ev);
      indexLen = evs.length;
    }
    return index.get(id);
  };

  function prep(ev) {
    if (ev._tok) return ev;
    const texts = [ev.text];
    for (const o of ev.outcomes || []) texts.push(o && o.text);
    for (const c of ev.choices || []) {
      texts.push(c && c.label);
      for (const o of (c && c.outcomes) || []) texts.push(o && o.text);
    }
    const t = new Set();
    for (const s of texts) for (const k of U.tokens(s)) t.add(ROLE_TOKEN[k] || k);
    Object.defineProperty(ev, '_tok', { value: t, enumerable: false });
    return ev;
  }

  function tokenOk(L, t) {
    switch (t) {
      case 'mom': return G.alive(L, 'mother').length > 0;
      case 'dad': return G.alive(L, 'father').length > 0;
      case 'grandparent': return G.alive(L, 'grandparent').length > 0;
      case 'sibling': return G.alive(L, 'sibling').length > 0;
      case 'friend': return G.alive(L, 'friend').length > 0;
      case 'child': return G.alive(L, 'child').length > 0;
      case 'pet': return G.alive(L, 'pet').length > 0;
      case 'school': return G.inSchoolAny(L) && !!L.edu.school;
      case 'job': case 'company': case 'coworker': case 'boss': return !!(L.job || L.partTime);
      default: return true;
    }
  }

  function eligible(L, ev) {
    if (!ev || typeof ev.minAge !== 'number' || L.age < ev.minAge || L.age > ev.maxAge) return false;
    if (ev.once && L.once[ev.id]) return false;
    if (L.recent.includes(ev.id)) return false;
    const needs = Array.isArray(ev.needs) ? ev.needs : [];
    if (!!L.prison !== needs.includes('prison')) return false;
    for (const n of needs) {
      const f = G.NEEDS[n];
      if (f && !f(L)) return false;
    }
    if (!ev.choices && !ev.outcomes && !ev.effects) return false;
    prep(ev);
    for (const t of ev._tok) if (!tokenOk(L, t)) return false;
    return true;
  }
  G.eligibleEvents = (L) => CL.content.events.filter((ev) => eligible(L, ev));

  G.buildCtx = function (L, toks) {
    const C = G.country(L.country);
    const ctx = { name: L.first, city: L.city, country: C.name };
    const pickP = (kind) => U.pick(G.alive(L, kind));
    if (toks.has('mom')) { const p = pickP('mother'); ctx.mom = 'Mom'; ctx._mom = p.id; }
    if (toks.has('dad')) { const p = pickP('father'); ctx.dad = 'Dad'; ctx._dad = p.id; }
    if (toks.has('grandparent')) { const p = pickP('grandparent'); ctx.grandparent = G.callName(p); ctx._grandparent = p.id; }
    if (toks.has('sibling')) { const p = pickP('sibling'); ctx.sibling = p.first; ctx.siblingRole = p.gender === 'girl' ? 'sister' : 'brother'; ctx._sibling = p.id; }
    if (toks.has('friend')) { const p = pickP('friend'); ctx.friend = p.first; ctx._friend = p.id; }
    if (toks.has('child')) { const p = pickP('child'); ctx.child = p.first; ctx.childRole = p.gender === 'girl' ? 'daughter' : 'son'; ctx._child = p.id; }
    if (toks.has('pet')) { const p = pickP('pet'); ctx.pet = p.first; ctx.petType = p.petType; ctx._pet = p.id; }
    const randFirst = () => U.pick(C[U.pick(['boy', 'girl'])]) || 'Sam';
    const titled = () => (U.chance(0.5) ? 'Mr. ' : 'Ms. ') + (U.pick(C.last) || 'Hazel');
    if (toks.has('classmate')) ctx.classmate = randFirst();
    if (toks.has('teacher')) ctx.teacher = titled();
    if (toks.has('neighbor')) ctx.neighbor = titled();
    if (toks.has('coworker')) ctx.coworker = randFirst();
    if (toks.has('boss')) ctx.boss = titled();
    if (toks.has('newFriend')) {
      const nf = G.mkPerson(L, 'friend', { age: U.clamp(L.age + U.ri(-2, 2), 2, 110), bond: U.ri(55, 75), met: 'chance' });
      ctx.newFriend = nf.first;
      ctx._nf = nf;
    }
    if (toks.has('school')) ctx.school = L.edu.school;
    const j = L.job || L.partTime;
    if (j) { ctx.job = j.title; ctx.company = j.company; }
    return ctx;
  };

  function bondTargetOf(ctx, ...texts) {
    const s = texts.join(' ');
    let best = null, at = Infinity;
    for (const t of PERSON_TOKENS) {
      const i = s.indexOf('{' + t + '}');
      if (i >= 0 && i < at && ctx['_' + t]) { best = ctx['_' + t]; at = i; }
    }
    return best;
  }

  function pickOutcome(L, outs) {
    return U.pickW(outs, (o) => {
      let w = o.weight == null ? 1 : o.weight;
      if (o.favor) {
        const v = L.stats[o.favor] != null ? L.stats[o.favor] : L.skills[o.favor] != null ? L.skills[o.favor] : 50;
        w *= 0.4 + (1.2 * v) / 100;
      }
      return w;
    });
  }

  G.toneOf = function (d) {
    let s = 0;
    for (const x of d || []) {
      if (POSITIVE.includes(x.k)) s += x.v;
      else if (x.k === 'money') s += Math.sign(x.v) * Math.min(10, Math.log10(Math.abs(x.v) + 1) * 3);
      else if (x.k === 'notoriety') s -= x.v / 2;
      else if (x.k === 'friend' || x.k === 'pet') s += 5;
      else if (x.k === 'followers') s += 2;
    }
    return s > 1 ? 'good' : s < -1 ? 'bad' : 'info';
  };
  const TONE_EMOJI = { good: '🌟', bad: '🌧️', info: '📌' };

  function amountCtx(ctx, fx) {
    return Object.assign({}, ctx, { amount: fx && typeof fx.money === 'number' ? U.money(Math.abs(fx.money)) : '' });
  }

  G.fireEvent = function (L, ev) {
    prep(ev);
    L.recent.push(ev.id);
    if (L.recent.length > 30) L.recent.shift();
    if (ev.once) L.once[ev.id] = 1;
    const ctx = G.buildCtx(L, ev._tok);
    if (ev.choices) {
      L.pending.push({ id: ev.id, ctx });
      return;
    }
    let fx = ev.effects, otext = '';
    if (ev.outcomes) {
      const o = pickOutcome(L, ev.outcomes);
      fx = o.effects;
      otext = o.text;
    }
    const fctx = { bondTarget: bondTargetOf(ctx, ev.text, otext), newFriendPerson: ctx._nf, crimeName: fx && fx.record };
    const d = G.fx(fx, fctx);
    const actx = amountCtx(ctx, fx);
    let text = U.fill(ev.text, actx);
    if (otext) text += ' ' + U.fill(otext, actx);
    if (fctx.extraLine) text += ' ' + fctx.extraLine;
    const tone = G.toneOf(d);
    G.say(text, TONE_EMOJI[tone], tone, d);
  };

  G.eventsYear = function (L) {
    const n = L.age < 2 ? (U.chance(0.7) ? 1 : 0) : L.prison ? U.pickW([0, 1, 2], (k) => [25, 60, 15][k]) : U.pickW([0, 1, 2, 3], (k) => [6, 56, 31, 7][k]);
    for (let i = 0; i < n; i++) {
      const pool = G.eligibleEvents(L);
      if (!pool.length) break;
      G.fireEvent(L, U.pickW(pool, (e) => (e.weight == null ? 1 : e.weight)));
    }
  };

  // ---------------------------------------------------------------- pending choices
  G.SYS = G.SYS || {};
  G.pendingView = function (p) {
    if (!p) return null;
    if (p.sys) return { emoji: p.emoji || '❓', title: p.title || 'Decision time', text: p.text, choices: p.choices.slice() };
    const ev = G.eventById(p.id);
    if (!ev) return null;
    return { emoji: '🌰', title: `Age ${G.life.age}`, text: U.fill(ev.text, p.ctx), choices: ev.choices.map((c) => U.fill(c.label, p.ctx)) };
  };
  G.resolvePending = function (idx) {
    const L = G.life;
    const p = L.pending.shift();
    if (!p) return null;
    let r = null;
    if (p.sys) {
      r = G.SYS[p.sys] ? G.SYS[p.sys](idx, p.data || {}) : null;
    } else {
      const ev = G.eventById(p.id);
      if (ev) {
        const choice = ev.choices[U.clamp(idx | 0, 0, ev.choices.length - 1)];
        const o = pickOutcome(L, choice.outcomes);
        const ctx = p.ctx || {};
        const fctx = { bondTarget: bondTargetOf(ctx, ev.text, choice.label, o.text), newFriendPerson: ctx._nf, crimeName: o.effects && o.effects.record };
        const d = G.fx(o.effects, fctx);
        let text = U.fill(o.text, amountCtx(ctx, o.effects));
        if (fctx.extraLine) text += ' ' + fctx.extraLine;
        const tone = G.toneOf(d);
        const label = U.fill(choice.label, ctx);
        L.log[L.log.length - 1] || G.say(' ');
        G.say(text, TONE_EMOJI[tone], tone, d);
        const item = L.log[L.log.length - 1].items.slice(-1)[0];
        item.q = U.fill(ev.text, ctx);
        item.c = label;
        r = { emoji: TONE_EMOJI[tone], title: label, text, tone, d };
      }
    }
    if (CL.meta) CL.meta.check();
    G.save();
    return r;
  };
  // Engine-made decisions (court, etc.) use the same pending queue.
  G.ask = function (sys, o) {
    G.life.pending.push({ sys, emoji: o.emoji, title: o.title, text: o.text, choices: o.choices, data: o.data || {} });
  };
})(globalThis.CL);
