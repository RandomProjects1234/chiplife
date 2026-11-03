/* ChipLife engine — everyday activities: body & mind, hobbies, fame, friends, fun, family, life admin. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const t = (key, b, ctx, fb) => G.text('activityText', key, b, ctx, fb);
  const kidPays = true;

  G.ACT_CATS = [
    { id: 'body', label: 'Mind & Body', emoji: '🧘', desc: 'Stay healthy, happy and sharp' },
    { id: 'skills', label: 'Hobbies & Skills', emoji: '🎨', desc: 'Practice and get really good' },
    { id: 'fame', label: 'Create & Shine', emoji: '⭐', desc: 'Videos, books, songs and stages' },
    { id: 'social', label: 'Friends & Kindness', emoji: '🤝', desc: 'Meet people and help out' },
    { id: 'fun', label: 'Fun & Travel', emoji: '🎡', desc: 'Treat yourself' },
    { id: 'family', label: 'Family & Pets', emoji: '🐾', desc: 'Adopt furry friends and kids' },
    { id: 'mischief', label: 'Mischief & Heists', emoji: '🦹', desc: 'Pranks, capers… and consequences' },
    { id: 'admin', label: 'Life Admin', emoji: '🗂️', desc: 'Licenses, moving, the big stuff' },
  ];

  // ---------------------------------------------------------------- mind & body
  function simple(id, cat, label, emoji, desc, minAge, key, fxFn, extra) {
    return G.act(Object.assign({
      id, cat, label, emoji, desc, minAge,
      run(L, a, n) {
        const k = G.dim(n);
        const b = G.bucket4(fxFn.score ? fxFn.score(L) : 55 + (L.stats.joy - 50) / 3);
        return G.res(emoji, t(key, b, fxFn.ctx ? fxFn.ctx(L, a) : {}, `You enjoyed some time doing ${label.toLowerCase()}.`), fxFn(L, b, k, a));
      },
    }, extra || {}));
  }
  const scale = (o, k) => { for (const x of Object.keys(o)) if (typeof o[x] === 'number' && o[x] > 0) o[x] = Math.max(1, Math.round(o[x] * k)); return o; };

  simple('gym', 'body', 'Hit the gym', '🏋️', 'Build strength and health.', 12, 'gym',
    Object.assign((L, b, k) => scale({ great: { health: 6, style: 2, joy: 2 }, good: { health: 4, style: 1, joy: 1 }, meh: { health: 2 }, bad: { health: -2, joy: -2 } }[b], k), { score: (L) => L.stats.health * 0.6 + 25 }));
  simple('walk', 'body', 'Go for a walk', '🚶', 'Fresh air for body and mind.', 4, 'walk',
    (L, b, k) => scale({ great: { health: 3, joy: 4 }, good: { health: 2, joy: 2 }, meh: { health: 1 }, bad: { joy: -1 } }[b], k));
  simple('meditate', 'body', 'Meditate', '🧘', 'Breathe in, breathe out.', 8, 'meditate',
    (L, b, k) => scale({ great: { joy: 6, health: 2 }, good: { joy: 4, health: 1 }, meh: { joy: 1 }, bad: { joy: -1 } }[b], k));
  simple('library', 'body', 'Visit the library', '📚', 'Read, learn, grow those smarts.', 5, 'library',
    Object.assign((L, b, k) => scale({ great: { smarts: 5, joy: 2 }, good: { smarts: 3, joy: 1 }, meh: { smarts: 1 }, bad: { joy: -1 } }[b], k), { score: (L) => L.stats.smarts * 0.5 + 30 }));
  simple('healthyMeal', 'body', 'Cook a healthy meal', '🥗', 'Veggies are delicious, honest.', 10, 'healthyMeal',
    (L, b, k) => scale({ great: { health: 4, joy: 2, skills: { cooking: 2 } }, good: { health: 3, skills: { cooking: 1 } }, meh: { health: 1 }, bad: { joy: -2 } }[b], k));

  G.act({
    id: 'doctor', cat: 'body', label: 'See a doctor', emoji: '🩺', desc: 'Treat illnesses or get a check-up.', minAge: 0, parentsPay: kidPays,
    cost: (L) => (L.conditions.length ? 0 : 60),
    steps: [{ type: 'pick', key: 'doc', title: 'Which doctor?', options: (L) => L.conditions.length
      ? [{ id: 'clinic', label: 'Town clinic', emoji: '🏥', sub: (L.age < 18 && L.home === 'parents' ? 'Your parents pay' : U.money(clinicCost(L))) + ' · decent odds' },
        { id: 'specialist', label: 'Top specialist', emoji: '👩‍⚕️', sub: (L.age < 18 && L.home === 'parents' ? 'Your parents pay' : U.money(clinicCost(L) * 3)) + ' · great odds' }]
      : [{ id: 'checkup', label: 'Regular check-up', emoji: '🩺', sub: L.age < 18 && L.home === 'parents' ? 'Your parents pay' : U.money(60) }] }],
    run(L, a) {
      if (!L.conditions.length) return G.res('🩺', t('doctorCheckup', 'good', {}, 'The doctor said you are in great shape!'), { health: 2, joy: 1 });
      const spec = a.doc === 'specialist';
      const cost = L.age < 18 && L.home === 'parents' ? 0 : clinicCost(L) * (spec ? 3 : 1);
      if (L.money < cost) return G.fail(`You need ${U.money(cost)} for that.`);
      L.money -= cost;
      const lines = [];
      const d = [];
      if (cost) d.push({ k: 'money', v: -cost });
      for (const c of L.conditions.slice()) {
        const ill = G.illness(c.id);
        const p = Math.min(0.97, (ill ? ill.cure : 0.6) + (spec ? 0.3 : 0));
        const ctx = { illness: (ill ? ill.name : c.name).toLowerCase() };
        if (U.chance(p)) { G.cure(c.id); lines.push(t('doctorCheckup', 'cured', ctx, `The doctor cured your ${ctx.illness}!`)); d.push(...G.fx({ health: 4, joy: 2 })); }
        else lines.push(t('doctorCheckup', 'notCured', ctx, `The treatment didn't fix your ${ctx.illness} this time.`));
      }
      return { emoji: '🩺', text: lines.join(' '), d, tone: G.toneOf(d) };
    },
  });
  function clinicCost(L) {
    return L.conditions.reduce((t, c) => t + ((G.illness(c.id) || {}).treat || 150), 0);
  }

  // ---------------------------------------------------------------- hobbies & skills
  function lesson(id, label, emoji, desc, minAge, skill, unlock, side, step) {
    G.act({
      id, cat: 'skills', label, emoji, desc, minAge, cost: 120, parentsPay: kidPays, perYear: 4,
      steps: step ? [step] : undefined,
      run(L, a, n) {
        const k = G.dim(n) * (G.hasUnlock(L, unlock) ? 1.35 : 1);
        const lvl = L.skills[skill];
        const b = G.bucket4(45 + (L.stats.smarts - 50) / 4 + (L.stats.joy - 50) / 5 + Math.min(20, lvl / 5));
        const gain = { great: 7, good: 5, meh: 3, bad: 1 }[b];
        const fx = { skills: { [skill]: Math.max(1, Math.round(gain * k)) } };
        Object.assign(fx, b === 'bad' ? { joy: -1 } : side(b));
        const ctx = { instrument: a.instrument || L.instrument || 'piano', sport: a.sport || L.sport || 'soccer' };
        if (a.instrument) L.instrument = a.instrument;
        if (a.sport) L.sport = a.sport;
        return G.res(emoji, t(skill === 'sports' ? 'sports' : skill, b, ctx, `You practiced ${U.statLabel(skill).toLowerCase()} and got a bit better.`), fx);
      },
    });
  }
  lesson('music', 'Music lessons', '🎹', 'Learn an instrument.', 5, 'music', 'music', (b) => ({ joy: b === 'great' ? 3 : 1, smarts: 1 }),
    { type: 'pick', key: 'instrument', title: 'Pick an instrument', options: (L) => CL.INSTRUMENTS.map((i) => ({ id: i, label: U.cap(i), emoji: '🎵', sub: L.instrument === i ? 'Your instrument' : '' })) });
  lesson('art', 'Art class', '🎨', 'Paint, draw and sculpt.', 4, 'art', 'art', (b) => ({ joy: b === 'great' ? 3 : 1, style: b === 'great' ? 1 : 0 }));
  lesson('coding', 'Coding class', '💻', 'Make apps and games.', 8, 'coding', 'coding', () => ({ smarts: 2 }));
  lesson('cooking', 'Cooking class', '🍳', 'Whisk, sizzle, taste.', 8, 'cooking', 'cooking', () => ({ health: 1, joy: 1 }));
  lesson('sports', 'Sports practice', '⚽', 'Train hard, play harder.', 5, 'sports', 'sports', (b) => ({ health: b === 'great' ? 3 : 2, joy: 1 }),
    { type: 'pick', key: 'sport', title: 'Pick a sport', options: (L) => CL.SPORTS.map((s) => ({ id: s, label: U.cap(s), emoji: '🏅', sub: L.sport === s ? 'Your sport' : '' })) });
  lesson('acting', 'Drama class', '🎭', 'Find your stage presence.', 6, 'acting', 'acting', () => ({ style: 1, joy: 1 }));
  lesson('writing', 'Writing workshop', '✍️', 'Stories, poems and more.', 7, 'writing', 'writing', () => ({ smarts: 1, joy: 1 }));

  // ---------------------------------------------------------------- create & shine
  G.act({
    id: 'video', cat: 'fame', label: 'Post a video', emoji: '📹', desc: 'Share a video and grow your followers.', minAge: 12, perYear: 4,
    run(L, a, n) {
      const cam = G.hasUnlock(L, 'video') ? 12 : 0;
      const q = U.clamp(L.stats.style * 0.35 + L.skills.acting * 0.25 + L.stats.smarts * 0.15 + U.ri(0, 40) + cam - n * 6, 0, 120);
      const viral = q > 80 && U.chance(0.18 + cam / 100);
      const base = Math.max(10, L.followers * (viral ? 0.9 : 0.05));
      const gain = Math.round(viral ? base + U.ri(5000, 60000) : q > 45 ? base * U.rf(0.5, 1.5) + q * U.ri(4, 20) : q * U.ri(0, 3));
      L.totals.videos++;
      const topic = U.pick(U.list('videoTopics', ['making pancake art', 'your cat\'s morning routine']));
      const b = viral ? 'viral' : q > 45 ? 'good' : 'flop';
      const r = G.res('📹', t('video', b, { topic }, `You posted a video about ${topic}.`), { followers: gain, joy: viral ? 8 : b === 'good' ? 3 : -1, fame: viral ? 4 : 0, skills: { acting: 1 } });
      L.totals.maxFollowers = Math.max(L.totals.maxFollowers, L.followers);
      L.fame = Math.max(L.fame, G.followerFame(L.followers));
      return r;
    },
  });
  G.act({
    id: 'book', cat: 'fame', label: 'Write a book', emoji: '📖', desc: 'Pour your heart into a book (once a year).', minAge: 14, perYear: 1,
    avail: (L) => (L.skills.writing < 15 ? 'Needs Writing skill 15 (try the writing workshop)' : true),
    run(L) {
      const q = U.clamp(L.skills.writing * 0.6 + L.stats.smarts * 0.25 + U.ri(0, 30), 0, 130);
      const title = U.pick(U.list('bookTitles', ['The Acorn Who Knew Too Much']));
      L.totals.books++;
      if (q >= 82) {
        const pay = Math.round(U.ri(40000, 300000) * (1 + L.fame / 100));
        L.totals.hits++;
        (L.royalties = L.royalties || []).push({ label: title, amount: Math.round(pay / 3) });
        return G.res('📚', t('book', 'hit', { title }, `Your book "${title}" became a bestseller!`), { money: pay, fame: 12, joy: 10, skills: { writing: 3 } }, null, { hit: true });
      }
      if (q >= 55) return G.res('📖', t('book', 'good', { title }, `Your book "${title}" sold nicely.`), { money: Math.round(q * U.ri(40, 120)), fame: 3, joy: 5, skills: { writing: 2 } });
      return G.res('📕', t('book', 'flop', { title }, `Your book "${title}" didn't sell many copies.`), { money: U.ri(20, 300), joy: -3, skills: { writing: 2 } });
    },
  });
  G.act({
    id: 'song', cat: 'fame', label: 'Release a song', emoji: '🎤', desc: 'Record a song and share it (once a year).', minAge: 12, perYear: 1,
    avail: (L) => (L.skills.music < 15 ? 'Needs Music skill 15 (try music lessons)' : true),
    run(L) {
      const q = U.clamp(L.skills.music * 0.55 + L.stats.style * 0.2 + U.ri(0, 35) + (G.hasUnlock(L, 'music') ? 6 : 0), 0, 130);
      const title = U.pick(U.list('songTitles', ['Sunny Side of the Tree']));
      L.totals.songs++;
      if (q >= 82) {
        const pay = Math.round(U.ri(30000, 400000) * (1 + L.fame / 100));
        L.totals.hits++;
        (L.royalties = L.royalties || []).push({ label: title, amount: Math.round(pay / 3) });
        return G.res('🎶', t('song', 'hit', { title }, `"${title}" is a smash hit!`), { money: pay, fame: 14, joy: 10, followers: U.ri(5000, 80000), skills: { music: 3 } }, null, { hit: true });
      }
      if (q >= 55) return G.res('🎤', t('song', 'good', { title }, `"${title}" got a nice number of streams.`), { money: Math.round(q * U.ri(30, 100)), fame: 3, joy: 5, followers: U.ri(100, 3000), skills: { music: 2 } });
      return G.res('🎤', t('song', 'flop', { title }, `"${title}" didn't catch on.`), { money: U.ri(5, 200), joy: -3, skills: { music: 2 } });
    },
  });
  G.act({
    id: 'talentShow', cat: 'fame', label: 'Enter the talent show', emoji: '🌟', desc: 'Show the town what you can do (ages 6-17).', minAge: 6, maxAge: 17, perYear: 1,
    steps: [{ type: 'pick', key: 'talent', title: 'What will you perform?', options: () => CL.TALENTS.map((x) => ({ id: x.id, label: x.label, emoji: x.emoji })) }],
    run(L, a) {
      const tal = CL.TALENTS.find((x) => x.id === a.talent) || CL.TALENTS[0];
      const s = L.skills[tal.skill] * 0.6 + L.stats.style * 0.25 + U.ri(0, 40);
      const ctx = { talent: tal.talent };
      if (s >= 70) {
        L.totals.talentWins++;
        return G.res('🏆', t('talentShow', 'win', ctx, `You won the talent show with ${tal.talent}!`), { money: U.ri(50, 300), fame: 4, joy: 10, style: 2, skills: { [tal.skill]: 2 } });
      }
      if (s >= 40) return G.res('🌟', t('talentShow', 'good', ctx, `Your ${tal.talent} got a big round of applause.`), { joy: 5, fame: 1, skills: { [tal.skill]: 2 } });
      return G.res('🎪', t('talentShow', 'flop', ctx, `Your ${tal.talent} didn't go as planned, but you were brave to try.`), { joy: -3, skills: { [tal.skill]: 1 } });
    },
  });
  G.act({
    id: 'audition', cat: 'fame', label: 'Audition for a role', emoji: '🎬', desc: 'Try out for a movie or show.', minAge: 8, perYear: 2,
    avail: (L) => (L.skills.acting < 20 ? 'Needs Acting skill 20 (try drama class)' : true),
    run(L) {
      const role = U.pick(U.list('movieRoles', ['a talking tree in a fantasy film']));
      const p = U.clamp(L.skills.acting / 130 + L.stats.style / 350 + L.fame / 400, 0.05, 0.9);
      if (U.chance(p)) {
        L.totals.roles++;
        const pay = Math.round(U.ri(800, 6000) * (1 + L.skills.acting / 25) * (1 + L.fame / 40));
        return G.res('🎬', t('audition', 'success', { role }, `You landed the part of ${role}!`), { money: pay, fame: U.ri(3, 9), joy: 9, skills: { acting: 3 } });
      }
      return G.res('🎬', t('audition', 'fail', { role }, `You didn't get the part of ${role}. Next time!`), { joy: -3, skills: { acting: 1 } });
    },
  });

  // ---------------------------------------------------------------- friends & kindness
  G.act({
    id: 'makeFriend', cat: 'social', label: 'Make a new friend', emoji: '👋', desc: 'Head to the park and say hi.', minAge: 3, perYear: 3,
    avail: (L) => (G.alive(L, 'friend').length >= 14 ? 'You have lots of friends already!' : true),
    run(L, a, n) {
      if (U.chance(U.clamp(0.45 + L.stats.joy / 300 + L.stats.style / 400 + L.stats.kindness / 400 - n * 0.12, 0.1, 0.92))) {
        const f = G.makeFriend('the park');
        return G.res('🤝', t('makeFriend', 'success', { them: f.first }, `You met ${f.first} and became friends!`), { joy: 4 }, null, { friend: f.id });
      }
      return G.res('🙈', t('makeFriend', 'fail', {}, 'You tried to make a friend but it was a quiet day at the park.'), { joy: -1 });
    },
  });
  G.act({
    id: 'volunteer', cat: 'social', label: 'Volunteer', emoji: '🙌', desc: 'Help out around town.', minAge: 8, perYear: 4,
    steps: [{ type: 'pick', key: 'cause', title: 'Where will you help?', options: () => CL.CAUSES.map((c) => ({ id: c, label: U.cap(c), emoji: '🙌' })) }],
    run(L, a, n) {
      const k = G.dim(n);
      L.totals.volunteered++;
      const b = G.bucket4(55 + (L.stats.kindness - 50) / 3);
      return G.res('🙌', t('volunteer', b, { cause: a.cause || CL.CAUSES[0] }, `You volunteered at ${a.cause}.`), scale({ great: { kindness: 6, joy: 4 }, good: { kindness: 4, joy: 2 }, meh: { kindness: 2 }, bad: { kindness: 1, joy: -1 } }[b], k));
    },
  });
  G.act({
    id: 'donate', cat: 'social', label: 'Donate to charity', emoji: '💝', desc: 'Give some money to a good cause.', minAge: 8,
    steps: [{ type: 'pick', key: 'amount', title: 'How much will you give?', options: (L) => [10, 100, 1000, 10000, 100000, 1000000].map((v) => ({ id: String(v), label: U.money(v), emoji: '💝', disabled: L.money < v })) }],
    run(L, a) {
      const amt = Number(a.amount) || 0;
      if (!amt) return G.fail('Pick an amount.');
      if (L.money < amt) return G.fail(`You need ${U.money(amt)}.`);
      L.money -= amt;
      L.totals.donated += amt;
      const charity = U.pick(U.list('charities', ['Paws & Whiskers Rescue']));
      const kind = Math.round(U.clamp(Math.log10(amt) * 2.5 - 1, 1, 15));
      const r = G.res('💝', t('donate', amt >= 1000 ? 'great' : 'good', { amount: U.money(amt), charity }, `You donated ${U.money(amt)} to ${charity}.`), { kindness: kind, joy: Math.ceil(kind / 2), fame: amt >= 100000 ? 3 : 0 });
      r.d.unshift({ k: 'money', v: -amt });
      return r;
    },
  });
  G.act({
    id: 'party', cat: 'social', label: 'Throw a party', emoji: '🎉', desc: 'Invite everyone over for fun.', minAge: 6, cost: (L) => (L.age < 18 ? 40 : 400), parentsPay: kidPays, perYear: 2,
    run(L, a, n) {
      const b = G.bucket4(45 + L.stats.style / 4 + G.alive(L, 'friend').length * 3);
      for (const f of G.alive(L, 'friend')) f.bond = U.clamp(f.bond + { great: 6, good: 4, meh: 1, bad: -1 }[b], 0, 100);
      if (U.chance(0.25)) G.makeFriend('your party');
      return G.res('🎉', t('party', b, {}, 'You threw a party.'), scale({ great: { joy: 8, style: 2 }, good: { joy: 5, style: 1 }, meh: { joy: 1 }, bad: { joy: -3 } }[b], G.dim(n)));
    },
  });

  // ---------------------------------------------------------------- fun & travel
  function fun(id, label, emoji, desc, minAge, cost, key, fxs, extra) {
    G.act(Object.assign({
      id, cat: 'fun', label, emoji, desc, minAge, cost, parentsPay: kidPays,
      run(L, a, n) {
        const b = G.bucket4(55 + (L.stats.joy - 50) / 4);
        const ctx = id === 'movies' ? { movie: U.pick(U.list('movies', ['The Great Pancake Parade'])) } : {};
        return G.res(emoji, t(key, b, ctx, `You went to the ${label.toLowerCase()}.`), scale(Object.assign({}, fxs[b]), G.dim(n)));
      },
    }, extra || {}));
  }
  fun('movies', 'Go to the movies', '🍿', 'Popcorn and a big screen.', 4, 15, 'movies', { great: { joy: 6 }, good: { joy: 4 }, meh: { joy: 1 }, bad: { joy: -1 } });
  fun('amusementPark', 'Amusement park', '🎢', 'Roller coasters and cotton candy.', 4, 80, 'amusementPark', { great: { joy: 9 }, good: { joy: 6 }, meh: { joy: 2 }, bad: { joy: -2, health: -1 } });
  fun('arcade', 'Hit the arcade', '🕹️', 'Win tickets, trade for prizes.', 6, 20, 'arcade', { great: { joy: 6, smarts: 1 }, good: { joy: 4 }, meh: { joy: 1 }, bad: { joy: -1 } });
  G.act({
    id: 'vacation', cat: 'fun', label: 'Take a vacation', emoji: '✈️', desc: 'Pack your bags and see the world.', minAge: 18,
    steps: [{ type: 'pick', key: 'trip', title: 'Where to?', options: (L) => CL.content.catalog.vacations.map((v) => ({ id: v.id, label: v.place, emoji: v.emoji, sub: `${U.money(v.price)} · ${v.desc || ''}`, disabled: L.money < v.price })) }],
    run(L, a, n) {
      const v = CL.content.catalog.vacations.find((x) => x.id === a.trip);
      if (!v) return G.fail('Pick a destination.');
      if (L.money < v.price) return G.fail(`You need ${U.money(v.price)}.`);
      L.money -= v.price;
      L.totals.vacations++;
      const b = G.bucket4(62 + (L.stats.joy - 50) / 5);
      const k = G.dim(n);
      const r = G.res(v.emoji, t('vacation', b, { place: v.place }, `You took a trip to ${v.place}.`), scale({ great: { joy: v.joy, health: 3 }, good: { joy: Math.round(v.joy * 0.7), health: 2 }, meh: { joy: 3 }, bad: { joy: -2 } }[b], k));
      r.d.unshift({ k: 'money', v: -v.price });
      return r;
    },
  });
  G.act({
    id: 'raffle', cat: 'fun', label: 'Buy a charity raffle ticket', emoji: '🎟️', desc: '$5 supports a good cause — and you might win!', minAge: 18, cost: 5, perYear: 10,
    run(L) {
      const r = U.r();
      if (r < 0.0008) return G.res('🎊', t('raffle', 'win', { amount: U.money(250000) }, 'You won $250,000!'), { money: 250000, joy: 15, kindness: 1 });
      if (r < 0.01) return G.res('🎊', t('raffle', 'win', { amount: U.money(2500) }, 'You won $2,500!'), { money: 2500, joy: 6, kindness: 1 });
      if (r < 0.08) return G.res('🎟️', t('raffle', 'win', { amount: U.money(50) }, 'You won $50!'), { money: 50, joy: 2, kindness: 1 });
      return G.res('🎟️', t('raffle', 'lose', {}, 'No prize this time, but your $5 helped a good cause.'), { kindness: 1 });
    },
  });

  // ---------------------------------------------------------------- family & pets
  G.act({
    id: 'adoptPet', cat: 'family', label: 'Adopt a pet', emoji: '🐶', desc: 'Find a furry (or scaly) best friend.', minAge: 6,
    avail: (L) => (G.alive(L, 'pet').length >= 6 ? 'Six pets is plenty!' : true),
    steps: [{ type: 'pick', key: 'species', title: 'Which pet?', options: (L) => CL.content.catalog.pets.map((p) => ({ id: p.id, label: p.name, emoji: p.emoji, sub: `${p.fee ? U.money(p.fee) : 'Free'} · ${p.desc || ''}`, disabled: L.age >= 18 && L.money < p.fee })) }],
    run(L, a) {
      const info = CL.content.catalog.pets.find((p) => p.id === a.species);
      if (!info) return G.fail('Pick a pet.');
      if (L.age < 18 && L.home === 'parents') {
        const ps = G.parents(L);
        const best = ps.reduce((m, p) => Math.max(m, p.bond), 0);
        if (!ps.length || !U.chance(U.clamp(best / 110 - (info.fee > 500 ? 0.4 : 0), 0.05, 0.85))) return G.res('🙅', `Your parents said no to a ${info.name.toLowerCase()}. Maybe if you ask nicely next year…`, { joy: -3 });
      } else {
        if (L.money < info.fee) return G.fail(`You need ${U.money(info.fee)}.`);
        L.money -= info.fee;
      }
      const pet = G.addPet(info.id, { silent: true, age: info.id === 'horse' ? U.ri(2, 6) : U.ri(0, 2) });
      const r = G.res(info.emoji, `You adopted ${pet.first}, a ${pet.breed.toLowerCase() === pet.petType ? pet.petType : pet.breed + ' ' + pet.petType}!`, { joy: 8, kindness: 2 });
      if (L.age >= 18 && info.fee) r.d.unshift({ k: 'money', v: -info.fee });
      return r;
    },
  });
  G.act({
    id: 'adoptChild', cat: 'family', label: 'Adopt a child', emoji: '🧸', desc: 'Give a kid a warm, cozy home.', minAge: 25, cost: 12000, perYear: 1,
    avail: (L) => {
      if (L.home === 'parents') return 'Get your own place first';
      if (L.money < 20000) return 'Agencies want to see $20,000 in savings';
      if (L.notoriety > 30 || L.record.some((r) => L.age - r.age < 5)) return 'Your record is too fresh';
      if (G.alive(L, 'child').filter((k) => k.age < 18).length >= 6) return 'Your house is full!';
      return true;
    },
    steps: [{ type: 'pick', key: 'age', title: 'What age?', options: () => [{ id: '0', label: 'A baby', emoji: '👶' }, { id: 'kid', label: 'A young kid (3-7)', emoji: '🧒' }, { id: 'big', label: 'An older kid (8-14)', emoji: '🧑' }] }],
    run(L, a) {
      const age = a.age === '0' ? 0 : a.age === 'kid' ? U.ri(3, 7) : U.ri(8, 14);
      const kid = G.adoptChild(age);
      return G.res('🧸', `You adopted ${kid.first}, ${age === 0 ? 'a baby' : `age ${age}`}! Your family just got bigger.`, { joy: 12, kindness: 4 });
    },
  });

  // ---------------------------------------------------------------- life admin
  G.act({
    id: 'driving', cat: 'admin', label: "Take the driving test", emoji: '🚗', desc: 'Answer 5 questions — get 4 right to pass.', minAge: 16, cost: 50, perYear: 3,
    show: (L) => !L.license,
    steps: [{ type: 'quiz', set: 'driving', count: 5 }],
    run(L, a) {
      const c = a.correct | 0;
      if (c >= 4) {
        L.license = true;
        return G.res('🪪', `You passed your driving test (${c}/5)! You can now buy cars.`, { joy: 8, style: 2 });
      }
      return G.res('🚧', `You failed the driving test (${c}/5). The examiner said "Good effort!" and handed you a study booklet.`, { joy: -4 });
    },
  });
  G.act({
    id: 'moveOut', cat: 'admin', label: 'Move out', emoji: '📦', desc: 'Get your own apartment (rent ~$7,200/yr).', minAge: 18,
    show: (L) => L.home === 'parents',
    avail: (L) => (L.money < 1500 ? 'Save $1,500 for the deposit first' : true),
    run(L) {
      L.money -= 1500;
      L.home = 'rent';
      const r = G.res('📦', U.pick(['You moved into your very first apartment! It is tiny, but it is yours.', 'You packed your things and moved out. Your new place has a squeaky door you already adore.']), { joy: 8, style: 1 });
      r.d.unshift({ k: 'money', v: -1500 });
      return r;
    },
  });
  G.act({
    id: 'moveHome', cat: 'admin', label: 'Move back home', emoji: '🏡', desc: 'Save money by living with family.', minAge: 18,
    show: (L) => L.home === 'rent' && G.parents(L).length > 0,
    run(L) {
      L.home = 'parents';
      return G.res('🏡', 'You moved back in with your family. Your old room still has your glow-in-the-dark stars.', { joy: -2 });
    },
  });
  G.act({
    id: 'emigrate', cat: 'admin', label: 'Move to another country', emoji: '🌍', desc: 'A brand new start ($5,000).', minAge: 18, cost: 5000, perYear: 1,
    steps: [{ type: 'pick', key: 'country', title: 'Where to?', options: (L) => G.countries().filter((c) => c.id !== L.country).map((c) => ({ id: c.id, label: c.name, emoji: c.flag })) }],
    run(L, a) {
      const c = G.countries().find((x) => x.id === a.country);
      if (!c) return G.fail('Pick a country.');
      L.country = c.id;
      L.city = U.pick(c.cities) || c.name;
      L.totals.countries++;
      if (L.job && U.chance(0.5)) G.endJob('quit');
      if (L.home === 'parents') L.home = 'rent';
      return G.res(c.flag, `You moved to ${L.city}, ${c.name}! Everything feels new and exciting.`, { joy: 8, smarts: 1 });
    },
  });
  G.act({
    id: 'chooseHeir', cat: 'admin', label: 'Choose your heir', emoji: '📜', desc: 'Pick which kid continues your story.', minAge: 18,
    show: (L) => G.heirs(L).length > 0,
    steps: [{ type: 'pick', key: 'heir', title: 'Who inherits everything?', options: (L) => G.heirs(L).map((k) => ({ id: k.id, label: `${k.first} ${k.last}`, emoji: G.faceOf(k), sub: `${G.roleOf(k)} · age ${k.age}${L.heir === k.id ? ' · current heir' : ''}` })) }],
    run(L, a) {
      const k = G.person(a.heir);
      if (!k) return G.fail('Pick someone.');
      L.heir = k.id;
      return { emoji: '📜', text: `You named ${k.first} as your heir in your will.`, tone: 'info', d: [], refund: true };
    },
  });
})(globalThis.CL);
