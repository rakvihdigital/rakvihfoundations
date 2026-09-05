"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Calendar, Clock, ArrowRight, BookOpen, 
  Utensils, Sprout, Heart, CalendarPlus, CheckCircle2, Loader2, Hourglass, Award, Play, Square 
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { startVolunteerShift, endVolunteerShift } from "@/app/adminfoundations/volunteers/actions";

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

// Live stopwatch component that ticks every second when a shift is active
function LiveShiftTimer({ startTimeISO }: { startTimeISO: string }) {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    const updateTimer = () => {
      const startMs = new Date(startTimeISO).getTime();
      const diffMs = Math.max(0, Date.now() - startMs);

      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);

      const pad = (n: number) => n.toString().padStart(2, "0");
      setElapsed(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTimeISO]);

  return (
    <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      <span>{elapsed}</span>
    </div>
  );
}

export default function VolunteerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, string>>({});
  const [shifts, setShifts] = useState<Record<string, any>>({});
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

    // Fetch volunteer registrations & logs
    if (vid) {
      const [regRes, logsRes] = await Promise.all([
        supabase.from("event_registrations").select("event_id, status").eq("volunteer_id", vid),
        supabase.from("volunteer_logs").select("*").eq("volunteer_id", vid)
      ]);

      if (regRes.data) {
        const regMap: Record<string, string> = {};
        regRes.data.forEach((r) => (regMap[r.event_id] = r.status));
        setRegistrations(regMap);
      }

      if (logsRes.data) {
        const shiftMap: Record<string, any> = {};
        logsRes.data.forEach((log) => {
          try {
            const parsed = JSON.parse(log.status || "{}");
            if (parsed.type === "SHIFT_STARTED") {
              shiftMap[log.title] = { state: "in_progress", startTime: parsed.start };
            } else if (parsed.type === "SHIFT_ENDED" || parsed.type === "VERIFIED_COMPLETED") {
              shiftMap[log.title] = { 
                state: "ended", 
                startTime: parsed.start, 
                endTime: parsed.end, 
                duration: parsed.duration, 
                hours: parsed.hours || log.hours 
              };
            }
          } catch {}
        });
        setShifts(shiftMap);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
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
      setRegistrations((prev) => ({ ...prev, [eventId]: "pending" }));
    }
    
    setProcessingId(null);
  };

  // Start Volunteer Shift Timer on event day
  const handleStartShift = async (event: any) => {
    if (!volunteerId) return;
    setProcessingId(event.id);

    try {
      const res = await startVolunteerShift({
        volunteerId,
        eventTitle: event.title,
        eventDate: event.event_date,
      });

      if (res?.success) {
        setShifts((prev) => ({
          ...prev,
          [event.title]: { state: "in_progress", startTime: res.startTime }
        }));
      }
    } catch (err: any) {
      alert("Error starting shift: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Stop Volunteer Shift Timer
  const handleEndShift = async (event: any) => {
    if (!volunteerId) return;
    if (!confirm("Are you ready to end your shift? Your time worked will be submitted to admin for verification.")) {
      return;
    }

    setProcessingId(event.id);

    try {
      const res = await endVolunteerShift({
        volunteerId,
        eventTitle: event.title,
        eventDate: event.event_date,
      });

      if (res?.success) {
        setShifts((prev) => ({
          ...prev,
          [event.title]: { 
            state: "ended", 
            startTime: res.startTime, 
            endTime: res.endTime, 
            duration: res.duration, 
            hours: res.hours 
          }
        }));
        alert(`Shift completed! Logged: ${res.duration}. Admin has been notified to verify.`);
      }
    } catch (err: any) {
      alert("Error ending shift: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Volunteer Opportunities
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
          Find upcoming drives and track your volunteer shift timers on event day.
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

            // Check registration & shift status
            const regStatus = registrations[event.id]; 
            const shift = shifts[event.title] || { state: "not_started" };
            const isProcessing = processingId === event.id;

            // Is today the event date or has it arrived?
            const isEventDayOrActive = event.event_date <= today;

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
                  {/* Dynamic Shift & Button States */}
                  {regStatus === "completed" ? (
                    <div className="flex flex-col items-start md:items-end gap-1">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm">
                        <Award size={15} /> Completed & Verified
                      </span>
                      {shift.duration && (
                        <span className="text-[10px] text-slate-400 font-medium">Logged: {shift.duration}</span>
                      )}
                    </div>
                  ) : regStatus === "approved" ? (
                    /* Shift Timer Controls on Event Day */
                    shift.state === "in_progress" ? (
                      <div className="flex flex-col items-start md:items-end gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Shift Active:</span>
                          <LiveShiftTimer startTimeISO={shift.startTime} />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                          Started at {new Date(shift.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • Admin notified
                        </p>
                        <button
                          onClick={() => handleEndShift(event)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm"
                        >
                          {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Square size={13} />}
                          End Shift & Stop Timer
                        </button>
                      </div>
                    ) : shift.state === "ended" ? (
                      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-left md:text-right space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={13} /> Shift Finished ({shift.duration || "Logged"})
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                          Admin notified to verify and unlock certificate.
                        </p>
                      </div>
                    ) : isEventDayOrActive ? (
                      <div className="flex flex-col items-start md:items-end gap-1.5">
                        <button
                          onClick={() => handleStartShift(event)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:scale-105 active:scale-95"
                        >
                          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                          Start Volunteer Shift
                        </button>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Click when you arrive on-site
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start md:items-end gap-1">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 text-xs font-bold">
                          <CheckCircle2 size={14} /> Approved (Attending)
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Timer activates on {event.event_date}
                        </span>
                      </div>
                    )
                  ) : regStatus === "pending" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-4 py-2 text-xs font-bold">
                      <Hourglass size={14} /> Pending Approval
                    </span>
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