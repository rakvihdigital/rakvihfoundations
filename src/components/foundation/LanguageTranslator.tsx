"use client";

import { useEffect, useState, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  shortLabel: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", shortLabel: "EN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", shortLabel: "ಕನ್ನಡ" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", shortLabel: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", shortLabel: "తెలుగు" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", shortLabel: "हिन्दी" },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

interface LanguageTranslatorProps {
  variant?: "desktop" | "mobile";
}

export default function LanguageTranslator({ variant = "desktop" }: LanguageTranslatorProps) {
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize Google Translate Script safely once
  useEffect(() => {
    // Read current language from cookie or localStorage
    const getSavedLang = () => {
      if (typeof window === "undefined") return "en";
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, val] = cookie.trim().split("=");
        if (name === "googtrans" && val) {
          const parts = val.split("/");
          const code = parts[parts.length - 1];
          if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
            return code;
          }
        }
      }
      return localStorage.getItem("rakvih_lang") || "en";
    };

    const saved = getSavedLang();
    setCurrentLang(saved);

    // Setup global callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ta,te,hi,kn",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Append script if not already added
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.();
    }

    // Handle outside clicks to close dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    if (typeof window === "undefined") return;

    localStorage.setItem("rakvih_lang", langCode);

    // Set cookie for Google Translate across all domains and root path
    const domain = window.location.hostname;
    const cookieValue = langCode === "en" ? "/en/en" : `/en/${langCode}`;
    
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;

    // Try to trigger the change directly on the Google combo select if ready
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }

    // Reload page to guarantee complete DOM translation without partial artifacts
    window.location.reload();
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const globalTranslateStyles = (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Global CSS to suppress Google toolbar clutter */}
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner-frame,
        iframe.goog-te-banner-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .VIpgJd-ZVi9od-OR9Mb-Oxf5Fd,
        .VIpgJd-ZVi9od-l4eHX-hSRWhd,
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
          display: none !important;
          visibility: hidden !important;
        }
        body,
        body.translated-ltr,
        body.translated-rtl {
          top: 0px !important;
          position: static !important;
        }
        .skiptranslate > iframe {
          display: none !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
      `}</style>
    </>
  );

  if (variant === "mobile") {
    return (
      <div className="w-full space-y-2 pt-2 border-t border-slate-200 dark:border-neutral-800 notranslate" translate="no">
        {globalTranslateStyles}
        <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
          <Globe size={14} className="text-[#798321] dark:text-[#FFC107]" />
          <span>Language / மொழி / భాష</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#798321] text-white dark:bg-[#FFC107] dark:text-black shadow-sm font-bold"
                    : "bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span>{lang.nativeName}</span>
                  <span className={`text-[10px] ${isSelected ? "text-white/80 dark:text-black/80" : "text-slate-400 dark:text-neutral-500"}`}>
                    {lang.name}
                  </span>
                </div>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative notranslate shrink-0" translate="no" ref={dropdownRef}>
      {globalTranslateStyles}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className="flex h-8 sm:h-9 items-center gap-1 sm:gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 sm:px-3 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 sm:text-sm shrink-0 whitespace-nowrap"
      >
        <Globe size={14} className="text-[#798321] dark:text-[#FFC107] shrink-0" />
        <span className="max-sm:hidden font-bold tracking-tight">{activeLangObj.nativeName}</span>
        <span className="sm:hidden font-bold tracking-tight text-[11px]">{activeLangObj.shortLabel}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-neutral-800 dark:bg-[#111] z-[1000]"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800 mb-1">
              Select Language
            </div>
            <div className="space-y-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                      isSelected
                        ? "bg-[#798321]/10 font-bold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]"
                        : "text-slate-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 dark:text-neutral-500">({lang.name})</span>
                    </div>
                    {isSelected && <Check size={14} className="text-[#798321] dark:text-[#FFC107]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
