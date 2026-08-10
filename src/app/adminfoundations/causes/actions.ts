"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getCausesData() {
  const { data: categories, error: catError } = await supabaseAdmin
    .from("cause_categories")
    .select("id, title, description");

  if (catError) {
    console.error("Error fetching categories:", catError.message);
    return [];
  }

  if (!categories || categories.length === 0) {
    return [];
  }

  // Select 'title' from cause_items
  const { data: items, error: itemError } = await supabaseAdmin
    .from("cause_items")
    .select("id, category_id, title, cost, image");

  if (itemError) {
    console.warn("Warning fetching cause items:", itemError.message);
  }

  // Map database 'title' to frontend 'name'
  const combined = categories.map((cat) => ({
    id: cat.id,
    name: cat.title,
    cause_items: (items || [])
      .filter((item) => String(item.category_id) === String(cat.id))
      .map((item) => ({
        id: item.id,
        name: item.title, // Map DB 'title' to UI 'name'
        cost: item.cost,
        image: item.image,
      })),
  }));

  return combined;
}

export async function uploadImageAction(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `proofs/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from("causes")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("Storage upload error:", error.message);
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("causes")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export async function addCategory(title: string) {
  const { error } = await supabaseAdmin
    .from("cause_categories")
    .insert([{ title }]);

  if (error) {
    console.error("Error adding category:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}

export async function addSubCause(categoryId: string | number, name: string, cost: number, image: string) {
  // Insert into 'title' instead of 'name' to match the database constraint
  const { error } = await supabaseAdmin
    .from("cause_items")
    .insert([{ category_id: categoryId, title: name, cost, image }]);

  if (error) {
    console.error("Error adding sub-cause:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}

export async function updateSubCauseCost(subId: string | number, cost: number) {
  const { error } = await supabaseAdmin
    .from("cause_items")
    .update({ cost })
    .eq("id", subId);

  if (error) {
    console.error("Error updating cost:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}

export async function updateSubCauseImage(subId: string | number, image: string) {
  const { error } = await supabaseAdmin
    .from("cause_items")
    .update({ image })
    .eq("id", subId);

  if (error) {
    console.error("Error updating image:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}

export async function deleteSubCause(subId: string | number) {
  const { error } = await supabaseAdmin
    .from("cause_items")
    .delete()
    .eq("id", subId);

  if (error) {
    console.error("Error deleting sub-cause:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}
export async function updateCategory(catId: string | number, name: string) {
  const { error } = await supabaseAdmin
    .from("causes") // Replace with your actual category table name if different (e.g., "cause_categories")
    .update({ name })
    .eq("id", catId);

  if (error) {
    console.error("Error updating category name:", error.message);
    // Fallback if your table uses 'title' instead of 'name'
    const { error: fallbackError } = await supabaseAdmin
      .from("causes")
      .update({ title: name })
      .eq("id", catId);
      
    if (fallbackError) {
      throw new Error(fallbackError.message);
    }
  }
  revalidatePath("/adminfoundations/causes");
}


export async function updateSubCauseDetails(subId: string | number, title: string, cost: number, image: string) {
  const { error } = await supabaseAdmin
    .from("cause_items")
    .update({ title, cost, image })
    .eq("id", subId);

  if (error) {
    console.error("Error updating sub-cause details:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}

export async function deleteCategory(categoryId: string | number) {
  await supabaseAdmin.from("cause_items").delete().eq("category_id", categoryId);

  const { error } = await supabaseAdmin
    .from("cause_categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/causes");
}