"use client";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Sun, Moon, Droplets, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: "1", type: "reminder", icon: Sun, color: "text-amber-400 bg-amber-500/15", title: "AM Routine", body: "Start your morning skincare — SPF is key today!", time: "7:30 AM", read: false },
  { id: "2", type: "insight", icon: AlertCircle, color: "text-rose-400 bg-rose-500/15", title: "Breakout Alert", body: "Acne count was higher yesterday — track symptoms today.", time: "9:00 AM", read: false },
  { id: "3", type: "reminder", icon: Moon, color: "text-indigo-400 bg-indigo-500/15", title: "PM Routine", body: "Don't forget your evening routine. Tonight: MyTret night.", time: "9:30 PM", read: true },
  { id: "4", type: "reminder", icon: Camera, color: "text-violet-400 bg-violet-500/15", title: "Weekly Photos", body: "Time for your Sunday comparison photos. Good lighting matters!", time: "Sun 8:00 AM", read: true },
  { id: "5", type: "achievement", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/15", title: "10-Day Streak!", body: "You've completed your routine 10 days in a row. Keep it up!", time: "Yesterday", read: true },
  { id: "6", type: "reminder", icon: Droplets, color: "text-sky-400 bg-sky-500/15", title: "Hydration Check", body: "Have you had 8 glasses of water today?", time: "2:00 PM", read: true },
];

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Notifications" />

      <div className="mt-4 flex flex-col gap-3">
        {unread > 0 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">{unread} unread</span>
            <button className="text-xs text-[var(--teal)] font-medium">Mark all read</button>
          </div>
        )}

        {NOTIFICATIONS.map((n) => {
          const Icon = n.icon;
          return (
            <Card key={n.id} className={`transition-all ${n.read ? "opacity-70" : ""}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold truncate">{n.title}</h3>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 opacity-60">{n.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
