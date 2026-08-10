"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import VideoPlayer from "@/components/student/videos/VideoPlayer";

import {
  Clock3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  ArrowLeft,
} from "lucide-react";

const supabase = createClient();

interface Video {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  video_url: string;
  syllabus_id: number;
  topic_id: number;
  program_id: number;
}

export default function WatchVideoPage() {
  const router = useRouter();
  const { videoId } = useParams<{ videoId: string }>();

  const [video, setVideo] = useState<Video | null>(null);
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const [moduleName, setModuleName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  async function loadVideo() {
    try {
      const { data, error } = await supabase
        .from("course_videos")
        .select("*")
        .eq("id", Number(videoId))
        .single();

      if (error || !data) {
        console.log(error);
        return;
      }

      setVideo(data);

      // Module
      const { data: module } = await supabase
        .from("course_syllabus")
        .select("module_name")
        .eq("id", data.syllabus_id)
        .single();

      if (module) setModuleName(module.module_name);

      // Topic
      const { data: topic } = await supabase
        .from("course_topics")
        .select("topic")
        .eq("id", data.topic_id)
        .single();

      if (topic) setTopicName(topic.topic);

      // Playlist
      const { data: list } = await supabase
        .from("course_videos")
        .select("*")
        .eq("program_id", data.program_id)
        .eq("status", "Published")
        .order("id");

      setPlaylist(list ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVideoCompleted(completedVideoId: number) {
    console.log("✅ handleVideoCompleted called");
    console.log("Video ID:", completedVideoId);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !video) return;

      // Get student's enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id, program_id")
        .eq("user_id", user.id)
        .eq("program_id", video.program_id)
        .single();

      if (enrollmentError || !enrollment) {
        console.error("Enrollment not found:", enrollmentError);
        return;
      }

      const studentId = enrollment.id;

      // Check whether THIS video was already completed
      const { data: existingCompletion } = await supabase
        .from("student_video_progress")
        .select("id")
        .eq("student_id", studentId)
        .eq("video_id", completedVideoId)
        .maybeSingle();

      // Save only once
      if (!existingCompletion) {
        const { error: insertError } = await supabase
          .from("student_video_progress")
          .insert({
            student_id: studentId,
            video_id: completedVideoId,
            completed: true,
          });

        console.log("Insert Error:", insertError);

        if (!insertError) {
          console.log("✅ Insert Success");
        }

        if (insertError) {
          console.error("Completion insert error:", insertError);
          return;
        }
      }

      // Get ALL currently published admin-added videos
      // for this student's course
      const { data: currentVideos, error: videosError } = await supabase
        .from("course_videos")
        .select("id")
        .eq("program_id", enrollment.program_id)
        .eq("status", "Published");

      if (videosError) {
        console.error("Videos error:", videosError);
        return;
      }

      const videoIds = (currentVideos ?? []).map((item) => item.id);

      const totalVideos = videoIds.length;

      // Count completed videos belonging ONLY to current course
      let completedVideos = 0;

      if (videoIds.length > 0) {
        const { count, error: countError } = await supabase
          .from("student_video_progress")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("student_id", studentId)
          .eq("completed", true)
          .in("video_id", videoIds);

        if (countError) {
          console.error("Progress count error:", countError);
          return;
        }

        completedVideos = count ?? 0;
      }

      // Calculate live percentage
      const progressPercentage =
        totalVideos === 0
          ? 0
          : Math.round((completedVideos / totalVideos) * 100);

      // Keep percentage between 0 and 100
      const safeProgress = Math.min(100, Math.max(0, progressPercentage));

      // Update summary table used by InternshipHero
      const { error: progressError } = await supabase
        .from("student_progress")
        .upsert(
          {
            student_id: studentId,

            videos_completed: completedVideos,

            total_videos: totalVideos,

            progress: safeProgress,

            last_video: String(completedVideoId),

            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "student_id",
          },
        );

      if (progressError) {
        console.error("Student progress update error:", progressError);

        return;
      }

      console.log(
        `Progress updated: ${completedVideos}/${totalVideos} = ${safeProgress}%`,
      );
    } catch (error) {
      console.error("Error updating video progress:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-xs text-gray-500 dark:text-neutral-400">Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-xs text-gray-500 dark:text-neutral-400">Video not found.</p>
      </div>
    );
  }

  const currentIndex = playlist.findIndex((v) => v.id === video.id);
  const previousVideo = currentIndex > 0 ? playlist[currentIndex - 1] : null;
  const nextVideo =
    currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="-mt-4 mb-2">
        <button
          onClick={() => router.back()}
          className="
            inline-flex
            items-center
            justify-center
            p-1
            text-[#24310F]
            dark:text-white
            hover:text-[#6B7328]
            dark:hover:text-[#FFC107]
            transition-all
          "
          title="Back"
        >
          <ArrowLeft size={18} strokeWidth={2.8} />
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {/* Main Video Content */}
        <div className="xl:col-span-3">
          <VideoPlayer
            videoId={video.id}
            videoUrl={video.video_url}
            title={video.title}
            onCompleted={handleVideoCompleted}
          />
          <div className="mt-6 rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm">
            {/* Status */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EEF6D8] px-3 py-1 text-xs font-semibold text-[#6B7328] dark:bg-neutral-900 dark:text-[#FFC107]">
                Active Lesson
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400">
                <Clock3 size={14} />
                {video.duration}
              </div>
            </div>

            {/* Title */}
            <h1 className="mt-5 text-2xl font-bold text-[#24310F] dark:text-white">
              {video.title}
            </h1>

            {/* Module & Topic */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                  <PlayCircle size={16} className="text-[#FFC107]" />
                  <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                    Topic
                  </h3>
                </div>
                <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
                  {topicName}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
                Description
              </h3>
              <p className="mt-3 text-xs leading-6 text-gray-600 dark:text-neutral-300">
                {video.description ||
                  "No description available for this lesson."}
              </p>
            </div>

            {/* Previous / Next */}
            <div className="mt-8 flex items-center justify-between">
              <button
                disabled={!previousVideo}
                onClick={() =>
                  previousVideo &&
                  router.push(`/student/videos/${previousVideo.id}`)
                }
                className="flex items-center gap-2 rounded-xl border border-[#E8ECE5] dark:border-neutral-800 px-5 py-3 text-xs font-medium text-[#24310F] dark:text-white hover:bg-[#F7F9F2] dark:hover:bg-neutral-800 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                disabled={!nextVideo}
                onClick={() =>
                  nextVideo && router.push(`/student/videos/${nextVideo.id}`)
                }
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B6E24] via-[#6B7328] to-[#FFC107] px-6 py-3 text-xs font-semibold text-white shadow-md hover:scale-105 transition disabled:opacity-40 dark:text-black"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div>
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-sm">
            <div className="border-b border-[#E8ECE5] dark:border-neutral-800 p-5">
              <h2 className="text-base font-semibold text-[#24310F] dark:text-white">
                Course Playlist
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                {playlist.length} Lessons
              </p>
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {playlist.map((item, index) => {
                const active = item.id === video.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/student/videos/${item.id}`)}
                    className={`w-full border-b border-[#F1F3ED] dark:border-neutral-800 p-4 text-left transition-all duration-300 ${
                      active
                        ? "bg-[#EEF6D8] dark:bg-neutral-900"
                        : "hover:bg-[#F9FBF5] dark:hover:bg-[#171717]"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg flex-shrink-0">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-200 dark:bg-neutral-800">
                            <PlayCircle size={20} className="text-[#6B7328] dark:text-[#FFC107]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-[#6B7328] dark:text-[#FFC107]">
                          Lesson {index + 1}
                        </p>
                        <h3
                          className={`mt-1 line-clamp-2 text-xs font-semibold ${
                            active
                              ? "text-[#24310F] dark:text-white"
                              : "text-gray-800 dark:text-neutral-200"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 dark:text-neutral-400">
                          <Clock3 size={10} />
                          {item.duration}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}