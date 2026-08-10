"use client";
// src/app/tuition/page.tsx

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {
  ClipboardEdit,
  Users2,
  CalendarCheck2,
  IndianRupee,
  ShieldCheck,
  MapPinned,
  BadgeCheck,
  ArrowDown,
  Home,
  Video,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

/* ------------------------------------------------------------------ */
/*  Parent / tuition application form                                 */
/* ------------------------------------------------------------------ */

const initialTuitionForm = {
  parent_name: "",
  parent_phone: "",
  parent_email: "",
  student_name: "",
  student_grade: "",
  subject: "",
  mode: "home",
  preferred_days: "",
  preferred_time: "",
  address: "",
  message: "",
};

/* ------------------------------------------------------------------ */
/*  Teacher application form                                          */
/* ------------------------------------------------------------------ */

const initialTeacherForm = {
  name: "",
  email: "",
  phone: "",
  subjects: "",
  qualification: "",
  experience_years: "",
  gender: "",
  date_of_birth: "",
  teacher_type: "part_time",
  teaching_mode: [] as string[],
  address: "",
  message: "",
};

const teachingModeOptions: { value: string; label: string; icon: typeof Home }[] = [
  { value: "home_tuition", label: "Home Tuition", icon: Home },
  { value: "online", label: "Online", icon: Video },
];

const steps = [
  {
    icon: ClipboardEdit,
    title: "Tell us what you need",
    copy: "Share your child's grade, subject, and preferred schedule — takes under two minutes.",
  },
  {
    icon: Users2,
    title: "We match a teacher",
    copy: "Our team reviews your request and allocates a verified teacher suited to your child.",
  },
  {
    icon: CalendarCheck2,
    title: "Classes begin",
    copy: "Your teacher confirms days and timing, and tuition starts — home, online, or at our center.",
  },
  {
    icon: IndianRupee,
    title: "Pay securely online",
    copy: "Once assigned, log in anytime to check the fee and pay online. No cash handling needed.",
  },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Verified teachers",
    copy: "Every teacher is screened for qualification and experience before allocation.",
  },
  {
    icon: MapPinned,
    title: "Learn your way",
    copy: "Choose home visits, online classes, or our learning center — whatever fits your routine.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent fees",
    copy: "See the exact fee before you pay. No hidden charges, no surprises.",
  },
];

