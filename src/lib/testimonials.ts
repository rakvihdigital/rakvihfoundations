import { createClient } from "@/lib/supabase/client";

export async function getTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("id");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}