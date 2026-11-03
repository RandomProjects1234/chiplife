/* ChipLife engine — school, college and graduate school. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const FALLBACK = { elementary: 'Acorn Hill Elementary', middle: 'Hazelwood Middle School', high: 'Oak Ridge High', college: 'Chipmunk State University' };

  G.STAGE_LABEL = { none: 'Not in school', preschool: 'Preschool', elementary: 'Elementary School', middle: 'Middle School', high: 'High School', college: 'University', grad: 'Graduate School', done: 'Finished school' };
  G.inSchoolAny = (L) => ['elementary', 'middle', 'high', 'college', 'grad'].includes(L.edu.stage);
  G.inKidSchool = (L) => ['elementary', 'middle', 'high'].includes(L.edu.stage);
  G.inCollege = (L) => L.edu.stage === 'college' || L.edu.stage === 'grad';
  G.schoolName = function (kind) {
    const l = (CL.content.lists.schoolNames || {})[kind];
    return (l && l.length && U.pick(l)) || FALLBACK[kind];
  };
  G.gradeLetter = (g) => (g >= 93 ? 'A+' : g >= 85 ? 'A' : g >= 75 ? 'B' : g >= 62 ? 'C' : g >= 48 ? 'D' : 'F');
  G.majorLabel = (id) => (CL.MAJORS.find((m) => m.id === id) || { label: id || '?' }).label;
  G.classLabel = function (L) {
    const e = L.edu;
    if (G.inKidSchool(L)) return L.age <= 5 ? 'Kindergarten' : `Grade ${Math.min(12, L.age - 5)}`;
    if (e.stage === 'college') return `${G.majorLabel(e.major)} · Year ${e.year} of 4`;
    if (e.stage === 'grad') return `${CL.GRAD[e.program].label} · Year ${e.year} of ${CL.GRAD[e.program].years}`;
    return '';
  };
  G.degreeNames = function (L) {
    const out = [];
    for (const d of L.edu.degrees) {
      if (d === 'highschool') out.push(L.edu.ged ? 'GED' : 'High School Diploma');
      else if (d === 'bachelor') out.push(`Bachelor's in ${G.majorLabel(L.edu.majorDone)}`);
      else if (CL.GRAD[d]) out.push(CL.GRAD[d].degree);
    }
    return out;
  };

  function startStage(L, stage, kind, text) {
    const e = L.edu;
    e.stage = stage;
    e.school = G.schoolName(kind);
    if (stage === 'elementary') e.grades = U.clamp(Math.round(L.stats.smarts * 0.6 + 25 + U.ri(-6, 6)), 5, 100);
    G.say(U.fill(text, { school: e.school }), '🎒', 'good');
  }

  function gradesDrift(L, college) {
    const e = L.edu;
    const target = L.stats.smarts * (college ? 0.75 : 0.7) + (college ? 15 : 22) + Math.min(12, (e.effort || 0) * 3) + (e.clubs.length ? 2 : 0);
    e.grades = U.clamp(Math.round(e.grades + (target - e.grades) * 0.3 + U.ri(-6, 5)), 0, 100);
    e.effort = 0;
  }

  G.schoolYear = function (L) {
    const e = L.edu, a = L.age;
    if (a === 3 && e.stage === 'none') {
      e.stage = 'preschool';
      e.school = 'Little Acorns Preschool';
      G.say('You started preschool at Little Acorns! Finger painting is your new passion.', '🖍️', 'good');
      return;
    }
    if (a === 5 && (e.stage === 'none' || e.stage === 'preschool')) return startStage(L, 'elementary', 'elementary', 'You started kindergarten at {school}! Your backpack is almost as big as you.');
    if (e.stage === 'elementary' && a >= 11) startStage(L, 'middle', 'middle', 'You started middle school at {school}. Lockers! Real lockers!');
    else if (e.stage === 'middle' && a >= 14) startStage(L, 'high', 'high', 'You started high school at {school}.');
    else if (e.stage === 'high' && a >= 18) return finishHighSchool(L);
    else if (G.inKidSchool(L)) gradesDrift(L, false);

    if (e.stage === 'college' || e.stage === 'grad') {
      gradesDrift(L, true);
      const total = e.stage === 'college' ? 4 : CL.GRAD[e.program].years;
      if (e.year >= total) return e.stage === 'college' ? finishCollege(L) : finishGrad(L);
      e.year++;
      G.payTuition(L);
      if (e.stage === 'grad' && CL.GRAD[e.program].stipend) {
        L.money += CL.GRAD[e.program].stipend;
        if (L.flow) L.flow.income += CL.GRAD[e.program].stipend;
      }
    }
    for (const id of e.clubs) {
      const c = CL.CLUBS.find((x) => x.id === id);
      if (c) G.fx(c.fx);
      if (U.chance(0.12)) clubFriend(L, c);
    }
  };

  function clubFriend(L, c) {
    if (G.alive(L, 'friend').length >= 14) return;
    const f = G.mkPerson(L, 'friend', { age: U.clamp(L.age + U.ri(-1, 1), 5, 30), bond: U.ri(50, 70), met: c ? c.label : 'school' });
    L.people.push(f);
    L.totals.friends++;
    G.say(`You became friends with ${f.first}${c ? ` from ${c.label}` : ''}.`, '🤝', 'good');
  }

  function finishHighSchool(L) {
    const e = L.edu;
    e.hsGrades = e.grades;
    e.stage = 'done';
    e.school = null;
    e.clubs = [];
    if (e.grades >= 25) {
      e.degrees.push('highschool');
      G.say(`You graduated from high school${e.grades >= 92 ? ' as the top of your class' : e.grades >= 82 ? ' with honors' : ''}! Caps flew everywhere.`, '🎓', 'good', G.fx({ joy: 6 }));
    } else {
      G.say("Your grades weren't quite high enough to graduate. You can still earn a GED from the Career tab.", '📝', 'bad');
    }
  }
  function finishCollege(L) {
    const e = L.edu;
    const school = e.school;
    e.stage = 'done';
    e.school = null;
    e.clubs = [];
    e.year = 0;
    if (e.grades < 30) {
      G.say(`You didn't earn enough credits to graduate from ${school}. You can apply again any time.`, '📝', 'bad');
      return;
    }
    e.degrees.push('bachelor');
    e.majorDone = e.major;
    e.gpa = e.grades;
    G.say(`You graduated from ${school} with a degree in ${G.majorLabel(e.major)}${e.grades >= 85 ? ' — with honors!' : '!'}`, '🎓', 'good', G.fx({ joy: 8, smarts: 3 }));
  }
  function finishGrad(L) {
    const e = L.edu;
    const g = CL.GRAD[e.program];
    e.stage = 'done';
    e.school = null;
    e.clubs = [];
    e.year = 0;
    if (e.grades < 35) {
      G.say(`You didn't pass your final exams at ${g.label}. You can re-apply later.`, '📝', 'bad');
      e.program = null;
      return;
    }
    e.degrees.push(e.program);
    G.say(`You earned your ${g.degree}! Everyone has to call you very fancy things now.`, g.emoji, 'good', G.fx({ joy: 10, smarts: 4 }));
    e.program = null;
  }

  G.addLoan = function (kind, label, amount, rate, years) {
    const L = G.life;
    let loan = L.loans.find((l) => l.kind === kind && kind === 'student');
    if (!loan) {
      loan = { id: U.uid(), kind, label, balance: 0, rate, pay: 0 };
      L.loans.push(loan);
    }
    loan.balance += amount;
    if (kind === 'mortgage') {
      const r = rate, n = years || 25;
      loan.pay = Math.round((amount * r) / (1 - Math.pow(1 + r, -n)));
    }
    return loan;
  };
  G.payTuition = function (L) {
    const e = L.edu;
    const base = e.stage === 'grad' ? CL.GRAD[e.program].cost : CL.TUITION;
    const cost = e.scholarship === 'full' ? 0 : e.scholarship === 'half' ? Math.round(base / 2) : base;
    if (!cost) return;
    if (e.payer === 'parents') {
      if (G.parents(L).length && L.wealth >= 2) {
        G.say(`Your parents paid ${U.money(cost)} for this year's tuition.`, '🎓', 'good');
        return;
      }
      e.payer = 'loan';
      G.say("Your parents can't cover tuition anymore, so you took out a student loan.", '🏦', 'info');
    }
    if (e.payer === 'self') {
      if (L.money >= cost) {
        L.money -= cost;
        if (L.flow) L.flow.costs += cost;
        G.say(`You paid ${U.money(cost)} for tuition.`, '🎓', 'info');
        return;
      }
      G.say("You couldn't cover tuition this year, so a student loan picked up the bill.", '🏦', 'info');
    }
    G.addLoan('student', 'Student loan', cost, 0.045);
  };

  // ---------------------------------------------------------------- applying
  function payerOptions(L, grad) {
    const ps = G.parents(L);
    const opts = [];
    if (ps.length) opts.push({ id: 'parents', label: 'Ask my parents to pay', emoji: '👪', sub: L.wealth >= 2 ? 'They might say yes!' : 'Money is tight at home…' });
    opts.push({ id: 'loan', label: 'Take a student loan', emoji: '🏦', sub: 'Pay it back later with interest' });
    opts.push({ id: 'self', label: 'Pay it myself', emoji: '💵', sub: `You have ${U.money(L.money)}` });
    return opts;
  }
  function decidePayer(L, want, grad) {
    if (want !== 'parents') return { payer: want };
    const ps = G.parents(L);
    const bond = ps.reduce((m, p) => Math.max(m, p.bond), 0);
    const yes = ps.length && ((L.wealth === 3 && bond >= 30) || (L.wealth === 2 && bond >= 55 && !grad));
    return yes ? { payer: 'parents', note: 'Your parents agreed to pay your tuition!' } : { payer: 'loan', note: "Your parents couldn't afford it, so you'll use a student loan." };
  }

  G.applyCollege = function (majorId, want) {
    const L = G.life, e = L.edu;
    const g = e.hsGrades || 50;
    const accept = g >= 70 ? 0.97 : g >= 45 ? 0.75 : 0.4;
    if (!U.chance(accept)) return G.res('📭', `${G.schoolName('college')} turned down your application. Study up and try again next year!`, { joy: -4 });
    const sch = g >= 88 && U.chance(0.75) ? 'full' : g >= 76 && U.chance(0.5) ? 'half' : null;
    const p = decidePayer(L, want, false);
    e.stage = 'college';
    e.major = majorId;
    e.year = 1;
    e.school = G.schoolName('college');
    e.payer = p.payer;
    e.scholarship = sch;
    e.grades = U.clamp(Math.round(g * 0.55 + 25), 20, 95);
    e.clubs = [];
    const extra = [sch === 'full' ? 'You won a FULL scholarship!' : sch === 'half' ? 'You won a half scholarship!' : '', sch !== 'full' ? p.note || '' : ''].filter(Boolean).join(' ');
    G.payTuition(L);
    return G.res('🏛️', `You were accepted to ${e.school} to study ${G.majorLabel(majorId)}! ${extra}`.trim(), { joy: 8 });
  };
  G.gradCheck = function (L, prog) {
    const g = CL.GRAD[prog];
    if (!L.edu.degrees.includes('bachelor')) return 'Needs a bachelor\'s degree';
    if (L.edu.degrees.includes(prog)) return 'Already earned';
    if (g.majors && !g.majors.includes(L.edu.majorDone)) return `Needs a science major (${g.majors.map(G.majorLabel).join(', ')})`;
    return true;
  };
  G.applyGrad = function (prog, want) {
    const L = G.life, e = L.edu, g = CL.GRAD[prog];
    const ok = G.gradCheck(L, prog);
    if (ok !== true) return G.fail(ok);
    const chance = e.gpa >= g.minGpa ? 0.9 : e.gpa >= g.minGpa - 15 ? 0.45 : 0.12;
    if (!U.chance(chance + (L.stats.smarts - 60) / 300)) return G.res('📭', `${g.label} said no this time. Sharpen those smarts and try again next year.`, { joy: -4 });
    const p = decidePayer(L, want, true);
    e.stage = 'grad';
    e.program = prog;
    e.year = 1;
    e.school = G.schoolName('college');
    e.payer = p.payer;
    e.scholarship = null;
    e.grades = U.clamp(Math.round((e.gpa || 60) * 0.6 + 25), 20, 95);
    e.clubs = [];
    G.payTuition(L);
    return G.res(g.emoji, `You were accepted to ${g.label} at ${e.school}!${g.cost && p.note ? ' ' + p.note : ''}${g.stipend ? ' You even get a yearly stipend.' : ''}`, { joy: 8 });
  };

  // ---------------------------------------------------------------- school acts
  const inAnySchool = (L) => G.inSchoolAny(L);
  G.act({
    id: 'study', cat: 'school', label: 'Study harder', emoji: '📚', desc: 'Hit the books to raise your grades.',
    show: inAnySchool,
    run(L, a, n) {
      const k = G.dim(n);
      L.edu.effort = (L.edu.effort || 0) + 1;
      const b = G.bucket4(L.stats.smarts * 0.6 + 30 - n * 8);
      const fx = { grades: Math.round(U.ri(4, 8) * k) || 1, smarts: Math.round(U.ri(1, 3) * k), joy: -U.ri(1, 3) };
      return G.res('📚', G.text('activityText', 'library', b, {}, 'You studied hard and your notes look great.'), fx);
    },
  });
  G.act({
    id: 'popQuiz', cat: 'school', label: 'Take a pop quiz', emoji: '❓', desc: 'Answer 3 questions. Each right answer boosts your grades.',
    show: inAnySchool, perYear: 3,
    steps: [{ type: 'quiz', set: 'school', count: 3 }],
    run(L, a) {
      const c = U.clamp(a.correct | 0, 0, 3);
      L.totals.quizRight += c;
      L.edu.effort = (L.edu.effort || 0) + c / 2;
      const fx = { grades: c * 3 + (c === 3 ? 3 : 0) - (c === 0 ? 3 : 0), smarts: c, joy: c === 3 ? 3 : c === 0 ? -2 : 0 };
      const text = c === 3 ? 'Perfect score on the pop quiz! Your teacher put a gold star on it.' : c === 0 ? 'Zero out of three on the pop quiz. Oof. Time to hit the books.' : `You got ${c} out of 3 right on the pop quiz.`;
      return G.res(c === 3 ? '🏅' : '❓', text, fx);
    },
  });
  G.act({
    id: 'teacherChat', cat: 'school', label: 'Ask your teacher for help', emoji: '🧑‍🏫', desc: 'A little extra help goes a long way.',
    show: G.inKidSchool, perYear: 1,
    run(L) {
      L.edu.effort = (L.edu.effort || 0) + 1;
      return G.res('🧑‍🏫', U.pick(['Your teacher explained fractions with pizza slices. It finally clicked!', 'You stayed after class and your teacher helped you with the tricky parts.', 'Your teacher said asking questions is the smartest thing a student can do.']), { grades: U.ri(2, 5), kindness: 1 });
    },
  });
  G.act({
    id: 'skipClass', cat: 'school', label: 'Skip class', emoji: '🛹', desc: 'Freedom! …but your grades might suffer.',
    show: inAnySchool, minAge: 10, perYear: 3,
    run(L) {
      if (U.chance(0.3 + L.notoriety / 300)) {
        const p = U.pick(G.parents(L));
        return G.res('🚨', 'You got caught skipping class and spent a long afternoon in detention.', { grades: -U.ri(3, 6), joy: -4, bond: p && L.age < 18 ? -4 : 0 }, { bondTarget: p && p.id });
      }
      return G.res('🛹', U.pick(['You skipped class and spent the afternoon at the park. Pure bliss.', 'You skipped class to watch clouds. One looked like a giant acorn.', 'You skipped class and explored the town. Nobody noticed… yet.']), { joy: U.ri(3, 6), grades: -U.ri(4, 8) });
    },
  });
  G.act({
    id: 'clubs', cat: 'school', label: 'Join or leave a club', emoji: '♟️', desc: 'Clubs build skills and friendships (up to 3).',
    show: inAnySchool, minAge: 6,
    steps: [{ type: 'pick', key: 'club', title: 'Clubs', options: (L) => CL.CLUBS.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji, sub: L.edu.clubs.includes(c.id) ? 'Joined — tap to leave' : 'Tap to join' })) }],
    run(L, a) {
      const c = CL.CLUBS.find((x) => x.id === a.club);
      if (!c) return G.fail('Pick a club first.');
      const e = L.edu;
      if (e.clubs.includes(c.id)) {
        e.clubs = e.clubs.filter((x) => x !== c.id);
        return { emoji: c.emoji, text: `You left the ${c.label}.`, tone: 'info', d: [], refund: true };
      }
      if (e.clubs.length >= 3) return G.fail('You can be in 3 clubs at most. Leave one first.');
      e.clubs.push(c.id);
      if (U.chance(0.35)) clubFriend(L, c);
      return Object.assign(G.res(c.emoji, `You joined the ${c.label}!`, c.fx), { refund: true });
    },
  });
  G.act({
    id: 'changeMajor', cat: 'school', label: 'Change your major', emoji: '🔀', desc: 'Switch to a different subject.',
    show: (L) => L.edu.stage === 'college', perYear: 1,
    steps: [{ type: 'pick', key: 'major', title: 'Pick a new major', options: (L) => CL.MAJORS.filter((m) => m.id !== L.edu.major).map((m) => ({ id: m.id, label: m.label, emoji: m.emoji })) }],
    run(L, a) {
      if (!CL.MAJORS.find((m) => m.id === a.major)) return G.fail('Pick a major.');
      L.edu.major = a.major;
      return G.res('🔀', `You switched your major to ${G.majorLabel(a.major)}. New textbooks, new you!`, { grades: -6, joy: 2 });
    },
  });
  G.act({
    id: 'dropOut', cat: 'school', label: 'Drop out', emoji: '🚪', desc: 'Leave school for good.',
    show: (L) => (L.edu.stage === 'high' && L.age >= 16) || G.inCollege(L),
    steps: [{ type: 'confirm', text: 'Are you sure you want to drop out? You will leave without a diploma or degree.' }],
    run(L) {
      const e = L.edu;
      const where = e.school;
      e.stage = 'done';
      e.school = null;
      e.clubs = [];
      e.program = null;
      e.dropout = true;
      const ps = G.parents(L);
      for (const p of ps) p.bond = U.clamp(p.bond - 8, 0, 100);
      return G.res('🚪', `You dropped out of ${where}.${ps.length ? ' Your parents were not thrilled.' : ''}`, { joy: 3 });
    },
  });
  G.act({
    id: 'ged', cat: 'career', label: 'Earn a GED', emoji: '📝', desc: 'Pass an exam to get a high-school equivalent.', cost: 120,
    show: (L) => L.age >= 16 && !G.inSchoolAny(L) && !L.edu.degrees.includes('highschool'),
    perYear: 2,
    run(L) {
      if (U.chance(0.3 + L.stats.smarts / 110)) {
        L.edu.degrees.push('highschool');
        L.edu.ged = true;
        L.edu.hsGrades = Math.max(L.edu.hsGrades, 55);
        return G.res('📝', 'You passed the GED exam! Doors are opening.', { joy: 8, smarts: 2 });
      }
      return G.res('📝', 'You missed the passing score on the GED exam. You can try again.', { joy: -3 });
    },
  });
  G.act({
    id: 'college', cat: 'career', label: 'Apply to university', emoji: '🏛️', desc: '4 years, a degree and lots of instant noodles.',
    show: (L) => L.age >= 17 && L.edu.degrees.includes('highschool') && !L.edu.degrees.includes('bachelor') && !G.inSchoolAny(L),
    perYear: 1,
    steps: [
      { type: 'pick', key: 'major', title: 'Choose your major', options: () => CL.MAJORS.map((m) => ({ id: m.id, label: m.label, emoji: m.emoji })) },
      { type: 'pick', key: 'payer', title: `Tuition is ${U.money(CL.TUITION)} a year`, options: (L) => payerOptions(L, false) },
    ],
    run(L, a) {
      if (!CL.MAJORS.find((m) => m.id === a.major)) return G.fail('Pick a major first.');
      if (L.job) G.endJob('school');
      return G.applyCollege(a.major, a.payer || 'loan');
    },
  });
  G.act({
    id: 'gradSchool', cat: 'career', label: 'Apply to grad school', emoji: '🎓', desc: 'Law, medicine, business or a PhD.',
    show: (L) => L.edu.degrees.includes('bachelor') && !G.inSchoolAny(L),
    perYear: 1,
    steps: [
      { type: 'pick', key: 'prog', title: 'Which program?', options: (L) => Object.entries(CL.GRAD).map(([id, g]) => { const ok = G.gradCheck(L, id); return { id, label: g.label, emoji: g.emoji, sub: ok === true ? `${g.years} years · ${g.cost ? U.money(g.cost) + '/yr' : 'paid stipend'}` : ok, disabled: ok !== true }; }) },
      { type: 'pick', key: 'payer', title: 'How will you pay?', options: (L) => payerOptions(L, true) },
    ],
    run(L, a) {
      if (!CL.GRAD[a.prog]) return G.fail('Pick a program.');
      if (L.job) G.endJob('school');
      return G.applyGrad(a.prog, a.payer || 'loan');
    },
  });
})(globalThis.CL);
