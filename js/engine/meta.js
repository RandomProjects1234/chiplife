/* ChipLife meta — Acorns (achievements kept across lives), perks they unlock, Life Chips and past lives. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const M = (CL.meta = {});

  const job = (L) => (L.job ? G.jobById(L.job.id) : null);
  M.ACORNS = [
    ['hello', '🐣', 'Hello, World!', 'Start your very first life.', () => true],
    ['diploma', '🎓', 'Diploma Day', 'Graduate from high school.', (L) => L.edu.degrees.includes('highschool')],
    ['capgown', '🏛️', 'Cap & Gown', "Earn a bachelor's degree.", (L) => L.edu.degrees.includes('bachelor')],
    ['doctorate', '🩺', 'Call Me Doctor', 'Earn a medical degree or a PhD.', (L) => L.edu.degrees.includes('medical') || L.edu.degrees.includes('phd')],
    ['objection', '⚖️', 'Objection!', 'Earn a law degree.', (L) => L.edu.degrees.includes('law')],
    ['straightA', '🅰️', 'Straight A', 'Get school grades of 95 or more.', (L) => G.inSchoolAny(L) && L.edu.grades >= 95],
    ['quizWhiz', '❓', 'Quiz Whiz', 'Answer 20 pop-quiz questions right in one life.', (L) => L.totals.quizRight >= 20],
    ['clockIn', '💼', 'Clocking In', 'Land your first full-time job.', (L) => !!L.job || L.career.length > 0],
    ['movingUp', '📈', 'Moving Up', 'Get promoted 3 times in one life.', (L) => L.totals.promotions >= 3],
    ['corner', '🏢', 'Corner Office', 'Reach the top level of a career.', (L) => { const j = job(L); return !!(j && L.job.level === j.levels.length - 1); }],
    ['golden', '🌅', 'Golden Years', 'Retire from a career.', (L) => L.retired],
    ['millionaire', '💰', 'Acorn Millionaire', 'Have $1,000,000 in cash.', (L) => L.money >= 1e6],
    ['billionaire', '👑', 'Golden Acorn', 'Have $1,000,000,000 in cash.', (L) => L.money >= 1e9],
    ['homeowner', '🏡', 'Home Sweet Home', 'Buy a home.', (L) => L.totals.houses >= 1],
    ['castle', '🏰', 'Castle Keeper', 'Own a home worth $5,000,000 or more.', (L) => L.assets.some((a) => a.type === 'house' && a.value >= 5e6)],
    ['garage', '🚗', 'Garage Full', 'Own 5 vehicles at once.', (L) => L.assets.filter((a) => a.type === 'vehicle').length >= 5],
    ['license', '🪪', 'Road Ready', "Get a driver's license.", (L) => L.license],
    ['globetrotter', '✈️', 'Globetrotter', 'Take 5 vacations in one life.', (L) => L.totals.vacations >= 5],
    ['horizons', '🌍', 'New Horizons', 'Move to another country.', (L) => L.totals.countries >= 2],
    ['critters', '🐾', 'Critter Keeper', 'Have 3 pets at the same time.', (L) => G.alive(L, 'pet').length >= 3],
    ['familyGrows', '🧸', 'Family Grows', 'Adopt a child.', (L) => L.totals.kids >= 1],
    ['fullHouse', '🏠', 'Full House', 'Adopt 3 children in one life.', (L) => L.totals.kids >= 3],
    ['butterfly', '🦋', 'Social Butterfly', 'Have 10 friends at once.', (L) => G.alive(L, 'friend').length >= 10],
    ['heart', '💛', 'Heart of Gold', 'Reach 100 Kindness.', (L) => L.stats.kindness >= 100],
    ['helper', '🙌', 'Helping Hands', 'Volunteer 10 times in one life.', (L) => L.totals.volunteered >= 10],
    ['giver', '💝', 'Big Giver', 'Donate $100,000 in one life.', (L) => L.totals.donated >= 100000],
    ['brainy', '🧠', 'Big Brain', 'Reach 100 Smarts.', (L) => L.stats.smarts >= 100],
    ['peak', '💪', 'Peak Shape', 'Reach 100 Health as an adult.', (L) => L.age >= 18 && L.stats.health >= 100],
    ['trend', '✨', 'Trendsetter', 'Reach 100 Style.', (L) => L.stats.style >= 100],
    ['sunshine', '😊', 'Sunshine', 'Reach 100 Joy.', (L) => L.stats.joy >= 100],
    ['master', '🥇', 'Master of One', 'Max out any skill.', (L) => Object.values(L.skills).some((v) => v >= 100)],
    ['renaissance', '🎨', 'Renaissance Chip', 'Get 4 skills to 60 or more.', (L) => Object.values(L.skills).filter((v) => v >= 60).length >= 4],
    ['showstopper', '🏆', 'Showstopper', 'Win a talent show.', (L) => L.totals.talentWins >= 1],
    ['lights', '🎬', 'Lights, Camera!', 'Land a movie role.', (L) => L.totals.roles >= 1],
    ['bestseller', '📚', 'Smash Hit', 'Write a hit book or song.', (L) => L.totals.hits >= 1],
    ['viral', '📱', 'Gone Viral', 'Reach 1,000,000 followers.', (L) => L.followers >= 1e6],
    ['star', '⭐', 'Star Power', 'Reach 80 Fame.', (L) => L.fame >= 80],
    ['prankster', '🤪', 'Prank Master', 'Pull off 10 pranks in one life.', (L) => L.totals.pranks >= 10],
    ['vault', '🏦', 'Vault Raider', 'Pull off a bank heist.', (L) => L.totals.heists >= 1],
    ['mastermind', '🦹', 'Mastermind', 'Pull off 3 bank heists in one life.', (L) => L.totals.heists >= 3],
    ['timeout', '⛓️', 'Time Out', 'Get sent to jail.', (L) => !!L.prison || L.totals.prisonYears > 0],
    ['escape', '🕳️', 'Great Escape', 'Escape from jail.', (L) => L.totals.escapes >= 1],
    ['newLeaf', '🍃', 'New Leaf', 'Get out of jail and reach 80 Kindness.', (L) => L.totals.prisonYears > 0 && !L.prison && L.stats.kindness >= 80],
    ['squeaky', '🧼', 'Squeaky Clean', 'Reach age 80 with a clean record.', (L) => L.age >= 80 && !L.record.length],
    ['century', '🎂', 'Century Club', 'Live to 100.', (L) => L.age >= 100],
    ['familyTree', '🌳', 'Family Tree', 'Play as the 3rd generation of a family.', (L) => L.gen >= 3],
    ['dynasty', '🏯', 'Dynasty', 'Play as the 5th generation of a family.', (L) => L.gen >= 5],
  ].map(([id, emoji, label, desc, test]) => ({ id, emoji, label, desc, test }));

  M.PERKS = [
    { id: 'pickCountry', need: 3, emoji: '🗺️', label: 'Globe Hopper', desc: 'Choose your birth country.', always: true },
    { id: 'pickWealth', need: 6, emoji: '🥄', label: 'Silver Spoon', desc: "Choose your family's wealth.", always: true },
    { id: 'bright', need: 9, emoji: '💡', label: 'Bright Spark', desc: 'Start with +15 Smarts.' },
    { id: 'sturdy', need: 12, emoji: '🌰', label: 'Tough Nut', desc: 'Start with +15 Health.' },
    { id: 'stylish', need: 15, emoji: '💅', label: 'Fresh Fur', desc: 'Start with +15 Style.' },
    { id: 'petStart', need: 18, emoji: '🐶', label: 'Furry Friend', desc: 'Start life with a pet.' },
    { id: 'nestEgg', need: 22, emoji: '🥚', label: 'Nest Egg', desc: 'Get $10,000 on your 18th birthday.' },
    { id: 'charm', need: 26, emoji: '🗣️', label: 'Silver Tongue', desc: 'Win job interviews more often.' },
    { id: 'sly', need: 30, emoji: '🦊', label: 'Sly as a Fox', desc: 'Better odds at mischief and heists.' },
    { id: 'longLife', need: 36, emoji: '🌳', label: 'Ancient Oak', desc: 'Age more slowly and live longer.' },
  ];
  M.MAX_PERKS = 3;

  // Life Chips: the badge your life earns when it ends. First match wins.
  M.CHIPS = [
    { id: 'mastermind', emoji: '🦹', label: 'The Mastermind', color: '#6d5bd0', desc: 'Pulled off three or more bank heists.', test: (L) => L.totals.heists >= 3 },
    { id: 'centenarian', emoji: '🎂', label: 'The Centenarian', color: '#d4a017', desc: 'Lived for a whole century.', test: (L) => L.age >= 100 },
    { id: 'superstar', emoji: '⭐', label: 'The Superstar', color: '#f4a700', desc: 'Became truly famous.', test: (L) => (L.totals.peakFame || 0) >= 80 },
    { id: 'tycoon', emoji: '💰', label: 'The Tycoon', color: '#2a9d5c', desc: 'Built a fortune worth $10M+.', test: (L) => G.estate(L) >= 1e7 },
    { id: 'philanthropist', emoji: '💝', label: 'The Philanthropist', color: '#e05780', desc: 'Gave $100,000+ to good causes.', test: (L) => L.totals.donated >= 100000 },
    { id: 'scholar', emoji: '🎓', label: 'The Scholar', color: '#3a86ff', desc: 'Earned an advanced degree.', test: (L) => L.edu.degrees.some((d) => ['law', 'medical', 'phd', 'business'].includes(d)) },
    { id: 'artist', emoji: '🎨', label: 'The Artist', color: '#9b5de5', desc: 'Created art the world remembers.', test: (L) => L.totals.hits >= 2 || ['music', 'art', 'writing', 'acting'].some((s) => L.skills[s] >= 85) },
    { id: 'athlete', emoji: '🏅', label: 'The Athlete', color: '#ef476f', desc: 'Reached the top of their sport.', test: (L) => L.skills.sports >= 85 },
    { id: 'familyHero', emoji: '🧸', label: 'The Family Hero', color: '#f08a4b', desc: 'Adopted three or more kids.', test: (L) => L.totals.kids >= 3 },
    { id: 'animalFriend', emoji: '🐾', label: 'The Animal Friend', color: '#8d6e63', desc: 'Shared their home with lots of pets.', test: (L) => L.totals.pets >= 4 },
    { id: 'globetrotter', emoji: '✈️', label: 'The Globetrotter', color: '#00a6a6', desc: 'Saw the world.', test: (L) => L.totals.vacations >= 6 || L.totals.countries >= 3 },
    { id: 'kindSoul', emoji: '💛', label: 'The Kind Soul', color: '#06b58a', desc: 'Made the world a little kinder.', test: (L) => L.stats.kindness >= 90 || L.totals.volunteered >= 15 },
    { id: 'jailbird', emoji: '⛓️', label: 'The Jailbird', color: '#6c757d', desc: 'Spent ten or more years behind bars.', test: (L) => L.totals.prisonYears >= 10 },
    { id: 'rascal', emoji: '🤪', label: 'The Rascal', color: '#ff8c42', desc: 'Never met a prank they did not try.', test: (L) => L.totals.crimes + L.totals.pranks >= 8 },
    { id: 'worker', emoji: '💼', label: 'The Hard Worker', color: '#457b9d', desc: 'Worked for 35+ years.', test: (L) => L.totals.jobYears >= 35 },
    { id: 'butterfly', emoji: '🦋', label: 'The Social Butterfly', color: '#c77dff', desc: 'Made friends everywhere.', test: (L) => L.totals.friends >= 15 },
    { id: 'shootingStar', emoji: '🌠', label: 'The Shooting Star', color: '#5e60ce', desc: 'A short life that burned bright.', test: (L) => L.age < 40 },
    { id: 'legend', emoji: '🌰', label: 'The Everyday Legend', color: '#a0522d', desc: 'A good life, well lived.', test: () => true },
  ];

  M.init = function () {
    const m = G.loadMeta() || {};
    G.meta = Object.assign({ v: 1, ach: {}, lives: [], sound: true, lifeCount: 0 }, m);
    M.fresh = [];
    return G.meta;
  };
  M.count = () => Object.keys(G.meta.ach).length;
  M.unlockedPerks = () => M.PERKS.filter((p) => M.count() >= p.need);
  M.fresh = [];
  // Check every acorn; newly earned ones go to M.fresh so the UI can celebrate them.
  M.check = function () {
    const L = G.life;
    if (!L || !G.meta) return;
    L.totals.peakFame = Math.max(L.totals.peakFame || 0, L.fame);
    L.totals.maxFollowers = Math.max(L.totals.maxFollowers || 0, L.followers);
    for (const a of M.ACORNS) {
      if (L.ach.includes(a.id)) continue;
      let ok = false;
      try { ok = a.test(L); } catch { ok = false; }
      if (!ok) continue;
      L.ach.push(a.id);
      if (!G.meta.ach[a.id]) {
        G.meta.ach[a.id] = { at: Date.now(), who: `${L.first} ${L.last}` };
        M.fresh.push(a);
      }
    }
  };
  M.lifeChip = (L) => M.CHIPS.find((c) => { try { return c.test(L); } catch { return false; } }) || M.CHIPS[M.CHIPS.length - 1];
  M.recordLife = function (L) {
    const chip = M.lifeChip(L);
    const C = G.country(L.country);
    const lastJob = L.job ? L.job.title : L.career.length ? L.career[L.career.length - 1].title : null;
    G.meta.lifeCount = (G.meta.lifeCount || 0) + 1;
    G.meta.lives.unshift({
      id: L.id, name: `${L.first} ${L.last}`, gender: L.gender, age: L.age, gen: L.gen, chip: chip.id,
      flag: C.flag, country: C.name, worth: G.estate(L), job: lastJob, acorns: L.ach.length,
      degree: G.degreeNames(L).slice(-1)[0] || null, born: L.birthYear, kids: L.totals.kids, heists: L.totals.heists,
    });
    G.meta.lives = G.meta.lives.slice(0, 60);
  };
})(globalThis.CL);
