"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getVolunteers() {
  const { data, error } = await supabaseAdmin
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching volunteers:", error.message);
    return [];
  }
  return data;
}

export async function deleteVolunteer(id: string) {
  const { error } = await supabaseAdmin
    .from("volunteers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting volunteer:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/volunteers");
}