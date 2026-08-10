"use client";

interface Module {
  id: number;
  module_name: string;
}

interface Props {
  modules: Module[];
  activeModule: number | null;
  setActiveModule: (id: number | null) => void;
}

export default function VideoTabs({
  modules,
  activeModule,
  setActiveModule,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">

      {/* All */}

      <button
        onClick={() => setActiveModule(null)}
        className={`
          rounded-full
          px-5
          py-2
          text-xs
          font-semibold
          transition-all
          duration-300

          ${
            activeModule === null
              ? "bg-gradient-to-r from-[#5B6E24] via-[#6B7328] to-[#FFC107] text-white dark:text-black shadow-md"
              : "border border-[#D9E2C2] bg-white text-[#6B7328] hover:bg-[#F6F8EF] dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
          }
        `}
      >
        All
      </button>

      {/* Modules */}

      {modules.map((module, index) => (
        <button
          key={module.id}
          onClick={() => setActiveModule(module.id)}
          className={`
            rounded-full
            px-5
            py-2
            text-xs
            font-semibold
            transition-all
            duration-300

            ${
              activeModule === module.id
                ? "bg-gradient-to-r from-[#5B6E24] via-[#6B7328] to-[#FFC107] text-white dark:text-black shadow-md"
                : "border border-[#D9E2C2] bg-white text-[#6B7328] hover:bg-[#F6F8EF] dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
            }
          `}
        >
          {`Module ${index + 1}`}
        </button>
      ))}

    </div>
  );
}