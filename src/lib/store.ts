import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DailyLog, SymptomEntry, LifestyleEntry, HabitStats } from "@/types";

interface AppState {
  todayLog: Partial<DailyLog> | null;
  todaySymptoms: Partial<SymptomEntry> | null;
  todayLifestyle: Partial<LifestyleEntry> | null;
  habitStats: HabitStats | null;
  skinScore: number;
  theme: "dark" | "light";
  setTodayLog: (log: Partial<DailyLog>) => void;
  setTodaySymptoms: (s: Partial<SymptomEntry>) => void;
  setTodayLifestyle: (l: Partial<LifestyleEntry>) => void;
  setHabitStats: (h: HabitStats) => void;
  setSkinScore: (score: number) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      todayLog: null,
      todaySymptoms: null,
      todayLifestyle: null,
      habitStats: null,
      skinScore: 0,
      theme: "dark",
      setTodayLog: (log) => set({ todayLog: log }),
      setTodaySymptoms: (s) => set({ todaySymptoms: s }),
      setTodayLifestyle: (l) => set({ todayLifestyle: l }),
      setHabitStats: (h) => set({ habitStats: h }),
      setSkinScore: (score) => set({ skinScore: score }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
    }),
    { name: "skintrack-store" }
  )
);
