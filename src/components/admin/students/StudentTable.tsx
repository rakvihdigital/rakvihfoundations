"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import ViewStudentModal from "./ViewStudentModal";
import { toast } from "react-hot-toast";

import DeleteStudentModal from "./DeleteStudentModal";
const DeleteStudentModalAny = DeleteStudentModal as any;

import { Copy, Eye, Trash2, Search, Sun } from "lucide-react";

interface Student {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  college?: string;
  branch?: string;
  year?: string;
  address?: string;
  payment_status?: string;
  enrollment_status?: string;
  status: string;
  program: string;
  photo_url?: string;
  resume_url?: string;
  created_at: string;
  temp_password?: string;
  login_enabled?: boolean;
}

export default function StudentTable() {
  const { theme, setTheme } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/admin/students", { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to fetch students.");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  async function refreshStudents() {
    try {
      const res = await fetch("/api/admin/students", { cache: "no-store" });
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteStudent() {
    if (!selectedStudent) return;
    const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setOpenDelete(false);
      setSelectedStudent(null);
      refreshStudents();
    }
  }

  async function approveStudent(studentId: number) {
    try {
      const res = await fetch("/api/admin/students/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: studentId }),
      });
      const data = await res.json();
      alert(data.message);
      if (!res.ok) return;
      refreshStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.full_name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        status === "All" ? true : student.enrollment_status === status;
      return searchMatch && statusMatch;
    });
  }, [students, search, status]);

  const getStatusBadge = (status?: string) => {
    if (status === "Confirmed") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white">
          Confirmed
        </span>
      );
    }

    if (status === "Pending") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
          Pending
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
          Rejected
        </span>
      );
    }

    return null;
  };
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] shadow-xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[#F8FAF5] dark:bg-[#132238] rounded-2xl w-72" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-[#F8FAF5] dark:bg-[#132238] rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] shadow-xl overflow-hidden"
    >
      {/* Header - Gradient Style like your image */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#E8ECE5] dark:border-[#1E3A5F] bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white">
        <div>
          <h2 className="text-xl font-semibold">Student Directory</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Manage and monitor all enrolled students
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
            />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-sm placeholder:text-white/70 focus:outline-none focus:border-white text-white"
            />
          </div>

          <div className="px-5 py-2.5 bg-white text-[#6B7328] font-medium rounded-2xl text-xs shadow-sm">
            Total: {filteredStudents.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 border-b border-[#E8ECE5] dark:border-[#1E3A5F] bg-[#F8FAF5] dark:bg-[#081525]">
        <div className="flex justify-end gap-2">
          {["All", "Pending", "Confirmed", "Rejected"].map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatus(item)}
              className={`px-5 py-2 rounded-2xl font-medium text-xs transition-all ${
                status === item
                  ? "bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white shadow-lg"
                  : "bg-white dark:bg-[#132238] border border-[#E8ECE5] dark:border-[#1E3A5F] hover:border-[#6B7328]"
              }`}
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Table & Footer remain the same as before for consistency */}
      <div className="overflow-x-auto px-6 pt-2 pb-5">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-[#E8ECE5] dark:border-[#1E3A5F]">
              <th className="w-[34%] pl-8 pr-5 pt-1 pb-3 text-left text-[10px] uppercase tracking-widest text-[#6B7280] font-medium">
                Student
              </th>

              <th className="w-[18%] px-5 py-1 text-left text-[10px] uppercase tracking-widest text-[#6B7280] font-medium">
                Program
              </th>

              <th className="w-[13%] px-5 py-1 text-left text-[10px] uppercase tracking-widest text-[#6B7280] font-medium">
                Phone
              </th>

              <th className="w-[16%] px-5 py-1 text-left text-[10px] uppercase tracking-widest text-[#6B7280] font-medium whitespace-nowrap">
                Payment Status
              </th>

              <th className="w-[10%] px-5 py-1 text-left text-[10px] uppercase tracking-widest text-[#6B7280] font-medium">
                Joined
              </th>

              <th className="w-[9%] px-5 py-1 text-center text-[10px] uppercase tracking-widest text-[#6B7280] font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ y: -3, backgroundColor: "#F8FAF5" }}
                  className="group border-b border-[#E8ECE5] dark:border-[#1E3A5F] hover:bg-[#F8FAF5] dark:hover:bg-[#132238] transition-all duration-300"
                >
                  <td className="pl-4 pr-5 py-5">
                    <div className="flex items-center justify-start gap-3.5">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        className="w-9 h-9 rounded-2xl overflow-hidden border border-[#E8ECE5] dark:border-[#1E3A5F]"
                      >
                        {student.photo_url ? (
                          <img
                            src={student.photo_url}
                            alt={student.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#6B7328] to-[#FFC107] flex items-center justify-center text-white font-bold text-lg">
                            {student.full_name[0].toUpperCase()}
                          </div>
                        )}
                      </motion.div>
                      <div>
                        <p className="font-medium text-sm text-[#24310F] dark:text-white">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-[#6B7280] truncate max-w-[180px]">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 pl-4 text-left text-xs text-[#24310F] dark:text-white font-medium">
                    {student.program}
                  </td>

                  <td className="px-5 py-5 pl-2 text-left text-xs text-[#24310F] dark:text-white">
                    {student.phone}
                  </td>
                  <td className="px-5 py-5 pl-8 text-left">
                    {getStatusBadge(student.enrollment_status)}
                  </td>

                  <td className="px-5 py-5 pl-4 text-xs text-[#6B7280]">
                    {new Date(student.created_at).toLocaleDateString("en-GB")}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          try {
                            if (student.enrollment_status !== "Confirmed") {
                              toast.error(
                                "Credentials are available only after payment confirmation.",
                              );
                              return;
                            }

                            let password = student.temp_password;

                            // Generate credentials if not already generated
                            if (!password) {
                              const res = await fetch(
                                "/api/admin/students/approve",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    enrollmentId: student.id,
                                  }),
                                },
                              );

                              const data = await res.json();

                              if (!res.ok) {
                                toast.error(data.message);
                                return;
                              }

                              password = data.temporaryPassword;

                              await refreshStudents();
                            }

                            const credentials = `Email: ${student.email}
Password: ${password}`;

                            await navigator.clipboard.writeText(credentials);

                            toast.success("Credentials copied successfully!");
                          } catch (err) {
                            console.error(err);
                            toast.error("Something went wrong.");
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-[#FFF8E1] dark:bg-[#132238] text-[#6B7328] hover:bg-gradient-to-r hover:from-[#6B7328] hover:to-[#FFC107] hover:text-white flex items-center justify-center transition-all duration-300"
                      >
                        <Copy size={16} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedStudent(student);
                          setOpenView(true);
                        }}
                        className="w-8 h-8 rounded-xl bg-[#F8FAF5] dark:bg-[#132238] hover:bg-[#6B7328] hover:text-white flex items-center justify-center transition-all"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedStudent(student);
                          setOpenDelete(true);
                        }}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 flex items-center justify-center transition-all"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-[#E8ECE5] dark:border-[#1E3A5F] flex items-center justify-between bg-[#F8FAF5] dark:bg-[#081525]">
        <p className="text-xs text-[#6B7280]">
          Showing{" "}
          <span className="font-medium text-[#24310F] dark:text-white">
            {filteredStudents.length}
          </span>{" "}
          students
        </p>
        <div className="flex gap-2">
          <button className="px-5 py-2 text-xs border border-[#E8ECE5] dark:border-[#1E3A5F] rounded-2xl hover:bg-white dark:hover:bg-[#132238] transition-all">
            Previous
          </button>
          <button className="px-5 py-2 text-xs bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white rounded-2xl font-medium">
            1
          </button>
          <button className="px-5 py-2 text-xs border border-[#E8ECE5] dark:border-[#1E3A5F] rounded-2xl hover:bg-white dark:hover:bg-[#132238] transition-all">
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <ViewStudentModal
        open={openView}
        student={selectedStudent}
        onClose={() => {
          setOpenView(false);
          setSelectedStudent(null);
        }}
      />
      {selectedStudent && (
        <DeleteStudentModalAny
          open={openDelete}
          studentName={selectedStudent.full_name}
          onClose={() => {
            setOpenDelete(false);
            setSelectedStudent(null);
          }}
          onDelete={deleteStudent}
        />
      )}
    </motion.div>
  );
}
