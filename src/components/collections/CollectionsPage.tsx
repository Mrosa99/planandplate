"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { CollectionCard } from "./CollectionCard";
import {
  createCollection,
  deleteCollection,
  fetchCollections,
} from "@/lib/supabase/collections";
import { useAuth } from "@/components/AuthProvider";
import { CollectionItem } from "@/lib/supabase/types";

export function CollectionsPage() {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchCollections(userId)
      .then(setCollections)
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleDelete(id: string) {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) setIsEditing(false);
      return next;
    });
    try {
      await deleteCollection(id);
    } catch {
      // refetch on failure to restore accurate state
      if (userId) fetchCollections(userId).then(setCollections);
    }
  }

  async function handleCreate() {
    if (!userId || !name.trim()) return;
    setCreating(true);
    try {
      const id = await createCollection(userId, name.trim());
      setCollections((prev) => [
        { id, name: name.trim(), recipeCount: 0 },
        ...prev,
      ]);
      setName("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Collections</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Organize your saved recipes into groups.
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog
              open={open}
              onOpenChange={(o) => {
                setOpen(o);
                if (!o) setName("");
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" /> New Collection
                </Button>
              </DialogTrigger>
              {collections.length > 0 && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsEditing((v) => !v)}
                >
                  {isEditing ? (
                    <>
                      <Check className="size-4" /> Done
                    </>
                  ) : (
                    <>
                      <Pencil className="size-4" /> Edit
                    </>
                  )}
                </Button>
              )}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Collection</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-2">
                  <Input
                    placeholder="Collection name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    autoFocus
                  />
                  <Button
                    onClick={handleCreate}
                    disabled={!name.trim() || creating}
                  >
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading && <p className="text-muted-foreground text-sm">Loading...</p>}

        {!loading && collections.length === 0 && (
          <p className="text-muted-foreground text-sm text-center mt-16">
            No collections yet. Create one to get started.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <CollectionCard
              key={col.id}
              name={col.name}
              recipeCount={col.recipeCount}
              coverImage={col.coverImage}
              href={`/collections/${col.id}`}
              onDelete={isEditing ? () => setPendingDeleteId(col.id) : undefined}
            />
          ))}
        </div>
      </div>

      <Dialog open={!!pendingDeleteId} onOpenChange={(o) => { if (!o) setPendingDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete collection?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the collection and remove all its meals. This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDeleteId) handleDelete(pendingDeleteId);
                setPendingDeleteId(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
