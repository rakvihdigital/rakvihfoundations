"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  QrCode,
  Wallet,
  Video,
  FileText,
  ClipboardList,
  Award,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpenCheck,
  UserCog, 
  HeartHandshake,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Programs", href: "/admin/programs", icon: GraduationCap },
  { name: "Tuition", href: "/admin/tuition", icon: BookOpenCheck },
  { name: "Teachers", href: "/admin/teachers", icon: UserCog },
  { 
    name: "Payments", 
    href: "/admin/payments", 
    icon: CreditCard,
    children: [
      { name: "Transactions", href: "/admin/payments", icon: CreditCard },
      { name: "UPI Settings", href: "/admin/payments/upi", icon: QrCode },
    ]
  },
  { name: "Donations", href: "/admin/donations", icon: HeartHandshake },
  { name: "Videos", href: "/admin/videos", icon: Video },
  { name: "Materials", href: "/admin/materials", icon: FileText },
  { name: "Assignments", href: "/admin/assignments", icon: ClipboardList },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Sub Admins", href: "/admin/sub-admins", icon: ShieldCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState<any>(null);
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    setRole(admin.role || "");
    setPermissions(admin.permissions || {});
  }, []);

  // Open dropdown automatically if user is on UPI or Payments page
  useEffect(() => {
    if (pathname.startsWith("/admin/payments")) {
      setPaymentsOpen(true);
    }
  }, [pathname]);

  const filteredMenu =
    role === "super_admin"
      ? menu
      : menu.filter((item) => {
          switch (item.name) {
            case "Dashboard":
              return permissions?.dashboard;
            case "Students":
              return permissions?.students;
            case "Programs":
              return permissions?.programs;
            case "Tuition":
              return permissions?.tuition;
            case "Teachers":
              return permissions?.teachers;
            case "Payments":
              return permissions?.payments;
            case "Donations":
              return permissions?.donations;
            case "Videos":
              return permissions?.videos;
            case "Materials":
              return permissions?.materials;
            case "Assignments":
              return permissions?.assignments;
            case "Certificates":
              return permissions?.certificates;
            case "Reports":
              return permissions?.reports;
            case "Settings":
              return permissions?.settings;
            case "Sub Admins":
              return false;
            default:
              return false;
          }
        });

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/admin/login";
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 190 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="sticky top-0 h-screen flex flex-col border-r border-[#E8ECE5] dark:border-[#1E3A5F] 
                 bg-white dark:bg-[#081525] shadow-2xl shadow-black/5 dark:shadow-black/40 z-50 overflow-x-hidden"
    >
      {/* Logo Section */}
      {/* 1. Increased the height here from h-[64px] to h-[90px] */}
      <div className="relative flex h-[90px] items-center justify-center border-b border-[#E8ECE5] dark:border-[#1E3A5F] shrink-0">
        {!collapsed && (
          <div className="flex flex-col items-center w-full px-3">
            {/* 2. Increased Logo container size from h-[54px] w-[54px] to h-[70px] w-[140px] */}
            <div className="relative h-[70px] w-full max-w-[140px]">
              <Image
                src="/images/Rakvih Foundation.png"
                alt="Logo"
                fill
                sizes="140px"
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/images/Rakvih Foundation.png"
                alt="Logo"
                fill
                sizes="140px"
                priority
                className="hidden object-contain dark:block"
              />
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setCollapsed(!collapsed);
            if (!collapsed) setPaymentsOpen(false);
          }}
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl hover:bg-[#F8FAF5] dark:hover:bg-[#132238]",
            collapsed ? "left-1/2 -translate-x-1/2" : "right-2"
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      {/* Menu Links */}
      <div className="flex-1 overflow-y-auto px-2 py-4 sidebar-scrollbar">
        <div className="space-y-1">
          {filteredMenu.map((item, index) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href) && !hasChildren);

            if (hasChildren) {
              const isParentActive = pathname.startsWith(item.href);

              return (
                <div key={item.name} className="space-y-1">
                  <motion.div
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(false);
                        setPaymentsOpen(true);
                      } else {
                        setPaymentsOpen(!paymentsOpen);
                      }
                    }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.985 }}
                    className={clsx(
                      "group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-medium cursor-pointer transition-all duration-300 relative overflow-hidden",
                      isParentActive
                        ? "bg-gradient-to-r from-[#6B7328]/15 to-[#FFC107]/15 text-[#6B7328] dark:text-[#FFC107] font-bold"
                        : "text-[#24310F] dark:text-gray-300 hover:bg-[#F8FAF5] dark:hover:bg-[#132238]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={collapsed ? 16 : 18}
                        strokeWidth={2.2}
                        className="shrink-0 transition-all duration-300 group-hover:scale-110"
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        size={15}
                        className={clsx(
                          "transition-transform duration-300 shrink-0",
                          paymentsOpen ? "rotate-180" : ""
                        )}
                      />
                    )}
                  </motion.div>

                  {/* Submenu Dropdown Items */}
                  <AnimatePresence>
                    {paymentsOpen && !collapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1 pl-4 overflow-hidden"
                      >
                        {item.children?.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive = pathname === sub.href;

                          return (
                            <Link key={sub.name} href={sub.href}>
                              <motion.div
                                whileHover={{ x: 3 }}
                                className={clsx(
                                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-all",
                                  subActive
                                    ? "bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white shadow-md shadow-[#6B7328]/30"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-[#F8FAF5] dark:hover:bg-[#132238]"
                                )}
                              >
                                <SubIcon size={15} strokeWidth={2} />
                                <span className="truncate">{sub.name}</span>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.985 }}
                  className={clsx(
                    "group flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-sm font-medium cursor-pointer transition-all duration-300 relative overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white shadow-lg shadow-[#6B7328]/40"
                      : "text-[#24310F] dark:text-gray-300 hover:bg-[#F8FAF5] dark:hover:bg-[#132238]"
                  )}
                >
                  <Icon
                    size={collapsed ? 16 : 18}
                    strokeWidth={2.2}
                    className="shrink-0 transition-all duration-300 group-hover:scale-110"
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}

                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-white rounded-r-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="border-t border-[#E8ECE5] dark:border-[#1E3A5F] py-3.5 flex justify-center shrink-0">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-red-50 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-red-500 dark:bg-[#132238] dark:text-gray-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all duration-300"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}