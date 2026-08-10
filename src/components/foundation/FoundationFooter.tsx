// src/components/foundation/FoundationFooter.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Fraunces } from "next/font/google";
import { supabase } from "@/lib/supabase";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal"],
  variable: "--font-display",
});

const quickLinks = [
  { name: "Home", href: "/foundation" },
  { name: "About Us", href: "/foundation/about" },
  { name: "Causes", href: "/foundation/causes" },
  { name: "Gallery", href: "/foundation/gallery" },
  { name: "Contact", href: "/foundation/contact" },
  { name: "Donate Now", href: "/foundation/donate" },
];

// Fallback list — used only if the DB fetch fails or returns nothing
const fallbackFocusAreas = [
  "Food & Meal Support",
  "Education Sponsorship",
  "Healthcare Camps",
  "Orphan Care",
  "Livelihood Programmes",
];

type FocusArea = {
  id: number;
  title: string;
};

export default function FoundationFooter() {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCauses() {
      const { data, error } = await supabase
        .from("cause_categories")
        .select("id, title")
        .order("id", { ascending: true });

      if (!isMounted) return;

      if (error || !data || data.length === 0) {
        console.error("Footer: failed to load cause_categories", error?.message);
        setFocusAreas(
          fallbackFocusAreas.map((title, i) => ({ id: i, title }))
        );
        return;
      }

      setFocusAreas(data);
    }

    loadCauses();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer
      className={`
        relative
        overflow-hidden
        bg-white
        dark:bg-black
        pt-16
        pb-8
        mt-auto
        w-full
        transition-colors
        duration-500
        ${display.variable}
      `}
    >
      {/* Background Glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_20%,rgba(121,131,33,0.03)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(255,193,7,0.08)_0%,transparent_60%)]" />

      {/* Grid Pattern */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(to_right,#798321_1px,transparent_1px),linear-gradient(to_bottom,#798321_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Top Divider */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#798321]/20 to-transparent dark:via-[#FFC107]/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* ================= Brand ================= */}
          <div>
            <Link href="/foundation" className="group inline-flex items-center">
              <Image
                src="/logrecnobg.png"
                alt="Rakvih Foundation logo"
                width={180}
                height={60}
                className="w-44 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-neutral-300">
              Direct, item-level giving for meals, education, healthcare, and orphan
              care — every donation traced back to the person it helped.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label="Social link"
                  className="
                    flex h-10 w-10 items-center justify-center rounded-full
                    border border-[#798321]/20 dark:border-neutral-800
                    bg-[#EEF4DC] dark:bg-[#171717]
                    text-[#798321] dark:text-[#FFC107]
                    transition-all duration-300
                    hover:bg-[#798321] hover:text-white
                    dark:hover:bg-[#FFC107] dark:hover:text-black
                  "
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ================= Quick Links ================= */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#798321] dark:text-white tracking-tight">
              Quick Links
            </h3>
            <div aria-hidden="true" className="mt-2 mb-5 h-[3px] w-12 rounded-full bg-[#FFC107]" />

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    style={{ fontFamily: "var(--font-display)" }}
                    className="
                      inline-block text-[15px] font-medium tracking-tight text-gray-600 dark:text-neutral-300
                      transition-all duration-300
                      hover:translate-x-1 hover:text-[#798321] dark:hover:text-[#FFC107]
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= Focus Areas (live from cause_categories) ================= */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#798321] dark:text-white tracking-tight">
              Our Focus Areas
            </h3>
            <div aria-hidden="true" className="mt-2 mb-5 h-[3px] w-12 rounded-full bg-[#FFC107]" />

            <ul className="space-y-3">
              {focusAreas.length === 0 ? (
                <li style={{ fontFamily: "var(--font-display)" }} className="text-sm text-gray-400 dark:text-neutral-500 font-medium tracking-tight">
                  Loading causes…
                </li>
              ) : (
                focusAreas.map((area) => (
                  <li key={area.id}>
                    <Link
                      href={`/foundation/causes`}
                      style={{ fontFamily: "var(--font-display)" }}
                      className="
                        inline-block text-[15px] font-medium tracking-tight text-gray-600 dark:text-neutral-300
                        transition-all duration-300
                        hover:translate-x-1 hover:text-[#798321] dark:hover:text-[#FFC107]
                      "
                    >
                      {area.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* ================= Contact ================= */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#798321] dark:text-white tracking-tight">
              Contact Us
            </h3>
            <div aria-hidden="true" className="mt-2 mb-5 h-[3px] w-12 rounded-full bg-[#FFC107]" />

            <div className="space-y-5">
              {/* Phone */}
              <a href="tel:+918549942525" className="group flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4DC] dark:bg-[#171717] text-[#798321] dark:text-[#FFC107]">
                  <Phone size={18} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-[15px] font-medium tracking-tight text-gray-800 transition group-hover:text-[#798321] dark:text-white dark:group-hover:text-[#FFC107]">
                    85499 42525
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Response within 24–48 hours
                  </p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:rakvihfoundation@gmail.com" className="group flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4DC] dark:bg-[#171717] text-[#798321] dark:text-[#FFC107]">
                  <Mail size={18} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-[15px] font-medium tracking-tight text-gray-800 transition group-hover:text-[#798321] dark:text-white dark:group-hover:text-[#FFC107]">
                    rakvihfoundation@gmail.com
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Email Support
                  </p>
                </div>
              </a>

              {/* Address */}
              <a
                href="https://maps.google.com/?q=Attur+Layout+Yelahanka+Bengaluru+Karnataka+560064"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4DC] dark:bg-[#171717] text-[#798321] dark:text-[#FFC107]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-[15px] font-medium tracking-tight text-gray-800 transition group-hover:text-[#798321] dark:text-white dark:group-hover:text-[#FFC107]">
                    Attur Layout, Yelahanka,
                    <br />
                    Bengaluru, Karnataka 560064
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    India
                  </p>
                </div>
              </a>

              {/* Response Time */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4DC] dark:bg-[#171717] text-[#798321] dark:text-[#FFC107]">
                  <Clock size={18} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-[15px] font-medium tracking-tight text-gray-800 dark:text-white">
                    Response Time
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Within 24–48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Bottom Bar ================= */}
        <div className="mt-14 border-t border-[#798321]/15 dark:border-neutral-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">

            {/* Left */}
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold">RAKVIH Foundation</span>. A non-profit
              initiative.
            </p>

            {/* Center */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/foundation/terms" className="text-gray-600 dark:text-neutral-400 hover:text-[#798321] dark:hover:text-[#FFC107] transition">
                Terms & Conditions
              </Link>
              <span className="text-gray-300 dark:text-neutral-700">|</span>
              <Link href="/foundation/privacy-policy" className="text-gray-600 dark:text-neutral-400 hover:text-[#798321] dark:hover:text-[#FFC107] transition">
                Privacy Policy
              </Link>
            </div>

            {/* Right */}
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Designed & Developed by{" "}
              <a
                href="https://rakvih.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#798321] dark:text-[#FFC107] hover:text-[#FFC107] hover:underline transition-all duration-300 cursor-pointer"
              >
                RAKVIH
              </a>
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}