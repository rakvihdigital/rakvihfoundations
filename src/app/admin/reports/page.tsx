"use client";

import { useState } from "react";

import ReportFilters from "@/components/admin/reports/ReportFilters";
import ReportStats from "@/components/admin/reports/ReportStats";
import EnrollmentChart from "@/components/admin/reports/EnrollmentChart";
import RevenueChart from "@/components/admin/reports/RevenueChart";
import PaymentChart from "@/components/admin/reports/PaymentChart";
import TopPrograms from "@/components/admin/reports/TopPrograms";


export default function ReportsPage() {
  const [filter, setFilter] = useState("month");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#6B7328]">
          Reports
        </h1>

       <p className="text-[11px] text-gray-500">
  Reports & Analytics
</p>
      </div>

      <ReportFilters
        filter={filter}
        setFilter={setFilter}
      />

      <ReportStats filter={filter} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentChart filter={filter} />
        <RevenueChart filter={filter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentChart filter={filter} />
        <TopPrograms filter={filter} />
      </div>
    </div>
  );
}