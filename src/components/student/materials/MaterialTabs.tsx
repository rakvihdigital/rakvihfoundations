"use client";

interface Props {
  modules: string[];
  selectedModule: string;
  onChange: (module: string) => void;
}

export default function MaterialTabs({
  modules,
  selectedModule,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* All Button */}
      <button
        onClick={() => onChange("All")}
        className={`
          rounded-full
          px-5
          py-2
          text-xs
          font-semibold
          transition-all
          duration-300
          ${
            selectedModule === "All"
              ? "bg-gradient-to-r from-[#5B6E24] via-[#6B7328] to-[#FFC107] text-white dark:text-black shadow-md"
              : "border border-[#D9E2C2] bg-white text-[#6B7328] hover:bg-[#F6F8EF] dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
          }
        `}
      >
        All
      </button>

      {/* Module Buttons */}
      {modules.map((module, index) => (
        <button
          key={module}
          onClick={() => onChange(module)}
          className={`
            rounded-full
            px-5
            py-2
            text-xs
            font-semibold
            transition-all
            duration-300
            ${
              selectedModule === module
                ? "bg-gradient-to-r from-[#5B6E24] via-[#6B7328] to-[#FFC107] text-white dark:text-black shadow-md"
                : "border border-[#D9E2C2] bg-white text-[#6B7328] hover:bg-[#F6F8EF] dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
            }
          `}
        >
          Module {index + 1}
        </button>
      ))}
    </div>
  );
}