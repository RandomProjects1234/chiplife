// Layout audit: builds a busy life, opens every screen/sheet/modal, reports overflow and takes screenshots.
//   W=360 H=640 PREFIX=s- node tools/cdp.mjs tools/tests/audit.mjs
export default async function (page) {
  const P = process.env.PREFIX || '';
  const ev = (s) => page.eval('return (' + s + ')');
  const issues = [];
  async function audit(label) {
    const bad = await ev(`(() => {
      const app = document.querySelector('#app').getBoundingClientRect();
      const out = [];
      const name = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : '')) + ' "' + (el.textContent || '').trim().slice(0, 30) + '"';
      for (const el of document.querySelectorAll('#app *')) {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (el.closest('.layer:not(.open)')) continue;
        if (r.bottom < 0 || r.top > innerHeight) continue;
        if (r.right > app.right + 1.5 || r.left < app.left - 1.5) out.push('OUTSIDE ' + name(el) + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ' vs app ' + Math.round(app.left) + '..' + Math.round(app.right) + ']');
        else if (el.scrollWidth > el.clientWidth + 2 && !/(auto|scroll|hidden)/.test(cs.overflowX) && cs.display !== 'inline') out.push('OVERFLOW ' + name(el) + ' ' + el.scrollWidth + '>' + el.clientWidth);
      }
      return [...new Set(out)].slice(0, 12);
    })()`);
    if (bad.length) issues.push(`${label}:\n    ${bad.join('\n    ')}`);
  }
  async function shot(name) { await page.wait(350); await audit(name); await page.shot(P + name); }
  const clickRow = (txt) => ev(`(() => { const r = [...document.querySelectorAll('.sheet .row, .sheet .tile, .sheet .act')].find(r => r.textContent.includes(${JSON.stringify(txt)}) && !r.disabled); if (r) { r.click(); return 1; } return 0; })()`);
  const closeModal = () => ev(`(() => { const m = document.querySelector('.modal-layer'); if (!m) return 0; const b = [...m.querySelectorAll('.btn')].pop(); b && b.click(); return 1; })()`);

  await ev('localStorage.clear(), 1');
  await ev('location.reload(), 1');
  await page.wait(1200);
  await shot('a01-title');
  await ev(`__CL.UI.openSheet(__CL.UI.stashView()), 1`);
  await shot('a02-stash');
  await ev('__CL.UI.closeSheet(), 1');

  // a busy adult life
  await ev(`(() => {
    const { G, U, CL } = __CL;
    G.newLife({ first: 'Maximiliano', last: 'Featherstonehaugh-Smythe', gender: 'boy', country: 'united_kingdom' });
    __CL.age(27);
    const L = G.life;
    L.money = 2500000; L.license = true;
    if (L.prison) L.prison = null;
    L.edu.degrees = ['highschool', 'bachelor']; L.edu.majorDone = 'biology'; L.edu.gpa = 80; L.edu.stage = 'done';
    G.startJob(CL.content.jobs.find(j => j.edu === 'bachelor') || CL.content.jobs[0]);
    G.addPet('dog'); G.addPet('cat'); G.adoptChild(4); G.adoptChild(9);
    for (let i = 0; i < 5; i++) G.makeFriend('the skate park near the library');
    const H = CL.content.catalog.houses.slice().sort((a, b) => a.price - b.price);
    G.buy('houses', H[3].id, 'cash'); G.buy('houses', H[H.length - 1].id, 'cash');
    const V = CL.content.catalog.vehicles.filter(v => v.kind !== 'bike'); G.buy('vehicles', V[0].id); G.buy('vehicles', V[V.length - 1].id);
    for (const it of CL.content.catalog.items.slice(0, 5)) G.buy('items', it.id);
    G.addLoan('student', 'Student loan', 18000, 0.045);
    G.catchIllness('flu');
    L.record.push({ crime: 'Shoplifting (juvenile)', age: 15, outcome: 'community service' });
    L.followers = 123456; L.fame = 44; L.notoriety = 35;
    L.pending = [];
    return 1;
  })()`);
  await ev('__CL.UI.showGame(), 1');
  await shot('a03-game');

  for (const tab of ['path', 'people', 'stuff', 'do', 'profile', 'menu']) {
    await ev(`__CL.UI.openTab('${tab}'), 1`);
    await shot('a04-' + tab);
    await ev('__CL.UI.closeSheet(), 1');
  }
  // sub views, opened directly
  const sub = async (name, expr) => { await ev(`(__CL.UI.closeSheet(), __CL.UI.openSheet(${expr}), 1)`); await shot(name); };
  await sub('a05-jobboard', '__CL.UI.sub.jobBoard()');
  await sub('a06-jobdetail', '__CL.UI.sub.jobDetail(__CL.CL.content.jobs.slice().sort((a, b) => b.levels.join().length - a.levels.join().length)[0].id)');
  await sub('a07-person-friend', "__CL.UI.sub.personView(__CL.G.alive(__CL.G.life, 'friend')[0].id)");
  await sub('a08-person-pet', "__CL.UI.sub.personView(__CL.G.alive(__CL.G.life, 'pet')[0].id)");
  await sub('a09-shop', "__CL.UI.sub.shopView('items')");
  await sub('a10-realestate', "__CL.UI.sub.shopView('houses')");
  await sub('a11-budget', '__CL.UI.sub.budgetView()');
  await sub('a12-mischief', "__CL.UI.sub.catView(__CL.G.ACT_CATS.find((c) => c.id === 'mischief'))");
  await sub('a13-fun', "__CL.UI.sub.catView(__CL.G.ACT_CATS.find((c) => c.id === 'fun'))");
  await ev('__CL.UI.closeSheet(), 1');

  // modals
  await ev(`(__CL.UI.choose({ emoji: '🌰', title: 'Age 27', text: 'A very long event text to check wrapping. ' .repeat(4), choices: ['Make a strict budget spreadsheet with colors', 'Sell old books online', 'Ask your grandparent for advice about it'] }), 1)`);
  await shot('a14-choice');
  await ev(`(() => { document.querySelector('.modal .btn').click(); return 1; })()`); await page.wait(250);
  await ev(`(__CL.UI.result({ emoji: '💰', title: 'The heist worked!', text: 'You got away with $1,234,567 from Snickerdoodle Savings Bank! You zoomed off in your hot-air balloon while the guards waved their hats.', tone: 'good', d: [{ k: 'money', v: 1234567 }, { k: 'notoriety', v: 30 }, { k: 'fame', v: 3 }, { k: 'joy', v: 10 }, { k: 'kindness', v: -5 }, { k: 'bond', v: 10, who: 'Grandma Rosalind' }] }), 1)`);
  await shot('a15-result');
  await closeModal(); await page.wait(250);
  await ev(`(__CL.UI.pick('Where to?', __CL.CL.content.catalog.vacations.map(v => ({ id: v.id, label: v.place, emoji: v.emoji, sub: v.desc }))), 1)`);
  await shot('a16-pick-long');
  await closeModal(); await page.wait(250);
  await ev(`(window._d = __CL.UI.mg.dial({ rounds: 4 }), 1)`); await shot('a17-dial');
  for (let i = 0; i < 4; i++) { await ev(`(() => { const b = document.querySelector('.modal .btn.primary'); b && b.click(); return 1; })()`); await page.wait(450); }
  await page.wait(600);
  await ev(`(window._s = __CL.UI.mg.sneak({ guards: 4 }), 1)`); await shot('a18-sneak');
  await ev(`(() => { const b = [...document.querySelectorAll('.modal .btn')].find(b => b.textContent.includes('Give up')); b && b.click(); return 1; })()`); await page.wait(1200);
  await ev(`(window._q = __CL.UI.mg.quiz('driving', 2, __CL.G.life), 1)`); await shot('a19-quiz');
  await ev(`(() => { const b = document.querySelector('.quiz-a .btn'); b && b.click(); return 1; })()`); await page.wait(1300);
  await ev(`(() => { const b = document.querySelector('.quiz-a .btn'); b && b.click(); return 1; })()`); await page.wait(1300);

  // designer + end screen
  await ev('__CL.UI.showStart(), 1'); await page.wait(200);
  await ev(`(() => { const b = [...document.querySelectorAll('.start .btn')].find(b => b.textContent.includes('Design')); b.click(); return 1; })()`);
  await shot('a20-designer');
  await ev('__CL.UI.closeSheet(), 1');
  await ev(`(() => { const L = __CL.G.life; L.pending = []; L.stats.health = 0; L.age = Math.max(L.age, 60); __CL.G.ageUp(); return 1; })()`);
  await ev('__CL.UI.showEnd(), 1');
  await shot('a21-end');

  console.log(issues.length ? `LAYOUT ISSUES (${issues.length} screens):\n  ` + issues.join('\n  ') : 'no layout overflow found');
  const errs = page.logs.filter((l) => /\[(error|exception)\]/.test(l));
  console.log(errs.length ? 'CONSOLE ERRORS:\n  ' + errs.slice(0, 8).join('\n  ') : 'no console errors');
}
