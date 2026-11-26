// HearthLedger seed data — the Alvarez household, November 2026.
// Every figure is chosen once, here, and every page derives its numbers
// from this file, so the dashboard, budgets and insights always agree.
// Income $6,850 · expenses $4,162.12 · savings transfers $1,100 ·
// unallocated $1,587.88 (26 days in, car insurance $118 still to come).

export const HOUSEHOLD = {
  name: "The Alvarez Family",
  members: "2 adults, 2 kids",
  month: "November 2026",
  monthLabel: "Nov 2026",
  daysInMonth: 30,
  dayToday: 26,
  currency: "USD",
};

export const CATEGORIES = [
  { id: "housing",       name: "Housing",       budget: 1850, color: "#14523f", group: "need" },
  { id: "groceries",     name: "Groceries",     budget: 720,  color: "#e9a23b", group: "need" },
  { id: "transport",     name: "Transport",     budget: 340,  color: "#2f6f8f", group: "need" },
  { id: "utilities",     name: "Utilities",     budget: 360,  color: "#7c6aa8", group: "need" },
  { id: "health",        name: "Health",        budget: 180,  color: "#4a9e7f", group: "need" },
  { id: "kids",          name: "Kids & School", budget: 300,  color: "#5b8c5a", group: "need" },
  { id: "dining",        name: "Dining Out",    budget: 220,  color: "#c96f4a", group: "want" },
  { id: "entertainment", name: "Entertainment", budget: 150,  color: "#b65c8a", group: "want" },
  { id: "clothing",      name: "Clothing",      budget: 120,  color: "#a8793f", group: "want" },
  { id: "subscriptions", name: "Subscriptions", budget: 85,   color: "#6b7f8f", group: "want" },
  { id: "misc",          name: "Miscellaneous", budget: 150,  color: "#9a938a", group: "want" },
  { id: "savings",       name: "Savings",       budget: 1100, color: "#14523f", group: "save" },
];

