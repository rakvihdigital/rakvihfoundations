// src/app/terms/page.tsx
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
  title: "Terms & Conditions | RAKVIH Foundation",
  description:
    "Terms and conditions governing use of RAKVIH Foundation's internship programs and tuition platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By registering on, accessing, or using the RAKVIH Foundation website and internship/tuition programs ("Services"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Services. If you are under 18, a parent or legal guardian must accept these terms on your behalf.`,
  },
  {
    title: "2. Description of Services",
    body: `RAKVIH Foundation operates two categories of Services: Internship Programs, offering industry-focused internships with mentorship, live projects, and certification upon completion; and the Tuition Platform, where students/parents register and pay a monthly subscription fee to receive tuition classes, while teachers register free of charge to be considered for teaching assignments. RAKVIH Foundation assigns a suitable teacher to each enrolled student based on subject, class, and preferences — students/parents do not select or pay teachers directly. Program/teacher availability, subjects, pricing, and features may be updated or changed at our discretion without prior notice.`,
  },
  {
    title: "3. Registration & Enrollment Process",
    body: `For interns/students: registration → payment → admin verification/approval → issuance of login credentials → program participation → certificate issuance. For tuition students/parents: registration → submission of subject/class/schedule preferences → monthly subscription payment → admin assigns a teacher → class access. For teachers: registration with relevant qualifications/details (no fee required) → admin verification of credentials → approval to be listed as eligible → admin assigns students to approved teachers. RAKVIH Foundation reserves the right to accept or reject any registration at its sole discretion, including after payment, in which case applicable refund terms (see Section 5) will apply.`,
  },
  {
    title: "4. User Accounts & Responsibilities",
    body: `This applies to all user types — interns, tuition students/parents, and teachers. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You agree to provide accurate, current, and complete information during registration and to promptly update it if it changes. You must not share your credentials, misuse the platform, or attempt to disrupt or gain unauthorized access to the website or its systems. Teacher registration is free of charge; teachers are responsible for conducting classes professionally with students assigned to them, maintaining agreed schedules, and complying with our teaching standards and child-safety guidelines when teaching minors. We may verify teacher credentials but do not guarantee outcomes of any individual teacher's tuition classes.`,
  },
  {
    title: "5. Fees, Payments, Subscriptions & Refunds",
    body: `Internship fees are one-time and must be paid in full before verification/enrollment is completed. Tuition fees are payable only by students/parents, billed on a recurring monthly subscription basis for as long as the student continues tuition classes. Subscriptions auto-continue each month unless cancelled by the student/parent before the next billing cycle. Teacher registration and participation is free of charge; RAKVIH Foundation compensates teachers separately as per internal arrangement, and this is not billed to or paid by students. All fees are stated in INR unless otherwise noted. Refunds, if any, are governed by our refund policy [insert specific refund terms]. RAKVIH Foundation is not responsible for payment gateway errors caused by third-party providers.`,
  },
  {
    title: "6. Certificates & Program Completion",
    body: `Certificates are issued only upon successful completion of the required internship program criteria (projects, assessments, attendance, etc., as applicable). RAKVIH Foundation does not guarantee employment, placement, or interview opportunities; certificates and mentorship are provided on a best-effort educational basis. This clause does not apply to the Tuition Platform, which is an ongoing subscription service rather than a fixed-completion program.`,
  },
  {
    title: "7. Intellectual Property",
    body: `All website content, branding, course material, project briefs, and platform design are the property of RAKVIH Solutions Private Limited and may not be copied, reproduced, or redistributed without written permission. Any student project work remains subject to the ownership terms communicated during the specific program.`,
  },
  {
    title: "8. Prohibited Conduct",
    body: `Users must not use the Services for unlawful purposes, upload harmful or malicious content, impersonate others, submit plagiarized work, or attempt to reverse-engineer or scrape the website. Violation may result in immediate suspension or termination of access without refund.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `RAKVIH Foundation provides the Services on an "as-is" basis. We are not liable for indirect, incidental, or consequential damages arising from use of the Services, technical downtime, third-party payment issues, or reliance on program outcomes such as job placement expectations.`,
  },
  {
    title: "10. Termination, Governing Law & Dispute Resolution",
    body: `We may suspend or terminate any user's access for breach of these terms. These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.`,
  },
  {
    title: "11. Contact Us",
    body: `For questions about these Terms & Conditions, reach us at info@rakvihfoundation.com or +91 82963 92047.`,
  },
];

export default function TermsPage() {
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
              Terms & Conditions
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