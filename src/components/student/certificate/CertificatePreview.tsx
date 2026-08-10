"use client";

import { Download, Eye } from "lucide-react";

interface Props {
  certificate: any;
  onView: () => void;
}

export default function CertificatePreview({
  certificate,
  onView,
}: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-lg dark:shadow-none transition-colors duration-300">

        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            onClick={onView}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#8A8A1E] to-[#FFC107] px-3 py-2 text-xs text-white dark:text-black transition-all hover:opacity-90 active:scale-95"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <a
            href={certificate.certificate_url}
            download
            className="flex items-center gap-1 rounded-full border border-[#8A8A1E] dark:border-[#FFC107] bg-white dark:bg-black px-3 py-2 text-xs text-[#8A8A1E] dark:text-[#FFC107] hover:bg-[#8A8A1E] hover:text-white dark:hover:bg-[#FFC107] dark:hover:text-black transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>

        <img
          src={certificate.preview_url || "/images/pre1.png"}
          alt="Certificate"
          onClick={onView}
          className="w-full cursor-pointer object-contain blur-[6px] transition duration-500 hover:blur-none"
        />
      </div>
    </div>
  );
}