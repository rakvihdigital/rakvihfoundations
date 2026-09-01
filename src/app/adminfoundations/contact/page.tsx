"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import AdminHeader from "@/components/foundation/adminheader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Trash2,
  MessageSquare,
  Tag,
  Eye,
  X,
  Search,
} from "lucide-react";
import { getContactInquiries, deleteContactInquiry, updateContactStatus } from "./actions";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

interface ContactInquiry {
  id: string;
  inquiry_type: string;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  is_resolved?: boolean;
  created_at: string;
}

export default function AdminContactPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal State for Viewing Full Message
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getContactInquiries();
      setInquiries(data || []);
    } catch (err: any) {
      console.error("Error fetching inquiries:", err.message || err);
      setFetchError(err.message || "Failed to load data from server action.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    startTransition(async () => {
      try {
        await deleteContactInquiry(id);
        setInquiries(inquiries.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Failed to delete inquiry: " + err.message);
      }
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    startTransition(async () => {
      try {
        if (updateContactStatus) {
          await updateContactStatus(id, newStatus);
        }
        setInquiries(
          inquiries.map((item) => (item.id === id ? { ...item, is_resolved: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, is_resolved: newStatus });
        }
      } catch (err: any) {
        console.error("Status update error:", err);
        alert("Failed to update status: " + err.message);
      }
    });
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "All" || item.inquiry_type === filterType;

    const isResolvedVal = item.is_resolved ?? false;
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Resolved" && isResolvedVal === true) ||
      (filterStatus === "Pending" && isResolvedVal === false);

    const itemDate = item.created_at ? item.created_at.split("T")[0] : "";
    let matchesDate = true;
    if (startDate && itemDate) matchesDate = matchesDate && itemDate >= startDate;
    if (endDate && itemDate) matchesDate = matchesDate && itemDate <= endDate;

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const resolvedCount = filteredInquiries.filter((item) => item.is_resolved ?? false).length;

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
              Contact Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review and manage messages submitted via the contact form.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Filtered</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">
                {filteredInquiries.length}
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Resolved</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {resolvedCount}
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
                placeholder="Search name, email, phone, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Filter by Inquiry Type */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="All">Type: All</option>
                <option value="Donation Query">Donation Query</option>
                <option value="Volunteer With Us">Volunteer With Us</option>
                <option value="Partnership / CSR">Partnership / CSR</option>
                <option value="Media & Press">Media & Press</option>
                <option value="Something Else">Something Else</option>
              </select>
            </div>

            {/* Filter by Resolved Status */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="All">Status: All</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="md:col-span-12 lg:col-span-2 flex items-center">
              {(searchTerm || filterType !== "All" || filterStatus !== "All" || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("All");
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

        {/* Inquiries Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <MessageSquare size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                {inquiries.length === 0
                  ? "No contact inquiries submitted yet."
                  : "No inquiries match your current search/filter criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                    <th className="py-4 px-6">Sender</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Message</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                  {filteredInquiries.map((item) => {
                    const isResolved = item.is_resolved ?? false;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center font-bold">
                              {item.full_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{item.full_name}</div>
                              <div className="text-slate-400 text-[10px] flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Mail size={10} /> {item.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone size={10} /> {item.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                            <Tag size={10} /> {item.inquiry_type}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-700 dark:text-zinc-300 max-w-xs truncate">
                          {item.message}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.id, isResolved)}
                              disabled={isPending}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isResolved ? "bg-emerald-600" : "bg-slate-300 dark:bg-zinc-700"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  isResolved ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[10px] font-bold ${
                                isResolved ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500"
                              }`}
                            >
                              {isResolved ? "Resolved" : "Pending"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedInquiry(item)}
                            title="View Details"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#798321] hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#FFC107] dark:hover:text-black transition"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isPending}
                            title="Delete Inquiry"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Details Modal */}
      <AnimatePresence>
        {selectedInquiry && (
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
                    {selectedInquiry.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedInquiry.full_name}
                    </h3>
                    <span className="text-xs text-[#798321] dark:text-[#FFC107] font-extrabold">
                      {selectedInquiry.inquiry_type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Email</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-[#798321]" /> {selectedInquiry.email}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Phone</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Phone size={13} className="text-[#798321]" /> {selectedInquiry.phone}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Status</span>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedInquiry.id, selectedInquiry.is_resolved ?? false)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        (selectedInquiry.is_resolved ?? false) ? "bg-emerald-600" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          (selectedInquiry.is_resolved ?? false) ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[11px] font-bold ${
                        (selectedInquiry.is_resolved ?? false)
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-zinc-500"
                      }`}
                    >
                      {(selectedInquiry.is_resolved ?? false) ? "Resolved" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Received</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#798321]" />
                    {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Message</span>
                  <div className="font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800 p-3 rounded-xl border border-slate-100 dark:border-zinc-700 whitespace-pre-wrap">
                    {selectedInquiry.message || <span className="text-slate-400 italic">No message provided</span>}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedInquiry(null)}
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