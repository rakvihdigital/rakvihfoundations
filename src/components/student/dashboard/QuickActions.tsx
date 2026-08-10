"use client";

import { useRouter } from "next/navigation";
import {
  PlayCircle,
  FileText,
  ClipboardList,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Videos",
      subtitle: "Watch Lessons",
      icon: PlayCircle,
      href: "/student/videos",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Materials",
      subtitle: "Study Notes",
      icon: FileText,
      href: "/student/materials",
      color: "from-[#6B7328] to-[#8A9634]",
    },
    {
      title: "Assignments",
      subtitle: "Submit Work",
      icon: ClipboardList,
      href: "/student/assignments",
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Certificate",
      subtitle: "Download",
      icon: Trophy,
      href: "/student/certificate",
      color: "from-[#A59A2D] to-[#FFC107]",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-xs font-bold text-[#24310F] dark:text-white">
          Quick Actions
        </h2>

        <p className="text-[9px] text-gray-500 dark:text-neutral-400">
          Access your internship quickly
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => router.push(item.href)}
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
                p-2.5
                text-left
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              {/* Top Border */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`}
              />

              {/* Top */}
              <div className="flex items-center justify-between">

                <div
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-gradient-to-br
                    ${item.color}
                    text-white
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  `}
                >
                  <Icon size={14} />
                </div>

                <ArrowRight
                  size={12}
                  className="text-gray-400 dark:text-neutral-500 transition-transform group-hover:translate-x-1"
                />

              </div>

              {/* Content */}
              <div className="mt-2">

                <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[9px] text-gray-500 dark:text-neutral-400">
                  {item.subtitle}
                </p>

              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
}