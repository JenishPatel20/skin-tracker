"use client";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { getTodayString } from "@/lib/utils";
import type { SymptomEntry } from "@/types";
import { Activity, TrendingUp, TrendingDown, Minus, CheckCircle2 } from "lucide-react";

const defaultSymptoms: Omit<SymptomEntry, "id" | "user_id" | "created_at"> = {
  date: "",
  oiliness: 5,
  dryness: 3,
  burning: 2,
  sensitivity: 3,
  redness: 3,
  irritation: 3,
  itching: 2,
  new_pimples: 1,
  painful_acne: 0,
  whiteheads: 0,
  blackhead_severity: 4,
  forehead_congestion: 4,
  beard_irritation: 2,
  dark_spot_severity: 3,
  overall_trend: "same",
};

export default function SymptomsPage() {
  const { setTodaySymptoms } = useAppStore();
  const today = getTodayString();
  const [symptoms, setSymptoms] = useState({ ...defaultSymptoms, date: today });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof symptoms>(key: K, value: (typeof symptoms)[K]) {
    setSymptoms((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setTodaySymptoms(symptoms);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  type SymptomNumKey = "oiliness"|"dryness"|"burning"|"sensitivity"|"redness"|"irritation"|"itching"|"new_pimples"|"painful_acne"|"whiteheads"|"blackhead_severity"|"forehead_congestion"|"beard_irritation"|"dark_spot_severity";

  const sliders: { key: SymptomNumKey; label: string; color?: string }[] = [
    { key: "oiliness", label: "Oiliness", color: "#fbbf24" },
    { key: "dryness", label: "Dryness", color: "#60a5fa" },
    { key: "burning", label: "Burning", color: "#f87171" },
    { key: "sensitivity", label: "Sensitivity", color: "#c084fc" },
    { key: "redness", label: "Redness", color: "#fb7185" },
    { key: "irritation", label: "Irritation", color: "#f97316" },
    { key: "itching", label: "Itching", color: "#a78bfa" },
  ];

  const acneMetrics: { key: SymptomNumKey; label: string; isCount?: boolean }[] = [
    { key: "new_pimples", label: "New Pimples", isCount: true },
    { key: "painful_acne", label: "Painful Acne", isCount: true },
    { key: "whiteheads", label: "Whiteheads", isCount: true },
    { key: "blackhead_severity", label: "Blackhead Severity" },
    { key: "forehead_congestion", label: "Forehead Congestion" },
    { key: "beard_irritation", label: "Beard Irritation" },
    { key: "dark_spot_severity", label: "Dark Spot Severity" },
  ];

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Symptom Tracker" subtitle={today} />

      <div className="mt-4 flex flex-col gap-4">
        {/* Skin Feel Sliders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity size={15} className="text-[var(--teal)]" />
              How Does Your Skin Feel?
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {sliders.map(({ key, label, color }) => (
              <Slider
                key={key}
                label={label}
                value={symptoms[key] as number}
                min={0}
                max={10}
                onChange={(v) => update(key, v as never)}
                showValue
              />
            ))}
          </CardContent>
        </Card>

        {/* Acne Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Acne Metrics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {acneMetrics.map(({ key, label, isCount }) => (
              <Slider
                key={key}
                label={label}
                value={symptoms[key] as number}
                min={0}
                max={isCount ? 20 : 10}
                onChange={(v) => update(key, v as never)}
                showValue
              />
            ))}
          </CardContent>
        </Card>

        {/* Overall Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overall Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(["better", "same", "worse"] as const).map((t) => {
                const icons = {
                  better: <TrendingUp size={18} className="text-emerald-400" />,
                  same: <Minus size={18} className="text-amber-400" />,
                  worse: <TrendingDown size={18} className="text-red-400" />,
                };
                const colors = {
                  better: "bg-emerald-500/15 border-emerald-500/30",
                  same: "bg-amber-500/15 border-amber-500/30",
                  worse: "bg-red-500/15 border-red-500/30",
                };
                const selected = symptoms.overall_trend === t;
                return (
                  <button
                    key={t}
                    onClick={() => update("overall_trend", t)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all capitalize ${
                      selected ? colors[t] + " scale-105" : "bg-white/5 border-white/10"
                    }`}
                  >
                    {icons[t]}
                    <span className="text-xs font-medium">{t}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full" onClick={handleSave}>
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : "Save Symptoms"}
        </Button>
      </div>
    </div>
  );
}
