"use client";

import { Eye, Download, Calendar, Hash, Award } from "lucide-react";

interface Props {
  certificate: any;
  onView: () => void;
}

export default function CertificateCard({
  certificate,
  onView,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#FFC107]/30 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow transition-all hover:-translate-y-0.5">

      {/* Tiny Header */}
      <div className="bg-gradient-to-r from-[#8A8A1E] to-[#FFC107] px-4 py-2.5 text-white dark:text-black">
        <div className="flex items-center gap-2">
          <div className="rounded bg-white/25 dark:bg-black/10 p-1">
            <Award className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-bold">Internship Cert</h2>
            <p className="text-[9px] text-yellow-100 dark:text-black/70 truncate">
              {certificate.programs?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-3">
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-[#171717]">
          <img
            src={certificate.thumbnail || "/images/certificate-preview.png"}
            alt="Certificate"
            className="h-32 w-full object-cover"
          />
        </div>

        {/* Super Small Details */}
        <div className="mt-3 space-y-2 text-[10px]">

          <div className="flex items-start gap-2">
            <Hash className="h-3.5 w-3.5 text-[#FFC107] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-gray-500 dark:text-neutral-400 -mb-0.5">No</p>
              <p className="font-medium leading-none dark:text-white">{certificate.certificate_number}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#FFC107] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-gray-500 dark:text-neutral-400 -mb-0.5">Date</p>
              <p className="font-medium leading-none dark:text-white">
                {new Date(certificate.issue_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-full bg-[#FFF8E1] dark:bg-yellow-900/20 px-2.5 py-0.5 text-[9px] font-medium text-[#8A8A1E] dark:text-[#FFC107]">
            {certificate.status}
          </div>

        </div>

        {/* Tiny Buttons */}
        <div className="mt-4 flex gap-1.5">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#FFC107] py-1.5 text-[10px] font-medium text-white dark:text-black active:bg-[#E6AE00]"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>

          <a
            href={certificate.certificate_url}
            download
            className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-[#8A8A1E] dark:border-[#FFC107] py-1.5 text-[10px] font-medium text-[#8A8A1E] dark:text-[#FFC107] active:bg-[#8A8A1E] dark:active:bg-[#FFC107] active:text-white dark:active:text-black transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            DL
          </a>
        </div>
      </div>
    </div>
  );
}