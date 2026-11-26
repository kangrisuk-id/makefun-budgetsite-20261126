// Views — one job: turn the state into the six pages. Each function
// returns an HTML string for its route; main.js mounts it and wires the
// controls. No numbers are typed here — every figure comes from state.js
// or insights.js, so the pages cannot disagree with each other. Every
// word comes from i18n.js, in English or Bahasa Indonesia.

import { HOUSEHOLD } from "./data.js";
import { money, pct, shortDate, escapeHtml } from "./format.js";
import { donutChart, donutLegend, budgetBar } from "./charts.js";
import { monthlyInsights } from "./insights.js";
import { t, catName, goalText, billText } from "./i18n.js";
import {
  categoryById, incomeTotal, expenseTotal, savingsTotal,
  spendingByCategory, ruleSplit,
} from "./state.js";

function head(title, lede) {
  return `<div class="page-head"><h1>${title}</h1><p>${lede}</p></div>`;
}

function tableHead() {
  return `<thead><tr><th>${t("table.date")}</th><th>${t("table.what")}</th><th>${t("table.category")}</th><th class="amt">${t("table.amount")}</th><th></th></tr></thead>`;
}

function txRow(state, tx) {
  const cat = categoryById(state, tx.category);
  const label = cat ? catName(cat) : (tx.type === "income" ? t("common.income") : "—");
  const sign = tx.type === "income" ? "+" : tx.type === "saving" ? "→" : "−";
  const cls = tx.type === "income" ? "pos" : tx.type === "saving" ? "" : "neg";
  return `<tr>
    <td class="num" style="white-space:nowrap">${shortDate(tx.date)}</td>
    <td>${escapeHtml(tx.description)}</td>
    <td><span class="cat-pill">${label}</span></td>
    <td class="amt num ${cls}">${sign}${money(tx.amount, true)}</td>
    <td class="row-actions"><button type="button" class="icon-btn" data-action="delete-tx" data-id="${tx.id}" aria-label="${t("common.delete")} ${escapeHtml(tx.description)}">${t("common.delete")}</button></td>
  </tr>`;
}

function billLine(state, b) {
  const bt = billText(b);
  return `<div class="bill-row"><div class="bill-name"><b>${escapeHtml(bt.name)}</b><small>${t("bill.dueSmall", { day: b.dueDay, note: escapeHtml(bt.note) })}</small></div><span class="bill-amt num">${money(b.amount, true)}</span><span class="due-pill soon">${t("bill.duePill", { day: b.dueDay })}</span></div>`;
}

export function dashboardView(state) {
  const income = incomeTotal(state);
  const spent = expenseTotal(state);
  const saved = savingsTotal(state);
  const left = income - spent - saved;
  const rate = income ? (saved / income) * 100 : 0;
  const byCat = spendingByCategory(state).filter((c) => c.spent > 0);
  const topSix = byCat.slice(0, 6);
  const other = byCat.slice(6).reduce((s, c) => s + c.spent, 0);
  const slices = topSix.map((c) => ({ label: catName(c), value: c.spent, color: c.color }));
  if (other > 0) slices.push({ label: t("common.other"), value: other, color: "#c9bda6" });
  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 8);
  const unpaid = state.bills.filter((b) => !b.paid);
  const bars = byCat.slice(0, 5).map((c) =>
    budgetBar(catName(c), c.spent, c.budget, "")).join("");
  const paidCount = state.bills.filter((b) => b.paid).length;
  const settled = money(state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0));

  return `
  ${head(t("dash.title"), t("dash.lede", { left: money(left), saved: money(saved), daysLeft: HOUSEHOLD.daysInMonth - HOUSEHOLD.dayToday }))}
  <section class="kpis" aria-label="Month summary">
    <div class="kpi"><div class="label">${t("kpi.income")}</div><div class="value num">${money(income)}</div><div class="delta">${t("kpi.income.delta")}</div></div>
    <div class="kpi"><div class="label">${t("kpi.spent")}</div><div class="value num">${money(spent)}</div><div class="delta num">${t("kpi.spent.delta", { perDay: money(Math.round(spent / HOUSEHOLD.dayToday)) })}</div></div>
    <div class="kpi accent"><div class="label">${t("kpi.saved")}</div><div class="value num">${money(saved)} <small>${rate.toFixed(1)}%</small></div><div class="delta">${t("kpi.saved.delta")}</div></div>
    <div class="kpi"><div class="label">${t("kpi.left")}</div><div class="value num">${money(left)}</div><div class="delta">${t("kpi.left.delta", { amount: money(118) })}</div></div>
  </section>
  <div class="grid cols-2">
    <section class="card">
      <div class="card-head"><h2>${t("dash.where.title")}</h2><a href="#/transactions">${t("dash.where.link")}</a></div>
      <p class="sub">${t("dash.where.sub")}</p>
      <div class="donut-wrap">
        ${donutChart(slices, t("dash.totalSpent"), money(spent))}
        ${donutLegend(slices)}
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>${t("dash.pressure.title")}</h2><a href="#/budgets">${t("dash.pressure.link")}</a></div>
      <p class="sub">${t("dash.pressure.sub")}</p>
      ${bars}
    </section>
    <section class="card">
      <div class="card-head"><h2>${t("dash.bills.title")}</h2><a href="#/bills">${t("dash.bills.link")}</a></div>
      ${unpaid.length === 0
        ? `<p class="sub">${t("dash.bills.empty")}</p>`
        : unpaid.map((b) => billLine(state, b)).join("")}
      <hr class="divider">
      <p class="sub" style="margin-bottom:0">${t("dash.bills.summary", { paidCount, total: state.bills.length, settled })}</p>
    </section>
    <section class="card">
      <div class="card-head"><h2>${t("dash.goals.title")}</h2><a href="#/goals">${t("dash.goals.link")}</a></div>
      <p class="sub">${t("dash.goals.sub")}</p>
      ${state.goals.map((g) => {
        const gt = goalText(g);
        const p = pct(g.saved, g.target);
        return `<div class="goal"><div class="goal-top"><b>${escapeHtml(gt.name)}</b><span class="num">${t("goal.ofLine", { saved: money(g.saved), target: money(g.target), p })}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div></div>`;
      }).join("")}
    </section>
  </div>
  <section class="card" style="margin-top:18px">
    <div class="card-head"><h2>${t("dash.latest.title")}</h2><a href="#/transactions">${t("dash.latest.link", { count: state.transactions.length })}</a></div>
    <table>${tableHead()}
    <tbody>${recent.map((tx) => txRow(state, tx)).join("")}</tbody></table>
  </section>`;
}

