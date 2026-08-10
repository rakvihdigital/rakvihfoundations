import { createClient } from "@/lib/supabase/client";

export async function getPrograms() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}