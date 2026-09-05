"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { createEnrollment } from "@/lib/enrollment";

import {
  Sparkles,
  GraduationCap,
  Clock3,
  Users,
  BadgeIndianRupee,
  ArrowRight,
  ArrowLeft,
  User,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  FileText,
  CreditCard,
} from "lucide-react";

interface Program {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  students: string;
  price: number;
  image: string;
}

function EnrollmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("program");
  const supabase = createClient();

  async function uploadPhoto(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("student-photos")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("student-photos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function uploadResume(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("student-resumes")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("student-resumes")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [agree, setAgree] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    year: "",
    address: "",
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    setLoading(true);

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("title");

    if (!error && data) {
      setPrograms(data);

      if (programId) {
        const selected = data.find((item) => item.id === Number(programId));
        if (selected) {
          setSelectedProgram(selected);
        }
      } else {
        if (data.length > 0) {
          setSelectedProgram(data[0]);
        }
      }
    }

    setLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleContinue() {
    if (!selectedProgram) {
      alert("Please select a program.");
      return;
    }

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.college ||
      !formData.branch ||
      !formData.year
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!agree) {
      alert("Please accept the terms.");
      return;
    }
    try {
      const photoUrl = photo ? await uploadPhoto(photo) : undefined;
      const resumeUrl = resume ? await uploadResume(resume) : undefined;

      const savedEnrollment = await createEnrollment({
        program_id: selectedProgram.id,
        program_title: selectedProgram.title,

        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
        address: formData.address,

        amount: selectedProgram.price,

        category: selectedProgram.category,
        duration: selectedProgram.duration,
        price: selectedProgram.price,

        photo_url: photoUrl,
        resume_url: resumeUrl,

        document_url: "",
        payment_screenshot: "",

        payment_status: "Pending",
        enrollment_status: "Pending",
      });

      router.push(`/payment/${savedEnrollment.id}`);
    } catch (error: any) {
      console.error("Enrollment Error:", error);

      alert(
        error?.message || error?.error_description || JSON.stringify(error),
      );
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8faf5] pt-4 pb-20 transition-colors duration-500 dark:bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Light Theme */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95)_0%,rgba(247,251,239,1)_35%,rgba(237,244,224,1)_100%)] dark:hidden" />

        {/* Dark Theme Background */}
        <div className="hidden dark:block absolute inset-0 bg-black" />

        {/* Glow */}
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(121,131,33,0.08)_0%,transparent_65%)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [background-image:linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#798321]/15 bg-white/90 px-5 py-3 text-xs font-bold text-[#798321] shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur transition-all duration-300 hover:-translate-x-1 hover:bg-[#798321] hover:text-white dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-[#FFC107] dark:hover:bg-[#FFC107] dark:hover:text-black"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-[#798321]/15 bg-white/85 px-5 py-2 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-[#0a0a0a] md:flex">
            <Sparkles size={14} className="text-[#FFC107]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#798321] dark:text-[#FFC107]">
              Enrollment Portal
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#798321]/15 bg-white/85 px-5 py-2 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <GraduationCap size={15} className="text-[#798321] dark:text-[#FFC107]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#798321] dark:text-[#FFC107]">
              Student Enrollment
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-[#6B7328] sm:text-4xl md:text-5xl dark:text-white">
            Start Your Internship Journey
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-black dark:text-neutral-300">
            Complete your details carefully and continue to the payment step
            with a clean, professional enrollment experience.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[34px] border border-white/60 bg-white/80 p-5 shadow-[0_24px_70px_rgba(71,85,20,0.12)] backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#5f7814] dark:text-white">
                  Student Enrollment
                </h2>
                <p className="mt-2 text-xs leading-7 text-slate-600 dark:text-neutral-400">
                  Fill your details carefully. Your selected internship program
                  will automatically continue to the payment page.
                </p>
              </div>

              <div className="hidden rounded-2xl bg-[#798321]/10 p-3 dark:bg-[#171717] md:block">
                <FileText size={24} className="text-[#798321] dark:text-[#FFC107]" />
              </div>
            </div>

            <div className="space-y-6">
              {programId ? (
                <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-md backdrop-blur dark:border-neutral-800 dark:bg-[#171717]">
                  <div className="grid md:grid-cols-[220px_1fr]">
                    <div className="h-[240px]">
                      <img
                        src={selectedProgram?.image}
                        alt={selectedProgram?.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-center p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#d6a800]">
                        Selected Internship
                      </p>

                      <h2 className="mt-2 text-xl font-bold leading-snug text-[#5f7814] dark:text-white">
                        {selectedProgram?.title}
                      </h2>

                      <p className="mt-2 line-clamp-3 text-[12px] leading-6 text-slate-600 dark:text-neutral-300">
                        {selectedProgram?.description}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-[#798321]/10 bg-[#f8fbf3] p-3 text-center dark:border-neutral-800 dark:bg-[#171717]">
                          <Clock3
                            size={16}
                            className="mx-auto text-[#798321] dark:text-[#FFC107]"
                          />
                          <p className="mt-2 text-[8px] uppercase text-slate-400 dark:text-neutral-500">
                            Duration
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#5f7814] dark:text-white">
                            {selectedProgram?.duration}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#798321]/10 bg-[#f8fbf3] p-3 text-center dark:border-neutral-800 dark:bg-[#171717]">
                          <Users
                            size={16}
                            className="mx-auto text-[#798321] dark:text-[#FFC107]"
                          />
                          <p className="mt-2 text-[8px] uppercase text-slate-400 dark:text-neutral-500">
                            Students
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#5f7814] dark:text-white">
                            {selectedProgram?.students}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#798321] p-3 text-center dark:bg-[#FFC107]">
                          <BadgeIndianRupee
                            size={16}
                            className="mx-auto text-[#FFC107] dark:text-black"
                          />
                          <p className="mt-2 text-[8px] uppercase text-[#FFC107] dark:text-black">
                            Fee
                          </p>
                          <p className="mt-1 text-sm font-bold text-white dark:text-black">
                            ₹{selectedProgram?.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                    Internship Program
                  </label>

                  <select
                    value={selectedProgram?.id ?? ""}
                    onChange={(e) => {
                      const course = programs.find(
                        (item) => item.id === Number(e.target.value),
                      );
                      if (course) setSelectedProgram(course);
                    }}
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                  >
                    {programs.map((program) => (
                      <option key={program.id} value={program.id} className="dark:bg-[#171717] dark:text-white">
                        {program.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                  Full Name
                </label>
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter email"
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                    Mobile Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                  College Name
                </label>
                <input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college"
                  className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                    Branch
                  </label>
                  <input
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="CSE / ECE / IT"
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                  >
                    <option value="" className="dark:bg-[#171717] dark:text-white">Select Year</option>
                    <option className="dark:bg-[#171717] dark:text-white">1st Year</option>
                    <option className="dark:bg-[#171717] dark:text-white">2nd Year</option>
                    <option className="dark:bg-[#171717] dark:text-white">3rd Year</option>
                    <option className="dark:bg-[#171717] dark:text-white">4th Year</option>
                    <option className="dark:bg-[#171717] dark:text-white">Graduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[3px] text-[#5f7814] dark:text-[#FFC107]">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter your address"
                  className="w-full resize-none rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 text-sm font-medium text-slate-800 outline-none backdrop-blur transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/20 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:border-[#FFC107] dark:focus:bg-[#171717] dark:focus:ring-[#FFC107]/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-white/80 bg-white/72 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-[#171717]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && setPhoto(e.target.files[0])
                    }
                  />

                  <div className="flex flex-col items-center">
                    {photo ? (
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Profile"
                        className="h-20 w-20 rounded-full border-4 border-[#798321] object-cover shadow-lg"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#798321]/10 transition-all group-hover:bg-[#798321]/20 dark:bg-[#FFC107]/10 dark:group-hover:bg-[#FFC107]/20">
                        <User size={34} className="text-[#798321] dark:text-[#FFC107]" />
                      </div>
                    )}

                    <h3 className="mt-4 text-sm font-black text-[#5f7814] dark:text-white">
                      Profile Photo
                    </h3>

                    <p className="mt-1 text-center text-[10px] text-slate-500 dark:text-neutral-400">
                      JPG • PNG • Max 5 MB
                    </p>

                    <span className="mt-4 rounded-full bg-[#798321] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-md dark:bg-[#FFC107] dark:text-black">
                      {photo ? "Photo Selected ✓" : "Choose Photo"}
                    </span>
                  </div>
                </label>

                <label className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-white/80 bg-white/72 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-[#171717]">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && setResume(e.target.files[0])
                    }
                  />

                  <div className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFC107]/15 transition-all group-hover:bg-[#FFC107]/25 dark:bg-[#FFC107]/10 dark:group-hover:bg-[#FFC107]/20">
                      <UploadCloud size={34} className="text-[#798321] dark:text-[#FFC107]" />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-[#5f7814] dark:text-white">
                      Resume
                    </h3>

                    <p className="mt-1 text-center text-[10px] text-slate-500 dark:text-neutral-400">
                      PDF • DOC • DOCX
                    </p>

                    <span className="mt-4 rounded-full bg-[#FFC107] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0F172A] shadow-md dark:bg-[#798321] dark:text-white">
                      {resume ? "Resume Selected ✓" : "Upload Resume"}
                    </span>

                    {resume && (
                      <p className="mt-3 max-w-[180px] truncate text-[10px] text-slate-500 dark:text-neutral-400">
                        {resume.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-white/80 bg-white/72 p-4 backdrop-blur dark:border-neutral-800 dark:bg-[#171717]">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-[#798321] text-[#798321] focus:ring-[#FFC107] dark:border-neutral-700 dark:bg-black dark:text-[#FFC107]"
                />

                <span className="text-xs leading-6 text-slate-600 dark:text-neutral-300">
                  I confirm that all the information entered above is correct
                  and I agree to Rakvih Solutions Internship Enrollment Terms &
                  Conditions.
                </span>
              </label>

              {!programId && selectedProgram && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-[28px] border border-white/80 bg-white/72 p-5 backdrop-blur dark:border-neutral-800 dark:bg-[#171717]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#d6a800]">
                        Selected Course
                      </p>

                      <h3 className="mt-2 text-lg font-black text-[#5f7814] dark:text-white">
                        {selectedProgram.title}
                      </h3>

                      <p className="mt-1 text-[11px] leading-6 text-slate-600 dark:text-neutral-300">
                        {selectedProgram.description}
                      </p>
                    </div>

                    <div className="flex justify-end pr-6">
                      <button
                        type="button"
                        className="relative -left-6 top-3 h-11 px-6 rounded-xl border border-[#798321]/20 bg-[#798321]/10 backdrop-blur-sm text-[#5F7814] text-sm font-bold transition-all duration-300 hover:bg-[#798321] hover:text-white dark:border-[#FFC107]/20 dark:bg-[#FFC107]/10 dark:text-[#FFC107] dark:hover:bg-[#FFC107] dark:hover:text-black"
                      >
                        View Course
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-[#f8fbf3] p-3 dark:bg-[#0a0a0a]">
                      <p className="text-[9px] uppercase text-slate-500 dark:text-neutral-400">
                        Duration
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#5f7814] dark:text-white">
                        {selectedProgram.duration}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f8fbf3] p-3 dark:bg-[#0a0a0a]">
                      <p className="text-[9px] uppercase text-slate-500 dark:text-neutral-400">
                        Students
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#5f7814] dark:text-white">
                        {selectedProgram.students}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#798321] p-3 dark:bg-[#FFC107]">
                      <p className="text-[9px] uppercase text-[#FFC107] dark:text-black">Fee</p>
                      <p className="mt-1 text-lg font-black text-white dark:text-black">
                        ₹{selectedProgram.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#798321] via-[#9cb427] to-[#FFC107] px-8 py-5 text-sm font-black uppercase tracking-[3px] text-white shadow-[0_20px_45px_rgba(121,131,33,0.28)] transition-all duration-300 hover:shadow-[0_22px_52px_rgba(121,131,33,0.38)] dark:text-black"
              >
                Continue To Payment
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="rounded-[34px] border border-white/60 bg-white/76 p-6 shadow-[0_24px_70px_rgba(71,85,20,0.12)] backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl p-3">
                  <CreditCard size={22} className="text-[#798321] dark:text-[#FFC107]" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#5f7814] dark:text-white">
                    Enrollment Steps
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Quick and simple application flow
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: <FileText size={18} />,
                    title: "Fill Details",
                    desc: "Enter personal, academic and contact information carefully.",
                  },
                  {
                    icon: <UploadCloud size={18} />,
                    title: "Upload Documents",
                    desc: "Attach profile photo and resume for your application.",
                  },
                  {
                    icon: <CreditCard size={18} />,
                    title: "Continue Payment",
                    desc: "Proceed to the payment page and finish enrollment.",
                  },
                  {
                    icon: <ShieldCheck size={18} />,
                    title: "Payment Verification",
                    desc: "Your payment will be securely verified after successful payment.",
                  },
                  {
                    icon: <CheckCircle2 size={18} />,
                    title: "Enrollment Confirmation",
                    desc: "Your internship enrollment will be confirmed automatically.",
                  },
                  {
                    icon: <GraduationCap size={18} />,
                    title: "Course & Batch Details",
                    desc: "Access your course, batch, mentor and learning dashboard.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/70 p-4 backdrop-blur dark:border-neutral-800 dark:bg-[#171717]"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b to-[#FFC107]" />

                    <div className="flex gap-4 pl-2">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black">
                        {item.icon}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#5f7814] dark:text-white">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-neutral-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/60 bg-white/76 p-6 shadow-[0_24px_70px_rgba(71,85,20,0.12)] backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#FFC107]/15 p-3 bg-[#FFC107] text-[#0F172A] dark:bg-[#FFC107]">
                  <ShieldCheck size={22} className="text-[#798321] dark:text-black" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#5f7814] dark:text-white">
                    Portal Benefits
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Designed for a professional student experience
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Professional and premium enrollment design",
                  "Secure step before payment confirmation",
                  "Quick form completion with clean layout",
                  "Smooth dark mode and light mode appearance",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 text-[#798321] dark:text-[#FFC107]" />
                    <p className="text-sm leading-6 text-slate-600 dark:text-neutral-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function EnrollmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8faf5] dark:bg-black">
          <div className="text-sm font-bold tracking-widest text-[#798321] dark:text-[#FFC107] uppercase">
            Loading Enrollment...
          </div>
        </div>
      }
    >
      <EnrollmentContent />
    </Suspense>
  );
}