import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getWeekday(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export function getPMRoutineForDay(day: string): "la-roche" | "mytret" | "recovery" {
  const map: Record<string, "la-roche" | "mytret" | "recovery"> = {
    Friday: "la-roche",
    Monday: "la-roche",
    Wednesday: "la-roche",
    Saturday: "mytret",
    Tuesday: "mytret",
    Thursday: "mytret",
    Sunday: "recovery",
  };
  return map[day] ?? "recovery";
}

export function scoreToColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}
