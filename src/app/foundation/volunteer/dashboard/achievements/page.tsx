"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Droplet, Star, HeartHandshake, Zap, Shield, Lock } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Define the badge conditions instead of hardcoding 'unlocked'
const BADGE_DEFS = [
  {
    id: 1,
    title: "First Step",
    desc: "Registered and approved as a RAKVIH volunteer.",
    icon: Star,
    color: "from-blue-400 to-blue-600",
    shadow: "shadow-blue-500/30",
    checkUnlocked: (vol: any, stats: any) => vol?.status === "approved",
  },
  {
    id: 2,
    title: "Blood Hero",
    desc: "Opted in as an active blood donor to save lives.",
    icon: Droplet,
    color: "from-rose-400 to-rose-600",
    shadow: "shadow-rose-500/30",
    checkUnlocked: (vol: any, stats: any) => vol?.active_blood_donor === "Yes",
  },
  {
    id: 3,
    title: "Weekend Warrior",
    desc: "Attended your first distribution drive.",
    icon: Zap,
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-500/30",
    checkUnlocked: (vol: any, stats: any) => stats.events >= 1,
  },
  {
    id: 4,
    title: "Community Pillar",
    desc: "Complete 10 hours of active volunteering.",
    icon: Shield,
    color: "from-emerald-400 to-emerald-600",
    shadow: "shadow-emerald-500/30",
    checkUnlocked: (vol: any, stats: any) => stats.hours >= 10,
  },
  {
    id: 5,
    title: "Super Saver",
    desc: "Attend 5 different on-ground events.",
    icon: HeartHandshake,
    color: "from-purple-400 to-purple-600",
    shadow: "shadow-purple-500/30",
    checkUnlocked: (vol: any, stats: any) => stats.events >= 5,
  },
  {
    id: 6,
    title: "RAKVIH Champion",
    desc: "Reach the 50-hour milestone.",
    icon: Trophy,
    color: "from-[#FFC107] to-[#d4a004]",
    shadow: "shadow-[#FFC107]/30",
    checkUnlocked: (vol: any, stats: any) => stats.hours >= 50,
  },
];

export default function AchievementsPage() {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [stats, setStats] = useState({ hours: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievementsData = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      if (!vid) return;

      // 1. Fetch Profile (Needed for Blood Donor and Approved Status)
      const { data: profile } = await supabase
        .from("volunteers")
        .select("*")
        .eq("id", vid)
        .single();
        
      if (profile) setVolunteer(profile);

      // 2. Fetch Logs (Needed for Hours and Events attended logic)
      const { data: logs } = await supabase
        .from("volunteer_logs")
        .select("hours")
        .eq("volunteer_id", vid);

      if (logs) {
        const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
        setStats({ hours: totalHours, events: logs.length });
      }

      setLoading(false);
    };

    fetchAchievementsData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  // Calculate the unlocked status dynamically for each badge based on live database info
  const badges = BADGE_DEFS.map((badge) => ({
    ...badge,
    unlocked: badge.checkUnlocked(volunteer, stats),
  }));

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            My Achievements 🌟
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Collect badges by completing milestones and participating in events.
          </p>
        </div>
        
        {/* Quick Stat */}
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-neutral-800 dark:bg-[#111]">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Badges Unlocked</span>
          <span className="text-xl font-extrabold text-[#798321] dark:text-[#FFC107]">
            {unlockedCount} <span className="text-sm text-slate-300 dark:text-neutral-600">/ {badges.length}</span>
          </span>
        </div>
      </motion.div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          
          return (
            <motion.div 
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
                badge.unlocked 
                  ? "border-slate-200 bg-white shadow-sm hover:shadow-lg dark:border-neutral-800 dark:bg-[#111]" 
                  : "border-slate-100 bg-slate-50 dark:border-neutral-900 dark:bg-[#0a0a0a]"
              }`}
            >
              {/* If locked, show a lock overlay icon in the corner */}
              {!badge.unlocked && (
                <div className="absolute top-4 right-4 text-slate-300 dark:text-neutral-700">
                  <Lock size={16} />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Badge Icon Circular Frame */}
                <div className={`
                  flex h-20 w-20 items-center justify-center rounded-full mb-4
                  ${badge.unlocked 
                    ? `bg-gradient-to-br ${badge.color} text-white shadow-lg ${badge.shadow}` 
                    : "bg-slate-200 text-slate-400 dark:bg-neutral-800 dark:text-neutral-600"
                  }
                `}>
                  <Icon size={32} />
                </div>

                <h3 className={`text-lg font-bold mb-1 ${badge.unlocked ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-neutral-500"}`}>
                  {badge.title}
                </h3>
                
                <p className={`text-xs ${badge.unlocked ? "text-slate-500 dark:text-neutral-400" : "text-slate-400 dark:text-neutral-600"}`}>
                  {badge.desc}
                </p>
                
                {/* Status Pill */}
                <div className="mt-4">
                  {badge.unlocked ? (
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-neutral-800 dark:text-neutral-500">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}