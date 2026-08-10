import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tuition_admin_view")
      .select("*")
      .order("applied_on", { ascending: false });

    if (error) {
      console.error("Supabase error fetching tuition applications:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // correctly instead of silently omitting the field.
    const formattedData = (data || []).map((row) => ({
      ...row,
      is_active: row.is_active ?? true,
      schedule_days: row.schedule_days ?? null,
      schedule_time: row.schedule_time ?? null,
      start_date: row.start_date ?? null,
      meeting_link: row.meeting_link ?? null,
      preferred_schedule_days: row.preferred_schedule_days ?? null,
      preferred_schedule_time: row.preferred_schedule_time ?? null,
      preferred_mode: row.preferred_mode ?? null,
    }));

    return NextResponse.json({ data: formattedData });
  } catch (err) {
    console.error("Error fetching tuition applications:", err);
    return NextResponse.json(
      { error: "Failed to fetch tuition applications." },
      { status: 500 }
    );
  }
}