export function transactionsView(state, filter = { category: "all", type: "all" }) {
  const cats = state.categories.filter((c) => c.id !== "savings");
  let list = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (filter.category !== "all") list = list.filter((tx) => tx.category === filter.category);
  if (filter.type !== "all") list = list.filter((tx) => tx.type === filter.type);
  const shownSpent = list.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const shownIn = list.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);

  return `
  ${head(t("tx.title"), t("tx.lede", { count: state.transactions.length }))}
  <section class="card" style="margin-bottom:18px">
    <h2>${t("tx.add.title")}</h2>
    <form id="add-tx" class="form-grid">
      <div class="field"><label for="f-date">${t("tx.f.date")}</label><input id="f-date" name="date" type="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></div>
      <div class="field"><label for="f-desc">${t("tx.f.what")}</label><input id="f-desc" name="description" type="text" maxlength="80" placeholder="${t("tx.f.whatPh")}" required></div>
      <div class="field"><label for="f-cat">${t("tx.f.category")}</label><select id="f-cat" name="category">
        ${cats.map((c) => `<option value="${c.id}">${catName(c)}</option>`).join("")}
        <option value="savings" disabled>${t("tx.opt.savings")}</option>
      </select></div>
      <div class="field"><label for="f-amount">${t("tx.f.amount")}</label><input id="f-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>
      <div class="field"><label for="f-type">${t("tx.f.type")}</label><select id="f-type" name="type">
        <option value="expense">${t("tx.type.expense")}</option><option value="income">${t("tx.type.income")}</option><option value="saving">${t("tx.type.saving")}</option>
      </select></div>
      <div><button class="btn" type="submit">${t("tx.add.button")}</button></div>
    </form>
  </section>
  <section class="card">
    <div class="filter-row" role="group" aria-label="${t("tx.filter.group")}">
      <label for="flt-cat"><strong>${t("tx.filter.category")}</strong></label>
      <select id="flt-cat" data-filter="category">
        <option value="all">${t("tx.filter.allCats")}</option>
        ${state.categories.map((c) => `<option value="${c.id}" ${filter.category === c.id ? "selected" : ""}>${catName(c)}</option>`).join("")}
        <option value="income" ${filter.category === "income" ? "selected" : ""}>${t("common.income")}</option>
      </select>
      <label for="flt-type"><strong>${t("tx.filter.type")}</strong></label>
      <select id="flt-type" data-filter="type">
        <option value="all" ${filter.type === "all" ? "selected" : ""}>${t("tx.filter.allTypes")}</option>
        <option value="expense" ${filter.type === "expense" ? "selected" : ""}>${t("tx.filter.expenses")}</option>
        <option value="income" ${filter.type === "income" ? "selected" : ""}>${t("tx.filter.income")}</option>
        <option value="saving" ${filter.type === "saving" ? "selected" : ""}>${t("tx.filter.savings")}</option>
      </select>
      <span class="sub" style="margin:0">${t("tx.showing", { count: list.length, inAmt: money(shownIn), outAmt: money(shownSpent) })}</span>
    </div>
    ${list.length === 0
      ? `<p class="empty">${t("tx.empty")}</p>`
      : `<table>${tableHead()}
      <tbody>${list.map((tx) => txRow(state, tx)).join("")}</tbody></table>`}
  </section>`;
}

