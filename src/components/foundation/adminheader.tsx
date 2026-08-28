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
  LogOut,
  ChevronDown
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/adminfoundations", icon: LayoutDashboard },
  { name: "Causes", href: "/adminfoundations/causes", icon: HeartHandshake },
  { name: "CSR", href: "/adminfoundations/csr", icon: Building2 },
  { name: "Gallery", href: "/adminfoundations/gallery", icon: ImageIcon },
  { 
    name: "Volunteers", 
    href: "/adminfoundations/volunteers", 
    icon: Users,
    dropdown: [
      { name: "👥 Manage Volunteers", href: "/adminfoundations/volunteers" },
      { name: "📋 Event Approvals", href: "/adminfoundations/volunteers/approvals" },
      { name: "📅 Manage Events", href: "/adminfoundations/volunteers/events" },
      { name: "⏱️ Log Hours", href: "/adminfoundations/volunteers/hours" },
      { name: "📢 Notice Board", href: "/adminfoundations/volunteers/announcements" },
    ]
  },
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
            const isActive = item.dropdown ? pathname.startsWith(item.href) : pathname === item.href;

            if (item.dropdown) {
              return (
                <div className="relative group" key={item.name}>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-70 transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-[#111] flex flex-col gap-0.5">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`px-3 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                            pathname === sub.href 
                              ? "bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]" 
                              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

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
      {/* FIX: Removed overflow-x-auto and added flex-wrap so the dropdown isn't clipped */}
      <div className="flex xl:hidden border-t border-slate-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black">
        <div className="flex flex-wrap justify-center gap-2 mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            // Replicate the Desktop Dropdown Logic perfectly for mobile
            if (item.dropdown) {
              const isActive = pathname.startsWith(item.href);
              return (
                <div className="relative group" key={item.name}>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black"
                        : "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-zinc-900 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-70 transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Mobile Dropdown Menu (Centered automatically to avoid clipping on tiny screens) */}
                  <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                    <div className="w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-[#111] flex flex-col gap-0.5">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`px-3 py-2.5 text-[11px] font-bold rounded-lg transition-colors whitespace-normal leading-tight text-left ${
                            pathname === sub.href 
                              ? "bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]" 
                              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

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