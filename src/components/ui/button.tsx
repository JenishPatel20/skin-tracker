"use client";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] active:scale-95";

    const variants = {
      default: "bg-[var(--teal)] text-[hsl(222,47%,6%)] hover:bg-[var(--mint)] shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]",
      outline: "border border-[var(--glass-border)] bg-[var(--glass)] text-[hsl(var(--foreground))] hover:bg-white/10",
      ghost: "text-[hsl(var(--foreground))] hover:bg-white/5",
      destructive: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
      secondary: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary))]/80",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
