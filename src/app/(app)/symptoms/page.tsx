"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { getTodayString } from "@/lib/utils";
import { getSymptomEntry, upsertSymptoms, getDailyLog, upsertDailyLog } from "@/lib/api";
import type { SymptomEntry } from "@/types";
import {
  Droplets, AlertCircle, Smile, Meh, Frown, NotebookPen,
  CheckCircle2, Loader2, TrendingUp, TrendingDown, Minus,
} from "lucide-react";

const defaultSymptoms: Omit<SymptomEntry, "id" | "user_id" | "created_at"> = {
  date: "", oiliness: 5, dryness: 3, burning: 2, sensitivity: 3, redness: 3,
  irritation: 3, itching: 2, new_pimples: 1, painful_acne: 0, whiteheads: 0,
  blackhead_severity: 4, forehead_congestion: 4, beard_irritation: 2,
  dark_spot_severity: 3, overall_trend: "same",
};

type NumKey = "oiliness"|"dryness"|"burning"|"sensitivity"|"redness"|"irritation"|"itching"|"new_pimples"|"painful_acne"|"whiteheads"|"blackhead_severity"|"forehead_congestion"|"beard_irritation"|"dark_spot_severity";

const skinFeelSliders: { key: NumKey; label: string; emoji: string }[] = [
  { key: "oiliness",    label: "Oiliness",    emoji: "💧" },
  { key: "dryness",     label: "Dryness",     emoji: "🌵" },
  { key: "burning",     label: "Burning",     emoji: "🔥" },
  { key: "sensitivity", label: "Sensitivity", emoji: "⚡" },
  { key: "redness",     label: "Redness",     emoji: "🌹" },
  { key: "irritation",  label: "Irritation",  emoji: "😤" },
  { key: "itching",     label: "Itching",     emoji: "🐛" },
];

const acneCountKeys: { key: NumKey; label: string; max: number }[] = [
  { key: "new_pimples",  label: "Active Pimples", max: 10 },
  { key: "painful_acne", label: "Painful Acne",   max: 10 },
  { key: "whiteheads",   label: "Whiteheads",     max: 10 },
];

const acneSeveritySliders: { key: NumKey; label: string; emoji: string }[] = [
  { key: "blackhead_severity",  label: "Blackheads",         emoji: "⬛" },
  { key: "forehead_congestion", label: "Forehead Congestion", emoji: "🧠" },
  { key: "beard_irritation",    label: "Beard Irritation",    emoji: "🧔" },
  { key: "dark_spot_severity",  label: "Dark Spots",          emoji: "🌑" },
];

const moodOptions = [
  { id: "great",    label: "Great",   icon: Smile, color: "text-emerald-400", activeBg: "bg-emerald-400/15 border-emerald-400/30" },
  { id: "good",     label: "Good",    icon: Smile, color: "text-teal-400",    activeBg: "bg-teal-400/15 border-teal-400/30" },
  { id: "okay",     label: "Okay",    icon: Meh,   color: "text-amber-400",   activeBg: "bg-amber-400/15 border-amber-400/30" },
  { id: "stressed", label: "Stressed",icon: Frown,  color: "text-orange-400",  activeBg: "bg-orange-400/15 border-orange-400/30" },
  { id: "anxious",  label: "Anxious", icon: Frown,  color: "text-rose-400",    activeBg: "bg-rose-400/15 border-rose-400/30" },
];

const QUICK_NOTES = [
  "Big breakout", "Smooth skin", "Dry after tret", "Very oily",
  "Tried new product", "Poor sleep", "Stressed", "Ate junk food",
  "Drank lots of water", "Exercised",
];

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } };

