"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

// Brand Colors
const COLORS = {
  green: "#868F2C",
  yellow: "#FFC107",
  white: "#FFFFFF",
  black: "#000000",

  // Dark Theme
  darkBg: "#0F172A",
  darkBorder: "#334155",
  darkText: "#F8FAFC",
};

const features = [
  {
    icon: BadgeCheck,
    title: "Certificate",
    subtitle: "Verified",
  },
  {
    icon: BriefcaseBusiness,
    title: "Mentors",
    subtitle: "Industry Experts",
  },
  {
    icon: GraduationCap,
    title: "Projects",
    subtitle: "Live Experience",
  },
];

export default function HeroFeatures() {
  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full">
      {features.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
            }}
            whileHover={{
              y: -4,
              scale: 1.02,
            }}
            className="
              flex
              items-center
              gap-3
              flex-1
              rounded-[20px]
              bg-white
              dark:bg-[#0F172A]
              border-2
              px-4
              py-4
              shadow-lg
              min-h-[92px]
              transition-all
              duration-300
            "
            style={{
              borderColor: COLORS.yellow,
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{
                backgroundColor: `${COLORS.yellow}30`,
              }}
            >
              <Icon size={20} style={{ color: COLORS.green }} />
            </div>

            {/* Text */}
            <div>
              <h4 className="text-[17px] font-bold text-black dark:text-[#F8FAFC]">
                {item.title}
              </h4>

              <p
                className="mt-1 text-[13px] font-medium"
                style={{ color: COLORS.green }}
              >
                {item.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}