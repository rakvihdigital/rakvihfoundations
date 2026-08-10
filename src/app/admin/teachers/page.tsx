"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  X,
  Plus,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Search,
  Pencil,
  Eye,
  EyeOff,
  Home,
  Video,
  Wallet,
  CalendarClock,
  CalendarCheck2,
  CalendarX2,
  Ban,
  Key,
} from "lucide-react";

type Teacher = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string;
  status: "active" | "inactive" | string;
  address: string | null;
  qualification: string | null;
  experience_years: number | null;
  gender: string | null;
  date_of_birth: string | null;
  teacher_type: string;
  joining_date: string | null;
  teaching_mode: string; // comma-separated: "home_tuition,in_center,online"
  assigned_count?: number; // number of student assignments
  salary_amount: number | null; // what the admin pays this teacher
  salary_frequency: "one_time" | "monthly" | "per_session" | string;
  password?: string; // added to support viewing/editing in the modal
};

type Assignment = {
  id: number;
  fee_amount: number;
  fee_frequency: "one_time" | "monthly" | "per_session" | string;
  schedule_days: string | null;
  schedule_time: string | null;
  status: "not_started" | "ongoing" | "completed" | "cancelled" | string;
  start_date: string | null;
  meeting_link: string | null;
  student_name?: string;
  class_name?: string;
  subject?: string;
  attendance?: {
    total: number;
    held: number;
    missed: number;
    cancelled: number;
    thisMonth: number;
    thisMonthHeld: number;
  };
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  subjects: "",
  address: "",
  qualification: "",
  experience_years: "",
  gender: "",
  date_of_birth: "",
  teacher_type: "part_time",
  joining_date: "",
  teaching_mode: [] as string[],
  salary_amount: "",
  salary_frequency: "monthly",
};

const typeStyles: Record<string, string> = {
  full_time: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  part_time: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  freelance: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
};

const teachingModeOptions: { value: string; label: string; icon: typeof Home }[] = [
  { value: "home_tuition", label: "Home Tuition", icon: Home },
  { value: "online", label: "Online", icon: Video },
];

const modeStyles: Record<string, string> = {
  home_tuition: "bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]",
  in_center: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  online: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-400",
};

