"use client";

import { motion } from "framer-motion";
import {
  Star,
  Users,
  Clock3,
  BadgeCheck,
} from "lucide-react";

export default function CoursePreview() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="sticky top-28"
    >
      <div className="overflow-hidden rounded-[36px] bg-white shadow-[0_25px_80px_rgba(121,131,33,.15)] dark:bg-[#111827]">

        {/* Image */}

        <div className="relative h-[260px] overflow-hidden">

          <img
            src="/images/course-preview.jpg"
            alt="Course"
            className="h-full w-full object-cover"
          />

          {/* Gradient */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Popular */}

          <div className="absolute left-5 top-5 rounded-full bg-[#FFC107] px-4 py-2 text-xs font-bold text-white">

            ★ Most Popular

          </div>

          {/* Rating */}

          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">

            <Star
              size={16}
              className="fill-[#FFC107] text-[#FFC107]"
            />

            <span className="text-sm font-bold text-[#798321]">

              4.9

            </span>

          </div>

          {/* Course Name */}

          <div className="absolute bottom-6 left-6">

            <h2 className="text-3xl font-black text-white">

              AI Internship

            </h2>

            <p className="mt-2 text-sm text-white/90">

              Learn • Build • Get Placed

            </p>

          </div>

        </div>

        {/* Content */}

        <div className="p-7">

          <div className="flex items-center gap-3">

            <BadgeCheck
              className="text-[#798321]"
            />

            <p className="text-sm font-semibold text-[#798321] dark:text-white">

              Industry Certified Program

            </p>

          </div>

          <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-300">

            Master AI tools, build real-world projects,
            earn an internship certificate and receive
            placement assistance from Rakvih Solutions.

          </p>

          {/* Quick Stats */}

          <div className="mt-8 grid grid-cols-2 gap-4">

            {/* Students */}

            <div className="rounded-2xl bg-[#F8FBF3] p-5 dark:bg-[#0F172A]">

              <Users
                className="text-[#798321]"
              />

              <h3 className="mt-3 text-xl font-black text-[#798321] dark:text-white">

                5200+

              </h3>

              <p className="text-xs text-slate-500">

                Students Enrolled

              </p>

            </div>

            {/* Duration */}

            <div className="rounded-2xl bg-[#FFF8E6] p-5 dark:bg-[#0F172A]">

              <Clock3
                className="text-[#FFC107]"
              />

              <h3 className="mt-3 text-xl font-black text-[#798321] dark:text-white">

                8 Weeks

              </h3>

              <p className="text-xs text-slate-500">

                Internship Duration

              </p>

            </div>

          </div>
                    {/* More Stats */}

          <div className="mt-4 grid grid-cols-2 gap-4">

            {/* Certificate */}

            <div className="rounded-2xl bg-[#F8FBF3] p-5 dark:bg-[#0F172A]">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#798321]/10">
                📜
              </div>

              <h3 className="mt-3 text-lg font-bold text-[#798321] dark:text-white">
                Certificate
              </h3>

              <p className="text-xs text-slate-500">
                Industry Recognized
              </p>

            </div>

            {/* Placement */}

            <div className="rounded-2xl bg-[#FFF8E6] p-5 dark:bg-[#0F172A]">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFC107]/20">
                💼
              </div>

              <h3 className="mt-3 text-lg font-bold text-[#798321] dark:text-white">
                Placement
              </h3>

              <p className="text-xs text-slate-500">
                Career Support
              </p>

            </div>

          </div>

          {/* What's Included */}

          <div className="mt-8">

            <h3 className="text-lg font-bold text-[#798321] dark:text-white">
              What's Included
            </h3>

            <div className="mt-5 space-y-4">

              {[
                "Live Industry Projects",
                "Expert Mentorship",
                "Internship Certificate",
                "Placement Assistance",
                "Resume Building",
                "Mock Interviews",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3"
                >

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#798321]/10">

                    <BadgeCheck
                      size={16}
                      className="text-[#798321]"
                    />

                  </div>

                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Price Card */}

          <div className="mt-8 rounded-[30px] bg-gradient-to-r from-[#798321] via-[#8A8F2A] to-[#FFC107] p-6 text-white">

            <p className="text-xs uppercase tracking-[4px] text-white/80">
              Enrollment Fee
            </p>

            <div className="mt-2 flex items-end gap-3">

              <h2 className="text-5xl font-black">
                ₹2,999
              </h2>

              <span className="pb-2 text-sm line-through text-white/70">
                ₹4,999
              </span>

            </div>

            <p className="mt-3 text-sm text-white/90">
              Limited-time offer. Reserve your internship seat today.
            </p>

          </div>

          {/* CTA */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: .98 }}
            className="
              mt-6
              w-full
              rounded-2xl
              bg-[#798321]
              py-4
              text-base
              font-bold
              text-white
              transition
              hover:bg-[#65701B]
            "
          >
            Enroll Now →
          </motion.button>

        </div>
      </div>

      {/* Floating Card */}

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
        className="
          absolute
          -left-6
          top-16
          hidden
          rounded-3xl
          bg-white
          px-5
          py-4
          shadow-2xl
          lg:block
          dark:bg-[#111827]
        "
      >

        <p className="text-xs uppercase tracking-[3px] text-[#FFC107]">
          Success Rate
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#798321] dark:text-white">
          98%
        </h2>

        <p className="text-xs text-slate-500">
          Placement Support
        </p>

      </motion.div>

    </motion.aside>
  );
}