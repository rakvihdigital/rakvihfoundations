// src/app/api/tuition/apply/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// 🚀 NEW: service-role client, used ONLY for the duplicate pre-check below.
// The public `supabase` (anon) client only has INSERT granted via RLS, so it
// can't reliably tell us whether a phone/email already exists — a SELECT
// with no matching RLS policy just returns 0 rows, not an error, which would
// make this check silently useless. This client bypasses RLS entirely and
// never touches the client/browser — it's created fresh inside this server
// route only.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parent_name,
      parent_phone,
      parent_email,
      student_name,
      student_grade,
      subject,
      mode,
      preferred_days,
      preferred_time,
      address,
      message,
    } = body;

    if (!parent_name || !parent_phone || !student_name || !student_grade || !subject || !mode) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (mode === "home" && !address) {
      return NextResponse.json({ error: "Address is required for home tuition." }, { status: 400 });
    }

    // 🚀 NEW: block ANY second application with this phone number,
    // regardless of subject — matches how the "already exists" check
    // behaves for email below. This is intentionally stricter than the
    // unique_tuition_phone_subject DB constraint, which only blocks an
    // exact phone+subject repeat.
    const { data: existingPhone, error: phoneCheckErr } = await supabaseAdmin
      .from("tuition_applications")
      .select("id")
      .eq("parent_phone", parent_phone.trim())
      .limit(1)
      .maybeSingle();

    if (phoneCheckErr) {
      console.error("Phone duplicate check failed:", phoneCheckErr);
    }
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already exists. Can't register one more time." },
        { status: 409 }
      );
    }

    // Same idea for email, only if one was provided.
    if (parent_email) {
      const { data: existingEmail, error: emailCheckErr } = await supabaseAdmin
        .from("tuition_applications")
        .select("id")
        .eq("parent_email", parent_email.trim())
        .limit(1)
        .maybeSingle();

      if (emailCheckErr) {
        console.error("Email duplicate check failed:", emailCheckErr);
      }
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists. Can't register one more time." },
          { status: 409 }
        );
      }
    }

    const { error } = await supabase.from("tuition_applications").insert({
      parent_name,
      parent_phone,
      parent_email: parent_email || null,
      student_name,
      student_grade,
      subject,
      mode,
      preferred_days: preferred_days || null,
      preferred_time: preferred_time || null,
      address: address || null,
      message: message || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);

      // Fallback for the rare race-condition case (two submissions landing
      // at the exact same moment, both passing the pre-check above).
      if (error.code === "23505") {
        if (error.message.includes("email") || error.message.includes("parent_email")) {
          return NextResponse.json(
            { error: "Email already exists. Can't register one more time." },
            { status: 409 }
          );
        }
        if (error.message.includes("phone") || error.message.includes("parent_phone")) {
          return NextResponse.json(
            { error: "Phone number already exists. Can't register one more time." },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: "Email or Phone number already exists." },
          { status: 409 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving tuition application:", err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}