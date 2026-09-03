"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ExtraItem = {
  id: string;
  title: string;
  cost: number;
};

export type SystemConfig = {
  minPersons: number;
  maxPersons: number;
  photoCost: number;
  videoCost: number;
  textCost: number;
  extras: ExtraItem[];
};

const INTERNAL_DEFAULT_CONFIG: SystemConfig = {
  minPersons: 1,
  maxPersons: 100,
  photoCost: 7,
  videoCost: 150, // Updated: Default one-time flat service charge for celebration video
  textCost: 5,
  extras: [
    { id: "item_candle", title: "Scented Candles", cost: 15 },
    { id: "item_gift", title: "Small Gift Box", cost: 50 },
    { id: "item_flower", title: "Fresh Flowers", cost: 20 },
  ],
};

// ── Configuration Actions (Stored in Existing 'cause_categories.description') ──

export async function getSystemConfig(): Promise<SystemConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from("cause_categories")
      .select("id, description")
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) return INTERNAL_DEFAULT_CONFIG;

    const configRow = data.find((c) => {
      try {
        const parsed = JSON.parse(c.description || "");
        return (
          typeof parsed.minPersons === "number" ||
          typeof parsed.mediaCost === "number" ||
          typeof parsed.photoCost === "number"
        );
      } catch {
        return false;
      }
    });

    if (configRow?.description) {
      const parsed = JSON.parse(configRow.description);
      return {
        ...INTERNAL_DEFAULT_CONFIG,
        ...parsed,
        photoCost: parsed.photoCost ?? parsed.mediaCost ?? INTERNAL_DEFAULT_CONFIG.photoCost,
        videoCost: parsed.videoCost ?? INTERNAL_DEFAULT_CONFIG.videoCost,
        extras: parsed.extras || INTERNAL_DEFAULT_CONFIG.extras,
      };
    }

    return INTERNAL_DEFAULT_CONFIG;
  } catch (err) {
    console.error("Error reading system config, using default:", err);
    return INTERNAL_DEFAULT_CONFIG;
  }
}

export async function saveSystemConfig(config: SystemConfig): Promise<{ success: boolean }> {
  const { data: categories, error: fetchErr } = await supabaseAdmin
    .from("cause_categories")
    .select("id, description")
    .order("id", { ascending: true });

  if (fetchErr || !categories || categories.length === 0) {
    throw new Error("No existing categories found to store settings.");
  }

  const targetCategory =
    categories.find((c) => {
      try {
        const parsed = JSON.parse(c.description || "");
        return typeof parsed.minPersons === "number";
      } catch {
        return false;
      }
    }) || categories[0];

  const { error } = await supabaseAdmin
    .from("cause_categories")
    .update({ description: JSON.stringify(config) })
    .eq("id", targetCategory.id);

  if (error) {
    console.error("Error saving system config:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/adminfoundations/causes");
  revalidatePath("/foundation/causes");
  revalidatePath("/foundation/donate");
  return { success: true };
}

// ── Causes & Categories Actions ──

export async function getCausesData() {
  const { data: categories, error: catError } = await supabaseAdmin
    .from("cause_categories")
    .select("id, title, description")
    .order("id", { ascending: true });

  if (catError) {
    console.error("Error fetching categories:", catError.message);
    return [];
  }

  if (!categories || categories.length === 0) return [];

  const { data: items, error: itemError } = await supabaseAdmin
    .from("cause_items")
    .select("id, category_id, title, cost, image, is_active");

  if (itemError) {
    console.warn("Warning fetching cause items:", itemError.message);
  }

  const combined = categories.map((cat) => ({
    id: cat.id,
    name: cat.title,
    cause_items: (items || [])
      .filter((item) => String(item.category_id) === String(cat.id))
      .map((item) => ({
        id: item.id,
        name: item.title,
        cost: Number(item.cost) || 0,
        image: item.image,
      })),
  }));

  return combined;
}

export async function uploadImageAction(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
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

export async function updateCategory(catId: string | number, name: string) {
  const { error } = await supabaseAdmin
    .from("cause_categories")
    .update({ title: name })
    .eq("id", catId);

  if (error) {
    console.error("Error updating category name:", error.message);
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

export async function addSubCause(categoryId: string | number, name: string, cost: number, image: string) {
  const { error } = await supabaseAdmin
    .from("cause_items")
    .insert([{ category_id: categoryId, title: name, cost, image, is_active: true }]);

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