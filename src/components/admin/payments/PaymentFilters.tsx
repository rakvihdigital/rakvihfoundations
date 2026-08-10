"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentFiltersProps {
  payments: any[];
  setFilteredPayments: (payments: any[]) => void;
}

export default function PaymentFilters({
  payments,
  setFilteredPayments,
}: PaymentFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [method, setMethod] = useState("All");

  useEffect(() => {
    let filtered = [...payments];

    // Search
    if (search.trim()) {
      filtered = filtered.filter((payment) =>
        payment.enrollments?.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Status Filter
    if (status !== "All") {
      filtered = filtered.filter(
        (payment) => payment.payment_status === status
      );
    }

    // Payment Method Filter
    if (method !== "All") {
      filtered = filtered.filter(
        (payment) => payment.payment_method === method
      );
    }

    setFilteredPayments(filtered);
  }, [search, status, method, payments, setFilteredPayments]);

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setMethod("All");
    setFilteredPayments(payments);
  };

  return (
    <div className="rounded-3xl border border-[#E8ECE5] dark:border-slate-700 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7328] dark:text-[#FFC107]"
          />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-xl
              border border-gray-200 dark:border-slate-600
              bg-white dark:bg-[#1E293B]
              text-[#24310F] dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-slate-400
              py-2.5 pl-10 pr-3
              text-xs
              outline-none
              focus:border-[#6B7328]
              focus:ring-2 focus:ring-[#6B7328]/20
            "
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            rounded-xl
            border border-gray-200 dark:border-slate-600
            bg-white dark:bg-[#1E293B]
            text-[#24310F] dark:text-white
            px-3 py-2.5
            text-xs
            outline-none
            focus:border-[#6B7328]
            focus:ring-2 focus:ring-[#6B7328]/20
          "
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        {/* Method */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="
            rounded-xl
            border border-gray-200 dark:border-slate-600
            bg-white dark:bg-[#1E293B]
            text-[#24310F] dark:text-white
            px-3 py-2.5
            text-xs
            outline-none
            focus:border-[#6B7328]
            focus:ring-2 focus:ring-[#6B7328]/20
          "
        >
          <option value="All">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="NET BANKING">Net Banking</option>
          <option value="Cash">Cash</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="
            rounded-xl
            bg-gradient-to-r
            from-[#6B7328]
            to-[#FFC107]
            px-4 py-2.5
            text-xs
            font-semibold
            text-white
            transition
            hover:brightness-105
            active:scale-[0.98]
          "
        >
          Clear Filters
        </button>

      </div>
    </div>
  );
}