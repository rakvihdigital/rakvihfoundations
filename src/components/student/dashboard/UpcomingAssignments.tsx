"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  module_name?: string;
  due_date?: string;
  status?: "Pending" | "Submitted";
}

interface Props {
  assignments: Assignment[];
}

export default function UpcomingAssignments({
  assignments,
}: Props) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#24310F] dark:text-white">
            Upcoming Assignments
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">
            Complete your pending tasks
          </p>
        </div>

        <button
          onClick={() => router.push("/student/assignments")}
          className="text-xs font-semibold text-[#6B7328] hover:text-[#FFC107] dark:text-[#FFC107] dark:hover:text-white transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#C7C7C7] dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {assignments.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle2 size={36} className="mx-auto text-[#6B7328] dark:text-[#FFC107]" />
            <p className="mt-3 text-sm font-medium text-[#24310F] dark:text-white">
              No Pending Assignments
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              You're all caught up.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="
                rounded-xl
                border
                border-[#EEF2E8]
                dark:border-neutral-800
                bg-white
                dark:bg-[#171717]
                p-3.5
                transition-all
                duration-300
                hover:shadow-md
                hover:border-[#FFC107]/40
                dark:hover:border-[#FFC107]/40
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF6D8] dark:bg-[#0a0a0a]">
                    <ClipboardList size={14} className="text-[#6B7328] dark:text-[#FFC107]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold line-clamp-1 dark:text-white">
                      {assignment.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-neutral-400">
                      {assignment.module_name || "General Assignment"}
                    </p>

                    {assignment.due_date && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500 dark:text-neutral-400">
                        <Calendar size={11} />
                        <span>{assignment.due_date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
                    assignment.status === "Submitted"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {assignment.status || "Pending"}
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    router.push(`/student/assignments/${assignment.id}`)
                  }
                  className="
                    flex items-center gap-1.5
                    rounded-lg
                    bg-gradient-to-r from-[#6B7328] to-[#FFC107]
                    px-3 py-1.5
                    text-[10px] font-semibold text-white dark:text-black
                    transition-all duration-300
                    hover:scale-105
                  "
                >
                  Open
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}