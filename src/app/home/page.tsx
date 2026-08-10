import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Stats from "@/components/stats/Stats";
import ProcessSection from "@/components/process/ProcessSection";
import ProgramsSection from "@/components/programs/ProgramsSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import CTASection from "@/components/cta/CTASection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProcessSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CTASection />
      <Stats />
      <Footer />
    </>
  );
}