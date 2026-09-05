"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import {
  Heart,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Users,
  Plus,
  Minus,
  Calendar,
  Tag,
  Upload,
  Image as ImageIcon,
  Video,
  Gift,
  ChevronDown,
  Search,
  Check,
  X,
  PhoneOff,
  Clock,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const DEFAULT_ADDONS = {
  minPersons: 1,
  maxPersons: 100,
  photoCost: 7,
  videoCost: 150,
  textCost: 5,
  extras: [
    { id: "item_candle", title: "Include Scented Candles", cost: 15 },
    { id: "item_gift", title: "Include Small Gift Box", cost: 50 },
    { id: "item_flower", title: "Include Fresh Flowers", cost: 20 },
    { id: "item_sweets", title: "Include Traditional Sweets Box", cost: 40 },
  ],
};

function DonateContent() {
  const searchParams = useSearchParams();
  const causeId = searchParams.get("cause") || "42";

  // Data States
  const [cause, setCause] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin limits
  const [minPersons, setMinPersons] = useState<number>(DEFAULT_ADDONS.minPersons);
  const [maxPersons, setMaxPersons] = useState<number>(DEFAULT_ADDONS.maxPersons);

  // Core Form States
  const [personCount, setPersonCount] = useState<number>(() => {
    const q = searchParams.get("qty");
    return q && !isNaN(Number(q)) && Number(q) > 0 ? Number(q) : 1;
  });
  const [dedicationType, setDedicationType] = useState<string>("General Donation");
  const [donationDate, setDonationDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorMessage, setDonorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const vName = localStorage.getItem("rakvih_volunteer_name");
      const vEmail = localStorage.getItem("rakvih_volunteer_email");
      if (vName && !donorName) setDonorName(vName);
      if (vEmail && !donorEmail) setDonorEmail(vEmail);
    }
  }, []);

  // ── Optional Add-ons & Packaging ──
  const [wantsPhoto, setWantsPhoto] = useState<boolean>(
    searchParams.get("photo") === "true" || searchParams.get("upload") === "true"
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [wantsVideo, setWantsVideo] = useState<boolean>(
    searchParams.get("video") === "true"
  );

  const [wantsText, setWantsText] = useState<boolean>(
    searchParams.get("text") === "true"
  );
  const [packingLabelName, setPackingLabelName] = useState("");
  const [packingLabelDesc, setPackingLabelDesc] = useState("");

  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    const raw = searchParams.get("items");
    return raw ? raw.split(",").filter(Boolean) : [];
  });
  const [isPackagingMenuOpen, setIsPackagingMenuOpen] = useState<boolean>(() => {
    return (
      searchParams.get("photo") === "true" ||
      searchParams.get("upload") === "true" ||
      searchParams.get("video") === "true" ||
      searchParams.get("text") === "true" ||
      Boolean(searchParams.get("items"))
    );
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [addonPrices, setAddonPrices] = useState(DEFAULT_ADDONS);

  const [subItemAddons, setSubItemAddons] = useState<any[]>([]);
  const [selectedSubAddons, setSelectedSubAddons] = useState<string[]>([]);

  // Submission & Post-Payment Pop-up States
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [completedDonationData, setCompletedDonationData] = useState<any>(null);

  // Short Floating Popup & Photo Validation States
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [photoError, setPhotoError] = useState<boolean>(false);
  const [showSamplePhotoModal, setShowSamplePhotoModal] = useState<boolean>(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showPopup = (msg: string) => {
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    setPopupMessage(msg);
    popupTimeoutRef.current = setTimeout(() => {
      setPopupMessage("");
    }, 4500);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch Cause, Donations, and Admin Configuration
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [causeRes, donationsRes, categoryRes, addonsRes] = await Promise.all([
          supabase.from("cause_items").select("*").eq("id", causeId).single(),
          supabase
            .from("donations")
            .select("*")
            .eq("cause_id", causeId)
            .order("created_at", { ascending: false }),
          supabase.from("cause_categories").select("id, title, description"),
          supabase
            .from("cause_item_addons")
            .select("id, title, cost, is_active")
            .eq("cause_id", causeId)
            .eq("is_active", true)
            .order("created_at", { ascending: true }),
        ]);

        if (causeRes.data) setCause(causeRes.data);
        if (donationsRes.data) setDonations(donationsRes.data);

        // Sub-item add-ons from dedicated table
        let subItemSpecificAddons: any[] = [];
        if (!addonsRes.error && addonsRes.data && addonsRes.data.length > 0) {
          subItemSpecificAddons = addonsRes.data.map((a: any) => ({
            id: String(a.id),
            title: a.title,
            cost: Number(a.cost) || 0,
            is_active: a.is_active,
          }));
        }

        // Sync admin-configured member limits and addon costs
        if (categoryRes.data) {
          const configRow = categoryRes.data.find((c: any) => {
            try {
              const parsed = JSON.parse(c.description || "");
              return (
                typeof parsed.minPersons === "number" ||
                typeof parsed.mediaCost === "number" ||
                typeof parsed.photoCost === "number"
              );
            } catch {
              return false;
            }
          });

          // Check if the cause belongs to a category that has category-specific or sub-item specific add-ons
          let categorySpecificAddons: any[] = [];
          if (causeRes.data?.category_id) {
            const currentCat = categoryRes.data.find(
              (c: any) => String(c.id) === String(causeRes.data.category_id)
            );
            if (currentCat?.description) {
              try {
                const parsedCat = JSON.parse(currentCat.description);
                if (Array.isArray(parsedCat.addOns)) {
                  categorySpecificAddons = parsedCat.addOns;
                }
                if (
                  subItemSpecificAddons.length === 0 &&
                  parsedCat.subItemAddons &&
                  Array.isArray(parsedCat.subItemAddons[String(causeId)])
                ) {
                  subItemSpecificAddons = parsedCat.subItemAddons[String(causeId)];
                }
              } catch {
                // ignore
              }
            }
          }

          if (subItemSpecificAddons.length === 0) {
            for (const c of (categoryRes.data || [])) {
              try {
                const parsed = JSON.parse(c.description || "");
                if (parsed.subItemAddons && Array.isArray(parsed.subItemAddons[String(causeId)])) {
                  subItemSpecificAddons = parsed.subItemAddons[String(causeId)];
                  break;
                }
              } catch {}
            }
          }

          setSubItemAddons(
            subItemSpecificAddons.length > 0 ? subItemSpecificAddons : categorySpecificAddons
          );

          if (configRow?.description) {
            const parsed = JSON.parse(configRow.description);
            const adminMin = parsed.minPersons || DEFAULT_ADDONS.minPersons;
            const adminMax = parsed.maxPersons || DEFAULT_ADDONS.maxPersons;

            setMinPersons(adminMin);
            setMaxPersons(adminMax);

            const urlQty = searchParams.get("qty");
            if (!urlQty) {
              setPersonCount(adminMin);
            } else {
              setPersonCount(Math.max(adminMin, Math.min(adminMax, Number(urlQty))));
            }

            const baseExtras = parsed.extras || DEFAULT_ADDONS.extras;
            const mergedExtras = [
              ...categorySpecificAddons,
              ...baseExtras.filter((b: any) => !categorySpecificAddons.some((c: any) => c.id === b.id)),
            ];

            setAddonPrices({
              minPersons: adminMin,
              maxPersons: adminMax,
              photoCost: parsed.photoCost ?? parsed.mediaCost ?? DEFAULT_ADDONS.photoCost,
              videoCost: parsed.videoCost ?? DEFAULT_ADDONS.videoCost,
              textCost: parsed.textCost ?? DEFAULT_ADDONS.textCost,
              extras: mergedExtras,
            });
          }
        }
      } catch (err) {
        console.error("Error loading cause data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (causeId) loadData();
  }, [causeId, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubAddon = (addonId: string) => {
    setSelectedSubAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Multiplier Calculations
  const baseCostPerPerson = Number(cause?.cost) || 100;
  const subAddonsUnitCost = selectedSubAddons.reduce((sum, id) => {
    const item = subItemAddons.find((a) => a.id === id);
    return sum + (item?.cost || 0);
  }, 0);
  const photoUnitCost = wantsPhoto ? addonPrices.photoCost : 0;
  const textUnitCost = wantsText ? addonPrices.textCost : 0;
  const extrasUnitCost = selectedItems.reduce((sum, itemId) => {
    const item = addonPrices.extras.find((a) => a.id === itemId);
    return sum + (item?.cost || 0);
  }, 0);

  const perMemberSubtotal =
    baseCostPerPerson + subAddonsUnitCost + photoUnitCost + textUnitCost + extrasUnitCost;
  const membersTotalCost = perMemberSubtotal * personCount;
  const videoFlatCost = wantsVideo ? addonPrices.videoCost : 0;
  const finalCalculatedTotal = membersTotalCost + videoFlatCost;

  const activeOptionsCount =
    (wantsPhoto ? 1 : 0) +
    (wantsVideo ? 1 : 0) +
    (wantsText ? 1 : 0) +
    selectedItems.length;

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoError(false);
      setPopupMessage("");
    }
  };

  const handlePaymentCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donorName.trim()) {
      showPopup("Please enter your full name.");
      return;
    }

    if (!donorEmail.trim() || !/^\S+@\S+\.\S+$/.test(donorEmail.trim())) {
      showPopup("Please enter a valid email address.");
      return;
    }

    if (!donorPhone.trim() || donorPhone.trim().length < 7) {
      showPopup("Please enter a valid contact phone number.");
      return;
    }

    if (wantsPhoto && !photoFile) {
      setIsPackagingMenuOpen(true);
      setPhotoError(true);
      showPopup("Please upload a photo for packing, or uncheck the option.");
      return;
    }

    if (wantsText && !packingLabelName.trim()) {
      setIsPackagingMenuOpen(true);
      showPopup("Please enter a dedication label name, or uncheck the option.");
      return;
    }

    if (finalCalculatedTotal <= 0) {
      showPopup("Donation amount must be greater than zero.");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Upload Packing Photo if attached
      let uploadedPhotoUrl = "";
      if (wantsPhoto && photoFile) {
        try {
          const fileExt = photoFile.name.split(".").pop();
          const cleanFileName = `photo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `packing-proofs/${cleanFileName}`;

          const { error: photoErr } = await supabase.storage
            .from("causes")
            .upload(filePath, photoFile, {
              contentType: photoFile.type || "image/jpeg",
              upsert: true,
            });

          if (photoErr) {
            console.error("Storage upload failed:", photoErr.message);
            alert(
              `Packaging photo upload failed: ${photoErr.message}. Please verify storage permissions for the 'causes' bucket.`
            );
            setSubmitting(false);
            return;
          }

          const { data: urlData } = supabase.storage.from("causes").getPublicUrl(filePath);
          uploadedPhotoUrl = urlData.publicUrl;
        } catch (uploadException: any) {
          console.error("Exception during photo upload:", uploadException);
          alert("Could not upload the selected packaging photo. Please try a different photo.");
          setSubmitting(false);
          return;
        }
      }

      // 2. Create Razorpay Order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalCalculatedTotal }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create payment order");

      // 3. Launch Gateway
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RAKVIH Foundation",
        description: `Sponsorship of ${personCount} member(s) - ${cause?.title || cause?.name || "Initiative"}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const selectedSubAddonNames = selectedSubAddons
              .map((id) => {
                const a = subItemAddons.find((item) => item.id === id);
                return a ? `${a.title} (+₹${a.cost})` : "";
              })
              .filter(Boolean);

            const selectedItemNames = selectedItems
              .map((id) => addonPrices.extras.find((a) => a.id === id)?.title)
              .filter(Boolean) as string[];

            const packingSummary = [
              donorMessage ? `"${donorMessage}"` : "",
              `Members: ${personCount}`,
              selectedSubAddonNames.length > 0 ? `Sub-Item Add-ons: ${selectedSubAddonNames.join(", ")}` : "",
              uploadedPhotoUrl ? `Photo on Packing: ${uploadedPhotoUrl}` : "",
              wantsVideo ? `Celebration Video Requested: Yes (Flat ₹${videoFlatCost})` : "",
              wantsText ? `Label: [${packingLabelName}] - ${packingLabelDesc}` : "",
              selectedItemNames.length > 0 ? `Extras: ${selectedItemNames.join(", ")}` : "",
            ]
              .filter(Boolean)
              .join(" | ");

            const { error: insertError } = await supabase.from("donations").insert([
              {
                cause_id: parseInt(causeId as string),
                donor_name: donorName.trim(),
                email: donorEmail.trim(),
                phone: donorPhone.trim(),
                donor_image: uploadedPhotoUrl || "",
                amount: finalCalculatedTotal,
                message: packingSummary,
                donation_date: donationDate,
                dedication_type: dedicationType,
                is_donated: true,
              },
            ]);

            if (insertError) {
              console.error("Database insert error:", insertError);
              alert("Payment succeeded, but record logging failed. Please notify support.");
              return;
            }

            // Send Notification Email to Admin
            fetch("/api/donations/notify-admin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donorName: donorName.trim(),
                donorEmail: donorEmail.trim(),
                donorPhone: donorPhone.trim(),
                amount: finalCalculatedTotal,
                causeTitle: cause?.title || cause?.name || "Initiative Sponsorship",
                personCount,
                donationDate,
                dedicationType,
                uploadedPhotoUrl,
                wantsVideo,
                packingLabelName,
                packingLabelDesc,
                selectedItemNames: [...selectedSubAddonNames, ...selectedItemNames],
                donorMessage: donorMessage.trim(),
              }),
            }).catch((emailErr) => {
              console.warn("Could not deliver admin email alert:", emailErr);
            });

            setCompletedDonationData({
              donorName: donorName.trim(),
              donorEmail: donorEmail.trim(),
              donorPhone: donorPhone.trim(),
              amount: finalCalculatedTotal,
              personCount,
              wantsVideo,
              donationDate,
              selectedSubAddons: selectedSubAddonNames,
            });

            setShowSuccessPopup(true);

            setDonorName("");
            setDonorEmail("");
            setDonorPhone("");
            setDonorMessage("");
            setPackingLabelName("");
            setPackingLabelDesc("");
            setPhotoFile(null);
            setPhotoPreview(null);
            setWantsVideo(false);

            const { data: refreshed } = await supabase
              .from("donations")
              .select("*")
              .eq("cause_id", causeId)
              .order("created_at", { ascending: false });

            if (refreshed) setDonations(refreshed);
          } catch (dbErr) {
            console.error("Post-payment error:", dbErr);
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: donorName.trim(),
          email: donorEmail.trim(),
          contact: donorPhone.trim(),
        },
        theme: {
          color: "#798321",
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment initialization error:", err);
      alert(err.message || "Could not launch payment gateway.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
      </div>
    );
  }

  const displayImage =
    cause?.image ||
    cause?.image_url ||
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop";

  const dropdownItems = addonPrices.extras
    .filter(
      (item) =>
        !subItemAddons.some(
          (sub) => sub.id === item.id || sub.title.toLowerCase() === item.title.toLowerCase()
        )
    )
    .filter((item) => item.title.toLowerCase().includes(dropdownSearch.toLowerCase()));

  return (
    <div
      className={`min-h-screen overflow-x-clip bg-slate-50 dark:bg-black pb-16 sm:pb-20 transition-colors duration-500 ${display.variable}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {/* Top Banner */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-12 sm:pb-8 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 mb-3">
            <Link
              href="/foundation/causes"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFC107] hover:underline"
            >
              <ArrowLeft size={14} /> Back to All Causes
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1 text-xs font-semibold text-[#FFC107] backdrop-blur-md uppercase shadow-lg">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Direct Impact Sponsorship
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-2">
            Sponsor: <span className="text-[#FFC107]">{cause?.title || cause?.name}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 dark:text-neutral-400">
            Select your member count, fill your dedication, add optional packaging details, and donate securely.
          </p>
        </div>
      </section>

      {/* Main Grid: items-start keeps both columns aligned; Left is sticky to eliminate empty gap */}
      <main className="mx-auto max-w-7xl px-4 pt-5 sm:pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: 5 Cols Width + Sticky so it follows the form with NO dead space ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <div className="relative h-56 w-full">
                <Image src={displayImage} alt="Cause Image" fill priority className="object-cover" />
              </div>
              <div className="p-5 space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {cause?.title || cause?.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  {cause?.short_description ||
                    "Direct sponsorship delivered with verified photo and distribution tracking."}
                </p>

                <div className="flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-[#171717] p-3.5 border border-amber-200/60 dark:border-neutral-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-neutral-400">
                      Baseline Cost
                    </p>
                    <p className="text-base font-extrabold text-[#798321] dark:text-[#FFC107]">
                      ₹{baseCostPerPerson.toLocaleString()}{" "}
                      <span className="text-xs font-medium text-slate-500">/ person</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Supporters List */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Heart size={16} className="text-rose-500" /> Recent Supporters ({donations.length})
              </h3>

              {donations.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-neutral-500 py-4 text-center">
                  Be the first generous donor to support this initiative!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {donations.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#171717] border border-slate-100 dark:border-neutral-800 text-xs"
                    >
                      <div className="space-y-0.5 max-w-[70%]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {item.donor_name}
                          </span>
                          {item.dedication_type && (
                            <span className="text-[9px] font-semibold text-[#798321] dark:text-[#FFC107] bg-amber-50 dark:bg-[#0a0a0a] px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-neutral-800">
                              {item.dedication_type}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">{item.donation_date}</p>
                      </div>
                      <span className="text-xs font-extrabold text-[#798321] dark:text-[#FFC107] shrink-0">
                        ₹{Number(item.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: 7 Cols Width, balanced & compact ── */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <form onSubmit={handlePaymentCheckout} className="space-y-5">
                {/* ── 1. CORE ESSENTIALS: Member Counter & Baseline Cost ── */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#141414] p-4 border border-slate-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">
                        Supported Members Count
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                        Baseline Cost: <strong className="text-[#798321] dark:text-[#FFC107]">₹{baseCostPerPerson}</strong> / member
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#798321] dark:text-[#FFC107] bg-amber-50 dark:bg-black/50 px-2.5 py-1 rounded-xl border border-amber-200/60 dark:border-neutral-700">
                      {personCount} Member(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPersonCount(Math.max(minPersons, personCount - 1))}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 dark:bg-[#0a0a0a] dark:border-neutral-700 text-slate-700 dark:text-white hover:bg-slate-100"
                    >
                      <Minus size={16} />
                    </button>

                    <input
                      type="number"
                      min={minPersons}
                      max={maxPersons}
                      value={personCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) {
                          setPersonCount(minPersons);
                        } else {
                          setPersonCount(Math.max(minPersons, Math.min(maxPersons, val)));
                        }
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-center font-bold text-base text-slate-900 focus:border-[#798321] focus:outline-none dark:border-neutral-700 dark:bg-[#0a0a0a] dark:text-white"
                    />

                    <button
                      type="button"
                      onClick={() => setPersonCount(Math.min(maxPersons, personCount + 1))}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 dark:bg-[#0a0a0a] dark:border-neutral-700 text-slate-700 dark:text-white hover:bg-slate-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
                    <span>Min: {minPersons}</span>
                    <span>Max allowed: {maxPersons}</span>
                  </div>
                </div>

                {/* ── 2. SUB-ITEM SPECIFIC ADD-ONS (Open, NO dropdown) ── */}
                {subItemAddons.length > 0 && (
                  <div className="rounded-2xl border border-amber-200/90 bg-amber-50/50 p-4 sm:p-5 dark:border-neutral-800 dark:bg-[#121212] space-y-3 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200/70 dark:border-neutral-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Gift size={16} className="text-[#798321] dark:text-[#FFC107]" />
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Optional Add-ons for {cause?.title || cause?.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                          Directly choose multiple add-on items to accompany each {cause?.title || cause?.name} sponsorship.
                        </p>
                      </div>
                      {selectedSubAddons.length > 0 && (
                        <span className="self-start sm:self-auto rounded-full bg-[#798321]/15 px-3 py-1 text-[11px] font-bold text-[#798321] dark:bg-[#FFC107]/15 dark:text-[#FFC107] border border-[#798321]/30 dark:border-[#FFC107]/30">
                          {selectedSubAddons.length} selected (+₹{subAddonsUnitCost}/member)
                        </span>
                      )}
                    </div>

                    {/* Open multi-select cards (No dropdown) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {subItemAddons.map((addon) => {
                        const isChecked = selectedSubAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleSubAddon(addon.id)}
                            className={`group flex cursor-pointer items-center justify-between p-3 rounded-xl border transition-all select-none ${
                              isChecked
                                ? "border-[#798321] bg-white shadow-md dark:border-[#FFC107] dark:bg-neutral-900 ring-1 ring-[#798321] dark:ring-[#FFC107]"
                                : "border-slate-200/80 bg-white/80 hover:border-slate-300 hover:bg-white dark:border-neutral-800 dark:bg-[#0c0c0c] dark:hover:border-neutral-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isChecked
                                    ? "border-[#798321] bg-[#798321] text-white dark:border-[#FFC107] dark:bg-[#FFC107] dark:text-black"
                                    : "border-slate-300 group-hover:border-slate-400 dark:border-neutral-600"
                                }`}
                              >
                                {isChecked && <Check size={11} strokeWidth={3} />}
                              </div>
                              <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200 truncate">
                                {addon.title}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#798321] dark:text-[#FFC107] shrink-0">
                              + ₹{addon.cost}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── 3. CORE ESSENTIALS: Dedication & Date (Side-by-side) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Dedication Type
                    </label>
                    <select
                      value={dedicationType}
                      onChange={(e) => setDedicationType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 dark:border-neutral-700 dark:bg-[#141414] dark:text-white focus:outline-none"
                    >
                      <option value="General Donation">General Donation</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="In Memory of a Loved One">In Memory of a Loved One</option>
                      <option value="Festival / Special Occasion">Festival / Special Occasion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1">
                      Execution Date
                    </label>
                    <input
                      type="date"
                      value={donationDate}
                      onChange={(e) => setDonationDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 dark:border-neutral-700 dark:bg-[#141414] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Name, Email, Phone & Note */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 dark:border-neutral-700 dark:bg-[#141414] dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 dark:border-neutral-700 dark:bg-[#141414] dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 dark:border-neutral-700 dark:bg-[#141414] dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1">
                      Encouraging Note / Blessing (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Leave a heartfelt message..."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 dark:border-neutral-700 dark:bg-[#141414] dark:text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* ── 3. OPTIONAL PACKAGING & EXTRAS (Single Dropdown Menu) ── */}
                <div className="pt-2 border-t border-slate-200 dark:border-neutral-800">
                  <div className="rounded-2xl border border-slate-200 bg-white dark:border-neutral-800 dark:bg-[#121212] overflow-hidden transition-all shadow-sm">
                    <button
                      type="button"
                      onClick={() => setIsPackagingMenuOpen(!isPackagingMenuOpen)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#798321] dark:bg-[#FFC107]/15 dark:text-[#FFC107]">
                          <Gift size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Optional Packaging &amp; Extras
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              (Optional)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                            {activeOptionsCount === 0
                              ? "Click to choose custom photo label, celebration video, or add-ons"
                              : `${activeOptionsCount} optional customizer(s) selected`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {activeOptionsCount > 0 ? (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {activeOptionsCount} active
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                            View Options
                          </span>
                        )}
                        <div className={`p-1 text-slate-400 transition-transform duration-300 ${isPackagingMenuOpen ? "rotate-180 text-[#798321] dark:text-[#FFC107]" : ""}`}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isPackagingMenuOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-200 dark:border-neutral-800 p-4 space-y-3.5 bg-slate-50/60 dark:bg-black/40"
                        >
                          {/* Option 1: Attach Photo on Packing */}
                          <div
                            className={`rounded-2xl border transition-all ${
                              photoError && !photoFile
                                ? "border-rose-500 bg-rose-50/25 dark:border-rose-500/80 dark:bg-rose-950/20 ring-2 ring-rose-500/40"
                                : wantsPhoto
                                ? "border-[#798321] bg-[#798321]/5 dark:border-[#FFC107] dark:bg-[#FFC107]/5"
                                : "border-slate-200 bg-white dark:border-neutral-800 dark:bg-[#121212]"
                            }`}
                          >
                            <div
                              onClick={() => {
                                const next = !wantsPhoto;
                                setWantsPhoto(next);
                                if (!next) {
                                  setPhotoError(false);
                                  setPopupMessage("");
                                }
                              }}
                              className="flex cursor-pointer items-start justify-between p-3.5 gap-3"
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded border ${
                                    wantsPhoto
                                      ? "border-[#798321] bg-[#798321] text-white dark:border-[#FFC107] dark:bg-[#FFC107] dark:text-black"
                                      : "border-slate-300 dark:border-neutral-700"
                                  }`}
                                >
                                  {wantsPhoto && <Check size={12} />}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                                    <ImageIcon size={14} className="text-[#798321] dark:text-[#FFC107]" />
                                    Attach Photo on Packing
                                  </span>
                                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                    We print your uploaded photo on a custom sticker affixed to every food or gift box distributed to beneficiaries (e.g. Birthday, Memorial, or Family tribute).
                                  </p>
                                </div>
                              </div>

                              {/* Small sample image on top of price - Clickable for preview */}
                              <div className="flex flex-col items-end shrink-0 gap-1">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSamplePhotoModal(true);
                                  }}
                                  className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl border border-slate-200/80 shadow-xs dark:border-neutral-700 bg-white cursor-pointer group/preview hover:scale-105 hover:ring-2 hover:ring-[#798321] dark:hover:ring-[#FFC107] transition-all"
                                  title="Click to view sample photo on packaging"
                                >
                                  <Image
                                    src="/images/packing-photo-sample.jpg"
                                    alt="Sample Photo on Packing"
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <Search size={14} />
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#798321] dark:text-[#FFC107] whitespace-nowrap">
                                  + ₹{addonPrices.photoCost}/member
                                </span>
                              </div>
                            </div>

                            {wantsPhoto && (
                              <div className="border-t border-slate-200/50 px-3.5 pb-3.5 pt-2.5 dark:border-neutral-800 space-y-2.5">
                                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-[11px] font-medium text-amber-900 dark:text-amber-200">
                                  <Sparkles size={13} className="text-[#FFC107] shrink-0" />
                                  <span>Upload any photo you want printed on the meal/package label (e.g., photo of birthday person, couple, or family member).</span>
                                </div>
                                
                                <label className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-3 cursor-pointer transition ${
                                  photoError && !photoFile
                                    ? "border-rose-400 bg-rose-50/60 dark:border-rose-500/70 dark:bg-rose-950/20"
                                    : "border-slate-300 bg-white hover:bg-slate-50 dark:border-neutral-700 dark:bg-black"
                                }`}>
                                  <Upload size={16} className={photoError && !photoFile ? "text-rose-500 mb-1" : "text-slate-400 mb-1"} />
                                  <span className={`text-xs font-medium ${photoError && !photoFile ? "text-rose-600 dark:text-rose-400 font-semibold" : "text-slate-600 dark:text-neutral-300"}`}>
                                    {photoFile ? photoFile.name : "Choose an image file (JPG, PNG)"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoSelect}
                                    className="hidden"
                                  />
                                </label>

                                {/* Added under image box itself */}
                                {!photoFile ? (
                                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] transition ${
                                    photoError
                                      ? "bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-300 font-bold"
                                      : "bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
                                  }`}>
                                    <AlertCircle size={13} className={photoError ? "text-rose-500 shrink-0" : "text-slate-400 shrink-0"} />
                                    <span>
                                      {photoError
                                        ? "Photo required: please upload a photo above or uncheck this option."
                                        : "Please upload a photo, or uncheck the option to proceed without photo."}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-2 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                                    <img
                                      src={photoPreview || ""}
                                      alt="Preview"
                                      className="h-11 w-11 rounded-lg object-cover border border-emerald-300 dark:border-emerald-700"
                                    />
                                    <div>
                                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block">
                                        ✓ Photo ready for sticker print
                                      </span>
                                      <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                                        Will be affixed to all {personCount} packages
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Option 2: Request Celebration Video */}
                          <div
                            className={`rounded-2xl border transition-colors ${
                              wantsVideo
                                ? "border-[#798321] bg-[#798321]/5 dark:border-[#FFC107] dark:bg-[#FFC107]/5"
                                : "border-slate-200 bg-white dark:border-neutral-800 dark:bg-[#121212]"
                            }`}
                          >
                            <div
                              onClick={() => setWantsVideo(!wantsVideo)}
                              className="flex cursor-pointer items-start justify-between p-3.5"
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded border ${
                                    wantsVideo
                                      ? "border-[#798321] bg-[#798321] text-white dark:border-[#FFC107] dark:bg-[#FFC107] dark:text-black"
                                      : "border-slate-300 dark:border-neutral-700"
                                  }`}
                                >
                                  {wantsVideo && <Check size={12} />}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                                    <Video size={14} className="text-[#798321] dark:text-[#FFC107]" />
                                    Request Celebration Video
                                  </span>
                                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                    Our team will record a video clip of your sponsored celebration and share it directly with you.
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#798321] dark:text-[#FFC107] shrink-0 ml-2 whitespace-nowrap">
                                + ₹{addonPrices.videoCost} (One-time)
                              </span>
                            </div>
                          </div>

                          {/* Option 3: Custom Dedication Label on Box */}
                          <div
                            className={`rounded-2xl border transition-colors ${
                              wantsText
                                ? "border-[#798321] bg-[#798321]/5 dark:border-[#FFC107] dark:bg-[#FFC107]/5"
                                : "border-slate-200 bg-white dark:border-neutral-800 dark:bg-[#121212]"
                            }`}
                          >
                            <div
                              onClick={() => setWantsText(!wantsText)}
                              className="flex cursor-pointer items-start justify-between p-3.5"
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className={`flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded border ${
                                    wantsText
                                      ? "border-[#798321] bg-[#798321] text-white dark:border-[#FFC107] dark:bg-[#FFC107] dark:text-black"
                                      : "border-slate-300 dark:border-neutral-700"
                                  }`}
                                >
                                  {wantsText && <Check size={12} />}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                    Custom Dedication Label on Box
                                  </span>
                                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                    Print donor/family name and a custom blessing or occasion message directly on the package.
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#798321] dark:text-[#FFC107] shrink-0 ml-2 whitespace-nowrap">
                                + ₹{addonPrices.textCost}/member
                              </span>
                            </div>

                            {wantsText && (
                              <div className="border-t border-slate-200/50 px-3.5 pb-3.5 pt-2 dark:border-neutral-800 space-y-2">
                                <input
                                  type="text"
                                  placeholder="Name to print (e.g. S. Ramesh & Family)"
                                  value={packingLabelName}
                                  onChange={(e) => setPackingLabelName(e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-neutral-700 dark:bg-black dark:text-white focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Short wish (e.g. With love from Grandchildren)"
                                  value={packingLabelDesc}
                                  onChange={(e) => setPackingLabelDesc(e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-neutral-700 dark:bg-black dark:text-white focus:outline-none"
                                />
                              </div>
                            )}
                          </div>

                          {/* Option 4: Extra Celebration Gifts */}
                          {dropdownItems.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-[#121212] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                  Extra Celebration Gifts (Optional)
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {selectedItems.length} selected
                                </span>
                              </div>

                              {addonPrices.extras.length > 4 && (
                                <div className="relative">
                                  <Search
                                    size={13}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Search add-ons..."
                                    value={dropdownSearch}
                                    onChange={(e) => setDropdownSearch(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:outline-none dark:bg-black dark:text-white border border-slate-200 dark:border-neutral-800"
                                  />
                                </div>
                              )}

                              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                                {dropdownItems.map((item) => {
                                  const isSelected = selectedItems.includes(item.id);
                                  return (
                                    <div
                                      key={item.id}
                                      onClick={() => toggleItemSelection(item.id)}
                                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors border ${
                                        isSelected
                                          ? "border-[#798321] bg-[#798321]/10 dark:border-[#FFC107] dark:bg-[#FFC107]/10"
                                          : "border-slate-100 hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
                                            isSelected
                                              ? "border-[#798321] bg-[#798321] text-white dark:border-[#FFC107] dark:bg-[#FFC107] dark:text-black"
                                              : "border-slate-300 dark:border-neutral-600"
                                          }`}
                                        >
                                          {isSelected && <Check size={10} />}
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-neutral-200">
                                          {item.title}
                                        </span>
                                      </div>
                                      <span className="font-bold text-[#798321] dark:text-[#FFC107]">
                                        + ₹{item.cost}/member
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── 4. LIVE PRICE BREAKDOWN ── */}
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-[#141414] dark:border-neutral-800 space-y-2.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    <span className="truncate pr-2">
                      {cause?.title || cause?.name || "Initiative Sponsorship"}: ₹{baseCostPerPerson} × {personCount}
                    </span>
                    <span className="shrink-0 font-bold">
                      ₹{(baseCostPerPerson * personCount).toLocaleString()}
                    </span>
                  </div>

                  {/* Selected Sub-Item Add-ons Breakdown */}
                  {selectedSubAddons.map((addonId) => {
                    const addon = subItemAddons.find((a) => a.id === addonId);
                    if (!addon) return null;
                    return (
                      <div key={addon.id} className="flex justify-between text-xs text-slate-700 dark:text-neutral-300">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                          <Gift size={11} className="text-[#798321] dark:text-[#FFC107] shrink-0" />
                          <span>Add-on: {addon.title} (₹{addon.cost} × {personCount})</span>
                        </span>
                        <span className="shrink-0 font-semibold">
                          ₹{(addon.cost * personCount).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}

                  {wantsPhoto && (
                    <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400">
                      <span>Packing Photo: ₹{photoUnitCost} × {personCount}</span>
                      <span>₹{(photoUnitCost * personCount).toLocaleString()}</span>
                    </div>
                  )}

                  {wantsText && (
                    <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400">
                      <span>Dedication Label: ₹{textUnitCost} × {personCount}</span>
                      <span>₹{(textUnitCost * personCount).toLocaleString()}</span>
                    </div>
                  )}

                  {extrasUnitCost > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400">
                      <span>Selected Extras: ₹{extrasUnitCost} × {personCount}</span>
                      <span>₹{(extrasUnitCost * personCount).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-2.5 dark:border-neutral-700 space-y-1.5">
                    {wantsVideo && (
                      <div className="flex justify-between text-xs font-medium text-purple-700 dark:text-purple-400">
                        <span>Celebration Video Request (One-time):</span>
                        <span className="font-bold">+ ₹{videoFlatCost.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Total Payable
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {wantsVideo
                            ? `(₹${membersTotalCost.toLocaleString()} donation + ₹${videoFlatCost} video)`
                            : `(₹${perMemberSubtotal}/person × ${personCount} members)`}
                        </span>
                      </div>
                      <span className="text-2xl font-extrabold text-[#798321] dark:text-[#FFC107]">
                        ₹{finalCalculatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-3.5 text-xs font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 dark:text-black"
                >
                  <Heart size={16} fill="currentColor" />
                  <span>
                    {submitting
                      ? "Opening Razorpay..."
                      : `Pay ₹${finalCalculatedTotal.toLocaleString()} with Razorpay`}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* ── POST-PAYMENT SUCCESS & MANDATORY CONDITIONS POPUP WITH HEARTFELT THANK YOU ── */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-[#111] border border-slate-200 dark:border-neutral-800 space-y-6"
            >
              {/* Top Payment Success Indicator */}
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle size={30} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Payment Successful!
                </h3>
              </div>

              {/* Heartfelt Thank You Card for the Donor */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-amber-50/40 to-slate-50 p-5 border border-emerald-200/80 dark:from-emerald-950/40 dark:via-neutral-900 dark:to-neutral-900 dark:border-emerald-800/40 text-center space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[11px] font-bold">
                  <Heart size={13} className="fill-rose-500 text-rose-500" />
                  Thank You For Your Kindness &amp; Donation
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Thank You, {completedDonationData?.donorName || "Generous Donor"}!
                </h4>

                <p className="text-xs text-slate-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Your generous contribution of{" "}
                  <span className="font-bold text-[#798321] dark:text-[#FFC107]">
                    ₹{completedDonationData?.amount?.toLocaleString()}
                  </span>{" "}
                  sponsoring{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {completedDonationData?.personCount} member(s)
                  </span>{" "}
                  has been received with deep gratitude. Your selfless support brings real nutrition, hope, and smiles to those who need it most.
                </p>

                <p className="text-[11px] text-slate-400 dark:text-neutral-500 italic">
                  A digital confirmation has been logged under our public donor registry.
                </p>
              </div>

              {/* 3 Important Fulfillment Conditions */}
              <div className="rounded-2xl bg-amber-50/80 p-4 sm:p-5 border border-amber-200/80 dark:bg-[#18150c] dark:border-amber-900/50 space-y-4">
                <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2">
                  <AlertCircle size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Important Fulfillment Conditions
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700 dark:text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/70 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 font-bold text-[10px] mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <PhoneOff size={13} className="text-rose-500" />
                        Do Not Directly Call Field Coordinators
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Our volunteers are actively on the ground executing distributions. Please refrain from calling during live distribution hours as it disrupts on-site logistics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/70 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 font-bold text-[10px] mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-600 dark:text-amber-400" />
                        Photos &amp; Video Delivery Timeline
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Distribution proofs and requested celebration videos are compiled following the event and delivered to your registered contact within <strong>24 to 48 hours</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/70 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 font-bold text-[10px] mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                        Tracking &amp; Proof Verification
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Every sponsorship is accounted for with 100% item-level transparency. Your record is permanently logged in our foundation registry once verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] py-3 text-xs font-bold text-black shadow-md transition-transform hover:opacity-95 active:scale-95"
                >
                  I Understand &amp; Agree
                </button>
                <Link
                  href="/foundation/causes"
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 py-3 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 transition"
                >
                  Return to Causes
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Concise Floating Popup / Toast */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black shadow-2xl border border-slate-700 dark:border-neutral-200 text-xs font-semibold max-w-[92vw] sm:max-w-md"
          >
            <div className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle size={13} />
            </div>
            <span className="flex-1 leading-snug">{popupMessage}</span>
            <button
              type="button"
              onClick={() => setPopupMessage("")}
              className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 text-slate-400 hover:text-white dark:hover:text-black shrink-0 transition"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Packaging Photo Preview Modal */}
      <AnimatePresence>
        {showSamplePhotoModal && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setShowSamplePhotoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white dark:bg-[#111] rounded-3xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-[#798321] dark:bg-[#FFC107]/15 dark:text-[#FFC107] flex items-center justify-center">
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Sample Photo on Packaging
                    </h3>
                    <p className="text-[10px] text-slate-400">Custom Printed Sticker Example</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSamplePhotoModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* High-Res Image Preview */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-700 bg-slate-100 dark:bg-black shadow-inner">
                <Image
                  src="/images/packing-photo-sample.jpg"
                  alt="Sample Photo on Packaging Preview"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="rounded-xl bg-amber-500/10 p-3 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>How it works:</strong> When you upload a photo (e.g. birthday person, tribute, or family portrait), our team prints high-gloss custom sticker labels and affixes one to every sponsored food or gift package distributed to beneficiaries.
              </div>

              <button
                type="button"
                onClick={() => setShowSamplePhotoModal(false)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black text-xs font-bold transition shadow-sm"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
        </div>
      }
    >
      <DonateContent />
    </Suspense>
  );
}