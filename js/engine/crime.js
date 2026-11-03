/* ChipLife engine — mischief and cartoon heists, court, jail, escapes. Nobody ever gets hurt. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const ct = (key, b, ctx, fb) => G.text('crimeText', key, b, ctx, fb);
  const STREETS = ['Maple Lane', 'Pickle Lane', 'Juniper Road', 'Sunflower Street', 'Acorn Avenue', 'Willow Way', 'Pebble Court', 'Biscuit Boulevard'];
  const HOME_TIERS = [
    { kind: 'the cozy cottage', loot: [200, 1500], rounds: 2, speed: 0.9, years: [1, 2] },
    { kind: 'the big blue house', loot: [1000, 6000], rounds: 3, speed: 1.1, years: [1, 3] },
    { kind: 'the fancy mansion', loot: [6000, 40000], rounds: 4, speed: 1.3, years: [2, 4] },
  ];
  const BANK_TIERS = [
    { tag: 'Small-town branch', loot: [20000, 80000], base: 0.62, rounds: 3, speed: 1, heat: 20, years: [3, 6] },
    { tag: 'Big city bank', loot: [120000, 600000], base: 0.48, rounds: 4, speed: 1.2, heat: 30, years: [5, 10] },
    { tag: 'The national vault', loot: [1000000, 5000000], base: 0.34, rounds: 5, speed: 1.45, heat: 40, years: [8, 15] },
  ];
  const GETAWAYS = [
    { id: 'minivan', label: 'Trusty minivan', emoji: '🚐', mod: 0.05 },
    { id: 'tandem', label: 'Tandem bicycle', emoji: '🚲', mod: -0.04 },
    { id: 'balloon', label: 'Hot-air balloon', emoji: '🎈', mod: 0, wild: 0.18 },
    { id: 'skates', label: 'Roller skates', emoji: '🛼', mod: -0.08 },
  ];
  G.GETAWAYS = GETAWAYS;

  const sly = (L) => (L.perks.includes('sly') ? 0.1 : 0);
  // success / fail / caught
  function roll(L, success, caught) {
    caught = U.clamp(caught + L.notoriety / 300 - sly(L) / 2, 0.02, 0.95);
    success = U.clamp(success + sly(L), 0.02, 0.98);
    if (U.chance(caught)) return 'caught';
    return U.chance(success) ? 'success' : 'fail';
  }
  function juvenile(L, crime, base) {
    const ps = G.parents(L);
    for (const p of ps) p.bond = U.clamp(p.bond - 8, 0, 100);
    L.record.push({ crime: `${crime} (juvenile)`, age: L.age, outcome: 'community service' });
    L.totals.caught++;
    const d = G.fx({ joy: -5, notoriety: 5 });
    return { emoji: '🚨', text: `${base} ${ct('court', 'juvenile', {}, 'Because you are young, the judge gave you community service and a long talk about choices.')}${ps.length ? ' Your parents were very disappointed.' : ''}`, d, tone: 'bad' };
  }
  function trial(crime, years, extraFine) {
    G.ask('trial', {
      emoji: '⚖️', title: 'Your day in court',
      text: `You're on trial for ${crime.toLowerCase()}. Who will speak for you?`,
      choices: ['Public defender (free)', 'Regular lawyer ($5,000)', 'Star lawyer ($50,000)'],
      data: { crime, years, fine: extraFine || 0 },
    });
  }
  G.SYS = G.SYS || {};
  G.SYS.trial = function (idx, data) {
    const L = G.life;
    const costs = [0, 5000, 50000];
    let i = U.clamp(idx | 0, 0, 2);
    let note = '';
    if (L.money < costs[i]) { note = "You couldn't afford that lawyer, so a public defender stepped in. "; i = 0; }
    L.money -= costs[i];
    const d = costs[i] ? [{ k: 'money', v: -costs[i] }] : [];
    const conv = U.clamp(0.82 - [0, 0.18, 0.38][i] - (L.stats.kindness - 50) / 400 + L.notoriety / 400 + L.record.length * 0.03, 0.08, 0.97);
    let r;
    if (U.chance(conv)) {
      const years = U.ri(data.years[0], data.years[1]);
      if (years <= 0) {
        const fine = data.fine || U.ri(300, 1500);
        L.money -= fine;
        L.record.push({ crime: data.crime, age: L.age, outcome: `paid a ${U.money(fine)} fine` });
        d.push({ k: 'money', v: -fine });
        d.push(...G.fx({ joy: -4 }));
        r = { emoji: '⚖️', title: 'Guilty — with a fine', text: note + ct('court', 'fine', { amount: U.money(fine) }, `The judge ordered you to pay a ${U.money(fine)} fine.`), d, tone: 'bad' };
      } else {
        r = { emoji: '⚖️', title: 'Guilty', text: note + ct('court', 'guilty', { years: U.plural(years, 'year') }, `The judge sentenced you to ${U.plural(years, 'year')}.`), d, tone: 'bad' };
        G.say(r.text, r.emoji, r.tone, r.d);
        G.sendToPrison(years, data.crime, true);
        return r;
      }
    } else {
      d.push(...G.fx({ joy: 6 }));
      r = { emoji: '🎉', title: 'Not guilty!', text: note + ct('court', 'notGuilty', {}, 'The jury found you not guilty! You walked out free.'), d, tone: 'good' };
    }
    G.say(r.text, r.emoji, r.tone, r.d);
    return r;
  };

  G.sendToPrison = function (years, crime, quietSentence) {
    const L = G.life;
    if (L.age < 18) {
      const r = juvenile(L, crime, '');
      G.say(r.text, r.emoji, r.tone, r.d);
      return;
    }
    const name = U.pick(U.list('prisonNames', ['Granite Hill Correctional', 'Pinecone Ridge Correctional']));
    if (L.job) G.endJob('fired');
    L.partTime = null;
    if (G.inSchoolAny(L)) {
      G.say(`You had to leave ${L.edu.school}.`, '🎒', 'bad');
      L.edu.stage = 'done';
      L.edu.school = null;
      L.edu.clubs = [];
      L.edu.program = null;
    }
    L.prison = { name, years, left: years, served: 0, behavior: 50 };
    L.record.push({ crime, age: L.age, outcome: `${U.plural(years, 'year')} in jail` });
    L.totals.caught++;
    G.say(ct('prison', 'arrive', { prison: name, years: U.plural(years, 'year') }, `You arrived at ${name} to serve ${U.plural(years, 'year')}.`), '🏛️', 'bad', G.fx({ joy: -8 }));
  };
  function release(L, how) {
    const P = L.prison;
    L.prison = null;
    L.notoriety = Math.max(0, L.notoriety - 20);
    const key = how === 'parole' ? 'parole' : how === 'appeal' ? 'appealWin' : 'release';
    const r = ct('prison', key, { prison: P.name }, `You walked out of ${P.name} a free person!`);
    if (how !== 'appeal') G.say(r, '🔓', 'good', G.fx({ joy: 10 }));
    return r;
  }
  G.prisonYear = function (L) {
    const P = L.prison;
    P.left--;
    P.served++;
    L.totals.prisonYears++;
    L.stats.joy = U.clamp(L.stats.joy - U.ri(1, 4), 0, 100);
    P.behavior = U.clamp(P.behavior + U.ri(-4, 3), 0, 100);
    if (P.left <= 0) return release(L, 'release');
    if (P.served >= Math.ceil(P.years / 2) && P.behavior >= 70) {
      if (U.chance(0.5)) return release(L, 'parole');
      G.say(ct('prison', 'paroleDenied', { prison: P.name }, 'The parole board said "not yet". Keep up the good work!'), '📋', 'info');
    }
    G.say(`${U.plural(P.left, 'year')} left at ${P.name}.`, '🗓️', 'info');
  };
  G.fugitiveYear = function (L) {
    if (U.chance(0.16 + L.notoriety / 300)) {
      const years = (L.fugitiveLeft || 2) + 2;
      L.fugitive = 0;
      G.say('The police finally caught up with you and sent you back to jail — with extra time.', '🚔', 'bad');
      G.sendToPrison(years, 'Escaping jail');
      return;
    }
    L.fugitive--;
    if (L.fugitive <= 0) G.say('The police have stopped looking for you. You can finally relax… mostly.', '😮‍💨', 'good');
  };

  // ---------------------------------------------------------------- the mischief acts
  const looted = (L) => { L.totals.crimes++; };
  G.act({
    id: 'prank', cat: 'mischief', label: 'Pull a prank', emoji: '🤪', desc: 'Harmless silly fun. Mostly harmless.', minAge: 6, perYear: 4,
    run(L) {
      const ctx = { prank: U.pick(U.list('pranks', ['filled the principal\'s office with balloons'])) };
      const o = roll(L, 0.65 + L.stats.style / 600, 0.16);
      if (o === 'success') { L.totals.pranks++; return G.res('🤪', ct('prank', 'success', ctx, `You ${ctx.prank}. Legendary.`), { joy: U.ri(4, 7), notoriety: 2 }); }
      if (o === 'fail') return G.res('🤷', ct('prank', 'fail', ctx, 'Your prank fizzled out before anyone noticed.'), { joy: -1 });
      if (L.age < 18) {
        const p = U.pick(G.parents(L));
        return G.res('🚨', ct('prank', 'caught', ctx, 'You got caught and spent a week grounded.') + (p ? ' You were grounded for a week.' : ''), { joy: -4, notoriety: 3, bond: p ? -4 : 0 }, { bondTarget: p && p.id });
      }
      const fine = U.ri(50, 150);
      return G.res('🚨', ct('prank', 'caught', ctx, 'You got caught mid-prank.') + ` You paid a ${U.money(fine)} fine.`, { fine, notoriety: 4, joy: -2 });
    },
  });
  G.act({
    id: 'shoplift', cat: 'mischief', label: 'Shoplift', emoji: '🛍️', desc: 'Sneak something out of a store.', minAge: 10, perYear: 3,
    steps: [{ type: 'pick', key: 'store', title: 'Which store?', options: () => U.sample(U.list('stores', ['the corner candy shop', 'the toy store', 'the bookshop']), 4).map((s) => ({ id: s, label: U.cap(s), emoji: '🏪' })) }],
    run(L, a) {
      const store = a.store || 'the corner candy shop';
      const loot = U.pick(U.list('shopLoot', ['a pack of glitter pens']));
      const ctx = { store, loot };
      looted(L);
      const o = roll(L, 0.6 + L.stats.style / 700, 0.22);
      if (o === 'success') {
        G.addItem({ name: U.cap(loot.replace(/^(a|an|the|some)\s+/i, '')), emoji: '🛍️', value: U.ri(5, 60), kind: 'loot' });
        return G.res('🛍️', ct('shoplift', 'success', ctx, `You slipped out of ${store} with ${loot}.`), { joy: 3, notoriety: 4, kindness: -2 });
      }
      if (o === 'fail') return G.res('😅', ct('shoplift', 'fail', ctx, 'You lost your nerve and put it back.'), { joy: -1 });
      const base = ct('shoplift', 'caught', ctx, `A store clerk at ${store} caught you red-handed.`);
      if (L.age < 18) return juvenile(L, 'Shoplifting', base);
      const fine = U.ri(150, 600);
      L.record.push({ crime: 'Shoplifting', age: L.age, outcome: `paid a ${U.money(fine)} fine` });
      L.totals.caught++;
      return G.res('🚨', `${base} You paid a ${U.money(fine)} fine.`, { fine, notoriety: 8, joy: -4 });
    },
  });
  G.act({
    id: 'pickpocket', cat: 'mischief', label: 'Pickpocket', emoji: '👛', desc: 'Very sneaky fingers required.', minAge: 12, perYear: 3,
    run(L) {
      const target = U.pick(U.list('pickpocketTargets', ['a tourist busy taking selfies']));
      looted(L);
      const o = roll(L, 0.55 + L.stats.smarts / 800, 0.24);
      if (o === 'success') {
        const amt = L.age < 18 ? U.ri(5, 80) : U.ri(20, 450);
        return G.res('👛', ct('pickpocket', 'success', { target, amount: U.money(amt) }, `You lifted ${U.money(amt)} from ${target}.`), { money: amt, notoriety: 5, kindness: -3 });
      }
      if (o === 'fail') return G.res('😅', ct('pickpocket', 'fail', { target }, `${U.cap(target)} turned around just in time. You walked away whistling.`), { joy: -1 });
      const base = ct('pickpocket', 'caught', { target }, 'A police officer saw the whole thing.');
      if (L.age < 18) return juvenile(L, 'Pickpocketing', base);
      trial('Pickpocketing', [0, 1], U.ri(300, 900));
      return G.res('🚨', base, { notoriety: 10, joy: -4 });
    },
  });
  G.act({
    id: 'burglary', cat: 'mischief', label: 'Burgle a house', emoji: '🏚️', desc: 'Crack the lock, grab the loot.', minAge: 16, perYear: 2,
    steps: [
      { type: 'pick', key: 'home', title: 'Pick a house', options: () => HOME_TIERS.map((h, i) => ({ id: `${i}|${h.kind} on ${U.pick(STREETS)}`, label: U.cap(`${h.kind}`), emoji: ['🏡', '🏠', '🏰'][i], sub: ['Easy lock · small loot', 'Tricky lock · decent loot', 'Very tricky lock · big loot'][i] })) },
      { type: 'mini', mini: 'dial', opts: (L, a) => { const h = HOME_TIERS[+String(a.home).split('|')[0]] || HOME_TIERS[0]; return { rounds: h.rounds, speed: h.speed, title: 'Pick the lock!' }; } },
    ],
    run(L, a) {
      const [ti, ...rest] = String(a.home || '0|the cozy cottage on Maple Lane').split('|');
      const h = HOME_TIERS[+ti] || HOME_TIERS[0];
      const home = rest.join('|') || `${h.kind} on Maple Lane`;
      looted(L);
      const dial = a.mini && a.mini.success;
      const o = dial ? roll(L, 0.85 - +ti * 0.08, 0.12 + +ti * 0.05) : U.chance(0.65 - sly(L)) ? 'caught' : 'fail';
      if (o === 'success') {
        const amt = U.ri(h.loot[0], h.loot[1]);
        return G.res('💰', ct('burglary', 'success', { home, amount: U.money(amt) }, `You tiptoed out of ${home} with ${U.money(amt)}.`), { money: amt, notoriety: 10 + +ti * 5, kindness: -4 });
      }
      if (o === 'fail') return G.res('😅', (dial ? '' : 'The alarm started beeping, so you ran for it! ') + ct('burglary', 'fail', { home }, 'You left empty-handed.'), { joy: -2, notoriety: 3 });
      const base = (dial ? '' : 'BEEP BEEP BEEP! You set off the alarm. ') + ct('burglary', 'caught', { home }, `The police were waiting outside ${home}.`);
      if (L.age < 18) return juvenile(L, 'Burglary', base);
      trial('Burglary', h.years);
      return G.res('🚨', base, { notoriety: 15, joy: -5 });
    },
  });
  G.act({
    id: 'carTheft', cat: 'mischief', label: 'Steal a car', emoji: '🚙', desc: 'Hot-wire a ride. Keep it or sell it.', minAge: 16, perYear: 2,
    steps: [
      { type: 'pick', key: 'car', title: 'Which car?', options: () => U.sample(U.list('stealCars', ['a shiny red convertible', 'an ice cream truck', 'a mint-green hatchback']), 3).map((c, i) => ({ id: `${i}|${c}`, label: U.cap(c), emoji: ['🚗', '🚙', '🏎️'][i], sub: ['Easy · cheap', 'Medium · nice', 'Hard · fancy'][i] })) },
      { type: 'mini', mini: 'dial', opts: (L, a) => ({ rounds: 2 + (+String(a.car).split('|')[0] || 0), speed: 1 + 0.15 * (+String(a.car).split('|')[0] || 0), title: 'Hot-wire it!' }) },
    ],
    run(L, a) {
      const [ti, ...rest] = String(a.car || '0|a shiny red convertible').split('|');
      const car = rest.join('|');
      looted(L);
      const dial = a.mini && a.mini.success;
      const o = dial ? roll(L, 0.8 - +ti * 0.1, 0.15 + +ti * 0.05) : U.chance(0.5 - sly(L)) ? 'caught' : 'fail';
      if (o === 'success') {
        const value = [U.ri(3000, 10000), U.ri(10000, 30000), U.ri(30000, 90000)][+ti] || 5000;
        L.assets.push({ id: U.uid(), type: 'vehicle', cat: null, name: U.cap(car.replace(/^(a|an|the)\s+/i, '')), emoji: '🚙', value, price: value, stolen: true, bought: L.age });
        return G.res('🚙', ct('carTheft', 'success', { car }, `You drove off in ${car}!`) + ' (Selling stolen cars only gets you 40% of their value.)', { notoriety: 12 + +ti * 4, joy: 4, kindness: -4 });
      }
      if (o === 'fail') return G.res('😅', ct('carTheft', 'fail', { car }, 'The engine just would not start.'), { joy: -2 });
      const base = ct('carTheft', 'caught', { car }, 'Flashing lights appeared in the mirror.');
      if (L.age < 18) return juvenile(L, 'Car theft', base);
      trial('Car theft', [1, 2 + +ti]);
      return G.res('🚨', base, { notoriety: 15, joy: -5 });
    },
  });
  G.act({
    id: 'bankHeist', cat: 'mischief', label: 'Plan a bank heist', emoji: '🏦', desc: 'The big one. Plan, crack the vault, get away.', minAge: 18, perYear: 1,
    steps: [
      { type: 'pick', key: 'bank', title: 'Choose your target', options: () => { const names = U.sample(U.list('bankNames', ['Acorn Savings Bank', 'Golden Oak Bank', 'Grand National Bank']), 3); return BANK_TIERS.map((b, i) => ({ id: `${i}|${names[i] || 'Grand National Bank'}`, label: names[i] || 'Grand National Bank', emoji: ['🏦', '🏙️', '🏛️'][i], sub: `${b.tag} · loot ${U.money(b.loot[0])}–${U.money(b.loot[1])}` })); } },
      { type: 'pick', key: 'approach', title: 'How will you get in?', options: (L) => [
        { id: 'tunnel', label: 'Dig a tunnel', emoji: '⛏️', sub: `Uses Health (${L.stats.health})` },
        { id: 'disguise', label: 'Wear a clever disguise', emoji: '🥸', sub: `Uses Style + Acting (${Math.round((L.stats.style + L.skills.acting) / 2)})` },
        { id: 'hack', label: 'Hack the security system', emoji: '💻', sub: `Uses Smarts + Coding (${Math.round((L.stats.smarts + L.skills.coding) / 2)})` },
      ] },
      { type: 'pick', key: 'crew', title: 'Bring a partner?', options: (L) => [{ id: 'solo', label: 'Go solo', emoji: '🐿️', sub: 'Keep all the loot' }].concat(G.alive(L, 'friend').filter((f) => f.bond >= 30).sort((x, y) => y.bond - x.bond).slice(0, 5).map((f) => ({ id: f.id, label: `Bring ${f.first}`, emoji: G.faceOf(f), sub: `Bond ${f.bond} · they take 30%` }))) },
      { type: 'mini', mini: 'dial', opts: (L, a) => { const b = BANK_TIERS[+String(a.bank).split('|')[0]] || BANK_TIERS[0]; return { rounds: b.rounds, speed: b.speed, title: 'Crack the vault!' }; } },
      { type: 'pick', key: 'getaway', title: 'Getaway vehicle', options: () => GETAWAYS.map((g) => ({ id: g.id, label: g.label, emoji: g.emoji })) },
    ],
    run(L, a) {
      const [ti, ...rest] = String(a.bank || '0|Acorn Savings Bank').split('|');
      const tier = BANK_TIERS[+ti] || BANK_TIERS[0];
      const bank = rest.join('|') || 'Acorn Savings Bank';
      const ctx = { bank };
      looted(L);
      let p = tier.base;
      const stat = a.approach === 'tunnel' ? L.stats.health : a.approach === 'disguise' ? (L.stats.style + L.skills.acting) / 2 : (L.stats.smarts + L.skills.coding) / 2;
      p += (stat - 50) / 250;
      const lines = [ct('heistPlan', a.approach || 'tunnel', ctx, `The plan to hit ${bank} was ready.`)];
      const friend = a.crew && a.crew !== 'solo' ? G.person(a.crew) : null;
      let share = 1;
      if (friend && friend.alive) {
        if (friend.bond < 50 && U.chance(0.3)) {
          lines.push(`${friend.first} got cold feet and backed out at the last second!`);
          p -= 0.08;
          friend.bond = U.clamp(friend.bond - 10, 0, 100);
        } else {
          p += 0.08 + friend.bond / 1000;
          share = 0.7;
        }
      }
      if (!(a.mini && a.mini.success)) { p -= 0.35; lines.push('The vault dial clicked the wrong way and an alarm began to wail!'); }
      const g = GETAWAYS.find((x) => x.id === a.getaway) || GETAWAYS[0];
      p += g.mod + (g.wild ? U.rf(-g.wild, g.wild) : 0);
      p -= L.notoriety / 300;
      p += sly(L);
      p = U.clamp(p, 0.03, 0.92);
      if (U.chance(p)) {
        const loot = U.ri(tier.loot[0], tier.loot[1]);
        const mine = Math.round(loot * share);
        L.totals.heists++;
        lines.push(ct('bankHeist', 'success', { bank, amount: U.money(loot) }, `You got away with ${U.money(loot)} from ${bank}!`));
        lines.push(ct('getaway', 'success', {}, `You zoomed off in your ${g.label.toLowerCase()}.`));
        if (share < 1) { lines.push(`${friend.first} took their 30% cut.`); friend.bond = U.clamp(friend.bond + 10, 0, 100); }
        return G.res('💰', lines.join(' '), { money: mine, notoriety: tier.heat, fame: 3, joy: 10, kindness: -5 }, null, { title: 'The heist worked!' });
      }
      if (U.chance(0.72)) {
        lines.push(ct('bankHeist', 'caught', { bank }, `Security at ${bank} was ready for you.`));
        lines.push(ct('getaway', 'caught', {}, 'Your getaway did not go as planned.'));
        if (friend && share < 1) friend.bond = U.clamp(friend.bond - 15, 0, 100);
        trial('Bank robbery', tier.years);
        return G.res('🚨', lines.join(' '), { notoriety: tier.heat, joy: -8 }, null, { title: 'Busted!' });
      }
      lines.push(ct('bankHeist', 'fail', { bank }, 'Something felt off, so you called the whole thing off and slipped away.'));
      return G.res('😮‍💨', lines.join(' '), { notoriety: 6, joy: -3 }, null, { title: 'Called off' });
    },
  });

  // ---------------------------------------------------------------- jail acts
  const P = () => G.life.prison;
  function pAct(id, label, emoji, desc, key, fx, extra) {
    G.act(Object.assign({
      id, cat: 'prison', label, emoji, desc, perYear: 3,
      run(L, a, n) {
        const k = G.dim(n);
        const out = typeof fx === 'function' ? fx(L, k) : fx;
        if (out.behavior) { P().behavior = U.clamp(P().behavior + out.behavior, 0, 100); delete out.behavior; }
        return G.res(emoji, ct('prison', key, { prison: P().name }, `You spent some time at ${P().name}.`), out);
      },
    }, extra || {}));
  }
  pAct('pStudy', 'Study in the library', '📚', 'Read, learn and grow.', 'study', (L, k) => ({ smarts: Math.max(1, Math.round(U.ri(2, 4) * k)), behavior: 3 }));
  pAct('pWorkout', 'Work out in the yard', '🏋️', 'Stay strong and healthy.', 'workout', (L, k) => ({ health: Math.max(1, Math.round(U.ri(2, 5) * k)), style: 1 }));
  pAct('pBehave', 'Help out & behave', '😇', 'Good behavior can get you out early.', 'behave', (L, k) => ({ kindness: 2, joy: 1, behavior: Math.round(U.ri(8, 14) * k) || 2 }));
  pAct('pKitchen', 'Kitchen shift', '🥘', 'Earn a few dollars cooking.', 'kitchen', () => ({ money: U.ri(40, 90), skills: { cooking: 2 }, behavior: 4 }));
  G.act({
    id: 'pFriend', cat: 'prison', label: 'Befriend an inmate', emoji: '🤝', desc: 'Everyone needs a friend.', perYear: 2,
    run(L) {
      const f = G.makeFriend('jail');
      if (!f) return G.fail('You already have plenty of friends.');
      return G.res('🤝', ct('prison', 'makeFriend', { prison: P().name, them: f.first }, `You became friends with ${f.first}.`), { joy: 4 });
    },
  });
  G.act({
    id: 'pAppeal', cat: 'prison', label: 'File an appeal', emoji: '📜', desc: 'Ask a judge to look at your case again.', perYear: 1,
    steps: [{ type: 'pick', key: 'lawyer', title: 'Who will file it?', options: (L) => [
      { id: '0', label: 'Do it myself', emoji: '✍️', sub: 'Free · long shot' },
      { id: '1', label: 'Hire a lawyer', emoji: '💼', sub: '$8,000 · decent odds', disabled: L.money < 8000 },
      { id: '2', label: 'Hire a star lawyer', emoji: '🌟', sub: '$40,000 · good odds', disabled: L.money < 40000 },
    ] }],
    run(L, a) {
      const i = U.clamp(+a.lawyer || 0, 0, 2);
      const cost = [0, 8000, 40000][i];
      if (L.money < cost) return G.fail(`You need ${U.money(cost)}.`);
      L.money -= cost;
      const d = cost ? [{ k: 'money', v: -cost }] : [];
      if (U.chance([0.07, 0.25, 0.45][i] + L.stats.smarts / 1000)) {
        const name = P().name;
        const text = release(L, 'appeal');
        d.push(...G.fx({ joy: 12 }));
        return { emoji: '🔓', text: text || `Your appeal worked! You walked out of ${name}.`, d, tone: 'good' };
      }
      d.push(...G.fx({ joy: -3 }));
      return { emoji: '📜', text: ct('prison', 'appealLose', { prison: P().name }, 'The judge denied your appeal.'), d, tone: 'bad' };
    },
  });
  G.act({
    id: 'pEscape', cat: 'prison', label: 'Try to escape', emoji: '🕳️', desc: 'Sneak past the searchlights. Risky!', perYear: 1,
    steps: [{ type: 'mini', mini: 'sneak', opts: (L) => ({ guards: L.prison.years >= 8 ? 4 : L.prison.years >= 4 ? 3 : 2 }) }],
    run(L, a) {
      const Pr = P();
      if (a.mini && a.mini.success) {
        L.prison = null;
        L.fugitive = 6;
        L.fugitiveLeft = Pr.left;
        L.totals.escapes++;
        return G.res('🏃', ct('prison', 'escapeSuccess', { prison: Pr.name }, `You escaped from ${Pr.name}!`) + ' The police will be looking for you for a while.', { joy: 12, notoriety: 30 });
      }
      Pr.left += 2;
      Pr.years += 2;
      Pr.behavior = U.clamp(Pr.behavior - 20, 0, 100);
      return G.res('🔦', ct('prison', 'escapeCaught', { prison: Pr.name }, 'A searchlight found you halfway across the yard.') + ' Two years were added to your sentence.', { joy: -6, notoriety: 5 });
    },
  });
})(globalThis.CL);
