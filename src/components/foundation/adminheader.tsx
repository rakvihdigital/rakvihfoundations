"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  HeartHandshake, 
  Building2, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  BadgeDollarSign, 
  LogOut 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/adminfoundations", icon: LayoutDashboard },
  { name: "Causes", href: "/adminfoundations/causes", icon: HeartHandshake },
  { name: "CSR", href: "/adminfoundations/csr", icon: Building2 },
  { name: "Gallery", href: "/adminfoundations/gallery", icon: ImageIcon },
  { name: "Volunteers", href: "/adminfoundations/volunteers", icon: Users },
  { name: "Donations", href: "/adminfoundations/donations", icon: BadgeDollarSign },
  { name: "Contact", href: "/adminfoundations/contact", icon: MessageSquare },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/foundationslogin");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <Link href="/adminfoundations" className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#798321]/10 p-1.5 dark:bg-[#FFC107]/10">
            <img
              src="/logosqunobg.png"
              alt="RAKVIH Foundation Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <span className="block text-xs font-extrabold uppercase tracking-wider text-[#24310F] dark:text-white">
              RAKVIH Foundation
            </span>
            <span className="block text-[10px] font-semibold text-[#798321] dark:text-[#FFC107]">
              Admin Control Center
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>

      {/* Secondary Desktop Row for Medium Screens / Mobile Horizontal Bar */}
      <div className="flex xl:hidden overflow-x-auto border-t border-slate-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-black">
        <div className="flex gap-2 mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black"
                    : "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-zinc-900 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}