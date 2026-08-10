"use client";

import {
  Building2,
  GraduationCap,
  BookOpen,
  Wallet,
  Headphones,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  admins: {
    department: string;
  }[];
}

export default function DepartmentCards({ admins }: Props) {
  const counts = {
    Administration: admins.filter((a) => a.department === "Administration")
      .length,

    Internship: admins.filter((a) => a.department === "Internship").length,

    Training: admins.filter((a) => a.department === "Training").length,

    Finance: admins.filter((a) => a.department === "Finance").length,

    Support: admins.filter((a) => a.department === "Support").length,

    Certificates: admins.filter((a) => a.department === "Certificates").length,
  };

  const cards = [
    {
      title: "Administration",
      count: counts.Administration,
      icon: Building2,
    },
    {
      title: "Internship",
      count: counts.Internship,
      icon: GraduationCap,
    },
    {
      title: "Training",
      count: counts.Training,
      icon: BookOpen,
    },
    {
      title: "Finance",
      count: counts.Finance,
      icon: Wallet,
    },
    {
      title: "Support",
      count: counts.Support,
      icon: Headphones,
    },
    {
      title: "Certificates",
      count: counts.Certificates,
      icon: Award,
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                scale: 0.96,
              },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
              },
            }}
            transition={{ duration: 0.4 }}
            whileHover={{
              y: -5,
              scale: 1.03,
            }}
            className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 min-h-[92px] shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                  {card.title}
                </p>

                <motion.h2
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 15,
                  }}
                  className="mt-1 text-base font-bold text-[#6B7328]"
                >
                  {card.count}
                </motion.h2>
              </div>

              <motion.div
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                }}
                transition={{ duration: 0.25 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC107]/10"
              >
                <Icon size={16} className="text-[#6B7328]" />
              </motion.div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "88%" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="absolute bottom-3 left-3 h-[2px] rounded-full bg-gradient-to-r from-[#6B7328] via-[#8A9A3D] to-[#FFC107]"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
