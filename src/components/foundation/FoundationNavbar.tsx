"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Fraunces } from "next/font/google";
import { ArrowLeft, Heart, Menu, X, Sun, Moon, ChevronDown, Layers, Users, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import LanguageTranslator from "@/components/foundation/LanguageTranslator";

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
  const [volunteer, setVolunteer] = useState<{ id: string; name: string } | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    async function fetchNavbarCauses() {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          supabase
            .from("cause_categories")
            .select("id, title, created_at")
            .order("created_at", { ascending: true }),
          supabase.from("cause_items").select("id, category_id, title, name, is_active"),
        ]);

        if (!categoriesRes.error && categoriesRes.data && !itemsRes.error && itemsRes.data) {
          const combined = categoriesRes.data.map((cat) => ({
            ...cat,
            cause_items: itemsRes.data.filter(
              (item) => item.category_id === cat.id && item.is_active !== false
            ),
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

    const checkVolunteer = () => {
      if (typeof window !== "undefined") {
        const vid = localStorage.getItem("rakvih_volunteer_id");
        const vname = localStorage.getItem("rakvih_volunteer_name");
        if (vid) {
          setVolunteer({ id: vid, name: vname || "Volunteer" });
        } else {
          setVolunteer(null);
        }
      }
    };

    checkVolunteer();
    window.addEventListener("storage", checkVolunteer);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCausesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("storage", checkVolunteer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rakvih_volunteer_id");
      localStorage.removeItem("rakvih_volunteer_name");
      setVolunteer(null);
      if (pathname.includes("/foundation/volunteer/dashboard")) {
        router.push("/foundation/volunteer");
      }
    }
  };

  if (
    pathname.includes("/foundation/volunteer/dashboard") ||
    pathname.includes("/adminfoundations")
  ) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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
      <div className="mx-auto flex h-[80px] sm:h-[94px] max-w-[1440px] items-center justify-between px-2.5 sm:px-4 lg:px-6 gap-1.5 sm:gap-2 xl:gap-4">
        
        {/* Left: Back Arrow & Logo */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
          <button
            onClick={handleBack}
            className="flex h-8 w-8 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>

          <Link href="/foundation" className="group flex items-center bg-transparent">
            <div className="relative h-[50px] w-[125px] min-[360px]:w-[140px] min-[400px]:w-[165px] sm:h-[76px] sm:w-[250px] md:h-[80px] md:w-[265px] lg:w-[250px] xl:h-[84px] xl:w-[290px] bg-transparent shrink-0">
              <Image
                src="/rakvih-foundation.png"
                alt="RAKVIH Foundation Logo"
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 165px, 290px"
                className="object-contain object-left scale-105 sm:scale-120 origin-left transition-transform duration-300 group-hover:scale-125 !bg-transparent"
              />
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Navigation Links (Flex-1, never overlaps left or right elements) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0 mx-1 xl:mx-4 gap-3 lg:gap-3.5 xl:gap-5 2xl:gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.hasDropdown) {
              return (
                <div key={link.href} className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setCausesOpen(!causesOpen)}
                    style={{ fontFamily: "var(--font-display)" }}
                    className={`flex items-center gap-1 text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium tracking-tight whitespace-nowrap transition-colors ${
                      isActive || pathname.startsWith("/foundation/causes")
                        ? "text-[#798321] dark:text-[#FFC107]"
                        : "text-slate-600 hover:text-[#24310F] dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${causesOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Desktop Causes Dropdown */}
                  <AnimatePresence>
                    {causesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-3 w-[860px] max-w-[90vw] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a] z-50 max-h-[75vh] overflow-y-auto space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1 dark:border-neutral-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                            Explore Causes
                          </span>
                          <Link
                            href="/foundation/causes"
                            onClick={() => setCausesOpen(false)}
                            className="text-xs font-bold text-[#798321] dark:text-[#FFC107] hover:underline"
                          >
                            View All Causes
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="space-y-2 rounded-2xl bg-slate-50/70 p-3.5 dark:bg-[#171717] border border-slate-100 dark:border-neutral-800 flex flex-col justify-between"
                            >
                              <div>
                                <Link
                                  href="/foundation/causes"
                                  onClick={() => setCausesOpen(false)}
                                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#24310F] hover:text-[#798321] dark:text-white dark:hover:text-[#FFC107] transition-colors mb-2"
                                >
                                  <Layers size={13} className="text-[#798321] dark:text-[#FFC107] shrink-0" />
                                  <span className="truncate">{cat.title}</span>
                                </Link>

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
                                  <div className="pl-2 text-[11px] text-slate-400 dark:text-neutral-500 italic">
                                    No causes listed
                                  </div>
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
                className={`relative text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium tracking-tight transition-colors whitespace-nowrap shrink-0 ${
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
        </nav>

        {/* Right: Controls (shrink-0, perfectly positioned) */}
        <div className="flex items-center gap-1 sm:gap-2 xl:gap-2.5 shrink-0">
          <LanguageTranslator variant="desktop" />

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 shrink-0"
          >
            {!mounted ? (
              <div className="h-[16px] w-[16px]" />
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
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            )}
          </button>

          {/* Volunteer Button - only shown when not logged in */}
          {!volunteer && (
            <Link
              href="/foundation/volunteer"
              style={{ fontFamily: "var(--font-display)" }}
              className="group hidden items-center gap-1.5 rounded-full border border-[#798321]/40 bg-transparent px-3 py-2 text-xs font-semibold text-[#798321] transition-all hover:bg-[#798321]/10 dark:border-[#FFC107]/40 dark:text-[#FFC107] dark:hover:bg-[#FFC107]/10 xl:flex xl:px-3.5 xl:py-2.5 sm:text-sm shrink-0 whitespace-nowrap"
            >
              <Users size={15} className="transition-transform group-hover:scale-110" />
              <span>Volunteer</span>
            </Link>
          )}

          {/* Donate Button */}
          <Link
            href="/foundation/genraldonate"
            style={{ fontFamily: "var(--font-display)" }}
            className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#798321] to-[#FFC107] px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 sm:flex sm:px-4 sm:py-2.5 sm:text-sm dark:text-black shrink-0 whitespace-nowrap"
          >
            <Heart size={15} className="transition-transform group-hover:scale-110" fill="currentColor" />
            <span>Donate</span>
          </Link>

          {/* Logged in Volunteer Badge & Logout Button */}
          {volunteer && (
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-neutral-800 shrink-0">
              <Link
                href="/foundation/volunteer/dashboard"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#798321]/10 text-[#798321] hover:bg-[#798321]/20 dark:bg-[#FFC107]/15 dark:text-[#FFC107] dark:hover:bg-[#FFC107]/25 transition text-xs font-bold shadow-sm shrink-0"
                title={`Logged in as ${volunteer.name}. Click to view dashboard.`}
              >
                <div className="h-5 w-5 rounded-full bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black flex items-center justify-center text-[10px] font-extrabold shrink-0">
                  {volunteer.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[85px] xl:max-w-[110px] truncate">{volunteer.name}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                title="Log out from volunteer account"
                className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/40 transition shrink-0"
              >
                <LogOut size={13} />
                <span className="hidden xl:inline text-[11px]">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle (Always visible, shrink-0, priority!) */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            className="flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 lg:hidden shrink-0 shadow-sm"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
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
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-200 px-2 py-1 bg-slate-50 dark:bg-neutral-900 rounded-lg">
                              <Layers size={12} className="text-[#798321] dark:text-[#FFC107]" />
                              {cat.title}
                            </span>

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
                              <div className="pl-4 text-[11px] text-slate-400 dark:text-neutral-500 italic">
                                No items available
                              </div>
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

              <LanguageTranslator variant="mobile" />

              <div className="pt-4 flex flex-col gap-2.5 sm:hidden">
                {volunteer ? (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black flex items-center justify-center font-bold text-xs">
                        {volunteer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{volunteer.name}</p>
                        <p className="text-[10px] font-bold text-[#798321] dark:text-[#FFC107] uppercase">Volunteer Active</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/foundation/volunteer/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black py-2 text-xs font-bold shadow transition"
                      >
                        <Users size={13} />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="flex items-center justify-center gap-1 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 py-2 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      >
                        <LogOut size={13} />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/foundation/volunteer"
                    onClick={() => setOpen(false)}
                    style={{ fontFamily: "var(--font-display)" }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#798321]/40 bg-transparent px-5 py-3 text-sm font-semibold text-[#798321] dark:border-[#FFC107]/40 dark:text-[#FFC107]"
                  >
                    <Users size={18} />
                    Join as Volunteer
                  </Link>
                )}

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