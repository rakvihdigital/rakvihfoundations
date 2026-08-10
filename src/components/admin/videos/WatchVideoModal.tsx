"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
  videoId: number | null;
  onClose: () => void;
}

export default function WatchVideoModal({
  videoId,
  onClose,
}: Props) {
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  async function loadVideo() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/videos/watch?videoId=${videoId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setVideo(data[0]);
      } else {
        setVideo(data);
      }

      // Hide description whenever a new video is opened
      setShowDescription(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="truncate text-base font-semibold text-[#24310F]">
            {video?.title || "Watch Video"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center text-sm text-gray-500">
            Loading...
          </div>
        ) : !video ? (
          <div className="flex h-72 items-center justify-center text-sm text-gray-500">
            Video not found.
          </div>
        ) : (
          <>
            {/* Video */}
            <div className="bg-black">
              <video
                controls
                autoPlay
                className="aspect-video w-full bg-black"
                src={video.video_url}
              />
            </div>

            {/* Info */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#24310F]">
                  {video.title}
                </h3>

                <p className="whitespace-nowrap text-xs text-gray-500">
                  {video.duration}
                </p>
              </div>

              {video.description && (
                <>
                  <button
                    onClick={() =>
                      setShowDescription(!showDescription)
                    }
                    className="mt-2 text-xs font-medium text-[#24310F] hover:underline"
                  >
                    {showDescription
                      ? "Hide Description"
                      : "Show Description"}
                  </button>

                  {showDescription && (
                    <p className="mt-2 text-sm leading-5 text-gray-600">
                      {video.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}