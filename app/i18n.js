// i18n — one job: hold every word the site shows, in English and in
// Bahasa Indonesia, and answer "what does this say in the current
// language?". The choice lives in localStorage and on <html lang> (the
// inline bootstrap in index.html sets it before first paint, so there
// is no flash of the wrong language). English is the default and the
// fallback for anything untranslated. Amounts stay USD in both
// languages; format.js picks the number locale from here.

const LANG_KEY = "hearthledger-lang-v1";

export function getLang() {
  return document.documentElement.lang === "id" ? "id" : "en";
}

export function setLang(lang) {
  const next = lang === "id" ? "id" : "en";
  document.documentElement.lang = next;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch { /* private mode: the choice lasts for the session */ }
}

export function localeTag() {
  return getLang() === "id" ? "id-ID" : "en-US";
}

const MONTHS_SHORT = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
};

export function monthShort(monthIndex) {
  return MONTHS_SHORT[getLang()][monthIndex] || MONTHS_SHORT.en[monthIndex];
}

// Category names keyed by the ids in data.js. The English names in
// data.js stay the canonical fallback for anything missing here.
const CATEGORY_NAMES = {
  en: {
    housing: "Housing", groceries: "Groceries", transport: "Transport",
    utilities: "Utilities", health: "Health", kids: "Kids & School",
    dining: "Dining Out", entertainment: "Entertainment", clothing: "Clothing",
    subscriptions: "Subscriptions", misc: "Miscellaneous", savings: "Savings",
  },
  id: {
    housing: "Perumahan", groceries: "Bahan Makanan", transport: "Transportasi",
    utilities: "Utilitas", health: "Kesehatan", kids: "Anak & Sekolah",
    dining: "Makan di Luar", entertainment: "Hiburan", clothing: "Pakaian",
    subscriptions: "Langganan", misc: "Lain-lain", savings: "Tabungan",
  },
};

export function catName(cat) {
  if (!cat) return "—";
  return CATEGORY_NAMES[getLang()][cat.id] || cat.name;
}

// Goal names and notes, keyed by the ids in data.js.
const GOAL_TEXT = {
  en: {
    g1: { name: "Emergency fund", note: "3 months of essential spending, kept in a separate savings account." },
    g2: { name: "Family holiday — Bali", note: "Flights and a week by the sea next summer, if the fund holds." },
    g3: { name: "New car down payment", note: "Replacing the 2012 hatchback before the next inspection." },
    g4: { name: "Kids' education", note: "Next term's fees and a cushion for school trips." },
  },
  id: {
    g1: { name: "Dana darurat", note: "3 bulan pengeluaran pokok, disimpan di rekening tabungan terpisah." },
    g2: { name: "Liburan keluarga — Bali", note: "Penerbangan dan seminggu di tepi laut musim panas nanti, jika dananya cukup." },
    g3: { name: "Uang muka mobil baru", note: "Mengganti hatchback 2012 sebelum uji berkala berikutnya." },
    g4: { name: "Pendidikan anak", note: "Biaya semester depan dan cadangan untuk karyawisata sekolah." },
  },
};

export function goalText(goal) {
  const entry = GOAL_TEXT[getLang()][goal.id];
  return entry ? { name: entry.name, note: entry.note } : { name: goal.name, note: goal.note };
}

