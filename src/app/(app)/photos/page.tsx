"use client";
import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTodayString, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Camera, Upload, ChevronRight, Image as ImageIcon,
  User, MoveRight, Layers,
} from "lucide-react";

const PHOTO_SLOTS = [
  { key: "front", label: "Front Face", required: true, icon: "👤" },
  { key: "left", label: "Left Profile", required: true, icon: "👤" },
  { key: "right", label: "Right Profile", required: true, icon: "👤" },
  { key: "forehead", label: "Forehead Close-up", required: true, icon: "🔍" },
  { key: "nose", label: "Nose Close-up", required: false, icon: "🔍" },
  { key: "beard_jaw", label: "Beard / Jaw", required: false, icon: "🧔" },
];

interface PhotoSession {
  id: string;
  date: string;
  photos: Record<string, string>;
  lighting_notes: string;
}

export default function PhotosPage() {
  const today = getTodayString();
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [currentPhotos, setCurrentPhotos] = useState<Record<string, string>>({});
  const [lighting, setLighting] = useState("");
  const [tab, setTab] = useState<"upload" | "history" | "compare">("upload");
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeSlot) return;
    const url = URL.createObjectURL(file);
    setCurrentPhotos((prev) => ({ ...prev, [activeSlot]: url }));
    e.target.value = "";
  }

  function openPicker(slot: string) {
    setActiveSlot(slot);
    inputRef.current?.click();
  }

  function saveSession() {
    const session: PhotoSession = {
      id: Date.now().toString(),
      date: today,
      photos: currentPhotos,
      lighting_notes: lighting,
    };
    setSessions((prev) => [session, ...prev]);
    setCurrentPhotos({});
    setLighting("");
  }

  const requiredCount = PHOTO_SLOTS.filter((s) => s.required).length;
  const uploadedRequired = PHOTO_SLOTS.filter((s) => s.required && currentPhotos[s.key]).length;
  const canSave = uploadedRequired >= requiredCount;

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Photo Tracker" subtitle="Visual skin progress" />

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} capture="environment" />

      {/* Tabs */}
      <div className="flex rounded-xl bg-white/5 p-1 mt-4 mb-4">
        {(["upload", "history", "compare"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
              tab === t ? "bg-[var(--teal)] text-[hsl(222,47%,6%)]" : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera size={15} className="text-[var(--teal)]" />
                  Today&apos;s Photos — {today}
                </CardTitle>
                <Badge variant={canSave ? "success" : "muted"}>{uploadedRequired}/{requiredCount} Required</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {PHOTO_SLOTS.map(({ key, label, required, icon }) => {
                  const photo = currentPhotos[key];
                  return (
                    <button
                      key={key}
                      onClick={() => openPicker(key)}
                      className="relative aspect-square rounded-xl overflow-hidden border border-[var(--glass-border)] bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2"
                    >
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={label} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <>
                          <span className="text-2xl">{icon}</span>
                          <span className="text-xs text-[hsl(var(--muted-foreground))] text-center px-2">{label}</span>
                          {required && <span className="text-[9px] text-[var(--teal)] uppercase tracking-wider">Required</span>}
                        </>
                      )}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${photo ? "bg-emerald-500" : "bg-white/10"}`}>
                        {photo ? <span className="text-white text-xs">✓</span> : <Upload size={10} className="text-[hsl(var(--muted-foreground))]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5 block">Lighting Notes (optional)</label>
                <input
                  type="text"
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  placeholder="e.g. Natural daylight, bathroom LED..."
                  className="w-full bg-white/5 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--teal)] transition-colors"
                />
              </div>

              <Button className="w-full mt-4" disabled={!canSave} onClick={saveSession}>
                <Upload size={14} /> Save Photo Session
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <div className="flex flex-col gap-3">
          {sessions.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-[hsl(var(--muted-foreground))]">
              <ImageIcon size={40} strokeWidth={1} />
              <p className="text-sm">No photo sessions yet.</p>
              <p className="text-xs">Upload your first session in the Upload tab.</p>
            </div>
          )}
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">{formatDate(session.date)}</p>
                  <Badge variant="muted">{Object.keys(session.photos).length} photos</Badge>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {Object.entries(session.photos).map(([slot, url]) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={slot} src={url} alt={slot} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  ))}
                </div>
                {session.lighting_notes && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">{session.lighting_notes}</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    const frontUrl = session.photos["front"];
                    if (frontUrl) {
                      if (!compareA) setCompareA(frontUrl);
                      else setCompareB(frontUrl);
                    }
                    setTab("compare");
                  }}
                >
                  <Layers size={13} /> Use in Compare
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "compare" && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers size={15} className="text-[var(--teal)]" />
                Side-by-Side Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[{ label: "Before", url: compareA, set: setCompareA }, { label: "After", url: compareB, set: setCompareB }].map(({ label, url, set }) => (
                  <div key={label} className="flex flex-col gap-2">
                    <span className="text-xs text-[hsl(var(--muted-foreground))] text-center">{label}</span>
                    <div className="aspect-square rounded-xl overflow-hidden border border-[var(--glass-border)] bg-white/5 flex items-center justify-center">
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={label} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-[hsl(var(--muted-foreground))]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {compareA && compareB && (
                <>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Slider comparison</p>
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-[var(--glass-border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={compareB} alt="after" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={compareA} alt="before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / sliderPos}%` }} />
                    </div>
                    <div className="absolute inset-y-0 flex items-center" style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}>
                      <div className="w-0.5 h-full bg-white opacity-80" />
                      <div className="absolute w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <MoveRight size={14} className="text-slate-700" />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                    />
                  </div>
                </>
              )}

              {(!compareA || !compareB) && (
                <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-8">
                  Select photos from History tab to compare them.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
