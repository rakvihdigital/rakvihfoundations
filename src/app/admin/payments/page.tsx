"use client";

import { useEffect, useState } from "react";

import PaymentStats from "@/components/admin/payments/PaymentStats";
import PaymentFilters from "@/components/admin/payments/PaymentFilters";
import PaymentTable from "@/components/admin/payments/PaymentTable";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");

      if (!res.ok) throw new Error("Failed to fetch payments");

      const data = await res.json();

      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="w-full space-y-5 px-2 py-2 overflow-x-hidden">
      {/* Header */}
      <div>
<h1 className="text-xl font-semibold text-[#24310F] dark:text-white tracking-tight">      
      Payments
        </h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          Manage and monitor all student payments
        </p>
      </div>

      <PaymentStats payments={payments} />

      <PaymentFilters
        payments={payments}
        setFilteredPayments={setFilteredPayments}
      />

      <PaymentTable
        payments={filteredPayments}
        loading={loading}
        refresh={fetchPayments}
      />
    </div>
  );
}