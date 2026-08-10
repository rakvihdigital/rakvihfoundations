"use client";

import { useEffect, useState } from "react";
import AddVideoModal from "@/components/admin/videos/AddVideoModal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const supabase = createClient();

interface Program {
  id: number;
  title: string;
  category: string;
  image: string;
  price: number;
  duration: string;
  status: string;
}

export default function VideosPage() {
  const router = useRouter();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    const { data } = await supabase
      .from("programs")
      .select("id,title,category,image,price,duration,status")
      .eq("status", "Active")
      .order("id");
    if (data) {
      setPrograms(data);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#24310F] dark:text-white tracking-tight">
            Course Videos
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select a course to manage modules and videos.
          </p>
        </div>

        {/* Small Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4D6B2F] via-[#6B7328] to-[#FFC107] px-4 py-2 text-xs font-semibold text-white hover:brightness-110"
        >
          <Plus size={16} />
          Add New Video
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div
            key={program.id}
            onClick={() => router.push(`/admin/videos/modules/${program.id}`)}
            className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-[#111827]"
          >
            <div className="h-44 bg-gray-100 dark:bg-gray-800">
              <img
                src={program.image}
                alt={program.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="px-3 py-2.5">
              <h2 className="text-xs font-semibold text-[#24310F] dark:text-white leading-tight">
                {program.title}
              </h2>

              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                Click to manage modules & videos
              </p>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-xs text-gray-500">
          No programs found.
        </div>
      )}

      {showAddModal && (
        <AddVideoModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}