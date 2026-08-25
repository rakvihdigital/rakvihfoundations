"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProgramCard from "./ProgramCard";

interface Program {
  id: number;
  title: string;
  category: string;
  price: number;
  duration: string;
  students: string;
  image: string;
  description: string;
}

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch("/api/admin/programs", {
          cache: "no-store",
        });

        const data = await res.json();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }

    loadPrograms();
  }, []);

  return (
    <section
      className="
        relative
        overflow-hidden
        py-10
        bg-white
        dark:bg-black
        transition-colors
        duration-500
      "
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_center,rgba(121,131,33,0.05)_0%,transparent_70%)]
          dark:bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.08)_0%,transparent_70%)]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mb-8 text-center">

          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-[#798321]/20
              bg-[#798321]/10
              px-4
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[3px]
              text-[#798321]
              dark:border-[#FFC107]/20
              dark:bg-[#FFC107]/10
              dark:text-[#FFC107]
            "
          >
            EXPLORE CAREER TRACKS
          </span>

          <h2
            className="
              mt-3
              text-3xl
              font-black
              tracking-tight
              text-[#798321]
              md:text-4xl
              dark:text-white
            "
          >
            Explore Career Tracks
          </h2>

          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#798321] dark:bg-[#FFC107]" />

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-gray-600
              dark:text-neutral-400
            "
          >
            RAKVIH's internship catalogue is built around the roles companies are actually hiring for right now. From Web Development and Full Stack Development to AI & Machine Learning, Data Science, Cloud Computing, Cyber Security, Digital Marketing, and UI/UX Design.
          </p>

          {/* View All Button */}
          <div className="mt-5 mb-6 flex justify-center">
            <Link
              href="/programs"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#798321]
                px-7
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-[#FFC107]
                hover:text-[#798321]
                hover:shadow-xl

                dark:bg-[#FFC107]
                dark:text-black
                dark:hover:bg-[#798321]
                dark:hover:text-white
              "
            >
              View All Programs

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.length > 0 ? (
            programs.slice(0, 3).map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
              />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500 dark:text-neutral-400">
              No Programs Available
            </div>
          )}
        </div>

      </div>
    </section>
  );
}