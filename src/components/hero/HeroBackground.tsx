"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* Main Background */}

      <div
        className="
        absolute
        inset-0

        bg-gradient-to-br

        from-[#FFFFFF]
        via-[#F9FBF3]
        to-[#EEF5DD]

        dark:from-[#08111F]
        dark:via-[#0F172A]
        dark:to-[#111827]

        transition-all
        duration-500
        "
      />

      {/* Light Grid */}

      <div
        className="
        absolute
        inset-0

        opacity-[0.03]
        dark:opacity-[0.08]

        bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)]

        bg-[size:40px_40px]
        "
      />

      {/* Left Glow */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.20, 0.35, 0.20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
        absolute

        -left-52
        top-0

        w-[600px]
        h-[600px]

        rounded-full

        bg-[#FFC107]/15

        blur-[150px]
        "
      />

      {/* Right Glow */}

      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="
        absolute

        right-[-120px]
        top-[15%]

        w-[520px]
        h-[520px]

        rounded-full

        bg-[#798321]/20

        blur-[140px]
        "
      />

      {/* Bottom Glow */}

      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="
        absolute

        bottom-[-220px]
        left-1/2

        -translate-x-1/2

        w-[760px]
        h-[320px]

        rounded-full

        bg-[#FFC107]/10

        blur-[170px]
        "
      />

    </div>
  );
}