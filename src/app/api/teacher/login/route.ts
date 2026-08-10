// src/app/api/teacher/login/route.ts
// Teacher login: checks email/password against the teachers table.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { data: teacher, error } = await supabaseAdmin
      .from("teachers")
      .select(
        "id, name, email, phone, subjects, status, password_hash, address, qualification, experience_years, gender, date_of_birth, teacher_type, joining_date, profile_photo_url, teaching_mode, salary_amount, salary_frequency"
      )
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Supabase error during teacher login:", error);
      return NextResponse.json({ error: "Login failed." }, { status: 500 });
    }

    if (!teacher) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (teacher.status !== "active") {
      return NextResponse.json(
        { error: "Your account is inactive. Please contact the admin." },
        { status: 403 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, teacher.password_hash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Never send password_hash back to the client
    const { password_hash, ...safeTeacher } = teacher;

    return NextResponse.json({ success: true, teacher: safeTeacher });
  } catch (err) {
    console.error("Error during teacher login:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}