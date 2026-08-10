"use client";

import Image from "next/image";
import AddProgramModal from "./AddProgramModal";
import ViewProgramModal from "./ViewProgramModal";
import EditProgramModal from "./EditProgramModal";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Search, Eye, Pencil, Trash2, Clock3 } from "lucide-react";

interface Program {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  students: string;
  enrollmentCount: number; // <-- Add this
  image: string;
  description: string;
  status: string;
}

export default function ProgramTable() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  async function loadPrograms() {
    try {
      const res = await fetch("/api/admin/programs", { cache: "no-store" });
      const data = await res.json();
      setPrograms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadFullProgram(programId: number) {
    try {
      const res = await fetch(`/api/admin/programs/${programId}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSelectedProgram(data);
      setOpenView(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()),
    );
  }, [programs, search]);

  async function deleteProgram(id: number) {
    if (!window.confirm("Delete this program?")) return;
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Deleted successfully");
        loadPrograms();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const res = await fetch("/api/admin/programs/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setPrograms((prev) =>
        prev.map((program) =>
          program.id === id ? { ...program, status: newStatus } : program,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] p-6">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gradient-to-r from-[#6B7328]/20 to-[#FFC107]/20 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] shadow-xl overflow-hidden">
        {/* Premium Header with Student Directory Style Colors */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white">
          <div>
            <h2 className="text-lg font-bold">Program Directory</h2>
            <p className="text-xs opacity-90">Manage all programs</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-2xl bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/30">
              {filteredPrograms.length} Total
            </span>
         <button
  onClick={() => setOpenAdd(true)}
  className="
    flex items-center gap-2
    bg-white hover:bg-white/90
    dark:bg-[#142B4D] dark:hover:bg-[#1A365D]
    dark:border dark:border-[#3E6A99]
    text-[#6B7328] dark:text-[#FACC15]
    text-sm font-semibold
    px-5 py-2.5
    rounded-2xl
    transition-all active:scale-95
    dark:bg-[#1A365D]
dark:hover:bg-[#234A73]
  "
>
  <Plus size={18} />
  Add New
</button>
          </div>
        </div>

        <div className="p-5">
          {/* Search */}
          <div className="relative w-full lg:w-72 mb-5">
            <Search
              size={16}
              className="absolute left-4 top-3.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F2937] pl-10 py-2.5 text-xs focus:ring-2 focus:ring-[#6B7328]"
            />
          </div>

          {/* Compact Table - Super Small Text + Animations */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F8FAF5] dark:bg-[#1F2937]">
                  <th className="text-left px-4 py-3 text-[9px] uppercase tracking-widest text-gray-500 font-medium">
                    PROGRAM
                  </th>
                  <th className="text-[9px] uppercase tracking-widest text-gray-500 text-center">
                    DURATION
                  </th>
                  <th className="text-[9px] uppercase tracking-widest text-gray-500 text-center">
                    STUDENTS
                  </th>
                  <th className="text-[9px] uppercase tracking-widest text-gray-500 text-center">
                    ENROLLMENTS
                  </th>
                  <th className="text-[9px] uppercase tracking-widest text-gray-500 text-center">
                    STATUS
                  </th>
                  <th className="text-[9px] uppercase tracking-widest text-gray-500 text-center">
                    PRICE
                  </th>
                  <th className="text-center text-[9px] uppercase tracking-widest text-gray-500">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPrograms.map((program, index) => (
                  <tr
                    key={program.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-[#F9FAF3] dark:hover:bg-[#1F2937] group transition-all duration-200"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            program.image || "/images/program-placeholder.png"
                          }
                          alt={program.title}
                          width={42}
                          height={42}
                          unoptimized
                          className="w-10 h-10 rounded-xl object-cover border group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-[#6B7328] truncate">
                            {program.title}
                          </h3>
                          <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                            {program.description}
                          </p>
                          <span className="text-[9px] mt-1 inline-block px-2 py-0.5 bg-[#6B7328]/10 text-[#6B7328] rounded-full">
                            {program.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">
                      {program.duration}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="text-[10px] font-medium bg-blue-50 px-3 py-0.5 rounded-full text-blue-700">
                        {program.students}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">
                        {program.enrollmentCount}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(program.id, program.status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all hover:scale-105 ${
                          program.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {program.status}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-[#6B7328]">
                        ₹{program.price}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => loadFullProgram(program.id)}
                          className="h-7 w-7 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-xl transition hover:scale-110 active:scale-95"
                        >
                          <Eye size={15} className="text-blue-700" />
                        </button>
                        <button
                          onClick={() => {
                            setEditProgram(program);
                            setOpenEdit(true);
                          }}
                          className="h-7 w-7 flex items-center justify-center bg-amber-100 hover:bg-amber-200 rounded-xl transition hover:scale-110 active:scale-95"
                        >
                          <Pencil size={15} className="text-amber-700" />
                        </button>
                        <button
                          onClick={() => deleteProgram(program.id)}
                          className="h-7 w-7 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-xl transition hover:scale-110 active:scale-95"
                        >
                          <Trash2 size={15} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPrograms.length === 0 && (
              <div className="py-12 text-center">
                <Clock3 size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs">No programs found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 flex justify-between items-center text-xs text-gray-500 border-t pt-4">
            <p>
              Showing{" "}
              <span className="font-semibold text-[#6B7328]">
                {filteredPrograms.length}
              </span>{" "}
              programs
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-xl hover:bg-gray-100 text-xs">
                Prev
              </button>
              <button className="px-4 py-2 bg-[#6B7328] hover:bg-[#5A6320] text-white rounded-xl text-xs">
                1
              </button>
              <button className="px-4 py-2 border rounded-xl hover:bg-gray-100 text-xs">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddProgramModal
        open={openAdd}
        onCloseAction={() => setOpenAdd(false)}
        onSuccessAction={loadPrograms}
      />
      <ViewProgramModal
        open={openView}
        program={selectedProgram}
        onCloseAction={() => {
          setOpenView(false);
          setSelectedProgram(null);
        }}
      />
      <EditProgramModal
        open={openEdit}
        program={editProgram}
        onCloseAction={() => {
          setOpenEdit(false);
          setEditProgram(null);
        }}
        onSuccessAction={loadPrograms}
      />
    </>
  );
}
