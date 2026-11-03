/* ChipLife UI — title screen, life designer, end-of-life screen, Acorn Stash, past lives, how to play. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const UI = CL.UI;
  const h = UI.h;

  UI.showStart = function () {
    UI.screen = 'start';
    const saved = G.life && G.life.alive ? G.life : null;
    const n = CL.meta.count();
    UI.frame(h('div.start', [
      h('div.logo', { 'aria-hidden': 'true' }, '🐿️'),
      h('h1.title', ['Chip', h('span', 'Life')]),
      h('p.tagline', 'Live a whole life, one year at a time.'),
      h('div.menu', [
        saved ? h('button.btn.primary.block.continue-card', { onclick: () => UI.showGame() }, [h('span', '▶️'), h('span', [h('small', 'Continue your life'), `${saved.first} ${saved.last}, age ${saved.age}`])]) : null,
        h('button.btn.block' + (saved ? '' : '.primary'), { onclick: () => UI.startNew({}) }, '🎲 New random life'),
        h('button.btn.block', { onclick: () => UI.openSheet(customView()) }, '✏️ Design your own life'),
        h('div.row2', [
          h('button.btn', { onclick: () => UI.openSheet(UI.stashView()) }, `🌰 Acorns ${n}/${CL.meta.ACORNS.length}`),
          h('button.btn', { onclick: () => UI.openSheet(UI.livesView()) }, '📜 Past lives'),
        ]),
        h('button.btn.block', { onclick: () => UI.openSheet(UI.howToView()) }, '❓ How to play'),
      ]),
      h('div.foot', 'A family-friendly life simulator · stories written with help from Claude Haiku'),
    ]));
  };
  UI.startNew = async function (opts) {
    if (G.life && G.life.alive && !(await UI.confirm(`Start a new life? ${G.life.first}'s life will be abandoned.`, 'Start fresh'))) return;
    G.newLife(opts);
    UI.showGame();
  };

  // ---------------------------------------------------------------- life designer
  function customView() {
    const st = { first: '', last: '', gender: U.pick(['boy', 'girl']), country: '', wealth: 0, perks: [] };
    return {
      title: 'Design a life',
      render() {
        const unlocked = CL.meta.unlockedPerks().map((p) => p.id);
        const canCountry = unlocked.includes('pickCountry');
        const canWealth = unlocked.includes('pickWealth');
        const input = (key, label) => h('div.field', [h('label', label), h('input', { value: st[key], placeholder: 'Random', maxLength: 20, oninput: (e) => { st[key] = e.target.value.replace(/[^\p{L}' -]/gu, ''); } })]);
        const seg = (opts, key) => h('div.seg', { style: { gridTemplateColumns: `repeat(${opts.length}, 1fr)` } }, opts.map(([v, l]) => h('button' + (st[key] === v ? '.on' : ''), { onclick: () => { st[key] = v; UI.refreshSheet(); } }, l)));
        const countries = G.countries().slice().sort((a, b) => a.name.localeCompare(b.name));
        return h('div', [
          input('first', 'First name'),
          input('last', 'Last name'),
          h('div.field', [h('label', 'You are a'), seg([['boy', '👦 Boy'], ['girl', '👧 Girl']], 'gender')]),
          h('div.field', [h('label', 'Birth country'), canCountry
            ? h('select', { onchange: (e) => { st.country = e.target.value; } }, [h('option', { value: '' }, '🎲 Surprise me'), ...countries.map((c) => h('option', { value: c.id, selected: st.country === c.id }, `${UI.flagText(c.flag)} ${c.name}`.trim()))])
            : h('div.note', '🔒 Collect 3 acorns to choose your country.')]),
          h('div.field', [h('label', 'Family'), canWealth ? seg([[0, '🎲'], [1, '🏠 Modest'], [2, '🏡 Comfy'], [3, '🏰 Wealthy']], 'wealth') : h('div.note', '🔒 Collect 6 acorns to choose your family\'s wealth.')]),
          h('div.field', [h('label', `Perks (pick up to ${CL.meta.MAX_PERKS})`)]),
          ...CL.meta.PERKS.filter((p) => !p.always).map((p) => {
            const open = unlocked.includes(p.id);
            const on = st.perks.includes(p.id);
            return h('button.perk' + (on ? '.on' : '') + (open ? '' : '.locked'), {
              disabled: !open,
              onclick: () => {
                if (on) st.perks = st.perks.filter((x) => x !== p.id);
                else if (st.perks.length < CL.meta.MAX_PERKS) st.perks.push(p.id);
                else UI.toast(`Only ${CL.meta.MAX_PERKS} perks at a time!`);
                UI.refreshSheet();
              },
            }, [h('span.pe', open ? p.emoji : '🔒'), h('span.tx', [h('b', p.label), h('small', open ? p.desc : `Needs ${p.need} acorns`)]), on ? h('b', '✓') : null]);
          }),
          h('button.btn.primary.block', { style: { marginTop: '12px' }, onclick: () => { UI.closeSheet(); UI.startNew({ first: st.first.trim() || null, last: st.last.trim() || null, gender: st.gender, country: st.country || null, wealth: st.wealth || null, perks: st.perks }); } }, '🐣 Be born!'),
        ]);
      },
    };
  }

  // ---------------------------------------------------------------- end of life
  UI.showEnd = function () {
    const L = G.life;
    if (!L) return UI.showStart();
    if (L.alive) return UI.showGame();
    UI.screen = 'end';
    const chip = CL.meta.CHIPS.find((c) => c.id === (L.chip && L.chip.id)) || CL.meta.lifeChip(L);
    const C = G.country(L.country);
    const heirs = G.heirs(L).sort((a, b) => (b.id === L.heir) - (a.id === L.heir));
    const lastJob = L.job ? L.job.title : L.career.length ? L.career[L.career.length - 1].title : 'None';
    const degs = G.degreeNames(L);
    const kv = [
      ['📊 Net worth', U.money(G.estate(L))], ['💼 Career', lastJob], ['🎓 Education', degs.length ? degs[degs.length - 1] : 'None'],
      ['🤝 Friends made', L.totals.friends], ['🐾 Pets', L.totals.pets], ['🧸 Kids adopted', L.totals.kids],
      ['🏦 Heists', L.totals.heists], ['⛓️ Years in jail', L.totals.prisonYears], ['🌰 Acorns this life', L.ach.length],
    ];
    UI.frame(h('div.end', [
      h('div', { style: { fontSize: '30px' } }, '🕊️'),
      h('h1', `${L.first} ${L.last}`),
      h('div.dates', [UI.em(C.flag), ` ${L.birthYear} – ${L.birthYear + L.age} · lived to ${L.age}${L.gen > 1 ? ` · generation ${L.gen}` : ''}`]),
      h('div.lifechip', { style: { '--cc': chip.color } }, chip.emoji),
      h('div.chipname', chip.label),
      h('div.chipdesc', chip.desc),
      h('div.kv', kv.flatMap(([k, v]) => [h('span', k), h('span', String(v))])),
      h('div.btns', [
        heirs.length ? h('div.sec', 'Continue the family story as…') : null,
        ...heirs.map((k) => h('button.btn.block' + (k.id === (L.heir || heirs[0].id) ? '.primary' : ''), { onclick: () => { G.continueAs(k.id); UI.showGame(); } }, `${G.faceOf(k)} ${k.first}, your ${G.roleOf(k).toLowerCase()} (age ${k.age})`)),
        h('button.btn.block' + (heirs.length ? '' : '.primary'), { onclick: () => { G.newLife({}); UI.showGame(); } }, '🎲 Start a brand new life'),
        h('button.btn.block', { onclick: () => UI.openSheet(storyView(L)) }, '📖 Read this life story'),
        h('button.btn.block', { onclick: () => { G.clearLife(); UI.showStart(); } }, '🏠 Back to the title'),
      ]),
    ]));
    UI.sfx.acorn();
    UI.acornToasts();
  };
  function storyView(L) {
    return { title: `${L.first}'s story`, render: () => h('div', L.log.map((y) => UI.yearEl(y))) };
  }

  // ---------------------------------------------------------------- stash, lives, how-to
  UI.stashView = function () {
    return {
      title: 'Acorn Stash',
      render() {
        const M = G.meta;
        const n = CL.meta.count();
        return h('div', [
          h('p.note', `You've collected ${n} of ${CL.meta.ACORNS.length} acorns across all your lives. Acorns unlock perks for new lives!`),
          UI.sec('Perks'),
          ...CL.meta.PERKS.map((p) => h('div.perk' + (n >= p.need ? '.on' : '.locked'), [h('span.pe', n >= p.need ? p.emoji : '🔒'), h('span.tx', [h('b', p.label), h('small', p.desc)]), h('b', n >= p.need ? '✓' : `${p.need} 🌰`)])),
          UI.sec('Acorns'),
          h('div.stash', CL.meta.ACORNS.map((a) => h('div.acorn' + (M.ach[a.id] ? '' : '.locked'), [h('div.ae', a.emoji), h('b', a.label), h('small', a.desc), M.ach[a.id] ? h('small', `🌰 by ${M.ach[a.id].who}`) : null]))),
        ]);
      },
    };
  };
  UI.livesView = function () {
    return {
      title: 'Past lives',
      render() {
        const lives = G.meta.lives;
        if (!lives.length) return h('p.note', 'No finished lives yet. Every life you complete earns a Life Chip and shows up here!');
        return h('div.rows', lives.map((l) => {
          const chip = CL.meta.CHIPS.find((c) => c.id === l.chip) || CL.meta.CHIPS[CL.meta.CHIPS.length - 1];
          return UI.row({ emoji: chip.emoji, label: `${l.name}${l.gen > 1 ? ` (gen ${l.gen})` : ''}`, sub: `${UI.flagsOK ? l.flag : l.country} · lived to ${l.age} · ${chip.label}${l.job ? ` · ${l.job}` : ''}`, right: U.money(l.worth) });
        }));
      },
    };
  };
  UI.howToView = function () {
    const tips = [
      ['🌰', 'Age up', 'Tap the big acorn to live one more year. Things happen every year — sometimes you get to choose!'],
      ['😊', 'Your stats', 'Joy, Health, Smarts, Style and Kindness change with what you do. Keep Health up to live a long life.'],
      ['🎒', 'School & career', 'Study, take pop quizzes and join clubs. Later: university, grad school, and a job board with 50+ careers.'],
      ['👪', 'People', 'Spend time with family, make friends, adopt pets and kids. Strong bonds make you happier.'],
      ['🎯', 'Activities', 'Gym, hobbies, vacations, volunteering, videos, books, songs, talent shows and more.'],
      ['🦹', 'Mischief & heists', 'Pranks, shoplifting… even bank heists with a vault-cracking minigame. Get caught and you go to court — or jail! Jail has an escape minigame.'],
      ['🏠', 'Stuff', 'Buy things, cars and homes. Watch your yearly budget — rent and bills add up.'],
      ['🌳', 'Legacy', 'When your life ends you earn a Life Chip. If you adopted kids, you can keep playing as one of them!'],
      ['🌰', 'Acorns', 'Achievements are acorns. They stay forever and unlock perks for future lives.'],
    ];
    return {
      title: 'How to play',
      render: () => h('div.rows', tips.map(([e, t, d]) => h('div.row', [h('span.ic', e), h('span.tx', [h('b', t), h('small', d)])]))),
    };
  };
})(globalThis.CL);
