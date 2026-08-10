"use client";

import ModuleCard from "./ModuleCard";

interface Props {
  modules: any[];
  topics: any[];
  videos: any[];
  materials: any[];
  assignments: any[];
}

export default function ModuleGrid({
  modules,
}: Props) {
  return (
    <div className="grid gap-5 mt-8 md:grid-cols-2 xl:grid-cols-3">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
        />
      ))}
    </div>
  );
}