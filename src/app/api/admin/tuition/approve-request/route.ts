import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendStudentEmail, sendAdminEmail } from "@/lib/mail"; // 👈 adjust path if different

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ApproveBody = {
  request_id?: number;
  action_type: "new_subject" | "teacher_change";
  student_phone: string;
  student_name: string;
  details: Record<string, any>;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApproveBody;
    const { action_type, student_phone, student_name, details } = body;

    if (!student_phone || !action_type) {
      return NextResponse.json({ error: "Missing student_phone or action_type" }, { status: 400 });
    }

    // Look up parent_email from any tuition_applications row matching this phone.
    const { data: appRow, error: lookupError } = await supabase
      .from("tuition_applications")
      .select("parent_email, parent_name")
      .eq("parent_phone", student_phone)
      .not("parent_email", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lookupError) {
      console.error("parent_email lookup failed:", lookupError);
    }

    const parentEmail = appRow?.parent_email;
    const parentName = appRow?.parent_name || "Parent";

    const { subject, html } = buildEmail(action_type, {
      parentName,
      studentName: student_name,
      ...details,
    });

    // No email on file — expected for brand-new students. Still notify admin,
    // just skip the parent send.
    if (!parentEmail) {
      await sendAdminEmail(
        `[No parent email] ${subject}`,
        `<p>Could not send parent confirmation — no parent_email on file for phone ${student_phone}.</p>${html}`
      );
      return NextResponse.json({ sent: false, reason: "No parent_email on file for this phone number." });
    }

    await sendStudentEmail(parentEmail, subject, html);

    // Optional: also ping the admin inbox so you have a log of confirmations sent.
    await sendAdminEmail(`[Sent] ${subject}`, html);

    return NextResponse.json({ sent: true });
  } catch (err: any) {
    console.error("approve-request email error:", err);
    return NextResponse.json({ sent: false, error: err.message }, { status: 200 });
  }
}

function buildEmail(actionType: "new_subject" | "teacher_change", d: Record<string, any>) {
  const scheduleBlock = `
    <table style="border-collapse:collapse;margin-top:12px">
      <tr><td style="padding:4px 12px 4px 0;color:#666">Subject</td><td><strong>${d.subject ?? "—"}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Teacher</td><td><strong>${d.teacher_name ?? "To be confirmed"}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Mode</td><td>${d.mode ?? "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Start Date</td><td>${d.start_date ?? "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Days</td><td>${d.schedule_days ?? "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Time</td><td>${d.schedule_time ?? "—"}</td></tr>
      ${d.fee_amount ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Fee</td><td>₹${d.fee_amount} (${d.fee_frequency ?? "monthly"})</td></tr>` : ""}
      ${d.meeting_link ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Meeting Link</td><td><a href="${d.meeting_link}">${d.meeting_link}</a></td></tr>` : ""}
    </table>
  `;

  if (actionType === "new_subject") {
    return {
      subject: `${d.studentName}'s new subject — ${d.subject} — is confirmed`,
      html: `
        <div style="font-family:sans-serif;color:#24310F">
          <p>Dear ${d.parentName},</p>
          <p>We're happy to confirm that <strong>${d.studentName}'s</strong> new subject request has been approved and set up.</p>
          ${scheduleBlock}
          <p style="margin-top:16px">Please reach out if anything above needs adjusting.</p>
        </div>
      `,
    };
  }

  return {
    subject: `Teacher reassigned for ${d.studentName}`,
    html: `
      <div style="font-family:sans-serif;color:#24310F">
        <p>Dear ${d.parentName},</p>
        <p>We've reassigned <strong>${d.studentName}'s</strong> class to a new teacher, as requested.</p>
        ${scheduleBlock}
        ${d.teacher_phone ? `<p>Teacher contact: ${d.teacher_phone}</p>` : ""}
        <p style="margin-top:16px">Let us know if you have any questions.</p>
      </div>
    `,
  };
}