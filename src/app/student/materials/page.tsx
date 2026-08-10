"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import MaterialCard from "@/components/student/materials/MaterialCard";
import MaterialTabs from "@/components/student/materials/MaterialTabs";
import TopicFilter from "@/components/student/materials/TopicFilter";
import EmptyMaterials from "@/components/student/materials/EmptyMaterials";

const supabase = createClient();

interface Material {
  id: number;
  title: string;
  description: string;
  file_url: string;
  file_size?: string;
  created_at: string;
  syllabus_id: number;
  topic_id: number;
  module_name: string;
  topic_name: string;
  read?: boolean;
}

export default function StudentMaterialsPage() {
  const router = useRouter();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    try {
      // Current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Student program
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id, program_id")
        .eq("user_id", user.id)
        .single();

      if (!enrollment) return;

      // Get materials
      const { data: materialRows, error } = await supabase
        .from("materials")
        .select("*")
        .eq("program_id", enrollment.program_id)
        .order("created_at", { ascending: false });

      const { data: readViews } = await supabase
        .from("student_material_views")
        .select("material_id")
        .eq("student_id", enrollment.id);

      const readIds = new Set(
        (readViews ?? []).map((item) => item.material_id)
      );

      if (error) throw error;

      if (!materialRows?.length) {
        setMaterials([]);
        return;
      }

      // Module names
      const syllabusIds = [...new Set(materialRows.map((m) => m.syllabus_id))];

      const { data: syllabus } = await supabase
        .from("course_syllabus")
        .select("id,module_name")
        .in("id", syllabusIds);

      // Topic names
      const topicIds = [...new Set(materialRows.map((m) => m.topic_id))];

      const { data: topics } = await supabase
        .from("course_topics")
        .select("id,topic")
        .in("id", topicIds);

      const moduleMap = new Map(
        (syllabus ?? []).map((m) => [m.id, m.module_name])
      );

      const topicMap = new Map(
        (topics ?? []).map((t) => [t.id, t.topic])
      );

      const formatted: Material[] = materialRows.map((item) => ({
        ...item,
        module_name: moduleMap.get(item.syllabus_id) ?? "Module",
        topic_name: topicMap.get(item.topic_id) ?? "Topic",
        read: readIds.has(item.id),
      }));
      setMaterials(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Modules
  const modules = useMemo(
    () => [...new Set(materials.map((m) => m.module_name))],
    [materials]
  );

  // Topics
  const topics = useMemo(() => {
    if (selectedModule === "All") {
      return [...new Set(materials.map((m) => m.topic_name))];
    }

    return [
      ...new Set(
        materials
          .filter((m) => m.module_name === selectedModule)
          .map((m) => m.topic_name)
      ),
    ];
  }, [materials, selectedModule]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const moduleMatch =
        selectedModule === "All" ||
        item.module_name === selectedModule;

      const topicMatch =
        selectedTopic === "All" ||
        item.topic_name === selectedTopic;

      return moduleMatch && topicMatch;
    });
  }, [materials, selectedModule, selectedTopic]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Loading materials...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
          Study Materials
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Access all study materials uploaded for your internship.
        </p>
      </div>

      {/* Module & Topic */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex-1">
          <MaterialTabs
            modules={modules}
            selectedModule={selectedModule}
            onChange={(module) => {
              setSelectedModule(module);
              setSelectedTopic("All");
            }}
          />
        </div>

        <div className="shrink-0">
          <TopicFilter
            topics={topics}
            selectedTopic={selectedTopic}
            onChange={setSelectedTopic}
            disabled={selectedModule === "All"}
          />
        </div>

      </div>

      {/* Materials */}
      {filteredMaterials.length === 0 ? (
        <EmptyMaterials />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onView={() =>
                router.push(`/student/materials/${material.id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}