"use client";

import {
  PlayCircle,
  ClipboardList,
  Trophy,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface Props {
  videosCompleted: number;
  totalVideos: number;

  materialsCompleted: number;
  totalMaterials: number;

  assignmentsCompleted: number;
  totalAssignments: number;

  daysRemaining: number;

  certificateUnlocked: boolean;
}

export default function DashboardStats({
  videosCompleted,
  totalVideos,

  materialsCompleted,
  totalMaterials,

  assignmentsCompleted,
  totalAssignments,

  daysRemaining,
  certificateUnlocked,
}: Props) {
  const router = useRouter();
  const cards = [
    {
      title: "Videos",
      value: `${videosCompleted}/${totalVideos}`,
      subtitle: "Watched Videos",
      icon: PlayCircle,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      href: "/student/videos",
    },
    {
      title: "Materials",
      value: `${materialsCompleted}/${totalMaterials}`,
      subtitle: "Read Materials",
      icon: BookOpen,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      href: "/student/materials",
    },
    {
      title: "Assignments",
      value: `${assignmentsCompleted}/${totalAssignments}`,
      subtitle: "Submitted",
      icon: ClipboardList,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      href: "/student/assignments",
    },
    {
      title: "Certificate",
      value: certificateUnlocked ? "Ready" : "Pending",
      subtitle: "Status",
      icon: Trophy,
      color: certificateUnlocked
        ? "text-[#6B7328] dark:text-[#FFC107]"
        : "text-purple-500 dark:text-purple-400",
      bg: certificateUnlocked
        ? "bg-[#EEF6D8] dark:bg-neutral-900"
        : "bg-purple-50 dark:bg-purple-900/20",
      href: "/student/certificate",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            onClick={() => router.push(card.href)}
            className="
              group
              cursor-pointer
              rounded-xl
              border
              border-[#EEF2E8]
              dark:border-neutral-800
              bg-white
              dark:bg-[#0a0a0a]
              p-3
              transition-all
              duration-300
              hover:shadow-md
              hover:-translate-y-0.5
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  ${card.bg}
                `}
              >
                <Icon
                  size={16}
                  className={card.color}
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[2px] text-gray-400 dark:text-neutral-500">
                  {card.title}
                </span>

                <ArrowRight
                  size={12}
                  className="text-gray-400 dark:text-neutral-500 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>

            {/* Value */}
            <h2 className="mt-3 text-[20px] font-bold text-[#24310F] dark:text-white">
              {card.value}
            </h2>

            {/* Subtitle */}
            <p className="mt-1 text-[11px] text-gray-500 dark:text-neutral-400">
              {card.subtitle}
            </p>

            {/* Progress */}
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#EEF2E8] dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6B7328] via-[#A59A2D] to-[#FFC107] dark:from-[#798321] dark:via-[#A59A2D] dark:to-[#FFC107]"
                style={{
                  width:
                    card.title === "Videos"
                      ? `${totalVideos ? (videosCompleted / totalVideos) * 100 : 0}%`
                      : card.title === "Materials"
                      ? `${totalMaterials ? (materialsCompleted / totalMaterials) * 100 : 0}%`
                      : card.title === "Assignments"
                      ? `${totalAssignments ? (assignmentsCompleted / totalAssignments) * 100 : 0}%`
                      : certificateUnlocked
                      ? "100%"
                      : "35%",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}