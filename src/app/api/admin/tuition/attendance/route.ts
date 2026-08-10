// app/api/admin/tuition/attendance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignment_id");

  if (!assignmentId) {
    return NextResponse.json(
      { error: "assignment_id is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tuition_attendance")
    .select(
      "id, assignment_id, class_date, status, teacher_status, notes, teacher_notes"
    )
    .eq("assignment_id", assignmentId)
    .order("class_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}