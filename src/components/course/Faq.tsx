"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  course: any;
}

export default function Faq({ course }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div
      className="
        rounded-2xl

        border
        border-[#798321]/15
        dark:border-gray-700

        bg-white
        dark:bg-[#111827]

        p-6

        shadow-[0_4px_20px_rgba(95,110,29,0.04)]
        transition-all
        duration-500
      "
    >

      {/* Heading */}

      <h2
        className="
          text-xl
          font-black

          text-[#5F6E1D]
          dark:text-white
        "
      >
        Frequently Asked Questions
      </h2>

      {/* Subtitle */}

      <p
        className="
          mt-2
          text-sm
          font-medium

          text-[#6B7280]
          dark:text-gray-400
        "
      >
        Find answers to common questions about this course.
      </p>

      {/* FAQ List */}

      <div className="mt-6 space-y-4">

        {course.faqs?.map((item: any, index: number) => (

          <div
            key={item.id}
            className={`

              rounded-xl
              border
              transition-all
              duration-300

              ${
                open === index
                  ? `
                    border-[#798321]
                    bg-[#F8FAF1]

                    dark:border-[#FFC107]
                    dark:bg-[#1E293B]
                  `
                  : `
                    border-[#798321]/15
                    bg-white

                    dark:border-gray-700
                    dark:bg-[#0F172A]

                    hover:border-[#798321]/40
                    dark:hover:border-[#FFC107]/40
                  `
              }

            `}
          >

            {/* Question */}

            <button
              onClick={() =>
                setOpen(open === index ? null : index)
              }
              className="
                flex
                w-full
                items-center
                justify-between

                px-5
                py-4

                text-left
              "
            >

              <span
                className={`

                  text-sm
                  font-bold
                  transition-colors

                  ${
                    open === index
                      ? "text-[#5F6E1D] dark:text-[#FFC107]"
                      : "text-[#374151] dark:text-white"
                  }

                `}
              >
                {item.question}
              </span>

              <ChevronDown
                size={18}
                className={`

                  transition-all
                  duration-300

                  ${
                    open === index
                      ? "rotate-180 text-[#798321] dark:text-[#FFC107]"
                      : "text-[#798321]/60 dark:text-gray-400"
                  }

                `}
              />

            </button>

            {/* Answer */}

            <AnimatePresence>

              {open === index && (

                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="
                    overflow-hidden

                    border-t
                    border-[#798321]/10
                    dark:border-gray-700

                    bg-white/50
                    dark:bg-[#111827]
                  "
                >

                  <div className="px-5 py-4">

                    <p
                      className="
                        text-sm
                        leading-7
                        font-medium

                        text-[#4B5563]
                        dark:text-gray-300
                      "
                    >
                      {item.answer}
                    </p>

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        ))}

      </div>

    </div>
  );
}