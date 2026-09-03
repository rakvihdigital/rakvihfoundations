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
  X,
  Image as ImageIcon,
  Video,
  Gift,
  ExternalLink,
  Download,
  Tag,
  Users,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Printer
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
  const [copiedLabel, setCopiedLabel] = useState(false);
  const [downloadingPhoto, setDownloadingPhoto] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  async function loadDonations() {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getDonations();
      setDonations(data || []);
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

  // Robust extraction of all packaging parameters
  const parsePackagingDetails = (messageStr: string = "", donorImage?: string) => {
    const parts = (messageStr || "").split(" | ").map((p) => p.trim());
    let generalMessage = "";
    let members = 1;
    let photoUrl = 
      typeof donorImage === "string" && donorImage.trim() !== "" && donorImage !== "null" 
        ? donorImage.trim() 
        : "";
    let isVideoRequested = false;
    let labelName = "";
    let labelDesc = "";
    let extras: string[] = [];

    parts.forEach((part) => {
      const lower = part.toLowerCase();

      if (lower.startsWith("members:")) {
        const num = parseInt(part.replace(/members:/i, "").trim());
        if (!isNaN(num) && num > 0) members = num;
      } else if (lower.startsWith("photo on packing:") || lower.startsWith("photo:") || lower.startsWith("packing media:")) {
        const extracted = part.replace(/photo on packing:|photo:|packing media:/i, "").trim();
        if (extracted && extracted !== "null" && extracted !== "Attached") {
          photoUrl = extracted;
        }
      } else if (lower.startsWith("celebration video requested:") || lower.includes("celebration video") || lower.includes("video:")) {
        isVideoRequested = true;
      } else if (lower.startsWith("label:")) {
        const rawLabel = part.replace(/label:/i, "").trim();
        const match = rawLabel.match(/\[(.*?)\](?:\s*-\s*(.*))?/);
        if (match) {
          labelName = match[1]?.trim() || "";
          labelDesc = match[2]?.trim() || "";
        } else {
          labelName = rawLabel;
        }
      } else if (lower.startsWith("extras:")) {
        const extrasStr = part.replace(/extras:/i, "").trim();
        extras = extrasStr.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        if (part && !generalMessage) {
          generalMessage = part.replace(/^"|"$/g, "").trim();
        }
      }
    });

    return {
      generalMessage,
      members,
      photoUrl,
      isVideoRequested,
      labelName,
      labelDesc,
      extras,
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(true);
    setTimeout(() => setCopiedLabel(false), 2000);
  };

  // Direct High-Resolution Downloader
  const handleDownloadPhoto = async (url: string, donorName: string, id: number | string) => {
    try {
      setDownloadingPhoto(true);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const cleanName = (donorName || "donor").toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.href = blobUrl;
      link.download = `${cleanName}-order-${id}-packaging-photo.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download failed, opening in new tab:", err);
      window.open(url, "_blank");
    } finally {
      setDownloadingPhoto(false);
    }
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
    <div className={`min-h-screen bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Donations &amp; Fulfillment
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track donor sponsorships, custom packaging photos, print labels, and celebration video requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 shadow-sm">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Donated</span>
              <span className="text-lg font-extrabold text-[#FFC107]">{filteredDonations.length}</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 shadow-sm">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Revenue</span>
              <span className="text-lg font-extrabold text-emerald-400 flex items-center">
                <IndianRupee size={16} className="inline" /> {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 rounded-2xl bg-red-950/30 border border-red-900/50 p-4 text-xs text-red-400">
            {fetchError}
          </div>
        )}

        {/* Filters Toolbar */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Bar */}
            <div className="md:col-span-12 lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, cause, label, or extras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 pl-10 pr-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
              />
            </div>

            {/* Filter by Dedication */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterDedication}
                onChange={(e) => setFilterDedication(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-semibold text-zinc-200 focus:border-[#FFC107] focus:outline-none"
              >
                <option value="All">Dedication: All</option>
                <option value="General Donation">General Donation</option>
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="In Memory of a Loved One">In Memory of a Loved One</option>
                <option value="Festival / Special Occasion">Festival / Special Occasion</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="md:col-span-6 lg:col-span-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-semibold text-zinc-200 focus:border-[#FFC107] focus:outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Donated">Completed</option>
                <option value="Not Donated">Pending</option>
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
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 py-2.5 px-3 text-xs font-bold text-zinc-300 transition"
                >
                  Reset Filters
                </button>
              )}
            </div>

          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 whitespace-nowrap">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2 px-3 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 whitespace-nowrap">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2 px-3 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC107] border-t-transparent" />
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Heart size={40} className="mx-auto text-zinc-700" />
              <p className="text-xs font-bold text-zinc-400">
                {donations.length === 0 ? "No donations found in database." : "No records match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Donor</th>
                    <th className="py-4 px-4">Initiative</th>
                    <th className="py-4 px-4">Packaging &amp; Special Requests</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Dedication</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Execution Date</th>
                    <th className="py-4 px-6 text-right">Fulfillment Sheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-xs">
                  {filteredDonations.map((donation) => {
                    const isDonated = donation.is_donated ?? true;
                    const parsed = parsePackagingDetails(donation.message, donation.donor_image);
                    const hasPhoto = !!parsed.photoUrl;
                    const hasLabel = !!parsed.labelName;
                    const hasExtras = parsed.extras.length > 0;

                    return (
                      <tr key={donation.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {parsed.photoUrl ? (
                              <img 
                                src={parsed.photoUrl} 
                                alt={donation.donor_name} 
                                className="h-9 w-9 rounded-full object-cover border border-zinc-700 cursor-pointer" 
                                onClick={() => setSelectedDonation(donation)}
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-[#FFC107]/10 text-[#FFC107] flex items-center justify-center font-bold">
                                {donation.donor_name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white">{donation.donor_name}</div>
                              <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                                <Users size={10} className="text-[#FFC107]" /> {parsed.members} Member(s)
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium text-zinc-300">
                          {donation.cause_items?.title || <span className="text-slate-500 italic">Initiative</span>}
                        </td>

                        {/* Visual Indicators for Operations */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                            {hasPhoto && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/60">
                                <ImageIcon size={10} /> Photo Attached
                              </span>
                            )}
                            {parsed.isVideoRequested && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-700 animate-pulse">
                                <Video size={10} /> Video Req
                              </span>
                            )}
                            {hasLabel && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                                <Tag size={10} /> Label
                              </span>
                            )}
                            {hasExtras && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                                <Gift size={10} /> {parsed.extras.length} Extra(s)
                              </span>
                            )}
                            {!hasPhoto && !parsed.isVideoRequested && !hasLabel && !hasExtras && (
                              <span className="text-slate-500 text-[10px] italic">Standard Delivery</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-extrabold text-emerald-400">
                          ₹{Number(donation.amount).toLocaleString()}
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFC107]/10 text-[#FFC107]">
                            {donation.dedication_type || "General Donation"}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(donation.id, isDonated)}
                              disabled={isPending}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isDonated ? "bg-emerald-600" : "bg-zinc-700"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  isDonated ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className={`text-[10px] font-bold ${isDonated ? "text-emerald-400" : "text-zinc-500"}`}>
                              {isDonated ? "Completed" : "Pending"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-400 text-[11px]">
                          {donation.donation_date || (donation.created_at ? donation.created_at.split("T")[0] : "Recent")}
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            title="Open Operational Fulfillment Sheet"
                            className="inline-flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:bg-[#FFC107] hover:text-black transition"
                          >
                            <Eye size={13} /> View Sheet
                          </button>
                          <button
                            onClick={() => handleDelete(donation.id)}
                            disabled={isPending}
                            title="Delete Record"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                          >
                            <Trash2 size={13} />
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

      {/* ── OPERATIONAL PACKAGING & FULFILLMENT MODAL (CRYSTAL CLEAR DETAILS) ── */}
      <AnimatePresence>
        {selectedDonation && (() => {
          const parsed = parsePackagingDetails(selectedDonation.message, selectedDonation.donor_image);
          const isDonated = selectedDonation.is_donated ?? true;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0f0f0f] border border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC107] bg-[#FFC107]/10 px-2.5 py-0.5 rounded-full">
                        Fulfillment Sheet #{selectedDonation.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isDonated ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {isDonated ? "Completed & Delivered" : "Pending Execution"}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-1.5">{selectedDonation.donor_name}</h3>
                    <p className="text-xs text-emerald-400 font-extrabold mt-0.5">
                      Total Paid: ₹{Number(selectedDonation.amount).toLocaleString()} (Razorpay Verified)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDonation(null)}
                    className="rounded-full p-2 text-slate-400 hover:bg-zinc-800 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Quick Info Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Sponsorship</span>
                    <span className="font-bold text-white block truncate">{selectedDonation.cause_items?.title || "Initiative"}</span>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Members</span>
                    <span className="font-extrabold text-[#FFC107] block">{parsed.members} Member(s)</span>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Execution Date</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Calendar size={12} className="text-[#FFC107]" />
                      {selectedDonation.donation_date || selectedDonation.created_at?.split("T")[0]}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Dedication</span>
                    <span className="font-bold text-white block truncate">{selectedDonation.dedication_type || "General Donation"}</span>
                  </div>
                </div>

                {/* ── 1. CELEBRATION VIDEO ALERT (If Donor Requested) ── */}
                {parsed.isVideoRequested && (
                  <div className="rounded-2xl bg-purple-950/40 border-2 border-purple-600/70 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Video size={18} className="text-purple-400 shrink-0" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-purple-200">
                        Celebration Video Requested by Donor
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/90 leading-relaxed">
                      ⚠️ <strong>Action Required:</strong> The donor paid the one-time video recording charge. Please ensure field coordinators record a celebration clip during meal/kit distribution and WhatsApp/deliver it to the donor within 24 to 48 hours.
                    </p>
                  </div>
                )}

                {/* ── 2. PRINTED BOX STICKER LABEL PREVIEW ── */}
                {parsed.labelName ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Tag size={14} className="text-[#FFC107]" /> Printed Dedication Label on Boxes
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${parsed.labelName}${parsed.labelDesc ? ` - ${parsed.labelDesc}` : ""}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFC107] hover:underline"
                      >
                        {copiedLabel ? <Check size={12} /> : <Copy size={12} />}
                        {copiedLabel ? "Copied!" : "Copy Sticker Text"}
                      </button>
                    </div>

                    {/* Simulated Sticker Visual */}
                    <div className="relative rounded-xl border-2 border-dashed border-amber-400/50 bg-amber-500/5 p-4 text-center space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#FFC107]">
                        Sponsored with Love
                      </div>
                      <div className="text-base font-extrabold text-white">
                        {parsed.labelName}
                      </div>
                      {parsed.labelDesc && (
                        <div className="text-xs font-medium text-amber-200/80 italic">
                          &quot;{parsed.labelDesc}&quot;
                        </div>
                      )}
                      <div className="text-[9px] text-slate-400 pt-1">
                        Print 1 sticker per package (Quantity needed: {parsed.members} stickers)
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* ── 3. PHOTO TO ATTACH ON PACKING (WITH DIRECT DOWNLOAD) ── */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-[#FFC107]" /> Donor Photo for Packaging
                    </span>
                    {parsed.photoUrl && (
                      <span className="text-[11px] font-bold text-slate-400">
                        Print {parsed.members} copy / copies
                      </span>
                    )}
                  </div>

                  {parsed.photoUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                      <img 
                        src={parsed.photoUrl} 
                        alt="Donor packing proof" 
                        className="h-28 w-28 rounded-xl object-cover border border-zinc-700 shrink-0" 
                      />
                      <div className="space-y-2.5 text-center sm:text-left flex-1">
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          Donor provided this photo to be printed and attached directly to the meal / gift packages.
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <button
                            type="button"
                            disabled={downloadingPhoto}
                            onClick={() => handleDownloadPhoto(parsed.photoUrl, selectedDonation.donor_name, selectedDonation.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFC107] px-3.5 py-2 text-xs font-bold text-black hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                          >
                            <Download size={13} />
                            <span>{downloadingPhoto ? "Downloading..." : "Download High-Res Photo"}</span>
                          </button>

                          <a 
                            href={parsed.photoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 border border-zinc-700 px-3.5 py-2 text-xs font-bold text-zinc-200 hover:text-white transition"
                          >
                            <ExternalLink size={13} /> Open Tab
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/80 p-3 text-center text-xs text-slate-500 italic">
                      No packaging photo was requested or uploaded for this donation.
                    </div>
                  )}
                </div>

                {/* ── 4. SPECIAL EXTRAS CHECKLIST (MULTIPLIED) ── */}
                {parsed.extras.length > 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Gift size={14} className="text-[#FFC107]" /> Extra Gift Items Checklist
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {parsed.extras.map((extraItem, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between rounded-xl bg-amber-950/30 border border-amber-800/40 px-3.5 py-2.5 text-xs"
                        >
                          <span className="font-semibold text-amber-200">{extraItem}</span>
                          <span className="font-extrabold text-[#FFC107] bg-black/40 px-2 py-0.5 rounded-md">
                            {parsed.members} Units ({parsed.members} × 1)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* ── 5. DONOR'S PERSONAL MESSAGE / BLESSING ── */}
                {parsed.generalMessage && (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                      <MessageSquare size={11} className="text-[#FFC107]" /> Donor Blessing / Encouraging Note
                    </span>
                    <div className="text-xs font-medium text-zinc-200 italic bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                      &quot;{parsed.generalMessage}&quot;
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Mark as Delivered:</span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(selectedDonation.id, isDonated)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDonated ? "bg-emerald-600" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isDonated ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition"
                    >
                      <Printer size={13} /> Print Sheet
                    </button>
                    <button
                      onClick={() => setSelectedDonation(null)}
                      className="rounded-xl bg-[#FFC107] px-5 py-2 text-xs font-bold text-black hover:opacity-90 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}