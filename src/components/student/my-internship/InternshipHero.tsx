"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Clock3,
  Users,
  Trophy,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";

interface Props {
  program: any;
  progress: any;
}

export default function InternshipHero({
  program,
  progress,
}: Props) {
  const router = useRouter();

  if (!program) return null;

  const percent = Math.min(
    100,
    Math.max(0, Number(progress?.progress ?? 0))
  );

  const certificateUnlocked = percent >= 100;

  const handleContinue = () => {
    switch (progress?.next_type) {
      case "video":
        router.push(`/student/videos/${progress.next_video_id}`);
        break;

      case "material":
        router.push(
          `/student/materials/${progress.next_material_id}`
        );
        break;

      case "assignment":
        router.push(
          `/student/assignments/${progress.next_assignment_id}`
        );
        break;

      default:
        router.push("/student/videos");
    }
  };

  const handleCertificate = () => {
    if (!certificateUnlocked) return;

    router.push("/student/certificate");
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/20
        bg-gradient-to-r
        from-[#7D8424]
        via-[#D8A917]
        to-[#FFC107]
        px-3
        py-3
        transition-all
        duration-500
        dark:border-neutral-800
        dark:from-[#0a0a0a]
        dark:via-[#111807]
        dark:to-[#24310F]
      "
    >
      <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}

        <div className="flex items-center gap-3">

          {/* Thumbnail */}

          <div
            className="
              group
              relative
              h-14
              w-20
              flex-shrink-0
              overflow-hidden
              rounded-lg
              border
              border-white/20
              dark:border-neutral-800
              bg-white/10
              dark:bg-[#171717]
              shadow-lg
            "
          >
            <Image
              src={
                program.image ||
                "/images/course-placeholder.png"
              }
              alt={program.title || "Internship"}
              fill
              unoptimized
              className="
                object-cover
                transition-all
                duration-500
                group-hover:scale-110
              "
            />
          </div>

          {/* Details */}

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                bg-white/15
                dark:bg-neutral-900/60
                px-1.5
                py-0.5
                backdrop-blur-xl
              "
            >
              <Sparkles
                size={8}
                className="text-yellow-100 dark:text-[#FFC107]"
              />

              <span
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-white
                  dark:text-[#FFC107]
                "
              >
                INTERNSHIP
              </span>

            </div>

            <h1
              className="
                mt-1
                text-base
                font-extrabold
                leading-tight
                text-white
                dark:text-white
              "
            >
              {program.title}
            </h1>

            <p className="text-[8px] text-white/70 dark:text-neutral-400">
              {program.category}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">

              <div
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  bg-white/10
                  dark:bg-neutral-900/60
                  px-2
                  py-0.5
                  text-[8px]
                "
              >
                <Clock3
                  size={10}
                  className="text-yellow-100 dark:text-[#FFC107]"
                />

                <span className="text-white dark:text-neutral-300">
                  {program.duration}
                </span>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  bg-white/10
                  dark:bg-neutral-900/60
                  px-2
                  py-0.5
                  text-[8px]
                "
              >
                <Users
                  size={10}
                  className="text-yellow-100 dark:text-[#FFC107]"
                />

                <span className="text-white dark:text-neutral-300">
                  {program.students ?? 0}+
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex flex-col items-center gap-2 lg:items-end">

          {/* Progress Circle */}

          <div
            className="
              relative
              flex
              h-14
              w-14
              items-center
              justify-center
            "
          >
            <svg
              className="-rotate-90"
              width="56"
              height="56"
            >
              {/* Background */}

              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="5"
                fill="none"
              />

              {/* Progress */}

              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="#fff"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={138}
                strokeDashoffset={
                  138 - (138 * percent) / 100
                }
                className="transition-all duration-1000"
              />
            </svg>

            {/* Percentage */}

            <div
              className="
                absolute
                flex
                h-9
                w-9
                flex-col
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                dark:border-neutral-800
                bg-white/15
                dark:bg-[#171717]/50
                backdrop-blur-xl
              "
            >
              <span className="text-base font-black leading-none text-white dark:text-white">
                {percent}
              </span>

              <span className="-mt-0.5 text-[7px] text-white/70 dark:text-neutral-400">
                %
              </span>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex gap-2">

            {/* Continue */}

            <button
              type="button"
              onClick={handleContinue}
              className="
                group
                flex
                items-center
                gap-1
                rounded-lg
                bg-white
                dark:bg-[#FFC107]
                px-3
                py-1.5
                text-[10px]
                font-semibold
                text-[#55631B]
                dark:text-black
                shadow-md
                transition-all
                duration-300
                hover:scale-105
              "
            >
              <PlayCircle size={12} />

              Continue

              <ArrowRight
                size={11}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </button>

            {/* Certificate */}

            <button
              type="button"
              onClick={handleCertificate}
              disabled={!certificateUnlocked}
              title={
                certificateUnlocked
                  ? "View Certificate"
                  : `Complete internship to unlock certificate (${percent}%)`
              }
              className={`
                flex
                items-center
                gap-1
                rounded-lg
                border
                px-3
                py-1.5
                text-[10px]
                font-semibold
                backdrop-blur-xl
                transition-all
                duration-300

                ${
                  certificateUnlocked
                    ? `
                      border-white/30
                      dark:border-neutral-700
                      bg-white/10
                      dark:bg-neutral-900
                      text-white
                      dark:text-white
                      hover:bg-white/20
                      dark:hover:bg-neutral-800
                      hover:scale-105
                    `
                    : `
                      border-white/20
                      dark:border-neutral-800
                      bg-white/5
                      dark:bg-neutral-900/40
                      text-white/50
                      dark:text-neutral-500
                      cursor-not-allowed
                    `
                }
              `}
            >
              {certificateUnlocked ? (
                <Trophy size={12} />
              ) : (
                <Lock size={11} />
              )}

              Certificate

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}