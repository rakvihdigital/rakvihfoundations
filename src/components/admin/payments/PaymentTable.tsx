"use client";

import { useMemo, useState } from "react";
import { Eye, Check, X } from "lucide-react";

import ViewPaymentModal from "./ViewPaymentModal";
import ApprovePaymentModal from "./ApprovePaymentModal";
import RejectPaymentModal from "./RejectPaymentModal";

interface PaymentTableProps {
  payments: any[];
  loading: boolean;
  refresh: () => void;
}

export default function PaymentTable({
  payments,
  loading,
  refresh,
}: PaymentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const currentPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return payments.slice(start, start + itemsPerPage);
  }, [payments, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Pending":
        return "bg-[#FFC107]/10 text-[#6B7328] border border-[#FFC107]/30";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] p-6">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gradient-to-r from-[#6B7328]/20 to-[#FFC107]/20 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E8ECE5] dark:border-[#1E3A5F] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-8 py-5 border-b bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white">
          <div>
            <h1 className="text-xl font-semibold">Payments</h1>
            <p className="text-xs text-white/80 mt-0.5">
              Manage and track all student payments
            </p>
          </div>
          <div className="text-xs font-medium bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-sm">
            Total Payments: {payments.length}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[920px] text-[11px]">
            <thead className="bg-[#F8F9F5] dark:bg-[#1E3A5F]">
              <tr className="text-left text-[10px] font-semibold uppercase tracking-widest text-[#6B7328] dark:text-[#38BDF8]">
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Course</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-3 py-3.5">Transaction ID</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8ECE5] dark:divide-[#1E3A5F]">
              {currentPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center text-gray-500 text-sm"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment: any) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-[#F8FAF5] dark:hover:bg-[#132238] transition-all duration-200 group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-[#24310F] dark:text-white">
                          {payment.enrollments?.full_name ?? "-"}
                        </span>
                        <span className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {payment.enrollments?.email ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 text-[10.5px]">
                      {payment.enrollments?.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 text-[10.5px] max-w-[150px] truncate">
                      {payment.enrollments?.program_title ?? "-"}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#6B7328] text-[13px]">
                      ₹{payment.amount}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-[10.5px] font-medium text-[#24310F] dark:text-white truncate max-w-[110px]">
                          {payment.transaction_id ?? "-"}
                        </span>
                        <span className="mt-0.5 text-[9px] text-gray-500 dark:text-gray-400 uppercase">
                          {payment.payment_method ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[10.5px] text-gray-600 dark:text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold ${getStatusColor(
                          payment.payment_status
                        )}`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setViewOpen(true);
                          }}
                          className="p-2 rounded-xl text-[#6B7328] hover:text-white hover:bg-gradient-to-br hover:from-[#6B7328] hover:to-[#FFC107] transition-all active:scale-95"
                        >
                          <Eye size={15} />
                        </button>

                     <button
  disabled={payment.payment_status === "Completed"}
  onClick={() => {
    if (payment.payment_status === "Completed") {
      return;
    }

    setSelectedPayment(payment);
    setApproveOpen(true);
  }}
  className={`p-2 rounded-xl transition-all active:scale-95 ${
    payment.payment_status === "Completed"
      ? "bg-green-100 text-green-600 opacity-60 cursor-not-allowed"
      : "text-[#6B7328] hover:text-white hover:bg-gradient-to-br hover:from-[#6B7328] hover:to-[#FFC107]"
  }`}
>
  <Check size={15} />
</button>

                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setRejectOpen(true);
                          }}
                          className="p-2 rounded-xl text-[#6B7328] hover:text-white hover:bg-gradient-to-br hover:from-[#6B7328] hover:to-[#FFC107] transition-all active:scale-95"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E8E8E8] bg-white dark:bg-[#0F172A] p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-2xl border border-[#E8E8E8] px-4 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-2xl text-xs font-semibold transition ${currentPage === i + 1 ? "bg-[#6B7328] text-white" : "border border-[#E8E8E8] hover:bg-gray-100 dark:hover:bg-[#1E3A5F]"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded-2xl border border-[#E8E8E8] px-4 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewPaymentModal
        open={viewOpen}
        payment={selectedPayment}
        onClose={() => {
          setViewOpen(false);
          setSelectedPayment(null);
        }}
      />
      <ApprovePaymentModal
        open={approveOpen}
        payment={selectedPayment}
        onClose={() => {
          setApproveOpen(false);
          setSelectedPayment(null);
        }}
        refresh={refresh}
      />
      <RejectPaymentModal
        open={rejectOpen}
        payment={selectedPayment}
        onClose={() => {
          setRejectOpen(false);
          setSelectedPayment(null);
        }}
        refresh={refresh}
      />
    </>
  );
}