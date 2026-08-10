// src/app/api/attendance/route.ts
//
// Marks/updates attendance for a given assignment + class_date. Parent and
// teacher markings are now stored in SEPARATE columns on the same row
// (status/marked_by/notes for parent, teacher_status/teacher_marked_by/
// teacher_notes for teacher) so one doesn't silently overwrite the other.
//
// Body: {
//   assignment_id: number,
//   class_date?: string,         // defaults to today (server date) if omitted
//   status?: string,             // "held" | "missed" | "cancelled" | "scheduled", defaults to "held"
//   notes?: string,              // reason/notes — goes to the correct column based on marked_by_role
//   marked_by?: number,          // id of whoever marked it (parent user id or teacher id)
//   marked_by_role?: "parent" | "teacher", // defaults to "parent" for backward compatibility
//     with the existing student/parent dashboard, which doesn't send this field.
// }
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_STATUSES = ["scheduled", "held", "missed", "cancelled"];

function todayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// GET /api/attendance?assignment_id=123
// Returns every attendance row for a given tuition assignment, most recent first.
// Each row includes BOTH the parent's fields (status/marked_by/notes) and the
// teacher's fields (teacher_status/teacher_marked_by/teacher_notes).
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("assignment_id");

    if (!assignmentId) {
      return NextResponse.json(
        { error: "assignment_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tuition_attendance")
      .select("*")
      .eq("assignment_id", assignmentId)
      .order("class_date", { ascending: false });

    if (error) {
      console.error("Attendance fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch attendance records." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Attendance GET error:", err);
    return NextResponse.json(
      { error: "Something went wrong while fetching attendance." },
      { status: 500 }
    );
  }
}

// POST /api/attendance
// Upserts the attendance row for that assignment + date, relying on the
// tuition_attendance_unique (assignment_id, class_date) constraint. Only the
// columns relevant to the marker's role are included in the upsert payload,
// so a teacher marking attendance never touches the parent's status/notes
// (and vice versa) — Postgres/PostgREST upsert only overwrites the columns
// you actually pass in.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      assignment_id,
      class_date,
      status,
      notes,
      marked_by,
      marked_by_role,
    } = body || {};

    if (!assignment_id) {
      return NextResponse.json(
        { error: "assignment_id is required." },
        { status: 400 }
      );
    }

    const resolvedStatus = status || "held";
    if (!ALLOWED_STATUSES.includes(resolvedStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Default to "parent" so the existing student/parent dashboard (which
    // never sends marked_by_role) keeps writing to the original columns.
    const role = marked_by_role === "teacher" ? "teacher" : "parent";
    const resolvedDate = class_date || todayDateString();
    const nowIso = new Date().toISOString();

    // Make sure the assignment actually exists before writing an attendance row.
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from("tuition_assignments")
      .select("id")
      .eq("id", assignment_id)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: "No matching tuition assignment was found." },
        { status: 404 }
      );
    }

    // Build the upsert payload — only touch this role's own columns.
    const payload: Record<string, any> = {
      assignment_id,
      class_date: resolvedDate,
    };

    if (role === "teacher") {
      payload.teacher_status = resolvedStatus;
      payload.teacher_marked_by = marked_by ?? null;
      payload.teacher_notes = notes ?? null;
      payload.teacher_marked_at = nowIso;
    } else {
      payload.status = resolvedStatus;
      payload.marked_by = marked_by ?? null;
      payload.notes = notes ?? null;
      payload.updated_at = nowIso;
    }

    const { data, error } = await supabaseAdmin
      .from("tuition_attendance")
      .upsert(payload, { onConflict: "assignment_id,class_date" })
      .select()
      .single();

    if (error) {
      console.error("Attendance upsert error:", error);
      return NextResponse.json(
        { error: "Failed to save attendance record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Attendance POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong while saving attendance." },
      { status: 500 }
    );
  }
}