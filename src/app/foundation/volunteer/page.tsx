"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { Users, CheckCircle, ArrowLeft, Sparkles, Eye, EyeOff, LogIn, Upload } from "lucide-react";
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

// ── SEO copy (per RAKVIH SEO Content Pack, Section 12 — /foundation/volunteer) ──
const SEO_TITLE = "Become a Volunteer in Bengaluru | RAKVIH Foundation";
const SEO_DESCRIPTION =
  "Give your time, not just your money. Join RAKVIH Foundation volunteers distributing meals, supporting children's education and running tree-planting drives.";
const CANONICAL_URL = "https://www.rakvihfoundation.org.in/foundation/volunteer";

function VolunteerFormContent() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Registration State
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

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      
      let profile_image_url = null;

      // 1. Upload Image to Supabase Storage (if selected)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        // Ensure you have created a public bucket named 'avatars' in Supabase
        const { error: uploadError } = await supabase.storage
          .from("avatars") 
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        // 2. Get Public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        profile_image_url = publicUrlData.publicUrl;
      }

      // 3. Insert into Database
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
          profile_image_url: profile_image_url,
        },
      ]);

      if (insertError) {
        throw new Error(insertError.message || "Failed to register volunteer.");
      }

      setSuccess(true);
      // Reset all states
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
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Volunteer registration error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("email", loginEmail)
        .eq("password", loginPassword)
        .single();

      if (error || !data) {
        throw new Error("Invalid email or password.");
      }

      // --- ADMIN APPROVAL CHECK ---
      if (data.status === "pending") {
        throw new Error("Your account is pending admin approval. We will notify you once approved.");
      }
      
      if (data.status === "rejected") {
        throw new Error("Your volunteer application was not approved.");
      }
      // --------------------------------

      // --- SAVE SESSION & REDIRECT ---
      localStorage.setItem("rakvih_volunteer_id", data.id);
      localStorage.setItem("rakvih_volunteer_name", data.name);
      router.push("/foundation/volunteer/dashboard");
      // -------------------------------

      setSuccess(true);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: any) {
      console.error("Volunteer login error:", err);
      setLoginError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage("");
    setLoginError("");
    setSuccess(false);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-black pb-20 transition-colors duration-500 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      
      {/* Header Section */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
        
        {/* Top Right Toggle Button */}
        <div className="absolute top-24 right-4 z-20 sm:right-8 lg:right-12">
          <button
            type="button"
            onClick={toggleMode}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 hover:text-[#FFC107] dark:bg-white/10 dark:hover:bg-white/20"
          >
            {isLoginMode ? (
              <><Users size={15} /> New here? Register</>
            ) : (
              <><LogIn size={15} /> Already a volunteer? Login</>
            )}
          </button>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Join Our Community
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-3">
            {isLoginMode ? (
              <>Volunteer <span className="text-[#FFC107]">Login</span></>
            ) : (
              <>Become a <span className="text-[#FFC107]">Volunteer</span></>
            )}
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 dark:text-neutral-300 leading-relaxed">
            {isLoginMode 
              ? "Welcome back! Please log in to manage your volunteer activities and see upcoming events."
              : "Give your time, not just your money. Join RAKVIH Foundation volunteers in Bengaluru distributing meals, supporting children's education, and running tree-planting drives across local communities."}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
          
          {/* Static Form Header */}
          {!success && (
            <div className="mb-8 border-b border-slate-100 pb-4 dark:border-neutral-900">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isLoginMode ? "Welcome Back" : "Register Details"}
              </h2>
            </div>
          )}

          {success && !isLoginMode ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Registration Successful!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
                Thank you for registering as a volunteer with RAKVIH Foundation. Our team will get in touch with you shortly.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setIsLoginMode(false);
                }}
                className="mt-4 rounded-xl bg-[#798321] px-6 py-2.5 text-xs font-semibold text-white shadow-md dark:bg-[#FFC107] dark:text-black"
              >
                Register Another Volunteer
              </button>
            </motion.div>
          ) : isLoginMode ? (
            // ================= LOGIN FORM =================
            <form onSubmit={handleLoginSubmit} className="space-y-6 max-w-md mx-auto">
              
              {loginError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
                  {loginError}
                </div>
              )}

              {/* Email address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Email address *
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 dark:text-black"
                >
                  <LogIn size={18} />
                  <span>{submitting ? "Logging In..." : "Login"}</span>
                </button>
              </div>

            </form>
          ) : (
            // ================= REGISTRATION FORM =================
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Profile Image Upload */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#798321] dark:border-[#FFC107]">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 border border-dashed border-slate-300 dark:border-neutral-700">
                        <Upload size={20} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-xs text-slate-500 dark:text-neutral-400
                          file:mr-4 file:rounded-xl file:border-0
                          file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold
                          file:text-slate-700 hover:file:bg-slate-200
                          dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700
                          cursor-pointer"
                      />
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-neutral-500">
                        PNG, JPG or WEBP (Max 2MB)
                      </p>
                    </div>
                  </div>
                </div>
                
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