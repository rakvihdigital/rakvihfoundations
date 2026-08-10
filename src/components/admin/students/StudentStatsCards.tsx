"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Clock3,
  GraduationCap,
} from "lucide-react";

interface Props {
  cards: {
    title: string;
    value: number;
    icon: "users" | "userCheck" | "clock" | "graduation";
  }[];
}

const icons = {
  users: Users,
  userCheck: UserCheck,
  clock: Clock3,
  graduation: GraduationCap,
};

export default function StudentStatsCards({ cards }: Props) {
    console.log(cards);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = icons[card.icon as keyof typeof icons];

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
            }}
            whileHover={{
              y: -5,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-3xl border border-[#E8ECE5] bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 dark:border-[#1E3A5F] dark:bg-[#0F172A]"
          >
            {/* Background Glow */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FFC107]/10 blur-3xl transition-all duration-300 group-hover:bg-[#FFC107]/20" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6B7280]">
                  {card.title}
                </p>

                <h2 className="mt-1.5 text-2xl font-bold text-[#24310F] dark:text-white">
                  {card.value}
                </h2>
              </div>

              <motion.div
                whileHover={{ rotate: 12, scale: 1.2 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8FAF5] dark:bg-[#132238]"
              >
                <Icon
                  size={20}
                  className="text-[#6B7328] dark:text-[#FFC107]"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1,
                delay: index * 0.1,
              }}
              className="mt-5 h-[2px] rounded-full bg-gradient-to-r from-[#6B7328] via-[#8BA130] to-[#FFC107]"
            />
          </motion.div>
        );
      })}
    </div>
  );
}