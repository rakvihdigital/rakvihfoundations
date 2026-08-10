"use client";

import { useReports } from "@/hooks/useReports";
import { useTheme } from "next-themes";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface Props {
  filter: string;
}

export default function PaymentChart({ filter }: Props) {
  const { data: reports, isLoading } = useReports(filter);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  if (isLoading || !reports) {
    return (
      <div
        className={`h-[500px] rounded-xl border flex items-center justify-center text-sm ${
          isDark
            ? "bg-[#08111F] border-blue-900/30 text-gray-300"
            : "bg-white border-gray-100 text-gray-500"
        }`}
      >
        Loading...
      </div>
    );
  }

  const completed = reports.completedPayments || 0;
  const pending = reports.pendingPayments || 0;

  const total = completed + pending;

  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#6B7328", "#FFC107"],
        borderColor: isDark ? "#08111F" : "#ffffff",
        borderWidth: 5,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div
      className={`h-[500px] rounded-xl border shadow-sm p-5 flex flex-col ${
        isDark
          ? "bg-[#08111F] border-blue-900/30"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-sm font-semibold ${
              isDark ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Payment Status
          </h2>

          <p
            className={`text-[11px] ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`}
          >
            Live payment overview
          </p>
        </div>

        <span className="rounded-full bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-3 py-1 text-[10px] font-medium text-white">
          Live
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative h-[250px] w-[250px]">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "74%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: isDark ? "#D1D5DB" : "#374151",
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 12,
                    boxWidth: 8,
                    boxHeight: 8,
                    font: {
                      size: 10,
                    },
                  },
                },
                tooltip: {
                  backgroundColor: "#1F2937",
                  padding: 10,
                },
              },
            }}
          />

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className={`text-[10px] ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total
            </p>

            <h2
              className={`text-3xl font-bold leading-none ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {total}
            </h2>

            <p
              className={`mt-1 text-[10px] ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Payments
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`rounded-xl border p-4 ${
            isDark
              ? "bg-[#0F172A] border-blue-900/40"
              : "bg-green-50 border-green-100"
          }`}
        >
          <div className="mb-2 h-2.5 w-2.5 rounded-full bg-[#6B7328]" />

          <h3 className="text-xl font-bold text-[#6B7328]">
            {completed}
          </h3>

          <p
            className={`text-[11px] ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Completed
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            isDark
              ? "bg-[#0F172A] border-blue-900/40"
              : "bg-yellow-50 border-yellow-100"
          }`}
        >
          <div className="mb-2 h-2.5 w-2.5 rounded-full bg-[#FFC107]" />

          <h3 className="text-xl font-bold text-yellow-600">
            {pending}
          </h3>

          <p
            className={`text-[11px] ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Pending
          </p>
        </div>
      </div>
    </div>
  );
}