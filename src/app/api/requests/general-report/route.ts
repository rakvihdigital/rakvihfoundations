import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { student_phone, student_name, message } = body;

    const { error } = await supabase.from("student_requests").insert({
      student_phone,
      student_name,
      request_type: "general_report",
      details: message,
      status: "pending"
    });

    if (error) throw error;

    await sendAdminEmail(
      `✉️ New Feedback/Report: ${student_name}`,
      `<h2>General Feedback / Issue Report</h2>
       <p><strong>Student:</strong> ${student_name}</p>
       <p><strong>Phone:</strong> ${student_phone}</p>
       <p><strong>Message:</strong></p>
       <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
         ${message}
       </blockquote>`
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}