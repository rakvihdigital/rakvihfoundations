"use client";

import { useReports } from "@/hooks/useReports";
import { useTheme } from "next-themes";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface Props {
  filter: string;
}

export default function TopPrograms({ filter }: Props) {
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

  const programs = reports.topPrograms || [];

  const colors = [
    "#6B7328",
    "#7E8A2F",
    "#9BAF3D",
    "#C6A419",
    "#FFC107",
    "#F59E0B",
  ];

  return (
    <div
      className={`h-[500px] rounded-xl border p-5 shadow-sm flex flex-col ${
        isDark
          ? "bg-[#08111F] border-blue-900/30"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-sm font-semibold ${
              isDark ? "text-white" : "text-gray-700"
            }`}
          >
            Top Enrolled Programs
          </h2>

          <p
            className={`text-[10px] ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`}
          >
            Most enrolled courses
          </p>
        </div>

        <span className="rounded-full bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-3 py-1 text-[9px] font-medium text-white">
          Live
        </span>
      </div>

      {programs.length === 0 ? (
        <div
          className={`flex flex-1 items-center justify-center text-xs ${
            isDark ? "text-gray-400" : "text-gray-400"
          }`}
        >
          No enrollment data available
        </div>
      ) : (
        <div className="flex-1 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={programs}
              layout="vertical"
              margin={{
                top: 20,
                right: 15,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke={isDark ? "#1E3A5F" : "#F3F4F6"}
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                type="number"
                tick={{
                  fontSize: 10,
                  fill: isDark ? "#D1D5DB" : "#6B7280",
                }}
                axisLine={{
                  stroke: isDark ? "#1E3A5F" : "#E5E7EB",
                }}
                tickLine={{
                  stroke: isDark ? "#1E3A5F" : "#E5E7EB",
                }}
              />

              <YAxis
                type="category"
                dataKey="title"
                width={135}
                tick={{
                  fontSize: 10,
                  fill: isDark ? "#F3F4F6" : "#374151",
                }}
                axisLine={{
                  stroke: isDark ? "#1E3A5F" : "#E5E7EB",
                }}
                tickLine={{
                  stroke: isDark ? "#1E3A5F" : "#E5E7EB",
                }}
              />

              <Tooltip
                formatter={(value: any) => [
                  `${value} Students`,
                  "Enrollments",
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: isDark
                    ? "1px solid #1E3A5F"
                    : "1px solid #E5E7EB",
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  color: isDark ? "#FFFFFF" : "#111827",
                  fontSize: "11px",
                }}
              />

              <Bar
                dataKey="students"
                radius={[12, 12, 12, 12]}
                barSize={30}
              >
                {programs.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}