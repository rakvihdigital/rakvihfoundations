"use client";

import { Download, ExternalLink, FileText } from "lucide-react";

interface Props {
  title: string;
  fileUrl: string;
}

export default function MaterialViewer({ title, fileUrl }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8ECE5] dark:border-neutral-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF6D8] dark:bg-neutral-900">
            <FileText
              size={22}
              className="text-[#6B7328] dark:text-[#FFC107]"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#24310F] dark:text-white">
              {title}
            </h2>

            <p className="text-xs text-gray-500 dark:text-neutral-400">
              PDF Document
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-[#E8ECE5] dark:border-neutral-800 px-4 py-2 text-xs font-medium text-[#24310F] transition hover:bg-[#F8FAF3] dark:text-white dark:hover:bg-neutral-800"
          >
            <ExternalLink size={15} />
            Open
          </a>

          <a
            href={fileUrl}
            download
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B6E24] via-[#6B7328] to-[#FFC107] px-4 py-2 text-xs font-semibold text-white dark:text-black transition hover:scale-105"
          >
            <Download size={15} />
            Download
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="h-[80vh] w-full bg-[#F8FAF3] dark:bg-[#0a0a0a]">
        <iframe
          src={fileUrl}
          title={title}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}