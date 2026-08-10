"use client";

import { Search,ChevronDown, Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const router = useRouter();


 useEffect(() => {

  setMounted(true);

  const loadAdmin = async () => {
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("admins")
      .select("full_name,email,role")
      .eq("auth_id", user.id)
      .single();

    setAdmin(data);
  };

  loadAdmin();

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);
  if (!mounted) return null;
  
  return (
    <header className="sticky top-0 z-50 h-16 bg-white/95 dark:bg-[#081525]/95 backdrop-blur-xl border-b border-[#E8ECE5] dark:border-[#1E3A5F]">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
className="text-base font-medium text-[#24310F] dark:text-white"          >
          Welcome back, {admin?.full_name || "Admin"}
          </motion.h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden lg:flex items-center w-[380px] h-11 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] border border-[#E8ECE5] dark:border-[#1E3A5F] px-4 focus-within:border-[#6B7328] dark:focus-within:border-[#38BDF8] transition-all"
          >
            <Search size={18} className="text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search students, courses, payments..."
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#6B7280]"
            />
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-11 h-11 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] border border-[#E8ECE5] dark:border-[#1E3A5F] flex items-center justify-center hover:shadow-md transition-all"
          >
            {theme === "dark" ? <Sun size={20} className="text-[#38BDF8]" /> : <Moon size={20} className="text-[#6B7328]" />}
          </motion.button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] bg-white dark:bg-[#132238] hover:border-[#6B7328] dark:hover:border-[#38BDF8] transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B7328] via-[#FFC107] to-[#6B7328] dark:from-[#2563EB] dark:to-[#38BDF8] flex items-center justify-center text-white font-semibold shadow-inner">
               {admin?.full_name?.charAt(0).toUpperCase() || "A"}
              </div>
              <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 rounded-3xl bg-white dark:bg-[#0F172A] border border-[#E8ECE5] dark:border-[#1E3A5F] shadow-2xl py-2 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-[#E8ECE5] dark:border-[#1E3A5F]">
                    <p className="text-xs text-[#6B7280]">{admin?.role === "super_admin"
  ? "Super Admin"
  : "Sub Admin"}</p>
                    <p className="font-medium text-[#24310F] dark:text-white">{admin?.email}</p>
                  </div>
              <button
  onClick={async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.replace("/admin/login");
  }}
  className="w-full flex items-center gap-3 px-6 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
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