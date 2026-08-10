"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { FileText, Pencil, Trash2, Eye } from "lucide-react";

import ViewMaterialModal from "@/components/admin/materials/ViewMaterialModal";
import EditMaterialModal from "@/components/admin/materials/EditMaterialModal";
import MaterialTabs from "@/components/admin/materials/MaterialTabs";

const supabase = createClient();

interface Module {
  id: number;
  module_name: string;
}

interface Topic {
  id: number;
  topic: string;
  syllabus_id: number;
}

interface Material {
  id: number;
  program_id: number;

  syllabus_id: number | null;
  topic_id: number | null;

  title: string;
  description: string;

  thumbnail: string;
  file_url: string;

  file_name: string;
  file_size: string;

  file_type: string;
  status: string;

  downloads: number;

  created_at: string;
  updated_at: string;

  programs?: {
    title: string;
  };

  syllabus?: {
    module_name: string;
  };

  topics?: {
    topic: string;
  };
}

export default function ProgramMaterialsPage() {
  const { programId } = useParams<{ programId: string }>();

  const [programName, setProgramName] = useState("");

  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );

  const [editMaterial, setEditMaterial] = useState<any | null>(null);

  useEffect(() => {
    if (!programId) return;

    loadProgram();
    loadModules();
    loadMaterials();
  }, [programId]);

  useEffect(() => {
    if (selectedModule === null) {
      setTopics([]);
      return;
    }

    setSelectedTopic(null);
    loadTopics(selectedModule);
  }, [selectedModule]);

  async function loadProgram() {
    const { data } = await supabase
      .from("programs")
      .select("title")
      .eq("id", Number(programId))
      .single();

    if (data) {
      setProgramName(data.title);
    }
  }

  async function loadModules() {
    const { data, error } = await supabase
      .from("course_syllabus")
      .select("id,module_name")
      .eq("program_id", Number(programId))
      .order("id");

    console.log("Program ID:", programId);
    console.log("Modules:", data);
    console.log("Error:", error);

    if (data) {
      setModules(data);
    }
  }

  async function loadTopics(moduleId: number) {
    const { data } = await supabase
      .from("course_topics")
      .select("id,topic,syllabus_id")
      .eq("syllabus_id", moduleId)
      .order("id");

    setTopics(data ?? []);
  }

  async function loadMaterials() {
    const { data } = await supabase
      .from("materials")
      .select(
        `
      *,
      programs(title),
      syllabus:course_syllabus(module_name),
      topics:course_topics(topic)
    `,
      )
      .eq("program_id", Number(programId))
      .eq("status", "Published");

    console.log(data);

    if (data) {
      setMaterials(data);
    }
  }
  async function deleteMaterial(id: number) {
    const ok = confirm("Are you sure you want to delete this material?");

    if (!ok) return;

    const { error } = await supabase.from("materials").delete().eq("id", id);

    if (error) {
      alert("Unable to delete material");
      return;
    }

    loadMaterials();
  }

  const filteredMaterials = materials.filter((material) => {
    if (selectedModule && material.syllabus_id !== selectedModule) return false;

    if (selectedTopic && material.topic_id !== selectedTopic) return false;

    return true;
  });
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
          {programName}
        </h1>

        <p className="text-xs text-gray-500">Manage module materials</p>
      </div>

      {/* Module Tabs */}
      {/* Module Tabs */}
      <div className="mb-6 flex items-center border-b border-gray-200 dark:border-gray-700">
        {/* Left */}
        <MaterialTabs
          modules={modules}
          activeModule={selectedModule}
          setActiveModule={(id) => {
            setSelectedModule(id);
            setSelectedTopic(null);
          }}
        />

        {/* Push dropdown to the extreme right */}
        <div className="ml-auto pb-2">
          <select
            disabled={selectedModule === null}
            value={selectedTopic ?? ""}
            onChange={(e) =>
              setSelectedTopic(e.target.value ? Number(e.target.value) : null)
            }
            className="appearance-none rounded-full bg-gradient-to-r from-[#5B6E24] via-[#8A8B1F] to-[#FFC107] px-6 py-2.5 pr-10 text-xs font-semibold text-white shadow-md outline-none disabled:opacity-60"
          >
            <option value="" className="text-black">
              All Topics
            </option>

            {topics.map((topic) => (
              <option key={topic.id} value={topic.id} className="text-black">
                {topic.topic}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className="overflow-hidden rounded-lg border border-[#ECECEC] bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div
              className="relative h-48 cursor-pointer overflow-hidden bg-gray-100 group"
              onClick={() => {
                console.log(material);

                if (material.file_url) {
                  window.open(material.file_url, "_blank");
                } else {
                  alert("PDF URL not found");
                }
              }}
            >
              {material.thumbnail ? (
                <img
                  src={material.thumbnail}
                  alt={material.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F8FAF5] to-[#EEF5E8] dark:from-[#16253A] dark:to-[#0F1C2E]">
                  <FileText
                    size={60}
                    className="text-[#6B7328] dark:text-[#60A5FA]"
                  />
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[11px] font-medium text-white/90">
                  Click
                </span>
              </div>{" "}
            </div>

            {/* Card Content */}
            <div className="p-2.5 bg-white dark:bg-[#0F172A]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-[12px] font-semibold text-[#24310F] dark:text-white">
                    {material.title}
                  </h3>

                  <div className="mt-0.5 flex items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400">
                    <FileText size={9} />
                    <span>{material.file_size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMaterial(material);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-r from-[#4D6B2F] via-[#6B7328] to-[#FFC107] text-white transition hover:scale-105"
                  >
                    <Eye size={9} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditMaterial(material);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6B7328] text-white transition hover:bg-[#5A6422]"
                  >
                    <Pencil size={9} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMaterial(material.id);
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md bg-[#4D6B2F] text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={9} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredMaterials.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#A3B68C] py-10 text-center text-xs text-gray-500">
          No materials found.
        </div>
      )}

      {/* View Material Modal */}

      <ViewMaterialModal
        open={!!selectedMaterial}
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
      {/* Edit Material Modal */}
      <EditMaterialModal
        open={!!editMaterial}
        material={editMaterial}
        onClose={() => setEditMaterial(null)}
        refresh={() => {
          loadMaterials();
          setEditMaterial(null);
        }}
      />
    </div>
  );
}
