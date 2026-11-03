// ChipLife content checker.
//   node tools/check-content.mjs                      -> check every js/content/*.js
//   node tools/check-content.mjs js/content/a.js ...   -> check just these files
// Reports syntax errors, schema errors, unknown {tokens} and family-friendliness problems.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'js', 'content');

const STATS = ['joy', 'health', 'smarts', 'style', 'kindness'];
const SKILLS = ['music', 'art', 'sports', 'coding', 'cooking', 'writing', 'acting'];
const PETS = ['dog', 'cat', 'rabbit', 'hamster', 'guinea_pig', 'bird', 'fish', 'turtle', 'lizard', 'horse'];
const ILLS = ['cold', 'flu', 'allergies', 'ear_infection', 'chickenpox', 'stomach_bug', 'sprained_ankle', 'broken_arm', 'sunburn', 'asthma', 'migraine', 'back_pain', 'high_blood_pressure', 'arthritis', 'cataracts'];
const MAJORS = ['art', 'biology', 'business', 'chemistry', 'computer_science', 'culinary_arts', 'economics', 'education', 'engineering', 'english', 'environmental_science', 'history', 'journalism', 'music', 'nursing', 'physics', 'psychology', 'sports_science', 'theater', 'architecture'];
const EDU = ['none', 'highschool', 'bachelor', 'law', 'medical', 'business', 'phd'];
const TRACKS = ['Education', 'Healthcare', 'Technology', 'Science', 'Business', 'Finance', 'Law', 'Arts', 'Media', 'Food', 'Trades', 'Retail', 'Transport', 'Public Service', 'Sports', 'Animals', 'Space', 'Entertainment'];
const NEEDS = ['school', 'college', 'job', 'noJob', 'prison', 'car', 'house', 'rich', 'poor', 'famous', 'record', 'license', 'withParents', 'ownPlace', 'retired'];
const EVENT_TOKENS = ['name', 'city', 'country', 'mom', 'dad', 'grandparent', 'sibling', 'siblingRole', 'friend', 'child', 'childRole', 'pet', 'petType', 'classmate', 'teacher', 'neighbor', 'coworker', 'boss', 'newFriend', 'school', 'job', 'company', 'amount'];
const PERSON_TOKENS = ['mom', 'dad', 'grandparent', 'sibling', 'friend', 'child', 'pet'];
const NUM_EFFECTS = { joy: [-25, 25], health: [-25, 25], smarts: [-25, 25], style: [-25, 25], kindness: [-25, 25], money: [-50000, 50000], fame: [-10, 15], notoriety: [-10, 20], followers: [-10000, 20000], bond: [-30, 30], grades: [-20, 20], performance: [-20, 20], fine: [1, 5000], jail: [1, 3] };
const SUBJECTS = ['math', 'science', 'geography', 'language', 'history', 'nature', 'art', 'music'];
const ITEM_KINDS = ['toy', 'gadget', 'instrument', 'sports', 'fashion', 'book', 'art', 'kitchen', 'hobby'];
const UNLOCKS = ['music', 'coding', 'video', 'art', 'sports', 'cooking', 'writing', 'acting'];
const VEHICLE_KINDS = ['bike', 'scooter', 'car', 'suv', 'van', 'truck', 'sports', 'luxury'];

