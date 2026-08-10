"use client";

import { useReports } from "@/hooks/useReports";
import {
  Users,
  BookOpen,
  IndianRupee,
  CheckCircle,
} from "lucide-react";

interface Props {
  filter: string;
}

export default function ReportStats({ filter }: Props) {
  const { data: stats, isLoading } = useReports(filter);

  if (isLoading || !stats) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color:
        "bg-[#F0F4E8] text-[#6B7328] dark:bg-[#0F172A] dark:text-[#6B7328]",
    },
    {
      title: "Programs",
      value: stats.totalPrograms,
      icon: BookOpen,
      color:
        "bg-[#F0F4E8] text-[#6B7328] dark:bg-[#0F172A] dark:text-[#6B7328]",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: IndianRupee,
      color:
        "bg-[#F0F4E8] text-[#6B7328] dark:bg-[#0F172A] dark:text-[#6B7328]",
    },
    {
      title: "Completed Payments",
      value: stats.completedPayments,
      icon: CheckCircle,
      color:
        "bg-[#F0F4E8] text-[#6B7328] dark:bg-[#0F172A] dark:text-[#6B7328]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white dark:bg-[#08111F] rounded-xl shadow border border-gray-100 dark:border-blue-900/30 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                <h2 className="text-lg font-semibold mt-1 text-gray-700 dark:text-white">
                  {item.value}
                </h2>

                <div className="mt-3 h-[2px] w-full bg-gray-100 dark:bg-[#16233A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6B7328] via-yellow-500 to-yellow-400 rounded-full"
                    style={{
                      animation: `growLine 1.5s ease-out ${index * 80}ms forwards`,
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <div className={`p-2.5 rounded-xl ${item.color} flex-shrink-0`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}