const modeLabels: Record<string, string> = {
  home_tuition: "Home Tuition",
  in_center: "In Center",
  online: "Online",
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teachers");
      const json = await res.json();
      setTeachers(json.data || []);
    } catch (err) {
      console.error("Failed to load teachers", err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle teacher active / inactive status
  async function toggleStatus(teacher: Teacher) {
    const newStatus = teacher.status === "active" ? "inactive" : "active";
    setTogglingId(teacher.id);

    // Optimistic UI update
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacher.id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/admin/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? { ...t, status: teacher.status } : t))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on error
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacher.id ? { ...t, status: teacher.status } : t))
      );
    } finally {
      setTogglingId(null);
    }
  }

  // Calculate totals
  const totalCount = teachers.length;
  const activeCount = teachers.filter((t) => t.status === "active").length;
  const inactiveCount = teachers.filter((t) => t.status === "inactive").length;

  // Filtered teachers list
  const filteredTeachers = teachers.filter((t) => {
    const matchesStatus =
      filterStatus === "all" ? true : t.status === filterStatus;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.includes(searchTerm) ||
      t.subjects.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#24310F] dark:text-white">
            Teachers Management
          </h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
            Manage teacher profiles, subject assignments, and login access.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#798321]/20 transition-all hover:brightness-105 active:scale-95"
        >
          <Plus size={16} />
          Add Teacher
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Teachers Card */}
        <div
          onClick={() => setFilterStatus("all")}
          className={clsx(
            "cursor-pointer rounded-2xl border p-5 transition-all",
            filterStatus === "all"
              ? "border-[#798321] bg-[#798321]/5 shadow-md dark:border-[#FFC107] dark:bg-[#FFC107]/5"
              : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-[#0F1E33]"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Teachers
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#24310F] dark:text-white">
                {totalCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Active Teachers Card */}
        <div
          onClick={() => setFilterStatus("active")}
          className={clsx(
            "cursor-pointer rounded-2xl border p-5 transition-all",
            filterStatus === "active"
              ? "border-green-500 bg-green-50 shadow-md dark:border-green-500/50 dark:bg-green-950/20"
              : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-[#0F1E33]"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Active Teachers
              </p>
              <h3 className="mt-1 text-2xl font-black text-green-600 dark:text-green-400">
                {activeCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Inactive Teachers Card */}
        <div
          onClick={() => setFilterStatus("inactive")}
          className={clsx(
            "cursor-pointer rounded-2xl border p-5 transition-all",
            filterStatus === "inactive"
              ? "border-amber-500 bg-amber-50 shadow-md dark:border-amber-500/50 dark:bg-amber-950/20"
              : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-[#0F1E33]"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Inactive Teachers
              </p>
              <h3 className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
                {inactiveCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-gray-900 outline-none transition-all focus:border-[#798321] focus:ring-2 focus:ring-[#798321]/10 dark:border-white/10 dark:bg-[#0F1E33] dark:text-white"
          />
        </div>

        {/* Status Tab Filters */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-white/10 dark:bg-[#0F1E33]">
          {(["all", "active", "inactive"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all",
                filterStatus === st
                  ? "bg-white text-[#24310F] shadow-sm dark:bg-[#1E293B] dark:text-white"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E8ECE5] bg-white shadow-sm dark:border-white/10 dark:bg-[#0F1E33]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAF5] text-xs font-bold uppercase tracking-wider text-gray-600 dark:bg-[#1E293B]/50 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3.5">Teacher Name</th>
              <th className="px-4 py-3.5">Contact Details</th>
              <th className="px-4 py-3.5">Subjects</th>
              <th className="px-4 py-3.5">Mode</th>
              <th className="px-4 py-3.5">Qualification</th>
              <th className="px-4 py-3.5">Experience</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5 text-center">Students</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECE5] dark:divide-white/10">
            {loading && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  Loading teacher accounts...
                </td>
              </tr>
            )}
            {!loading && filteredTeachers.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  No teachers found.
                </td>
              </tr>
            )}
            {filteredTeachers.map((t) => {
              const isActive = t.status === "active";
              const modes = (t.teaching_mode || "")
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean);
              return (
                <tr
                  key={t.id}
                  className="transition-colors hover:bg-[#F8FAF5]/60 dark:hover:bg-white/5"
                >
                  <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">
                    <div>{t.name}</div>
                    {t.address && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-normal text-gray-400">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate max-w-[160px]">{t.address}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      <span>{t.email}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Phone size={11} className="shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                    {t.subjects}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {modes.length === 0 && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                      {modes.map((m) => (
                        <span
                          key={m}
                          className={clsx(
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-bold",
                            modeStyles[m] || "bg-gray-100 text-gray-600"
                          )}
                        >
                          {modeLabels[m] || m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                      <GraduationCap size={13} className="text-gray-400 shrink-0" />
                      <span>{t.qualification || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t.experience_years ? `${t.experience_years} yrs` : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={clsx(
                        "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                        typeStyles[t.teacher_type] || "bg-gray-100 text-gray-600"
                      )}
                    >
                      {t.teacher_type?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => setViewTeacher(t)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#798321]/10 px-2.5 py-1 text-xs font-bold text-[#798321] hover:bg-[#798321]/20 dark:bg-[#FFC107]/10 dark:text-[#FFC107]"
                      title="View assigned students"
                    >
                      <Users size={12} />
                      {t.assigned_count ?? 0}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize",
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      )}
                    >
                      <span
                        className={clsx(
                          "h-1.5 w-1.5 rounded-full",
                          isActive ? "bg-green-500" : "bg-amber-500"
                        )}
                      />
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewTeacher(t)}
                        title="View details & passwords"
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditTeacher(t)}
                        title="Edit teacher"
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => toggleStatus(t)}
                        disabled={togglingId === t.id}
                        title={isActive ? "Mark Inactive" : "Mark Active"}
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border",
                          isActive
                            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400"
                            : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-400"
                        )}
                      >
                        {isActive ? (
                          <ToggleRight size={16} className="text-amber-600" />
                        ) : (
                          <ToggleLeft size={16} className="text-green-600" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Teacher Modal */}
      <AnimatePresence>
        {showModal && (
          <TeacherFormModal
            mode="add"
            onClose={() => setShowModal(false)}
            onSaved={() => {
              setShowModal(false);
              fetchTeachers();
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Teacher Modal */}
      <AnimatePresence>
        {editTeacher && (
          <TeacherFormModal
            mode="edit"
            teacher={editTeacher}
            onClose={() => setEditTeacher(null)}
            onSaved={() => {
              setEditTeacher(null);
              fetchTeachers();
            }}
          />
        )}
      </AnimatePresence>

      {/* View Teacher / Assigned Students Modal */}
      <AnimatePresence>
        {viewTeacher && (
          <TeacherAssignmentsModal
            teacher={viewTeacher}
            onClose={() => setViewTeacher(null)}
            onUpdateTeacher={() => fetchTeachers()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add / Edit Teacher Modal (shared form)                            */
/* ------------------------------------------------------------------ */

function TeacherFormModal({
  mode,
  teacher,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  teacher?: Teacher;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(() => {
    if (mode === "edit" && teacher) {
      return {
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        password: "",
        subjects: teacher.subjects || "",
        address: teacher.address || "",
        qualification: teacher.qualification || "",
        experience_years: teacher.experience_years?.toString() || "",
        gender: teacher.gender || "",
        date_of_birth: teacher.date_of_birth || "",
        teacher_type: teacher.teacher_type || "part_time",
        joining_date: teacher.joining_date || "",
        teaching_mode: (teacher.teaching_mode || "")
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        salary_amount: teacher.salary_amount?.toString() || "",
        salary_frequency: teacher.salary_frequency || "monthly",
      };
    }
    return initialForm;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTeachingMode = (value: string) => {
    setForm((prev) => {
      const exists = prev.teaching_mode.includes(value);
      return {
        ...prev,
        teaching_mode: exists
          ? prev.teaching_mode.filter((m) => m !== value)
          : [...prev.teaching_mode, value],
      };
    });
  };

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.email || !form.phone || !form.subjects) {
      setError("Name, email, phone, and subjects are required.");
      return;
    }
    if (mode === "add" && !form.password) {
      setError("Password is required for a new teacher account.");
      return;
    }
    if (form.teaching_mode.length === 0) {
      setError("Select at least one teaching mode.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        teaching_mode: form.teaching_mode.join(","),
      };
      // Don't send an empty password on edit — leave it unchanged
      if (mode === "edit" && !payload.password) {
        delete (payload as any).password;
      }

      const url =
        mode === "add"
          ? "/api/admin/teachers"
          : `/api/admin/teachers/${teacher!.id}`;
      const method = mode === "add" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save teacher.");
        return;
      }
      onSaved();
    } catch (err) {
      console.error("Failed to save teacher", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0F1E33] sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-[#24310F] dark:text-white">
              {mode === "add" ? "Add New Teacher" : `Edit ${teacher?.name}`}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mode === "add"
                ? "Create a new teacher account with credentials and profile details."
                : "Update this teacher's profile details."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name *">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="modal-input"
              placeholder="Teacher's full name"
            />
          </Field>
          <Field label="Email *">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="modal-input"
              placeholder="teacher@example.com"
            />
          </Field>
          <Field label="Phone *">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="modal-input"
              placeholder="10-digit phone number"
            />
          </Field>
          <Field label={mode === "add" ? "Login Password *" : "Reset Password"}>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="modal-input"
              placeholder={
                mode === "add" ? "Set a login password" : "Leave blank to keep current password"
              }
            />
          </Field>
          <Field label="Subjects *">
            <input
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              className="modal-input"
              placeholder="e.g. Math, Physics"
            />
          </Field>
          <Field label="Qualification">
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              className="modal-input"
              placeholder="e.g. M.Sc Mathematics"
            />
          </Field>
          <Field label="Experience (years)">
            <input
              name="experience_years"
              type="number"
              min={0}
              value={form.experience_years}
              onChange={handleChange}
              className="modal-input"
              placeholder="e.g. 5"
            />
          </Field>
          <Field label="Teacher Type">
            <select
              name="teacher_type"
              value={form.teacher_type}
              onChange={handleChange}
              className="modal-input"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="freelance">Freelance</option>
            </select>
          </Field>
          <Field label="Gender">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="modal-input"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Date of Birth">
            <input
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              className="modal-input"
            />
          </Field>
          <Field label="Joining Date">
            <input
              name="joining_date"
              type="date"
              value={form.joining_date}
              onChange={handleChange}
              className="modal-input"
            />
          </Field>
        </div>

        {/* Teaching Mode Checkboxes */}
        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold text-gray-600 dark:text-gray-300">
            Teaching Mode *
          </span>
          <div className="flex flex-wrap gap-2">
            {teachingModeOptions.map(({ value, label, icon: Icon }) => {
              const checked = form.teaching_mode.includes(value);
              return (
                <label
                  key={value}
                  className={clsx(
                    "flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all select-none",
                    checked
                      ? "border-[#798321] bg-[#798321]/10 text-[#798321] dark:border-[#FFC107] dark:bg-[#FFC107]/10 dark:text-[#FFC107]"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 dark:border-white/10 dark:bg-[#132238] dark:text-gray-400"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleTeachingMode(value)}
                    className="sr-only"
                  />
                  <Icon size={14} />
                  {label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-gray-300 p-4 dark:border-white/15">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Teacher Salary (paid by admin)
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Salary Amount">
              <input
                name="salary_amount"
                type="number"
                min={0}
                step="0.01"
                value={form.salary_amount}
                onChange={handleChange}
                className="modal-input"
                placeholder="e.g. 15000"
              />
            </Field>
            <Field label="Salary Frequency">
              <select
                name="salary_frequency"
                value={form.salary_frequency}
                onChange={handleChange}
                className="modal-input"
              >
                <option value="monthly">Monthly</option>
                <option value="per_session">Per Session</option>
                <option value="one_time">One Time</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="mt-4">
          <Field label="Address">
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="modal-input"
              rows={2}
              placeholder="Full address"
            />
          </Field>
        </div>

        {error && (
          <p className="mt-3 text-xs font-semibold text-red-500">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#798321]/20 transition-all hover:brightness-105 active:scale-98 disabled:opacity-50"
        >
          {saving
            ? mode === "add"
              ? "Saving Teacher..."
              : "Saving Changes..."
            : mode === "add"
            ? "Add Teacher Account"
            : "Save Changes"}
        </button>

        <style jsx global>{`
          .modal-input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid #e8ece5;
            padding: 0.65rem 0.85rem;
            font-size: 0.85rem;
            background: #f9fafb;
            outline: none;
            transition: all 0.2s;
          }
          .modal-input:focus {
            background: #ffffff;
            border-color: #798321;
            box-shadow: 0 0 0 3px rgba(121, 131, 33, 0.15);
          }
          :global(.dark) .modal-input {
            background: #132238;
            border-color: rgba(255, 255, 255, 0.1);
            color: white;
          }
          :global(.dark) .modal-input:focus {
            border-color: #ffc107;
            box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.15);
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  View Teacher — assigned students, schedule, and fees              */
/* ------------------------------------------------------------------ */

const assignmentStatusStyles: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
  ongoing: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

function TeacherAssignmentsModal({
  teacher,
  onClose,
  onUpdateTeacher,
}: {
  teacher: Teacher;
  onClose: () => void;
  onUpdateTeacher: () => void;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Password Management State
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(teacher.password || "");
  const [updatingPass, setUpdatingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacher.id]);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/teachers/${teacher.id}/assignments`);
      const json = await res.json();
      setAssignments(json.data || []);
    } catch (err) {
      console.error("Failed to load assignments", err);
    } finally {
      setLoading(false);
    }
  }

  // Generate a random 8-character password
  const handleGeneratePass = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setShowPassword(true);
  };

  // Update password via API
  const handleUpdatePass = async () => {
    if (!newPassword) return;
    setUpdatingPass(true);
    setPassMsg({ type: "", text: "" });
    try {
      const res = await fetch(`/api/admin/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("Failed");
      setPassMsg({ type: "success", text: "Password updated successfully!" });
      onUpdateTeacher(); // Refresh main list if needed
      setTimeout(() => setPassMsg({ type: "", text: "" }), 3000);
    } catch(err) {
      setPassMsg({ type: "error", text: "Failed to update password." });
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0F1E33] sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-[#24310F] dark:text-white">
              {teacher.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {teacher.subjects} · {assignments.length} student
              {assignments.length !== 1 ? "s" : ""} assigned
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔐 Login Access / Password Section */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-[#F8FAF5] p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Key size={16} className="text-[#798321] dark:text-[#FFC107]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Login Access Configuration
            </h3>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                User Email
              </label>
              <input
                disabled
                value={teacher.email}
                className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 px-3.5 text-sm font-medium text-gray-500 outline-none dark:border-white/5 dark:bg-[#132238] dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                Current / New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-3.5 pr-10 text-sm font-medium outline-none focus:border-[#798321] dark:border-white/10 dark:bg-[#0F1E33] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGeneratePass}
                className="rounded-xl border-2 border-[#798321] px-4 py-2.5 text-xs font-bold text-[#798321] hover:bg-[#798321]/10 dark:border-[#FFC107] dark:text-[#FFC107] dark:hover:bg-[#FFC107]/10 transition-colors"
              >
                Generate
              </button>
              <button
                onClick={handleUpdatePass}
                disabled={updatingPass || !newPassword}
                className="rounded-xl bg-[#798321] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#6B7328] disabled:opacity-50 dark:bg-[#FFC107] dark:text-[#0F1E33] dark:hover:bg-[#E5AD06] transition-colors shadow-md"
              >
                {updatingPass ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          {passMsg.text && (
            <p className={clsx("mt-3 flex items-center gap-1.5 text-xs font-bold", passMsg.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400")}>
              {passMsg.type === "success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {passMsg.text}
            </p>
          )}
        </div>

        {/* Quick stats */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Students Assigned
              </p>
              <p className="text-lg font-black text-[#24310F] dark:text-white">
                {assignments.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#F8FAF5] p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Teacher Salary
              </p>
              <p className="text-lg font-black text-[#24310F] dark:text-white">
                {teacher.salary_amount
                  ? `₹${Number(teacher.salary_amount).toLocaleString("en-IN")} / ${teacher.salary_frequency.replace("_", " ")}`
                  : "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Assignment list */}
        <div className="space-y-3">
          {loading && (
            <p className="py-8 text-center text-sm text-gray-400">
              Loading assigned students...
            </p>
          )}
          {!loading && assignments.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              No students assigned to this teacher yet.
            </p>
          )}
          {!loading &&
            assignments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-gray-200 p-4 dark:border-white/10"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {a.student_name || `Application #${a.id}`}
                    </p>
                    {(a.class_name || a.subject) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {[a.class_name, a.subject].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                      assignmentStatusStyles[a.status] ||
                        "bg-gray-100 text-gray-600"
                    )}
                  >
                    {a.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-4">
                  <div className="flex items-center gap-1.5">
                    <Wallet size={12} className="text-gray-400" />
                    <span>
                      ₹{Number(a.fee_amount).toLocaleString("en-IN")} /{" "}
                      {a.fee_frequency.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarClock size={12} className="text-gray-400" />
                    <span>
                      {a.schedule_days || "—"}
                      {a.schedule_time ? `, ${a.schedule_time}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Start:</span>
                    <span>{a.start_date || "—"}</span>
                  </div>
                  {a.meeting_link && (
                    <a
                      href={a.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-semibold text-[#798321] hover:underline dark:text-[#FFC107]"
                    >
                      <Video size={12} />
                      Meeting Link
                    </a>
                  )}
                </div>

                {/* Attendance summary */}
                {a.attendance && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-dashed border-gray-200 pt-3 dark:border-white/10 sm:grid-cols-4">
                    <AttendanceStat
                      icon={CalendarCheck2}
                      label="This Month"
                      value={a.attendance.thisMonth}
                      tone="text-sky-600 bg-sky-50 dark:bg-sky-950/30 dark:text-sky-400"
                    />
                    <AttendanceStat
                      icon={CalendarClock}
                      label="Total Classes"
                      value={a.attendance.total}
                      tone="text-[#798321] bg-[#798321]/10 dark:text-[#FFC107] dark:bg-[#FFC107]/10"
                    />
                    <AttendanceStat
                      icon={CalendarX2}
                      label="Missed"
                      value={a.attendance.missed}
                      tone="text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400"
                    />
                    <AttendanceStat
                      icon={Ban}
                      label="Cancelled"
                      value={a.attendance.cancelled}
                      tone="text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400"
                    />
                  </div>
                )}

              </div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AttendanceStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CalendarCheck2;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={clsx("flex items-center gap-2 rounded-xl px-2.5 py-2", tone)}>
      <Icon size={14} className="shrink-0" />
      <div>
        <p className="text-sm font-black leading-tight">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide leading-tight opacity-80">
          {label}
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </span>
      {children}
    </label>
  );
}