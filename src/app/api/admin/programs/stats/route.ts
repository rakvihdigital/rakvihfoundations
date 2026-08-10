import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Total Programs
    const { count: totalPrograms } = await supabase
      .from("programs")
      .select("*", { count: "exact", head: true });

    // Total Students / Enrollments
    const { count: totalStudents } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true });

    // Active Programs
    const activePrograms = totalPrograms ?? 0;

    // Completed Programs
    const { count: completedPrograms } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("status", "Completed");

    return NextResponse.json({
      totalPrograms: totalPrograms ?? 0,
      activePrograms,
      totalStudents: totalStudents ?? 0,
      completedPrograms: completedPrograms ?? 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        totalPrograms: 0,
        activePrograms: 0,
        totalStudents: 0,
        completedPrograms: 0,
      },
      { status: 500 }
    );
  }
}