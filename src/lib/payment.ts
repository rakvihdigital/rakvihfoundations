import { createClient } from "@/lib/supabase/client";

export async function createPayment(data: {
  enrollment_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  receipt_url?: string;
  receipt_name?: string;
}) {
  const supabase = createClient();

  console.log("Received in createPayment:", data);

  const { data: payment, error } = await supabase
    .from("payments")
    .insert([
      {
        enrollment_id: data.enrollment_id,
        amount: data.amount,
        payment_method: data.payment_method,
        payment_status: data.payment_status,
        transaction_id: data.transaction_id,
        receipt_url: data.receipt_url,
        receipt_name: data.receipt_name, // ✅ Added
      },
    ])
    .select()
    .single();

    console.log("Inserted Payment:", payment);
console.log("Insert Error:", error);

  return {
    data: payment,
    error,
  };
}

export async function getPaymentByEnrollment(
  enrollmentId: number
) {
  const supabase = createClient();

  return await supabase
    .from("payments")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .maybeSingle();
}