"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Check the new foundation_staff table in Supabase
      const { data: staffData, error: staffError } = await supabase
        .from("foundation_staff")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (staffData && !staffError) {
        
        // Block deactivated users from logging in
        if (staffData.is_active === false) {
          setError("Your account has been temporarily suspended. Please contact the Master Admin.");
          setIsLoading(false);
          return;
        }

        // Success! Store the user's role, permissions, and ID in the browser
        localStorage.setItem("rakvih_admin_id", staffData.id);
        localStorage.setItem("rakvih_admin_name", staffData.name);
        localStorage.setItem("rakvih_admin_role", staffData.role);
        localStorage.setItem("rakvih_admin_staff_id", staffData.staff_id || ""); // Saves the official ID
        localStorage.setItem("rakvih_admin_permissions", JSON.stringify(staffData.permissions));
        
        router.push("/adminfoundations");
        return;
      }

      // 2. FALLBACK: Master Admin Hardcoded Backup
      // (Keeps you from getting locked out if the database is empty)
      if (email === "admin@rakvih.org" && password === "rakvih@2026") {
        localStorage.setItem("rakvih_admin_name", "Master Admin");
        localStorage.setItem("rakvih_admin_role", "admin");
        localStorage.setItem("rakvih_admin_staff_id", "MASTER-ADMIN"); // Master Admin ID tag
        localStorage.setItem("rakvih_admin_permissions", JSON.stringify(["all"])); // "all" grants master access
        
        router.push("/adminfoundations");
        return;
      }

      // 3. If neither matched, show error
      setError("Invalid email or password. Please try again or contact Master Admin.");
      
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#F8FAF0] px-4 py-12 text-slate-900 dark:bg-black dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-900/10 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-zinc-950 sm:p-10"
      >
        {/* Header & Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#798321]/10 p-3 shadow-inner dark:bg-[#FFC107]/10">
            <img
              src="/logosqunobg.png"
              alt="RAKVIH Foundation Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#798321]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin Portal
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-[#24310F] dark:text-white sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage RAKVIH Foundation dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs font-medium text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address / Login ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rakvih.org"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#798321] focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 dark:focus:border-[#FFC107]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#798321] focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 dark:focus:border-[#FFC107]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#798321] py-3.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-70 dark:bg-[#FFC107] dark:text-black"
          >
            {isLoading ? (
              "Authenticating..."
            ) : (
              <>
                <ArrowRight className="h-3.5 w-3.5" /> Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Footer Hint */}
        <div className="mt-8 text-center border-t border-slate-100 pt-4 dark:border-zinc-900">
          <p className="text-[11px] text-slate-400">
            Protected Admin Area • RAKVIH Foundation
          </p>
        </div>
      </motion.div>
    </div>
  );
}