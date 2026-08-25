"use client";

import Link from "next/link";
import {
  Globe,
  Heart,
  Target,
  Star,
  ArrowRight,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        py-12
        sm:py-16
        lg:py-20
        transition-all
        duration-500

        bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_40%,#F8FAF1_70%,#FFFFFF_100%)]

        dark:bg-none
        dark:bg-black
      "
    >

      {/* Background Glow */}

      <div className="absolute inset-0 pointer-events-none">

        <div
          className="
            absolute
            top-1/4
            left-10
            h-[500px]
            w-[500px]
            rounded-full

            bg-[#5F6E1D]/5
            dark:bg-[#798321]/15

            blur-[130px]
          "
        />

        <div
          className="
            absolute
            bottom-1/4
            right-10
            h-[450px]
            w-[450px]
            rounded-full

            bg-[#FFE082]/30
            dark:bg-[#FFC107]/10

            blur-[110px]
          "
        />

      </div>

      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-[0.03]

          bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]
          bg-[size:32px_32px]
        "
        style={{
          maskImage:
            "radial-gradient(circle at center, black 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 70%, transparent 100%)",
        }}
      />

      <div
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-7xl
          items-center
          gap-10
          sm:gap-12
          lg:gap-16
          px-4
          sm:px-6
          lg:px-6

          lg:grid-cols-2
        "
      >

        {/* Left Content */}

        <div>

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[5px]

              text-[#FFC107]
            "
          >
            OUR STORY
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-black
              tracking-tight

              text-[#798321]
              dark:text-white
            "
          >
            Bridging Academic Knowledge and Industry Excellence
          </h2>

          <p
            className="
              mt-6
              text-[15px]
              leading-8
              font-medium

              text-[#374151]
              dark:text-gray-300
            "
          >
            RAKVIH Foundation was built to solve one specific problem: the gap between what students learn in a classroom and what employers actually expect on day one.
          </p>

          <p
            className="
              mt-6
              text-[15px]
              leading-8
              font-medium

              text-[#6B7280]
              dark:text-gray-400
            "
          >
            We close that gap with structured internships, live industry projects, one-on-one mentorship, recognised certifications, and dedicated placement support delivered through a transparent, six-step onboarding journey with a 98% success rate among enrolled students.
          </p>

          {/* Button */}

          <Link
            href="/programs"
            className="
              mt-10
              inline-flex
              items-center
              gap-3

              rounded-xl

              bg-[#798321]
              dark:bg-[#FFC107]

              px-8
              py-4

              text-sm
              font-semibold

              text-white
              dark:text-black

              shadow-[0_4px_14px_rgba(121,131,33,0.25)]

              transition-all
              duration-300

              hover:scale-105
              hover:bg-[#FFC107]
              hover:text-[#798321]

              dark:hover:bg-[#FFD54F]
              dark:hover:text-black
            "
          >
            Explore Programs

            <ArrowRight size={18} aria-hidden="true" />
          </Link>

        </div>

        {/* Right Cards */}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* ================= Mission Card ================= */}

          <div
            className="
              group
              rounded-[22px]

              border
              border-[#798321]/20
              dark:border-neutral-800

              bg-white
              dark:bg-[#0a0a0a]

              p-7

              shadow-[0_4px_20px_rgba(95,110,29,0.04)]

              transition-all
              duration-300

              hover:-translate-y-2
              hover:border-[#798321]
              dark:hover:border-[#FFC107]

              hover:shadow-[0_10px_25px_rgba(121,131,33,0.15)]
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-[#FFC107]
                dark:bg-[#171717]

                text-[#798321]
                dark:text-[#FFC107]

                transition-all
                duration-300

                group-hover:bg-[#798321]
                group-hover:text-white

                dark:group-hover:bg-[#FFC107]
                dark:group-hover:text-black
              "
            >
              <Target size={28} aria-hidden="true" />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-bold

                text-[#5F6E1D]
                dark:text-white
              "
            >
              Our Mission
            </h3>

            <p
              className="
                mt-3
                text-[14px]
                leading-7
                font-medium

                text-[#374151]
                dark:text-gray-300
              "
            >
              To empower students with industry-relevant skills, hands-on internships, and genuine career opportunities not just theoretical coursework.
            </p>

          </div>

          {/* ================= Vision Card ================= */}

          <div
            className="
              group
              rounded-[22px]

              border
              border-[#798321]/20
              dark:border-neutral-800

              bg-white
              dark:bg-[#0a0a0a]

              p-7

              shadow-[0_4px_20px_rgba(95,110,29,0.04)]

              transition-all
              duration-300

              hover:-translate-y-2
              hover:border-[#798321]
              dark:hover:border-[#FFC107]

              hover:shadow-[0_10px_25px_rgba(121,131,33,0.15)]
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-[#FFC107]
                dark:bg-[#171717]

                text-[#798321]
                dark:text-[#FFC107]

                transition-all
                duration-300

                group-hover:bg-[#798321]
                group-hover:text-white

                dark:group-hover:bg-[#FFC107]
                dark:group-hover:text-black
              "
            >
              <Globe size={28} aria-hidden="true" />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-bold

                text-[#5F6E1D]
                dark:text-white
              "
            >
              Our Vision
            </h3>

            <p
              className="
                mt-3
                text-[14px]
                leading-7
                font-medium

                text-[#374151]
                dark:text-gray-300
              "
            >
              To become India's leading internship platform, producing future-ready professionals equipped for the jobs companies are hiring for today.
            </p>

          </div>
          {/* ================= Why RAKVIH Card ================= */}

          <div
            className="
              group
              rounded-[22px]

              border
              border-[#798321]/20
              dark:border-neutral-800

              bg-white
              dark:bg-[#0a0a0a]

              p-7

              shadow-[0_4px_20px_rgba(95,110,29,0.04)]

              transition-all
              duration-300

              hover:-translate-y-2
              hover:border-[#798321]
              dark:hover:border-[#FFC107]

              hover:shadow-[0_10px_25px_rgba(121,131,33,0.15)]
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-[#FFC107]
                dark:bg-[#171717]

                text-[#798321]
                dark:text-[#FFC107]

                transition-all
                duration-300

                group-hover:bg-[#798321]
                group-hover:text-white

                dark:group-hover:bg-[#FFC107]
                dark:group-hover:text-black
              "
            >
              <Star size={28} aria-hidden="true" />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-bold

                text-[#5F6E1D]
                dark:text-white
              "
            >
              Why Students Choose RAKVIH
            </h3>

            <p
              className="
                mt-3
                text-[14px]
                leading-7
                font-medium

                text-[#374151]
                dark:text-gray-300
              "
            >
              Live projects instead of static tutorials, experienced industry mentors instead of pre-recorded lectures, verified certifications, and placement assistance.
            </p>

          </div>

          {/* ================= Values Card ================= */}

          <div
            className="
              group
              rounded-[22px]

              border
              border-[#798321]/20
              dark:border-neutral-800

              bg-white
              dark:bg-[#0a0a0a]

              p-7

              shadow-[0_4px_20px_rgba(95,110,29,0.04)]

              transition-all
              duration-300

              hover:-translate-y-2
              hover:border-[#798321]
              dark:hover:border-[#FFC107]

              hover:shadow-[0_10px_25px_rgba(121,131,33,0.15)]
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-xl

                bg-[#FFC107]
                dark:bg-[#171717]

                text-[#798321]
                dark:text-[#FFC107]

                transition-all
                duration-300

                group-hover:bg-[#798321]
                group-hover:text-white

                dark:group-hover:bg-[#FFC107]
                dark:group-hover:text-black
              "
            >
              <Heart size={28} aria-hidden="true" />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-bold

                text-[#5F6E1D]
                dark:text-white
              "
            >
              Our Values
            </h3>

            <p
              className="
                mt-3
                text-[14px]
                leading-7
                font-medium

                text-[#374151]
                dark:text-gray-300
              "
            >
              Integrity, innovation, excellence, and a student-first approach guide every program we design and every mentor we onboard.
            </p>

          </div>
        </div>

      </div>

    </section>
  );
}