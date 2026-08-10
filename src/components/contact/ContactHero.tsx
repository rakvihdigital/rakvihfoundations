"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-gradient-to-r from-[#798321] via-[#8A8F2A] to-[#FFC107]">

        {/* Decorative Glow */}
        <div aria-hidden="true" className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-yellow-200/20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold md:text-5xl"
          >
            <span className="text-[#FFD54F]">Contact</span>{" "}
            <span className="text-white">Us</span>
          </motion.h1>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-4 h-1 w-20 rounded-full bg-white"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/90 md:text-base"
          >
            Whether you have questions about internships, placement
            assistance, certifications, or career opportunities, our
            dedicated team is here to help. Reach out today and we'll
            respond as quickly as possible.
          </motion.p>
        </div>

        {/* Bottom Wave */}
        <svg
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 220"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            className="fill-white dark:fill-black"
            d="
              M0,160
              C180,110 340,90 520,130
              C720,175 900,200 1100,145
              C1260,100 1360,90 1440,120
              L1440,220
              L0,220
              Z
            "
          />
        </svg>
      </div>
    </section>
  );
}