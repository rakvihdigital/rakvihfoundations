"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";
import {
  X,
  Search,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  CalendarClock,
  Video,
  Eye,
  CalendarDays,
  CheckCircle,
  XCircle,
  Ban,
  IndianRupee,
  Receipt,
  Info,
  Globe2,
  UserCog,
  MessageSquareWarning,
  PlusCircle,
  Check,
  Phone
} from "lucide-react";

type TuitionRow = {
  application_id: number;
  parent_name: string;
  parent_phone: string;
  student_name: string;
  student_grade: string;
  subject: string;
  mode: string;
  application_status: "pending" | "assigned" | "ongoing" | "completed" | "cancelled";
  applied_on: string;
  assignment_id: number | null;
  teacher_id: number | null;
  teacher_name: string | null;
  fee_amount: number | null;
  payment_status: "not_assigned" | "unpaid" | "partial" | "paid";
  is_active: boolean;
  schedule_days?: string | null;
  schedule_time?: string | null;
  start_date?: string | null;
  meeting_link?: string | null;
  // preference captured at request time (before a teacher is assigned).
  preferred_schedule_days?: string | null;
  preferred_schedule_time?: string | null;
  preferred_mode?: string | null;
  // 🚀 NEW: tracks whether this application originated from a student's
  // "Request New Subject" form, so AssignModal knows to send the
  // "approved & set up" email once a teacher/schedule is actually confirmed
  // (instead of immediately on Accept, before any of that exists).
  origin?: string | null;
  // 🚀 NEW: needed so the confirmation emails have somewhere to go.
  parent_email?: string | null;
};

type Teacher = { id: number; name: string; subjects: string };

type AttendanceRecord = {
  id: number;
  assignment_id: number;
  class_date: string;
  status: "scheduled" | "held" | "missed" | "cancelled";
  teacher_status: "scheduled" | "held" | "missed" | "cancelled";
  notes: string | null;
  teacher_notes: string | null;
};

type BillingCycle = {
  id: number;
  assignment_id: number;
  period_start: string;
  period_end: string;
  due_date: string;
  amount_due: number;
  status: "due" | "paid" | "waived";
  paid_at: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
};

// TYPE FOR STUDENT REQUESTS
type StudentRequest = {
  id: number;
  student_phone: string;
  student_name: string;
  request_type: "new_subject" | "teacher_change" | "general_report";
  subject: string | null;
  assignment_id: number | null;
  details: string | null; 
  status: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30",
  assigned: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
  ongoing: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30",
};

const paymentStyles: Record<string, string> = {
  not_assigned: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  unpaid: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  partial: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
};

