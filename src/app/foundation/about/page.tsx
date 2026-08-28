"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fraunces } from "next/font/google";
import {
  Heart,
  Utensils,
  Baby,
  GraduationCap,
  Calendar,
  Gift,
  Sparkles,
  ShieldCheck,
  Globe2,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  Award 
} from "lucide-react";

// Setup matching website font
const display = Fraunces({ 
  subsets: ["latin"], 
  weight: ["500", "600", "700", "800", "900"], 
  variable: "--font-display" 
});

// ── SEO copy (per RAKVIH SEO Content Pack, Section 11 — /foundation/about) ──
const SEO_TITLE =
  "About RAKVIH Foundation | Meals, Education & Animal Welfare — Bengaluru";
const SEO_DESCRIPTION =
  "RAKVIH Foundation delivers meals, child care, education, orphan support, animal welfare and livelihood programs across Bengaluru with 100% transparent, photo-verified impact. Learn our mission.";
const CANONICAL_URL = "https://www.rakvihfoundation.org.in/foundation/about";

// ── NGO / NonProfit schema (per Technical SEO Checklist, item 14) ──
const ngoSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "RAKVIH Foundation",
  url: "https://www.rakvihfoundation.org.in/foundation",
  description:
    "RAKVIH Foundation is a registered non-profit working across India to alleviate hunger and uplift communities through food, education, healthcare and livelihood programmes.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "238, 2nd Main, 2nd Cross, Attur Layout, Yelahanka",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560064",
    addressCountry: "IN",
  },
  areaServed: "IN",
  knowsAbout: [
    "child welfare NGO",
    "animal welfare NGO Bengaluru",
    "education sponsorship",
    "grassroots community welfare",
  ],
};

const serviceCategories = [
  {
    title: "Food & Sustenance Programs",
    icon: Utensils,
    description: "Ensuring no one sleeps hungry—providing nutritious meals to underprivileged humans, strays, and animals.",
    services: [
      "Feed a Homeless Person",
      "Fight Thirst. Share Water",
      "Chicken Biryani",
      "Feed a Stray Dog",
      "Thaali Meals",
      "Egg Biryani",
      "Veg Biryani",
      "Cow Feeding",
    ],
  },
  {
    title: "Child Care & Growth",
    icon: Baby,
    description: "Nurturing the future of our society with nutritional support, essentials, mobility, and care kits.",
    services: [
      "Egg & Milk",
      "Child Care Kit",
      "Gift for Children",
      "A Pair of Slippers",
      "Mother Care Kit",
      "Bicycle",
      "Banana & Milk",
      "Hygiene Kit",
      "Mosquito Net",
    ],
  },
  {
    title: "Education & Literacy",
    icon: GraduationCap,
    description: "Empowering young minds through learning resources and eradicating barriers to school retention.",
    services: [
      "School Bag",
      "Educate a Child",
      "Stop Child Labour",
    ],
  },
  {
    title: "Special Events & Joy",
    icon: Calendar,
    description: "Spreading smiles on special occasions and fostering kindness toward all living beings and communities.",
    services: [
      "Birthday Cake",
      "Virtual Cake Cutting Celebration",
      "Bird House",
      "Water Bowl For Birds",
      "Transgender Kit",
      "Birthday Celebration",
      "Save Lives Through Kindness",
      "Empower Dreams Through Livelihood",
    ],
  },
  {
    title: "Community & Welfare",
    icon: Heart,
    description: "Providing essential relief kits, medical aids, livelihood equipment, and comprehensive orphan support.",
    services: [
      "Blanket",
      "Grocery Kit",
      "Plant a Tree",
      "Wheelchair",
      "Give a Napkin",
      "Tailoring Machine",
      "Hearing Aid",
      "Dog Collar",
      "Support An Orphanage",
      "Our Orphanage",
    ],
  },
];

const coreValues = [
  { icon: ShieldCheck, title: "Total Transparency", desc: "100% accountable impact tracked with photo verifications and logs." },
  { icon: Globe2, title: "Grassroots Reach", desc: "Direct distribution across local communities in Bengaluru and beyond." },
  { icon: Users, title: "Community First", desc: "No intermediaries—built by real humans dedicated to real change." },
];

