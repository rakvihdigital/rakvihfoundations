"use client";

import {
  GraduationCap,
  BookOpen,
  School,
  Calendar,
} from "lucide-react";

interface Props {
  student: any;
  program: any;
}

export default function AcademicInformation({
  student,
  program,
}: Props) {
  const items = [
    {
      label: "Program",
      value: program?.title || "-",
      icon: GraduationCap,
    },
    {
      label: "College",
      value: student?.college || "-",
      icon: School,
    },
    {
      label: "Branch",
      value: student?.branch || "-",
      icon: BookOpen,
    },
    {
      label: "Year",
      value: student?.year || "-",
      icon: Calendar,
    },
  ];

  return (
    <div className="rounded-xl border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-4 transition-colors duration-300">

      <div className="mb-4">
        <h2 className="text-sm font-bold text-[#24310F] dark:text-white">
          Academic Information
        </h2>

        <p className="text-[10px] text-gray-500 dark:text-neutral-400">
          Course and education details
        </p>
      </div>

      <div className="space-y-3">

        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-[#EEF2E8] dark:border-neutral-800 bg-white dark:bg-[#171717]/50 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF6D8] dark:bg-neutral-900">
                <Icon size={16} className="text-[#6B7328] dark:text-[#FFC107]" />
              </div>

              <div className="flex-1">
                <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                  {item.label}
                </p>

                <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}