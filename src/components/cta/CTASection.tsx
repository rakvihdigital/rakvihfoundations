"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        py-16
        transition-all
        duration-500

        bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_35%,#DCE8B3_65%,#798321_100%)]

        dark:bg-none
        dark:bg-black
      "
    >
      {/* Top Divider */}
      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-[1px]

          bg-gradient-to-r
          from-transparent
          via-[#798321]/25
          to-transparent

          dark:via-[#FFC107]/20
        "
      />

      {/* Background Glow */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none

          bg-[radial-gradient(circle_at_center,rgba(121,131,33,0.15)_0%,transparent_70%)]

          dark:bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.08)_0%,transparent_70%)]
        "
      />

      {/* Glow */}
      <div
        className="
          absolute
          -top-24
          right-1/4
          h-64
          w-64
          rounded-full
          bg-[#FFC107]/10
          blur-[80px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-10
          h-72
          w-72
          rounded-full
          bg-[#798321]/20
          blur-[100px]

          dark:bg-[#798321]/15
        "
      />

      {/* Grid */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-[0.03]
          dark:opacity-[0.08]

          bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]
          bg-[size:24px_24px]
        "
      />

      {/* Particles */}
      <div className="absolute top-1/3 left-10 h-2 w-2 rounded-full bg-[#FFC107]/40" />
      <div className="absolute bottom-1/4 right-12 h-3 w-3 rounded-full bg-[#798321]/30 dark:bg-[#FFC107]/30" />

      {/* Glass */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">

        {/* Heading */}
        <h2
          className="
            text-3xl
            font-extrabold
            tracking-tight

            text-[#798321]

            md:text-5xl

            dark:text-white
          "
        >
          Ready to Start Your Journey?
        </h2>

        {/* Subtitle */}
        <p
          className="
            mx-auto
            mt-4
            max-w-[700px]
            text-[13px]
            leading-6
            font-medium

            text-[#374151]

            md:text-[15px]

            dark:text-neutral-300
          "
        >
          Join 10,000+ students who have already transformed their careers with
          RAKVIH Foundation.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

          {/* Register */}
          <button
            className="
              group
              flex
              items-center
              gap-2
              rounded-xl
              px-8
              py-3
              text-[14px]
              font-semibold
              transition-all
              duration-300

              bg-[#798321]
              text-white

              hover:-translate-y-0.5
              hover:bg-[#FFC107]
              hover:text-[#798321]

              dark:bg-[#FFC107]
              dark:text-black
              dark:hover:bg-[#798321]
              dark:hover:text-white
            "
          >
            Register Now — It's Simple

            <ArrowRight
              size={16}
              className="
                transition-all
                duration-300
                group-hover:translate-x-1

                text-white

                group-hover:text-[#798321]

                dark:text-black
                dark:group-hover:text-white
              "
            />
          </button>

          {/* Explore */}
          <Link
            href="/programs"
            className="
              rounded-xl
              border-2
              px-8
              py-3
              text-[14px]
              font-semibold
              transition-all
              duration-300

              border-[#798321]
              bg-white
              text-[#798321]

              hover:-translate-y-0.5
              hover:bg-[#798321]
              hover:text-white

              dark:border-[#FFC107]
              dark:bg-transparent
              dark:text-[#FFC107]
              dark:hover:bg-[#FFC107]
              dark:hover:text-black
            "
          >
            Explore Programs
          </Link>

        </div>

      </div>
    </section>
  );
}