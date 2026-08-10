import { notFound } from "next/navigation";
import { getCourse } from "@/lib/course";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import CourseHero from "@/components/course/CourseHero";
import CourseTabs from "@/components/course/CourseTabs";
import PriceCard from "@/components/course/PriceCard";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CoursePage({ params }: Props) {
  const { id } = await params;

  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <main className="min-h-screen bg-[#F8FAF1] dark:bg-[#0F172A] transition-all duration-300">
        {/* Hero */}
        <CourseHero course={course.program} />

        {/* Content */}
        <section className="bg-[#F8FAF1] dark:bg-[#0F172A] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-3">
              {/* Left */}
              <div className="lg:col-span-2">
                <CourseTabs course={course} />
              </div>

              {/* Right */}
              <div>
                <PriceCard
                  course={{
                    ...course.program,
                    ...course.details,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}