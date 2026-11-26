// Main — one job: mount the right page for the hash route and wire every
// control on it. Routes: #/ dashboard, #/transactions, #/budgets,
// #/goals, #/bills, #/insights. All state lives in state.js; this file
// only decides what to show and what a click means. It also owns the
// two header preferences — language (i18n.js) and theme — and repaints
// the static chrome (nav, footer) whenever the language changes.

import { loadState, saveState, resetState, addTransaction, deleteTransaction, setBudget, addToGoal, toggleBill } from "./state.js";
import { dashboardView, transactionsView, budgetsView, goalsView, billsView, insightsView } from "./views.js";
import { t, getLang, setLang } from "./i18n.js";

const THEME_KEY = "hearthledger-theme-v1";
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

// The words that live outside the routed pages: title, nav, the
// household chip and the footer. Rebuilt on every language change.
function applyChrome() {
  document.title = t("doc.title");
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t("doc.description"));
  document.getElementById("brand-tagline").textContent = t("brand.tagline");
  document.querySelector(".mainnav").setAttribute("aria-label", t("nav.sections"));
  document.querySelectorAll(".mainnav a").forEach((a) => {
    a.textContent = t(`nav.${a.dataset.route}`);
  });
  const chip = document.getElementById("household-chip");
  chip.setAttribute("title", t("chip.title"));
  document.getElementById("chip-sub").textContent = `${t("chip.month")} · ${t("chip.members")}`;
  document.getElementById("foot-about").innerHTML =
    `<strong>HearthLedger</strong>${t("foot.about.pre")}<a href="#/insights">${t("foot.about.link")}</a>${t("foot.about.post")}`;
  document.getElementById("foot-demo").innerHTML =
    `${t("foot.demo.pre")}<button type="button" class="linklike" id="reset-demo">${t("foot.demo.reset")}</button>${t("foot.demo.post")}`;
  document.querySelector(".seg").setAttribute("aria-label", t("prefs.language"));
  document.querySelectorAll("[data-lang]").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === getLang());
    b.setAttribute("aria-pressed", b.dataset.lang === getLang() ? "true" : "false");
  });
  syncThemeButton();
}

function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  const btn = document.getElementById("theme-toggle");
  btn.textContent = dark ? "☀" : "☾";
  btn.setAttribute("aria-label", t(dark ? "prefs.toLight" : "prefs.toDark"));
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

// Header preferences: language segmented control + theme toggle.
document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.lang === getLang()) return;
    setLang(button.dataset.lang);
    applyChrome();
    render();
  });
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch { /* private mode: the theme lasts for the session */ }
  syncThemeButton();
  render(); // the donut picks its colours from the active theme
});

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

// The reset button lives in the footer, whose words are rebuilt on a
// language change — so its click is delegated, not bound once.
document.addEventListener("click", (event) => {
  if (event.target.id !== "reset-demo") return;
  state = resetState();
  txFilter = { category: "all", type: "all" };
  rerender();
});

window.addEventListener("hashchange", render);
applyChrome();
render();
