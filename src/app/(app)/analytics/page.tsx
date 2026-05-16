"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { BarChart2, TrendingUp, TrendingDown, Moon, Droplet, Coffee, Activity, Loader2 } from "lucide-react";
import { getRecentLogs, getRecentSymptoms, getRecentLifestyle } from "@/lib/api";
import type { SymptomEntry, LifestyleEntry, DailyLog } from "@/types";

const GRID  = "rgba(255,255,255,0.04)";
const AXIS  = "rgba(255,255,255,0.3)";
const TIP_STYLE = {
  backgroundColor: "rgba(14,18,38,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "rgba(255,255,255,0.9)",
  fontSize: "12px",
};

function buildChartData(symptoms: SymptomEntry[], lifestyle: LifestyleEntry[], logs: DailyLog[]) {
  const symMap  = Object.fromEntries(symptoms.map((s) => [s.date, s]));
  const lifeMap = Object.fromEntries(lifestyle.map((l) => [l.date, l]));
  const logMap  = Object.fromEntries(logs.map((l) => [l.date, l]));
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const s = symMap[dateStr]; const li = lifeMap[dateStr]; const log = logMap[dateStr];
    return {
      date: label, dateStr,
      acne: s?.new_pimples ?? null,
      oiliness: s?.oiliness != null ? Math.round(s.oiliness * 10) : null,
      dryness: s?.dryness != null ? Math.round(s.dryness * 10) : null,
      sleep: li?.sleep_hours ?? null,
      adherence: log ? ((log.am_completed ? 1 : 0) + (log.pm_completed ? 1 : 0)) * 50 : null,
    };
  });
}

function buildCorrelationData(symptoms: SymptomEntry[], lifestyle: LifestyleEntry[]) {
  const symMap = Object.fromEntries(symptoms.map((s) => [s.date, s]));
  const avg = (arr: number[]) => arr.length ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)) : 0;
  const lowSleep  = lifestyle.filter((l) => l.sleep_hours < 6).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const goodSleep = lifestyle.filter((l) => l.sleep_hours >= 7).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const dairy     = lifestyle.filter((l) => l.dairy_consumed).map((l) => symMap[l.date]?.new_pimples ?? 0);
  const noDairy   = lifestyle.filter((l) => !l.dairy_consumed).map((l) => symMap[l.date]?.new_pimples ?? 0);
  return [
    { label: "Low Sleep", acne: avg(lowSleep),  fill: "#fb7185" },
    { label: "Good Sleep",acne: avg(goodSleep), fill: "#34d399" },
    { label: "Dairy Day", acne: avg(dairy),     fill: "#f59e0b" },
    { label: "No Dairy",  acne: avg(noDairy),   fill: "#14b8a6" },
  ];
}

const adherenceHeatmap = [
  [1,1,1,0,1,1,1],[1,1,0,1,1,1,0],[1,1,1,1,1,0,1],[1,0,1,1,1,1,1],
];

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } } };

export default function AnalyticsPage() {
  const [chartData, setChartData]   = useState(buildChartData([], [], []));
  const [corrData, setCorrData]     = useState(buildCorrelationData([], []));
  const [adherencePct, setAdherencePct] = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getRecentLogs(14), getRecentSymptoms(14), getRecentLifestyle(14)]).then(([logs, symptoms, lifestyle]) => {
      setChartData(buildChartData(symptoms, lifestyle, logs));
      setCorrData(buildCorrelationData(symptoms, lifestyle));
      const pct = logs.length ? Math.round((logs.filter((l) => l.am_completed && l.pm_completed).length / logs.length) * 100) : 0;
      setAdherencePct(pct);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[var(--teal)]" />
      </div>
    );
  }

  return (
    <motion.div
      className="px-4 pt-4 pb-6"
      initial="hidden" animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      <motion.div variants={fade}>
        <Header title="Analytics" subtitle="14-day skin trends" />
      </motion.div>

      {/* Summary row */}
      <motion.div variants={fade} className="mt-4 grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <TrendingDown size={18} className="text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">-25%</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Acne reduction</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <TrendingUp size={18} className="text-[var(--teal)] mx-auto mb-2" />
          <p className="text-2xl font-bold">{adherencePct}%</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Avg adherence</p>
        </div>
      </motion.div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Acne trend */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Acne Count Trend</h2>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <TrendingDown size={13} />-25% this week
              </span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="acneGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#fb7185" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="date" stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TIP_STYLE} />
                  <Area type="monotone" dataKey="acne" name="Pimples" stroke="#fb7185" fill="url(#acneGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Oiliness vs Dryness */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Droplet size={16} className="text-sky-400" />
                Oiliness vs Dryness
              </h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="date" stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={TIP_STYLE} />
                  <Line type="monotone" dataKey="oiliness" name="Oiliness" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="dryness"  name="Dryness"  stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Oiliness</span>
              <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />Dryness</span>
            </div>
          </div>
        </motion.div>

        {/* Adherence heatmap */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                Routine Adherence
              </h2>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Last 4 weeks</span>
            </div>
            <div className="space-y-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, dayIdx) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(var(--muted-foreground))] w-8 shrink-0">{day}</span>
                  <div className="flex gap-1 flex-1">
                    {adherenceHeatmap.map((week, wIdx) => (
                      <div
                        key={wIdx}
                        className="flex-1 h-6 rounded-lg transition-colors"
                        style={{ background: week[dayIdx] ? "linear-gradient(135deg, var(--teal), var(--mint))" : "rgba(255,255,255,0.06)" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">4 weeks ago</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">This week</span>
            </div>
          </div>
        </motion.div>

        {/* Sleep vs breakouts */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Moon size={16} className="text-indigo-400" />
                Sleep Hours
              </h2>
              <span className="px-2 py-1 rounded-full bg-indigo-400/15 text-indigo-400 text-xs font-semibold border border-indigo-400/20">
                AI Correlation
              </span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="date" stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip contentStyle={TIP_STYLE} />
                  <Bar dataKey="sleep" name="Hours" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-2">
              Less sleep correlates with more breakouts
            </p>
          </div>
        </motion.div>

        {/* Trigger correlation */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Coffee size={16} className="text-orange-400" />
                Trigger Impact
              </h2>
              <span className="px-2 py-1 rounded-full bg-orange-400/15 text-orange-400 text-xs font-semibold border border-orange-400/20">
                Avg Pimples
              </span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={corrData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis type="number" stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} domain={[0, 5]} />
                  <YAxis type="category" dataKey="label" stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} width={75} />
                  <Tooltip contentStyle={TIP_STYLE} />
                  <Bar dataKey="acne" name="Avg Pimples" radius={[0, 4, 4, 0]}>
                    {corrData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Adherence area chart */}
        <motion.div variants={fade}>
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <BarChart2 size={16} className="text-[var(--teal)]" />
                Routine Completion %
              </h2>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="date" stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke={AXIS} fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={TIP_STYLE} />
                  <Area type="monotone" dataKey="adherence" name="Adherence %" stroke="#14b8a6" fill="url(#adherenceGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
