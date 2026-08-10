"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  payment: any;
  onClose: () => void;
  refresh: () => void;
}

export default function RejectPaymentModal({
  open,
  payment,
  onClose,
  refresh,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  if (!open || !payment) return null;

  const handleReject = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/payments/${payment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: "Rejected",
          reason,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reject payment");
      }

      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to reject payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Compact Header */}
        {/* Full Width Gradient Header */}
        <div className="bg-gradient-to-r from-[#7A8127] via-[#B89A15] to-[#FFC107] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
              ❌
            </div>

            <h2 className="text-white text-lg font-semibold">Reject Payment</h2>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Compact Body */}
        <div className="p-5 space-y-4 text-[12.5px]">
          <p className="text-gray-600 text-sm">
            Are you sure you want to reject this payment?
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 block">
              REJECTION REASON
            </label>
            <textarea
              rows={3}
              placeholder="Enter reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#7A8127] focus:ring-2 focus:ring-[#FFC107]/30 resize-y min-h-[100px]"
            />
          </div>
        </div>

        {/* Compact Footer */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-2xl border border-[#D9D9D9] bg-white text-[#6B7280] text-xs font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleReject}
            disabled={loading || !reason.trim()}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#7A8127] via-[#B89A15] to-[#FFC107] text-white text-xs font-semibold shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Rejecting..." : "Reject Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
