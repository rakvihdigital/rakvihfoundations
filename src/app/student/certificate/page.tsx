"use client";

import { useState } from "react";

import useStudentCertificates from "@/hooks/useStudentCertificates";

import CertificateHero from "@/components/student/certificate/CertificateHero";
import CertificateEmpty from "@/components/student/certificate/CertificateEmpty";
import CertificateViewer from "@/components/student/certificate/CertificateViewer";
import CertificatePreview from "@/components/student/certificate/CertificatePreview";

export default function StudentCertificatePage() {
  const {
    certificates,
    loading,
    progress,
    hasCertificate,
  } = useStudentCertificates();

  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const handleView = (certificate: any) => {
    setSelectedCertificate(certificate);
    setViewerOpen(true);
  };

  const handleClose = () => {
    setViewerOpen(false);
    setSelectedCertificate(null);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-gray-200 dark:bg-neutral-800" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-neutral-800" />
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-neutral-800" />
        </div>
        <div className="h-[420px] rounded-2xl bg-gray-200 dark:bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs">

      <CertificateHero />

      {/* Progress Less Than 100% */}
      {progress < 100 && (
        <div className="rounded-2xl border border-[#FFC107]/40 bg-white p-6 shadow dark:border-neutral-800 dark:bg-[#0a0a0a]">

          <h2 className="text-xl font-bold text-[#8A8A1E] dark:text-[#FFC107]">
            🔒 Certificate Locked
          </h2>

          <p className="mt-2 text-gray-600 text-[13px] dark:text-neutral-300">
            Complete all modules, videos, and assignments to unlock your certificate.
          </p>

          <div className="mt-5 overflow-hidden rounded-full bg-gray-200 h-2.5 dark:bg-neutral-800">
            <div
              className="h-2.5 rounded-full bg-[#FFC107]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-[13px] font-semibold text-[#8A8A1E] dark:text-[#FFC107]">
            {progress}% Completed
          </p>

          <div className="mt-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-neutral-800 dark:bg-[#171717]">
            <img
              src="/images/certificate-preview.png"
              alt="Certificate"
              className="mx-auto h-44 rounded-xl opacity-40 blur-[2px]"
            />

            <h3 className="mt-4 text-base font-bold text-gray-800 dark:text-white">
              Complete 100% to Unlock
            </h3>
            
            <button
              disabled
              className="mt-4 w-full rounded-xl bg-gray-300 py-2.5 text-xs font-semibold text-white cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-500"
            >
              View Certificate
            </button>
          </div>
        </div>
      )}

      {/* Waiting for Admin Approval */}

      {/* Generated Certificate */}
      {hasCertificate && certificates.length > 0 && (
        <div className="mx-auto max-w-5xl">
          <CertificatePreview
            certificate={certificates[0]}
            onView={() => handleView(certificates[0])}
          />
        </div>
      )}

      {selectedCertificate && (
        <CertificateViewer
          open={viewerOpen}
          onClose={handleClose}
          certificateUrl={selectedCertificate.certificate_url}
        />
      )}

    </div>
  );
}