import { CollectionDetailPage } from "@/components/collections/CollectionDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CollectionDetailPage collectionId={id} />;
}
