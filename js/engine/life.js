/* ChipLife engine — the life object, the yearly loop, health, family, death and legacy. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = (CL.G = CL.G || {});
  G.life = null;
  G.meta = null;

  const FALLBACK_COUNTRY = {
    id: 'chipland', name: 'Chipland', flag: '🌰', cities: ['Acorn City', 'Hazelton', 'Oakbrook'],
    boy: ['Sam', 'Leo', 'Max', 'Finn'], girl: ['Mia', 'Ava', 'Lily', 'Zoe'], last: ['Hazel', 'Oakley', 'Burrow', 'Pine'],
  };
  const STAT_IDS = CL.STATS.map((s) => s.id);

  // ---------------------------------------------------------------- lookups
  G.countries = () => (CL.content.countries.length ? CL.content.countries : [FALLBACK_COUNTRY]);
  G.country = (id) => G.countries().find((c) => c.id === id) || G.countries()[0];
  G.alive = (L, kind) => L.people.filter((p) => p.alive && (!kind || p.kind === kind));
  G.parents = (L) => L.people.filter((p) => p.alive && (p.kind === 'mother' || p.kind === 'father'));
  G.person = (id) => (G.life ? G.life.people.find((p) => p.id === id) : null);
  G.illness = (id) => CL.content.catalog.illnesses.find((i) => i.id === id);
  G.petInfo = (id) => CL.content.catalog.pets.find((p) => p.id === id) || { id, name: U.cap(String(id).replace('_', ' ')), emoji: '🐾', life: [8, 14], upkeep: 400, fee: 50, breeds: [] };
  G.rand = U;

  // ---------------------------------------------------------------- people helpers
  G.mkPerson = function (L, kind, o = {}) {
    const C = G.country(L.country);
    const gender = o.gender || U.pick(['boy', 'girl']);
    return {
      id: U.uid(), kind, gender,
      first: o.first || U.pick(C[gender] || C.boy) || 'Sam',
      last: o.last || U.pick(C.last) || L.last,
      age: o.age != null ? o.age : 0, alive: true,
      bond: o.bond != null ? o.bond : U.ri(50, 80),
      job: o.job || null, met: o.met || null, used: {},
    };
  };
  G.addPet = function (species, o = {}) {
    const L = G.life;
    const info = G.petInfo(species);
    const pet = {
      id: U.uid(), kind: 'pet', species: info.id, petType: info.name.toLowerCase(), emoji: info.emoji || '🐾',
      first: o.name || U.pick(U.list('petNames', ['Biscuit', 'Pickles', 'Nugget', 'Mochi', 'Pepper', 'Waffles'])),
      breed: U.pick(info.breeds || []) || info.name, gender: U.pick(['boy', 'girl']),
      age: o.age != null ? o.age : U.ri(0, 2), alive: true, bond: U.ri(60, 85), used: {},
      life: U.ri((info.life || [8, 14])[0], (info.life || [8, 14])[1]),
    };
    L.people.push(pet);
    L.totals.pets++;
    if (!o.silent) G.say(`You welcomed ${pet.first} the ${pet.breed.toLowerCase() === pet.petType ? pet.petType : pet.breed + ' ' + pet.petType} into your home!`, pet.emoji, 'good');
    return pet;
  };
  G.roleOf = function (p) {
    const g = p.gender === 'girl';
    switch (p.kind) {
      case 'mother': return 'Mom';
      case 'father': return 'Dad';
      case 'grandparent': return g ? 'Grandma' : 'Grandpa';
      case 'sibling': return g ? 'Sister' : 'Brother';
      case 'child': return g ? 'Daughter' : 'Son';
      case 'pet': return U.cap(p.petType);
      default: return 'Friend';
    }
  };
  // How the person is called inside sentences ("Mom", "Grandma Rosa", "Leo").
  G.callName = function (p) {
    if (p.kind === 'mother') return 'Mom';
    if (p.kind === 'father') return 'Dad';
    if (p.kind === 'grandparent') return `${G.roleOf(p)} ${p.first}`;
    return p.first;
  };
  // "your mom", "your grandma Rosa", "your friend Leo", "Biscuit the dog"
  G.whoOf = function (p) {
    switch (p.kind) {
      case 'mother': return 'your mom';
      case 'father': return 'your dad';
      case 'grandparent': return `your ${G.roleOf(p).toLowerCase()} ${p.first}`;
      case 'pet': return `${p.first} the ${p.petType}`;
      default: return `your ${G.roleOf(p).toLowerCase()} ${p.first}`;
    }
  };
  G.faceOf = function (p) {
    if (p.kind === 'pet') return p.emoji || '🐾';
    const g = p.gender === 'girl';
    if (p.age < 3) return '👶';
    if (p.age < 13) return g ? '👧' : '👦';
    if (p.age < 20) return g ? '👱‍♀️' : '🧑';
    if (p.age < 60) return g ? '👩' : '👨';
    return g ? '👵' : '👴';
  };
  G.myFace = (L) => (L.prison ? '🧑‍🎤' : G.faceOf({ kind: 'me', gender: L.gender, age: L.age }));

  // ---------------------------------------------------------------- journal
  G.say = function (text, emoji, tone, deltas) {
    const L = G.life;
    if (!L) return;
    let y = L.log[L.log.length - 1];
    if (!y || y.age !== L.age) {
      y = { age: L.age, year: L.birthYear + L.age, items: [] };
      L.log.push(y);
    }
    if (!text) return;
    const item = { e: emoji || '•', t: String(text), k: tone || 'info' };
    if (deltas && deltas.length) item.d = deltas;
    y.items.push(item);
  };
  G.tip = (text) => G.say(text, '🐿️', 'chip');

  // ---------------------------------------------------------------- effects
  // Applies an effects object (see CONTENT_GUIDE section 5) and returns the visible changes.
  G.fx = function (fx, ctx = {}) {
    const L = G.life;
    const out = [];
    if (!fx || !L) return out;
    for (const k of Object.keys(fx)) {
      const v = fx[k];
      if (v === undefined || v === null || v === false) continue;
      if (STAT_IDS.includes(k)) {
        const b = L.stats[k];
        L.stats[k] = U.clamp(Math.round(b + v), 0, 100);
        if (L.stats[k] !== b) out.push({ k, v: L.stats[k] - b });
      } else if (k === 'money') {
        const m = Math.round(v);
        if (m) { L.money += m; if (m > 0) L.totals.earned += m; out.push({ k: 'money', v: m }); }
      } else if (k === 'fine') {
        L.money -= Math.round(v);
        out.push({ k: 'money', v: -Math.round(v) });
      } else if (k === 'fame' || k === 'notoriety') {
        const b = L[k];
        L[k] = U.clamp(Math.round(b + v), 0, 100);
        if (L[k] !== b) out.push({ k, v: L[k] - b });
      } else if (k === 'followers') {
        const b = L.followers;
        L.followers = Math.max(0, Math.round(b + v));
        if (L.followers !== b) out.push({ k, v: L.followers - b });
      } else if (k === 'bond') {
        const p = ctx.bondTarget && G.person(ctx.bondTarget);
        if (p && p.alive) {
          const b = p.bond;
          p.bond = U.clamp(Math.round(b + v), 0, 100);
          if (p.bond !== b) out.push({ k: 'bond', v: p.bond - b, who: G.callName(p) });
        }
      } else if (k === 'skills') {
        for (const s of Object.keys(v)) {
          if (L.skills[s] == null) continue;
          const b = L.skills[s];
          L.skills[s] = U.clamp(Math.round(b + v[s]), 0, 100);
          if (L.skills[s] !== b) out.push({ k: 'skill', s, v: L.skills[s] - b });
        }
      } else if (k === 'grades') {
        if (G.inSchoolAny(L)) {
          const b = L.edu.grades;
          L.edu.grades = U.clamp(Math.round(b + v), 0, 100);
          if (L.edu.grades !== b) out.push({ k: 'grades', v: L.edu.grades - b });
        }
      } else if (k === 'performance') {
        const j = L.job || L.partTime;
        if (j) {
          const b = j.perf;
          j.perf = U.clamp(Math.round(b + v), 0, 100);
          if (j.perf !== b) out.push({ k: 'perf', v: j.perf - b });
        }
      } else if (k === 'newFriend') {
        const nf = ctx.newFriendPerson;
        if (nf && !L.people.some((p) => p.id === nf.id)) {
          L.people.push(nf);
          L.totals.friends++;
          out.push({ k: 'friend', who: nf.first });
        }
      } else if (k === 'addPet') {
        if (G.alive(L, 'pet').length < 8) {
          const pet = G.addPet(v, { silent: true });
          out.push({ k: 'pet', who: pet.first });
          ctx.extraLine = `You named your new ${pet.petType} ${pet.first}.`;
        }
      } else if (k === 'illness') {
        G.catchIllness(v, true);
      } else if (k === 'gainItem') {
        G.addItem({ name: U.cap(String(v).replace(/^(a|an|the|some)\s+/i, '')), emoji: '🎁', value: 0, kind: 'gift' });
      } else if (k === 'record') {
        L.record.push({ crime: String(v), age: L.age, outcome: fx.fine ? `paid a ${U.money(fx.fine)} fine` : 'a warning' });
      } else if (k === 'jail') {
        if (!L.prison) G.sendToPrison(Math.round(v), ctx.crimeName || (fx.record ? String(fx.record) : 'Mischief'));
      } else if (k === 'endJob') {
        if (L.job) G.endJob('laidoff');
        else if (L.partTime) { L.partTime = null; }
      }
    }
    return out;
  };

  // ---------------------------------------------------------------- health
  G.catchIllness = function (id, quiet) {
    const L = G.life;
    const ill = G.illness(id);
    if (!ill || L.conditions.some((c) => c.id === id)) return;
    L.conditions.push({ id, name: ill.name, emoji: ill.emoji, years: 0 });
    if (!quiet) G.say(U.fill(ill.text || `You came down with ${ill.name}.`, { name: L.first }), ill.emoji || '🤒', 'bad');
  };
  G.cure = function (id) {
    const L = G.life;
    const ill = G.illness(id);
    L.conditions = L.conditions.filter((c) => c.id !== id);
    return ill ? U.fill(ill.curedText || `You're over your ${ill.name}!`, { name: L.first }) : 'You feel much better!';
  };
  G.mortality = (age) => (age < 55 ? 0.0004 : Math.min(0.6, 0.004 * Math.pow(1.095, age - 60)));

  function healthYear(L) {
    const a = L.age;
    let drift = 0;
    if (a >= 30) drift -= a < 50 ? U.rf(0.3, 1.5) : a < 70 ? U.rf(1, 2.8) : U.rf(2, 4.2);
    if (L.perks.includes('longLife')) drift *= 0.6;
    if (L.stats.joy < 25) drift -= 1;
    if (a < 25 && L.stats.health < 75) drift += 2;
    L.stats.health = U.clamp(Math.round(L.stats.health + drift), 0, 100);

    for (const c of L.conditions.slice()) {
      const ill = G.illness(c.id);
      c.years++;
      L.stats.health = U.clamp(L.stats.health - Math.round((ill ? ill.healthHit : 4) * U.rf(0.5, 1.1)), 0, 100);
      const kidCare = a < 18 && G.parents(L).length && U.chance(0.5); // parents take kids to the doctor
      if (U.chance(ill ? ill.selfHeal : 0.3) || kidCare) G.say(G.cure(c.id), '🌈', 'good');
    }
    const p = 0.06 + Math.max(0, 60 - L.stats.health) / 350 + Math.max(0, a - 55) / 260;
    if (U.chance(p)) {
      const pool = CL.content.catalog.illnesses.filter((i) => a >= i.minAge && a <= i.maxAge && !L.conditions.some((c) => c.id === i.id));
      if (pool.length) G.catchIllness(U.pickW(pool, (i) => 4 - (i.severity || 1)).id);
    }
    if (a < 18) L.stats.health = Math.max(L.stats.health, 12); // kids are looked after
  }

  function statDrift(L) {
    const s = L.stats;
    let target = 56;
    if (L.prison) target -= 18;
    if (L.money < 0 && L.age >= 18) target -= 10;
    const close = L.people.filter((p) => p.alive && p.kind !== 'pet');
    if (close.length) target += U.clamp(close.reduce((t, p) => t + p.bond, 0) / close.length / 8 - 6, -6, 6);
    if (G.alive(L, 'pet').length) target += 3;
    if (L.job) target += (L.job.perf - 50) / 12;
    target -= 4 * L.conditions.length;
    if (L.home === 'parents' && L.age >= 24) target -= 5;
    if (L.retired) target += 4;
    s.joy = U.clamp(Math.round(s.joy + (target - s.joy) * 0.15 + U.ri(-3, 3)), 0, 100);
    if (L.age >= 12 && L.age < 25) s.style = U.clamp(s.style + U.ri(-1, 3), 0, 100);
    if (L.age > 45) s.style = U.clamp(s.style - U.ri(0, 2), 0, 100);
    if (L.age < 23 && G.inSchoolAny(L)) s.smarts = U.clamp(s.smarts + U.ri(0, 2), 0, 100);
    if (L.age > 72) s.smarts = U.clamp(s.smarts - U.ri(0, 2), 0, 100);
    s.kindness = U.clamp(Math.round(s.kindness + (50 - s.kindness) * 0.03), 0, 100);
    L.notoriety = Math.max(0, L.notoriety - U.ri(4, 9));
    if (!L.uses.video) L.followers = Math.round(L.followers * 0.93);
    L.fame = Math.max(G.followerFame(L.followers), L.fame - U.ri(1, 4));
  }
  G.followerFame = (f) => Math.round(U.clamp(Math.log10(f + 1) * 16 - 30, 0, 100));

  // ---------------------------------------------------------------- family
  function makeFamily(L) {
    const parentJob = () => {
      const js = CL.content.jobs;
      if (!js.length) return null;
      const j = U.pick(js);
      return j.levels[Math.min(j.levels.length - 1, U.ri(0, 2))];
    };
    const single = U.chance(0.12);
    const momAge = U.ri(22, 40);
    const parents = [];
    if (!single || U.chance(0.55)) parents.push(G.mkPerson(L, 'mother', { gender: 'girl', age: momAge, last: L.last, job: parentJob(), bond: U.ri(65, 92) }));
    if (!single || !parents.length) parents.push(G.mkPerson(L, 'father', { gender: 'boy', age: U.clamp(momAge + U.ri(-3, 6), 21, 48), last: L.last, job: parentJob(), bond: U.ri(60, 90) }));
    L.people.push(...parents);
    const ng = U.ri(1, 4);
    for (let i = 0; i < ng; i++) {
      L.people.push(G.mkPerson(L, 'grandparent', { gender: i % 2 ? 'boy' : 'girl', age: U.ri(52, 84), last: i < 2 ? L.last : null, bond: U.ri(55, 92) }));
    }
    const youngest = Math.min(...parents.map((p) => p.age));
    const ns = U.pickW([0, 1, 2, 3], (n) => [42, 35, 17, 6][n]);
    for (let i = 0; i < ns; i++) L.people.push(G.mkPerson(L, 'sibling', { age: U.ri(1, Math.max(1, Math.min(14, youngest - 19))), last: L.last, bond: U.ri(45, 85) }));
    return parents;
  }

  function peopleYear(L) {
    for (const p of L.people) {
      if (!p.alive) continue;
      const touched = p.used && Object.keys(p.used).length > 0;
      p.used = {};
      if (p.kind === 'pet') {
        if (!touched) p.bond = U.clamp(p.bond - U.ri(1, 4), 0, 100);
        if (p.age >= p.life) {
          p.alive = false;
          p.diedAt = L.age;
          G.say(`${p.first} the ${p.petType} had a long, cozy life and has crossed the rainbow bridge.`, '🌈', 'sad');
          L.stats.joy = U.clamp(L.stats.joy - Math.round(4 + p.bond / 15), 0, 100);
        }
        continue;
      }
      if (!touched) {
        const decay = p.kind === 'friend' ? U.ri(2, 6) : p.kind === 'child' ? U.ri(1, 3) : U.ri(0, 3);
        p.bond = U.clamp(p.bond - decay, 0, 100);
      }
      if (p.kind === 'friend' && p.bond < 8) {
        p.gone = true;
        G.say(`You and ${p.first} slowly drifted apart.`, '🍂', 'info');
        continue;
      }
      if (p.kind === 'child' && p.age === 18) G.say(`Your ${G.roleOf(p).toLowerCase()} ${p.first} turned 18 and set off on their own adventure!`, '🎒', 'good');
      if (p.age >= 58 && U.chance(G.mortality(p.age) * 1.15)) G.passAway(p);
    }
    L.people = L.people.filter((p) => !p.gone);

    const mom = G.alive(L, 'mother')[0];
    if (mom && L.age <= 10 && mom.age <= 41 && G.alive(L, 'sibling').length < 4 && U.chance(0.08)) {
      const sib = G.mkPerson(L, 'sibling', { age: 0, last: L.last, bond: U.ri(55, 80) });
      L.people.push(sib);
      G.say(`Your family welcomed a new baby ${sib.gender === 'girl' ? 'sister' : 'brother'}, ${sib.first}!`, '🍼', 'good');
    }
  }

  G.passAway = function (p) {
    const L = G.life;
    p.alive = false;
    p.diedAt = L.age;
    G.say(`${U.cap(G.whoOf(p))} passed away peacefully at ${p.age}. You'll treasure your memories together forever.`, '🕊️', 'sad');
    L.stats.joy = U.clamp(L.stats.joy - Math.round((p.kind === 'friend' ? 4 : 9) * (0.5 + p.bond / 100)), 0, 100);
    if (p.kind === 'mother' || p.kind === 'father' || p.kind === 'grandparent') {
      const range = { 1: [0, 12000], 2: [15000, 140000], 3: [180000, 2500000] }[L.wealth] || [0, 10000];
      let amt = U.ri(range[0], range[1]);
      if (p.kind === 'grandparent') amt = U.chance(0.5) ? Math.round(amt / 5) : 0;
      else if (G.parents(L).length) amt = Math.round(amt / 2);
      amt = Math.round(amt / (1 + G.alive(L, 'sibling').length));
      if (amt >= 100) {
        L.money += amt;
        G.say(`${U.cap(G.whoOf(p))} left you ${U.money(amt)} in their will.`, '📜', 'good');
      }
    }
  };

  // ---------------------------------------------------------------- new life
  G.newLife = function (o = {}) {
    const C = o.country ? G.country(o.country) : U.pick(G.countries());
    const gender = o.gender || U.pick(['boy', 'girl']);
    const L = {
      v: 1, id: U.uid(), gen: o.gen || 1,
      first: String(o.first || U.pick(C[gender]) || 'Sam').trim().slice(0, 20),
      last: String(o.last || U.pick(C.last) || 'Hazel').trim().slice(0, 24),
      gender, age: 0, birthYear: o.birthYear || new Date().getFullYear(),
      country: C.id, city: o.city || U.pick(C.cities) || C.name,
      wealth: o.wealth || U.pickW([1, 2, 3], (w) => [30, 50, 20][w - 1]),
      alive: true, cause: null,
      stats: { joy: U.ri(62, 92), health: U.ri(72, 100), smarts: U.ri(20, 85), style: U.ri(20, 85), kindness: U.ri(35, 70) },
      fame: 0, notoriety: 0, followers: 0,
      skills: Object.fromEntries(CL.SKILLS.map((s) => [s.id, 0])),
      money: 0, loans: [], home: 'parents', homeId: null, license: false,
      edu: { stage: 'none', school: null, grades: 0, year: 0, major: null, majorDone: null, program: null, gpa: 0, hsGrades: 0, degrees: [], clubs: [], dropout: false, payer: null, scholarship: null },
      job: null, partTime: null, retired: false, pension: 0, career: [],
      people: [], assets: [], record: [], prison: null, fugitive: 0, conditions: [],
      once: {}, recent: [], uses: {}, pending: [], log: [], flow: null,
      totals: { earned: 0, donated: 0, volunteered: 0, friends: 0, pets: 0, kids: 0, vacations: 0, heists: 0, crimes: 0, caught: 0, prisonYears: 0, escapes: 0, pranks: 0, books: 0, songs: 0, hits: 0, videos: 0, roles: 0, quizRight: 0, promotions: 0, jobYears: 0, talentWins: 0, houses: 0, countries: 1, maxFollowers: 0 },
      ach: [], perks: (o.perks || []).slice(0, 3), heir: null, chip: null,
    };
    G.life = L;
    const boost = { bright: 'smarts', sturdy: 'health', stylish: 'style' };
    for (const [perk, stat] of Object.entries(boost)) if (L.perks.includes(perk)) L.stats[stat] = Math.min(100, L.stats[stat] + 15);
    if (o.heirOf) Object.assign(L, o.heirOf);
    else {
      const parents = makeFamily(L);
      const c = G.country(L.country);
      G.say(`You were born a ${gender} in ${L.city}, ${c.name}! Welcome to the world, ${L.first} ${L.last}.`, '🎉', 'good');
      if (parents.length === 2) G.say(`Your parents are ${parents[0].first}${parents[0].job ? ` (${parents[0].job})` : ''} and ${parents[1].first}${parents[1].job ? ` (${parents[1].job})` : ''}.`, '👪', 'info');
      else G.say(`You'll be raised by your ${parents[0].kind === 'mother' ? 'mom' : 'dad'}, ${parents[0].first}${parents[0].job ? ` (${parents[0].job})` : ''}.`, '👪', 'info');
      const sibs = G.alive(L, 'sibling');
      if (sibs.length) G.say(`You have ${sibs.length === 1 ? 'an older ' + (sibs[0].gender === 'girl' ? 'sister' : 'brother') + ', ' + sibs[0].first : sibs.length + ' older siblings: ' + sibs.map((s) => s.first).join(', ')}.`, '🧒', 'info');
      G.say(['Your family is short on money, but your home is full of laughter.', 'Your family is comfortable and cozy.', 'Your family is wealthy!'][L.wealth - 1], ['🏠', '🏡', '🏰'][L.wealth - 1], 'info');
      if (L.perks.includes('petStart')) G.addPet(U.pick(['dog', 'cat', 'rabbit']), { age: 1 });
      G.tip('Hi, I\'m Chip! Tap the big acorn to live another year. The other tabs let you study, work, play and meet people.');
    }
    if (CL.meta) CL.meta.check();
    G.save();
    return L;
  };

  // ---------------------------------------------------------------- the year
  G.canAgeUp = () => !!(G.life && G.life.alive && !G.life.pending.length);
  G.ageUp = function () {
    const L = G.life;
    if (!G.canAgeUp()) return false;
    L.age++;
    L.uses = {};
    L.flow = { income: 0, costs: 0, notes: [] };
    for (const p of L.people) if (p.alive) p.age++;
    G.say(null);
    if (L.prison) G.prisonYear(L);
    else {
      G.schoolYear(L);
      G.workYear(L);
      if (L.fugitive) G.fugitiveYear(L);
    }
    healthYear(L);
    peopleYear(L);
    if (!L.prison) G.moneyYear(L);
    statDrift(L);
    milestones(L);
    if (L.alive) G.eventsYear(L);
    deathCheck(L);
    if (CL.meta) CL.meta.check();
    G.save();
    return true;
  };

  function milestones(L) {
    const a = L.age;
    if (L.prison) return;
    if (a === 1) G.say(U.pick(['You took your first wobbly steps!', 'You learned to clap your hands and now clap at everything.', 'You discovered your toes. They are amazing.']), '👣', 'good');
    if (a === 2) G.tip('Little ones grow fast! Try the Activities tab for walks, movies and more.');
    if (a === 6) G.tip('School tip: study, take pop quizzes and join clubs from the School tab to raise your grades.');
    if (a === 14) G.tip('You can get a part-time job now! Check the School tab.');
    if (a === 16 && !L.license) G.tip('You\'re old enough to take your driving test (Activities → Life Admin).');
    if (a === 18) {
      G.tip('You\'re an adult now! Apply to college or find a job from the Career tab, and move out when you\'re ready.');
      if (L.perks.includes('nestEgg')) { L.money += 10000; G.say('Your Nest Egg perk kicked in: +$10,000!', '🥚', 'good'); }
    }
    if (a === 25) G.tip('You can now adopt a child (Activities → Family & Pets). Kids can carry on your legacy!');
    if (a === 62 && L.job && !L.retired) G.tip('You can retire from the Career tab whenever you like.');
  }

  function deathCheck(L) {
    if (!L.alive) return;
    if (L.stats.health <= 0 && L.age >= 18) return G.die('illness');
    if (L.age >= 120) return G.die('age');
    let m = G.mortality(L.age) * (1.55 - L.stats.health / 100);
    if (L.perks.includes('longLife')) m *= 0.7;
    if (L.age >= 50 && U.chance(m)) G.die('age');
  }

  G.die = function (cause) {
    const L = G.life;
    if (!L.alive) return;
    L.alive = false;
    L.cause = cause;
    L.pending = [];
    const lines = cause === 'age'
      ? [`After ${L.age} wonderful years, you passed away peacefully in your sleep.`,
        `At ${L.age}, with a smile on your face, you drifted off for the very last time.`,
        `You passed away peacefully at ${L.age}, surrounded by happy memories.`]
      : [`After a long illness, you passed away peacefully at ${L.age}.`];
    G.say(U.pick(lines), '🕊️', 'sad');
    if (CL.meta) { CL.meta.check(); L.chip = CL.meta.lifeChip(L); CL.meta.recordLife(L); }
    G.save();
  };

  // ---------------------------------------------------------------- legacy
  G.heirs = (L) => (L || G.life).people.filter((p) => p.alive && p.kind === 'child');
  G.estate = function (L) {
    const assets = L.assets.reduce((t, a) => t + (a.value || 0), 0);
    const loans = L.loans.reduce((t, l) => t + l.balance, 0);
    return Math.round(L.money + assets - loans);
  };
  G.continueAs = function (childId) {
    const old = G.life;
    const kid = old.people.find((p) => p.id === childId);
    if (!kid || !kid.alive) return null;
    const estate = Math.max(0, G.estate(old));
    const share = Math.round(estate * 0.85 / Math.max(1, G.heirs(old).length === 1 || old.heir === childId ? 1 : G.heirs(old).length));
    const C = G.country(old.country);
    const L = G.newLife({ first: kid.first, last: kid.last, gender: kid.gender, country: old.country, city: old.city, gen: old.gen + 1, perks: old.perks, birthYear: old.birthYear + old.age - kid.age, wealth: estate > 1e6 ? 3 : estate > 60000 ? 2 : 1, heirOf: {} });
    L.age = kid.age;
    L.stats.smarts = U.clamp(Math.round((L.stats.smarts + old.stats.smarts) / 2) + U.ri(-10, 10), 5, 100);
    L.stats.kindness = U.clamp(Math.round((L.stats.kindness + old.stats.kindness) / 2), 5, 100);
    const parent = { id: U.uid(), kind: old.gender === 'girl' ? 'mother' : 'father', gender: old.gender, first: old.first, last: old.last, age: old.age, alive: false, diedAt: kid.age, bond: kid.bond, used: {} };
    L.people.push(parent);
    for (const p of old.people) {
      if (!p.alive || p.id === kid.id) continue;
      if (p.kind === 'child') L.people.push({ ...p, kind: 'sibling', used: {} });
      else if (p.kind === 'pet') L.people.push({ ...p, used: {} });
    }
    // Keep the family home and garage; cash goes in as inheritance.
    L.money = share - (old.assets.reduce((t, a) => t + (a.value || 0), 0) * 0.85);
    if (L.money < 0) L.money = 0;
    L.assets = old.assets.filter((a) => !a.stolen).map((a) => ({ ...a }));
    L.loans = old.loans.filter((l) => l.kind === 'mortgage').map((l) => ({ ...l }));
    const home = L.assets.find((a) => a.type === 'house');
    if (L.age >= 18) { L.home = home ? 'own' : 'rent'; L.homeId = home ? home.id : null; }
    else { L.home = 'parents'; }
    // Education that fits the age.
    if (L.age >= 18) { L.edu.degrees = ['highschool']; L.edu.stage = 'done'; L.edu.hsGrades = U.ri(55, 85); }
    else if (L.age >= 5) {
      L.edu.stage = L.age < 11 ? 'elementary' : L.age < 14 ? 'middle' : 'high';
      const kind = { elementary: 'elementary', middle: 'middle', high: 'high' }[L.edu.stage];
      L.edu.school = G.schoolName(kind);
      L.edu.grades = U.ri(50, 80);
    }
    L.log = [];
    G.say(`You are now playing as ${L.first} ${L.last}, age ${L.age} — generation ${L.gen} of the ${L.last} family.`, '🌱', 'good');
    G.say(`${U.cap(old.first)} left behind an estate worth ${U.money(estate)}. You received ${U.money(share)} including the family property.`, '📜', 'info');
    if (L.age < 18) G.say('You moved in with caring relatives who will look after you until you grow up.', '🏡', 'info');
    if (CL.meta) CL.meta.check();
    G.save();
    return L;
  };

  // ---------------------------------------------------------------- save / load
  const KEY = 'chiplife.life.v1', MKEY = 'chiplife.meta.v1';
  G.storage = function () {
    try { return globalThis.localStorage || null; } catch { return null; }
  };
  G.save = function () {
    const s = G.storage();
    if (!s) return;
    try {
      if (G.life) s.setItem(KEY, JSON.stringify(G.life));
      else s.removeItem(KEY);
      if (G.meta) s.setItem(MKEY, JSON.stringify(G.meta));
    } catch { /* storage full or blocked - keep playing */ }
  };
  G.loadLife = function () {
    try {
      const s = G.storage();
      const raw = s && s.getItem(KEY);
      const L = raw ? JSON.parse(raw) : null;
      return L && L.v === 1 ? L : null;
    } catch { return null; }
  };
  G.loadMeta = function () {
    try {
      const s = G.storage();
      const raw = s && s.getItem(MKEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  G.clearLife = function () {
    G.life = null;
    G.save();
  };
})(globalThis.CL);
