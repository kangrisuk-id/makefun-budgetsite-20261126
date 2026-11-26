// State — one job: hold the household's figures, persist edits in this
// browser only (localStorage, never a server), and answer the "how much"
// questions every page asks. The seed in data.js is the starting point;
// a reset restores it exactly.

import { CATEGORIES, TRANSACTIONS, GOALS, BILLS, HOUSEHOLD } from "./data.js";

const KEY = "hearthledger-nov2026-v1";

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

export function seedState() {
  return {
    categories: deepCopy(CATEGORIES),
    transactions: deepCopy(TRANSACTIONS),
    goals: deepCopy(GOALS),
    bills: deepCopy(BILLS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or full storage: the page still works for the session.
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  return seedState();
}

export function categoryById(state, id) {
  return state.categories.find((c) => c.id === id) || null;
}

export function incomeTotal(state) {
  return state.transactions.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function expenseTotal(state) {
  return state.transactions.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function savingsTotal(state) {
  return state.transactions.filter((t) => t.type === "saving")
    .reduce((sum, t) => sum + t.amount, 0);
}

// Spending per category (expenses only), richest first.
export function spendingByCategory(state) {
  const byId = new Map();
  for (const t of state.transactions) {
    if (t.type !== "expense") continue;
    byId.set(t.category, (byId.get(t.category) || 0) + t.amount);
  }
  return state.categories
    .filter((c) => c.id !== "savings")
    .map((c) => ({ ...c, spent: byId.get(c.id) || 0 }))
    .sort((a, b) => b.spent - a.spent);
}

// 50/30/20 split of income: needs / wants / savings / not yet assigned.
export function ruleSplit(state) {
  const income = incomeTotal(state);
  const byGroup = { need: 0, want: 0, save: 0 };
  for (const t of state.transactions) {
    const cat = categoryById(state, t.category);
    if (!cat) continue;
    if (t.type === "expense") byGroup[cat.group] += t.amount;
    if (t.type === "saving") byGroup.save += t.amount;
  }
  const assigned = byGroup.need + byGroup.want + byGroup.save;
  return { income, ...byGroup, unassigned: Math.max(income - assigned, 0) };
}

export function addTransaction(state, entry) {
  const id = `u${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  state.transactions.push({ id, ...entry });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  saveState(state);
  return id;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, categoryId, budget) {
  const cat = categoryById(state, categoryId);
  if (cat) cat.budget = Math.max(0, Math.round(budget));
  saveState(state);
}

export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (goal) goal.saved = Math.min(goal.target, goal.saved + amount);
  saveState(state);
}

export function toggleBill(state, billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (bill) bill.paid = !bill.paid;
  saveState(state);
}

export { HOUSEHOLD };
