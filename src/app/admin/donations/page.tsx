"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Loader2, 
  IndianRupee,
  X,
  User,
  Mail,
  Phone,
  Tag,
  Calendar,
  Info
} from "lucide-react";
import Image from "next/image";

type Donation = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  referral_name: string;
  amount: number;
  purpose: string;
  payment_proof_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminDonationsPage() {
  const supabase = createClient();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Modals & Actions
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Tracks which donation is being updated

  // Fetch Donations on mount
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("foundation_donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching donations:", error);
    } else {
      setDonations(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (donation: Donation, newStatus: "approved" | "rejected") => {
    setActionLoading(donation.id);
    
    // 1. Update Database Status
    const { error } = await supabase
      .from("foundation_donations")
      .update({ status: newStatus })
      .eq("id", donation.id);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
      setActionLoading(null);
      return;
    }

    // 2. Update local UI state instantly
    setDonations((prev) =>
      prev.map((d) => (d.id === donation.id ? { ...d, status: newStatus } : d))
    );
    if (selectedDonation && selectedDonation.id === donation.id) {
      setSelectedDonation({ ...selectedDonation, status: newStatus });
    }

    // 3. Trigger Email to the Donor behind the scenes
    try {
      await fetch("/api/donation-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donation.full_name,
          donorEmail: donation.email,
          amount: donation.amount,
          status: newStatus,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }

    setActionLoading(null);
  };

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from("donation_proofs").getPublicUrl(path);
    return data.publicUrl;
  };

  // Filter donations based on search
  const filteredDonations = donations.filter((d) => 
    d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#0B1220] sm:p-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Donations Management</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review and approve incoming donations for the RAKVIH Foundation.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search donor or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-[#798321] dark:border-slate-800 dark:bg-[#111827] dark:text-white sm:w-64"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Date</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Donor Details</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Amount & Purpose</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Proof</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Status</th>
                  <th className="whitespace-nowrap px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Loader2 className="mx-auto animate-spin text-[#798321] dark:text-[#FFC107]" size={32} />
                      <p className="mt-2 text-slate-500">Loading donations...</p>
                    </td>
                  </tr>
                ) : filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-500">
                      No donations found.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation) => (
                    <tr key={donation.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      
                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(donation.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>

                      {/* Donor */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{donation.full_name}</p>
                        <p className="text-xs text-slate-500">{donation.email}</p>
                      </td>

                      {/* Amount & Purpose */}
                      <td className="px-6 py-4">
                        <p className="flex items-center font-bold text-green-600 dark:text-green-400">
                          <IndianRupee size={14} /> {donation.amount}
                        </p>
                        <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {donation.purpose}
                        </span>
                      </td>

                      {/* Proof Image Button (Quick View) */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedProof(getImageUrl(donation.payment_proof_url))}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <Eye size={14} /> Quick View
                        </button>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {donation.status === "pending" && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
                        )}
                        {donation.status === "approved" && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">Approved</span>
                        )}
                        {donation.status === "rejected" && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View All Details Button */}
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            title="View Full Details"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Approve & Reject Buttons */}
                          {donation.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(donation, "approved")}
                                disabled={actionLoading === donation.id}
                                title="Approve"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 transition-colors hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                              >
                                {actionLoading === donation.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                              </button>
                              <button
                                onClick={() => updateStatus(donation, "rejected")}
                                disabled={actionLoading === donation.id}
                                title="Reject"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                              >
                                {actionLoading === donation.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= FULL DETAILS MODAL ================= */}
      <AnimatePresence>
        {selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedDonation(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#111827] md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDonation(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>

              {/* Left Side: Text Details */}
              <div className="flex-1 p-6 sm:p-8">
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Donation Details</h2>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <User size={18} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedDonation.full_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-slate-400" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{selectedDonation.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedDonation.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <IndianRupee size={18} className="text-green-500" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">₹ {selectedDonation.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Info size={18} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                        <p className="text-sm font-bold uppercase capitalize text-slate-700 dark:text-slate-300">
                          {selectedDonation.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <Tag size={18} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Purpose</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedDonation.purpose}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Referral Name</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedDonation.referral_name || "None"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Submitted</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {new Date(selectedDonation.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approve/Reject Buttons inside Modal */}
                {selectedDonation.status === "pending" && (
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => updateStatus(selectedDonation, "approved")}
                      disabled={actionLoading === selectedDonation.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-transform hover:scale-[1.02] disabled:opacity-70"
                    >
                      {actionLoading === selectedDonation.id ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Approve</>}
                    </button>
                    <button
                      onClick={() => updateStatus(selectedDonation, "rejected")}
                      disabled={actionLoading === selectedDonation.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-transform hover:scale-[1.02] disabled:opacity-70"
                    >
                      {actionLoading === selectedDonation.id ? <Loader2 size={18} className="animate-spin" /> : <><XCircle size={18} /> Reject</>}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: Image Viewer */}
              <div className="flex flex-1 flex-col items-center justify-center border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/30 md:border-l md:border-t-0">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Payment Proof</h3>
                <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0B1220] sm:h-80">
                  <Image
                    src={getImageUrl(selectedDonation.payment_proof_url)}
                    alt="Payment Proof"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <a
                  href={getImageUrl(selectedDonation.payment_proof_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#798321] transition-colors hover:text-slate-900 dark:text-[#FFC107] dark:hover:text-white"
                >
                  <Eye size={14} /> Open Full Size Image
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= QUICK IMAGE MODAL ================= */}
      <AnimatePresence>
        {selectedProof && !selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-[#111827]"
            >
              <button
                onClick={() => setSelectedProof(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
              >
                <X size={18} />
              </button>
              
              <div className="relative h-[80vh] w-[90vw] max-w-2xl sm:w-[500px]">
                <Image
                  src={selectedProof}
                  alt="Payment Proof"
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}