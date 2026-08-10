"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("auth_id", data.user.id)
      .single();

    if (adminError || !admin) {
      alert("Admin not found.");
      return;
    }

    const { data: permission, error: permissionError } = await supabase
  .from("admin_permissions")
  .select("*")
  .eq("admin_id", admin.id)
  .single();

if (admin.role !== "super_admin" && (permissionError || !permission)) {
  alert("Permissions not found.");
  return;
}
   

localStorage.setItem(
  "admin",
  JSON.stringify({
    role: admin.role,
    permissions: permission ?? {},
  })
);

if (admin.role === "super_admin") {
  router.replace("/admin/dashboard");
} else if (permission.dashboard) {
  router.replace("/admin/dashboard");
} else if (permission.students) {
  router.replace("/admin/students");
} else if (permission.programs) {
  router.replace("/admin/programs");
} else if (permission.payments) {
  router.replace("/admin/payments");
} else if (permission.videos) {
  router.replace("/admin/videos");
} else if (permission.materials) {
  router.replace("/admin/materials");
} else if (permission.assignments) {
  router.replace("/admin/assignments");
} else if (permission.certificates) {
  router.replace("/admin/certificates");
} else if (permission.reports) {
  router.replace("/admin/reports");
} else if (permission.settings) {
  router.replace("/admin/settings");
} else {
  alert("No permissions assigned.");
  return;
}

router.refresh();

  }

  return (
    <main
      className="
min-h-screen
w-full
flex
items-center
justify-center
bg-white
dark:bg-[#08111F]
transition-colors
duration-300
px-4
py-8
"
    >
      {" "}
      <div
        className="
w-full
max-w-3xl
flex
rounded-2xl
overflow-hidden
border
border-[#A3B12D]/10
bg-white
dark:bg-[#0F172A]
dark:border-[#22324D]
shadow-[0_25px_60px_rgba(84,94,38,0.15)]
"
      >
        {/* Left Side: Changed to White Background with Green/Yellow elements */}
        <div
          className="
relative
hidden
md:flex
w-1/2
overflow-hidden
border-r
border-[#A3B12D]/10
bg-gradient-to-br
from-[#EDF7C7]
via-[#F8FCEB]
to-[#FFF6CF]
dark:via-[#132238]
dark:to-[#162A45]
px-10
py-8
flex-col
"
        >
          {/* Logo */}
          <div className="relative z-10 mt-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="RAKVIH Logo"
                width={50}
                height={50}
              />

              <div>
                <h1 className="text-lg font-black tracking-wide text-[#4E5C21] leading-none">
                  {" "}
                  RAKVIH
                </h1>

                <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[#A3B12D]">
                  {" "}
                  Solutions Private Limited
                </p>
              </div>
            </div>
          </div>

          {/* Middle Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {" "}
            <h2 className="text-xl font-black text-[#545E26] leading-tight">
              Internship Management System
            </h2>
            <p className="mt-4 text-[10px] leading-6 text-gray-600">
              Manage students, track internship progress, verify payments, and
              issue certificates from one secure dashboard.
            </p>
          </div>
          {/* Bottom */}
          <div className="relative z-10 pb-2">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-[#556128]">
              {" "}
              <ShieldCheck size={15} className="text-[#D7B11E]" />
              Secure Admin Authentication
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 px-10 py-8 flex flex-col ">
          <div className="mt-2 mb-10">
            {" "}
            <h2 className="text-xl font-black text-[#4E5C21]">Welcome Back</h2>
            <p className="text-[10px] text-[#C2A300] font-bold tracking-widest">
              PLEASE LOGIN TO CONTINUE
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-[9px] font-black text-[#545E26] mb-1">
                EMAIL ADDRESS
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-[#A3B12D] bg-[#FCFCF7] shadow-sm">
                <Mail size={14} className="text-[#A3B12D]" />
                <input
                  type="email"
                  className="w-full p-2 text-xs outline-none bg-transparent text-[#545E26]"
                  placeholder="admin@rakvih.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-[#545E26] mb-1">
                PASSWORD
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-[#D7B11E] focus-within:ring-2 focus-within:ring-[#F4C430]/20 bg-gray-50">
                <Lock size={14} className="text-[#C4A000]" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 text-xs outline-none bg-transparent text-[#545E26]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={14} className="text-[#A3B12D]" />
                  ) : (
                    <Eye size={14} className="text-[#A3B12D]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-[#8EA726] via-[#AFC52E] to-[#F4C430] py-2.5 text-[11px] font-black text-white shadow-lg shadow-[#A3B12D]/30 transition-all duration-300 hover:brightness-105"
            >
              {loading ? "Logging in..." : "LOGIN TO DASHBOARD"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[9px] font-black text-[#B89B12] hover:text-[#545E26] hover:underline"
            >
              ← BACK TO WEBSITE
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
