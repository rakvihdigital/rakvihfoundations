"use client";

interface Props {
  search: string;
  setSearchAction: (value: string) => void;
}

export default function StudentSearch({
  search,
  setSearchAction,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Search by student name or email..."
      value={search}
      onChange={(e) => setSearchAction(e.target.value)}
      className="w-full md:w-80 rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] px-5 py-3 text-sm focus:border-[#6B7328] dark:bg-[#132238] placeholder:text-xs"
    />
  );
}