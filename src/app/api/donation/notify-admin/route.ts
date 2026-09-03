import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      donorName,
      amount,
      causeTitle,
      personCount,
      donationDate,
      dedicationType,
      uploadedPhotoUrl,
      wantsVideo,
      packingLabelName,
      packingLabelDesc,
      selectedItemNames,
      donorMessage,
    } = data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 620px; margin: 0 auto; background-color: #0d0d0d; color: #ffffff; border: 1px solid #262626; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #24310F 0%, #171f0a 100%); padding: 28px 24px; border-bottom: 1px solid #334215; text-align: center;">
          <h1 style="color: #FFC107; margin: 0; font-size: 22px; letter-spacing: 0.5px;">New Sponsorship Received</h1>
          <p style="color: #a3b899; margin: 6px 0 0 0; font-size: 13px;">RAKVIH Foundation Management Alert</p>
        </div>

        <div style="padding: 24px;">
          <!-- Primary Summary Card -->
          <div style="background-color: #171717; border: 1px solid #2b2b2b; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="color: #888888; padding: 6px 0;">Donor Name:</td>
                <td style="color: #ffffff; font-weight: bold; text-align: right; font-size: 14px;">${donorName}</td>
              </tr>
              <tr>
                <td style="color: #888888; padding: 6px 0;">Initiative:</td>
                <td style="color: #ffffff; font-weight: 600; text-align: right;">${causeTitle}</td>
              </tr>
              <tr>
                <td style="color: #888888; padding: 6px 0;">Sponsored Count:</td>
                <td style="color: #FFC107; font-weight: bold; text-align: right;">${personCount} Member(s)</td>
              </tr>
              <tr>
                <td style="color: #888888; padding: 6px 0;">Total Paid:</td>
                <td style="color: #4ade80; font-weight: 800; font-size: 17px; text-align: right;">₹${Number(amount).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #888888; padding: 6px 0;">Dedication Type:</td>
                <td style="color: #ffffff; text-align: right;">${dedicationType}</td>
              </tr>
              <tr>
                <td style="color: #888888; padding: 6px 0;">Execution Date:</td>
                <td style="color: #ffffff; text-align: right;">${donationDate}</td>
              </tr>
            </table>
          </div>

          <!-- Video Alert (If Requested) -->
          ${
            wantsVideo
              ? `
            <div style="background-color: #2e1065; border: 1px solid #7e22ce; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <h3 style="color: #d8b4fe; margin: 0 0 6px 0; font-size: 14px;">📹 Celebration Video Requested</h3>
              <p style="color: #f3e8ff; margin: 0; font-size: 12px; line-height: 1.5;">
                The donor paid the video service fee. Please ensure field coordinators record a high-definition video of the celebration / distribution on <strong>${donationDate}</strong> and deliver it to the donor within 24–48 hours.
              </p>
            </div>
          `
              : ""
          }

          <!-- Printed Box Label (If Provided) -->
          ${
            packingLabelName
              ? `
            <div style="background-color: #171717; border: 1px dashed #FFC107; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
              <span style="color: #FFC107; font-size: 10px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Box Dedication Sticker</span>
              <h3 style="color: #ffffff; margin: 6px 0 2px 0; font-size: 16px;">${packingLabelName}</h3>
              ${packingLabelDesc ? `<p style="color: #e5e5e5; font-style: italic; margin: 0; font-size: 12px;">"${packingLabelDesc}"</p>` : ""}
              <p style="color: #888888; margin: 8px 0 0 0; font-size: 11px;">Print Quantity: <strong>${personCount} stickers</strong></p>
            </div>
          `
              : ""
          }

          <!-- Packaging Photo (If Attached) -->
          ${
            uploadedPhotoUrl
              ? `
            <div style="background-color: #171717; border: 1px solid #2b2b2b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <h4 style="color: #38bdf8; margin: 0 0 10px 0; font-size: 13px;">🖼️ Packaging Photo Attached (Print ${personCount} Copies)</h4>
              <div style="text-align: center;">
                <img src="${uploadedPhotoUrl}" alt="Packaging Proof" style="max-width: 100%; max-height: 240px; border-radius: 8px; border: 1px solid #333333; display: block; margin: 0 auto 10px auto;" />
                <a href="${uploadedPhotoUrl}" target="_blank" style="display: inline-block; background-color: #FFC107; color: #000000; text-decoration: none; font-weight: bold; font-size: 12px; padding: 8px 16px; border-radius: 8px;">
                  Download Full-Resolution Photo
                </a>
              </div>
            </div>
          `
              : ""
          }

          <!-- Extras Checklist -->
          ${
            selectedItemNames && selectedItemNames.length > 0
              ? `
            <div style="background-color: #171717; border: 1px solid #2b2b2b; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <h4 style="color: #fbbf24; margin: 0 0 10px 0; font-size: 13px;">🎁 Extra Gifts To Pack</h4>
              <ul style="margin: 0; padding-left: 20px; color: #fef08a; font-size: 12px; line-height: 1.6;">
                ${selectedItemNames.map((name: string) => `<li>${name} — <strong>${personCount} Units</strong> (${personCount} × 1)</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }

          <!-- Donor Note -->
          ${
            donorMessage
              ? `
            <div style="background-color: #171717; border: 1px solid #2b2b2b; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
              <span style="color: #888888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Personal Note From Donor:</span>
              <p style="color: #e5e5e5; font-style: italic; margin: 6px 0 0 0; font-size: 13px;">"${donorMessage}"</p>
            </div>
          `
              : ""
          }

          <!-- Footer Link to Admin Dashboard -->
          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #262626;">
            <p style="color: #737373; font-size: 11px; margin-bottom: 10px;">
              This notification was automatically dispatched upon Razorpay payment confirmation.
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"RAKVIH Foundation" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sends directly to the admin email
      subject: `🔔 New Donation: ₹${Number(amount).toLocaleString()} from ${donorName} (${causeTitle})`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email notification dispatch failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}