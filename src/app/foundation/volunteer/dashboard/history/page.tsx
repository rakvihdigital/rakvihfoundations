"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Download, Medal, History, Loader2, CheckCircle2, Award } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerHistoryPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [volunteerName, setVolunteerName] = useState<string>("Dedicated Volunteer");
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchLogsAndUser = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      if (!vid) return;

      try {
        // 1. Fetch Volunteer Name
        const [volRes, logsRes, regRes] = await Promise.all([
          supabase.from("volunteers").select("name").eq("id", vid).maybeSingle(),
          supabase.from("volunteer_logs").select("*").eq("volunteer_id", vid).order("date", { ascending: false }),
          supabase.from("event_registrations").select("*, volunteer_events(*)").eq("volunteer_id", vid).eq("status", "completed")
        ]);

        if (volRes.data?.name) {
          setVolunteerName(volRes.data.name);
        }

        // Build list of completed opportunities ONLY
        const list: any[] = [];

        // Add from volunteer_logs (which are verified completed events)
        if (logsRes.data) {
          logsRes.data.forEach((log) => {
            let isVerified = false;
            try {
              const parsed = JSON.parse(log.status || "");
              if (parsed.type === "VERIFIED_COMPLETED") isVerified = true;
            } catch {
              if (log.status === "Verified" || !log.status) isVerified = true;
            }

            if (isVerified) {
              list.push({
                id: log.id,
                title: log.title,
                date: log.date,
                hours: log.hours || 0,
                status: "Completed Opportunity",
                type: "log"
              });
            }
          });
        }

        // Add completed registrations not already in logs
        if (regRes.data) {
          regRes.data.forEach((reg) => {
            const eventTitle = reg.volunteer_events?.title;
            const alreadyExists = list.some(
              (item) => item.title && eventTitle && item.title.toLowerCase().trim() === eventTitle.toLowerCase().trim()
            );
            if (!alreadyExists && reg.volunteer_events) {
              list.push({
                id: `reg-${reg.id}`,
                title: reg.volunteer_events.title,
                date: reg.volunteer_events.event_date || reg.created_at,
                hours: 0,
                status: "Completed Opportunity",
                type: "event"
              });
            }
          });
        }

        // Sort by date descending
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOpportunities(list);
      } catch (err) {
        console.error("Error loading volunteer opportunities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogsAndUser();
  }, []);

  // Dynamically calculate stats based on COMPLETED OPPORTUNITIES
  const completedCount = opportunities.length;
  const nextMilestone = completedCount < 1 ? 1 : completedCount < 3 ? 3 : completedCount < 5 ? 5 : completedCount < 10 ? 10 : completedCount + 5;
  const progressPercent = Math.min((completedCount / nextMilestone) * 100, 100);
  const currentLevel = Math.max(1, Math.floor(completedCount / 2) + 1);
  const isCertificateUnlocked = completedCount >= 1;

  // Helper function to load the image so jsPDF can use it
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  // Function to dynamically draw and download the PDF
  const generateCertificate = async () => {
    if (!isCertificateUnlocked) {
      alert("Please complete at least 1 volunteer opportunity to unlock your certificate.");
      return;
    }

    setIsGenerating(true);

    try {
      // Create an A4 Landscape PDF
      const doc = new jsPDF("landscape", "mm", "a4");
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // --- 1. Outer Border (Rakvih Brand Green) ---
      doc.setLineWidth(3);
      doc.setDrawColor(121, 131, 33); // #798321
      doc.rect(10, 10, width - 20, height - 20);
      
      // --- 2. Inner Elegant Border ---
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.rect(14, 14, width - 28, height - 28);

      // --- 3. Logo ---
      try {
        const logoImg = await loadImage("/logo.png"); 
        const logoWidth = 40; 
        const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
        doc.addImage(logoImg, "PNG", (width - logoWidth) / 2, 20, logoWidth, logoHeight);
      } catch (imgError) {
        console.warn("Logo image not found. Continuing without logo.");
      }

      // --- 4. Header / Company Name ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(36, 49, 15); // #24310F
      doc.text("RAKVIH FOUNDATION", width / 2, 53, { align: "center" });

      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(120, 120, 120);
      doc.text("Empowering Lives Through Compassion & Action", width / 2, 61, { align: "center" });

      // --- 5. Main Certificate Title ---
      doc.setFont("times", "bolditalic");
      doc.setFontSize(42);
      doc.setTextColor(121, 131, 33); // #798321
      doc.text("Certificate of Appreciation", width / 2, 88, { align: "center" });

      // --- 6. Subtitle ---
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("THIS IS PROUDLY PRESENTED TO", width / 2, 106, { align: "center" });

      // --- 7. Volunteer Name ---
      doc.setFont("times", "bold");
      doc.setFontSize(34);
      doc.setTextColor(0, 0, 0);
      doc.text(volunteerName.toUpperCase(), width / 2, 124, { align: "center" });

      // Underline for name
      doc.setLineWidth(0.5);
      doc.setDrawColor(121, 131, 33);
      doc.line(width / 2 - 70, 128, width / 2 + 70, 128);

      // --- 8. Achievement Body Text (Updated for Completed Opportunities) ---
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(60, 60, 60);
      
      const oppWord = completedCount === 1 ? "opportunity" : "opportunities";
      const bodyText = `In recognition and heartfelt appreciation for successfully completing\n${completedCount} community volunteer ${oppWord} with RAKVIH Foundation.\nYour selfless dedication and active service toward uplifting lives and serving our community are deeply appreciated.`;
      
      doc.text(bodyText, width / 2, 144, { align: "center", lineHeightFactor: 1.4 });

      // --- 8b. Opportunities Completed Badge ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(121, 131, 33);
      doc.text(`Official Recognition • ${completedCount} Completed ${completedCount === 1 ? "Opportunity" : "Opportunities"}`, width / 2, 164, { align: "center" });

      // --- 9. Date and Signatures ---
      const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      
      // Date Line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(today, 60, 180, { align: "center" });
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.line(40, 182, 80, 182);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Awarded Date", 60, 187, { align: "center" });

      // Signature Line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text("Vijay Kumar", width - 60, 180, { align: "center" });
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.line(width - 85, 182, width - 35, 182);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Director, RAKVIH Foundation", width - 60, 187, { align: "center" });

      // --- 10. Save the PDF ---
      doc.save(`${volunteerName.replace(/\s+/g, '_')}_Rakvih_Opportunities_Certificate.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          History & Rewards 🏆
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
          Track your completed opportunities and unlock official digital certificates.
        </p>
      </motion.div>

      {/* Gamification / Progress Card (Unlocked by Completed Opportunities) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-[#111] flex flex-col md:flex-row items-center gap-8 shadow-sm"
      >
        <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-4 border-[#798321]/20 bg-[#798321]/10 text-[#798321] dark:border-[#FFC107]/20 dark:bg-[#FFC107]/10 dark:text-[#FFC107] shadow-inner">
          <Medal size={40} className="mb-1" />
          <span className="text-xs font-bold uppercase tracking-wider">Level {currentLevel}</span>
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wide">
                Completed Opportunities
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {completedCount} <span className="text-lg text-slate-400">{completedCount === 1 ? "Opportunity" : "Opportunities"}</span>
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">
                Next Milestone: {nextMilestone} {nextMilestone === 1 ? "Opportunity" : "Opportunities"}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progressPercent}%` }} 
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-[#798321] to-[#a3b02c] dark:from-[#FFC107] dark:to-[#ffda66]"
            />
          </div>
          
          {/* Certificate Download Button */}
          {isCertificateUnlocked ? (
            <div className="mt-5 space-y-2">
              <button 
                onClick={generateCertificate}
                disabled={isGenerating}
                className="flex items-center justify-center sm:justify-start gap-2 rounded-xl bg-[#798321] px-6 py-3 text-xs font-bold text-white shadow-md dark:bg-[#FFC107] dark:text-black hover:opacity-90 transition w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                {isGenerating ? "Generating Certificate..." : `Download Official Certificate (${completedCount} ${completedCount === 1 ? "Opportunity" : "Opportunities"})`}
              </button>
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Certificate unlocked based on your completed opportunities!
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-neutral-500">
              <Award size={16} className="text-[#798321] dark:text-[#FFC107] shrink-0" />
              <span>Complete your first volunteer opportunity to unlock your official RAKVIH Certificate!</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Past Opportunities & Events List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Completed Opportunities</h2>
        
        {opportunities.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#111] rounded-3xl border border-slate-200 dark:border-neutral-800">
            <History size={40} className="mx-auto text-slate-300 dark:text-neutral-700 mb-3" />
            <p className="font-bold text-slate-500 dark:text-neutral-400">No opportunities completed yet.</p>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
              Join upcoming volunteer opportunities to start building your record and unlock your certificate!
            </p>
          </div>
        ) : (
          opportunities.map((item, index) => {
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: index * 0.08 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#111]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <CalendarCheck size={12} /> {formattedDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-neutral-800">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#798321] dark:text-[#FFC107] bg-[#798321]/10 dark:bg-[#FFC107]/10 px-2.5 py-1 rounded-full">
                    Completed Opportunity #{opportunities.length - index}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">
                    {item.status}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

    </div>
  );
}
