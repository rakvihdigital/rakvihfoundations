import TestimonialCard from "./TestimonialCard";
import { getTestimonials } from "@/lib/testimonials";

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section
      className="
        relative
        overflow-hidden
        pt-10
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

        {/* Heading */}
        <div className="mb-8 text-center">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[4px]
              text-[#FFC107]
            "
          >
            TESTIMONIALS
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
            What Students Say
          </h2>
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