"use client";

interface Props {
  filter: string;
  setFilter: (value: string) => void;
}

export default function ReportFilters({ filter, setFilter }: Props) {
  return (
    <div className="bg-white dark:bg-[#08111F] rounded-xl shadow border border-gray-100 dark:border-blue-900/30 p-5">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
            filter === "today"
              ? "bg-gradient-to-r from-[#6B7328] to-yellow-500 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-[#0F172A] dark:hover:bg-[#16233A] dark:text-gray-300"
          }`}
        >
          Today
        </button>

        <button
          onClick={() => setFilter("month")}
          className={`px-4 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
            filter === "month"
              ? "bg-gradient-to-r from-[#6B7328] to-yellow-500 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-[#0F172A] dark:hover:bg-[#16233A] dark:text-gray-300"
          }`}
        >
          This Month
        </button>

        <button
          onClick={() => setFilter("year")}
          className={`px-4 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
            filter === "year"
              ? "bg-gradient-to-r from-[#6B7328] to-yellow-500 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-[#0F172A] dark:hover:bg-[#16233A] dark:text-gray-300"
          }`}
        >
          This Year
        </button>
      </div>
    </div>
  );
}