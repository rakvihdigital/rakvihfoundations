"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, User, Clock, Calendar, Trophy, 
  MapPin, Droplet, BadgeCheck, ShieldAlert, 
  Mail, Phone, Activity, FileText, BellRing, 
  History, Award, ChevronRight
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Fraunces } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerVerificationPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [volunteer, setVolunteer] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState({ hours: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchVerificationData = async () => {
      try {
        // 1. Fetch EVERYTHING from the volunteers table
        const { data: volData, error: volError } = await supabase
          .from("volunteers")
          .select("*")
          .eq("id", id)
          .single();

        if (volError || !volData) {
          setError(true);
          return;
        }
        setVolunteer(volData);

        // 2. Fetch Event Logs (Full Details)
        const { data: logsData } = await supabase
          .from("volunteer_logs")
          .select("*")
          .eq("volunteer_id", id)
          .order("date", { ascending: false });

        if (logsData) {
          setLogs(logsData);
          const totalHours = logsData.reduce((sum, log) => sum + log.hours, 0);
          setStats({ hours: totalHours, events: logsData.length });
        }

        // 3. Fetch Latest Announcements
        const { data: annData } = await supabase
          .from("volunteer_announcements")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2);
          
        if (annData) setAnnouncements(annData);

      } catch (err) {
        console.error("Verification error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pulling Volunteer Data...</p>
        </div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-rose-500 mb-4 opacity-80" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Record Not Found</h1>
        <p className="mt-2 max-w-sm text-slate-500 dark:text-neutral-400">
          This volunteer ID does not exist or has been removed from the database.
        </p>
      </div>
    );
  }

  const isApproved = volunteer.status === "approved";
  const currentLevel = Math.floor(stats.hours / 10) + 1;
  const joinDate = new Date(volunteer.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const dobDate = volunteer.dob ? new Date(volunteer.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A";

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-black ${display.variable} pb-20`} style={{ fontFamily: "var(--font-display)" }}>
      
      {/* Verification Status Banner */}
      <div className={`w-full py-3 px-4 flex items-center justify-center gap-2 shadow-sm ${isApproved ? 'bg-emerald-600' : 'bg-amber-500'}`}>
        {isApproved ? (
          <>
            <ShieldCheck size={18} className="text-white" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">Active & Verified Record</span>
          </>
        ) : (
          <>
            <Clock size={18} className="text-white" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">Verification Pending / Under Review</span>
          </>
        )}
      </div>

      <main className="max-w-3xl mx-auto pt-8 px-4 sm:px-6 space-y-8">
        
        {/* Foundation Header */}
        <div className="flex flex-col items-center justify-center">
          <img src="/Found1.png" alt="Rakvih Logo" className="h-14 w-auto mb-2 object-contain" crossOrigin="anonymous" />
          <h2 className="text-[16px] font-black tracking-widest text-slate-900 dark:text-[#FFC107] uppercase font-serif leading-tight">
            Rakvih Foundation
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Volunteer Data Dossier</p>
        </div>

        {/* Latest Notice Board (Only shows if there are announcements) */}
        {announcements.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
            <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3 uppercase tracking-widest">
              <BellRing size={14} /> Latest Foundation Notices
            </h3>
            <div className="space-y-2">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white dark:bg-[#111] p-3 rounded-xl border border-slate-100 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ann.type === 'Urgent' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      {ann.type}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1">{ann.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Top Profile Summary */}
          <div className="rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="h-28 w-28 rounded-2xl border border-slate-200 dark:border-neutral-700 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                {volunteer.profile_image_url ? (
                  <img src={volunteer.profile_image_url} alt="Profile" className="h-full w-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <User size={48} className="text-slate-400 dark:text-neutral-600" />
                )}
              </div>
              {isApproved && (
                <div className="absolute -bottom-3 -right-3 rounded-full bg-white dark:bg-[#111] p-1 shadow-sm">
                  <BadgeCheck size={32} className="text-emerald-500" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white">
                {volunteer.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 mt-3 w-full">
                {/* Volunteer Type Tag */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-widest dark:bg-zinc-800 dark:text-zinc-300">
                  <User size={14} /> {volunteer.volunteer_type || "Volunteer"}
                </span>
                {/* ID Tag */}
                <span className="inline-block px-3 py-1.5 rounded-lg bg-[#798321]/10 text-[#798321] text-[11px] font-bold uppercase tracking-widest dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                  ID: {volunteer.display_id || "PENDING"}
                </span>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-4 flex items-center justify-center sm:justify-start gap-2">
                <Calendar size={14}/> Registered on {joinDate}
              </p>
            </div>
          </div>

          {/* Achievements & Badges Section */}
          <div className="rounded-3xl bg-slate-900 dark:bg-[#1a1a1a] p-6 shadow-sm border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Award size={18} className="text-[#FFC107]" /> Badges & Achievements
            </h3>
            <div className="flex flex-wrap gap-3">
              {/* Blood Donor Badge */}
              {volunteer.active_blood_donor === "Yes" && (
                <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-3 py-2 rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-rose-500/30 flex items-center justify-center text-rose-500"><Droplet size={16}/></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Registered</p>
                    <p className="text-xs font-bold text-white">Blood Donor</p>
                  </div>
                </div>
              )}
              {/* Level Badge */}
              <div className="flex items-center gap-2 bg-[#798321]/20 dark:bg-[#FFC107]/20 border border-[#798321]/30 dark:border-[#FFC107]/30 px-3 py-2 rounded-xl">
                <div className="h-8 w-8 rounded-full bg-[#798321]/30 dark:bg-[#FFC107]/30 flex items-center justify-center text-[#798321] dark:text-[#FFC107]"><Trophy size={16}/></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#798321] dark:text-[#FFC107]">Current Rank</p>
                  <p className="text-xs font-bold text-white">Level {currentLevel}</p>
                </div>
              </div>
              {/* Experience Badge */}
              {stats.hours > 0 && (
                <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400"><Activity size={16}/></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Impact Maker</p>
                    <p className="text-xs font-bold text-white">{stats.hours}+ Hours</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Event History & Logs */}
          <div className="rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-neutral-800 p-6 shadow-sm">
             <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-4 mb-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History size={18} className="text-[#798321] dark:text-[#FFC107]" /> Volunteering History
                </h3>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Events</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{stats.events}</p>
                </div>
             </div>

             {logs.length === 0 ? (
               <div className="py-8 text-center text-slate-400">
                 <History size={32} className="mx-auto mb-2 opacity-50" />
                 <p className="text-xs font-bold uppercase tracking-widest">No Events Logged Yet</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {logs.map((log) => (
                   <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-neutral-800 hover:border-[#798321]/50 transition">
                     <div className="shrink-0 h-10 w-10 rounded-full bg-[#798321]/10 dark:bg-[#FFC107]/10 flex items-center justify-center text-[#798321] dark:text-[#FFC107]">
                       <Calendar size={16} />
                     </div>
                     <div className="flex-1">
                       <h4 className="text-sm font-bold text-slate-900 dark:text-white">{log.title}</h4>
                       <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                         {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                       </p>
                     </div>
                     <div className="shrink-0 text-right">
                       <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold">
                         +{log.hours} Hours
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Grid Layout for Form Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal & Contact Details */}
            <div className="rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-neutral-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
                <FileText size={18} className="text-[#798321] dark:text-[#FFC107]" /> Personal Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Mail size={12}/> Email Address</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1">{volunteer.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Phone size={12}/> Phone Number</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1">+91 {volunteer.phone}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><User size={12}/> Gender</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1">{volunteer.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Calendar size={12}/> Date of Birth</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1">{dobDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical & Location Details */}
            <div className="rounded-3xl bg-white dark:bg-[#111] border border-slate-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
                <MapPin size={18} className="text-[#798321] dark:text-[#FFC107]" /> Location & Health
              </h3>
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><MapPin size={12}/> Complete Address</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1 leading-relaxed">
                    {volunteer.street_address}<br/>
                    {volunteer.city}
                  </p>
                </div>
                
                <div className="mt-auto p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-neutral-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Droplet size={12}/> Blood Group</p>
                      <p className="text-lg font-black text-rose-500 mt-1">{volunteer.blood_group || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Droplet size={12}/> Active Donor</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-1">
                        {volunteer.active_blood_donor === "Yes" ? (
                          <span className="text-emerald-600 dark:text-emerald-500">Yes, Available</span>
                        ) : (
                          "No"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      </main>
    </div>
  );
}