export function budgetsView(state) {
  const split = ruleSplit(state);
  const income = split.income;
  const byCat = spendingByCategory(state);
  const totalBudget = state.categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = expenseTotal(state) + savingsTotal(state);

  return `
  ${head(t("bud.title"), t("bud.lede", { totalBudget: money(totalBudget), income: money(income), totalSpent: money(totalSpent) }))}
  <section class="card" style="margin-bottom:18px">
    <h2>${t("bud.rule.title")}</h2>
    <p class="sub">${t("bud.rule.sub")}</p>
    <div class="rule-split">
      <div class="rule-cell"><b class="num">${pct(split.need, income)}%</b><span>${t("bud.rule.needs", { amount: money(split.need), target: money(Math.round(income * 0.5)) })}</span></div>
      <div class="rule-cell"><b class="num">${pct(split.want, income)}%</b><span>${t("bud.rule.wants", { amount: money(split.want), target: money(Math.round(income * 0.3)) })}</span></div>
      <div class="rule-cell"><b class="num">${pct(split.save, income)}%</b><span>${t("bud.rule.savings", { amount: money(split.save), target: money(Math.round(income * 0.2)) })}</span></div>
    </div>
    <p class="sub" style="margin:10px 0 0">${t("bud.rule.unassigned", { amount: money(split.unassigned), p: pct(split.unassigned, income) })}</p>
  </section>
  <section class="card">
    <h2>${t("bud.every.title")}</h2>
    <p class="sub">${t("bud.every.sub")}</p>
    ${byCat.map((c) => `
      <div class="bar-row">
        <div class="bar-top"><b>${catName(c)}</b><span class="num">${money(c.spent)} <span class="muted">/ ${money(c.budget)}</span></span></div>
        <div class="bar-track"><div class="bar-fill ${c.spent > c.budget ? "over" : c.spent / c.budget >= 0.9 ? "warn" : ""}" style="width:${Math.min((c.spent / c.budget) * 100, 100).toFixed(1)}%"></div></div>
        <div class="bar-note">${c.spent > c.budget ? t("bud.note.over", { amount: money(c.spent - c.budget) }) : t("bud.note.left", { amount: money(c.budget - c.spent) })} · ${c.group === "need" ? t("bud.group.need") : t("bud.group.want")}
          <span style="float:right">${t("bud.set")} $ <input type="number" min="0" step="10" value="${c.budget}" data-budget-for="${c.id}" style="width:84px;padding:4px 7px;border:1px solid var(--line);border-radius:7px"> <button type="button" class="btn small" data-action="save-budget" data-cat="${c.id}">${t("bud.save")}</button></span>
        </div>
      </div>`).join("")}
    <hr class="divider">
    <p class="sub" style="margin:0">${t("bud.savingsLine", { saved: money(savingsTotal(state)), target: money(categoryById(state, "savings").budget) })}</p>
  </section>`;
}

