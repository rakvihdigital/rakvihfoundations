import Navbar from "@/components/navbar/Navbar";
import SuccessHero from "@/components/success/SuccessHero";
import SuccessGrid from "@/components/success/SuccessGrid";
import Footer from "@/components/footer/Footer";

import { getSuccessStories } from "@/lib/success-stories";

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();

  return (
    <>
      <Navbar />

      <SuccessHero />

      <SuccessGrid stories={stories} />

      <Footer />
    </>
  );
}