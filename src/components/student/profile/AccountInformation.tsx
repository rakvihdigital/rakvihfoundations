"use client";

import {
  ShieldCheck,
  UserCheck,
  Mail,
  CalendarDays,
} from "lucide-react";

interface Props {
  student: any;
  program: any;
}

export default function AccountInformation({
  student,
}: Props) {
  return (
    <div className="rounded-xl border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-4 transition-colors duration-300">

      <div className="mb-4">
        <h2 className="text-sm font-bold text-[#24310F] dark:text-white">
          Account Information
        </h2>

        <p className="text-[10px] text-gray-500 dark:text-neutral-400">
          Login and account details
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-lg border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#171717]/50 p-4">
          <div className="flex items-center gap-2 text-[#6B7328] dark:text-[#FFC107]">
            <UserCheck size={16} />
            <span className="text-xs font-medium">
              Student ID
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold dark:text-white">
            {student?.id || "-"}
          </p>
        </div>

        <div className="rounded-lg border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#171717]/50 p-4">
          <div className="flex items-center gap-2 text-[#6B7328] dark:text-[#FFC107]">
            <Mail size={16} />
            <span className="text-xs font-medium">
              Login Email
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold break-all dark:text-white">
            {student?.email || "-"}
          </p>
        </div>

        <div className="rounded-lg border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#171717]/50 p-4">
          <div className="flex items-center gap-2 text-[#6B7328] dark:text-[#FFC107]">
            <ShieldCheck size={16} />
            <span className="text-xs font-medium">
              Account Status
            </span>
          </div>

          <span className="mt-2 inline-flex rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            Active
          </span>
        </div>

        <div className="rounded-lg border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#171717]/50 p-4">
          <div className="flex items-center gap-2 text-[#6B7328] dark:text-[#FFC107]">
            <CalendarDays size={16} />
            <span className="text-xs font-medium">
              Registered On
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold dark:text-white">
            {student?.created_at
              ? new Date(student.created_at).toLocaleDateString()
              : "-"}
          </p>
        </div>

      </div>
    </div>
  );
}