"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { Megaphone, Trash2 } from "lucide-react";
import AdminHeader from "@/components/foundation/adminheader";
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from "../actions";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export default function AnnouncementsPage() {
  const [isPending, startTransition] = useTransition();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const anns = await getAnnouncements();
      setAnnouncements(anns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAnnouncementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      try {
        await createAnnouncement(new FormData(form));
        form.reset();
        await loadData();
        alert("Announcement posted successfully!");
      } catch (err: any) {
        alert("Error creating announcement: " + err.message);
      }
    });
  };

  return (
    <div className={`min-h-screen bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Notice Board</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Broadcast urgent needs or general information to all volunteers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-4 mb-4 dark:border-zinc-800 flex items-center gap-2">
                  <Megaphone size={20} className="text-[#798321] dark:text-[#FFC107]" /> Post Notice
                </h2>
                <div>
                  <label className="block text-xs font-bold mb-1">Notice Type</label>
                  <select name="type" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
                    <option value="Urgent">Urgent (Red)</option>
                    <option value="Info">General Info (Blue)</option>
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1">Title</label><input type="text" name="title" required placeholder="e.g. O+ Blood Needed" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                <div><label className="block text-xs font-bold mb-1">Message</label><textarea name="message" required rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"></textarea></div>
                <button type="submit" disabled={isPending} className="mt-4 w-full rounded-xl bg-rose-600 py-3 text-xs font-bold text-white transition hover:bg-rose-700">Broadcast Notice</button>
              </form>
            </div>
          </div>

          {/* Announcements List */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 min-h-[500px]">
              {loading ? (
                <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" /></div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold mb-4 dark:text-white">Active Notices</h2>
                  {announcements.length === 0 ? <p className="text-slate-400 text-sm">No notices found.</p> : announcements.map(ann => (
                    <div key={ann.id} className={`flex justify-between border p-4 rounded-2xl ${ann.type === "Urgent" ? "border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30" : "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/30"}`}>
                      <div>
                        <span className={`text-[10px] font-bold uppercase mb-1 inline-block ${ann.type === "Urgent" ? "text-rose-600 dark:text-rose-400" : "text-blue-600 dark:text-blue-400"}`}>{ann.type} Notice</span>
                        <h3 className={`font-bold text-sm ${ann.type === "Urgent" ? "text-rose-950 dark:text-rose-100" : "text-blue-950 dark:text-blue-100"}`}>{ann.title}</h3>
                        <p className={`text-xs mt-1 opacity-80 ${ann.type === "Urgent" ? "text-rose-900 dark:text-rose-200" : "text-blue-900 dark:text-blue-200"}`}>{ann.message}</p>
                      </div>
                      <button onClick={async () => { if(confirm("Delete this notice?")) { await deleteAnnouncement(ann.id); loadData(); } }} disabled={isPending} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl h-fit disabled:opacity-50"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}