"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import {
  Play,
  Pencil,
  Trash2,
  Eye,
  Clock3,
} from "lucide-react";

import WatchVideoModal from "@/components/admin/videos/WatchVideoModal";
import EditVideoModal from "@/components/admin/videos/EditVideoModal";
import VideoTabs from "@/components/admin/videos/VideoTabs";

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

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  syllabus_id: number | null;
  topic_id: number | null;
}

export default function ProgramModulesPage() {
  const { programId } = useParams<{ programId: string }>();

  const [programName, setProgramName] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [editVideoId, setEditVideoId] = useState<number | null>(null);

  useEffect(() => {
    if (!programId) return;

    loadProgram();
    loadModules();
    loadVideos();
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

    if (data) setProgramName(data.title);
  }

  async function loadModules() {
    const { data } = await supabase
      .from("course_syllabus")
      .select("id,module_name")
      .eq("program_id", Number(programId))
      .order("id");

    if (data) setModules(data);
  }

  async function loadTopics(moduleId: number) {
    const { data } = await supabase
      .from("course_topics")
      .select("id, topic, syllabus_id")
      .eq("syllabus_id", moduleId)
      .order("id");

    setTopics(data ?? []);
  }

  async function loadVideos() {
    const { data } = await supabase
      .from("course_videos")
      .select(`
        id,
        title,
        thumbnail,
        duration,
        syllabus_id,
        topic_id
      `)
      .eq("program_id", Number(programId))
      .eq("status", "Published");

    if (data) setVideos(data);
  }

  async function deleteVideo(id: number) {
    const ok = confirm("Are you sure you want to delete this video?");

    if (!ok) return;

    const { error } = await supabase
      .from("course_videos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Unable to delete video");
      return;
    }

    loadVideos();
  }

  const filteredVideos = videos.filter((video) => {
    if (selectedModule && video.syllabus_id !== selectedModule) return false;
    if (selectedTopic && video.topic_id !== selectedTopic) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
          {programName}
        </h1>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Manage module videos
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-blue-900/30">
        <div className="flex items-start">
          <div className="flex-1">
            <VideoTabs
              modules={modules}
              activeModule={selectedModule}
              setActiveModule={(id) => {
                setSelectedModule(id);
                setSelectedTopic(null);
              }}
            />
          </div>

          <div className="ml-auto pb-2">
            <select
              disabled={selectedModule === null}
              value={selectedTopic ?? ""}
              onChange={(e) =>
                setSelectedTopic(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="appearance-none rounded-full bg-gradient-to-r from-[#5B6E24] via-[#8A8B1F] to-[#FFC107] dark:bg-[#0F172A] border border-transparent dark:border-blue-900/30 px-6 py-2.5 pr-10 text-xs font-semibold text-white shadow-md outline-none disabled:opacity-60"
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
      </div>

      {/* Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="overflow-hidden rounded-lg border border-[#ECECEC] dark:border-blue-900/30 bg-white dark:bg-[#08111F] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div
              onClick={() => setSelectedVideoId(video.id)}
              className="relative h-48 cursor-pointer overflow-hidden bg-gray-100 dark:bg-[#0F172A] group"
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                  No Thumbnail
                </div>
              )}

              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC107] shadow-md group-hover:scale-110 transition duration-300">
                  <Play
                    size={18}
                    className="text-white fill-white ml-0.5"
                  />
                </div>
              </div>

              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideoId(video.id);
                  }}
                  className="rounded-md bg-gradient-to-r from-[#4D6B2F] via-[#6B7328] to-[#FFC107] p-1.5 text-white shadow-sm hover:scale-110 transition-all duration-300"
                >
                  <Eye size={13} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditVideoId(video.id);
                  }}
                  className="rounded-md bg-[#6B7328] p-1.5 text-white hover:bg-[#5A6422] hover:scale-110 transition-all duration-300"
                >
                  <Pencil size={13} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVideo(video.id);
                  }}
                  className="rounded-md bg-[#4D6B2F] p-1.5 text-white hover:bg-[#3F5A27] hover:scale-110 transition-all duration-300"
                >
                  <Trash2 size={13} />
                </button>
                              </div>
            </div>

            {/* Card Content */}
            <div className="px-4 py-1.5">
              <h2 className="text-xs font-semibold text-[#24310F] dark:text-white leading-4 line-clamp-2">
                {video.title}
              </h2>

              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                <Clock3 size={10} />
                <span>{video.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#A3B68C] dark:border-blue-900/30 bg-white dark:bg-[#08111F] py-10 text-center text-xs text-gray-500 dark:text-gray-400">
          No videos found.
        </div>
      )}

      {selectedVideoId && (
        <WatchVideoModal
          videoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}

      {editVideoId && (
        <EditVideoModal
          videoId={editVideoId}
          onClose={() => setEditVideoId(null)}
          onSuccess={() => {
            setEditVideoId(null);
            loadVideos();
          }}
        />
      )}
    </div>
  );
}