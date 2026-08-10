import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("certificates")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const year = new Date().getFullYear();

  const certificateNumber = `RAKVIH-${year}-${String(
    (count ?? 0) + 1
  ).padStart(4, "0")}`;

  return NextResponse.json({
    certificateNumber,
  });
}