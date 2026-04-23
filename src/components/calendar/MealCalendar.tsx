"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type MealEntry = {
  id: string;
  date: string;
  type: MealType;
  name: string;
  notes: string;
};

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const MEAL_COLORS: Record<MealType, string> = {
  Breakfast: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Lunch:     "bg-green-500/20 text-green-300 border-green-500/30",
  Dinner:    "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Snack:     "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const STORAGE_KEY = "planandplate-calendar";

export function MealCalendar() {
  const today = new Date();
  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth());
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [formType, setFormType]   = useState<MealType>("Breakfast");
  const [formName, setFormName]   = useState("");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  function saveEntries(next: MealEntry[]) {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function openDay(dateKey: string) {
    setSelectedDate(dateKey);
    setFormType("Breakfast");
    setFormName("");
    setFormNotes("");
    setModalOpen(true);
  }

  function addEntry() {
    if (!selectedDate || !formName.trim()) return;
    const entry: MealEntry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      type: formType,
      name: formName.trim(),
      notes: formNotes.trim(),
    };
    saveEntries([...entries, entry]);
    setFormName("");
    setFormNotes("");
  }

  function deleteEntry(id: string) {
    saveEntries(entries.filter(e => e.id !== id));
  }

  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const todayKey     = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedEntries = selectedDate
    ? entries.filter(e => e.date === selectedDate)
    : [];

  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
      })
    : "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MEAL_TYPES.map(type => (
          <span
            key={type}
            className={`text-xs px-2.5 py-0.5 rounded-full border ${MEAL_COLORS[type]}`}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="min-h-[90px] rounded-lg" />;

          const dateKey    = toDateKey(year, month, day);
          const dayEntries = entries.filter(e => e.date === dateKey);
          const isToday    = dateKey === todayKey;

          return (
            <div
              key={i}
              onClick={() => openDay(dateKey)}
              className={`min-h-[90px] p-1.5 rounded-lg border cursor-pointer transition-colors select-none
                ${isToday
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/40"
                }`}
            >
              <span
                className={`text-xs font-semibold mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full
                  ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}
              >
                {day}
              </span>
              <div className="flex flex-col gap-0.5 mt-0.5">
                {dayEntries.slice(0, 3).map(entry => (
                  <span
                    key={entry.id}
                    className={`text-[10px] leading-tight px-1 py-0.5 rounded border truncate ${MEAL_COLORS[entry.type]}`}
                  >
                    {entry.name}
                  </span>
                ))}
                {dayEntries.length > 3 && (
                  <span className="text-[10px] text-muted-foreground pl-0.5">
                    +{dayEntries.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formattedSelectedDate}</DialogTitle>
          </DialogHeader>

          {/* Existing meals */}
          {selectedEntries.length > 0 && (
            <div className="space-y-2 mb-2">
              {selectedEntries.map(entry => (
                <div
                  key={entry.id}
                  className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border ${MEAL_COLORS[entry.type]}`}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium opacity-70 uppercase tracking-wide">
                      {entry.type}
                    </p>
                    <p className="text-sm font-semibold truncate">{entry.name}</p>
                    {entry.notes && (
                      <p className="text-xs opacity-60 truncate">{entry.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 mt-0.5"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add meal form */}
          <div className={`space-y-3 ${selectedEntries.length > 0 ? "border-t pt-4" : ""}`}>
            <p className="text-sm font-medium">Add a meal</p>

            {/* Meal type picker */}
            <div className="grid grid-cols-4 gap-1.5">
              {MEAL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  className={`text-xs py-1.5 rounded-lg border transition-colors font-medium
                    ${formType === type
                      ? MEAL_COLORS[type]
                      : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <Label htmlFor="meal-name">Meal name</Label>
              <Input
                id="meal-name"
                placeholder="e.g. Grilled Salmon"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addEntry()}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="meal-notes">Notes (optional)</Label>
              <Input
                id="meal-notes"
                placeholder="e.g. Use lemon herb marinade"
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addEntry()}
              />
            </div>

            <Button
              className="w-full"
              onClick={addEntry}
              disabled={!formName.trim()}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Meal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
