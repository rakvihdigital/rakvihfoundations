"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    // 'dark' క్లాస్ ఉంటే డార్క్ థీమ్, లేదంటే లైట్ థీమ్ అప్లై అవుతుంది
    <section className="relative flex min-h-[620px] w-full items-center justify-center overflow-hidden bg-[#F8FBF3] dark:bg-black py-0 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-[#798321]/10 dark:bg-[#798321]/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFC107]/10 dark:bg-[#FFC107]/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-8 pt-2">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-white/5 px-4 py-1.5 shadow-sm border border-gray-100 dark:border-white/10">
              <Sparkles size={14} className="text-[#798321]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#798321]">
                Empowering Next Generation
              </span>
            </div>

            {/* టెక్స్ట్ సైజ్ తగ్గించబడింది */}
            <h1 className="mt-6 text-3xl font-black leading-tight text-[#0F172A] dark:text-white md:text-5xl">
              About <span className="text-[#798321]">RAKVIH </span>
              <span className="text-[#FFC107]">Foundation</span>
            </h1>

            {/* టెక్స్ట్ సైజ్ తగ్గించబడింది */}
            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 dark:text-gray-400">
              Building the bridge between academic knowledge and industry
              excellence through structured internship programs and mentorship.
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end lg:-translate-x-10"
          >
            <div className="relative h-[340px] w-[610px]">
              {/* ఇక్కడ Yellow (#FFC107) రంగు సెట్ చేయబడింది */}
              <div className="absolute -right-8 -bottom-8 h-full w-full rounded-[40px] bg-gradient-to-br from-[#FFE082] via-[#FFC107] to-[#F4B400] shadow-[0_25px_60px_rgba(255,193,7,0.45)]" />
              <div className="relative h-full w-full overflow-hidden rounded-[40px] border-[6px] border-white dark:border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <Image
                  src="/images/rakvi.png"
                  alt="RAKVIH"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Stats Card */}
              <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-white dark:bg-[#171717]/90 backdrop-blur-md border border-gray-100 dark:border-white/10 px-4 py-2.5 shadow-lg">
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Success Rate
                </p>

                <h3 className="mt-1 text-xl font-black text-[#798321] dark:text-[#FFC107]">
                  98%
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}