// Bill names and notes, keyed by the ids in data.js.
const BILL_TEXT = {
  en: {
    b1: { name: "Rent — Maple Street apartment", note: "Auto-debit on the 1st" },
    b2: { name: "Internet — Fiber 300", note: "Auto-debit on the 5th" },
    b3: { name: "Electric — October usage", note: "Paid by bank transfer" },
    b4: { name: "Water — October usage", note: "Paid by bank transfer" },
    b5: { name: "Phone — family plan, 2 lines", note: "Auto-debit on the 18th" },
    b6: { name: "Gym membership — Daniel", note: "Auto-debit on the 20th" },
    b7: { name: "Streaming service", note: "Card on file" },
    b8: { name: "Car insurance — monthly premium", note: "Due in 2 days — set aside now" },
  },
  id: {
    b1: { name: "Sewa — apartemen Maple Street", note: "Debit otomatis tanggal 1" },
    b2: { name: "Internet — Fiber 300", note: "Debit otomatis tanggal 5" },
    b3: { name: "Listrik — pemakaian Oktober", note: "Dibayar via transfer bank" },
    b4: { name: "Air — pemakaian Oktober", note: "Dibayar via transfer bank" },
    b5: { name: "Telepon — paket keluarga, 2 nomor", note: "Debit otomatis tanggal 18" },
    b6: { name: "Keanggotaan gym — Daniel", note: "Debit otomatis tanggal 20" },
    b7: { name: "Layanan streaming", note: "Kartu tersimpan" },
    b8: { name: "Asuransi mobil — premi bulanan", note: "Jatuh tempo 2 hari lagi — sisihkan sekarang" },
  },
};

export function billText(bill) {
  const entry = BILL_TEXT[getLang()][bill.id];
  return entry ? { name: entry.name, note: entry.note } : { name: bill.name, note: bill.note };
}

