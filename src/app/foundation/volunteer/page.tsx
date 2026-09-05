"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import {
  Users,
  CheckCircle,
  Sparkles,
  Eye,
  EyeOff,
  LogIn,
  Upload,
  FileCheck,
  X,
  FileText,
  ShieldCheck,
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
    volunteerType: "Individual Volunteer",
    idProofType: "",
  });

  // File Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);

  // Terms & Conditions States
  const [hasReviewedTerms, setHasReviewedTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFile(file);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!imageFile) {
      setErrorMessage("Please upload your profile photo.");
      return;
    }

    if (!formData.idProofType || !idFile) {
      setErrorMessage("Please select an ID proof type and upload your document.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please review and accept the Terms & Conditions and Privacy Policy before continuing.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      let profile_image_url = null;
      let id_proof_url = null;

      // 1. Upload Profile Image (Compulsory)
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        profile_image_url = publicUrlData.publicUrl;
      }

      // 2. Upload ID Proof Document (Compulsory)
      if (idFile) {
        const fileExt = idFile.name.split(".").pop();
        const fileName = `${Date.now()}-id-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        const { error: idUploadError } = await supabase.storage
          .from("id_proofs")
          .upload(filePath, idFile);

        if (idUploadError) throw new Error("ID proof upload failed: " + idUploadError.message);

        const { data: idProofData } = supabase.storage
          .from("id_proofs")
          .getPublicUrl(filePath);

        id_proof_url = idProofData.publicUrl;
      }

      // 3. Insert Record into Supabase
      const { error: insertError } = await supabase.from("volunteers").insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          dob: formData.dob,
          blood_group: formData.bloodGroup,
          street_address: formData.streetAddress || null,
          city: formData.city || null,
          active_blood_donor: formData.activeBloodDonor,
          password: formData.password,
          volunteer_type: "Individual Volunteer",
          profile_image_url: profile_image_url,
          id_proof_type: formData.idProofType,
          id_proof_url: id_proof_url,
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
        volunteerType: "Individual Volunteer",
        idProofType: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setIdFile(null);
      setAgreedToTerms(false);
      setHasReviewedTerms(false);
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

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .ilike("email", cleanEmail)
        .eq("password", loginPassword)
        .maybeSingle();

      if (error) {
        console.error("Volunteer login query error:", error);
        throw new Error("Unable to log in at this moment. Please check your credentials.");
      }

      if (!data) {
        throw new Error("Invalid email or password. Please check your credentials.");
      }

      if (data.status === "pending") {
        throw new Error("Your account is pending admin approval. We will notify you once approved.");
      }

      if (data.status === "rejected") {
        throw new Error("Your volunteer application was not approved.");
      }

      // Save credentials in localStorage
      localStorage.setItem("rakvih_volunteer_id", String(data.id));
      localStorage.setItem("rakvih_volunteer_name", String(data.name));
      if (data.email) {
        localStorage.setItem("rakvih_volunteer_email", String(data.email));
      }

      // Dispatch storage event so navbar updates
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.location.href = "/foundation/volunteer/dashboard";
      }
    } catch (err: any) {
      console.error("Volunteer login error:", err);
      setLoginError(err.message || "An unexpected error occurred. Please try again.");
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
    <div
      className={`min-h-screen overflow-x-clip bg-slate-50 dark:bg-black pb-12 sm:pb-16 transition-colors duration-500 ${display.variable}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {/* Header Section */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-14 sm:pb-8 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
        <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-8 lg:right-12">
          <button
            type="button"
            onClick={toggleMode}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 hover:text-[#FFC107] dark:bg-white/10 dark:hover:bg-white/20"
          >
            {isLoginMode ? (
              <>
                <Users size={15} /> New here? Register
              </>
            ) : (
              <>
                <LogIn size={15} /> Already a volunteer? Login
              </>
            )}
          </button>
        </div>

        <div className="relative mx-auto mt-3 sm:mt-4 max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Join Our Community
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-2">
            {isLoginMode ? (
              <>
                Volunteer <span className="text-[#FFC107]">Login</span>
              </>
            ) : (
              <>
                Become a <span className="text-[#FFC107]">Volunteer</span>
              </>
            )}
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 dark:text-neutral-300 leading-relaxed">
            {isLoginMode
              ? "Welcome back! Please log in to manage your volunteer activities and see upcoming events."
              : "Give your time, not just your money. Join RAKVIH Foundation volunteers in Bengaluru distributing meals, supporting children's education, and running tree-planting drives across local communities."}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 pt-5 sm:pt-7 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-neutral-800 dark:bg-[#0a0a0a]">
          {!success && (
            <div className="mb-8 border-b border-slate-100 pb-4 dark:border-neutral-900">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isLoginMode ? "Welcome Back" : "Register Details"}
              </h2>
            </div>
          )}

          {success && !isLoginMode ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-16 space-y-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Registration Successful!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
                Thank you for registering as a volunteer with RAKVIH Foundation. Our team will verify your documents and get in touch with you shortly.
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

              {/* Top Row: Profile Photo & ID Proof Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-slate-50/50 p-4 sm:p-5 border border-slate-200/80 dark:border-neutral-800 dark:bg-[#121212]">
                
                {/* 1. Profile Photo (Compulsory) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-2">
                    Profile Photo *
                  </label>
                  <div className="flex items-center gap-3">
                    {imagePreview ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#798321] dark:border-[#FFC107]">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 border border-dashed border-slate-300 dark:border-neutral-700">
                        <Upload size={18} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                        className="w-full text-xs text-slate-500 dark:text-neutral-400
                          file:mr-2 file:rounded-xl file:border-0
                          file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold
                          file:text-slate-700 hover:file:bg-slate-100
                          dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700
                          cursor-pointer"
                      />
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-neutral-500 truncate">
                        PNG, JPG or WEBP (Max 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. ID Proof Document Upload (Compulsory) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-2">
                    Government ID Proof *{" "}
                    <span className="text-[11px] font-normal text-[#798321] dark:text-[#FFC107]">
                      (Upload any one)
                    </span>
                  </label>
                  <div className="space-y-2">
                    <select
                      name="idProofType"
                      value={formData.idProofType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                    >
                      <option value="" disabled className="dark:bg-[#171717]">
                        Select ID Document Type *
                      </option>
                      <option value="Aadhaar Card" className="dark:bg-[#171717]">
                        Aadhaar Card
                      </option>
                      <option value="Driving License" className="dark:bg-[#171717]">
                        Driving License
                      </option>
                      <option value="Voter ID" className="dark:bg-[#171717]">
                        Voter ID
                      </option>
                      <option value="PAN Card" className="dark:bg-[#171717]">
                        PAN Card
                      </option>
                    </select>

                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[#798321] dark:text-[#FFC107]">
                        <FileCheck size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleIdFileChange}
                          required
                          className="w-full text-xs text-slate-500 dark:text-neutral-400
                            file:mr-2 file:rounded-xl file:border-0
                            file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold
                            file:text-slate-700 hover:file:bg-slate-100
                            dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700
                            cursor-pointer"
                        />
                        <p className="mt-1 text-[10px] text-slate-400 dark:text-neutral-500 truncate">
                          PDF, JPG, or PNG of front/back
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Your Name *
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

                {/* Street address - Optional */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Street address <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="House/Flat no, Street, Area"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#171717] dark:text-white"
                  />
                </div>

                {/* Town / City - Optional */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Town / City <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
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

                {/* Volunteer Type - Individual Volunteer Only */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Volunteer Type *
                  </label>
                  <select
                    name="volunteerType"
                    value={formData.volunteerType}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 text-xs font-semibold text-slate-700 dark:border-neutral-800 dark:bg-[#1f1f1f] dark:text-neutral-200 cursor-not-allowed"
                  >
                    <option value="Individual Volunteer">Individual Volunteer</option>
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

              {/* Terms & Privacy Policy Checkbox & Trigger */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-neutral-800 dark:bg-[#141414]">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    disabled={!hasReviewedTerms}
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#798321] focus:ring-[#798321] disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="text-xs leading-relaxed text-slate-600 dark:text-neutral-300">
                    <label htmlFor="termsAgreement" className={!hasReviewedTerms ? "opacity-60" : ""}>
                      I have read, understood, and agree to the{" "}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="font-bold text-[#798321] dark:text-[#FFC107] underline hover:opacity-80 transition"
                    >
                      Terms & Conditions and Privacy Policy
                    </button>
                    {!hasReviewedTerms && (
                      <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        * You must open and read the Terms & Conditions before accepting.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !agreedToTerms}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:text-black"
                >
                  <Users size={18} />
                  <span>{submitting ? "Submitting Registration..." : "Join Now"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* ================= TERMS & CONDITIONS MODAL POPUP ================= */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-neutral-800 dark:bg-[#111111]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                  <ShieldCheck className="text-[#798321] dark:text-[#FFC107]" size={22} />
                  <span>Volunteer Code, Terms & Privacy</span>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-6 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                {/* 5 Terms Points */}
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                    <FileText size={16} className="text-[#798321] dark:text-[#FFC107]" /> Terms & Conditions
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Voluntary Commitment:</strong> Services provided are purely voluntary with no financial remuneration, employment relationship, or contract of employment implied.
                    </li>
                    <li>
                      <strong>Code of Ethics & Respect:</strong> Volunteers must maintain strict integrity, respect beneficiary dignity, and adhere to a zero-tolerance policy regarding harassment or discrimination.
                    </li>
                    <li>
                      <strong>Safety & Ground Protocol:</strong> Field volunteers agree to follow foundation field leaders&apos; safety directives during meal distributions, emergency drives, or event gatherings.
                    </li>
                    <li>
                      <strong>Representation Policy:</strong> Volunteers cannot collect funds or represent the foundation in media/public communications without prior written executive authorization.
                    </li>
                    <li>
                      <strong>Discretionary Membership:</strong> RAKVIH Foundation reserves the right to suspend or revoke volunteer privileges upon violation of community safety or compliance policies.
                    </li>
                  </ul>
                </div>

                {/* 5 Privacy Policy Points */}
                <div>
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                    <ShieldCheck size={16} className="text-[#798321] dark:text-[#FFC107]" /> Privacy Policy
                  </h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Secure Identity Verification:</strong> Uploaded government identification documents are collected solely for volunteer identity verification, community safety, and screening.
                    </li>
                    <li>
                      <strong>No Commercial Disclosures:</strong> Your personal contact details (phone, email, address) will never be traded, sold, or rented to third-party commercial marketing firms.
                    </li>
                    <li>
                      <strong>Encrypted Storage:</strong> All profile credentials and uploaded identity files are stored in access-restricted, encrypted cloud infrastructure.
                    </li>
                    <li>
                      <strong>Restricted Administrative Access:</strong> Identity proof documents can only be accessed by authorized foundation administrative personnel for onboarding approval.
                    </li>
                    <li>
                      <strong>Data Erasure Rights:</strong> Should you choose to withdraw your volunteer registration, you may request complete deletion of your profile and uploaded identification records.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setHasReviewedTerms(true);
                    setAgreedToTerms(true);
                    setShowTermsModal(false);
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-2.5 text-xs font-bold text-white dark:text-black shadow-md hover:opacity-95"
                >
                  I Have Read & Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VolunteerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
        </div>
      }
    >
      <VolunteerFormContent />
    </Suspense>
  );
}