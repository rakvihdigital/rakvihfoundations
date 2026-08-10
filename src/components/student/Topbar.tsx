"use client";

import { Search, ChevronDown, Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Student {
  full_name: string;
  email: string;
  program: string;
  photo_url: string | null;
}

export default function Topbar() {
  const supabase = createClient();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [student, setStudent] = useState<Student | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const loadStudent = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      const { data, error } = await supabase
        .from("enrollments")
        .select("full_name,email,program_title,photo_url")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setStudent({
          full_name: data.full_name,
          email: data.email,
          program: data.program_title,
          photo_url: data.photo_url,
        });
      }
    };

    loadStudent();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#E8ECE5] dark:border-neutral-800 transition-colors duration-500">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left */}

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base font-medium text-[#24310F] dark:text-white"
        >
          Welcome back, {student?.full_name || "Student"}
        </motion.h1>

        {/* Right */}

        <div className="flex items-center gap-4">
          {/* Search */}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden lg:flex items-center w-[380px] h-11 rounded-2xl bg-[#F8FAF5] dark:bg-[#171717] border border-[#E8ECE5] dark:border-neutral-800 px-4 focus-within:border-[#6B7328] dark:focus-within:border-[#FFC107] transition-all"
          >
            <Search size={18} className="text-[#6B7280] dark:text-neutral-500" />

            <input
              type="text"
              placeholder="Search videos, materials, assignments..."
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#6B7280] dark:placeholder:text-neutral-500 dark:text-white"
            />
          </motion.div>

          {/* Theme */}

          {/* Theme Toggle */}

          <motion.button
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#E8ECE5]
              bg-[#F8FAF5]
              shadow-sm
              transition-all
              duration-300
              hover:shadow-md
              dark:border-neutral-800
              dark:bg-[#171717]
            "
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-[#FFC107]" />
            ) : (
              <Moon size={18} className="text-[#6B7328]" />
            )}
          </motion.button>

          {/* Profile */}

          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(!open)}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md dark:border-neutral-800">
                  {student?.photo_url ? (
                    <img
                      src={student.photo_url}
                      alt={student.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6B7328] via-[#FFC107] to-[#6B7328] text-sm font-bold text-white dark:from-[#798321] dark:to-[#FFC107] dark:text-black">
                      {student?.full_name?.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow dark:bg-[#171717]">
                  <ChevronDown
                    size={10}
                    className={`text-gray-600 dark:text-neutral-300 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-[#E8ECE5] bg-white py-2 shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a]"
                >
                  <div className="border-b border-[#E8ECE5] px-6 py-4 dark:border-neutral-800">
                    <p className="text-xs text-[#6B7280] dark:text-neutral-400">Student</p>

                    <p className="mt-1 font-medium text-[#24310F] dark:text-white">
                      {student?.email}
                    </p>

                    <p className="mt-2 text-xs text-[#6B7280] dark:text-neutral-400">
                      {student?.program || "No Program"}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.replace("/student-login");
                    }}
                    className="flex w-full items-center gap-3 px-6 py-4 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}