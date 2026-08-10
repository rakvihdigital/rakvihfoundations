"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import {
  FileText,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import ViewAssignmentModal from "@/components/admin/assignments/ViewAssignmentModal";
import EditAssignmentModal from "@/components/admin/assignments/EditAssignmentModal";
import AssignmentTabs from "@/components/admin/assignments/AssignmentTabs";

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

interface Assignment {
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

export default function ProgramAssignmentsPage() {
  const { programId } = useParams<{ programId: string }>();

  const [programName, setProgramName] = useState("");

  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const [editAssignment, setEditAssignment] =
    useState<Assignment | null>(null);

  useEffect(() => {
    if (!programId) return;

    loadProgram();
    loadModules();
    loadAssignments();
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
    const { data } = await supabase
      .from("course_syllabus")
      .select("id,module_name")
      .eq("program_id", Number(programId))
      .order("id");

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

  async function loadAssignments() {
    const { data } = await supabase
     .from("assignments")
      .select(`
        *,
        programs (
          title
        ),
        syllabus:course_syllabus (
          module_name
        ),
        topics:course_topics (
          topic
        )
      `)
      .eq("program_id", Number(programId))
      .eq("status", "Published");

    if (data) {
      setAssignments(data);
    }
  }

  async function deleteAssignment(id: number) {
    const ok = confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!ok) return;

    const { error } = await supabase
  .from("assignments")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Unable to delete assignment");
      return;
    }

    loadAssignments();
  }

  const filteredAssignments = assignments.filter((assignment) => {
    if (
      selectedModule &&
      assignment.syllabus_id !== selectedModule
    )
      return false;

    if (
      selectedTopic &&
      assignment.topic_id !== selectedTopic
    )
      return false;

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
          {programName}
        </h1>

        <p className="text-xs text-gray-500">
          Manage module assignments
        </p>
      </div>

      {/* Module Tabs */}
      <div className="mb-6 flex items-center border-b border-gray-200 dark:border-gray-700">
        <AssignmentTabs
          modules={modules}
          activeModule={selectedModule}
          setActiveModule={(id) => {
            setSelectedModule(id);
            setSelectedTopic(null);
          }}
        />

        <div className="ml-auto pb-2">
          <select
            disabled={selectedModule === null}
            value={selectedTopic ?? ""}
            onChange={(e) =>
              setSelectedTopic(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="appearance-none rounded-full bg-gradient-to-r from-[#5B6E24] via-[#8A8B1F] to-[#FFC107] px-6 py-2.5 pr-10 text-xs font-semibold text-white shadow-md outline-none disabled:opacity-60"
          >
            <option value="" className="text-black">
              All Topics
            </option>

            {topics.map((topic) => (
              <option
                key={topic.id}
                value={topic.id}
                className="text-black"
              >
                {topic.topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Remaining code in Part 2 */}
            {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredAssignments.map((assignment) => (
        <div
  key={assignment.id}
  className="
    overflow-hidden
    rounded-lg
    border
    border-[#ECECEC]
    bg-white
    dark:bg-[#0F172A]
    dark:border-[#1E293B]
    shadow-sm
    hover:shadow-md
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
            {/* Thumbnail */}
          <div
  onClick={() => {
    if (assignment.file_url) {
      window.open(assignment.file_url, "_blank", "noopener,noreferrer");
    }
  }}
  className="relative h-48 cursor-pointer overflow-hidden bg-gray-100 group"
>
  <img
    src={assignment.thumbnail || "/images/assign.png"}
    alt={assignment.title}
    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
  />

  {/* Glass Hover */}
  <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300">
    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-[9px] font-semibold text-white tracking-[0.15em]">
      Click
    </span>
  </div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition" />
</div>

            {/* Card Content */}
 <div className="p-2.5">
  <div className="flex items-start justify-between gap-1.5">

    <div className="flex-1 min-w-0">
      <h2 className="text-[12px] font-semibold text-[#24310F] dark:text-white leading-4 line-clamp-1">
        {assignment.title}
      </h2>

      <div className="mt-0.5 flex items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400">
        <FileText size={9} />
        <span>{assignment.file_size}</span>
      </div>
    </div>

    <div className="flex items-center gap-1 shrink-0">

      {/* View */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAssignment(assignment);
        }}
        className="h-5 w-5 rounded-md bg-gradient-to-r from-[#4D6B2F] via-[#6B7328] to-[#FFC107] text-white flex items-center justify-center hover:scale-105 transition"
      >
        <Eye size={9} />
      </button>

      {/* Edit */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEditAssignment(assignment);
        }}
        className="h-5 w-5 rounded-md bg-[#6B7328] text-white flex items-center justify-center hover:bg-[#5A6422] transition"
      >
        <Pencil size={9} />
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteAssignment(assignment.id);
        }}
        className="h-5 w-5 rounded-md bg-[#4D6B2F] text-white flex items-center justify-center hover:bg-red-600 transition"
      >
        <Trash2 size={9} />
      </button>

    </div>

  </div>
</div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#A3B68C] py-10 text-center text-xs text-gray-500">
          No assignments found.
        </div>
      )}

      {/* View Assignment */}
      <ViewAssignmentModal
        open={!!selectedAssignment}
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />

      {/* Edit Assignment */}
      <EditAssignmentModal
        open={!!editAssignment}
        assignment={editAssignment}
        onClose={() => setEditAssignment(null)}
        refresh={() => {
          loadAssignments();
          setEditAssignment(null);
        }}
      />
    </div>
  );
}