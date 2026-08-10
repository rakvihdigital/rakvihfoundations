// src/app/foundation/page.tsx
import { supabaseAdmin } from "@/lib/supabase-admin";
import HomeClient from "./HomeClient";

export const revalidate = 60;

type CauseCategory = {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
};

type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
};

async function getCauses(): Promise<CauseCategory[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("cause_categories")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(4);

  if (error) {
    console.error("Failed to load cause_categories:", error.message);
    return [];
  }
  return data ?? [];
}

async function getGallery(): Promise<GalleryItem[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Failed to load gallery:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const [causes, gallery] = await Promise.all([getCauses(), getGallery()]);
  return <HomeClient causes={causes} gallery={gallery} />;
}