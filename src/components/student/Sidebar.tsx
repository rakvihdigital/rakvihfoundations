"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlayCircle,
  FileText,
  ClipboardList,
  Award,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Internship",
    href: "/student/my-internship",
    icon: BriefcaseBusiness,
  },
  {
    title: "Videos",
    href: "/student/videos",
    icon: PlayCircle,
  },
  {
    title: "Materials",
    href: "/student/materials",
    icon: FileText,
  },
  {
    title: "Assignments",
    href: "/student/assignments",
    icon: ClipboardList,
  },
  {
    title: "Certificate",
    href: "/student/certificate",
    icon: Award,
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/student-login");
    router.refresh();
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 170 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="
        sticky
        top-0
        h-screen
        flex
        flex-col
        border-r
        border-[#E8ECE5]
        dark:border-neutral-800
        bg-white
        dark:bg-[#0a0a0a]
        shadow-2xl
        shadow-black/5
        dark:shadow-none
        z-50
        transition-colors
        duration-500
      "
    >
      {/* ================= Logo ================= */}

      <div className="relative flex h-16 items-center justify-center border-b border-[#E8ECE5] dark:border-neutral-800">
        {!collapsed && (
          <div className="flex flex-col items-center justify-center -mt-3">            
            <div className="relative h-[54px] w-[54px]">
              {/* Light Logo */}
              <Image
                src="/images/logo.png"
                alt="RAKVIH Logo"
                fill
                sizes="54px"
                priority
                className="object-contain dark:hidden"
              />

              {/* Dark Logo */}
              <Image
                src="/images/logo-dark.png"
                alt="RAKVIH Logo"
                fill
                sizes="54px"
                priority
                className="hidden object-contain dark:block"
              />
            </div>

            <h1 className="-mt-3 text-[13px] font-extrabold leading-none tracking-[0.5px] text-[#6B7328] dark:text-[#FFC107]">
              RAKVIH
            </h1>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl hover:bg-[#F8FAF5] dark:hover:bg-neutral-800 dark:text-neutral-300",
            collapsed
              ? "left-1/2 -translate-x-1/2"
              : "right-3"
          )}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </motion.button>
      </div>

      {/* ================= Menu ================= */}

      <div className="flex-1 overflow-y-auto px-2 py-5 sidebar-scrollbar">
        <div className="space-y-1">
          {menus.map((menu, index) => {
            const Icon = menu.icon;

            const active =
              pathname === menu.href ||
              (menu.href !== "/student/dashboard" &&
                pathname.startsWith(menu.href));

            return (
              <Link key={menu.title} href={menu.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.985 }}
                  className={clsx(
                    "group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-300 relative overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white dark:text-black shadow-lg shadow-[#6B7328]/40 dark:shadow-none"
                      : "text-[#24310F] dark:text-neutral-300 hover:bg-[#F8FAF5] dark:hover:bg-neutral-800"
                  )}
                >
                  <Icon
                    size={collapsed ? 14 : 18}
                    strokeWidth={2.2}
                    className="shrink-0 transition-all duration-300 group-hover:scale-110"
                  />

                  {!collapsed && (
                    <span className="truncate">
                      {menu.title}
                    </span>
                  )}

                  {active && (
                    <motion.div
                      layoutId="studentActiveIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-white dark:bg-black"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================= Logout ================= */}

      <div className="border-t border-[#E8ECE5] dark:border-neutral-800 py-4 flex justify-center">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-gray-100
            hover:bg-red-50
            px-3
            py-2
            text-sm
            font-medium
            text-gray-600
            hover:text-red-500
            dark:bg-neutral-900
            dark:text-neutral-400
            dark:hover:bg-red-900/20
            dark:hover:text-red-400
            transition-all
            duration-300
          "
        >
          <LogOut size={16} />

          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}