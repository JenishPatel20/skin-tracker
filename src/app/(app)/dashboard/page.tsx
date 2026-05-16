"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { useAppStore } from "@/lib/store";
import { getWeekday, getTodayString, getPMRoutineForDay, formatDate } from "@/lib/utils";
import { generateInsights } from "@/lib/insights";
import { getRecentLogs, getRecentSymptoms, getRecentLifestyle, computeHabitStats, computeSkinScore } from "@/lib/api";
import type { AIInsight } from "@/types";
import {
  Flame, CheckCircle2, AlertTriangle, Camera, Plus, Sun, Moon,
  Droplets, TrendingUp, Minus, Clock, Star, Loader2, NotebookPen,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function DashboardPage() {
  const { todayLog, skinScore, setSkinScore, setHabitStats, habitStats } = useAppStore();
  const today = getTodayString();
  const weekday = getWeekday();
  const pmRoutine = getPMRoutineForDay(weekday);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [logs, symptoms, lifestyle] = await Promise.all([
          getRecentLogs(30),
          getRecentSymptoms(30),
          getRecentLifestyle(30),
        ]);
        const stats = await computeHabitStats(logs);
        const score = computeSkinScore(logs, symptoms);
        setHabitStats(stats);
        setSkinScore(score);
        setInsights(generateInsights(symptoms, lifestyle, logs));
      } catch {
        // no data yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const amChecked = todayLog?.am_steps;
  const amCount = amChecked ? Object.values(amChecked).filter(Boolean).length : 0;
  const streak = habitStats?.current_streak ?? 0;
  const weeklyPct = habitStats?.weekly_completion ?? 0;

  const pmRoutineInfo = {
    "la-roche": { label: "La Roche Night", badgeVariant: "default" as const, desc: "La Roche-Posay Effaclar SA + optional moisturizer" },
    mytret:     { label: "MyTret Night",   badgeVariant: "warning" as const, desc: "Artistry → 20 min wait → MyTret-C (pea-sized)" },
    recovery:   { label: "Recovery Night", badgeVariant: "muted"   as const, desc: "Artistry cleanser + moisturizer only" },
  }[pmRoutine];

  return (
    <motion.div
      className="px-4 pt-4 pb-2"
      initial="hidden" animate="show"
      variants={container}
    >
      <motion.div variants={fade}>
        <Header title="SkinTrack AI" subtitle={`${weekday}, ${formatDate(new Date())}`} showSettings />
      </motion.div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Score + Streak */}
        <motion.div variants={fade} className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col items-center py-5 teal-glow relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 60%, rgba(20,184,166,0.25) 0%, transparent 70%)" }}
            />
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 size={24} className="animate-spin text-[var(--teal)]" />
              </div>
            ) : (
              <ScoreRing score={skinScore} size={100} />
            )}
          </Card>
          <div className="flex flex-col gap-3">
            <Card className="flex-1 flex flex-col items-center justify-center py-3 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 100%, rgba(251,146,60,0.2) 0%, transparent 70%)" }}
              />
              <div className="flex items-center gap-1.5 mb-0.5">
                <Flame size={18} className="text-orange-400" />
                <span className="text-2xl font-bold tabular-nums">{streak}</span>
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Day Streak</span>
            </Card>
            <Card className="flex-1 flex flex-col items-center justify-center py-3 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 100%, rgba(251,191,36,0.2) 0%, transparent 70%)" }}
              />
              <div className="flex items-center gap-1.5 mb-0.5">
                <Star size={16} className="text-amber-400" />
                <span className="text-2xl font-bold tabular-nums">{weeklyPct}%</span>
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">This Week</span>
            </Card>
          </div>
        </motion.div>

        {/* AM Routine card */}
        <motion.div variants={fade}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sun size={16} className="text-amber-400" /> AM Routine
                </CardTitle>
                <Badge variant={amCount > 0 ? "success" : "muted"}>{amCount > 0 ? "Started" : "Pending"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={amCount} max={4} className="mb-3" />
              <div className="flex flex-wrap gap-2 mb-4">
                {["Cleanser", "SPF", "Moisturizer", "Eye Cream"].map((step, i) => {
                  const done = amCount > i;
                  return (
                    <span
                      key={step}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        done
                          ? "bg-[var(--teal)]/15 border-[var(--teal)]/30 text-[var(--teal)]"
                          : "bg-white/5 border-white/10 text-[hsl(var(--muted-foreground))]"
                      }`}
                    >
                      {step}
                    </span>
                  );
                })}
              </div>
              <Link href="/routine">
                <Button variant="outline" className="w-full" size="sm">
                  <CheckCircle2 size={14} /> Log AM Routine
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* PM Routine card */}
        <motion.div variants={fade}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Moon size={16} className="text-indigo-400" /> PM Routine
                </CardTitle>
                <Badge variant={pmRoutineInfo.badgeVariant}>{pmRoutineInfo.label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">{pmRoutineInfo.desc}</p>
              <Link href="/routine">
                <Button variant="outline" className="w-full" size="sm">
                  <CheckCircle2 size={14} /> Log PM Routine
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fade} className="grid grid-cols-3 gap-3">
          {[
            { href: "/symptoms", icon: Plus,     iconClass: "text-rose-400",   bg: "bg-rose-500/12 border-rose-500/15",    label: "Track Symptoms" },
            { href: "/photos",   icon: Camera,   iconClass: "text-violet-400", bg: "bg-violet-500/12 border-violet-500/15", label: "Add Photo" },
            { href: "/lifestyle",icon: Droplets, iconClass: "text-sky-400",    bg: "bg-sky-500/12 border-sky-500/15",       label: "Lifestyle" },
          ].map(({ href, icon: Icon, iconClass, bg, label }) => (
            <Link key={href} href={href} className="contents">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2.5 py-4 rounded-2xl border bg-white/3 border-white/8 hover:bg-white/5 hover:border-[var(--teal)]/20 transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${bg}`}>
                  <Icon size={18} className={iconClass} />
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))] text-center leading-tight">{label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <motion.div variants={fade}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp size={15} className="text-[var(--teal)]" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {insights.slice(0, 2).map((insight) => (
                  <div
                    key={insight.id}
                    className={`rounded-2xl p-3.5 border ${
                      insight.insight_type === "improvement" ? "bg-emerald-500/8 border-emerald-500/18" :
                      insight.insight_type === "warning"     ? "bg-amber-500/8 border-amber-500/18" :
                                                              "bg-[var(--teal)]/8 border-[var(--teal)]/18"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {insight.insight_type === "improvement" ? <TrendingUp size={13} className="text-emerald-400" /> :
                       insight.insight_type === "warning"     ? <AlertTriangle size={13} className="text-amber-400" /> :
                                                                <Minus size={13} className="text-[var(--teal)]" />}
                      <span className="text-xs font-semibold">{insight.title}</span>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{insight.body}</p>
                  </div>
                ))}
                <Link href="/insights">
                  <Button variant="ghost" className="w-full" size="sm">View All Insights</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Notes reminder */}
        <motion.div variants={fade}>
          <Card className="mb-2">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <NotebookPen size={17} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Log Today's Note</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Add a skin observation when you track symptoms.</p>
                </div>
                <Link href="/symptoms" className="ml-auto">
                  <Button variant="ghost" size="sm" className="shrink-0">Add</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly photo reminder */}
        <motion.div variants={fade}>
          <Card className="mb-2">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--teal)]/12 border border-[var(--teal)]/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={17} className="text-[var(--teal)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">Weekly Photo Reminder</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Take comparison photos every Sunday for best results.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
