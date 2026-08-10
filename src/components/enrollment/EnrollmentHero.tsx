"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Award,
} from "lucide-react";

export default function EnrollmentHero() {
  const stats = [
    {
      number: "10K+",
      label: "Students",
      icon: GraduationCap,
    },
    {
      number: "98%",
      label: "Placement",
      icon: Briefcase,
    },
    {
      number: "120+",
      label: "Hiring Partners",
      icon: Award,
    },
  ];

  return (
    <section className="relative z-10 pt-12 pb-8">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="inline-flex items-center gap-2 rounded-full bg-[#F8FBF3] px-5 py-2 shadow-md dark:bg-[#111827]">

              <Sparkles
                size={16}
                className="text-[#FFC107]"
              />

              <span className="text-xs font-semibold tracking-[3px] uppercase text-[#798321] dark:text-[#FFC107]">
                Student Enrollment
              </span>

            </div>

            <h1 className="mt-7 text-5xl md:text-6xl font-black leading-tight">

              <span className="text-[#798321]">
                Build Your
              </span>

              <br />

              <span className="text-[#FFC107]">
                Future Career
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-8 text-slate-600 dark:text-slate-300">

              Join Rakvih Solutions and gain real-world
              experience through internships, live
              projects, certifications, and placement
              assistance.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <button
                className="
                rounded-full
                bg-gradient-to-r
                from-[#798321]
                to-[#FFC107]
                px-8
                py-4
                text-sm
                font-bold
                text-white
                shadow-xl
                transition
                hover:scale-105
                "
              >
                Start Enrollment
              </button>

              <button
                className="
                rounded-full
                border
                border-[#798321]
                px-8
                py-4
                text-sm
                font-semibold
                text-[#798321]
                transition
                hover:bg-[#798321]
                hover:text-white
                dark:text-white
                dark:border-white
                "
              >
                Learn More
              </button>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            className="relative"
          >

            {/* Main Card */}

            <div
              className="
              rounded-[35px]
              bg-white
              p-8
              shadow-[0_25px_80px_rgba(121,131,33,.15)]
              dark:bg-[#111827]
              "
            >

              <img
                src="/images/enrollment-hero.png"
                alt=""
                className="mx-auto h-[320px] object-contain"
              />

            </div>

            {/* Floating Card */}

            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="
              absolute
              -left-8
              bottom-10
              rounded-3xl
              bg-white
              px-6
              py-5
              shadow-xl
              dark:bg-[#111827]
              "
            >

              <p className="text-xs uppercase tracking-[3px] text-[#FFC107]">
                Live Projects
              </p>

              <h3 className="mt-2 text-xl font-black text-[#798321] dark:text-white">
                Internship Ready
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Learn • Build • Get Placed
              </p>

            </motion.div>

          </motion.div>

        </div>

        {/* STATS */}

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {stats.map((item) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={item.label}
                whileHover={{
                  y: -8,
                }}
                className="
                rounded-[30px]
                bg-white
                p-8
                shadow-xl
                dark:bg-[#111827]
                "
              >

                <div
                  className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F8FBF3]
                  "
                >

                  <Icon
                    className="text-[#798321]"
                  />

                </div>

                <h2 className="mt-6 text-4xl font-black text-[#798321]">

                  {item.number}

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                  {item.label}

                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}