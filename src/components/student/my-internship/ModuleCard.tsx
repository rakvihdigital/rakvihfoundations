"use client";

import {
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

interface Props {
  module: any;
}

export default function ModuleCard({
  module,
}: Props) {
  const status = module.status;

  const completed = status === "Completed";
  const inProgress = status === "In Progress";

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        p-4
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:scale-[1.02]
        hover:shadow-2xl
        cursor-pointer
        ${
          completed
            ? "border-[#CFE6A4] bg-[#F8FFF2] dark:border-green-900/40 dark:bg-green-950/20"
            : inProgress
            ? "border-[#FFD86B] bg-[#FFFBEF] dark:border-yellow-900/40 dark:bg-yellow-950/20"
            : "border-[#EEF2E8] bg-white dark:border-neutral-800 dark:bg-[#0a0a0a]"
        }
      `}
    >
      {/* Top Gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6B7328] via-[#A59A2D] to-[#FFC107]" />

      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 dark:from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`
              h-10
              w-10
              rounded-xl
              flex
              items-center
              justify-center
              transition-all
              duration-500
              group-hover:scale-110
              ${
                completed
                  ? "bg-[#EEF6D8] dark:bg-green-900/30"
                  : inProgress
                  ? "bg-[#FFF4D6] dark:bg-yellow-900/30"
                  : "bg-[#F5F7F1] dark:bg-neutral-900"
              }
            `}
          >
            {completed ? (
              <CheckCircle2
                size={20}
                className="text-[#6B7328] dark:text-green-400"
              />
            ) : inProgress ? (
              <Clock3
                size={20}
                className="text-[#D89A00] dark:text-yellow-400"
              />
            ) : (
              <Circle
                size={18}
                className="text-gray-400 dark:text-neutral-500"
              />
            )}
          </div>

          <div>

            <h3 className="text-[11px] font-semibold text-[#24310F] dark:text-white">
              {module.module_name}
            </h3>

            <p className="mt-0.5 text-[8px] uppercase tracking-[2px] text-gray-500 dark:text-neutral-400">
              Internship Module
            </p>

          </div>

        </div>

        <span
          className={`
            rounded-full
            px-2.5
            py-1
            text-[8px]
            font-semibold
            transition-all
            duration-300
            group-hover:scale-105
            ${
              completed
                ? "bg-[#EEF6D8] text-[#6B7328] dark:bg-green-900/30 dark:text-green-400"
                : inProgress
                ? "bg-[#FFF4D6] text-[#D89A00] dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-gray-100 text-gray-600 dark:bg-neutral-900 dark:text-neutral-300"
            }
          `}
        >
          {status}
        </span>

      </div>
    </div>
  );
}