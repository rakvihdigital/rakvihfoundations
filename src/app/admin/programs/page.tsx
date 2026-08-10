import ProgramTable from "@/components/admin/programs/ProgramTable";
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle,
} from "lucide-react";
import { headers } from "next/headers";

async function getProgramStats() {
  const host = (await headers()).get("host");
  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const res = await fetch(
    `${protocol}://${host}/api/admin/programs/stats`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      totalPrograms: 0,
      activePrograms: 0,
      totalStudents: 0,
      completedPrograms: 0,
    };
  }
  return res.json();
}

export default async function ProgramsPage() {
  const stats = await getProgramStats();

  const cards = [
    {
      title: "TOTAL PROGRAMS",
      value: stats.totalPrograms,
      icon: GraduationCap,
    },
    {
      title: "ACTIVE",
      value: stats.activePrograms,
      icon: CheckCircle,
    },
    {
      title: "ENROLLMENTS",
      value: stats.totalStudents,
      icon: Users,
    },
    {
      title: "COMPLETED",
      value: stats.completedPrograms,
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
       <h1 className="text-xl font-semibold text-[#24310F] dark:text-white tracking-tight">Programs</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage internship programs & courses
        </p>
      </div>

      {/* Super Small Animated Stat Cards */}
     {/* Super Small Animated Stat Cards */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
  {cards.map((card, index) => {
    const Icon = card.icon;

    return (
      <div
        key={index}
        className="
          rounded-3xl border p-4 transition-all hover:shadow-lg
          bg-white border-[#E8ECE5]
          dark:bg-[#0F172A] dark:border-[#1E293B]
        "
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-medium text-gray-500 dark:text-slate-400">
              {card.title}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#24310F] dark:text-white">
              {card.value}
            </h2>
          </div>

          <div
            className="
              w-8 h-8 rounded-2xl flex items-center justify-center
              bg-[#6B7328]/10
              dark:bg-[#1E3A5F]
            "
          >
            <Icon
              size={18}
              className="text-[#6B7328] dark:text-[#FACC15]"
            />
          </div>
        </div>

        {/* Progress Line */}
        <div className="mt-5 h-0.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6B7328] to-[#FFC107] animate-progress-fill"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        </div>
      </div>
    );
  })}
</div>

      {/* Program Table */}
      <ProgramTable />
    </div>
  );
}