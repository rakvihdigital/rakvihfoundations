import { createClient } from "@/lib/supabase/client";

export async function createEnrollment(data: {
  user_id?: string;

  program_id: number;
  program_title: string;

  full_name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  address: string;

  amount: number;

  // Program Details
  category?: string;
  duration?: string;
  price?: number;

  // Uploads
  photo_url?: string;
  resume_url?: string;
  document_url?: string;
  payment_screenshot?: string;

  // Payment
  payment_status?: string;
  enrollment_status?: string;
  transaction_id?: string;
  payment_method?: string;
  payment_date?: string;
}) {
  const supabase = createClient();

  const { data: enrollment, error } = await supabase
    .from("enrollments")
    .insert([
      {
        ...data,

        payment_status: data.payment_status ?? "Pending",
enrollment_status: data.enrollment_status ?? "Pending",

transaction_id: data.transaction_id ?? null,
payment_method: data.payment_method ?? null,
payment_date: data.payment_date ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return enrollment;
}
export async function updateEnrollment(
  enrollmentId: number,
  
  values: {
  payment_status?: string;
  enrollment_status?: string;

  transaction_id?: string;
  payment_method?: string;
  payment_date?: string;

  payment_screenshot?: string;   // ✅ Add this

  dashboard_access?: boolean;
}
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .update(values)
    .eq("id", enrollmentId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
