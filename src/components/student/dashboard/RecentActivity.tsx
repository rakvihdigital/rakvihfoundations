"use client";

import {
  CheckCircle2,
  PlayCircle,
  FileText,
  ClipboardCheck,
} from "lucide-react";

interface Activity {
  id: number | string;
  type: "video" | "material" | "assignment";
  title: string;
  date: string;
}

interface Props {
  activities: Activity[];
}

export default function RecentActivity({
  activities,
}: Props) {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "video":
        return (
          <PlayCircle
            size={18}
            className="text-blue-500 dark:text-blue-400"
          />
        );

      case "material":
        return (
          <FileText
            size={18}
            className="text-[#6B7328] dark:text-[#FFC107]"
          />
        );

      case "assignment":
        return (
          <ClipboardCheck
            size={18}
            className="text-orange-500 dark:text-orange-400"
          />
        );

      default:
        return (
          <CheckCircle2
            size={18}
            className="text-green-500 dark:text-green-400"
          />
        );
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#EEF2E8]
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        p-5
      "
    >
      <div className="mb-5">

        <h2 className="text-sm font-bold text-[#24310F] dark:text-white">
          Recent Activity
        </h2>

        <p className="text-[10px] text-gray-500 dark:text-neutral-400">
          Your latest internship activity
        </p>

      </div>

      <div className="space-y-4">

        {activities.length === 0 ? (
          <div className="py-8 text-center">

            <CheckCircle2
              size={40}
              className="mx-auto text-gray-300 dark:text-neutral-700"
            />

            <p className="mt-3 text-xs text-gray-500 dark:text-neutral-400">
              No recent activity found.
            </p>

          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-gray-100
                dark:border-neutral-800
                p-3
                transition-all
                duration-300
                hover:bg-gray-50
                dark:hover:bg-[#171717]
              "
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-neutral-900">
                  {getIcon(activity.type)}
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
                    {activity.title}
                  </h3>

                  <p className="text-[10px] capitalize text-gray-500 dark:text-neutral-400">
                    {activity.type}
                  </p>

                </div>

              </div>

              <span className="text-[10px] text-gray-400 dark:text-neutral-500">
                {activity.date}
              </span>

            </div>
          ))
        )}

      </div>
    </div>
  );
}