"use client";

import Link from "next/link";
import {
  Clock3,
  Users,
  Award,
  BookOpen,
  CheckCircle,
} from "lucide-react";

interface Props {
  course: any;
}

export default function PriceCard({ course }: Props) {
  return (
    <div className="sticky top-24">

      {/* ================= Price Card ================= */}

      <div
        className="
          overflow-hidden
          rounded-3xl

          border
          border-[#798321]/20
          dark:border-gray-700

          bg-white
          dark:bg-[#111827]

          shadow-[0_20px_50px_rgba(95,110,29,0.08)]

          transition-all
          duration-500
        "
      >

        {/* ================= Header ================= */}

        <div
          className="
            bg-[#798321]
            dark:bg-[#1E293B]

            p-6

            text-white

            border-b
            border-[#798321]/20
            dark:border-gray-700
          "
        >

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[3px]

              text-[#FFC107]
            "
          >
            Internship Program
          </p>

          <h2
            className="
              mt-2
              text-4xl
              font-black
              tracking-tight

              text-white
            "
          >
            {course.price}
          </h2>

          <p
            className="
              mt-1
              text-xs
              font-medium

              text-white/70
            "
          >
            One-time Payment
          </p>

        </div>

        {/* ================= Body ================= */}

        <div className="p-6">

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <Clock3
                size={18}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  font-semibold

                  text-[#374151]
                  dark:text-gray-200
                "
              >
                {course.duration}
              </span>

            </div>

            <div className="flex items-center gap-3">

              <Users
                size={18}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  font-semibold

                  text-[#374151]
                  dark:text-gray-200
                "
              >
                {course.students} Students
              </span>

            </div>

            <div className="flex items-center gap-3">

              <Award
                size={18}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  font-semibold

                  text-[#374151]
                  dark:text-gray-200
                "
              >
                Internship Certificate
              </span>

            </div>

            <div className="flex items-center gap-3">

              <BookOpen
                size={18}
                className="
                  text-[#798321]
                  dark:text-[#FFC107]
                "
              />

              <span
                className="
                  text-sm
                  font-semibold

                  text-[#374151]
                  dark:text-gray-200
                "
              >
                Live Projects
              </span>

            </div>

          </div>

          {/* ================= Includes ================= */}

          <div className="mt-8">

            <h3
              className="
                mb-4

                text-sm
                font-black
                uppercase
                tracking-wider

                text-[#5F6E1D]
                dark:text-[#FFC107]
              "
            >
              This Course Includes
            </h3>

            <div className="space-y-3">

              {[
                "Live Classes",
                "Recorded Videos",
                "Assignments",
                "Real Projects",
                "Mentor Support",
                "Placement Assistance",
                "Certificate",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3"
                >

                  <CheckCircle
                    size={16}
                    className="
                      text-[#798321]
                      dark:text-[#FFC107]
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-medium

                      text-[#4B5563]
                      dark:text-gray-300
                    "
                  >
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* ================= Button ================= */}
<Link
  href={`/enrollment?program=${course.id}`}
  className="
    mt-8
    flex
    w-full
    items-center
    justify-center
    rounded-xl
    bg-[#798321]
    dark:bg-[#FFC107]
    py-4
    text-sm
    font-black
    uppercase
    tracking-[2px]
    text-[#FFC107]
    dark:text-[#0F172A]
    shadow-lg
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:bg-[#5F6E1D]
    hover:text-white
    dark:hover:bg-[#FFD54F]
    dark:hover:text-black
  "
>
  Enroll Now →
</Link>

          {/* ================= Contact ================= */}

          <p
            className="
              mt-6
              text-center

              text-xs
              font-medium

              text-[#6B7280]
              dark:text-gray-400
            "
          >
            Need Help?
          </p>

          <a
            href="tel:+918296392047"
            className="
              mt-1
              block
              text-center

              text-sm
              font-bold

              text-[#798321]
              dark:text-[#FFC107]

              hover:underline
            "
          >
            +91 82963 92047
          </a>

        </div>

      </div>

    </div>
  );
}