/* ChipLife UI — DOM helpers, sheets (bottom panels), modals, toasts and little sounds. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const UI = (CL.UI = CL.UI || {});

  // h('div.card', {onclick}, [children]) — tiny element builder
  UI.h = function (sel, attrs, kids) {
    if (Array.isArray(attrs) || typeof attrs === 'string' || attrs instanceof Node) { kids = attrs; attrs = {}; }
    const m = sel.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i) || [];
    const el = document.createElement(m[1] || 'div');
    for (const part of (m[2] || '').match(/[.#][\w-]+/g) || []) {
      if (part[0] === '.') el.classList.add(part.slice(1));
      else el.id = part.slice(1);
    }
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') {
        for (const [sk, sv] of Object.entries(v)) {
          if (sv == null) continue;
          if (sk.startsWith('--')) el.style.setProperty(sk, sv); // custom properties need setProperty
          else el.style[sk] = sv;
        }
      }
      else if (k === 'html') el.innerHTML = v;
      else if (k in el && k !== 'list') { try { el[k] = v; } catch { el.setAttribute(k, v); } }
      else el.setAttribute(k, v);
    }
    const add = (c) => {
      if (c == null || c === false) return;
      if (Array.isArray(c)) c.forEach(add);
      else el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    add(kids);
    return el;
  };
  const h = UI.h;
  UI.$ = (s) => document.querySelector(s);

  // ---------------------------------------------------------------- deltas
  const STAT = Object.fromEntries(CL.STATS.map((s) => [s.id, s]));
  const SKILL = Object.fromEntries(CL.SKILLS.map((s) => [s.id, s]));
  UI.deltaChips = function (d) {
    if (!d || !d.length) return null;
    const sign = (v) => (v > 0 ? '+' : '−') + Math.abs(v);
    return h('div.deltas', d.map((x) => {
      let txt, up = x.v > 0;
      if (STAT[x.k]) txt = `${STAT[x.k].emoji} ${sign(x.v)}`;
      else if (x.k === 'money') txt = `${x.v > 0 ? '+' : '−'}${U.money(Math.abs(x.v))}`;
      else if (x.k === 'bond') txt = `💛 ${sign(x.v)} ${x.who || ''}`.trim();
      else if (x.k === 'skill') txt = `${(SKILL[x.s] || {}).emoji || '⭐'} ${sign(x.v)}`;
      else if (x.k === 'grades') txt = `📝 ${sign(x.v)} grades`;
      else if (x.k === 'perf') txt = `📈 ${sign(x.v)} work`;
      else if (x.k === 'fame') txt = `⭐ ${sign(x.v)} fame`;
      else if (x.k === 'notoriety') { txt = `🚨 ${sign(x.v)} heat`; up = x.v < 0; }
      else if (x.k === 'followers') txt = `👥 ${x.v > 0 ? '+' : '−'}${U.num(Math.abs(x.v))}`;
      else if (x.k === 'friend') { txt = `🤝 ${x.who}`; up = true; }
      else if (x.k === 'pet') { txt = `🐾 ${x.who}`; up = true; }
      else return null;
      return h('span.dl' + (up ? '.up' : '.down'), txt);
    }).filter(Boolean));
  };

  // ---------------------------------------------------------------- sound
  let ac = null;
  function beep(freq, dur, type, vol, when) {
    if (!CL.G.meta || CL.G.meta.sound === false) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime + (when || 0);
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch { /* no audio - fine */ }
  }
  UI.sfx = {
    age: () => { beep(523, 0.14, 'triangle', 0.09); beep(784, 0.22, 'triangle', 0.09, 0.1); },
    good: () => { beep(660, 0.1, 'sine'); beep(880, 0.16, 'sine', 0.08, 0.08); },
    bad: () => { beep(330, 0.14, 'square', 0.04); beep(247, 0.2, 'square', 0.04, 0.1); },
    tap: () => beep(700, 0.05, 'sine', 0.04),
    acorn: () => { [784, 988, 1175, 1568].forEach((f, i) => beep(f, 0.12, 'triangle', 0.07, i * 0.07)); },
    tick: () => beep(1200, 0.03, 'square', 0.02),
  };

  // ---------------------------------------------------------------- flags
  // Windows browsers (except Firefox) draw flag emoji as two plain letters, so show a neat code badge instead.
  UI.flagsOK = (() => { try { const ua = navigator.userAgent; return !(/Windows/.test(ua) && !/Firefox/.test(ua)); } catch { return true; } })();
  UI.isFlag = (e) => /^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(e || '');
  UI.flagCode = (e) => [...String(e || '')].map((ch) => String.fromCharCode(ch.codePointAt(0) - 0x1f1e6 + 65)).join('');
  UI.em = (e) => (!UI.flagsOK && UI.isFlag(e) ? h('span.cc', UI.flagCode(e)) : e || '•');
  UI.flagText = (e) => (UI.flagsOK ? e : '');

  // ---------------------------------------------------------------- input mode (only show focus rings for keyboard users)
  let keyboard = false;
  document.addEventListener('keydown', () => { keyboard = true; }, true);
  document.addEventListener('pointerdown', () => { keyboard = false; }, true);

  // ---------------------------------------------------------------- toasts
  // Acorn toasts queue up and show one at a time so they never pile over the header.
  const acornQueue = [];
  let acornShowing = false;
  function showToast(text, cls, ms) {
    const box = UI.$('#toasts');
    if (!box) return;
    while (box.children.length >= 2) box.firstChild.remove();
    const t = h('div.toast' + (cls ? '.' + cls : ''), text);
    box.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }
  function pumpAcorns() {
    if (acornShowing || !acornQueue.length) return;
    acornShowing = true;
    showToast(acornQueue.shift(), 'acorn', 2100);
    UI.sfx.acorn();
    setTimeout(() => { acornShowing = false; pumpAcorns(); }, 2200);
  }
  UI.toast = function (text, cls) {
    if (cls === 'acorn') { acornQueue.push(text); pumpAcorns(); return; }
    showToast(text, cls, 2400);
  };

  // ---------------------------------------------------------------- modals (one at a time, queued)
  let modalChain = Promise.resolve();
  UI.modalOpen = false;
  // build(close) returns the modal element; close(value) resolves the promise.
  UI.modal = function (build, opts = {}) {
    const p = modalChain.then(() => new Promise((resolve) => {
      UI.modalOpen = true;
      const layer = h('div.modal-layer');
      let done = false;
      const close = (v) => {
        if (done) return;
        done = true;
        layer.remove();
        UI.modalOpen = false;
        document.removeEventListener('keydown', onKey);
        resolve(v);
      };
      const onKey = (e) => {
        if (opts.keys && opts.keys(e, close)) return;
        if (e.key === 'Escape' && opts.dismiss !== false) close(null);
      };
      const box = build(close);
      box.classList.add('modal');
      if (opts.tone) box.classList.add(opts.tone);
      layer.appendChild(box);
      if (opts.dismiss !== false) layer.addEventListener('click', (e) => { if (e.target === layer) close(null); });
      document.addEventListener('keydown', onKey);
      UI.$('#app').appendChild(layer);
      const first = box.querySelector('[data-autofocus]') || box.querySelector('button');
      if (first && keyboard) setTimeout(() => first.focus({ preventScroll: true }), 30);
    }));
    modalChain = p.catch(() => {});
    return p;
  };
  UI.result = function (r) {
    if (!r) return Promise.resolve();
    if (r.silent && !r.d.length) { UI.toast(r.text); return Promise.resolve(); }
    (r.tone === 'good' ? UI.sfx.good : r.tone === 'bad' ? UI.sfx.bad : UI.sfx.tap)();
    return UI.modal((close) => h('div', [
      h('div.me-big', UI.em(r.emoji || '🌰')),
      r.title ? h('h3', r.title) : null,
      h('p', r.text),
      UI.deltaChips(r.d),
      h('button.btn.primary.block', { onclick: () => close(true), 'data-autofocus': '' }, 'OK'),
    ]), { tone: r.tone === 'good' ? 'good' : r.tone === 'bad' ? 'bad' : 'info' });
  };
  UI.confirm = (text, yes = 'Yes', no = 'Never mind') => UI.modal((close) => h('div', [
    h('div.me-big', '🤔'),
    h('p', text),
    h('div.choices', [h('button.btn.primary.block', { onclick: () => close(true) }, yes), h('button.btn.block', { onclick: () => close(false) }, no)]),
  ]), { tone: 'info' }).then((v) => !!v);
  UI.choose = (view) => UI.modal((close) => h('div', [
    h('div.kicker', view.title || ''),
    h('div.me-big', view.emoji || '❓'),
    h('p', view.text),
    h('div.choices', view.choices.map((c, i) => h('button.btn.block' + (i === 0 ? '.primary' : ''), { onclick: () => close(i) }, c))),
  ]), { dismiss: false, tone: 'info' });
  UI.pick = (title, options, note) => UI.modal((close) => h('div', [
    h('h3', title),
    note ? h('p.note', note) : null,
    h('div.rows', options.map((o) => UI.row({ emoji: o.emoji, label: o.label, sub: o.sub, disabled: o.disabled, onClick: () => close(o.id) }))),
    h('button.btn.block', { style: { marginTop: '10px' }, onclick: () => close(null) }, 'Cancel'),
  ]), { tone: 'info' });

  // ---------------------------------------------------------------- rows & bits
  UI.row = function (o) {
    return h('button.row', { disabled: !!o.disabled, onclick: o.onClick, title: o.title || null }, [
      h('span.ic', UI.em(o.emoji)),
      h('span.tx', [h('b', o.label), o.sub ? h('small' + (o.subBad ? '.why' : ''), o.sub) : null]),
      o.right != null ? (o.right instanceof Node ? o.right : h('span.rt' + (o.rightCls ? '.' + o.rightCls : ''), o.right)) : null,
    ]);
  };
  UI.minibar = (v, color) => h('span.minibar', { style: { '--c': color || 'var(--accent)' } }, h('i', { style: { width: U.clamp(v, 0, 100) + '%' } }));
  UI.meter = (label, v, color, right) => h('div.meter', [
    h('div.lab', [h('span', label), h('span', right != null ? right : String(Math.round(v)))]),
    h('div.bar', { style: { '--c': color || 'var(--accent)' } }, h('i', { style: { width: U.clamp(v, 0, 100) + '%' } })),
  ]);
  UI.sec = (t) => h('div.sec', t);

  // ---------------------------------------------------------------- sheet (bottom panel with a view stack)
  const stack = [];
  UI.sheetOpen = () => stack.length > 0;
  function renderSheet() {
    const layer = UI.$('#layer');
    if (!layer) return;
    if (!stack.length) {
      layer.classList.remove('open');
      return;
    }
    const v = stack[stack.length - 1];
    const sheet = layer.querySelector('.sheet');
    const head = h('div.sheet-h', [
      h('button.icon-btn' + (stack.length > 1 ? '' : '.hide'), { onclick: UI.back, 'aria-label': 'Back' }, '‹'),
      h('h2', typeof v.title === 'function' ? v.title() : v.title),
      h('button.icon-btn', { onclick: UI.closeSheet, 'aria-label': 'Close' }, '✕'),
    ]);
    const body = h('div.sheet-b');
    try { body.appendChild(v.render()); } catch (e) { console.error(e); body.appendChild(h('p', 'Oops, something went wrong here.')); }
    const old = sheet.querySelector('.sheet-b');
    const keep = old && v.scrollKeep ? old.scrollTop : 0;
    sheet.replaceChildren(h('div.grab'), head, body);
    body.scrollTop = keep;
    layer.classList.add('open');
  }
  UI.openSheet = function (view) { stack.length = 0; stack.push(view); renderSheet(); };
  UI.push = function (view) { stack.push(view); renderSheet(); };
  UI.back = function () { stack.pop(); renderSheet(); };
  UI.closeSheet = function () { stack.length = 0; renderSheet(); };
  UI.refreshSheet = function () {
    if (!stack.length) return;
    const v = stack[stack.length - 1];
    v.scrollKeep = true;
    if (v.valid && !v.valid()) { stack.pop(); }
    renderSheet();
  };
})(globalThis.CL);
