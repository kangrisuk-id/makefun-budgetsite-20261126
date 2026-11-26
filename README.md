# makefun-budgetsite-20261126

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/kangrisuk-id/makefun-budgetsite-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/kangrisuk-id/makefun-budgetsite-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

![HearthLedger dashboard — November at a glance](screenshots/1-dashboard.jpg)

HearthLedger is a household budget studio for the Alvarez family, November 2026 — a working site, not a mockup: a dashboard with live KPIs and a spending donut, a transactions ledger with add, filter and delete, editable category budgets with a 50/30/20 check, four savings goals, a bills tracker, and an insights page that turns the month's figures into plain-language actions. Every figure derives from one seeded dataset of 42 real transactions, every control works, and the whole site is static files with no network requests and a 28 KB gzipped first load.

**New in v2 — two languages and two themes.** The whole site speaks **English and Bahasa Indonesia**: one tap on the EN | ID switch in the header repaints every page — navigation, forms, category and goal names, chart labels, the insights and their advice — with numbers reformatted to match (US$6,850 becomes US$6.850), and the choice is remembered. A **dark theme** sits beside it: the toggle recolours every card, table and hand-drawn SVG chart through one variable-driven palette, is remembered the same way, and on a first visit follows your system's light/dark setting.

## At a glance

| | |
|---|---|
| Household | The Alvarez family — 2 adults, 2 kids — November 2026 |
| Income | $6,850 (2 paydays, Nov 1) |
| Spent | $4,162 across 11 categories · 42 transactions |
| Saved | $1,100 — 16.1% of income (20% is the goal) |
| Left to budget | $1,588, with car insurance ($118) still due Nov 28 |
| Pages | Dashboard · Transactions · Budgets · Goals · Bills · Insights |
| Languages | English · Bahasa Indonesia — header switcher, every string translated, locale number formats, choice remembered |
| Theme | Light · Dark — header toggle, charts recolour too, follows your system on first visit, choice remembered |
| First load | 10 files, 28,259 bytes gzip-9 · no libraries, no network |
| Storage | Local only — edits persist in the browser, nothing leaves the device |

## Screenshots

| | |
|---|---|
| ![Dashboard](screenshots/1-dashboard.jpg) | ![Transactions](screenshots/2-transactions.jpg) |
| **Dashboard** — November at a glance: income, spending, savings and what's left, with the spending donut. | **Transactions** — the full ledger: add, filter and delete entries; totals follow at once. |
| ![Budgets](screenshots/3-budgets.jpg) | ![Goals on a phone](screenshots/4-goals-phone.jpg) |
| **Budgets** — the 50/30/20 rule and every category against its budget, editable in place. | **Goals on a phone** — savings goals at 390 px, single column, every control reachable. |

Every page above also renders in Bahasa Indonesia and in the dark theme — the EN | ID switch and the ☾ toggle live in the header, next to the household chip.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=6xwwxtxr&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
