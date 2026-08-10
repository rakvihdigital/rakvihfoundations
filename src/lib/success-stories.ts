import { createClient } from "@/lib/supabase/client";

export async function getSuccessStories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("success_stories")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}