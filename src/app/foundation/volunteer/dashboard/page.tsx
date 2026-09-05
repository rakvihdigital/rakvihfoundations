"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Award, ArrowRight, Droplet, 
  MapPin, BellRing, Megaphone, Trophy, BadgeCheck, CheckCircle2, Lock 
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerDashboardOverview() {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [completedOpportunities, setCompletedOpportunities] = useState<any[]>([]);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [isUserApprovedEvent, setIsUserApprovedEvent] = useState(false);
  const [activeShift, setActiveShift] = useState<{ title: string; date: string; startTime: string } | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeFormatDate = (dInput: any, opts?: Intl.DateTimeFormatOptions) => {
    if (!dInput) return "";
    try {
      const d = new Date(dInput);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString('en-US', opts);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      if (!vid) {
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];

        const [profileRes, logsRes, completedRegRes, approvedRegRes, eventsRes, annRes] = await Promise.all([
          supabase.from("volunteers").select("*").eq("id", vid).maybeSingle(),
          supabase.from("volunteer_logs").select("*").eq("volunteer_id", vid).order("date", { ascending: false }),
          supabase.from("event_registrations").select("*, volunteer_events(*)").eq("volunteer_id", vid).eq("status", "completed"),
          supabase.from("event_registrations").select("*, volunteer_events(*)").eq("volunteer_id", vid).eq("status", "approved"),
          supabase.from("volunteer_events").select("*").gte("event_date", today).order("event_date", { ascending: true }).limit(1),
          supabase.from("volunteer_announcements").select("*").order("created_at", { ascending: false }).limit(2)
        ]);

        // 1. Set Profile
        if (profileRes.data) setVolunteer(profileRes.data);

        // 2. Detect Running Shift (Timer Active)
        let runningShift: any = null;
        if (logsRes.data) {
          for (const l of logsRes.data) {
            try {
              const parsed = JSON.parse(l.status || "");
              if (parsed.type === "SHIFT_STARTED") {
                runningShift = { title: l.title, date: l.date, startTime: parsed.start };
                break;
              }
            } catch {}
          }
        }
        setActiveShift(runningShift);

        // 3. Build Completed Opportunities List (Verified Logs + Completed Registrations ONLY)
        const completedList: any[] = [];
        if (logsRes.data) {
          logsRes.data.forEach((l) => {
            let isVerified = false;
            try {
              const parsed = JSON.parse(l.status || "");
              if (parsed.type === "VERIFIED_COMPLETED") isVerified = true;
            } catch {
              if (l.status === "Verified" || !l.status) isVerified = true;
            }

            if (isVerified) {
              completedList.push({ id: l.id, title: l.title, date: l.date });
            }
          });
        }
        if (completedRegRes.data) {
          completedRegRes.data.forEach((reg) => {
            const title = reg.volunteer_events?.title;
            if (title && !completedList.some(item => item.title?.toLowerCase().trim() === title.toLowerCase().trim())) {
              completedList.push({
                id: `reg-${reg.id}`,
                title: title,
                date: reg.volunteer_events?.event_date || reg.created_at
              });
            }
          });
        }
        setCompletedOpportunities(completedList);

        // 4. Determine Most Relevant Upcoming Event for this Volunteer
        let targetEvent: any = null;
        let isApproved = false;

        if (approvedRegRes.data && approvedRegRes.data.length > 0) {
          const upcomingApproved = approvedRegRes.data
            .map((r: any) => r.volunteer_events)
            .filter((e: any) => e && e.event_date >= today)
            .sort((a: any, b: any) => a.event_date.localeCompare(b.event_date));
          if (upcomingApproved.length > 0) {
            targetEvent = upcomingApproved[0];
            isApproved = true;
          }
        }

        if (!targetEvent && eventsRes.data && eventsRes.data.length > 0) {
          targetEvent = eventsRes.data[0];
          isApproved = false;
        }

        setNextEvent(targetEvent);
        setIsUserApprovedEvent(isApproved);

        // 5. Set Announcements
        if (annRes.data) setAnnouncements(annRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  // Calculate stats based purely on completed opportunities
  const completedCount = completedOpportunities.length;
  const isCertificateUnlocked = completedCount >= 1;
  const currentLevel = Math.max(1, Math.floor(completedCount / 2) + 1);

  // Safe name extraction to prevent crashes
  const firstName = volunteer?.name ? String(volunteer.name).split(" ")[0] : "Hero";
  
  // Get official sequential ID
  const volunteerIdNumber = volunteer?.display_id || "Rak-PENDING";

  // Check if next upcoming event is today
  const todayStr = new Date().toISOString().split("T")[0];
  const isNextEventToday = nextEvent?.event_date ? String(nextEvent.event_date).startsWith(todayStr) : false;

  return (
    <div className="space-y-8">
      
      {/* Live Shift Alert Banner (if timer is running) */}
      {activeShift && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Shift In Progress • Active Now
              </p>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {activeShift.title}
              </h4>
            </div>
          </div>
          <Link 
            href="/foundation/volunteer/dashboard/events" 
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition shadow-sm"
          >
            Open Live Timer <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}

      {/* Greeting Header & ID Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {firstName}!
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 uppercase tracking-widest dark:bg-zinc-800 dark:text-zinc-300">
              ID: {volunteerIdNumber}
            </span>
            <p className="text-sm text-slate-500 dark:text-neutral-400">
              Thank you for dedicating your time to RAKVIH Foundation.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.1 }}
          className="shrink-0"
        >
          <Link 
            href="/foundation/volunteer/dashboard/profile"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          >
            <BadgeCheck size={16} className="text-[#FFC107] dark:text-[#798321]" />
            Get Digital ID
          </Link>
        </motion.div>
      </div>

      {/* Impact Stats Grid - Fully Opportunity & Milestone Based */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Opportunities Completed</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{completedCount}</h3>
          <p className="text-[11px] font-medium text-slate-500 mt-1">Verified community drives</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${isCertificateUnlocked ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"}`}>
            {isCertificateUnlocked ? <CheckCircle2 size={24} /> : <Lock size={24} />}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Certificate Status</p>
          <h3 className={`text-xl font-extrabold mt-1 ${isCertificateUnlocked ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {isCertificateUnlocked ? "Unlocked 🎉" : "Locked"}
          </h3>
          <Link href="/foundation/volunteer/dashboard/history" className="text-[11px] font-bold text-[#798321] dark:text-[#FFC107] hover:underline mt-1 inline-block">
            {isCertificateUnlocked ? "Download Certificate →" : "Requires 1 completed drive"}
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center mb-4">
            <Trophy size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteer Level</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Level {currentLevel}</h3>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            {completedCount >= 3 ? "Champion Volunteer" : completedCount >= 1 ? "Active Contributor" : "New Volunteer"}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-3xl bg-gradient-to-br from-[#798321] to-[#5a6118] dark:from-[#FFC107] dark:to-[#d4a004] p-6 text-white dark:text-black shadow-lg relative overflow-hidden">
          <Award className="absolute -right-4 -bottom-4 text-white/20 dark:text-black/10" size={100} />
          <div className="relative z-10 flex flex-col h-full justify-center">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1">Registration Type</p>
            <h3 className="text-xl font-extrabold truncate">{volunteer?.volunteer_type || "Individual"}</h3>
            {volunteer?.active_blood_donor === "Yes" && (
              <span className="inline-flex w-fit items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-white/20 text-[11px] font-bold backdrop-blur-sm">
                <Droplet size={12} /> Blood Donor
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Middle Row: Recent Completed Activities & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Completed Opportunities Activity List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-[#111]">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={20} className="text-[#798321] dark:text-[#FFC107]"/> Completed Opportunities
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Drives you have attended and verified by administrators.
              </p>
            </div>
            <Link href="/foundation/volunteer/dashboard/history" className="text-xs font-bold text-[#798321] dark:text-[#FFC107] hover:underline">
              View All History
            </Link>
          </div>

          {completedOpportunities.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <Award size={36} className="text-slate-300 dark:text-neutral-700 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">No completed opportunities yet</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                Register for an upcoming drive. Once an administrator marks your participation as completed, your certificate will unlock!
              </p>
              <Link
                href="/foundation/volunteer/dashboard/events"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#798321] text-xs font-bold text-white dark:bg-[#FFC107] dark:text-black transition"
              >
                Browse Opportunities <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {completedOpportunities.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-100 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Award size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={11} /> {safeFormatDate(item.date) || "Completed"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Latest Announcements Mini-Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-1 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><BellRing size={20} className="text-rose-500"/> Latest Notices</h2>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {announcements.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-neutral-500">
                <Megaphone size={24} className="mb-2 opacity-50" />
                <p className="text-xs font-semibold">No recent notices.</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="rounded-2xl bg-white p-4 border border-slate-100 dark:bg-[#111] dark:border-neutral-800 shadow-sm relative overflow-hidden">
                  {ann.type === "Urgent" && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${ann.type === "Urgent" ? "text-rose-500" : "text-blue-500"}`}>
                    {ann.type} • {safeFormatDate(ann.created_at) || "Recent"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">{ann.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">{ann.message}</p>
                </div>
              ))
            )}
          </div>

          <Link href="/foundation/volunteer/dashboard/announcements" className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 dark:border-neutral-700 dark:text-neutral-300 text-xs font-bold flex justify-center items-center gap-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition">
            View Notice Board
          </Link>
        </motion.div>

      </div>

      {/* Dynamic Action Banner for Next Event */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-[#111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          {nextEvent ? (
            <>
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                isNextEventToday && isUserApprovedEvent
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse" 
                  : isUserApprovedEvent 
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
                {isNextEventToday && isUserApprovedEvent 
                  ? "⚡ Your Shift Is Today • Ready To Start" 
                  : isUserApprovedEvent 
                    ? "Your Upcoming Approved Drive" 
                    : "Next Upcoming Opportunity"}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{nextEvent.title}</h3>
              <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                <Calendar size={14}/> {safeFormatDate(nextEvent.event_date) || "Upcoming"} | <MapPin size={14}/> {nextEvent.location}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to make an impact?</h3>
              <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1 max-w-xl">
                Check out our upcoming food distribution drives, health camps, and educational events.
              </p>
            </>
          )}
        </div>
        <Link 
          href="/foundation/volunteer/dashboard/events" 
          className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md transition ${
            isNextEventToday && isUserApprovedEvent 
              ? "bg-emerald-600 text-white hover:bg-emerald-500" 
              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          }`}
        >
          {isNextEventToday && isUserApprovedEvent ? "Open Shift Timer" : isUserApprovedEvent ? "View Event Details" : "View Opportunities"} <ArrowRight size={16} />
        </Link>
      </motion.div>

    </div>
  );
}