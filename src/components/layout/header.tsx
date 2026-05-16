"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Settings, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSettings?: boolean;
}

export function Header({ title, subtitle, showSettings = false }: HeaderProps) {
  const { theme, toggleTheme } = useAppStore();

  return (
    <header className="sticky top-0 z-40 px-5 pt-safe-top pb-3 glass-card border-b border-[var(--glass-border)]">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <h1 className="text-xl font-bold gradient-text">{title}</h1>
          {subtitle && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
              <Bell size={18} />
            </Button>
          </Link>
          {showSettings && (
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Settings">
                <Settings size={18} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
