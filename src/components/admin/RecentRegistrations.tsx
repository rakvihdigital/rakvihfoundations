"use client";

import { useEffect, useState } from "react";

interface Student {
  id: number;
  full_name: string;
  email: string;
  program: string;
  created_at: string;
}

export default function RecentRegistrations() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    async function loadStudents() {
      const res = await fetch("/api/admin/dashboard/recent-registrations");
      const data = await res.json();
      setStudents(data);
    }

    loadStudents();
  }, []);

  return (
    <div className="bg-white dark:bg-[#081525] 
                    border border-gray-100 dark:border-blue-950 
                    rounded-2xl shadow-md p-3.5 h-full">

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">
          Recent Registrations
        </h2>
        <a
          href="/admin/students"
          className="text-xs font-semibold text-[#E7B417] hover:underline"
        >
          View All
        </a>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-slate-400 text-xs">
          No registrations found.
        </div>
      ) : (
        <div className="max-h-[220px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-blue-900/60 
                         bg-white dark:bg-[#081525] p-3 hover:border-[#E7B417] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full 
                               bg-gradient-to-br from-[#798321] to-[#E7B417] text-white font-bold text-xs flex-shrink-0">
                  {student.full_name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                    {student.full_name}
                  </h3>
                  <p className="text-[9px] text-gray-500 dark:text-slate-400 truncate">
                    {student.program}
                  </p>
                </div>
              </div>

              <span className="rounded-full px-2.5 py-0.5 text-[9px] font-medium text-white bg-gradient-to-r from-[#798321] to-[#E7B417] flex-shrink-0">
                Regd
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}