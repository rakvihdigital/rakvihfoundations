"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  program: string;
  setProgram: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  programs: any[];
}

export default function CertificateFilters({
  search,
  setSearch,
  program,
  setProgram,
  status,
  setStatus,
  programs,
}: Props) {
  return (
    <div className="rounded-3xl border border-[#ECE7DB] bg-white dark:bg-[#0F172A] dark:border-slate-700 p-4 shadow-[0_4px_18px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707A21]"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-10
              w-full
              rounded-xl
              border
              border-[#E5E7EB]
              dark:border-slate-700
              bg-white
              dark:bg-slate-900
              pl-10
              pr-3
              text-sm
              text-gray-700
              dark:text-white
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-[#707A21]
            "
          />
        </div>

        {/* Programs */}
        <select
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="
            h-10
            rounded-xl
            border
            border-[#E5E7EB]
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-3
            text-sm
            text-gray-700
            dark:text-white
            outline-none
            transition-all
            duration-200
            focus:border-[#707A21]
          "
        >
          <option value="">All Programs</option>

          {programs.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            h-10
            rounded-xl
            border
            border-[#E5E7EB]
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-3
            text-sm
            text-gray-700
            dark:text-white
            outline-none
            transition-all
            duration-200
            focus:border-[#707A21]
          "
        >
          <option value="">All Status</option>
          <option value="Issued">Issued</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearch("");
            setProgram("");
            setStatus("");
          }}
          className="
            h-10
            rounded-xl
            bg-gradient-to-r
            from-[#707A21]
            via-[#9A8C1A]
            to-[#FFC107]
            text-sm
            font-semibold
            text-white
            shadow-md
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-lg
          "
        >
          Clear Filters
        </button>

      </div>
    </div>
  );
}