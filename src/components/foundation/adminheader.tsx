"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  HeartHandshake, 
  Building2, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  BadgeDollarSign, 
  LogOut,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";

// Master list of all possible navigation items
const masterNavItems = [
  { id: "dashboard", name: "Dashboard", href: "/adminfoundations", icon: LayoutDashboard },
  { id: "donations", name: "Donations", href: "/adminfoundations/donations", icon: BadgeDollarSign },
  { id: "causes", name: "Causes & Pricing", href: "/adminfoundations/causes", icon: HeartHandshake },
  { id: "csr", name: "CSR Proposals", href: "/adminfoundations/csr", icon: Building2 },
  { id: "gallery", name: "Gallery", href: "/adminfoundations/gallery", icon: ImageIcon },
  { id: "contact", name: "Contact Inquiries", href: "/adminfoundations/contact", icon: MessageSquare },
  { 
    id: "volunteer_hub", 
    name: "Volunteer Hub", 
    icon: Users,
    dropdown: [
      { id: "volunteers", name: "Manage Volunteers", href: "/adminfoundations/volunteers" },
      { id: "approvals", name: "Event Approvals", href: "/adminfoundations/volunteers/approvals" },
      { id: "events", name: "Manage Events", href: "/adminfoundations/volunteers/events" },
      { id: "announcements", name: "Notice Board", href: "/adminfoundations/volunteers/announcements" },
    ]
  },
  { id: "staff", name: "Staff Management", href: "/adminfoundations/staff", icon: ShieldAlert, adminOnly: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Auth & Permissions State
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState("staff");
  const [userName, setUserName] = useState("");
  const [staffId, setStaffId] = useState(""); // Ensures Staff ID is tracked
  const [permissions, setPermissions] = useState<string[]>([]);
  
  // UI State
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(["volunteer_hub"]);

  useEffect(() => {
    // Read auth data from localStorage (set during login)
    const role = localStorage.getItem("rakvih_admin_role") || "staff";
    const name = localStorage.getItem("rakvih_admin_name") || "Staff Member";
    const sId = localStorage.getItem("rakvih_admin_staff_id") || ""; // Grabs the ID
    let perms: string[] = [];
    
    try {
      perms = JSON.parse(localStorage.getItem("rakvih_admin_permissions") || "[]");
    } catch (e) {
      perms = [];
    }

    setUserRole(role);
    setUserName(name);
    setStaffId(sId);
    setPermissions(perms);
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Safely clears everything
    router.push("/foundationslogin");
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Safely filter navigation items WITHOUT breaking the dropdowns
  const filteredNavItems = masterNavItems.reduce((acc: any[], item) => {
    // Master Admin sees everything
    if (permissions.includes("all")) {
      acc.push(item);
      return acc;
    }

    // Block admin-only pages from standard staff
    if (item.adminOnly && userRole !== "admin") return acc;

    if (item.dropdown) {
      const allowedSubs = item.dropdown.filter(sub => permissions.includes(sub.id));
      if (allowedSubs.length > 0) {
        acc.push({ ...item, dropdown: allowedSubs }); // Creates a safe copy
      }
    } else if (permissions.includes(item.id)) {
      acc.push(item);
    }
    
    return acc;
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          main { margin-left: 256px !important; width: calc(100% - 256px) !important; }
        }
      `}} />

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-white hover:bg-zinc-900 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="relative h-10 w-10 shrink-0 flex items-center justify-center overflow-visible">
            <Image
              src="/images/logo-dark.png"
              alt="RAKVIH Foundation"
              width={64}
              height={64}
              priority
              className="h-full w-full object-contain scale-[1.65] origin-center"
            />
          </div>
          <div className="pl-1">
            <span className="block text-xs font-bold text-white leading-tight">RAKVIH Foundation</span>
            <span className="block text-[9px] font-bold text-[#FFC107] uppercase">Admin Portal</span>
          </div>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR COMPONENT */}
      <div className={`fixed top-0 left-0 z-50 h-[100dvh] w-64 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Sidebar Header / Logo */}
        <div className="h-20 shrink-0 border-b border-zinc-800/80 px-6 flex items-center justify-between">
          <Link href="/adminfoundations" className="flex items-center gap-3 min-w-0" onClick={() => setIsMobileOpen(false)}>
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
              <span className="block text-sm font-extrabold text-white tracking-tight">
                RAKVIH Foundation
              </span>
              <span className="block text-[10px] font-bold text-[#FFC107] uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-zinc-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar space-y-1">
          <p className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Menu</p>
          
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isDropdownOpen = openDropdowns.includes(item.id);
            const isDropdownActive = item.dropdown && item.dropdown.some((sub: any) => pathname === sub.href);
            const isActive = !item.dropdown && pathname === item.href;

            if (item.dropdown) {
              return (
                <div key={item.id} className="mb-1">
                  <button onClick={() => toggleDropdown(item.id)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isDropdownActive ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isDropdownActive ? "text-[#FFC107]" : "opacity-70"} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-1 space-y-0.5 ml-4 pl-3 border-l border-zinc-800">
                        {item.dropdown.map((sub: any) => (
                          <Link key={sub.id} href={sub.href} onClick={() => setIsMobileOpen(false)} className={`block w-full px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${pathname === sub.href ? "bg-[#FFC107]/10 text-[#FFC107]" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"}`}>
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link key={item.id} href={item.href} onClick={() => setIsMobileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? "bg-[#FFC107] text-black shadow-md" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"}`}>
                <Icon size={16} className={isActive ? "text-black" : "opacity-70"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer / User Profile */}
        {(() => {
          const isMasterOrAdmin = userRole === "admin" || userName.toLowerCase().includes("master") || (userRole === "admin" && (!userName || userName === "Staff Member"));
          const displayName = isMasterOrAdmin ? "Admin" : userName;
          const avatarChar = (displayName.charAt(0) || "A").toUpperCase();

          return (
            <div className="shrink-0 border-t border-zinc-800/80 p-4">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFC107]/10 text-[#FFC107] font-bold text-sm">
                  {avatarChar}
                </div>
                <div className="flex-1 overflow-hidden">
                  {userRole === "admin" ? (
                    // Only one single "Admin" entry shown for admin
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#FFC107]" />
                      Admin
                    </p>
                  ) : (
                    // For staff: show name and role with staff ID
                    <>
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#FFC107] flex items-center gap-1">
                          <ShieldAlert size={10} />
                          {userRole}
                        </p>
                        {staffId && (
                          <span className="text-[8px] font-mono font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                            {staffId}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/20">
                <LogOut size={14} /> Logout
              </button>
            </div>
          );
        })()}

      </div>
    </>
  );
}