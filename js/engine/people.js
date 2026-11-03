/* ChipLife engine — interacting with family, friends, your kids and pets. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const HUMANS = ['mother', 'father', 'grandparent', 'sibling', 'friend', 'child'];
  const ELDERS = ['mother', 'father', 'grandparent'];
  const B4 = ['great', 'good', 'meh', 'bad'];

  // bond / joy changes per bucket (great, good, meh, bad)
  G.INTERACTIONS = [
    { id: 'spendTime', label: 'Spend time together', emoji: '🧺', kinds: HUMANS, minAge: 2, bond: [12, 7, 2, -3], joy: [4, 2, 0, -1] },
    { id: 'chat', label: 'Have a chat', emoji: '💬', kinds: HUMANS, minAge: 3, bond: [9, 5, 1, -3], joy: [2, 1, 0, -1] },
    { id: 'playGame', label: 'Play a game', emoji: '🎲', kinds: HUMANS, minAge: 3, bond: [10, 6, 2, -2], joy: [4, 2, 1, -1] },
    { id: 'hug', label: 'Give a hug', emoji: '🤗', kinds: ['mother', 'father', 'grandparent', 'sibling', 'child'], minAge: 1, buckets: ['great', 'good', 'meh'], bond: [8, 5, 2], joy: [3, 2, 1] },
    { id: 'compliment', label: 'Give a compliment', emoji: '🌟', kinds: HUMANS, minAge: 4, bond: [8, 5, 1, -2], joy: [2, 1, 0, 0], kindness: 1 },
    { id: 'joke', label: 'Tell a joke', emoji: '😂', kinds: HUMANS, minAge: 4, bond: [7, 4, 0, -3], joy: [3, 2, 0, -1] },
    { id: 'gift', label: 'Give a gift', emoji: '🎁', kinds: HUMANS, minAge: 5, bond: [14, 9, 3, -1], joy: [3, 2, 1, 0], kindness: 2,
      steps: [{ type: 'pick', key: 'gift', title: 'Pick a gift', options: (L) => CL.GIFTS.map((g) => ({ id: g.id, label: g.label, emoji: g.emoji, sub: g.price ? U.money(g.price) : 'Free', disabled: g.price > L.money })) }] },
    { id: 'chores', label: 'Help with chores', emoji: '🧹', kinds: ELDERS, minAge: 5, buckets: ['great', 'good', 'meh'], bond: [9, 6, 3], joy: [1, 0, -1], kindness: 1, perYear: 2 },
    { id: 'askMoney', label: 'Ask for money', emoji: '💵', kinds: ELDERS, minAge: 5, perYear: 1 },
    { id: 'prank', label: 'Play a prank', emoji: '🤪', kinds: ['sibling', 'friend', 'mother', 'father'], minAge: 6, buckets: ['great', 'good', 'bad'], bond: [6, 2, -7], joy: [4, 2, -2] },
    { id: 'apologize', label: 'Say sorry', emoji: '🙏', kinds: HUMANS, minAge: 4, buckets: ['great', 'good', 'bad'], bond: [12, 7, -1], joy: [2, 1, -1], kindness: 1, show: (L, p) => p.bond < 65 },
    { id: 'argue', label: 'Argue', emoji: '😤', kinds: HUMANS, minAge: 6, buckets: ['good', 'bad'], bond: [-1, -8], joy: [1, -3] },
    { id: 'readStory', label: 'Read a bedtime story', emoji: '📖', kinds: ['child'], minAge: 18, buckets: ['great', 'good', 'meh'], bond: [10, 6, 3], joy: [3, 2, 1], show: (L, p) => p.age <= 10 },
    { id: 'teach', label: 'Teach them something', emoji: '🧠', kinds: ['child'], minAge: 18, buckets: ['great', 'good', 'meh'], bond: [8, 5, 2], joy: [2, 1, 0], kindness: 1, show: (L, p) => p.age >= 3 && p.age <= 17 },
    { id: 'allowance', label: 'Give pocket money', emoji: '🪙', kinds: ['child'], minAge: 18, perYear: 1, show: (L, p) => p.age >= 5 && p.age <= 17 },
    { id: 'petPlay', label: 'Play together', emoji: '🎾', kinds: ['pet'], minAge: 2, bond: [10, 6, 2, -2], joy: [4, 2, 1, 0] },
    { id: 'petWalk', label: 'Go for a walk', emoji: '🦮', kinds: ['pet'], minAge: 6, bond: [9, 6, 2, -1], joy: [3, 2, 1, 0], health: 2, show: (L, p) => p.species === 'dog' || p.species === 'horse' },
    { id: 'petTreat', label: 'Give a treat', emoji: '🦴', kinds: ['pet'], minAge: 3, buckets: ['great', 'good', 'meh'], bond: [8, 5, 2], joy: [2, 1, 0] },
    { id: 'petVet', label: 'Visit the vet', emoji: '🩺', kinds: ['pet'], minAge: 10, perYear: 1, cost: 150 },
    { id: 'endFriendship', label: 'Part ways', emoji: '👋', kinds: ['friend'], minAge: 6, confirm: 'End this friendship?' },
    { id: 'remember', label: 'Share a memory', emoji: '🌸', dead: true, minAge: 3, perYear: 1 },
  ];
  G.interById = (id) => G.INTERACTIONS.find((i) => i.id === id);

  G.interactState = function (L, p, it) {
    if (!p) return { ok: false, hidden: true };
    if (it.dead !== !p.alive && !(it.dead === undefined && p.alive)) return { ok: false, hidden: true };
    if (it.dead && p.alive) return { ok: false, hidden: true };
    if (!it.dead && (!it.kinds || !it.kinds.includes(p.kind))) return { ok: false, hidden: true };
    if (it.show && !it.show(L, p)) return { ok: false, hidden: true };
    if (L.prison && !['chat', 'remember'].includes(it.id)) return { ok: false, why: 'Not from jail' };
    if (L.age < (it.minAge || 0)) return { ok: false, why: `At age ${it.minAge}` };
    const n = (p.used && p.used[it.id]) || 0;
    if (it.perYear && n >= it.perYear) return { ok: false, why: 'Done this year' };
    const cost = it.cost && !(L.age < 18 && L.home === 'parents') ? it.cost : 0;
    if (cost && L.money < cost) return { ok: false, why: `Costs ${U.money(cost)}` };
    return { ok: true, cost };
  };

  function bucketOf(L, p, buckets, bonus) {
    const score = p.bond * 0.45 + L.stats.kindness * 0.2 + L.stats.joy * 0.15 + U.ri(0, 35) + (bonus || 0);
    const four = score >= 72 ? 0 : score >= 50 ? 1 : score >= 32 ? 2 : 3; // index into great/good/meh/bad
    if (buckets.length === 4) return four;
    if (buckets.length === 3 && buckets[2] === 'meh') return Math.min(2, four);
    if (buckets.length === 3) return four <= 0 ? 0 : four <= 2 ? 1 : 2; // great / good / bad
    return four <= 2 ? 0 : 1; // good / bad
  }

  G.interact = function (personId, interId, args = {}) {
    const L = G.life;
    const p = G.person(personId);
    const it = G.interById(interId);
    if (!p || !it) return null;
    const st = G.interactState(L, p, it);
    if (!st.ok) return G.fail(st.why || "You can't do that right now.");
    p.used = p.used || {};
    const n = p.used[it.id] || 0;
    const k = G.dim(n);
    const them = G.callName(p);
    const ctx = { them, petType: p.petType || '', name: L.first, city: L.city };
    const fctx = { bondTarget: p.id };
    let r;

    if (it.id === 'askMoney') {
      const asks = G.used('askMoney');
      G.use('askMoney');
      const w = L.wealth;
      const yes = U.chance(U.clamp((p.bond / 100) * (0.45 + 0.2 * w) - asks * 0.2 - (L.age >= 25 ? 0.25 : 0) + (p.kind === 'grandparent' ? 0.15 : 0), 0.05, 0.95));
      if (yes) {
        const amt = L.age <= 12 ? U.ri(2, 15) * w : L.age < 18 ? U.ri(10, 60) * w : U.ri(40, 400) * w * w;
        ctx.amount = U.money(amt);
        r = G.res('💵', G.text('interactionText', 'askMoney', 'yes', ctx, `${them} handed you ${ctx.amount}.`), { money: amt, bond: -1 }, fctx);
      } else {
        r = G.res('🙅', G.text('interactionText', 'askMoney', 'no', ctx, `${them} said no this time.`), { bond: -2, joy: -1 }, fctx);
      }
    } else if (it.id === 'allowance') {
      const amt = U.clamp(Math.round(L.money * 0.01), 10, 200);
      if (L.money < amt) return G.fail('You need a little money first.');
      ctx.amount = U.money(amt);
      L.money -= amt;
      r = G.res('🪙', G.text('interactionText', 'allowance', 'good', ctx, `You gave ${them} ${ctx.amount} of pocket money.`), { bond: 7, joy: 1 }, fctx);
      r.d.unshift({ k: 'money', v: -amt });
    } else if (it.id === 'petVet') {
      if (st.cost) L.money -= st.cost;
      if (U.chance(0.6)) p.life += 1;
      r = G.res('🩺', G.text('interactionText', 'petVet', 'good', ctx, `${them} got a clean bill of health from the vet.`), { bond: 4 }, fctx);
      if (st.cost) r.d.unshift({ k: 'money', v: -st.cost });
    } else if (it.id === 'endFriendship') {
      p.alive = false;
      p.gone = true;
      L.people = L.people.filter((x) => x !== p);
      r = { emoji: '👋', text: G.text('interactionText', 'endFriendship', 'good', ctx, `You and ${them} decided to go separate ways.`), tone: 'info', d: [] };
    } else if (it.id === 'remember') {
      r = G.res('🌸', G.text('interactionText', 'remember', 'good', ctx, `You smiled thinking about ${them}.`), { joy: 3 });
    } else {
      const buckets = it.buckets || B4;
      let bonus = 0;
      let gift = null;
      if (it.id === 'gift') {
        gift = CL.GIFTS.find((g) => g.id === args.gift);
        if (!gift) return G.fail('Pick a gift first.');
        if (L.money < gift.price) return G.fail(`You need ${U.money(gift.price)}.`);
        L.money -= gift.price;
        ctx.gift = gift.phrase;
        bonus = gift.power * 12 - 8;
      }
      if (it.id === 'compliment') bonus += (L.stats.style - 50) / 5;
      if (it.id === 'joke') bonus += (L.stats.smarts - 50) / 6;
      if (it.id === 'chat') ctx.topic = U.pick(U.list('chatTopics', ['the weather', 'favorite snacks', 'whether cats can count']));
      if (it.id === 'playGame') ctx.game = U.pick(U.list('games', ['checkers', 'cards', 'a jigsaw puzzle']));
      if (it.id === 'chores') ctx.chore = U.pick(U.list('chores', ['doing the dishes', 'raking leaves']));
      if (it.id === 'teach') ctx.lesson = U.pick(U.list('lessons', ['how to ride a bike', 'how to tie shoelaces']));
      if (it.id === 'prank' && p.kind !== 'friend' && p.kind !== 'sibling') bonus -= 10;
      const bi = bucketOf(L, p, buckets, bonus);
      const b = buckets[bi];
      const scale = it.id === 'gift' ? gift.power : k;
      const fx = { bond: Math.round(it.bond[bi] * (it.bond[bi] > 0 ? scale : 1)), joy: it.joy ? Math.round(it.joy[bi] * (it.joy[bi] > 0 ? k : 1)) : 0 };
      if (it.kindness && it.bond[bi] > 0) fx.kindness = it.kindness;
      if (it.health && it.bond[bi] > 0) fx.health = Math.round(it.health * k);
      if (it.id === 'chores' && it.bond[bi] > 0 && U.chance(0.4) && L.age < 18) fx.money = U.ri(1, 10) * L.wealth;
      if (it.id === 'teach' && bi === 0) fx.smarts = 1;
      const fallback = { great: `You and ${them} had a wonderful time.`, good: `You and ${them} had a nice time.`, meh: `You and ${them} hung out. It was okay.`, bad: `Things got a little awkward with ${them}.` }[b] || `You spent some time with ${them}.`;
      r = G.res(it.emoji, G.text('interactionText', it.id, b, ctx, fallback), fx, fctx);
      if (gift && gift.price) r.d.unshift({ k: 'money', v: -gift.price });
      if (it.id === 'prank' && b !== 'bad') L.totals.pranks++;
    }
    p.used[it.id] = n + 1;
    r.title = `${it.label} · ${them}`;
    G.say(r.text, r.emoji, r.tone, r.d);
    if (CL.meta) CL.meta.check();
    G.save();
    return r;
  };

  // ---------------------------------------------------------------- making friends & adopting
  G.makeFriend = function (where) {
    const L = G.life;
    if (G.alive(L, 'friend').length >= 14) return null;
    const f = G.mkPerson(L, 'friend', { age: U.clamp(L.age + U.ri(-3, 3), 3, 110), bond: U.ri(50, 70), met: where || 'around town' });
    L.people.push(f);
    L.totals.friends++;
    return f;
  };
  G.adoptChild = function (age) {
    const L = G.life;
    const kid = G.mkPerson(L, 'child', { age, last: L.last, bond: U.ri(70, 90) });
    kid.adopted = true;
    L.people.push(kid);
    L.totals.kids++;
    return kid;
  };
})(globalThis.CL);
