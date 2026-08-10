import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get Single Student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

const { data, error } = await supabase
  .from("enrollments")
  .select(`
    id,
    user_id,
    program_id,
    program_title,
    full_name,
    email,
    phone,
    college,
    branch,
    year,
    address,
    enrollment_status,
    photo_url,
    resume_url,
    created_at
  `)
  .eq("id", id)
  .single();

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 404 }
    );
  }

const { data: payment, error: paymentError } = await supabase
  .from("payments")
  .select(`
    amount,
    payment_method,
    payment_status,
    transaction_id,
    receipt_url,
    paid_at,
    created_at
  `)
  .eq("enrollment_id", id)
  .single();

if (paymentError && paymentError.code !== "PGRST116") {
  console.error(paymentError);
}

return NextResponse.json({
  ...data,
  amount: payment?.amount ?? null,
  payment_method: payment?.payment_method ?? null,
  payment_status: payment?.payment_status ?? null,
  transaction_id: payment?.transaction_id ?? null,
  receipt_url: payment?.receipt_url ?? null,
  payment_date: payment?.paid_at || payment?.created_at || null,
});
}

// Update Student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Student ID:", id);

  const body = await request.json();

  const { error } = await supabase
    .from("enrollments")
    .update({
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      enrollment_status: body.enrollment_status,
      program_id: body.program_id,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Student updated successfully",
  });
}

// Delete Student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Student deleted successfully",
  });
}