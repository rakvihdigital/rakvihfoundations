"use client";

import { Lock, Award } from "lucide-react";

export default function CertificateEmpty() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#FFC107]/30 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-xl dark:shadow-none transition-colors duration-300">

      {/* Header */}

      <div className="bg-gradient-to-r from-[#8A8A1E] to-[#FFC107] p-6 text-white dark:text-black">

        <div className="flex items-center gap-3">

          <Award className="h-10 w-10" />

          <div>
            <h2 className="text-2xl font-bold">
              Internship Certificate
            </h2>

            <p className="text-yellow-100 dark:text-black/70">
              Complete your internship to unlock your certificate.
            </p>
          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-10 text-center">

        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#FFF8E1] dark:bg-yellow-900/20">

          <Lock className="h-14 w-14 text-[#FFC107]" />

        </div>

        <h3 className="mt-8 text-3xl font-bold text-[#8A8A1E] dark:text-[#FFC107]">
          Certificate Locked
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-neutral-400 leading-7">
          Your internship certificate will become available after you complete
          all videos, materials, assignments, and the administrator generates
          your certificate.
        </p>

        {/* Preview */}

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-dashed border-gray-300 dark:border-neutral-800 bg-gray-100 dark:bg-[#171717] p-6">

          <img
            src="/images/certificate-preview.png"
            alt="Certificate Preview"
            className="mx-auto h-72 rounded-xl opacity-40 blur-sm dark:opacity-20"
          />

        </div>

        <button
          disabled
          className="mt-8 cursor-not-allowed rounded-xl bg-gray-300 dark:bg-neutral-800 px-8 py-3 font-semibold text-white dark:text-neutral-500"
        >
          View Certificate
        </button>

      </div>

    </div>
  );
}