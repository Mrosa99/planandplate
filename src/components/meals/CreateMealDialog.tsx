"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserMeal } from "@/lib/supabase/types";
import { CategoryOption, AreaOption } from "@/lib/supabase/fetch-options";

interface IngredientRow {
  _key: number;
  name: string;
  measure: string;
}

interface StepRow {
  _key: number;
  text: string;
}

interface Props {
  accessToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (meal: UserMeal) => void;
}

const emptyIngredient = (): IngredientRow => ({
  _key: Date.now() + Math.random(),
  name: "",
  measure: "",
});

const emptyStep = (): StepRow => ({
  _key: Date.now() + Math.random(),
  text: "",
});

export function CreateMealDialog({ accessToken, open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [steps, setSteps] = useState<StepRow[]>([emptyStep()]);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([emptyIngredient()]);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [areas, setAreas] = useState<AreaOption[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/options", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then(({ categories, areas }) => {
        setCategories(categories ?? []);
        setAreas(areas ?? []);
      })
      .catch(() => {});
  // accessToken is stable for the session lifetime — fetch once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset() {
    setName(""); setImageUrl(""); setCategory(""); setArea("");
    setSteps([emptyStep()]); setIngredients([emptyIngredient()]); setIsPublic(false); setError(null);
  }

  function handleOpenChange(o: boolean) {
    if (!o) reset();
    onOpenChange(o);
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, emptyIngredient()]);
  }

  function removeIngredient(key: number) {
    setIngredients((prev) => prev.filter((i) => i._key !== key));
  }

  function updateIngredient(key: number, field: "name" | "measure", value: string) {
    setIngredients((prev) => prev.map((i) => (i._key === key ? { ...i, [field]: value } : i)));
  }

  function addStep() {
    setSteps((prev) => [...prev, emptyStep()]);
  }

  function removeStep(key: number) {
    setSteps((prev) => prev.filter((s) => s._key !== key));
  }

  function updateStep(key: number, value: string) {
    setSteps((prev) => prev.map((s) => (s._key === key ? { ...s, text: value } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          image_url: imageUrl.trim() || undefined,
          category: category || undefined,
          area: area || undefined,
          instructions: steps.filter((s) => s.text.trim()).map((s) => s.text.trim()).join("\n\n") || undefined,
          ingredients: ingredients.filter((i) => i.name.trim()),
          is_public: isPublic,
        }),
      });

      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }

      onCreated({
        id_meal: json.id_meal,
        name: name.trim(),
        image_url: imageUrl.trim() || undefined,
        category: category || undefined,
        area: area || undefined,
        is_public: isPublic,
        ingredientCount: ingredients.filter((i) => i.name.trim()).length,
      });
      handleOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">New Meal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Meal name <span className="text-destructive">*</span></label>
            <Input
              placeholder="e.g. Grandma's Lasagna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Image URL <span className="text-xs">(optional)</span></label>
            <Input
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border mt-1">
                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="size-3.5 text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Category <span className="text-xs">(optional)</span></label>
              <Select value={category || "__none__"} onValueChange={(v) => setCategory(v === "__none__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select a category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id_category} value={c.category}>{c.category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Cuisine <span className="text-xs">(optional)</span></label>
              <Select value={area || "__none__"} onValueChange={(v) => setArea(v === "__none__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select a cuisine</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a.id_area} value={a.area}>{a.area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Ingredients</label>
            <div className="flex flex-col gap-2">
              {ingredients.map((ing) => (
                <div key={ing._key} className="flex gap-2 items-center">
                  <Input
                    placeholder="Ingredient"
                    value={ing.name}
                    onChange={(e) => updateIngredient(ing._key, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Amount"
                    value={ing.measure}
                    onChange={(e) => updateIngredient(ing._key, "measure", e.target.value)}
                    className="w-28"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing._key)}
                    className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2 self-start" onClick={addIngredient}>
              <Plus className="size-3.5" /> Add ingredient
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Instructions <span className="text-xs text-muted-foreground">(optional)</span></label>
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => (
                <div key={step._key} className="flex gap-2 items-start">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mt-2">
                    {i + 1}
                  </span>
                  <textarea
                    placeholder={`Step ${i + 1}...`}
                    value={step.text}
                    onChange={(e) => updateStep(step._key, e.target.value)}
                    rows={2}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(step._key)}
                    className="p-2 mt-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2 self-start" onClick={addStep}>
              <Plus className="size-3.5" /> Add step
            </Button>
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Visibility</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPublic ? "Anyone can see this meal" : "Only you can see this meal"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic((v) => !v)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                isPublic
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              }`}
            >
              {isPublic ? <><Globe className="size-3" /> Published</> : <><Lock className="size-3" /> Private</>}
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!name.trim() || saving}>
              {saving ? "Saving..." : "Create meal"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
