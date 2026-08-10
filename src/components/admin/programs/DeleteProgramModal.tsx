import ProgramTable from "@/components/admin/programs/ProgramTable";

export default function ProgramsPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] bg-white dark:bg-[#0F172A] p-6 shadow-sm">

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#24310F] dark:text-white">
            Internship Programs
          </h1>

          <p className="max-w-2xl text-xs leading-relaxed text-[#6B7280]">
            Manage internship programs, update course content, organize learning 
            resources, and monitor program information from a single dashboard.
          </p>
        </div>

      </div>

      {/* Programs Table */}
      <ProgramTable />

    </div>
  );
}