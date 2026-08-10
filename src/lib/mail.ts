import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendAdminEmail = async (subject: string, htmlBody: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sends to the admin email
      subject: subject,
      html: htmlBody,
    });
  } catch (error) {
    console.error("Error sending admin email:", error);
  }
};

export const sendStudentEmail = async (toEmail: string, subject: string, htmlBody: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail, // Sends to the student's email address
      subject: subject,
      html: htmlBody,
    });
  } catch (error) {
    console.error("Error sending student email:", error);
  }
};