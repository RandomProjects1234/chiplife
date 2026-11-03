/* ChipLife engine — careers, interviews, part-time jobs, promotions and retirement. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const STAR_TRACKS = ['Sports', 'Entertainment', 'Arts', 'Media'];

  G.jobById = (id) => CL.content.jobs.find((j) => j.id === id);
  G.companyName = function (track) {
    const l = ((CL.content.lists.companies || {})[track]) || [];
    return U.pick(l) || `${U.pick(['Acorn', 'Hazel', 'Maple', 'Bright', 'Sunny', 'Summit'])} ${U.pick(['Co.', 'Group', 'Works', 'Partners'])}`;
  };
  G.taxRate = (gross) => (gross < 15000 ? 0.05 : gross < 50000 ? 0.14 : gross < 120000 ? 0.2 : gross < 400000 ? 0.27 : 0.33);

  G.hasEdu = function (L, job) {
    const d = L.edu.degrees;
    switch (job.edu) {
      case 'none': return true;
      case 'highschool': return d.includes('highschool');
      case 'bachelor': return d.includes('bachelor') && (!job.majors || !job.majors.length || job.majors.includes(L.edu.majorDone));
      default: return d.includes(job.edu);
    }
  };
  const EDU_LABEL = { none: 'No diploma needed', highschool: 'High school diploma', bachelor: "Bachelor's degree", law: 'Law degree', medical: 'Medical degree', business: 'MBA', phd: 'PhD' };
  G.jobReqs = function (L, job) {
    const reqs = [];
    let edu = EDU_LABEL[job.edu] || job.edu;
    if (job.edu === 'bachelor' && job.majors && job.majors.length) edu += ` (${job.majors.map(G.majorLabel).join(' / ')})`;
    reqs.push({ label: edu, ok: G.hasEdu(L, job) });
    for (const [k, s] of [['minSmarts', 'smarts'], ['minHealth', 'health'], ['minStyle', 'style']]) if (job[k]) reqs.push({ label: `${U.statLabel(s)} ${job[k]}+`, ok: L.stats[s] >= job[k] });
    for (const [s, v] of Object.entries(job.skill || {})) reqs.push({ label: `${U.statLabel(s)} skill ${v}+`, ok: (L.skills[s] || 0) >= v });
    return reqs;
  };
  G.canApply = function (L, job) {
    if (L.prison) return "You're in jail";
    if (L.age < 18) return 'You must be 18';
    if (G.inKidSchool(L)) return 'Finish school first';
    if (G.inCollege(L)) return 'Finish your studies first';
    if (L.job && L.job.id === job.id) return 'Your current job';
    if (G.jobReqs(L, job).some((r) => !r.ok)) return "You don't meet the requirements";
    if (G.used('apply') >= 4) return 'No more interviews this year';
    return true;
  };

  const FALLBACK_Q = [
    { q: 'Why do you want to work here?', a: [{ t: 'I admire what this team does and I want to help it grow.', s: 2 }, { t: 'It seems like a good place to learn.', s: 1 }, { t: 'It was the first job I saw.', s: 0 }, { t: 'I heard the vending machine has the good snacks.', s: -1 }] },
    { q: 'What is your greatest strength?', a: [{ t: 'I stay calm and solve problems step by step.', s: 2 }, { t: "I'm a hard worker.", s: 1 }, { t: "I'm not sure, honestly.", s: 0 }, { t: 'I can whistle with crackers in my mouth.', s: -1 }] },
  ];
  G.applyJob = function (jobId) {
    const L = G.life;
    const job = G.jobById(jobId);
    if (!job) return { error: 'That job is gone.' };
    const ok = G.canApply(L, job);
    if (ok !== true) return { error: ok };
    G.use('apply');
    const pool = CL.content.quiz.interview.length ? CL.content.quiz.interview : FALLBACK_Q;
    const q = U.pick(pool);
    return { job, question: { q: q.q, a: U.shuffle(q.a) } };
  };
  G.finishInterview = function (jobId, score) {
    const L = G.life;
    const job = G.jobById(jobId);
    if (!job) return null;
    let p = 0.38 + score * 0.15 + (L.stats.smarts - 50) / 260 + (L.stats.style - 50) / 320;
    if (L.perks.includes('charm')) p += 0.15;
    if (L.record.length) p -= 0.08 + Math.min(0.2, L.record.length * 0.04);
    p -= L.notoriety / 300;
    p = U.clamp(p, 0.05, 0.96);
    let r;
    if (U.chance(p)) {
      G.startJob(job);
      r = G.res(job.emoji, `You aced the interview and got the job! You're now a ${job.levels[0]} at ${L.job.company}, earning ${U.money(L.job.salary)} a year.`, { joy: 8 });
    } else {
      r = G.res('📭', U.pick([`The ${job.levels[0]} position went to someone else this time.`, `${G.companyName(job.track)} said thanks, but no thanks. Keep trying!`, `You didn't get the ${job.levels[0]} job. Your interview tie was great, though.`]), { joy: -3 });
    }
    G.say(r.text, r.emoji, r.tone, r.d);
    if (CL.meta) CL.meta.check();
    G.save();
    return r;
  };
  G.startJob = function (job, level = 0) {
    const L = G.life;
    if (L.job) G.endJob('switch');
    if (L.partTime) L.partTime = null;
    L.retired = false;
    L.job = {
      id: job.id, title: job.levels[level], track: job.track, emoji: job.emoji, level, raise: 1,
      salary: job.salary[level], perf: U.ri(48, 62), years: 0, total: 0, company: G.companyName(job.track),
    };
    if (!L.totals.firstJob) L.totals.firstJob = L.age;
  };
  G.endJob = function (why) {
    const L = G.life;
    const j = L.job;
    if (!j) return;
    L.career.push({ title: j.title, company: j.company, years: j.total, why });
    L.job = null;
    const msg = { quit: `You quit your job as ${j.title}.`, fired: `You were let go from your job as ${j.title}.`, laidoff: `${j.company} had to let you go from your job as ${j.title}.`, retired: `You retired from ${j.company} after ${U.plural(j.total, 'year')}.` }[why];
    if (msg) G.say(msg, why === 'retired' ? '🌅' : '📦', why === 'retired' ? 'good' : why === 'quit' ? 'info' : 'bad');
  };
  G.promote = function (L) {
    const j = L.job;
    const job = G.jobById(j.id);
    if (!job || j.level >= job.levels.length - 1) return false;
    j.level++;
    j.title = job.levels[j.level];
    j.salary = Math.round(job.salary[j.level] * j.raise);
    j.perf = U.clamp(j.perf - 15, 30, 100);
    j.years = 0;
    L.totals.promotions++;
    return true;
  };

  G.workYear = function (L) {
    if (L.job) {
      const j = L.job, job = G.jobById(j.id);
      const net = Math.round(j.salary * (1 - G.taxRate(j.salary)));
      L.money += net;
      L.totals.earned += net;
      if (L.flow) L.flow.income += net;
      j.years++;
      j.total++;
      L.totals.jobYears++;
      j.perf = U.clamp(Math.round(j.perf + U.ri(-6, 5) + (L.stats.smarts - 50) / 25 + (L.stats.health - 50) / 40 + (L.stats.joy - 50) / 40), 0, 100);
      if (job && STAR_TRACKS.includes(job.track)) L.fame = U.clamp(L.fame + Math.max(0, j.level * 2 - 1), 0, 100);
      if (job && j.perf >= 80 && j.years >= 2 && j.level < job.levels.length - 1 && U.chance(0.35)) {
        G.promote(L);
        G.say(`Your hard work paid off — you were promoted to ${j.title}! New salary: ${U.money(j.salary)}.`, '📈', 'good', G.fx({ joy: 6 }));
      } else if (j.perf <= 15 && U.chance(0.45)) {
        G.endJob('fired');
        G.fx({ joy: -8 });
      } else if (j.perf <= 25) {
        G.say(`Your boss warned you that your performance as ${j.title} needs to improve.`, '⚠️', 'bad');
      }
    }
    if (L.partTime) {
      const pt = L.partTime;
      const net = Math.round(pt.pay * 0.95);
      L.money += net;
      L.totals.earned += net;
      if (L.flow) L.flow.income += net;
      pt.years++;
    }
    if (L.retired && L.pension) {
      L.money += L.pension;
      if (L.flow) L.flow.income += L.pension;
    }
  };

  // ---------------------------------------------------------------- part-time
  G.partTimeState = function (L, pj) {
    if (L.prison) return "You're in jail";
    if (L.age < pj.minAge) return `You must be ${pj.minAge}`;
    if (L.job) return 'You already have a full-time job';
    if (L.partTime && L.partTime.id === pj.id) return 'Your current job';
    if (G.used('ptApply') >= 3) return 'No more applications this year';
    return true;
  };
  G.applyPartTime = function (id) {
    const L = G.life;
    const pj = CL.content.partTimeJobs.find((p) => p.id === id);
    if (!pj) return null;
    const ok = G.partTimeState(L, pj);
    if (ok !== true) return G.fail(ok);
    G.use('ptApply');
    let r;
    if (U.chance(0.72 + L.stats.smarts / 500 + L.stats.style / 600 - L.notoriety / 200)) {
      L.partTime = { id: pj.id, title: pj.title, emoji: pj.emoji, pay: pj.hourly * pj.hours * 50, perf: 55, years: 0, company: G.companyName(U.pick(['Retail', 'Food', 'Animals'])) };
      r = G.res(pj.emoji, `You got the part-time job as a ${pj.title}! That's about ${U.money(L.partTime.pay)} a year.`, { joy: 5 });
    } else {
      r = G.res('📭', `They picked someone else for the ${pj.title} job.`, { joy: -2 });
    }
    G.say(r.text, r.emoji, r.tone, r.d);
    G.save();
    return r;
  };

  // ---------------------------------------------------------------- work acts
  const hasJob = (L) => !!L.job;
  G.act({
    id: 'workHard', cat: 'work', label: 'Work harder', emoji: '💪', desc: 'Boost your performance (it is tiring!).', show: hasJob,
    run(L, a, n) {
      const k = G.dim(n);
      return G.res('💪', U.pick([`You stayed focused all week at ${L.job.company}.`, 'You cleared your whole to-do list. Even the scary items.', 'You came in early and impressed everyone.', 'You volunteered for the project nobody wanted — and nailed it.']), { performance: Math.round(U.ri(6, 12) * k) || 1, joy: -U.ri(1, 3), health: L.age > 40 ? -1 : 0 });
    },
  });
  G.act({
    id: 'askPromotion', cat: 'work', label: 'Ask for a promotion', emoji: '📈', desc: 'Move up the ladder.', perYear: 1,
    show: hasJob,
    avail: (L) => { const job = G.jobById(L.job.id); return job && L.job.level >= job.levels.length - 1 ? 'You are at the top!' : true; },
    run(L) {
      const j = L.job;
      const p = U.clamp((j.perf - 40) / 60 + j.years * 0.04 - j.level * 0.04, 0.03, 0.92);
      if (U.chance(p)) {
        G.promote(L);
        return G.res('📈', `You asked for a promotion and got it! You're now ${j.title}, earning ${U.money(j.salary)}.`, { joy: 10 });
      }
      return G.res('🙅', 'Your boss said you are not quite ready for a promotion yet.', { joy: -3, performance: -2 });
    },
  });
  G.act({
    id: 'askRaise', cat: 'work', label: 'Ask for a raise', emoji: '💵', desc: 'More money for the same job.', perYear: 1, show: hasJob,
    run(L) {
      const j = L.job;
      if (U.chance(U.clamp((j.perf - 45) / 70, 0.05, 0.85))) {
        const pct = U.ri(4, 12);
        j.raise *= 1 + pct / 100;
        j.salary = Math.round(j.salary * (1 + pct / 100));
        return G.res('💵', `You got a ${pct}% raise! Your salary is now ${U.money(j.salary)}.`, { joy: 6 });
      }
      return G.res('🙅', 'Your boss said the budget is tight this year. No raise.', { joy: -2 });
    },
  });
  G.act({
    id: 'workFriend', cat: 'work', label: 'Get lunch with a coworker', emoji: '🥪', desc: 'Make friends at work.', perYear: 2, show: hasJob,
    run(L) {
      if (U.chance(0.5) && G.alive(L, 'friend').length < 14) {
        const f = G.mkPerson(L, 'friend', { age: U.clamp(L.age + U.ri(-8, 8), 18, 90), bond: U.ri(50, 70), met: 'work' });
        L.people.push(f);
        L.totals.friends++;
        return G.res('🥪', `You had lunch with your coworker ${f.first} and became friends!`, { joy: 4 });
      }
      return G.res('🥪', 'You had a nice lunch with a coworker. The sandwiches were excellent.', { joy: 2, performance: 1 });
    },
  });
  G.act({
    id: 'quitJob', cat: 'work', label: 'Quit your job', emoji: '🚪', desc: 'Walk out the door for good.', show: hasJob,
    steps: [{ type: 'confirm', text: 'Quit your job? You will stop getting paid.' }],
    run() { G.endJob('quit'); return { emoji: '🚪', text: '', d: [], silent: true }; },
  });
  G.act({
    id: 'retire', cat: 'work', label: 'Retire', emoji: '🌅', desc: 'Stop working and collect a pension.', minAge: 55, show: hasJob,
    steps: [{ type: 'confirm', text: 'Retire now? You will receive a yearly pension.' }],
    run(L) {
      const sal = L.job.salary;
      L.pension = Math.round(sal * 0.4 + 9000);
      L.retired = true;
      G.endJob('retired');
      return G.res('🌅', `Your pension will be ${U.money(L.pension)} a year. Time for hobbies!`, { joy: 10 });
    },
  });
  G.act({
    id: 'quitPartTime', cat: 'work', label: 'Quit part-time job', emoji: '👋', desc: 'Leave your part-time job.', show: (L) => !!L.partTime,
    run(L) {
      const t = L.partTime.title;
      L.partTime = null;
      return { emoji: '👋', text: `You quit your part-time job as a ${t}.`, tone: 'info', d: [] };
    },
  });
  G.act({
    id: 'partTimeHard', cat: 'work', label: 'Work an extra shift', emoji: '⏰', desc: 'Earn a little extra cash.', perYear: 3, show: (L) => !!L.partTime && !L.job,
    run(L) {
      const pay = Math.round(L.partTime.pay / 25);
      return G.res('⏰', `You picked up an extra shift as a ${L.partTime.title} and earned ${U.money(pay)}.`, { money: pay, joy: -1 });
    },
  });
})(globalThis.CL);