// Every other string on the site. Values are plain strings, or
// functions of a params object for sentences with numbers in them.
const STRINGS = {
  en: {
    "doc.title": "HearthLedger — Household Budget Studio",
    "doc.description": "HearthLedger is the Alvarez family's household budget studio: income, spending, budgets, bills, savings goals and plain-English insights for November 2026 — all in one place, all offline.",
    "brand.tagline": "Household Budget Studio",
    "nav.dashboard": "Dashboard",
    "nav.transactions": "Transactions",
    "nav.budgets": "Budgets",
    "nav.goals": "Goals",
    "nav.bills": "Bills",
    "nav.insights": "Insights",
    "nav.sections": "Sections",
    "chip.title": "The household this budget tracks",
    "chip.month": "November 2026",
    "chip.members": "2 adults, 2 kids",
    "prefs.language": "Language",
    "prefs.toDark": "Switch to dark theme",
    "prefs.toLight": "Switch to light theme",
    "foot.about.pre": " — a household budget studio that runs entirely in your browser. Your figures never leave this device; they are stored only in this browser's local storage, and the ",
    "foot.about.link": "Insights",
    "foot.about.post": " page explains every number it shows.",
    "foot.demo.pre": "Demo household: the Alvarez family, November 2026. Add, edit or delete anything — every control on every page works, and ",
    "foot.demo.reset": "reset the demo data",
    "foot.demo.post": " any time.",
    "common.delete": "Delete",
    "common.and": " and ",
    "common.income": "Income",
    "common.other": "Other",
    "table.date": "Date",
    "table.what": "What",
    "table.category": "Category",
    "table.amount": "Amount",
    "bill.dueSmall": (p) => `Due Nov ${p.day} · ${p.note}`,
    "bill.duePill": (p) => `Due Nov ${p.day}`,
    "bill.paid": "Paid",
    "goal.ofLine": (p) => `${p.saved} of ${p.target} · ${p.p}%`,
    "chart.donutAria": "Spending by category donut chart",
    "chart.barOver": (p) => `${p.amount} over budget`,
    "chart.barLeft": (p) => `${p.remain} left of ${p.budget}`,
    "chart.barAria": (p) => `${p.name}: ${p.spent} spent of ${p.budget} budget`,

    "dash.title": "November, at a glance",
    "dash.lede": (p) => `The Alvarez family has <span class="lede-figure num"><strong>${p.left}</strong> left to budget</span> with ${p.daysLeft} days to go. Income is in, ${p.saved} is already saved, and every figure below is live — add a transaction and watch it move.`,
    "kpi.income": "Income in",
    "kpi.income.delta": "2 paydays · Nov 1",
    "kpi.spent": "Spent so far",
    "kpi.spent.delta": (p) => `≈ ${p.perDay} a day · 26 days`,
    "kpi.saved": "Saved",
    "kpi.saved.delta": "of income · 20% is the goal",
    "kpi.left": "Left to budget",
    "kpi.left.delta": (p) => `car insurance ${p.amount} still due Nov 28`,
    "dash.where.title": "Where the money went",
    "dash.where.link": "All transactions →",
    "dash.where.sub": "Spending by category, Nov 1–26. Rent is the anchor; groceries are the biggest flexible spend.",
    "dash.totalSpent": "Total spent",
    "dash.pressure.title": "Budgets under pressure",
    "dash.pressure.link": "All budgets →",
    "dash.pressure.sub": "The five biggest spends against their budgets. Amber means nearly spent; red means over.",
    "dash.bills.title": "Bills still to pay",
    "dash.bills.link": "All bills →",
    "dash.bills.empty": "Nothing outstanding — every November bill is paid.",
    "dash.bills.summary": (p) => `${p.paidCount} of ${p.total} November bills paid · ${p.settled} settled.`,
    "dash.goals.title": "Savings goals",
    "dash.goals.link": "All goals →",
    "dash.goals.sub": "Four goals, one household. The emergency fund is the priority; the holiday is the reward.",
    "dash.latest.title": "Latest activity",
    "dash.latest.link": (p) => `See all ${p.count} →`,

    "tx.title": "Transactions",
    "tx.lede": (p) => `Every dollar in and out, Nov 1–26. <strong>${p.count} entries</strong> — add one below and the dashboard, budgets and insights update at once.`,
    "tx.add.title": "Add a transaction",
    "tx.f.date": "Date",
    "tx.f.what": "What was it?",
    "tx.f.whatPh": "e.g. Weekly grocery run",
    "tx.f.category": "Category",
    "tx.f.amount": "Amount ($)",
    "tx.f.type": "Type",
    "tx.opt.savings": "Savings (transfer)",
    "tx.type.expense": "Expense",
    "tx.type.income": "Income",
    "tx.type.saving": "Savings transfer",
    "tx.add.button": "Add transaction",
    "tx.filter.category": "Category",
    "tx.filter.type": "Type",
    "tx.filter.allCats": "All categories",
    "tx.filter.allTypes": "All types",
    "tx.filter.expenses": "Expenses",
    "tx.filter.income": "Income",
    "tx.filter.savings": "Savings transfers",
    "tx.filter.group": "Filter transactions",
    "tx.showing": (p) => `Showing <strong>${p.count}</strong> · in <strong class="num pos">${p.inAmt}</strong> · out <strong class="num neg">${p.outAmt}</strong>`,
    "tx.empty": "Nothing matches this filter. Try another category or type.",

    "bud.title": "Budgets",
    "bud.lede": (p) => `November's plan totals <strong class="num">${p.totalBudget}</strong> against <strong class="num">${p.income}</strong> of income. ${p.totalSpent} is spent or saved so far — the bars below are live, and you can change any budget in place.`,
    "bud.rule.title": "The 50 / 30 / 20 rule",
    "bud.rule.sub": "A classic household split: 50% needs, 30% wants, 20% savings. Here's where November actually lands — needs run a little hot, wants are well under, and the unassigned cash is the lever.",
    "bud.rule.needs": (p) => `Needs · ${p.amount} of ${p.target} target`,
    "bud.rule.wants": (p) => `Wants · ${p.amount} of ${p.target} target`,
    "bud.rule.savings": (p) => `Savings · ${p.amount} of ${p.target} target`,
    "bud.rule.unassigned": (p) => `${p.amount} ( ${p.p}% ) is still unassigned — see the <a href="#/insights">Insights</a> page for what to do with it.`,
    "bud.every.title": "Every category",
    "bud.every.sub": "Change a budget and it saves immediately. Amber means nearly spent; red means over.",
    "bud.note.over": (p) => `${p.amount} over budget`,
    "bud.note.left": (p) => `${p.amount} left`,
    "bud.group.need": "Need",
    "bud.group.want": "Want",
    "bud.set": "Set budget:",
    "bud.save": "Save",
    "bud.savingsLine": (p) => `Savings target: <strong class="num">${p.saved} of ${p.target}</strong> transferred this month — edit it on the <a href="#/goals">Goals</a> page by adding to a goal.`,

    "goals.title": "Savings goals",
    "goals.lede": (p) => `<strong class="num">${p.saved}</strong> saved toward <strong class="num">${p.target}</strong> of goals (${p.p}%). Add money to any goal — the total and the dashboard move with it.`,
    "goals.toGo": (p) => `${p.amount} to go.`,
    "goals.addLabel": "Add $",
    "goals.addButton": "Add to goal",
    "goals.funding.title": "How the goals are funded",
    "goals.funding.body": (p) => `The balances are cumulative — they hold savings from earlier months as well as November's. November's transfers — ${p.total} in total — come straight from payday: ${p.amt600} to the emergency fund and ${p.amt250} to the holiday fund on Nov 1, then ${p.amt250} to the car fund on Nov 15. The habit is automatic; the goals page is where you watch it land. See the transfers on the <a href="#/transactions">Transactions</a> page.`,

    "bills.title": "Bills",
    "bills.lede": (p) => `<strong>${p.paidCount} of ${p.total} bills paid</strong> — ${p.paidSum} settled, <strong class="num">${p.dueSum} still due</strong> before the month ends. Tap any bill to mark it paid; the dashboard total follows.`,
    "bills.still": "Still to pay",
    "bills.done": "Already paid",
    "bills.empty": "Nothing due — every November bill is paid.",
    "bills.markPaid": "Mark paid",
    "bills.markUnpaid": "Mark unpaid",
    "bills.never.title": "Never miss one again",
    "bills.never.body": "Five of these bills pay themselves — four by auto-debit and one by card on file. The three that need a tap — electric, water and car insurance — are the ones this page exists for: check it on the 1st and the 15th, and the month has no surprises.",

    "ins.title": "Insights",
    "ins.lede": (p) => `What November's numbers actually mean — computed from the same ${p.count} transactions as every other page, in plain English, with one thing to do about each.`,
    "ins.numbers.title": "November by the numbers",
    "ins.stat.daily": "Average daily spending",
    "ins.stat.dailySuffix": (p) => `${p.amount} / day`,
    "ins.stat.projected": "Projected spending, full month",
    "ins.stat.left": "Projected cash left on Nov 30",
    "ins.stat.topCat": "Biggest category",
    "ins.stat.biggest": "Biggest single expense",
    "ins.stat.rate": "Savings rate",
    "ins.stat.rateVal": (p) => `${p.rate}% of income (goal 20%)`,
    "ins.stat.split": "Needs / wants / savings",
    "ins.stat.over": "Categories over budget",
    "ins.stat.overNone": "None — every budget holds",
    "ins.check.title": "The 50 / 30 / 20 check",
    "ins.check.sub": (p) => `Needs are at ${p.needs}% (target 50%) — rent does the damage, and rent is not negotiable this month. Wants are only ${p.wants}% (target 30%), which is the room that makes the plan work.`,
    "ins.check.needs": "Needs · target 50%",
    "ins.check.wants": "Wants · target 30%",
    "ins.check.savings": "Savings · target 20%",
    "ins.verdict": (p) => `The verdict: at the current pace the household finishes November with about ${p.left} unspent after savings — the emergency fund's next ${p.amt600}, already earned.`,
    "ins.tips.title": "Three things to do this week",
    "tip1.titleMove": (p) => `Move ${p.amount} to savings`,
    "tip1.titleRest": "Move the unassigned cash to a goal",
    "tip1.bodyMove": (p) => `Savings sit at ${p.rate}% of income; the 20% rule wants ${p.want}. ${p.unassigned} is still unassigned this month — moving ${p.amount} of it closes the gap without touching any budget.`,
    "tip1.bodyRest": (p) => `${p.unassigned} is still unassigned this month. Give it a job — a goal contribution or next month's buffer — before it drifts into spending.`,
    "tip2.title": (p) => `${p.names} ${p.plural ? "are" : "is"} over budget`,
    "tip2.each": (p) => `${p.name} is ${p.over} over its ${p.budget} budget`,
    "tip2.tail": ". Raise the budget to the honest number, or move the difference from a category with room — guessing low every month is how budgets stop being trusted.",
    "tip3.title": (p) => `${p.amount} of bills are still due`,
    "tip3.body": (p) => `Car insurance (${p.amount}) lands on Nov 28. It is already covered by the unassigned cash, so pay it on the day and tick it off on the Bills page — no surprise, no late fee.`,
    "tip4.title": "Groceries are the lever, not dining out",
    "tip4.body": (p) => `Groceries are the biggest flexible spend at ${p.total} this month — about ${p.perDay} a day. One planned shop a week instead of top-ups is usually worth ${p.range} a month for a family this size, more than skipping every coffee run.`,
  },
  id: {
    "doc.title": "HearthLedger — Studio Anggaran Rumah Tangga",
    "doc.description": "HearthLedger adalah studio anggaran rumah tangga keluarga Alvarez: pemasukan, pengeluaran, anggaran, tagihan, target tabungan, dan wawasan berbahasa sederhana untuk November 2026 — semua dalam satu tempat, semua offline.",
    "brand.tagline": "Studio Anggaran Rumah Tangga",
    "nav.dashboard": "Dasbor",
    "nav.transactions": "Transaksi",
    "nav.budgets": "Anggaran",
    "nav.goals": "Target",
    "nav.bills": "Tagihan",
    "nav.insights": "Wawasan",
    "nav.sections": "Bagian",
    "chip.title": "Rumah tangga yang anggarannya dilacak",
    "chip.month": "November 2026",
    "chip.members": "2 dewasa, 2 anak",
    "prefs.language": "Bahasa",
    "prefs.toDark": "Ganti ke tema gelap",
    "prefs.toLight": "Ganti ke tema terang",
    "foot.about.pre": " — studio anggaran rumah tangga yang berjalan sepenuhnya di browser Anda. Angka Anda tidak pernah meninggalkan perangkat ini; tersimpan hanya di penyimpanan lokal browser ini, dan halaman ",
    "foot.about.link": "Wawasan",
    "foot.about.post": " menjelaskan setiap angka yang ditampilkannya.",
    "foot.demo.pre": "Rumah tangga demo: keluarga Alvarez, November 2026. Tambah, ubah, atau hapus apa pun — setiap kontrol di setiap halaman berfungsi, dan ",
    "foot.demo.reset": "atur ulang data demo",
    "foot.demo.post": " kapan saja.",
    "common.delete": "Hapus",
    "common.and": " dan ",
    "common.income": "Pemasukan",
    "common.other": "Lainnya",
    "table.date": "Tanggal",
    "table.what": "Keterangan",
    "table.category": "Kategori",
    "table.amount": "Jumlah",
    "bill.dueSmall": (p) => `Jatuh tempo ${p.day} Nov · ${p.note}`,
    "bill.duePill": (p) => `Jatuh tempo ${p.day} Nov`,
    "bill.paid": "Lunas",
    "goal.ofLine": (p) => `${p.saved} dari ${p.target} · ${p.p}%`,
    "chart.donutAria": "Grafik donat pengeluaran per kategori",
    "chart.barOver": (p) => `${p.amount} melebihi anggaran`,
    "chart.barLeft": (p) => `sisa ${p.remain} dari ${p.budget}`,
    "chart.barAria": (p) => `${p.name}: terpakai ${p.spent} dari anggaran ${p.budget}`,

    "dash.title": "November, sekilas",
    "dash.lede": (p) => `Keluarga Alvarez masih punya <span class="lede-figure num"><strong>${p.left}</strong> untuk dianggarkan</span> dengan sisa ${p.daysLeft} hari. Pemasukan sudah masuk, ${p.saved} sudah ditabung, dan semua angka di bawah ini langsung berubah — tambahkan transaksi dan lihat angkanya bergerak.`,
    "kpi.income": "Pemasukan masuk",
    "kpi.income.delta": "2 kali gajian · 1 Nov",
    "kpi.spent": "Sudah terpakai",
    "kpi.spent.delta": (p) => `≈ ${p.perDay} per hari · 26 hari`,
    "kpi.saved": "Ditabung",
    "kpi.saved.delta": "dari pemasukan · target 20%",
    "kpi.left": "Sisa untuk dianggarkan",
    "kpi.left.delta": (p) => `asuransi mobil ${p.amount} masih jatuh tempo 28 Nov`,
    "dash.where.title": "Ke mana uang pergi",
    "dash.where.link": "Semua transaksi →",
    "dash.where.sub": "Pengeluaran per kategori, 1–26 Nov. Sewa adalah jangkarnya; bahan makanan adalah pengeluaran fleksibel terbesar.",
    "dash.totalSpent": "Total terpakai",
    "dash.pressure.title": "Anggaran yang tertekan",
    "dash.pressure.link": "Semua anggaran →",
    "dash.pressure.sub": "Lima pengeluaran terbesar dibanding anggarannya. Kuning berarti hampir habis; merah berarti lewat.",
    "dash.bills.title": "Tagihan yang belum dibayar",
    "dash.bills.link": "Semua tagihan →",
    "dash.bills.empty": "Tidak ada tunggakan — semua tagihan November sudah dibayar.",
    "dash.bills.summary": (p) => `${p.paidCount} dari ${p.total} tagihan November sudah dibayar · ${p.settled} lunas.`,
    "dash.goals.title": "Target tabungan",
    "dash.goals.link": "Semua target →",
    "dash.goals.sub": "Empat target, satu rumah tangga. Dana darurat adalah prioritas; liburan adalah hadiahnya.",
    "dash.latest.title": "Aktivitas terakhir",
    "dash.latest.link": (p) => `Lihat semua ${p.count} →`,

    "tx.title": "Transaksi",
    "tx.lede": (p) => `Setiap dolar yang masuk dan keluar, 1–26 Nov. <strong>${p.count} entri</strong> — tambahkan satu di bawah dan dasbor, anggaran, serta wawasan langsung terbarui.`,
    "tx.add.title": "Tambah transaksi",
    "tx.f.date": "Tanggal",
    "tx.f.what": "Untuk apa?",
    "tx.f.whatPh": "mis. Belanja bahan makanan mingguan",
    "tx.f.category": "Kategori",
    "tx.f.amount": "Jumlah ($)",
    "tx.f.type": "Jenis",
    "tx.opt.savings": "Tabungan (transfer)",
    "tx.type.expense": "Pengeluaran",
    "tx.type.income": "Pemasukan",
    "tx.type.saving": "Transfer tabungan",
    "tx.add.button": "Tambah transaksi",
    "tx.filter.category": "Kategori",
    "tx.filter.type": "Jenis",
    "tx.filter.allCats": "Semua kategori",
    "tx.filter.allTypes": "Semua jenis",
    "tx.filter.expenses": "Pengeluaran",
    "tx.filter.income": "Pemasukan",
    "tx.filter.savings": "Transfer tabungan",
    "tx.filter.group": "Filter transaksi",
    "tx.showing": (p) => `Menampilkan <strong>${p.count}</strong> · masuk <strong class="num pos">${p.inAmt}</strong> · keluar <strong class="num neg">${p.outAmt}</strong>`,
    "tx.empty": "Tidak ada yang cocok dengan filter ini. Coba kategori atau jenis lain.",

    "bud.title": "Anggaran",
    "bud.lede": (p) => `Rencana November totalnya <strong class="num">${p.totalBudget}</strong> dari pemasukan <strong class="num">${p.income}</strong>. ${p.totalSpent} sudah terpakai atau ditabung sejauh ini — bilah di bawah ini langsung berubah, dan Anda bisa mengubah anggaran apa pun di tempat.`,
    "bud.rule.title": "Aturan 50 / 30 / 20",
    "bud.rule.sub": "Pembagian klasik rumah tangga: 50% kebutuhan, 30% keinginan, 20% tabungan. Beginilah posisi November sebenarnya — kebutuhan sedikit di atas batas, keinginan jauh di bawah, dan uang yang belum dialokasikan adalah tuasnya.",
    "bud.rule.needs": (p) => `Kebutuhan · ${p.amount} dari target ${p.target}`,
    "bud.rule.wants": (p) => `Keinginan · ${p.amount} dari target ${p.target}`,
    "bud.rule.savings": (p) => `Tabungan · ${p.amount} dari target ${p.target}`,
    "bud.rule.unassigned": (p) => `${p.amount} ( ${p.p}% ) masih belum dialokasikan — lihat halaman <a href="#/insights">Wawasan</a> untuk tahu apa yang bisa dilakukan dengannya.`,
    "bud.every.title": "Semua kategori",
    "bud.every.sub": "Ubah anggaran dan langsung tersimpan. Kuning berarti hampir habis; merah berarti lewat.",
    "bud.note.over": (p) => `${p.amount} melebihi anggaran`,
    "bud.note.left": (p) => `sisa ${p.amount}`,
    "bud.group.need": "Kebutuhan",
    "bud.group.want": "Keinginan",
    "bud.set": "Atur anggaran:",
    "bud.save": "Simpan",
    "bud.savingsLine": (p) => `Target tabungan: <strong class="num">${p.saved} dari ${p.target}</strong> sudah ditransfer bulan ini — ubah di halaman <a href="#/goals">Target</a> dengan menambah ke sebuah target.`,

    "goals.title": "Target tabungan",
    "goals.lede": (p) => `<strong class="num">${p.saved}</strong> terkumpul menuju <strong class="num">${p.target}</strong> total target (${p.p}%). Tambahkan uang ke target mana pun — total dan dasbor ikut bergerak.`,
    "goals.toGo": (p) => `kurang ${p.amount} lagi.`,
    "goals.addLabel": "Tambah $",
    "goals.addButton": "Tambah ke target",
    "goals.funding.title": "Bagaimana target didanai",
    "goals.funding.body": (p) => `Saldo bersifat kumulatif — berisi tabungan dari bulan-bulan sebelumnya dan juga November. Transfer November — total ${p.total} — datang langsung dari gajian: ${p.amt600} ke dana darurat dan ${p.amt250} ke dana liburan pada 1 Nov, lalu ${p.amt250} ke dana mobil pada 15 Nov. Kebiasaannya otomatis; halaman target adalah tempat Anda melihatnya masuk. Lihat transfernya di halaman <a href="#/transactions">Transaksi</a>.`,

    "bills.title": "Tagihan",
    "bills.lede": (p) => `<strong>${p.paidCount} dari ${p.total} tagihan sudah dibayar</strong> — ${p.paidSum} lunas, <strong class="num">${p.dueSum} masih jatuh tempo</strong> sebelum bulan berakhir. Ketuk tagihan mana pun untuk menandainya lunas; total dasbor mengikuti.`,
    "bills.still": "Belum dibayar",
    "bills.done": "Sudah dibayar",
    "bills.empty": "Tidak ada yang jatuh tempo — semua tagihan November sudah dibayar.",
    "bills.markPaid": "Tandai lunas",
    "bills.markUnpaid": "Tandai belum lunas",
    "bills.never.title": "Jangan sampai terlewat lagi",
    "bills.never.body": "Lima tagihan ini membayar dirinya sendiri — empat lewat debit otomatis dan satu lewat kartu tersimpan. Tiga yang perlu diketuk — listrik, air, dan asuransi mobil — adalah alasan halaman ini ada: periksa pada tanggal 1 dan 15, dan bulan berjalan tanpa kejutan.",

    "ins.title": "Wawasan",
    "ins.lede": (p) => `Apa arti sebenarnya angka-angka November — dihitung dari ${p.count} transaksi yang sama seperti halaman lain, dalam bahasa yang sederhana, masing-masing dengan satu hal yang bisa dilakukan.`,
    "ins.numbers.title": "November dalam angka",
    "ins.stat.daily": "Rata-rata pengeluaran harian",
    "ins.stat.dailySuffix": (p) => `${p.amount} / hari`,
    "ins.stat.projected": "Proyeksi pengeluaran, sebulan penuh",
    "ins.stat.left": "Proyeksi sisa uang pada 30 Nov",
    "ins.stat.topCat": "Kategori terbesar",
    "ins.stat.biggest": "Pengeluaran tunggal terbesar",
    "ins.stat.rate": "Tingkat tabungan",
    "ins.stat.rateVal": (p) => `${p.rate}% dari pemasukan (target 20%)`,
    "ins.stat.split": "Kebutuhan / keinginan / tabungan",
    "ins.stat.over": "Kategori melebihi anggaran",
    "ins.stat.overNone": "Tidak ada — semua anggaran aman",
    "ins.check.title": "Pemeriksaan 50 / 30 / 20",
    "ins.check.sub": (p) => `Kebutuhan ada di ${p.needs}% (target 50%) — sewa penyebabnya, dan sewa tidak bisa dinegosiasikan bulan ini. Keinginan hanya ${p.wants}% (target 30%), dan ruang itulah yang membuat rencana ini berjalan.`,
    "ins.check.needs": "Kebutuhan · target 50%",
    "ins.check.wants": "Keinginan · target 30%",
    "ins.check.savings": "Tabungan · target 20%",
    "ins.verdict": (p) => `Kesimpulannya: dengan laju saat ini, rumah tangga ini menutup November dengan sisa sekitar ${p.left} setelah tabungan — ${p.amt600} berikutnya untuk dana darurat, yang sudah dihasilkan.`,
    "ins.tips.title": "Tiga hal untuk dilakukan minggu ini",
    "tip1.titleMove": (p) => `Pindahkan ${p.amount} ke tabungan`,
    "tip1.titleRest": "Pindahkan uang yang belum dialokasikan ke sebuah target",
    "tip1.bodyMove": (p) => `Tabungan ada di ${p.rate}% dari pemasukan; aturan 20% menghendaki ${p.want}. ${p.unassigned} masih belum dialokasikan bulan ini — memindahkan ${p.amount} darinya menutup selisih tanpa menyentuh anggaran mana pun.`,
    "tip1.bodyRest": (p) => `${p.unassigned} masih belum dialokasikan bulan ini. Beri ia tugas — kontribusi ke target atau cadangan bulan depan — sebelum ia menguap menjadi pengeluaran.`,
    "tip2.title": (p) => `${p.names} melebihi anggaran`,
    "tip2.each": (p) => `${p.name} melebihi anggarannya sebesar ${p.over} dari ${p.budget}`,
    "tip2.tail": ". Naikkan anggarannya ke angka yang jujur, atau pindahkan selisihnya dari kategori yang masih longgar — menebak terlalu rendah setiap bulan adalah cara anggaran berhenti dipercaya.",
    "tip3.title": (p) => `Tagihan sebesar ${p.amount} masih jatuh tempo`,
    "tip3.body": (p) => `Asuransi mobil (${p.amount}) jatuh tempo pada 28 Nov. Sudah tertutup oleh uang yang belum dialokasikan, jadi bayar tepat pada harinya dan tandai lunas di halaman Tagihan — tanpa kejutan, tanpa denda keterlambatan.`,
    "tip4.title": "Bahan makanan adalah tuasnya, bukan makan di luar",
    "tip4.body": (p) => `Bahan makanan adalah pengeluaran fleksibel terbesar dengan ${p.total} bulan ini — sekitar ${p.perDay} per hari. Satu belanja terencana seminggu, bukan belanja kecil berulang, biasanya bernilai ${p.range} sebulan untuk keluarga sebesar ini — lebih dari melewatkan semua jajan kopi.`,
  },
};

// Look a string up in the current language; a function value is
// called with the params object. Falls back to English, then the key.
export function t(key, params) {
  const lang = getLang();
  const value = STRINGS[lang][key] !== undefined ? STRINGS[lang][key] : STRINGS.en[key];
  if (typeof value === "function") return value(params || {});
  return value !== undefined ? value : key;
}
