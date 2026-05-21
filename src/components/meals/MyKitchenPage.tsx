"use client";

import { useState, useEffect } from "react";
import { Plus, UtensilsCrossed, Trash2, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import { fetchUserCreatedMeals, toggleMealVisibility, deleteUserMeal } from "@/lib/supabase/user-meals";
import { CreateMealDialog } from "@/components/meals/CreateMealDialog";
import { UserMeal } from "@/lib/supabase/types";

export function MyKitchenPage() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const accessToken = session?.access_token ?? "";

  const [meals, setMeals] = useState<UserMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingPublishId, setPendingPublishId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterArea, setFilterArea] = useState("");

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchUserCreatedMeals(userId)
      .then(setMeals)
      .catch((err) => setFetchError(err?.message ?? "Failed to load meals"))
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredMeals = meals.filter((m) =>
    (!filterCategory || m.category === filterCategory) &&
    (!filterArea || m.area === filterArea),
  );

  const mealCategories = Array.from(new Set(meals.map((m) => m.category).filter(Boolean))) as string[];
  const mealAreas = Array.from(new Set(meals.map((m) => m.area).filter(Boolean))) as string[];

  async function handleToggleVisibility(meal: UserMeal) {
    setTogglingId(meal.id_meal);
    const next = !meal.is_public;
    setMeals((prev) => prev.map((m) => m.id_meal === meal.id_meal ? { ...m, is_public: next } : m));
    try {
      await toggleMealVisibility(meal.id_meal, next);
    } catch {
      setMeals((prev) => prev.map((m) => m.id_meal === meal.id_meal ? { ...m, is_public: meal.is_public } : m));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    setMeals((prev) => prev.filter((m) => m.id_meal !== id));
    setPendingDeleteId(null);
    try {
      await deleteUserMeal(id);
    } catch {
      if (userId) fetchUserCreatedMeals(userId).then(setMeals);
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Kitchen</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Your own recipes, all in one place.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> New Meal
          </Button>
        </div>

        {/* Filters */}
        {meals.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={filterCategory || "__all__"} onValueChange={(v) => setFilterCategory(v === "__all__" ? "" : v)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Categories</SelectItem>
                {mealCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterArea || "__all__"} onValueChange={(v) => setFilterArea(v === "__all__" ? "" : v)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Cuisines</SelectItem>
                {mealAreas.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(filterCategory || filterArea) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setFilterCategory(""); setFilterArea(""); }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {loading && <p className="text-muted-foreground text-sm">Loading...</p>}

        {fetchError && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 mb-4">{fetchError}</p>
        )}

        {!loading && meals.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <UtensilsCrossed className="size-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold">No meals yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first meal to get started.</p>
            </div>
            <Button className="gap-2 mt-2" onClick={() => setOpen(true)}>
              <Plus className="size-4" /> New Meal
            </Button>
          </div>
        )}

        {!loading && meals.length > 0 && filteredMeals.length === 0 && (
          <p className="text-sm text-muted-foreground mt-8 text-center">No meals match the selected filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <div key={meal.id_meal} className="group relative flex flex-col rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200">

              {/* Image */}
              <Link href={`/recipes/${meal.id_meal}`} className="block">
                <div className="relative h-40 w-full bg-muted flex items-center justify-center">
                  {meal.image_url ? (
                    meal.image_url.startsWith("http")
                      ? <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover" />
                      : <span className="text-5xl select-none">{meal.image_url}</span>
                  ) : (
                    <UtensilsCrossed className="size-10 text-muted-foreground/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <button
                    onClick={(e) => { e.preventDefault(); setPendingDeleteId(meal.id_meal); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-destructive/80 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete meal"
                  >
                    <Trash2 className="size-4 text-white" />
                  </button>
                </div>
              </Link>

              {/* Info */}
              <div className="px-4 py-3 flex flex-col gap-2">
                <Link href={`/recipes/${meal.id_meal}`} className="font-semibold text-sm truncate hover:underline">
                  {meal.name}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {meal.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      {meal.category}
                    </span>
                  )}
                  {meal.area && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-muted text-muted-foreground font-medium">
                      {meal.area}
                    </span>
                  )}
                </div>
                {meal.ingredientCount > 0 && (
                  <p className="text-xs text-muted-foreground">{meal.ingredientCount} ingredients</p>
                )}

                {/* Publish toggle */}
                <button
                  onClick={() => meal.is_public ? handleToggleVisibility(meal) : setPendingPublishId(meal.id_meal)}
                  disabled={togglingId === meal.id_meal}
                  className={`flex items-center gap-1.5 self-start text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    meal.is_public
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  }`}
                >
                  {meal.is_public
                    ? <><Globe className="size-3" /> Published</>
                    : <><Lock className="size-3" /> Private</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {accessToken && (
        <CreateMealDialog
          accessToken={accessToken}
          open={open}
          onOpenChange={setOpen}
          onCreated={(meal) => setMeals((prev) => [meal, ...prev])}
        />
      )}

      {pendingPublishId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
            <div>
              <p className="font-semibold">Make this meal public?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Everyone will be able to see this meal in search and browse. You can make it private again at any time.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPendingPublishId(null)}>Cancel</Button>
              <Button onClick={() => {
                const meal = meals.find((m) => m.id_meal === pendingPublishId);
                if (meal) handleToggleVisibility(meal);
                setPendingPublishId(null);
              }}>
                Yes, publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
            <div>
              <p className="font-semibold">Delete meal?</p>
              <p className="text-sm text-muted-foreground mt-1">This cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPendingDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(pendingDeleteId)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
