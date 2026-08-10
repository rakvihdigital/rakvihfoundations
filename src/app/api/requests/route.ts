import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { student_phone, student_name, requested_subject } = await req.json();

    // 1. Insert into Supabase so Admin Panel can see it
    const { error } = await supabase.from("student_requests").insert({
      student_phone,
      student_name,
      request_type: "new_subject",
      subject: requested_subject,
      status: "pending"
    });

    if (error) throw error;

    // 2. Trigger your Email Service Here (e.g. Nodemailer, Resend, SendGrid)
    // sendEmailToAdmin("New Subject Requested", `${student_name} requested ${requested_subject}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}