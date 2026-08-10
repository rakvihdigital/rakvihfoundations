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
        className="relative z-10 mx-auto max-w-xl px-6 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-0.5 mb-4 backdrop-blur-md shadow-lg">
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">
            Help & Support Center
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-xl">
          Frequently Asked <br />
          <span className="text-[#FFC107]">Questions</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm text-[12px] leading-6 font-medium text-white/80 drop-shadow-md">
          Everything you need to know about your journey with Rakvih. 
          From enrollment to landing your dream job, we've got you covered.
        </p>
      </motion.div>
    </section>
  );
}