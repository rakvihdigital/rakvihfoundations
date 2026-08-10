"use client";

import { Star } from "lucide-react";

interface TestimonialProps {
  testimonial: {
    id: number;
    name: string;
    role: string;
    initials: string;
    review: string;
    rating: number;
  };
}

export default function TestimonialCard({
  testimonial,
}: TestimonialProps) {
  return (
    <div
      className="
        group
        rounded-[22px]
        border
        p-5
        shadow-sm
        transition-all
        duration-300
        ease-in-out

        bg-white
        border-[#798321]/20

        hover:-translate-y-[10px]
        hover:border-[#798321]
        hover:bg-[#EEF4DC]
        hover:shadow-xl

        dark:bg-[#0a0a0a]
        dark:border-neutral-800
        dark:hover:bg-[#171717]
        dark:hover:border-[#FFC107]
      "
    >
      {/* Stars */}
      <div className="mb-3 flex gap-1">
        {[...Array(testimonial.rating)].map((_, index) => (
          <Star
            key={index}
            size={12}
            className="fill-[#FFC107] text-[#FFC107]"
          />
        ))}
      </div>

      {/* Review */}
      <p
        className="
          min-h-[80px]
          text-[13px]
          leading-6
          transition-colors
          duration-300

          text-[#374151]

          dark:text-neutral-300
        "
      >
        "{testimonial.review}"
      </p>

      {/* Student */}
      <div className="mt-5 flex items-center gap-3">

        {/* Avatar */}
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-sm
            font-bold
            shadow-sm
            transition-colors
            duration-300

            bg-[#798321]
            text-white

            group-hover:bg-[#FFC107]
            group-hover:text-[#798321]

            dark:bg-[#FFC107]
            dark:text-black
            dark:group-hover:bg-[#798321]
            dark:group-hover:text-white
          "
        >
          {testimonial.initials}
        </div>

        {/* Name */}
        <div>

          <h3
            className="
              text-[15px]
              font-semibold

              text-[#798321]

              dark:text-white
            "
          >
            {testimonial.name}
          </h3>

          <p
            className="
              text-[12px]

              text-[#6B7280]

              dark:text-neutral-400
            "
          >
            {testimonial.role}
          </p>

        </div>

      </div>
    </div>
  );
}