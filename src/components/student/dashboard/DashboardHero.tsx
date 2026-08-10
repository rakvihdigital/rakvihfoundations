"use client";

import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  student: any;
  program: any;
  progress: any;
  nextVideo: any;
}

export default function DashboardHero({
  student,
  program,
  progress,
  nextVideo,
}: Props) {
  const router = useRouter();

  const percent = Math.min(
    100,
    Math.max(0, Number(progress?.progress ?? 0))
  );

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-2xl
        bg-gradient-to-r
        from-[#6B7328]
        via-[#8C962E]
        to-[#FFC107]
        dark:from-[#0a0a0a]
        dark:via-[#111807]
        dark:to-[#24310F]
        border
        border-transparent
        dark:border-neutral-800
        p-4
        text-white
        shadow-lg
        dark:shadow-none
        transition-colors
        duration-300
      "
    >
      {/* Background */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/10 dark:bg-[#FFC107]/10 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-4">

        {/* Left */}
        <div className="flex-1">

          {/* Welcome */}
          <h1 className="text-lg font-semibold leading-tight dark:text-white">
            Welcome Back,
            <span className="ml-1 text-white dark:text-[#FFC107]">
              {student?.full_name || "Student"}
            </span>
          </h1>

          <p className="mt-0.5 text-[10px] text-white/90 dark:text-neutral-400">
            {program?.title || "Internship Program"}
          </p>

          {/* Progress Bar - Full Width */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-medium text-white/80 dark:text-neutral-400">
                Overall Progress
              </span>
              <span className="text-[10px] font-semibold dark:text-[#FFC107]">
                {percent}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/20 dark:bg-neutral-800">
              <div
                style={{ width: `${percent}%` }}
                className="h-full rounded-full bg-white dark:bg-[#FFC107] transition-all duration-700"
              />
            </div>
          </div>

        </div>

        {/* Right - Percentage Card (Moved slightly higher) */}
        <div className="flex flex-col items-center -mt-1">

          <div
            className="
              flex
              h-16
              w-16
              flex-col
              items-center
              justify-center
              rounded-lg
              border
              border-white/20
              dark:border-neutral-800
              bg-white/15
              dark:bg-[#171717]/50
              backdrop-blur-sm
            "
          >
            <Trophy
              size={14}
              className="text-white dark:text-[#FFC107]"
            />

            <h2 className="mt-0.5 text-sm font-bold leading-none dark:text-white">
              {percent}%
            </h2>

            <p className="text-[7px] text-white/80 dark:text-neutral-500">
              Done
            </p>
          </div>

        </div>

      </div>

      {/* Decorations */}
      <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 rounded-full border border-white/10 dark:border-neutral-800" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 rounded-full border border-white/10 dark:border-neutral-800" />

    </section>
  );
}