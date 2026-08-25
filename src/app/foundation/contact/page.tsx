"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Globe2,
  Loader2,
} from "lucide-react";

// ── SEO copy (per RAKVIH SEO Content Pack, Section 12 — /foundation/contact) ──
const SEO_TITLE = "Contact RAKVIH Foundation | Bengaluru NGO";
const SEO_DESCRIPTION =
  "Reach RAKVIH Foundation for donations, volunteering or CSR partnerships. Call 85499 42525 or email rakvihfoundation@gmail.com. Response within 24–48 hours.";
const CANONICAL_URL = "https://www.rakvihfoundation.org.in/foundation/contact";

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "rakvihfoundation@gmail.com",
    href: "mailto:rakvihfoundation@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "85499 42525",
    href: "tel:+918549942525",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Attur Layout, Yelahanka, Bengaluru, Karnataka 560064",
    href: "https://maps.google.com/?q=Attur+Layout+Yelahanka+Bengaluru+Karnataka+560064",
  },
];

const reasons = ["Donation Query", "Volunteer With Us", "Partnership / CSR", "Media & Press", "Something Else"];

const bannerHighlights = [
  { icon: HeartHandshake, title: "100% Impact Driven", desc: "Every rupee goes directly to community care." },
  { icon: ShieldCheck, title: "Direct Verification", desc: "Complete transparency with photo logs." },
  { icon: Globe2, title: "Active Community", desc: "Building sustainable long-term futures." },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeReason, setActiveReason] = useState(reasons[0]);

  // Form Field States
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Set document title + meta description since this is a client component
  // and can't use Next.js's `metadata` export directly.
  useEffect(() => {
    document.title = SEO_TITLE;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", SEO_DESCRIPTION);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL_URL);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_type: activeReason,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8FAF0] text-slate-900 dark:bg-black dark:text-slate-100">
      
      {/* ============ HIGHLY ANIMATED INTERACTIVE BANNER ============ */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-zinc-950 dark:to-black">
        {/* Animated Background Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#798321]/30 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FFC107]/20 blur-[120px] pointer-events-none"
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> RAKVIH Foundation Helpdesk
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Let's Build Hope Together,{" "}
            <span className="bg-gradient-to-r from-[#FFC107] via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Reach Out Today
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base"
          >
            Have a question about volunteering, corporate partnerships, or making a donation? Connect directly with our core team—no bots, just real humans ready to help.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {bannerHighlights.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md shadow-xl"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFC107]/20 text-[#FFC107]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">{item.title}</h4>
                  <p className="mt-0.5 text-[11px] text-slate-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr] lg:gap-8">
          
          {/* LEFT: Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="h-fit overflow-hidden rounded-3xl border border-slate-900/10 bg-white shadow-xl dark:border-white/10 dark:bg-black"
          >
            <div className="bg-gradient-to-r from-[#798321]/10 to-[#FFC107]/10 px-6 py-5 border-b border-slate-100 dark:border-zinc-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#798321] dark:text-[#FFC107]">
                Official Helpdesk
              </p>
              <p className="mt-0.5 text-base font-bold text-[#24310F] dark:text-white">
                RAKVIH Foundation
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {contactDetails.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.label === "Address" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] transition-all group-hover:bg-[#798321] group-hover:text-white dark:bg-[#FFC107]/10 dark:text-[#FFC107] dark:group-hover:bg-[#FFC107] dark:group-hover:text-black">
                    <c.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {c.label}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold leading-relaxed text-[#24310F] dark:text-white">
                      {c.value}
                    </p>
                  </div>
                </a>
              ))}

              <div className="flex items-start gap-3.5 px-6 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Response Time
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-[#24310F] dark:text-white">
                    Within 24–48 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-zinc-950">
              <a
                href="https://wa.me/918549942525"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Instantly on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* RIGHT: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-900/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-black sm:p-8"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#24310F] dark:text-white">
                  Message Sent & Saved Successfully!
                </h3>
                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Thank you for reaching out. Our support team will review your note and respond within 24–48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-xs font-semibold text-[#798321] underline underline-offset-4 dark:text-[#FFC107]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="rounded-2xl bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 text-center">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What's this inquiry regarding?
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setActiveReason(r)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          activeReason === r
                            ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-slate-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </label>
                    <input
                      required
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write details about your query..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#798321] to-[#24310F] py-3.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] sm:w-auto sm:px-8 dark:from-[#798321] dark:to-zinc-800 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============ EMBEDDED MAP ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-slate-900/10 shadow-xl dark:border-white/10 dark:bg-black"
        >
          <iframe
            title="RAKVIH Foundation location"
            src="https://www.google.com/maps?q=Attur+Layout,+Yelahanka,+Bengaluru,+Karnataka+560064&output=embed"
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </section>
    </div>
  );
}