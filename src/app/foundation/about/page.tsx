"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

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
    // Renamed from "Community & Welfare (Others)" to match the SEO Content
    // Pack's Service Verticals list exactly ("Community & Welfare") — Section 11.
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

  // Set document title + meta description since this is a client component
  // and can't use Next.js's `metadata` export directly. If this route ever
  // gets a server wrapper, move SEO_TITLE / SEO_DESCRIPTION into a proper
  // `export const metadata` there instead.
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
    <div className="min-h-[100dvh] w-full bg-[#F8FAF0] text-slate-900 dark:bg-black dark:text-slate-100">

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
    
    {/* ADDED GET INVOLVED BADGE */}
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