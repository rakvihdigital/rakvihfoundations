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

export default function AssignmentTabs({
  modules,
  activeModule,
  setActiveModule,
}: Props) {
  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {/* All */}
        <div className="relative pb-2">
          <button
            onClick={() => setActiveModule(null)}
            className={`rounded-full px-6 py-2.5 text-xs font-semibold transition-all duration-300 ${
              activeModule === null
                ? "bg-gradient-to-r from-[#5B6E24] via-[#8A8B1F] to-[#FFC107] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1E293B] dark:text-gray-300"
            }`}
          >
            All
          </button>

          {activeModule === null && (
            <span className="absolute left-1/2 bottom-0 h-[2px] w-10 -translate-x-1/2 rounded-full bg-[#FFC107]" />
          )}
        </div>

        {/* Modules */}
        {modules.map((module, index) => (
          <div key={module.id} className="relative pb-2">
            <button
              onClick={() => setActiveModule(module.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${
                activeModule === module.id
                  ? "bg-gradient-to-r from-[#5B6E24] via-[#8A8B1F] to-[#FFC107] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1E293B] dark:text-gray-300"
              }`}
            >
              Module {index + 1}
            </button>

            {activeModule === module.id && (
              <span className="absolute left-1/2 bottom-0 h-[2px] w-14 -translate-x-1/2 rounded-full bg-[#FFC107]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}