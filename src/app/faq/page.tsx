import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import FAQHero from "@/components/faq/FAQHero";
import FAQSection from "@/components/faq/FAQSection";
import FAQCTA from "@/components/faq/FAQCTA";

export default function FAQPage() {
  return (
    <>

      {/* Navbar */}

      <Navbar />

      <main className="pt-20">

        {/* Hero */}

        <FAQHero />

        {/* FAQ */}

        <FAQSection />

        {/* CTA */}

        <FAQCTA />

      </main>

      {/* Footer */}

      <Footer />

    </>
  );
}