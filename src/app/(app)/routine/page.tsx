"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { getWeekday, getPMRoutineForDay, getTodayString } from "@/lib/utils";
import { getDailyLog, upsertDailyLog } from "@/lib/api";
import type { AMSteps, PMSteps } from "@/types";
import {
  Sun, Moon, CheckCircle2, Clock, AlertTriangle,
  Loader2, ChevronLeft, ChevronRight, CalendarDays,
} from "lucide-react";

const defaultAM: AMSteps = { cleanser: false, spf: false, moisturizer: false, eye_cream: false, custom: [] };
const defaultPM: PMSteps = {
  gentle_cleanser: false, la_roche_cleanser: false, mytret: false,
  moisturizer: false, recovery_routine: false, spot_treatment: false, skipped: false,
};

function buildDateStrip() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split("T")[0];
    const isToday = i === 6;
    return {
      iso,
      dayNum: d.getDate(),
      dayShort: isToday ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });
}

function weekdayFromIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return getWeekday(new Date(y, m - 1, d));
}

const STRIP = buildDateStrip();

const amStepsList: { key: keyof AMSteps; label: string; desc?: string }[] = [
  { key: "cleanser",   label: "Artistry Cleanser",        desc: "Gentle morning cleanse" },
  { key: "spf",        label: "SPF 30 Matte Moisturizer", desc: "Artistry SPF 30 — don't skip!" },
  { key: "moisturizer",label: "Moisturizer",              desc: "If extra hydration needed" },
  { key: "eye_cream",  label: "Eye Hydration",            desc: "Optional" },
];

const allPmSteps: { key: keyof PMSteps; label: string; desc?: string; routine?: string[] }[] = [
  { key: "gentle_cleanser",  label: "Artistry Cleanser",        desc: "All routines",                routine: ["la-roche","mytret","recovery"] },
  { key: "la_roche_cleanser",label: "La Roche-Posay Effaclar SA",desc: "La Roche nights only",       routine: ["la-roche"] },
  { key: "mytret",           label: "MyTret-C (pea-sized)",     desc: "Wait 20 min after cleanse",   routine: ["mytret"] },
  { key: "moisturizer",      label: "Moisturizer",              desc: "Optional — all routines",      routine: ["la-roche","mytret","recovery"] },
  { key: "recovery_routine", label: "Recovery Mode",            desc: "Moisturizer only night",       routine: ["recovery"] },
  { key: "spot_treatment",   label: "Spot Treatment",           desc: "Optional targeted treatment" },
  { key: "skipped",          label: "Skipped Tonight",          desc: "Mark if you skipped PM" },
];

