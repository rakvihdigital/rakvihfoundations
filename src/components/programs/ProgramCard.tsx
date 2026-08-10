"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, Users, ArrowRight } from "lucide-react";

interface Program {
  id: number;
  title: string;
  category: string;
  price: number | string;
  duration: string;
  students: string;
  image: string;
  description: string;
}

export default function ProgramCard({ program }: { program: Program }) {
  console.log("Program Image:", program.image);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex h-[400px] flex-col overflow-hidden rounded-[24px] border border-[#798321]/10 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500 hover:border-[#FFC107] hover:shadow-[0_20px_40px_rgba(121,131,33,0.15)] dark:bg-[#0a0a0a] dark:border-neutral-800"
    >
      {/* Image Section (Approx 45% of card) */}
      <div className="relative h-[250px] w-full overflow-hidden rounded-t-[24px]">
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={program.image}
            alt={program.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>

        {/* Cinematic Overlay (Only appears on hover) */}
        <div
          className="
            absolute
            inset-0
            overflow-hidden
            bg-black/45
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
          "
        >
          <div
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              -translate-x-full
              group-hover:translate-x-4
              transition-all
              duration-500
              ease-out
            "
          >
            <div className="rounded-r-xl border-l-4 border-[#FFC107] bg-black/40 px-4 py-3 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white">
                {program.title}
              </h3>

              <p className="mt-1 text-[8px] uppercase tracking-[2px] text-[#FFC107]">
                Click to Explore
              </p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 rounded-full bg-[#FFC107] px-3 py-1 text-[9px] font-bold uppercase text-[#798321]">
          {program.category}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-[#798321] px-3 py-1 text-[10px] font-bold text-white shadow-lg dark:bg-[#FFC107] dark:text-black">
          ₹{Number(program.price).toLocaleString("en-IN")}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col px-4 py-3">
        <div>
          <h2 className="line-clamp-2 text-[14px] font-black leading-tight text-[#798321] dark:text-white">
            {program.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-gray-600 dark:text-neutral-400">
            {program.description}
          </p>
        </div>

        {/* Compact Info Pills */}
        <div className="mt-3 flex gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#798321]/5 dark:bg-[#171717] px-2.5 py-1.5">
            <Clock3 size={11} className="text-[#798321] dark:text-[#FFC107]" />
            <span className="text-[9px] font-bold text-gray-700 dark:text-neutral-300">{program.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-[#798321]/5 dark:bg-[#171717] px-2.5 py-1.5">
            <Users size={11} className="text-[#798321] dark:text-[#FFC107]" />
            <span className="text-[9px] font-bold text-gray-700 dark:text-neutral-300">{program.students}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/programs/${program.id}`} className="mt-4">
          <button className="relative flex h-9 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] text-[11px] font-bold text-white transition-transform active:scale-[0.98]">
            <span>View More</span>
            <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      {/* Bottom Border Animation */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#FFC107] transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
  );
}