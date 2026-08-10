"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  "Industry-Led Mentorship",
  "Real-world Capstone Projects",
  "Global Network Access",
  "Career Guidance",
  "Placement Support",
];

const stats = [
  { number: "98%", label: "Placement Rate" },
  { number: "10K+", label: "Students" },
  { number: "500+", label: "Hiring Partners" },
];
const handleExploreStories = () => {
  const section = document.getElementById("success-cards");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export default function SuccessStoriesSection() {
  return (
    <section className="relative overflow-hidden py-20 bg-[#FDFDFB] dark:bg-black transition-colors duration-500">
      {/* Background Blurs */}
      <div aria-hidden="true" className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-[#FFC107]/20 blur-[160px]" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-[#798321]/20 blur-[170px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#798321]/10 px-4 py-1 text-[9px] uppercase tracking-[0.25em] font-bold text-[#798321]">
            THE RAKVIH STANDARD
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-black text-[#FFC107] dark:text-white">
            Proof in Every <span className="text-[#798321]">Success</span>
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-xs md:text-sm text-slate-600 dark:text-neutral-400">
            Every success story reflects our commitment to quality learning,
            industry exposure, and career transformation.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 items-center">
          
          {/* Image Section with Green & Yellow Border Effect */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-[30px] overflow-hidden shadow-2xl border-[6px] border-[#798321] ring-4 ring-[#FFC107]/30 p-1.5"
          >
            <div className="relative w-full h-full rounded-[24px] overflow-hidden">
              <Image
                src="/images/im5.jpg"
                alt="Success Story"
                fill
                quality={100}
                className="object-cover"
                style={{ objectPosition: "center 25%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            {/* Bottom Glass Card */}
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
              <div className="grid grid-cols-3 gap-2">
                {stats.map((item) => (
                  <div key={item.label} className="text-center">
                    <h3 className="text-xl font-black text-[#FFC107]">{item.number}</h3>
                    <p className="text-[8px] uppercase tracking-[0.1em] text-white mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
         <motion.div
  initial={{ opacity: 0, x: 40 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="
    relative
    rounded-[24px]
    border
    border-[#798321]/20
    bg-white/95
    p-8
    shadow-xl

    dark:border-neutral-800
    dark:bg-[#0a0a0a]
  "
>
  {/* Heading */}
  <div className="mb-8">
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl font-bold text-[#798321] dark:text-[#FFC107]"
    >
      "Rakvih transformed my career."
    </motion.h3>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-2 text-xs text-slate-600 dark:text-neutral-400"
    >
      Learn from industry experts and start your journey with confidence.
    </motion.p>
  </div>

  {/* Features */}
  <div className="space-y-3">
    {features.map((item, index) => (
      <motion.div
        key={item}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="
          flex
          cursor-pointer
          items-center
          gap-3
          rounded-xl
          border
          border-[#798321]/10
          bg-[#798321]/5
          px-4
          py-3
          transition-all
          duration-300

          hover:border-[#FFC107]
          hover:bg-[#FFC107]/10

          dark:border-neutral-800
          dark:bg-[#171717]
          dark:hover:border-[#FFC107]
          dark:hover:bg-[#FFC107]/10
        "
      >
        <div
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-[#798321]/20
            text-[#798321]
            text-[10px]

            dark:bg-[#FFC107]/20
            dark:text-[#FFC107]
          "
        >
          ✓
        </div>

        <p className="text-xs font-semibold text-[#798321] dark:text-white">
          {item}
        </p>
      </motion.div>
    ))}
  </div>

  {/* Divider */}
  <div className="my-6 h-px bg-[#798321]/10 dark:bg-neutral-800" />

  {/* Bottom */}
  <div className="flex items-center justify-between gap-4">
    <p className="text-[10px] font-bold text-[#798321] dark:text-[#FFC107]">
      Ready for your next step?
    </p>

    <motion.button
      whileHover={{
        scale: 1.05,
        backgroundColor: "#798321",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExploreStories}
      className="
        rounded-xl
        bg-[#FFC107]
        px-6
        py-2.5
        text-[11px]
        font-bold
        uppercase
        tracking-wider
        text-white
        shadow-lg
        transition-all
        duration-300

        hover:text-white

        dark:bg-[#798321]
        dark:text-black
        dark:hover:bg-[#FFC107]
        dark:hover:text-black
      "
    >
      Explore Stories →
    </motion.button>
  </div>
</motion.div>
        </div>
      </div>
    </section>
  );
}