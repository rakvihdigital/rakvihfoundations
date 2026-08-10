"use client";

import Image from "next/image";
import { Download, Upload, CheckCircle } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  file_url: string;
  thumbnail?: string;
  submitted?: boolean;
}

interface Props {
  assignment: Assignment;
  onView: () => void;
}

export default function AssignmentCard({ assignment, onView }: Props) {
  const handleDownload = async () => {
    try {
      const response = await fetch(assignment.file_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${assignment.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div
      onClick={onView}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={assignment.thumbnail || "/images/assignments-placeholder.png"}
          alt={assignment.title}
          className="h-full w-full object-cover"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
            Click
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 flex-1 text-xs font-semibold text-[#24310F] dark:text-white">
            {assignment.title}
          </h3>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8ECE5] dark:border-neutral-800 text-[#24310F] dark:text-white transition hover:bg-[#F8FAF3] dark:hover:bg-neutral-800"
              title="Download"
            >
              <Download size={14} />
            </button>

            {/* Upload / Submitted */}
            {assignment.submitted ? (
              <div
                className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                title="Submitted"
              >
                <CheckCircle size={12} />
                Submitted
              </div>
            ) : (
              <button
                onClick={onView}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8ECE5] dark:border-neutral-800 text-[#FFC107] transition hover:bg-[#FFF8E1] dark:hover:bg-yellow-900/20"
                title="Upload Assignment"
              >
                <Upload size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}