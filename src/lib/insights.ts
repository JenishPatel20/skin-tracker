import type { SymptomEntry, LifestyleEntry, DailyLog, AIInsight } from "@/types";

export function generateInsights(
  symptoms: SymptomEntry[],
  lifestyle: LifestyleEntry[],
  logs: DailyLog[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date().toISOString();
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0];

  if (symptoms.length >= 3) {
    const recent = symptoms.slice(-7);
    const older = symptoms.slice(-14, -7);

    const avgAcneRecent = avg(recent.map((s) => s.new_pimples));
    const avgAcneOlder = avg(older.map((s) => s.new_pimples));
    const pct = older.length > 0 ? Math.round(((avgAcneOlder - avgAcneRecent) / Math.max(avgAcneOlder, 1)) * 100) : 0;

    if (pct > 10) {
      insights.push({
        id: "insight-acne-down",
        user_id: "",
        generated_at: now,
        insight_type: "improvement",
        title: `Acne improving ${pct}%`,
        body: `Your average new pimple count dropped by ${pct}% compared to the previous week. Keep up the routine!`,
        confidence: 0.8,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    } else if (pct < -10) {
      insights.push({
        id: "insight-acne-up",
        user_id: "",
        generated_at: now,
        insight_type: "warning",
        title: "Acne flaring recently",
        body: `New pimple count increased ${Math.abs(pct)}% vs last week. Review recent triggers.`,
        confidence: 0.75,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    }

    const dryNights = recent.filter((s) => s.dryness > 6);
    if (dryNights.length >= 2) {
      insights.push({
        id: "insight-dryness",
        user_id: "",
        generated_at: now,
        insight_type: "pattern",
        title: "Dryness spikes detected",
        body: `Dryness scored above 6 on ${dryNights.length} days recently. Consider adding moisturizer after tret nights.`,
        confidence: 0.7,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    }

    const foreheadTrend = avg(recent.slice(-3).map((s) => s.forehead_congestion)) -
      avg(recent.slice(0, 3).map((s) => s.forehead_congestion));
    if (foreheadTrend < -1) {
      insights.push({
        id: "insight-forehead",
        user_id: "",
        generated_at: now,
        insight_type: "improvement",
        title: "Forehead congestion clearing",
        body: "Forehead congestion scores are trending downward. Your routine is working!",
        confidence: 0.65,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    }
  }

  if (lifestyle.length >= 5 && symptoms.length >= 5) {
    const dateSymptomMap: Record<string, SymptomEntry> = {};
    symptoms.forEach((s) => (dateSymptomMap[s.date] = s));

    const lowSleepBreakouts = lifestyle
      .filter((l) => l.sleep_hours < 6)
      .map((l) => dateSymptomMap[l.date]?.new_pimples ?? 0);
    const normalSleepBreakouts = lifestyle
      .filter((l) => l.sleep_hours >= 7)
      .map((l) => dateSymptomMap[l.date]?.new_pimples ?? 0);

    if (lowSleepBreakouts.length >= 2 && avg(lowSleepBreakouts) > avg(normalSleepBreakouts) + 0.5) {
      insights.push({
        id: "insight-sleep",
        user_id: "",
        generated_at: now,
        insight_type: "correlation",
        title: "Poor sleep → more breakouts",
        body: `On nights with <6h sleep, breakouts average ${avg(lowSleepBreakouts).toFixed(1)} vs ${avg(normalSleepBreakouts).toFixed(1)} on normal sleep nights.`,
        confidence: 0.72,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    }

    const dairyDays = lifestyle.filter((l) => l.dairy_consumed);
    const dairyAcne = avg(dairyDays.map((l) => dateSymptomMap[l.date]?.new_pimples ?? 0));
    const noDairyAcne = avg(lifestyle.filter((l) => !l.dairy_consumed).map((l) => dateSymptomMap[l.date]?.new_pimples ?? 0));
    if (dairyDays.length >= 3 && dairyAcne > noDairyAcne + 0.5) {
      insights.push({
        id: "insight-dairy",
        user_id: "",
        generated_at: now,
        insight_type: "correlation",
        title: "Dairy may correlate with breakouts",
        body: `On dairy days, new pimples average ${dairyAcne.toFixed(1)} vs ${noDairyAcne.toFixed(1)} on dairy-free days.`,
        confidence: 0.6,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    }
  }

  if (logs.length >= 7) {
    const recent7 = logs.slice(-7);
    const adherence = (recent7.filter((l) => l.am_completed && l.pm_completed).length / 7) * 100;
    if (adherence >= 85) {
      insights.push({
        id: "insight-adherence-good",
        user_id: "",
        generated_at: now,
        insight_type: "improvement",
        title: `${Math.round(adherence)}% routine adherence`,
        body: "Excellent consistency this week! Consistent routines are the #1 predictor of skin improvement.",
        confidence: 0.95,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    } else if (adherence < 60) {
      insights.push({
        id: "insight-adherence-low",
        user_id: "",
        generated_at: now,
        insight_type: "warning",
        title: "Routine adherence dropping",
        body: `Only ${Math.round(adherence)}% this week. Skipping nights can set back progress significantly.`,
        confidence: 0.9,
        date_range_start: startDate,
        date_range_end: endDate,
      });
    }
  }

  return insights;
}

export function generateLLMSummary(
  symptoms: SymptomEntry[],
  lifestyle: LifestyleEntry[],
  logs: DailyLog[],
  dayRange = 14
): string {
  const adherence = logs.length > 0
    ? Math.round((logs.filter((l) => l.am_completed && l.pm_completed).length / logs.length) * 100)
    : 0;

  const avgAcne = avg(symptoms.map((s) => s.new_pimples));
  const avgOil = avg(symptoms.map((s) => s.oiliness));
  const avgDry = avg(symptoms.map((s) => s.dryness));
  const trend = symptoms.length > 0 ? symptoms[symptoms.length - 1].overall_trend : "same";

  const lines = [
    `Past ${dayRange} days summary:`,
    `- Routine adherence: ${adherence}%`,
    `- Average new pimples/day: ${avgAcne.toFixed(1)}`,
    `- Average oiliness: ${avgOil.toFixed(1)}/10`,
    `- Average dryness: ${avgDry.toFixed(1)}/10`,
    `- Overall trend (last entry): ${trend}`,
  ];

  const insights = generateInsights(symptoms, lifestyle, logs);
  if (insights.length > 0) {
    lines.push("- Key patterns:");
    insights.forEach((i) => lines.push(`  • ${i.title}: ${i.body}`));
  }

  return lines.join("\n");
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
