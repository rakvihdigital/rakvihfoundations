// src/app/foundation/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  UtensilsCrossed,
  GraduationCap,
  HeartPulse,
  Users,
  ArrowRight,
  ArrowUpRight,
  Quote,
  ShieldCheck,
  HeartHandshake,
  Camera,
  Video,
  BadgeCheck,
  ChevronDown,
  HandHeart,
} from "lucide-react";

type CauseCategory = {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
};

type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
};

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const slides = [
  { src: "/banner3.jpeg", alt: "Healthcare outreach camp organized by Rakvih Foundation" },
  { src: "/banner4.png", alt: "Volunteers serving the community with Rakvih Foundation" },
  { src: "/banner1.png", alt: "Community meal distribution by Rakvih Foundation" },
  { src: "/banner2.jpg", alt: "Children supported through Rakvih Foundation education programs" },
];

const causeIcons = [UtensilsCrossed, GraduationCap, HeartPulse, Users, HeartHandshake];

const passbook = [
  { label: "Meals served", value: "48,200+" },
  { label: "Families supported", value: "3,150+" },
  { label: "Active volunteers", value: "210" },
  { label: "Cities reached", value: "9" },
];

const steps = [
  {
    n: "01",
    title: "Choose what you're funding",
    text: "Pick a cause and see the exact item and its cost — a meal, a set of books, a health checkup.",
  },
  {
    n: "02",
    title: "Sponsor it directly",
    text: "Your contribution is tied to that item. Nothing pools into a vague general fund.",
  },
  {
    n: "03",
    title: "Get proof it reached someone",
    text: "We record and share what was delivered, so you know your ₹90 became a meal, not a metric.",
  },
];

const transparencyPillars = [
  {
    icon: BadgeCheck,
    title: "Donor Recognition",
    text: "Every donation is acknowledged with the donor's name, creating a transparent, traceable record of contributions.",
  },
  {
    icon: Camera,
    title: "Photo Documentation",
    text: "Every contribution is backed with photo proof, showing the true, real-world impact of your support.",
  },
  {
    icon: Video,
    title: "Video Documentation",
    text: "Transparency in every contribution is shown through video, highlighting the real difference your support makes.",
  },
];

const faqs = [
  {
    q: "Who is Rakvih Foundation?",
    a: "Rakvih Foundation is a registered non-profit working across India to alleviate hunger and uplift communities through food, education, healthcare, and livelihood programmes. So far we've served 48,200+ meals and worked with 3,150+ families across 9 cities, with 210 active volunteers on the ground.",
  },
  {
    q: "Why donate to Rakvih Foundation?",
    a: "We operate with full transparency and focus on fast, on-time delivery of food and aid to those who need it most. Every donation is backed with photo and video proof and donor name recognition, so your contribution reaches the right hands quickly and creates real, lasting impact.",
  },
  {
    q: "Where does my donation actually go?",
    a: "Every contribution goes directly toward a specific, priced item within our food, education, healthcare, or livelihood programmes — never into a vague general fund. We back each donation with documentation so you can see exactly what it paid for.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Yes. Rakvih Foundation is 80G certified, so your donations are eligible for tax exemption under Section 80G of the Income Tax Act. You'll receive an official receipt you can use to claim your deduction.",
  },
  {
    q: "What causes can I support?",
    a: "You can donate toward feeding the homeless, education for underprivileged children, healthcare camps, orphan care, and livelihood programmes — with more causes added as we grow. Each one shows the exact item and cost before you give.",
  },
  {
    q: "How do I know my donation made an impact?",
    a: "For eligible donations, you receive photo proof, video documentation, and regular updates as part of our commitment to 100% transparency — so you can see, not just trust, the difference you made.",
  },
  {
    q: "How can I get involved beyond donating?",
    a: "You can join us as a volunteer — helping serve meals, support children's education, assist patients, distribute essentials, or take part in tree-planting drives. Visit our Volunteer page to get started.",
  },
];

// Reusable scroll-in motion variants
const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, margin: "-30px" };

type Props = {
  causes: CauseCategory[];
  gallery: GalleryItem[];
};

