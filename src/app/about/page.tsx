import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ProcessSection from "@/components/process/ProcessSection";
import AboutHero from "@/components/about/AboutHero";
import AboutSection from "@/components/about/AboutSection";
import StatsSection from "@/components/about/StatsSection";
import CTASection from "@/components/cta/CTASection";

export default function AboutPage() {
  return (
    <>

      <Navbar />

      <AboutHero />

       <ProcessSection />

      <AboutSection />

      

      <StatsSection />

      <CTASection />

      <Footer />

    </>
  );
}