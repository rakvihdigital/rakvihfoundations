"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { Users, CheckCircle, ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
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

function VolunteerFormContent() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    streetAddress: "",
    city: "",
    activeBloodDonor: "No",
    password: "",
    confirmPassword: "",
    volunteerType: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const { error: insertError } = await supabase.from("volunteers").insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          dob: formData.dob,
          blood_group: formData.bloodGroup,
          street_address: formData.streetAddress,
          city: formData.city,
          active_blood_donor: formData.activeBloodDonor,
          password: formData.password, // In production, hash this password securely
          volunteer_type: formData.volunteerType,
        },
      ]);

      if (insertError) {
        throw new Error(insertError.message || "Failed to register volunteer.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        gender: "",
        dob: "",
        bloodGroup: "",
        streetAddress: "",
        city: "",
        activeBloodDonor: "No",
        password: "",
        confirmPassword: "",
        volunteerType: "",
      });
    } catch (err: any) {
      console.error("Volunteer registration error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-black pb-20 transition-colors duration-500 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      
      {/* Header Section */}
      <section className="relative overflow-hidden pt-24 pb-16 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center gap-2 mb-4">
           
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Join Our Community
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-3">
            Become a <span className="text-[#FFC107]">Volunteer</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 dark:text-neutral-300 leading-relaxed">
            Register today to lend your time, skills, and passion to make a lasting difference in society.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
          
          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registration Successful!</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
                Thank you for registering as a volunteer with RAKVIH Foundation. Our team will get in touch with you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 rounded-xl bg-[#798321] px-6 py-2.5 text-xs font-semibold text-white shadow-md dark:bg-[#FFC107] dark:text-black"
              >
                Register Another Volunteer
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Your Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Phone *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-xs font-bold text-slate-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="9876543210"
                      className="w-full rounded-r-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Email address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  >
                    <option value="" disabled className="dark:bg-[#171717]">Select your gender</option>
                    <option value="Male" className="dark:bg-[#171717]">Male</option>
                    <option value="Female" className="dark:bg-[#171717]">Female</option>
                    <option value="Other" className="dark:bg-[#171717]">Other</option>
                  </select>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    DOB *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  >
                    <option value="" disabled className="dark:bg-[#171717]">Select your blood group</option>
                    <option value="A+" className="dark:bg-[#171717]">A+</option>
                    <option value="A-" className="dark:bg-[#171717]">A-</option>
                    <option value="B+" className="dark:bg-[#171717]">B+</option>
                    <option value="B-" className="dark:bg-[#171717]">B-</option>
                    <option value="AB+" className="dark:bg-[#171717]">AB+</option>
                    <option value="AB-" className="dark:bg-[#171717]">AB-</option>
                    <option value="O+" className="dark:bg-[#171717]">O+</option>
                    <option value="O-" className="dark:bg-[#171717]">O-</option>
                  </select>
                </div>

                {/* Street address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Street address *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    required
                    placeholder="House/Flat no, Street, Area"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  />
                </div>

                {/* Town / City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter your town or city"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  />
                </div>

                {/* Would you like to be an active blood donor? */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Would you like to be an active blood donor?
                  </label>
                  <select
                    name="activeBloodDonor"
                    value={formData.activeBloodDonor}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  >
                    <option value="Yes" className="dark:bg-[#171717]">Yes</option>
                    <option value="No" className="dark:bg-[#171717]">No</option>
                  </select>
                </div>

                {/* Volunteer Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Volunteer Type *
                  </label>
                  <select
                    name="volunteerType"
                    value={formData.volunteerType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  >
                    <option value="" disabled className="dark:bg-[#171717]">Select Volunteer Type</option>
                    <option value="Individual Volunteer" className="dark:bg-[#171717]">Individual Volunteer</option>
                    <option value="NGO" className="dark:bg-[#171717]">NGO</option>
                    <option value="Institution" className="dark:bg-[#171717]">Institution</option>
                  </select>
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 pr-10 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 pr-10 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 dark:text-black"
                >
                  <Users size={18} />
                  <span>{submitting ? "Submitting Registration..." : "Join Now"}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
}

export default function VolunteerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
      </div>
    }>
      <VolunteerFormContent />
    </Suspense>
  );
}