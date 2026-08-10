"use client";

import { X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Permission {
  dashboard: boolean;
  students: boolean;
  programs: boolean;
  payments: boolean;
  videos: boolean;
  materials: boolean;
  assignments: boolean;
  certificates: boolean;
  reports: boolean;
  settings: boolean;
}

interface SubAdmin {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  employee_id: string;
  department: string;
  status: string;
  role: string;
  created_at: string;
  admin_permissions: Permission[];
}

interface Props {
  open: boolean;
  admin: SubAdmin | null;
  onClose: () => void;
}

export default function ViewSubAdminModal({
  open,
  admin,
  onClose,
}: Props) {
  if (!admin) return null;

  const permissions = admin.admin_permissions?.[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl relative scrollbar-thin scrollbar-thumb-[#6B7328] scrollbar-track-transparent"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B7328] to-[#FFC107] text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Sub Admin Details</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profile & Permissions</p>
                </div>
              </div>

              {/* Prominent Close Button */}
              <button
                onClick={onClose}
                className="absolute right-5 top-5 rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
              >
                <X size={18} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(92vh-130px)] scrollbar-thin scrollbar-thumb-[#6B7328] scrollbar-track-transparent">

              {/* Small Profile Icon */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B7328] to-[#FFC107] text-2xl font-bold text-white shadow">
                  {admin.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{admin.full_name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Employee ID</p>
                  <p className="mt-1 font-medium text-[#6B7328]">{admin.employee_id}</p>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Phone</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{admin.phone}</p>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Department</p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{admin.department}</p>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Status</p>
                  <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-medium ${
                    admin.status === "Active" 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" 
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}>
                    {admin.status}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Created On</p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {new Date(admin.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Permissions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { name: "Dashboard", value: permissions?.dashboard },
                    { name: "Students", value: permissions?.students },
                    { name: "Programs", value: permissions?.programs },
                    { name: "Payments", value: permissions?.payments },
                    { name: "Videos", value: permissions?.videos },
                    { name: "Materials", value: permissions?.materials },
                    { name: "Assignments", value: permissions?.assignments },
                    { name: "Certificates", value: permissions?.certificates },
                    { name: "Reports", value: permissions?.reports },
                    { name: "Settings", value: permissions?.settings },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className={`rounded-xl border p-3 text-center text-xs transition-all ${
                        p.value
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30"
                      }`}
                    >
                      <p className="font-medium text-gray-700 dark:text-gray-300">{p.name}</p>
                      <p className={`mt-1 font-bold text-[11px] ${p.value ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {p.value ? "ENABLED" : "DISABLED"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-6 py-2 text-xs font-medium text-white hover:brightness-110 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}