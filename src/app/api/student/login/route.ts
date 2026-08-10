// src/app/api/student/login/route.ts
// Simple phone-only login: checks that at least one active tuition application
// exists for this phone number. Bypasses RLS using supabaseAdmin.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.trim().length < 6) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Fetch id, parent_name, student_name, and active status
    const { data, error } = await supabaseAdmin
      .from("tuition_applications")
      .select("id, parent_name, student_name, is_active")
      .eq("parent_phone", cleanPhone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error during student login:", error);
      return NextResponse.json({ error: "Login failed." }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No tuition application found for this phone number." },
        { status: 404 }
      );
    }

    const record = data[0];

    // Check active status (defaults to true if null/undefined)
    const isActive = record.is_active ?? true;

    if (!isActive) {
      return NextResponse.json(
        {
          error: "Your account is currently inactive. Please contact support to restore access.",
          isInactive: true,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        id: record.id,
        phone: cleanPhone,
        parent_name: record.parent_name,
        student_name: record.student_name,
      },
    });
  } catch (err) {
    console.error("Error during student login:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}