// src/app/terms/page.tsx
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
  title: "Terms & Conditions | Rakvih Foundation",
  description:
    "Terms and conditions governing the use of Rakvih Foundation's website and donation services.",
};

const sections = [
  {
    title: "1. About Us",
    body: `Rakvih Foundation ("we", "us", "our") is a non-profit organisation working across India to alleviate hunger and uplift communities through food, education, healthcare, and livelihood programmes. By accessing or using this website (rakvihfoundation.org and its subdomains), you agree to be bound by these Terms & Conditions.`,
  },
  {
    title: "2. Use of This Website",
    body: `You agree to use this website only for lawful purposes. You must not misuse the site by knowingly introducing viruses, attempting unauthorised access to our systems, or using automated means to scrape or copy content without permission.`,
  },
  {
    title: "3. Donations",
    body: `All donations made through this website are voluntary contributions to Rakvih Foundation's programmes. Donations are non-refundable except where required by law or at our sole discretion in cases of genuine error (e.g. duplicate charges or incorrect amounts). To request a review of a donation, contact us at rakvihfoundation@gmail.com within 7 days of the transaction.`,
  },
  {
    title: "4. Tax Receipts",
    body: `Rakvih Foundation is 80G certified under the Income Tax Act. Eligible donors will receive an official donation receipt via email, which can be used to claim applicable tax deductions. Please ensure your name and PAN details (where applicable) are entered correctly at the time of donation, as receipts are issued based on the information provided.`,
  },
  {
    title: "5. Use of Donation Funds",
    body: `Contributions are directed toward the specific cause or item selected at the time of donation wherever possible. In circumstances where a specific need has already been fully funded or is no longer applicable, Rakvih Foundation reserves the right to reallocate funds to a comparable cause within the same programme area, in keeping with the spirit of the original contribution.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All content on this website — including text, images, logos, and design — is the property of Rakvih Foundation unless otherwise credited, and may not be reproduced or used commercially without our written permission.`,
  },
  {
    title: "7. Third-Party Links",
    body: `This website may contain links to third-party sites, including payment gateways and social media platforms. We are not responsible for the content, accuracy, or practices of these external sites.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `While we make every effort to keep information on this website accurate and up to date, Rakvih Foundation makes no warranties about the completeness or reliability of its content and will not be liable for any loss arising from its use.`,
  },
  {
    title: "9. Changes to These Terms",
    body: `We may update these Terms & Conditions from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.`,
  },
  {
    title: "10. Contact Us",
    body: `For questions about these Terms & Conditions, reach us at rakvihfoundation@gmail.com or +91 85499 42525.`,
  },
];

export default function TermsPage() {
  return (
    <div
      className={`min-h-screen overflow-x-clip bg-[#F8FAF0] text-[#1C2410] dark:bg-black dark:text-slate-100 transition-colors duration-500 ${display.variable} ${body.variable}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Hero */}
      <section className="px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
            Legal
          </span>
          <h1
            className="mt-2 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Terms & Conditions
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            Last updated: August 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
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