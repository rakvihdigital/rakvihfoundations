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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2">
      <div className="w-full max-w-[820px] rounded-2xl bg-white dark:bg-[#0F172A] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-slate-700 px-4 py-2">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
            Certificate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
          
          {/* PDF Preview - Much Smaller */}
          <div className="border rounded-xl overflow-hidden h-[360px] bg-gray-50 dark:bg-slate-900">
            <iframe
              src={certificate.certificate_url}
              className="w-full h-full"
              title="Certificate Preview"
            />
          </div>

          {/* Details - Super Small + Scrollbar */}
          <div className="max-h-[360px] overflow-y-auto pr-2 custom-scrollbar space-y-3 text-xs">
            
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                STUDENT
              </p>
              <p className="font-medium text-sm leading-tight break-words">
                {certificate.enrollments?.full_name}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                EMAIL
              </p>
              <p className="text-sm leading-tight break-words">{certificate.enrollments?.email}</p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                PROGRAM
              </p>
              <p className="text-sm leading-tight">{certificate.programs?.title}</p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                CERT NO
              </p>
              <p className="font-mono text-sm">{certificate.certificate_number}</p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                TITLE
              </p>
              <p className="text-sm">{certificate.title}</p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                ISSUE DATE
              </p>
              <p className="text-sm">{certificate.issue_date}</p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-0.5">
                STATUS
              </p>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium
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
        <div className="flex justify-end gap-2 border-t dark:border-slate-700 px-4 py-2.5">
          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1.5 transition font-medium"
          >
            <Download size={14} />
            Download
          </a>

          <button
            onClick={onClose}
            className="h-8 px-4 rounded-lg border border-gray-300 dark:border-slate-600 text-xs font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}