"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

const fallbackCategories = [
  { id: 1, title: "Social Welfare" },
  { id: 2, title: "Environment" },
  { id: 3, title: "Education & Youth" },
];

const fallbackCauses = [
  {
    id: 101,
    category_id: 1,
    title: "Child Education Support",
    name: "Child Education Support",
    short_description: "Empowering underprivileged children with quality learning materials, tuition, and school fees.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 1200,
    is_active: true,
  },
  {
    id: 102,
    category_id: 2,
    title: "Green Earth Tree Plantation",
    name: "Green Earth Tree Plantation",
    short_description: "Planting saplings across urban and rural zones to fight climate change and preserve local ecosystems.",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 500,
    is_active: true,
  },
  {
    id: 103,
    category_id: 3,
    title: "Rural Healthcare Camp",
    name: "Rural Healthcare Camp",
    short_description: "Providing essential medical checkups, life-saving medicines, and health awareness in remote villages.",
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop",
    image: null,
    cost_per_person: 750,
    is_active: true,
  },
];

export default function CausesPage() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [causes, setCauses] = useState(fallbackCauses);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCausesData() {
      try {
        setLoading(true);
        const [categoriesRes, itemsRes] = await Promise.all([
          supabase.from("cause_categories").select("id, title, created_at").order("created_at", { ascending: true }),
          supabase.from("cause_items").select("*").eq("is_active", true)
        ]);

        if (!categoriesRes.error && categoriesRes.data && categoriesRes.data.length > 0) {
          setCategories(categoriesRes.data);
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
    <div className={`min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-black dark:to-black">
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
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
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
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base dark:text-neutral-300"
          >
            Explore our ongoing initiatives across social welfare, environment preservation, and community building. Choose a way to give that's close to your heart.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
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
                        alt={cause.title || cause.name || "Gift image"}
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