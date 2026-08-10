"use client";

import { Trash2, X, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
  refresh: () => void;
}

export default function DeleteAssignmentModal({
  open,
  onClose,
  assignment,
  refresh,
}: DeleteAssignmentModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !assignment) return null;

  async function handleDelete() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/assignments/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: assignment.id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Unable to delete assignment.");
        return;
      }

      alert("Assignment deleted successfully.");

      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-md rounded-3xl overflow-hidden bg-white dark:bg-[#0B1C33] shadow-2xl">

        {/* Header */}

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Delete Assignment
            </h2>

            <p className="text-white/80 text-sm mt-1">
              This action cannot be undone.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            <X className="text-white" size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-8">

          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto flex items-center justify-center">
            <Trash2
              size={40}
              className="text-red-600"
            />
          </div>

          <h3 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Delete this assignment?
          </h3>

          <p className="mt-4 text-center text-gray-500 dark:text-gray-400 leading-7">

            You are about to permanently delete

            <span className="block mt-2 font-semibold text-[#6B7328] dark:text-[#FACC15]">

              "{assignment.title}"

            </span>

            This action cannot be undone.

          </p>

          <div className="mt-8 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">

            <p className="text-sm text-red-700 dark:text-red-300">
              • The assignment record will be removed.
            </p>

            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              • The uploaded file will also be deleted from Storage.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-gray-200 dark:border-slate-700 px-8 py-5 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#081525] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete Assignment
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}