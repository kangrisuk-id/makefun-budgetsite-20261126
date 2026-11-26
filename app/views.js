// Views — one job: turn the state into the six pages. Each function
// returns an HTML string for its route; main.js mounts it and wires the
// controls. No numbers are typed here — every figure comes from state.js
// or insights.js, so the pages cannot disagree with each other.

import { HOUSEHOLD } from "./data.js";
import { money, pct, shortDate, escapeHtml } from "./format.js";
import { donutChart, donutLegend, budgetBar } from "./charts.js";
import { monthlyInsights } from "./insights.js";
import {
  categoryById, incomeTotal, expenseTotal, savingsTotal,
  spendingByCategory, ruleSplit,
} from "./state.js";

function head(title, lede) {
  return `<div class="page-head"><h1>${title}</h1><p>${lede}</p></div>`;
}

function txRow(state, t) {
  const cat = categoryById(state, t.category);
  const label = cat ? cat.name : (t.type === "income" ? "Income" : "—");
  const sign = t.type === "income" ? "+" : t.type === "saving" ? "→" : "−";
  const cls = t.type === "income" ? "pos" : t.type === "saving" ? "" : "neg";
  return `<tr>
    <td class="num" style="white-space:nowrap">${shortDate(t.date)}</td>
    <td>${escapeHtml(t.description)}</td>
    <td><span class="cat-pill">${label}</span></td>
    <td class="amt num ${cls}">${sign}${money(t.amount, true)}</td>
    <td class="row-actions"><button type="button" class="icon-btn" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${escapeHtml(t.description)}">Delete</button></td>
  </tr>`;
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
  const slices = topSix.map((c) => ({ label: c.name, value: c.spent, color: c.color }));
  if (other > 0) slices.push({ label: "Other", value: other, color: "#c9bda6" });
  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 8);
  const unpaid = state.bills.filter((b) => !b.paid);
  const bars = byCat.slice(0, 5).map((c) =>
    budgetBar(c.name, c.spent, c.budget, "")).join("");

  return `
  ${head("November, at a glance", `The Alvarez family has <span class="lede-figure num"><strong>${money(left)}</strong> left to budget</span> with ${HOUSEHOLD.daysInMonth - HOUSEHOLD.dayToday} days to go. Income is in, ${money(saved)} is already saved, and every figure below is live — add a transaction and watch it move.`)}
  <section class="kpis" aria-label="Month summary">
    <div class="kpi"><div class="label">Income in</div><div class="value num">${money(income)}</div><div class="delta">2 paydays · Nov 1</div></div>
    <div class="kpi"><div class="label">Spent so far</div><div class="value num">${money(spent)}</div><div class="delta num">≈ ${money(Math.round(spent / HOUSEHOLD.dayToday))} a day · 26 days</div></div>
    <div class="kpi accent"><div class="label">Saved</div><div class="value num">${money(saved)} <small>${rate.toFixed(1)}%</small></div><div class="delta">of income · 20% is the goal</div></div>
    <div class="kpi"><div class="label">Left to budget</div><div class="value num">${money(left)}</div><div class="delta">car insurance $118 still due Nov 28</div></div>
  </section>
  <div class="grid cols-2">
    <section class="card">
      <div class="card-head"><h2>Where the money went</h2><a href="#/transactions">All transactions →</a></div>
      <p class="sub">Spending by category, Nov 1–26. Rent is the anchor; groceries are the biggest flexible spend.</p>
      <div class="donut-wrap">
        ${donutChart(slices, "Total spent", money(spent))}
        ${donutLegend(slices)}
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Budgets under pressure</h2><a href="#/budgets">All budgets →</a></div>
      <p class="sub">The five biggest spends against their budgets. Amber means nearly spent; red means over.</p>
      ${bars}
    </section>
    <section class="card">
      <div class="card-head"><h2>Bills still to pay</h2><a href="#/bills">All bills →</a></div>
      ${unpaid.length === 0
        ? `<p class="sub">Nothing outstanding — every November bill is paid.</p>`
        : unpaid.map((b) => `<div class="bill-row"><div class="bill-name"><b>${escapeHtml(b.name)}</b><small>Due Nov ${b.dueDay} · ${escapeHtml(b.note)}</small></div><span class="bill-amt num">${money(b.amount, true)}</span><span class="due-pill soon">Due Nov ${b.dueDay}</span></div>`).join("")}
      <hr class="divider">
      <p class="sub" style="margin-bottom:0">${state.bills.filter((b) => b.paid).length} of ${state.bills.length} November bills paid · ${money(state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0))} settled.</p>
    </section>
    <section class="card">
      <div class="card-head"><h2>Savings goals</h2><a href="#/goals">All goals →</a></div>
      <p class="sub">Four goals, one household. The emergency fund is the priority; the holiday is the reward.</p>
      ${state.goals.map((g) => {
        const p = pct(g.saved, g.target);
        return `<div class="goal"><div class="goal-top"><b>${escapeHtml(g.name)}</b><span class="num">${money(g.saved)} of ${money(g.target)} · ${p}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div></div>`;
      }).join("")}
    </section>
  </div>
  <section class="card" style="margin-top:18px">
    <div class="card-head"><h2>Latest activity</h2><a href="#/transactions">See all ${state.transactions.length} →</a></div>
    <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="amt">Amount</th><th></th></tr></thead>
    <tbody>${recent.map((t) => txRow(state, t)).join("")}</tbody></table>
  </section>`;
}

