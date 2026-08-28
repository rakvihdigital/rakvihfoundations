"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Calendar, Clock, ArrowRight, BookOpen, 
  Utensils, Sprout, Heart, CalendarPlus, CheckCircle2, Loader2, Hourglass
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const CATEGORY_CONFIG: Record<string, any> = {
  "Food Drive": { icon: Utensils, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40" },
  "Education": { icon: BookOpen, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40" },
  "Healthcare": { icon: Heart, color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40" },
  "Environment": { icon: Sprout, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40" },
};

const defaultConfig = { icon: Calendar, color: "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-zinc-800" };

export default function VolunteerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, string>>({});
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventsAndRegistrations = async () => {
      const vid = localStorage.getItem("rakvih_volunteer_id");
      setVolunteerId(vid);
      
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from("volunteer_events")
        .select("*")
        .gte("event_date", today)
        .order("event_date", { ascending: true });
      
      if (eventsData) setEvents(eventsData);

      // Fetch the volunteer's specific event registrations
      if (vid) {
        const { data: regData } = await supabase
          .from("event_registrations")
          .select("event_id, status")
          .eq("volunteer_id", vid);

        if (regData) {
          // Convert to a quick lookup object: { "event-id-123": "pending", "event-id-456": "approved" }
          const regMap: Record<string, string> = {};
          regData.forEach(r => regMap[r.event_id] = r.status);
          setRegistrations(regMap);
        }
      }

      setLoading(false);
    };

    fetchEventsAndRegistrations();
  }, []);

  // Handle clicking the "I'm Interested" button
  const handleRegister = async (eventId: string) => {
    if (!volunteerId) return alert("Error: Volunteer ID not found.");
    
    setProcessingId(eventId);

    const { error } = await supabase
      .from("event_registrations")
      .insert([{ event_id: eventId, volunteer_id: volunteerId, status: "pending" }]);

    if (error) {
      alert("Something went wrong. Please try again.");
    } else {
      // Instantly update the UI to show 'pending' without reloading the page
      setRegistrations(prev => ({ ...prev, [eventId]: "pending" }));
    }
    
    setProcessingId(null);
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
          Volunteer Opportunities
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
          Find upcoming drives and events where your help is needed most.
        </p>
      </motion.div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-slate-200 dark:border-neutral-800">
          <CalendarPlus size={40} className="mx-auto text-slate-300 dark:text-neutral-700 mb-3" />
          <p className="font-bold text-slate-500 dark:text-neutral-400">No upcoming events right now. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => {
            const config = CATEGORY_CONFIG[event.category] || defaultConfig;
            const Icon = config.icon;
            
            const eventDate = new Date(event.event_date + 'T00:00:00');
            const fullDateString = eventDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
            const shortWeekday = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

            // Check the registration status for THIS specific event
            const regStatus = registrations[event.id]; 
            const isProcessing = processingId === event.id;

            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#111] flex flex-col md:flex-row md:items-center gap-6"
              >
                
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
                  <Icon size={24} className="text-slate-400 dark:text-zinc-500 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{shortWeekday}</span>
                </div>

                <div className="flex-1">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase mb-2 ${config.color}`}>
                    {event.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {fullDateString}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {event.event_time}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {/* Dynamic Button States */}
                  {regStatus === "approved" ? (
                    <button disabled className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-6 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 cursor-not-allowed">
                      <CheckCircle2 size={16} /> Registered
                    </button>
                  ) : regStatus === "pending" ? (
                    <button disabled className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-100 px-6 py-3 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 cursor-not-allowed">
                      <Hourglass size={16} /> Pending Approval
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRegister(event.id)}
                      disabled={isProcessing}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#798321] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#647019] dark:bg-[#FFC107] dark:text-black dark:hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : "I'm Interested"}
                      {!isProcessing && <ArrowRight size={16} />}
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}