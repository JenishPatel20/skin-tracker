import { createClient } from "@/lib/supabase/client";
import type { DailyLog, SymptomEntry, LifestyleEntry, PhotoEntry, HabitStats } from "@/types";

// ── Daily Logs ───────────────────────────────────────────────────

export async function upsertDailyLog(log: Partial<DailyLog> & { date: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("daily_logs")
    .upsert({ ...log, user_id: user.id, updated_at: new Date().toISOString() }, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) throw error;
  return data as DailyLog;
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  return data as DailyLog | null;
}

export async function getRecentLogs(days = 30): Promise<DailyLog[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", since)
    .order("date", { ascending: true });

  return (data ?? []) as DailyLog[];
}

// ── Symptom Entries ──────────────────────────────────────────────

export async function upsertSymptoms(entry: Partial<SymptomEntry> & { date: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("symptom_entries")
    .upsert({ ...entry, user_id: user.id }, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) throw error;
  return data as SymptomEntry;
}

export async function getSymptomEntry(date: string): Promise<SymptomEntry | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("symptom_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  return data as SymptomEntry | null;
}

export async function getRecentSymptoms(days = 30): Promise<SymptomEntry[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
  const { data } = await supabase
    .from("symptom_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", since)
    .order("date", { ascending: true });

  return (data ?? []) as SymptomEntry[];
}

// ── Lifestyle Entries ────────────────────────────────────────────

export async function upsertLifestyle(entry: Partial<LifestyleEntry> & { date: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("lifestyle_entries")
    .upsert({ ...entry, user_id: user.id }, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) throw error;
  return data as LifestyleEntry;
}

export async function getLifestyleEntry(date: string): Promise<LifestyleEntry | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("lifestyle_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  return data as LifestyleEntry | null;
}

export async function getRecentLifestyle(days = 30): Promise<LifestyleEntry[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
  const { data } = await supabase
    .from("lifestyle_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", since)
    .order("date", { ascending: true });

  return (data ?? []) as LifestyleEntry[];
}

// ── Habit Stats ──────────────────────────────────────────────────

export async function computeHabitStats(logs: DailyLog[]): Promise<HabitStats> {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().split("T")[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let run = 0;

  for (let i = sorted.length - 1; i >= 0; i--) {
    const log = sorted[i];
    const expected = new Date(Date.now() - (sorted.length - 1 - i) * 86400000)
      .toISOString().split("T")[0];
    if (log.am_completed || log.pm_completed) {
      run++;
      longestStreak = Math.max(longestStreak, run);
      if (i === sorted.length - 1) currentStreak = run;
    } else {
      if (i === sorted.length - 1) currentStreak = 0;
      run = 0;
    }
  }

  const last7 = sorted.slice(-7);
  const weeklyCompletion = last7.length > 0
    ? Math.round((last7.filter((l) => l.am_completed && l.pm_completed).length / 7) * 100)
    : 0;

  const amStreak = sorted.slice().reverse().findIndex((l) => !l.am_completed);
  const pmStreak = sorted.slice().reverse().findIndex((l) => !l.pm_completed);

  return {
    current_streak: currentStreak,
    longest_streak: longestStreak,
    am_streak: amStreak === -1 ? sorted.length : amStreak,
    pm_streak: pmStreak === -1 ? sorted.length : pmStreak,
    weekly_completion: weeklyCompletion,
    total_logs: sorted.length,
  };
}

export function computeSkinScore(
  logs: DailyLog[],
  symptoms: SymptomEntry[]
): number {
  if (logs.length === 0) return 0;

  const last7Logs = logs.slice(-7);
  const adherence = last7Logs.filter((l) => l.am_completed && l.pm_completed).length / 7;

  const recent = symptoms.slice(-7);
  const avgAcne = recent.length > 0
    ? recent.reduce((s, e) => s + e.new_pimples, 0) / recent.length
    : 5;
  const avgIrritation = recent.length > 0
    ? recent.reduce((s, e) => s + e.irritation, 0) / recent.length
    : 5;
  const avgOil = recent.length > 0
    ? recent.reduce((s, e) => s + e.oiliness, 0) / recent.length
    : 5;

  const acneScore = Math.max(0, 1 - avgAcne / 10);
  const irritationScore = Math.max(0, 1 - avgIrritation / 10);
  const oilScore = Math.max(0, 1 - avgOil / 10);

  const trend = recent.length > 0 ? recent[recent.length - 1].overall_trend : "same";
  const trendBonus = trend === "better" ? 0.05 : trend === "worse" ? -0.05 : 0;

  const raw =
    adherence * 0.35 +
    acneScore * 0.30 +
    irritationScore * 0.20 +
    oilScore * 0.15 +
    trendBonus;

  return Math.round(Math.min(100, Math.max(0, raw * 100)));
}
