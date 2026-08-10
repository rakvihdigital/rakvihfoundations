"use client";

import {
  X,
  FileText,
  Download,
  Calendar,
  BookOpen,
  HardDrive,
  Eye,
  FolderOpen,
  Layers,
  CheckCircle,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  assignment: any;
}

export default function ViewAssignmentModal({
  open,
  onClose,
  assignment,
}: Props) {
  if (!open || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-[#0B1C33] shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Assignment Details</h2>
            <p className="text-white/90 text-xs mt-1">Complete assignment information</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* First Row: Very Small Image + 3 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Very Small Image */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-md">
                <img
                  src={assignment.thumbnail || "/images/assign.png"}
                  alt={assignment.title}
                  className="w-full h-44 object-cover"   // ← Very Small Size
                />
              </div>
            </div>

            {/* First 3 Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard
                icon={<BookOpen size={17} />}
                label="Program"
                value={assignment.programs?.title}
              />
              <InfoCard
                icon={<Layers size={17} />}
                label="Module"
                value={assignment.syllabus?.module_name}
              />
              <InfoCard
                icon={<FolderOpen size={17} />}
                label="Topic"
                value={assignment.topics?.topic}
              />
            </div>
          </div>

          {/* Second Row: Next 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={<FileText size={17} />}
              label="Assignment Title"
              value={assignment.title}
            />
            <InfoCard
              icon={<HardDrive size={17} />}
              label="Assignment Type"
              value={assignment.file_type}
            />
            <InfoCard
              icon={<CheckCircle size={17} />}
              label="Status"
              value={assignment.status}
            />
          </div>

          {/* Remaining Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={<Calendar size={17} />}
              label="Due Date"
              value={
                assignment.due_date
                  ? new Date(assignment.due_date).toLocaleDateString("en-IN")
                  : "-"
              }
            />
            <InfoCard
              icon={<HardDrive size={17} />}
              label="File Name"
              value={assignment.file_name}
            />
            <InfoCard
              icon={<HardDrive size={17} />}
              label="File Size"
              value={assignment.file_size}
            />
            <InfoCard
              icon={<Download size={17} />}
              label="Downloads"
              value={assignment.downloads ?? 0}
            />
            <InfoCard
              icon={<Calendar size={17} />}
              label="Created On"
              value={
                assignment.created_at
                  ? new Date(assignment.created_at).toLocaleDateString("en-IN")
                  : "-"
              }
            />
            <InfoCard
              icon={<Calendar size={17} />}
              label="Updated On"
              value={
                assignment.updated_at
                  ? new Date(assignment.updated_at).toLocaleDateString("en-IN")
                  : "-"
              }
            />
            <InfoCard
              icon={<FileText size={17} />}
              label="Thumbnail"
              value={assignment.thumbnail ? "Available" : "Not Available"}
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-[#24310F] dark:text-white mb-3">Description</h3>
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#081525] p-5">
              <p className="leading-relaxed text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {assignment.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Current File Information */}
          <div className="rounded-2xl border border-[#E8ECE5] dark:border-slate-700 bg-[#F8FAF3] dark:bg-[#081525] p-5">
            <h3 className="text-sm font-semibold text-[#24310F] dark:text-white mb-4">Current File Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">File Name</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white break-all">
                  {assignment.file_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">File Size</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {assignment.file_size || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Type</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {assignment.file_type || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Downloads</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {assignment.downloads ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-gray-300 dark:border-slate-600 font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Close
            </button>

            {assignment.file_url && (
              <a
                href={assignment.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-5 py-2.5 font-medium text-sm text-white hover:scale-105 transition"
              >
                <Eye size={17} />
                Preview
              </a>
            )}

            {assignment.file_url && (
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(assignment.file_url);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = assignment.file_name || "assignment";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error(error);
                    alert("Unable to download file.");
                  }
                }}
                className="flex items-center gap-2 rounded-2xl border border-[#6B7328] px-5 py-2.5 font-medium text-sm text-[#6B7328] dark:text-[#FACC15] hover:bg-[#6B7328] hover:text-white transition"
              >
                <Download size={17} />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#081525] p-4 hover:shadow transition h-full">
      <div className="flex items-center gap-3 text-[#6B7328]">
        <div className="w-8 h-8 rounded-xl bg-[#EEF5DD] dark:bg-[#1F2B16] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white break-words">
        {value ?? "-"}
      </p>
    </div>
  );
}