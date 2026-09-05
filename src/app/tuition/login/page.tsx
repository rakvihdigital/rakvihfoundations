"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, ArrowRight, ShieldCheck } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("Please enter your registered phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login failed.");
        return;
      }

      localStorage.setItem("student", JSON.stringify(json.student));
      router.push("/tuition/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8FAF5] via-white to-[#F0F4EC] px-6 py-12 dark:bg-none dark:bg-black transition-colors duration-500">
      {/* Decorative background glows */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#798321]/10 blur-3xl dark:bg-[#FFC107]/5" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#FFC107]/10 blur-3xl dark:bg-[#798321]/10" />

      <div className="relative w-full max-w-md rounded-3xl border border-[#798321]/20 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0a0a0a] md:p-10">
        {/* Logo Section */}
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
            Student / Parent Portal
          </h1>
          <p className="mt-2 text-xs font-medium text-gray-500 dark:text-neutral-400 sm:text-sm">
            Enter the phone number used during your tuition application to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">
              Registered Phone Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 dark:text-neutral-500">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pr-4 pl-12 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#798321] focus:bg-white focus:ring-4 focus:ring-[#798321]/10 dark:border-neutral-800 dark:bg-[#171717] dark:text-white dark:focus:bg-[#171717] dark:focus:border-[#FFC107] dark:focus:ring-[#FFC107]/10"
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-center text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#798321] to-[#636c19] px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-[#798321]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#798321]/40 hover:brightness-105 active:scale-[0.98] disabled:opacity-60 dark:from-[#798321] dark:to-[#FFC107] dark:text-black"
          >
            <span>{loading ? "Verifying details..." : "Continue to Dashboard"}</span>
            {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-neutral-800">
          <p className="text-xs text-gray-400 dark:text-neutral-500">
            Haven't applied for tuitions yet?{" "}
            <a
              href="/tuition"
              className="font-bold text-[#798321] transition-colors hover:underline dark:text-[#FFC107]"
            >
              Apply for tuition
            </a>
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-neutral-500">
            <ShieldCheck size={14} className="text-[#798321] dark:text-[#FFC107]" />
            <span>Secure Portal Access</span>
          </div>
        </div>
      </div>
    </main>
  );
}