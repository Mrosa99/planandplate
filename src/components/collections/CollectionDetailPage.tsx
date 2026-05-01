"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, ArrowLeft, BookMarked, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { useSearch } from "@/lib/hooks/use-search";
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
import {
  addMealToCollection,
  fetchCollectionMeals,
  fetchCollectionName,
  renameCollection,
  removeMealFromCollection,
} from "@/lib/supabase/collections";
import { MealTileCard } from "@/components/meals/MealTileCard";
import { MealData } from "@/lib/supabase/types";

export function CollectionDetailPage({ collectionId }: { collectionId: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<MealData | null>(null);
  const [adding, setAdding] = useState(false);

  const [collectionName, setCollectionName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const { items: meals, loading, observerRef } = useSearch(query);

  const fetchFn = useCallback(
    (limit: number, offset: number) => fetchCollectionMeals(collectionId, limit, offset),
    [collectionId],
  );
  const { items: collectionMeals, observerRef: gridObserverRef, reset, removeItem } = useInfiniteScroll(fetchFn);

  useEffect(() => {
    fetchCollectionName(collectionId)
      .then((name) => { setCollectionName(name); setEditName(name); })
      .catch(() => {});
  }, [collectionId]);

  async function handleAddToCollection() {
    if (!selectedMeal) return;
    setAdding(true);
    try {
      await addMealToCollection(collectionId, selectedMeal.id_meal);
      reset();
      handleOpenChange(false);
    } finally {
      setAdding(false);
    }
  }

  function handleOpenChange(o: boolean) {
    setOpen(o);
    if (!o) {
      setQuery("");
      setSelectedMeal(null);
    }
  }

  function handleSelectMeal(meal: MealData) {
    setSelectedMeal(meal);
  }

  function handleBack() {
    setSelectedMeal(null);
  }

  async function handleSaveName() {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === collectionName) return;
    setSaving(true);
    const prev = collectionName;
    setCollectionName(trimmed);
    try {
      await renameCollection(collectionId, trimmed);
    } catch {
      setCollectionName(prev);
      setEditName(prev);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveMeal(mealId: string) {
    setPendingRemoveId(null);
    removeItem((m) => m.id_meal === mealId);
    try {
      await removeMealFromCollection(collectionId, mealId);
    } catch {
      reset();
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/collections"
          className="inline-block mb-6 text-primary font-semibold hover:underline"
        >
          ← Back to Collections
        </Link>

        <div className="flex items-center justify-between mb-8">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              disabled={saving}
              className="text-3xl font-bold h-auto py-1 px-2 max-w-sm"
              autoFocus
            />
          ) : (
            <h1 className="text-3xl font-bold">{collectionName || "Collection"}</h1>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (isEditing) handleSaveName();
              setIsEditing((v) => !v);
            }}
          >
            {isEditing ? <><Check className="size-4" /> Done</> : <><Pencil className="size-4" /> Edit</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collectionMeals.map((meal) => (
            <MealTileCard
              key={meal.id_meal}
              meal={meal}
              onRemove={isEditing ? (id) => setPendingRemoveId(id) : undefined}
            />
          ))}

          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card h-[11.5rem] gap-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Plus className="size-8" />
            <span className="text-sm font-medium">Add a meal</span>
          </button>
        </div>

        {collectionMeals.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-12 flex flex-col items-center gap-2">
            <BookMarked className="size-8 opacity-30" />
            No meals yet. Add one to get started.
          </p>
        )}

        <div ref={gridObserverRef} className="h-10" />

      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">

          {selectedMeal ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="size-4" />
                  </button>
                  <DialogTitle>Add to collection</DialogTitle>
                </div>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 py-2">
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={selectedMeal.image_url}
                    alt={selectedMeal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-lg font-semibold text-center">{selectedMeal.name}</p>
                <Button className="w-full" onClick={handleAddToCollection} disabled={adding}>
                  {adding ? "Adding..." : "Add to collection"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add a meal</DialogTitle>
              </DialogHeader>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search meals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="max-h-72 overflow-y-auto flex flex-col gap-0.5 mt-1">
                {!query && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Start typing to find a meal.
                  </p>
                )}
                {query && !loading && meals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No results for &ldquo;{query}&rdquo;.
                  </p>
                )}
                {meals.map((meal) => (
                  <button
                    key={meal.id_meal}
                    onClick={() => handleSelectMeal(meal)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors text-left w-full"
                  >
                    <div className="relative size-10 shrink-0 rounded-md overflow-hidden">
                      <Image src={meal.image_url} alt={meal.name} fill className="object-cover" />
                    </div>
                    <span className="text-sm font-medium truncate">{meal.name}</span>
                  </button>
                ))}
                <div ref={observerRef} className="h-2" />
              </div>
            </>
          )}

        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingRemoveId} onOpenChange={(o) => { if (!o) setPendingRemoveId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from collection?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This meal will be removed from this collection.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => pendingRemoveId && handleRemoveMeal(pendingRemoveId)}
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
