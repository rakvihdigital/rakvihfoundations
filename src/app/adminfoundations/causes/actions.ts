"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ExtraItem = {
  id: string;
  title: string;
  cost: number;
};

export type CategoryAddon = {
  id: string;
  title: string;
  cost: number;
  is_active?: boolean;
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

  const [itemsRes, addonsRes] = await Promise.all([
    supabaseAdmin
      .from("cause_items")
      .select("id, category_id, title, cost, image, is_active"),
    supabaseAdmin
      .from("cause_item_addons")
      .select("id, cause_id, title, cost, is_active")
      .order("created_at", { ascending: true }),
  ]);

  if (itemsRes.error) {
    console.warn("Warning fetching cause items:", itemsRes.error.message);
  }

  // Build addons map by cause_id from cause_item_addons table
  const dbAddonsMap: Record<string, CategoryAddon[]> = {};
  (addonsRes.data || []).forEach((addon) => {
    const key = String(addon.cause_id);
    if (!dbAddonsMap[key]) dbAddonsMap[key] = [];
    dbAddonsMap[key].push({
      id: String(addon.id),
      title: addon.title,
      cost: Number(addon.cost) || 0,
      is_active: addon.is_active,
    });
  });

  const combined = categories.map((cat) => {
    let parsed: any = {};
    try {
      parsed = JSON.parse(cat.description || "{}");
    } catch {
      parsed = {};
    }

    const addOns: CategoryAddon[] = Array.isArray(parsed.addOns) ? parsed.addOns : [];
    const legacySubItemAddonsMap: Record<string, CategoryAddon[]> = parsed.subItemAddons || {};

    return {
      id: cat.id,
      name: cat.title,
      addons: addOns,
      cause_items: (itemsRes.data || [])
        .filter((item) => String(item.category_id) === String(cat.id))
        .map((item) => {
          const key = String(item.id);
          const itemAddons =
            dbAddonsMap[key] && dbAddonsMap[key].length > 0
              ? dbAddonsMap[key]
              : legacySubItemAddonsMap[key] || [];
          return {
            id: item.id,
            name: item.title,
            cost: Number(item.cost) || 0,
            image: item.image,
            addons: itemAddons,
          };
        }),
    };
  });

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

// ── Sub-Category Add-ons Actions (Up to 20 per Category) ──

export async function getCategoryAddons(categoryId: string | number): Promise<CategoryAddon[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("cause_categories")
      .select("id, description")
      .eq("id", categoryId)
      .single();

    if (error || !data) return [];
    const parsed = JSON.parse(data.description || "{}");
    return Array.isArray(parsed.addOns) ? parsed.addOns : [];
  } catch (err) {
    console.error("Error reading category add-ons:", err);
    return [];
  }
}

