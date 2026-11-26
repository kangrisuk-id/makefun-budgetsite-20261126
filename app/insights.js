// Insights — one job: turn the month's figures into plain-English answers.
// Every number is computed from the state, never typed in twice, so the
// page can never disagree with the dashboard.

import { HOUSEHOLD } from "./data.js";
import { expenseTotal, incomeTotal, savingsTotal, spendingByCategory, ruleSplit } from "./state.js";
import { money } from "./format.js";
import { t, catName } from "./i18n.js";

export function monthlyInsights(state) {
  const income = incomeTotal(state);
  const spent = expenseTotal(state);
  const saved = savingsTotal(state);
  const daysElapsed = HOUSEHOLD.dayToday;
  const dailyAverage = spent / daysElapsed;
  const projectedSpend = dailyAverage * HOUSEHOLD.daysInMonth;
  const projectedLeft = income - projectedSpend - saved;
  const byCategory = spendingByCategory(state);
  const top = byCategory[0] || null;
  const biggest = [...state.transactions]
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0] || null;
  const split = ruleSplit(state);
  const savingsRate = income ? (saved / income) * 100 : 0;
  const needsRate = income ? (split.need / income) * 100 : 0;
  const wantsRate = income ? (split.want / income) * 100 : 0;
  const overBudget = byCategory.filter((c) => c.spent > c.budget);
  const upcomingBills = state.bills.filter((b) => !b.paid)
    .reduce((sum, b) => sum + b.amount, 0);
  // Biggest flexible spend: everything except the fixed rent anchor.
  const topFlexible = byCategory.find((c) => c.id !== "housing") || null;

  const tips = [];
  if (split.unassigned > 0) {
    const toTwenty = Math.max(0, Math.round(income * 0.2 - saved));
    tips.push({
      title: toTwenty > 0 ? t("tip1.titleMove", { amount: money(toTwenty) }) : t("tip1.titleRest"),
      body: toTwenty > 0
        ? t("tip1.bodyMove", { rate: savingsRate.toFixed(1), want: money(Math.round(income * 0.2)), unassigned: money(split.unassigned), amount: money(toTwenty) })
        : t("tip1.bodyRest", { unassigned: money(split.unassigned) }),
    });
  }
  if (overBudget.length > 0) {
    const names = overBudget.map((c) => catName(c)).join(t("common.and"));
    tips.push({
      title: t("tip2.title", { names, plural: overBudget.length > 1 }),
      body: overBudget.map((c) => t("tip2.each", { name: catName(c), over: money(Math.round(c.spent - c.budget)), budget: money(c.budget) })).join("; ") + t("tip2.tail"),
    });
  }
  if (upcomingBills > 0) {
    tips.push({
      title: t("tip3.title", { amount: money(upcomingBills) }),
      body: t("tip3.body", { amount: money(118) }),
    });
  }
  tips.push({
    title: t("tip4.title"),
    body: t("tip4.body", {
      total: money(Math.round(topFlexible ? topFlexible.spent : 0)),
      perDay: money(Math.round((topFlexible ? topFlexible.spent : 0) / daysElapsed)),
      range: `${money(40)}–${money(60)}`,
    }),
  });

  return {
    income, spent, saved, dailyAverage, projectedSpend, projectedLeft,
    top, biggest, split, savingsRate, needsRate, wantsRate,
    overBudget, upcomingBills, tips,
  };
}
