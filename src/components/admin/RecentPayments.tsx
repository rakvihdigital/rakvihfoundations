"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: number;
  student_name: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

export default function RecentPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function loadPayments() {
      const res = await fetch("/api/admin/dashboard/recent-payments");
      const data = await res.json();
      setPayments(data);
    }

    loadPayments();
  }, []);

  return (
    <div className="bg-white dark:bg-[#081525] 
                    border border-gray-100 dark:border-blue-950 
                    rounded-2xl shadow-md p-3.5 h-full">

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">
          Recent Payments
        </h2>
        <a
          href="/admin/payments"
          className="text-xs font-semibold text-[#E7B417] hover:underline"
        >
          View All
        </a>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-slate-400 text-xs">
          No payments found.
        </div>
      ) : (
        <div className="max-h-[230px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-blue-900/60 
                         bg-white dark:bg-[#081525] p-3 hover:border-[#E7B417] transition-all"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                  {payment.student_name}
                </h3>
                <p className="text-xs font-medium text-[#E7B417]">
                  ₹{payment.amount}
                </p>
              </div>

         <span
  className={`rounded-full px-3 py-0.5 text-[9px] font-semibold whitespace-nowrap ${
    payment.payment_status === "Completed" ||
    payment.payment_status === "Paid"
      ? "bg-gradient-to-r from-[#798321] via-[#A58C1A] to-[#E7B417] text-white"
      : "bg-[#E7B417] text-black"
  }`}
>
  {payment.payment_status}
</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}