"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import AdminHeader from "@/components/foundation/adminheader";
import {
  Heart,
  MessageSquare,
  Image as ImageIcon,
  Building2,
  Layers,
  IndianRupee,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Adjust these import paths if your action files live somewhere else.
import { getDonations } from "./donations/actions";
import { getContactInquiries } from "./contact/actions";
import { getGalleryImages } from "./gallery/actions";
import { getCsrProposals } from "./csr/actions";
import { getCausesData } from "./causes/actions";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

interface SectionState {
  loading: boolean;
  error: string | null;
}

export default function AdminDashboardPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [causes, setCauses] = useState<any[]>([]);
  
  // NEW: State to hold the logged-in user's details
  const [userName, setUserName] = useState("Admin");
  const [staffId, setStaffId] = useState("");
  const [userRole, setUserRole] = useState("staff");

  const [status, setStatus] = useState<Record<string, SectionState>>({
    donations: { loading: true, error: null },
    inquiries: { loading: true, error: null },
    gallery: { loading: true, error: null },
    proposals: { loading: true, error: null },
    causes: { loading: true, error: null },
  });

  useEffect(() => {
    // NEW: Pull the user's name, ID, and role from local storage when the page loads
    setUserName(localStorage.getItem("rakvih_admin_name") || "Admin");
    setStaffId(localStorage.getItem("rakvih_admin_staff_id") || "");
    setUserRole(localStorage.getItem("rakvih_admin_role") || "staff");

    loadAll();
  }, []);

  function setSection(key: string, patch: Partial<SectionState>) {
    setStatus((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function loadAll() {
    (async () => {
      try {
        const data = await getDonations();
        setDonations(data || []);
      } catch (err: any) {
        setSection("donations", { error: err.message || "Failed to load donations." });
      } finally {
        setSection("donations", { loading: false });
      }
    })();

    (async () => {
      try {
        const data = await getContactInquiries();
        setInquiries(data || []);
      } catch (err: any) {
        setSection("inquiries", { error: err.message || "Failed to load contact inquiries." });
      } finally {
        setSection("inquiries", { loading: false });
      }
    })();

    (async () => {
      try {
        const data = await getGalleryImages();
        setGallery(data || []);
      } catch (err: any) {
        setSection("gallery", { error: err.message || "Failed to load gallery." });
      } finally {
        setSection("gallery", { loading: false });
      }
    })();

    (async () => {
      try {
        const data = await getCsrProposals();
        setProposals(data || []);
      } catch (err: any) {
        setSection("proposals", { error: err.message || "Failed to load CSR proposals." });
      } finally {
        setSection("proposals", { loading: false });
      }
    })();

    (async () => {
      try {
        const data = await getCausesData();
        setCauses(data || []);
      } catch (err: any) {
        setSection("causes", { error: err.message || "Failed to load causes." });
      } finally {
        setSection("causes", { loading: false });
      }
    })();
  }

  const anyLoading = Object.values(status).some((s) => s.loading);

  const totalDonationAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const donatedCount = donations.filter((d) => (d.is_donated ?? true) === true).length;

  const pendingInquiries = inquiries.filter((i) => (i.is_resolved ?? false) === false).length;

  const totalSubCauses = causes.reduce((sum: number, cat: any) => sum + (cat.cause_items?.length || 0), 0);

  const pendingCsr = proposals.filter((p) => (p.status || "Pending Review") === "Pending Review").length;
  const approvedCsr = proposals.filter((p) => p.status === "Approved").length;

  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const quickLinks = [
    {
      href: "/adminfoundations/donations",
      label: "Donations",
      icon: Heart,
      stat: `${donations.length} records`,
    },
    {
      href: "/adminfoundations/contact",
      label: "Contact Inquiries",
      icon: MessageSquare,
      stat: `${pendingInquiries} pending`,
    },
    {
      href: "/adminfoundations/gallery",
      label: "Gallery",
      icon: ImageIcon,
      stat: `${gallery.length} photos`,
    },
    {
      href: "/adminfoundations/csr",
      label: "CSR Proposals",
      icon: Building2,
      stat: `${pendingCsr} pending`,
    },
    {
      href: "/adminfoundations/causes",
      label: "Causes & Pricing",
      icon: Layers,
      stat: `${causes.length} headers`,
    },
  ];

  const sectionErrors = Object.entries(status)
    .filter(([, s]) => s.error)
    .map(([key, s]) => ({ key, message: s.error as string }));

  return (
    <div
      className={`min-h-screen bg-black ${display.variable}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* UPDATED: Page Title & User Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl flex items-center gap-2">
              Welcome back, {userName.split(" ")[0]} 👋
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-xs sm:text-sm text-slate-400">
                Foundation Dashboard Overview
              </p>
              {staffId && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300">
                  {staffId}
                </span>
              )}
              {userRole === "admin" && (
                <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-500 uppercase tracking-widest">
                  Master Admin
                </span>
              )}
            </div>
          </div>

          {anyLoading && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-[#798321]/10 px-4 py-3 text-xs font-bold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#798321] dark:border-[#FFC107] border-t-transparent" />
              Loading data...
            </div>
          )}
        </div>

        {/* Section Error Banners */}
        {sectionErrors.length > 0 && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 space-y-1">
            <span className="font-bold block">Some data failed to load:</span>
            {sectionErrors.map(({ key, message }) => (
              <div key={key}>
                <span className="font-semibold capitalize">{key}:</span> {message}
              </div>
            ))}
          </div>
        )}

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                <IndianRupee size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Raised</span>
            </div>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{totalDonationAmount.toLocaleString()}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                <Heart size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Donations</span>
            </div>
            <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">
              {donatedCount} <span className="text-xs font-semibold text-slate-400">/ {donations.length}</span>
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Pending Inquiries</span>
            </div>
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
              {pendingInquiries}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">CSR Approved</span>
            </div>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {approvedCsr} <span className="text-xs font-semibold text-slate-400">/ {proposals.length}</span>
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                <ImageIcon size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Gallery Photos</span>
            </div>
            <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">
              {gallery.length}
            </span>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white mb-4">Manage Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#798321]/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#FFC107]/40 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 group-hover:text-[#798321] dark:text-zinc-700 dark:group-hover:text-[#FFC107] transition"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{link.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{link.stat}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart size={14} className="text-[#798321] dark:text-[#FFC107]" /> Recent Donations
              </h3>
              <Link
                href="/adminfoundations/donations"
                className="text-[11px] font-bold text-[#798321] dark:text-[#FFC107] hover:underline"
              >
                View all
              </Link>
            </div>
            {status.donations.loading ? (
              <div className="py-12 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
              </div>
            ) : recentDonations.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400">No donations yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {recentDonations.map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-5 py-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{d.donor_name}</div>
                      <div className="text-[10px] text-slate-400">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString() : ""}
                      </div>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(d.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={14} className="text-[#798321] dark:text-[#FFC107]" /> Recent Inquiries
              </h3>
              <Link
                href="/adminfoundations/contact"
                className="text-[11px] font-bold text-[#798321] dark:text-[#FFC107] hover:underline"
              >
                View all
              </Link>
            </div>
            {status.inquiries.loading ? (
              <div className="py-12 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400">No inquiries yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {recentInquiries.map((i) => {
                  const isResolved = i.is_resolved ?? false;
                  return (
                    <div key={i.id} className="flex items-center justify-between px-5 py-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{i.full_name}</div>
                        <div className="text-[10px] text-slate-400">{i.inquiry_type}</div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isResolved
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {isResolved ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {isResolved ? "Resolved" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}