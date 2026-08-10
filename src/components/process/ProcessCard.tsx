"use client";

import { motion } from "framer-motion";

type Props = {
  step: {
    id: string;
    icon: any;
    title: string;
    description: string;
  };
  index: number;
};

export default function ProcessCard({ step, index }: Props) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-[20px] border border-[#798321]/15 dark:border-neutral-800 bg-white/90 px-6 py-6 shadow-lg backdrop-blur-xl transition-all duration-500 hover:border-[#798321] hover:shadow-[0_20px_40px_rgba(121,131,33,0.15)] dark:bg-[#0a0a0a]"
    >
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[#798321] via-[#8C9630] to-[#FFC107] transition-all duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header: Icon & Number */}
        <div className="flex items-center justify-between mb-5">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#798321]/10 transition-all duration-500 group-hover:bg-white/20">
            <Icon className="h-7 w-7 text-[#798321] transition-all duration-500 group-hover:text-white" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFC107] text-xs font-black text-black group-hover:scale-110 transition-transform">
            {step.id}
          </div>
        </div>

        {/* Content */}
        <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#798321] group-hover:text-white transition-colors">
          Step {step.id}
        </p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-neutral-900 group-hover:text-white dark:text-white transition-colors">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-600 group-hover:text-white/90 dark:text-neutral-400 dark:group-hover:text-white transition-colors">
          {step.description}
        </p>

        {/* Bottom Progress Line */}
        <div className="mt-6 h-[2px] w-10 rounded-full bg-[#798321] transition-all duration-500 group-hover:w-full group-hover:bg-white" />
      </div>
    </motion.div>
  );
}