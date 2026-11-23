/** Money helpers. All persisted amounts are integer pence. */

export function formatGbpFromPence(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100);
}
