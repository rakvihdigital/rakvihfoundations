import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [
      totalStudentsRes,
      confirmedStudentsRes,
      pendingStudentsRes,
      totalProgramsRes,
    ] = await Promise.all([
      // Total Students (Paid + Completed + Rejected)
      supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .in("payment_status", ["Paid", "Completed", "Rejected"]),

      // Confirmed Students (Admin Approved)
      supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "Completed"),

      // Pending Students (Paid but not Approved)
      supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "Paid"),

      // Total Programs
      supabase
        .from("programs")
        .select("*", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      success: true,
      totalStudents: totalStudentsRes.count ?? 0,
      confirmedStudents: confirmedStudentsRes.count ?? 0,
      pendingStudents: pendingStudentsRes.count ?? 0,
      totalPrograms: totalProgramsRes.count ?? 0,
    });
  } catch (error) {
    console.error("Students Stats API Error:", error);

    return NextResponse.json(
      {
        success: false,
        totalStudents: 0,
        confirmedStudents: 0,
        pendingStudents: 0,
        totalPrograms: 0,
        message: "Unable to fetch student statistics.",
      },
      {
        status: 500,
      }
    );
  }
}