"use client";

import { Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  studentName: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteStudentModal({
  open,
  studentName,
  onClose,
  onDelete,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl w-full max-w-xs border border-[#E8ECE5] dark:border-[#1E3A5F] overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B7328] to-[#FFC107] flex items-center justify-center mb-5">
            <Trash2 className="text-white" size={24} />
          </div>

          <h2 className="text-sm font-bold text-[#24310F] dark:text-white">Delete Student</h2>
          
          <p className="text-[11px] text-[#6B7280] mt-2 leading-tight">
            Are you sure you want to delete <br />
            <span className="font-semibold text-[#6B7328]">{studentName}</span>?
          </p>

          <p className="text-[10px] text-red-600 font-medium mt-3">This action cannot be undone.</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-medium border border-[#E8ECE5] dark:border-[#1E3A5F] rounded-2xl hover:bg-gray-100 dark:hover:bg-[#132238]"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-2.5 text-xs font-medium bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white rounded-2xl hover:brightness-110 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}