"use client";

import { useReports } from "@/hooks/useReports";
import { useTheme } from "next-themes";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Props {
  filter: string;
}

export default function RevenueChart({ filter }: Props) {
  const { data: reports, isLoading } = useReports(filter);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  if (isLoading || !reports) {
    return (
      <div
        className={`h-[320px] rounded-xl border flex items-center justify-center text-sm ${
          isDark
            ? "bg-[#08111F] border-blue-900/30 text-gray-300"
            : "bg-white border-gray-100 text-gray-500"
        }`}
      >
        Loading...
      </div>
    );
  }

  const revenue = reports.monthlyRevenue || [];

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        borderColor: "#6B7328",
        backgroundColor: "rgba(107,115,40,0.1)",
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: "#6B7328",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div
      className={`rounded-xl shadow border p-5 ${
        isDark
          ? "bg-[#08111F] border-blue-900/30"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-sm font-semibold ${
            isDark ? "text-white" : "text-gray-700"
          }`}
        >
          Monthly Revenue
        </h2>

        <div className="text-[10px] px-3 py-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-emerald-600 text-white rounded-full font-medium">
          2026
        </div>
      </div>

      <div className="h-[260px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "#1F2937",
                padding: 10,
                cornerRadius: 8,
              },
            },
            scales: {
              x: {
                grid: {
                  color: isDark ? "#1E3A5F" : "#F3F4F6",
                },
                ticks: {
                  color: isDark ? "#D1D5DB" : "#6B7280",
                  font: {
                    size: 11,
                  },
                },
              },
              y: {
                grid: {
                  color: isDark ? "#1E3A5F" : "#F3F4F6",
                },
                ticks: {
                  color: isDark ? "#D1D5DB" : "#6B7280",
                  font: {
                    size: 11,
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}