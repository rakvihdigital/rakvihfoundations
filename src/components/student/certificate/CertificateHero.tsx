"use client";

import { Award, ShieldCheck } from "lucide-react";

export default function CertificateHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8A8A1E] via-[#A59A20] to-[#FFC107] p-5 text-white dark:text-black shadow-lg dark:shadow-none transition-colors duration-300">

      {/* Background Blur */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 dark:bg-black/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 dark:bg-black/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 dark:bg-black/10 px-3 py-1 text-[10px] font-medium backdrop-blur">
            <ShieldCheck className="h-3 w-3" />
            Internship Completion
          </div>

          <h1 className="mt-3 text-xl font-bold">My Certificates</h1>

          <p className="mt-2 text-[10px] text-yellow-100 dark:text-black/70 leading-tight max-w-xs">
            Your certificate will appear here after completion and admin approval.
          </p>
        </div>

        {/* Right Side - Tiny Icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-black/10 backdrop-blur">
          <Award className="h-9 w-9 text-white dark:text-black" />
        </div>

      </div>
    </div>
  );
}