"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import AdminHeader from "@/components/foundation/adminheader";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, Trash2, FolderPlus, Layers, Edit3, X } from "lucide-react";
import {
  getCausesData,
  addCategory,
  updateCategory,
  addSubCause,
  updateSubCauseCost,
  updateSubCauseImage,
  updateSubCauseDetails,
  deleteSubCause,
  deleteCategory,
  uploadImageAction,
} from "./actions";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

interface SubCause {
  id: string | number;
  name: string;
  cost: number;
  image: string;
}

interface CauseCategory {
  id: string | number;
  name: string;
  cause_items?: SubCause[];
  subCauses?: SubCause[];
}

export default function AdminCausesPage() {
  const [categories, setCategories] = useState<CauseCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | number>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubCost, setNewSubCost] = useState("");
  const [newSubImage, setNewSubImage] = useState("/banner1.png");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Edit Sub-Cause Modal States
  const [editingSub, setEditingSub] = useState<SubCause | null>(null);
  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editImage, setEditImage] = useState("");

  // Edit Category Modal States
  const [editingCategory, setEditingCategory] = useState<CauseCategory | null>(null);
  const [editCategoryNameInput, setEditCategoryNameInput] = useState("");

  const fetchAndSyncData = async (): Promise<CauseCategory[]> => {
    try {
      setFetchError(null);
      const data = await getCausesData();
      const formatted: CauseCategory[] = (data || []).map((cat: any) => ({
        ...cat,
        name: cat.name || cat.title,
        subCauses: cat.cause_items || [],
      }));
      setCategories(formatted);
      return formatted;
    } catch (err: any) {
      console.error("Error fetching causes:", err.message || err);
      setFetchError(err.message || "Failed to load data from server action.");
      return [];
    }
  };

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      const formatted = await fetchAndSyncData();
      if (formatted.length > 0) {
        setActiveCategoryId(formatted[0].id);
      }
      setLoading(false);
    }
    loadInitial();
  }, []);

  const activeCategoryData = categories.find((c) => String(c.id) === String(activeCategoryId));
  const totalSubCauses = categories.reduce((sum, cat) => sum + (cat.subCauses?.length || 0), 0);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const publicUrl = await uploadImageAction(formData);
      return publicUrl;
    } catch (err) {
      console.error("Image upload exception:", err);
      return URL.createObjectURL(file);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const categoryNameToAdd = newCategoryName.trim();
    setNewCategoryName("");

    startTransition(async () => {
      try {
        await addCategory(categoryNameToAdd);
        const formatted = await fetchAndSyncData();
        if (formatted.length > 0) {
          setActiveCategoryId(formatted[formatted.length - 1].id);
        }
      } catch (err: any) {
        console.error("Add category error:", err);
        alert("Failed to add header: " + err.message);
      }
    });
  };

  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryNameInput.trim()) return;

    const catId = editingCategory.id;
    const updatedName = editCategoryNameInput.trim();

    startTransition(async () => {
      try {
        await updateCategory(catId, updatedName);
        await fetchAndSyncData();
        setEditingCategory(null);
      } catch (err: any) {
        console.error("Edit category error:", err);
        alert("Failed to update header: " + err.message);
      }
    });
  };

  const handleDeleteCategorySubmit = async (catId: string | number) => {
    if (categories.length <= 1) {
      alert("You must keep at least one category.");
      return;
    }
    if (!confirm("Are you sure you want to delete this header and all its sub-items?")) return;

    startTransition(async () => {
      try {
        await deleteCategory(catId);
        const formatted = await fetchAndSyncData();
        if (formatted.length > 0) {
          setActiveCategoryId(formatted[0].id);
        }
      } catch (err: any) {
        console.error("Delete category error:", err);
        alert("Failed to delete header: " + err.message);
      }
    });
  };

  const handleCostChange = async (subId: string | number, newCost: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (String(cat.id) === String(activeCategoryId)) {
          return {
            ...cat,
            subCauses: (cat.subCauses || []).map((sub) =>
              String(sub.id) === String(subId) ? { ...sub, cost: newCost } : sub
            ),
          };
        }
        return cat;
      })
    );

    try {
      await updateSubCauseCost(subId, newCost);
    } catch (err: any) {
      console.error("Cost update error:", err);
    }
  };

  const handleImageUpload = async (subId: string | number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = await uploadImageToSupabase(file);

      setCategories((prev) =>
        prev.map((cat) => {
          if (String(cat.id) === String(activeCategoryId)) {
            return {
              ...cat,
              subCauses: (cat.subCauses || []).map((sub) =>
                String(sub.id) === String(subId) ? { ...sub, image: imageUrl } : sub
              ),
            };
          }
          return cat;
        })
      );

      await updateSubCauseImage(subId, imageUrl);
    }
  };

  const handleAddSubCauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !activeCategoryId) return;

    const costValue = Number(newSubCost) || 50;
    const subName = newSubName.trim();
    const subImage = newSubImage;

    setNewSubName("");
    setNewSubCost("");
    setNewSubImage("/banner1.png");

    startTransition(async () => {
      try {
        await addSubCause(activeCategoryId, subName, costValue, subImage);
        await fetchAndSyncData();
      } catch (err: any) {
        console.error("Add sub-cause error:", err);
        alert("Failed to add sub-item: " + err.message);
      }
    });
  };

  const handleDeleteSubCauseSubmit = async (subId: string | number) => {
    if (!confirm("Are you sure you want to delete this sub-item?")) return;

    startTransition(async () => {
      try {
        await deleteSubCause(subId);
        await fetchAndSyncData();
      } catch (err: any) {
        console.error("Delete sub-cause error:", err);
        alert("Failed to delete sub-item: " + err.message);
      }
    });
  };

  const openEditModal = (sub: SubCause) => {
    setEditingSub(sub);
    setEditName(sub.name);
    setEditCost(String(sub.cost));
    setEditImage(sub.image);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    const updatedName = editName.trim();
    const updatedCost = Number(editCost) || 0;
    const updatedImage = editImage;

    startTransition(async () => {
      try {
        await updateSubCauseDetails(editingSub.id, updatedName, updatedCost, updatedImage);
        await fetchAndSyncData();
        setEditingSub(null);
      } catch (err: any) {
        console.error("Edit sub-cause error:", err);
        alert("Failed to update sub-item: " + err.message);
      }
    });
  };

  return (
    <div
      className={`min-h-screen bg-black ${display.variable}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title & Overview Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Causes &amp; Pricing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Changes sync directly with your Supabase database and storage bucket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Headers</span>
              <span className="text-lg font-extrabold text-[#798321] dark:text-[#FFC107]">
                {categories.length}
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Sub-Items</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {totalSubCauses}
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

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 py-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Header / Category Section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FolderPlus size={16} className="text-[#798321] dark:text-[#FFC107]" /> Add New Header (Category)
              </h2>
              <form onSubmit={handleAddCategorySubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Healthcare, Education, Orphanage"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#798321] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-[#FFC107] dark:text-black"
                >
                  <Plus size={14} /> Save to Supabase
                </button>
              </form>
            </div>

            {/* Categories Tab Selector with Edit & Delete */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1 shrink-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-1 shadow-sm"
                >
                  <button
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      String(activeCategoryId) === String(cat.id)
                        ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Layers size={14} />
                    {cat.name}
                  </button>

                  {/* Edit Header Button */}
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setEditCategoryNameInput(cat.name);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-[#798321] hover:bg-[#798321]/10 dark:hover:text-[#FFC107] transition"
                    title="Edit Header Name"
                  >
                    <Edit3 size={14} />
                  </button>

                  {/* Delete Header Button */}
                  {categories.length > 1 && (
                    <button
                      onClick={() => handleDeleteCategorySubmit(cat.id)}
                      disabled={isPending}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                      title="Delete Header"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sub-Causes Listing Section */}
            {activeCategoryData && (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Header: {activeCategoryData.name}
                      </h2>
                      <p className="text-xs text-slate-400">Manage sub-items, update costs, and save image proofs.</p>
                    </div>
                  </div>

                  {!activeCategoryData.subCauses || activeCategoryData.subCauses.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <Layers size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
                      <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                        No sub-items added under this header yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                      {activeCategoryData.subCauses.map((sub) => (
                        <motion.div
                          key={sub.id}
                          whileHover={{ y: -2 }}
                          className="relative flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50"
                        >
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(sub)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-[#798321] hover:bg-[#798321]/10 dark:hover:text-[#FFC107] transition"
                              title="Edit Sub-Item"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubCauseSubmit(sub.id)}
                              disabled={isPending}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                              title="Delete Sub-Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div className="relative group h-24 w-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-200">
                            <img src={sub.image || "/banner1.png"} alt={sub.name} className="h-full w-full object-cover" />
                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <ImageIcon size={18} className="mb-1" />
                              <span className="text-[10px] font-bold">Change</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(sub.id, e)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="flex-1 w-full space-y-2 text-center sm:text-left pr-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                              {sub.name}
                            </h3>

                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span className="text-[11px] font-bold text-slate-500">Cost (₹):</span>
                              <div className="relative w-32">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 text-xs">
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  value={sub.cost}
                                  onChange={(e) => handleCostChange(sub.id, Number(e.target.value))}
                                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-7 pr-3 text-xs font-bold text-slate-900 focus:border-[#798321] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Sub-Item Form */}
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-[#798321] dark:text-[#FFC107]" /> Add Sub-Item to &quot;{activeCategoryData.name}&quot;
                  </h3>
                  <form onSubmit={handleAddSubCauseSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Sub-Item Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        placeholder="e.g. Paneer Biryani"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Cost per Person (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={newSubCost}
                        onChange={(e) => setNewSubCost(e.target.value)}
                        placeholder="e.g. 90"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Photo Proof Upload
                      </label>
                      <label className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-800/70">
                        <ImageIcon size={14} className="text-[#798321] dark:text-[#FFC107]" />
                        <span className="truncate">Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const url = await uploadImageToSupabase(e.target.files[0]);
                              setNewSubImage(url);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#798321] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-[#FFC107] dark:text-black"
                      >
                        <Plus size={14} /> Save to Supabase
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Header / Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 size={16} className="text-[#798321] dark:text-[#FFC107]" /> Edit Header Name
                </h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Header Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editCategoryNameInput}
                    onChange={(e) => setEditCategoryNameInput(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#798321] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-[#FFC107] dark:text-black"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Sub-Cause Modal */}
      <AnimatePresence>
        {editingSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 size={16} className="text-[#798321] dark:text-[#FFC107]" /> Edit Sub-Item
                </h3>
                <button
                  onClick={() => setEditingSub(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Sub-Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cost per Person (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-medium text-slate-800 focus:border-[#798321] focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Change Image URL / Upload New
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editImage || "/banner1.png"}
                      alt="Preview"
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-zinc-800"
                    />
                    <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-800/70">
                      <ImageIcon size={14} className="text-[#798321] dark:text-[#FFC107]" />
                      <span className="truncate">Upload New File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = await uploadImageToSupabase(e.target.files[0]);
                            setEditImage(url);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSub(null)}
                    className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#798321] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 dark:bg-[#FFC107] dark:text-black"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}