export default function SymptomsPage() {
  const { setTodaySymptoms } = useAppStore();
  const today = getTodayString();

  const [symptoms, setSymptoms] = useState({ ...defaultSymptoms, date: today });
  const [mood, setMood] = useState("good");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getSymptomEntry(today), getDailyLog(today)]).then(([entry, log]) => {
      if (entry) setSymptoms(entry);
      if (log?.notes) setNote(log.notes);
    });
  }, [today]);

  function update<K extends keyof typeof symptoms>(key: K, value: (typeof symptoms)[K]) {
    setSymptoms((prev) => ({ ...prev, [key]: value }));
  }

  function appendQuickNote(tag: string) {
    setNote((prev) => (prev ? `${prev} · ${tag}` : tag));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const [savedEntry] = await Promise.all([
        upsertSymptoms(symptoms),
        note.trim() ? upsertDailyLog({ date: today, notes: note.trim() }) : Promise.resolve(null),
      ]);
      setTodaySymptoms(savedEntry);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      className="px-4 pt-4 pb-6"
      initial="hidden" animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fade}>
        <Header title="Daily Check-in" subtitle="How's your skin today?" />
      </motion.div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Skin Feel Sliders */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5 space-y-6">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Droplets size={18} className="text-[var(--teal)]" />
              Skin Metrics
            </h2>
            {skinFeelSliders.map(({ key, label, emoji }) => (
              <Slider
                key={key}
                label={label}
                emoji={emoji}
                value={symptoms[key] as number}
                min={0} max={10}
                onChange={(v) => update(key, v as never)}
                showValue
              />
            ))}
          </div>
        </motion.div>

        {/* Acne Counts — number button grid */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5 space-y-5">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-400" />
              Breakout Count
            </h2>
            {acneCountKeys.map(({ key, label, max }) => {
              const val = symptoms[key] as number;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">{label}</span>
                    <span className="text-lg font-bold">{val}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {Array.from({ length: max + 1 }, (_, n) => (
                      <motion.button
                        key={n}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => update(key, n as never)}
                        className={`flex-1 min-w-0 h-10 rounded-xl text-sm font-semibold transition-all ${
                          val === n
                            ? "text-[hsl(var(--primary-foreground))]"
                            : "bg-white/6 text-[hsl(var(--muted-foreground))] hover:bg-white/10 border border-white/8"
                        }`}
                        style={val === n
                          ? { background: "linear-gradient(135deg, var(--teal), var(--mint))", border: "none" }
                          : undefined}
                      >
                        {n === max ? `${max}+` : n}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Acne severity sliders */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5 space-y-6">
            <h2 className="text-base font-semibold">Severity Ratings</h2>
            {acneSeveritySliders.map(({ key, label, emoji }) => (
              <Slider
                key={key}
                label={label}
                emoji={emoji}
                value={symptoms[key] as number}
                min={0} max={10}
                onChange={(v) => update(key, v as never)}
                showValue
              />
            ))}
          </div>
        </motion.div>

        {/* Mood picker */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
              <Smile size={18} className="text-amber-400" />
              Mood & Energy
            </h2>
            <div className="flex gap-2">
              {moodOptions.map(({ id, label, icon: Icon, color, activeBg }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMood(id)}
                  className={`flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all border ${
                    mood === id ? activeBg : "bg-white/5 border-white/8 hover:bg-white/8"
                  }`}
                >
                  <Icon size={22} className={mood === id ? color : "text-[hsl(var(--muted-foreground))]"} />
                  <span className={`text-[10px] font-semibold ${mood === id ? "" : "text-[hsl(var(--muted-foreground))]"}`}>
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Overall trend */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <h2 className="text-base font-semibold mb-4">Overall Trend</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["better", "same", "worse"] as const).map((t) => {
                const conf = {
                  better: { icon: <TrendingUp size={20} className="text-emerald-400" />, active: "bg-emerald-500/15 border-emerald-500/30", label: "Better" },
                  same:   { icon: <Minus      size={20} className="text-amber-400"   />, active: "bg-amber-500/15 border-amber-500/30",   label: "Same" },
                  worse:  { icon: <TrendingDown size={20} className="text-rose-400"  />, active: "bg-rose-500/15 border-rose-500/30",     label: "Worse" },
                }[t];
                return (
                  <motion.button
                    key={t}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => update("overall_trend", t)}
                    className={`flex flex-col items-center gap-2.5 py-5 rounded-2xl border transition-all ${
                      symptoms.overall_trend === t ? conf.active : "bg-white/5 border-white/8 hover:bg-white/8"
                    }`}
                  >
                    {conf.icon}
                    <span className={`text-xs font-semibold ${symptoms.overall_trend !== t ? "text-[hsl(var(--muted-foreground))]" : ""}`}>{conf.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Self notes */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5 border border-violet-500/15">
            <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
              <NotebookPen size={18} className="text-violet-400" />
              Today&apos;s Note
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How's your skin feeling overall? Note any reactions, changes..."
              rows={3}
              className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder:text-[hsl(var(--muted-foreground))] leading-relaxed"
            />
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/6">
              {QUICK_NOTES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => appendQuickNote(tag)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-violet-400/20 hover:bg-violet-400/5 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Save */}
        <motion.div variants={fade}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--mint) 100%)", color: "hsl(var(--primary-foreground))" }}
          >
            {saving
              ? <Loader2 size={18} className="animate-spin" />
              : saved
              ? <><CheckCircle2 size={18} /> Saved!</>
              : "Save Check-in"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
