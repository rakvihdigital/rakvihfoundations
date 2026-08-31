"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { Clock, Trash2, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/foundation/adminheader";
import { getVolunteers, getRecentLogs, logVolunteerHours, deleteVolunteerLog, updateVolunteerLog } from "../actions";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export default function LogHoursPage() {
  const [isPending, startTransition] = useTransition();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [vols, recentLogs] = await Promise.all([getVolunteers(), getRecentLogs()]);
      setVolunteers(vols || []);
      setLogs(recentLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleHoursSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      try {
        await logVolunteerHours(new FormData(form));
        form.reset();
        await loadData();
        alert("Hours logged successfully!");
      } catch (err: any) {
        alert("Error logging hours: " + err.message);
      }
    });
  };

  const handleUpdateLogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLog) return;
    const form = e.currentTarget;
    startTransition(async () => {
      try {
        await updateVolunteerLog(editingLog.id, new FormData(form));
        setEditingLog(null);
        await loadData();
        alert("Log updated successfully!");
      } catch (err: any) {
        alert("Error updating log: " + err.message);
      }
    });
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0B1220] ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Log Volunteer Hours</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Record impact hours manually for verified volunteers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <form onSubmit={handleHoursSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-4 mb-4 dark:border-zinc-800 flex items-center gap-2">
                  <Clock size={20} className="text-[#798321] dark:text-[#FFC107]" /> Log Hours
                </h2>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Select Volunteer</label>
                  <select name="volunteer_id" required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]">
                    <option value="">-- Choose Volunteer --</option>
                    {volunteers.filter(v => v.status === "approved").map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.display_id || "Rak-PENDING"})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Event Name / Activity</label>
                  <input type="text" name="title" required placeholder="e.g. Tree Plantation Drive" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Date Completed</label>
                    <input type="date" name="date" required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Hours Logged</label>
                    <input type="number" name="hours" required min="1" max="24" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" />
                  </div>
                </div>
                <button type="submit" disabled={isPending} className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">Submit Hours</button>
              </form>
            </div>
          </div>

          {/* Logs List */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 min-h-[500px]">
              {loading ? (
                <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" /></div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold mb-4 dark:text-white">Recently Logged Hours</h2>
                  {logs.length === 0 ? (
                    <p className="text-slate-400 text-sm">No hours have been logged yet.</p>
                  ) : (
                    logs.map(log => {
                      const vol = volunteers.find(v => v.id === log.volunteer_id);
                      return (
                        <div key={log.id} className="flex items-center justify-between border border-slate-100 p-4 rounded-2xl dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 hover:bg-slate-100 dark:hover:bg-zinc-900 transition">
                          <div>
                            <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-0.5 rounded-full mb-1.5 inline-block">
                              +{log.hours} Hours
                            </span>
                            <div className="flex items-center gap-2">
                               <h3 className="font-bold text-sm dark:text-white">
                                  {vol ? vol.name : "Unknown Volunteer"}
                               </h3>
                               {vol?.display_id && (
                                   <span className="bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                                       {vol.display_id}
                                   </span>
                               )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex gap-3 mt-1">
                              <span className="flex items-center gap-1"><Clock size={10}/> {new Date(log.date).toLocaleDateString()}</span> 
                              <span>📌 {log.title}</span>
                            </p>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => setEditingLog(log)} title="Edit Log" className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 p-2 rounded-xl h-fit transition"><Pencil size={16}/></button>
                            <button 
                              onClick={() => { 
                                if(confirm("Delete this log? It will remove the hours from the volunteer's profile.")) {
                                  startTransition(async () => {
                                      try {
                                          await deleteVolunteerLog(log.id);
                                          await loadData();
                                      } catch (err: any) {
                                          alert("Failed to delete log: " + err.message);
                                      }
                                  });
                                }
                              }} 
                              disabled={isPending} 
                              title="Delete Log"
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl h-fit disabled:opacity-50 transition"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Edit Log Modal */}
      <AnimatePresence>
        {editingLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Logged Hours</h3>
                <button onClick={() => setEditingLog(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"><X size={18} /></button>
              </div>

              <form onSubmit={handleUpdateLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Select Volunteer</label>
                  <select name="volunteer_id" defaultValue={editingLog.volunteer_id} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]">
                    {volunteers.filter(v => v.status === "approved").map(v => (
                        <option key={v.id} value={v.id}>
                            {v.name} ({v.display_id || "Rak-PENDING"})
                        </option>
                    ))}
                  </select>
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Event Name / Activity</label>
                    <input type="text" name="title" defaultValue={editingLog.title} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Date Completed</label>
                      <input type="date" name="date" defaultValue={editingLog.date} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">Hours Logged</label>
                      <input type="number" name="hours" defaultValue={editingLog.hours} required min="1" max="24" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <button type="button" onClick={() => setEditingLog(null)} className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 transition hover:bg-slate-200 dark:hover:bg-zinc-700">Cancel</button>
                  <button type="submit" disabled={isPending} className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-50">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}