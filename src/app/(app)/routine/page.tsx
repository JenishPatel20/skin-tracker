"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { getWeekday, getPMRoutineForDay, getTodayString } from "@/lib/utils";
import type { AMSteps, PMSteps } from "@/types";
import { Sun, Moon, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const defaultAM: AMSteps = { cleanser: false, spf: false, moisturizer: false, eye_cream: false, custom: [] };
const defaultPM: PMSteps = { gentle_cleanser: false, la_roche_cleanser: false, mytret: false, moisturizer: false, recovery_routine: false, spot_treatment: false, skipped: false };

export default function RoutinePage() {
  const { setTodayLog } = useAppStore();
  const weekday = getWeekday();
  const pmType = getPMRoutineForDay(weekday);
  const today = getTodayString();

  const [tab, setTab] = useState<"am" | "pm">("am");
  const [am, setAm] = useState<AMSteps>(defaultAM);
  const [pm, setPm] = useState<PMSteps>(defaultPM);
  const [amTime, setAmTime] = useState<string | null>(null);
  const [pmTime, setPmTime] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const amSteps: { key: keyof AMSteps; label: string; desc?: string }[] = [
    { key: "cleanser", label: "Artistry Cleanser", desc: "Gentle morning cleanse" },
    { key: "spf", label: "SPF 30 Matte Moisturizer", desc: "Artistry SPF 30 — don't skip!" },
    { key: "moisturizer", label: "Moisturizer", desc: "If extra hydration needed" },
    { key: "eye_cream", label: "Eye Hydration", desc: "Optional" },
  ];

  const pmStepsConfig: { key: keyof PMSteps; label: string; desc?: string; routine?: string[] }[] = [
    { key: "gentle_cleanser", label: "Artistry Cleanser", desc: "All routines", routine: ["la-roche", "mytret", "recovery"] },
    { key: "la_roche_cleanser", label: "La Roche-Posay Effaclar SA", desc: "La Roche nights only", routine: ["la-roche"] },
    { key: "mytret", label: "MyTret-C (pea-sized)", desc: "Wait 20 min after cleanse", routine: ["mytret"] },
    { key: "moisturizer", label: "Moisturizer", desc: "Optional — all routines", routine: ["la-roche", "mytret", "recovery"] },
    { key: "recovery_routine", label: "Recovery Mode", desc: "Moisturizer only night", routine: ["recovery"] },
    { key: "spot_treatment", label: "Spot Treatment", desc: "Optional targeted treatment" },
    { key: "skipped", label: "Skipped Tonight", desc: "Mark if you skipped PM" },
  ];

  const filteredPM = pmStepsConfig.filter((s) => !s.routine || s.routine.includes(pmType));

  const amDone = Object.entries(am).filter(([k]) => k !== "custom").filter(([, v]) => v).length;
  const amTotal = amSteps.length;
  const pmDone = filteredPM.filter((s) => pm[s.key]).length;
  const pmTotal = filteredPM.length;

  function toggleAM(key: keyof AMSteps) {
    if (key === "custom") return;
    const updated = { ...am, [key]: !am[key] };
    setAm(updated);
    if (!amTime) setAmTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setTodayLog({ am_steps: updated, am_completed: Object.values(updated).some(Boolean) });
  }

  function togglePM(key: keyof PMSteps) {
    const updated = { ...pm, [key]: !pm[key] };
    setPm(updated);
    if (!pmTime) setPmTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setTodayLog({ pm_steps: updated, pm_completed: Object.values(updated).some(Boolean) });
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const routineLabels: Record<string, { label: string; color: string }> = {
    "la-roche": { label: "La Roche Night", color: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
    mytret: { label: "MyTret Night", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    recovery: { label: "Recovery Night", color: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  };

  return (
    <div className="px-4 pt-4">
      <Header title="Daily Routine" subtitle={`${weekday} — ${today}`} />

      {/* Routine warning */}
      {pmType === "mytret" && (
        <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            <strong>MyTret night:</strong> Wait 15–20 minutes after cleansing before applying. Use only a pea-sized amount. No La Roche tonight.
          </p>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex rounded-xl bg-white/5 p-1 mt-4 mb-4">
        {(["am", "pm"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              tab === t ? "bg-[var(--teal)] text-[hsl(222,47%,6%)]" : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {t === "am" ? <Sun size={14} /> : <Moon size={14} />}
            {t.toUpperCase()} Routine
          </button>
        ))}
      </div>

      {tab === "am" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sun size={15} className="text-amber-400" />
                Morning Routine
              </CardTitle>
              {amTime && (
                <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                  <Clock size={11} /> {amTime}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">{amDone} / {amTotal} steps</span>
              <span className="text-xs font-semibold text-[var(--teal)]">{Math.round((amDone / amTotal) * 100)}%</span>
            </div>
            <Progress value={amDone} max={amTotal} className="mb-5" />
            <div className="flex flex-col gap-2">
              {amSteps.map(({ key, label, desc }) => (
                <Toggle
                  key={key}
                  checked={!!am[key as keyof typeof am]}
                  onChange={() => toggleAM(key)}
                  label={label}
                  description={desc}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Moon size={15} className="text-indigo-400" />
                Evening Routine
              </CardTitle>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${routineLabels[pmType].color}`}>
                {routineLabels[pmType].label}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">{pmDone} / {pmTotal} steps</span>
              {pmTime && (
                <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                  <Clock size={11} /> {pmTime}
                </span>
              )}
            </div>
            <Progress value={pmDone} max={pmTotal} className="mb-5" />
            <div className="flex flex-col gap-2">
              {filteredPM.map(({ key, label, desc }) => (
                <Toggle
                  key={key}
                  checked={!!pm[key]}
                  onChange={() => togglePM(key)}
                  label={label}
                  description={desc}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
        >
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : "Save Routine"}
        </Button>
      </div>

      {/* Weekly schedule */}
      <Card className="mt-4 mb-4">
        <CardHeader>
          <CardTitle className="text-sm">PM Rotation Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
              const r = getPMRoutineForDay(d === "Mon" ? "Monday" : d === "Tue" ? "Tuesday" : d === "Wed" ? "Wednesday" : d === "Thu" ? "Thursday" : d === "Fri" ? "Friday" : d === "Sat" ? "Saturday" : "Sunday");
              const colors = { "la-roche": "bg-sky-500/20 text-sky-400", mytret: "bg-amber-500/20 text-amber-400", recovery: "bg-violet-500/20 text-violet-400" };
              const isToday = d === weekday.slice(0, 3);
              return (
                <div key={d} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${isToday ? "border border-[var(--teal)]/40" : ""}`}>
                  <span className={`text-[10px] font-medium ${isToday ? "text-[var(--teal)]" : "text-[hsl(var(--muted-foreground))]"}`}>{d}</span>
                  <div className={`w-6 h-6 rounded-full ${colors[r]} flex items-center justify-center`}>
                    <span className="text-[8px] font-bold">{r === "la-roche" ? "LR" : r === "mytret" ? "MT" : "R"}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-full bg-sky-400" />La Roche</span>
            <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-full bg-amber-400" />MyTret</span>
            <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-full bg-violet-400" />Recovery</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
