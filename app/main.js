// Main — one job: mount the right page for the hash route and wire every
// control on it. Routes: #/ dashboard, #/transactions, #/budgets,
// #/goals, #/bills, #/insights. All state lives in state.js; this file
// only decides what to show and what a click means.

import { loadState, saveState, resetState, addTransaction, deleteTransaction, setBudget, addToGoal, toggleBill } from "./state.js";
import { dashboardView, transactionsView, budgetsView, goalsView, billsView, insightsView } from "./views.js";

const app = document.getElementById("app");
let state = loadState();
let txFilter = { category: "all", type: "all" };

const ROUTES = {
  "": dashboardView,
  "transactions": (s) => transactionsView(s, txFilter),
  "budgets": budgetsView,
  "goals": goalsView,
  "bills": billsView,
  "insights": insightsView,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const route = hash.split("/")[0];
  return ROUTES[route] ? route : "";
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route] || dashboardView;
  app.innerHTML = view(state);
  document.querySelectorAll(".mainnav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === (route === "" ? "dashboard" : route));
  });
  // On a phone the nav scrolls sideways: keep the active section visible.
  const active = document.querySelector(".mainnav a.active");
  if (active && window.innerWidth < 860) active.scrollIntoView({ inline: "center", block: "nearest" });
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  render();
}

// One delegated handler for every button and select on every page.
app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "delete-tx") {
    deleteTransaction(state, button.dataset.id);
    rerender();
  }
  if (action === "save-budget") {
    const input = app.querySelector(`[data-budget-for="${button.dataset.cat}"]`);
    const value = Number(input && input.value);
    if (Number.isFinite(value) && value >= 0) {
      setBudget(state, button.dataset.cat, value);
      rerender();
    }
  }
  if (action === "add-goal") {
    const input = app.querySelector(`[data-goal-amount="${button.dataset.goal}"]`);
    const value = Number(input && input.value);
    if (Number.isFinite(value) && value > 0) {
      addToGoal(state, button.dataset.goal, value);
      rerender();
    }
  }
  if (action === "toggle-bill") {
    toggleBill(state, button.dataset.bill);
    rerender();
  }
});

app.addEventListener("change", (event) => {
  // The add-transaction form's type and category must agree: Savings is a
  // transfer, never an expense or income — an expense filed under Savings
  // would count in the totals but appear in no chart.
  if (event.target.id === "f-type") {
    const catSel = app.querySelector("#f-cat");
    const savingsOpt = catSel && catSel.querySelector('option[value="savings"]');
    if (savingsOpt) savingsOpt.disabled = event.target.value !== "saving";
    if (event.target.value !== "saving" && catSel && catSel.value === "savings") catSel.value = "housing";
    return;
  }
  const select = event.target.closest("[data-filter]");
  if (!select) return;
  txFilter[select.dataset.filter] = select.value;
  render();
});

app.addEventListener("submit", (event) => {
  if (event.target.id !== "add-tx") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const amount = Number(form.get("amount"));
  const description = String(form.get("description") || "").trim();
  const date = String(form.get("date") || "2026-11-26");
  const category = String(form.get("category") || "misc");
  // A Savings entry is a transfer by definition, whatever the type menu
  // said when the form was filled: it can never be an expense or income,
  // or it would count in the totals but appear in no chart.
  const type = category === "savings" ? "saving" : String(form.get("type") || "expense");
  if (!description || !Number.isFinite(amount) || amount <= 0) return;
  addTransaction(state, { date, description, category, amount, type });
  txFilter = { category: "all", type: "all" };
  rerender();
});

document.getElementById("reset-demo").addEventListener("click", () => {
  state = resetState();
  txFilter = { category: "all", type: "all" };
  rerender();
});

window.addEventListener("hashchange", render);
render();
