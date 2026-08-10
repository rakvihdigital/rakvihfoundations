"use client";

import { motion } from "framer-motion";
import { Quote, ArrowRight, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function FoundationSuccessPage() {
  const stories = [
    {
      name: "Rahul Verma",
      role: "Now a Junior Software Developer",
      quote: "Before joining the foundation's bootcamps, I had never even typed on a keyboard. Today, I write code for a living and support my entire family. They didn't just teach me tech; they gave me a future.",
      initials: "RV",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
    },
    {
      name: "Sneha Patil",
      role: "High School Scholar",
      quote: "The tuition support and study materials provided by RAKVIH helped me clear my board exams with distinction. I am now the first person in my village to attend university. I'm forever grateful.",
      initials: "SP",
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
    },
    {
      name: "Amit Kumar",
      role: "Digital Literacy Graduate",
      quote: "I used to travel 10 kilometers just to check my exam results at a cyber cafe. The foundation's rural computer lab completely transformed how the youth in our village learn and connect with the world.",
      initials: "AK",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
    },
    {
      name: "Priya Sharma",
      role: "UI/UX Design Intern",
      quote: "I had a passion for art but no way to afford design tools. The foundation provided me with a digital drawing tablet and mentorship. Now, I am interning at a top design agency in Bengaluru.",
      initials: "PS",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
    }
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* ================= HEADER ================= */}
        <div className="text-center md:mx-auto md:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[4px] text-[#FFC107]">
              Impact & Testimonials
            </p>
            <h1 style={{ fontFamily: "var(--font-display)" }} className="mt-4 text-4xl font-medium tracking-tight text-[#24310F] dark:text-white sm:text-5xl">
              Real lives changed by <span className="italic text-[#798321] dark:text-[#FFC107]">your support.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              Every donation and every hour volunteered translates into real, tangible change. Read the stories of the brilliant minds whose lives have been transformed.
            </p>
          </motion.div>
        </div>

        {/* ================= STORIES GRID ================= */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {stories.map((story, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-[#111827] dark:hover:border-slate-700 sm:p-10"
            >
              <div>
                <Quote className="text-[#798321]/20 transition-colors group-hover:text-[#798321]/40 dark:text-[#FFC107]/20 dark:group-hover:text-[#FFC107]/40" size={40} />
                <p className="mt-6 text-lg italic leading-relaxed text-slate-700 dark:text-slate-300">
                  "{story.quote}"
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${story.color}`}>
                  {story.initials}
                </div>
                <div>
                  <p className="font-bold text-[#24310F] dark:text-white">{story.name}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{story.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= CALL TO ACTION ================= */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#798321] to-[#5F6E1D] px-6 py-16 text-center shadow-2xl dark:from-[#FFC107] dark:to-[#D4A000] sm:px-16"
        >
          {/* Decorative background blur */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md dark:bg-[#0F172A]/20 dark:text-[#0F172A]">
              <HeartHandshake size={32} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="mt-8 text-3xl font-medium text-white dark:text-[#0F172A] sm:text-4xl">
              Help us write the next success story.
            </h2>
            <p className="mt-4 text-white/80 dark:text-[#0F172A]/80">
              Your contribution, no matter how small, can completely alter the trajectory of a child's life. Be the catalyst for change today.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link 
                href="/foundation/donate" 
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#798321] shadow-lg transition-transform hover:-translate-y-1 dark:bg-[#0F172A] dark:text-[#FFC107]"
              >
                Donate Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}