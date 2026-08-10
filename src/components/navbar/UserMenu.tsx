"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth";

import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  CreditCard,
  BookOpen,
} from "lucide-react";

export default function UserMenu() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUser();

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function loadUser() {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    // Check if this auth user is a student
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", currentUser.id)
      .single();

    // Not a student (Admin or other user)
    if (!enrollment) {
      setUser(null);
      setProfile(null);
      return;
    }

    // Student
    setUser(currentUser);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    setProfile(profile);
  }

  async function handleLogout() {
    const { error } = await signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logout Successful");

    window.location.href = "/";
  }

  if (!user) {
    return (
      <Link
        href="/enrollment"
        className="
          inline-flex
          items-center
          justify-center
          rounded-full
          bg-[#798321]
          px-7
          py-3
          text-sm
          font-bold
          text-[#FFC107]
          shadow-md
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-[#5F6E1D]
          hover:text-white
          hover:shadow-xl

          dark:bg-[#FFC107]
          dark:text-black
          dark:hover:bg-[#798321]
          dark:hover:text-white
        "
      >
        Enrollment
      </Link>
    );
  }

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-3 rounded-full border border-[#798321]/15 
          bg-[#F8FAF1] dark:bg-[#111111] dark:border-neutral-800
          px-3 py-1.5 transition-all duration-300 
          hover:border-[#798321] dark:hover:border-[#FFC107]
          hover:bg-[#EEF4DC] dark:hover:bg-neutral-900 hover:shadow-sm
        "
      >
        {/* Rounded Letter Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#798321] text-sm font-black text-[#FFC107] shadow-sm">
          {(profile?.full_name || user.email)
            ?.charAt(0)
            ?.toUpperCase()}
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
            Welcome
          </p>
          <p className="max-w-[120px] truncate text-sm font-black text-[#5F6E1D] dark:text-neutral-100">
            {profile?.full_name || user.email}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-[#798321] dark:text-[#FFC107] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu Overlay */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-[#798321]/15 dark:border-neutral-800 bg-white dark:bg-black shadow-[0_10px_30px_rgba(95,110,29,0.08)] dark:shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          
          {/* Dropdown Header */}
          <div className="border-b border-[#798321]/10 dark:border-neutral-800 bg-[#F8FAF1] dark:bg-[#111111] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#798321] text-lg font-black text-[#FFC107] shadow-sm">
                {(profile?.full_name || user.email)
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <h3 className="truncate font-black text-[#5F6E1D] dark:text-neutral-100">
                  {profile?.full_name || "Student"}
                </h3>
                <p className="truncate text-xs font-medium text-[#6B7280] dark:text-neutral-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Links List */}
          <div className="p-2 space-y-0.5">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#374151] dark:text-neutral-300 transition-colors hover:bg-[#798321]/05 dark:hover:bg-[#111111] hover:text-[#798321] dark:hover:text-[#FFC107]"
            >
              <User size={18} className="text-[#798321]/70 dark:text-[#FFC107]/70" />
              My Profile
            </Link>

            <Link
              href="/my-enrollments"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#374151] dark:text-neutral-300 transition-colors hover:bg-[#798321]/05 dark:hover:bg-[#111111] hover:text-[#798321] dark:hover:text-[#FFC107]"
            >
              <BookOpen size={18} className="text-[#798321]/70 dark:text-[#FFC107]/70" />
              My Enrollments
            </Link>

            <Link
              href="/payments"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#374151] dark:text-neutral-300 transition-colors hover:bg-[#798321]/05 dark:hover:bg-[#111111] hover:text-[#798321] dark:hover:text-[#FFC107]"
            >
              <CreditCard size={18} className="text-[#798321]/70 dark:text-[#FFC107]/70" />
              Payments
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#374151] dark:text-neutral-300 transition-colors hover:bg-[#798321]/05 dark:hover:bg-[#111111] hover:text-[#798321] dark:hover:text-[#FFC107]"
            >
              <LayoutDashboard size={18} className="text-[#798321]/70 dark:text-[#FFC107]/70" />
              Dashboard
            </Link>
          </div>

          {/* Logout Action */}
          <div className="p-2 border-t border-[#798321]/10 dark:border-neutral-800 bg-gray-50/50 dark:bg-black">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 dark:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}