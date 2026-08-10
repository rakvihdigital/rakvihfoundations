"use client";

import { motion } from "framer-motion";
import {
  FileBadge,
  CheckCircle2,
  Clock3,
  CalendarDays,
} from "lucide-react";

interface Props {
  total: number;
  issued: number;
  pending: number;
  thisMonth: number;
}

export default function CertificateStats({
  total,
  issued,
  pending,
  thisMonth,
}: Props) {
  const cards = [
    {
      title: "TOTAL CERTIFICATES",
      value: total,
      icon: FileBadge,
    },
    {
      title: "ISSUED",
      value: issued,
      icon: CheckCircle2,
    },
    {
      title: "PENDING",
      value: pending,
      icon: Clock3,
    },
    {
      title: "THIS MONTH",
      value: thisMonth,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -4,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="
              group
              rounded-3xl
              bg-white
              dark:bg-[#0F172A]
              p-4
              shadow-[0_6px_20px_rgba(0,0,0,0.08)]
              hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]
              transition-all
              duration-300
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#132238] dark:text-white">
                  {card.value}
                </h2>

              </div>

              <motion.div
                whileHover={{
                  scale: 1.15,
                  rotate: 10,
                }}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F7F5EA]
                  dark:bg-slate-800
                "
              >
                <Icon
                  size={18}
                  strokeWidth={2.2}
                  className="text-[#6B7328] dark:text-[#FFC107]"
                />
              </motion.div>

            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 0.9,
                delay: index * 0.1,
              }}
              className="mt-4 h-[2px] rounded-full bg-gradient-to-r from-[#6B7328] via-[#8BA130] to-[#FFC107]"
            />

          </motion.div>
        );
      })}
    </div>
  );
}