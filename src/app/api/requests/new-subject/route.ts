import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      student_phone,
      student_name,
      requested_subject,
      // 🚀 NEW fields from the updated subject request form
      parent_name,
      class_grade,
      preferred_days,
      preferred_time,
      preferred_mode,
    } = body;

    // 🚀 NEW: pack the extra context into "details" since the table
    // has no dedicated columns for these fields
    const detailsText = [
      `Parent Name: ${parent_name || "N/A"}`,
      `Class: ${class_grade || "N/A"}`,
      `Preferred Days: ${preferred_days || "N/A"}`,
      `Preferred Time: ${preferred_time || "N/A"}`,
      `Preferred Mode: ${preferred_mode || "N/A"}`,
    ].join(" | ");

    const { error } = await supabase.from("student_requests").insert({
      student_phone,
      student_name,
      request_type: "new_subject",
      subject: requested_subject,
      details: detailsText,
      status: "pending",
    });

    if (error) throw error;

    // 🚀 UPDATED: richer, better-formatted admin email
    await sendAdminEmail(
      `🚨 New Subject Request — ${student_name} (${requested_subject})`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #798321, #FFC107); padding: 20px 24px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 18px;">📚 New Subject Request</h2>
          <p style="margin: 4px 0 0; color: #ffffff; font-size: 13px; opacity: 0.9;">A student has requested to enroll in a new subject.</p>
        </div>

        <div style="padding: 20px 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1f2937;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 40%;">👤 Student Name</td>
              <td style="padding: 8px 0;">${student_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">👨‍👩‍👧 Parent Name</td>
              <td style="padding: 8px 0;">${parent_name || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📞 Phone Number</td>
              <td style="padding: 8px 0;">${student_phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">🎓 Class / Grade</td>
              <td style="padding: 8px 0;">${class_grade || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📖 Requested Subject(s)</td>
              <td style="padding: 8px 0; color: #798321; font-weight: bold;">${requested_subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📅 Preferred Days</td>
              <td style="padding: 8px 0;">${preferred_days || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">⏰ Preferred Time</td>
              <td style="padding: 8px 0;">${preferred_time || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">💻 Preferred Mode</td>
              <td style="padding: 8px 0; text-transform: capitalize;">${preferred_mode || "Not specified"}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 12px 16px; background: #f9fafb; border-left: 4px solid #798321; border-radius: 6px;">
            <p style="margin: 0; font-size: 13px; color: #4b5563;">
              This request was submitted via the Student Portal. Please review and assign a suitable teacher, then update the request status in the admin dashboard.
            </p>
          </div>
        </div>

        <div style="background: #f3f4f6; padding: 12px 24px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">RAKVIH Foundation · Student Portal Notification</p>
        </div>
      </div>
      `
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}