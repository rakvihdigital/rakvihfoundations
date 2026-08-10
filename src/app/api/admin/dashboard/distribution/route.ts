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
      program_id,
      programs (
        title
      )
    `);

  if (error) {
    console.error(error);
    return NextResponse.json([]);
  }

  const counts: Record<string, number> = {};

  data?.forEach((item: any) => {
    const name = item.programs?.title || "Others";
    counts[name] = (counts[name] || 0) + 1;
  });

  const result = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  return NextResponse.json(result);
}