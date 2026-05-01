"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserMeal } from "@/lib/supabase/types";

interface IngredientRow {
  _key: number;
  name: string;
  measure: string;
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

export function CreateMealDialog({ accessToken, open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([emptyIngredient()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName(""); setImageUrl(""); setCategory(""); setArea("");
    setInstructions(""); setIngredients([emptyIngredient()]); setError(null);
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
          category: category.trim() || undefined,
          area: area.trim() || undefined,
          instructions: instructions.trim() || undefined,
          ingredients: ingredients.filter((i) => i.name.trim()),
        }),
      });

      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }

      onCreated({
        id_meal: json.id_meal,
        name: name.trim(),
        image_url: imageUrl.trim() || undefined,
        category: category.trim() || undefined,
        area: area.trim() || undefined,
        is_public: false,
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
              <Input placeholder="e.g. Pasta" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Cuisine <span className="text-xs">(optional)</span></label>
              <Input placeholder="e.g. Italian" value={area} onChange={(e) => setArea(e.target.value)} />
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Instructions <span className="text-xs">(optional)</span></label>
            <textarea
              placeholder="Describe how to make this meal, step by step..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
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
