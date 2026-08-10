// app/api/admin/teachers/route.ts
// Admin endpoint: list teachers (with assigned-student counts) and
// create a new teacher with a hashed password.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

const ACTIVE_ASSIGNMENT_STATUSES = ["not_started", "ongoing"];
const VALID_TEACHING_MODES = ["home_tuition", "in_center", "online"];
const VALID_SALARY_FREQUENCIES = ["one_time", "monthly", "per_session"];

// GET: Fetch all teachers ordered by creation date (newest first),
// each annotated with how many students are currently assigned to them.
export async function GET() {
  try {
    const { data: teachers, error } = await supabaseAdmin
      .from("teachers")
      .select(
        "id, name, email, phone, subjects, status, address, qualification, experience_years, gender, date_of_birth, teacher_type, joining_date, teaching_mode, salary_amount, salary_frequency, profile_photo_url, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching teachers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Pull every assignment row and tally per teacher. Deliberately NOT
    // filtered by status here — this must match what the "View" popup
    // shows (which lists every assignment, any status), or the table
    // count and the popup count will disagree.
    const { data: assignmentRows, error: assignError } = await supabaseAdmin
      .from("tuition_assignments")
      .select("teacher_id");

    if (assignError) {
      // Surface this loudly — a silent failure here is exactly what
      // caused the table to show 0 while the popup showed real data.
      console.error("Supabase error fetching assignment counts:", assignError);
    }

    const countMap: Record<number, number> = {};
    for (const row of assignmentRows || []) {
      const tid = Number(row.teacher_id);
      countMap[tid] = (countMap[tid] || 0) + 1;
    }

    const data = (teachers || []).map((t) => ({
      ...t,
      assigned_count: countMap[Number(t.id)] || 0,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching teachers:", err);
    return NextResponse.json(
      { error: "Failed to fetch teachers." },
      { status: 500 }
    );
  }
}

// POST: Create a new teacher record
export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      subjects,
      password,
      address,
      qualification,
      experience_years,
      gender,
      date_of_birth,
      teacher_type,
      joining_date,
      teaching_mode,
      salary_amount,
      salary_frequency,
    } = await req.json();

    // Validation
    if (!name || !email || !phone || !subjects || !password) {
      return NextResponse.json(
        { error: "Name, email, phone, subjects, and password are required." },
        { status: 400 }
      );
    }

    // teaching_mode arrives as a comma-separated string from the form,
    // e.g. "home_tuition,online" — validate each token against the
    // teachers_teaching_mode_check constraint before it hits the DB.
    const modeTokens = (teaching_mode || "home_tuition")
      .split(",")
      .map((m: string) => m.trim())
      .filter(Boolean);

    if (
      modeTokens.length === 0 ||
      modeTokens.some((m: string) => !VALID_TEACHING_MODES.includes(m))
    ) {
      return NextResponse.json(
        { error: "Select at least one valid teaching mode." },
        { status: 400 }
      );
    }

    const salaryFrequency = salary_frequency || "monthly";
    if (!VALID_SALARY_FREQUENCIES.includes(salaryFrequency)) {
      return NextResponse.json(
        { error: "Invalid salary frequency." },
        { status: 400 }
      );
    }

    // Hash password before saving
    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from("teachers")
      .insert({
        name,
        email: email.toLowerCase().trim(),
        phone,
        subjects,
        password_hash,
        status: "active",
        address: address || null,
        qualification: qualification || null,
        experience_years: experience_years ? parseInt(experience_years) : 0,
        gender: gender || null,
        date_of_birth: date_of_birth || null,
        teacher_type: teacher_type || "part_time",
        joining_date: joining_date || new Date().toISOString().split("T")[0],
        teaching_mode: modeTokens.join(","),
        salary_amount: salary_amount ? parseFloat(salary_amount) : null,
        salary_frequency: salaryFrequency,
      })
      .select("id")
      .single();

    if (error) {
      // 23505 is PostgreSQL unique constraint violation for email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A teacher with this email address already exists." },
          { status: 409 }
        );
      }
      console.error("Supabase error creating teacher:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating teacher:", err);
    return NextResponse.json(
      { error: "Failed to create teacher account." },
      { status: 500 }
    );
  }
}