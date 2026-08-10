"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  payment: any;
  onClose: () => void;
}

export default function ViewPaymentModal({
  open,
  payment,
  onClose,
}: Props) {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Compact Header */}
        <div className="bg-gradient-to-r from-[#6B7328] via-[#798321] to-[#FFC107] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/25 rounded-2xl flex items-center justify-center text-xl">
              💰
            </div>
            <h2 className="text-white text-base font-semibold">Payment Details</h2>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-xl transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Very Compact Body */}
        <div className="p-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">

            {/* Student */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Student</p>
              <p className="mt-0.5 text-[12px] font-semibold text-[#24310F]">
                {payment.enrollments?.full_name || "-"}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Email</p>
              <p className="mt-0.5 text-[10.5px] break-all text-[#24310F]">
                {payment.enrollments?.email || "-"}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Phone</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#24310F]">
                {payment.enrollments?.phone || "-"}
              </p>
            </div>

            {/* Course */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Course</p>
              <p className="mt-0.5 text-[11px] font-medium text-[#24310F] line-clamp-2">
                {payment.enrollments?.program_title || payment.enrollments?.programs?.title || "-"}
              </p>
            </div>

            {/* Amount */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Amount</p>
              <p className="mt-0.5 text-[15px] font-bold text-[#6B7328]">
                ₹{payment.amount}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Status</p>
              <span
                className={`mt-1.5 inline-flex rounded-full px-3 py-0.5 text-[10px] font-semibold ${
                  payment.payment_status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : payment.payment_status === "Pending"
                    ? "bg-[#FFC107]/10 text-[#6B7328]"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {payment.payment_status}
              </span>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Payment Method</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#24310F] uppercase">
                {payment.payment_method || "-"}
              </p>

              {payment.receipt_url && (
                <a
                  href={payment.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-xl bg-[#6B7328] px-3 py-1 text-[10px] font-medium text-white hover:bg-[#55601f]"
                >
                  View Screenshot
                </a>
              )}
            </div>

            {/* Payment Date */}
            <div className="rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Payment Date</p>
              <p className="mt-0.5 text-[11px] font-medium text-[#24310F]">
                {new Date(payment.created_at).toLocaleDateString("en-GB")}
              </p>
            </div>

            {/* Transaction ID - Full Width */}
            <div className="col-span-2 rounded-2xl bg-[#F8FAF5] p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-500">Transaction ID</p>
              <p className="mt-0.5 break-all font-mono text-[11px] text-[#24310F]">
                {payment.transaction_id || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 flex justify-end border-t bg-white">
          <button
            onClick={onClose}
            className="rounded-2xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-8 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}