export default function HomeClient({ causes, gallery }: Props) {
  const [active, setActive] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const id = setInterval(() => setActive((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const galleryPreview =
    gallery.length > 0
      ? gallery
      : slides.map((s, i) => ({ id: i, title: s.alt, category: "General", image_url: s.src, created_at: "" }));

  return (
    <div
      className={`min-h-screen bg-[#F8FAF0] text-[#1C2410] dark:bg-black dark:text-slate-100 ${display.variable} ${body.variable}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Rakvih Foundation
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/90 md:flex">
            <Link href="/foundation/causes" className="hover:text-[#FFC107] transition">Causes</Link>
            <Link href="/foundation/gallery" className="hover:text-[#FFC107] transition">Gallery</Link>
            <Link href="/csr" className="hover:text-[#FFC107] transition">Partner With Us</Link>
            <Link href="/foundation/volunteer" className="hover:text-[#FFC107] transition">Volunteer</Link>
            <Link href="/contact" className="hover:text-[#FFC107] transition">Contact</Link>
          </nav>
          <Link
            href="/foundation/donate"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-5 py-2.5 text-xs font-bold text-[#1C2410] shadow-lg transition hover:bg-white"
          >
            Donate Now <Heart size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        <div className="relative z-10 flex h-full max-w-7xl flex-col justify-end mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#FFC107]"
          >
            Direct giving, item by item
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl text-4xl font-semibold leading-[1.05] text-white sm:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every plate has a name behind it.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-xl text-sm text-white/85 sm:text-base"
          >
            We don't ask you to give to a fund. You choose the meal, the schoolbook, or
            the checkup — see exactly what it costs, and know it reached someone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/foundation/causes"
              className="inline-flex items-center gap-2 rounded-full bg-[#798321] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-[#647019]"
            >
              Sponsor a Meal <ArrowRight size={16} />
            </Link>
            <Link
              href="/foundation/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              See Our Work
            </Link>
          </motion.div>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-[#FFC107]" : "w-3 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="absolute bottom-10 right-6 z-10 hidden max-w-[220px] rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md sm:block lg:right-12"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">Today's cost</span>
          <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            ₹90
          </p>
          <p className="mt-1 text-[11px] text-white/70">feeds one person, one meal, fully traceable.</p>
        </motion.div>
      </section>

      {/* Impact Passbook Strip */}
      <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between border-b border-dashed border-slate-200 pb-4 dark:border-zinc-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Impact Passbook
              </span>
              <h2 className="text-lg font-bold text-[#1C2410] dark:text-white" style={{ fontFamily: "var(--font-display)" }}>
                What your giving has done so far
              </h2>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 sm:inline-flex">
              <ShieldCheck size={12} /> Audited FY 24–25
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {passbook.map((row, i) => (
              <motion.div
                key={row.label}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col"
              >
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {row.label}
                </span>
                <span
                  className="mt-1 text-2xl font-bold text-[#798321] dark:text-[#FFC107] sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mission (Why we started) */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          
          {/* BULLETPROOF CUSTOM MOTION */}
          <motion.div
            initial={{ opacity: 0, x: -50, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            // Added w-full so it properly expands inside the grid column
            className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          >
            <motion.div
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full"
            >
              <Image 
                src="/banner9.png" 
                alt="Rakvih Foundation volunteers at work" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.5s] hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 hover:opacity-0" />
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
              Why we started
            </span>
            <h2
              className="mt-3 text-3xl font-semibold leading-tight text-[#1C2410] dark:text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We got tired of vague donation buttons.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Rakvih Foundation began with a simple frustration: giving money and never
              knowing where it went. So we built something narrower on purpose — every
              cause is broken down into priced, individual items. When you give, you're
              not funding an initiative. You're feeding one more person, buying one more
              schoolbook, covering one more checkup.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              It's slower to scale this way. We think it's worth it.
            </p>
            <Link
              href="/foundation/causes"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#798321] hover:underline dark:text-[#FFC107]"
            >
              See what's funded right now <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Causes Grid */}
      <section className="bg-white py-14 dark:bg-zinc-950 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="mb-8 max-w-2xl"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
              Where it goes
            </span>
            <h2
              className="mt-3 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Four causes, one clear rule: you see the cost before you give.
            </h2>
          </motion.div>

          {causes.length === 0 ? (
            <p className="text-sm text-slate-500">Causes will appear here once added.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {causes.map((cause, i) => {
                const Icon = causeIcons[i % causeIcons.length];
                return (
                  <motion.div
                    key={cause.id}
                    variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      href={`/foundation/causes/${cause.id}`}
                      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-[#F8FAF0] p-6 transition hover:border-[#798321]/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#FFC107]/40"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                        <Icon size={20} />
                      </div>
                      <h3
                        className="mt-4 text-base font-bold text-[#1C2410] dark:text-white"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {cause.title}
                      </h3>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {cause.description ?? "Support this cause directly."}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#798321] group-hover:gap-2 transition-all dark:text-[#FFC107]">
                        Donate to this cause <ArrowRight size={13} />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mb-8 max-w-2xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
            How giving works
          </span>
          <h2
            className="mt-3 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three steps. No black box in between.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <span
                className="text-5xl font-bold text-[#798321]/15 dark:text-[#FFC107]/15"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.n}
              </span>
              <h3
                className="mt-2 text-base font-bold text-[#1C2410] dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-white py-14 dark:bg-zinc-950 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
                On the ground
              </span>
              <h2
                className="mt-3 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Recent moments from the field
              </h2>
            </motion.div>
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                href="/foundation/gallery"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#798321] hover:underline dark:text-[#FFC107]"
              >
                View full gallery <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
          >
            {galleryPreview.slice(0, 12).map((item, i) => (
              <motion.div
                key={item.id}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                whileHover={{ y: -3 }}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Commitment to Transparency */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mb-8 max-w-2xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
            Accountability, not promises
          </span>
          <h2
            className="mt-3 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our Commitment to Transparency
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {transparencyPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                  <Icon size={22} />
                </div>
                <h3
                  className="mt-5 text-base font-bold text-[#1C2410] dark:text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {pillar.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-dashed border-[#798321]/30 bg-[#798321]/5 p-6 dark:border-[#FFC107]/30 dark:bg-[#FFC107]/5 sm:flex-row sm:items-center"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
              Education · 2025
            </span>
            <p className="mt-1 text-sm font-semibold text-[#1C2410] dark:text-white">
              See how school-support donations were documented this year.
            </p>
          </div>
          <Link
            href="/foundation/causes"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#798321] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#647019] dark:bg-[#FFC107] dark:text-[#1C2410] dark:hover:bg-white"
          >
            Explore Now <ArrowUpRight size={13} />
          </Link>
        </motion.div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
        >
          <Quote className="mx-auto mb-6 text-[#798321]/30 dark:text-[#FFC107]/30" size={36} />
          <p
            className="text-xl font-medium italic leading-relaxed text-[#1C2410] dark:text-white sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            "I don't give to Rakvih because it feels good. I give because I can see the
            exact line item my money paid for. That's rare."
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
            — A monthly donor
          </p>
        </motion.div>
      </section>

      {/* Become a Volunteer */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-[#798321] p-8 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#FFC107]/20" />

          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto,1fr,auto]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
              <HandHeart size={26} />
            </div>

            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                Give your time, not just your money
              </span>
              <h2
                className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Become a Volunteer
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                We invite you to engage with us and support our mission to impact our
                community positively. Your involvement helps us provide nutritious meals
                to the homeless, distribute essential items like eggs and milk to needy
                families, support children's education, aid young hospital patients,
                donate blankets during cold weather, and organise tree-planting events
                for a greener future. Get involved today and make a difference.
              </p>
            </div>

            <Link
              href="/foundation/volunteer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FFC107] px-6 py-3.5 text-sm font-bold text-[#1C2410] shadow-xl transition hover:bg-white"
            >
              Become a Volunteer <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CSR Strip */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#1C2410] p-8 sm:flex-row sm:items-center sm:p-12"
        >
          <div className="max-w-lg">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
              For companies
            </span>
            <h2
              className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Run your CSR budget through a model that reports back.
            </h2>
            <p className="mt-3 text-sm text-white/70">
              We give partners item-level reporting, not a year-end summary PDF.
            </p>
          </div>
          <Link
            href="/csr"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FFC107] px-6 py-3.5 text-sm font-bold text-[#1C2410] shadow-xl transition hover:bg-white"
          >
            Propose a Partnership <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-white pt-14 pb-16 dark:bg-zinc-950 overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#798321] dark:text-[#FFC107]">
              Questions
            </span>
            <h2
              className="mt-3 text-3xl font-semibold text-[#1C2410] dark:text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about donating to Rakvih Foundation.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={faq.q}
                  variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAF0] dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-[#1C2410] dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#798321] transition-transform duration-300 dark:text-[#FFC107] ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link
              href="/foundation/donate"
              className="inline-flex items-center gap-2 rounded-full bg-[#798321] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-[#647019] dark:bg-[#FFC107] dark:text-[#1C2410] dark:hover:bg-white"
            >
              Donate Now <Heart size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}