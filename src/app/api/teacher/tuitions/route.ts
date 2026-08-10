// src/app/api/teacher/tuitions/route.ts
// Returns all tuitions assigned to a given teacher, plus each assignment's
// TEACHER-marked attendance status for today (attendance_today) — read from
// teacher_status/teacher_notes, which are separate from the parent's
// status/notes columns.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Local (not UTC) YYYY-MM-DD — matches the `class_date` column in tuition_attendance
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  try {
    const teacherId = req.nextUrl.searchParams.get("teacher_id");

    if (!teacherId) {
      return NextResponse.json(
        { error: "teacher_id is required." },
        { status: 400 }
      );
    }

    const { data: assignments, error } = await supabaseAdmin
      .from("tuition_assignments")
      .select(
        `
        id,
        fee_amount,
        fee_frequency,
        schedule_days,
        schedule_time,
        start_date,
        meeting_link,
        status,
        assigned_at,
        tuition_applications (
          id,
          student_name,
          student_grade,
          subject,
          mode,
          parent_name,
          parent_phone,
          address,
          preferred_days,
          preferred_time
        )
      `
      )
      .eq("teacher_id", teacherId)
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching teacher tuitions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const assignmentIds = (assignments || []).map((a) => a.id);

    // teacher_status/teacher_notes — NOT status/notes (those are the parent's).
    const attendanceToday: Record<number, { status: string; notes: string | null }> = {};

    if (assignmentIds.length > 0) {
      const todayStr = getTodayDateString();
      const { data: attendanceRows, error: attendanceError } = await supabaseAdmin
        .from("tuition_attendance")
        .select("assignment_id, teacher_status, teacher_notes")
        .in("assignment_id", assignmentIds)
        .eq("class_date", todayStr);

      if (attendanceError) {
        console.error(
          "Supabase error fetching today's teacher attendance:",
          attendanceError
        );
      } else {
        for (const row of attendanceRows || []) {
          attendanceToday[row.assignment_id] = {
            status: row.teacher_status,
            notes: row.teacher_notes,
          };
        }
      }
    }

    const data = (assignments || []).map((a) => ({
      ...a,
      attendance_today: attendanceToday[a.id] ?? null,
    }));

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching teacher tuitions:", err);
    return NextResponse.json(
      { error: "Failed to fetch tuitions." },
      { status: 500 }
    );
  }
}