"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#798321",
  "#E7B417",
  "#F5BC10",
  "#A3C93A",
  "#C4D63A",
  "#D4B22E",
];

export default function CourseDistribution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/admin/dashboard/distribution")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="bg-white dark:bg-[#081525] 
                    border border-gray-100 dark:border-blue-950 
                    rounded-2xl shadow-md p-4 h-full">

      <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
        Course Distribution
      </h2>

      <div className="h-[190px]">   {/* Very small height */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={68}     // Smaller pie
              innerRadius={38}
              labelLine={false}
              label={false}        // Removed label to save space
            >
              {data.map((_, index) => (
                <Cell 
                  key={index} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>

            <Tooltip 
              contentStyle={{
                backgroundColor: "#081525",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "12px",
                padding: "6px 10px"
              }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={32}
              iconType="circle"
              iconSize={7}
              wrapperStyle={{
                fontSize: "10px",
                color: "#64748b",
                paddingTop: "4px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}