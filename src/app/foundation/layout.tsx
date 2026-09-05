"use client";

import { Fraunces } from "next/font/google";
import FoundationNavbar from "@/components/foundation/FoundationNavbar"; 
import FoundationFooter from "@/components/foundation/FoundationFooter";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export default function FoundationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex min-h-screen flex-col overflow-x-clip bg-[#F8FAF0] text-slate-900 dark:bg-black dark:text-neutral-100 ${display.variable}`}>
      
      {/* Navbar (Fixed at Top) */}
      <FoundationNavbar />
      
      {/* 
        🚀 FIX: Removed the "max-w-5xl px-6" so sections can stretch full-width.
        Added "pt-[76px]" so the content starts right below the fixed navbar.
      */}
      <main className="w-full flex-1 pt-[76px] overflow-x-clip">
        {children}
      </main>

      {/* Footer */}
      <FoundationFooter />
      
    </div>
  );
}