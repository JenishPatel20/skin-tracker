"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { generateInsights, generateLLMSummary } from "@/lib/insights";
import { useAppStore } from "@/lib/store";
import type { AIInsight, SymptomEntry, LifestyleEntry, DailyLog } from "@/types";
import { getTodayString } from "@/lib/utils";
import {
  Sparkles, TrendingUp, AlertTriangle, Lightbulb,
  Copy, CheckCircle2, FileDown, Link2, Brain,
} from "lucide-react";

/* Demo data */
const DEMO_SYMPTOMS: SymptomEntry[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i), user_id: "", created_at: "",
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  oiliness: 6 - i * 0.1, dryness: 3 + (i % 3 === 0 ? 2 : 0), burning: 2, sensitivity: 3,
  redness: 4 - i * 0.15, irritation: 3, itching: 2,
  new_pimples: Math.max(0, 4 - i * 0.25), painful_acne: Math.max(0, 2 - i * 0.1),
  whiteheads: 1, blackhead_severity: 5 - i * 0.1, forehead_congestion: 6 - i * 0.2,
  beard_irritation: 2, dark_spot_severity: 3,
  overall_trend: i < 5 ? "worse" : i < 10 ? "same" : "better",
}));

const DEMO_LIFESTYLE: LifestyleEntry[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i), user_id: "", created_at: "",
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  sleep_hours: 5.5 + Math.random() * 3, water_intake: 6 + Math.random() * 4,
  stress_level: 4 + Math.random() * 3,
  sugar_intake: i % 4 === 0 ? "high" : "low" as "high" | "low",
  dairy_consumed: i % 3 === 0, whey_protein_consumed: false, junk_food_consumed: i % 5 === 0,
  exercise: i % 2 === 0, sweating: i % 3 === 0, pillowcase_changed: i % 7 === 0,
  beard_shaved: false, face_touched_frequently: i % 3 === 0,
}));

const DEMO_LOGS: DailyLog[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i), user_id: "", created_at: "", updated_at: "", notes: "",
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  am_completed: i % 7 !== 3, pm_completed: i % 7 !== 5,
  am_steps: { cleanser: true, spf: true, moisturizer: true, eye_cream: false, custom: [] },
  pm_steps: { gentle_cleanser: true, la_roche_cleanser: false, mytret: false, moisturizer: true, recovery_routine: false, spot_treatment: false, skipped: false },
  pm_routine_type: "la-roche",
}));

const INSIGHT_STYLE: Record<string, { border: string; iconBg: string; iconColor: string; label: string }> = {
  improvement: { border: "border-l-emerald-400", iconBg: "bg-emerald-400/15", iconColor: "text-emerald-400", label: "Improvements" },
  warning:     { border: "border-l-amber-400",   iconBg: "bg-amber-400/15",   iconColor: "text-amber-400",   label: "Warnings" },
  pattern:     { border: "border-l-[#14b8a6]",   iconBg: "bg-teal-400/15",    iconColor: "text-teal-400",    label: "Patterns" },
  correlation: { border: "border-l-violet-400",  iconBg: "bg-violet-400/15",  iconColor: "text-violet-400",  label: "Correlations" },
};

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  improvement: <TrendingUp  size={15} />,
  warning:     <AlertTriangle size={15} />,
  pattern:     <Lightbulb  size={15} />,
  correlation: <Link2       size={15} />,
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } };

