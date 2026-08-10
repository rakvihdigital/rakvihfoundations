"use client";

import { Play, Clock3 } from "lucide-react";

interface Props {
  video: {
    id: number;
    title: string;
    thumbnail: string;
    duration: string;
    module: string;
  };

  onWatch: (id: number) => void;
}

export default function VideoCard({
  video,
  onWatch,
}: Props) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-[#ECECEC]
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Thumbnail */}

      <div
        onClick={() => onWatch(video.id)}
        className="
          relative
          h-48
          cursor-pointer
          overflow-hidden
          group
          bg-gray-100
          dark:bg-[#171717]
        "
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-neutral-500">
            No Thumbnail
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[#FFC107]
              shadow-lg
              group-hover:scale-110
              transition
            "
          >
            <Play
              size={20}
              className="fill-white dark:fill-black text-white dark:text-black ml-1"
            />
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="p-4">

        <p className="text-[11px] font-semibold text-[#6B7328] dark:text-[#FFC107]">
          {video.module}
        </p>

        <h3
          className="
            mt-1
            line-clamp-2
            text-sm
            font-semibold
            text-[#24310F]
            dark:text-white
          "
        >
          {video.title}
        </h3>

        <div className="mt-3 flex items-center justify-between">

          <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-neutral-400">
            <Clock3 size={12} />
            {video.duration}
          </div>

          <button
            onClick={() => onWatch(video.id)}
            className="
              rounded-full
              bg-[#6B7328]
              dark:bg-[#FFC107]
              px-4
              py-1.5
              text-[11px]
              font-semibold
              text-white
              dark:text-black
              hover:bg-[#55611F]
              dark:hover:bg-[#E6AE00]
              transition
            "
          >
            Watch
          </button>

        </div>

      </div>
    </div>
  );
}