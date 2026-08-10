"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import AdminHeader from "@/components/foundation/adminheader";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Tag,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  getGalleryImages,
  uploadGalleryImageAction,
  addGalleryItem,
  deleteGalleryItem,
} from "./actions";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Events");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getGalleryImages();
      setGallery(data || []);
    } catch (err: any) {
      console.error("Error fetching gallery:", err.message || err);
      setFetchError(err.message || "Failed to load data from server action.");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const url = await uploadGalleryImageAction(formData);
        setImageUrl(url);
      } catch (err) {
        console.error("Failed to upload image", err);
        alert("Image upload failed.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) {
      alert("Please enter a title and select/upload an image.");
      return;
    }

    const itemTitle = title.trim();
    const itemCat = category.trim();
    const itemImg = imageUrl;

    setTitle("");
    setImageUrl("");

    startTransition(async () => {
      try {
        await addGalleryItem(itemTitle, itemCat, itemImg);
        await loadGallery();
      } catch (err: any) {
        console.error("Add error:", err);
        alert("Failed to save photo: " + err.message);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo from the gallery?")) return;

    startTransition(async () => {
      try {
        await deleteGalleryItem(id);
        setGallery(gallery.filter((item) => item.id !== id));
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Failed to delete photo: " + err.message);
      }
    });
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#0B1220] ${display.variable}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title & Overview Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              Gallery Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload event highlights, campaign photos, and community media to your Supabase bucket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Total Photos</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">
                {gallery.length}
              </span>
            </div>
            {isPending && (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#798321]/10 px-4 py-3 text-xs font-bold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#798321] dark:border-[#FFC107] border-t-transparent" />
                Syncing...
              </div>
            )}
          </div>
        </div>

        {/* Database Error Banner */}
        {fetchError && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 flex flex-col gap-1">
            <span className="font-bold">Database Connection / Policy Error:</span>
            <span>{fetchError}</span>
          </div>
        )}

        {/* Upload Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mb-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-[#798321] dark:text-[#FFC107]" /> Add New Photo
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Photo Title / Caption
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Food Distribution Drive"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="Events">Events</option>
                <option value="Campaigns">Campaigns</option>
                <option value="Community">Community</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Image File
              </label>
              <label className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-800/70">
                <ImageIcon size={14} className="text-[#798321] dark:text-[#FFC107]" />
                <span className="truncate">
                  {uploadingImage ? "Uploading..." : imageUrl ? "Change Image" : "Choose File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending || uploadingImage || !imageUrl}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#798321] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-[#FFC107] dark:text-black"
              >
                <Plus size={14} /> Save to Gallery
              </button>
            </div>
          </form>

          {imageUrl && (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-slate-400">Selected Preview:</span>
              <img
                src={imageUrl}
                alt="Upload Preview"
                className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-zinc-800"
              />
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 p-4 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <ImageIcon size={16} className="text-[#798321] dark:text-[#FFC107]" /> Published Gallery Photos ({gallery.length})
          </h2>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
            </div>
          ) : gallery.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ImageIcon size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                No gallery images uploaded yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50 space-y-3 overflow-hidden"
                >
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        title="Delete Photo"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-red-600 transition disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                        <Tag size={10} /> {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}