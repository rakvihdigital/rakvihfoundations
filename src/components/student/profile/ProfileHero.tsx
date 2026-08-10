"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  GraduationCap,
  User,
  Pencil,
} from "lucide-react";

interface Props {
  student: any;
  program: any;
}

export default function ProfileHero({
  student,
  program,
}: Props) {
  const router = useRouter();

  const profileImage =
    student?.profile_image ||
    student?.photo_url ||
    student?.avatar ||
    null;

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        bg-gradient-to-r
        from-[#6B7328]
        via-[#8A8F2E]
        to-[#FFC107]
        p-5
        text-white
        dark:border
        dark:border-neutral-800
        dark:bg-gradient-to-r
        dark:from-[#0a0a0a]
        dark:via-[#111807]
        dark:to-[#24310F]
        transition-colors
        duration-300
        shadow-lg
        dark:shadow-none
      "
    >
      {/* Background */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 dark:bg-black/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 dark:bg-black/10 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-4">

          {/* Profile Image */}
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white/20 dark:border-neutral-800 bg-white/10 dark:bg-[#171717] shadow-lg">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={student?.full_name || "Student"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white dark:text-neutral-400">
                <User size={42} />
              </div>
            )}
          </div>

          {/* Student Details */}
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/20 dark:bg-neutral-900/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white dark:text-[#FFC107]">
                Student Profile
              </span>

              {/* Active Badge - Straight Next to Text */}
              <span className="rounded-full bg-green-500/30 dark:bg-green-900/30 px-3 py-1 text-[10px] font-medium border border-white/30 dark:border-green-800/50 text-white dark:text-green-400">
                Active Student
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-white dark:text-white">
              {student?.full_name || "Student"}
            </h1>

            <p className="text-sm text-white/90 dark:text-neutral-300">
              {program?.title || "Internship Program"}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/90 dark:text-neutral-300">
              <div className="flex items-center gap-1">
                <Mail size={14} className="text-white/80 dark:text-[#FFC107]" />
                <span>{student?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={14} className="text-white/80 dark:text-[#FFC107]" />
                <span>{student?.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap size={14} className="text-white/80 dark:text-[#FFC107]" />
                <span>{student?.branch || "-"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right - Edit Icon */}
        <div className="flex items-start">
          <button
            onClick={() => router.push("/student/profile/edit")}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border-2 border-white/70 hover:border-white
              dark:border-neutral-700 dark:hover:border-neutral-500
              bg-transparent hover:bg-white/10
              dark:bg-neutral-900/40 dark:hover:bg-neutral-800
              text-white dark:text-white transition-all duration-300
              hover:scale-105
            "
            title="Edit Profile"
          >
            <Pencil size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}