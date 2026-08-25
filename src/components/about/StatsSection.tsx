"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Award, Building2 } from "lucide-react";

const stats = [
  { icon: Users, number: "10,000+", title: "Students Trained" },
  { icon: Briefcase, number: "500+", title: "Successful Placements" },
  { icon: Building2, number: "50+", title: "Hiring Companies" },
  { icon: Award, number: "100+", title: "Industry Mentors" },
];

export default function StatsSection() {
  return (
    <section
      className="relative overflow-hidden py-16 transition-all duration-500 
                 bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF4DC_40%,#F8FAF1_70%,#FFFFFF_100%)] 
                 dark:bg-none dark:bg-black"
    >
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full 
                     bg-[#5F6E1D]/5 dark:bg-[#798321]/15 blur-[120px]"
        />
        <div
          className="absolute -bottom-20 right-1/4 h-[450px] w-[450px] rounded-full 
                     bg-[#FFE082]/25 dark:bg-[#FFC107]/10 blur-[100px]"
        />
      </div>

      {/* Decorative Grid Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03] 
                   bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)] 
                   bg-[size:32px_32px]"
        style={{
          maskImage: "radial-gradient(circle at center, black 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[4px] text-[#FFC107]">
            Our Impact So Far
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-[#798321] dark:text-white">
            Numbers We Keep Growing Every Intake
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title} // Used title instead of index for better React rendering optimization
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group rounded-[22px] border border-[#798321]/20 dark:border-neutral-800 
                           bg-white dark:bg-[#0a0a0a] p-5 text-center shadow-[0_4px_20px_rgba(95,110,29,0.04)] 
                           transition-all duration-300 hover:-translate-y-2 
                           hover:border-[#798321] dark:hover:border-[#FFC107] 
                           hover:bg-[#EEF4DC] dark:hover:bg-[#171717] 
                           hover:shadow-[0_12px_24px_rgba(121,131,33,0.12)]"
              >
                {/* Icon */}
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl 
                             bg-[#FFC107] dark:bg-[#171717] text-[#798321] dark:text-[#FFC107] 
                             transition-all duration-300 group-hover:bg-[#798321] group-hover:text-white 
                             dark:group-hover:bg-[#FFC107] dark:group-hover:text-black"
                >
                  <Icon size={24} aria-hidden="true" />
                </div>

                {/* Number (Changed from h2 to div for semantic outline) */}
                <div className="mt-4 text-2xl md:text-3xl font-black text-[#798321] dark:text-white">
                  {item.number}
                </div>

                {/* Title */}
                <p className="mt-2 text-xs font-semibold tracking-wide text-[#6B7280] dark:text-neutral-400">
                  {item.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}