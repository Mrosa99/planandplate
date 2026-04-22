export default function CollectionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="container mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold">Collection</h1>
      <p className="text-muted-foreground mt-2">Recipes in this collection will appear here.</p>
    </main>
  );
}
