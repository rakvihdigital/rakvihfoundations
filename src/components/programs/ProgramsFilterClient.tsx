"use client";

import { useState } from "react";
import ProgramCard from "./ProgramCard";

export default function ProgramsFilterClient({ programs }: { programs: any[] }) {
  const [selected, setSelected] = useState("All");
  const categories = ["All", ...new Set(programs.map((p) => p.category))];
  
  const filtered = selected === "All" ? programs : programs.filter(p => p.category === selected);

  return (
    <section className="pt-6 pb-12 bg-white dark:bg-black transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4">
        {/* Filter UI - Compact */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition-all ${
                selected === cat
                  ? "bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black"
                  : "border border-[#798321]/20 text-[#798321] hover:bg-[#798321]/5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid: 1 on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}