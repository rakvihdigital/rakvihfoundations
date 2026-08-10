"use client";

import { useReports } from "@/hooks/useReports";
import { useTheme } from "next-themes";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface Props {
  filter: string;
}

export default function EnrollmentChart({ filter }: Props) {
  const { data: reports, isLoading } = useReports(filter);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  if (isLoading || !reports) {
    return (
      <div
        className={`rounded-xl shadow border p-5 h-[340px] flex items-center justify-center text-sm ${
          isDark
            ? "bg-[#08111F] border-blue-900/30 text-gray-300"
            : "bg-white border-gray-100 text-gray-500"
        }`}
      >
        Loading...
      </div>
    );
  }

  const chartData = {
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
        label: "Enrollments",
        data: reports.monthlyEnrollments || [],
        // SAME COLORS FOR BOTH THEMES
        backgroundColor: "rgba(107,115,40,0.9)",
        borderColor: "#6B7328",
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: "#A3A96A",
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
            isDark ? "text-gray-100" : "text-gray-700"
          }`}
        >
          Monthly Enrollments
        </h2>

        <div className="text-[10px] px-2.5 py-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-emerald-600 text-white rounded-full font-medium">
          2026
        </div>
      </div>

      <div className="h-[280px]">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "#1F2937",
                titleColor: "#E5E7EB",
                bodyColor: "#E5E7EB",
                padding: 10,
                cornerRadius: 6,
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
                  stepSize: 5,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}