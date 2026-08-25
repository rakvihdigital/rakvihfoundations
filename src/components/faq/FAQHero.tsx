"use client";

import { motion } from "framer-motion";

export default function FAQHero() {
  return (
    <section 
      className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image shifted further down */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/im4.jpg')",
          backgroundPosition: "center 45%" 
        }}
      />
      
      {/* Green & Yellow Shadow/Overlay Effect */}
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-t to-[#FFC107]/20 dark:bg-black/40" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto max-w-2xl px-6 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-0.5 mb-4 backdrop-blur-md shadow-lg">
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">
            Internship FAQs
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-xl">
          Frequently Asked <span className="text-[#FFC107]">Questions</span>
          <span className="block mt-3 text-lg md:text-2xl font-bold text-white/90 tracking-normal">
            Everything About Your RAKVIH Journey
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-[13px] leading-6 font-medium text-white/80 drop-shadow-md">
          From enrollment to landing your first job offer, here's what students most often ask before starting a RAKVIH internship.
        </p>
      </motion.div>
    </section>
  );
}