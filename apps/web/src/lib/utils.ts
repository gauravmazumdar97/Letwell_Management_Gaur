import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatGbpFromPence(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function pricingUnitLabel(unit: string): string {
  switch (unit) {
    case "MONTHLY":
      return "pcm";
    case "DAILY":
      return "per day";
    case "NIGHTLY":
      return "per night";
    case "EVENT":
      return "per event";
    default:
      return unit.toLowerCase();
  }
}
