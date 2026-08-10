"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-3 bg-[#243447] border border-[#334155] rounded-full px-4 py-1.5 shadow-lg mb-6"
    >
      <div className="w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center">
        <Sparkles size={12} className="text-[#1E293B]" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-white">
        RAKVIH Foundation
      </span>
    </motion.div>
  );
}