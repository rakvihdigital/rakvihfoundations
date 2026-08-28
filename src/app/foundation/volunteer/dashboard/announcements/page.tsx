"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Droplet, Info, BellRing } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// 2. Map exact database types ("Urgent", "Info") to their specific styles and icons
const TYPE_CONFIG: Record<string, any> = {
  Urgent: {
    icon: Droplet,
    containerClass: "border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/20",
    iconContainerClass: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    textClass: "text-rose-600 dark:text-rose-400",
    titleClass: "text-rose-950 dark:text-rose-100",
    descClass: "text-rose-800 dark:text-rose-300",
    btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
  },
  Info: {
    icon: Info,
    containerClass: "border-slate-200 bg-white dark:border-neutral-800 dark:bg-[#111]",
    iconContainerClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    textClass: "text-slate-400",
    titleClass: "text-slate-900 dark:text-white",
    descClass: "text-slate-600 dark:text-neutral-400",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
};

// 3. Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function AnnouncementsPage() {
  // 4. State for dynamic data
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 5. Fetch from Supabase on load
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("volunteer_announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) {
        setAnnouncements(data);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
          Notice Board 📢
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
          Urgent requests and important updates from the RAKVIH team.
        </p>
      </motion.div>

      {/* Empty State Fallback */}
      {announcements.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-slate-200 dark:border-neutral-800">
          <BellRing size={40} className="mx-auto text-slate-300 dark:text-neutral-700 mb-3" />
          <p className="font-bold text-slate-500 dark:text-neutral-400">No notices at the moment.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {announcements.map((notice) => {
            // Match the database "type" to our configuration. Fallback to "Info" if not found.
            const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG.Info;
            const Icon = config.icon;
            
            // Format the Supabase timestamp into a readable date
            const formattedDate = new Date(notice.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });

            return (
              <motion.div
                key={notice.id}
                variants={itemVariants}
                className={`relative overflow-hidden rounded-3xl border p-6 ${config.containerClass}`}
              >
                {/* Background watermark icon for urgent notices */}
                {notice.type === "Urgent" && (
                  <div className={`absolute -right-4 -top-4 opacity-10 ${config.textClass}`}>
                    <Icon size={100} />
                  </div>
                )}

                <div className="relative z-10 flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconContainerClass}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${config.textClass}`}>
                      {notice.type} Notice • {formattedDate}
                    </span>
                    <h3 className={`mt-1 text-lg font-bold ${config.titleClass}`}>
                      {notice.title}
                    </h3>
                    <p className={`mt-2 text-sm ${config.descClass}`}>
                      {notice.message}
                    </p>
                    
                    {notice.type === "Urgent" && (
                      <button className={`mt-4 rounded-xl px-5 py-2 text-xs font-bold transition ${config.btnClass}`}>
                        Contact Admin
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}