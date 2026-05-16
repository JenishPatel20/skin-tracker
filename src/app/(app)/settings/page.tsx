"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import {
  User, Bell, Shield, Moon, Sun, LogOut, ChevronRight, Droplets,
  Flame, Star, Clock, AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme, habitStats } = useAppStore();
  const [notifications, setNotifications] = useState({
    am_reminder: true,
    pm_reminder: true,
    hydration: false,
    weekly_photo: true,
    pillowcase: false,
  });

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Settings" subtitle="Preferences & account" />

      <div className="mt-4 flex flex-col gap-4">
        {/* Streak stats */}
        {habitStats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame size={15} className="text-orange-400" />
                Habit Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Current Streak", value: habitStats.current_streak + "d", icon: <Flame size={14} className="text-orange-400" /> },
                  { label: "Longest Streak", value: habitStats.longest_streak + "d", icon: <Star size={14} className="text-amber-400" /> },
                  { label: "Total Logs", value: String(habitStats.total_logs), icon: <Droplets size={14} className="text-[var(--teal)]" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-white/5 rounded-xl py-3">
                    {icon}
                    <span className="text-lg font-bold">{value}</span>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm">Weekly completion</span>
                <span className="text-sm font-bold text-[var(--teal)]">{habitStats.weekly_completion}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => theme !== t && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                    theme === t ? "bg-[var(--teal)]/15 border-[var(--teal)]/40 text-[var(--teal)]" : "bg-white/5 border-white/10 text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  {t === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell size={14} className="text-[var(--teal)]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[
              { key: "am_reminder" as const, label: "AM Routine Reminder", desc: "7:30 AM daily" },
              { key: "pm_reminder" as const, label: "PM Routine Reminder", desc: "9:30 PM daily" },
              { key: "hydration" as const, label: "Hydration Reminder", desc: "Every 2 hours" },
              { key: "weekly_photo" as const, label: "Weekly Photo Reminder", desc: "Sunday mornings" },
              { key: "pillowcase" as const, label: "Pillowcase Reminder", desc: "Every 3 days" },
            ].map(({ key, label, desc }) => (
              <Toggle
                key={key}
                checked={notifications[key]}
                onChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
                label={label}
                description={desc}
              />
            ))}
          </CardContent>
        </Card>

        {/* Routine settings link */}
        <Card>
          <CardContent className="pt-4">
            <button className="w-full flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-[var(--teal)]/15 flex items-center justify-center">
                <Clock size={16} className="text-[var(--teal)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Customize Routines</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Edit your AM/PM product list</p>
              </div>
              <ChevronRight size={16} className="text-[hsl(var(--muted-foreground))]" />
            </button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardContent className="pt-4 flex flex-col gap-2">
            <button className="w-full flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                <User size={16} className="text-[hsl(var(--muted-foreground))]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Account</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Manage your profile</p>
              </div>
              <ChevronRight size={16} className="text-[hsl(var(--muted-foreground))]" />
            </button>
            <button className="w-full flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                <Shield size={16} className="text-[hsl(var(--muted-foreground))]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Privacy & Data</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Export or delete your data</p>
              </div>
              <ChevronRight size={16} className="text-[hsl(var(--muted-foreground))]" />
            </button>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
          <LogOut size={14} /> Sign Out
        </Button>

        <p className="text-center text-xs text-[hsl(var(--muted-foreground))] pb-2">
          SkinTrack AI v1.0.0 · Built with care
        </p>
      </div>
    </div>
  );
}