// type: income | expense | saving (a transfer into a goal, not spending)
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", description: "Maya — salary, product designer", category: "income", amount: 4200.00, type: "income" },
  { id: "t02", date: "2026-11-01", description: "Daniel — salary, teacher", category: "income", amount: 2650.00, type: "income" },
  { id: "t03", date: "2026-11-01", description: "Rent — Maple Street apartment", category: "housing", amount: 1850.00, type: "expense" },
  { id: "t04", date: "2026-11-01", description: "Transfer to emergency fund", category: "savings", amount: 600.00, type: "saving" },
  { id: "t05", date: "2026-11-01", description: "Transfer to holiday fund", category: "savings", amount: 250.00, type: "saving" },
  { id: "t06", date: "2026-11-02", description: "Streaming service — monthly", category: "subscriptions", amount: 15.99, type: "expense" },
  { id: "t07", date: "2026-11-02", description: "Gas — Shell, Maple Ave", category: "transport", amount: 48.20, type: "expense" },
  { id: "t08", date: "2026-11-03", description: "Weekly grocery run — GreenMart", category: "groceries", amount: 148.60, type: "expense" },
  { id: "t09", date: "2026-11-03", description: "School supplies — Sofia & Leo", category: "kids", amount: 46.30, type: "expense" },
  { id: "t10", date: "2026-11-04", description: "Pizza night — family", category: "dining", amount: 38.50, type: "expense" },
  { id: "t11", date: "2026-11-05", description: "Internet — Fiber 300", category: "utilities", amount: 65.00, type: "expense" },
  { id: "t12", date: "2026-11-06", description: "Movie night — cinema, 4 tickets", category: "entertainment", amount: 34.00, type: "expense" },
  { id: "t13", date: "2026-11-07", description: "Farmers market — vegetables & fruit", category: "groceries", amount: 62.40, type: "expense" },
  { id: "t14", date: "2026-11-07", description: "Cloud storage — family plan", category: "subscriptions", amount: 9.99, type: "expense" },
  { id: "t15", date: "2026-11-08", description: "Pharmacy — cold medicine & vitamins", category: "health", amount: 24.60, type: "expense" },
  { id: "t16", date: "2026-11-09", description: "Gas — Shell, Maple Ave", category: "transport", amount: 44.75, type: "expense" },
  { id: "t17", date: "2026-11-09", description: "Birthday gift — Aunt Rosa", category: "misc", amount: 35.00, type: "expense" },
  { id: "t18", date: "2026-11-10", description: "Weekly grocery run — GreenMart", category: "groceries", amount: 174.25, type: "expense" },
  { id: "t19", date: "2026-11-10", description: "Piano lessons — Sofia (monthly)", category: "kids", amount: 120.00, type: "expense" },
  { id: "t20", date: "2026-11-11", description: "Lunch with friends — Maya", category: "dining", amount: 27.80, type: "expense" },
  { id: "t21", date: "2026-11-12", description: "Electric bill — October usage", category: "utilities", amount: 132.40, type: "expense" },
  { id: "t22", date: "2026-11-12", description: "Winter coats — Sofia & Leo", category: "clothing", amount: 112.00, type: "expense" },
  { id: "t23", date: "2026-11-13", description: "Board game — family game night", category: "entertainment", amount: 28.50, type: "expense" },
  { id: "t24", date: "2026-11-14", description: "Takeout Thai — Friday dinner", category: "dining", amount: 42.60, type: "expense" },
  { id: "t25", date: "2026-11-14", description: "Music streaming — family plan", category: "subscriptions", amount: 10.99, type: "expense" },
  { id: "t26", date: "2026-11-15", description: "Water bill — October usage", category: "utilities", amount: 48.60, type: "expense" },
  { id: "t27", date: "2026-11-15", description: "Weekly grocery run — GreenMart", category: "groceries", amount: 132.80, type: "expense" },
  { id: "t28", date: "2026-11-15", description: "Transfer to car fund", category: "savings", amount: 250.00, type: "saving" },
  { id: "t29", date: "2026-11-16", description: "Metro cards — Daniel & Maya", category: "transport", amount: 60.00, type: "expense" },
  { id: "t30", date: "2026-11-17", description: "Dentist copay — Leo check-up", category: "health", amount: 85.00, type: "expense" },
  { id: "t31", date: "2026-11-18", description: "Phone — family plan, 2 lines", category: "utilities", amount: 90.00, type: "expense" },
  { id: "t32", date: "2026-11-19", description: "Gas — Shell, Maple Ave", category: "transport", amount: 46.10, type: "expense" },
  { id: "t33", date: "2026-11-20", description: "Family restaurant — Saturday dinner", category: "dining", amount: 86.40, type: "expense" },
  { id: "t34", date: "2026-11-20", description: "Gym membership — Daniel", category: "health", amount: 45.00, type: "expense" },
  { id: "t35", date: "2026-11-21", description: "Weekly grocery run — GreenMart", category: "groceries", amount: 158.90, type: "expense" },
  { id: "t36", date: "2026-11-21", description: "Kids' shoes — Leo", category: "kids", amount: 68.00, type: "expense" },
  { id: "t37", date: "2026-11-22", description: "Concert tickets — community hall", category: "entertainment", amount: 95.00, type: "expense" },
  { id: "t38", date: "2026-11-22", description: "News subscription — monthly", category: "subscriptions", amount: 12.00, type: "expense" },
  { id: "t39", date: "2026-11-23", description: "Parking — downtown", category: "transport", amount: 18.00, type: "expense" },
  { id: "t40", date: "2026-11-24", description: "Weekly grocery run — GreenMart", category: "groceries", amount: 96.30, type: "expense" },
  { id: "t41", date: "2026-11-24", description: "Household items — cleaning & paper", category: "misc", amount: 28.40, type: "expense" },
  { id: "t42", date: "2026-11-25", description: "Coffee & pastries — Sunday morning", category: "dining", amount: 19.75, type: "expense" },
];

export const GOALS = [
  { id: "g1", name: "Emergency fund", note: "3 months of essential spending, kept in a separate savings account.", target: 6000, saved: 4250 },
  { id: "g2", name: "Family holiday — Bali", note: "Flights and a week by the sea next summer, if the fund holds.", target: 2400, saved: 980 },
  { id: "g3", name: "New car down payment", note: "Replacing the 2012 hatchback before the next inspection.", target: 5000, saved: 1750 },
  { id: "g4", name: "Kids' education", note: "Next term's fees and a cushion for school trips.", target: 3000, saved: 640 },
];

export const BILLS = [
  { id: "b1", name: "Rent — Maple Street apartment", amount: 1850.00, dueDay: 1, note: "Auto-debit on the 1st", paid: true },
  { id: "b2", name: "Internet — Fiber 300", amount: 65.00, dueDay: 5, note: "Auto-debit on the 5th", paid: true },
  { id: "b3", name: "Electric — October usage", amount: 132.40, dueDay: 12, note: "Paid by bank transfer", paid: true },
  { id: "b4", name: "Water — October usage", amount: 48.60, dueDay: 15, note: "Paid by bank transfer", paid: true },
  { id: "b5", name: "Phone — family plan, 2 lines", amount: 90.00, dueDay: 18, note: "Auto-debit on the 18th", paid: true },
  { id: "b6", name: "Gym membership — Daniel", amount: 45.00, dueDay: 20, note: "Auto-debit on the 20th", paid: true },
  { id: "b7", name: "Streaming service", amount: 15.99, dueDay: 22, note: "Card on file", paid: true },
  { id: "b8", name: "Car insurance — monthly premium", amount: 118.00, dueDay: 28, note: "Due in 2 days — set aside now", paid: false },
];

export const RULE_503020 = { needs: 50, wants: 30, savings: 20 };
