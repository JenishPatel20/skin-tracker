"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTodayString, formatDate } from "@/lib/utils";
import { FileText, Plus, CheckCircle2, Trash2 } from "lucide-react";

interface Note {
  id: string;
  date: string;
  content: string;
  created_at: string;
}

const QUICK_TAGS = [
  "Big breakout",
  "Skin feels smooth",
  "Dryness after tret",
  "Oily day",
  "New product",
  "Poor sleep",
  "Stressed",
  "Ate pizza",
  "Lots of water",
  "Exercised",
];

export default function NotesPage() {
  const today = getTodayString();
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("skintrack-notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  function persistNotes(updated: Note[]) {
    setNotes(updated);
    localStorage.setItem("skintrack-notes", JSON.stringify(updated));
  }

  function addNote() {
    if (!draft.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      date: today,
      content: draft.trim(),
      created_at: new Date().toISOString(),
    };
    persistNotes([note, ...notes]);
    setDraft("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function deleteNote(id: string) {
    persistNotes(notes.filter((n) => n.id !== id));
  }

  function appendTag(tag: string) {
    setDraft((prev) => (prev ? prev + " · " + tag : tag));
  }

  const grouped: Record<string, Note[]> = {};
  notes.forEach((n) => {
    if (!grouped[n.date]) grouped[n.date] = [];
    grouped[n.date].push(n);
  });

  return (
    <div className="px-4 pt-4 pb-4">
      <Header title="Journal" subtitle="Skin notes & observations" />

      <div className="mt-4 flex flex-col gap-4">
        {/* Write area */}
        <Card>
          <CardContent className="pt-4">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What's going on with your skin today? Note breakouts, reactions, changes..."
              rows={4}
              className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder:text-[hsl(var(--muted-foreground))] leading-relaxed"
            />
            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mt-3 pb-1">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => appendTag(tag)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-white/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <Button onClick={addNote} disabled={!draft.trim()} size="sm">
                {saved ? <><CheckCircle2 size={13} /> Saved</> : <><Plus size={13} /> Add Note</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes list */}
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-[hsl(var(--muted-foreground))]">
            <FileText size={40} strokeWidth={1} />
            <p className="text-sm">No journal entries yet.</p>
            <p className="text-xs">Start by writing an observation above.</p>
          </div>
        )}

        {Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, dayNotes]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2 px-1">
                {formatDate(date)}
              </h3>
              <div className="flex flex-col gap-2">
                {dayNotes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] mt-2 flex-shrink-0" />
                        <p className="text-sm leading-relaxed flex-1">{note.content}</p>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2 ml-4.5">
                        {new Date(note.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