export default function TuitionPage() {
  const applyRef = useRef<HTMLDivElement>(null);
  const [activeForm, setActiveForm] = useState<"tuition" | "teacher">("tuition");

  function goToApply(target: "tuition" | "teacher") {
    setActiveForm(target);
    applyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={display.variable}>
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-[#F8FAF0] pt-[110px] dark:bg-black transition-colors duration-500">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#FFC107]/15 blur-3xl dark:bg-[#FFC107]/10" />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-[300px] w-[300px] rounded-full bg-[#798321]/10 blur-3xl" />

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }} className="flex flex-col">
            
            {/* 🚀 TUITION SECTION */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#798321]/25 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#798321] dark:bg-white/5 dark:text-[#FFC107]">
                For Parents
              </span>
              <h1 style={{ fontFamily: "var(--font-display)" }} className="mt-5 text-[2.5rem] font-medium leading-[1.08] tracking-tight text-[#24310F] dark:text-white sm:text-[3.25rem]">
                Find the right <span className="italic text-[#798321] dark:text-[#FFC107]">tutor</span> for your child.
              </h1>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-gray-600 dark:text-neutral-300">
                Tell us what your child needs. We match a verified teacher, you approve the schedule, and classes begin — at home, online, or at our center.
              </p>
              <div className="mt-6">
                <button type="button" onClick={() => goToApply("tuition")} className="rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#798321]/30 transition-transform hover:-translate-y-0.5 dark:text-black">
                  Apply for Tuition
                </button>
              </div>
            </div>

            {/* Divider line between the two sections */}
            <div className="my-10 h-px w-full max-w-md bg-gradient-to-r from-[#E8ECE5] to-transparent dark:from-neutral-800" />

            {/* 🚀 TEACHER SECTION */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#798321]/25 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#798321] dark:bg-white/5 dark:text-[#FFC107]">
                For Teachers
              </span>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="mt-5 text-[2.25rem] font-medium leading-[1.08] tracking-tight text-[#24310F] dark:text-white sm:text-[2.75rem]">
                Become a <span className="italic text-[#798321] dark:text-[#FFC107]">teacher</span> with us.
              </h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-gray-600 dark:text-neutral-300">
                Join our network of verified educators. Share your expertise, set your preferred teaching mode, and easily grow your student base.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <button type="button" onClick={() => goToApply("teacher")} className="rounded-xl border-2 border-[#798321] bg-white px-7 py-3.5 text-sm font-bold text-[#798321] transition-all hover:-translate-y-0.5 hover:bg-[#798321]/5 dark:border-[#FFC107] dark:bg-transparent dark:text-[#FFC107] dark:hover:bg-[#FFC107]/10">
                  Apply to Teach
                </button>
                <a href="#how-it-works" className="flex items-center gap-2 text-sm font-semibold text-[#24310F] hover:text-[#798321] dark:text-gray-200 dark:hover:text-[#FFC107]">
                  See how it works <ArrowDown size={15} />
                </a>
              </div>
            </div>

          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }} className="rounded-3xl border border-[#E8ECE5] bg-white p-7 shadow-xl shadow-[#798321]/5 dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <p style={{ fontFamily: "var(--font-display)" }} className="text-lg italic text-[#24310F] dark:text-white">
              "Under two minutes to apply. A teacher was assigned within a day."
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#E8ECE5] pt-5 dark:border-neutral-800">
              <Stat value="2 min" label="To apply" />
              <Stat value="24 hr" label="Avg. match time" />
              <Stat value="100%" label="Verified teachers" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="bg-white py-20 dark:bg-black transition-colors duration-500 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#798321] dark:text-[#FFC107]">How it works</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="mt-3 text-3xl font-medium text-[#24310F] dark:text-white sm:text-4xl">
              From application to first class
            </h2>
          </div>
          <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-[#798321]/30 to-transparent lg:block" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: i * 0.08 }} className="relative flex flex-col items-start">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#798321] to-[#6B7328] text-white shadow-lg shadow-[#798321]/25">
                    <Icon size={26} strokeWidth={2} />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFC107] text-[11px] font-bold text-black shadow">{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-[#24310F] dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-neutral-400">{step.copy}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHY RAKVIH ============ */}
      <section className="bg-[#F8FAF0] py-20 dark:bg-black transition-colors duration-500 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="rounded-2xl border border-[#E8ECE5] bg-white p-6 dark:border-neutral-800 dark:bg-[#0a0a0a]">
                  <Icon size={22} className="text-[#798321] dark:text-[#FFC107]" />
                  <h3 className="mt-4 font-bold text-[#24310F] dark:text-white">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-neutral-400">{point.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ APPLICATION FORMS ============ */}
      <section id="apply" ref={applyRef} className="bg-white py-20 dark:bg-black transition-colors duration-500 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#798321] dark:text-[#FFC107]">Get started</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="mt-3 text-3xl font-medium text-[#24310F] dark:text-white">
              {activeForm === "tuition" ? "Apply for tuition" : "Apply to teach"}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-neutral-300">
              {activeForm === "tuition" ? "Fill in the details below and we'll match your child with the right teacher." : "Tell us about your teaching background and we'll reach out with next steps."}
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-xs items-center gap-1 rounded-xl border border-[#E8ECE5] bg-[#F8FAF0] p-1.5 dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <button type="button" onClick={() => setActiveForm("tuition")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${activeForm === "tuition" ? "bg-white text-[#24310F] shadow-sm dark:bg-[#171717] dark:text-white" : "text-gray-500 hover:text-[#24310F] dark:text-neutral-400 dark:hover:text-white"}`}>For Parents</button>
            <button type="button" onClick={() => setActiveForm("teacher")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${activeForm === "teacher" ? "bg-white text-[#24310F] shadow-sm dark:bg-[#171717] dark:text-white" : "text-gray-500 hover:text-[#24310F] dark:text-neutral-400 dark:hover:text-white"}`}>For Teachers</button>
          </div>

          <div className="mt-8">
            {activeForm === "tuition" ? <TuitionApplyForm /> : <TeacherApplyForm />}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .tuition-field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(121, 131, 33, 0.25);
          padding: 0.65rem 0.9rem;
          font-size: 0.9rem;
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tuition-field-input:focus {
          border-color: #798321;
          box-shadow: 0 0 0 2px rgba(121, 131, 33, 0.15);
        }
        .tuition-field-input.has-error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
        }
        :global(.dark) .tuition-field-input {
          background: #0a0a0a;
          border-color: #262626;
          color: white;
        }
        :global(.dark) .tuition-field-input.has-error {
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Parent / tuition application form                                 */
/* ------------------------------------------------------------------ */

function TuitionApplyForm() {
  const [form, setForm] = useState(initialTuitionForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.parent_name || !form.parent_phone || !form.student_name || !form.subject) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.mode === "home" && !form.address) {
      setError("Address is required for home tuition.");
      return;
    }
    
    if (!/^\d{10}$/.test(form.parent_phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (form.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parent_email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tuition/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      let data: any = {};
      try {
        data = await res.json();
      } catch (parseErr) {}

      if (!res.ok) {
        const backendError = data.message || data.error || "";
        if (res.status === 409 || backendError.toLowerCase().includes("exist")) {
          throw new Error(backendError || "This record already exists.");
        }
        throw new Error(backendError || "Submission failed");
      }

      setSubmitted(true);
      setForm(initialTuitionForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#E8ECE5] bg-[#F8FAF0] p-10 text-center dark:border-neutral-800 dark:bg-[#0a0a0a]">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-medium text-[#798321] dark:text-[#FFC107]">Application received!</h3>
        <p className="mt-3 text-gray-600 dark:text-neutral-300">Thank you for applying. Our team will review your request and get back to you with a teacher allocation shortly.</p>
        
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/tuition/login" className="inline-block rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#798321]/30 transition-transform hover:-translate-y-0.5 dark:text-black">
            Go to Login
          </Link>
          <CopyLinkBox path="/tuition/login" />
        </div>

        <div className="mt-8 border-t border-[#E8ECE5] pt-6 dark:border-neutral-800">
          <button onClick={() => setSubmitted(false)} className="text-xs font-semibold text-gray-500 hover:text-[#798321] dark:text-neutral-400 dark:hover:text-[#FFC107] underline underline-offset-4">
            Submit another application
          </button>
        </div>
      </motion.div>
    );
  }

  const isDuplicateError = error.toLowerCase().includes("exist") || error.toLowerCase().includes("already");
  const isEmailError = isDuplicateError && error.toLowerCase().includes("email");
  const isPhoneError = isDuplicateError && error.toLowerCase().includes("phone");

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[#E8ECE5] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-8">
      <FormSectionLabel>Parent details</FormSectionLabel>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Parent Name *">
          <input name="parent_name" value={form.parent_name} onChange={handleChange} className="tuition-field-input" placeholder="Your full name" />
        </Field>
        <Field label="Parent Phone *" error={isPhoneError ? error : undefined}>
          <input name="parent_phone" value={form.parent_phone} onChange={handleChange} className={`tuition-field-input ${isPhoneError ? "has-error" : ""}`} placeholder="10-digit phone number" />
        </Field>
      </div>

      <Field label="Parent Email" error={isEmailError ? error : undefined}>
        <input name="parent_email" value={form.parent_email} onChange={handleChange} className={`tuition-field-input ${isEmailError ? "has-error" : ""}`} placeholder="you@example.com" type="email" />
      </Field>

      <FormSectionLabel>Student details</FormSectionLabel>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Student Name *"><input name="student_name" value={form.student_name} onChange={handleChange} className="tuition-field-input" placeholder="Child's name" /></Field>
        <Field label="Grade / Class *"><input name="student_grade" value={form.student_grade} onChange={handleChange} className="tuition-field-input" placeholder="e.g. Class 8" /></Field>
      </div>

      <Field label="Subject(s) *"><input name="subject" value={form.subject} onChange={handleChange} className="tuition-field-input" placeholder="e.g. Math, Science" /></Field>

      <FormSectionLabel>Schedule</FormSectionLabel>
      <Field label="Preferred Mode *">
        <select name="mode" value={form.mode} onChange={handleChange} className="tuition-field-input">
          <option value="home">Home Tuition</option>
          <option value="online">Online</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Preferred Days"><input name="preferred_days" value={form.preferred_days} onChange={handleChange} className="tuition-field-input" placeholder="e.g. Mon, Wed, Fri" /></Field>
        <Field label="Preferred Time"><input name="preferred_time" value={form.preferred_time} onChange={handleChange} className="tuition-field-input" placeholder="e.g. 4 PM - 5 PM" /></Field>
      </div>

      {form.mode === "home" && (
        <Field label="Address *"><textarea name="address" value={form.address} onChange={handleChange} className="tuition-field-input" rows={2} placeholder="Full address for home tuition" /></Field>
      )}

      <Field label="Additional Message"><textarea name="message" value={form.message} onChange={handleChange} className="tuition-field-input" rows={3} placeholder="Anything else we should know?" /></Field>

      {error && !isDuplicateError && <p className="text-sm font-medium text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#798321]/30 transition-all hover:opacity-90 disabled:opacity-60 dark:text-black">
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Teacher application form                                          */
/* ------------------------------------------------------------------ */

function TeacherApplyForm() {
  const [form, setForm] = useState(initialTeacherForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  // 🚀 New state to store the generated password
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTeachingMode = (value: string) => {
    setForm((prev) => {
      const exists = prev.teaching_mode.includes(value);
      return {
        ...prev,
        teaching_mode: exists ? prev.teaching_mode.filter((m) => m !== value) : [...prev.teaching_mode, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setGeneratedPassword(""); // Reset password on fresh submit

    if (!form.name || !form.email || !form.phone || !form.subjects) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.teaching_mode.length === 0) {
      setError("Select at least one teaching mode.");
      return;
    }
    
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/teacher/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, teaching_mode: form.teaching_mode.join(",") }),
      });

      let data: any = {};
      try {
        data = await res.json(); // Wait for the response so we can get the password
      } catch (parseErr) {}

      if (!res.ok) {
        const backendError = data.message || data.error || "";
        
        if (res.status === 409 || backendError.toLowerCase().includes("exist")) {
          throw new Error(backendError || "This record already exists.");
        }
        throw new Error(backendError || "Submission failed");
      }

      // 🚀 Save the password sent from the backend
      if (data.password) {
        setGeneratedPassword(data.password);
      }

      setSubmitted(true);
      setForm(initialTeacherForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#E8ECE5] bg-[#F8FAF0] p-10 text-center dark:border-neutral-800 dark:bg-[#0a0a0a]">
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-medium text-[#798321] dark:text-[#FFC107]">Application received!</h3>
        <p className="mt-3 text-gray-600 dark:text-neutral-300">Thanks for applying to teach with us. Our team will review your profile and reach out with next steps.</p>
        
        {/* 🚀 New Password Alert Box */}
        {generatedPassword && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-left shadow-sm dark:border-yellow-950 dark:bg-yellow-950/20">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400 mb-2">
              <AlertTriangle size={18} />
              <h4 className="font-bold">Save your login password</h4>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300/80 mb-3">
              We have auto-generated a secure password for your new account. Please copy and save this now, it will not be shown again.
            </p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-yellow-300 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-black">
              <code className="text-lg font-bold tracking-widest text-gray-900 dark:text-white select-all">
                {generatedPassword}
              </code>
              <CopyPasswordButton password={generatedPassword} />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/teacher/login" className="inline-block rounded-xl bg-[#798321] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#798321]/30 transition-transform hover:-translate-y-0.5 dark:bg-[#FFC107] dark:text-black">
            Go to Login
          </Link>
          <CopyLinkBox path="/teacher/login" />
        </div>

        <div className="mt-8 border-t border-[#E8ECE5] pt-6 dark:border-neutral-800">
          <button onClick={() => setSubmitted(false)} className="text-xs font-semibold text-gray-500 hover:text-[#798321] dark:text-neutral-400 dark:hover:text-[#FFC107] underline underline-offset-4">
            Submit another application
          </button>
        </div>
      </motion.div>
    );
  }

  const isDuplicateError = error.toLowerCase().includes("exist") || error.toLowerCase().includes("already");
  const isEmailError = isDuplicateError && error.toLowerCase().includes("email");
  const isPhoneError = isDuplicateError && error.toLowerCase().includes("phone");

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[#E8ECE5] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#0a0a0a] sm:p-8">
      <FormSectionLabel>Your details</FormSectionLabel>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name *">
          <input name="name" value={form.name} onChange={handleChange} className="tuition-field-input" placeholder="Your full name" />
        </Field>
        <Field label="Phone *" error={isPhoneError ? error : undefined}>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`tuition-field-input ${isPhoneError ? "has-error" : ""}`}
            placeholder="10-digit phone number"
          />
        </Field>
      </div>

      <Field label="Email *" error={isEmailError ? error : undefined}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={`tuition-field-input ${isEmailError ? "has-error" : ""}`}
          placeholder="you@example.com"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Gender">
          <select name="gender" value={form.gender} onChange={handleChange} className="tuition-field-input">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Date of Birth"><input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="tuition-field-input" /></Field>
      </div>

      <FormSectionLabel>Teaching profile</FormSectionLabel>
      <Field label="Subjects *"><input name="subjects" value={form.subjects} onChange={handleChange} className="tuition-field-input" placeholder="e.g. Math, Physics" /></Field>
      <Field label="Teacher Type">
        <select name="teacher_type" value={form.teacher_type} onChange={handleChange} className="tuition-field-input">
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="freelance">Freelance</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Qualification"><input name="qualification" value={form.qualification} onChange={handleChange} className="tuition-field-input" placeholder="e.g. M.Sc Mathematics" /></Field>
        <Field label="Experience (years)"><input name="experience_years" type="number" min={0} value={form.experience_years} onChange={handleChange} className="tuition-field-input" placeholder="e.g. 5" /></Field>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-neutral-300">Teaching Mode *</span>
        <div className="flex flex-wrap gap-2">
          {teachingModeOptions.map(({ value, label, icon: Icon }) => {
            const checked = form.teaching_mode.includes(value);
            return (
              <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all select-none ${checked ? "border-[#798321] bg-[#798321]/10 text-[#798321] dark:border-[#FFC107] dark:bg-[#FFC107]/10 dark:text-[#FFC107]" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 dark:border-neutral-800 dark:bg-[#171717] dark:text-neutral-400"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleTeachingMode(value)} className="sr-only" />
                <Icon size={14} />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <FormSectionLabel>Location</FormSectionLabel>
      <Field label="Address"><textarea name="address" value={form.address} onChange={handleChange} className="tuition-field-input" rows={2} placeholder="Your full address" /></Field>

      <Field label="Additional Message"><textarea name="message" value={form.message} onChange={handleChange} className="tuition-field-input" rows={3} placeholder="Anything else we should know?" /></Field>

      {error && !isDuplicateError && <p className="text-sm font-medium text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#798321]/30 transition-all hover:opacity-90 disabled:opacity-60 dark:text-black">
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  UI Helper Components                                              */
/* ------------------------------------------------------------------ */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-display)" }} className="text-xl font-medium text-[#798321] dark:text-[#FFC107]">{value}</p>
      <p className="mt-0.5 text-[11px] text-gray-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}

function FormSectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="pt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#798321] dark:text-[#FFC107]">{children}</p>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block relative">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-neutral-300">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] font-medium text-red-500">{error}</span>}
    </label>
  );
}

/* 🚀 Helper component to copy the auto-generated password */
function CopyPasswordButton({ password }: { password: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy password"
      className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-100 text-yellow-700 transition-colors hover:bg-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:hover:bg-yellow-900"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

/* Helper component to copy the login link */
function CopyLinkBox({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-widest">
        Or copy link to save
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-[#E8ECE5] bg-white p-1 pl-3 shadow-sm dark:border-neutral-800 dark:bg-[#171717]">
        <span className="text-sm font-medium text-gray-600 dark:text-neutral-300 truncate max-w-[180px] sm:max-w-[250px]">
          {fullUrl}
        </span>
        <button
          onClick={handleCopy}
          title="Copy link"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F8FAF0] text-[#798321] transition-colors hover:bg-[#798321] hover:text-white dark:bg-neutral-800 dark:text-[#FFC107] dark:hover:bg-[#FFC107] dark:hover:text-black"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}