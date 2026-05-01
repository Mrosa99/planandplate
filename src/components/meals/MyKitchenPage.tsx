"use client";

import { useState, useEffect } from "react";
import { Plus, UtensilsCrossed, Trash2, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  const [open, setOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchUserCreatedMeals(userId)
      .then(setMeals)
      .finally(() => setLoading(false));
  }, [userId]);

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

        {loading && <p className="text-muted-foreground text-sm">Loading...</p>}

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div key={meal.id_meal} className="group relative flex flex-col rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-200">

              {/* Image */}
              <Link href={`/recipes/${meal.id_meal}`} className="block">
                <div className="relative h-40 w-full bg-muted flex items-center justify-center">
                  {meal.image_url ? (
                    <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover" />
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
                  onClick={() => handleToggleVisibility(meal)}
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
