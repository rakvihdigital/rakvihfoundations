"use client";

interface ProgramFiltersProps {
  status: string;
  setStatus: (value: string) => void;
}

export default function ProgramFilters({
  status,
  setStatus,
}: ProgramFiltersProps) {
  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="
        rounded-xl
        border border-gray-300 dark:border-gray-700
        bg-white dark:bg-[#1F2937]
        dark:text-white
        px-4
        py-2.5
        text-sm
        outline-none
        focus:ring-2
        focus:ring-[#798321]
        focus:border-transparent
        transition
      "
    >
      <option value="All">All Programs</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  );
}