export default function InsightsPage() {
  const { skinScore } = useAppStore();
  const [insights] = useState<AIInsight[]>(() => generateInsights(DEMO_SYMPTOMS, DEMO_LIFESTYLE, DEMO_LOGS));
  const [llmSummary] = useState(() => generateLLMSummary(DEMO_SYMPTOMS, DEMO_LIFESTYLE, DEMO_LOGS));
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"insights" | "export">("insights");

  function copyLLMSummary() {
    navigator.clipboard.writeText(llmSummary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadMarkdown() {
    const md = `# SkinTrack AI Report\nGenerated: ${new Date().toLocaleDateString()}\n\n## Summary\n${llmSummary}\n\n## Insights\n${insights.map((i) => `### ${i.title}\n${i.body}\n`).join("\n")}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `skintrack-report-${getTodayString()}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  function downloadJSON() {
    const data = { insights, llmSummary, symptoms: DEMO_SYMPTOMS, lifestyle: DEMO_LIFESTYLE };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `skintrack-export-${getTodayString()}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  const typeCounts = insights.reduce((acc, i) => {
    acc[i.insight_type] = (acc[i.insight_type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      className="px-4 pt-4 pb-6"
      initial="hidden" animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fade}>
        <Header title="AI Insights" subtitle="Pattern analysis & export" />
      </motion.div>

      {/* Tab toggle */}
      <motion.div variants={fade} className="mt-4 mb-5">
        <div className="flex rounded-2xl bg-white/5 border border-white/8 p-1 gap-1">
          {(["insights", "export"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                tab === t ? "text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="insights-tab"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--mint) 100%)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t === "insights" ? <Sparkles size={14} /> : <FileDown size={14} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {tab === "insights" && (
        <div className="flex flex-col gap-4">
          {/* AI summary card */}
          <motion.div variants={fade}>
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--teal), var(--mint))" }}>
                    <Brain size={26} className="text-[hsl(var(--primary-foreground))]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base">Weekly Summary</h2>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Based on 14 days of data</p>
                  </div>
                  <div className="ml-auto">
                    <ScoreRing score={skinScore || 74} size={64} label="" />
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[hsl(var(--foreground))]">
                  Your skin health is{" "}
                  <span className="text-[var(--teal)] font-semibold">improving</span>.
                  Acne count decreased by 25% this week. Focus on sleep consistency and
                  reducing dairy to see even better results.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-400 text-xs font-semibold border border-emerald-400/20">-25% Acne</span>
                  <span className="px-3 py-1 rounded-full bg-sky-400/15 text-sky-400 text-xs font-semibold border border-sky-400/20">+15% Hydration</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--teal)]/15 text-[var(--teal)] text-xs font-semibold border border-[var(--teal)]/20">87% Adherence</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories grid */}
          <motion.div variants={fade} className="grid grid-cols-2 gap-3">
            {(["improvement", "warning", "pattern", "correlation"] as const).map((type) => {
              const s = INSIGHT_STYLE[type];
              return (
                <div key={type} className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                    <span className={s.iconColor}>{INSIGHT_ICONS[type]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-base">{typeCounts[type] ?? 0}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Insights list */}
          <div className="flex flex-col gap-3">
            {insights.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-[hsl(var(--muted-foreground))]">
                <Sparkles size={40} strokeWidth={1} />
                <p className="text-sm">Log at least 3 days to generate insights.</p>
              </div>
            )}
            {insights.map((insight, i) => {
              const s = INSIGHT_STYLE[insight.insight_type];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, ease: EASE }}
                  className={`glass rounded-2xl p-4 border-l-4 ${s.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                      <span className={s.iconColor}>{INSIGHT_ICONS[insight.insight_type]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold">{insight.title}</p>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))] shrink-0 ml-2">
                          {Math.round(insight.confidence * 100)}% conf
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {insight.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "export" && (
        <div className="flex flex-col gap-4">
          {/* Ask AI section */}
          <motion.div variants={fade}>
            <div className="glass rounded-3xl p-6 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(52,211,153,0.1))" }}>
                <Sparkles size={28} className="text-[var(--teal)]" />
              </div>
              <h3 className="font-bold text-base mb-2">LLM-Ready Summary</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">
                Paste into ChatGPT or Claude for AI analysis
              </p>
              <pre className="text-xs text-left text-[hsl(var(--muted-foreground))] bg-white/4 rounded-2xl p-4 whitespace-pre-wrap leading-relaxed font-mono mb-4 max-h-48 overflow-y-auto">
                {llmSummary}
              </pre>
              <Button
                className="w-full h-12 rounded-2xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, var(--teal), var(--mint))", color: "hsl(var(--primary-foreground))" }}
                onClick={copyLLMSummary}
              >
                {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
              </Button>
            </div>
          </motion.div>

          {/* Download formats */}
          <motion.div variants={fade}>
            <div className="glass rounded-3xl p-5 space-y-3">
              <h3 className="font-semibold text-sm mb-4">Download Report</h3>
              <button
                onClick={downloadJSON}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-400/15 flex items-center justify-center">
                  <FileDown size={16} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Export as JSON</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Full data export</p>
                </div>
              </button>
              <button
                onClick={downloadMarkdown}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-400/15 flex items-center justify-center">
                  <FileDown size={16} className="text-[var(--teal)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">Export as Markdown</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Readable report</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div variants={fade}>
            <div className="glass rounded-3xl p-5">
              <h3 className="font-semibold text-sm mb-4">14-Day Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Routine Adherence", value: "86%",    color: "text-[var(--teal)]" },
                  { label: "Avg Pimples/Day",   value: "2.1",    color: "text-rose-400" },
                  { label: "Avg Sleep",          value: "7.2h",   color: "text-violet-400" },
                  { label: "Skin Score",         value: "74/100", color: "text-amber-400" },
                  { label: "Days Logged",        value: "14",     color: "text-[var(--teal)]" },
                  { label: "Longest Streak",     value: "21d",    color: "text-emerald-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl bg-white/5 border border-white/8 p-4">
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
