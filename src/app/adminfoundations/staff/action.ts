"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getStaff() {
  const { data, error } = await supabase
    .from("foundation_staff")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createStaff(formData: FormData, permissions: string[]) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase
    .from("foundation_staff")
    .insert([{ name, email, password, role: "staff", permissions }]);

  if (error) throw new Error(error.message);
}

// Updated to also save password changes
export async function updateStaffAccount(id: string, permissions: string[], password: string) {
  const { error } = await supabase
    .from("foundation_staff")
    .update({ permissions, password })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateStaffStatus(id: string, is_active: boolean) {
  const { error } = await supabase
    .from("foundation_staff")
    .update({ is_active })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteStaff(id: string) {
  const { error } = await supabase
    .from("foundation_staff")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}