"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Droplet, Calendar as CalIcon, ShieldCheck, Headset, X, BadgeCheck, Download, Camera, Loader2, Globe } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function VolunteerProfilePage() {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSupport, setShowSupport] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const combinedCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleProfileImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !volunteer?.id) return;

    try {
      setIsUploadingImage(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars") 
        .upload(filePath, file);

      if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newImageUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("volunteers")
        .update({ profile_image_url: newImageUrl })
        .eq("id", volunteer.id);

      if (updateError) throw new Error("Failed to update profile: " + updateError.message);

      setVolunteer((prev: any) => ({ ...prev, profile_image_url: newImageUrl }));
      
    } catch (err: any) {
      console.error("Profile image update error:", err);
      alert(err.message || "An unexpected error occurred while updating your photo.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const downloadCombinedID = async () => {
    if (!combinedCardRef.current) return;
    try {
      setIsDownloading(true);
      
      const dataUrl = await toPng(combinedCardRef.current, {
        cacheBust: true,
        pixelRatio: 3, 
        backgroundColor: '#0a0a0a',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `RAKVIH_ID_CARD_${volunteer?.name?.replace(/\s+/g, '_') || 'Volunteer'}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading ID card:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  const formattedDob = volunteer?.dob 
    ? new Date(volunteer.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "Not specified";

  const memberSince = volunteer?.created_at
    ? new Date(volunteer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  const volunteerIdNumber = volunteer?.display_id || "Rak-PENDING";
  const qrVerificationUrl = `https://www.rakvihfoundation.org.in/verify/volunteer/${volunteer?.id}`;

  return (
    <div className="max-w-[900px] mx-auto pb-12">
      
      {/* Header & Support Button */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Your registered details and digital ID with RAKVIH Foundation.
          </p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowSupport(true)}
          className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-[#111] dark:text-zinc-300 dark:hover:bg-zinc-900 transition"
        >
          <Headset size={16} className="text-[#798321] dark:text-[#FFC107]" />
          <span className="hidden sm:inline">Help & Support</span>
        </motion.button>
      </div>

      {/* ================= TOP SECTION: PROFILE DETAILS ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="w-full flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-neutral-800 dark:bg-[#0a0a0a] mb-12"
      >
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-neutral-800/80 pb-6 mb-6">
          <div className="flex items-center gap-5">
            
            {/* Editable Avatar */}
            <div className="relative group">
              <div className="flex h-16 w-16 shrink-0 overflow-hidden items-center justify-center rounded-full bg-[#798321]/10 text-2xl font-extrabold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                {isUploadingImage ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : volunteer?.profile_image_url ? (
                  <img src={volunteer.profile_image_url} alt="Profile" className="h-full w-full object-cover" crossOrigin="anonymous" />
                ) : (
                  volunteer?.name?.charAt(0) || "V"
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                title="Update Profile Photo"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black"
              >
                <Camera size={12} />
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfileImageUpdate} className="hidden" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{volunteer?.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 uppercase tracking-widest dark:bg-zinc-800 dark:text-zinc-300">
                  {volunteer?.volunteer_type || "Volunteer"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-left sm:text-right border-t border-slate-100 dark:border-neutral-800/80 sm:border-0 pt-4 sm:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Member Since</p>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{memberSince}</p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="rounded-2xl bg-slate-50 p-6 dark:bg-[#111] border border-slate-100 dark:border-neutral-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-7 gap-x-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Mail size={12}/> Email Address</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">{volunteer?.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Phone size={12}/> Phone Number</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">+91 {volunteer?.phone}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><User size={12}/> Gender</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{volunteer?.gender}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><CalIcon size={12}/> Date of Birth</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{formattedDob}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Droplet size={12}/> Blood Group</span>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-500">{volunteer?.blood_group || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Droplet size={12}/> Active Donor</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{volunteer?.active_blood_donor}</p>
            </div>
            <div className="sm:col-span-2 md:col-span-3 space-y-1 pt-3 border-t border-slate-200 dark:border-neutral-800/80">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><MapPin size={12}/> Registered Address</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed">
                {volunteer?.street_address}, {volunteer?.city}
              </p>
            </div>
          </div>
        </div>
      </motion.div>


      {/* ================= BOTTOM SECTION: OFFICIAL ID CARD EXPORT ================= */}
      <div className="w-full flex flex-col items-center">
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Official Digital ID</h3>
        
        {/* Scrollable Container for Mobile */}
        <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
          
          {/* THE WRAPPER THAT GETS DOWNLOADED AS ONE IMAGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            ref={combinedCardRef}
            className="flex flex-row items-center gap-8 p-10 w-fit mx-auto bg-[#0a0a0a] border border-neutral-800 rounded-[32px] shadow-xl"
          >
            
            {/* ====== FRONT CARD ====== */}
            <div className="w-[340px] h-[520px] shrink-0 rounded-[24px] overflow-hidden bg-[#151515] border border-neutral-700/50 shadow-2xl flex flex-col relative">
              
              {/* Header Banner */}
              <div className="bg-[#0a0a0a] px-4 pt-5 pb-5 text-center border-b-4 border-[#FFC107] shrink-0 flex flex-col items-center justify-center">
                <img src="/Found1.png" alt="Rakvih Logo" className="h-12 w-auto mx-auto mb-1.5 object-contain" crossOrigin="anonymous" />
                <h2 className="text-[18px] font-black tracking-widest text-[#FFC107] uppercase font-serif leading-tight">Rakvih Foundation</h2>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.25em] mt-0.5">Official Volunteer ID</p>
              </div>

              {/* Body Content */}
              <div className="flex-1 px-5 py-4 flex flex-col text-center justify-between">
                
                {/* Avatar & Verification Badge Row */}
                <div className="flex items-center justify-center relative mt-1">
                  <div className="h-[84px] w-[84px] rounded-2xl border-2 border-[#FFC107] bg-zinc-800 shadow-md flex items-center justify-center overflow-hidden relative">
                    {isUploadingImage ? (
                      <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
                    ) : volunteer?.profile_image_url ? (
                      <img src={volunteer.profile_image_url} alt="ID Photo" className="h-full w-full object-cover" crossOrigin="anonymous" />
                    ) : (
                      <User size={38} className="text-neutral-600" />
                    )}
                  </div>
                  <div className="absolute bottom-0 translate-x-8 translate-y-1 bg-[#151515] rounded-full p-0.5 border border-neutral-700">
                    <BadgeCheck size={20} className="text-[#10b981]" />
                  </div>
                </div>

                {/* Name & Type */}
                <div className="mt-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white truncate px-2">{volunteer?.name}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5">{volunteer?.volunteer_type || "Volunteer"}</p>
                </div>

                {/* ID NUMBER & QR CODE ROW */}
                <div className="flex items-center justify-center gap-3 my-2">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-[#0a0a0a] px-4 border border-neutral-800 h-[56px] flex-1">
                     <p className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">ID Number</p>
                     <p className="text-[11.5px] font-mono font-bold text-zinc-200 uppercase tracking-wider">{volunteerIdNumber}</p>
                  </div>
                  <div className="bg-white p-1.5 rounded-xl shadow-sm border border-neutral-800 shrink-0 h-[56px] w-[56px] flex items-center justify-center">
                    <QRCode value={qrVerificationUrl} size={42} bgColor="#ffffff" fgColor="#000000" level="Q" />
                  </div>
                </div>

                {/* Quick Details Stack */}
                <div className="flex flex-col gap-1.5 w-full">
                   <div className="rounded-lg bg-[#0a0a0a] px-3.5 py-2 border border-neutral-800/80 flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5"><Droplet size={11} className="text-rose-500"/> Blood Group</p>
                      <p className="text-[12px] font-black text-rose-500">{volunteer?.blood_group || "N/A"}</p>
                   </div>
                   <div className="rounded-lg bg-[#0a0a0a] px-3.5 py-2 border border-neutral-800/80 flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5"><Phone size={11} className="text-emerald-500"/> Phone No.</p>
                      <p className="text-[12px] font-bold text-zinc-200 truncate">+91 {volunteer?.phone}</p>
                   </div>
                </div>

              </div>
            </div>

            {/* ====== BACK CARD ====== */}
            <div className="w-[340px] h-[520px] shrink-0 rounded-[24px] overflow-hidden bg-[#151515] border border-neutral-700/50 shadow-2xl flex flex-col justify-between p-6">
              
              {/* Header */}
              <div className="flex flex-col items-center justify-center border-b border-neutral-800/80 pb-4 pt-1 shrink-0">
                  <img src="/Found1.png" alt="Rakvih Logo" className="h-9 w-auto mb-2 opacity-80" crossOrigin="anonymous" />
                  <h3 className="text-[11px] font-black tracking-widest text-[#FFC107] uppercase font-serif">Terms & Conditions</h3>
              </div>
              
              {/* Rules */}
              <ul className="text-[10px] space-y-2.5 list-disc pl-4 text-neutral-400 font-medium my-auto">
                  <li>This identity card is the property of RAKVIH Foundation.</li>
                  <li>It must be worn and clearly visible during all foundation activities and events.</li>
                  <li>This card is strictly non-transferable and valid only for the registered individual.</li>
                  <li>In case of loss, immediately report to the RAKVIH Admin team.</li>
              </ul>

              {/* Footer Group */}
              <div className="shrink-0 space-y-3">
                {/* Address Box */}
                <div className="bg-[#0a0a0a] rounded-xl p-3.5 border border-neutral-800/80">
                    <h4 className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={9}/> If found, return to:</h4>
                    <p className="text-[9.5px] font-bold text-white leading-snug">
                      RAKVIH Foundation<br/>
                      238, 2nd Main, 2nd Cross Rd, Attur Layout,<br/>
                      Yelahanka, Bengaluru, Karnataka 560064
                    </p>
                </div>

                {/* Contact Footer */}
                <div className="space-y-1.5 border-t border-neutral-800/80 pt-3">
                    <p className="text-[9.5px] font-bold flex items-center gap-2 text-zinc-300"><Phone size={11} className="text-[#FFC107]"/> +91 8549943535</p>
                    <p className="text-[9.5px] font-bold flex items-center gap-2 text-zinc-300"><Mail size={11} className="text-[#FFC107]"/> office@rakvih.in</p>
                    <p className="text-[9.5px] font-bold flex items-center gap-2 text-zinc-300"><Globe size={11} className="text-[#FFC107]"/> www.rakvihfoundation.org.in</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* SINGLE DOWNLOAD BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={downloadCombinedID}
          disabled={isDownloading || isUploadingImage}
          className="w-full max-w-[360px] flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white px-4 py-4 text-[13px] font-bold text-white dark:text-black shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 mt-2"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {isDownloading ? "Generating Image..." : "Download Digital ID"}
        </motion.button>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3 text-center">
          Downloads as a single print-ready image
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
                    <a href="tel:+918549943535" className="text-sm font-bold text-slate-900 dark:text-white hover:underline">
                      +91 8549943535
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