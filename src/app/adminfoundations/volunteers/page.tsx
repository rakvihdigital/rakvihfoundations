"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { Users, Search, Trash2, Eye, Droplet, Phone, Mail, MapPin, Calendar, X, CheckCircle2, XCircle, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/foundation/adminheader";
import { getVolunteers, deleteVolunteer, updateVolunteerStatus } from "./actions";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export default function AdminVolunteersPage() {
  const [isPending, startTransition] = useTransition();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterBloodDonor, setFilterBloodDonor] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const vols = await getVolunteers();
      setVolunteers(vols || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    startTransition(async () => {
      try {
        await updateVolunteerStatus(id, newStatus);
        setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
        if (selectedVolunteer?.id === id) setSelectedVolunteer((prev: any) => ({ ...prev, status: newStatus }));
      } catch (err: any) {
        alert("Failed to update status: " + err.message);
      }
    });
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this volunteer?")) return;
    startTransition(async () => {
      try {
        await deleteVolunteer(id);
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
        if (selectedVolunteer?.id === id) setSelectedVolunteer(null);
      } catch (err: any) {
        alert("Failed to delete: " + err.message);
      }
    });
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.email?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase()) || v.phone?.includes(searchTerm);
    const matchesType = filterType === "All" || v.volunteer_type === filterType;
    const matchesBloodDonor = filterBloodDonor === "All" || v.active_blood_donor === filterBloodDonor;
    const matchesStatus = filterStatus === "All" || (v.status || "pending") === filterStatus;
    return matchesSearch && matchesType && matchesBloodDonor && matchesStatus;
  });

  const pendingVolunteersCount = volunteers.filter((v) => (v.status || "pending") === "pending").length;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0B1220] ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Manage Volunteers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">View, verify, and manage your volunteer community.</p>
        </div>

        <div className="space-y-6">
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">{volunteers.length}</span>
            </div>
            <div className={`rounded-2xl border px-4 py-2.5 shadow-sm ${pendingVolunteersCount > 0 ? "border-amber-300 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20" : "border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"}`}>
              <span className="block text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Pending Accounts</span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{pendingVolunteersCount}</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Blood Donors</span>
              <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">{volunteers.filter(v => v.active_blood_donor === 'Yes').length}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white" />
              </div>
              <div className="md:col-span-3">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  <option value="All">Status: All</option><option value="pending">Status: Pending</option><option value="approved">Status: Approved</option><option value="rejected">Status: Rejected</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  <option value="All">All Types</option><option value="Individual Volunteer">Individual</option><option value="NGO">NGO</option><option value="Institution">Institution</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <select value={filterBloodDonor} onChange={(e) => setFilterBloodDonor(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  <option value="All">Blood Donors</option><option value="Yes">Yes</option><option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <div className="py-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" /></div>
            ) : filteredVolunteers.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Users size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">No volunteers match your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                      <th className="py-4 px-6">Name / Contact</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Type</th>
                      <th className="py-4 px-4">Location</th>
                      <th className="py-4 px-4">Blood Info</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                    {filteredVolunteers.map((volunteer) => {
                      const status = volunteer.status || "pending";
                      return (
                        <tr key={volunteer.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900 dark:text-white">{volunteer.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{volunteer.email}</div>
                            <div className="text-slate-400 text-[10px]">+91 {volunteer.phone}</div>
                          </td>
                          <td className="py-4 px-4">
                            {status === "approved" && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"><CheckCircle2 size={11} /> Approved</span>}
                            {status === "pending" && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"><Clock size={11} /> Pending</span>}
                            {status === "rejected" && <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"><XCircle size={11} /> Rejected</span>}
                          </td>
                          <td className="py-4 px-4"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">{volunteer.volunteer_type}</span></td>
                          <td className="py-4 px-4 font-medium text-slate-600 dark:text-zinc-300">{volunteer.city}</td>
                          <td className="py-4 px-4 space-y-1">
                            {volunteer.blood_group && <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 text-[11px]"><Droplet size={11} /> {volunteer.blood_group}</span>}
                            {volunteer.active_blood_donor === "Yes" && <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Active Donor</span>}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {status !== "approved" && <button onClick={() => handleStatusUpdate(volunteer.id, "approved")} disabled={isPending} title="Approve" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:text-emerald-400 transition"><Check size={14} /></button>}
                              {status !== "rejected" && <button onClick={() => handleStatusUpdate(volunteer.id, "rejected")} disabled={isPending} title="Reject" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white dark:bg-amber-950/40 dark:text-amber-400 transition"><XCircle size={14} /></button>}
                              <button onClick={() => setSelectedVolunteer(volunteer)} title="View Details" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#798321] hover:text-white dark:bg-zinc-800 dark:text-zinc-300 transition"><Eye size={14} /></button>
                              <button onClick={() => handleDeleteVolunteer(volunteer.id)} disabled={isPending} title="Delete" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-950/40 dark:text-red-400 transition"><Trash2 size={14} /></button>
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

      {/* Volunteer Details Modal */}
      <AnimatePresence>
        {selectedVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] font-bold">{selectedVolunteer.name?.charAt(0)}</div>
                  <div><h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedVolunteer.name}</h3><span className="text-xs text-[#798321] dark:text-[#FFC107] font-semibold">{selectedVolunteer.volunteer_type}</span></div>
                </div>
                <button onClick={() => setSelectedVolunteer(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"><X size={18} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Account Status</span>
                  <div className="font-bold">
                    {(selectedVolunteer.status || "pending") === "approved" && <span className="text-emerald-600 dark:text-emerald-400">Approved</span>}
                    {(selectedVolunteer.status || "pending") === "pending" && <span className="text-amber-600 dark:text-amber-400">Pending Approval</span>}
                    {(selectedVolunteer.status || "pending") === "rejected" && <span className="text-rose-600 dark:text-rose-400">Rejected</span>}
                  </div>
                </div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase text-[10px]">Blood Group</span><div className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><Droplet size={13} /> {selectedVolunteer.blood_group || 'Not specified'}</div></div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase text-[10px]">Email Address</span><div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 truncate"><Mail size={13} className="text-[#798321]" /> {selectedVolunteer.email}</div></div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase text-[10px]">Phone Number</span><div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5"><Phone size={13} className="text-[#798321]" /> +91 {selectedVolunteer.phone}</div></div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase text-[10px]">Gender & DOB</span><div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5"><Calendar size={13} className="text-[#798321]" /> {selectedVolunteer.gender}, {selectedVolunteer.dob}</div></div>
                <div className="space-y-1"><span className="text-slate-400 block font-bold uppercase text-[10px]">Active Blood Donor</span><div className="font-semibold text-slate-800 dark:text-zinc-200">{selectedVolunteer.active_blood_donor}</div></div>
                <div className="col-span-2 space-y-1"><span className="text-slate-400 block font-bold uppercase text-[10px]">Address</span><div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5"><MapPin size={13} className="text-[#798321] shrink-0" /> {selectedVolunteer.street_address}, {selectedVolunteer.city}</div></div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex gap-2">
                  {(selectedVolunteer.status || "pending") !== "approved" && (
                    <button onClick={() => handleStatusUpdate(selectedVolunteer.id, "approved")} disabled={isPending} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50">Approve</button>
                  )}
                  {(selectedVolunteer.status || "pending") !== "rejected" && (
                    <button onClick={() => handleStatusUpdate(selectedVolunteer.id, "rejected")} disabled={isPending} className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition disabled:opacity-50">Reject</button>
                  )}
                </div>
                <button onClick={() => setSelectedVolunteer(null)} className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}