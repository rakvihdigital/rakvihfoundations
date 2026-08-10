import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      full_name,
      email,
      created_at,
      programs (
        title
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
    full_name: item.full_name,
    email: item.email,
    program: item.programs?.title || "Unknown",
    created_at: item.created_at,
  }));

  return NextResponse.json(result);
}