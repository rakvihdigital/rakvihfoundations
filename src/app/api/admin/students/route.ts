import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch students
    const { data: students, error: studentError } = await supabase
      .from("enrollments")
     .select(`
  id,
  full_name,
  email,
  phone,
  college,
  branch,
  year,
  address,
  payment_status,
  enrollment_status,
  created_at,
  photo_url,
  resume_url,
  temp_password,
  program_id
`)
      .order("created_at", { ascending: false });

    if (studentError) {
      throw studentError;
    }

    // Fetch programs
    const { data: programs, error: programError } = await supabase
      .from("programs")
      .select("id,title");

    if (programError) {
      throw programError;
    }

    const programMap = new Map(
      programs.map((program) => [program.id, program.title])
    );

const result = students.map((student) => ({
  id: student.id,
  full_name: student.full_name,
  email: student.email,
  phone: student.phone,
  college: student.college,
  branch: student.branch,
  year: student.year,
  address: student.address,
  payment_status: student.payment_status,
  enrollment_status: student.enrollment_status,
  created_at: student.created_at,
  photo_url: student.photo_url,
  resume_url: student.resume_url,
  temp_password: student.temp_password,
  program: programMap.get(student.program_id) ?? "N/A",
}));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Students API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch students.",
      },
      {
        status: 500,
      }
    );
  }
}