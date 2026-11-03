/* ChipLife — core: namespace, content registry, constants and shared helpers.
   Every other script attaches to the global CL object. Content files only call CL.add(). */
(function (CL) {
  'use strict';

  // ---------------------------------------------------------------- content registry
  CL.content = {
    events: [], activityText: {}, interactionText: {}, crimeText: {}, lists: {},
    countries: [], jobs: [], partTimeJobs: [],
    quiz: { school: [], driving: [], interview: [] },
    catalog: { items: [], vehicles: [], houses: [], pets: [], vacations: [], illnesses: [] },
  };
  function merge(a, b) {
    for (const k of Object.keys(b)) {
      const av = a[k], bv = b[k];
      if (Array.isArray(av) && Array.isArray(bv)) a[k] = av.concat(bv);
      else if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) merge(av, bv);
      else a[k] = bv;
    }
    return a;
  }
  CL.add = function (group, data) {
    const C = CL.content;
    if (Array.isArray(data)) C[group] = (C[group] || []).concat(data);
    else if (data && typeof data === 'object') C[group] = merge(C[group] || {}, data);
  };

  // ---------------------------------------------------------------- constants
  CL.STATS = [
    { id: 'joy', label: 'Joy', emoji: '😊', color: '#f4a700' },
    { id: 'health', label: 'Health', emoji: '❤️', color: '#ef476f' },
    { id: 'smarts', label: 'Smarts', emoji: '🧠', color: '#3a86ff' },
    { id: 'style', label: 'Style', emoji: '✨', color: '#9b5de5' },
    { id: 'kindness', label: 'Kindness', emoji: '🤝', color: '#06b58a' },
  ];
  CL.SKILLS = [
    { id: 'music', label: 'Music', emoji: '🎵' }, { id: 'art', label: 'Art', emoji: '🎨' },
    { id: 'sports', label: 'Sports', emoji: '⚽' }, { id: 'coding', label: 'Coding', emoji: '💻' },
    { id: 'cooking', label: 'Cooking', emoji: '🍳' }, { id: 'writing', label: 'Writing', emoji: '✍️' },
    { id: 'acting', label: 'Acting', emoji: '🎭' },
  ];
  CL.MAJORS = [
    ['art', 'Art', '🎨'], ['biology', 'Biology', '🧬'], ['business', 'Business', '💼'], ['chemistry', 'Chemistry', '⚗️'],
    ['computer_science', 'Computer Science', '💻'], ['culinary_arts', 'Culinary Arts', '🍳'], ['economics', 'Economics', '📈'],
    ['education', 'Education', '🍎'], ['engineering', 'Engineering', '⚙️'], ['english', 'English', '📚'],
    ['environmental_science', 'Environmental Science', '🌱'], ['history', 'History', '🏛️'], ['journalism', 'Journalism', '📰'],
    ['music', 'Music', '🎵'], ['nursing', 'Nursing', '🩺'], ['physics', 'Physics', '🔭'], ['psychology', 'Psychology', '🧠'],
    ['sports_science', 'Sports Science', '🏃'], ['theater', 'Theater', '🎭'], ['architecture', 'Architecture', '📐'],
  ].map(([id, label, emoji]) => ({ id, label, emoji }));
  CL.GRAD = {
    law: { label: 'Law School', degree: 'Law Degree', years: 3, cost: 45000, minGpa: 60, emoji: '⚖️' },
    medical: { label: 'Medical School', degree: 'Medical Degree', years: 4, cost: 55000, minGpa: 70, emoji: '🩺', majors: ['biology', 'chemistry', 'nursing', 'psychology', 'physics'] },
    business: { label: 'Business School', degree: 'MBA', years: 2, cost: 60000, minGpa: 50, emoji: '💼' },
    phd: { label: 'PhD Program', degree: 'PhD', years: 5, cost: 0, stipend: 22000, minGpa: 75, emoji: '🎓' },
  };
  CL.TUITION = 22000;
  CL.INSTRUMENTS = ['piano', 'guitar', 'violin', 'drums', 'flute', 'ukulele', 'trumpet', 'cello', 'saxophone', 'harp'];
  CL.SPORTS = ['soccer', 'basketball', 'swimming', 'tennis', 'gymnastics', 'baseball', 'track', 'hockey', 'volleyball', 'karate', 'skateboarding', 'cycling'];
  CL.CAUSES = ['the animal shelter', 'the food bank', 'the public library', 'a park cleanup', 'the senior center', 'a beach cleanup', "the children's hospital", 'a community garden'];
  CL.CLUBS = [
    { id: 'chess', label: 'Chess Club', emoji: '♟️', fx: { smarts: 2 } },
    { id: 'robotics', label: 'Robotics Club', emoji: '🤖', fx: { smarts: 1, skills: { coding: 4 } } },
    { id: 'drama', label: 'Drama Club', emoji: '🎭', fx: { style: 1, skills: { acting: 4 } } },
    { id: 'band', label: 'School Band', emoji: '🎺', fx: { joy: 1, skills: { music: 4 } } },
    { id: 'art', label: 'Art Club', emoji: '🎨', fx: { joy: 1, skills: { art: 4 } } },
    { id: 'team', label: 'Sports Team', emoji: '🏅', fx: { health: 2, skills: { sports: 4 } } },
    { id: 'debate', label: 'Debate Team', emoji: '🎙️', fx: { smarts: 2, style: 1 } },
    { id: 'science', label: 'Science Club', emoji: '🔬', fx: { smarts: 3 } },
    { id: 'books', label: 'Book Club', emoji: '📚', fx: { smarts: 1, skills: { writing: 3 } } },
    { id: 'cooking', label: 'Cooking Club', emoji: '🧁', fx: { joy: 1, skills: { cooking: 4 } } },
    { id: 'garden', label: 'Garden Club', emoji: '🌻', fx: { kindness: 2, health: 1 } },
    { id: 'council', label: 'Student Council', emoji: '🗳️', fx: { kindness: 1, style: 2 } },
  ];
  CL.TALENTS = [
    { id: 'sing', label: 'Sing a song', emoji: '🎤', talent: 'a sparkly song', skill: 'music' },
    { id: 'dance', label: 'Dance routine', emoji: '🕺', talent: 'a dance routine', skill: 'sports' },
    { id: 'magic', label: 'Magic tricks', emoji: '🎩', talent: 'a magic act', skill: 'acting' },
    { id: 'comedy', label: 'Comedy act', emoji: '🤡', talent: 'a comedy act', skill: 'acting' },
    { id: 'paint', label: 'Speed painting', emoji: '🎨', talent: 'speed painting', skill: 'art' },
  ];
  CL.GIFTS = [
    { id: 'card', label: 'Handmade card', phrase: 'a handmade card', emoji: '🖍️', price: 0, power: 0.6 },
    { id: 'book', label: 'A good book', phrase: 'a really good book', emoji: '📘', price: 20, power: 0.9 },
    { id: 'flowers', label: 'Bunch of flowers', phrase: 'a bunch of flowers', emoji: '💐', price: 30, power: 1 },
    { id: 'sweater', label: 'Cozy sweater', phrase: 'a cozy sweater', emoji: '🧶', price: 60, power: 1.2 },
    { id: 'gadget', label: 'Shiny gadget', phrase: 'a shiny new gadget', emoji: '🎧', price: 300, power: 1.6 },
    { id: 'trip', label: 'Weekend trip', phrase: 'a surprise weekend trip', emoji: '🧳', price: 1500, power: 2.2 },
  ];

  // ---------------------------------------------------------------- utilities
  const U = (CL.util = {});
  let rng = Math.random;
  U.seed = function (s) {
    if (s == null) { rng = Math.random; return; }
    let a = s >>> 0;
    rng = function () { // mulberry32
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  U.r = () => rng();
  U.ri = (a, b) => a + Math.floor(rng() * (b - a + 1));
  U.rf = (a, b) => a + rng() * (b - a);
  U.chance = (p) => rng() < p;
  U.pick = (arr) => (arr && arr.length ? arr[Math.floor(rng() * arr.length)] : undefined);
  U.pickW = function (arr, wf) {
    let tot = 0;
    const ws = arr.map((x) => { const v = Math.max(0, +wf(x) || 0); tot += v; return v; });
    if (tot <= 0) return U.pick(arr);
    let r = rng() * tot;
    for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; }
    return arr[arr.length - 1];
  };
  U.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  U.sample = (arr, n) => U.shuffle(arr).slice(0, n);
  U.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  let uidN = 0;
  U.uid = () => 'x' + (uidN++).toString(36) + Math.floor(rng() * 46656).toString(36) + (Date.now() % 1679616).toString(36);
  U.money = function (n) {
    const neg = n < 0;
    n = Math.abs(Math.round(n || 0));
    let s;
    if (n >= 1e9) s = (n / 1e9).toFixed(n >= 1e10 ? 1 : 2).replace(/\.?0+$/, '') + 'B';
    else if (n >= 1e7) s = (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    else if (n >= 1e6) s = (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    else s = n.toLocaleString('en-US');
    return (neg ? '-$' : '$') + s;
  };
  U.num = function (n) {
    n = Math.round(n || 0);
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (Math.abs(n) >= 1e4) return Math.round(n / 1e3) + 'K';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  };
  U.cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  U.fill = (text, ctx) => String(text == null ? '' : text).replace(/\{(\w+)\}/g, (m, k) => (ctx && ctx[k] != null ? ctx[k] : m));
  U.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  U.tokens = (text) => [...String(text || '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  U.plural = (n, w, ws) => `${n} ${n === 1 ? w : ws || w + 's'}`;
  // A random line from a text group (activityText / interactionText / crimeText), with a safe fallback.
  U.line = function (group, key, bucket, fallback) {
    const g = CL.content[group] || {};
    const arr = (g[key] || {})[bucket];
    return arr && arr.length ? U.pick(arr) : fallback;
  };
  U.list = function (name, fallback) {
    const l = CL.content.lists[name];
    return Array.isArray(l) && l.length ? l : fallback;
  };
  U.statLabel = (id) => (CL.STATS.find((s) => s.id === id) || CL.SKILLS.find((s) => s.id === id) || { label: id }).label;
})((globalThis.CL = globalThis.CL || {}));
