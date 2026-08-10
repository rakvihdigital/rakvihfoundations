"use server";

import { createClient } from "@supabase/supabase-js"; // Or use your pre-configured supabase admin client
import { revalidatePath } from "next/cache";

// Adjust this to your existing supabase admin import if you have one globally configured
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCsrProposals() {
  const { data, error } = await supabaseAdmin
    .from("csr_proposals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching CSR proposals:", error.message);
    return [];
  }
  return data;
}

export async function updateCsrProposalStatus(id: number, status: string) {
  const { error } = await supabaseAdmin
    .from("csr_proposals")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating CSR status:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/csr");
}

export async function deleteCsrProposal(id: number) {
  const { error } = await supabaseAdmin
    .from("csr_proposals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting CSR proposal:", error.message);
    throw new Error(error.message);
  }
  revalidatePath("/adminfoundations/csr");
}