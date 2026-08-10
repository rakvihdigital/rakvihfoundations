import StudentTable from "@/components/admin/students/StudentTable";
import { headers } from "next/headers";
import StudentStatsCards from "@/components/admin/students/StudentStatsCards";

async function getStudentStats() {
  const headersList = await headers();
  const host = headersList.get("host");


  if (!host)
    return {
      totalStudents: 0,
      confirmedStudents: 0,
      pendingStudents: 0,
      totalPrograms: 0,
    };

    

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/admin/students/stats`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok)
    return {
      totalStudents: 0,
      confirmedStudents: 0,
      pendingStudents: 0,
      totalPrograms: 0,
    };

  return res.json();
}

export default async function StudentsPage() {
  const stats = await getStudentStats();

 const cards = [
  {
    title: "Total Students",
    value: stats.totalStudents,
    icon: "users" as const,
  },
  {
    title: "Confirmed",
    value: stats.confirmedStudents,
    icon: "userCheck" as const,
  },
  {
    title: "Pending",
    value: stats.pendingStudents,
    icon: "clock" as const,
  },
  {
    title: "Programs",
    value: stats.totalPrograms,
    icon: "graduation" as const,
  },
];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#24310F] dark:text-white tracking-tight">
          Students
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          Manage and monitor all student registrations from this dashboard.
        </p>
      </div>

      {/* Statistics Cards */}
      <StudentStatsCards cards={cards} />

      {/* Student Table */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] shadow-xl overflow-hidden">
        <StudentTable />
      </div>
    </div>
  );
}