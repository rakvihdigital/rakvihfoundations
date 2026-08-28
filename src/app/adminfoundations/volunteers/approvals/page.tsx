"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Check } from "lucide-react";
import AdminHeader from "@/components/foundation/adminheader";
import { getEventRegistrations, updateRegistrationStatus } from "../actions";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export default function ApprovalsPage() {
  const [isPending, startTransition] = useTransition();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const regs = await getEventRegistrations();
      setRegistrations(regs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRegistrationStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    startTransition(async () => {
      try {
        await updateRegistrationStatus(id, newStatus);
        await loadData();
      } catch (err: any) {
        alert("Failed to update: " + err.message);
      }
    });
  };

  const pendingCount = registrations.filter((r) => r.status === "pending").length;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0B1220] ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Event Approvals</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Review and approve volunteer requests to join events.</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Requests</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">{registrations.length}</span>
            </div>
            <div className={`rounded-2xl border px-4 py-2.5 shadow-sm ${pendingCount > 0 ? "border-amber-300 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20" : "border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"}`}>
              <span className="block text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Pending Actions</span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <div className="py-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" /></div>
            ) : registrations.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ClipboardCheck size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">No event registrations found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                      <th className="py-4 px-6">Volunteer Details</th>
                      <th className="py-4 px-4">Event Requested</th>
                      <th className="py-4 px-4">Applied On</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 dark:text-white">{reg.volunteers?.name || "Unknown User"}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">{reg.volunteers?.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#798321] dark:text-[#FFC107]">{reg.volunteer_events?.title || "Unknown Event"}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                            📅 {new Date(reg.volunteer_events?.event_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-600 dark:text-zinc-300">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {reg.status === "approved" && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"><CheckCircle2 size={11} /> Approved</span>}
                          {reg.status === "pending" && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"><Clock size={11} /> Pending</span>}
                          {reg.status === "rejected" && <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"><XCircle size={11} /> Rejected</span>}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status !== "approved" && <button onClick={() => handleRegistrationStatusUpdate(reg.id, "approved")} disabled={isPending} title="Approve" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:text-emerald-400 transition"><Check size={14} /></button>}
                            {reg.status !== "rejected" && <button onClick={() => handleRegistrationStatusUpdate(reg.id, "rejected")} disabled={isPending} title="Reject" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white dark:bg-amber-950/40 dark:text-amber-400 transition"><XCircle size={14} /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
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