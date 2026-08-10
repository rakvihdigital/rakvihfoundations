"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Fraunces } from "next/font/google";
import { ArrowLeft, Heart, Menu, X, Sun, Moon, ChevronDown, Layers, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal"],
  variable: "--font-display",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Fallback static causes so it never gets stuck
const fallbackCategories = [
  {
    id: 1,
    title: "Social Welfare",
    cause_items: [
      { id: 101, title: "Child Education", name: "Child Education" },
      { id: 102, title: "Healthcare Support", name: "Healthcare Support" },
    ],
  },
  {
    id: 2,
    title: "Environment",
    cause_items: [
      { id: 201, title: "Tree Plantation", name: "Tree Plantation" },
      { id: 202, title: "Clean Water", name: "Clean Water" },
    ],
  },
];

const navLinks = [
  { href: "/foundation", label: "Home" },
  { href: "/foundation/about", label: "About Us" },
  { href: "/foundation/causes", label: "Ways to Give", hasDropdown: true },
  { href: "/foundation/csr", label: "CSR" },
  { href: "/foundation/gallery", label: "Gallery" },
  { href: "/foundation/contact", label: "Contact" },
];

export default function FoundationNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [causesOpen, setCausesOpen] = useState(false);
  const [categories, setCategories] = useState(fallbackCategories);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    async function fetchNavbarCauses() {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          supabase.from("cause_categories").select("id, title, created_at").order("created_at", { ascending: true }),
          supabase.from("cause_items").select("id, category_id, title, name, is_active")
        ]);

        if (!categoriesRes.error && categoriesRes.data && !itemsRes.error && itemsRes.data) {
          const combined = categoriesRes.data.map((cat) => ({
            ...cat,
            cause_items: itemsRes.data.filter(
              (item) => item.category_id === cat.id && item.is_active !== false
            )
          }));

          if (combined.length > 0) {
            setCategories(combined);
          }
        }
      } catch (err) {
        console.error("Using fallback navigation links due to fetch error:", err);
      }
    }
    
    fetchNavbarCauses();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCausesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // True "browser back" behavior — goes to whatever page the user came
  // from (even outside /foundation), rather than always landing on "/".
  // Falls back to "/" only if there's no previous entry in history
  // (e.g. someone opened this page directly via a shared link).
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-black/90 transition-colors duration-500 ${display.variable}`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Back Arrow & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleBack}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <Link href="/foundation" className="group flex items-center">
            <div className="relative h-[56px] w-[170px] shrink-0 sm:h-[64px] sm:w-[220px] md:h-[76px] md:w-[250px]">
              <Image
                src="/Found1.png"
                alt="RAKVIH Foundation Logo"
                fill
                priority
                sizes="(max-width: 768px) 170px, 250px"
                className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Navigation Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.hasDropdown) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setCausesOpen(!causesOpen)}
                    style={{ fontFamily: "var(--font-display)" }}
                    className={`flex items-center gap-1.5 text-[15px] font-medium tracking-tight transition-colors ${
                      isActive || pathname.startsWith("/foundation/causes")
                        ? "text-[#798321] dark:text-[#FFC107]"
                        : "text-slate-600 hover:text-[#24310F] dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${causesOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Desktop Causes Dropdown - 4 Columns in a Row Layout */}
                  <AnimatePresence>
                    {causesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-3 w-[920px] max-w-[95vw] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a] z-50 max-h-[75vh] overflow-y-auto space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1 dark:border-neutral-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Explore Causes</span>
                          <Link
                            href="/foundation/causes"
                            onClick={() => setCausesOpen(false)}
                            className="text-xs font-bold text-[#798321] dark:text-[#FFC107] hover:underline"
                          >
                            View All Causes
                          </Link>
                        </div>

                        {/* Grid Layout: Exactly 4 Columns in a Row, wrapping automatically into multiple rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {categories.map((cat) => (
                            <div key={cat.id} className="space-y-2 rounded-2xl bg-slate-50/70 p-3.5 dark:bg-[#171717] border border-slate-100 dark:border-neutral-800 flex flex-col justify-between">
                              <div>
                                {/* Category Header */}
                                <Link
                                  href="/foundation/causes"
                                  onClick={() => setCausesOpen(false)}
                                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#24310F] hover:text-[#798321] dark:text-white dark:hover:text-[#FFC107] transition-colors mb-2"
                                >
                                  <Layers size={13} className="text-[#798321] dark:text-[#FFC107] shrink-0" />
                                  <span className="truncate">{cat.title}</span>
                                </Link>

                                {/* Nested Cause Items */}
                                {cat.cause_items && cat.cause_items.length > 0 ? (
                                  <div className="space-y-1 pl-1 border-l border-slate-200 dark:border-neutral-800 ml-1">
                                    {cat.cause_items.map((item: any) => (
                                      <Link
                                        key={item.id}
                                        href={`/foundation/donate?cause=${item.id}`}
                                        onClick={() => setCausesOpen(false)}
                                        className="block rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white hover:text-[#798321] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-[#FFC107] truncate transition-colors"
                                      >
                                        {item.name || item.title}
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="pl-2 text-[11px] text-slate-400 dark:text-neutral-500 italic">No causes listed</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontFamily: "var(--font-display)" }}
                className={`relative text-[15px] font-medium tracking-tight transition-colors ${
                  isActive
                    ? "text-[#798321] dark:text-[#FFC107]"
                    : "text-slate-600 hover:text-[#24310F] dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#798321] dark:bg-[#FFC107]"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 sm:h-10 sm:w-10"
          >
            {!mounted ? (
              <div className="h-[18px] w-[18px]" />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            )}
          </button>

          {/* Volunteer Button */}
          <Link
            href="/foundation/volunteer"
            style={{ fontFamily: "var(--font-display)" }}
            className="group hidden items-center gap-2 rounded-full border border-[#798321]/40 bg-transparent px-4 py-2 text-xs font-semibold text-[#798321] transition-all hover:bg-[#798321]/10 dark:border-[#FFC107]/40 dark:text-[#FFC107] dark:hover:bg-[#FFC107]/10 sm:flex sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <Users size={16} className="transition-transform group-hover:scale-110" />
            <span>Volunteer</span>
          </Link>

          {/* Donate Button */}
          <Link
            href="/foundation/genraldonate"
            style={{ fontFamily: "var(--font-display)" }}
            className="group hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#798321] to-[#FFC107] px-4 py-2 text-xs font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 sm:flex sm:px-5 sm:py-2.5 sm:text-sm dark:text-black"
          >
            <Heart size={16} className="transition-transform group-hover:scale-110" fill="currentColor" />
            <span>Donate</span>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a] lg:hidden"
          >
            <div className="flex flex-col space-y-2 px-6 py-6 max-h-[75vh] overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.hasDropdown) {
                  return (
                    <div key={link.href} className="space-y-1 py-1">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-[15px] font-medium tracking-tight text-[#798321] dark:text-[#FFC107]"
                      >
                        {link.label} (Main)
                      </Link>

                      <div className="pl-4 space-y-3 border-l-2 border-slate-200 dark:border-neutral-800 ml-2 mt-2">
                        {categories.map((cat) => (
                          <div key={cat.id} className="space-y-1.5">
                            {/* Category Title */}
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-200 px-2 py-1 bg-slate-50 dark:bg-neutral-900 rounded-lg">
                              <Layers size={12} className="text-[#798321] dark:text-[#FFC107]" />
                              {cat.title}
                            </span>

                            {/* Nested Cause Items */}
                            {cat.cause_items && cat.cause_items.length > 0 ? (
                              <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-neutral-800 ml-2">
                                {cat.cause_items.map((item: any) => (
                                  <Link
                                    key={item.id}
                                    href={`/foundation/donate?cause=${item.id}`}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                                  >
                                    • {item.name || item.title}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="pl-4 text-[11px] text-slate-400 dark:text-neutral-500 italic">No items available</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{ fontFamily: "var(--font-display)" }}
                    className={`block rounded-xl px-4 py-3 text-[15px] font-medium tracking-tight transition-all ${
                      isActive
                        ? "bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 flex flex-col gap-2.5 sm:hidden">
                <Link
                  href="/foundation/volunteer"
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--font-display)" }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#798321]/40 bg-transparent px-5 py-3 text-sm font-semibold text-[#798321] dark:border-[#FFC107]/40 dark:text-[#FFC107]"
                >
                  <Users size={18} />
                  Join as Volunteer
                </Link>

                <Link
                  href="/foundation/genraldonate"
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--font-display)" }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-5 py-3.5 text-sm font-semibold text-white shadow-md active:scale-95 dark:text-black"
                >
                  <Heart size={18} fill="currentColor" />
                  Donate Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}