const attendanceStyles: Record<string, string> = {
  scheduled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  held: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  missed: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  cancelled: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

const billingStyles: Record<string, string> = {
  due: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  waived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const DAY_MAP: Record<string, number> = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };

function parseScheduleDays(scheduleDays?: string | null): Set<number> {
  const set = new Set<number>();
  if (!scheduleDays) return set;
  const parts = scheduleDays.split(/[,/&]+/).map((p) => p.trim().toLowerCase()).filter(Boolean);
  for (const p of parts) { if (p in DAY_MAP) set.add(DAY_MAP[p]); }
  return set;
}

function countElapsedClassDays(startDate?: string | null, scheduleDays?: string | null, endDate: Date = new Date()): { occurred: number; totalDatesGenerated: string[] } {
  if (!startDate || !scheduleDays) return { occurred: 0, totalDatesGenerated: [] };
  const dayNums = parseScheduleDays(scheduleDays);
  if (dayNums.size === 0) return { occurred: 0, totalDatesGenerated: [] };
  const start = new Date(startDate + "T00:00:00");
  const today = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  if (start > today) return { occurred: 0, totalDatesGenerated: [] };
  let count = 0;
  const dates: string[] = [];
  const cursor = new Date(start);
  let i = 0;
  while (cursor <= today && i < 3650) {
    if (dayNums.has(cursor.getDay())) {
      count++;
      dates.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setDate(cursor.getDate() + 1);
    i++;
  }
  return { occurred: count, totalDatesGenerated: dates };
}

const SUBJECT_ALIASES: Record<string, string> = { maths: "math", math: "math", mathematics: "math", science: "science", "general science": "science", physics: "physics", chemistry: "chemistry", biology: "biology", english: "english", hindi: "hindi", social: "social studies", "social science": "social studies", "social studies": "social studies", history: "history", geography: "geography", civics: "civics", economics: "economics", accountancy: "accountancy", "business studies": "business studies", computer: "computer science", "computer science": "computer science", evs: "evs" };

function normalizeSubject(raw: string): string {
  const cleaned = raw.trim().toLowerCase();
  return SUBJECT_ALIASES[cleaned] || cleaned;
}

function teacherSubjectKeys(subjects: string): string[] {
  return subjects.split(",").map((s) => s.trim()).filter(Boolean).map(normalizeSubject);
}

// parses the pipe-separated "details" string produced by the student
// portal's "Request New Subject" form, e.g.
// "Parent Name: Asha | Class: 10 | Preferred Days: Mon, Wed | Preferred Time: 5-6 PM | Preferred Mode: online"
// into a lookup object: { "Parent Name": "Asha", "Class": "10", ... }
function parseRequestDetails(details: string | null): Record<string, string> {
  if (!details) return {};
  const result: Record<string, string> = {};
  details.split("|").forEach((part) => {
    const [key, ...rest] = part.split(":");
    if (key && rest.length) {
      const value = rest.join(":").trim();
      if (value && value !== "N/A") {
        result[key.trim()] = value;
      }
    }
  });
  return result;
}

export default function AdminTuitionPage() {
  const [rows, setRows] = useState<TuitionRow[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeRow, setActiveRow] = useState<TuitionRow | null>(null);
  const [viewRow, setViewRow] = useState<TuitionRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "active" | "inactive" | "pending">("all");
  
  const [resolvingRequestId, setResolvingRequestId] = useState<number | null>(null);
  const [acceptingSubjectId, setAcceptingSubjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [rowsRes, teachersRes, requestsRes] = await Promise.all([
        fetch("/api/admin/tuition").then((r) => r.json()),
        fetch("/api/admin/teachers").then((r) => r.json()),
        supabase.from("student_requests").select("*").eq("status", "pending").order('created_at', { ascending: false })
      ]);
      setRows(rowsRes.data || []);
      setTeachers(teachersRes.data || []);
      if (requestsRes.data) {
        setStudentRequests(requestsRes.data as StudentRequest[]);
      }
    } catch (err) {
      console.error("Failed to load tuition data", err);
    } finally {
      setLoading(false);
    }
  }

  const resolveRequest = async (id: number) => {
    try {
      await supabase.from("student_requests").update({ status: "resolved" }).eq("id", id);
      setStudentRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to resolve request:", err);
    }
  };

  // 🚀 1-CLICK INSTANT ACCEPT FOR NEW SUBJECTS
  // 🚀 UPDATED: no longer sends the "approved & set up" email here. That
  // email is misleading at this point — nothing is actually set up yet
  // (no teacher, no schedule, no fee). Instead, this just creates the
  // application row and tags it with `origin: "student_new_subject_request"`
  // so AssignModal knows to send the confirmation email later, once the
  // admin actually assigns a teacher and confirms a schedule/fee.
  const handleAcceptSubject = async (req: StudentRequest) => {
    setAcceptingSubjectId(req.id);
    try {
      const info = parseRequestDetails(req.details);

      const allowedModes = ["home", "online", "offline"];
      const requestedMode = (info["Preferred Mode"] || "").toLowerCase();
      const resolvedMode = allowedModes.includes(requestedMode) ? requestedMode : "home";

      const { error: dbError } = await supabase.from('tuition_applications').insert({
        student_name: req.student_name,
        parent_phone: req.student_phone, 
        parent_name: info["Parent Name"] || "Self / Not Provided",
        subject: req.subject || "Requested Subject",
        student_grade: info["Class"] || "TBD", 
        mode: resolvedMode,
        status: "pending", 
        is_active: true,
        preferred_schedule_days: info["Preferred Days"] || null,
        preferred_schedule_time: info["Preferred Time"] || null,
        preferred_mode: requestedMode || null,
        // 🚀 NEW: marks this application as originating from a student's
        // "Request New Subject" form.
        origin: "student_new_subject_request",
      });

      if (dbError) {
        // 🚀 NEW: unique_tuition_phone_subject means this parent_phone +
        // subject combo already exists — most likely the student already
        // has an application for this subject and this is a duplicate
        // request, rather than a real database problem.
        if ((dbError as any).code === "23505") {
          alert(
            `${req.student_name} already has an application for "${req.subject}". ` +
            `Check the main table instead of creating a duplicate.`
          );
        } else {
          throw dbError;
        }
        return;
      }

      // Mark the request as resolved so the card disappears
      await resolveRequest(req.id);
      
      // Fetch the table again so the new application appears instantly
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(`Database Error: ${err.message}`);
    } finally {
      setAcceptingSubjectId(null);
    }
  };

  const handleReassignClick = (assignmentId: number | null, requestId: number) => {
    if (!assignmentId) return;
    const targetRow = rows.find(r => r.assignment_id === assignmentId);
    if (targetRow) {
      setActiveRow(targetRow);
      setResolvingRequestId(requestId);
    } else {
      alert("Could not find the active assignment for this student. Please search for them in the table manually.");
    }
  };

  const toggleStatus = async (applicationId: number, currentStatus: boolean) => {
    const targetId = applicationId;
    if (!targetId) return;

    const newStatus = !currentStatus;
    setRows((prevRows) => prevRows.map((r) => r.application_id === targetId ? { ...r, is_active: newStatus } : r));

    try {
      const res = await fetch(`/api/admin/tuition/${targetId}/toggle-active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to save state to server");
    } catch (err) {
      console.error("Failed to toggle status", err);
      fetchData();
    }
  };

  const stats = useMemo(() => {
    return {
      total: rows.length,
      pending: rows.filter((r) => r.application_status === "pending").length,
      assigned: rows.filter((r) => r.application_status === "assigned" || r.application_status === "ongoing").length,
      active: rows.filter((r) => r.is_active).length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.subject.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (tabFilter === "active") return row.is_active;
      if (tabFilter === "inactive") return !row.is_active;
      if (tabFilter === "pending") return row.application_status === "pending";
      return true;
    });
  }, [rows, searchQuery, tabFilter]);

  const pendingTeacherChanges = studentRequests.filter(r => r.request_type === "teacher_change");
  const pendingReports = studentRequests.filter(r => r.request_type === "general_report");
  const pendingNewSubjects = studentRequests.filter(r => r.request_type === "new_subject");

  return (
    <div className="min-h-screen space-y-8 bg-[#F8FAF6] p-6 dark:bg-[#0B132B]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#24310F] dark:text-white">
            Tuition Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Allocate teachers, manage fee allocations, and track enrollment activities.
          </p>
        </div>
      </div>

      {/* ACTION REQUIRED CARDS: New Subjects, Teacher Changes, and Reports */}
      {(pendingNewSubjects.length > 0 || pendingTeacherChanges.length > 0 || pendingReports.length > 0) && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <AlertCircle size={18} /> Action Required: Student Requests
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* 1. New Subject Requests (1-CLICK ACCEPT) */}
            {pendingNewSubjects.map(req => {
              const info = parseRequestDetails(req.details);
              return (
                <div key={req.id} className="flex flex-col justify-between rounded-xl border border-blue-200 bg-white p-4 shadow-sm dark:border-blue-900/30 dark:bg-[#132238] transition-all hover:shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <PlusCircle size={14} className="text-blue-500" /> NEW SUBJECT REQUEST
                      </div>
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </div>
                    </div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{req.subject}</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2">Student: {req.student_name}</p>

                    {(info["Parent Name"] || info["Class"]) && (
                      <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-gray-500 dark:text-gray-400">
                        {info["Parent Name"] && <span>Parent: {info["Parent Name"]}</span>}
                        {info["Class"] && <span>Class: {info["Class"]}</span>}
                      </div>
                    )}

                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1"><Phone size={10}/> {req.student_phone}</p>

                    {(info["Preferred Days"] || info["Preferred Time"] || info["Preferred Mode"]) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {info["Preferred Days"] && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                            <CalendarDays size={10} /> {info["Preferred Days"]}
                          </span>
                        )}
                        {info["Preferred Time"] && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                            <Clock size={10} /> {info["Preferred Time"]}
                          </span>
                        )}
                        {info["Preferred Mode"] && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold capitalize text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                            <Globe2 size={10} /> {info["Preferred Mode"]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleAcceptSubject(req)} 
                      disabled={acceptingSubjectId === req.id}
                      className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {acceptingSubjectId === req.id ? "Setting up..." : "Accept & Setup"}
                    </button>
                    <button onClick={() => resolveRequest(req.id)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}

            {/* 2. Teacher Change Requests */}
            {pendingTeacherChanges.map(req => (
              <div key={req.id} className="flex flex-col justify-between rounded-xl border border-amber-200 bg-white p-4 shadow-sm dark:border-amber-900/30 dark:bg-[#132238] transition-all hover:shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <UserCog size={14} className="text-amber-500" /> TEACHER CHANGE
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{req.student_name}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10}/> {req.student_phone}</p>
                  <div className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-gray-700 dark:bg-[#0F1E33] dark:text-gray-300 border border-amber-100 dark:border-white/5">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Reason:</span> {req.details}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleReassignClick(req.assignment_id, req.id)} className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors shadow-sm">
                    Reassign Teacher
                  </button>
                  <button onClick={() => resolveRequest(req.id)} className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}

            {/* 3. General Feedback / Reports */}
            {pendingReports.map(req => (
              <div key={req.id} className="flex flex-col justify-between rounded-xl border border-rose-200 bg-white p-4 shadow-sm dark:border-rose-900/30 dark:bg-[#132238] transition-all hover:shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-500">
                    <MessageSquareWarning size={14} className="text-rose-500" /> FEEDBACK / ISSUE
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{req.student_name}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10}/> {req.student_phone}</p>
                  <div className="mt-3 rounded-lg bg-rose-50 p-2 text-xs text-gray-700 dark:bg-[#0F1E33] dark:text-gray-300 border border-rose-100 dark:border-white/5">
                    <span className="font-semibold text-rose-700 dark:text-rose-400">Message:</span> {req.details}
                  </div>
                </div>
                <button onClick={() => resolveRequest(req.id)} className="mt-4 w-full rounded-lg bg-rose-100 py-2 text-xs font-bold text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-colors shadow-sm">
                  Mark as Reviewed
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Counter Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Applications" value={stats.total} icon={<Users className="text-indigo-600" />} />
        <StatCard title="Pending Review" value={stats.pending} icon={<Clock className="text-amber-500" />} />
        <StatCard title="Assigned / Active Class" value={stats.assigned} icon={<CheckCircle2 className="text-emerald-600" />} />
        <StatCard title="Active Status" value={stats.active} icon={<Sparkles className="text-blue-500" />} />
      </div>

      {/* Filters & Control Panel */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-[#111D38] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-xl bg-gray-100/80 p-1 dark:bg-[#0B132B]">
          {(["all", "active", "inactive", "pending"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTabFilter(tab)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                tabFilter === tab
                  ? "bg-white text-[#24310F] shadow-sm dark:bg-[#1E2D4A] dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student, parent, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-transparent py-2 pl-9 pr-4 text-xs dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
          />
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E8ECE5] bg-white shadow-sm dark:border-[#1E3A5F] dark:bg-[#111D38]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAF5] border-b border-[#E8ECE5] text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-[#1E3A5F] dark:bg-[#0F1E33] dark:text-gray-400">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Subject & Mode</th>
                <th className="px-5 py-4">Assigned Teacher</th>
                <th className="px-5 py-4">Schedule</th>
                <th className="px-5 py-4">Fee Structure</th>
                <th className="px-5 py-4">App Status</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4 text-center">Active State</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              
              {loading && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                    Loading records...
                  </td>
                </tr>
              )}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                    No records found matching your selection criteria.
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => (
                <tr
                  key={row.application_id}
                  className={clsx(
                    "transition-colors hover:bg-[#F8FAF5]/60 dark:hover:bg-[#0F1E33]/60",
                    !row.is_active && "opacity-60 bg-gray-50/50 dark:bg-gray-900/20"
                  )}
                >
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                    {row.student_name}
                    <div className="text-xs font-normal text-gray-400">{row.student_grade}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-gray-800 dark:text-gray-200">{row.parent_name}</div>
                    <div className="text-xs text-gray-400">{row.parent_phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{row.subject}</div>
                    <span className="text-xs capitalize text-gray-400">{row.mode}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                    {row.teacher_name || <span className="italic text-gray-400">Unassigned</span>}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">
                    {row.schedule_days || row.schedule_time || row.start_date ? (
                      <div className="space-y-0.5">
                        {row.start_date && (
                          <div className="flex items-center gap-1">
                            <CalendarClock size={11} className="text-[#798321] dark:text-[#FFC107]" />
                            <span>
                              {new Date(row.start_date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {row.schedule_days && <div>{row.schedule_days}</div>}
                        {row.schedule_time && <div>{row.schedule_time}</div>}
                        {row.meeting_link && (
                          <a
                            href={row.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-semibold text-indigo-600 underline dark:text-indigo-400"
                          >
                            <Video size={11} /> Link
                          </a>
                        )}
                      </div>
                    ) : row.preferred_schedule_days || row.preferred_schedule_time ? (
                      <div className="space-y-0.5">
                        <span className="italic text-gray-400">Not scheduled</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {row.preferred_schedule_days && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                              <CalendarDays size={9} /> {row.preferred_schedule_days}
                            </span>
                          )}
                          {row.preferred_schedule_time && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                              <Clock size={9} /> {row.preferred_schedule_time}
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] italic text-gray-400 mt-0.5">Requested by student</p>
                      </div>
                    ) : (
                      <span className="italic text-gray-400">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                    {row.fee_amount ? `₹${row.fee_amount}` : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize",
                        statusStyles[row.application_status]
                      )}
                    >
                      {row.application_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        paymentStyles[row.payment_status]
                      )}
                    >
                      {row.payment_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(row.application_id, row.is_active)}
                      className={clsx(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                        row.is_active ? "bg-[#798321]" : "bg-gray-300 dark:bg-gray-700"
                      )}
                      title={row.is_active ? "Mark as Inactive" : "Mark as Active"}
                    >
                      <span
                        className={clsx(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          row.is_active ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {row.assignment_id && (
                        <button
                          onClick={() => setViewRow(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-[#132238] dark:text-gray-200 dark:hover:bg-[#1a2d4a]"
                          title="View attendance & billing"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      )}
                      <button
                        onClick={() => setActiveRow(row)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#798321] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#6B7328] transition-colors"
                      >
                        {row.assignment_id ? "Edit" : "Assign"}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal (used for initial assign OR teacher change) */}
      <AnimatePresence>
        {activeRow && (
          <AssignModal
            row={activeRow}
            teachers={teachers}
            resolvingRequest={
              resolvingRequestId
                ? studentRequests.find((r) => r.id === resolvingRequestId) || null
                : null
            }
            onClose={() => {
              setActiveRow(null);
              setResolvingRequestId(null);
            }}
            onSaved={async () => {
  if (resolvingRequestId) {
    await resolveRequest(resolvingRequestId);
    setResolvingRequestId(null);
  }
  setActiveRow(null);
  fetchData();
}}
          />
        )}
      </AnimatePresence>

      {/* View / Attendance / Billing Modal */}
      <AnimatePresence>
        {viewRow && <ViewModal row={viewRow} onClose={() => setViewRow(null)} />}
      </AnimatePresence>
    </div>
  );
}

// Sub-Component: Stat Counter Cards
function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-[#111D38]">
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#0F1E33]">{icon}</div>
    </div>
  );
}

// Sub-Component: View / Attendance / Billing Modal
function ViewModal({ row, onClose }: { row: TuitionRow; onClose: () => void }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [billing, setBilling] = useState<BillingCycle[]>([]);
  const [loadingBilling, setLoadingBilling] = useState(true);

  const { occurred, totalDatesGenerated } = useMemo(
    () => countElapsedClassDays(row.start_date, row.schedule_days),
    [row.start_date, row.schedule_days]
  );

  useEffect(() => {
    if (!row.assignment_id) {
      setLoadingAttendance(false);
      setLoadingBilling(false);
      return;
    }
    fetchAttendance(row.assignment_id);
    fetchBilling(row.assignment_id);
  }, [row.assignment_id]);

  async function fetchAttendance(assignmentId: number) {
    setLoadingAttendance(true);
    try {
      const res = await fetch(`/api/admin/tuition/attendance?assignment_id=${assignmentId}`);
      const json = await res.json();
      setAttendance(json.data || []);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setAttendance([]);
    } finally {
      setLoadingAttendance(false);
    }
  }

  async function fetchBilling(assignmentId: number) {
    setLoadingBilling(true);
    try {
      const res = await fetch(`/api/admin/tuition/billing?assignment_id=${assignmentId}`);
      const json = await res.json();
      setBilling(json.data || []);
    } catch (err) {
      console.error("Failed to load billing cycles", err);
      setBilling([]);
    } finally {
      setLoadingBilling(false);
    }
  }

  const heldCount = attendance.filter((a) => a.status === "held").length;
  const missedCount = attendance.filter((a) => a.status === "missed").length;
  const cancelledCount = attendance.filter((a) => a.status === "cancelled").length;

  const totalDue = billing
    .filter((b) => b.status === "due")
    .reduce((sum, b) => sum + Number(b.amount_due), 0);

  const attendanceIcon = (status: string) => {
    switch (status) {
      case "held": return <CheckCircle size={12} />;
      case "missed": return <XCircle size={12} />;
      case "cancelled": return <Ban size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const StatusPill = ({ status }: { status: string }) => (
    <span className={clsx("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize", attendanceStyles[status])}>
      {attendanceIcon(status)}
      {status}
    </span>
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-[#0F1E33] max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#24310F] dark:text-white">
              {row.student_name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.subject} • {row.mode}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          <MiniStat label="Parent" value={row.parent_name} />
          <MiniStat label="Phone" value={row.parent_phone} />
          <MiniStat label="Teacher" value={row.teacher_name || "Unassigned"} />
          <MiniStat label="Fee" value={row.fee_amount ? `₹${row.fee_amount}` : "—"} />
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700 mb-5">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-[#798321] dark:text-[#FFC107]">
            <CalendarClock size={14} /> Class Schedule
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <MiniStat label="Start Date" value={row.start_date ? formatDate(row.start_date) : "—"} />
            <MiniStat label="Days" value={row.schedule_days || "—"} />
            <MiniStat label="Time" value={row.schedule_time || "—"} />
          </div>

          {row.meeting_link && (
            <a
              href={row.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 underline dark:text-indigo-400"
            >
              <Video size={12} /> Join Meeting Link
            </a>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-900/20">
            <CalendarDays size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              {occurred > 0
                ? `${occurred} class day${occurred === 1 ? "" : "s"} have occurred so far (based on "${row.schedule_days}" since ${row.start_date ? formatDate(row.start_date) : "start"})`
                : "No elapsed class days yet — schedule or start date missing/future."}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Receipt size={14} /> Fees & Billing
            </p>
            {!loadingBilling && totalDue > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                <IndianRupee size={12} /> {totalDue.toLocaleString("en-IN")} pending
              </span>
            )}
            {!loadingBilling && billing.length > 0 && totalDue === 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle size={12} /> All caught up
              </span>
            )}
          </div>

          <div className="space-y-2">
            {loadingBilling && <div className="rounded-xl border border-gray-100 py-6 text-center text-xs text-gray-400 dark:border-gray-800">Loading billing cycles...</div>}
            {!loadingBilling && billing.length === 0 && <div className="rounded-xl border border-gray-100 py-6 text-center text-xs text-gray-400 dark:border-gray-800">No billing cycles generated yet.</div>}

            {billing.map((b) => (
              <div
                key={b.id}
                className={clsx(
                  "flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3",
                  b.status === "due"
                    ? "border-rose-100 bg-rose-50/40 dark:border-rose-900/30 dark:bg-rose-950/10"
                    : "border-gray-100 dark:border-gray-800"
                )}
              >
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {formatDate(b.period_start)} – {formatDate(b.period_end)}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Due {formatDate(b.due_date)}
                    {b.status === "paid" && b.paid_at && ` • Paid ${formatDate(b.paid_at)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{Number(b.amount_due).toLocaleString("en-IN")}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize",
                      billingStyles[b.status]
                    )}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Attendance Records
          </p>
          {!loadingAttendance && attendance.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Held {heldCount}
              </span>
              <span className="rounded-md bg-rose-100 px-2 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                Missed {missedCount}
              </span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                Cancelled {cancelledCount}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {loadingAttendance && <div className="rounded-xl border border-gray-100 py-8 text-center text-xs text-gray-400 dark:border-gray-800">Loading attendance...</div>}
          {!loadingAttendance && attendance.length === 0 && <div className="rounded-xl border border-gray-100 py-8 text-center text-xs text-gray-400 dark:border-gray-800">No attendance records yet.</div>}

          {attendance.map((a) => {
            const note = a.notes || a.teacher_notes;
            return (
              <div key={a.id} className="rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {new Date(a.class_date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">Parent:</span>
                      <StatusPill status={a.status} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400">Teacher:</span>
                      <StatusPill status={a.teacher_status} />
                    </div>
                  </div>
                </div>
                {note && (
                  <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                    Note: {note}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {totalDatesGenerated.length > 0 && (
          <details className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer font-semibold">
              Show computed elapsed dates ({totalDatesGenerated.length})
            </summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {totalDatesGenerated.map((d) => (
                <span key={d} className="rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                  {new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              ))}
            </div>
          </details>
        )}
      </motion.div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{value}</p>
    </div>
  );
}

// Sub-Component: Assignment Modal
function AssignModal({
  row,
  teachers,
  resolvingRequest,
  onClose,
  onSaved,
}: {
  row: TuitionRow;
  teachers: Teacher[];
  // present only when this Assign/Reassign was opened from a
  // "teacher_change" student request. Used to email the parent a
  // confirmation once the new teacher is saved below.
  resolvingRequest?: StudentRequest | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [teacherId, setTeacherId] = useState(row.teacher_id || "");
  const [fee, setFee] = useState(row.fee_amount || "");
  const [feeFrequency, setFeeFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(row.start_date || "");
  const [scheduleDays, setScheduleDays] = useState(row.schedule_days || row.preferred_schedule_days || "");
  const [scheduleTime, setScheduleTime] = useState(row.schedule_time || row.preferred_schedule_time || "");
  const [meetingLink, setMeetingLink] = useState(row.meeting_link || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAllTeachers, setShowAllTeachers] = useState(false);

  const isOnline = row.mode === "online";
  const canSave = Boolean(teacherId && fee && startDate && scheduleDays && scheduleTime);

  const scheduleWasPrefilledFromRequest =
    !row.schedule_days && !row.schedule_time && Boolean(row.preferred_schedule_days || row.preferred_schedule_time);

  const subjectMatchedTeachers = useMemo(() => {
    const target = normalizeSubject(row.subject);
    return teachers.filter((t) => teacherSubjectKeys(t.subjects || "").includes(target));
  }, [teachers, row.subject]);

  const hasSubjectMatches = subjectMatchedTeachers.length > 0;
  const displayedTeachers = hasSubjectMatches && !showAllTeachers ? subjectMatchedTeachers : teachers;

  const dropdownTeachers = useMemo(() => {
    if (!teacherId) return displayedTeachers;
    const alreadyIncluded = displayedTeachers.some((t) => String(t.id) === String(teacherId));
    if (alreadyIncluded) return displayedTeachers;
    const current = teachers.find((t) => String(t.id) === String(teacherId));
    return current ? [current, ...displayedTeachers] : displayedTeachers;
  }, [displayedTeachers, teacherId, teachers]);

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");

    // 🚀 NEW: capture BEFORE the save call — row.assignment_id tells us
    // whether this is the first time this application is being assigned
    // (vs. an admin editing an already-assigned class later). Only the
    // first-time case should trigger the "new subject approved" email.
    const isFirstTimeAssignment = !row.assignment_id;

    try {
      const res = await fetch("/api/admin/tuition/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: row.application_id,
          teacher_id: teacherId,
          fee_amount: fee,
          fee_frequency: feeFrequency,
          start_date: startDate,
          schedule_days: scheduleDays,
          schedule_time: scheduleTime,
          meeting_link: isOnline ? meetingLink : null,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error || "Failed to save assignment. Please try again.");
        setSaving(false);
        return;
      }

      const selectedTeacher = teachers.find((t) => String(t.id) === String(teacherId));
      const confirmedDetails = {
        teacher_name: selectedTeacher?.name,
        teacher_phone: (selectedTeacher as any)?.phone,
        subject: row.subject,
        mode: row.mode,
        start_date: startDate,
        schedule_days: scheduleDays,
        schedule_time: scheduleTime,
        fee_amount: fee,
        fee_frequency: feeFrequency,
        meeting_link: isOnline ? meetingLink : null,
      };

      // 🚀 Case A: this application came from a "Request New Subject" form
      // AND this is the first time it's being assigned — send the
      // "approved & set up" email now, with the real teacher/schedule/fee
      // that just got confirmed (instead of at Accept-time, when none of
      // that existed yet).
      if (row.origin === "student_new_subject_request" && isFirstTimeAssignment) {
        try {
          await fetch("/api/admin/tuition/approve-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action_type: "new_subject",
              student_phone: row.parent_phone,
              student_name: row.student_name,
              details: confirmedDetails,
            }),
          });
        } catch (mailErr) {
          console.error("Failed to send new-subject confirmation email:", mailErr);
        }
      }

      // 🚀 Case B: this Assign modal was opened to resolve a
      // "teacher_change" request — send the reassignment email with full
      // confirmed details (not just teacher name/phone as before).
      if (resolvingRequest) {
        try {
          await fetch("/api/admin/tuition/approve-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              request_id: resolvingRequest.id,
              action_type: "teacher_change",
              student_phone: resolvingRequest.student_phone,
              student_name: resolvingRequest.student_name,
              details: confirmedDetails,
            }),
          });
        } catch (mailErr) {
          console.error("Failed to send teacher-change confirmation email:", mailErr);
        }
      }

      onSaved();
    } catch (err) {
      console.error("Failed to save assignment", err);
      setError("Network error while saving. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#0F1E33] max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#24310F] dark:text-white">
            Assign Teacher — {row.student_name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Select Educator
              </label>
              <span className="text-[11px] font-medium text-gray-400">
                for {row.subject}
              </span>
            </div>

            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
            >
              <option value="">Choose a teacher</option>
              {dropdownTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.subjects})
                </option>
              ))}
            </select>

            {hasSubjectMatches ? (
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Info size={11} />
                  Showing {subjectMatchedTeachers.length} teacher
                  {subjectMatchedTeachers.length === 1 ? "" : "s"} who teach {row.subject}
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllTeachers((v) => !v)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#798321] hover:underline dark:text-[#FFC107]"
                >
                  <Globe2 size={11} />
                  {showAllTeachers ? "Show subject match only" : "Show all teachers"}
                </button>
              </div>
            ) : (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                <AlertCircle size={11} />
                No teacher is currently listed for {row.subject} — showing all teachers instead.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Fee Amount (₹)
              </label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
                placeholder="e.g. 3000"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Billing Interval
              </label>
              <select
                value={feeFrequency}
                onChange={(e) => setFeeFrequency(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
              >
                <option value="monthly">Monthly</option>
                <option value="one_time">One Time</option>
                <option value="per_session">Per Session</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-gray-200 p-3 dark:border-gray-700">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-[#798321] dark:text-[#FFC107]">
              <CalendarClock size={14} /> Class Schedule
            </p>

            {scheduleWasPrefilledFromRequest && (
              <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-blue-50 px-2.5 py-2 text-[11px] font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                <Info size={12} className="mt-0.5 shrink-0" />
                <span>Days &amp; time below are pre-filled from the student's request. Confirm or adjust based on teacher availability.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Class Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5:00 PM - 6:00 PM"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Days
              </label>
              <input
                type="text"
                placeholder="e.g. Mon, Wed, Fri"
                value={scheduleDays}
                onChange={(e) => setScheduleDays(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
              />
            </div>

            {isOnline && (
              <div className="mt-3">
                <label className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Video size={12} /> Meeting Link (Zoom/Meet)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:bg-[#132238] dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#798321]"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#798321] to-[#99a628] px-4 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-50 hover:brightness-105 transition-all"
        >
          {saving ? "Saving Allocation..." : "Confirm & Save Assignment"}
        </button>
      </motion.div>
    </motion.div>
  );
}