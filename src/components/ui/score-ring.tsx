"use client";
import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function getScoreStyle(score: number) {
  if (score >= 80) return { stroke: "#10b981", glow: "rgba(16,185,129,0.45)" };
  if (score >= 60) return { stroke: "#14b8a6", glow: "rgba(20,184,166,0.45)" };
  if (score >= 40) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.45)" };
  return { stroke: "#fb7185", glow: "rgba(251,113,133,0.45)" };
}

export function ScoreRing({ score, size = 120, strokeWidth = 8, label = "Skin Score" }: ScoreRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const { stroke, glow } = getScoreStyle(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold tabular-nums"
            style={{ color: stroke }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">/ 100</span>
        </div>
      </div>
      {label && <span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span>}
    </div>
  );
}
