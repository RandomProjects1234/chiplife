/* ChipLife UI — minigames (pop quiz, lock dial, searchlight sneak) and the step runner for acts. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const UI = CL.UI;
  const h = UI.h;
  const MG = (UI.mg = {});

  // ---------------------------------------------------------------- pop quiz
  const FALLBACK = { q: 'What do squirrels and chipmunks like to collect?', a: ['Acorns', 'Pebbles', 'Socks', 'Clouds'], c: 0 };
  function quizPool(set, L) {
    const Q = CL.content.quiz;
    if (set === 'school') {
      const age = U.clamp(L.age, 6, 18);
      const pool = Q.school.filter((q) => q.minAge <= age + 1 && q.maxAge >= age - 2);
      return pool.length >= 3 ? pool : Q.school;
    }
    return Q[set] || [];
  }
  MG.quiz = function (set, count, L) {
    if (UI.auto) return Promise.resolve({ correct: UI.auto === 'win' ? count : 0 });
    let pool = U.shuffle(quizPool(set, L));
    if (!pool.length) pool = [FALLBACK];
    const qs = [];
    for (let i = 0; i < count; i++) qs.push(pool[i % pool.length]);
    let i = 0, correct = 0;
    const marks = [];
    return UI.modal((close) => {
      const box = h('div');
      const draw = () => {
        const q = qs[i];
        const prog = h('div.progress', qs.map((_, k) => h('i' + (k < i ? (marks[k] ? '.ok' : '.no') : k === i ? '.now' : ''))));
        let locked = false;
        const btns = q.a.map((a, k) => h('button.btn.block', {
          onclick: () => {
            if (locked) return;
            locked = true;
            const right = k === q.c;
            if (right) correct++;
            marks[i] = right;
            btns[k].classList.add(right ? 'right' : 'wrong');
            if (!right) btns[q.c].classList.add('right');
            (right ? UI.sfx.good : UI.sfx.bad)();
            setTimeout(() => { i++; if (i >= qs.length) close({ correct }); else draw(); }, right ? 650 : 1100);
          },
        }, String(a)));
        box.replaceChildren(
          h('div.kicker', set === 'driving' ? 'Driving test' : set === 'school' ? 'Pop quiz' : 'Quiz'),
          prog, h('div.quiz-q', q.q), h('div.quiz-a', btns),
        );
      };
      draw();
      return box;
    }, { dismiss: false, tone: 'info', keys: (e) => { if (/^[1-4]$/.test(e.key)) { const b = document.querySelectorAll('.quiz-a .btn')[+e.key - 1]; if (b) b.click(); return true; } return false; } });
  };

  // ---------------------------------------------------------------- interview (one question, scored answers)
  MG.interview = function (question) {
    if (UI.auto) return Promise.resolve(UI.auto === 'win' ? 2 : -1);
    return UI.modal((close) => h('div', [
      h('div.kicker', 'Job interview'),
      h('div.me-big', '🤝'),
      h('div.quiz-q', question.q),
      h('div.quiz-a', question.a.map((a) => h('button.btn.block', { onclick: () => close(a.s) }, a.t))),
    ]), { dismiss: false, tone: 'info' });
  };

  // ---------------------------------------------------------------- lock dial
  // Stop the spinning needle inside the green zone. Logic runs on timestamps, so it works even if frames stall.
  MG.dial = function (o = {}) {
    if (UI.auto) return Promise.resolve({ success: UI.auto === 'win' });
    const rounds = o.rounds || 3;
    let speed = 0.5 * (o.speed || 1); // turns per second
    let round = 0, strikes = 0;
    let arc = 0, size = 0, dir = 1, t0 = 0, a0 = 0, raf = 0, busy = false;
    const R = 92, C = 115;
    const svgNS = 'http://www.w3.org/2000/svg';
    const el = (n, attrs) => { const e = document.createElementNS(svgNS, n); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
    const svg = el('svg', { viewBox: '0 0 230 230' });
    svg.appendChild(el('circle', { cx: C, cy: C, r: R + 14, fill: '#3b2f27' }));
    svg.appendChild(el('circle', { cx: C, cy: C, r: R, fill: '#5a4636', stroke: '#c9a46a', 'stroke-width': 4 }));
    for (let k = 0; k < 36; k++) {
      const a = (k * 10 * Math.PI) / 180;
      svg.appendChild(el('line', { x1: C + Math.cos(a) * (R - 4), y1: C + Math.sin(a) * (R - 4), x2: C + Math.cos(a) * (R - (k % 3 ? 10 : 16)), y2: C + Math.sin(a) * (R - (k % 3 ? 10 : 16)), stroke: '#d9c29b', 'stroke-width': k % 3 ? 1.5 : 3 }));
    }
    const zone = el('path', { fill: 'none', stroke: '#3ddc84', 'stroke-width': 16, 'stroke-linecap': 'round' });
    svg.appendChild(zone);
    const needle = el('line', { x1: C, y1: C, x2: C, y2: C - R + 6, stroke: '#ffd166', 'stroke-width': 6, 'stroke-linecap': 'round' });
    svg.appendChild(needle);
    svg.appendChild(el('circle', { cx: C, cy: C, r: 14, fill: '#e07a2c', stroke: '#fff3df', 'stroke-width': 3 }));
    const pinsEl = h('span.pins'), strikesEl = h('span.strikes');
    const wrap = h('div.dial-wrap', svg);
    const polar = (deg, r) => { const a = ((deg - 90) * Math.PI) / 180; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; };
    function setZone() {
      const [x1, y1] = polar(arc - size / 2, R - 12), [x2, y2] = polar(arc + size / 2, R - 12);
      zone.setAttribute('d', `M ${x1} ${y1} A ${R - 12} ${R - 12} 0 0 1 ${x2} ${y2}`);
    }
    const angleAt = (t) => (((a0 + dir * (t - t0) * speed * 0.36) % 360) + 360) % 360;
    function newRound() {
      size = Math.max(24, 54 - round * 7);
      arc = U.ri(0, 359);
      dir = U.chance(0.5) ? 1 : -1;
      t0 = performance.now();
      a0 = (arc + 140 + U.ri(0, 80)) % 360;
      setZone();
      pinsEl.textContent = '●'.repeat(round) + '○'.repeat(rounds - round);
      strikesEl.textContent = strikes ? '✕'.repeat(strikes) : '';
    }
    function frame() {
      needle.setAttribute('transform', `rotate(${angleAt(performance.now())} ${C} ${C})`);
      raf = requestAnimationFrame(frame);
    }
    return UI.modal((close) => {
      const stop = () => {
        if (busy) return;
        const ang = angleAt(performance.now());
        let diff = Math.abs(ang - arc) % 360;
        if (diff > 180) diff = 360 - diff;
        busy = true;
        if (diff <= size / 2 + 3) {
          round++;
          UI.sfx.good();
          wrap.classList.remove('dial-flash'); void wrap.offsetWidth; wrap.classList.add('dial-flash');
          if (round >= rounds) { cancelAnimationFrame(raf); setTimeout(() => close({ success: true }), 350); return; }
          speed *= 1.14;
        } else {
          strikes++;
          UI.sfx.bad();
          wrap.classList.remove('dial-miss'); void wrap.offsetWidth; wrap.classList.add('dial-miss');
          if (strikes >= 2) { cancelAnimationFrame(raf); strikesEl.textContent = '✕✕'; setTimeout(() => close({ success: false }), 500); return; }
        }
        setTimeout(() => { busy = false; newRound(); }, 280);
      };
      wrap.addEventListener('click', stop);
      newRound();
      raf = requestAnimationFrame(frame);
      return h('div', [
        h('div.kicker', o.title || 'Crack the lock!'),
        h('p', { style: { fontSize: '14px', margin: '0 0 6px' } }, 'Tap STOP when the needle is inside the green zone. Two misses and the alarm goes off!'),
        wrap,
        h('div.dial-status', [h('span', ['Pins ', pinsEl]), h('span', ['Misses ', strikesEl])]),
        h('button.btn.primary.block', { onclick: stop, 'data-autofocus': '' }, 'STOP!'),
      ]);
    }, { dismiss: false, tone: 'info', keys: (e, close) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); wrap.click(); return true; } return false; } })
      .finally(() => cancelAnimationFrame(raf));
  };

  // ---------------------------------------------------------------- searchlight sneak (turn based)
  const W = 7, H = 9;
  function makeLevel(nGuards) {
    for (let tries = 0; tries < 80; tries++) {
      const crates = new Set();
      const start = [H - 1, 3];
      const exit = [0, U.ri(0, W - 1)];
      while (crates.size < 7) {
        const r = U.ri(1, H - 2), c = U.ri(0, W - 1);
        crates.add(r * W + c);
      }
      const rows = U.sample([1, 2, 3, 4, 5, 6, 7], nGuards);
      const guards = rows.map((r) => {
        const len = U.ri(3, 5);
        const c0 = U.ri(0, W - len);
        const path = [];
        for (let c = c0; c < c0 + len; c++) path.push([r, c]);
        for (let c = c0 + len - 2; c > c0; c--) path.push([r, c]);
        const off = U.ri(0, path.length - 1);
        return { path, off };
      });
      // guards walk on open floor only
      if (guards.some((g) => g.path.some(([r, c]) => crates.has(r * W + c)))) continue;
      const lvl = { crates, start, exit, guards };
      if (lit(lvl, 0).has(start[0] * W + start[1])) continue;
      if (solvable(lvl)) return lvl;
    }
    return null;
  }
  const posAt = (g, t) => g.path[(t + g.off) % g.path.length];
  function lit(lvl, t) {
    const out = new Set();
    for (const g of lvl.guards) {
      const [r, c] = posAt(g, t);
      const [nr, nc] = posAt(g, t + 1);
      const dc = Math.sign(nc - c) || 1;
      out.add(r * W + c);
      for (let k = 1; k <= 2; k++) {
        const cc = c + dc * k;
        if (cc < 0 || cc >= W || lvl.crates.has(r * W + cc)) break;
        out.add(r * W + cc);
      }
      if (r + 1 < H && !lvl.crates.has((r + 1) * W + c)) out.add((r + 1) * W + c); // the flashlight spills one tile down
    }
    return out;
  }
  function solvable(lvl) {
    const period = lvl.guards.reduce((p, g) => { const n = g.path.length; const gcd = (a, b) => (b ? gcd(b, a % b) : a); return (p * n) / gcd(p, n); }, 1);
    const seen = new Set();
    const q = [[lvl.start[0], lvl.start[1], 0]];
    seen.add(`${lvl.start[0]},${lvl.start[1]},0`);
    while (q.length) {
      const [r, c, t] = q.shift();
      if (t > 60) continue;
      for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= H || nc < 0 || nc >= W || lvl.crates.has(nr * W + nc)) continue;
        if (nr === lvl.exit[0] && nc === lvl.exit[1]) return true;
        if (lit(lvl, t + 1).has(nr * W + nc)) continue;
        const key = `${nr},${nc},${(t + 1) % period}`;
        if (seen.has(key)) continue;
        seen.add(key);
        q.push([nr, nc, t + 1]);
      }
    }
    return false;
  }
  MG.sneak = function (o = {}) {
    if (UI.auto) return Promise.resolve({ success: UI.auto === 'win' });
    const lvl = makeLevel(o.guards || 3) || makeLevel(2);
    if (!lvl) return Promise.resolve({ success: U.chance(0.4) });
    let [pr, pc] = lvl.start;
    let t = 0, over = false, movesLeft = 40;
    const face = G.myFace(G.life);
    return UI.modal((close) => {
      const grid = h('div.sneak', { style: { gridTemplateColumns: `repeat(${W}, var(--cs))`, '--cs': `min(40px, calc((100vw - 116px) / ${W}), calc((100vh - 310px) / ${H}))` } });
      const info = h('div.sneak-legend');
      const finish = (ok) => { over = true; draw(); (ok ? UI.sfx.good : UI.sfx.bad)(); setTimeout(() => close({ success: ok }), ok ? 600 : 900); };
      const move = (dr, dc) => {
        if (over) return;
        const nr = pr + dr, nc = pc + dc;
        if (nr < 0 || nr >= H || nc < 0 || nc >= W || lvl.crates.has(nr * W + nc)) return;
        pr = nr; pc = nc; t++; movesLeft--;
        UI.sfx.tick();
        if (pr === lvl.exit[0] && pc === lvl.exit[1]) return finish(true);
        if (lit(lvl, t).has(pr * W + pc) || movesLeft <= 0) return finish(false);
        draw();
      };
      const draw = () => {
        const now = lit(lvl, t), next = lit(lvl, t + 1);
        const guards = new Set(lvl.guards.map((g) => { const [r, c] = posAt(g, t); return r * W + c; }));
        const cells = [];
        for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
          const k = r * W + c;
          let cls = '.cell';
          let txt = '';
          if (lvl.crates.has(k)) { cls += '.crate'; txt = '📦'; }
          else if (r === lvl.exit[0] && c === lvl.exit[1]) { cls += '.exit'; txt = '🚪'; }
          if (now.has(k)) cls += '.lit';
          else if (next.has(k)) cls += '.next';
          if (guards.has(k)) txt = '👮';
          if (r === pr && c === pc) txt = over && now.has(k) ? '😳' : face;
          const adj = Math.abs(r - pr) + Math.abs(c - pc) === 1 && !lvl.crates.has(k);
          if (adj && !over) cls += '.can';
          cells.push(h('div' + cls, { onclick: adj ? () => move(r - pr, c - pc) : null }, txt));
        }
        grid.replaceChildren(...cells);
        info.textContent = over ? '' : `Reach the 🚪 and stay out of the light. Striped tiles light up next. Moves left: ${movesLeft}`;
      };
      draw();
      const pad = h('div.sneak-pad', [
        h('button.btn', { onclick: () => move(0, -1), 'aria-label': 'Left' }, '⬅️'),
        h('button.btn', { onclick: () => move(-1, 0), 'aria-label': 'Up' }, '⬆️'),
        h('button.btn', { onclick: () => move(0, 0), title: 'Wait a turn', 'aria-label': 'Wait' }, '⏸️'),
        h('button.btn', { onclick: () => move(1, 0), 'aria-label': 'Down' }, '⬇️'),
        h('button.btn', { onclick: () => move(0, 1), 'aria-label': 'Right' }, '➡️'),
      ]);
      MG._sneakMove = move;
      return h('div', [h('div.kicker', 'Escape!'), info, grid, pad, h('button.btn.block.small', { onclick: () => { if (!over) finish(false); } }, 'Give up')]);
    }, {
      dismiss: false, tone: 'info',
      keys: (e) => {
        const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1], ' ': [0, 0] }[e.key];
        if (m && MG._sneakMove) { e.preventDefault(); MG._sneakMove(m[0], m[1]); return true; }
        return false;
      },
    });
  };
  MG._level = makeLevel;
  MG._solvable = solvable;

  // ---------------------------------------------------------------- step runner
  UI.runSteps = async function (steps) {
    const args = {};
    for (const s of steps || []) {
      const L = G.life;
      if (s.type === 'pick') {
        const opts = s.options(L, args);
        if (!opts.length) { UI.toast('Nothing available right now.'); return null; }
        const id = await UI.pick(s.title, opts, s.note);
        if (id == null) return null;
        args[s.key] = id;
      } else if (s.type === 'confirm') {
        if (!(await UI.confirm(s.text))) return null;
      } else if (s.type === 'quiz') {
        const res = await MG.quiz(s.set, s.count, L);
        if (!res) return null;
        args.correct = res.correct;
      } else if (s.type === 'mini') {
        const res = await MG[s.mini](s.opts ? s.opts(L, args) : {});
        if (!res) return null;
        args.mini = res;
      }
    }
    return args;
  };
})(globalThis.CL);
