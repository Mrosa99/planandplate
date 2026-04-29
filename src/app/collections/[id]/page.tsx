import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return (
    <main className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/collections"
          className="inline-block mb-6 text-primary font-semibold hover:underline"
        >
          ← Back to Collections
        </Link>

        <h1 className="text-3xl font-bold mb-8">Collection</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Add meal tile */}
          <button className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card h-[11.5rem] gap-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Plus className="size-8" />
            <span className="text-sm font-medium">Add a meal</span>
          </button>
        </div>

      </div>
    </main>
  );
}
