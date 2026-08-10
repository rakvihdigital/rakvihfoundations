import Navbar from "@/components/navbar/Navbar";
import ProgramsHero from "@/components/programs/ProgramsHero";
import ProgramsFilter from "@/components/programs/ProgramsFilter";
import CTASection from "@/components/cta/CTASection";
import Footer from "@/components/footer/Footer";

export default function ProgramsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-20">

        <ProgramsHero />

        <ProgramsFilter />

        <CTASection />

      </main>

      <Footer />
    </>
  );
}