"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Download,
  Trash2,
  FileBadge,
  Award,
  User,
} from "lucide-react";

interface Props {
  certificates: any[];
  onView: (certificate: any) => void;
  onDelete: (certificate: any) => void;
}

export default function CertificateTable({
  certificates,
  onView,
  onDelete,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-[#ECE7DB]
        bg-white
        dark:bg-[#0F172A]
        dark:border-slate-700
        shadow-[0_8px_25px_rgba(0,0,0,0.08)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#707A21] via-[#9A8C1A] to-[#FFC107] px-6 py-4">

        <div>
          <h2 className="text-xl font-bold text-white">
            Certificates
          </h2>
          <p className="text-[10px] text-yellow-100">
            Manage all certificates
          </p>
        </div>

        <div className="rounded-xl bg-white/20 px-3 py-1 text-xs font-semibold text-white">
          {certificates.length} Total
        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-[#ECE7DB] bg-[#FAFAF6] dark:bg-slate-900 dark:border-slate-700">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Student
              </th>
              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Email
              </th>
              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Program
              </th>
              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Certificate
              </th>
              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Date
              </th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Status
              </th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {certificates.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Award size={32} className="text-[#707A21]" />
                    <p className="text-sm text-gray-500">No certificates found</p>
                  </div>
                </td>
              </tr>
            )}

            {certificates.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="
                  border-b border-[#F3F4F6] dark:border-slate-700
                  hover:bg-[#FCFCF8] dark:hover:bg-slate-800/40
                  transition-all duration-300
                "
              >
                {/* Student */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F7F5EA]">
                      <User size={15} className="text-[#707A21]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-[#374151] dark:text-white">
                        {item.enrollments?.full_name}
                      </h4>
                      <span className="text-[9px] text-gray-500">Student</span>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-3 py-3">
                  <span className="text-[11px] text-gray-600 dark:text-slate-300">
                    {item.enrollments?.email}
                  </span>
                </td>

                {/* Program */}
                <td className="px-3 py-3">
                  <span className="text-[11px] font-medium text-[#374151] dark:text-white">
                    {item.programs?.title}
                  </span>
                </td>

                {/* Certificate */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF7DE]">
                      <FileBadge size={14} className="text-[#D6A400]" />
                    </div>
                    <span className="text-[11px] font-medium text-[#374151] dark:text-white">
                      {item.title}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-3 py-3">
                  <span className="text-[11px] text-gray-600 dark:text-slate-300">
                    {item.issue_date}
                  </span>
                </td>

                {/* Status */}
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      item.status === "Issued"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    >
                      <Eye size={13} />
                    </button>

                    <a
                      href={item.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                    >
                      <Download size={13} />
                    </a>

                    <button
                      onClick={() => onDelete(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}