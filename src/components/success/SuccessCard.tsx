"use client";

import { Star } from "lucide-react";

interface Props {
  story: any;
}

export default function SuccessCard({ story }: Props) {
  return (
    <div
      className="
        flex
        flex-col
        min-h-[220px]
        rounded-2xl
        border
        border-[#798321]/20
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        p-4
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:border-[#798321]
        dark:hover:border-[#FFC107]
      "
    >
      {/* Rating */}
      <div className="mb-2 flex gap-1">
        {Array.from({ length: story.rating || 0 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            className="fill-[#FFC107] text-[#FFC107]"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Review */}
      <p
        className="
          flex-1
          text-[13px]
          leading-5
          text-gray-700
          dark:text-neutral-300
          line-clamp-3
        "
      >
        &quot;{story.review}&quot;
      </p>

      <hr className="my-3 border-[#798321]/10 dark:border-neutral-800" />

      {/* Footer */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {/* Profile Image */}
          {story.image ? (
            <img
              src={story.image}
              alt={story.student_name}
              className="
                h-10
                w-10
                shrink-0
                rounded-full
                object-cover
                border-2
                border-[#798321]
              "
              onError={(e) => {
                e.currentTarget.src = "/images/default-avatar.png";
              }}
            />
          ) : (
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#798321]
                text-sm
                font-bold
                text-white
              "
            >
              {story.student_name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* Student Info */}
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-bold text-[#5F6E1D] dark:text-white">
              {story.student_name}
            </h3>

            <p className="truncate text-[11px] text-gray-500 dark:text-neutral-400">
              {story.designation}
            </p>

            <p className="truncate text-[11px] font-semibold text-[#798321] dark:text-[#FFC107]">
              {story.company}
            </p>
          </div>
        </div>

        {/* Package */}
        <div className="shrink-0 text-right">
          <h3 className="text-[16px] font-bold text-[#798321] dark:text-[#FFC107]">
            {story.package}
          </h3>

          <p className="text-[11px] font-medium text-[#FFC107] dark:text-neutral-300">
            {story.course}
          </p>
        </div>
      </div>
    </div>
  );
}