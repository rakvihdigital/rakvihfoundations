"use client";

import { useEffect, useState } from "react";
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

export default function RevenueChart() {
  const [revenue, setRevenue] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((data) => setRevenue(data.monthlyRevenue || []));
  }, []);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        borderColor: "#E7B417",
        backgroundColor: "rgba(231, 180, 23, 0.1)",
        borderWidth: 2.5,
        tension: 0.4,
        pointBackgroundColor: "#F5BC10",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#798321",
        pointHoverBorderColor: "#E7B417",
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-[#081525] 
                    border border-gray-100 dark:border-blue-950 
                    rounded-2xl shadow-md p-4 h-full">

      <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
        Monthly Revenue
      </h2>

      <div className="h-[180px]">   {/* Very small height */}
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#081525",
                titleColor: "#fff",
                bodyColor: "#E7B417",
                padding: 8,
                displayColors: false,
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(148, 163, 184, 0.12)" },
                border: { color: "rgba(148, 163, 184, 0.15)" },
                ticks: {
                  color: "#94a3b8",
                  font: { size: 9 },
                  padding: 4,
                  maxRotation: 0,
                },
              },
              y: {
                grid: { color: "rgba(148, 163, 184, 0.12)" },
                border: { color: "rgba(148, 163, 184, 0.15)" },
                ticks: {
                  color: "#94a3b8",
                  font: { size: 9 },
                  padding: 4,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}