const B4 = ['great', 'good', 'meh', 'bad'];
const B3 = ['great', 'good', 'meh'];
// group -> key -> [buckets, extraTokens]
const TEXT_SPECS = {
  activityText: {
    min: 6,
    keys: {
      gym: [B4], walk: [B4], meditate: [B4], library: [B4], healthyMeal: [B4],
      doctorCheckup: [['good', 'cured', 'notCured'], ['illness']],
      music: [B4, ['instrument']], art: [B4], coding: [B4], cooking: [B4], sports: [B4, ['sport']],
      acting: [B4], writing: [B4], movies: [B4, ['movie']], amusementPark: [B4], arcade: [B4],
      vacation: [B4, ['place']], party: [B4], volunteer: [B4, ['cause']],
      donate: [['great', 'good'], ['amount', 'charity']], raffle: [['win', 'lose'], ['amount']],
      makeFriend: [['success', 'fail'], ['them']], video: [['viral', 'good', 'flop'], ['topic']],
      book: [['hit', 'good', 'flop'], ['title']], song: [['hit', 'good', 'flop'], ['title']],
      talentShow: [['win', 'good', 'flop'], ['talent']], audition: [['success', 'fail'], ['role']],
    },
  },
  interactionText: {
    min: 5,
    keys: {
      spendTime: [B4], chat: [B4, ['topic']], compliment: [B4], gift: [B4, ['gift']], playGame: [B4, ['game']],
      joke: [B4], askMoney: [['yes', 'no'], ['amount']], apologize: [['great', 'good', 'bad']],
      argue: [['good', 'bad']], prank: [['great', 'good', 'bad']], hug: [B3], chores: [B3, ['chore']],
      readStory: [B3], teach: [B3, ['lesson']], allowance: [['good'], ['amount']], remember: [['good']],
      endFriendship: [['good']], petPlay: [B4, ['petType']], petWalk: [B4, ['petType']],
      petTreat: [B3, ['petType']], petVet: [['good'], ['petType']],
    },
    baseTokens: ['them'],
  },
  crimeText: {
    min: 5,
    keys: {
      prank: [['success', 'fail', 'caught'], ['prank']],
      shoplift: [['success', 'fail', 'caught'], ['loot', 'store']],
      pickpocket: [['success', 'fail', 'caught'], ['target', 'amount']],
      burglary: [['success', 'fail', 'caught'], ['home', 'amount']],
      carTheft: [['success', 'fail', 'caught'], ['car']],
      bankHeist: [['success', 'fail', 'caught'], ['bank', 'amount']],
      heistPlan: [['tunnel', 'disguise', 'hack'], ['bank']],
      getaway: [['success', 'caught']],
      court: [['guilty', 'notGuilty', 'fine', 'juvenile'], ['years', 'amount']],
      prison: [['arrive', 'release', 'parole', 'paroleDenied', 'appealWin', 'appealLose', 'escapeSuccess', 'escapeCaught', 'study', 'workout', 'behave', 'makeFriend', 'kitchen'], ['prison', 'years', 'them']],
    },
  },
};
const LIST_SPECS = {
  movies: 20, charities: 12, movieRoles: 15, chatTopics: 30, games: 25, chores: 15, lessons: 15,
  pranks: 20, stores: 20, shopLoot: 30, pickpocketTargets: 20, stealCars: 20, bankNames: 15, prisonNames: 12,
  videoTopics: 25, bookTitles: 30, songTitles: 30, petNames: 60,
  schoolNames: { keys: ['elementary', 'middle', 'high', 'college'], min: 15 },
  companies: { keys: TRACKS, min: 8 },
};

// [regex, why, level]
const WORDS = [
  [/\blov(e|es|ed|er|ers|ing|ely|able|ingly)\b/i, 'avoid the word "love" entirely (use adore / really like / enjoy)', 'E'],
  [/\b(dating|boyfriends?|girlfriends?|kiss(es|ed|ing|y)?|weddings?|marr(y|ies|ied|iage|ying)|husbands?|wife|wives|spouses?|flirt\w*|romanc\w*|romantic\w*|sweethearts?|valentines?|honeymoon\w*|sexy|sex|sexual\w*|pregnan\w*|divorc\w*|smooch\w*|fianc\w*|newlywed\w*|soulmates?|crushing on|a crush)\b/i, 'romance', 'E'],
  [/\b(dates?|crush(es)?)\b/i, 'could read as romance - check context', 'W'],
  [/\b(damn\w*|dammit|hell|crap\w*|suck(s|ed|y)?|stupid\w*|idiot\w*|dumb\w*|jerks?|losers?|moron\w*|shut up|butts?|butt-?\w*|fart\w*|poop\w*|pee|peed|ass|asses|piss\w*|bastard\w*|bitch\w*|shit\w*|fuck\w*|wtf|omg|oh my god|jesus|christ|ugly|fat|fatty|freaks?|weirdos?|screw (you|it|this))\b/i, 'rude / bad word', 'E'],
  [/\b(nerds?|geeks?|god|gods|screw|screwed|heck)\b/i, 'borderline word - make sure it is kind', 'W'],
  [/\b(alcohol\w*|beers?|wine\w*|vodka|whiske?y|rum|tequila|drunk\w*|booze\w*|cocktails?|champagne|cigarettes?|cigars?|vap(e|es|ed|ing)|marijuana|weed|cocaine|drugs?|stoned|hangovers?|casinos?|gambl\w*|poker|slot machines?|pubs?|tipsy|brewery|liquor)\b/i, 'alcohol / drugs / gambling', 'E'],
  [/\b(smok\w*|bets?|betting|bar|bars)\b/i, 'check: smoking / betting / bar?', 'W'],
  [/\b(guns?|pistols?|rifles?|shotguns?|firearms?|knife|knives|swords?|weapons?|kill(s|ed|ing|er|ers)?|murder\w*|blood\w*|stab(s|bed|bing|ber|bers)?|hostages?|kidnap\w*|strangl\w*|corpses?|coffins?|suicid\w*|horror|slap\w*|beat (him|her|them|you|up)|gory|gore)\b/i, 'violence / weapons', 'E'],
  [/\b(punch\w*|attack\w*|bomb\w*|explod\w*|explosion\w*|threat\w*|chok(e|ed|ing)|die|dies|died|dead|death\w*|dying|funerals?|graves?|injur\w*|fight\w*|kick\w*|shoot\w*|shot|scar(y|ed|es)|terrif\w*|monsters?|creep\w*|bull(y|ies|ied|ying)|cry|cried|crying|sob\w*)\b/i, 'check context (violence / sad / scary?)', 'W'],
  [/\b(disney|lego|legos|iphones?|ipads?|playstation|xbox|nintendo|mcdonald'?s?|starbucks|coca-?cola|coke|pepsi|nike|adidas|google|youtube|tiktok|instagram|facebook|netflix|amazon|walmart|barbie|pok[eé]mon|minecraft|fortnite|roblox|tesla|ferrari|lamborghini|bmw|mercedes|toyota|honda|porsche|rolex|gucci|harry potter|marvel|star wars|spongebob|chatgpt|snapchat|twitter)\b/i, 'real brand / trademark', 'E'],
  [/\b(bitlife|bitizen\w*|candywriter)\b/i, 'no references to other games', 'E'],
  [/\b(diet\w*|weight|skinny|chubby)\b/i, 'body / weight talk - keep it positive or remove', 'W'],
];

const errors = [];
const warns = [];
const err = (where, msg) => errors.push(`ERROR ${where}: ${msg}`);
const warn = (where, msg) => warns.push(`WARN  ${where}: ${msg}`);

function loadFile(file) {
  const store = {};
  const CL = {
    add(group, data) {
      if (Array.isArray(data)) {
        store[group] = (store[group] || []).concat(data);
      } else if (data && typeof data === 'object') {
        store[group] = deepMerge(store[group] || {}, data);
      } else throw new Error(`CL.add("${group}") needs an array or object`);
    },
  };
  const code = fs.readFileSync(file, 'utf8');
  vm.runInNewContext(code, { CL }, { filename: file });
  return store;
}
function deepMerge(a, b) {
  for (const k of Object.keys(b)) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) deepMerge(a[k], b[k]);
    else if (Array.isArray(a[k]) && Array.isArray(b[k])) a[k] = a[k].concat(b[k]);
    else a[k] = b[k];
  }
  return a;
}

