"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    if (!admin.role) {
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#081525] transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#081525]">
        <Topbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#081525] px-3 py-3 lg:px-4 lg:py-4 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}