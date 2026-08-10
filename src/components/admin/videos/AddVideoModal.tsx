"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";

const supabase = createClient();

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
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVideoModal({ onClose, onSuccess }: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [programId, setProgramId] = useState("");
  const [syllabusId, setSyllabusId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState("Published");

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    const { data } = await supabase
      .from("programs")
      .select("id,title")
      .order("title");
    if (data) setPrograms(data);
  }

  async function loadModules(programId: string) {
    const { data } = await supabase
      .from("course_syllabus")
      .select("id,module_name")
      .eq("program_id", programId)
      .order("id");

    setModules(data || []);
    setTopics([]);
    setSyllabusId("");
    setTopicId("");
  }

  async function loadTopics(moduleId: string) {
    const { data } = await supabase
      .from("course_topics")
      .select("id,topic")
      .eq("syllabus_id", moduleId)
      .order("id");

    setTopics(data || []);
    setTopicId("");
  }

  async function uploadThumbnail() {
    if (!thumbnailFile) return "";
    const fileName = `${crypto.randomUUID()}-${thumbnailFile.name}`;
    const { error } = await supabase.storage
      .from("video-thumbnails")
      .upload(fileName, thumbnailFile, { upsert: true });

    if (error) {
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage
      .from("video-thumbnails")
      .getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function uploadVideo() {
    if (!videoFile) return "";
    const fileName = `${crypto.randomUUID()}-${videoFile.name}`;
    const { error } = await supabase.storage
      .from("course-videos")
      .upload(fileName, videoFile, { upsert: true });

    if (error) {
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage
      .from("course-videos")
      .getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function saveVideo() {
    if (!programId || !syllabusId || !topicId || !title.trim() || !description.trim() || !duration.trim() || !thumbnailFile || !videoFile) {
      alert("Please fill all required fields and upload files.");
      return;
    }

    setLoading(true);

    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadThumbnail(),
      uploadVideo(),
    ]);

    if (!thumbnailUrl || !videoUrl) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("course_videos").insert({
      program_id: Number(programId),
      syllabus_id: Number(syllabusId),
      topic_id: Number(topicId),
      title,
      description,
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
      duration,
      sort_order: priority,
      status,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Video uploaded successfully.");
      onSuccess();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 dark:bg-[#111827]">
        {/* Header with Close Icon */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#24310F]">Add New Video</h1>
            <p className="mt-1 text-xs text-gray-500">Upload a new course video.</p>
          </div>

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
                  value={programId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setProgramId(id);
                    if (id) loadModules(id);
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
                  value={syllabusId}
                  onChange={(e) => {
                    setSyllabusId(e.target.value);
                    if (e.target.value) loadTopics(e.target.value);
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
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                  placeholder="HTML Introduction"
                />
              </div>

              {/* Duration & Priority */}
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                    DURATION
                  </label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                    placeholder="15 min"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                    PRIORITY
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                placeholder="Enter video description..."
              />
            </div>

            {/* Thumbnail & Video */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  THUMBNAIL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                />
                {thumbnailFile && (
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Preview"
                    className="mt-3 h-44 w-full rounded-2xl object-cover border"
                  />
                )}
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                  VIDEO FILE
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-gray-300 p-2.5 text-xs dark:bg-[#1E293B] dark:border-[#334155] dark:text-white"
                />
                {videoFile && (
                  <div className="mt-3 rounded-2xl bg-[#F0F4E8] p-3">
                    <p className="text-xs font-medium text-[#6B7328]">{videoFile.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-500">
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                onClick={saveVideo}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-[#4D6B2F] via-[#6B7328] to-[#FFC107] px-6 py-2 text-xs font-semibold text-white disabled:opacity-70"
              >
                {loading ? "Uploading..." : "Save & Upload Video"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}