function checkWords(where, text) {
  if (typeof text !== 'string') return;
  for (const [re, why, lvl] of WORDS) {
    const m = text.match(re);
    if (m) (lvl === 'E' ? err : warn)(where, `"${m[0]}" - ${why}: "${text.slice(0, 90)}"`);
  }
}
function tokensIn(text) {
  return [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}
function checkTokens(where, text, allowed) {
  if (typeof text !== 'string') return;
  for (const t of tokensIn(text)) if (!allowed.includes(t)) err(where, `unknown token {${t}} (allowed here: ${allowed.map((x) => '{' + x + '}').join(' ')})`);
  if (/\{\s|\s\}|\{\{|\}\}/.test(text)) warn(where, `odd braces in: "${text.slice(0, 80)}"`);
}
function str(where, v, max, { min = 1 } = {}) {
  if (typeof v !== 'string' || v.trim().length < min) { err(where, 'must be a non-empty string'); return false; }
  if (max && v.length > max) (v.length > max * 1.5 ? err : warn)(where, `too long (${v.length} > ${max} chars)`);
  return true;
}
function num(where, v, lo, hi) {
  if (typeof v !== 'number' || !Number.isFinite(v)) { err(where, `must be a number (got ${JSON.stringify(v)})`); return false; }
  if (v < lo || v > hi) err(where, `${v} out of range ${lo}..${hi}`);
  return true;
}

function checkEffects(where, fx, ctx) {
  if (fx === undefined) return;
  if (!fx || typeof fx !== 'object' || Array.isArray(fx)) return err(where, 'effects must be an object');
  for (const [k, v] of Object.entries(fx)) {
    if (NUM_EFFECTS[k]) {
      num(`${where}.${k}`, v, NUM_EFFECTS[k][0], NUM_EFFECTS[k][1]);
      if (k === 'money' && ctx.maxAge <= 12 && Math.abs(v) > 100) warn(`${where}.money`, `$${v} is a lot for a kid`);
      if (k === 'grades' && !ctx.needs.includes('school') && !ctx.needs.includes('college')) warn(`${where}.grades`, 'grades effect without needs school/college');
      if (k === 'performance' && !ctx.needs.includes('job')) warn(`${where}.performance`, 'performance effect without needs job');
      if (k === 'jail' && ctx.minAge < 13) err(`${where}.jail`, 'jail only for teens/adults (minAge >= 13)');
      if (k === 'jail' && ctx.needs.includes('prison')) err(`${where}.jail`, 'already in prison');
    } else if (k === 'skills') {
      if (!v || typeof v !== 'object') { err(`${where}.skills`, 'must be an object like { music: 4 }'); continue; }
      for (const [s, n] of Object.entries(v)) {
        if (!SKILLS.includes(s)) err(`${where}.skills`, `unknown skill "${s}"`);
        num(`${where}.skills.${s}`, n, -10, 15);
      }
    } else if (k === 'newFriend' || k === 'endJob') {
      if (v !== true) err(`${where}.${k}`, 'must be true');
      if (k === 'endJob' && !ctx.needs.includes('job')) err(`${where}.endJob`, 'endJob needs needs:["job"]');
    } else if (k === 'addPet') {
      if (!PETS.includes(v)) err(`${where}.addPet`, `unknown pet "${v}"`);
    } else if (k === 'illness') {
      if (!ILLS.includes(v)) err(`${where}.illness`, `unknown illness "${v}"`);
    } else if (k === 'gainItem' || k === 'record') {
      str(`${where}.${k}`, v, 60);
      checkWords(`${where}.${k}`, v);
    } else err(where, `unknown effect "${k}"`);
  }
}

function checkOutcome(where, o, ev, ctx) {
  if (!o || typeof o !== 'object') return err(where, 'outcome must be an object');
  for (const k of Object.keys(o)) if (!['text', 'effects', 'weight', 'favor'].includes(k)) err(where, `unknown outcome field "${k}"`);
  if (str(`${where}.text`, o.text, 200)) {
    checkWords(where, o.text);
    checkTokens(where, o.text, EVENT_TOKENS);
    if (o.text.includes('{amount}') && !(o.effects && typeof o.effects.money === 'number')) err(where, '{amount} used but effects.money missing');
  }
  if (o.weight !== undefined) num(`${where}.weight`, o.weight, 0.01, 50);
  if (o.favor !== undefined && !STATS.includes(o.favor) && !SKILLS.includes(o.favor)) err(`${where}.favor`, `unknown stat/skill "${o.favor}"`);
  checkEffects(`${where}.effects`, o.effects, ctx);
  const fx = o.effects || {};
  if (fx.newFriend && !String(o.text).includes('{newFriend}') && !String(ev.text).includes('{newFriend}')) warn(where, 'newFriend:true but {newFriend} never named');
  if (fx.bond !== undefined && !PERSON_TOKENS.some((t) => String(ev.text).includes(`{${t}}`) || String(o.text).includes(`{${t}}`))) warn(where, 'bond effect but no person token ({mom} {friend} ...) in the text');
}

function checkEvents(list, file, allIds) {
  list.forEach((ev, i) => {
    const where = `${path.basename(file)} events[${i}] ${ev && ev.id ? ev.id : '?'}`;
    if (!ev || typeof ev !== 'object') return err(where, 'event must be an object');
    for (const k of Object.keys(ev)) if (!['id', 'minAge', 'maxAge', 'weight', 'once', 'needs', 'text', 'effects', 'outcomes', 'choices'].includes(k)) err(where, `unknown field "${k}"`);
    if (!/^[a-z][a-z0-9_]*$/.test(ev.id || '')) err(where, 'id must be snake_case');
    if (allIds.has(ev.id)) err(where, `duplicate id "${ev.id}" (also in ${allIds.get(ev.id)})`);
    else allIds.set(ev.id, path.basename(file));
    num(`${where}.minAge`, ev.minAge, 0, 120);
    num(`${where}.maxAge`, ev.maxAge, 0, 120);
    if (ev.minAge > ev.maxAge) err(where, 'minAge > maxAge');
    if (ev.weight !== undefined) num(`${where}.weight`, ev.weight, 0.1, 5);
    if (ev.once !== undefined && typeof ev.once !== 'boolean') err(where, 'once must be true/false');
    const needs = ev.needs || [];
    if (!Array.isArray(needs)) err(where, 'needs must be an array');
    else for (const n of needs) if (!NEEDS.includes(n)) err(where, `unknown need "${n}"`);
    if (str(`${where}.text`, ev.text, 200)) {
      checkWords(where, ev.text);
      checkTokens(where, ev.text, EVENT_TOKENS.filter((t) => t !== 'amount'));
    }
    const ctx = { minAge: ev.minAge, maxAge: ev.maxAge, needs: Array.isArray(needs) ? needs : [] };
    const shapes = ['effects', 'outcomes', 'choices'].filter((k) => ev[k] !== undefined);
    if (shapes.length !== 1) return err(where, `needs exactly one of effects / outcomes / choices (has: ${shapes.join(', ') || 'none'})`);
    if (ev.effects !== undefined) {
      checkEffects(`${where}.effects`, ev.effects, ctx);
      if (ev.effects && ev.effects.bond !== undefined && !PERSON_TOKENS.some((t) => ev.text.includes(`{${t}}`))) warn(where, 'bond effect but no person token in text');
    }
    if (ev.outcomes !== undefined) {
      if (!Array.isArray(ev.outcomes) || !ev.outcomes.length) return err(where, 'outcomes must be a non-empty array');
      ev.outcomes.forEach((o, j) => checkOutcome(`${where}.outcomes[${j}]`, o, ev, ctx));
    }
    if (ev.choices !== undefined) {
      if (!Array.isArray(ev.choices) || ev.choices.length < 2 || ev.choices.length > 4) return err(where, 'choices must be an array of 2-4');
      ev.choices.forEach((c, j) => {
        const w = `${where}.choices[${j}]`;
        if (!c || typeof c !== 'object') return err(w, 'choice must be an object');
        for (const k of Object.keys(c)) if (!['label', 'outcomes'].includes(k)) err(w, `unknown choice field "${k}"`);
        if (str(`${w}.label`, c.label, 40)) { checkWords(w, c.label); checkTokens(w, c.label, EVENT_TOKENS.filter((t) => t !== 'amount')); }
        if (!Array.isArray(c.outcomes) || !c.outcomes.length) return err(w, 'outcomes must be a non-empty array');
        if (c.outcomes.length > 4) warn(w, 'more than 4 outcomes');
        c.outcomes.forEach((o, k) => checkOutcome(`${w}.outcomes[${k}]`, o, ev, ctx));
      });
    }
  });
}

function checkTextGroup(group, data, file) {
  const spec = TEXT_SPECS[group];
  for (const [key, bucketsObj] of Object.entries(data)) {
    const where = `${path.basename(file)} ${group}.${key}`;
    const ks = spec.keys[key];
    if (!ks) { err(where, `unknown key "${key}" (expected one of: ${Object.keys(spec.keys).join(', ')})`); continue; }
    const [buckets, extra = []] = ks;
    const allowed = ['name', 'city', ...(spec.baseTokens || []), ...extra];
    if (!bucketsObj || typeof bucketsObj !== 'object') { err(where, 'must be an object of buckets'); continue; }
    for (const b of Object.keys(bucketsObj)) if (!buckets.includes(b)) err(where, `unknown bucket "${b}" (expected: ${buckets.join(', ')})`);
    for (const b of buckets) {
      const lines = bucketsObj[b];
      if (!Array.isArray(lines)) { err(`${where}.${b}`, 'missing bucket (array of strings)'); continue; }
      if (lines.length < Math.ceil(spec.min / 2)) err(`${where}.${b}`, `only ${lines.length} lines (want ${spec.min}+)`);
      else if (lines.length < spec.min) warn(`${where}.${b}`, `only ${lines.length} lines (want ${spec.min}+)`);
      const seen = new Set();
      lines.forEach((l, i) => {
        const w = `${where}.${b}[${i}]`;
        if (!str(w, l, 180)) return;
        if (seen.has(l)) warn(w, 'duplicate line');
        seen.add(l);
        checkWords(w, l);
        checkTokens(w, l, allowed);
      });
    }
  }
}

function checkLists(data, file) {
  for (const [key, v] of Object.entries(data)) {
    const where = `${path.basename(file)} lists.${key}`;
    const spec = LIST_SPECS[key];
    if (spec === undefined) { err(where, `unknown list "${key}"`); continue; }
    const checkArr = (w, arr, min) => {
      if (!Array.isArray(arr)) return err(w, 'must be an array of strings');
      if (arr.length < min) warn(w, `only ${arr.length} entries (want ${min}+)`);
      const seen = new Set();
      arr.forEach((s, i) => {
        if (str(`${w}[${i}]`, s, 80)) { checkWords(`${w}[${i}]`, s); if (/\{/.test(s)) err(`${w}[${i}]`, 'no {tokens} in lists'); }
        if (seen.has(s)) warn(`${w}[${i}]`, `duplicate "${s}"`);
        seen.add(s);
      });
    };
    if (typeof spec === 'number') checkArr(where, v, spec);
    else {
      if (!v || typeof v !== 'object' || Array.isArray(v)) { err(where, `must be an object with keys ${spec.keys.join(', ')}`); continue; }
      for (const k of spec.keys) if (!v[k]) err(where, `missing key "${k}"`); else checkArr(`${where}.${k}`, v[k], spec.min);
      for (const k of Object.keys(v)) if (!spec.keys.includes(k)) err(where, `unknown key "${k}"`);
    }
  }
}

function idCheck(where, o, seen) {
  if (!/^[a-z][a-z0-9_]*$/.test(o.id || '')) err(where, 'id must be snake_case');
  if (seen.has(o.id)) err(where, `duplicate id "${o.id}"`);
  seen.add(o.id);
}
function emoji(where, e) {
  if (typeof e !== 'string' || !e.trim() || /^[\x00-\x7F]+$/.test(e) || e.length > 16) err(where, 'emoji must be a single emoji');
}

function checkCountries(list, file) {
  const seen = new Set();
  list.forEach((c, i) => {
    const where = `${path.basename(file)} countries[${i}] ${c.id || '?'}`;
    idCheck(where, c, seen);
    str(`${where}.name`, c.name, 40);
    emoji(`${where}.flag`, c.flag);
    for (const [k, min] of [['cities', 6], ['boy', 25], ['girl', 25], ['last', 25]]) {
      if (!Array.isArray(c[k])) { err(where, `${k} must be an array`); continue; }
      if (c[k].length < min) err(where, `${k} has only ${c[k].length} (want ${k === 'cities' ? 8 : 30})`);
      const s = new Set();
      c[k].forEach((n) => {
        if (typeof n !== 'string' || !n.trim()) err(where, `${k} has a non-string`);
        else {
          if (s.has(n)) warn(where, `${k} duplicate "${n}"`);
          s.add(n);
          if (k !== 'cities' && /[^A-Za-z' -]/.test(n)) warn(where, `${k} "${n}" has non-plain letters`);
          checkWords(where, n);
        }
      });
    }
  });
}

function checkJobs(list, file, part) {
  const seen = new Set();
  list.forEach((j, i) => {
    const where = `${path.basename(file)} ${part ? 'partTimeJobs' : 'jobs'}[${i}] ${j.id || '?'}`;
    idCheck(where, j, seen);
    emoji(`${where}.emoji`, j.emoji);
    str(`${where}.desc`, j.desc, 80);
    checkWords(where, j.desc);
    if (part) {
      str(`${where}.title`, j.title, 40);
      checkWords(where, j.title);
      num(`${where}.hourly`, j.hourly, 9, 18);
      num(`${where}.hours`, j.hours, 6, 20);
      num(`${where}.minAge`, j.minAge, 14, 16);
      for (const k of Object.keys(j)) if (!['id', 'title', 'emoji', 'hourly', 'hours', 'minAge', 'desc'].includes(k)) err(where, `unknown field "${k}"`);
      return;
    }
    for (const k of Object.keys(j)) if (!['id', 'track', 'emoji', 'levels', 'salary', 'edu', 'majors', 'minSmarts', 'minHealth', 'minStyle', 'skill', 'desc'].includes(k)) err(where, `unknown field "${k}"`);
    if (!TRACKS.includes(j.track)) err(where, `unknown track "${j.track}"`);
    if (!EDU.includes(j.edu)) err(where, `unknown edu "${j.edu}"`);
    if (!Array.isArray(j.levels) || j.levels.length < 3 || j.levels.length > 6) err(where, 'levels must have 3-6 titles');
    else j.levels.forEach((l, k) => { str(`${where}.levels[${k}]`, l, 40); checkWords(where, l); });
    if (!Array.isArray(j.salary) || !Array.isArray(j.levels) || j.salary.length !== j.levels.length) err(where, 'salary must match levels length');
    else j.salary.forEach((s, k) => { num(`${where}.salary[${k}]`, s, 10000, 6000000); if (k && s <= j.salary[k - 1]) err(where, 'salary must increase'); });
    if (j.majors !== undefined) {
      if (!Array.isArray(j.majors)) err(where, 'majors must be an array');
      else for (const m of j.majors) if (!MAJORS.includes(m)) err(where, `unknown major "${m}"`);
    }
    for (const k of ['minSmarts', 'minHealth', 'minStyle']) if (j[k] !== undefined) num(`${where}.${k}`, j[k], 0, 90);
    if (j.skill !== undefined) for (const [s, n] of Object.entries(j.skill)) { if (!SKILLS.includes(s)) err(where, `unknown skill "${s}"`); num(`${where}.skill.${s}`, n, 1, 100); }
  });
}

function checkQuiz(data, file) {
  const f = path.basename(file);
  for (const k of Object.keys(data)) if (!['school', 'driving', 'interview'].includes(k)) err(`${f} quiz`, `unknown quiz group "${k}"`);
  const seenQ = new Set();
  const four = (where, a) => {
    if (!Array.isArray(a) || a.length !== 4) { err(where, 'a must have exactly 4 answers'); return false; }
    return true;
  };
  (data.school || []).forEach((q, i) => {
    const where = `${f} quiz.school[${i}]`;
    if (str(`${where}.q`, q.q, 160)) { checkWords(where, q.q); if (seenQ.has(q.q)) warn(where, 'duplicate question'); seenQ.add(q.q); }
    if (four(where, q.a)) {
      q.a.forEach((x, k) => { if (typeof x !== 'string' && typeof x !== 'number') err(`${where}.a[${k}]`, 'answer must be a string'); else checkWords(where, String(x)); });
      if (new Set(q.a.map(String)).size !== 4) err(where, 'answers must be different');
    }
    if (!Number.isInteger(q.c) || q.c < 0 || q.c > 3) err(where, 'c must be 0-3');
    num(`${where}.minAge`, q.minAge, 5, 18);
    num(`${where}.maxAge`, q.maxAge, 5, 22);
    if (q.minAge > q.maxAge) err(where, 'minAge > maxAge');
    if (!SUBJECTS.includes(q.subject)) err(where, `unknown subject "${q.subject}"`);
  });
  (data.driving || []).forEach((q, i) => {
    const where = `${f} quiz.driving[${i}]`;
    if (str(`${where}.q`, q.q, 160)) checkWords(where, q.q);
    if (four(where, q.a)) q.a.forEach((x) => checkWords(where, String(x)));
    if (!Number.isInteger(q.c) || q.c < 0 || q.c > 3) err(where, 'c must be 0-3');
  });
  (data.interview || []).forEach((q, i) => {
    const where = `${f} quiz.interview[${i}]`;
    if (str(`${where}.q`, q.q, 140)) checkWords(where, q.q);
    if (four(where, q.a)) {
      const ss = q.a.map((x) => x && x.s);
      q.a.forEach((x, k) => {
        if (!x || typeof x !== 'object') return err(`${where}.a[${k}]`, 'answer must be { t, s }');
        if (str(`${where}.a[${k}].t`, x.t, 120)) checkWords(where, x.t);
        if (![-1, 0, 1, 2].includes(x.s)) err(`${where}.a[${k}].s`, 's must be -1, 0, 1 or 2');
      });
      if (ss.filter((s) => s === 2).length !== 1) err(where, 'needs exactly one best answer (s: 2)');
      if (ss.filter((s) => s === -1).length !== 1) warn(where, 'should have exactly one silly answer (s: -1)');
    }
  });
}

function checkCatalog(data, file) {
  const f = path.basename(file);
  const known = ['items', 'vehicles', 'houses', 'pets', 'vacations', 'illnesses'];
  for (const k of Object.keys(data)) if (!known.includes(k)) err(`${f} catalog`, `unknown catalog group "${k}"`);
  const run = (k, fn) => { const seen = new Set(); (data[k] || []).forEach((o, i) => { const where = `${f} catalog.${k}[${i}] ${o && o.id}`; idCheck(where, o, seen); fn(where, o); }); };
  run('items', (w, o) => {
    str(`${w}.name`, o.name, 40); emoji(`${w}.emoji`, o.emoji); num(`${w}.price`, o.price, 1, 2000000); num(`${w}.minAge`, o.minAge, 0, 30);
    if (!ITEM_KINDS.includes(o.kind)) err(w, `unknown kind "${o.kind}"`);
    if (o.unlocks !== undefined && !UNLOCKS.includes(o.unlocks)) err(w, `unknown unlocks "${o.unlocks}"`);
    if (!o.effects || typeof o.effects !== 'object') err(w, 'effects required');
    else for (const [s, n] of Object.entries(o.effects)) { if (!STATS.includes(s)) err(w, `effects: unknown stat "${s}"`); num(`${w}.effects.${s}`, n, -5, 10); }
    str(`${w}.desc`, o.desc, 90); checkWords(w, o.name); checkWords(w, o.desc);
  });
  run('vehicles', (w, o) => {
    str(`${w}.name`, o.name, 40); emoji(`${w}.emoji`, o.emoji); num(`${w}.price`, o.price, 50, 5000000);
    if (!VEHICLE_KINDS.includes(o.kind)) err(w, `unknown kind "${o.kind}"`);
    num(`${w}.style`, o.style, 0, 10); checkWords(w, o.name);
  });
  run('houses', (w, o) => {
    str(`${w}.name`, o.name, 40); emoji(`${w}.emoji`, o.emoji); num(`${w}.price`, o.price, 20000, 20000000);
    num(`${w}.rooms`, o.rooms, 1, 40); num(`${w}.style`, o.style, 0, 10); str(`${w}.desc`, o.desc, 90);
    checkWords(w, o.name); checkWords(w, o.desc);
  });
  run('pets', (w, o) => {
    if (!PETS.includes(o.id)) err(w, `id must be a pet species id`);
    str(`${w}.name`, o.name, 20); emoji(`${w}.emoji`, o.emoji); num(`${w}.fee`, o.fee, 0, 20000); num(`${w}.upkeep`, o.upkeep, 0, 10000);
    if (!Array.isArray(o.life) || o.life.length !== 2 || o.life[0] > o.life[1]) err(w, 'life must be [min, max]');
    else { num(`${w}.life[0]`, o.life[0], 1, 80); num(`${w}.life[1]`, o.life[1], 1, 80); }
    if (!Array.isArray(o.breeds) || o.breeds.length < 4) err(w, 'breeds needs 4+ names');
    str(`${w}.desc`, o.desc, 90); checkWords(w, o.desc);
  });
  run('vacations', (w, o) => {
    str(`${w}.place`, o.place, 40); emoji(`${w}.emoji`, o.emoji); num(`${w}.price`, o.price, 100, 200000); num(`${w}.joy`, o.joy, 6, 15);
    str(`${w}.desc`, o.desc, 90); checkWords(w, o.desc);
  });
  run('illnesses', (w, o) => {
    if (!ILLS.includes(o.id)) err(w, 'id must be an illness id');
    str(`${w}.name`, o.name, 30); emoji(`${w}.emoji`, o.emoji);
    num(`${w}.minAge`, o.minAge, 0, 100); num(`${w}.maxAge`, o.maxAge, 1, 120);
    num(`${w}.severity`, o.severity, 1, 3); num(`${w}.healthHit`, o.healthHit, 2, 12);
    num(`${w}.selfHeal`, o.selfHeal, 0, 1); num(`${w}.treat`, o.treat, 0, 50000); num(`${w}.cure`, o.cure, 0, 1);
    str(`${w}.text`, o.text, 160); str(`${w}.curedText`, o.curedText, 160);
    checkWords(w, o.text); checkWords(w, o.curedText);
    checkTokens(w, o.text, ['name']); checkTokens(w, o.curedText, ['name']);
  });
  if (data.pets) for (const p of PETS) if (!data.pets.find((o) => o.id === p)) warn(`${f} catalog.pets`, `missing species "${p}"`);
  if (data.illnesses) for (const p of ILLS) if (!data.illnesses.find((o) => o.id === p)) warn(`${f} catalog.illnesses`, `missing illness "${p}"`);
}

// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const allFiles = fs.existsSync(contentDir) ? fs.readdirSync(contentDir).filter((f) => f.endsWith('.js')).map((f) => path.join(contentDir, f)) : [];
const targets = args.length ? args.map((a) => path.resolve(root, a)) : allFiles;
const allIds = new Map();

// Collect ids from the other content files so duplicates across files are caught.
for (const f of allFiles) {
  if (targets.includes(f)) continue;
  try {
    const s = loadFile(f);
    for (const ev of s.events || []) if (ev && ev.id) allIds.set(ev.id, path.basename(f));
  } catch { /* someone else's half-written file - ignore */ }
}

const totals = {};
for (const file of targets) {
  let store;
  try {
    store = loadFile(file);
  } catch (e) {
    err(path.basename(file), `does not load: ${e.message}`);
    continue;
  }
  const summary = [];
  for (const [group, data] of Object.entries(store)) {
    const n = Array.isArray(data) ? data.length : Object.keys(data).length;
    summary.push(`${group}(${n})`);
    totals[group] = (totals[group] || 0) + n;
    if (group === 'events') checkEvents(data, file, allIds);
    else if (TEXT_SPECS[group]) checkTextGroup(group, data, file);
    else if (group === 'lists') checkLists(data, file);
    else if (group === 'countries') checkCountries(data, file);
    else if (group === 'jobs') checkJobs(data, file, false);
    else if (group === 'partTimeJobs') checkJobs(data, file, true);
    else if (group === 'quiz') checkQuiz(data, file);
    else if (group === 'catalog') checkCatalog(data, file);
    else err(path.basename(file), `unknown group "${group}"`);
  }
  console.log(`${path.relative(root, file)}: ${summary.join(' ') || '(nothing added)'}`);
}

const MAX = +(process.env.MAX || 150);
for (const l of errors.slice(0, MAX)) console.log(l);
if (errors.length > MAX) console.log(`... ${errors.length - MAX} more errors`);
for (const l of warns.slice(0, MAX)) console.log(l);
if (warns.length > MAX) console.log(`... ${warns.length - MAX} more warnings`);
console.log(`\n${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
