// app/api/admin/teachers/[id]/route.ts
// Admin endpoint: update a single teacher — used both by the
// Activate/Deactivate toggle (status only) and the Edit modal
// (full profile update, with an optional password reset).

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

const VALID_TEACHING_MODES = ["home_tuition", "in_center", "online"];
const VALID_STATUSES = ["active", "inactive"];
const VALID_SALARY_FREQUENCIES = ["one_time", "monthly", "per_session"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+: dynamic route params are async — must be awaited
    const { id } = await params;
    const teacherId = Number(id);

    if (!id || Number.isNaN(teacherId)) {
      return NextResponse.json({ error: "Invalid teacher id." }, { status: 400 });
    }

    const body = await req.json();
    const update: Record<string, any> = {};

    // --- Simple status-only toggle (Activate / Deactivate button) ---
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      update.status = body.status;
    }

    // --- Full profile fields (Edit modal) — only apply what's present ---
    const passthroughFields = [
      "name",
      "email",
      "phone",
      "subjects",
      "address",
      "qualification",
      "gender",
      "date_of_birth",
      "teacher_type",
      "joining_date",
    ];
    for (const field of passthroughFields) {
      if (body[field] !== undefined) {
        update[field] = body[field] || null;
      }
    }

    if (body.email !== undefined) {
      update.email = String(body.email).toLowerCase().trim();
    }

    if (body.experience_years !== undefined) {
      update.experience_years = body.experience_years
        ? parseInt(body.experience_years)
        : 0;
    }

    if (body.salary_amount !== undefined) {
      update.salary_amount = body.salary_amount
        ? parseFloat(body.salary_amount)
        : null;
    }

    if (body.salary_frequency !== undefined) {
      if (!VALID_SALARY_FREQUENCIES.includes(body.salary_frequency)) {
        return NextResponse.json(
          { error: "Invalid salary frequency." },
          { status: 400 }
        );
      }
      update.salary_frequency = body.salary_frequency;
    }

    if (body.teaching_mode !== undefined) {
      const modeTokens = String(body.teaching_mode)
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
      update.teaching_mode = modeTokens.join(",");
    }

    // Optional password reset — only hash + set if a new one was provided
    if (body.password) {
      update.password_hash = await bcrypt.hash(body.password, 10);
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update." },
        { status: 400 }
      );
    }

    update.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("teachers")
      .update(update)
      .eq("id", teacherId)
      .select(
        "id, name, email, phone, subjects, status, address, qualification, experience_years, gender, date_of_birth, teacher_type, joining_date, teaching_mode, salary_amount, salary_frequency, profile_photo_url, created_at, updated_at"
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A teacher with this email address already exists." },
          { status: 409 }
        );
      }
      console.error("Supabase error updating teacher:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error updating teacher:", err);
    return NextResponse.json(
      { error: "Failed to update teacher." },
      { status: 500 }
    );
  }
}