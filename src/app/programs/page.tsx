import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import ProgramsHero from "@/components/programs/ProgramsHero";
import ProgramsFilter from "@/components/programs/ProgramsFilter";
import CTASection from "@/components/cta/CTASection";
import Footer from "@/components/footer/Footer";

// 1. ADDED SEO METADATA FROM PDF
export const metadata: Metadata = {
  title: "Internship Programs 2026 Web Dev, AI/ML, Data Science, Cloud & More | RAKVIH",
  description: "Browse RAKVIH's 8 industry-ready internship tracks Web Development, Full Stack, AI/ML, Data Science, Cloud, Cyber Security, Digital Marketing & UI/UX. Live projects & certification included.",
};

export default function ProgramsPage() {
  
  // 2. ADDED INVISIBLE FAQ SCHEMA FOR GOOGLE SEARCH (Rich Snippets)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What makes a RAKVIH internship different from a free online course?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every track includes a live mentor, a real project (not a pre-built template), a verified certificate, and placement assistance the combination employers actually screen for.",
        },
      },
    ],
  };

  return (
    <>
      {/* Inject JSON-LD Schema into the <head> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="pt-20">
        <ProgramsHero />

        <ProgramsFilter />

        {/* 3. ADDED FAQ UI SECTION FROM PDF */}
        <section className="py-16 bg-white dark:bg-black px-6 transition-colors duration-500">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-[#798321] dark:text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="bg-[#F8FAF1] dark:bg-[#111111] p-6 md:p-8 rounded-2xl border border-[#798321]/20 dark:border-[#798321]/30 shadow-sm transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-bold text-[#798321] dark:text-[#FFC107] mb-3">
                What makes a RAKVIH internship different from a free online course?
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Every track includes a live mentor, a real project (not a pre-built template), a verified certificate, and placement assistance — the combination employers actually screen for.
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </>
  );
}