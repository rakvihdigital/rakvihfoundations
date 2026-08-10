"use client";

interface StudentFiltersProps {
  status: string;
  setStatusAction: (status: string) => void;
}

export default function StudentFilters({
  status,
  setStatusAction,
}: StudentFiltersProps) {
  return (
    <div className="flex gap-2">
      {["All", "Registered", "Approved"].map((item) => (
        <button
          key={item}
          onClick={() => setStatusAction(item)}
          className={`px-5 py-2 text-xs font-medium rounded-2xl transition-all ${
            status === item
              ? "bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white shadow"
              : "bg-white dark:bg-[#132238] border border-[#E8ECE5] dark:border-[#1E3A5F] hover:border-[#6B7328]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}