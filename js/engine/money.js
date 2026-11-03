/* ChipLife engine — money, the shop, vehicles, homes, loans and the yearly budget. */
(function (CL) {
  'use strict';
  const U = CL.util;
  const G = CL.G;
  const cat = () => CL.content.catalog;
  const an = (s) => (/^[aeiou]/i.test(s) ? 'an ' : 'a ') + s;
  G.an = an;

  G.addItem = function (o) {
    const L = G.life;
    const a = { id: U.uid(), type: 'item', cat: o.cat || null, name: o.name, emoji: o.emoji || '🎁', value: o.value || 0, kind: o.kind || 'gift', unlocks: o.unlocks || null, bought: L.age };
    L.assets.push(a);
    return a;
  };
  G.hasUnlock = (L, tag) => L.assets.some((a) => a.type === 'item' && a.unlocks === tag);
  G.homeAsset = (L) => L.assets.find((a) => a.id === L.homeId);
  G.homeLabel = function (L) {
    if (L.prison) return `A cell at ${L.prison.name}`;
    if (L.home === 'parents') return G.parents(L).length ? "Living with your family" : 'Living with relatives';
    if (L.home === 'own') { const h = G.homeAsset(L); return h ? `Your ${h.name}` : 'Your own place'; }
    return 'Renting an apartment';
  };
  G.netWorth = (L) => G.estate(L);

  // ---------------------------------------------------------------- yearly budget
  G.yearlyCosts = function (L) {
    const out = [];
    if (L.prison) return out;
    const adult = L.age >= 18;
    if (adult && L.home !== 'parents') {
      out.push({ label: 'Food & bills', amount: 4800 });
      if (L.home === 'rent') out.push({ label: 'Rent', amount: 7200 });
    }
    for (const a of L.assets) {
      if (a.type === 'house') out.push({ label: `${a.name} upkeep`, amount: Math.round(a.value * 0.01) });
      if (a.type === 'vehicle' && !a.stolen) out.push({ label: `${a.name} upkeep`, amount: Math.round(500 + a.value * 0.02) });
    }
    if (adult) {
      for (const p of G.alive(L, 'pet')) out.push({ label: `${p.first}'s food & vet`, amount: G.petInfo(p.species).upkeep || 400 });
      for (const k of G.alive(L, 'child')) if (k.age < 18) out.push({ label: `Raising ${k.first}`, amount: 5000 });
    }
    for (const l of L.loans) if (l.balance > 0) out.push({ label: l.label, amount: Math.round(Math.min(l.balance * (1 + l.rate), l.kind === 'student' ? Math.max(2000, l.balance / 10) : l.pay)), loan: l.id });
    return out;
  };
  G.yearlyIncome = function (L) {
    const out = [];
    if (L.job) out.push({ label: `${L.job.title} salary (after tax)`, amount: Math.round(L.job.salary * (1 - G.taxRate(L.job.salary))) });
    if (L.partTime) out.push({ label: `${L.partTime.title} pay`, amount: Math.round(L.partTime.pay * 0.95) });
    if (L.retired && L.pension) out.push({ label: 'Pension', amount: L.pension });
    const spon = G.sponsorPay(L);
    if (spon) out.push({ label: 'Sponsors & fans', amount: spon });
    for (const a of L.assets) if (a.type === 'house' && a.id !== L.homeId) out.push({ label: `Rent from ${a.name}`, amount: Math.round(a.value * 0.04) });
    for (const r of L.royalties || []) out.push({ label: `Royalties: ${r.label}`, amount: r.amount });
    return out;
  };
  G.sponsorPay = (L) => (L.followers >= 5000 ? Math.round(L.followers * 0.03) : 0);

  G.moneyYear = function (L) {
    const flow = L.flow || (L.flow = { income: 0, costs: 0, notes: [] });
    for (const i of G.yearlyIncome(L)) {
      if (/salary|pay$|Pension/.test(i.label) && !/Sponsors|Rent from|Royalties/.test(i.label)) continue; // already paid in workYear
      L.money += i.amount;
      L.totals.earned += i.amount;
      flow.income += i.amount;
    }
    if (L.royalties) {
      for (const r of L.royalties) r.amount = Math.round(r.amount * 0.5);
      L.royalties = L.royalties.filter((r) => r.amount >= 100);
    }
    for (const c of G.yearlyCosts(L)) {
      L.money -= c.amount;
      flow.costs += c.amount;
      if (c.loan) {
        const l = L.loans.find((x) => x.id === c.loan);
        if (l) l.balance = Math.max(0, Math.round(l.balance * (1 + l.rate) - c.amount));
      }
    }
    for (const l of L.loans.filter((x) => x.balance <= 0)) G.say(`You paid off your ${l.label.toLowerCase()}! 🎉`, '🏦', 'good');
    L.loans = L.loans.filter((l) => l.balance > 0);
    for (const a of L.assets) {
      if (a.type === 'house') a.value = Math.round(a.value * (1 + U.rf(-0.02, 0.06)));
      if (a.type === 'vehicle') a.value = Math.max(Math.round((a.price || a.value) * 0.1), Math.round(a.value * (1 - U.rf(0.07, 0.14))));
    }
    if (L.money < 0 && L.age >= 18) {
      L.money = Math.round(L.money * 1.07);
      if (L.money < -25000) repossess(L);
    }
    if (L.age >= 18 && (flow.income || flow.costs)) {
      const parts = [];
      if (flow.income) parts.push(`+${U.money(flow.income)} in`);
      if (flow.costs) parts.push(`−${U.money(flow.costs)} out`);
      G.say(`Money this year: ${parts.join(', ')}.`, '💰', flow.income >= flow.costs ? 'info' : 'bad');
    }
    if (L.money < 0 && L.age >= 18 && U.chance(0.5)) G.say("You're in debt. Maybe cut back on spending or find a better job.", '📉', 'bad');
  };
  function repossess(L) {
    const sellable = L.assets.filter((a) => a.value > 0).sort((a, b) => b.value - a.value);
    const a = sellable[0];
    if (!a) return;
    G.sellAsset(a.id, true);
    G.say(`The bank took your ${a.name} to cover your debts.`, '🏦', 'bad');
  }

  // ---------------------------------------------------------------- buying & selling
  function bought(r, price) {
    r.d.unshift({ k: 'money', v: -price });
    G.say(r.text, r.emoji, r.tone, r.d);
    if (CL.meta) CL.meta.check();
    G.save();
    return r;
  }
  G.shopState = function (L, kind, it) {
    if (L.prison) return "You're in jail";
    if (kind === 'items') {
      if (L.age < (it.minAge || 0)) return `Age ${it.minAge}+`;
      if (L.assets.some((a) => a.cat === it.id && a.type === 'item')) return 'You own this';
    }
    if (kind === 'vehicles') {
      const bike = it.kind === 'bike' || it.kind === 'scooter';
      if (L.age < (bike ? 8 : 16)) return `Age ${bike ? 8 : 16}+`;
      if (!bike && !L.license) return "Needs a driver's license";
      if (L.assets.filter((a) => a.type === 'vehicle').length >= 10) return 'Your garage is full';
    }
    if (kind === 'houses') {
      if (L.age < 18) return 'Age 18+';
      if (L.assets.filter((a) => a.type === 'house').length >= 8) return 'You own plenty of homes';
    }
    return true;
  };
  G.mortgageOk = function (L, price) {
    const income = (L.job ? L.job.salary : 0) + (L.pension || 0);
    const pay = (price * 0.8 * 0.05) / (1 - Math.pow(1.05, -25));
    if (L.money < price * 0.2) return `Needs ${U.money(price * 0.2)} down`;
    if (pay > income * 0.45) return 'Your income is too low';
    return true;
  };
  G.buy = function (kind, id, pay) {
    const L = G.life;
    const list = cat()[kind] || [];
    const it = list.find((x) => x.id === id);
    if (!it) return G.fail('That is sold out.');
    const ok = G.shopState(L, kind, it);
    if (ok !== true) return G.fail(ok);
    if (kind === 'houses' && pay === 'mortgage') {
      const m = G.mortgageOk(L, it.price);
      if (m !== true) return G.fail(m);
      const down = Math.round(it.price * 0.2);
      L.money -= down;
      const a = { id: U.uid(), type: 'house', cat: it.id, name: it.name, emoji: it.emoji, value: it.price, price: it.price, bought: L.age };
      L.assets.push(a);
      const loan = G.addLoan('mortgage', `Mortgage: ${it.name}`, it.price - down, 0.05, 25);
      loan.assetId = a.id;
      return bought(houseBought(L, a, `You bought ${an(it.name)} with a ${U.money(down)} down payment and a mortgage!`), down);
    }
    if (L.money < it.price) return G.fail(`You need ${U.money(it.price)}.`);
    L.money -= it.price;
    if (kind === 'items') {
      G.addItem({ cat: it.id, name: it.name, emoji: it.emoji, value: Math.round(it.price * 0.4), kind: it.kind, unlocks: it.unlocks });
      return bought(G.res(it.emoji, `You bought ${an(it.name)}!${it.unlocks ? ' It will help your ' + ({ video: 'videos', coding: 'coding', music: 'music', art: 'art', sports: 'sports', cooking: 'cooking', writing: 'writing', acting: 'acting' }[it.unlocks] || it.unlocks) + '.' : ''}`, it.effects || {}), it.price);
    }
    if (kind === 'vehicles') {
      L.assets.push({ id: U.uid(), type: 'vehicle', cat: it.id, name: it.name, emoji: it.emoji, value: it.price, price: it.price, kind: it.kind, bought: L.age });
      return bought(G.res(it.emoji, `You bought ${an(it.name)}! ${it.style >= 8 ? 'Heads turn everywhere you go.' : 'Time for a ride!'}`, { joy: 4 + Math.round((it.style || 0) / 2), style: Math.round((it.style || 0) / 3) }), it.price);
    }
    const a = { id: U.uid(), type: 'house', cat: it.id, name: it.name, emoji: it.emoji, value: it.price, price: it.price, bought: L.age };
    L.assets.push(a);
    return bought(houseBought(L, a, `You bought ${an(it.name)} for ${U.money(it.price)} in cash!`), it.price);
  };
  function houseBought(L, a, text) {
    L.totals.houses++;
    let extra = '';
    if (L.home !== 'own') {
      L.home = 'own';
      L.homeId = a.id;
      extra = ' You moved right in.';
    } else extra = ' You can rent it out for extra income.';
    return G.res(a.emoji, text + extra, { joy: 10, style: 2 });
  }
  G.sellAsset = function (id, quiet) {
    const L = G.life;
    const a = L.assets.find((x) => x.id === id);
    if (!a) return null;
    let cash = a.stolen ? Math.round(a.value * 0.4) : a.value;
    const loan = L.loans.find((l) => l.assetId === a.id);
    if (loan) {
      cash -= loan.balance;
      L.loans = L.loans.filter((l) => l !== loan);
    }
    L.money += cash;
    L.assets = L.assets.filter((x) => x !== a);
    if (L.homeId === a.id) {
      const other = L.assets.find((x) => x.type === 'house');
      L.homeId = other ? other.id : null;
      L.home = other ? 'own' : L.age >= 18 ? 'rent' : 'parents';
    }
    if (quiet) return null;
    const r = { emoji: a.emoji, text: `You sold your ${a.name} for ${U.money(cash)}.`, tone: 'info', d: [{ k: 'money', v: cash }] };
    G.say(r.text, r.emoji, r.tone, r.d);
    G.save();
    return r;
  };
  G.moveInto = function (id) {
    const L = G.life;
    const a = L.assets.find((x) => x.id === id && x.type === 'house');
    if (!a) return null;
    L.home = 'own';
    L.homeId = a.id;
    const r = G.res(a.emoji, `You moved into your ${a.name}.`, { joy: 3 });
    G.say(r.text, r.emoji, r.tone, r.d);
    G.save();
    return r;
  };
  G.payLoan = function (id) {
    const L = G.life;
    const l = L.loans.find((x) => x.id === id);
    if (!l) return null;
    if (L.money < l.balance) return G.fail(`You need ${U.money(l.balance)} to pay it off.`);
    L.money -= l.balance;
    const r = { emoji: '🏦', text: `You paid off your ${l.label.toLowerCase()} (${U.money(l.balance)}). Debt-free feels great!`, tone: 'good', d: [{ k: 'money', v: -l.balance }] };
    L.loans = L.loans.filter((x) => x !== l);
    r.d.push(...G.fx({ joy: 5 }));
    G.say(r.text, r.emoji, r.tone, r.d);
    G.save();
    return r;
  };
})(globalThis.CL);
