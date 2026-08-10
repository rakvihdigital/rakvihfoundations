"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  course: any;
}

export default function Syllabus({ course }: Props) {
  const [open, setOpen] = useState(0);

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

      <div className="mb-6 flex items-center gap-2">

        <BookOpen
          size={20}
          className="
            text-[#798321]
            dark:text-[#FFC107]
          "
        />

        <h2
          className="
            text-xl
            font-black

            text-[#5F6E1D]
            dark:text-white
          "
        >
          Course Syllabus
        </h2>

      </div>

      {/* Modules */}

      <div className="space-y-4">

        {course.syllabus?.map((item: any, index: number) => (

          <div
            key={item.id}
            className={`
              overflow-hidden
              rounded-2xl
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

            {/* Header */}

            <button
              onClick={() => setOpen(open === index ? -1 : index)}
              className="
                flex
                w-full
                items-center
                justify-between

                px-6
                py-4

                text-left
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[2px]

                    text-[#798321]
                    dark:text-[#FFC107]
                  "
                >
                  Module {index + 1}
                </p>

                <h3
                  className="
                    mt-1
                    text-sm
                    font-bold

                    text-[#5F6E1D]
                    dark:text-white
                  "
                >
                  {item.module_name}
                </h3>

              </div>

              <ChevronDown
                size={18}
                className={`
                  transition-all
                  duration-300

                  text-[#798321]
                  dark:text-[#FFC107]

                  ${open === index ? "rotate-180" : ""}
                `}
              />

            </button>

            {/* Content */}

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

                  <ul className="space-y-3 px-6 py-4">

                    {item.topics?.map((topic: any) => (

                      <li
                        key={topic.id}
                        className="
                          flex
                          items-center
                          gap-3

                          text-sm
                          font-medium

                          text-[#4B5563]
                          dark:text-gray-300
                        "
                      >

                        <span
                          className="
                            h-1.5
                            w-1.5
                            rounded-full

                            bg-[#798321]
                            dark:bg-[#FFC107]
                          "
                        />

                        {topic.topic}

                      </li>

                    ))}

                  </ul>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        ))}

      </div>

    </div>
  );
}