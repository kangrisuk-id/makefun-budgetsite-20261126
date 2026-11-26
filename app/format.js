// Formatting helpers — one job: turn raw numbers and ISO dates into the
// strings the pages show. All money is USD, whole dollars in summaries,
// cents in transaction rows.

export function money(amount, cents = false) {
  const value = Number(amount) || 0;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

export function signedMoney(amount, cents = false) {
  const value = Number(amount) || 0;
  return (value < 0 ? "−" : "+") + money(Math.abs(value), cents);
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function shortDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}`;
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
