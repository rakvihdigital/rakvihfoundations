"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Briefcase, Award, LucideIcon } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

import HeroBackground from "./HeroBackground";
import HeroFeatures from "./HeroFeatures";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const COLORS = {
  green: "#868F2C",
  yellow: "#FFC107",
  white: "#FFFFFF",
  black: "#000000",
  darkBg: "#000000",
  darkCard: "#0a0a0a",
  darkBorder: "#262626", // equivalent to neutral-800
};

export default function Hero() {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAF1_25%,#EEF4DC_60%,#F6F9EF_100%)] dark:bg-none dark:bg-black ${jakarta.className}`}
    >
      <HeroBackground />

      {/* Top Badge */}
      <div className="relative z-30 flex justify-center pt-24 sm:pt-20 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-full shadow-md bg-[#868F2C] text-white"
        >
          <Award size={18} className="text-white" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
            #1 Career Platform
          </span>
        </motion.div>
      </div>

      {/* Main Grid Container */}
      <div className="relative z-20 w-full max-w-[1350px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-8 items-center py-10 lg:py-16">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <h1 className="leading-[1.1] tracking-[-0.02em]">
            <span
              className="block font-bold text-[32px] sm:text-[40px] lg:text-[46px]"
              style={{ color: COLORS.green }}
            >
              Launch Your Career With RAKVIH
            </span>
            <span className="block mt-1 font-extrabold text-[34px] sm:text-[42px] lg:text-[50px] bg-gradient-to-r from-[#FFC107] to-[#868F2C] bg-clip-text text-transparent">
              Industry-Ready Internship Programs
            </span>
          </h1>

          <p className="mt-6 text-[15px] sm:text-[16px] leading-relaxed max-w-[540px] text-gray-600 dark:text-neutral-300">
            RAKVIH is a career platform built for students who want more than a certificate—experience that employers actually recognise. Every RAKVIH internship pairs you with an industry mentor, puts you on a live project from week one, and ends with a verified certificate plus placement support.
          </p>

          <div className="mt-8 w-full">
            <HeroFeatures />
          </div>
        </motion.div>

        {/* Right Content / Image with Floating Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex justify-center py-6 lg:py-0"
        >
          <div className="relative w-full max-w-[620px]">
            {/* Main Image Wrapper */}
            <div className="rounded-[24px] p-2 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 shadow-2xl">
              <Image
                src="/images/rakvihhh.png"
                alt="RAKVIH Foundation"
                width={750}
                height={400}
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className="w-full h-[320px] sm:h-[380px] object-cover rounded-[18px]"
              />
            </div>

            {/* Floating Card 1: Students */}
            <FloatingCard
              icon={Users}
              title="5,000+"
              subtitle="Students Enrolled"
              positionClasses="-top-6 -left-4 sm:-left-6"
              color={COLORS.green}
            />

            {/* Floating Card 2: Internships */}
            <FloatingCard
              icon={Briefcase}
              title="250+"
              subtitle="Active Internships"
              positionClasses="bottom-4 -right-4 sm:-right-6"
              color={COLORS.yellow}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FloatingCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  positionClasses: string;
  color: string;
}

function FloatingCard({
  icon: Icon,
  title,
  subtitle,
  positionClasses,
  color,
}: FloatingCardProps) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute ${positionClasses} z-30 shadow-xl px-4 py-3 flex items-center gap-3.5 rounded-2xl border-2 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md dark:border-neutral-800`}
      style={{ borderColor: color }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={22} style={{ color }} aria-hidden="true" />
      </div>

      <div>
        <h3 className="text-[17px] font-extrabold leading-tight text-gray-900 dark:text-white">
          {title}
        </h3>
        <p
          className="text-[10px] uppercase font-bold tracking-wider mt-0.5"
          style={{ color: COLORS.green }}
        >
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}