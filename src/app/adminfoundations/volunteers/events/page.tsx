"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { CalendarPlus, Trash2, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/foundation/adminheader";
import { getEvents, createEvent, deleteEvent, updateEvent } from "../actions";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export default function EventsPage() {
  const [isPending, startTransition] = useTransition();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const evts = await getEvents();
      setEvents(evts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(async () => {
      try {
        await createEvent(new FormData(form));
        form.reset();
        await loadData();
        alert("Event published successfully!");
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    });
  };

  const handleUpdateEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;
    const form = e.currentTarget;
    startTransition(async () => {
      try {
        await updateEvent(editingEvent.id, new FormData(form));
        setEditingEvent(null);
        await loadData();
        alert("Event updated successfully!");
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    });
  };

  return (
    <div className={`min-h-screen bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Manage Events</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Create and manage opportunities for your volunteers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-4 mb-4 dark:border-zinc-800 flex items-center gap-2"><CalendarPlus size={20} className="text-[#798321] dark:text-[#FFC107]" /> New Event</h2>
                <div><label className="block text-xs font-bold mb-1">Event Title</label><input type="text" name="title" required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select name="category" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
                    <option value="Food Drive">Food Drive</option><option value="Education">Education</option><option value="Healthcare">Healthcare</option><option value="Environment">Environment</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold mb-1">Date</label><input type="date" name="event_date" required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                  <div><label className="block text-xs font-bold mb-1">Time</label><input type="text" name="event_time" required placeholder="10 AM - 2 PM" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                </div>
                <div><label className="block text-xs font-bold mb-1">Location</label><input type="text" name="location" required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                <button type="submit" disabled={isPending} className="mt-4 w-full rounded-xl bg-[#798321] py-3 text-xs font-bold text-white transition hover:bg-[#647019] dark:bg-[#FFC107] dark:text-black">Publish Event</button>
              </form>
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 min-h-[500px]">
              {loading ? (
                <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" /></div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold mb-4 dark:text-white">Active Events</h2>
                  {events.length === 0 ? <p className="text-slate-400 text-sm">No events found.</p> : events.map(evt => (
                    <div key={evt.id} className="flex items-center justify-between border border-slate-100 p-4 rounded-2xl dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-slate-200 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full mb-1 inline-block">{evt.category}</span>
                        <h3 className="font-bold text-sm dark:text-white">{evt.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex gap-3 mt-1"><span>📅 {evt.event_date}</span> <span>📍 {evt.location}</span></p>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => setEditingEvent(evt)} title="Edit Event" className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 p-2 rounded-xl h-fit transition"><Pencil size={16}/></button>
                        <button onClick={async () => { if(confirm("Delete event?")) { await deleteEvent(evt.id); loadData(); } }} disabled={isPending} title="Delete Event" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl h-fit disabled:opacity-50 transition"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Event</h3>
                <button onClick={() => setEditingEvent(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"><X size={18} /></button>
              </div>

              <form onSubmit={handleUpdateEventSubmit} className="space-y-4">
                <div><label className="block text-xs font-bold mb-1">Event Title</label><input type="text" name="title" defaultValue={editingEvent.title} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                <div>
                  <label className="block text-xs font-bold mb-1">Category</label>
                  <select name="category" defaultValue={editingEvent.category} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
                    <option value="Food Drive">Food Drive</option><option value="Education">Education</option><option value="Healthcare">Healthcare</option><option value="Environment">Environment</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold mb-1">Date</label><input type="date" name="event_date" defaultValue={editingEvent.event_date} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                  <div><label className="block text-xs font-bold mb-1">Time</label><input type="text" name="event_time" defaultValue={editingEvent.event_time} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                </div>
                <div><label className="block text-xs font-bold mb-1">Location</label><input type="text" name="location" defaultValue={editingEvent.location} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" /></div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <button type="button" onClick={() => setEditingEvent(null)} className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 transition">Cancel</button>
                  <button type="submit" disabled={isPending} className="rounded-xl bg-[#798321] px-5 py-2 text-xs font-bold text-white dark:bg-[#FFC107] dark:text-black transition">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}