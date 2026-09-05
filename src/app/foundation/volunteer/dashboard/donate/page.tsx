"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  History, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  HeartHandshake,
  Mail,
  Receipt,
  FileText
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerDonatePage() {
  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  
  // History State (only personal donations filtered by email)
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Volunteer details & email-filtered Donations
  useEffect(() => {
    const initData = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      const vname = localStorage.getItem("rakvih_volunteer_name") || "Volunteer";
      let vemail = localStorage.getItem("rakvih_volunteer_email") || "";

      setVolunteerId(vid);
      setVolunteerName(vname);

      // Fallback: If email is not in localStorage, fetch from volunteers table
      if (!vemail && vid) {
        try {
          const { data } = await supabase
            .from("volunteers")
            .select("email, name")
            .eq("id", vid)
            .maybeSingle();

          if (data?.email) {
            vemail = data.email.trim();
            localStorage.setItem("rakvih_volunteer_email", vemail);
          }
          if (data?.name && (!vname || vname === "Volunteer")) {
            setVolunteerName(data.name);
          }
        } catch (err) {
          console.error("Error fetching volunteer profile:", err);
        }
      }

      setVolunteerEmail(vemail);

      // Fetch personal donations strictly filtered by volunteer's email
      await fetchDonationHistory(vemail);
      setLoading(false);
    };

    initData();
  }, []);

  const fetchDonationHistory = async (emailToMatch: string) => {
    try {
      const cleanEmail = emailToMatch ? emailToMatch.trim().toLowerCase() : "";
      if (!cleanEmail) {
        setMyDonations([]);
        return;
      }

      const { data: allDonations, error } = await supabase
        .from("donations")
        .select("*, cause_items(title, name)")
        .order("created_at", { ascending: false });

      if (allDonations && !error) {
        // Strictly filter to show ONLY donations matching this volunteer's registered email
        const mine = allDonations.filter((d: any) => {
          return Boolean(d.email && d.email.trim().toLowerCase() === cleanEmail);
        });

        setMyDonations(mine);
      }
    } catch (err) {
      console.error("Error fetching volunteer donation history:", err);
    }
  };

  const totalDonated = myDonations.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl flex items-center gap-3">
          Volunteer Contributions 💖
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
          Personal ledger and verified donation history for volunteer <span className="font-bold text-slate-800 dark:text-neutral-200">{volunteerName}</span>.
        </p>
      </motion.div>

      {/* Summary Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#111] shadow-sm"
        >
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Heart size={20} fill="currentColor" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">My Total Contributed</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalDonated.toLocaleString()}
          </h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#111] shadow-sm"
        >
          <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center mb-3">
            <History size={20} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Personal Donations Made</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {myDonations.length}
          </h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.15 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#111] shadow-sm"
        >
          <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center mb-3">
            <Mail size={20} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Donor Email</p>
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-neutral-200 mt-1 truncate" title={volunteerEmail || "No email on record"}>
            {volunteerEmail || "Not specified"}
          </h3>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={12} /> Filtered & Synced
          </span>
        </motion.div>
      </div>

      {/* Redirect / Public Donation Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-[#798321]/20 bg-gradient-to-br from-[#798321]/5 via-white to-amber-50/20 dark:from-[#FFC107]/10 dark:via-[#111] dark:to-neutral-900 p-6 sm:p-8 dark:border-neutral-800 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#798321]/15 text-[#798321] dark:bg-[#FFC107]/15 dark:text-[#FFC107] text-xs font-bold">
              <Sparkles size={13} /> Official Donation Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Support RAKVIH Causes & Initiatives
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              Donations are processed through our official public portal where you can customize member counts, choose optional packaging proofs, and receive formal receipts. All donations made with your email (<strong>{volunteerEmail || "your registered email"}</strong>) will automatically reflect in your personal ledger below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/foundation/donate"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#798321] dark:bg-[#FFC107] text-white dark:text-black font-extrabold text-xs shadow-md hover:opacity-95 transition-all transform active:scale-95"
            >
              <Heart size={16} fill="currentColor" /> Donate to a Cause <ArrowRight size={15} />
            </Link>
            <Link
              href="/foundation/genraldonate"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-neutral-700 transition"
            >
              General Fund <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* History Ledger Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.25 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-neutral-800 dark:bg-[#111] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-4 mb-5 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#798321] dark:text-[#FFC107]">Personal Records</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">My Donation History</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing verified donations linked to: <strong className="text-slate-600 dark:text-neutral-300">{volunteerEmail || volunteerName}</strong>
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-neutral-800 text-xs font-bold text-slate-600 dark:text-neutral-300 self-start sm:self-auto">
            <Receipt size={13} /> {myDonations.length} {myDonations.length === 1 ? "Contribution" : "Contributions"}
          </span>
        </div>

        {/* List Content */}
        <div className="space-y-3">
          {myDonations.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                <HeartHandshake size={32} />
              </div>
              <div className="max-w-md mx-auto">
                <p className="font-bold text-slate-800 dark:text-white text-base">No donations logged yet</p>
                <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1 leading-relaxed">
                  Whenever you contribute on the public donation page using your email (<strong className="text-slate-600 dark:text-neutral-400">{volunteerEmail || "your email"}</strong>), your verified donation details and receipts will appear right here.
                </p>
              </div>
              <Link
                href="/foundation/donate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#798321] dark:bg-[#FFC107] text-white dark:text-black text-xs font-bold shadow-sm hover:opacity-95 transition"
              >
                Make Your First Contribution <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            myDonations.map((item, idx) => {
              const formattedDate = new Date(item.donation_date || item.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/75 dark:border-neutral-800/80 dark:bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart size={20} fill="currentColor" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
                          ₹{Number(item.amount).toLocaleString()}
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 size={11} /> Verified Donation
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {item.cause_items?.title || item.cause_items?.name || item.dedication_type || "General Foundation Support"}
                      </p>
                      
                      {item.message && (
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 italic flex items-center gap-1">
                          <FileText size={12} className="shrink-0" />
                          <span className="line-clamp-2">{item.message}</span>
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1.5">
                        <Calendar size={11} /> {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="border-t sm:border-t-0 pt-3 sm:pt-0 sm:text-right border-slate-200 dark:border-neutral-800 flex flex-col sm:items-end gap-1.5 shrink-0">
                    <span className="inline-block text-[11px] font-bold text-slate-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm">
                      {item.dedication_type || "Direct Contribution"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ID: #{String(item.id).padStart(5, "0")}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

    </div>
  );
}
