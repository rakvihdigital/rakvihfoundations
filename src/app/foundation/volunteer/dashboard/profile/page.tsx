"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Droplet, Calendar as CalIcon, ShieldCheck, Headset, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerProfilePage() {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      if (!vid) return;

      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("id", vid)
        .single();

      if (data && !error) setVolunteer(data);
      setLoading(false);
    };
    fetchVolunteerData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  // Format dates beautifully
  const formattedDob = volunteer?.dob 
    ? new Date(volunteer.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "Not specified";

  const memberSince = volunteer?.created_at
    ? new Date(volunteer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Header & Support Button */}
      <div className="flex items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Your registered details with RAKVIH Foundation.
          </p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowSupport(true)}
          className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-[#111] dark:text-zinc-300 dark:hover:bg-zinc-900 transition"
        >
          <Headset size={16} className="text-[#798321] dark:text-[#FFC107]" />
          <span className="hidden sm:inline">Help & Support</span>
        </motion.button>
      </div>

      {/* Main Profile Card - Tigtened Padding & Nested UI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-[#111]"
      >
        
        {/* Profile Header - Reduced Gaps */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-neutral-800 pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#798321]/10 text-xl font-extrabold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              {volunteer?.name?.charAt(0) || "V"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{volunteer?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 uppercase tracking-wider dark:bg-zinc-800 dark:text-zinc-300">
                  {volunteer?.volunteer_type}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-left sm:text-right border-t border-slate-100 dark:border-neutral-800 sm:border-0 pt-3 sm:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Member Since</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{memberSince}</p>
          </div>
        </div>

        {/* Nested Details Box - Eliminates "floating" whitespace */}
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-black/40 border border-slate-100 dark:border-neutral-800/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
            
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><Mail size={12}/> Email Address</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">{volunteer?.email}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><Phone size={12}/> Phone Number</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">+91 {volunteer?.phone}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><User size={12}/> Gender</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{volunteer?.gender}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><CalIcon size={12}/> Date of Birth</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{formattedDob}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><Droplet size={12}/> Blood Group</span>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{volunteer?.blood_group || "Not specified"}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><Droplet size={12}/> Active Donor</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{volunteer?.active_blood_donor}</p>
            </div>

            <div className="sm:col-span-2 space-y-0.5 pt-2 border-t border-slate-200 dark:border-neutral-800/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5"><MapPin size={12}/> Registered Address</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed">
                {volunteer?.street_address}, {volunteer?.city}
              </p>
            </div>

          </div>
        </div>

      </motion.div>
      
      <div className="text-center pt-1">
        <p className="text-[11px] text-slate-400 dark:text-neutral-500">
          Need to update your details? Please contact the RAKVIH Admin team.
        </p>
      </div>

      {/* Help & Support Modal */}
      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#111] border border-slate-200 dark:border-neutral-800 relative"
            >
              <button 
                onClick={() => setShowSupport(false)} 
                className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={18} />
              </button>
              
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] mb-4">
                <Headset size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Help & Support</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mb-6 leading-relaxed">
                If you have questions, need to update your profile, or require assistance with an event, please reach out to our team.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-black/50">
                  <Phone size={18} className="text-[#798321] dark:text-[#FFC107]" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Phone Number</span>
                    <a href="tel:+918296392047" className="text-sm font-bold text-slate-900 dark:text-white hover:underline">
                      +91 82963 92047
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-black/50">
                  <Mail size={18} className="text-[#798321] dark:text-[#FFC107]" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Email Address</span>
                    <a href="mailto:office@rakvih.in" className="text-sm font-bold text-slate-900 dark:text-white hover:underline">
                      office@rakvih.in
                    </a>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSupport(false)} 
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}