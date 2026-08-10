// app/api/admin/tuition/billing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignment_id");

  if (!assignmentId) {
    return NextResponse.json({ error: "assignment_id is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tuition_billing_cycles")
    .select(
      "id, assignment_id, period_start, period_end, due_date, amount_due, status, paid_at, razorpay_order_id, razorpay_payment_id"
    )
    .eq("assignment_id", assignmentId)
    .order("period_start", { ascending: false });

  if (error) {
    console.error("Failed to fetch billing cycles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}