"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import { 
  LayoutDashboard, 
  CalendarDays, 
  User, 
  LogOut, 
  Menu, 
  X,
  Award,
  Bell,
  BookOpen,
  Heart,
  Globe,
} from "lucide-react";

import LanguageTranslator from "@/components/foundation/LanguageTranslator";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export default function VolunteerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [volunteerName, setVolunteerName] = useState("");

  useEffect(() => {
    // Check if user is logged in via localStorage
    const vid = localStorage.getItem("rakvih_volunteer_id");
    const vname = localStorage.getItem("rakvih_volunteer_name");

    if (!vid) {
      router.push("/foundation/volunteer");
    } else {
      setVolunteerName(vname || "Volunteer");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("rakvih_volunteer_id");
    localStorage.removeItem("rakvih_volunteer_name");
    router.push("/foundation/volunteer");
  };

  const navLinks = [
    { name: "Dashboard", href: "/foundation/volunteer/dashboard", icon: LayoutDashboard },
    { name: "Opportunities", href: "/foundation/volunteer/dashboard/events", icon: CalendarDays },
    { name: "History & Rewards", href: "/foundation/volunteer/dashboard/history", icon: Award },
    { name: "Volunteer Donate", href: "/foundation/volunteer/dashboard/donate", icon: Heart },
    { name: "Notice Board", href: "/foundation/volunteer/dashboard/announcements", icon: Bell },
    { name: "Back to Site", href: "/foundation", icon: Globe },
    { name: "My Profile & Id card", href: "/foundation/volunteer/dashboard/profile", icon: User },
  ];

  return (
    <div className={`fixed inset-0 z-[100] flex h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      
      {/* Mobile Menu Button */}
      {/* FIX: Changed right-4 to left-4 to move it to the opposite side */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[120] p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Language Switcher */}
      <div className="lg:hidden fixed top-4 right-4 z-[120]">
        <LanguageTranslator variant="desktop" />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Logo Area */}
          <div className="p-5 border-b border-slate-100 dark:border-neutral-900 flex items-center justify-between shrink-0">
            <Link 
              href="/foundation/volunteer/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 min-w-0"
            >
              <div className="relative h-12 w-12 shrink-0 flex items-center justify-center overflow-visible">
                <Image
                  src="/images/logo-dark.png"
                  alt="RAKVIH Foundation"
                  width={80}
                  height={80}
                  priority
                  className="h-full w-full object-contain scale-[1.75] origin-center"
                />
              </div>
              <div className="leading-tight truncate pl-1">
                <span className="block text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  RAKVIH Foundation
                </span>
                <span className="block text-[10px] font-bold text-[#798321] dark:text-[#FFC107] uppercase tracking-wider">
                  Volunteer Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Language Switcher in Sidebar */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-neutral-900 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/30 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Language</span>
            <LanguageTranslator variant="desktop" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black shadow-md" 
                      : "text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout Bottom */}
          <div className="p-4 border-t border-slate-100 dark:border-neutral-900 bg-slate-50 dark:bg-[#0a0a0a] shrink-0">
            <div className="mb-4 px-2 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/20 dark:text-[#FFC107] flex items-center justify-center font-bold text-lg">
                {volunteerName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{volunteerName}</p>
                <p className="text-[10px] uppercase font-bold text-[#798321] dark:text-[#FFC107]">Verified Account</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-xl transition dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-950/30"
            >
              <LogOut size={16} />
              Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full min-w-0 overflow-y-auto bg-slate-50 dark:bg-[#0a0a0a]">
        {/* FIX: Added pt-16 on mobile so the page headers aren't blocked by the new left-aligned menu button */}
        <div className="p-6 pt-16 lg:p-10 lg:pt-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}