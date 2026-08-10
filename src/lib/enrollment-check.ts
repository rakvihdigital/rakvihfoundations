import { createClient } from "@/lib/supabase/client";

export async function checkEnrollment(
  programId: number,
  email: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("program_id", programId)
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  return data;
}