export default function AboutPage() {
  const [activeCategory, setActiveCategory] = useState(0);

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

  return (
    <div className={`min-h-[100dvh] w-full bg-[#F8FAF0] text-slate-900 dark:bg-black dark:text-slate-100 ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>

      {/* NGO / NonProfit schema for search rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ngoSchema) }}
      />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-b from-[#24310F] via-[#2F3E14] to-[#F8FAF0] text-white dark:from-black dark:via-zinc-950 dark:to-black">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#798321]/30 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-[#FFC107]/20 blur-[120px] pointer-events-none"
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FFC107] backdrop-blur-md uppercase shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> About RAKVIH Foundation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Empowering Lives Through{" "}
            <span className="bg-gradient-to-r from-[#FFC107] via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Compassion & Action
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base"
          >
            RAKVIH Foundation is dedicated to building sustainable futures — feeding the hungry, educating children,
            caring for animals, and uplifting marginalised communities across society. Founded on the belief that
            collective empathy can solve structural disparities, we coordinate direct-impact drives spanning daily meal
            provisions, child welfare kits, educational sponsorships, and animal care.
          </motion.p>
        </div>
      </section>

      {/* ============ WHO WE ARE / MISSION ============ */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#798321]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              <Target className="h-4 w-4" /> Our Mission & Vision
            </div>
            <h2 className="text-2xl font-extrabold text-[#24310F] dark:text-white sm:text-3xl">
              Whats Sets Us Apart
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
              Founded on the belief that collective empathy can solve structural disparities, RAKVIH
              Foundation coordinates direct-impact drives as a grassroots NGO in Bengaluru. From daily
              meal provisions and child welfare kits to education sponsorship, animal welfare
              initiatives, and orphan support, our holistic community welfare programs cater to every
              tier of community wellbeing.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
              {coreValues.map((v) => (
                <div key={v.title} className="rounded-2xl border border-slate-900/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
                  <v.icon className="h-5 w-5 text-[#798321] dark:text-[#FFC107] mb-2" />
                  <h4 className="text-xs font-bold text-[#24310F] dark:text-white">{v.title}</h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-slate-900/10 bg-gradient-to-br from-[#24310F] to-[#798321] p-8 text-white shadow-xl dark:border-white/10"
          >
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#FFC107]/20 blur-3xl pointer-events-none" />
            <h3 className="text-xl font-bold text-[#FFC107]">Our Comprehensive Scope</h3>
            <p className="mt-2 text-xs text-slate-200 leading-relaxed">
              We operate across multi-disciplinary pillars ensuring comprehensive support structures. Explore our full spectrum of active service verticals below.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Food & Meals", "Child Care", "Education", "Orphan Support", "Animal Welfare", "Livelihood"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm border border-white/15">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ LEADERSHIP & CREDENTIALS ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 border-t border-slate-200 dark:border-zinc-800 pt-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          
          {/* Left Side: Our Director Profile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex"
          >
            <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-zinc-800 dark:bg-[#0d0d0d] flex flex-col">
              
              {/* Header section remains aligned to the left */}
              <div className="mb-6 border-b border-slate-100 pb-4 dark:border-zinc-800">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFC107]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFC107] mb-3">
                  <Users className="h-3.5 w-3.5" /> Leadership
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white relative pl-3">
                  <span className="absolute left-0 top-[10%] h-[80%] w-[3px] rounded-sm bg-[#FFC107]"></span>
                  Our Director
                </h3>
              </div>
              
              {/* Content centered to fix mobile right-spacing issues */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-full bg-white ring-4 ring-[#FFC107]/40 shadow-xl mb-4">
                  <img 
                    src="/director1.png" 
                    alt="Vijay Kumar" 
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">Vijay Kumar</h3>
                <p className="text-xs sm:text-sm font-semibold text-[#798321] dark:text-[#FFC107] mb-4">Director & HR Strategist</p>
                
                {/* Multi-Social Icons Row */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  {/* LinkedIn */}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC107] text-[#111] transition hover:scale-105 hover:bg-yellow-400 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC107] text-[#111] transition hover:scale-105 hover:bg-yellow-400 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC107] text-[#111] transition hover:scale-105 hover:bg-yellow-400 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.76-6.985 6.138C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.204 4.358 1.76 6.78 6.138 6.985 1.28.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.76 6.985-6.138.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.203-4.358-1.76-6.78-6.138-6.985-1.28-.058-1.688-.072-4.948-.072zm0 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zm0 10.162A4.001 4.001 0 1 1 12 7.999a4.001 4.001 0 0 1 0 8.002zm3.963-9.525a1.44 1.44 0 1 0 0-2.881 1.44 1.44 0 0 0 0 2.881z"/>
                    </svg>
                  </a>
                  {/* Google */}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC107] text-[#111] transition hover:scale-105 hover:bg-yellow-400 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12.001 9.803v4.46h5.837c-.244 1.932-2.316 5.658-5.837 5.658-3.513 0-6.38-2.92-6.38-6.52s2.867-6.52 6.38-6.52c1.996 0 3.332.85 4.095 1.583l3.39-3.267C17.545 3.328 15.021 2 12.001 2 6.478 2 2 6.478 2 12s4.478 10 10.001 10c5.772 0 9.615-4.062 9.615-9.789 0-.663-.07-1.18-.17-1.703h-9.445z"/>
                    </svg>
                  </a>
                </div>

                {/* Text made slightly bigger (text-[13px]) to perfectly balance the bottom section */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400 mt-auto px-2">
                  Director, HR, HR Strategist, HR Outsourcing, Recruitment Service, Talent Acquisition, Vendor Empanelment management.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Certifications & Credentials */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 flex flex-col"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#798321]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] mb-2">
                <Award className="h-3.5 w-3.5" /> Certifications
              </div>
              <h2 className="text-xl font-extrabold text-[#24310F] dark:text-white sm:text-2xl mb-2">
                Credentials & Compliance
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                We are committed to delivering quality-driven, compliant, and globally recognized solutions. Our certifications reflect our dedication to excellence and regulatory compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              
              {/* ISO Certification */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-[#0d0d0d] flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent transition-all duration-500 group-hover:w-full"></div>
                <div className="flex flex-col items-center text-center">
                  <svg className="w-14 h-14 mb-3 drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#F8C210" />
                        <stop offset="100%" stopColor="#B8860B" />
                      </linearGradient>
                    </defs>
                    <path d="M25,85 L15,100 L35,92 L50,100 L65,92 L85,100 L75,85 Z" fill="#B8860B" />
                    <circle cx="50" cy="45" r="40" fill="url(#gold)" stroke="#FFF" strokeWidth="2"/>
                    <circle cx="50" cy="45" r="32" fill="none" stroke="#FFF" strokeWidth="1.5" strokeDasharray="4,4"/>
                    <text x="50" y="45" fontFamily="Arial" fontSize="20" fontWeight="900" fill="#111" textAnchor="middle">ISO</text>
                    <text x="50" y="60" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="#111" textAnchor="middle">9001:2015</text>
                  </svg>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">ISO 9001:2015</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Demonstrating our commitment to maintaining an internationally recognized Quality Management System.</p>
                </div>
              </div>

              {/* Startup India */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-[#0d0d0d] flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent transition-all duration-500 group-hover:w-full"></div>
                <div className="flex flex-col items-center text-center">
                  <svg className="w-14 h-14 mb-3 drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25,85 L15,100 L35,92 L50,100 L65,92 L85,100 L75,85 Z" fill="#B8860B" />
                    <circle cx="50" cy="45" r="40" fill="url(#gold)" stroke="#FFF" strokeWidth="2"/>
                    <circle cx="50" cy="45" r="32" fill="none" stroke="#FFF" strokeWidth="1.5" strokeDasharray="4,4"/>
                    <path d="M35,60 L45,45 L55,50 L65,30 L60,30 L55,45 L45,40 L35,55 Z" fill="#111" />
                    <text x="50" y="28" fontFamily="Arial" fontSize="11" fontWeight="900" fill="#111" textAnchor="middle">STARTUP</text>
                    <text x="50" y="70" fontFamily="Arial" fontSize="11" fontWeight="900" fill="#111" textAnchor="middle">INDIA</text>
                  </svg>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Startup India</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Officially recognized under the Government of India's initiative for our innovation-driven approach.</p>
                </div>
              </div>

              {/* IEC */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-[#0d0d0d] flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent transition-all duration-500 group-hover:w-full"></div>
                <div className="flex flex-col items-center text-center">
                  <svg className="w-14 h-14 mb-3 drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25,85 L15,100 L35,92 L50,100 L65,92 L85,100 L75,85 Z" fill="#B8860B" />
                    <circle cx="50" cy="45" r="40" fill="url(#gold)" stroke="#FFF" strokeWidth="2"/>
                    <circle cx="50" cy="45" r="32" fill="none" stroke="#FFF" strokeWidth="1.5" strokeDasharray="4,4"/>
                    <circle cx="50" cy="45" r="18" fill="none" stroke="#111" strokeWidth="2"/>
                    <path d="M32,45 Q50,20 68,45 Q50,70 32,45 Z" fill="none" stroke="#111" strokeWidth="2"/>
                    <line x1="32" y1="45" x2="68" y2="45" stroke="#111" strokeWidth="2"/>
                    <text x="50" y="72" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#111" textAnchor="middle">IEC</text>
                  </svg>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Import Export Code</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Authorized to conduct international trade and global business operations through a valid IEC.</p>
                </div>
              </div>

              {/* HIPAA */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-[#0d0d0d] flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-[#FFC107] to-transparent transition-all duration-500 group-hover:w-full"></div>
                <div className="flex flex-col items-center text-center">
                  <svg className="w-14 h-14 mb-3 drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25,85 L15,100 L35,92 L50,100 L65,92 L85,100 L75,85 Z" fill="#B8860B" />
                    <circle cx="50" cy="45" r="40" fill="url(#gold)" stroke="#FFF" strokeWidth="2"/>
                    <circle cx="50" cy="45" r="32" fill="none" stroke="#FFF" strokeWidth="1.5" strokeDasharray="4,4"/>
                    <path d="M50,20 L68,26 L65,48 C63,60 50,68 50,68 C50,68 37,60 35,48 L32,26 Z" fill="#111" />
                    <path d="M46,35 L54,35 L54,42 L61,42 L61,48 L54,48 L54,55 L46,55 L46,48 L39,48 L39,42 L46,42 Z" fill="url(#gold)" />
                    <text x="50" y="75" fontFamily="Arial" fontSize="12" fontWeight="900" fill="#111" textAnchor="middle">HIPAA</text>
                  </svg>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">HIPAA Compliance</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Expertise in data privacy, security, and regulatory compliance protocols.</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ OUR SERVICES DIRECTORY ============ */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 border-t border-slate-200 dark:border-zinc-800">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#798321] dark:text-[#FFC107]">
            What We Do
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#24310F] dark:text-white sm:text-3xl">
            Our Core Service Verticals
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Select a category below to explore our detailed programs and service offerings.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {serviceCategories.map((cat, idx) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(idx)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all shadow-sm ${
                activeCategory === idx
                  ? "bg-[#798321] text-white shadow-md dark:bg-[#FFC107] dark:text-black"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-slate-300"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.title}
            </button>
          ))}
        </div>

        {/* Active Category Display Card */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 rounded-3xl border border-slate-900/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-black sm:p-8"
        >
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5 dark:border-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              {(() => {
                const IconComponent = serviceCategories[activeCategory].icon;
                return <IconComponent className="h-6 w-6" />;
              })()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#24310F] dark:text-white">
                {serviceCategories[activeCategory].title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {serviceCategories[activeCategory].description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories[activeCategory].services.map((serviceName) => (
              <div
                key={serviceName}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-[#798321]/30 hover:bg-slate-50 dark:border-zinc-800/80 dark:bg-zinc-900/50"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-[#798321] dark:text-[#FFC107] shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {serviceName}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ CALL TO ACTION ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#24310F] via-[#2F3E14] to-[#798321] p-8 text-center text-white shadow-xl sm:p-12">
          
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
            Get Involved
          </span>
          
          <h3 className="text-2xl font-extrabold sm:text-3xl">Want to Support Our Initiatives?</h3>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-200 sm:text-sm leading-relaxed">
            Whether you want to sponsor a meal, support a child's education, or volunteer at an upcoming drive, every
            contribution is tracked back to the person it helped.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/foundation/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-6 py-3 text-xs font-bold text-black shadow-lg transition-transform hover:scale-105"
            >
              Get in Touch <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}