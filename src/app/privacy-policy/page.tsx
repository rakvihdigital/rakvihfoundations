// src/app/privacy-policy/page.tsx
import { Fraunces, Manrope } from "next/font/google";
import type { Metadata } from "next";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Privacy Policy | RAKVIH Foundation",
  description:
    "How RAKVIH Foundation collects, uses, and protects personal data across its internship programs and tuition platform.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect personal information you provide during registration and enrollment, including but not limited to: name, email address, phone number, address, date of birth, educational details, and payment information. Tuition students/parents additionally provide parent/guardian name and email, the student's class/grade, and subject, schedule, and mode-of-class preferences. Teachers provide qualifications, subject expertise, identity/verification documents, teaching experience, and availability — no payment is collected from teachers, as registration is free.`,
  },
  {
    title: "2. How We Collect Information",
    body: `Information is collected through registration forms, the enrollment portal, contact/inquiry forms, and payment gateways integrated into the website. We may also collect technical data automatically, such as IP address, browser type, and device information, via standard web analytics.`,
  },
  {
    title: "3. Purpose of Data Collection",
    body: `We use your data to process registrations, verify and approve enrollments including teacher credential verification, issue login credentials, assign teachers to tuition students, communicate program and class updates, process one-time internship fees and recurring monthly tuition payments from students/parents only, issue certificates, respond to inquiries, and improve our Services.`,
  },
  {
    title: "4. Teacher Assignment & Data Sharing Between Users",
    body: `Teachers are assigned to students by RAKVIH Foundation's admin team based on subject, class, and schedule needs — students and parents do not browse or select teachers directly. To facilitate assigned classes, limited information such as name, subject, schedule, and contact/class-access details is shared between the assigned teacher and student/parent, only as necessary to conduct classes. Teachers and students/parents must not use each other's personal information for any purpose outside the assigned tuition arrangement.`,
  },
  {
    title: "5. Payment Information",
    body: `Payments — one-time internship fees and recurring monthly tuition subscriptions, both payable by students/parents only — are processed through third-party payment gateway providers. RAKVIH Foundation does not store full card or bank details on its own servers; such data is handled directly by the payment processor under its own security and privacy standards. Teachers do not make any payments; any teacher bank details collected are used solely for RAKVIH Foundation's internal compensation arrangements, where applicable.`,
  },
  {
    title: "6. Data Sharing with Third Parties",
    body: `We do not sell your personal data. We may share data with payment gateway providers to process student/parent transactions, the teacher assigned to a student solely for class delivery, service providers assisting with hosting, email, or analytics, and authorities where required by law. All third parties are expected to handle data responsibly.`,
  },
  {
    title: "7. Cookies & Tracking",
    body: `The website may use cookies and similar technologies to maintain login sessions, remember preferences, and analyze site usage. You can control cookies through your browser settings; disabling them may affect certain website functions.`,
  },
  {
    title: "8. Data Security",
    body: `We implement reasonable technical and organizational measures, such as access controls and secure credential handling, to protect your data. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "9. User Rights",
    body: `You have the right to access, correct, or request deletion of your personal data, and to withdraw consent for non-essential communications, subject to applicable law. Requests can be sent to info@rakvihfoundation.com.`,
  },
  {
    title: "10. Data Retention",
    body: `We retain personal data for as long as necessary to fulfill the purposes outlined in this policy, including program and class records, teacher verification records, certificate verification, and legal or tax obligations, after which it is deleted or anonymized.`,
  },
  {
    title: "11. Children's Privacy & Policy Updates",
    body: `Where students are minors, such as in our tuition programs, we collect parent/guardian contact details and require guardian consent, and limit teacher access to only the information necessary to conduct classes. This Privacy Policy may be updated periodically; continued use of the Services after changes constitutes acceptance of the revised policy. Material changes will be notified via the website or email.`,
  },
  {
    title: "12. Contact Us",
    body: `For questions about this Privacy Policy, reach us at info@rakvihfoundation.com or +91 82963 92047.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen bg-[#F8FAF0] text-[#1C2410] dark:bg-black dark:text-slate-100 transition-colors duration-500 ${display.variable} ${body.variable}`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Hero */}
        <section className="px-4 pb-8 pt-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
              Legal
            </span>
            <h1
              className="mt-3 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-neutral-400">
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-10 shadow-xl">
            {sections.map((s) => (
              <div key={s.title}>
                <h2
                  className="text-base font-bold text-[#1C2410] dark:text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}