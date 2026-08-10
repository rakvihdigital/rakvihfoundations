"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { motion } from "framer-motion";

interface Program {
  id: number;
  title: string;
}

interface Module {
  id: number;
  module_name: string;
}

interface Topic {
  id: number;
  topic: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  assignment: any;
  refresh: () => void;
}

export default function EditAssignmentModal({
  open,
  onClose,
  assignment,
  refresh,
}: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    program_id: "",
    syllabus_id: "",
    topic_id: "",
    title: "",
    description: "",
    status: "Published",
  });

  useEffect(() => {
    if (open) {
      loadPrograms();
    }
  }, [open]);

  useEffect(() => {
    if (!assignment) return;

    setForm({
      program_id: String(assignment.program_id),
      syllabus_id: String(assignment.syllabus_id),
      topic_id: String(assignment.topic_id),
      title: assignment.title || "",
      description: assignment.description || "",
      status: assignment.status || "Published",
    });

    loadModules(String(assignment.program_id));
    loadTopics(String(assignment.syllabus_id));
  }, [assignment]);

  async function loadPrograms() {
    const res = await fetch("/api/admin/programs");
    const data = await res.json();
    if (Array.isArray(data)) setPrograms(data);
    else if (data.programs) setPrograms(data.programs);
  }

  async function loadModules(programId: string) {
    const res = await fetch(`/api/admin/programs/syllabus?program_id=${programId}`);
    const data = await res.json();
    setModules(data);
    setTopics([]);
  }

  async function loadTopics(syllabusId: string) {
    const res = await fetch(`/api/admin/programs/topics?syllabus_id=${syllabusId}`);
    const data = await res.json();
    setTopics(data);
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      const formData = new FormData();
      if (!assignment) return;

      formData.append("id", String(assignment.id));
      formData.append("program_id", form.program_id);
      formData.append("syllabus_id", form.syllabus_id);
      formData.append("topic_id", form.topic_id);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("status", form.status);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (pdfFile) {
        formData.append("file", pdfFile);
      }

      const res = await fetch("/api/admin/assignments/update", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Unable to update assignment.");
        return;
      }

      alert("Assignment updated successfully.");
      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-[#0B1C33] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h1 className="text-xl font-bold text-[#24310F] dark:text-white">Edit Assignment</h1>
            <p className="text-xs text-gray-500 mt-1">Update assignment details.</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="max-h-[68vh] overflow-y-auto px-8 pt-3 pb-8">
          <form className="space-y-5 text-xs">
            {/* Program & Module */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  PROGRAM
                </label>
                <select
                  required
                  value={form.program_id}
                  onChange={(e) => {
                    setForm({ ...form, program_id: e.target.value, syllabus_id: "", topic_id: "" });
                    loadModules(e.target.value);
                  }}
                  className="w-full h-9 rounded-2xl border border-gray-200 px-4 text-xs dark:bg-[#1E293B]"
                >
                  <option value="">Select Program</option>
                  {programs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  MODULE
                </label>
                <select
                  required
                  value={form.syllabus_id}
                  onChange={(e) => {
                    setForm({ ...form, syllabus_id: e.target.value, topic_id: "" });
                    loadTopics(e.target.value);
                  }}
                  className="w-full h-9 rounded-2xl border border-gray-200 px-4 text-xs dark:bg-[#1E293B]"
                >
                  <option value="">Select Module</option>
                  {modules.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.module_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                TOPIC
              </label>
              <select
                required
                value={form.topic_id}
                onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                className="w-full h-9 rounded-2xl border border-gray-200 px-4 text-xs dark:bg-[#1E293B]"
              >
                <option value="">Select Topic</option>
                {topics.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Title */}
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                ASSIGNMENT TITLE
              </label>
              <input
                required
                type="text"
                value={form.title}
                placeholder="Assignment 1"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-9 rounded-2xl border border-gray-200 px-4 text-xs dark:bg-[#1E293B]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={form.description}
                placeholder="Brief description..."
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 p-3 text-xs dark:bg-[#1E293B]"
              />
            </div>

            {/* Thumbnail & Replace File - Same Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Replace Thumbnail */}
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  REPLACE THUMBNAIL
                </label>
                <label className="border border-gray-300 rounded-3xl p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition min-h-[260px]">
                  {thumbnailFile ? (
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Preview"
                      className="w-full h-52 object-cover rounded-2xl"
                    />
                  ) : assignment?.thumbnail ? (
                    <img
                      src={assignment.thumbnail}
                      alt="Current Thumbnail"
                      className="w-full h-52 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center py-8">
                      <Upload size={38} className="text-[#6B7328]" />
                      <p className="mt-4 text-sm font-medium text-[#24310F]">Choose Thumbnail</p>
                      <p className="text-[10px] text-gray-500 mt-1">JPG, PNG, WEBP</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Replace Assignment File */}
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  REPLACE ASSIGNMENT FILE
                </label>
                <label className="border border-gray-300 rounded-3xl py-10 px-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition min-h-[260px]">
                  <Upload size={38} className="text-[#6B7328]" />
                  <p className="mt-4 text-sm font-medium text-[#24310F]">Choose New File</p>
                  <p className="text-[10px] text-gray-500 mt-1">PDF • DOCX • PPT supported</p>

                  <input
                    type="file"
                    accept=".pdf,.docx,.ppt,.pptx"
                    hidden
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </label>

                {pdfFile && (
                  <div className="mt-3 flex items-center gap-2 text-[#6B7328] text-xs font-medium bg-green-50 dark:bg-green-900/30 p-3 rounded-2xl">
                    <FileText size={16} />
                    {pdfFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                STATUS
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-9 rounded-2xl border border-gray-200 px-4 text-xs dark:bg-[#1E293B]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            {/* Current Assignment Info */}
            <div className="rounded-2xl border border-[#E8ECE5] bg-[#F8FAF3] dark:bg-[#081525] dark:border-slate-700 p-5">
              <h3 className="text-sm font-semibold text-[#24310F] dark:text-white mb-4">
                Current Assignment
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">FILE NAME</p>
                  <p className="mt-1 text-xs font-medium break-all text-[#24310F] dark:text-white">
                    {assignment.file_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">FILE SIZE</p>
                  <p className="mt-1 text-xs font-medium text-[#24310F] dark:text-white">
                    {assignment.file_size || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">DOWNLOADS</p>
                  <p className="mt-1 text-xs font-medium text-[#24310F] dark:text-white">
                    {assignment.downloads ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl border border-gray-300 text-xs font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white text-xs font-semibold hover:brightness-110 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}