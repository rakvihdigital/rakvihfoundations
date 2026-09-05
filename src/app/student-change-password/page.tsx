"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setErrorMsg("User not found. Your session may have expired.");
      return;
    }

    try {
      const response = await fetch("/api/admin/students/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          password: newPassword,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setErrorMsg(result.message || "Failed to update password.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Password updated successfully! Redirecting...");
      
      // Short delay so the user can read the success message
      setTimeout(() => {
        router.push("/student/dashboard");
        router.refresh();
      }, 1500);

    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8FAF5] via-white to-[#F0F4EC] px-6 py-12 dark:bg-none dark:bg-black transition-colors duration-500">
      {/* Decorative background glows */}
      <div aria-hidden="true" className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#798321]/10 blur-3xl dark:bg-[#FFC107]/5" />
      <div aria-hidden="true" className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#FFC107]/10 blur-3xl dark:bg-[#798321]/10" />

      <div className="relative w-full max-w-md rounded-3xl border border-[#798321]/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] md:p-10">
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#798321]/20 bg-gradient-to-tr from-[#798321]/10 to-[#FFC107]/10 p-3 shadow-inner dark:border-neutral-800 dark:bg-neutral-900">
            <Image
              src="/logo.png"
              alt="Rakvih Logo"
              width={64}
              height={64}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#24310F] dark:text-white sm:text-3xl">
            Secure Your Account
          </h1>
          <p className="mt-2 text-xs font-medium text-gray-500 dark:text-neutral-400 sm:text-sm">
            Please change your temporary password to continue.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* New Password Input */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">
              New Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 dark:text-neutral-500">
                <Lock size={18} />
              </span>
              <input
                type={showNewPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pr-12 pl-12 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/10 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:bg-[#171717] dark:focus:border-[#FFC107] dark:focus:ring-[#FFC107]/10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-neutral-200"
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 dark:text-neutral-500">
                <KeyRound size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pr-12 pl-12 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/10 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:bg-[#171717] dark:focus:border-[#FFC107] dark:focus:ring-[#FFC107]/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-neutral-200"
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#798321] to-[#636c19] px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-[#798321]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#798321]/40 hover:brightness-105 active:scale-[0.98] disabled:opacity-60 dark:from-[#798321] dark:to-[#FFC107] dark:text-black"
          >
            <span>{loading ? "Updating..." : "Update Password"}</span>
            {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-neutral-800">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-neutral-500">
            <ShieldCheck size={14} className="text-[#798321] dark:text-[#FFC107]" />
            <span>Secure Password Update</span>
          </div>
        </div>
      </div>
    </main>
  );
}