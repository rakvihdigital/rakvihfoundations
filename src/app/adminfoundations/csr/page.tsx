"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Fraunces } from "next/font/google";
import AdminHeader from "@/components/foundation/adminheader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  Search,
} from "lucide-react";
import { getCsrProposals, updateCsrProposalStatus, deleteCsrProposal } from "./actions";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

interface CsrProposal {
  id: number;
  contact_name: string;
  company_name: string;
  email: string;
  phone: string;
  focus_area: string;
  project_details: string;
  status: string | null;
  created_at: string | null;
}

export default function AdminCsrPage() {
  const [proposals, setProposals] = useState<CsrProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFocusArea, setFilterFocusArea] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal State for Viewing Full Details
  const [selectedProposal, setSelectedProposal] = useState<CsrProposal | null>(null);

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getCsrProposals();
      setProposals(data || []);
    } catch (err: any) {
      console.error("Error fetching CSR proposals:", err.message || err);
      setFetchError(err.message || "Failed to load data from server action.");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    const prevProposals = proposals;
    setProposals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedProposal && selectedProposal.id === id) {
      setSelectedProposal({ ...selectedProposal, status: newStatus });
    }

    startTransition(async () => {
      try {
        await updateCsrProposalStatus(id, newStatus);
      } catch (err: any) {
        console.error("Status update error:", err);
        alert("Failed to update status: " + err.message);
        setProposals(prevProposals);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this CSR proposal?")) return;

    startTransition(async () => {
      try {
        await deleteCsrProposal(id);
        setProposals((prev) => prev.filter((item) => item.id !== id));
        if (selectedProposal?.id === id) setSelectedProposal(null);
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Failed to delete proposal: " + err.message);
      }
    });
  };

  const focusAreaOptions = useMemo(() => {
    const unique = Array.from(new Set(proposals.map((p) => p.focus_area).filter(Boolean)));
    return unique.sort();
  }, [proposals]);

  const filteredProposals = proposals.filter((item) => {
    const matchesSearch =
      item.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project_details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFocusArea = filterFocusArea === "All" || item.focus_area === filterFocusArea;

    const itemStatus = item.status || "Pending Review";
    const matchesStatus = filterStatus === "All" || itemStatus === filterStatus;

    const itemDate = item.created_at ? item.created_at.split("T")[0] : "";
    let matchesDate = true;
    if (startDate && itemDate) matchesDate = matchesDate && itemDate >= startDate;
    if (endDate && itemDate) matchesDate = matchesDate && itemDate <= endDate;

    return matchesSearch && matchesFocusArea && matchesStatus && matchesDate;
  });

  const approvedCount = filteredProposals.filter((item) => item.status === "Approved").length;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-600 dark:text-red-400">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-black ${display.variable}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title & Overview Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              CSR Proposals
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review and manage corporate social responsibility collaboration submissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Filtered</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">
                {filteredProposals.length}
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Approved</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {approvedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Database Error Banner */}
        {fetchError && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 flex flex-col gap-1">
            <span className="font-bold">Database Connection / Policy Error:</span>
            <span>{fetchError}</span>
          </div>
        )}

        {/* Filters and Search Toolbar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-12 lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search company, contact, email, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Filter by Focus Area */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterFocusArea}
                onChange={(e) => setFilterFocusArea(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="All">Focus Area: All</option>
                {focusAreaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="All">Status: All</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="md:col-span-12 lg:col-span-2 flex items-center">
              {(searchTerm || filterFocusArea !== "All" || filterStatus !== "All" || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterFocusArea("All");
                    setFilterStatus("All");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 py-2.5 px-3 text-xs font-bold text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Date Range Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 whitespace-nowrap">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 whitespace-nowrap">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Building2 size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                {proposals.length === 0
                  ? "No CSR proposals submitted yet."
                  : "No proposals match your current search/filter criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                    <th className="py-4 px-6">Company / Contact</th>
                    <th className="py-4 px-4">Focus Area</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                  {filteredProposals.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center font-bold">
                            {item.company_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{item.company_name}</div>
                            <div className="text-slate-400 text-[10px] flex items-center gap-1">
                              <User size={10} /> {item.contact_name} ({item.email})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                          {item.focus_area}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          <select
                            value={item.status || "Pending Review"}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            disabled={isPending}
                            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 disabled:opacity-50"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedProposal(item)}
                          title="View Details"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#798321] hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#FFC107] dark:hover:text-black transition"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending}
                          title="Delete Proposal"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Proposal Details Modal */}
      <AnimatePresence>
        {selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] font-bold">
                    {selectedProposal.company_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedProposal.company_name}
                    </h3>
                    <div className="mt-0.5">{getStatusBadge(selectedProposal.status)}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Contact Person</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <User size={13} className="text-[#798321]" /> {selectedProposal.contact_name}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Focus Area</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200">
                    {selectedProposal.focus_area}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Email</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-[#798321]" /> {selectedProposal.email}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Phone</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Phone size={13} className="text-[#798321]" /> {selectedProposal.phone}
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Status</span>
                  <select
                    value={selectedProposal.status || "Pending Review"}
                    onChange={(e) => handleStatusChange(selectedProposal.id, e.target.value)}
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 disabled:opacity-50"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Project Details / Message</span>
                  <div className="font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800 p-3 rounded-xl border border-slate-100 dark:border-zinc-700 whitespace-pre-wrap">
                    {selectedProposal.project_details || <span className="text-slate-400 italic">No details provided</span>}
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Submitted</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#798321]" />
                    {selectedProposal.created_at ? new Date(selectedProposal.created_at).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}