"use client";

interface Props {
  videoId: number;
  videoUrl: string;
  title: string;
  onCompleted?: (videoId: number) => void | Promise<void>;
}

export default function VideoPlayer({
  videoId,
  videoUrl,
  title,
  onCompleted,
}: Props) {
  const handleVideoEnded = async () => {
    if (!onCompleted) return;

    try {
      await onCompleted(videoId);
    } catch (error) {
      console.error("Error completing video:", error);
    }
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#E8ECE5]
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        shadow-lg
        transition-colors
        duration-300
      "
    >
      <div className="aspect-video bg-black">
        <video
          key={videoId}
          controls
          controlsList="nodownload"
          className="h-full w-full"
          onEnded={handleVideoEnded}
        >
          <source
            src={videoUrl}
            type="video/mp4"
          />

          Your browser does not support video.
        </video>
      </div>

      <div className="border-t border-[#E8ECE5] dark:border-neutral-800 p-5">
        <h2 className="text-lg font-semibold text-[#24310F] dark:text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}