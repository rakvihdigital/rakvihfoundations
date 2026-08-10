"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getContactInquiries() {
  const { data, error } = await supabaseAdmin
    .from("Foundations_conact")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact inquiries:", error.message);
    return [];
  }
  return data;
}

export async function deleteContactInquiry(id: string) {
  const { error } = await supabaseAdmin
    .from("Foundations_conact")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting contact inquiry:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/contact");
}

export async function updateContactStatus(id: string, isResolved: boolean) {
  const { error } = await supabaseAdmin
    .from("Foundations_conact")
    .update({ is_resolved: isResolved })
    .eq("id", id);

  if (error) {
    console.error("Error updating contact status:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/contact");
}