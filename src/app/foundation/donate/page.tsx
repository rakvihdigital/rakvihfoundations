"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import { Heart, Sparkles, CheckCircle, ArrowLeft, Users, Plus, Minus, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

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

function DonateContent() {
  const searchParams = useSearchParams();
  const causeId = searchParams.get("cause") || "1";

  const [cause, setCause] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [personCount, setPersonCount] = useState<number>(1);
  const [amount, setAmount] = useState<string>("100");
  
  const [donationDate, setDonationDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const [dedicationType, setDedicationType] = useState<string>("General Donation");
  
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    async function fetchCauseAndDonations() {
      try {
        setLoading(true);

        const { data: causeData } = await supabase
          .from("cause_items")
          .select("*")
          .eq("id", causeId)
          .single();

        if (causeData) {
          setCause(causeData);
          const baseCost = causeData.cost || 100;
          setAmount(String(baseCost * personCount));
        }

        const { data: donationData } = await supabase
          .from("donations")
          .select("*")
          .eq("cause_id", causeId)
          .order("created_at", { ascending: false });

        if (donationData) {
          setDonations(donationData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (causeId) {
      fetchCauseAndDonations();
    }
  }, [causeId]);

  const handlePersonCountChange = (newCount: number) => {
    const count = isNaN(newCount) || newCount < 1 ? 1 : newCount;
    setPersonCount(count);
    const baseCost = cause?.cost || 100;
    setAmount(String(baseCost * count));
  };

  const handlePaymentCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) return;

    try {
      setSubmitting(true);
      const donationAmount = parseFloat(amount);

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create payment order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Foundation Donation",
        description: `Support for ${cause?.title || cause?.name || "Cause"}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const { error: insertError } = await supabase.from("donations").insert([
              {
                cause_id: parseInt(causeId as string),
                donor_name: donorName,
                donor_image: "",
                amount: donationAmount,
                message: donorMessage || `Sponsoring ${personCount} person(s)`,
                donation_date: donationDate,
                dedication_type: dedicationType,
              },
            ]);

            if (insertError) {
              console.error("Database save error details:", JSON.stringify(insertError, null, 2));
              alert(`Payment successful, but database save failed: ${insertError.message || JSON.stringify(insertError)}`);
              return;
            }

            setSuccess(true);
            setDonorName("");
            setDonorMessage("");
            setDedicationType("General Donation");
            setPersonCount(1);

            const { data: refreshedDonations } = await supabase
              .from("donations")
              .select("*")
              .eq("cause_id", causeId)
              .order("created_at", { ascending: false });

            if (refreshedDonations) setDonations(refreshedDonations);
          } catch (dbErr: any) {
            console.error("Database save error exception:", dbErr);
            alert("Payment successful, but failed to log record in database.");
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: donorName,
        },
        theme: {
          color: "#798321",
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment initialization error:", err);
      alert("Could not start payment gateway. Please check your keys.");
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

  const costPerPerson = cause?.cost || 100;
  const displayImage = cause?.image_url || cause?.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-black pb-20 transition-colors duration-500 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      
      {/* Header Section */}
      <section className="relative overflow-hidden pt-24 pb-16 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center gap-2 mb-4">
            <Link href="/foundation/causes" className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFC107] hover:underline">
              <ArrowLeft size={14} /> Back to All Causes
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Secure Razorpay Checkout
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-3">
            Support Initiative: <span className="text-[#FFC107]">{cause?.title || cause?.name || "Vital Cause"}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 dark:text-neutral-300 leading-relaxed">
            Your generous contribution makes a direct and meaningful impact. Choose your person count, select your preferred date, and empower lives today.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <div className="relative h-64 w-full">
                <Image src={displayImage} alt="Cause Image" fill className="object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{cause?.title || cause?.name}</h2>
                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  {cause?.description || "Every contribution brings us closer to fulfilling our mission and providing essential support to those in need. Thank you for being a part of this journey."}
                </p>
                
                <div className="flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-[#171717] p-4 border border-amber-200/60 dark:border-neutral-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-500 dark:text-neutral-400">Cost Per Person / Unit</p>
                    <p className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">₹{Number(costPerPerson).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Supporters Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart size={18} className="text-rose-500" /> Recent Supporters ({donations.length})
              </h3>

              {donations.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-neutral-500 py-6 text-center">Be the first generous donor to support this cause!</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {donations.map((item) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#171717] border border-slate-100 dark:border-neutral-800 hover:border-[#798321]/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">{item.donor_name}</span>
                          {item.dedication_type && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#798321] dark:text-[#FFC107] bg-amber-50 dark:bg-[#0a0a0a] px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-neutral-800">
                              <Tag size={10} /> {item.dedication_type}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-900/40">
                            <Calendar size={10} /> {item.donation_date || 'Recent'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 italic">"{item.message || 'Supporting the cause'}"</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-extrabold text-[#798321] dark:text-[#FFC107]">₹{Number(item.amount).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Make a Contribution</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mb-6">Select your person count, choose your dedication, and pay securely.</p>

              {success ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Payment Successful!</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">Your contribution has been securely processed and recorded.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 rounded-xl bg-[#798321] px-6 py-2.5 text-xs font-semibold text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                  >
                    Make Another Donation
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handlePaymentCheckout} className="space-y-5">
                  
                  {/* Person Count Selector with Direct Input & Quick Presets */}
                  <div className="rounded-2xl bg-slate-50 dark:bg-[#171717] p-4 border border-slate-200 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Select Number of Persons</span>
                      <span className="text-xs font-bold text-[#798321] dark:text-[#FFC107]">{personCount} Person(s)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handlePersonCountChange(personCount - 1)}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm border border-slate-200 dark:bg-[#0a0a0a] dark:text-white dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={personCount}
                        onChange={(e) => handlePersonCountChange(parseInt(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-center font-bold text-base text-slate-900 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white"
                      />

                      <button
                        type="button"
                        onClick={() => handlePersonCountChange(personCount + 1)}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm border border-slate-200 dark:bg-[#0a0a0a] dark:text-white dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                  </div>

                  {/* Dedication Type Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Tag size={14} className="text-[#798321] dark:text-[#FFC107]" /> What are you dedicating this to?
                    </label>
                    <select
                      value={dedicationType}
                      onChange={(e) => setDedicationType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-bold text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    >
                      <option value="General Donation" className="dark:bg-[#171717]">General Donation</option>
                      <option value="Birthday" className="dark:bg-[#171717]">Birthday</option>
                      <option value="Anniversary" className="dark:bg-[#171717]">Anniversary</option>
                      <option value="In Memory of a Loved One" className="dark:bg-[#171717]">In Memory of a Loved One</option>
                      <option value="Festival / Celebration" className="dark:bg-[#171717]">Festival / Celebration</option>
                      <option value="Wedding" className="dark:bg-[#171717]">Wedding</option>
                    </select>
                  </div>

                  {/* Donation Date Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#798321] dark:text-[#FFC107]" /> Select Donation Date
                    </label>
                    <input
                      type="date"
                      value={donationDate}
                      onChange={(e) => setDonationDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-bold text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    />
                  </div>

                  {/* Custom Editable Amount Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Custom / Final Total Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-bold text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Encouraging Message (Optional)</label>
                    <textarea
                      placeholder="Leave a warm word or dedication..."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 dark:text-black"
                  >
                    <Heart size={16} fill="currentColor" />
                    <span>{submitting ? "Opening Razorpay..." : `Pay ₹${Number(amount || 0).toLocaleString()} with Razorpay`}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
      </div>
    }>
      <DonateContent />
    </Suspense>
  );
}