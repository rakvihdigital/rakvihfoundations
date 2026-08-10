"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
}

export default function WatchVideoPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  async function loadVideo() {
    try {
      const res = await fetch(
        `/api/admin/videos/topic-videos?videoId=${videoId}`
      );

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setVideo(data[0]);
      } else {
        setVideo(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Video not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-[#24310F]">
        {video.title}
      </h1>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <video
          controls
          className="w-full rounded-t-2xl"
          src={video.video_url}
        >
          Your browser does not support the video tag.
        </video>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#24310F]">
            Description
          </h2>

          <p className="mt-2 text-gray-600">
            {video.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
}