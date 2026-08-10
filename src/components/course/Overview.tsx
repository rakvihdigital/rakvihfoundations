"use client";

import {
  CheckCircle,
  BookOpen,
  Briefcase,
  Award,
} from "lucide-react";

interface Props {
  course: any;
}

export default function Overview({ course }: Props) {
  return (
    <div className="space-y-8">

      {/* ================= About ================= */}

      <div
        className="
          rounded-2xl
          border
          border-[#798321]/15
          dark:border-gray-700

          bg-white
          dark:bg-[#111827]

          p-6

          shadow-[0_4px_20px_rgba(95,110,29,0.04)]
          transition-all
          duration-500
        "
      >

        <h2
          className="
            text-xl
            font-black

            text-[#5F6E1D]
            dark:text-white
          "
        >
          About this Course
        </h2>

        <p
          className="
            mt-4
            whitespace-pre-line

            text-sm
            leading-7
            font-medium

            text-[#4B5563]
            dark:text-gray-300
          "
        >
          {course.details?.overview ||
            "Course overview not available."}
        </p>

      </div>

      {/* ================= What You'll Learn ================= */}

      <div
        className="
          rounded-2xl
          border
          border-[#798321]/15
          dark:border-gray-700

          bg-white
          dark:bg-[#111827]

          p-6

          shadow-[0_4px_20px_rgba(95,110,29,0.04)]
          transition-all
          duration-500
        "
      >

        <div className="flex items-center gap-2">

          <BookOpen
            size={20}
            className="
              text-[#798321]
              dark:text-[#FFC107]
            "
          />

          <h2
            className="
              text-xl
              font-black

              text-[#5F6E1D]
              dark:text-white
            "
          >
            What You'll Learn
          </h2>

        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          {course.learning?.length ? (

            course.learning.map((item: any) => (

              <div
                key={item.id}
                className="flex items-center gap-3"
              >

                <CheckCircle
                  size={18}
                  className="
                    flex-shrink-0
                    text-[#798321]
                    dark:text-[#FFC107]
                  "
                />

                <p
                  className="
                    text-sm
                    font-semibold

                    text-[#374151]
                    dark:text-gray-200
                  "
                >
                  {item.title}
                </p>

              </div>

            ))

          ) : (

            <p className="text-gray-500 dark:text-gray-400">
              No learning topics available.
            </p>

          )}

        </div>

      </div>

      {/* ================= Career ================= */}

      <div
        className="
          rounded-2xl
          border
          border-[#798321]/15
          dark:border-gray-700

          bg-white
          dark:bg-[#111827]

          p-6

          shadow-[0_4px_20px_rgba(95,110,29,0.04)]
          transition-all
          duration-500
        "
      >

        <div className="flex items-center gap-2">

          <Briefcase
            size={20}
            className="
              text-[#798321]
              dark:text-[#FFC107]
            "
          />

          <h2
            className="
              text-xl
              font-black

              text-[#5F6E1D]
              dark:text-white
            "
          >
            Career Opportunities
          </h2>

        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          {course.careers?.length ? (

            course.careers.map((item: any) => (

              <div
                key={item.id}
                className="
                  rounded-xl

                  border
                  border-[#798321]/10
                  dark:border-gray-700

                  bg-[#F8FAF1]
                  dark:bg-[#1E293B]

                  p-4

                  text-sm
                  font-bold

                  text-[#5F6E1D]
                  dark:text-[#FFC107]

                  transition-all
                  duration-300
                "
              >
                {item.title}
              </div>

            ))

          ) : (

            <p className="text-gray-500 dark:text-gray-400">
              No career opportunities available.
            </p>

          )}

        </div>

      </div>

      {/* ================= Certificate ================= */}

      <div
        className="
          rounded-2xl

          border
          border-[#FFC107]/30
          dark:border-[#FFC107]/30

          bg-[#FFFBEB]
          dark:bg-[#1E293B]

          p-6

          transition-all
          duration-500
        "
      >

        <div className="flex items-center gap-2">

          <Award
            size={22}
            className="
              text-[#B45309]
              dark:text-[#FFC107]
            "
          />

          <h2
            className="
              text-xl
              font-black

              text-[#B45309]
              dark:text-[#FFC107]
            "
          >
            Certificate
          </h2>

        </div>

        <p
          className="
            mt-4

            text-sm
            leading-7
            font-medium

            text-[#92400E]
            dark:text-gray-300
          "
        >
          {course.details?.certificate
            ? "Receive an industry-recognized internship certificate after successfully completing the course and live projects."
            : "Certificate is not available for this course."}
        </p>

      </div>

    </div>
  );
}