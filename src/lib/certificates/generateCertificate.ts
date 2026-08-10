import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import { CERTIFICATE } from "./certificateTemplate";

interface GenerateCertificateProps {
  studentName: string;
  programName: string;
  certificateNumber: string;
  issueDate: string;
}

export async function generateCertificate({
  studentName,
  programName,
  certificateNumber,
  issueDate,
}: GenerateCertificateProps) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([
    CERTIFICATE.page.width,
    CERTIFICATE.page.height,
  ]);

  const { width, height } = page.getSize();

  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const titleFont = bold;

  // Colors
  const gold = rgb(0.83, 0.69, 0.22);
  const green = rgb(0.18, 0.49, 0.20);
  const black = rgb(0.15, 0.15, 0.15);
  const gray = rgb(0.45, 0.45, 0.45);

  // ====================================
  // Background
  // ====================================

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 0.985),
  });

  // ====================================
  // Double Border
  // ====================================

  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderWidth: 4,
    borderColor: gold,
  });

  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderWidth: 1.5,
    borderColor: green,
  });

  // ====================================
  // Organization Name
  // ====================================

  page.drawText(CERTIFICATE.organization, {
    x: (width - bold.widthOfTextAtSize(CERTIFICATE.organization, 20)) / 2,
    y: height - 75,
    size: 20,                    // Smaller
    font: bold,
    color: green,
  });

  // ====================================
  // Certificate Title
  // ====================================

  page.drawText(CERTIFICATE.title, {
    x: (width - titleFont.widthOfTextAtSize(CERTIFICATE.title, 28)) / 2,
    y: height - 118,
    size: 28,                    // Smaller
    font: titleFont,
    color: gold,
  });

  // ====================================
  // Subtitle
  // ====================================

  page.drawText(CERTIFICATE.subtitle, {
    x: (width - font.widthOfTextAtSize(CERTIFICATE.subtitle, 13)) / 2,
    y: height - 155,
    size: 13,                    // Smaller
    font,
    color: gray,
  });

  // ====================================
  // Student Name
  // ====================================

  const studentNameSize = 32;    // Smaller than before

  page.drawText(studentName, {
    x: (width - bold.widthOfTextAtSize(studentName, studentNameSize)) / 2,
    y: height - 235,
    size: studentNameSize,
    font: bold,
    color: black,
  });

  // Decorative Line
  page.drawLine({
    start: { x: width / 2 - 140, y: height - 245 },
    end: { x: width / 2 + 140, y: height - 245 },
    thickness: 1.5,
    color: gold,
  });

  // ====================================
  // Description
  // ====================================

  const description = CERTIFICATE.description(studentName, programName);

  page.drawText(description, {
    x: 90,
    y: height - 305,
    size: 13,                    // Smaller
    font,
    color: black,
    maxWidth: width - 180,
    lineHeight: 20,
  });

  // ====================================
  // Internship Program
  // ====================================

  const programTitle = `Internship Program : ${programName}`;

  page.drawText(programTitle, {
    x: (width - bold.widthOfTextAtSize(programTitle, 15)) / 2,
    y: height - 375,
    size: 15,                    // Smaller
    font: bold,
    color: green,
  });

  // ====================================
  // Certificate Number & Issue Date
  // ====================================

  page.drawText(`Certificate No : ${certificateNumber}`, {
    x: 80,
    y: 105,
    size: 11,                    // Smaller
    font: bold,
    color: gray,
  });

  page.drawText(`Issue Date : ${issueDate}`, {
    x: width - 215,
    y: 105,
    size: 11,                    // Smaller
    font: bold,
    color: gray,
  });

  // ====================================
  // Signature Line
  // ====================================

  page.drawLine({
    start: { x: width - 245, y: 90 },
    end: { x: width - 80, y: 90 },
    thickness: 1,
    color: black,
  });

  page.drawText("Authorized Signatory", {
    x: width - 215,
    y: 72,
    size: 10,                    // Smaller
    font: bold,
    color: black,
  });

  page.drawText(CERTIFICATE.organization, {
    x: width - 230,
    y: 57,
    size: 9,                     // Smaller
    font,
    color: gray,
  });

  // ====================================
  // Footer
  // ====================================

  page.drawText(CERTIFICATE.footer, {
    x: (width - font.widthOfTextAtSize(CERTIFICATE.footer, 10)) / 2,
    y: 28,
    size: 10,                    // Smaller
    font,
    color: gray,
  });

  // Decorative Bottom Line
  page.drawLine({
    start: { x: 70, y: 48 },
    end: { x: width - 70, y: 48 },
    thickness: 1,
    color: gold,
  });

  // ====================================
  // Save PDF
  // ====================================

  const pdfBytes = await pdfDoc.save();

  return {
    pdfDoc,
    pdfBytes,
    fileName: `${certificateNumber}.pdf`,
  };
}