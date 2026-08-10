import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      payment_status,
      created_at,
      enrollments (
        full_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.log(error);
    return NextResponse.json([]);
  }

  const result = data.map((item: any) => ({
    id: item.id,
    student_name: item.enrollments?.full_name || "Unknown",
    amount: item.amount,
    payment_status: item.payment_status,
    created_at: item.created_at,
  }));

  return NextResponse.json(result);
}