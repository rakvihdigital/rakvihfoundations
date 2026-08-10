"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";
import {
  LogOut,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  UserCheck,
  Sparkles,
  Calendar,
  Phone,
  Hash,
  GraduationCap,
  ShieldCheck,
  Receipt,
  RefreshCw,
  Video,
  CalendarClock,
  ExternalLink,
  Lock,
  CalendarDays,
  AlertTriangle,
  CalendarCheck,
  XCircle,
  CalendarX2,
  CalendarOff,
  ChevronDown,
  PlusCircle,
  MessageSquareWarning,
  Send,
  UserCog,
  User
} from "lucide-react";

type BillingCycle = {
  id: number;
  period_start: string;
  period_end: string;
  due_date: string;
  amount_due: number;
  status: "due" | "paid" | "waived";
  display_status: "upcoming" | "due_soon" | "overdue" | "paid" | "waived";
  days_until_due: number;
};

type AttendanceSummary = {
  held: number;
  missed: number;
  cancelled: number;
  scheduled: number;
  recent: { class_date: string; status: string; notes: string | null }[];
};

type TuitionResult = {
  application_id: number;
  assignment_id: number | null;
  student_name: string;
  parent_name?: string;
  phone?: string;
  subject: string;
  class_grade?: string;
  next_cycle: BillingCycle | null;
  attendance_summary: AttendanceSummary | null;
  board?: string;
  address?: string;
  preferred_mode?: string;
  teacher_name: string | null;
  teacher_phone?: string | null;
  teacher_email?: string | null;
  fee_amount: number | null;
  payment_status: "not_assigned" | "unpaid" | "partial" | "paid";
  application_status: "pending" | "assigned" | "ongoing" | "completed" | "cancelled";
  total_paid: number;
  created_at?: string;
  schedule_days?: string | null;
  schedule_time?: string | null;
  start_date?: string | null;
  meeting_link?: string | null;
  current_cycle: BillingCycle | null;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string; icon: any; label: string }
> = {
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    icon: Clock,
    label: "Pending Review",
  },
  assigned: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
    icon: UserCheck,
    label: "Teacher Assigned",
  },
  ongoing: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/20",
    icon: Sparkles,
    label: "Classes Ongoing",
  },
  completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
    label: "Completed",
  },
  cancelled: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
    icon: AlertCircle,
    label: "Cancelled",
  },
};

const cycleBadgeStyles: Record<
  string,
  { bg: string; text: string; border: string; icon: any; label: (c: BillingCycle) => string }
