"use client";

import StatCard from "./StatCard";
import { stats } from "./statsData";

export default function Stats() {
  return (
    <section
      className="
        py-12
        bg-white
        dark:bg-black
        transition-all
        duration-500
      "
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[4px] text-[#FFB300]">
            ACHIEVEMENTS
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight text-[#8A8F2A] md:text-4xl dark:text-white">
            Our Impact in Numbers
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.title}
              {...item}
            />
          ))}
        </div>

      </div>
    </section>
  );
}