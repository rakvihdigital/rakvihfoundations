"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Fraunces } from "next/font/google";
import { Sparkles, Search, Image as ImageIcon, X, AlertCircle } from "lucide-react";
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

// ── SEO copy (per RAKVIH SEO Content Pack, Section 12 — /foundation/gallery) ──
const SEO_TITLE = "Photo & Video Proof of Impact | RAKVIH Foundation Gallery";
const SEO_DESCRIPTION =
  "See real photos and videos from RAKVIH Foundation's meal drives, education support and community events across Bengaluru and beyond.";
const CANONICAL_URL = "https://www.rakvihfoundation.org.in/foundation/gallery";

// Builds a descriptive, keyword-rich alt string instead of the bare title,
// e.g. "Thaali Meal Drive — RAKVIH Foundation, Yelahanka, Bengaluru"
// (per pack guidance: "Volunteers distributing thaali meals in Yelahanka, Bengaluru").
function buildAlt(item: any) {
  const title = item?.title?.trim();
  const category = item?.category?.trim();
  if (!title) return "RAKVIH Foundation community impact photo, Yelahanka, Bengaluru";
  const context = category ? `${category} — ` : "";
  return `${context}${title} — RAKVIH Foundation, Yelahanka, Bengaluru`;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<any | null>(null);

  // Set document title + meta description since this is a client component
  // and can't use Next.js's `metadata` export directly.
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

  useEffect(() => {
    async function fetchGalleryData() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error fetching gallery:", error);
          setErrorMessage(error.message);
        } else if (data) {
          setGalleryItems(data);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching gallery items:", err);
        setErrorMessage(err.message || "Failed to connect to database");
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = ["All", ...Array.from(new Set(galleryItems.map((item) => item.category || "General")))];

  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen overflow-x-clip bg-slate-50 dark:bg-black transition-colors duration-500 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      
      {/* ============ HERO SECTION ============ */}
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
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Moments of Impact
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Our Photo{" "}
            <span className="bg-gradient-to-r from-[#FFC107] via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Gallery
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-200 sm:leading-relaxed dark:text-neutral-300"
          >
            Real photo and video proof of impact — meal drives, education support, and
            community events from RAKVIH Foundation across Bengaluru and beyond.
          </motion.p>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:pt-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm ${
                  selectedCategory === cat
                    ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:border dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 shadow-sm focus:border-[#798321] focus:outline-none dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-[#FFC107]"
            />
          </div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle size={18} className="shrink-0" />
            <span>Database Error: {errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-neutral-900" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-neutral-800 dark:bg-[#0a0a0a]">
            <ImageIcon size={40} className="text-slate-400 dark:text-neutral-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white">No photos found</h3>
            <p className="mt-1 text-xs text-slate-400 dark:text-neutral-400 max-w-sm">
              We couldn't find any images matching your filters or search keywords.
            </p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-5 rounded-xl bg-[#798321] px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#646e1a] dark:bg-[#FFC107] dark:text-black"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredItems.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setActiveImage(item)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a]"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-neutral-900">
                    <Image
                      src={item.image_url}
                      alt={buildAlt(item)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                    
                    <span className="absolute top-4 left-4 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#24310F] shadow-md dark:bg-black/95 dark:text-[#FFC107]">
                      {item.category || "General"}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-sm font-bold leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Lightbox Modal Popup */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-zinc-950 shadow-2xl border border-zinc-800 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 rounded-full bg-black/80 p-3 text-white transition-colors hover:bg-black border border-white/10 backdrop-blur-md shadow-lg"
              >
                <X size={20} />
              </button>

              {/* Image Container */}
              <div className="relative h-[60vh] sm:h-[70vh] w-full bg-black">
                <Image
                  src={activeImage.image_url}
                  alt={buildAlt(activeImage)}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Details Footer */}
              <div className="p-5 sm:p-6 bg-zinc-950 border-t border-zinc-800/80">
                <span className="inline-block rounded-full bg-[#798321]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFC107] mb-1.5">
                  {activeImage.category || "General"}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">{activeImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}