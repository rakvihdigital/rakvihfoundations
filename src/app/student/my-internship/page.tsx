"use client";

import { useInternship } from "@/hooks/useInternship";

import InternshipHero from "@/components/student/my-internship/InternshipHero";
import InternshipStats from "@/components/student/my-internship/InternshipStats";
import ModuleGrid from "@/components/student/my-internship/ModuleGrid";

export default function MyInternshipPage() {
  const {
    loading,
    program,
    progress,
    modules,
    topics,
    videos,
    materials,
    assignments,
  } = useInternship();

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="text-gray-500 dark:text-neutral-400">Loading Internship...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="text-gray-500 dark:text-neutral-400">
          No Internship Found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-0 py-1">
      <InternshipHero
        program={program}
        progress={progress}
      />

      <InternshipStats
        modules={modules.length}
        topics={videos.length}
        videos={videos.length}
        materials={materials.length}
        assignments={assignments.length}
      />

      <ModuleGrid
        modules={modules}
        topics={topics}
        videos={videos}
        materials={materials}
        assignments={assignments}
      />
    </div>
  );
}