"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WatchVideoModal from "@/components/admin/videos/WatchVideoModal";
interface Topic {
  id: number;
  topic: string;
}

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  topic_id: number;
}

export default function TopicsPage() {
  const searchParams = useSearchParams();

  const moduleId = searchParams.get("moduleId");

  const [topics, setTopics] = useState<Topic[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  useEffect(() => {
    if (moduleId) {
      loadTopics();
    }
  }, [moduleId]);

  useEffect(() => {
    if (selectedTopic) {
      loadVideos();
    }
  }, [selectedTopic]);

  async function loadTopics() {
    try {
      const res = await fetch(
        `/api/admin/programs/topics?moduleId=${moduleId}`
      );
      const data = await res.json();

    if (Array.isArray(data)) {
  setTopics(data);

  if (data.length > 0) {
    setSelectedTopic("all");
  }
}
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

 async function loadVideos() {
  const url =
    selectedTopic === "all"
      ? `/api/admin/videos/topic-videos?moduleId=${moduleId}`
      : `/api/admin/videos/topic-videos?topicId=${selectedTopic}`;

  const res = await fetch(url);
  const data = await res.json();

  setVideos(Array.isArray(data) ? data : []);
}

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      {/* Header - Smaller Text */}
      <h1 className="text-lg font-semibold tracking-tight text-[#24310F]">
        Module Topics
      </h1>

      <p className="mt-0.5 text-xs text-gray-500">
        Select a topic to view videos.
      </p>

      {/* Topic Selector */}
      <div className="mt-5 max-w-md">
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          TOPIC
        </label>

    <select
  value={selectedTopic}
  onChange={(e) => setSelectedTopic(e.target.value)}
  className="w-full rounded-2xl border border-gray-300 bg-white p-3 text-sm"
>
  <option value="all">All Topics</option>

  {topics.map((topic) => (
    <option key={topic.id} value={topic.id}>
      {topic.topic}
    </option>
  ))}
</select>
      </div>

      {/* Video Cards - Compact Style */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-[160px] w-full object-cover"
              />

              <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-[10px] font-semibold text-white">
                {video.duration}
              </div>
            </div>

            {/* Card Body - Tight & Small Text */}
            <div className="px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#6B7328]">
                TOPIC VIDEO
              </p>

              <h3 className="mt-1 text-[13.5px] font-semibold leading-tight text-[#24310F] line-clamp-2">
                {video.title}
              </h3>

              {/* Small Button */}
            <button
  onClick={() => {
    setSelectedVideoId(video.id);
    setOpen(true);
  }}
  className="mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#5F7A2F] to-[#FFC107] py-2 text-[10px] font-semibold text-white transition hover:opacity-90"
>
  ▶ Watch Video
</button>
            </div>
          </div>
        ))}
      </div>
      {open && (
  <WatchVideoModal
    videoId={selectedVideoId}
    onClose={() => setOpen(false)}
  />
)}
    </div>
  );
}