export async function addCategoryAddon(categoryId: string | number, title: string, cost: number) {
  const { data, error } = await supabaseAdmin
    .from("cause_categories")
    .select("id, description")
    .eq("id", categoryId)
    .single();

  if (error || !data) throw new Error("Category not found");

  let parsed: any = {};
  try {
    parsed = JSON.parse(data.description || "{}");
  } catch {
    parsed = { originalText: data.description };
  }

  const currentAddons: CategoryAddon[] = Array.isArray(parsed.addOns) ? parsed.addOns : [];
  if (currentAddons.length >= 20) {
    throw new Error("Maximum limit of 20 add-ons per category reached.");
  }

  const newAddon: CategoryAddon = {
    id: `addon_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    title: title.trim(),
    cost: Number(cost) || 0,
    is_active: true,
  };

  const updatedAddons = [...currentAddons, newAddon];
  parsed.addOns = updatedAddons;

  const { error: updateErr } = await supabaseAdmin
    .from("cause_categories")
    .update({ description: JSON.stringify(parsed) })
    .eq("id", categoryId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/adminfoundations/causes");
  revalidatePath("/foundation/causes");
  revalidatePath("/foundation/donate");
  return { success: true, addons: updatedAddons };
}

export async function deleteCategoryAddon(categoryId: string | number, addonId: string) {
  const { data, error } = await supabaseAdmin
    .from("cause_categories")
    .select("id, description")
    .eq("id", categoryId)
    .single();

  if (error || !data) throw new Error("Category not found");

  let parsed: any = {};
  try {
    parsed = JSON.parse(data.description || "{}");
  } catch {
    parsed = { originalText: data.description };
  }

  const currentAddons: CategoryAddon[] = Array.isArray(parsed.addOns) ? parsed.addOns : [];
  const updatedAddons = currentAddons.filter((a) => a.id !== addonId);
  parsed.addOns = updatedAddons;

  const { error: updateErr } = await supabaseAdmin
    .from("cause_categories")
    .update({ description: JSON.stringify(parsed) })
    .eq("id", categoryId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/adminfoundations/causes");
  revalidatePath("/foundation/causes");
  revalidatePath("/foundation/donate");
  return { success: true, addons: updatedAddons };
}

export async function updateCategoryAddons(categoryId: string | number, addons: CategoryAddon[]) {
  if (addons.length > 20) {
    throw new Error("Cannot exceed 20 add-ons per category.");
  }

  const { data, error } = await supabaseAdmin
    .from("cause_categories")
    .select("id, description")
    .eq("id", categoryId)
    .single();

  if (error || !data) throw new Error("Category not found");

  let parsed: any = {};
  try {
    parsed = JSON.parse(data.description || "{}");
  } catch {
    parsed = { originalText: data.description };
  }

  parsed.addOns = addons;

  const { error: updateErr } = await supabaseAdmin
    .from("cause_categories")
    .update({ description: JSON.stringify(parsed) })
    .eq("id", categoryId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/adminfoundations/causes");
  revalidatePath("/foundation/causes");
  revalidatePath("/foundation/donate");
  return { success: true, addons };
}

// ── Sub-Item Specific Add-ons Actions (Stored in dedicated 'cause_item_addons' table) ──

export async function addSubItemAddon(
  subId: string | number,
  categoryId: string | number,
  title: string,
  cost: number
) {
  // Check maximum limit of 20 add-ons for this sub-item
  const { count } = await supabaseAdmin
    .from("cause_item_addons")
    .select("id", { count: "exact", head: true })
    .eq("cause_id", subId);

  if (count && count >= 20) {
    throw new Error("Maximum limit of 20 add-ons for this sub-item reached.");
  }

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from("cause_item_addons")
    .insert([
      {
        cause_id: subId,
        title: title.trim(),
        cost: Number(cost) || 0,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (insertErr) {
    console.error("Error inserting into cause_item_addons:", insertErr.message);
    throw new Error(insertErr.message);
  }

  // Also sync to legacy JSON if category exists (for dual safety)
  if (categoryId) {
    try {
      const { data: catData } = await supabaseAdmin
        .from("cause_categories")
        .select("id, description")
        .eq("id", categoryId)
        .single();
      if (catData?.description) {
        const parsed = JSON.parse(catData.description || "{}");
        if (!parsed.subItemAddons) parsed.subItemAddons = {};
        const key = String(subId);
        const current = Array.isArray(parsed.subItemAddons[key]) ? parsed.subItemAddons[key] : [];
        parsed.subItemAddons[key] = [
          ...current,
          { id: String(inserted.id), title: title.trim(), cost: Number(cost) || 0, is_active: true },
        ];
        await supabaseAdmin
          .from("cause_categories")
          .update({ description: JSON.stringify(parsed) })
          .eq("id", categoryId);
      }
    } catch {}
  }

  revalidatePath("/adminfoundations/causes");
  revalidatePath("/foundation/causes");
  revalidatePath("/foundation/donate");
  return { success: true, addon: inserted };
}

export async function deleteSubItemAddon(
  subId: string | number,
  categoryId: string | number,
  addonId: string
) {
  // Delete from cause_item_addons table
  const { error: delErr } = await supabaseAdmin
    .from("cause_item_addons")
    .delete()
    .eq("id", addonId);

  if (delErr) {
    console.error("Error deleting from cause_item_addons:", delErr.message);
  }

  // Also clean up any legacy JSON reference if exists
  if (categoryId) {
    try {
      const { data: catData } = await supabaseAdmin
        .from("cause_categories")
        .select("id, description")
        .eq("id", categoryId)
        .single();
      if (catData?.description) {
        const parsed = JSON.parse(catData.description || "{}");
        const key = String(subId);
        if (parsed.subItemAddons && Array.isArray(parsed.subItemAddons[key])) {
          parsed.subItemAddons[key] = parsed.subItemAddons[key].filter(
            (a: any) => String(a.id) !== String(addonId)
          );
          await supabaseAdmin
            .from("cause_categories")
            .update({ description: JSON.stringify(parsed) })
            .eq("id", categoryId);
        }
      }
    } catch {}
  }

  revalidatePath("/adminfoundations/causes");
  revalidatePath("/foundation/causes");
  revalidatePath("/foundation/donate");
  return { success: true };
}

export async function getSubItemAddons(
  subId: string | number,
  categoryId?: string | number
): Promise<CategoryAddon[]> {
  try {
    const { data: dbAddons, error } = await supabaseAdmin
      .from("cause_item_addons")
      .select("id, title, cost, is_active")
      .eq("cause_id", subId)
      .order("created_at", { ascending: true });

    if (!error && dbAddons && dbAddons.length > 0) {
      return dbAddons.map((a) => ({
        id: String(a.id),
        title: a.title,
        cost: Number(a.cost) || 0,
        is_active: a.is_active,
      }));
    }

    // Fallback to legacy JSON if table is empty
    if (categoryId) {
      const { data } = await supabaseAdmin
        .from("cause_categories")
        .select("id, description")
        .eq("id", categoryId)
        .single();
      if (data?.description) {
        const parsed = JSON.parse(data.description || "{}");
        const key = String(subId);
        return parsed.subItemAddons?.[key] || [];
      }
    }
    return [];
  } catch (err) {
    console.error("Error fetching sub-item add-ons:", err);
    return [];
  }
}