// End-to-end UI smoke test.  node tools/cdp.mjs tools/tests/smoke.mjs   (server on :3508)
// Plays a life through the real UI, opens every panel, runs the minigames, jail and the end screen.
export default async function (page) {
  const P = process.env.PREFIX || '';
  const ev = (s) => page.eval('return (' + s + ')');
  // Click through any open modal: prefer an enabled row (pick lists), then the primary button, then any button.
  async function clear(max = 40) {
    let idle = 0;
    for (let i = 0; i < max && idle < 3; i++) {
      const did = await ev(`(() => {
        const m = document.querySelector('.modal-layer');
        if (!m) return 0;
        const b = m.querySelector('.row:not(:disabled)') || m.querySelector('.quiz-a .btn') || m.querySelector('.btn.primary:not(:disabled)') || m.querySelector('.btn:not(:disabled)');
        if (b) { b.click(); return 1; }
        return 0;
      })()`);
      if (did) idle = 0; else idle++;
      await page.wait(did ? 200 : 150);
    }
  }
  const errs = () => page.logs.filter((l) => /\[(error|exception)\]/.test(l));

  await ev('localStorage.clear(), 1');
  await ev('location.reload(), 1');
  await page.wait(1500);
  await page.shot(P + '01-title');

  await ev(`document.querySelector('.start .btn.primary').click(), 1`);
  await page.wait(500);
  await clear();
  for (let i = 0; i < 9; i++) {
    await ev('__CL.UI.ageUp(), 1');
    await page.wait(250);
    await clear();
  }
  await page.wait(400);
  await page.shot(P + '02-age9');
  console.log('  life:', await ev('`${__CL.G.life.first} ${__CL.G.life.last}, age ${__CL.G.life.age}, ${__CL.G.life.edu.stage}`'));

  for (const tab of ['path', 'people', 'do', 'stuff', 'profile', 'menu']) {
    await ev(`__CL.UI.openTab('${tab}'), 1`);
    await page.wait(450);
    await page.shot(P + '03-tab-' + tab);
    await ev('__CL.UI.closeSheet(), 1');
  }
  // a person
  await ev(`__CL.UI.openTab('people'), 1`);
  await page.wait(300);
  await ev(`document.querySelector('.sheet .row').click(), 1`);
  await page.wait(400);
  await page.shot(P + '04-person');
  await ev(`[...document.querySelectorAll('.sheet .act:not(:disabled)')][0].click(), 1`);
  await page.wait(400);
  await page.shot(P + '05-interact-result');
  await clear();
  await ev('__CL.UI.closeSheet(), 1');

  // activities through the real flow
  await ev(`__CL.auto('win'), 1`);
  for (const id of ['library', 'walk', 'popQuiz', 'clubs', 'music', 'prank']) {
    await ev(`__CL.UI.doAct('${id}'), 1`);
    await page.wait(300);
    await clear();
  }
  await ev(`__CL.auto(null), 1`);

  // minigames for real (not auto)
  await ev(`window._q = __CL.UI.mg.quiz('school', 3, __CL.G.life), 1`);
  await page.wait(500);
  await page.shot(P + '06-quiz');
  await clear();
  await ev(`window._d = __CL.UI.mg.dial({ rounds: 3, title: 'Crack the vault!' }), 1`);
  await page.wait(700);
  await page.shot(P + '07-dial');
  for (let i = 0; i < 6; i++) { await ev(`(document.querySelector('.modal .btn.primary')||{click(){}}).click(), 1`); await page.wait(420); }
  console.log('  dial result:', JSON.stringify(await ev('Promise.race([window._d, new Promise(r => setTimeout(() => r("open"), 300))])')));
  await clear();
  await ev(`window._s = __CL.UI.mg.sneak({ guards: 3 }), 1`);
  await page.wait(500);
  await page.shot(P + '08-sneak');
  await ev(`[...document.querySelectorAll('.modal .btn')].find(b => b.textContent.includes('Give up')).click(), 1`);
  await page.wait(1200);
  console.log('  sneak result:', JSON.stringify(await ev('window._s')));

  // grow up, get rich, go shopping, job board
  console.log('  aged to', await ev('__CL.age(14)'));
  await ev('__CL.G.life.money = 3000000, __CL.G.life.license = true, __CL.UI.render(true), 1');
  await ev(`__CL.UI.openTab('stuff'), 1`);
  await page.wait(300);
  await ev(`[...document.querySelectorAll('.sheet .row')].find(r => r.textContent.includes('Real estate')).click(), 1`);
  await page.wait(400);
  await page.shot(P + '09-realestate');
  await ev(`[...document.querySelectorAll('.sheet .row:not(:disabled)')].slice(-1)[0].click(), 1`);
  await page.wait(300);
  await clear();
  await ev('__CL.UI.closeSheet(), 1');
  await ev(`__CL.UI.openTab('path'), 1`);
  await page.wait(300);
  await page.shot(P + '10-career');
  const jb = await ev(`(() => { const r = [...document.querySelectorAll('.sheet .row')].find(r => r.textContent.includes('job board')); if (r) { r.click(); return 1; } return 0; })()`);
  await page.wait(400);
  if (jb) await page.shot(P + '11-jobboard');
  await ev('__CL.UI.closeSheet(), 1');

  // a bank heist with real picks (minigame auto-won)
  await ev(`__CL.auto('win'), 1`);
  await ev(`__CL.UI.doAct('bankHeist'), 1`);
  await page.wait(300);
  await page.shot(P + '12-heist-pick');
  await clear();
  await page.wait(300);
  console.log('  heists:', await ev('__CL.G.life.totals.heists'), 'jail:', await ev('!!__CL.G.life.prison'), 'money:', await ev('__CL.U.money(__CL.G.life.money)'));

  // jail
  await ev(`__CL.G.life.prison || __CL.G.sendToPrison(4, 'Bank robbery'), __CL.UI.render(true), 1`);
  await ev(`__CL.UI.openTab('path'), 1`);
  await page.wait(400);
  await page.shot(P + '13-jail');
  await ev('__CL.UI.closeSheet(), 1');
  await ev(`__CL.auto('lose'), 1`);
  await ev(`__CL.UI.doAct('pEscape'), 1`);
  await page.wait(300);
  await clear();
  await ev(`__CL.auto(null), 1`);

  // the end
  await ev('__CL.age(30)');
  await ev('(() => { const L = __CL.G.life; while (L.pending.length) __CL.G.resolvePending(0); L.stats.health = 0; L.age = Math.max(L.age, 70); return 1; })()');
  await ev('__CL.UI.ageUp(), 1');
  await page.wait(400);
  await clear();
  await page.wait(1200);
  await page.shot(P + '14-end');
  console.log('  screen:', await ev('__CL.UI.screen'), '| chip:', await ev('(__CL.G.life.chip||{}).label'));

  const e = errs();
  console.log(e.length ? `  CONSOLE ERRORS (${e.length}):\n    ` + e.slice(0, 10).join('\n    ') : '  no console errors');
}
