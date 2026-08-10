// src/app/privacy-policy/page.tsx
import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";
import type { Metadata } from "next";

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
  title: "Privacy Policy | Rakvih Foundation",
  description:
    "How Rakvih Foundation collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Introduction",
    body: `Rakvih Foundation ("we", "us", "our") respects your privacy. This Privacy Policy explains what information we collect when you use this website or donate to our causes, how we use it, and the choices you have.`,
  },
  {
    title: "2. Information We Collect",
    body: `When you donate, volunteer, or contact us, we may collect your name, email address, phone number, postal address, and payment details (processed securely by our payment gateway partner — we do not store full card numbers). We may also collect basic usage data such as pages visited and browser type, via cookies or analytics tools.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use your information to process donations and issue 80G tax receipts, send updates and impact reports (photo/video proof) for causes you've supported, respond to enquiries, and improve this website. We do not sell or rent your personal information to third parties.`,
  },
  {
    title: "4. Donor Recognition",
    body: `As part of our transparency commitment, donor names may be acknowledged alongside the contribution they funded, unless you request to remain anonymous. You can opt out of name recognition at any time by emailing us.`,
  },
  {
    title: "5. Payment Security",
    body: `All online donations are processed through a PCI-DSS compliant, third-party payment gateway. Rakvih Foundation does not store your full card, UPI, or net-banking credentials on its own servers.`,
  },
  {
    title: "6. Cookies",
    body: `This website may use cookies to remember your preferences and understand how visitors use the site. You can disable cookies through your browser settings; some features may not function correctly if you do so.`,
  },
  {
    title: "7. Sharing of Information",
    body: `We may share limited information with trusted service providers who help us operate this website, process payments, or send communications — solely for those purposes, and under confidentiality obligations. We may also disclose information if required by law.`,
  },
  {
    title: "8. Data Retention",
    body: `We retain donor and transaction records for as long as necessary to comply with legal, tax, and accounting requirements, and to maintain accurate impact records.`,
  },
  {
    title: "9. Your Rights",
    body: `You may request access to, correction of, or deletion of your personal information held by us, subject to our legal obligations (such as retaining donation records for tax purposes). To make a request, contact us at rakvihfoundation@gmail.com.`,
  },
  {
    title: "10. Children's Privacy",
    body: `This website is not directed at children. We do not knowingly collect personal information from individuals under 18 without parental or guardian consent.`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may update this Privacy Policy periodically. Any changes will be posted on this page with a revised "last updated" date.`,
  },
  {
    title: "12. Contact Us",
    body: `For privacy-related questions or requests, reach us at rakvihfoundation@gmail.com or +91 85499 42525, or by post at Attur Layout, Yelahanka, Bengaluru, Karnataka 560064.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
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
            Last updated: August 2026
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
  );
}