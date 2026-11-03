// Android back-button contract (window.__back) + escape minigame fit on a small phone.
//   W=360 H=640 node tools/cdp.mjs tools/tests/back.mjs
export default async function (page) {
  const ev = (s) => page.eval('return (' + s + ')');
  const state = () => ev(`({ screen: __CL.UI.screen, sheet: __CL.UI.sheetOpen(), modal: !!document.querySelector('.modal-layer') })`);
  const results = [];
  const check = (label, got, want) => results.push(`${got === want ? 'ok  ' : 'FAIL'} ${label}: ${JSON.stringify(got)}${got === want ? '' : ' (wanted ' + JSON.stringify(want) + ')'}`);

  await ev('localStorage.clear(), 1');
  await ev('location.reload(), 1');
  await page.wait(1000);
  check('title screen -> app may exit', await ev('window.__back()'), false);
  await ev(`(__CL.G.newLife({}), __CL.G.life.pending = [], __CL.UI.showGame(), 1)`);
  await page.wait(300);
  await ev(`__CL.UI.openTab('people'), 1`);
  await ev(`__CL.UI.push(__CL.UI.sub.personView(__CL.G.life.people[0].id)), 1`);
  check('person view -> handled', await ev('window.__back()'), true);
  check('...back to the people list', (await state()).sheet, true);
  check('people list -> handled', await ev('window.__back()'), true);
  check('...sheet closed', (await state()).sheet, false);
  await ev(`(__CL.UI.result({ emoji: '🌰', text: 'hi', tone: 'good', d: [] }), 1)`);
  await page.wait(200);
  check('result card -> handled', await ev('window.__back()'), true);
  await page.wait(200);
  check('...card dismissed', (await state()).modal, false);
  await ev(`(__CL.UI.choose({ title: 'Age 1', text: 'Pick one', choices: ['A', 'B'] }), 1)`);
  await page.wait(200);
  check('decision -> handled', await ev('window.__back()'), true);
  check('...decision stays open (must choose)', (await state()).modal, true);
  await ev(`(document.querySelector('.modal .btn').click(), 1)`);
  await page.wait(200);
  check('game screen -> handled', await ev('window.__back()'), true);
  check('...went to title', (await state()).screen, 'start');

  // escape grid fits a 360x640 phone without sideways scrolling
  await ev(`(__CL.UI.showGame(), window._s = __CL.UI.mg.sneak({ guards: 4 }), 1)`);
  await page.wait(500);
  const fit = await ev(`(() => { const m = document.querySelector('.modal'); return { scrollX: m.scrollWidth > m.clientWidth, scrollY: m.scrollHeight > m.clientHeight }; })()`);
  check('escape grid fits sideways', fit.scrollX, false);
  check('escape grid fits vertically', fit.scrollY, false);
  await page.shot('back-sneak-360');
  console.log('  ' + results.join('\n  '));
}
