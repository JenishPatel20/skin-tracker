"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardCheck, Activity,
  Camera, BarChart2, Sparkles,
} from "lucide-react";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/routine",   icon: ClipboardCheck,  label: "Routine" },
  { href: "/symptoms",  icon: Activity,         label: "Track" },
  { href: "/photos",    icon: Camera,           label: "Photos" },
  { href: "/analytics", icon: BarChart2,        label: "Charts" },
  { href: "/insights",  icon: Sparkles,         label: "AI" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div
        className="border-t border-[var(--glass-border)] px-1 pt-2"
        style={{ background: "hsl(228 42% 4% / 0.96)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5"
              >
                <div className="relative p-2.5 rounded-2xl">
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-2xl border border-[var(--teal)]/20"
                      style={{
                        background: "linear-gradient(135deg, rgba(20,184,166,0.18) 0%, rgba(52,211,153,0.08) 100%)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.7}
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      active ? "text-[var(--teal)]" : "text-[hsl(var(--muted-foreground))]"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors duration-200",
                    active ? "text-[var(--teal)]" : "text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
