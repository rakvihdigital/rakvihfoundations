"use client";

import { Trash2, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
  certificate: any;
}

export default function DeleteCertificateModal({
  open,
  onClose,
  onDelete,
  loading,
  certificate,
}: Props) {
  if (!open || !certificate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#0F172A]">

        <div className="flex items-center justify-between border-b dark:border-slate-700 p-4">

          <h2 className="text-sm font-semibold">
            Delete Certificate
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>

        </div>

        <div className="p-4">

          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2
                size={22}
                className="text-red-600"
              />
            </div>
          </div>

          <p className="text-center text-sm font-medium">
            Delete this certificate?
          </p>

          <p className="text-center text-xs text-gray-500 mt-2">
            This action cannot be undone.
          </p>

          <div className="mt-5 flex justify-end gap-2">

            <button
              onClick={onClose}
              className="h-9 px-4 rounded-lg border text-xs"
            >
              Cancel
            </button>

            <button
              onClick={onDelete}
              disabled={loading}
              className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}