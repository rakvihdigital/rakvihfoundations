"use client";

interface ProgramSearchProps {
  search: string;
  setSearchAction: (value: string) => void;
}

export default function ProgramSearch({
  search,
  setSearchAction,
}: ProgramSearchProps) {
  return (
    <div className="relative w-full lg:w-80">

      <svg
        className="absolute left-4 top-3 h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        />
      </svg>

      <input
        type="text"
        placeholder="Search Program..."
        value={search}
        onChange={(e) => setSearchAction(e.target.value)}
        className="
          w-full
          rounded-xl
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-[#1F2937] dark:text-white
          pl-11
          pr-4
          py-2.5
          text-sm
          outline-none
          focus:ring-2
          focus:ring-[#798321]
          focus:border-transparent
          transition
        "
      />

    </div>
  );
}