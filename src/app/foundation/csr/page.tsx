"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Handshake,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";

const csrPartners = [
  {
    company: "Hyundai Glovis India",
    focus: "Healthcare Infrastructure",
    description: "Supplied critical medical equipment worth Rs. 50L+ to government primary healthcare units during critical times to protect vulnerable populations.",
    impact: "3 Government Healthcare Units Upgraded",
  },
  {
    company: "Zee Entertainment Group",
    focus: "Combating Hunger",
    description: "Partnered in a powerful CSR initiative to distribute freshly prepared food parcels to marginalized and vulnerable communities across urban centers.",
    impact: "4,900+ Fresh Food Parcels Delivered",
  },
  {
    company: "Flex Foundation",
    focus: "Environmental Sustainability",
    description: "Collaborated on a major lake restoration and community ecosystem revival project, establishing green walking tracks and community hubs.",
    impact: "Rs. 85L+ Environmental Project",
  },
  {
    company: "Salesforce / Conga",
    focus: "Frontline Protection",
    description: "Stepped up to protect frontline healthcare workers and community volunteers by sponsoring high-grade safety and medical kits.",
    impact: "500+ Essential PPE & Safety Kits",
  },
];

const complianceBadges = [
  { title: "80G Certified", desc: "Tax exemption benefits available for corporate donors." },
  { title: "12A Registered", desc: "Complete legal transparency and statutory compliance." },
  { title: "CSR-1 Form Compliant", desc: "Eligible to receive direct corporate social responsibility funds." },
  { title: "100% Transparent", desc: "End-to-end photo logs, utilization reports, and auditing." },
];

export default function CSRPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Field States
  const [formData, setFormData] = useState({
    contact_name: "",
    company_name: "",
    email: "",
    phone: "",
    focus_area: "Hunger Relief & Meal Distribution",
    project_details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/csr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit proposal.");
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
      
      {/* ============ HIGHLY ANIMATED BANNER ============ */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-zinc-950 dark:to-black">
        {/* Animated Orbs */}
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
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Corporate Social Responsibility
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Partner With RAKVIH,{" "}
            <span className="bg-gradient-to-r from-[#FFC107] via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Drive Meaningful Impact
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base"
          >
            We collaborate with forward-thinking enterprises to execute high-impact CSR initiatives in healthcare, hunger relief, education, and environmental sustainability.
          </motion.p>

          {/* Mini Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { icon: ShieldCheck, title: "CSR-1 Compliant", desc: "Fully registered to receive legal corporate funds." },
              { icon: Handshake, title: "Strategic Alignment", desc: "Customized projects matching your brand goals." },
              { icon: FileCheck2, title: "Complete Reporting", desc: "Detailed audit logs, metrics, and media proof." },
            ].map((item) => (
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

      {/* ============ COMPLIANCE BAR ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {complianceBadges.map((badge, idx) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl border border-slate-900/10 bg-white p-5 shadow-md dark:border-white/10 dark:bg-black"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#24310F] dark:text-white">{badge.title}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ============ CSR PROPOSAL / PARTNERSHIP FORM ============ */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-900/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-black sm:p-10"
        >
          <div className="text-center max-w-lg mx-auto mb-8">
            <h3 className="text-xl font-bold text-[#24310F] dark:text-white sm:text-2xl">
              Initiate a Corporate Partnership
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Are you looking to channel your corporate social responsibility funds effectively? Fill out the form below and our institutional partnership desk will connect with you.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                <Send className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-[#24310F] dark:text-white">
                Proposal Request Received & Saved!
              </h4>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Thank you for reaching out. Our corporate relations team has received your details and will send our formal CSR portfolio & proposal within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-xs font-semibold text-[#798321] underline underline-offset-4 dark:text-[#FFC107]"
              >
                Submit another inquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-2xl bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 text-center">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Contact Person Name
                  </label>
                  <input
                    required
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Company / Organization Name
                  </label>
                  <input
                    required
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter corporate name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Corporate Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Phone / Mobile Number
                  </label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Area of Interest / Focus
                </label>
                <select
                  name="focus_area"
                  value={formData.focus_area}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option>Hunger Relief & Meal Distribution</option>
                  <option>Healthcare & Medical Infrastructure</option>
                  <option>Lake Restoration & Environmental Sustainability</option>
                  <option>Child Education & Care Kits</option>
                  <option>Custom CSR Project</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Project / Partnership Details
                </label>
                <textarea
                  required
                  rows={4}
                  name="project_details"
                  value={formData.project_details}
                  onChange={handleChange}
                  placeholder="Share details about your expected scale, timeline, or budgetary goals..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs outline-none ring-[#798321]/30 transition focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#798321] to-[#24310F] py-3.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] sm:w-auto sm:px-8 dark:from-[#798321] dark:to-zinc-800 mx-auto disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Submit CSR Proposal Request
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}