import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assignment_id, student_phone, student_name, reason } = body;

    const { error } = await supabase.from("student_requests").insert({
      student_phone,
      student_name,
      request_type: "teacher_change",
      assignment_id,
      details: reason,
      status: "pending"
    });

    if (error) throw error;

    await sendAdminEmail(
      `⚠️ Teacher Change Request: ${student_name}`,
      `<h2>Teacher Change Request</h2>
       <p><strong>Student:</strong> ${student_name}</p>
       <p><strong>Phone:</strong> ${student_phone}</p>
       <p><strong>Assignment ID:</strong> ${assignment_id}</p>
       <p><strong>Reason:</strong> ${reason}</p>`
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}