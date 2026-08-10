"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { 
  Heart, 
  Search, 
  Trash2, 
  Eye, 
  IndianRupee, 
  Calendar, 
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/foundation/adminheader";
import { getDonations, deleteDonation, updateDonationStatus } from "./actions";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDedication, setFilterDedication] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadDonations();
  }, []);

  async function loadDonations() {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getDonations();
      setDonations(data);
    } catch (err: any) {
      console.error("Error fetching donations:", err.message || err);
      setFetchError(err.message || "Failed to load data from server action.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this donation record?")) return;

    startTransition(async () => {
      try {
        await deleteDonation(id);
        setDonations(donations.filter((d) => d.id !== id));
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Failed to delete donation: " + err.message);
      }
    });
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    startTransition(async () => {
      try {
        await updateDonationStatus(id, newStatus);
        setDonations(
          donations.map((d) => (d.id === id ? { ...d, is_donated: newStatus } : d))
        );
        if (selectedDonation && selectedDonation.id === id) {
          setSelectedDonation({ ...selectedDonation, is_donated: newStatus });
        }
      } catch (err: any) {
        console.error("Status update error:", err);
        alert("Failed to update status: " + err.message);
      }
    });
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = 
      d.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.cause_items?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDedication = filterDedication === "All" || d.dedication_type === filterDedication;

    const isDonatedVal = d.is_donated ?? true;
    const matchesStatus = 
      filterStatus === "All" || 
      (filterStatus === "Donated" && isDonatedVal === true) || 
      (filterStatus === "Not Donated" && isDonatedVal === false);

    const itemDate = d.donation_date ? d.donation_date.split("T")[0] : (d.created_at ? d.created_at.split("T")[0] : "");
    let matchesDate = true;
    if (startDate && itemDate) matchesDate = matchesDate && itemDate >= startDate;
    if (endDate && itemDate) matchesDate = matchesDate && itemDate <= endDate;

    return matchesSearch && matchesDedication && matchesStatus && matchesDate;
  });

  const totalAmount = filteredDonations.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0B1220] ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Title & Overview Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              Donation Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              View, track, and manage financial contributions and cause supporters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Filtered</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">{filteredDonations.length}</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Filtered Amount</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center">
                <IndianRupee size={16} className="inline" /> {totalAmount.toLocaleString()}
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
                placeholder="Search name, cause, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Filter by Dedication Type */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterDedication}
                onChange={(e) => setFilterDedication(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="All">Dedication: All</option>
                <option value="General">General</option>
                <option value="In Honor Of">In Honor Of</option>
                <option value="In Memory Of">In Memory Of</option>
              </select>
            </div>

            {/* Filter by Donated Status */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="All">Status: All</option>
                <option value="Donated">Donated</option>
                <option value="Not Donated">Not Donated</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="md:col-span-12 lg:col-span-2 flex items-center">
              {(searchTerm || filterDedication !== "All" || filterStatus !== "All" || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterDedication("All");
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

        {/* Donations Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Heart size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                {donations.length === 0 ? "No donations found in the database table." : "No donations match your current search/filter criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                    <th className="py-4 px-6">Donor</th>
                    <th className="py-4 px-4">Cause</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Dedication</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                  {filteredDonations.map((donation) => {
                    const isDonated = donation.is_donated ?? true;
                    return (
                      <tr key={donation.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition">
                        <td className="py-4 px-6 flex items-center gap-3">
                          {donation.donor_image ? (
                            <img 
                              src={donation.donor_image} 
                              alt={donation.donor_name} 
                              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700" 
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center font-bold">
                              {donation.donor_name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{donation.donor_name}</div>
                            {donation.message && (
                              <div className="text-slate-400 text-[10px] truncate max-w-xs">{donation.message}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-700 dark:text-zinc-300">
                          {donation.cause_items?.title || <span className="text-slate-400 italic">General Fund</span>}
                        </td>
                        <td className="py-4 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{Number(donation.amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                            {donation.dedication_type || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {/* Turn ON / OFF Switch */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(donation.id, isDonated)}
                              disabled={isPending}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isDonated ? "bg-emerald-600" : "bg-slate-300 dark:bg-zinc-700"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  isDonated ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className={`text-[10px] font-bold ${isDonated ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500"}`}>
                              {isDonated ? "Donated" : "Not Donated"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {donation.donation_date ? new Date(donation.donation_date).toLocaleDateString() : new Date(donation.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            title="View Details"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#798321] hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#FFC107] dark:hover:text-black transition"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(donation.id)}
                            disabled={isPending}
                            title="Delete Donation"
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

      {/* Donation Details Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  {selectedDonation.donor_image ? (
                    <img 
                      src={selectedDonation.donor_image} 
                      alt={selectedDonation.donor_name} 
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700" 
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] font-bold">
                      {selectedDonation.donor_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedDonation.donor_name}</h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">₹{Number(selectedDonation.amount).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Cause Supported</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 truncate">
                    {selectedDonation.cause_items?.title || "General Fund"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Dedication Type</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200">
                    {selectedDonation.dedication_type || "General"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Donation Status</span>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedDonation.id, selectedDonation.is_donated ?? true)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        (selectedDonation.is_donated ?? true) ? "bg-emerald-600" : "bg-slate-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          (selectedDonation.is_donated ?? true) ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className={`text-[11px] font-bold ${(selectedDonation.is_donated ?? true) ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500"}`}>
                      {(selectedDonation.is_donated ?? true) ? "Donated" : "Not Donated"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Donation Date</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#798321]" /> 
                    {selectedDonation.donation_date ? new Date(selectedDonation.donation_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Recorded Timestamp</span>
                  <div className="font-semibold text-slate-800 dark:text-zinc-200">
                    {new Date(selectedDonation.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Donor Message</span>
                  <div className="font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800 p-3 rounded-xl border border-slate-100 dark:border-zinc-700">
                    {selectedDonation.message || <span className="text-slate-400 italic">No message provided</span>}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedDonation(null)}
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