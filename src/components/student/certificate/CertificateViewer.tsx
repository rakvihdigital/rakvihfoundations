"use client";

import { X, Download, ExternalLink } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  certificateUrl: string;
}

export default function CertificateViewer({
  open,
  onClose,
  certificateUrl,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-2xl transition-colors duration-300">

        {/* Small Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 bg-gradient-to-r from-[#8A8A1E] to-[#FFC107] px-5 py-3 text-white dark:text-black">

          <div>
            <h2 className="text-lg font-bold">Internship Certificate</h2>
            <p className="text-xs text-yellow-100 dark:text-black/70">View & Download</p>
          </div>

          <div className="flex items-center gap-2">

            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white/20 dark:bg-black/10 p-2 text-white dark:text-black transition hover:bg-white/30 dark:hover:bg-black/20"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <a
              href={certificateUrl}
              download
              className="flex items-center gap-1.5 rounded-xl bg-white dark:bg-black px-4 py-2 text-xs font-semibold text-[#8A8A1E] dark:text-[#FFC107] transition hover:bg-yellow-50 dark:hover:bg-neutral-900"
            >
              <Download className="h-4 w-4" />
              Download
            </a>

            <button
              onClick={onClose}
              className="rounded-xl bg-white/20 dark:bg-black/10 p-2 text-white dark:text-black transition hover:bg-white/30 dark:hover:bg-black/20"
            >
              <X className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* PDF Viewer */}
        <iframe
          src={certificateUrl}
          title="Certificate"
          className="h-full w-full bg-white dark:bg-[#0a0a0a]"
        />

      </div>
    </div>
  );
}