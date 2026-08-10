"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";

const links = [
  { name: "Home", href: "/home" },
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Tuition", href: "/tuition" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  // 1. Add mounted state to fix Hydration mismatch
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 2. Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // True "browser back" behavior — goes to whatever page the user came
  // from, rather than always landing on "/". Falls back to "/" only
  // if there's no previous entry in history (e.g. direct link landing).
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        border-b
        border-[#798321]/15
        dark:border-neutral-800
        bg-white/90
        dark:bg-black/90
        shadow-sm
        backdrop-blur-xl
      "
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between">
          
          {/* ================= Left: Back Arrow & Logo ================= */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="
                flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                border border-[#798321]/20 dark:border-neutral-800
                bg-[#F8FAF0] dark:bg-[#111111]
                text-[#798321] dark:text-[#FFC107]
                shadow-sm transition-all duration-300
                hover:bg-[#798321] hover:text-white
                dark:hover:bg-[#FFC107] dark:hover:text-black
              "
              title="Go Back"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Logo Container */}
            <Link href="/home" className="group flex items-center">
              <div className="relative h-[56px] w-[180px] sm:h-[64px] sm:w-[220px] shrink-0">
                {/* Light Logo */}
                <Image
                  src="/logrecnobg.png"
                  alt="RAKVIH Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 180px, 220px"
                  className="block dark:hidden object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Dark Logo */}
                <Image
                  src="/logrecnobg.png"
                  alt="RAKVIH Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 180px, 220px"
                  className="hidden dark:block object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>
          
          {/* ================= Desktop Menu ================= */}
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  group
                  relative
                  py-1
                  text-[15px]
                  font-semibold
                  text-[#374151]
                  dark:text-neutral-200
                  transition-all
                  duration-300
                  hover:text-[#798321]
                  dark:hover:text-[#FFC107]
                "
              >
                {item.name}
                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    h-[3px]
                    w-0
                    rounded-full
                    bg-[#FFC107]
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </Link>
            ))}
          </nav>
          
          {/* ================= Desktop Right ================= */}
          <div className="hidden items-center gap-5 lg:flex">
            {/* Theme Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#798321]/20
                dark:border-neutral-800
                bg-[#F8FAF0]
                dark:bg-[#111111]
                text-[#798321]
                dark:text-[#FFC107]
                shadow-sm
                transition-all
                duration-300
                hover:bg-[#798321]
                hover:text-white
                dark:hover:bg-[#FFC107]
                dark:hover:text-black
                hover:shadow-lg
              "
            >
              {/* 3. Delay icon rendering until mounted */}
              {!mounted ? (
                <div style={{ width: 18, height: 18 }} />
              ) : theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Divider */}
            <div
              className="
                h-7
                w-px
                bg-[#798321]/20
                dark:bg-neutral-800
              "
            />

            {/* User */}
            <UserMenu />
          </div>

          {/* ================= Mobile Controls ================= */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#798321]/20
                dark:border-neutral-800
                bg-[#F8FAF0]
                dark:bg-[#111111]
                text-[#798321]
                dark:text-[#FFC107]
                transition-all
                duration-300
                hover:bg-[#798321]
                hover:text-white
                dark:hover:bg-[#FFC107]
                dark:hover:text-black
              "
            >
              {/* 4. Delay icon rendering until mounted (Mobile) */}
              {!mounted ? (
                <div style={{ width: 17, height: 17 }} />
              ) : theme === "dark" ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>

            {/* Menu */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#798321]/20
                dark:border-neutral-800
                bg-white
                dark:bg-[#111111]
                text-[#798321]
                dark:text-[#FFC107]
                transition-all
                duration-300
                hover:bg-[#798321]
                hover:text-white
                dark:hover:bg-[#FFC107]
                dark:hover:text-black
              "
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* ================= Mobile Menu ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              overflow-hidden
              border-t
              border-[#798321]/15
              dark:border-neutral-800
              bg-white
              dark:bg-black
              shadow-2xl
              lg:hidden
            "
          >
            <div className="space-y-3 px-6 py-6">
              {links.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
                    block
                    rounded-xl
                    px-4
                    py-3
                    text-[15px]
                    font-semibold
                    text-[#374151]
                    dark:text-neutral-200
                    transition-all
                    duration-300
                    hover:bg-[#798321]/10
                    dark:hover:bg-[#111111]
                    hover:text-[#798321]
                    dark:hover:text-[#FFC107]
                  "
                >
                  {item.name}
                </Link>
              ))}

              {/* Divider */}
              <div
                className="
                  mt-4
                  border-t
                  border-[#798321]/15
                  dark:border-neutral-800
                  pt-5
                "
              >
                <UserMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}