// app/api/admin/teachers/[id]/assignments/route.ts
// Admin endpoint: list a teacher's assigned students (from
// tuition_assignments, joined with tuition_applications) for the
// "View" popup — fees, schedule, and status per student.
//
// NOTE: we don't know your exact tuition_applications column names,
// so this pulls the whole joined row (`*`) and best-guesses common
// field names on the frontend/response side. Once you share the real
// tuition_applications schema, swap the `*` below for explicit columns
// (cheaper query, and guarantees the right fields).

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+: dynamic route params are async — must be awaited
    const { id } = await params;
    const teacherId = Number(id);
    if (!id || Number.isNaN(teacherId)) {
      return NextResponse.json({ error: "Invalid teacher id." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("tuition_assignments")
      .select(
        `
        id,
        fee_amount,
        fee_frequency,
        schedule_days,
        schedule_time,
        status,
        start_date,
        meeting_link,
        tuition_applications (*),
        tuition_attendance (
          id,
          class_date,
          status,
          teacher_status
        )
      `
      )
      .eq("teacher_id", teacherId)
      .order("assigned_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching teacher assignments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten the nested application object and best-guess the display
    // fields from whatever columns actually exist on tuition_applications.
    // Also roll up tuition_attendance rows into simple counters — we use
    // the admin-marked `status` column (not `teacher_status`) as the
    // source of truth, since that's what marked_by/updated_at reflect.
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const flattened = (data || []).map((row: any) => {
      const application = Array.isArray(row.tuition_applications)
        ? row.tuition_applications[0]
        : row.tuition_applications;
      const attendanceRows: any[] = row.tuition_attendance || [];
      const { tuition_applications, tuition_attendance, ...rest } = row;

      const isThisMonth = (dateStr: string) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      };

      const attendance = {
        total: attendanceRows.length,
        held: attendanceRows.filter((a) => a.status === "held").length,
        missed: attendanceRows.filter((a) => a.status === "missed").length,
        cancelled: attendanceRows.filter((a) => a.status === "cancelled").length,
        thisMonth: attendanceRows.filter((a) => isThisMonth(a.class_date)).length,
        thisMonthHeld: attendanceRows.filter(
          (a) => a.status === "held" && isThisMonth(a.class_date)
        ).length,
      };

      return {
        ...rest,
        // Full raw application row, in case you want more fields on the frontend
        application,
        attendance,
        student_name:
          application?.student_name ??
          application?.full_name ??
          application?.name ??
          application?.parent_name ??
          null,
        class_name:
          application?.class_name ?? application?.class ?? application?.grade ?? null,
        subject: application?.subject ?? application?.subjects ?? null,
      };
    });

    return NextResponse.json({ data: flattened }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching teacher assignments:", err);
    return NextResponse.json(
      { error: "Failed to fetch assigned students." },
      { status: 500 }
    );
  }
}