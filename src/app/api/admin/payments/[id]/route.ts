import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const { id } = await params;
    const body = await request.json();

    // Step 1: Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, enrollment_id")
      .eq("id", Number(id))
      .single();

    if (paymentError) throw paymentError;

    // Step 2: Update payments table
    const { data, error } = await supabase
      .from("payments")
      .update({
        payment_status: body.payment_status,
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) throw error;

    // Step 3: Update enrollments table
    const { error: enrollmentError } = await supabase
      .from("enrollments")
      .update({
        payment_status: body.payment_status,
        enrollment_status:
          body.payment_status === "Completed"
            ? "Confirmed"
            : body.payment_status === "Rejected"
            ? "Rejected"
            : "Pending",
      })
      .eq("id", payment.enrollment_id);

    if (enrollmentError) throw enrollmentError;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}