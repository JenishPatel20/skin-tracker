"use client";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({ value, max = 100, className, barClassName }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-2 w-full rounded-full bg-white/5 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out bg-[var(--teal)]", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
