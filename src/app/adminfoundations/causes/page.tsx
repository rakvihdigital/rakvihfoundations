"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import AdminHeader from "@/components/foundation/adminheader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  FolderPlus,
  Layers,
  Edit3,
  X,
  Sliders,
  Gift,
  Check,
  Save,
} from "lucide-react";
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
  getSystemConfig,
  saveSystemConfig,
  addCategoryAddon,
  deleteCategoryAddon,
  addSubItemAddon,
  deleteSubItemAddon,
  type SystemConfig,
  type CategoryAddon,
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
  addons?: CategoryAddon[];
}

interface CauseCategory {
  id: string | number;
  name: string;
  addons?: CategoryAddon[];
  cause_items?: SubCause[];
  subCauses?: SubCause[];
}

const CLIENT_DEFAULT_CONFIG: SystemConfig = {
  minPersons: 1,
  maxPersons: 100,
  photoCost: 7,
  videoCost: 150, // Updated: Flat one-time celebration recording charge
  textCost: 5,
  extras: [
    { id: "item_candle", title: "Scented Candles", cost: 15 },
    { id: "item_gift", title: "Small Gift Box", cost: 50 },
    { id: "item_flower", title: "Fresh Flowers", cost: 20 },
  ],
};

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

  const [config, setConfig] = useState<SystemConfig>(CLIENT_DEFAULT_CONFIG);
  const [newExtraTitle, setNewExtraTitle] = useState("");
  const [newExtraCost, setNewExtraCost] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Category Add-ons (Up to 20 items per category)
  const [newAddonTitle, setNewAddonTitle] = useState("");
  const [newAddonCost, setNewAddonCost] = useState("");

  // Edit Sub-Cause Modal States
  const [editingSub, setEditingSub] = useState<SubCause | null>(null);
  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editImage, setEditImage] = useState("");
  const [newSubAddonTitle, setNewSubAddonTitle] = useState("");
  const [newSubAddonCost, setNewSubAddonCost] = useState("");

  // Edit Category Modal States
  const [editingCategory, setEditingCategory] = useState<CauseCategory | null>(null);
  const [editCategoryNameInput, setEditCategoryNameInput] = useState("");

  const fetchAndSyncData = async (): Promise<CauseCategory[]> => {
    try {
      setFetchError(null);
      const [causesData, configData] = await Promise.all([
        getCausesData(),
        getSystemConfig(),
      ]);

      const formatted: CauseCategory[] = (causesData || []).map((cat: any) => ({
        ...cat,
        name: cat.name || cat.title,
        addons: cat.addons || [],
        subCauses: cat.cause_items || [],
      }));

      setCategories(formatted);
      if (configData && configData.extras) {
        setConfig(configData);
      }
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
      return await uploadImageAction(formData);
    } catch (err) {
      console.error("Image upload exception:", err);
      return URL.createObjectURL(file);
    }
  };

  const handleSaveConfig = () => {
    startTransition(async () => {
      try {
        await saveSystemConfig(config);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } catch (err: any) {
        alert("Failed to save configuration: " + err.message);
      }
    });
  };

  const handleAddExtraItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraTitle.trim()) return;

    const newExtra = {
      id: `item_${Date.now()}`,
      title: newExtraTitle.trim(),
      cost: Number(newExtraCost) || 10,
    };

    setConfig((prev) => ({
      ...prev,
      extras: [...(prev.extras || []), newExtra],
    }));

    setNewExtraTitle("");
    setNewExtraCost("");
  };

  const handleDeleteExtraItem = (extraId: string) => {
    setConfig((prev) => ({
      ...prev,
      extras: (prev.extras || []).filter((ex) => ex.id !== extraId),
    }));
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
        alert("Failed to add category: " + err.message);
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
        alert("Failed to update category: " + err.message);
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
        alert("Failed to delete category: " + err.message);
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
        alert("Failed to delete sub-item: " + err.message);
      }
    });
  };

  const openEditModal = (sub: SubCause) => {
    setEditingSub(sub);
    setEditName(sub.name);
    setEditCost(String(sub.cost));
    setEditImage(sub.image);
    setNewSubAddonTitle("");
    setNewSubAddonCost("");
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
        alert("Failed to update sub-item: " + err.message);
      }
    });
  };

  const handleAddSubAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub || !newSubAddonTitle.trim() || !activeCategoryId) return;

    const currentCount = editingSub.addons?.length || 0;
    if (currentCount >= 20) {
      alert("Maximum limit of 20 add-ons for this sub-item reached.");
      return;
    }

    const title = newSubAddonTitle.trim();
    const cost = Number(newSubAddonCost) || 0;
    const subId = editingSub.id;
    setNewSubAddonTitle("");
    setNewSubAddonCost("");

    startTransition(async () => {
      try {
        await addSubItemAddon(subId, activeCategoryId, title, cost);
        const formatted = await fetchAndSyncData();
        const activeCat = formatted.find((c) => String(c.id) === String(activeCategoryId));
        const refreshedSub = activeCat?.subCauses?.find((s) => String(s.id) === String(subId));
        if (refreshedSub) {
          setEditingSub(refreshedSub);
        }
      } catch (err: any) {
        alert("Failed to add add-on to sub-item: " + err.message);
      }
    });
  };

  const handleDeleteSubAddonSubmit = async (subId: string | number, addonId: string) => {
    startTransition(async () => {
      try {
        await deleteSubItemAddon(subId, activeCategoryId, addonId);
        const formatted = await fetchAndSyncData();
        const activeCat = formatted.find((c) => String(c.id) === String(activeCategoryId));
        const refreshedSub = activeCat?.subCauses?.find((s) => String(s.id) === String(subId));
        if (refreshedSub && editingSub && String(editingSub.id) === String(subId)) {
          setEditingSub(refreshedSub);
        }
      } catch (err: any) {
        alert("Failed to delete add-on: " + err.message);
      }
    });
  };

  const handleAddCategoryAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddonTitle.trim() || !activeCategoryId) return;

    const currentCount = activeCategoryData?.addons?.length || 0;
    if (currentCount >= 20) {
      alert("Maximum limit of 20 add-ons per category reached.");
      return;
    }

    const title = newAddonTitle.trim();
    const cost = Number(newAddonCost) || 0;
    setNewAddonTitle("");
    setNewAddonCost("");

    startTransition(async () => {
      try {
        await addCategoryAddon(activeCategoryId, title, cost);
        await fetchAndSyncData();
      } catch (err: any) {
        alert("Failed to add category add-on: " + err.message);
      }
    });
  };

  const handleDeleteCategoryAddonSubmit = async (addonId: string) => {
    if (!confirm("Are you sure you want to delete this optional add-on?")) return;

    startTransition(async () => {
      try {
        await deleteCategoryAddon(activeCategoryId, addonId);
        await fetchAndSyncData();
      } catch (err: any) {
        alert("Failed to delete add-on: " + err.message);
      }
    });
  };

  return (
    <div className={`min-h-screen bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Causes &amp; Pricing Management</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure member limits, packaging unit costs, celebration video fee, and base campaign items.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 shadow-sm">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Headers</span>
              <span className="text-lg font-extrabold text-[#FFC107]">{categories.length}</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 shadow-sm">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Sub-Items</span>
              <span className="text-lg font-extrabold text-emerald-400">{totalSubCauses}</span>
            </div>
            {isPending && (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC107]/10 px-4 py-3 text-xs font-bold text-[#FFC107]">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFC107] border-t-transparent" />
                Saving...
              </div>
            )}
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 rounded-2xl bg-red-950/30 border border-red-900/50 p-4 text-xs text-red-400">
            {fetchError}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 py-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC107] border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* ── SECTION 1: Limits & Add-ons Configurator (Clear Distinction: Per-Member vs Flat Fee) ── */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders size={18} className="text-[#FFC107]" /> Global Checkout Rules &amp; Add-on Pricing
                  </h2>
                  <p className="text-xs text-slate-400">
                    Controls member limits, packaging unit costs per member, and the one-time video recording fee.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-5 py-2.5 text-xs font-bold text-black shadow-md hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                >
                  {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                  <span>{savedSuccess ? "Saved to Supabase!" : "Save All Settings"}</span>
                </button>
              </div>

              {/* 5 Distinct Controls: Min, Max, Photo, Video, Dedication Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/60 p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Min Members
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={config.minPersons}
                    onChange={(e) =>
                      setConfig({ ...config, minPersons: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 px-3 text-sm font-bold text-white focus:border-[#FFC107] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Lowest allowed</span>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/60 p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Max Members
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={config.maxPersons}
                    onChange={(e) =>
                      setConfig({ ...config, maxPersons: Math.max(1, Number(e.target.value) || 100) })
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 px-3 text-sm font-bold text-white focus:border-[#FFC107] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Maximum allowed</span>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/60 p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <ImageIcon size={12} className="text-[#FFC107]" /> Photo (₹/member)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={config.photoCost}
                    onChange={(e) =>
                      setConfig({ ...config, photoCost: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 px-3 text-sm font-bold text-[#FFC107] focus:border-[#FFC107] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Photo on packing</span>
                </div>

                {/* Video Flat Fee Input */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/60 p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Video size={12} className="text-[#FFC107]" /> Video (Flat ₹)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={config.videoCost}
                    onChange={(e) =>
                      setConfig({ ...config, videoCost: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 px-3 text-sm font-bold text-[#FFC107] focus:border-[#FFC107] focus:outline-none"
                  />
                  <span className="text-[10px] text-purple-400 font-semibold block">One-time service fee</span>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-800/60 p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Label (₹/member)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={config.textCost}
                    onChange={(e) =>
                      setConfig({ ...config, textCost: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 px-3 text-sm font-bold text-[#FFC107] focus:border-[#FFC107] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Custom name label</span>
                </div>
              </div>

              {/* Extra Items List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-white block">
                  Configured Gift Extras (Populates User Dropdown)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(config.extras || []).map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/40 px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Gift size={14} className="text-[#FFC107]" />
                        <span className="text-xs font-semibold text-white">{extra.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FFC107]">₹{extra.cost}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteExtraItem(extra.id)}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddExtraItem} className="pt-2 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Extra Gift Title (e.g. Scented Candles, Gift Box)"
                      value={newExtraTitle}
                      onChange={(e) => setNewExtraTitle(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-800 py-2 px-3 text-xs text-white focus:border-[#FFC107] focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:w-36">
                    <input
                      type="number"
                      placeholder="Cost / member (₹)"
                      value={newExtraCost}
                      onChange={(e) => setNewExtraCost(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-800 py-2 px-3 text-xs text-white focus:border-[#FFC107] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700 transition"
                  >
                    <Plus size={14} /> Add Extra
                  </button>
                </form>
              </div>
            </div>

            {/* ── SECTION 2: Category & Base Sub-Causes ── */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FolderPlus size={16} className="text-[#FFC107]" /> Add New Header (Category)
              </h2>
              <form onSubmit={handleAddCategorySubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Healthcare, Education, Orphanage"
                  className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFC107] px-6 py-2.5 text-xs font-bold text-black shadow-sm transition hover:opacity-90 disabled:opacity-50"
                >
                  <Plus size={14} /> Save Header
                </button>
              </form>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1 shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-1 shadow-sm"
                >
                  <button
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      String(activeCategoryId) === String(cat.id)
                        ? "bg-[#FFC107] text-black shadow-md"
                        : "text-slate-300 hover:bg-zinc-800"
                    }`}
                  >
                    <Layers size={14} />
                    {cat.name}
                  </button>

                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setEditCategoryNameInput(cat.name);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-[#FFC107] hover:bg-[#FFC107]/10 transition"
                    title="Edit Header Name"
                  >
                    <Edit3 size={14} />
                  </button>

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
                <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                    <div>
                      <h2 className="text-lg font-bold text-white">Header: {activeCategoryData.name}</h2>
                      <p className="text-xs text-slate-400">Manage baseline sub-causes and per-member baseline costs.</p>
                    </div>
                  </div>

                  {!activeCategoryData.subCauses || activeCategoryData.subCauses.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <Layers size={40} className="mx-auto text-zinc-700" />
                      <p className="text-xs font-bold text-zinc-400">No sub-items added under this header yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                      {activeCategoryData.subCauses.map((sub) => (
                        <motion.div
                          key={sub.id}
                          whileHover={{ y: -2 }}
                          className="relative flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-800/50 p-4"
                        >
                          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                            <button
                              onClick={() => openEditModal(sub)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-[#FFC107] hover:bg-[#FFC107]/10 transition"
                              title="Edit Sub-Item & Add-ons"
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

                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className="relative group h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
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

                            <div className="flex-1 w-full space-y-1.5 text-center sm:text-left pr-12">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-white">{sub.name}</h3>
                              <div className="flex items-center justify-center sm:justify-start gap-2">
                                <span className="text-[11px] font-bold text-slate-400">Base Cost (₹):</span>
                                <div className="relative w-32">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 text-xs">₹</span>
                                  <input
                                    type="number"
                                    value={sub.cost}
                                    onChange={(e) => handleCostChange(sub.id, Number(e.target.value))}
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 pl-7 pr-3 text-xs font-bold text-white focus:border-[#FFC107] focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sub-item specific saved add-ons */}
                          <div className="mt-1 pt-2.5 border-t border-zinc-700/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Gift size={12} className="text-[#FFC107]" />
                                Sub-Item Add-ons ({sub.addons?.length || 0}/20)
                              </span>
                              <button
                                type="button"
                                onClick={() => openEditModal(sub)}
                                className="text-[11px] font-bold text-[#FFC107] hover:underline flex items-center gap-1"
                              >
                                <Plus size={11} /> Manage Add-ons
                              </button>
                            </div>

                            {(!sub.addons || sub.addons.length === 0) ? (
                              <p className="text-[11px] text-zinc-500 italic">No add-ons saved for this sub-item yet.</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {sub.addons.map((addon) => (
                                  <span
                                    key={addon.id}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] font-medium text-white shadow-sm"
                                  >
                                    <span>{addon.title}</span>
                                    <span className="font-bold text-[#FFC107]">₹{addon.cost}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Remove "${addon.title}" from this sub-item?`)) {
                                          handleDeleteSubAddonSubmit(sub.id, addon.id);
                                        }
                                      }}
                                      disabled={isPending}
                                      className="text-slate-400 hover:text-red-400 transition ml-0.5"
                                      title="Remove"
                                    >
                                      <X size={11} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Sub-Item Form */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-[#FFC107]" /> Add Sub-Item to &quot;{activeCategoryData.name}&quot;
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
                        placeholder="e.g. Nutritious Meal"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Base Cost per Member (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={newSubCost}
                        onChange={(e) => setNewSubCost(e.target.value)}
                        placeholder="e.g. 100"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Photo Proof
                      </label>
                      <label className="flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-zinc-700 bg-zinc-800 py-2.5 px-4 text-xs font-semibold text-slate-300 cursor-pointer hover:bg-zinc-800/70">
                        <ImageIcon size={14} className="text-[#FFC107]" />
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
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFC107] px-4 py-2.5 text-xs font-bold text-black shadow-sm transition hover:opacity-90 disabled:opacity-50"
                      >
                        <Plus size={14} /> Save Sub-Item
                      </button>
                    </div>
                  </form>
                </div>

                {/* ── Sub-Category Optional Add-ons (Up to 20 items per category) ── */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Gift size={16} className="text-[#FFC107]" />
                        Optional Add-ons for {activeCategoryData.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Admin can design up to 20 optional sub-category add-ons for {activeCategoryData.name}. These will appear under the card on the front-end for donors as optional choices.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-xl px-3 py-1 text-xs font-bold ${
                        (activeCategoryData.addons?.length || 0) >= 20
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-zinc-800 text-[#FFC107] border border-zinc-700"
                      }`}>
                        {activeCategoryData.addons?.length || 0} / 20 items
                      </span>
                    </div>
                  </div>

                  {/* List of current add-ons */}
                  {(!activeCategoryData.addons || activeCategoryData.addons.length === 0) ? (
                    <div className="py-8 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40">
                      <p className="text-xs text-zinc-400">No optional add-ons configured for {activeCategoryData.name} yet.</p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">Use the form below to add up to 20 items.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {activeCategoryData.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-800/60 p-3 shadow-sm hover:border-zinc-700 transition"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="block text-xs font-bold text-white truncate">{addon.title}</span>
                            <span className="text-xs font-semibold text-[#FFC107]">₹{addon.cost}/person</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategoryAddonSubmit(addon.id)}
                            disabled={isPending}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                            title="Delete Add-on"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form to add add-on (disabled if count >= 20) */}
                  {(activeCategoryData.addons?.length || 0) < 20 ? (
                    <form onSubmit={handleAddCategoryAddonSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Add-on Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Extra Rice Bowl, Sweet Box, Fruit Basket"
                          value={newAddonTitle}
                          onChange={(e) => setNewAddonTitle(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-800 py-2 px-3 text-xs text-white focus:border-[#FFC107] focus:outline-none"
                        />
                      </div>
                      <div className="w-full sm:w-36">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Price in ₹ *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Cost (₹)"
                          value={newAddonCost}
                          onChange={(e) => setNewAddonCost(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-800 py-2 px-3 text-xs text-white focus:border-[#FFC107] focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-5 py-2 text-xs font-bold text-black shadow-md hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                      >
                        <Plus size={14} /> Add Add-on
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
                      You have reached the maximum limit of 20 add-ons for {activeCategoryData.name}. Delete an existing add-on to add a new one.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Header Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-zinc-900 p-6 shadow-2xl border border-zinc-800 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 size={16} className="text-[#FFC107]" /> Edit Header Name
                </h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-zinc-800"
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
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="rounded-xl bg-zinc-800 px-5 py-2 text-xs font-bold text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-5 py-2 text-xs font-bold text-black shadow-sm transition hover:opacity-90 disabled:opacity-50"
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
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 p-6 shadow-2xl border border-zinc-800 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 size={16} className="text-[#FFC107]" /> Edit Sub-Item &amp; Add-ons
                </h3>
                <button
                  onClick={() => setEditingSub(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-zinc-800"
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
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Cost per Member (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-white focus:border-[#FFC107] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Change Image
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editImage || "/banner1.png"}
                      alt="Preview"
                      className="h-12 w-12 rounded-xl object-cover border border-zinc-800"
                    />
                    <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-800 py-2.5 px-4 text-xs font-semibold text-slate-300 cursor-pointer hover:bg-zinc-800/70">
                      <ImageIcon size={14} className="text-[#FFC107]" />
                      <span className="truncate">Upload New Photo</span>
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

                {/* ── Sub-Item Specific Add-ons (Up to 20 for this sub-item) ── */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Gift size={14} className="text-[#FFC107]" />
                        Sub-Item Add-ons for &quot;{editingSub.name}&quot;
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Admin can add up to 20 optional add-ons specific to this sub-item. These appear under baseline cost on front-end.
                      </p>
                    </div>
                    <span className="rounded-lg bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-[#FFC107] border border-zinc-700 shrink-0">
                      {editingSub.addons?.length || 0}/20
                    </span>
                  </div>

                  {/* List of current add-ons for this sub-item */}
                  {(!editingSub.addons || editingSub.addons.length === 0) ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-3 text-center">
                      <p className="text-[11px] text-zinc-500">No add-ons added to this sub-item yet.</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">Use the inputs below to add items like Notebook, Bottle, etc.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {editingSub.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between rounded-xl bg-zinc-800/80 border border-zinc-700/60 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{addon.title}</span>
                            <span className="font-bold text-[#FFC107] text-[11px]">₹{addon.cost}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubAddonSubmit(editingSub.id, addon.id)}
                            disabled={isPending}
                            className="text-slate-400 hover:text-red-400 p-1 transition"
                            title="Delete this add-on"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add add-on inputs */}
                  {(editingSub.addons?.length || 0) < 20 ? (
                    <div className="pt-2 flex flex-col sm:flex-row gap-2 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Add-on Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Notebook Set, Water Bottle"
                          value={newSubAddonTitle}
                          onChange={(e) => setNewSubAddonTitle(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-800 py-1.5 px-3 text-xs text-white focus:border-[#FFC107] focus:outline-none"
                        />
                      </div>
                      <div className="w-full sm:w-28">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Cost (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Cost (₹)"
                          value={newSubAddonCost}
                          onChange={(e) => setNewSubAddonCost(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-800 py-1.5 px-3 text-xs text-white focus:border-[#FFC107] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSubAddonSubmit}
                        disabled={isPending || !newSubAddonTitle.trim()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-2 text-xs font-bold text-black hover:opacity-90 disabled:opacity-40 transition"
                      >
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2 text-xs text-amber-300">
                      Reached limit of 20 add-ons for this sub-item.
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSub(null)}
                    className="rounded-xl bg-zinc-800 px-5 py-2 text-xs font-bold text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-5 py-2 text-xs font-bold text-black shadow-sm transition hover:opacity-90 disabled:opacity-50"
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