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
  Printer,
  Mail,
  Phone,
  Receipt,
  FileText,
  Layers,
  ShieldCheck,
  Maximize2
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
  const [previewingPhotoUrl, setPreviewingPhotoUrl] = useState<string | null>(null);
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

  // Robust extraction of all packaging parameters and add-on prices
  const parsePackagingDetails = (messageStr: string = "", donorImage?: string) => {
    const parts = (messageStr || "").split(" | ").map((p) => p.trim());
    let generalMessage = "";
    let members = 1;
    let photoUrl = 
      typeof donorImage === "string" && donorImage.trim() !== "" && donorImage !== "null" 
        ? donorImage.trim() 
        : "";
    let isVideoRequested = false;
    let videoCost = 22; // default flat video charge
    let labelName = "";
    let labelDesc = "";
    let extras: string[] = [];
    let subItemAddons: { title: string; cost: number }[] = [];

    parts.forEach((part) => {
      const lower = part.toLowerCase();

      if (lower.startsWith("members:")) {
        const num = parseInt(part.replace(/members:/i, "").trim(), 10);
        if (!isNaN(num) && num > 0) members = num;
      } else if (lower.startsWith("photo on packing:") || lower.startsWith("photo:") || lower.startsWith("packing media:")) {
        const extracted = part.replace(/photo on packing:|photo:|packing media:/i, "").trim();
        if (extracted && extracted !== "null" && extracted !== "Attached") {
          photoUrl = extracted;
        }
      } else if (lower.startsWith("celebration video requested:") || lower.includes("celebration video") || lower.includes("video:")) {
        isVideoRequested = true;
        const match = part.match(/₹(\d+)/);
        if (match) videoCost = parseInt(match[1], 10);
      } else if (lower.startsWith("sub-item add-ons:") || lower.startsWith("sub-item addons:") || lower.startsWith("addons:")) {
        const raw = part.replace(/sub-item add-ons:|sub-item addons:|addons:/i, "").trim();
        const items = raw.split(",").map((s) => s.trim()).filter(Boolean);
        items.forEach((it) => {
          const costMatch = it.match(/(.*?)\s*\(\+?₹(\d+)\)/);
          if (costMatch) {
            subItemAddons.push({ title: costMatch[1].trim(), cost: parseInt(costMatch[2], 10) });
          } else {
            subItemAddons.push({ title: it, cost: 0 });
          }
        });
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
      videoCost,
      subItemAddons,
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
      d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                              {(donation.email || donation.phone) && (
                                <div className="text-slate-400 text-[10px] space-y-0.5 mt-0.5">
                                  {donation.email && (
                                    <div className="flex items-center gap-1 text-slate-300">
                                      <Mail size={10} className="text-[#FFC107] shrink-0" />
                                      <span className="truncate max-w-[150px]">{donation.email}</span>
                                    </div>
                                  )}
                                  {donation.phone && (
                                    <div className="flex items-center gap-1 text-slate-300">
                                      <Phone size={10} className="text-[#FFC107] shrink-0" />
                                      <span>{donation.phone}</span>
                                    </div>
                                  )}
                                </div>
                              )}
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

      {/* ── OPERATIONAL PACKAGING & FULFILLMENT MODAL (DETAILED & NEATLY ALIGNED) ── */}
      <AnimatePresence>
        {selectedDonation && (() => {
          const parsed = parsePackagingDetails(selectedDonation.message, selectedDonation.donor_image);
          const isDonated = selectedDonation.is_donated ?? true;
          const totalPaid = Number(selectedDonation.amount) || 0;
          const membersCount = Math.max(1, parsed.members);

          // Pricing Breakdown Calculations
          const subAddonsUnitSum = parsed.subItemAddons.reduce((sum, item) => sum + (item.cost || 0), 0);
          const subAddonsTotal = subAddonsUnitSum * membersCount;

          const photoUnitCost = parsed.photoUrl ? 10 : 0;
          const photoTotalCost = photoUnitCost * membersCount;

          const textUnitCost = parsed.labelName ? 5 : 0;
          const textTotalCost = textUnitCost * membersCount;

          const videoTotalCost = parsed.isVideoRequested ? parsed.videoCost : 0;

          let baseUnitCost = selectedDonation.cause_items?.cost 
            ? Number(selectedDonation.cause_items.cost) 
            : 0;

          if (!baseUnitCost || baseUnitCost <= 0) {
            const remainingForBase = totalPaid - videoTotalCost - subAddonsTotal - photoTotalCost - textTotalCost;
            baseUnitCost = Math.max(0, Math.round(remainingForBase / membersCount));
          }

          const baseSubtotal = baseUnitCost * membersCount;
          const causeTitle = selectedDonation.cause_items?.title || selectedDonation.cause_items?.name || "General Foundation Sponsorship";

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0d0d0d] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200"
              >
                {/* ── 1. MODAL TOP HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC107] bg-[#FFC107]/10 border border-[#FFC107]/20 px-3 py-1 rounded-full">
                        Manifest ID #{String(selectedDonation.id).padStart(5, "0")}
                      </span>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isDonated ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60" : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}>
                        <CheckCircle2 size={12} />
                        {isDonated ? "Delivered & Fulfilled" : "Pending Execution"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white mt-2">
                      Fulfillment &amp; Order Manifest
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Received on {new Date(selectedDonation.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Total Collected</span>
                      <span className="text-2xl font-black text-emerald-400 block">
                        ₹{totalPaid.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400/90 flex items-center sm:justify-end gap-1">
                        <ShieldCheck size={12} /> Razorpay Verified
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedDonation(null)}
                      className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-zinc-800 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* ── 2. DONOR PROFILE & SPONSORSHIP METADATA (2 Clean Cards) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Card A: Donor Profile */}
                  <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
                      <Users size={16} className="text-[#FFC107]" />
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                        Donor &amp; Contact Information
                      </h4>
                    </div>

                    <div className="space-y-2 pt-0.5">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Full Name</span>
                        <span className="text-sm font-bold text-white block mt-0.5">{selectedDonation.donor_name}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="rounded-xl bg-black/60 border border-zinc-800 p-2.5">
                          <span className="text-[10px] uppercase text-slate-400 block font-semibold flex items-center gap-1">
                            <Mail size={11} className="text-[#FFC107]" /> Email Address
                          </span>
                          <div className="flex items-center justify-between mt-1 gap-1">
                            <a 
                              href={`mailto:${selectedDonation.email || ""}`} 
                              className="text-white hover:text-[#FFC107] truncate block font-medium"
                              title={selectedDonation.email || "No email"}
                            >
                              {selectedDonation.email || "Not specified"}
                            </a>
                            {selectedDonation.email && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(selectedDonation.email)}
                                className="text-[10px] text-slate-400 hover:text-[#FFC107] shrink-0 px-1"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl bg-black/60 border border-zinc-800 p-2.5">
                          <span className="text-[10px] uppercase text-slate-400 block font-semibold flex items-center gap-1">
                            <Phone size={11} className="text-[#FFC107]" /> Contact Phone
                          </span>
                          <div className="flex items-center justify-between mt-1 gap-1">
                            <a 
                              href={`tel:${selectedDonation.phone || ""}`} 
                              className="text-white hover:text-[#FFC107] truncate block font-medium"
                              title={selectedDonation.phone || "No phone"}
                            >
                              {selectedDonation.phone || "Not specified"}
                            </a>
                            {selectedDonation.phone && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(selectedDonation.phone)}
                                className="text-[10px] text-slate-400 hover:text-[#FFC107] shrink-0 px-1"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card B: Event & Dedication Schedule */}
                  <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
                      <Calendar size={16} className="text-[#FFC107]" />
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                        Sponsorship &amp; Event Schedule
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-0.5">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Initiative / Cause</span>
                        <span className="text-xs font-bold text-white block mt-0.5 truncate" title={causeTitle}>
                          {causeTitle}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Beneficiary Volume</span>
                        <span className="text-xs font-extrabold text-[#FFC107] block mt-0.5">
                          {membersCount} Member(s)
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Execution Date</span>
                        <span className="text-xs font-bold text-white block mt-0.5">
                          {selectedDonation.donation_date || selectedDonation.created_at?.split("T")[0]}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Dedication Purpose</span>
                        <span className="text-xs font-bold text-white block mt-0.5 truncate">
                          {selectedDonation.dedication_type || "General Donation"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ── 3. ITEMIZED FINANCIAL & FULFILLMENT BREAKDOWN (CLEAN TABLE WITH PRICES) ── */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
                    <div className="flex items-center gap-2">
                      <Receipt size={16} className="text-[#FFC107]" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Itemized Cost &amp; Customization Breakdown
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Calculated for {membersCount} Member(s)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-black/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="px-5 py-3">Item / Customization</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-right">Unit Rate</th>
                          <th className="px-4 py-3 text-center">Quantity</th>
                          <th className="px-5 py-3 text-right">Subtotal Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {/* 1. Base Sponsorship */}
                        <tr className="hover:bg-zinc-800/30 transition">
                          <td className="px-5 py-3 font-bold text-white">
                            {causeTitle}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            Core Sponsorship
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300 font-mono">
                            ₹{baseUnitCost.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-200">
                            {membersCount} Member(s)
                          </td>
                          <td className="px-5 py-3 text-right font-extrabold text-white font-mono">
                            ₹{baseSubtotal.toLocaleString()}
                          </td>
                        </tr>

                        {/* 2. Sub-Item Add-ons */}
                        {parsed.subItemAddons.map((addon, idx) => (
                          <tr key={`subaddon-${idx}`} className="hover:bg-zinc-800/30 transition bg-amber-500/5">
                            <td className="px-5 py-3 font-semibold text-amber-200 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#FFC107]" />
                              Add-on: {addon.title}
                            </td>
                            <td className="px-4 py-3 text-amber-400/80">
                              Sub-Item Add-on
                            </td>
                            <td className="px-4 py-3 text-right text-amber-200 font-mono">
                              +₹{addon.cost || 0}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300 font-bold">
                              {membersCount} Units
                            </td>
                            <td className="px-5 py-3 text-right font-extrabold text-amber-300 font-mono">
                              +₹{((addon.cost || 0) * membersCount).toLocaleString()}
                            </td>
                          </tr>
                        ))}

                        {/* 3. Photo on Packing */}
                        {parsed.photoUrl && (
                          <tr className="hover:bg-zinc-800/30 transition bg-zinc-950/40">
                            <td className="px-5 py-3 font-semibold text-white flex items-center gap-2">
                              <ImageIcon size={14} className="text-[#FFC107] shrink-0" />
                              Donor Photo Printed on Packing
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              Packaging Proof
                            </td>
                            <td className="px-4 py-3 text-right text-slate-300 font-mono">
                              +₹{photoUnitCost}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300 font-bold">
                              {membersCount} Packages
                            </td>
                            <td className="px-5 py-3 text-right font-extrabold text-white font-mono">
                              +₹{photoTotalCost.toLocaleString()}
                            </td>
                          </tr>
                        )}

                        {/* 4. Dedication Box Label */}
                        {parsed.labelName && (
                          <tr className="hover:bg-zinc-800/30 transition bg-zinc-950/40">
                            <td className="px-5 py-3 font-semibold text-white flex items-center gap-2">
                              <Tag size={14} className="text-[#FFC107] shrink-0" />
                              Custom Printed Dedication Label
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              Packaging Proof
                            </td>
                            <td className="px-4 py-3 text-right text-slate-300 font-mono">
                              +₹{textUnitCost}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300 font-bold">
                              {membersCount} Packages
                            </td>
                            <td className="px-5 py-3 text-right font-extrabold text-white font-mono">
                              +₹{textTotalCost.toLocaleString()}
                            </td>
                          </tr>
                        )}

                        {/* 5. Celebration Video */}
                        {parsed.isVideoRequested && (
                          <tr className="hover:bg-zinc-800/30 transition bg-purple-950/20">
                            <td className="px-5 py-3 font-semibold text-purple-200 flex items-center gap-2">
                              <Video size={14} className="text-purple-400 shrink-0" />
                              Celebration Video Recording Request
                            </td>
                            <td className="px-4 py-3 text-purple-300">
                              Media Production
                            </td>
                            <td className="px-4 py-3 text-right text-purple-200 font-mono">
                              Flat ₹{parsed.videoCost}
                            </td>
                            <td className="px-4 py-3 text-center text-purple-200 font-bold">
                              1 Video Drive
                            </td>
                            <td className="px-5 py-3 text-right font-extrabold text-purple-300 font-mono">
                              +₹{videoTotalCost.toLocaleString()}
                            </td>
                          </tr>
                        )}

                        {/* 6. Extra Items */}
                        {parsed.extras.map((extra, idx) => (
                          <tr key={`extra-${idx}`} className="hover:bg-zinc-800/30 transition bg-zinc-950/30">
                            <td className="px-5 py-3 font-semibold text-slate-300 flex items-center gap-2">
                              <Gift size={13} className="text-[#FFC107] shrink-0" />
                              Extra Item: {extra}
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              Gift Extra
                            </td>
                            <td className="px-4 py-3 text-right text-slate-400 italic">
                              Included
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300 font-bold">
                              {membersCount} Units
                            </td>
                            <td className="px-5 py-3 text-right text-slate-400 italic">
                              Included
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      {/* Total Footer Row */}
                      <tfoot>
                        <tr className="border-t-2 border-zinc-700 bg-black/80">
                          <td colSpan={4} className="px-5 py-3.5 text-right font-extrabold text-white uppercase tracking-wider text-xs">
                            Grand Total Received:
                          </td>
                          <td className="px-5 py-3.5 text-right font-black text-emerald-400 text-base font-mono">
                            ₹{totalPaid.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* ── 4. PACKAGING & DISPATCH PRODUCTION SPECS (2 Clean Columns) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Photo on Packaging Spec */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <ImageIcon size={15} className="text-[#FFC107]" />
                        Photo for Box Sticker Print
                      </span>
                      {parsed.photoUrl && (
                        <span className="text-[10px] font-bold text-slate-400">
                          Print {membersCount} Copies
                        </span>
                      )}
                    </div>

                    {parsed.photoUrl ? (
                      <div className="flex items-center gap-4 bg-black/60 p-3.5 rounded-xl border border-zinc-800">
                        <div 
                          onClick={() => setPreviewingPhotoUrl(parsed.photoUrl)}
                          className="relative h-24 w-24 rounded-xl overflow-hidden border border-zinc-700 shrink-0 cursor-pointer group/zoom shadow-sm"
                          title="Click to view full size"
                        >
                          <img 
                            src={parsed.photoUrl} 
                            alt="Donor packaging proof" 
                            className="h-full w-full object-cover group-hover/zoom:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/zoom:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Maximize2 size={16} />
                          </div>
                        </div>

                        <div className="space-y-2 flex-1 text-xs">
                          <p className="text-slate-300 leading-relaxed">
                            Print <strong>{membersCount}</strong> high-resolution copies on glossy sticker paper and affix neatly to package covers.
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              disabled={downloadingPhoto}
                              onClick={() => handleDownloadPhoto(parsed.photoUrl, selectedDonation.donor_name, selectedDonation.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFC107] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                            >
                              <Download size={12} />
                              <span>{downloadingPhoto ? "Downloading..." : "Download Photo"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewingPhotoUrl(parsed.photoUrl)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white transition"
                            >
                              <Eye size={12} /> Zoom
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-center text-xs text-slate-500 italic">
                        Standard packaging applied (no custom photo requested).
                      </div>
                    )}
                  </div>

                  {/* Dedication Box Sticker Spec */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Tag size={15} className="text-[#FFC107]" />
                        Printed Box Dedication Label
                      </span>
                      {parsed.labelName && (
                        <button
                          onClick={() => copyToClipboard(`${parsed.labelName}${parsed.labelDesc ? ` - ${parsed.labelDesc}` : ""}`)}
                          className="text-[11px] font-bold text-[#FFC107] hover:underline flex items-center gap-1"
                        >
                          {copiedLabel ? <Check size={12} /> : <Copy size={12} />}
                          {copiedLabel ? "Copied!" : "Copy Text"}
                        </button>
                      )}
                    </div>

                    {parsed.labelName ? (
                      <div className="space-y-2">
                        <div className="rounded-xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-3.5 text-center space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFC107] block">
                            Sponsored with Love
                          </span>
                          <span className="text-sm font-extrabold text-white block">
                            {parsed.labelName}
                          </span>
                          {parsed.labelDesc && (
                            <span className="text-xs text-amber-200/90 italic block">
                              &quot;{parsed.labelDesc}&quot;
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400 block pt-1">
                            Print requirement: {membersCount} stickers
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-center text-xs text-slate-500 italic">
                        Standard foundation packaging applied (no custom label text requested).
                      </div>
                    )}
                  </div>

                </div>

                {/* ── 5. CELEBRATION VIDEO NOTIFICATION (IF REQUESTED) ── */}
                {parsed.isVideoRequested && (
                  <div className="rounded-2xl bg-purple-950/40 border-2 border-purple-500/60 p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Video size={18} className="text-purple-400 shrink-0" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-purple-200">
                        Celebration Video Coverage Requested
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/90 leading-relaxed">
                      <strong>Coordinator Action Required:</strong> The donor completed payment for personalized celebration video coverage (Flat ₹{parsed.videoCost}). Ensure field coordinators record a high-quality 30 to 60-second celebration video of the distribution and deliver it to the donor via WhatsApp / Email within 24 to 48 hours.
                    </p>
                  </div>
                )}

                {/* ── 6. DONOR'S PERSONAL MESSAGE / BLESSING ── */}
                {parsed.generalMessage && (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-[#FFC107]" /> Donor Blessing / Personal Dedication Note
                    </span>
                    <div className="text-xs font-medium text-zinc-200 italic bg-black/60 p-3 rounded-xl border border-zinc-800">
                      &quot;{parsed.generalMessage}&quot;
                    </div>
                  </div>
                )}

                {/* ── 7. MODAL ACTIONS & DISPATCH SWITCH ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300">Mark as Delivered &amp; Fulfilled:</span>
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
                    <span className={`text-[11px] font-bold ${isDonated ? "text-emerald-400" : "text-slate-400"}`}>
                      {isDonated ? "Status: Completed" : "Status: Pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition"
                    >
                      <Printer size={14} /> Print Manifest
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDonation(null)}
                      className="rounded-xl bg-[#FFC107] px-6 py-2.5 text-xs font-extrabold text-black hover:opacity-90 active:scale-95 transition"
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

      {/* High-Resolution Photo Zoom Lightbox */}
      <AnimatePresence>
        {previewingPhotoUrl && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setPreviewingPhotoUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#111] rounded-3xl border border-zinc-800 p-4 sm:p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ImageIcon size={15} className="text-[#FFC107]" /> High-Resolution Packaging Photo
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewingPhotoUrl(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative aspect-square max-h-[65vh] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
                <img
                  src={previewingPhotoUrl}
                  alt="Packaging proof full size"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={previewingPhotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-bold text-zinc-200 hover:text-white transition"
                >
                  <ExternalLink size={13} /> Open in New Tab
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewingPhotoUrl(null)}
                  className="rounded-xl bg-[#FFC107] px-5 py-2 text-xs font-bold text-black hover:opacity-90 transition"
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