"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import {
  LogOut,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Video,
  CalendarClock,
  Users,
  ChevronDown,
  CalendarCheck,
  XCircle,
  CalendarX2,
  CalendarOff,
  CalendarDays,
  IndianRupee,
  Wallet,
  Briefcase,
  Award,
  Building2,
  BadgeCheck,
  ShieldCheck,
  RefreshCw,
  GraduationCap,
  Hash,
} from "lucide-react";

type AttendanceToday = {
  status: "scheduled" | "held" | "missed" | "cancelled";
  notes?: string | null;
} | null;

type Assignment = {
  id: number;
  fee_amount: number;
  fee_frequency: string;
  schedule_days: string | null;
  schedule_time: string | null;
  start_date: string | null;
  meeting_link: string | null;
  status: string;
  assigned_at: string;
  // Teacher's own attendance status for today — read from teacher_status /
  // teacher_notes on the backend, kept separate from the parent's status.
  attendance_today?: AttendanceToday;
  tuition_applications: {
    id: number;
    student_name: string;
    student_grade: string;
    subject: string;
    mode: string;
    parent_name: string;
    parent_phone: string;
    address: string | null;
    preferred_days: string | null;
    preferred_time: string | null;
  };
};

// Shape returned by /api/teacher/login and stored in localStorage — mirrors
// the `teachers` table so salary/profile fields can be shown on the panel.
type Teacher = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subjects: string;
  status: "active" | "inactive";
  address?: string | null;
  qualification?: string | null;
  experience_years?: number | null;
  gender?: string | null;
  date_of_birth?: string | null;
  teacher_type?: "full_time" | "part_time" | "freelance" | null;
  joining_date?: string | null;
  profile_photo_url?: string | null;
  teaching_mode?: string | null;
  salary_amount?: number | null;
  salary_frequency?: "one_time" | "monthly" | "per_session" | null;
};

const STATUS_ORDER = ["not_started", "ongoing", "completed", "cancelled"] as const;

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string; rail: string; icon: any; label: string }
> = {
  not_started: {
    bg: "bg-gray-100 dark:bg-neutral-800/60",
    text: "text-gray-600 dark:text-neutral-400",
    border: "border-gray-200 dark:border-neutral-800",
    rail: "bg-gray-300 dark:bg-neutral-600",
    icon: Clock,
    label: "Not started",
  },
  ongoing: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/20",
    rail: "bg-indigo-500",
    icon: Sparkles,
    label: "Ongoing",
  },
  completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    rail: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Completed",
  },
  cancelled: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
    rail: "bg-rose-400",
    icon: AlertCircle,
    label: "Cancelled",
  },
};

const attendanceStatusStyles: Record<
  string,
  { bg: string; border: string; text: string; icon: any; label: string }
> = {
  scheduled: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-900/40",
    text: "text-blue-700 dark:text-blue-400",
    icon: CalendarDays,
    label: "Not marked yet",
  },
  held: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: CalendarCheck,
    label: "Held",
  },
  missed: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    border: "border-rose-200 dark:border-rose-900/40",
    text: "text-rose-700 dark:text-rose-400",
    icon: XCircle,
    label: "Missed",
  },
  cancelled: {
    bg: "bg-gray-50 dark:bg-neutral-800/30",
    border: "border-gray-200 dark:border-neutral-800",
    text: "text-gray-500 dark:text-neutral-400",
    icon: CalendarX2,
    label: "Cancelled",
  },
};

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "home_tuition,online" -> "Home tuition, Online"
function formatLabelList(value?: string | null) {
  if (!value) return null;
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => v.replace(/_/g, " "))
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(", ");
}

function formatSalaryFrequency(freq?: string | null) {
  if (!freq) return "";
  const map: Record<string, string> = {
    monthly: "/ month",
    one_time: "one-time",
    per_session: "/ session",
  };
  return map[freq] || freq.replace(/_/g, " ");
}

