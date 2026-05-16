"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  Activity,
  Camera,
  BarChart2,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/routine", icon: ClipboardCheck, label: "Routine" },
  { href: "/symptoms", icon: Activity, label: "Track" },
  { href: "/photos", icon: Camera, label: "Photos" },
  { href: "/analytics", icon: BarChart2, label: "Charts" },
  { href: "/insights", icon: Sparkles, label: "AI" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass-card border-t border-[var(--glass-border)] backdrop-blur-xl px-2 pt-2">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200",
                  active ? "text-[var(--teal)]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                <div className={cn("p-1.5 rounded-xl transition-all", active && "bg-[var(--teal)]/15")}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
