import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { donorName, donorEmail, amount, status } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    let subject = "";
    let htmlContent = "";

    if (status === "approved") {
      subject = "Donation Approved - Tax Receipt Details (RAKVIH Foundation)";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">Donation Approved! ✅</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Dear ${donorName},</p>
            <p>Great news! Our finance team has successfully verified your donation payment of <strong>₹${amount}</strong>.</p>
            <p>Your contribution directly impacts our mission and helps us bring education and digital literacy to those who need it most.</p>
            <p>You can use this email as an official acknowledgement of your contribution.</p>
            <br/>
            <p>With deepest gratitude,<br/><strong>RAKVIH Foundation Team</strong></p>
          </div>
        </div>
      `;
    } else if (status === "rejected") {
      subject = "Action Required: Issue with your Donation Proof (RAKVIH Foundation)";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #dc2626; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">Payment Verification Failed ❌</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Dear ${donorName},</p>
            <p>We are writing regarding your recent donation submission of <strong>₹${amount}</strong>.</p>
            <p>Unfortunately, our finance team was unable to verify the transaction using the payment screenshot provided. This usually happens if the screenshot is blurry, incomplete, or if the transaction failed on the bank's end.</p>
            <p>Please reply to this email with a clearer screenshot or transaction ID so we can manually verify it for you.</p>
            <br/>
            <p>Thank you for your patience,<br/><strong>RAKVIH Foundation Team</strong></p>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"RAKVIH Foundation" <${process.env.EMAIL_USER}>`,
      to: donorEmail,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending status email:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}