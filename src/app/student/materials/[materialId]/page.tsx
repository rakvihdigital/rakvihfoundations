"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import MaterialViewer from "@/components/student/materials/MaterialViewer";

import {
  ArrowLeft,
  CalendarDays,
  BookOpen,
  FileText,
} from "lucide-react";

const supabase = createClient();

interface Material {
  id: number;
  title: string;
  description: string;
  file_url: string;
  file_size: string | null;
  created_at: string;
  syllabus_id: number;
  topic_id: number;
}

export default function MaterialDetailsPage() {
  const router = useRouter();
  const { materialId } = useParams<{ materialId: string }>();

  const [material, setMaterial] = useState<Material | null>(null);
  const [moduleName, setModuleName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (materialId) {
      loadMaterial();
    }
  }, [materialId]);

  async function loadMaterial() {
    try {
      // Get material
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", Number(materialId))
        .single();

      if (error || !data) return;

      setMaterial(data);

      // Get module
      const { data: module } = await supabase
        .from("course_syllabus")
        .select("module_name")
        .eq("id", data.syllabus_id)
        .single();

      if (module) {
        setModuleName(module.module_name);
      }

      // Get topic
      const { data: topic } = await supabase
        .from("course_topics")
        .select("topic")
        .eq("id", data.topic_id)
        .single();

      if (topic) {
        setTopicName(topic.topic);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (enrollment) {
          const { data: viewed } = await supabase
            .from("student_material_views")
            .select("id")
            .eq("material_id", data.id)
            .eq("student_id", enrollment.id)
            .maybeSingle();

          if (viewed) {
            setRead(true);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead() {
    if (!material) return;

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!enrollment) return;

      const { error } = await supabase
        .from("student_material_views")
        .upsert({
          material_id: material.id,
          student_id: enrollment.id,
        });

      if (error) {
        console.log(error);
        alert(error.message);
        return;
      }

      setRead(true);
      alert("Material marked as read successfully.");
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Loading material...
        </p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Material not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back */}
      <div className="-mt-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center p-1 text-[#24310F] dark:text-white hover:text-[#6B7328] dark:hover:text-[#FFC107] transition-all"
        >
          <ArrowLeft size={18} strokeWidth={2.8} />
        </button>
      </div>

      {/* PDF */}
      <MaterialViewer
        title={material.title}
        fileUrl={material.file_url}
      />

      {/* Info */}
      <div className="rounded-2xl border border-[#E8ECE5] dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm">

        <h1 className="text-2xl font-bold text-[#24310F] dark:text-white">
          {material.title}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          {/* Module */}
          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#6B7328] dark:text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Module
              </h3>
            </div>

            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {moduleName}
            </p>
          </div>

          {/* Topic */}
          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Topic
              </h3>
            </div>

            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {topicName}
            </p>
          </div>

          {/* Date */}
          <div className="rounded-xl border border-[#E8ECE5] dark:border-neutral-800 bg-[#F9FBF5] dark:bg-[#171717] p-5">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#6B7328] dark:text-[#FFC107]" />
              <h3 className="text-xs font-semibold text-[#24310F] dark:text-white">
                Uploaded
              </h3>
            </div>

            <p className="mt-3 text-xs text-gray-600 dark:text-neutral-300">
              {new Date(material.created_at).toLocaleDateString()}
            </p>
          </div>

        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-[#24310F] dark:text-white">
            Description
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-neutral-300">
            {material.description || "No description available."}
          </p>
        </div>
        
        <div className="mt-8 flex justify-end">
          {read ? (
            <span className="rounded-xl bg-green-100 px-5 py-2.5 text-sm font-medium text-green-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              ✓ Read
            </span>
          ) : (
            <button
              onClick={handleMarkAsRead}
              disabled={saving}
              className="rounded-xl bg-[#6B7328] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#55601F] disabled:opacity-60 dark:bg-[#FFC107] dark:text-black dark:hover:bg-[#ffca28]"
            >
              {saving ? "Saving..." : "✓ Mark as Read"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}