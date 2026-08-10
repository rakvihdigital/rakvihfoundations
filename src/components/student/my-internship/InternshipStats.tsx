"use client";

import {
  BookOpen,
  ListChecks,
  PlayCircle,
  FileText,
  ClipboardList,
} from "lucide-react";

interface Props {
  modules: number;
  topics: number;
  videos: number;
  materials: number;
  assignments: number;
}

export default function InternshipStats({
  modules,
  topics,
  videos,
  materials,
  assignments,
}: Props) {
  const cards = [
    {
      label: "MODULES",
      value: modules,
      icon: BookOpen,
    },
    {
      label: "TOPICS",
      value: topics,
      icon: ListChecks,
    },
    {
      label: "VIDEOS",
      value: videos,
      icon: PlayCircle,
    },
    {
      label: "MATERIALS",
      value: materials,
      icon: FileText,
    },
    {
      label: "ASSIGNMENTS",
      value: assignments,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 mt-8">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <div
            key={i}
            className="
              group
              relative
              overflow-hidden
              rounded-xl
              border
              border-[#EEF2E8]
              dark:border-neutral-800
              bg-white
              dark:bg-[#0a0a0a]
              p-3
              transition-all
              duration-500
              hover:-translate-y-1
              hover:shadow-lg
              cursor-pointer
            "
          >
            {/* Left Accent */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#6B7328] via-[#A59A2D] to-[#FFC107]" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[6px] uppercase tracking-[2px] font-semibold text-gray-500 dark:text-neutral-400">
                  {card.label}
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#24310F] dark:text-white">
                  {card.value}
                </h2>
              </div>

              <div
                className="
                  h-8
                  w-8
                  rounded-lg
                  bg-gradient-to-br
                  from-[#6B7328]
                  to-[#FFC107]
                  flex
                  items-center
                  justify-center
                  text-white
                  dark:text-black
                  shadow-md
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-6
                "
              >
                <Icon size={12} strokeWidth={2.3} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}