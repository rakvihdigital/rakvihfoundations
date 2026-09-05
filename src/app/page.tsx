// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import { Fraunces } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export default function GatewayPage() {
  return (
    // Swapped dark:text-slate-100 to dark:text-neutral-100 to remove blue tint from text
    <div className={`min-h-[100dvh] w-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center bg-[#F8FAF0] text-slate-900 dark:bg-black dark:text-neutral-100 ${display.variable}`}>

      {/* HERO SECTION */}
      <section className="relative shrink-0 py-4 sm:py-8 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#798321]/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] h-[200px] w-[200px] sm:h-[400px] sm:w-[400px] rounded-full bg-[#FFC107]/10 blur-[80px]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* LOGO */}
            <div className="mb-3 relative h-32 w-80 sm:h-44 sm:w-[26rem] drop-shadow-sm">
              <Image
                src="/logosqunobg.png"
                alt="RAKVIH Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 style={{ fontFamily: "var(--font-display)" }} className="mt-1 text-4xl font-medium tracking-tight text-[#24310F] dark:text-white sm:mt-2 sm:text-6xl lg:text-7xl">
              <span className="text-[#FFC107] dark:text-[#FFD54F]">Welcome to</span> RAKVIH
            </h1>

            {/* Swapped dark text to neutral */}
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-neutral-400 sm:mt-3 sm:text-lg">
              <span className="font-semibold text-[#798321] dark:text-[#FFC107]">RAKVIH Education</span> empowers careers through industry-leading internships and tuition support — while the{" "}
              <span className="font-semibold text-[#8a6d00] dark:text-[#FFC107]">RAKVIH Foundation</span> changes lives through food for special occasions, food drives, and plantation drives for communities in need. Choose your path below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="shrink-0 z-40 bg-transparent"
      >
        <div className="mx-auto flex max-w-5xl flex-col justify-center gap-3 px-4 py-1 sm:flex-row sm:gap-8 sm:px-6 sm:py-2">
          <TabLink
            href="/home"
            icon={<Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />}
            label="RAKVIH Education"
            sublabel="Internships & Tuitions"
          />
          <TabLink
            href="/foundation"
            icon={<HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6" />}
            label="RAKVIH Foundation"
            sublabel="Food, Drives & Community Aid"
          />
        </div>
      </motion.div>

    </div>
  );
}

function TabLink({
  href,
  icon,
  label,
  sublabel,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}) {
  return (
    <Link
      href={href}
      className="
        group relative flex items-center gap-3
        rounded-2xl px-6 py-4 sm:px-8 sm:py-5
        text-slate-600 dark:text-neutral-300
        bg-white dark:bg-[#111111] 
        shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10
        transition-all
        hover:-translate-y-0.5 hover:shadow-lg hover:ring-[#798321]/30 dark:hover:ring-[#FFC107]/30
      "
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#798321]/10 text-[#798321] transition-colors group-hover:bg-[#798321] group-hover:text-white dark:bg-[#FFC107]/10 dark:text-[#FFC107] dark:group-hover:bg-[#FFC107] dark:group-hover:text-[#1C2410]">
        {icon}
      </span>

      <span className="flex flex-col text-left">
        <span className="text-sm font-bold sm:text-lg text-slate-800 transition-colors group-hover:text-[#798321] dark:text-white dark:group-hover:text-[#FFC107]">
          {label}
        </span>
        {/* Swapped dark sublabel to neutral-500 */}
        <span className="text-[11px] font-medium text-slate-400 sm:text-xs dark:text-neutral-500">
          {sublabel}
        </span>
      </span>

      <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-slate-400 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#798321] dark:group-hover:text-[#FFC107]" />
    </Link>
  );
}