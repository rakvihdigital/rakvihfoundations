"use client";

import { motion } from "framer-motion";

export default function ProgramsHero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        py-14
        md:py-20
        transition-all
        duration-500

        bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_40%,#F8FAF1_70%,#FFFFFF_100%)]

        dark:bg-none
        dark:bg-black
      "
    >
      {/* Background Glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">

        <div
          className="
            absolute
            -top-10
            left-1/4
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#5F6E1D]/5
            dark:bg-[#798321]/15
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            -bottom-10
            right-1/4
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#FFE082]/20
            dark:bg-[#FFC107]/10
            blur-[100px]
          "
        />

      </div>

      {/* Grid */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          pointer-events-none
          select-none
          opacity-[0.03]
          dark:opacity-[0.08]

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

      {/* Bottom Line */}
      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-1/2
          h-[1px]
          w-1/2
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[#798321]/20
          to-transparent

          dark:via-[#FFC107]/20
        "
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[3px]
            text-[#FFC107]
            sm:text-xs
          "
        >
          ALL PROGRAMS
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="
            mt-3
            text-3xl
            font-[900]
            tracking-tight
            text-[#798321]
            sm:text-4xl
            md:text-5xl

            dark:text-white
          "
        >
          Explore Professional Internship Tracks Built for Today's Job Market
        </motion.h1>

        {/* Underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="
            mx-auto
            mt-4
            h-[3px]
            w-12
            rounded-full
            bg-[#798321]

            dark:bg-[#FFC107]
          "
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="
            mx-auto
            mt-5
            max-w-xl
            text-xs
            font-medium
            leading-6
            text-[#374151]
            sm:text-sm
            md:text-base

            dark:text-neutral-300
          "
        >
          Every RAKVIH program is designed around one question: what will actually get you hired? Each track below combines live projects, expert mentorship, a verified certificate, and placement assistance so you graduate with proof of real, applied skill, not just a completion badge.
        </motion.p>

      </div>
    </section>
  );
}