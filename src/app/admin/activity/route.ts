import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data } = await supabase
    .from("enrollments")
    .select("student_name, payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  return NextResponse.json(data ?? []);
}