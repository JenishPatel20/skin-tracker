"use client";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
  emoji?: string;
  showValue?: boolean;
}

function getSeverityStyle(value: number, max: number) {
  const pct = value / max;
  if (pct === 0)  return { badge: "bg-zinc-800/80 text-zinc-400 border-zinc-700/50", color: "#52525b" };
  if (pct < 0.25) return { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", color: "#10b981" };
  if (pct < 0.5)  return { badge: "bg-teal-500/15 text-teal-400 border-teal-500/25", color: "#14b8a6" };
  if (pct < 0.7)  return { badge: "bg-amber-500/15 text-amber-400 border-amber-500/25", color: "#f59e0b" };
  if (pct < 0.85) return { badge: "bg-orange-500/15 text-orange-400 border-orange-500/25", color: "#f97316" };
  return { badge: "bg-rose-500/15 text-rose-400 border-rose-500/25", color: "#fb7185" };
}

export function Slider({
  value, min = 0, max = 10, step = 1,
  onChange, className, label, emoji, showValue = true,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const { badge, color } = getSeverityStyle(value, max);

  return (
    <div className={cn("w-full group", className)}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5">
          {emoji && (
            <span className="text-base leading-none select-none w-6 text-center">{emoji}</span>
          )}
          {label && (
            <span className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</span>
          )}
        </div>
        {showValue && (
          <span
            className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full border tabular-nums min-w-[3rem] text-center transition-all duration-200",
              badge
            )}
          >
            {value}{max <= 10 ? "/10" : ""}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-custom w-full"
        style={{
          "--slider-fill-color": color,
          "--slider-fill-pct": `${pct}%`,
        } as React.CSSProperties}
      />
    </div>
  );
}
