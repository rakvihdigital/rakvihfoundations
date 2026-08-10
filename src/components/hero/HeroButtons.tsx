"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">

      {/* Explore */}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="
        group

        flex
        items-center
        gap-3

        rounded-full

        bg-[#798321]

        px-8
        py-3.5

        text-white
        text-[18px]
        font-semibold

        shadow-lg

        hover:bg-[#6D761E]

        transition-all
        duration-300
        "
      >
        Explore Programs

        <ArrowRight
          size={22}
          className="
          transition-all
          duration-300
          group-hover:translate-x-1
          "
        />

      </motion.button>

      {/* Watch */}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="
        group

        flex
        items-center
        gap-3

        rounded-full

        border-2
        border-[#798321]

        bg-white
        dark:bg-transparent

        px-8
        py-3.5

        text-[#798321]
        dark:text-white

        text-[18px]
        font-semibold

        hover:bg-[#798321]
        hover:text-white

        transition-all
        duration-300
        "
      >

        <PlayCircle
          size={22}
          className="
          transition-transform
          duration-300
          group-hover:scale-110
          "
        />

        Watch Video

      </motion.button>

    </div>
  );
}