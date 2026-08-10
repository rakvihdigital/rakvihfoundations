"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  payment: any;
  onClose: () => void;
  refresh: () => void;
}

export default function ApprovePaymentModal({
  open,
  payment,
  onClose,
  refresh,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !payment) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/payments/${payment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: "Completed",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to approve payment");
      }

      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to approve payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Compact Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white rounded-3xl px-4 py-2.5">
            <div className="w-6 h-6 bg-white/20 rounded-2xl flex items-center justify-center text-lg">
              💰
            </div>
            <h2 className="text-base font-semibold">Approve Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Compact Body */}
        <div className="p-5 space-y-4 text-[12.5px]">
          <p className="text-gray-600 text-sm">
            Are you sure you want to approve this payment?
          </p>

          <div className="rounded-2xl border border-[#E8ECE5] bg-[#F8F9F5] p-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Student</span>
              <span className="font-medium text-[#24310F]">
                {payment.enrollments?.full_name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Program</span>
              <span className="font-medium text-[#24310F]">
                {payment.enrollments?.program_title || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-[#6B7328]">₹{payment.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono text-[10.5px] text-gray-600 break-all">
                {payment.transaction_id || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 text-xs font-medium rounded-2xl border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-6 py-2 text-xs font-semibold rounded-2xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white hover:brightness-105 transition disabled:opacity-70"
          >
            {loading ? "Approving..." : "Approve Payment"}
          </button>
        </div>

      </div>
    </div>
  );
}