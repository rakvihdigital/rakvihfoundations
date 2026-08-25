import TestimonialCard from "./TestimonialCard";
import { getTestimonials } from "@/lib/testimonials";
import { CheckCircle2, ArrowRight, BookOpen, Route, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section
      className="
        relative
        overflow-hidden
        pt-16
        pb-20
        transition-colors
        duration-500

        bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAF1_25%,#EEF4DC_60%,#F6F9EF_100%)]

        dark:bg-none
        dark:bg-black
      "
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          pointer-events-none

          bg-[radial-gradient(circle_at_center,rgba(121,131,33,0.08)_0%,transparent_65%)]

          dark:bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.08)_0%,transparent_65%)]
        "
      />

      {/* Left Glow */}
      <div
        aria-hidden="true"
        className="
          absolute
          -top-40
          -left-40
          h-80
          w-80
          rounded-full
          bg-[#EEF4DC]/60
          blur-[100px]

          dark:bg-[#798321]/10
        "
      />

      {/* Right Glow */}
      <div
        aria-hidden="true"
        className="
          absolute
          bottom-10
          right-10
          h-32
          w-32
          rounded-full
          bg-[#FFC107]/10
          blur-[40px]

          dark:bg-[#FFC107]/10
        "
      />

      {/* Decorative Dots */}
      <div
        aria-hidden="true"
        className="
          absolute
          top-1/4
          left-12
          h-2
          w-2
          rounded-full
          bg-[#FFC107]/40
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-1/3
          right-16
          h-3
          w-3
          rounded-full
          bg-[#798321]/20

          dark:bg-[#FFC107]/30
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        {/* =========================================
            NEW TOP SECTION: HOME PAGE SEO CONTENT
            ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Card 1: Why Choose RAKVIH */}
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-sm p-8 rounded-3xl border border-[#798321]/20 dark:border-[#798321]/30 shadow-lg">
            <div className="h-12 w-12 bg-[#798321]/10 dark:bg-[#798321]/20 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="text-[#798321]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#798321] dark:text-white mb-4">
              Why Students Choose RAKVIH
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#FFC107] mt-1">✓</span>
                Verified, shareable certificate on completion of every internship track.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFC107] mt-1">✓</span>
                Industry expert mentors guiding you through real, live-project work - not simulations.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFC107] mt-1">✓</span>
                Placement assistance and career guidance built into every program.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFC107] mt-1">✓</span>
                5,000+ students enrolled and 250+ active internships running at any time.
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================
            TESTIMONIALS SECTION
            ========================================= */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[4px]
              text-[#FFC107]
            "
          >
            REAL OUTCOMES FROM REAL STUDENTS
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-extrabold
              tracking-tight
              text-[#798321]
              md:text-4xl
              dark:text-white
            "
          >
            Direct Stepping Stones to MNC Placements
          </h2>
          
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Students like Priya Sharma (Web Development), Rahul Verma (AI & Machine Learning), and Ananya Singh (Data Science) have used RAKVIH internships as a direct stepping stone into MNC placements — read their full stories on our Success Stories page.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item: any) => (
            <TestimonialCard
              key={item.id}
              testimonial={{
                id: item.id,
                name: item.student_name,
                role: item.course,
                initials: item.student_name
                  .split(" ")
                  .map((word: string) => word[0])
                  .join("")
                  .toUpperCase(),
                review: item.review,
                rating: item.rating,
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}