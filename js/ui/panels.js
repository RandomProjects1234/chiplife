/* ChipLife UI — the bottom-sheet panels: school/career/jail, people, stuff, activities, profile, menu. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const UI = CL.UI;
  const h = UI.h;
  const STATC = (id) => `var(--${id})`;
  const bondColor = (b) => (b >= 70 ? 'var(--good)' : b >= 40 ? 'var(--joy)' : 'var(--bad)');

  UI.openTab = function (id) {
    if (UI.modalOpen || UI.isBusy() || !G.life) return;
    const v = VIEWS[id];
    if (v) UI.openSheet(v());
  };

  function actRow(a) {
    const st = G.actState(a);
    if (st.hidden) return null;
    let sub = st.ok ? a.desc : st.why;
    if (st.ok && a.cost) sub += st.cost ? ` · ${U.money(st.cost)}` : ' · Parents pay';
    return UI.row({ emoji: a.emoji, label: a.label, sub, subBad: !st.ok, disabled: !st.ok, onClick: () => UI.doAct(a.id) });
  }
  const actRows = (cat, ids) => G.ACTS.filter((a) => a.cat === cat && (!ids || ids.includes(a.id))).map(actRow).filter(Boolean);
  const rows = (list) => h('div.rows', list);

  // ---------------------------------------------------------------- school / career / jail
  function pathView() {
    return {
      title: () => { const L = G.life; return L.prison ? 'Jail' : L.age < 5 ? 'Growing up' : G.inSchoolAny(L) || L.age < 18 ? 'School' : 'Career'; },
      render() {
        const L = G.life;
        const box = h('div');
        if (L.prison) {
          const P = L.prison;
          box.append(h('div.card', [
            h('div.hero', [h('div.big', '🏛️'), h('div', [h('h4', P.name), h('div.muted', `Year ${P.served + 1} of ${P.years} · ${U.plural(P.left, 'year')} left`)])]),
            UI.meter('Behavior (good behavior can mean early parole)', P.behavior, 'var(--good)'),
          ]));
          box.append(UI.sec('Make the most of it'), rows(actRows('prison')));
          return box;
        }
        if (L.age < 5) {
          box.append(h('div.card', [h('div.hero', [h('div.big', L.age < 3 ? '🍼' : '🖍️'), h('div', [h('h4', L.age < 3 ? "You're a little one!" : L.edu.school || 'Preschool'), h('div.muted', L.age < 3 ? 'School starts at 5. For now: naps, snacks and giggles.' : 'Kindergarten starts at 5. Lots of finger painting until then.')])])]));
          box.append(h('p.note', { style: { marginTop: '10px' } }, '🐿️ Chip says: Try the Activities tab — even toddlers can go for walks, see movies and visit the library!'));
          return box;
        }
        const e = L.edu;
        if (G.inSchoolAny(L)) {
          const clubs = e.clubs.map((id) => CL.CLUBS.find((c) => c.id === id)).filter(Boolean);
          box.append(h('div.card', [
            h('div.hero', [h('div.big', G.inCollege(L) ? '🏛️' : '🏫'), h('div', [h('h4', e.school), h('div.muted', G.classLabel(L) + (e.scholarship ? ` · ${e.scholarship === 'full' ? 'Full' : 'Half'} scholarship` : ''))])]),
            UI.meter('Grades', e.grades, e.grades >= 75 ? 'var(--good)' : e.grades >= 48 ? 'var(--joy)' : 'var(--bad)', `${G.gradeLetter(e.grades)} · ${e.grades}`),
            clubs.length ? h('div.pills', clubs.map((c) => h('span.pill', `${c.emoji} ${c.label}`))) : null,
          ]));
          box.append(UI.sec('Schoolwork'), rows(actRows('school')));
        }
        if (L.age >= 14 && !L.job) {
          box.append(UI.sec('Part-time work'));
          if (L.partTime) {
            box.append(h('div.card', [h('div.hero', [h('div.big', L.partTime.emoji), h('div', [h('h4', L.partTime.title), h('div.muted', `${L.partTime.company} · about ${U.money(L.partTime.pay)} a year`)])])]));
            box.append(rows(actRows('work', ['partTimeHard', 'quitPartTime'])));
          } else box.append(rows([UI.row({ emoji: '🧾', label: 'Find a part-time job', sub: 'Earn some pocket money after school', onClick: () => UI.push(partTimeBoard()) })]));
        }
        if (L.age >= 16 && !G.inKidSchool(L)) {
          const degs = G.degreeNames(L);
          box.append(UI.sec('Education'));
          box.append(h('div.card', [h('div.hero', [h('div.big', '🎓'), h('div', [h('h4', degs.length ? degs[degs.length - 1] : 'No diploma yet'), h('div.muted', degs.length > 1 ? degs.slice(0, -1).join(' · ') : G.inCollege(L) ? 'Studying now' : 'Keep learning!')])])]));
          const er = actRows('career');
          if (er.length) box.append(h('div.rows', { style: { marginTop: '6px' } }, er));
        }
        if (L.age >= 18 && !G.inSchoolAny(L)) {
          box.append(UI.sec('Career'));
          if (L.job) {
            const j = L.job, job = G.jobById(j.id);
            box.append(h('div.card', [
              h('div.hero', [h('div.big', j.emoji), h('div', [h('h4', j.title), h('div.muted', `${j.company} · ${U.money(j.salary)}/yr · ${U.plural(j.total, 'year')} here`)])]),
              UI.meter('Performance', j.perf, j.perf >= 70 ? 'var(--good)' : j.perf >= 35 ? 'var(--joy)' : 'var(--bad)'),
              job ? h('div.muted', { style: { marginTop: '6px' } }, `Level ${j.level + 1} of ${job.levels.length}${j.level < job.levels.length - 1 ? ` · next: ${job.levels[j.level + 1]}` : ' · top of the ladder!'}`) : null,
            ]));
            box.append(h('div.rows', { style: { marginTop: '6px' } }, actRows('work', ['workHard', 'askPromotion', 'askRaise', 'workFriend', 'retire', 'quitJob'])));
          } else if (L.retired) {
            box.append(h('div.card', [h('div.hero', [h('div.big', '🌅'), h('div', [h('h4', 'Happily retired'), h('div.muted', `Pension: ${U.money(L.pension)} a year`)])])]));
          }
          box.append(h('div.rows', { style: { marginTop: '6px' } }, [UI.row({ emoji: '📋', label: L.job ? 'Look for a different job' : 'Browse the job board', sub: `${CL.content.jobs.length} careers · interviews left this year: ${Math.max(0, 4 - G.used('apply'))}`, onClick: () => UI.push(jobBoard()) })]));
        }
        return box;
      },
    };
  }
  function partTimeBoard() {
    return {
      title: 'Part-time jobs',
      render() {
        const L = G.life;
        return h('div', [h('div.rows', CL.content.partTimeJobs.slice().sort((a, b) => a.minAge - b.minAge).map((pj) => {
          const ok = G.partTimeState(L, pj);
          return UI.row({ emoji: pj.emoji, label: pj.title, sub: ok === true ? `${pj.desc} · ~${U.money(pj.hourly * pj.hours * 50)}/yr` : ok, subBad: ok !== true, disabled: ok !== true, onClick: () => UI.doCall(() => G.applyPartTime(pj.id)) });
        }))]);
      },
    };
  }
  function jobBoard() {
    return {
      title: 'Job board',
      render() {
        const L = G.life;
        const all = CL.content.jobs.slice().sort((a, b) => a.salary[0] - b.salary[0]);
        const ok = all.filter((j) => G.jobReqs(L, j).every((r) => r.ok));
        const no = all.filter((j) => !ok.includes(j));
        const r = (j) => {
          const miss = G.jobReqs(L, j).find((x) => !x.ok);
          return UI.row({ emoji: j.emoji, label: j.levels[0], sub: miss ? `Needs: ${miss.label}` : `${j.track} · up to ${j.levels[j.levels.length - 1]}`, subBad: !!miss, right: U.money(j.salary[0]), rightCls: 'money', onClick: () => UI.push(jobDetail(j.id)) });
        };
        return h('div', [
          h('p.note', `You can do ${Math.max(0, 4 - G.used('apply'))} more interviews this year. Better education and skills open more doors!`),
          UI.sec(`You qualify (${ok.length})`), ok.length ? rows(ok.map(r)) : h('p.muted', 'Nothing yet — keep studying!'),
          UI.sec(`Need more training (${no.length})`), rows(no.map(r)),
        ]);
      },
    };
  }
  function jobDetail(id) {
    const j = G.jobById(id);
    return {
      title: j.levels[0],
      render() {
        const L = G.life;
        const can = G.canApply(L, j);
        return h('div', [
          h('div.card', [h('div.hero', [h('div.big', j.emoji), h('div', [h('h4', j.levels[0]), h('div.muted', `${j.track} · ${j.desc}`)])])]),
          UI.sec('Career ladder'),
          h('div.card', h('div.kv', j.levels.flatMap((lv, i) => [h('span', `${i + 1}. ${lv}`), h('span', U.money(j.salary[i]))]))),
          UI.sec('Requirements'),
          h('div.card', h('div.kv', G.jobReqs(L, j).flatMap((r) => [h('span', r.label), h('span', { style: { color: r.ok ? 'var(--good)' : 'var(--bad)' } }, r.ok ? '✓' : '✗')]))),
          h('button.btn.primary.block', { style: { marginTop: '12px' }, disabled: can !== true, onclick: () => applyFor(j.id) }, can === true ? 'Apply & interview' : can),
        ]);
      },
    };
  }
  function applyFor(id) {
    UI.doCall(async () => {
      const r = G.applyJob(id);
      if (r.error) return G.fail(r.error);
      const score = await UI.mg.interview(r.question);
      if (score == null) return null;
      const res = G.finishInterview(id, score);
      if (G.life.job && G.life.job.id === id) UI.closeSheet();
      return res;
    });
  }

  // ---------------------------------------------------------------- people
  const GROUPS = [
    ['Parents', (p) => p.kind === 'mother' || p.kind === 'father'],
    ['Grandparents', (p) => p.kind === 'grandparent'],
    ['Siblings', (p) => p.kind === 'sibling'],
    ['Your kids', (p) => p.kind === 'child'],
    ['Friends', (p) => p.kind === 'friend'],
    ['Pets', (p) => p.kind === 'pet'],
  ];
  function personSub(p) {
    const bits = [p.kind === 'pet' ? (p.breed && p.breed.toLowerCase() !== p.petType ? `${p.breed} ${p.petType}` : U.cap(p.petType)) : G.roleOf(p), `age ${p.age}`];
    if (p.job && (p.kind === 'mother' || p.kind === 'father')) bits.push(p.job);
    if (p.kind === 'friend' && p.met) bits.push(`met at ${p.met}`);
    return bits.join(' · ');
  }
  function peopleView() {
    return {
      title: 'People',
      render() {
        const L = G.life;
        const box = h('div');
        for (const [label, test] of GROUPS) {
          const list = L.people.filter((p) => p.alive && test(p));
          if (!list.length) continue;
          box.append(UI.sec(`${label} (${list.length})`), rows(list.map((p) => UI.row({ emoji: G.faceOf(p), label: p.kind === 'pet' ? p.first : `${p.first} ${p.last}`, sub: personSub(p), right: UI.minibar(p.bond, bondColor(p.bond)), onClick: () => UI.push(personView(p.id)) }))));
        }
        if (!G.alive(L, 'friend').length) box.append(h('p.note', { style: { marginTop: '12px' } }, '🐿️ No friends yet? Try Activities → Friends & Kindness → Make a new friend, or join a club at school!'));
        const gone = L.people.filter((p) => !p.alive);
        if (gone.length) box.append(UI.sec('In our hearts'), rows([UI.row({ emoji: '🌸', label: `Remembered (${gone.length})`, sub: 'Family, friends and pets who are no longer with you', onClick: () => UI.push(memoryView()) })]));
        return box;
      },
    };
  }
  function memoryView() {
    return {
      title: 'Remembered',
      render() {
        const L = G.life;
        return rows(L.people.filter((p) => !p.alive).map((p) => UI.row({ emoji: p.kind === 'pet' ? p.emoji : '🌸', label: p.kind === 'pet' ? p.first : `${p.first} ${p.last}`, sub: `${G.roleOf(p)} · until age ${p.age}`, onClick: () => UI.push(personView(p.id)) })));
      },
    };
  }
  function personView(pid) {
    return {
      title: () => { const p = G.person(pid); return p ? (p.kind === 'pet' ? p.first : `${p.first} ${p.last}`) : ''; },
      valid: () => !!G.person(pid),
      render() {
        const L = G.life, p = G.person(pid);
        if (!p) return h('p', 'They are not around anymore.');
        const acts = G.INTERACTIONS.map((it) => ({ it, st: G.interactState(L, p, it) })).filter((x) => !x.st.hidden);
        return h('div', [
          h('div.card', [
            h('div.hero', [h('div.big', p.alive ? G.faceOf(p) : '🌸'), h('div', [h('h4', p.kind === 'pet' ? p.first : `${p.first} ${p.last}`), h('div.muted', personSub(p))])]),
            p.alive ? UI.meter('Relationship', p.bond, bondColor(p.bond)) : h('div.muted', { style: { marginTop: '8px' } }, 'Gone but never forgotten.'),
          ]),
          h('div.actions', acts.map(({ it, st }) => h('button.act', { disabled: !st.ok, onclick: () => UI.doInteract(pid, it.id) }, [h('span.ae', it.emoji), h('span', [it.label, !st.ok ? h('small', st.why) : st.cost ? h('small', U.money(st.cost)) : null])]))),
        ]);
      },
    };
  }

  // ---------------------------------------------------------------- stuff
  function stuffView() {
    return {
      title: 'Stuff & Money',
      render() {
        const L = G.life;
        const inc = G.yearlyIncome(L).reduce((t, x) => t + x.amount, 0);
        const cost = G.yearlyCosts(L).reduce((t, x) => t + x.amount, 0);
        const box = h('div', [
          h('div.card', [
            h('div.kv', [
              h('span', '💵 Cash'), h('span', { style: { color: L.money < 0 ? 'var(--bad)' : 'var(--good)' } }, U.money(L.money)),
              h('span', '📊 Net worth'), h('span', U.money(G.netWorth(L))),
              h('span', '⬆️ Yearly income'), h('span', U.money(inc)),
              h('span', '⬇️ Yearly costs'), h('span', U.money(cost)),
              h('span', '🏠 Home'), h('span', G.homeLabel(L)),
            ]),
            h('button.btn.small', { style: { marginTop: '10px' }, onclick: () => UI.push(budgetView()) }, 'See budget details'),
          ]),
        ]);
        const byType = (t) => L.assets.filter((a) => a.type === t);
        const assetRows = (list) => rows(list.map((a) => UI.row({ emoji: a.emoji, label: a.name, sub: a.type === 'house' ? (a.id === L.homeId && L.home === 'own' ? 'You live here' : 'Rented out for income') : a.stolen ? 'Stolen — sells for 40%' : a.kind === 'loot' ? 'Swiped loot' : a.kind === 'gift' ? 'A gift' : '', right: U.money(a.stolen ? a.value * 0.4 : a.value), rightCls: 'money', onClick: () => UI.push(assetView(a.id)) })));
        if (byType('house').length) box.append(UI.sec('Homes'), assetRows(byType('house')));
        if (byType('vehicle').length) box.append(UI.sec('Vehicles'), assetRows(byType('vehicle')));
        if (byType('item').length) box.append(UI.sec('Things'), assetRows(byType('item')));
        if (L.loans.length) {
          box.append(UI.sec('Loans'), rows(L.loans.map((l) => UI.row({ emoji: '🏦', label: l.label, sub: `${Math.round(l.rate * 1000) / 10}% interest · tap to pay it all off`, right: U.money(l.balance), onClick: async () => { if (await UI.confirm(`Pay off ${U.money(l.balance)} now?`)) UI.doCall(() => G.payLoan(l.id)); } }))));
        }
        box.append(UI.sec('Shopping'), rows([
          UI.row({ emoji: '🛍️', label: 'The Shop', sub: 'Toys, gadgets, instruments and more', onClick: () => UI.push(shopView('items')) }),
          UI.row({ emoji: '🚗', label: 'Vehicle lot', sub: L.license ? 'Bikes, cars and fancy rides' : "Bikes now — cars need a driver's license", onClick: () => UI.push(shopView('vehicles')) }),
          UI.row({ emoji: '🏡', label: 'Real estate', sub: L.age >= 18 ? 'Find your dream home' : 'Opens at 18', disabled: L.age < 18, onClick: () => UI.push(shopView('houses')) }),
        ]));
        return box;
      },
    };
  }
  function budgetView() {
    return {
      title: 'Yearly budget',
      render() {
        const L = G.life;
        const inc = G.yearlyIncome(L), cost = G.yearlyCosts(L);
        const kv = (list) => h('div.card', list.length ? h('div.kv', list.flatMap((x) => [h('span', x.label), h('span', U.money(x.amount))])) : h('div.muted', 'Nothing here.'));
        return h('div', [UI.sec('Money in'), kv(inc), UI.sec('Money out'), kv(cost), h('p.note', { style: { marginTop: '10px' } }, L.age < 18 ? 'Your family covers your living costs until you move out.' : 'Costs are paid each time you age up. Owning a home means no rent!')]);
      },
    };
  }
  function shopView(kind) {
    const titles = { items: 'The Shop', vehicles: 'Vehicle lot', houses: 'Real estate' };
    return {
      title: titles[kind],
      render() {
        const L = G.life;
        const list = (CL.content.catalog[kind] || []).slice().sort((a, b) => a.price - b.price);
        return h('div', [
          h('p.note', `You have ${U.money(L.money)}.${kind === 'houses' ? ' With a mortgage you only need 20% down.' : ''}`),
          h('div.rows', { style: { marginTop: '8px' } }, list.map((it) => {
            const st = G.shopState(L, kind, it);
            const afford = kind === 'houses' ? L.money >= it.price || G.mortgageOk(L, it.price) === true : L.money >= it.price;
            const why = st !== true ? st : !afford ? 'Not enough money' : null;
            const sub = why || (kind === 'items' ? it.desc : kind === 'houses' ? `${it.rooms} rooms · ${it.desc}` : `${U.cap(it.kind)} · style ${it.style}/10`);
            return UI.row({ emoji: it.emoji, label: it.name, sub, subBad: !!why, disabled: !!why, right: U.money(it.price), onClick: () => buyFlow(kind, it) });
          })),
        ]);
      },
    };
  }
  async function buyFlow(kind, it) {
    const L = G.life;
    if (kind === 'houses') {
      const m = G.mortgageOk(L, it.price);
      const pay = await UI.pick(`Buy ${it.name}?`, [
        { id: 'cash', label: `Pay cash (${U.money(it.price)})`, emoji: '💵', disabled: L.money < it.price },
        { id: 'mortgage', label: `Mortgage (${U.money(it.price * 0.2)} down)`, emoji: '🏦', sub: m === true ? '25 years at 5% interest' : m, disabled: m !== true },
      ]);
      if (!pay) return;
      return UI.doCall(() => G.buy(kind, it.id, pay));
    }
    if (!(await UI.confirm(`Buy ${G.an(it.name)} for ${U.money(it.price)}?`, 'Buy it!'))) return;
    UI.doCall(() => G.buy(kind, it.id));
  }
  function assetView(id) {
    return {
      title: () => { const a = G.life.assets.find((x) => x.id === id); return a ? a.name : ''; },
      valid: () => G.life.assets.some((x) => x.id === id),
      render() {
        const L = G.life;
        const a = L.assets.find((x) => x.id === id);
        const loan = L.loans.find((l) => l.assetId === id);
        const value = a.stolen ? Math.round(a.value * 0.4) : a.value;
        return h('div', [
          h('div.card', [h('div.hero', [h('div.big', a.emoji), h('div', [h('h4', a.name), h('div.muted', a.stolen ? 'Stolen — only shady buyers will take it' : a.bought != null ? `Got it at age ${a.bought}` : '')])])]),
          h('div.card', h('div.kv', [h('span', 'Worth'), h('span', U.money(a.value)), loan ? h('span', 'Mortgage left') : null, loan ? h('span', U.money(loan.balance)) : null, h('span', 'You would get'), h('span', U.money(value - (loan ? loan.balance : 0)))])),
          h('div.actions', [
            a.type === 'house' && !(L.homeId === id && L.home === 'own') ? h('button.btn', { onclick: () => UI.doCall(() => G.moveInto(id)) }, '🏠 Move in') : null,
            h('button.btn.danger', { onclick: async () => { if (await UI.confirm(`Sell your ${a.name}?`, 'Sell')) { UI.back(); UI.doCall(() => G.sellAsset(id)); } } }, '💸 Sell'),
          ]),
        ]);
      },
    };
  }

  // ---------------------------------------------------------------- activities
  function doView() {
    return {
      title: 'Activities',
      render() {
        const L = G.life;
        if (L.prison) return h('div', [h('p.note', `You're at ${L.prison.name}. Behave, study and stay strong — or try your luck with an escape!`), UI.sec('Jail life'), rows(actRows('prison'))]);
        return h('div.grid2', G.ACT_CATS.map((c) => {
          const n = G.ACTS.filter((a) => a.cat === c.id && G.actState(a).ok).length;
          return h('button.tile', { onclick: () => UI.push(catView(c)) }, [h('span.te', c.emoji), h('b', c.label), h('small', n ? `${c.desc}` : 'Nothing available yet')]);
        }));
      },
    };
  }
  function catView(c) {
    return {
      title: c.label,
      render() {
        const list = actRows(c.id);
        const note = c.id === 'mischief' ? h('p.note', { style: { marginBottom: '10px' } }, '🦹 Silly cartoon capers — nobody gets hurt. But get caught and you face fines, court and even jail. Police heat makes getting caught more likely!') : null;
        return h('div', [note, list.length ? rows(list) : h('p.muted', 'Nothing here yet — try again when you are older!')]);
      },
    };
  }

  // ---------------------------------------------------------------- profile
  function profileView() {
    return {
      title: 'About you',
      render() {
        const L = G.life;
        const C = G.country(L.country);
        const job = L.job ? `${L.job.title} at ${L.job.company}` : UI.occupation(L);
        return h('div', [
          h('div.card', [
            h('div.hero', [h('div.big', G.myFace(L)), h('div', [h('h4', `${L.first} ${L.last}`), h('div.muted', [UI.em(C.flag), ` ${L.city}, ${C.name} · born ${L.birthYear}${L.gen > 1 ? ` · generation ${L.gen}` : ''}`]), h('div.muted', job)])]),
            ...CL.STATS.map((s) => UI.meter(`${s.emoji} ${s.label}`, L.stats[s.id], STATC(s.id))),
          ]),
          UI.sec('Spotlight'),
          h('div.card', h('div.kv', [h('span', '⭐ Fame'), h('span', L.fame), h('span', '👥 Followers'), h('span', U.num(L.followers)), h('span', '🚨 Police heat'), h('span', { style: { color: L.notoriety > 40 ? 'var(--bad)' : null } }, L.notoriety), h('span', '📊 Net worth'), h('span', U.money(G.netWorth(L)))])),
          UI.sec('Skills'),
          h('div.card', CL.SKILLS.map((s) => UI.meter(`${s.emoji} ${s.label}`, L.skills[s.id], 'var(--accent)'))),
          UI.sec('Education'),
          h('div.card', [h('div', G.degreeNames(L).length ? G.degreeNames(L).join(' · ') : 'No diplomas yet'), G.inSchoolAny(L) ? h('div.muted', `Now: ${L.edu.school} (${G.classLabel(L)})`) : null]),
          UI.sec('Work history'),
          h('div.card', L.career.length || L.job ? h('div.kv', [...(L.job ? [h('span', `${L.job.title} (now)`), h('span', L.job.company)] : []), ...L.career.slice(-8).reverse().flatMap((c) => [h('span', c.title), h('span', U.plural(c.years, 'yr'))])]) : h('div.muted', 'No jobs yet.')),
          UI.sec('Health'),
          h('div.card', L.conditions.length ? h('div.pills', L.conditions.map((c) => h('span.pill', `${c.emoji || '🤒'} ${c.name}`))) : h('div.muted', 'Healthy as an acorn! 🌰')),
          UI.sec('Record'),
          h('div.card', L.record.length ? h('div.kv', L.record.slice(-10).flatMap((r) => [h('span', `${r.crime} (age ${r.age})`), h('span', r.outcome)])) : h('div.muted', 'Squeaky clean. ✨')),
          UI.sec(`Acorns earned this life (${L.ach.length})`),
          h('div.card', L.ach.length ? h('div.pills', L.ach.map((id) => { const a = CL.meta.ACORNS.find((x) => x.id === id); return a ? h('span.pill', `${a.emoji} ${a.label}`) : null; })) : h('div.muted', 'None yet — go make some memories!')),
        ]);
      },
    };
  }

  // ---------------------------------------------------------------- menu
  function menuView() {
    return {
      title: 'Menu',
      render() {
        const M = G.meta;
        return rows([
          UI.row({ emoji: '❓', label: 'How to play', onClick: () => UI.push(UI.howToView()) }),
          UI.row({ emoji: '🌰', label: 'Acorn Stash', sub: `${CL.meta.count()} of ${CL.meta.ACORNS.length} acorns`, onClick: () => UI.push(UI.stashView()) }),
          UI.row({ emoji: '📜', label: 'Past lives', sub: `${M.lives.length} lives lived`, onClick: () => UI.push(UI.livesView()) }),
          UI.row({ emoji: M.sound === false ? '🔇' : '🔊', label: `Sound: ${M.sound === false ? 'off' : 'on'}`, onClick: () => { M.sound = M.sound === false; G.save(); UI.refreshSheet(); } }),
          UI.row({ emoji: '🏠', label: 'Save & go to title', sub: 'Your life is saved automatically', onClick: () => { G.save(); UI.showStart(); } }),
          UI.row({ emoji: '🗑️', label: 'Abandon this life', sub: 'Start over without finishing', onClick: async () => { if (await UI.confirm('Abandon this life and start over? It will not count in your past lives.', 'Abandon')) { G.clearLife(); UI.showStart(); } } }),
        ]);
      },
    };
  }

  const VIEWS = { path: pathView, people: peopleView, stuff: stuffView, do: doView, profile: profileView, menu: menuView };
  UI.views = VIEWS;
  // sub-views, handy for tests and deep links
  UI.sub = { jobBoard, jobDetail, partTimeBoard, personView, memoryView, shopView, budgetView, assetView, catView };
})(globalThis.CL);
