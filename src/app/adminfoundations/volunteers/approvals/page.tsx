"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Check, Award, RotateCcw, Play, Square, AlertCircle } from "lucide-react";
import AdminHeader from "@/components/foundation/adminheader";
import { getEventRegistrations, updateRegistrationStatus } from "../actions";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export default function ApprovalsPage() {
  const [isPending, startTransition] = useTransition();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  useEffect(() => {
    loadData();

    // Auto-refresh every 8 seconds so shift timer updates live for admin
    const interval = setInterval(() => {
      loadData(false);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  async function loadData(showSpinner = true) {
    if (showSpinner) setLoading(true);
    try {
      const regs = await getEventRegistrations();
      setRegistrations(regs || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  const handleRegistrationStatusUpdate = async (id: string, newStatus: "approved" | "rejected" | "completed" | "pending") => {
    startTransition(async () => {
      try {
        await updateRegistrationStatus(id, newStatus);
        await loadData(false);
      } catch (err: any) {
        alert("Failed to update: " + err.message);
      }
    });
  };

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
      return "";
    }
  };

  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const completedCount = registrations.filter((r) => r.status === "completed").length;

  const filteredRegistrations = registrations.filter((r) => {
    if (filterStatus === "All") return true;
    return r.status === filterStatus;
  });

  return (
    <div className={`min-h-screen bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Event Approvals & Volunteer Shifts</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Approve registrations, monitor live volunteer shift timers, verify completed work, and issue certificates.
              </p>
            </div>
            <button
              onClick={() => loadData(true)}
              className="w-fit inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-zinc-800 transition"
            >
              <RotateCcw size={12} /> Refresh Live Shifts
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Requests</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">{registrations.length}</span>
            </div>
            
            <div className={`rounded-2xl border px-4 py-2.5 shadow-sm ${pendingCount > 0 ? "border-amber-300 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20" : "border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"}`}>
              <span className="block text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Pending Approval</span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Approved (Ready)</span>
              <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{approvedCount}</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Marked Completed</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "pending", "approved", "completed", "rejected"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  filterStatus === st 
                    ? "bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black shadow-sm" 
                    : "bg-zinc-900 text-slate-400 border border-zinc-800 hover:text-white"
                }`}
              >
                {st === "All" ? "All Requests" : st}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <div className="py-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" /></div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ClipboardCheck size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">No event registrations matching this filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                      <th className="py-4 px-6">Volunteer Details</th>
                      <th className="py-4 px-4">Event Requested</th>
                      <th className="py-4 px-4">Shift & Timer Record</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                    {filteredRegistrations.map((reg) => {
                      const shift = reg.shift || { state: "not_started" };
                      const hasShiftEnded = shift.state === "ended" || shift.state === "verified";
                      const isShiftInProgress = shift.state === "in_progress";

                      return (
                        <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {reg.volunteers?.name || "Unknown User"}
                              {reg.volunteers?.display_id && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                  {reg.volunteers.display_id}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{reg.volunteers?.email}</div>
                            {reg.volunteers?.phone && (
                              <div className="text-slate-400 text-[10px] mt-0.5">+91 {reg.volunteers.phone}</div>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-[#798321] dark:text-[#FFC107]">{reg.volunteer_events?.title || "Unknown Event"}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                              📅 {reg.volunteer_events?.event_date ? new Date(reg.volunteer_events.event_date).toLocaleDateString() : "TBD"}
                              {reg.volunteer_events?.event_time && ` • ${reg.volunteer_events.event_time}`}
                            </div>
                          </td>

                          {/* Volunteer Shift & Timer Tracking Display */}
                          <td className="py-4 px-4">
                            {reg.status === "pending" ? (
                              <span className="text-slate-400 dark:text-zinc-600 text-xs">—</span>
                            ) : isShiftInProgress ? (
                              <div className="rounded-2xl border border-amber-400/40 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 space-y-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" /> Shift In Progress
                                </span>
                                <div className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200">
                                  🕒 Started: <span className="font-mono text-amber-600 dark:text-amber-400">{formatTime(shift.startTime)}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-neutral-400">Currently active on-site</p>
                              </div>
                            ) : hasShiftEnded ? (
                              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 space-y-1">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                  <CheckCircle2 size={11} /> Shift Finished
                                </span>
                                <div className="text-[11px] text-slate-700 dark:text-zinc-300 space-y-0.5">
                                  <div>🕒 <span className="text-slate-400">Start:</span> {formatTime(shift.startTime) || "Logged"}</div>
                                  <div>🏁 <span className="text-slate-400">End:</span> {formatTime(shift.endTime) || "Logged"}</div>
                                  <div className="font-bold text-[#798321] dark:text-[#FFC107]">
                                    ⏱️ Hours Worked: {shift.duration || `${shift.hours}h`}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                  <Clock size={10} /> Shift Not Started
                                </span>
                                <p className="text-[10px] text-slate-400">Volunteer has not clocked in yet</p>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            {reg.status === "completed" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                                <Award size={11} /> Completed
                              </span>
                            )}
                            {reg.status === "approved" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
                                <CheckCircle2 size={11} /> Approved
                              </span>
                            )}
                            {reg.status === "pending" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                                <Clock size={11} /> Pending
                              </span>
                            )}
                            {reg.status === "rejected" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                                <XCircle size={11} /> Rejected
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Pending State -> Approve or Reject */}
                              {reg.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleRegistrationStatusUpdate(reg.id, "approved")}
                                    disabled={isPending}
                                    title="Approve Volunteer Registration"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400 transition text-xs font-bold"
                                  >
                                    <Check size={13} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleRegistrationStatusUpdate(reg.id, "rejected")}
                                    disabled={isPending}
                                    title="Reject Request"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-950/40 dark:text-rose-400 transition"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </>
                              )}

                              {/* Approved State -> Mark Completed (Enabled only after shift is ended!) */}
                              {reg.status === "approved" && (
                                <div className="flex items-center gap-1.5">
                                  {hasShiftEnded ? (
                                    <button
                                      onClick={() => handleRegistrationStatusUpdate(reg.id, "completed")}
                                      disabled={isPending}
                                      title={`Volunteer clocked ${shift.duration || 'their shift'}. Click to finalize completion & unlock certificate.`}
                                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition text-xs font-extrabold ring-2 ring-emerald-500/50"
                                    >
                                      <Award size={14} /> Mark Completed
                                    </button>
                                  ) : isShiftInProgress ? (
                                    <div className="flex flex-col items-end">
                                      <button
                                        disabled
                                        title="Shift timer is currently running. Volunteer must stop the timer before completing."
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-slate-500 text-xs font-bold cursor-not-allowed opacity-60"
                                      >
                                        <Clock size={12} /> Shift Active
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm("Volunteer has not stopped timer yet. Are you sure you want to manually mark completed?")) {
                                            handleRegistrationStatusUpdate(reg.id, "completed");
                                          }
                                        }}
                                        className="text-[9px] text-slate-500 hover:text-slate-300 mt-1 underline"
                                      >
                                        Override
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-end">
                                      <button
                                        disabled
                                        title="Volunteer must clock in and clock out their shift timer on event day before marking completed."
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-slate-500 text-xs font-bold cursor-not-allowed opacity-40"
                                      >
                                        <Award size={12} /> Mark Completed
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm("Volunteer hasn't clocked in or out. Mark completed anyway?")) {
                                            handleRegistrationStatusUpdate(reg.id, "completed");
                                          }
                                        }}
                                        className="text-[9px] text-slate-500 hover:text-slate-300 mt-1 underline"
                                      >
                                        Manual Override
                                      </button>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => handleRegistrationStatusUpdate(reg.id, "rejected")}
                                    disabled={isPending}
                                    title="Reject Request"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-950/40 dark:text-rose-400 transition"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              )}

                              {/* Completed State -> Undo option */}
                              {reg.status === "completed" && (
                                <button
                                  onClick={() => handleRegistrationStatusUpdate(reg.id, "approved")}
                                  disabled={isPending}
                                  title="Revert back to Approved"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-slate-200 border border-zinc-800 transition"
                                >
                                  <RotateCcw size={10} /> Revert to Approved
                                </button>
                              )}

                              {/* Rejected State -> Re-Approve option */}
                              {reg.status === "rejected" && (
                                <button
                                  onClick={() => handleRegistrationStatusUpdate(reg.id, "approved")}
                                  disabled={isPending}
                                  title="Re-Approve Volunteer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400 transition text-xs font-bold"
                                >
                                  <RotateCcw size={12} /> Re-Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}