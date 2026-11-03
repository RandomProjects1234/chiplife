/* ChipLife — boot. */
(function (CL) {
  'use strict';
  const G = CL.G;
  const UI = CL.UI;
  function boot() {
    CL.meta.init();
    G.life = G.loadLife();
    if (G.life && !G.life.alive) UI.showEnd();
    else UI.showStart();
    // Android back button (called by the APK). Returns true when the game handled it.
    window.__back = function () {
      if (document.querySelector('.modal-layer')) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        return true; // never quit in the middle of a decision
      }
      if (UI.sheetOpen()) { UI.back(); return true; }
      if (UI.screen === 'game') { G.save(); UI.showStart(); return true; }
      return false;
    };
    window.__save = () => G.save();
    // Debug / test hook (used by tools/browser-test.mjs).
    window.__CL = {
      CL, G, UI, U: CL.util,
      auto(v) { UI.auto = v; },
      age(n = 1) {
        for (let i = 0; i < n && G.life && G.life.alive; i++) {
          while (G.life.pending.length) G.resolvePending(0);
          G.ageUp();
        }
        UI.render(true);
        return G.life && G.life.age;
      },
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(globalThis.CL);