const routineLabels: Record<string, { label: string; colorClass: string }> = {
  "la-roche": { label: "La Roche Night",  colorClass: "bg-sky-500/15 text-sky-400 border-sky-500/25" },
  mytret:     { label: "MyTret Night",    colorClass: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  recovery:   { label: "Recovery Night",  colorClass: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
};

export default function RoutinePage() {
  const { setTodayLog } = useAppStore();
  const todayIso = getTodayString();

  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [tab, setTab]       = useState<"am" | "pm">("am");
  const [am, setAm]         = useState<AMSteps>(defaultAM);
  const [pm, setPm]         = useState<PMSteps>(defaultPM);
  const [amTime, setAmTime] = useState<string | null>(null);
  const [pmTime, setPmTime] = useState<string | null>(null);
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedWeekday = weekdayFromIso(selectedDate);
  const pmType = getPMRoutineForDay(selectedWeekday);
  const isToday = selectedDate === todayIso;
  const filteredPM = allPmSteps.filter((s) => !s.routine || s.routine.includes(pmType));

  useEffect(() => {
    setLoading(true);
    setAm(defaultAM);
    setPm(defaultPM);
    setAmTime(null);
    setPmTime(null);
    getDailyLog(selectedDate).then((log) => {
      if (!log) { setLoading(false); return; }
      if (log.am_steps) setAm(log.am_steps);
      if (log.pm_steps) setPm(log.pm_steps);
      setLoading(false);
    });
  }, [selectedDate]);

  const amDone  = Object.entries(am).filter(([k]) => k !== "custom").filter(([, v]) => v).length;
  const amTotal = amStepsList.length;
  const pmDone  = filteredPM.filter((s) => pm[s.key]).length;
  const pmTotal = filteredPM.length;

  function toggleAM(key: keyof AMSteps) {
    if (key === "custom") return;
    const updated = { ...am, [key]: !am[key] };
    setAm(updated);
    if (!amTime && isToday) setAmTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    if (isToday) setTodayLog({ am_steps: updated, am_completed: Object.values(updated).some(Boolean) });
  }

  function togglePM(key: keyof PMSteps) {
    const updated = { ...pm, [key]: !pm[key] };
    setPm(updated);
    if (!pmTime && isToday) setPmTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    if (isToday) setTodayLog({ pm_steps: updated, pm_completed: Object.values(updated).some(Boolean) });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const log = await upsertDailyLog({
        date: selectedDate,
        am_steps: am,
        pm_steps: pm,
        am_completed: Object.entries(am).filter(([k]) => k !== "custom").some(([, v]) => v),
        pm_completed: Object.values(pm).some(Boolean),
        pm_routine_type: pmType,
      });
      if (isToday) setTodayLog(log);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
  const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } };

  return (
    <motion.div
      className="px-4 pt-4 pb-6"
      initial="hidden" animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      <motion.div variants={fade}>
        <Header title="Daily Routine" subtitle={`${selectedWeekday} — ${selectedDate}`} />
      </motion.div>

      {/* Date strip */}
      <motion.div variants={fade} className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={14} className="text-[hsl(var(--muted-foreground))]" />
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
            Edit a previous day
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STRIP.map(({ iso, dayNum, dayShort }) => {
            const active = iso === selectedDate;
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3.5 py-2.5 rounded-2xl transition-all duration-200 border ${
                  active
                    ? "border-[var(--teal)]/30 text-[hsl(var(--primary-foreground))]"
                    : "bg-white/5 border-white/8 text-[hsl(var(--muted-foreground))] hover:bg-white/8"
                }`}
                style={active ? { background: "linear-gradient(145deg, var(--teal), var(--mint))" } : undefined}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider">{dayShort}</span>
                <span className="text-lg font-bold tabular-nums leading-tight">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Past-day banner */}
      <AnimatePresence>
        {!isToday && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-violet-500/10 border border-violet-500/20 p-3 flex items-center gap-3 overflow-hidden"
          >
            <CalendarDays size={15} className="text-violet-400 flex-shrink-0" />
            <p className="text-xs text-violet-300 font-medium">
              Editing {selectedWeekday}, {selectedDate} — changes save to that day
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MyTret warning */}
      <AnimatePresence>
        {pmType === "mytret" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-3 overflow-hidden"
          >
            <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              <strong>MyTret night:</strong> Wait 15–20 min after cleansing. Pea-sized only. No La Roche tonight.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AM / PM tab toggle */}
      <motion.div variants={fade} className="mt-4 mb-4">
        <div className="flex rounded-2xl bg-white/5 border border-white/8 p-1 gap-1">
          {(["am", "pm"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 overflow-hidden ${
                tab === t ? "text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--mint) 100%)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t === "am" ? <Sun size={14} /> : <Moon size={14} />}
                {t.toUpperCase()} Routine
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div
          variants={fade}
          className="flex items-center justify-center py-16 text-[hsl(var(--muted-foreground))]"
        >
          <Loader2 size={24} className="animate-spin text-[var(--teal)]" />
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {tab === "am" ? (
            <motion.div
              key="am"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sun size={15} className="text-amber-400" /> Morning Routine
                    </CardTitle>
                    {amTime && isToday && (
                      <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                        <Clock size={11} /> {amTime}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{amDone} / {amTotal} steps</span>
                    <span className="text-xs font-bold text-[var(--teal)]">{Math.round((amDone / amTotal) * 100)}%</span>
                  </div>
                  <Progress value={amDone} max={amTotal} className="mb-5" />
                  <div className="flex flex-col gap-2">
                    {amStepsList.map(({ key, label, desc }) => (
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
            </motion.div>
          ) : (
            <motion.div
              key="pm"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Moon size={15} className="text-indigo-400" /> Evening Routine
                    </CardTitle>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${routineLabels[pmType].colorClass}`}>
                      {routineLabels[pmType].label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{pmDone} / {pmTotal} steps</span>
                    {pmTime && isToday && (
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
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <motion.div variants={fade} className="mt-4">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <><CheckCircle2 size={16} /> {isToday ? "Saved!" : `Saved for ${selectedDate}`}</>
          ) : (
            isToday ? "Save Routine" : `Save for ${selectedWeekday}`
          )}
        </Button>
      </motion.div>

      {/* PM rotation schedule */}
      <motion.div variants={fade}>
        <Card className="mt-4 mb-4">
          <CardHeader>
            <CardTitle className="text-sm">PM Rotation Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => {
                const full = { Mon:"Monday",Tue:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Fri:"Friday",Sat:"Saturday",Sun:"Sunday" }[d]!;
                const r = getPMRoutineForDay(full);
                const colors = {
                  "la-roche": "bg-sky-500/20 text-sky-400",
                  mytret:     "bg-amber-500/20 text-amber-400",
                  recovery:   "bg-violet-500/20 text-violet-400",
                };
                const isSelected = d === selectedWeekday.slice(0, 3);
                return (
                  <div key={d} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${isSelected ? "border border-[var(--teal)]/40 bg-[var(--teal)]/5" : ""}`}>
                    <span className={`text-[10px] font-semibold ${isSelected ? "text-[var(--teal)]" : "text-[hsl(var(--muted-foreground))]"}`}>{d}</span>
                    <div className={`w-6 h-6 rounded-full ${colors[r]} flex items-center justify-center`}>
                      <span className="text-[8px] font-bold">{r === "la-roche" ? "LR" : r === "mytret" ? "MT" : "R"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-full bg-sky-400" />La Roche</span>
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-full bg-amber-400" />MyTret</span>
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-full bg-violet-400" />Recovery</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
