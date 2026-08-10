"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import AssignmentCard from "@/components/student/assignments/AssignmentCard";
import AssignmentTabs from "@/components/student/assignments/AssignmentTabs";
import TopicFilter from "@/components/student/assignments/TopicFilter";
import EmptyAssignments from "@/components/student/assignments/EmptyAssignments";

const supabase = createClient();

interface Assignment {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  due_date: string | null;
  created_at: string;
  syllabus_id: number;
  topic_id: number;
  module_name: string;
  topic_name: string;
  submitted?: boolean;
}

export default function StudentAssignmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id, program_id")
        .eq("user_id", user.id)
        .single();

      if (!enrollment) return;

      const { data: assignmentRows, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("program_id", enrollment.program_id)
        .eq("status", "Published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!assignmentRows?.length) {
        setAssignments([]);
        return;
      }

      const { data: submissions } = await supabase
        .from("student_assignment_submissions")
        .select("assignment_id")
        .eq("student_id", enrollment.id);

      const submittedIds = new Set(
        (submissions ?? []).map((s) => s.assignment_id)
      );
      const syllabusIds = [
        ...new Set(assignmentRows.map((a) => a.syllabus_id)),
      ];

      const { data: syllabus } = await supabase
        .from("course_syllabus")
        .select("id,module_name")
        .in("id", syllabusIds);

      const topicIds = [
        ...new Set(assignmentRows.map((a) => a.topic_id)),
      ];

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

      const formatted: Assignment[] = assignmentRows.map((item) => ({
        ...item,
        module_name: moduleMap.get(item.syllabus_id) ?? "Module",
        topic_name: topicMap.get(item.topic_id) ?? "Topic",
        submitted: submittedIds.has(item.id),
      }));

      setAssignments(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const modules = useMemo(
    () => [...new Set(assignments.map((a) => a.module_name))],
    [assignments]
  );

  const topics = useMemo(() => {
    if (selectedModule === "All") {
      return [...new Set(assignments.map((a) => a.topic_name))];
    }

    return [
      ...new Set(
        assignments
          .filter((a) => a.module_name === selectedModule)
          .map((a) => a.topic_name)
      ),
    ];
  }, [assignments, selectedModule]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const moduleMatch =
        selectedModule === "All" ||
        item.module_name === selectedModule;

      const topicMatch =
        selectedTopic === "All" ||
        item.topic_name === selectedTopic;

      return moduleMatch && topicMatch;
    });
  }, [assignments, selectedModule, selectedTopic]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Loading assignments...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
          Assignments
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          View and download your internship assignments.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex-1">
          <AssignmentTabs
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

      {filteredAssignments.length === 0 ? (
        <EmptyAssignments />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onView={() =>
                router.push(`/student/assignments/${assignment.id}`)
              }
            />
          ))}
        </div>
      )}

    </div>
  );
}