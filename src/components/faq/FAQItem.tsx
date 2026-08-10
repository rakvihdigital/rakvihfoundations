"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
        overflow-hidden
        rounded-2xl
        border
        transition-all
        duration-300

        ${
          open
            ? `
              border-[#798321]
              dark:border-[#FFC107]

              bg-[#F8FAF1]
              dark:bg-[#171717]

              shadow-md
            `
            : `
              border-[#798321]/15
              dark:border-neutral-800

              bg-white
              dark:bg-[#0a0a0a]

              shadow-[0_4px_20px_rgba(95,110,29,0.02)]

              hover:border-[#798321]/40
              dark:hover:border-[#FFC107]

              hover:shadow-md
            `
        }
      `}
    >

      {/* Question */}

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >

        <h3
          className={`
            text-[15px]
            font-bold
            transition-colors
            duration-300

            ${
              open
                ? "text-[#5F6E1D] dark:text-[#FFC107]"
                : "text-[#374151] dark:text-white"
            }
          `}
        >
          {question}
        </h3>

        <ChevronDown
          size={18}
          className={`
            transition-transform
            duration-300

            ${
              open
                ? "rotate-180 text-[#798321] dark:text-[#FFC107]"
                : "text-[#798321]/60 dark:text-neutral-400"
            }
          `}
        />

      </button>

      {/* Answer */}

      {open && (

        <div
          className="
            border-t
            border-[#798321]/10
            dark:border-neutral-800

            bg-white/50
            dark:bg-[#0a0a0a]

            px-6
            py-5
          "
        >

          <p
            className="
              text-[13px]
              leading-6
              font-medium

              text-[#4B5563]
              dark:text-neutral-300
            "
          >
            {answer}
          </p>

        </div>

      )}

    </div>
  );
}