"use client";

import { motion } from "framer-motion";
import ProcessCard from "./ProcessCard";
import { processSteps } from "./processData";

export default function ProcessSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 transition-all duration-500 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAF1_35%,#EEF4DC_100%)] dark:bg-none dark:bg-black">
      
      {/* Background Glows & Dots */}
      <div className="absolute -left-36 top-0 h-[420px] w-[420px] rounded-full bg-[#798321]/10 blur-[150px] dark:bg-[#798321]/20" />
      <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFC107]/10 blur-[150px] dark:bg-[#FFC107]/15" />
      <div className="absolute left-10 top-24 h-2 w-2 rounded-full bg-[#FFC107]" />
      <div className="absolute right-20 top-48 h-3 w-3 rounded-full bg-[#798321]/40 dark:bg-[#FFC107]/40" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-6">

        {/* Heading Section - Scaled Down */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[4px] text-[#FFC107]">
            SIMPLE PROCESS
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#798321] md:text-4xl dark:text-white">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-gray-600 dark:text-neutral-300">
            Complete your registration in a few simple steps and begin your internship journey with live projects, expert mentorship, and placement assistance.
          </p>
          <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-[#798321] via-[#FFC107] to-[#798321]" />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex justify-center"
            >
              {/* Connector Line */}
              {index % 3 !== 2 && index !== processSteps.length - 1 && (
                <div className="absolute top-1/2 left-[67%] hidden xl:block h-[4px] w-[68%] rounded-full bg-gradient-to-r from-[#798321] via-[#A8B545] to-[#FFC107] opacity-25" />
              )}

              <div className="relative z-10 w-full max-w-[360px]">
                <ProcessCard step={step} index={index} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}