> = {
  paid: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
    label: () => "This month is paid",
  },
  waived: {
    bg: "bg-gray-100 dark:bg-neutral-800",
    text: "text-gray-500 dark:text-neutral-400",
    border: "border-gray-200 dark:border-neutral-800",
    icon: CheckCircle2,
    label: () => "Fee waived this cycle",
  },
  upcoming: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
    icon: CalendarDays,
    label: (c) => `Due in ${c.days_until_due} days`,
  },
  due_soon: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    icon: AlertTriangle,
    label: (c) =>
      c.days_until_due === 0
        ? "Due today"
        : `Due in ${c.days_until_due} day${c.days_until_due === 1 ? "" : "s"} — pay soon`,
  },
  overdue: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
    icon: AlertCircle,
    label: (c) =>
      `Overdue by ${Math.abs(c.days_until_due)} day${Math.abs(c.days_until_due) === 1 ? "" : "s"}`,
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
    label: "Scheduled",
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
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatMonth(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DAY_ABBREVIATIONS: Record<number, string[]> = {
  0: ["sun", "sunday"], 1: ["mon", "monday"], 2: ["tue", "tues", "tuesday"], 3: ["wed", "wednesday"], 4: ["thu", "thur", "thurs", "thursday"], 5: ["fri", "friday"], 6: ["sat", "saturday"],
};

function isScheduledDayToday(scheduleDays?: string | null): boolean {
  if (!scheduleDays || !scheduleDays.trim()) return false;
  const today = new Date();
  const todayAbbrevs = DAY_ABBREVIATIONS[today.getDay()];
  const scheduledTokens = scheduleDays.toLowerCase().split(/,|\/|&|\band\b/i).map((t) => t.trim()).filter(Boolean);
  return scheduledTokens.some((token) => todayAbbrevs.some((abbrev) => token.startsWith(abbrev)));
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<TuitionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [allOfferedSubjects, setAllOfferedSubjects] = useState<string[]>([]);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(true);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");

  const [isRequestingSubject, setIsRequestingSubject] = useState(false);
  const [requestedSubjects, setRequestedSubjects] = useState<string[]>([]);
  const [customSubjectText, setCustomSubjectText] = useState("");
  const [isSubmittingSubjectRequest, setIsSubmittingSubjectRequest] = useState(false);

  const [subjectPreferredDays, setSubjectPreferredDays] = useState("");
  const [subjectPreferredTime, setSubjectPreferredTime] = useState("");
  const [subjectPreferredMode, setSubjectPreferredMode] = useState("online");

  const [globalReport, setGlobalReport] = useState("");
  const [isSubmittingGlobalReport, setIsSubmittingGlobalReport] = useState(false);
  const [globalReportSuccess, setGlobalReportSuccess] = useState("");

  const [teacherChangeAssignmentId, setTeacherChangeAssignmentId] = useState<number | "">("");
  const [teacherChangeReason, setTeacherChangeReason] = useState("");
  const [isSubmittingTeacherChange, setIsSubmittingTeacherChange] = useState(false);
  const [teacherChangeSuccess, setTeacherChangeSuccess] = useState("");
  const [teacherChangeCount, setTeacherChangeCount] = useState(0);

  const displayStudentName = results.length > 0 ? results[0].student_name : student?.student_name || student?.parent_name || "Student";

  const autoParentName = results[0]?.parent_name || student?.parent_name || "Not on file";
  const autoClassGrade = results[0]?.class_grade || student?.class_grade || "Not on file";

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      router.push("/tuition/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setStudent(parsed);

    const storedChangeCount = localStorage.getItem(`tc_count_${parsed.phone}`);
    if (storedChangeCount) setTeacherChangeCount(parseInt(storedChangeCount));

    fetchTuitions(parsed.phone);
    fetchAvailableSubjects();
  }, [router]);

  async function fetchAvailableSubjects() {
    setIsFetchingSubjects(true);
    try {
      const { data, error } = await supabase.from("teachers").select("subjects");
      if (error) {
        console.error("Supabase error fetching subjects:", error);
        return;
      }
      const subjectSet = new Set<string>();
      if (data && data.length > 0) {
        data.forEach((teacher) => {
          if (teacher.subjects) {
            teacher.subjects.split(",").forEach((s: string) => {
              const formatted = s.trim();
              if (formatted) {
                subjectSet.add(formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase());
              }
            });
          }
        });
      }
      setAllOfferedSubjects(Array.from(subjectSet).sort());
    } catch (err) {
      console.error("Failed to load available subjects", err);
    } finally {
      setIsFetchingSubjects(false);
    }
  }

  async function fetchTuitions(phone: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/tuition/lookup?phone=${encodeURIComponent(phone)}`);
      const json = await res.json();
      setResults(json.data || []);
    } catch (err) {
      console.error("Failed to load tuitions", err);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handlePay = async (item: TuitionResult) => {
    if (!item.assignment_id || !item.current_cycle) return;
    setError("");
    setPayingId(item.assignment_id);

    try {
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: item.assignment_id }),
      });
      const orderJson = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderJson.error || "Could not start payment transaction.");
        setPayingId(null);
        return;
      }

      const options = {
        key: orderJson.key_id,
        amount: orderJson.amount,
        currency: orderJson.currency,
        order_id: orderJson.order_id,
        name: "RAKVIH Foundation",
        description: `${formatMonth(item.current_cycle.period_start)} tuition fee for ${item.student_name} (${item.subject})`,
        image: "/logo.png",
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                assignment_id: item.assignment_id,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) {
              setError(verifyJson.error || "Payment verification failed.");
            } else {
              fetchTuitions(student.phone);
            }
          } catch {
            setError("Payment recorded but verification timed out. Please refresh your page.");
          } finally {
            setPayingId(null);
          }
        },
        modal: { ondismiss: () => setPayingId(null) },
        theme: { color: "#798321" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("An error occurred initializing Razorpay payment gateway.");
      setPayingId(null);
    }
  };

  const handleMarkAttendance = async (
    item: TuitionResult,
    status: "held" | "missed" | "cancelled" = "held"
  ) => {
    if (!item.assignment_id) return;
    if (!isScheduledDayToday(item.schedule_days)) {
      setError(`No class is scheduled today for ${item.student_name}'s ${item.subject} tuition.`);
      return;
    }
    setError("");
    setMarkingId(item.assignment_id);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: item.assignment_id,
          class_date: getTodayDateString(),
          status,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to mark attendance.");
      } else {
        await fetchTuitions(student.phone);
      }
    } catch (err) {
      setError("An error occurred while marking attendance.");
    } finally {
      setMarkingId(null);
    }
  };

  const toggleSubject = (sub: string) => {
    setRequestedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
    setIsRequestingSubject(true);
  };

  const addCustomSubject = () => {
    const custom = customSubjectText.trim();
    if (custom && !requestedSubjects.includes(custom)) {
      setRequestedSubjects([...requestedSubjects, custom]);
      setIsRequestingSubject(true);
    }
    setCustomSubjectText("");
  };

  const handleSubjectRequestSubmit = async () => {
    const finalSubjects = [...requestedSubjects];
    if (customSubjectText.trim() && !finalSubjects.includes(customSubjectText.trim())) {
      finalSubjects.push(customSubjectText.trim());
    }

    if (finalSubjects.length === 0) {
      setError("Please select or enter at least one subject.");
      return;
    }

    if (!subjectPreferredDays.trim() || !subjectPreferredTime.trim()) {
      setError("Please provide your preferred days and timing.");
      return;
    }

    setIsSubmittingSubjectRequest(true);
    setError("");

    try {
      const res = await fetch("/api/requests/new-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_phone: student.phone,
          student_name: displayStudentName,
          requested_subject: finalSubjects.join(", "),
          parent_name: autoParentName,
          class_grade: autoClassGrade,
          preferred_days: subjectPreferredDays,
          preferred_time: subjectPreferredTime,
          preferred_mode: subjectPreferredMode,
        }),
      });

      if (!res.ok) throw new Error();

      setSuccessMsg(`Your request for ${finalSubjects.join(", ")} has been sent to the admin.`);
      setRequestedSubjects([]);
      setCustomSubjectText("");
      setSubjectPreferredDays("");
      setSubjectPreferredTime("");
      setSubjectPreferredMode("online");
      setIsRequestingSubject(false);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit subject request. Please try again.");
    } finally {
      setIsSubmittingSubjectRequest(false);
    }
  };

  const handleGlobalReportSubmit = async () => {
    if (!globalReport.trim()) return;
    setIsSubmittingGlobalReport(true);
    setError("");

    try {
      const res = await fetch("/api/requests/general-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_phone: student.phone,
          student_name: displayStudentName,
          message: globalReport
        }),
      });

      if (!res.ok) throw new Error();

      setGlobalReportSuccess("Your feedback has been successfully submitted to the admin team.");
      setGlobalReport("");
      setTimeout(() => setGlobalReportSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit feedback.");
    } finally {
      setIsSubmittingGlobalReport(false);
    }
  };

  const handleTeacherChangeSubmit = async () => {
    if (!teacherChangeAssignmentId || !teacherChangeReason.trim()) {
      setError("Please select a subject and provide a reason.");
      return;
    }
    if (teacherChangeCount >= 2) {
      setError("You have reached the maximum limit of 2 teacher change requests.");
      return;
    }

    setIsSubmittingTeacherChange(true);
    setError("");

    try {
      const res = await fetch("/api/requests/teacher-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: Number(teacherChangeAssignmentId),
          student_phone: student.phone,
          student_name: displayStudentName,
          reason: teacherChangeReason
        }),
      });

      if (!res.ok) throw new Error();

      const newCount = teacherChangeCount + 1;
      setTeacherChangeCount(newCount);
      localStorage.setItem(`tc_count_${student.phone}`, newCount.toString());

      setTeacherChangeSuccess(`Teacher change request submitted successfully. (${newCount}/2 used)`);
      setTeacherChangeAssignmentId("");
      setTeacherChangeReason("");
      setTimeout(() => setTeacherChangeSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit request. Please try again.");
    } finally {
      setIsSubmittingTeacherChange(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/tuition/login");
  };

  if (!student) return null;

  const totalTuitions = results.length;
  const activeTuitions = results.filter((r) => ["assigned", "ongoing"].includes(r.application_status)).length;
  const totalDue = results.reduce((acc, curr) => {
    if (curr.current_cycle && curr.current_cycle.status !== "paid") {
      return acc + Number(curr.current_cycle.amount_due);
    }
    return acc;
  }, 0);
  const dueSoonCount = results.filter(
    (r) => r.current_cycle?.display_status === "due_soon" || r.current_cycle?.display_status === "overdue"
  ).length;

  const uniqueSubjects = Array.from(new Set(results.map((r) => r.subject)));
  const filteredResults = selectedSubjectFilter === "All" ? results : results.filter((r) => r.subject === selectedSubjectFilter);
  const currentlyEnrolledSubjects = new Set(results.map(r => r.subject.toLowerCase()));
  const otherAvailableSubjects = allOfferedSubjects.filter(sub => !currentlyEnrolledSubjects.has(sub.toLowerCase()));

  const assignmentsWithTeacher = results.filter(r => r.teacher_name && r.assignment_id);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gradient-to-br from-[#F8FAF5] via-white to-[#F0F4EC] dark:bg-none dark:bg-black transition-colors duration-500">
        <div className="mx-auto w-full max-w-[1400px] space-y-6 px-3 py-6 sm:px-6 sm:py-8 lg:px-10">

          {/* ========================================================================= */}
          {/* TOP HEADER */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#798321]/20 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-6">
            <div className="flex items-center gap-4">
              {/* RESTORED BOX WITH PERFECT FIT USING FILL */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#798321]/20 bg-gradient-to-tr from-[#798321]/10 to-[#FFC107]/10 p-2 shadow-inner sm:h-20 sm:w-20 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="relative h-full w-full">
                  <Image
                    src="/images/Rakvih Foundation.png"
                    alt="Rakvih Logo"
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-contain drop-shadow-sm"
                    priority
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#798321]/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                    <ShieldCheck size={12} /> Student Portal
                  </span>
                </div>
                <h1 className="text-lg font-black text-[#24310F] dark:text-white sm:text-2xl">
                  Welcome, {displayStudentName}
                </h1>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-[#798321]" /> {student.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchTuitions(student.phone)}
                title="Refresh data"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:bg-[#171717]"
              >
                <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 sm:px-4"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {dueSoonCount > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:text-amber-400">
              <AlertTriangle size={18} className="shrink-0" />
              <span>
                {dueSoonCount} tuition{dueSoonCount > 1 ? "s have" : " has"} a payment due
                soon or overdue — check the cards below.
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400">Total Enrolled</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{totalTuitions}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400">Active Tuitions</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{activeTuitions}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Receipt size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400">This Month's Due</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  ₹{totalDue.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SIDE-BY-SIDE GRID FOR PROFILE & SUBJECT REQUEST */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6 mt-6">
            
            {/* 👤 LEFT CARD: STUDENT PROFILE DETAILS (Now Clean & Compact) */}
            <div className="flex w-full flex-col justify-between rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-5 lg:col-span-4 h-full">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-black text-[#24310F] dark:text-white">
                  <User size={16} className="text-[#798321] dark:text-[#FFC107]" /> Student Details
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-1">Your registered profile info.</p>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-gray-100/50 pb-2 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400">Name</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{displayStudentName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100/50 pb-2 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400">Parent Name</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{autoParentName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100/50 pb-2 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400">Class/Grade</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{autoClassGrade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400">Phone</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{student.phone}</span>
                </div>
              </div>
            </div>

            {/* 📚 RIGHT CARD: EXPLORE & REQUEST SUBJECTS (Now Clean & Compact) */}
            <div className="flex w-full flex-col rounded-2xl border border-[#798321]/20 bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-5 lg:col-span-8 h-full">
              <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-black text-[#24310F] dark:text-white">
                    <BookOpen size={16} className="text-[#798321] dark:text-[#FFC107]" /> Explore Subjects
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-1">Enrich your learning with new classes.</p>
                </div>
                {!isRequestingSubject && requestedSubjects.length === 0 && (
                  <button
                    onClick={() => setIsRequestingSubject(true)}
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#798321] to-[#FFC107] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <PlusCircle size={12} /> Request
                  </button>
                )}
              </div>

              {/* ALWAYS SHOW SUBJECTS IF AVAILABLE */}
              <div className="flex flex-wrap gap-1.5">
                {isFetchingSubjects ? (
                  <span className="text-[11px] text-gray-400">Checking available subjects...</span>
                ) : otherAvailableSubjects.length > 0 ? (
                  otherAvailableSubjects.slice(0, 10).map((sub, idx) => {
                    const isSelected = requestedSubjects.includes(sub);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSubject(sub)}
                        className={clsx(
                          "flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-all",
                          isSelected
                            ? "bg-[#798321] text-white shadow-sm hover:bg-[#6B7328] dark:bg-[#FFC107] dark:text-black"
                            : "bg-[#798321]/10 text-[#798321] hover:bg-[#798321]/20 dark:bg-[#FFC107]/10 dark:text-[#FFC107] dark:hover:bg-[#FFC107]/20"
                        )}
                      >
                        {sub}
                        {isSelected && <XCircle size={12} className="ml-0.5" />}
                      </button>
                    )
                  })
                ) : (
                  <span className="text-[11px] font-medium text-gray-400">You are enrolled in all our active subjects!</span>
                )}
              </div>

              {/* REQUEST FORM - Compact Layout */}
              {(isRequestingSubject || requestedSubjects.length > 0) && (
                <div className="mt-3 flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-neutral-800 dark:bg-[#171717]">
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customSubjectText}
                      onChange={(e) => setCustomSubjectText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSubject(); } }}
                      placeholder="Type custom subject & press Enter..."
                      className="w-full flex-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                    />
                    <button
                      onClick={addCustomSubject}
                      className="rounded-md bg-gray-200 px-3 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 whitespace-nowrap"
                    >
                      Add Custom
                    </button>
                  </div>

                  {/* Show custom subjects that aren't in the default list */}
                  {requestedSubjects.filter(sub => !otherAvailableSubjects.includes(sub)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {requestedSubjects.filter(sub => !otherAvailableSubjects.includes(sub)).map(sub => (
                        <span key={sub} className="flex items-center gap-1 rounded-full bg-[#798321] px-2.5 py-0.5 text-[10px] font-bold text-white dark:bg-[#FFC107] dark:text-black">
                          {sub}
                          <button onClick={() => toggleSubject(sub)} className="hover:text-red-200 dark:hover:text-red-600"><XCircle size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-gray-200 pt-2 mt-1 dark:border-neutral-800">
                    <div>
                      <label className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Days</label>
                      <input
                        type="text"
                        value={subjectPreferredDays}
                        onChange={(e) => setSubjectPreferredDays(e.target.value)}
                        placeholder="e.g. Mon, Wed"
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Time</label>
                      <input
                        type="text"
                        value={subjectPreferredTime}
                        onChange={(e) => setSubjectPreferredTime(e.target.value)}
                        placeholder="e.g. 5 PM"
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Mode</label>
                      <select
                        value={subjectPreferredMode}
                        onChange={(e) => setSubjectPreferredMode(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                      >
                        <option value="online">Online</option>
                        <option value="home">Home</option>
                        <option value="offline">Center</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={handleSubjectRequestSubmit} disabled={isSubmittingSubjectRequest || (requestedSubjects.length === 0 && !customSubjectText.trim())} className="flex-1 rounded-md bg-[#798321] py-1.5 text-[11px] font-bold text-white hover:bg-[#6B7328] disabled:opacity-50 transition-colors">
                      {isSubmittingSubjectRequest ? "Sending..." : "Submit Request"}
                    </button>
                    <button onClick={() => { setIsRequestingSubject(false); setRequestedSubjects([]); setCustomSubjectText(""); setSubjectPreferredDays(""); setSubjectPreferredTime(""); setSubjectPreferredMode("online"); }} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 hover:bg-gray-50 dark:border-neutral-800 dark:bg-transparent dark:text-neutral-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <h2 className="text-lg font-black text-[#24310F] dark:text-white">
                Tuition Applications & Assignments
              </h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Detailed overview of your registered classes, assigned faculty, and fee statuses.
              </p>
            </div>

            {uniqueSubjects.length > 1 && (
              <div className="relative inline-block w-full sm:w-auto">
                <select
                  value={selectedSubjectFilter}
                  onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white/80 backdrop-blur-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-700 shadow-sm outline-none focus:border-[#798321] focus:ring-2 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                >
                  <option value="All">All Subjects</option>
                  {uniqueSubjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-r-transparent"></div>
              <p className="mt-4 text-sm font-semibold text-gray-500 dark:text-neutral-400">
                Retrieving tuition records...
              </p>
            </div>
          )}

          {!loading && filteredResults.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white/50 p-12 text-center dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                <BookOpen size={32} className="text-gray-400 dark:text-neutral-500" />
              </div>
              <p className="mt-4 text-base font-bold text-gray-700 dark:text-neutral-300">
                No classes found
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-gray-400">
                No registered tuition records match your current view.
              </p>
            </div>
          )}

          <div className="grid gap-6">
            {filteredResults.map((item) => {
              const statusCfg = statusStyles[item.application_status] || {
                bg: "bg-gray-100",
                text: "text-gray-600",
                border: "border-gray-200",
                icon: Clock,
                label: item.application_status,
              };
              const StatusIcon = statusCfg.icon;

              const cycle = item.current_cycle;
              const cycleCfg = cycle ? cycleBadgeStyles[cycle.display_status] : null;
              const CycleIcon = cycleCfg?.icon;

              const isFullyPaid = cycle ? cycle.status === "paid" || cycle.status === "waived" : false;
              const formattedStart = formatDate(item.start_date);
              const isClassDayToday = isScheduledDayToday(item.schedule_days);

              const todayStr = getTodayDateString();
              const todayRecord = item.attendance_summary?.recent.find(
                (a) => a.class_date?.slice(0, 10) === todayStr
              );
              const todayStatus = todayRecord?.status || "scheduled";
              const todayStatusCfg = attendanceStatusStyles[todayStatus] || attendanceStatusStyles.scheduled;
              const TodayStatusIcon = todayStatusCfg.icon;
              const isMarkingThis = markingId === item.assignment_id;
              const alreadyMarked = todayStatus !== "scheduled";
              const isPayingThis = payingId === item.assignment_id;

              return (
                <div
                  key={item.application_id}
                  className="group relative overflow-hidden rounded-3xl border border-[#798321]/20 bg-white/90 p-4 shadow-xl shadow-black/[0.03] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                        <Hash size={12} className="text-[#798321]" /> App ID: #{item.application_id}
                      </span>
                      {item.assignment_id && (
                        <span className="flex items-center gap-1 rounded-lg bg-[#798321]/10 px-2.5 py-1 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                          Assignment ID: #{item.assignment_id}
                        </span>
                      )}
                      {item.created_at && (
                        <span className="flex items-center gap-1 text-[11px] font-normal text-gray-400">
                          <Calendar size={12} /> {formatDate(item.created_at)}
                        </span>
                      )}
                    </div>

                    <div
                      className={clsx(
                        "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold capitalize shadow-sm",
                        statusCfg.bg,
                        statusCfg.text,
                        statusCfg.border
                      )}
                    >
                      <StatusIcon size={14} />
                      <span>{statusCfg.label}</span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
                    
                    {/* 🚀 REMOVED REDUNDANT STUDENT DETAILS HERE - FOCUSED ON SUBJECT NOW */}
                    <div className="space-y-4 lg:col-span-4">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#798321]/20 to-[#FFC107]/20 text-[#798321] dark:text-[#FFC107]">
                            <BookOpen size={20} />
                          </div>
                          <div className="min-w-0">
                            {/* Subject is now the main header */}
                            <h3 className="truncate text-lg font-black tracking-tight text-[#24310F] dark:text-white sm:text-xl">
                              {item.subject} Tuition
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-gray-600 dark:text-neutral-300">
                              <span className="flex items-center gap-1 font-bold text-[#798321] dark:text-[#FFC107]">
                                <GraduationCap size={14} /> Class Details
                              </span>
                              {item.preferred_mode && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">{item.preferred_mode} Mode</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                          Assigned Faculty
                        </span>
                        {item.teacher_name ? (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <UserCheck size={16} className="text-[#798321] dark:text-[#FFC107]" />
                              <h4 className="text-sm font-black text-gray-900 dark:text-white">
                                {item.teacher_name}
                              </h4>
                            </div>
                            {item.teacher_phone && (
                              <p className="pl-6 text-xs text-gray-500 dark:text-neutral-400">
                                Contact: {item.teacher_phone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Clock size={16} />
                            <span>Faculty allocation in progress</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 lg:col-span-8">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                        {cycle ? (
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-xs font-bold text-gray-700 dark:text-white">
                                  {formatMonth(cycle.period_start)}
                                </span>
                                {cycleCfg && CycleIcon && (
                                  <span
                                    className={clsx(
                                      "flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold shadow-sm",
                                      cycleCfg.bg,
                                      cycleCfg.text,
                                      cycleCfg.border
                                    )}
                                  >
                                    <CycleIcon size={13} />
                                    {cycleCfg.label(cycle)}
                                  </span>
                                )}
                              </div>

                              <div className="text-xs font-semibold text-gray-600 dark:text-neutral-300">
                                Amount: <strong className="text-gray-900 dark:text-white">₹{Number(cycle.amount_due).toLocaleString("en-IN")}</strong>
                                <span className="ml-2 text-gray-400">
                                  · Due {formatDate(cycle.due_date)}
                                </span>
                              </div>
                            </div>

                            {!isFullyPaid && (
                              <button
                                onClick={() => handlePay(item)}
                                disabled={isPayingThis}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#798321] to-[#99a628] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                              >
                                {isPayingThis && (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                                )}
                                <CreditCard size={16} />
                                {isPayingThis ? "Opening payment..." : `Pay ₹{Number(cycle.amount_due).toLocaleString("en-IN")}`}
                              </button>
                            )}

                            {isFullyPaid && item.next_cycle && (
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/60 pt-3 text-xs text-gray-500 dark:border-neutral-800 dark:text-neutral-400">
                                <span className="flex items-center gap-1.5">
                                  <CalendarDays size={13} className="text-[#798321] dark:text-[#FFC107]" />
                                  Next payment: {formatMonth(item.next_cycle.period_start)}
                                </span>
                                <span className="font-semibold text-gray-700 dark:text-neutral-300">
                                  ₹{Number(item.next_cycle.amount_due).toLocaleString("en-IN")} due {formatDate(item.next_cycle.due_date)}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Clock size={18} className="shrink-0" />
                            <span>
                              Tuition fee details are awaiting final confirmation from the academic office.
                            </span>
                          </div>
                        )}
                      </div>

                      {isFullyPaid ? (
                        <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 dark:border-emerald-500/20 sm:p-5">
                          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                                <CheckCircle2 size={18} />
                              </span>
                              <div>
                                <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-300">
                                  Schedule & Class Information
                                </h4>
                                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                  {cycle ? `${formatMonth(cycle.period_start)} paid. ` : ""}Your class access details are active below.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                            <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-[#0a0a0a]">
                              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                                <UserCheck size={12} className="text-[#798321] dark:text-[#FFC107]" /> Teacher
                              </span>
                              <p className="mt-1 font-black text-gray-900 dark:text-white">
                                {item.teacher_name || "Assigned"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-[#0a0a0a]">
                              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                                <CalendarClock size={12} className="text-[#798321] dark:text-[#FFC107]" /> Start Date
                              </span>
                              <p className="mt-1 font-black text-gray-900 dark:text-white">
                                {formattedStart || "To be confirmed"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-[#0a0a0a]">
                              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                                <Clock size={12} className="text-[#798321] dark:text-[#FFC107]" /> Timing & Days
                              </span>
                              <p className="mt-1 font-black text-gray-900 dark:text-white">
                                {item.schedule_days || "Days N/A"}{" "}
                                {item.schedule_time ? `(${item.schedule_time})` : ""}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-[#0a0a0a]">
                              <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                                <Video size={12} className="text-indigo-500" /> Meeting Link
                              </span>
                              {item.meeting_link ? (
                                <a
                                  href={item.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 inline-flex items-center gap-1.5 font-black text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                  <span>Join Online Class</span>
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <p className="mt-1 text-xs font-semibold text-gray-400">
                                  Home / Link pending
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={clsx(
                            "flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold",
                            cycle?.display_status === "overdue"
                              ? "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400"
                              : "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                          )}
                        >
                          <Lock size={16} className="shrink-0" />
                          <span>
                            {cycle?.display_status === "overdue"
                              ? "This month's payment is overdue — class schedule and meeting link are locked until it's cleared."
                              : "Complete this month's payment to unlock class schedule and meeting link details."}
                          </span>
                        </div>
                      )}

                      {isFullyPaid && item.attendance_summary && (
                        <div className="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                          <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Attendance Summary
                          </h3>

                          {isClassDayToday ? (
                            <>
                              <div
                                className={clsx(
                                  "rounded-xl border p-3",
                                  todayStatusCfg.bg,
                                  todayStatusCfg.border
                                )}
                              >
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                  Today's Class: {item.schedule_time || "Time N/A"}
                                </p>
                                <p
                                  className={clsx(
                                    "mt-1 flex items-center gap-1.5 text-xs font-bold",
                                    todayStatusCfg.text
                                  )}
                                >
                                  <TodayStatusIcon size={13} />
                                  Status: {todayStatusCfg.label}
                                </p>
                              </div>

                              <button
                                onClick={() => handleMarkAttendance(item, "held")}
                                disabled={isMarkingThis || alreadyMarked}
                                className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isMarkingThis && (
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-r-transparent" />
                                )}
                                {isMarkingThis
                                  ? "Marking..."
                                  : alreadyMarked
                                  ? `Marked as ${todayStatusCfg.label}`
                                  : "Mark Today's Attendance"}
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                              <CalendarOff size={16} className="shrink-0" />
                              <span>
                                No class is scheduled today
                                {item.schedule_days ? ` (scheduled: ${item.schedule_days})` : ""}.
                              </span>
                            </div>
                          )}

                          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-[#171717]">
                            <div className="flex items-center gap-2">
                              <CalendarCheck size={16} className="text-[#798321] dark:text-[#FFC107]" />
                              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                                Attendance
                              </h4>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                              <div className="rounded-xl bg-white/80 p-2 dark:bg-[#0a0a0a]">
                                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                  {item.attendance_summary.held}
                                </p>
                                <p className="text-[10px] font-semibold text-gray-400">Held</p>
                              </div>
                              <div className="rounded-xl bg-white/80 p-2 dark:bg-[#0a0a0a]">
                                <p className="text-lg font-black text-rose-600 dark:text-rose-400">
                                  {item.attendance_summary.missed}
                                </p>
                                <p className="text-[10px] font-semibold text-gray-400">Missed</p>
                              </div>
                              <div className="rounded-xl bg-white/80 p-2 dark:bg-[#0a0a0a]">
                                <p className="text-lg font-black text-gray-400">
                                  {item.attendance_summary.cancelled}
                                </p>
                                <p className="text-[10px] font-semibold text-gray-400">Cancelled</p>
                              </div>
                              <div className="rounded-xl bg-white/80 p-2 dark:bg-[#0a0a0a]">
                                <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                                  {item.attendance_summary.scheduled}
                                </p>
                                <p className="text-[10px] font-semibold text-gray-400">Upcoming</p>
                              </div>
                            </div>

                            {item.attendance_summary.recent.length > 0 && (
                              <div className="mt-3 space-y-1.5 border-t border-gray-200/60 pt-3 dark:border-neutral-800">
                                {item.attendance_summary.recent.map((a, i) => (
                                  <div key={i} className="flex items-center justify-between text-[11px]">
                                    <span className="text-gray-600 dark:text-neutral-300">{formatDate(a.class_date)}</span>
                                    <span
                                      className={clsx(
                                        "flex items-center gap-1 font-semibold capitalize",
                                        a.status === "held" && "text-emerald-600 dark:text-emerald-400",
                                        a.status === "missed" && "text-rose-600 dark:text-rose-400",
                                        a.status === "cancelled" && "text-gray-400",
                                        a.status === "scheduled" && "text-blue-600 dark:text-blue-400"
                                      )}
                                    >
                                      {a.status === "held" && <CalendarCheck size={12} />}
                                      {a.status === "missed" && <XCircle size={12} />}
                                      {a.status === "cancelled" && <CalendarX2 size={12} />}
                                      {a.status === "scheduled" && <CalendarDays size={12} />}
                                      {a.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* SEPARATE TEACHER CHANGE REQUEST SECTION (MAX 2 LIMIT) */}
          {/* ========================================================================= */}
          {assignmentsWithTeacher.length > 0 && (
            <div className="mt-12 rounded-3xl border border-[#798321]/20 bg-white/90 p-4 shadow-xl shadow-black/[0.03] backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-black text-[#24310F] dark:text-white">
                    <UserCog size={20} className="text-[#798321] dark:text-[#FFC107]" />
                    Request Teacher Change
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    If you are unsatisfied with your current faculty, you can request a change here.
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={clsx("rounded-full px-3 py-1 text-xs font-bold", teacherChangeCount >= 2 ? "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400")}>
                    {teacherChangeCount} / 2 Requests Used
                  </span>
                </div>
              </div>

              {teacherChangeSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 size={18} /> {teacherChangeSuccess}
                </div>
              )}

              {teacherChangeCount >= 2 ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
                  <AlertCircle size={18} className="mb-2 inline-block" /> You have reached the maximum limit for teacher change requests. Please contact support directly if you need further assistance.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-neutral-300">Select Subject/Teacher</label>
                    <select
                      value={teacherChangeAssignmentId}
                      onChange={(e) => setTeacherChangeAssignmentId(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107]"
                    >
                      <option value="" disabled>-- Select a class --</option>
                      {assignmentsWithTeacher.map(item => (
                        <option key={item.assignment_id} value={item.assignment_id || ""}>
                          {item.subject} (Current Teacher: {item.teacher_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-neutral-300">Reason for change</label>
                    <textarea
                      value={teacherChangeReason}
                      onChange={(e) => setTeacherChangeReason(e.target.value)}
                      placeholder="Please explain why you need a different teacher..."
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-800 outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107]"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleTeacherChangeSubmit}
                    disabled={isSubmittingTeacherChange}
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isSubmittingTeacherChange ? "Submitting Request..." : "Submit Change Request"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============ GLOBAL REPORT / FEEDBACK SEPARATE SECTION ============ */}
          <div className="mt-8 rounded-3xl border border-[#798321]/20 bg-white/90 p-4 shadow-xl shadow-black/[0.03] backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-6">
            <h3 className="flex items-center gap-2 text-lg font-black text-[#24310F] dark:text-white">
              <MessageSquareWarning size={20} className="text-[#798321] dark:text-[#FFC107]" />
              Report an Issue or Feedback
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Facing a technical issue, have feedback on our process, or need general help? Let the admin team know below.
            </p>

            {globalReportSuccess ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 size={18} /> {globalReportSuccess}
              </div>
            ) : (
              <div className="mt-4">
                <textarea
                  value={globalReport}
                  onChange={(e) => setGlobalReport(e.target.value)}
                  placeholder="Describe your issue or feedback in detail..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-800 outline-none focus:border-[#798321] dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107]"
                  rows={4}
                />
                <button
                  onClick={handleGlobalReportSubmit}
                  disabled={isSubmittingGlobalReport}
                  className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmittingGlobalReport ? "Sending to Admin..." : <><Send size={16} /> Submit Feedback</>}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}