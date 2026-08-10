"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
  data: SubAdmin[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (admin: SubAdmin) => void;
  onView: (admin: SubAdmin) => void;
}

export default function SubAdminTable({
  data,
  loading,
  onDelete,
  onEdit,
  onView,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-14 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading Sub Admins...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm scrollbar-thin scrollbar-thumb-[#6B7328]">

      <table className="w-full text-[11px]">

        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Employee ID
            </th>

            <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Name
            </th>

            <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Department
            </th>

            <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Status
            </th>

            <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Created
            </th>

            <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-14 text-center text-sm text-gray-500"
              >
                No Sub Admins Found
              </td>
            </tr>
          ) : (
            data.map((admin) => (
              <motion.tr
                key={admin.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{
                  backgroundColor: "rgba(249,250,251,.8)",
                }}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                {/* Employee ID */}
                <td className="px-4 py-3">
                  <span className="text-[11px] font-semibold text-[#6B7328]">
                    {admin.employee_id}
                  </span>
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
                      {admin.full_name}
                    </span>

                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      {admin.email}
                    </span>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3">
                  <span className="text-[11px] text-gray-700 dark:text-gray-300">
                    {admin.department}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      admin.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>

                {/* Created */}
                <td className="px-4 py-3 text-center">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {new Date(admin.created_at).toLocaleDateString("en-GB")}
                  </span>
                </td>

                {/* Actions */}
         <td className="px-4 py-3">
  <div className="flex items-center justify-center gap-3.5">
          <motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => onView(admin)}
  className="rounded-lg border border-blue-200 bg-blue-50 p-2 transition-all hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20"
>
  <Eye size={15} className="text-blue-600 dark:text-blue-400" />
</motion.button>

<motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => onEdit(admin)}
  className="rounded-lg border border-yellow-200 bg-yellow-50 p-2 transition-all hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20"
>
  <Pencil size={15} className="text-yellow-600 dark:text-yellow-400" />
</motion.button>

<motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => onDelete(admin.id)}
  className="rounded-lg border border-red-200 bg-red-50 p-2 transition-all hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20"
>
  <Trash2 size={15} className="text-red-600 dark:text-red-400" />
</motion.button>          
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}