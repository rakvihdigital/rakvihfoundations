"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Fraunces } from "next/font/google";
import { Heart, ArrowRight, Layers, Sparkles, Filter, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  variable: "--font-display",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// ── SEO copy (adapted from RAKVIH SEO Content Pack, Section 12 — /foundation/causes) ──
// "Ways to Give" is kept as the on-page H1/branding per site decision; the title tag and
// meta description below fold in the pack's original "Donate to a Cause" keyword intent
// so search snippets still surface the right terms even though the page reads "Ways to Give".
const SEO_TITLE =
  "Ways to Give | Donate to a Cause — Food, Child, Education & Events | RAKVIH Foundation";
const SEO_DESCRIPTION =
  "Choose exactly what you fund — a meal, a schoolbook, a health checkup. See the cost, sponsor it directly, and get proof it reached someone. Donate to a cause with RAKVIH Foundation.";
const CANONICAL_URL = "https://www.rakvihfoundation.org.in/foundation/causes";

// ── Fallback data aligned to the site's established "Four Causes" framework ──
// (per SEO Content Pack, Section 10 — Foundation Home: "Four Causes, One Clear Rule:
// Food, Child Support, Education, and Special Events") so a failed Supabase fetch never
// shows categories that contradict the rest of the site.
const fallbackCategories = [
  { id: 1, title: "Food" },
  { id: 2, title: "Child Support" },
  { id: 3, title: "Education" },
  { id: 4, title: "Special Events" },
];

const fallbackCauses = [
  {
    id: 101,
    category_id: 1,
    title: "Feed a Homeless Person",
    name: "Feed a Homeless Person",
    short_description: "Sponsor a nutritious meal for someone living on the street — a direct, item-level way to fight hunger today.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 100,
    is_active: true,
  },
  {
    id: 102,
    category_id: 1,
    title: "Thaali Meals",
    name: "Thaali Meals",
    short_description: "Fund a full thaali meal for a family in need, delivered with photo proof of every distribution.",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 150,
    is_active: true,
  },
  {
    id: 103,
    category_id: 2,
    title: "Child Care Kit",
    name: "Child Care Kit",
    short_description: "Provide essential hygiene, nutrition and care items for a child who needs them most.",
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 600,
    is_active: true,
  },
  {
    id: 104,
    category_id: 3,
    title: "School Bag",
    name: "School Bag",
    short_description: "Give a child the school bag they need to attend class every day, tracked back to the exact recipient.",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 450,
    is_active: true,
  },
  {
    id: 105,
    category_id: 3,
    title: "Educate a Child",
    name: "Educate a Child",
    short_description: "Sponsor a child's education costs for a term — books, fees and materials, fully accounted for.",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 2500,
    is_active: true,
  },
  {
    id: 106,
    category_id: 4,
    title: "Birthday Celebration",
    name: "Birthday Celebration",
    short_description: "Sponsor a birthday celebration — cake, gifts and joy — for a child who wouldn't otherwise have one.",
    image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 800,
    is_active: true,
  },
];

function CausesPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [categories, setCategories] = useState<any[]>(fallbackCategories);
  const [causes, setCauses] = useState<any[]>(fallbackCauses);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [categoryAddonsMap, setCategoryAddonsMap] = useState<Record<string | number, any[]>>({});
  const [subItemAddonsMap, setSubItemAddonsMap] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Set document title + meta description since this is a client component
  useEffect(() => {
    document.title = SEO_TITLE;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", SEO_DESCRIPTION);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL_URL);
  }, []);

  // Sync category from URL parameter (?category=...)
  useEffect(() => {
    if (!categoryParam) return;
    const parsedId = parseInt(categoryParam, 10);
    if (!isNaN(parsedId)) {
      setSelectedCategory(parsedId);
    } else {
      const match = categories.find(
        (c) =>
          c.title?.toLowerCase() === categoryParam.toLowerCase() ||
          c.name?.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) setSelectedCategory(match.id);
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    async function fetchCausesData() {
      try {
        setLoading(true);
        const [categoriesRes, itemsRes, addonsRes] = await Promise.all([
          supabase.from("cause_categories").select("id, title, description, created_at").order("created_at", { ascending: true }),
          supabase.from("cause_items").select("*").eq("is_active", true),
          supabase.from("cause_item_addons").select("id, cause_id, title, cost, is_active").eq("is_active", true).order("created_at", { ascending: true })
        ]);

        if (!categoriesRes.error && categoriesRes.data && categoriesRes.data.length > 0) {
          setCategories(categoriesRes.data);

          // Extract category and sub-item specific add-ons mapping
          const catMap: Record<string | number, any[]> = {};
          const subMap: Record<string, any[]> = {};

          if (!addonsRes.error && addonsRes.data) {
            addonsRes.data.forEach((addon: any) => {
              const key = String(addon.cause_id);
              if (!subMap[key]) subMap[key] = [];
              subMap[key].push({
                id: String(addon.id),
                title: addon.title,
                cost: Number(addon.cost) || 0,
                is_active: addon.is_active,
              });
            });
          }

          categoriesRes.data.forEach((cat: any) => {
            try {
              const parsed = JSON.parse(cat.description || "{}");
              if (Array.isArray(parsed.addOns) && parsed.addOns.length > 0) {
                catMap[cat.id] = parsed.addOns;
              }
              if (parsed.subItemAddons && typeof parsed.subItemAddons === "object") {
                Object.entries(parsed.subItemAddons).forEach(([subId, addons]) => {
                  if (!subMap[subId] && Array.isArray(addons) && addons.length > 0) {
                    subMap[subId] = addons;
                  }
                });
              }
            } catch {
              // ignore plain descriptions
            }
          });
          setCategoryAddonsMap(catMap);
          setSubItemAddonsMap(subMap);
        }

        if (!itemsRes.error && itemsRes.data && itemsRes.data.length > 0) {
          setCauses(itemsRes.data);
        }
      } catch (err) {
        console.error("Error fetching causes data, utilizing fallbacks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCausesData();
  }, []);

  const filteredCauses = causes.filter((cause) => {
    const matchesCategory = selectedCategory === "all" || cause.category_id === selectedCategory;
    const titleMatch = (cause.title || cause.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (cause.short_description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (titleMatch || descMatch);
  });

  return (
    <div className={`min-h-screen overflow-x-clip bg-slate-50 dark:bg-black transition-colors duration-500 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>

      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-14 sm:pb-8 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#798321]/30 blur-[100px] pointer-events-none"
        />
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FFC107]/20 blur-[120px] pointer-events-none"
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Make A Difference Today
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Ways to{" "}
            <span className="bg-gradient-to-r from-[#FFC107] via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Give
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-200 sm:leading-relaxed dark:text-neutral-300"
          >
            No vague fund here — choose exactly what you're supporting across Food, Child
            Support, Education, and Special Events, see the exact cost, and get proof it
            reached someone. Sponsor a meal, a schoolbook, or a checkup, item by item.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 pb-12 sm:pt-7 sm:pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm ${
                selectedCategory === "all"
                  ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:border dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              <Layers size={14} />
              <span>All Ways to Give</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm ${
                  selectedCategory === cat.id
                    ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:border dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search ways to give..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 shadow-sm focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-[#FFC107]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-neutral-900" />
            ))}
          </div>
        ) : filteredCauses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <Filter size={40} className="text-slate-400 dark:text-neutral-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white">No results found</h3>
            <p className="mt-1 text-xs text-slate-400 dark:text-neutral-400 max-w-sm">
              We couldn't find any active ways to give matching your filters or search query. Try resetting your search parameters.
            </p>
            <button
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-5 rounded-xl bg-[#798321] px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#646e1a] dark:bg-[#FFC107] dark:text-black"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredCauses.map((cause: any, index: number) => {
                const displayImage = cause.image_url || cause.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop";
                const costPerPerson = cause.cost_per_person || cause.cost || 1000;

                return (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a]"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-neutral-900">
                      <Image
                        src={displayImage}
                        alt={`${cause.title || cause.name || "Gift"} — RAKVIH Foundation donation item, Bengaluru`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#24310F] shadow-md dark:bg-black/90 dark:text-[#FFC107]">
                        Active Campaign
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#798321] dark:text-white dark:group-hover:text-[#FFC107] transition-colors line-clamp-1">
                          {cause.title || cause.name}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-neutral-400 line-clamp-2">
                          {cause.short_description || "Support this dedicated initiative to bring sustainable positive impact to communities in need."}
                        </p>

                        {/* Cost Per Person Indicator */}
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3.5 py-2 border border-amber-200/60 dark:bg-[#171717] dark:border-neutral-800 w-full mt-2">
                          <Users size={15} className="text-[#798321] dark:text-[#FFC107] shrink-0" />
                          <div className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center justify-between w-full">
                            <span>Cost per person:</span>
                            <span className="font-bold text-[#798321] dark:text-[#FFC107]">₹{Number(costPerPerson).toLocaleString()}</span>
                          </div>
                        </div>
                        {/* Optional Add-ons available */}
                        {(() => {
                          const itemAddons =
                            subItemAddonsMap[String(cause.id)] || categoryAddonsMap[cause.category_id];
                          if (!itemAddons || itemAddons.length === 0) return null;
                          return (
                            <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-neutral-800">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-1.5">
                                <Sparkles size={11} className="text-[#798321] dark:text-[#FFC107]" />
                                <span>Optional Add-ons ({itemAddons.length})</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {itemAddons.slice(0, 2).map((addon: any, idx: number) => (
                                  <span
                                    key={addon.id || idx}
                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-neutral-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-neutral-300"
                                  >
                                    <span>{addon.title}</span>
                                    <span className="font-bold text-[#798321] dark:text-[#FFC107]">+₹{addon.cost}</span>
                                  </span>
                                ))}
                                {itemAddons.length > 2 && (
                                  <span className="inline-flex items-center rounded-lg bg-amber-50 dark:bg-[#1f1a08] px-2 py-0.5 text-[10px] font-bold text-[#798321] dark:text-[#FFC107]">
                                    +{itemAddons.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800">
                        <Link
                          href={`/foundation/donate?cause=${cause.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-3 text-xs font-semibold text-white shadow-md transition-all hover:opacity-95 active:scale-95 dark:text-black"
                        >
                          <Heart size={16} fill="currentColor" />
                          <span>Give This Gift</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

    </div>
  );
}

export default function CausesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-black py-28 flex flex-col justify-center items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent dark:border-[#FFC107]" />
          <p className="text-xs font-semibold text-slate-400">Loading ways to give...</p>
        </div>
      }
    >
      <CausesPageContent />
    </Suspense>
  );
}