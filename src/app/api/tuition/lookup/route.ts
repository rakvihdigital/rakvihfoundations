import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function computeDisplayStatus(cycle: any, today: string) {
  if (cycle.status === "paid") return "paid";
  if (cycle.status === "waived") return "waived";
  const daysUntilDue = Math.round(
    (new Date(cycle.due_date).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (daysUntilDue < 0) return "overdue";
  if (daysUntilDue <= 3) return "due_soon";
  return "upcoming";
}

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get("phone");

    if (!phone || phone.trim().length < 6) {
      return NextResponse.json(
        { error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tuition_admin_view")
      .select(
        `application_id,
         assignment_id,
         student_name,
         parent_name,
         phone:parent_phone,
         subject,
         class_grade:student_grade,
         preferred_mode:mode,
         teacher_name,
         fee_amount,
         payment_status,
         application_status,
         total_paid,
         created_at:applied_on,
         schedule_days,
         schedule_time,
         start_date,
         meeting_link`
      )
      .eq("parent_phone", phone.trim());

    if (error) {
      console.error("Supabase lookup error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const assignmentIds = (data || [])
      .map((r: any) => r.assignment_id)
      .filter((id: any) => id !== null && id !== undefined);

    let cyclesByAssignment: Record<number, any[]> = {};
    let attendanceByAssignment: Record<number, any[]> = {};

    if (assignmentIds.length > 0) {
      const [{ data: cycles, error: cyclesError }, { data: attendance, error: attError }] =
        await Promise.all([
          supabaseAdmin
            .from("tuition_billing_cycles")
            .select(
              "id, assignment_id, period_start, period_end, due_date, amount_due, status"
            )
            .in("assignment_id", assignmentIds)
            .order("period_start", { ascending: true }),
          supabaseAdmin
            .from("tuition_attendance")
            .select("id, assignment_id, class_date, status, notes")
            .in("assignment_id", assignmentIds)
            .order("class_date", { ascending: false }),
        ]);

      if (cyclesError) console.error("Error fetching billing cycles:", cyclesError);
      if (attError) console.error("Error fetching attendance:", attError);

      for (const c of cycles || []) {
        (cyclesByAssignment[c.assignment_id] ||= []).push(c);
      }
      for (const a of attendance || []) {
        (attendanceByAssignment[a.assignment_id] ||= []).push(a);
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    const enriched = (data || []).map((row: any) => {
      const cycles = cyclesByAssignment[row.assignment_id] || [];

      let currentCycle =
        cycles.find((c) => c.period_start <= today && c.period_end >= today) ||
        cycles.find((c) => c.status === "due") ||
        null;

      if (currentCycle) {
        const daysUntilDue = Math.round(
          (new Date(currentCycle.due_date).getTime() - new Date(today).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        currentCycle = {
          ...currentCycle,
          display_status: computeDisplayStatus(currentCycle, today),
          days_until_due: daysUntilDue,
        };
      }

      // Next payment due AFTER the current cycle — relevant once current is paid.
      const nextCycle =
        cycles
          .filter(
            (c) =>
              c.status === "due" &&
              (!currentCycle || c.period_start > currentCycle.period_start)
          )
          .sort((a, b) => a.period_start.localeCompare(b.period_start))[0] || null;

      const attendanceRows = attendanceByAssignment[row.assignment_id] || [];
     const attendanceSummary = {
  held: attendanceRows.filter((a) => a.status === "held").length,
  missed: attendanceRows.filter((a) => a.status === "missed").length,
  cancelled: attendanceRows.filter((a) => a.status === "cancelled").length,

  scheduled:
    attendanceRows.filter(
      (a) => a.status === "scheduled" && a.class_date >= today
    ).length +
    (attendanceRows.length === 0 ? 1 : 0),

  recent:
    attendanceRows.length > 0
      ? attendanceRows.slice(0, 5).map((a) => ({
          class_date: a.class_date,
          status: a.status,
          notes: a.notes,
        }))
      : [
          {
            class_date: today,
            status: "scheduled",
            notes: "Upcoming Class",
          },
        ],
};

      return {
        ...row,
        current_cycle: currentCycle,
        next_cycle: nextCycle,
        attendance_summary: attendanceSummary,
      };
    });

    return NextResponse.json({ data: enriched });
  } catch (err) {
    console.error("Error looking up tuition:", err);
    return NextResponse.json(
      { error: "Failed to look up tuition." },
      { status: 500 }
    );
  }
}