"use client";

import { X, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  certificate: any;
}

export default function ViewCertificateModal({
  open,
  onClose,
  certificate,
}: Props) {
  if (!open || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white dark:bg-[#0F172A] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-slate-700 px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-slate-400">
            Certificate Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
          {/* PDF Preview */}
          <div className="border rounded-xl overflow-hidden h-[520px] bg-gray-50 dark:bg-slate-900">
            <iframe
              src={certificate.certificate_url}
              className="w-full h-full"
              title="Certificate Preview"
            />
          </div>

          {/* Details Sidebar - Smaller Text */}
          <div className="space-y-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Student
              </p>
              <p className="font-medium text-sm">
                {certificate.enrollments?.full_name}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Email
              </p>
              <p className="text-sm">{certificate.enrollments?.email}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Program
              </p>
              <p className="text-sm">{certificate.programs?.title}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Certificate No
              </p>
              <p className="font-mono text-sm">{certificate.certificate_number}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Title
              </p>
              <p className="text-sm">{certificate.title}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Issue Date
              </p>
              <p className="text-sm">{certificate.issue_date}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-0.5">
                Status
              </p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-[10px] font-medium
                ${
                  certificate.status === "Issued"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {certificate.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t dark:border-slate-700 px-5 py-4">
          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-2 transition font-medium"
          >
            <Download size={15} />
            Download PDF
          </a>

          <button
            onClick={onClose}
            className="h-9 px-5 rounded-lg border border-gray-300 dark:border-slate-600 text-xs font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}