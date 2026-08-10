import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("materials")
      .select(`
        *,
        programs (
          id,
          title
        )
      `)
     .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      materials: data ?? [],
    });
  } catch (error) {
    console.error("Materials API Error:", error);

    return NextResponse.json(
      {
        success: false,
        materials: [],
        message: "Unable to fetch materials.",
      },
      {
        status: 500,
      }
    );
  }
}