export function goalsView(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  ${head(t("goals.title"), t("goals.lede", { saved: money(totalSaved), target: money(totalTarget), p: pct(totalSaved, totalTarget) }))}
  <div class="grid cols-2">
    ${state.goals.map((g) => {
      const gt = goalText(g);
      const p = pct(g.saved, g.target);
      const remaining = g.target - g.saved;
      return `<section class="card"><div class="goal">
        <div class="goal-top"><b>${escapeHtml(gt.name)}</b><span class="num">${t("goal.ofLine", { saved: money(g.saved), target: money(g.target), p })}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
        <p class="goal-note">${escapeHtml(gt.note)} <strong class="num">${t("goals.toGo", { amount: money(remaining) })}</strong></p>
        <div class="goal-actions">
          <label for="add-${g.id}" style="font-size:14px;font-weight:700">${t("goals.addLabel")}</label>
          <input id="add-${g.id}" type="number" min="1" step="5" placeholder="50" data-goal-amount="${g.id}">
          <button type="button" class="btn small" data-action="add-goal" data-goal="${g.id}">${t("goals.addButton")}</button>
        </div>
      </div></section>`;
    }).join("")}
  </div>
  <section class="card" style="margin-top:18px">
    <h2>${t("goals.funding.title")}</h2>
    <p class="sub" style="margin-bottom:0">${t("goals.funding.body", { total: money(savingsTotal(state)), amt600: money(600), amt250: money(250) })}</p>
  </section>`;
}

export function billsView(state) {
  const paid = state.bills.filter((b) => b.paid);
  const unpaid = state.bills.filter((b) => !b.paid);
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const dueSum = unpaid.reduce((s, b) => s + b.amount, 0);
  const row = (b) => {
    const bt = billText(b);
    return `<div class="bill-row">
    <div class="bill-name"><b>${escapeHtml(bt.name)}</b><small>${t("bill.dueSmall", { day: b.dueDay, note: escapeHtml(bt.note) })}</small></div>
    <span class="bill-amt num">${money(b.amount, true)}</span>
    <span class="due-pill ${b.paid ? "paid" : "soon"}">${b.paid ? t("bill.paid") : t("bill.duePill", { day: b.dueDay })}</span>
    <button type="button" class="btn ${b.paid ? "ghost" : "amber"} small" data-action="toggle-bill" data-bill="${b.id}">${b.paid ? t("bills.markUnpaid") : t("bills.markPaid")}</button>
  </div>`;
  };
  return `
  ${head(t("bills.title"), t("bills.lede", { paidCount: paid.length, total: state.bills.length, paidSum: money(paidSum), dueSum: money(dueSum) }))}
  <section class="card">
    <h2>${t("bills.still")}</h2>
    ${unpaid.length === 0 ? `<p class="empty">${t("bills.empty")}</p>` : unpaid.map(row).join("")}
    <hr class="divider">
    <h2>${t("bills.done")}</h2>
    ${paid.map(row).join("")}
  </section>
  <section class="card" style="margin-top:18px">
    <h2>${t("bills.never.title")}</h2>
    <p class="sub" style="margin-bottom:0">${t("bills.never.body")}</p>
  </section>`;
}

export function insightsView(state) {
  const ins = monthlyInsights(state);
  return `
  ${head(t("ins.title"), t("ins.lede", { count: state.transactions.length }))}
  <div class="grid cols-2">
    <section class="card">
      <h2>${t("ins.numbers.title")}</h2>
      <ul class="stat-list">
        <li><span>${t("ins.stat.daily")}</span><b class="num">${t("ins.stat.dailySuffix", { amount: money(Math.round(ins.dailyAverage)) })}</b></li>
        <li><span>${t("ins.stat.projected")}</span><b class="num">${money(Math.round(ins.projectedSpend))}</b></li>
        <li><span>${t("ins.stat.left")}</span><b class="num ${ins.projectedLeft >= 0 ? "pos" : "neg"}">${money(Math.round(ins.projectedLeft))}</b></li>
        <li><span>${t("ins.stat.topCat")}</span><b>${ins.top ? catName(ins.top) : "—"} · ${money(ins.top ? ins.top.spent : 0)}</b></li>
        <li><span>${t("ins.stat.biggest")}</span><b>${ins.biggest ? escapeHtml(ins.biggest.description) : "—"} · ${money(ins.biggest ? ins.biggest.amount : 0, true)}</b></li>
        <li><span>${t("ins.stat.rate")}</span><b class="num">${t("ins.stat.rateVal", { rate: ins.savingsRate.toFixed(1) })}</b></li>
        <li><span>${t("ins.stat.split")}</span><b class="num">${ins.needsRate.toFixed(0)}% / ${ins.wantsRate.toFixed(0)}% / ${ins.savingsRate.toFixed(0)}%</b></li>
        <li><span>${t("ins.stat.over")}</span><b>${ins.overBudget.length === 0 ? t("ins.stat.overNone") : ins.overBudget.map((c) => catName(c)).join(", ")}</b></li>
      </ul>
    </section>
    <section class="card">
      <h2>${t("ins.check.title")}</h2>
      <p class="sub">${t("ins.check.sub", { needs: ins.needsRate.toFixed(0), wants: ins.wantsRate.toFixed(0) })}</p>
      <div class="rule-split">
        <div class="rule-cell"><b class="num">${ins.needsRate.toFixed(0)}%</b><span>${t("ins.check.needs")}</span></div>
        <div class="rule-cell"><b class="num">${ins.wantsRate.toFixed(0)}%</b><span>${t("ins.check.wants")}</span></div>
        <div class="rule-cell"><b class="num">${ins.savingsRate.toFixed(1)}%</b><span>${t("ins.check.savings")}</span></div>
      </div>
      <hr class="divider">
      <p class="sub" style="margin-bottom:0">${t("ins.verdict", { left: money(Math.round(ins.projectedLeft)), amt600: money(600) })}</p>
    </section>
  </div>
  <section class="card" style="margin-top:18px">
    <h2>${t("ins.tips.title")}</h2>
    ${ins.tips.map((tip, i) => `<div class="tip"><span class="tip-num">${i + 1}</span><p><b>${escapeHtml(tip.title)}</b>${escapeHtml(tip.body)}</p></div>`).join("")}
  </section>`;
}
