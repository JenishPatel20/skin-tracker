"use client";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, description, className }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-3 w-full rounded-xl p-3 transition-all duration-200 text-left",
        checked ? "bg-[var(--teal)]/10 border border-[var(--teal)]/30" : "bg-white/5 border border-white/10 hover:bg-white/8",
        className
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
          checked ? "border-[var(--teal)] bg-[var(--teal)]" : "border-white/30"
        )}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#0a1628" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", checked ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]")}>{label}</p>
        {description && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>}
      </div>
    </button>
  );
}