const DAY_ABBREVIATIONS: Record<number, string[]> = {
  0: ["sun", "sunday"],
  1: ["mon", "monday"],
  2: ["tue", "tues", "tuesday"],
  3: ["wed", "wednesday"],
  4: ["thu", "thur", "thurs", "thursday"],
  5: ["fri", "friday"],
  6: ["sat", "saturday"],
};

function isScheduledDayToday(scheduleDays?: string | null): boolean {
  if (!scheduleDays || !scheduleDays.trim()) return false;

  const today = new Date();
  const todayAbbrevs = DAY_ABBREVIATIONS[today.getDay()];

  const scheduledTokens = scheduleDays
    .toLowerCase()
    .split(/,|\/|&|\band\b/i)
    .map((t) => t.trim())
    .filter(Boolean);

  return scheduledTokens.some((token) =>
    todayAbbrevs.some((abbrev) => token.startsWith(abbrev))
  );
}

// Statuses that require the teacher to give a reason before submitting
const REASON_REQUIRED_STATUSES: Array<"missed" | "cancelled"> = ["missed", "cancelled"];

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [openStatusFor, setOpenStatusFor] = useState<number | null>(null);

  // attendance-marking state
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [attendanceError, setAttendanceError] = useState("");
  const [localAttendance, setLocalAttendance] = useState<Record<number, AttendanceToday>>({});

  // reason-prompt state — shown inline before submitting Missed/Cancelled
  const [reasonPrompt, setReasonPrompt] = useState<{
    assignmentId: number;
    status: "missed" | "cancelled";
  } | null>(null);
  const [reasonText, setReasonText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      router.push("/teacher/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setTeacher(parsed);
    fetchAssignments(parsed.id);
  }, [router]);

  async function fetchAssignments(teacherId: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/tuitions?teacher_id=${teacherId}`);
      const json = await res.json();
      setAssignments(json.data || []);
      setLocalAttendance({});
    } catch (err) {
      console.error("Failed to load assignments", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(assignmentId: number, newStatus: string) {
    if (!teacher) return;
    setUpdatingId(assignmentId);
    setOpenStatusFor(null);
    try {
      await fetch(`/api/teacher/tuitions/${assignmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, teacher_id: teacher.id }),
      });
      fetchAssignments(teacher.id);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  }

  // Actually submits the attendance mark to the API, tagged as teacher-marked
  // (marked_by_role: "teacher") so it lands in teacher_status/teacher_notes,
  // never touching the parent's own status/notes columns.
  async function submitAttendance(
    a: Assignment,
    status: "held" | "missed" | "cancelled",
    notes: string | null
  ) {
    if (!teacher) return;

    if (!isScheduledDayToday(a.schedule_days)) {
      setAttendanceError(
        `No class is scheduled today for ${a.tuition_applications.student_name}'s ${a.tuition_applications.subject} tuition${
          a.schedule_days ? ` (scheduled: ${a.schedule_days})` : ""
        }.`
      );
      return;
    }

    setAttendanceError("");
    setMarkingId(a.id);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: a.id,
          class_date: getTodayDateString(),
          status,
          notes,
          marked_by: teacher.id,
          marked_by_role: "teacher",
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setAttendanceError(json.error || "Failed to mark attendance.");
      } else {
        setLocalAttendance((prev) => ({ ...prev, [a.id]: { status, notes } }));
        fetchAssignments(teacher.id);
      }
    } catch (err) {
      setAttendanceError("An error occurred while marking attendance.");
    } finally {
      setMarkingId(null);
    }
  }

  // Entry point from the buttons. "Held" submits immediately; "Missed" and
  // "Cancelled" open an inline reason prompt first.
  function handleAttendanceButtonClick(
    a: Assignment,
    status: "held" | "missed" | "cancelled"
  ) {
    if (REASON_REQUIRED_STATUSES.includes(status as "missed" | "cancelled")) {
      setReasonPrompt({ assignmentId: a.id, status: status as "missed" | "cancelled" });
      setReasonText("");
      return;
    }
    submitAttendance(a, status, null);
  }

  function cancelReasonPrompt() {
    setReasonPrompt(null);
    setReasonText("");
  }

  function confirmReasonPrompt(a: Assignment) {
    if (!reasonPrompt) return;
    const trimmed = reasonText.trim();
    submitAttendance(a, reasonPrompt.status, trimmed || null);
    setReasonPrompt(null);
    setReasonText("");
  }

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    router.push("/teacher/login");
  };

  const stats = useMemo(() => {
    const total = assignments.length;
    const ongoing = assignments.filter((a) => a.status === "ongoing").length;
    const completed = assignments.filter((a) => a.status === "completed").length;
    return { total, ongoing, completed };
  }, [assignments]);

  if (!teacher) return null;

  const teachingModeLabel = formatLabelList(teacher.teaching_mode);
  const salaryFreqLabel = formatSalaryFrequency(teacher.salary_frequency);
  const hasSalary = teacher.salary_amount !== null && teacher.salary_amount !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAF5] via-white to-[#F0F4EC] dark:bg-none dark:bg-black transition-colors duration-500">
      {/* Wider fluid container to mirror the parent dashboard's desktop layout */}
      <div className="mx-auto w-full max-w-[1400px] space-y-6 px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#798321]/20 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#798321]/20 bg-gradient-to-tr from-[#798321]/10 to-[#FFC107]/10 shadow-inner sm:h-16 sm:w-16 dark:border-neutral-800 dark:bg-neutral-900">
              {teacher.profile_photo_url ? (
                <img
                  src={teacher.profile_photo_url}
                  alt={teacher.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image src="/logo.png" alt="Rakvih Logo" width={52} height={52} className="object-contain p-2" />
              )}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#798321]/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                <ShieldCheck size={12} /> Faculty Portal
              </span>
              <h1 className="text-lg font-black text-[#24310F] dark:text-white sm:text-2xl">
                Welcome, {teacher.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-[#798321]" /> {teacher.phone}
                </span>
                {teacher.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-[#798321]" /> {teacher.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAssignments(teacher.id)}
              title="Refresh data"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:bg-[#171717]"
            >
              <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-gray-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 sm:px-4"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {attendanceError && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertCircle size={18} className="shrink-0" />
            <span>{attendanceError}</span>
          </div>
        )}

        {/* Quick Stats Grid — assignments + salary at a glance */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#798321]/10 text-[#798321] dark:text-[#FFC107]">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Assigned</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{stats.total}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Ongoing</p>
              <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400">{stats.ongoing}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Completed</p>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stats.completed}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Your Fees</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {hasSalary ? `₹${Number(teacher.salary_amount).toLocaleString("en-IN")}` : "Not set"}
              </h3>
            </div>
          </div>
        </div>

        {/* Profile & Fees panel */}
        <div className="overflow-hidden rounded-3xl border border-[#798321]/20 bg-white/90 shadow-xl shadow-black/[0.03] backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Profile column */}
            <div className="border-b border-gray-100 p-4 dark:border-neutral-800 lg:col-span-7 lg:border-b-0 lg:border-r sm:p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#798321]/10 text-[#798321] dark:text-[#FFC107]">
                  <GraduationCap size={18} />
                </span>
                <h2 className="text-sm font-black uppercase tracking-wider text-[#24310F] dark:text-white">
                  My Profile
                </h2>
                <span
                  className={clsx(
                    "ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                    teacher.status === "active"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-200 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400"
                  )}
                >
                  <BadgeCheck size={12} /> {teacher.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    <BookOpen size={12} className="text-[#798321] dark:text-[#FFC107]" /> Subjects
                  </span>
                  <p className="mt-1 font-black text-gray-900 dark:text-white">{teacher.subjects || "—"}</p>
                </div>

                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    <Building2 size={12} className="text-[#798321] dark:text-[#FFC107]" /> Teaching Mode
                  </span>
                  <p className="mt-1 font-black text-gray-900 dark:text-white">{teachingModeLabel || "—"}</p>
                </div>

                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    <Award size={12} className="text-[#798321] dark:text-[#FFC107]" /> Qualification
                  </span>
                  <p className="mt-1 font-black text-gray-900 dark:text-white">
                    {teacher.qualification || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    <Briefcase size={12} className="text-[#798321] dark:text-[#FFC107]" /> Experience
                  </span>
                  <p className="mt-1 font-black text-gray-900 dark:text-white">
                    {teacher.experience_years !== null && teacher.experience_years !== undefined
                      ? `${teacher.experience_years} yr${teacher.experience_years === 1 ? "" : "s"}`
                      : "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    <Hash size={12} className="text-[#798321] dark:text-[#FFC107]" /> Employment Type
                  </span>
                  <p className="mt-1 font-black capitalize text-gray-900 dark:text-white">
                    {teacher.teacher_type ? teacher.teacher_type.replace("_", " ") : "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    <CalendarClock size={12} className="text-[#798321] dark:text-[#FFC107]" /> Joined On
                  </span>
                  <p className="mt-1 font-black text-gray-900 dark:text-white">
                    {formatDate(teacher.joining_date) || "—"}
                  </p>
                </div>

                {teacher.address && (
                  <div className="rounded-xl bg-gray-50/80 p-3 sm:col-span-2 dark:bg-[#171717]">
                    <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      <MapPin size={12} className="text-[#798321] dark:text-[#FFC107]" /> Address
                    </span>
                    <p className="mt-1 font-semibold leading-relaxed text-gray-800 dark:text-white">
                      {teacher.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fees / salary column */}
            <div className="p-4 lg:col-span-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Wallet size={18} />
                </span>
                <h2 className="text-sm font-black uppercase tracking-wider text-[#24310F] dark:text-white">
                  My Fees
                </h2>
              </div>

              {hasSalary ? (
                <div className="mt-4 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {teacher.salary_frequency === "monthly"
                      ? "Monthly Salary"
                      : teacher.salary_frequency === "per_session"
                      ? "Per-session Fee"
                      : "Fee"}
                  </p>
                  <p className="mt-1 flex items-baseline gap-1 text-3xl font-black text-[#24310F] dark:text-white">
                    ₹{Number(teacher.salary_amount).toLocaleString("en-IN")}
                    <span className="text-xs font-bold text-gray-500 dark:text-neutral-400">
                      {salaryFreqLabel}
                    </span>
                  </p>
                  <p className="mt-2 text-[11px] text-gray-500 dark:text-neutral-400">
                    This is the fee configured for you by the academic office. For questions
                    about disbursement dates or corrections, please contact the office directly.
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs font-semibold text-gray-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                  <Clock size={16} className="shrink-0" />
                  <span>Your fee details haven't been configured yet by the academic office.</span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Active Tuitions
                  </span>
                  <p className="mt-1 font-black text-gray-900 dark:text-white">{stats.ongoing}</p>
                </div>
                <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Frequency
                  </span>
                  <p className="mt-1 font-black capitalize text-gray-900 dark:text-white">
                    {teacher.salary_frequency ? teacher.salary_frequency.replace("_", " ") : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-lg font-black text-[#24310F] dark:text-white">Assigned tuitions</h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Session timelines, parent contacts, and status — all in one place.
            </p>
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-r-transparent" />
            <p className="mt-3 text-sm font-medium text-gray-400">Loading your schedule…</p>
          </div>
        )}

        {!loading && assignments.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/50 p-12 text-center dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <BookOpen size={40} className="mx-auto text-gray-300 dark:text-neutral-600" />
            <p className="mt-4 text-sm font-semibold text-gray-600 dark:text-neutral-400">
              No tuitions assigned yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Once the academic office allocates a student to you, it'll show up here.
            </p>
          </div>
        )}

        {/* Assignment Cards */}
        <div className="grid gap-6">
          {assignments.map((a) => {
            const app = a.tuition_applications;
            const cfg = statusStyles[a.status] || statusStyles.not_started;
            const StatusIcon = cfg.icon;
            const formattedStart = formatDate(a.start_date);
            const isOngoing = a.status === "ongoing";
            const statusOpen = openStatusFor === a.id;

            const isClassDayToday = isScheduledDayToday(a.schedule_days);

            const effectiveAttendance = localAttendance[a.id] ?? a.attendance_today ?? null;
            const todayStatus = effectiveAttendance?.status || "scheduled";
            const todayNotes = effectiveAttendance?.notes || null;
            const todayCfg = attendanceStatusStyles[todayStatus] || attendanceStatusStyles.scheduled;
            const TodayIcon = todayCfg.icon;
            const isMarkingThis = markingId === a.id;
            const isPromptingThis = reasonPrompt?.assignmentId === a.id;

            return (
              <div
                key={a.id}
                className="group relative overflow-hidden rounded-3xl border border-[#798321]/20 bg-white/90 p-4 shadow-xl shadow-black/[0.03] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-6"
              >
                {/* Card top strip: id + status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-neutral-800">
                  <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                    <Hash size={12} className="text-[#798321]" /> Assignment #{a.id}
                  </span>
                  <div
                    className={clsx(
                      "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold",
                      cfg.bg,
                      cfg.text,
                      cfg.border
                    )}
                  >
                    <StatusIcon size={14} />
                    <span>{cfg.label}</span>
                  </div>
                </div>

                {/* Two-column split: LEFT = Student & parent · RIGHT = Schedule & attendance */}
                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
                  {/* LEFT COLUMN */}
                  <div className="space-y-4 lg:col-span-5">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                      <div className="flex items-start gap-3">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#798321]/20 to-[#FFC107]/20 text-sm font-black text-[#798321] dark:text-[#FFC107]">
                          {initials(app.student_name)}
                          {isOngoing && (
                            <span className="absolute -right-1 -top-1 flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75 motion-reduce:animate-none" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black leading-tight text-[#24310F] dark:text-white">
                            {app.student_name}{" "}
                            <span className="text-xs font-semibold text-gray-400">
                              ({app.student_grade})
                            </span>
                          </h3>
                          <p className="mt-0.5 text-sm font-semibold text-gray-600 dark:text-neutral-300">
                            {app.subject} <span className="text-gray-300 dark:text-neutral-600">·</span>{" "}
                            <span className="capitalize text-[#798321] dark:text-[#FFC107]">{app.mode}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 border-t border-gray-200/60 pt-3 text-xs text-gray-600 dark:border-neutral-800 dark:text-neutral-300">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="shrink-0 text-[#798321] dark:text-[#FFC107]" />
                          <span>
                            <strong className="text-gray-900 dark:text-white">{app.parent_name}</strong> — {app.parent_phone}
                          </span>
                        </div>
                        {app.mode === "home" && app.address && (
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-[#798321] dark:text-[#FFC107]" />
                            <span className="break-words">{app.address}</span>
                          </div>
                        )}
                        {app.mode === "online" && a.meeting_link && (
                          <div className="flex items-center gap-2">
                            <Video size={14} className="shrink-0 text-indigo-500" />
                            <a
                              href={a.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate font-bold text-indigo-600 underline underline-offset-2 dark:text-indigo-400"
                            >
                              Join meeting link
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          <CalendarClock size={12} className="text-[#798321] dark:text-[#FFC107]" /> Starts
                        </span>
                        <p className="mt-1 font-black text-gray-900 dark:text-white">{formattedStart || "Not set"}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          <Calendar size={12} className="text-[#798321] dark:text-[#FFC107]" /> Days
                        </span>
                        <p className="mt-1 font-black text-gray-900 dark:text-white">
                          {a.schedule_days || app.preferred_days || "Not set"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          <Clock size={12} className="text-[#798321] dark:text-[#FFC107]" /> Time
                        </span>
                        <p className="mt-1 font-black text-gray-900 dark:text-white">
                          {a.schedule_time || app.preferred_time || "Not set"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-[#171717]">
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          <IndianRupee size={12} className="text-amber-500" /> Fee for this class
                        </span>
                        <p className="mt-1 font-black text-gray-900 dark:text-white">
                          ₹{Number(a.fee_amount).toLocaleString("en-IN")}
                          <span className="ml-1 text-[10px] font-semibold capitalize text-gray-400">
                            /{a.fee_frequency}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN — attendance + status */}
                  <div className="space-y-4 lg:col-span-7">
                    {/* Attendance control — only for ongoing tuitions */}
                    {isOngoing && (
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                        <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">
                          Today's attendance
                        </span>

                        {isClassDayToday ? (
                          <div className="mt-2 space-y-2.5">
                            <div
                              className={clsx(
                                "flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold",
                                todayCfg.bg,
                                todayCfg.border,
                                todayCfg.text
                              )}
                            >
                              <TodayIcon size={14} />
                              <span>{todayCfg.label}</span>
                            </div>

                            {todayNotes && (
                              <p className="rounded-lg bg-gray-50 px-3 py-2 text-[11px] italic text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                                Reason: {todayNotes}
                              </p>
                            )}

                            {isPromptingThis ? (
                              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <label className="text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                  Reason for marking as {reasonPrompt.status}
                                </label>
                                <textarea
                                  value={reasonText}
                                  onChange={(e) => setReasonText(e.target.value)}
                                  placeholder="e.g. Student was unwell, parent requested reschedule, network issue…"
                                  rows={2}
                                  className="w-full resize-none rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-800 outline-none focus:border-amber-400 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={cancelReasonPrompt}
                                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => confirmReasonPrompt(a)}
                                    disabled={isMarkingThis}
                                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isMarkingThis && (
                                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-r-transparent" />
                                    )}
                                    Confirm {reasonPrompt.status}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleAttendanceButtonClick(a, "held")}
                                  disabled={isMarkingThis}
                                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isMarkingThis && (
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-r-transparent" />
                                  )}
                                  Held
                                </button>
                                <button
                                  onClick={() => handleAttendanceButtonClick(a, "missed")}
                                  disabled={isMarkingThis}
                                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Missed
                                </button>
                                <button
                                  onClick={() => handleAttendanceButtonClick(a, "cancelled")}
                                  disabled={isMarkingThis}
                                  className="flex items-center gap-1.5 rounded-lg bg-gray-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Cancelled
                                </button>
                              </div>
                            )}

                            {todayStatus !== "scheduled" && !isPromptingThis && (
                              <p className="text-[11px] text-gray-400">
                                Tap another option to change today's status.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-semibold text-gray-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                            <CalendarOff size={14} className="shrink-0" />
                            <span>
                              No class scheduled today
                              {a.schedule_days ? ` (scheduled: ${a.schedule_days})` : ""}.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status control */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                      <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">
                        Session status
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          disabled={updatingId === a.id}
                          onClick={() => setOpenStatusFor(statusOpen ? null : a.id)}
                          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 outline-none transition-all hover:border-[#798321]/40 disabled:opacity-60 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                        >
                          {updatingId === a.id ? (
                            "Updating…"
                          ) : (
                            <>
                              <span className={clsx("h-2 w-2 rounded-full", cfg.rail)} />
                              {cfg.label}
                              <ChevronDown size={13} className={clsx("transition-transform", statusOpen && "rotate-180")} />
                            </>
                          )}
                        </button>

                        {statusOpen && (
                          <div className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
                            {STATUS_ORDER.map((s) => {
                              const sc = statusStyles[s];
                              const SIcon = sc.icon;
                              return (
                                <button
                                  key={s}
                                  onClick={() => updateStatus(a.id, s)}
                                  className={clsx(
                                    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors",
                                    s === a.status
                                      ? clsx(sc.bg, sc.text)
                                      : "text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                  )}
                                >
                                  <SIcon size={13} />
                                  {sc.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}