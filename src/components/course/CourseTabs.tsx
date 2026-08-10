"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Overview from "./Overview";
import Syllabus from "./Syllabus";
import Projects from "./Projects";
import Reviews from "./Reviews";
import Faq from "./Faq";

interface Props {
  course: any;
}

export default function CourseTabs({ course }: Props) {
  const [tab, setTab] = useState("overview");

  const tabs = [
    "overview",
    "syllabus",
    "projects",
    "reviews",
    "faq",
  ];

  return (
    <>
      {/* ================= Premium Tabs ================= */}

      <div
        className="
          mb-10
          flex
          flex-wrap
          gap-1

          rounded-2xl

          bg-[#F8FAF1]
          dark:bg-[#1E293B]

          p-1.5

          border
          border-[#798321]/10
          dark:border-gray-700

          transition-all
          duration-500
        "
      >

        {tabs.map((item) => (

          <button
            key={item}
            onClick={() => setTab(item)}
            className={`
              relative
              rounded-xl

              px-6
              py-3

              text-sm
              font-bold
              capitalize

              transition-all
              duration-300

              ${
                tab === item
                  ? "text-[#798321] dark:text-[#FFC107]"
                  : "text-gray-600 dark:text-gray-300 hover:text-[#798321] dark:hover:text-[#FFC107]"
              }
            `}
          >

            {/* Active Background */}

            {tab === item && (

              <motion.div
                layoutId="activeTab"
                transition={{
                  type: "spring",
                  duration: 0.45,
                }}
                className="
                  absolute
                  inset-0

                  rounded-xl

                  bg-white
                  dark:bg-[#0F172A]

                  border
                  border-[#798321]/10
                  dark:border-[#FFC107]/20

                  shadow-sm
                "
              />

            )}

            <span className="relative z-10">
              {item}
            </span>

          </button>

        ))}

      </div>

      {/* ================= Tab Content ================= */}

      <motion.div
        key={tab}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
      >

        {tab === "overview" && <Overview course={course} />}

        {tab === "syllabus" && <Syllabus course={course} />}

        {tab === "projects" && <Projects course={course} />}

        {tab === "reviews" && <Reviews course={course} />}

        {tab === "faq" && <Faq course={course} />}

      </motion.div>
    </>
  );
}