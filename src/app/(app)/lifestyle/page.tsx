"use client";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useAppStore } from "@/lib/store";
import { getTodayString } from "@/lib/utils";
import type { LifestyleEntry } from "@/types";
import { Leaf, CheckCircle2 } from "lucide-react";

const defaults: Omit<LifestyleEntry, "id" | "user_id" | "created_at"> = {
  date: "",
  sleep_hours: 7,
  water_intake: 8,
  stress_level: 4,
  sugar_intake: "low",
  dairy_consumed: false,
  whey_protein_consumed: false,
  junk_food_consumed: false,
  exercise: false,
  sweating: false,
  pillowcase_changed: false,
  beard_shaved: false,
  face_touched_frequently: false,
};

export default function LifestylePage() {
  const { setTodayLifestyle } = useAppStore();
  const today = getTodayString();
  const [data, setData] = useState({ ...defaults, date: today });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setTodayLifestyle(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  type LifestyleBoolKey = "dairy_consumed"|"whey_protein_consumed"|"junk_food_consumed"|"exercise"|"sweating"|"pillowcase_changed"|"beard_shaved"|"face_touched_frequently";

  const boolFields: { key: LifestyleBoolKey; label: string; desc?: string }[] = [
    { key: "dairy_consumed", label: "Dairy Consumed", desc: "Milk, cheese, yogurt, etc." },
    { key: "whey_protein_consumed", label: "Whey Protein", desc: "Any whey supplements today" },
    { key: "junk_food_consumed", label: "Junk Food", desc: "Fast food, chips, processed snacks" },
    { key: "exercise", label: "Exercised", desc: "Any physical activity" },
    { key: "sweating", label: "Heavy Sweating", desc: "From exercise or heat" },
    { key: "pillowcase_changed", label: "Changed Pillowcase", desc: "Fresh pillow cover tonight" },
    { key: "beard_shaved", label: "Beard Shaved", desc: "Shaved today" },
    { key: "face_touched_frequently", label: "Touched Face Often", desc: "Unconscious face-touching" },
  ];

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Lifestyle Tracker" subtitle={today} />

      <div className="mt-4 flex flex-col gap-4">
        {/* Quantitative */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Leaf size={15} className="text-[var(--teal)]" />
              Daily Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Slider
              label="Sleep Hours"
              value={data.sleep_hours}
              min={0}
              max={12}
              step={0.5}
              onChange={(v) => update("sleep_hours", v)}
              showValue
            />
            <Slider
              label="Water Intake (glasses)"
              value={data.water_intake}
              min={0}
              max={16}
              step={1}
              onChange={(v) => update("water_intake", v)}
              showValue
            />
            <Slider
              label="Stress Level"
              value={data.stress_level}
              min={0}
              max={10}
              onChange={(v) => update("stress_level", v)}
              showValue
            />
          </CardContent>
        </Card>

        {/* Sugar intake */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sugar Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {(["none", "low", "medium", "high"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => update("sugar_intake", level)}
                  className={`py-2.5 rounded-xl text-xs font-medium border capitalize transition-all ${
                    data.sugar_intake === level
                      ? "bg-[var(--teal)]/20 border-[var(--teal)]/40 text-[var(--teal)]"
                      : "bg-white/5 border-white/10 text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Boolean toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today&apos;s Factors</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {boolFields.map(({ key, label, desc }) => (
              <Toggle
                key={key}
                checked={!!data[key]}
                onChange={(v) => update(key, v as never)}
                label={label}
                description={desc}
              />
            ))}
          </CardContent>
        </Card>

        <Button size="lg" className="w-full" onClick={handleSave}>
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : "Save Lifestyle Log"}
        </Button>
      </div>
    </div>
  );
}
