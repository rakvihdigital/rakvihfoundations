"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Users,
  Award,
  Star,
} from "lucide-react";

interface Props {
  course: {
    slug: string;
    title: string;
    category: string;
    image: string;
    duration: string;
    students: string;
    description: string;
    price: string;
  };
}

export default function CourseHero({ course }: Props) {
 
console.log("Course Hero Image:", course.image);

  return (
    <section
      className="
        relative
        h-auto
        min-h-[440px]
        overflow-hidden
        pt-20
        pb-10
        md:pt-16
md:pb-14
        transition-all
        duration-500

        bg-white
        dark:bg-[#0F172A]
      "
    >

      {/* Right Side Image */}

      <div className="absolute inset-0 z-0 hidden pointer-events-none lg:block">

<div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
         <Image
  src={course.image}
  alt={course.title}
  fill
  priority
  unoptimized
  className="object-cover object-top translate-y-6"
/>

          {/* Light Overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:hidden" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#EEF4DC]/20 to-transparent dark:hidden" />

          {/* Dark Overlay */}

          <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 to-transparent" />

          <div className="absolute inset-0 hidden dark:block bg-black/40" />

        </div>

      </div>

      {/* Background Glow */}

      <div className="absolute inset-0 pointer-events-none lg:w-1/2">

        <div className="absolute -top-10 left-10 h-96 w-96 rounded-full bg-[#798321]/10 blur-[100px] dark:bg-[#798321]/20" />

        <div className="absolute -bottom-10 right-10 h-80 w-80 rounded-full bg-[#FFC107]/15 blur-[90px]" />

      </div>

      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-[0.03]

          bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]
          bg-[size:28px_28px]
        "
        style={{
          maskImage:
            "radial-gradient(circle at left, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at left, black 60%, transparent 100%)",
        }}
      />

      {/* Content */}

<div className="relative z-10 mx-auto mt-10 flex h-full max-w-7xl items-center px-6">      <div className="max-w-2xl">

          {/* Back */}

          <Link
            href="/programs"
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold

              text-gray-600
              dark:text-gray-300

              transition-colors

              hover:text-[#798321]
              dark:hover:text-[#FFC107]
            "
          >
            <ArrowLeft
              size={16}
              className="
                text-[#798321]
                dark:text-[#FFC107]
              "
            />

            Back to Programs

          </Link>

          {/* Category */}

          <div
            className="
              mb-4
              inline-block
              rounded-full

              border

              border-[#798321]/20
              dark:border-[#FFC107]/20

              bg-[#798321]/10
              dark:bg-[#FFC107]/10

              px-4
              py-1

              text-xs
              font-bold

              text-[#5F6E1D]
              dark:text-[#FFC107]
            "
          >
            {course.category}
          </div>

          {/* Title */}

          <h1
            className="
              text-3xl
              md:text-5xl
              lg:text-6xl

              font-black

              tracking-tight
              leading-tight

              text-[#798321]
              dark:text-white
            "
          >
            {course.title}
          </h1>

          {/* Description */}

          <p
            className="
              mt-4
              max-w-xl

              text-sm
              md:text-base

              leading-7

              text-gray-700
              dark:text-gray-300
            "
          >
            {course.description}
          </p>

          {/* Stats */}

          <div
            className="
              mt-8
              flex
              flex-wrap

              gap-x-6
              gap-y-4
            "
          >

            {/* Duration */}

            <div
              className="
                flex
                items-center
                gap-2

                rounded-xl

                border

                border-[#798321]/10
                dark:border-gray-700

                bg-[#F8FAF1]
                dark:bg-[#1E293B]

                px-3
                py-2

                shadow-sm
              "
            >
              <Clock3
                size={16}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                  dark:text-gray-200
                "
              >
                {course.duration}
              </span>

            </div>

            {/* Students */}

            <div
              className="
                flex
                items-center
                gap-2

                rounded-xl

                border

                border-[#798321]/10
                dark:border-gray-700

                bg-[#F8FAF1]
                dark:bg-[#1E293B]

                px-3
                py-2

                shadow-sm
              "
            >
              <Users
                size={16}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                  dark:text-gray-200
                "
              >
                {course.students} Enrolled
              </span>

            </div>

            {/* Certificate */}

            <div
              className="
                flex
                items-center
                gap-2

                rounded-xl

                border

                border-[#798321]/10
                dark:border-gray-700

                bg-[#F8FAF1]
                dark:bg-[#1E293B]

                px-3
                py-2

                shadow-sm
              "
            >
              <Award
                size={16}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  text-gray-700
                  dark:text-gray-200
                "
              >
                Certificate Included
              </span>

            </div>

            {/* Rating */}

            <div
              className="
                flex
                items-center
                gap-2

                rounded-xl

                border

                border-[#798321]/10
                dark:border-gray-700

                bg-[#F8FAF1]
                dark:bg-[#1E293B]

                px-3
                py-2

                shadow-sm
              "
            >
              <Star
                size={16}
                className="fill-[#FFC107] text-[#FFC107]"
              />

              <span
                className="
                  text-sm
                  text-gray-700
                  dark:text-gray-200
                "
              >
                4.8 Rating
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}