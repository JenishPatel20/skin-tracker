"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { useAppStore } from "@/lib/store";
import { getWeekday, getTodayString, getPMRoutineForDay, formatDate } from "@/lib/utils";
import { generateInsights } from "@/lib/insights";
import type { SymptomEntry, LifestyleEntry, DailyLog, AIInsight } from "@/types";
import {
  Flame, CheckCircle2, AlertTriangle, Camera, Plus, Sun, Moon,
  Droplets, TrendingUp, TrendingDown, Minus, Clock, Star,
} from "lucide-react";

const MOCK_STREAK = 12;
const MOCK_SCORE = 74;
const MOCK_WEEKLY_PCT = 86;

export default function DashboardPage() {
  const { todayLog, skinScore, setSkinScore, setHabitStats } = useAppStore();
  const today = getTodayString();
  const weekday = getWeekday();
  const pmRoutine = getPMRoutineForDay(weekday);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    setSkinScore(MOCK_SCORE);
    setHabitStats({
      current_streak: MOCK_STREAK,
      longest_streak: 21,
      am_streak: 14,
      pm_streak: MOCK_STREAK,
      weekly_completion: MOCK_WEEKLY_PCT,
      total_logs: 38,
    });

    const mockSymptoms: SymptomEntry[] = [
      { id: "1", user_id: "", date: today, oiliness: 6, dryness: 3, burning: 2, sensitivity: 3,
        redness: 4, irritation: 3, itching: 2, new_pimples: 2, painful_acne: 1, whiteheads: 1,
        blackhead_severity: 4, forehead_congestion: 5, beard_irritation: 2, dark_spot_severity: 3,
        overall_trend: "better", created_at: today },
    ];
    setInsights(generateInsights(mockSymptoms, [], []));
  }, []);

  const amChecked = todayLog?.am_steps;
  const pmChecked = todayLog?.pm_steps;
  const amCount = amChecked ? Object.values(amChecked).filter(Boolean).length : 0;
  const pmCount = pmChecked ? Object.values(pmChecked).filter(Boolean).length : 0;

  return (
    <div className="px-4 pt-4 pb-2">
      <Header title="SkinTrack AI" subtitle={`${weekday}, ${formatDate(new Date())}`} showSettings />

      <div className="mt-4 flex flex-col gap-4">
        {/* Score + Streak row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col items-center py-5 teal-glow">
            <ScoreRing score={skinScore || MOCK_SCORE} size={100} />
          </Card>
          <div className="flex flex-col gap-3">
            <Card className="flex-1 flex flex-col items-center justify-center py-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Flame size={18} className="text-orange-400" />
                <span className="text-2xl font-bold tabular-nums">{MOCK_STREAK}</span>
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Day Streak</span>
            </Card>
            <Card className="flex-1 flex flex-col items-center justify-center py-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Star size={16} className="text-amber-400" />
                <span className="text-2xl font-bold tabular-nums">{MOCK_WEEKLY_PCT}%</span>
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">This Week</span>
            </Card>
          </div>
        </div>

        {/* Today's Routines */}
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
                  <span key={step} className={`text-xs px-2.5 py-1 rounded-full border ${done ? "bg-[var(--teal)]/15 border-[var(--teal)]/30 text-[var(--teal)]" : "bg-white/5 border-white/10 text-[hsl(var(--muted-foreground))]"}`}>
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Moon size={16} className="text-indigo-400" /> PM Routine
              </CardTitle>
              <Badge variant={pmRoutine === "la-roche" ? "default" : pmRoutine === "mytret" ? "warning" : "muted"}>
                {pmRoutine === "la-roche" ? "La Roche Night" : pmRoutine === "mytret" ? "MyTret Night" : "Recovery Night"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">
              {pmRoutine === "la-roche" && "La Roche-Posay Effaclar SA cleanser + optional moisturizer"}
              {pmRoutine === "mytret" && "Artistry cleanser → 20 min wait → MyTret-C (pea-sized) → optional moisturizer"}
              {pmRoutine === "recovery" && "Artistry cleanser + moisturizer only"}
            </p>
            <Link href="/routine">
              <Button variant="outline" className="w-full" size="sm">
                <CheckCircle2 size={14} /> Log PM Routine
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/symptoms" className="contents">
            <Card className="flex flex-col items-center gap-2 py-4 hover:border-[var(--teal)]/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center">
                <Plus size={18} className="text-rose-400" />
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))] text-center">Track Symptoms</span>
            </Card>
          </Link>
          <Link href="/photos" className="contents">
            <Card className="flex flex-col items-center gap-2 py-4 hover:border-[var(--teal)]/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-violet-500/15 flex items-center justify-center">
                <Camera size={18} className="text-violet-400" />
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))] text-center">Add Photo</span>
            </Card>
          </Link>
          <Link href="/lifestyle" className="contents">
            <Card className="flex flex-col items-center gap-2 py-4 hover:border-[var(--teal)]/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-sky-500/15 flex items-center justify-center">
                <Droplets size={18} className="text-sky-400" />
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))] text-center">Lifestyle</span>
            </Card>
          </Link>
        </div>

        {/* AI Insights preview */}
        {insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp size={15} className="text-[var(--teal)]" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {insights.slice(0, 2).map((insight) => (
                <div key={insight.id} className={`rounded-xl p-3 border ${
                  insight.insight_type === "improvement" ? "bg-emerald-500/10 border-emerald-500/20" :
                  insight.insight_type === "warning" ? "bg-amber-500/10 border-amber-500/20" :
                  "bg-[var(--teal)]/10 border-[var(--teal)]/20"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {insight.insight_type === "improvement" ? <TrendingUp size={13} className="text-emerald-400" /> :
                     insight.insight_type === "warning" ? <AlertTriangle size={13} className="text-amber-400" /> :
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
        )}

        {/* Schedule reminder */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--teal)]/15 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[var(--teal)]" />
              </div>
              <div>
                <p className="text-sm font-medium">Weekly Photo Reminder</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Take comparison photos every Sunday for best results.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
