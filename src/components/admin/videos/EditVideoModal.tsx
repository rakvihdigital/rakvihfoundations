"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";

const supabase = createClient();

interface Props {
  videoId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditVideoModal({ videoId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [programs, setPrograms] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const [form, setForm] = useState({
    program_id: "",
    syllabus_id: "",
    topic_id: "",
    title: "",
    description: "",
    duration: "",
    sort_order: 1,
    status: "Published",
    thumbnail: "",
    video_url: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (videoId) {
      loadPrograms();
      loadVideo();
    }
  }, [videoId]);

  async function loadPrograms() {
    const { data } = await supabase
      .from("programs")
      .select("id, title")
      .order("title");
    if (data) setPrograms(data);
  }

  async function loadVideo() {
    const { data, error } = await supabase
      .from("course_videos")
      .select("*")
      .eq("id", videoId)
      .single();

    if (error || !data) {
      alert("Video not found");
      onClose();
      return;
    }

    setForm({
      program_id: data.program_id?.toString() || "",
      syllabus_id: data.syllabus_id?.toString() || "",
      topic_id: data.topic_id?.toString() || "",
      title: data.title || "",
      description: data.description || "",
      duration: data.duration || "",
      sort_order: data.sort_order || 1,
      status: data.status || "Published",
      thumbnail: data.thumbnail || "",
      video_url: data.video_url || "",
    });

    if (data.program_id) await loadModules(data.program_id.toString());
    if (data.syllabus_id) await loadTopics(data.syllabus_id.toString());

    setLoading(false);
  }

  async function uploadThumbnail() {
    if (!thumbnailFile) return form.thumbnail;
    const fileName = `${Date.now()}-${thumbnailFile.name}`;
    const { error } = await supabase.storage
      .from("video-thumbnails")
      .upload(fileName, thumbnailFile);
    if (error) {
      alert(error.message);
      return form.thumbnail;
    }
    const { data } = supabase.storage
      .from("video-thumbnails")
      .getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function uploadVideo() {
    if (!videoFile) return form.video_url;
    const fileName = `${Date.now()}-${videoFile.name}`;
    const { error } = await supabase.storage
      .from("course-videos")
      .upload(fileName, videoFile);
    if (error) {
      alert(error.message);
      return form.video_url;
    }
    const { data } = supabase.storage
      .from("course-videos")
      .getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function updateVideo() {
    if (
      !form.program_id ||
      !form.syllabus_id ||
      !form.topic_id ||
      !form.title.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);
    const thumbnail = await uploadThumbnail();
    const videoUrl = await uploadVideo();

    const { error } = await supabase
      .from("course_videos")
      .update({
        program_id: Number(form.program_id),
        syllabus_id: Number(form.syllabus_id),
        topic_id: Number(form.topic_id),
        title: form.title,
        description: form.description,
        duration: form.duration,
        sort_order: form.sort_order,
        status: form.status,
        thumbnail,
        video_url: videoUrl,
      })
      .eq("id", videoId);

    setSaving(false);
    if (error) {
      alert(error.message);
    } else {
      alert("Video Updated Successfully");
      onSuccess();
    }
  }

  async function loadModules(programId: string) {
    const { data } = await supabase
      .from("course_syllabus")
      .select("id,module_name")
      .eq("program_id", Number(programId))
      .order("id", { ascending: true });
    setModules(data || []);
  }

  async function loadTopics(moduleId: string) {
    const { data } = await supabase
      .from("course_topics")
      .select("id,topic")
      .eq("syllabus_id", Number(moduleId))
      .order("id", { ascending: true });
    setTopics(data || []);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#6B7328] border-t-transparent"></div>
          <p className="mt-4 text-xs text-gray-500">Loading Video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 dark:bg-[#111827]">
        {/* Header with Close Icon */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#24310F]">Edit Video</h1>
            <p className="mt-1 text-xs text-gray-500">Update course video details.</p>
          </div>

          {/* Cancel Icon */}
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="max-h-[68vh] overflow-y-auto pr-3 thin-green-scrollbar">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xl dark:border-[#334155] dark:bg-[#111827]">
            
            <div className="grid gap-4 md:grid-cols-2 text-xs">
              {/* Program */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  PROGRAM
                </label>
                <select
                  value={form.program_id}
                  onChange={(e) => {
                    const programId = e.target.value;
                    setForm({ ...form, program_id: programId, syllabus_id: "", topic_id: "" });
                    setModules([]);
                    setTopics([]);
                    if (programId) loadModules(programId);
                  }}
                  className="w-full rounded-2xl border border-gray-300 bg-white p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Module */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  MODULE
                </label>
                <select
                  value={form.syllabus_id}
                  onChange={(e) => {
                    const moduleId = e.target.value;
                    setForm({ ...form, syllabus_id: moduleId, topic_id: "" });
                    setTopics([]);
                    if (moduleId) loadTopics(moduleId);
                  }}
                  className="w-full rounded-2xl border border-gray-300 bg-white p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                >
                  <option value="">Select Module</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>{m.module_name}</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  TOPIC
                </label>
                <select
                  value={form.topic_id}
                  onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 bg-white p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.topic}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  VIDEO TITLE
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                />
              </div>

              {/* Duration & Priority */}
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                    DURATION
                  </label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                    PRIORITY
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
              />
            </div>

            {/* Thumbnail & Video */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  THUMBNAIL
                </label>
                <img
                  src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : form.thumbnail}
                  alt="Thumbnail"
                  className="mb-3 h-44 w-full rounded-2xl object-cover border"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  VIDEO FILE
                </label>
                {(videoFile || form.video_url) && (
                  <video controls className="mb-3 h-48 w-full rounded-2xl border bg-black">
                    <source src={videoFile ? URL.createObjectURL(videoFile) : form.video_url} type="video/mp4" />
                  </video>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                STATUS
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full max-w-xs rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl border border-gray-300 px-5 py-2 text-xs font-medium dark:border-[#334155] dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={updateVideo}
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-[#4D6B2F] via-[#6B7328] to-[#FFC107] px-6 py-2 text-xs font-semibold text-white disabled:opacity-70"
              >
                {saving ? "Updating..." : "Update Video"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}