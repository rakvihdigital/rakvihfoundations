// src/app/api/admin/tuition/assign/route.ts
// Admin endpoint: assigns a teacher, fee, and class schedule to an application.
// Updates the existing assignment if one already exists (so "Edit" works too).
// TODO: add your own admin-auth check here before deploying.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const {
      application_id,
      teacher_id,
      fee_amount,
      fee_frequency,
      start_date,
      schedule_days,
      schedule_time,
      meeting_link,
    } = await req.json();

    if (!application_id || !teacher_id || !fee_amount) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!start_date || !schedule_days || !schedule_time) {
      return NextResponse.json(
        { error: "start_date, schedule_days, and schedule_time are required." },
        { status: 400 }
      );
    }

    // Fields shared by both insert and update paths
    const assignmentPayload = {
      teacher_id,
      fee_amount,
      fee_frequency: fee_frequency || "monthly",
      start_date,                 // e.g. "2026-08-05"
      schedule_days,               // e.g. "Mon, Wed, Fri"
      schedule_time,                // e.g. "5:00 PM - 6:00 PM"
      meeting_link: meeting_link || null,
    };

    // Check if an assignment already exists for this application
    const { data: existing, error: findError } = await supabaseAdmin
      .from("tuition_assignments")
      .select("id")
      .eq("application_id", application_id)
      .maybeSingle();

    if (findError) {
      console.error("Supabase error checking existing assignment:", findError);
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from("tuition_assignments")
        .update(assignmentPayload)
        .eq("application_id", application_id);

      if (updateError) {
        console.error("Supabase error updating assignment:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("tuition_assignments")
        .insert({
          application_id,
          ...assignmentPayload,
        });

      if (insertError) {
        console.error("Supabase error creating assignment:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    // Mark the application itself as "assigned"
    const { error: statusError } = await supabaseAdmin
      .from("tuition_applications")
      .update({ status: "assigned" })
      .eq("id", application_id);

    if (statusError) {
      console.error("Supabase error updating application status:", statusError);
      return NextResponse.json({ error: statusError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error assigning teacher:", err);
    return NextResponse.json(
      { error: "Failed to assign teacher." },
      { status: 500 }
    );
  }
}