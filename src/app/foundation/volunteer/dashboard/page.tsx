"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, Calendar, Award, ArrowRight, Droplet, 
  MapPin, BellRing, BarChart3, Megaphone, Trophy 
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerDashboardOverview() {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [stats, setStats] = useState({ hours: 0, events: 0 });
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      if (!vid) return;

      const today = new Date().toISOString().split('T')[0];

      // Using Promise.all to fetch everything simultaneously for lightning-fast loading!
      const [profileRes, logsRes, eventsRes, annRes] = await Promise.all([
        supabase.from("volunteers").select("*").eq("id", vid).single(),
        supabase.from("volunteer_logs").select("*").eq("volunteer_id", vid).order("date", { ascending: true }),
        supabase.from("volunteer_events").select("*").gte("event_date", today).order("event_date", { ascending: true }).limit(1),
        supabase.from("volunteer_announcements").select("*").order("created_at", { ascending: false }).limit(2)
      ]);

      // 1. Set Profile
      if (profileRes.data) setVolunteer(profileRes.data);

      // 2. Set Stats & Chart Data
      if (logsRes.data) {
        const totalHours = logsRes.data.reduce((sum, log) => sum + log.hours, 0);
        setStats({ hours: totalHours, events: logsRes.data.length });
        
        // Grab the last 7 events for the Bar Chart
        setChartData(logsRes.data.slice(-7)); 
      }

      // 3. Set Next Event
      if (eventsRes.data && eventsRes.data.length > 0) setNextEvent(eventsRes.data[0]);

      // 4. Set Announcements
      if (annRes.data) setAnnouncements(annRes.data);

      setLoading(false);
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

  // Calculate max hours for the Chart scale (prevent dividing by 0)
  const maxChartHours = chartData.length > 0 ? Math.max(...chartData.map(d => d.hours)) : 1;
  
  // Calculate Current Level perfectly matching the History page (1 level per 10 hours)
  const currentLevel = Math.floor(stats.hours / 10) + 1;

  // Safe name extraction to prevent crashes
  const firstName = volunteer?.name ? volunteer.name.split(" ")[0] : "Hero";

  return (
    <div className="space-y-8">
      
      {/* Greeting Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
          Thank you for dedicating your time to RAKVIH Foundation. Here is your impact summary.
        </p>
      </motion.div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center mb-4"><Clock size={24} /></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hours Logged</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.hours}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center mb-4"><Calendar size={24} /></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Events Attended</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.events}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl bg-white dark:bg-[#111] p-6 border border-slate-200 dark:border-neutral-800 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center mb-4"><Trophy size={24} /></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Level</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{currentLevel}</h3>
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

      {/* Middle Row: Chart & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Custom Tailwind Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-[#111]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><BarChart3 size={20} className="text-[#798321] dark:text-[#FFC107]"/> Impact Trend</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Hours logged over your last 7 events.</p>
            </div>
            <Link href="/foundation/volunteer/dashboard/history" className="text-xs font-bold text-[#798321] dark:text-[#FFC107] hover:underline">View History</Link>
          </div>

          {chartData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-neutral-600 mt-6">
              <BarChart3 size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-semibold">No activity to chart yet.</p>
            </div>
          ) : (
            // FIX: Added mt-8 so 100% height bars don't push tooltips into the header
            <div className="h-48 flex items-end justify-between gap-1 sm:gap-4 relative mt-8">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-100 dark:border-neutral-800">
                <div className="w-full border-t border-slate-100 dark:border-neutral-800 h-0"></div>
                <div className="w-full border-t border-slate-100 dark:border-neutral-800 h-0"></div>
                <div className="w-full border-t border-slate-100 dark:border-neutral-800 h-0"></div>
              </div>

              {chartData.map((data, index) => {
                const heightPercentage = (data.hours / maxChartHours) * 100;
                return (
                  <div key={index} className="relative z-10 flex-1 flex flex-col items-center justify-end h-full group">
                    {/* Hover Tooltip - Positioned safely */}
                    <div className="absolute -top-9 bg-slate-900 text-white dark:bg-white dark:text-black text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {data.hours} Hours<br/>{new Date(data.date).toLocaleDateString()}
                    </div>
                    {/* The Bar */}
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${heightPercentage}%` }} 
                      transition={{ duration: 0.8, delay: 0.4 + (index * 0.1) }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-[#798321] to-[#a3b02c] dark:from-[#FFC107] dark:to-[#ffda66] rounded-t-lg shadow-sm"
                    ></motion.div>
                    {/* X-Axis Label - FIX: Reduced size on mobile to prevent overlapping */}
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
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
                    {ann.type} • {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">{ann.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">{ann.message}</p>
                </div>
              ))
            )}
          </div>

          <Link href="/foundation/volunteer/dashboard/announcements" className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 dark:border-neutral-700 dark:text-neutral-300 text-xs font-bold flex justify-center items-center gap-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition">
            View All Board
          </Link>
        </motion.div>

      </div>

      {/* Dynamic Action Banner for Next Event */}
      {/* FIX: Changed items-center to items-start sm:items-center to fix mobile alignment issues */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-[#111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          {nextEvent ? (
            <>
              <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Next Upcoming Event
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{nextEvent.title}</h3>
              <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                <Calendar size={14}/> {new Date(nextEvent.event_date).toLocaleDateString()} | <MapPin size={14}/> {nextEvent.location}
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
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
        >
          View Opportunities <ArrowRight size={16} />
        </Link>
      </motion.div>

    </div>
  );
}