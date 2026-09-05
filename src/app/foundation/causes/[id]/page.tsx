import { redirect } from "next/navigation";

export default async function CauseIdRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/foundation/causes?category=${encodeURIComponent(id)}`);
}
