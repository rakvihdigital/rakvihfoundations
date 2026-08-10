import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { donorName, donorEmail, amount, purpose, type } = body;

    // Set up the email transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    if (type === "initial_submission") {
      // 1. Email sent to the DONOR
      const donorMailOptions = {
        from: `"RAKVIH Foundation" <${process.env.EMAIL_USER}>`,
        to: donorEmail,
        subject: "Thank You for Your Donation - RAKVIH Foundation",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #798321; padding: 30px 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 24px;">Thank You, ${donorName}! 💚</h2>
            </div>
            <div style="padding: 30px; color: #333; background-color: #ffffff;">
              <p style="font-size: 16px; line-height: 1.5;">We have successfully received your donation details and payment proof.</p>
              
              <div style="background-color: #f8faf0; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Amount</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 16px; color: #16a34a; border-bottom: 1px solid #e2e8f0;">₹${amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; padding-top: 16px;">Purpose</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #334155; padding-top: 16px;">${purpose}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                Our finance team is currently reviewing your payment screenshot. You will receive an official tax receipt email once the verification is complete.
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 20px;">
                Thank you for empowering lives and supporting our mission!
              </p>
              <br/>
              <p style="font-size: 14px; color: #334155; margin: 0;">Warm Regards,</p>
              <p style="font-size: 16px; font-weight: bold; color: #798321; margin: 4px 0 0 0;">RAKVIH Foundation Team</p>
            </div>
          </div>
        `,
      };

      // 2. Alert Email sent to the ADMIN
      const adminMailOptions = {
        from: `"RAKVIH System" <${process.env.EMAIL_USER}>`,
        // Falls back to your main email if ADMIN_EMAIL isn't set in .env
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, 
        subject: `🚨 New Donation Received: ₹${amount}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0B1220; padding: 20px; text-align: center; color: #FFC107;">
              <h2 style="margin: 0;">New Donation Alert</h2>
            </div>
            <div style="padding: 20px; color: #333; background-color: #ffffff;">
              <p>A new donation has just been submitted and is waiting for your approval in the dashboard.</p>
              <ul style="background-color: #f1f5f9; padding: 20px 40px; border-radius: 8px; line-height: 1.8;">
                <li><strong>Donor Name:</strong> ${donorName}</li>
                <li><strong>Email:</strong> ${donorEmail}</li>
                <li><strong>Amount:</strong> <span style="color: #16a34a; font-weight: bold;">₹${amount}</span></li>
                <li><strong>Purpose:</strong> ${purpose}</li>
              </ul>
              <p style="margin-top: 20px;">Please log in to the admin panel to view the payment proof and approve or reject this transaction.</p>
            </div>
          </div>
        `,
      };

      // Send both emails
      await transporter.sendMail(donorMailOptions);
      await transporter.sendMail(adminMailOptions);
    }

    return NextResponse.json({ success: true, message: "Emails sent successfully!" });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}