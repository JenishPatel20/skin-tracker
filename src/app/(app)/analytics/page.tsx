"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { BarChart2, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { getRecentLogs, getRecentSymptoms, getRecentLifestyle } from "@/lib/api";
import type { SymptomEntry, LifestyleEntry, DailyLog } from "@/types";

const TEAL = "#2dd4bf";
const MINT = "#6ee7b7";
const AMBER = "#fbbf24";
const ROSE = "#fb7185";
const VIOLET = "#a78bfa";

function buildChartData(symptoms: SymptomEntry[], lifestyle: LifestyleEntry[], logs: DailyLog[]) {
  const symMap = Object.fromEntries(symptoms.map((s) => [s.date, s]));
  const lifeMap = Object.fromEntries(lifestyle.map((l) => [l.date, l]));
  const logMap = Object.fromEntries(logs.map((l) => [l.date, l]));

  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const s = symMap[dateStr];
    const li = lifeMap[dateStr];
    const log = logMap[dateStr];
    return {
      date: label,
      acne: s?.new_pimples ?? null,
      oiliness: s?.oiliness ?? null,
      dryness: s?.dryness ?? null,
      sleep: li?.sleep_hours ?? null,
      adherence: log ? ((log.am_completed ? 1 : 0) + (log.pm_completed ? 1 : 0)) * 50 : null,
    };
  });
}

function buildCorrelationData(symptoms: SymptomEntry[], lifestyle: LifestyleEntry[]) {
  const symMap = Object.fromEntries(symptoms.map((s) => [s.date, s]));
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const lowSleep = lifestyle.filter((l) => l.sleep_hours < 6).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const goodSleep = lifestyle.filter((l) => l.sleep_hours >= 7).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const dairy = lifestyle.filter((l) => l.dairy_consumed).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const noDairy = lifestyle.filter((l) => !l.dairy_consumed).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const stress = lifestyle.filter((l) => l.stress_level >= 7).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const lowStress = lifestyle.filter((l) => l.stress_level <= 3).map((l) => symMap[l.date]?.new_pimples ?? 0);

  return [
    { label: "Low Sleep (<6h)", acne: parseFloat(avg(lowSleep).toFixed(1)), fill: ROSE },
    { label: "Good Sleep (≥7h)", acne: parseFloat(avg(goodSleep).toFixed(1)), fill: MINT },
    { label: "Dairy Day", acne: parseFloat(avg(dairy).toFixed(1)), fill: AMBER },
    { label: "No Dairy", acne: parseFloat(avg(noDairy).toFixed(1)), fill: TEAL },
    { label: "High Stress", acne: parseFloat(avg(stress).toFixed(1)), fill: VIOLET },
    { label: "Low Stress", acne: parseFloat(avg(lowStress).toFixed(1)), fill: MINT },
  ];
}

const weeklyHeatmap = [
  { week: "Wk 1", Mon: 1, Tue: 1, Wed: 0, Thu: 1, Fri: 1, Sat: 1, Sun: 0 },
  { week: "Wk 2", Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 0, Sat: 1, Sun: 1 },
  { week: "Wk 3", Mon: 1, Tue: 0, Wed: 1, Thu: 1, Fri: 1, Sat: 1, Sun: 1 },
  { week: "Wk 4", Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 0, Sun: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 text-xs border border-[var(--glass-border)]">
      <p className="font-semibold mb-1.5 text-[hsl(var(--foreground))]">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <strong>{typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [chartData, setChartData] = useState(buildChartData([], [], []));
  const [correlationData, setCorrelationData] = useState(buildCorrelationData([], []));
  const [loading, setLoading] = useState(true);
  const [adherencePct, setAdherencePct] = useState(0);

  useEffect(() => {
    Promise.all([getRecentLogs(14), getRecentSymptoms(14), getRecentLifestyle(14)]).then(
      ([logs, symptoms, lifestyle]) => {
        setChartData(buildChartData(symptoms, lifestyle, logs));
        setCorrelationData(buildCorrelationData(symptoms, lifestyle));
        const pct = logs.length
          ? Math.round((logs.filter((l) => l.am_completed && l.pm_completed).length / logs.length) * 100)
          : 0;
        setAdherencePct(pct);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[var(--teal)]" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Analytics" subtitle="14-day skin trends" />

      <div className="mt-4 flex flex-col gap-4">
        {/* Summary badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">Adherence {adherencePct}%</Badge>
          <Badge variant={adherencePct >= 70 ? "success" : "warning"}>
            {adherencePct >= 70 ? "On track" : "Needs consistency"}
          </Badge>
        </div>

        {/* Acne count chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-[var(--teal)]" />
              Acne Count (14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="acneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ROSE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ROSE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="acne" name="New Pimples" stroke={ROSE} fill="url(#acneGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Oiliness + Dryness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Oiliness vs Dryness</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="oiliness" name="Oiliness" stroke={AMBER} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="dryness" name="Dryness" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Adherence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Routine Adherence %</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="adherence" name="Adherence %" stroke={TEAL} fill="url(#adherenceGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trigger correlation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400" />
              Trigger Correlation (Avg Acne)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={correlationData} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} domain={[0, 5]} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="acne" name="Avg Pimples" radius={[0, 4, 4, 0]}>
                  {correlationData.map((entry, index) => (
                    <rect key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sleep trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sleep Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sleep" name="Sleep hrs" fill={VIOLET} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Adherence heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart2 size={14} className="text-[var(--teal)]" />
              Adherence Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr>
                    <th className="w-8 text-left text-[hsl(var(--muted-foreground))] pb-2"></th>
                    {days.map((d) => (
                      <th key={d} className="text-center text-[hsl(var(--muted-foreground))] pb-2 font-normal">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeklyHeatmap.map((week) => (
                    <tr key={week.week}>
                      <td className="text-[hsl(var(--muted-foreground))] pr-2 py-1 text-right">{week.week}</td>
                      {days.map((d) => {
                        const val = week[d as keyof typeof week] as number;
                        return (
                          <td key={d} className="text-center py-1 px-1">
                            <div
                              className="w-6 h-6 rounded-md mx-auto"
                              style={{ background: val ? `rgba(45,212,191,${0.3 + val * 0.6})` : "rgba(255,255,255,0.05)" }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
