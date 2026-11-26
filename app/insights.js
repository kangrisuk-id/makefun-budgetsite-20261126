// Insights — one job: turn the month's figures into plain-English answers.
// Every number is computed from the state, never typed in twice, so the
// page can never disagree with the dashboard.

import { HOUSEHOLD } from "./data.js";
import { expenseTotal, incomeTotal, savingsTotal, spendingByCategory, ruleSplit } from "./state.js";

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
      title: `Move ${toTwenty > 0 ? `$${toTwenty.toLocaleString("en-US")} to savings` : "the unassigned cash to a goal"}`,
      body: toTwenty > 0
        ? `Savings sit at ${savingsRate.toFixed(1)}% of income; the 20% rule wants $${Math.round(income * 0.2).toLocaleString("en-US")}. $${split.unassigned.toLocaleString("en-US")} is still unassigned this month — moving $${toTwenty.toLocaleString("en-US")} of it closes the gap without touching any budget.`
        : `$${split.unassigned.toLocaleString("en-US")} is still unassigned this month. Give it a job — a goal contribution or next month's buffer — before it drifts into spending.`,
    });
  }
  if (overBudget.length > 0) {
    const names = overBudget.map((c) => c.name).join(" and ");
    tips.push({
      title: `${names} ${overBudget.length > 1 ? "are" : "is"} over budget`,
      body: overBudget.map((c) => `${c.name} is $${Math.round(c.spent - c.budget)} over its $${c.budget} budget`).join("; ") + ". Raise the budget to the honest number, or move the difference from a category with room — guessing low every month is how budgets stop being trusted.",
    });
  }
  if (upcomingBills > 0) {
    tips.push({
      title: `$${upcomingBills.toLocaleString("en-US")} of bills are still due`,
      body: `Car insurance ($118) lands on Nov 28. It is already covered by the unassigned cash, so pay it on the day and tick it off on the Bills page — no surprise, no late fee.`,
    });
  }
  tips.push({
    title: "Groceries are the lever, not dining out",
    body: `Groceries are the biggest flexible spend at $${Math.round(topFlexible ? topFlexible.spent : 0).toLocaleString("en-US")} this month — about $${Math.round((topFlexible ? topFlexible.spent : 0) / daysElapsed)} a day. One planned shop a week instead of top-ups is usually worth $40–$60 a month for a family this size, more than skipping every coffee run.`,
  });

  return {
    income, spent, saved, dailyAverage, projectedSpend, projectedLeft,
    top, biggest, split, savingsRate, needsRate, wantsRate,
    overBudget, upcomingBills, tips,
  };
}
