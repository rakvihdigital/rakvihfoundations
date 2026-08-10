"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import VideoCard from "@/components/student/videos/VideoCard";
import VideoTabs from "@/components/student/videos/VideoTabs";
import TopicFilter from "@/components/student/videos/TopicFilter";

import { useRouter } from "next/navigation";

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
  syllabus_id: number;
  topic_id: number;
  video_url: string;
}

export default function StudentVideosPage() {
  const router = useRouter();

  const [programName, setProgramName] = useState("");

  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [selectedModule, setSelectedModule] =
    useState<number | null>(null);

  const [selectedTopic, setSelectedTopic] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedModule === null) {
      setTopics([]);
      return;
    }

    loadTopics(selectedModule);
    setSelectedTopic(null);

  }, [selectedModule]);

  async function loadData() {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Enrollment

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("program_id")
        .eq("user_id", user.id)
        .single();

      if (!enrollment) return;

      // Program

      const { data: program } = await supabase
        .from("programs")
        .select("title")
        .eq("id", enrollment.program_id)
        .single();

      if (program) {
        setProgramName(program.title);
      }

      // Modules

      const { data: moduleData } = await supabase
        .from("course_syllabus")
        .select("id,module_name")
        .eq("program_id", enrollment.program_id)
        .order("id");

      setModules(moduleData ?? []);

      // Videos

      const { data: videoData } = await supabase
        .from("course_videos")
        .select(`
          id,
          title,
          thumbnail,
          duration,
          syllabus_id,
          topic_id,
          video_url
        `)
        .eq("program_id", enrollment.program_id)
        .eq("status", "Published");

      setVideos(videoData ?? []);

    } finally {
      setLoading(false);
    }
  }

async function loadTopics(moduleId: number) {
  const topicIds = [
    ...new Set(
      videos
        .filter((v) => v.syllabus_id === moduleId)
        .map((v) => v.topic_id)
    ),
  ];

  if (topicIds.length === 0) {
    setTopics([]);
    return;
  }

  const { data } = await supabase
    .from("course_topics")
    .select("id, topic, syllabus_id")
    .in("id", topicIds)
    .order("id");

  setTopics(data ?? []);
}

  const filteredVideos = videos.filter((video) => {
    if (
      selectedModule &&
      video.syllabus_id !== selectedModule
    )
      return false;

    if (
      selectedTopic &&
      video.topic_id !== selectedTopic
    )
      return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Loading videos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

          <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
          Training Videos
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {programName}
        </p>

      </div>

      {/* Module Tabs */}

    <div className="flex flex-wrap items-center justify-between gap-4">
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

  <div className="shrink-0">
    <TopicFilter
      topics={topics}
      selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic}
      disabled={selectedModule === null}
    />
  </div>
</div>
      {/* Videos */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filteredVideos.map((video) => {

          const module = modules.find(
            (m) => m.id === video.syllabus_id
          );

          return (
            <VideoCard
              key={video.id}
              video={{
                id: video.id,
                title: video.title,
                thumbnail: video.thumbnail,
                duration: video.duration,
                module:
                  module?.module_name ?? "Module",
              }}
              onWatch={(id) =>
                router.push(
                  `/student/videos/${id}`
                )
              }
            />
          );
        })}

      </div>

      {filteredVideos.length === 0 && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-[#D9E2C2]
            dark:border-neutral-800
            bg-white
            dark:bg-[#0a0a0a]
            py-16
            text-center
          "
        >
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            No videos available.
          </p>
        </div>
      )}

    </div>
  );
}