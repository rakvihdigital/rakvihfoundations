"use client";

import { useRouter } from "next/navigation";
import {
  PlayCircle,
  ArrowRight,
  Clock3,
  BookOpen,
} from "lucide-react";

interface Props {
  nextVideo: any;
  progress: any;
}

export default function ContinueLearning({
  nextVideo,
  progress,
}: Props) {
  const router = useRouter();

  const handleContinue = () => {
    if (!nextVideo?.id) return;

    if (nextVideo.type === "video") {
      router.push(`/student/videos/${nextVideo.id}`);
    } else if (nextVideo.type === "material") {
      router.push(`/student/materials/${nextVideo.id}`);
    } else if (nextVideo.type === "assignment") {
      router.push(`/student/assignments/${nextVideo.id}`);
    }
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-xl
        border
        border-[#EEF2E8]
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        p-4
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6B7328] via-[#A59A2D] to-[#FFC107]" />

      <div className="flex items-center justify-between gap-4">

        {/* Left */}
        <div className="flex-1 min-w-0">

          <p className="text-[9px] font-semibold uppercase tracking-[2px] text-gray-500 dark:text-neutral-500">
            Continue Learning
          </p>

          <h2 className="mt-1 truncate text-base font-semibold text-[#24310F] dark:text-white">
            {nextVideo?.title || "All Content Completed 🎉"}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">

            <div className="flex items-center gap-1 rounded-full bg-[#EEF6D8] dark:bg-neutral-900 px-2 py-1 text-[10px] font-medium text-[#6B7328] dark:text-[#FFC107]">
              <BookOpen size={10} />
              {nextVideo?.module_name || "Completed"}
            </div>

            <div className="flex items-center gap-1 rounded-full bg-[#FFF4D6] dark:bg-neutral-900 px-2 py-1 text-[10px] font-medium text-[#D89A00] dark:text-[#FFC107]">
              <Clock3 size={10} />
              {progress?.progress ?? 0}% Done
            </div>

          </div>

        </div>

        {/* Resume Button */}
        <button
          onClick={handleContinue}
          disabled={!nextVideo}
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            bg-gradient-to-r
            from-[#6B7328]
            to-[#FFC107]
            px-3
            py-2
            text-[10px]
            font-semibold
            text-white
            dark:text-black
            transition-all
            duration-300
            hover:scale-105
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <PlayCircle size={13} />

          Resume

          <ArrowRight size={11} />
        </button>

      </div>
    </div>
  );
}