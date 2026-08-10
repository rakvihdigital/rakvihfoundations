"use client";

import { FileText } from "lucide-react";

export default function EmptyAssignments() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9DFC8] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF6D8] dark:bg-neutral-900">
        <FileText
          size={40}
          className="text-[#6B7328] dark:text-[#FFC107]"
        />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-[#24310F] dark:text-white">
        No Assignments Available
      </h2>

      <p className="mt-2 max-w-md text-center text-sm text-gray-500 dark:text-neutral-400">
        Assignments haven't been uploaded for this course yet.
        Please check back later.
      </p>
    </div>
  );
}