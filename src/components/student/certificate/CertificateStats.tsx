"use client";

import {
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Props {
  total: number;
  progress: number;
  hasCertificate: boolean;
}

export default function CertificateStats({
  total,
  progress,
  hasCertificate
}: Props) {
  const getStatus = () => {
    if (progress < 100) {
      return {
        text: "In Progress",
        icon: <Clock className="h-8 w-8 text-[#FFC107]" />,
        bg: "bg-[#FFF8E1] dark:bg-yellow-900/20",
      };
    }

    if (hasCertificate) {
      return {
        text: "Certificate Generated",
        icon: <Award className="h-8 w-8 text-[#8A8A1E] dark:text-[#FFC107]" />,
        bg: "bg-green-100 dark:bg-green-900/20",
      };
    }

    return {
      text: "Waiting for Admin",
      icon: <CheckCircle className="h-8 w-8 text-[#FFC107]" />,
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
    };
  };

  const current = getStatus();

  return (
    <div className="grid gap-6 lg:grid-cols-3">

      {/* Progress */}

      <div className="rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Internship Progress
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#8A8A1E] dark:text-white">
              {progress}%
            </h2>
          </div>

          <div className="rounded-2xl bg-[#FFF8E1] dark:bg-yellow-900/20 p-3">
            <TrendingUp className="h-8 w-8 text-[#FFC107]" />
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-[#FFC107] transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Certificates */}

      <div className="rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Certificates
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#8A8A1E] dark:text-white">
              {total}
            </h2>
          </div>

          <div className="rounded-2xl bg-[#FFF8E1] dark:bg-yellow-900/20 p-3">
            <Award className="h-8 w-8 text-[#FFC107]" />
          </div>

        </div>
      </div>

      {/* Status */}

      <div className="rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Certificate Status
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#8A8A1E] dark:text-white">
              {current.text}
            </h2>
          </div>

          <div className={`rounded-2xl p-3 ${current.bg}`}>
            {current.icon}
          </div>

        </div>
      </div>

    </div>
  );
}