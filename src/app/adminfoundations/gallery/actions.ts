"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getGalleryImages() {
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery:", error.message);
    return [];
  }
  return data;
}

export async function uploadGalleryImageAction(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const fileExt = file.name.split(".").pop();
  const randomString = Math.random().toString(36).substring(2, 9);
  const fileName = `${Date.now()}-${randomString}.${fileExt}`;
  const filePath = `${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from("gallery")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("Storage upload error:", error.message);
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("gallery")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export async function addGalleryItem(title: string, category: string, imageUrl: string) {
  const { error } = await supabaseAdmin
    .from("gallery")
    .insert([{ title, category, image_url: imageUrl }]);

  if (error) {
    console.error("Error inserting gallery item:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/gallery");
}

export async function deleteGalleryItem(id: number) {
  const { error } = await supabaseAdmin
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting gallery item:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/gallery");
}