export function transactionsView(state, filter = { category: "all", type: "all" }) {
  const cats = state.categories.filter((c) => c.id !== "savings");
  let list = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (filter.category !== "all") list = list.filter((t) => t.category === filter.category);
  if (filter.type !== "all") list = list.filter((t) => t.type === filter.type);
  const shownSpent = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const shownIn = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  return `
  ${head("Transactions", `Every dollar in and out, Nov 1–26. <strong>${state.transactions.length} entries</strong> — add one below and the dashboard, budgets and insights update at once.`)}
  <section class="card" style="margin-bottom:18px">
    <h2>Add a transaction</h2>
    <form id="add-tx" class="form-grid">
      <div class="field"><label for="f-date">Date</label><input id="f-date" name="date" type="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></div>
      <div class="field"><label for="f-desc">What was it?</label><input id="f-desc" name="description" type="text" maxlength="80" placeholder="e.g. Weekly grocery run" required></div>
      <div class="field"><label for="f-cat">Category</label><select id="f-cat" name="category">
        ${cats.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
        <option value="savings" disabled>Savings (transfer)</option>
      </select></div>
      <div class="field"><label for="f-amount">Amount ($)</label><input id="f-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>
      <div class="field"><label for="f-type">Type</label><select id="f-type" name="type">
        <option value="expense">Expense</option><option value="income">Income</option><option value="saving">Savings transfer</option>
      </select></div>
      <div><button class="btn" type="submit">Add transaction</button></div>
    </form>
  </section>
  <section class="card">
    <div class="filter-row" role="group" aria-label="Filter transactions">
      <label for="flt-cat"><strong>Category</strong></label>
      <select id="flt-cat" data-filter="category">
        <option value="all">All categories</option>
        ${state.categories.map((c) => `<option value="${c.id}" ${filter.category === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
        <option value="income" ${filter.category === "income" ? "selected" : ""}>Income</option>
      </select>
      <label for="flt-type"><strong>Type</strong></label>
      <select id="flt-type" data-filter="type">
        <option value="all" ${filter.type === "all" ? "selected" : ""}>All types</option>
        <option value="expense" ${filter.type === "expense" ? "selected" : ""}>Expenses</option>
        <option value="income" ${filter.type === "income" ? "selected" : ""}>Income</option>
        <option value="saving" ${filter.type === "saving" ? "selected" : ""}>Savings transfers</option>
      </select>
      <span class="sub" style="margin:0">Showing <strong>${list.length}</strong> · in <strong class="num pos">${money(shownIn)}</strong> · out <strong class="num neg">${money(shownSpent)}</strong></span>
    </div>
    ${list.length === 0
      ? `<p class="empty">Nothing matches this filter. Try another category or type.</p>`
      : `<table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="amt">Amount</th><th></th></tr></thead>
      <tbody>${list.map((t) => txRow(state, t)).join("")}</tbody></table>`}
  </section>`;
}

export function budgetsView(state) {
  const split = ruleSplit(state);
  const income = split.income;
  const byCat = spendingByCategory(state);
  const totalBudget = state.categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = expenseTotal(state) + savingsTotal(state);

  return `
  ${head("Budgets", `November's plan totals <strong class="num">${money(totalBudget)}</strong> against <strong class="num">${money(income)}</strong> of income. ${money(totalSpent)} is spent or saved so far — the bars below are live, and you can change any budget in place.`)}
  <section class="card" style="margin-bottom:18px">
    <h2>The 50 / 30 / 20 rule</h2>
    <p class="sub">A classic household split: 50% needs, 30% wants, 20% savings. Here's where November actually lands — needs run a little hot, wants are well under, and the unassigned cash is the lever.</p>
    <div class="rule-split">
      <div class="rule-cell"><b class="num">${pct(split.need, income)}%</b><span>Needs · ${money(split.need)} of ${money(Math.round(income * 0.5))} target</span></div>
      <div class="rule-cell"><b class="num">${pct(split.want, income)}%</b><span>Wants · ${money(split.want)} of ${money(Math.round(income * 0.3))} target</span></div>
      <div class="rule-cell"><b class="num">${pct(split.save, income)}%</b><span>Savings · ${money(split.save)} of ${money(Math.round(income * 0.2))} target</span></div>
    </div>
    <p class="sub" style="margin:10px 0 0">${money(split.unassigned)} ( ${pct(split.unassigned, income)}% ) is still unassigned — see the <a href="#/insights">Insights</a> page for what to do with it.</p>
  </section>
  <section class="card">
    <h2>Every category</h2>
    <p class="sub">Change a budget and it saves immediately. Amber means nearly spent; red means over.</p>
    ${byCat.map((c) => `
      <div class="bar-row">
        <div class="bar-top"><b>${c.name}</b><span class="num">${money(c.spent)} <span style="color:#8a978d">/ ${money(c.budget)}</span></span></div>
        <div class="bar-track"><div class="bar-fill ${c.spent > c.budget ? "over" : c.spent / c.budget >= 0.9 ? "warn" : ""}" style="width:${Math.min((c.spent / c.budget) * 100, 100).toFixed(1)}%"></div></div>
        <div class="bar-note">${c.spent > c.budget ? `${money(c.spent - c.budget)} over budget` : `${money(c.budget - c.spent)} left`} · ${c.group === "need" ? "Need" : "Want"}
          <span style="float:right">Set budget: $ <input type="number" min="0" step="10" value="${c.budget}" data-budget-for="${c.id}" style="width:84px;padding:4px 7px;border:1px solid #cfc4ab;border-radius:7px"> <button type="button" class="btn small" data-action="save-budget" data-cat="${c.id}">Save</button></span>
        </div>
      </div>`).join("")}
    <hr class="divider">
    <p class="sub" style="margin:0">Savings target: <strong class="num">${money(savingsTotal(state))} of ${money(categoryById(state, "savings").budget)}</strong> transferred this month — edit it on the <a href="#/goals">Goals</a> page by adding to a goal.</p>
  </section>`;
}

export function goalsView(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  ${head("Savings goals", `<strong class="num">${money(totalSaved)}</strong> saved toward <strong class="num">${money(totalTarget)}</strong> of goals (${pct(totalSaved, totalTarget)}%). Add money to any goal — the total and the dashboard move with it.`)}
  <div class="grid cols-2">
    ${state.goals.map((g) => {
      const p = pct(g.saved, g.target);
      const remaining = g.target - g.saved;
      return `<section class="card"><div class="goal">
        <div class="goal-top"><b>${escapeHtml(g.name)}</b><span class="num">${money(g.saved)} of ${money(g.target)} · ${p}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
        <p class="goal-note">${escapeHtml(g.note)} <strong class="num">${money(remaining)} to go.</strong></p>
        <div class="goal-actions">
          <label for="add-${g.id}" style="font-size:14px;font-weight:700">Add $</label>
          <input id="add-${g.id}" type="number" min="1" step="5" placeholder="50" data-goal-amount="${g.id}">
          <button type="button" class="btn small" data-action="add-goal" data-goal="${g.id}">Add to goal</button>
        </div>
      </div></section>`;
    }).join("")}
  </div>
  <section class="card" style="margin-top:18px">
    <h2>How the goals are funded</h2>
    <p class="sub" style="margin-bottom:0">The balances are cumulative — they hold savings from earlier months as well as November's. November's transfers — ${money(savingsTotal(state))} in total — come straight from payday: $600 to the emergency fund and $250 to the holiday fund on Nov 1, then $250 to the car fund on Nov 15. The habit is automatic; the goals page is where you watch it land. See the transfers on the <a href="#/transactions">Transactions</a> page.</p>
  </section>`;
}

export function billsView(state) {
  const paid = state.bills.filter((b) => b.paid);
  const unpaid = state.bills.filter((b) => !b.paid);
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const dueSum = unpaid.reduce((s, b) => s + b.amount, 0);
  const row = (b) => `<div class="bill-row">
    <div class="bill-name"><b>${escapeHtml(b.name)}</b><small>Due Nov ${b.dueDay} · ${escapeHtml(b.note)}</small></div>
    <span class="bill-amt num">${money(b.amount, true)}</span>
    <span class="due-pill ${b.paid ? "paid" : "soon"}">${b.paid ? "Paid" : `Due Nov ${b.dueDay}`}</span>
    <button type="button" class="btn ${b.paid ? "ghost" : "amber"} small" data-action="toggle-bill" data-bill="${b.id}">${b.paid ? "Mark unpaid" : "Mark paid"}</button>
  </div>`;
  return `
  ${head("Bills", `<strong>${paid.length} of ${state.bills.length} bills paid</strong> — ${money(paidSum)} settled, <strong class="num">${money(dueSum)} still due</strong> before the month ends. Tap any bill to mark it paid; the dashboard total follows.`)}
  <section class="card">
    <h2>Still to pay</h2>
    ${unpaid.length === 0 ? `<p class="empty">Nothing due — every November bill is paid.</p>` : unpaid.map(row).join("")}
    <hr class="divider">
    <h2>Already paid</h2>
    ${paid.map(row).join("")}
  </section>
  <section class="card" style="margin-top:18px">
    <h2>Never miss one again</h2>
    <p class="sub" style="margin-bottom:0">Five of these bills pay themselves — four by auto-debit and one by card on file. The three that need a tap — electric, water and car insurance — are the ones this page exists for: check it on the 1st and the 15th, and the month has no surprises.</p>
  </section>`;
}

export function insightsView(state) {
  const ins = monthlyInsights(state);
  return `
  ${head("Insights", `What November's numbers actually mean — computed from the same ${state.transactions.length} transactions as every other page, in plain English, with one thing to do about each.`)}
  <div class="grid cols-2">
    <section class="card">
      <h2>November by the numbers</h2>
      <ul class="stat-list">
        <li><span>Average daily spending</span><b class="num">${money(Math.round(ins.dailyAverage))} / day</b></li>
        <li><span>Projected spending, full month</span><b class="num">${money(Math.round(ins.projectedSpend))}</b></li>
        <li><span>Projected cash left on Nov 30</span><b class="num ${ins.projectedLeft >= 0 ? "pos" : "neg"}">${money(Math.round(ins.projectedLeft))}</b></li>
        <li><span>Biggest category</span><b>${ins.top ? ins.top.name : "—"} · ${money(ins.top ? ins.top.spent : 0)}</b></li>
        <li><span>Biggest single expense</span><b>${ins.biggest ? escapeHtml(ins.biggest.description) : "—"} · ${money(ins.biggest ? ins.biggest.amount : 0, true)}</b></li>
        <li><span>Savings rate</span><b class="num">${ins.savingsRate.toFixed(1)}% of income (goal 20%)</b></li>
        <li><span>Needs / wants / savings</span><b class="num">${ins.needsRate.toFixed(0)}% / ${ins.wantsRate.toFixed(0)}% / ${ins.savingsRate.toFixed(0)}%</b></li>
        <li><span>Categories over budget</span><b>${ins.overBudget.length === 0 ? "None — every budget holds" : ins.overBudget.map((c) => c.name).join(", ")}</b></li>
      </ul>
    </section>
    <section class="card">
      <h2>The 50 / 30 / 20 check</h2>
      <p class="sub">Needs are at ${ins.needsRate.toFixed(0)}% (target 50%) — rent does the damage, and rent is not negotiable this month. Wants are only ${ins.wantsRate.toFixed(0)}% (target 30%), which is the room that makes the plan work.</p>
      <div class="rule-split">
        <div class="rule-cell"><b class="num">${ins.needsRate.toFixed(0)}%</b><span>Needs · target 50%</span></div>
        <div class="rule-cell"><b class="num">${ins.wantsRate.toFixed(0)}%</b><span>Wants · target 30%</span></div>
        <div class="rule-cell"><b class="num">${ins.savingsRate.toFixed(1)}%</b><span>Savings · target 20%</span></div>
      </div>
      <hr class="divider">
      <p class="sub" style="margin-bottom:0">The verdict: at the current pace the household finishes November with about ${money(Math.round(ins.projectedLeft))} unspent after savings — the emergency fund's next $600, already earned.</p>
    </section>
  </div>
  <section class="card" style="margin-top:18px">
    <h2>Three things to do this week</h2>
    ${ins.tips.map((tip, i) => `<div class="tip"><span class="tip-num">${i + 1}</span><p><b>${escapeHtml(tip.title)}</b>${escapeHtml(tip.body)}</p></div>`).join("")}
  </section>`;
}
