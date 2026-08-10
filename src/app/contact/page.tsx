import Navbar from "@/components/navbar/Navbar";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import Footer from "@/components/footer/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <ContactHero />

      <ContactForm />

      <ContactMap />

      <Footer />
    </>
  );
}