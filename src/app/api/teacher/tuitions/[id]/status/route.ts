// src/app/api/teacher/tuitions/[id]/status/route.ts
// Lets a teacher update the status of their own assignment
// (not_started -> ongoing -> completed). Verifies the assignment actually
// belongs to the requesting teacher before allowing the update.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const VALID_STATUSES = ["not_started", "ongoing", "completed", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, teacher_id } = await req.json();
    
    // Await the params object
    const resolvedParams = await params;
    const assignmentId = resolvedParams.id;

    if (!status || !teacher_id) {
      return NextResponse.json(
        { error: "status and teacher_id are required." },
        { status: 400 }
      );
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    // Confirm this assignment actually belongs to this teacher
    const { data: assignment, error: fetchError } = await supabaseAdmin
      .from("tuition_assignments")
      .select("id, teacher_id")
      .eq("id", assignmentId)
      .single();

    if (fetchError || !assignment) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }
    if (String(assignment.teacher_id) !== String(teacher_id)) {
      return NextResponse.json(
        { error: "You are not authorized to update this assignment." },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("tuition_assignments")
      .update({ status })
      .eq("id", assignmentId);

    if (updateError) {
      console.error("Error updating assignment status:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating tuition status:", err);
    return NextResponse.json(
      { error: "Failed to update status." },
      { status: 500 }
    );
  }
}