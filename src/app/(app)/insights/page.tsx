"use client";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { generateInsights, generateLLMSummary } from "@/lib/insights";
import { useAppStore } from "@/lib/store";
import type { AIInsight, SymptomEntry, LifestyleEntry, DailyLog } from "@/types";
import { getTodayString } from "@/lib/utils";
import {
  Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb,
  Copy, CheckCircle2, RefreshCw, FileDown, Link2,
} from "lucide-react";

/* Demo data */
const DEMO_SYMPTOMS: SymptomEntry[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i),
  user_id: "",
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  oiliness: 6 - i * 0.1,
  dryness: 3 + (i % 3 === 0 ? 2 : 0),
  burning: 2,
  sensitivity: 3,
  redness: 4 - i * 0.15,
  irritation: 3,
  itching: 2,
  new_pimples: Math.max(0, 4 - i * 0.25),
  painful_acne: Math.max(0, 2 - i * 0.1),
  whiteheads: 1,
  blackhead_severity: 5 - i * 0.1,
  forehead_congestion: 6 - i * 0.2,
  beard_irritation: 2,
  dark_spot_severity: 3,
  overall_trend: i < 5 ? "worse" : i < 10 ? "same" : "better",
  created_at: "",
}));

const DEMO_LIFESTYLE: LifestyleEntry[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i),
  user_id: "",
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  sleep_hours: 5.5 + Math.random() * 3,
  water_intake: 6 + Math.random() * 4,
  stress_level: 4 + Math.random() * 3,
  sugar_intake: i % 4 === 0 ? "high" : "low",
  dairy_consumed: i % 3 === 0,
  whey_protein_consumed: false,
  junk_food_consumed: i % 5 === 0,
  exercise: i % 2 === 0,
  sweating: i % 3 === 0,
  pillowcase_changed: i % 7 === 0,
  beard_shaved: false,
  face_touched_frequently: i % 3 === 0,
  created_at: "",
}));

const DEMO_LOGS: DailyLog[] = Array.from({ length: 14 }, (_, i) => ({
  id: String(i),
  user_id: "",
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  am_completed: i % 7 !== 3,
  pm_completed: i % 7 !== 5,
  am_steps: { cleanser: true, spf: true, moisturizer: true, eye_cream: false, custom: [] },
  pm_steps: { gentle_cleanser: true, la_roche_cleanser: false, mytret: false, moisturizer: true, recovery_routine: false, spot_treatment: false, skipped: false },
  pm_routine_type: "la-roche",
  notes: "",
  created_at: "",
  updated_at: "",
}));

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  improvement: <TrendingUp size={14} className="text-emerald-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  pattern: <Lightbulb size={14} className="text-[var(--teal)]" />,
  correlation: <Link2 size={14} className="text-violet-400" />,
};

const INSIGHT_COLORS: Record<string, string> = {
  improvement: "bg-emerald-500/10 border-emerald-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  pattern: "bg-[var(--teal)]/10 border-[var(--teal)]/20",
  correlation: "bg-violet-500/10 border-violet-500/20",
};

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

  function downloadJSON() {
    const data = { insights, llmSummary, symptoms: DEMO_SYMPTOMS, lifestyle: DEMO_LIFESTYLE };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skintrack-export-${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadMarkdown() {
    const md = `# SkinTrack AI Report\nGenerated: ${new Date().toLocaleDateString()}\n\n## Summary\n${llmSummary}\n\n## Insights\n${insights.map((i) => `### ${i.title}\n${i.body}\n`).join("\n")}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skintrack-report-${getTodayString()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="AI Insights" subtitle="Pattern analysis & export" />

      {/* Tab switcher */}
      <div className="flex rounded-xl bg-white/5 p-1 mt-4 mb-4">
        {(["insights", "export"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize flex items-center justify-center gap-2 ${
              tab === t ? "bg-[var(--teal)] text-[hsl(222,47%,6%)]" : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {t === "insights" ? <Sparkles size={14} /> : <FileDown size={14} />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "insights" && (
        <div className="flex flex-col gap-4">
          {/* Score card */}
          <Card className="flex flex-col items-center py-6 teal-glow">
            <ScoreRing score={skinScore || 74} size={120} label="Overall Skin Health" />
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-4 text-center max-w-48">
              Composite score based on adherence, acne severity, oiliness, and trends.
            </p>
          </Card>

          {/* Insight cards */}
          {insights.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-[hsl(var(--muted-foreground))]">
              <Sparkles size={40} strokeWidth={1} />
              <p className="text-sm">Log at least 3 days to generate insights.</p>
            </div>
          )}

          {insights.map((insight) => (
            <Card key={insight.id} className={`border ${INSIGHT_COLORS[insight.insight_type]}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {INSIGHT_ICONS[insight.insight_type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold">{insight.title}</h3>
                      <Badge variant={insight.insight_type === "improvement" ? "success" : insight.insight_type === "warning" ? "warning" : "default"}>
                        {insight.insight_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{insight.body}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2 opacity-60">
                      Confidence: {Math.round(insight.confidence * 100)}% · {insight.date_range_start} – {insight.date_range_end}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "export" && (
        <div className="flex flex-col gap-4">
          {/* LLM Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--teal)]" />
                LLM-Ready Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-[hsl(var(--muted-foreground))] bg-white/5 rounded-xl p-4 whitespace-pre-wrap leading-relaxed font-mono">
                {llmSummary}
              </pre>
              <Button className="w-full mt-3" variant="outline" onClick={copyLLMSummary}>
                {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy to Clipboard</>}
              </Button>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 text-center">
                Paste this into ChatGPT or Claude for AI analysis.
              </p>
            </CardContent>
          </Card>

          {/* Export formats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Download Report</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-start" onClick={downloadJSON}>
                <FileDown size={14} />
                Export as JSON
                <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">Full data</span>
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={downloadMarkdown}>
                <FileDown size={14} />
                Export as Markdown
                <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">Readable report</span>
              </Button>
            </CardContent>
          </Card>

          {/* Stats summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">14-Day Summary Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Routine Adherence", value: "86%", color: "text-[var(--teal)]" },
                  { label: "Avg New Pimples/Day", value: "2.1", color: "text-rose-400" },
                  { label: "Avg Sleep", value: "7.2h", color: "text-violet-400" },
                  { label: "Skin Score", value: "74/100", color: "text-amber-400" },
                  { label: "Days Logged", value: "14", color: "text-[var(--teal)]" },
                  { label: "Longest Streak", value: "21d", color: "text-emerald-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
