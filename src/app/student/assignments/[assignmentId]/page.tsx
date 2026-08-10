"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  ArrowLeft,
  CalendarDays,
  BookOpen,
  FileText,
  Clock,
} from "lucide-react";

const supabase = createClient();

interface Assignment {
  id: number;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: string | null;
  due_date: string | null;
  created_at: string;
  syllabus_id: number;
  topic_id: number;
}

export default function AssignmentDetailsPage() {
  const router = useRouter();
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [moduleName, setModuleName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    if (assignmentId) {
      loadAssignment();
    }
  }, [assignmentId]);

  async function loadAssignment() {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("id", Number(assignmentId))
        .single();

      if (error || !data) return;

      setAssignment(data);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (enrollment) {
          const { data: submissionData } = await supabase
            .from("student_assignment_submissions")
            .select("*")
            .eq("assignment_id", data.id)
            .eq("student_id", enrollment.id)
            .maybeSingle();

          setSubmission(submissionData);
        }
      }

      const { data: module } = await supabase
        .from("course_syllabus")
        .select("module_name")
        .eq("id", data.syllabus_id)
        .single();

      if (module) {
        setModuleName(module.module_name);
      }

      const { data: topic } = await supabase
        .from("course_topics")
        .select("topic")
        .eq("id", data.topic_id)
        .single();

      if (topic) {
        setTopicName(topic.topic);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAssignment() {
    try {
      if (!assignment) {
        alert("Assignment not found.");
        return;
      }
      if (!selectedFile) {
        alert("Please select a file.");
        return;
      }

      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login again.");
        return;
      }

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!enrollment) {
        alert("Enrollment not found.");
        return;
      }

      const fileName = `${Date.now()}-${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("assignment-submissions")
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.log(uploadError);
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("assignment-submissions")
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from("student_assignment_submissions")
        .insert({
          assignment_id: assignment.id,
          student_id: enrollment.id,
          file_url: data.publicUrl,
          file_name: selectedFile.name,
          comments,
        });

      if (error) {
        console.log(error);
        alert(error.message);
        return;
      }
      alert("Assignment submitted successfully.");

      setSelectedFile(null);
      setComments("");
      loadAssignment();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || JSON.stringify(err));
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Loading assignment...
        </p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Assignment not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="-mt-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center p-1 text-[#24310F] dark:text-white hover:text-[#6B7328] dark:hover:text-[#FFC107] transition-all"
        >
          <ArrowLeft size={18} strokeWidth={2.8} />
        </button>
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#24310F] dark:text-white">
          {assignment.title}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#6B7328] dark:text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Module
              </h3>
            </div>
            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {moduleName}
            </p>
          </div>

          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Topic
              </h3>
            </div>
            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {topicName}
            </p>
          </div>

          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#6B7328] dark:text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Due Date
              </h3>
            </div>
            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {assignment.due_date
                ? new Date(assignment.due_date).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#6B7328] dark:text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Uploaded
              </h3>
            </div>
            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {new Date(assignment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
            Description
          </h3>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-neutral-300">
            {assignment.description || "No description available."}
          </p>
        </div>

        {/* Assignment PDF */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
              Assignment File
            </h3>

            <a
              href={assignment.file_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#6B7328] px-4 py-2 text-xs font-medium text-white hover:bg-[#55601F] dark:bg-[#FFC107] dark:text-black dark:hover:bg-[#ffca28]"
            >
              Download PDF
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E8ECE5] dark:border-neutral-800">
            <iframe
              src={assignment.file_url}
              title="Assignment PDF"
              className="h-[700px] w-full bg-white dark:bg-black"
            />
          </div>
        </div>

        {submission && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <h3 className="text-sm font-semibold text-green-700 dark:text-emerald-400">
              ✅ Assignment Submitted
            </h3>

            <div className="mt-3 space-y-2 text-xs dark:text-neutral-300">
              <p>
                <span className="font-semibold">File:</span> {submission.file_name}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {submission.status}
              </p>
              <p>
                <span className="font-semibold">Comments:</span> {submission.comments}
              </p>

              <div className="flex gap-2">
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#6B7328] px-3 py-1.5 text-[11px] text-white dark:bg-[#FFC107] dark:text-black"
                >
                  View
                </a>
                <a
                  href={submission.file_url}
                  download
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-[11px] dark:border-neutral-700 dark:text-white"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Submission */}
        <div className="mt-8 rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-6">
          <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
            Submit Assignment
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
            Upload your completed assignment before the due date.
          </p>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium text-[#24310F] dark:text-white">
              Assignment File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border border-[#D8DFC8] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-xs dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#798321]/10 file:text-[#798321] dark:file:bg-[#FFC107]/10 dark:file:text-[#FFC107]"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium text-[#24310F] dark:text-white">
              Comments (Optional)
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write your comments..."
              className="w-full rounded-xl border border-[#D8DFC8] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#798321] dark:focus:border-[#FFC107]"
            />
          </div>

          <button
            onClick={handleSubmitAssignment}
            disabled={uploading}
            className="mt-5 rounded-xl bg-[#6B7328] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#55601F] disabled:opacity-50 dark:bg-[#FFC107] dark:text-black dark:hover:bg-[#ffca28]"
          >
            {uploading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}