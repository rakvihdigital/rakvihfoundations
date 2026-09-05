"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BackToSitePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/foundation");
  }, [router]);

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-[#798321] dark:text-[#FFC107]" />
      <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
        Returning to Foundation Site...
      </p>
    </div>
  );
}
