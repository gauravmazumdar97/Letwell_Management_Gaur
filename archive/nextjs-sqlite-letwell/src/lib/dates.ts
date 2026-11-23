import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export function formatUkDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "d MMMM yyyy", { locale: enGB });
}

export function formatUkShortDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "dd/MM/yyyy", { locale: enGB });
}

/**
 * Due-date rule for rent charges (Week 3 generation).
 * If `dueDay` does not exist in the month, clamp to the last day of that month.
 */
export function rentDueDate(year: number, monthIndexZeroBased: number, dueDay: number): Date {
  const lastDay = new Date(year, monthIndexZeroBased + 1, 0).getDate();
  const day = Math.min(dueDay, lastDay);
  return new Date(year, monthIndexZeroBased, day, 12, 0, 0, 0);
}
