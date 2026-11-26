// Charts — hand-drawn SVG, no library: a donut for the spending split and
// horizontal bars for budget-vs-actual. Everything is pure functions of
// the numbers passed in, so the same code draws the dashboard and the
// budgets page.

import { money, pct } from "./format.js";
import { t } from "./i18n.js";

// Category colours are chosen for the light theme; a few are too dark
// to read on the dark card, so the donut swaps in brighter variants
// when the dark theme is active. The bars need no swap — they are CSS
// classes driven by the theme's variables.
const DARK_VARIANTS = {
  "#14523f": "#3fa37f",
  "#2f6f8f": "#5b9dbd",
  "#7c6aa8": "#a08fc7",
  "#4a9e7f": "#63bb97",
  "#5b8c5a": "#7fae7d",
  "#c96f4a": "#dd8a63",
  "#b65c8a": "#cf7fa8",
  "#a8793f": "#c49a5c",
  "#6b7f8f": "#93a7b8",
  "#9a938a": "#b5aea4",
};

export function displayColor(hex) {
  if (typeof document !== "undefined" && document.documentElement.dataset.theme === "dark") {
    return DARK_VARIANTS[hex] || hex;
  }
  return hex;
}

// Donut: slices = [{label, value, color}]. Returns an SVG string with a
// centre label; slices under 1.5% are folded into "Other" by the caller.
export function donutChart(slices, centerTop, centerBottom, size = 220) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = slices.map((s) => {
    const frac = s.value / total;
    const len = Math.max(frac * circumference - 2, 0.5);
    const svg = `<circle cx="110" cy="110" r="${radius}" fill="none" stroke="${displayColor(s.color)}" stroke-width="30" stroke-dasharray="${len.toFixed(2)} ${circumference.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" />`;
    offset += frac * circumference;
    return svg;
  }).join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 220 220" role="img" aria-label="${t("chart.donutAria")}">
    <circle class="donut-track" cx="110" cy="110" r="${radius}" fill="none" stroke-width="30" />
    ${segments}
    <text class="donut-top" x="110" y="104" text-anchor="middle" font-size="15">${centerTop}</text>
    <text class="donut-bottom" x="110" y="130" text-anchor="middle" font-size="24" font-weight="700">${centerBottom}</text>
  </svg>`;
}

// Legend rows for a donut: colour swatch, label, amount and share.
export function donutLegend(slices) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  return `<ul class="legend">${slices.map((s) => `
    <li><span class="swatch" style="background:${displayColor(s.color)}"></span>${s.label}
      <span class="amt num">${money(s.value)}</span>
      <span class="pct num">${pct(s.value, total)}%</span></li>`).join("")}</ul>`;
}

// One budget bar: spent vs budget, coloured green / amber (over 90%) /
// red (over 100%), with a plain-English note underneath.
export function budgetBar(name, spent, budget, note) {
  const ratio = budget > 0 ? spent / budget : 0;
  const cls = ratio > 1 ? "over" : ratio >= 0.9 ? "warn" : "";
  const width = Math.min(ratio * 100, 100).toFixed(1);
  const remain = budget - spent;
  const status = remain < 0
    ? t("chart.barOver", { amount: money(-remain) })
    : t("chart.barLeft", { remain: money(remain), budget: money(budget) });
  return `<div class="bar-row">
    <div class="bar-top"><b>${name}</b><span class="num">${money(spent)} <span class="muted">/ ${money(budget)}</span></span></div>
    <div class="bar-track" role="img" aria-label="${t("chart.barAria", { name, spent: money(spent), budget: money(budget) })}"><div class="bar-fill ${cls}" style="width:${width}%"></div></div>
    <div class="bar-note">${status}${note ? ` · ${note}` : ""}</div>
  </div>`;
}
