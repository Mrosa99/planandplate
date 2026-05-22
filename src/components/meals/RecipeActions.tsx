"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Heart, BookMarked, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/AuthProvider";
import {
  addFavorite,
  removeFavorite,
  fetchFavoriteMealIds,
} from "@/lib/supabase/favorites";
import {
  fetchCollections,
  addMealToCollection,
  createCollection,
} from "@/lib/supabase/collections";
import { CollectionItem } from "@/lib/supabase/types";

export function RecipeActions({ mealId }: { mealId: string }) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [isFavorited, setIsFavorited] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchFavoriteMealIds(userId)
      .then((ids) => setIsFavorited(ids.has(mealId)))
      .catch(() => {});
  }, [userId, mealId]);

  async function handleToggleFavorite() {
    if (!userId) return;
    setTogglingFav(true);
    const wasF = isFavorited;
    setIsFavorited(!wasF);
    try {
      wasF
        ? await removeFavorite(userId, mealId)
        : await addFavorite(userId, mealId);
    } catch {
      setIsFavorited(wasF);
    } finally {
      setTogglingFav(false);
    }
  }

  async function handleOpenCollections() {
    if (!userId) return;
    setCollectionsOpen(true);
    if (collections.length === 0) {
      fetchCollections(userId)
        .then(setCollections)
        .catch(() => {});
    }
  }

  async function handleAddToCollection(collectionId: string) {
    setAddingToId(collectionId);
    try {
      await addMealToCollection(collectionId, mealId);
      setCollectionsOpen(false);
    } catch (err) {
      if (err instanceof Error && err.message === "already_in_collection") {
        toast.info("This meal is already in that collection");
      } else {
        toast.error("Failed to add to collection");
      }
    } finally {
      setAddingToId(null);
    }
  }

  async function handleCreateAndAdd() {
    if (!userId || !newCollectionName.trim()) return;
    setCreatingCollection(true);
    try {
      const id = await createCollection(userId, newCollectionName.trim());
      await addMealToCollection(id, mealId);
      setCollections((prev) => [{ id, name: newCollectionName.trim(), recipeCount: 1 }, ...prev]);
      setNewCollectionName("");
      setCollectionsOpen(false);
      toast.success(`Added to "${newCollectionName.trim()}"`);
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setCreatingCollection(false);
    }
  }

  if (!userId) return null;

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isFavorited ? "default" : "outline"}
          className={`gap-1.5 ${isFavorited ? "text-white" : "border-primary/40 text-primary hover:bg-primary/10"}`}
          onClick={handleToggleFavorite}
          disabled={togglingFav}
        >
          <Heart
            className={`size-3.5 ${isFavorited ? "text-white" : ""}`}
            fill={isFavorited ? "#f97316" : "none"}
          />
          {isFavorited ? "Favorited" : "Favorite"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
          onClick={handleOpenCollections}
        >
          <BookMarked className="size-3.5" />
          Collection
        </Button>
      </div>

      <Dialog open={collectionsOpen} onOpenChange={(o) => { setCollectionsOpen(o); if (!o) setNewCollectionName(""); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add to collection</DialogTitle>
          </DialogHeader>
          {collections.length > 0 && (
            <ul className="flex flex-col gap-1 mt-1">
              {collections.map((col) => (
                <li key={col.id}>
                  <button
                    onClick={() => handleAddToCollection(col.id)}
                    disabled={addingToId === col.id}
                    className="w-full flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted transition-colors text-left text-sm"
                  >
                    <span className="font-medium">{col.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {addingToId === col.id
                        ? "Adding..."
                        : `${col.recipeCount} recipes`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t pt-3 mt-1 flex gap-2">
            <Input
              placeholder="New collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
            />
            <Button
              size="sm"
              onClick={handleCreateAndAdd}
              disabled={!newCollectionName.trim() || creatingCollection}
              className="shrink-0"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
