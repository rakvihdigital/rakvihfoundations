import type { Metadata } from "next";
import Link from "next/link";
import { 
  Heart, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Building2, 
  FileText 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Transparency & Impact Stories Blog | RAKVIH Foundation",
  description: "Read transparent breakdown reports, CSR item-level case studies, child education stories, and photo dispatches from RAKVIH Foundation drives in Bengaluru.",
  keywords: [
    "NGO transparency blog",
    "CSR item level reporting Bangalore",
    "child education support Bangalore",
    "meal drive photo story",
    "80G tax benefit donation guide",
    "RAKVIH Foundation blog",
  ],
};

const foundationPosts = [
  {
    id: 1,
    title: "Where Does Your Donation Really Go? A Transparent Breakdown",
    slug: "where-does-your-donation-really-go-transparent-breakdown",
    category: "Financial Transparency",
    readTime: "5 min read",
    date: "August 2026",
    tagIcon: ShieldCheck,
    excerpt:
      "Most non-profits pool funds into vague administrative buckets. Here is an open audit of how every ₹90 donated to RAKVIH is mapped directly to grains, vegetables, packing, and on-ground logistics.",
  },
  {
    id: 2,
    title: "How CSR Budgets Can Achieve Item-Level Impact Reporting",
    slug: "how-csr-budgets-achieve-item-level-impact-reporting",
    category: "Corporate Partnerships",
    readTime: "6 min read",
    date: "August 2026",
    tagIcon: Building2,
    excerpt:
      "Why Fortune 500 CSR teams are moving away from year-end summary PDF reports toward real-time verifiable photographic ledger systems.",
  },
  {
    id: 3,
    title: "5 Ways to Support Child Education in Bengaluru This Year",
    slug: "5-ways-to-support-child-education-bengaluru",
    category: "Education Outreach",
    readTime: "4 min read",
    date: "July 2026",
    tagIcon: FileText,
    excerpt:
      "From notebook kit sponsorships and weekend tutoring to digital literacy bootcamps—practical pathways for individuals and corporate teams to help underprivileged children.",
  },
  {
    id: 4,
    title: "Inside a RAKVIH Foundation Meal Drive: Photo Story",
    slug: "inside-rakvih-foundation-meal-drive-photo-story",
    category: "Field Dispatches",
    readTime: "4 min read",
    date: "July 2026",
    tagIcon: Camera,
    excerpt:
      "A complete behind-the-scenes visual journey: from morning food preparation and hygiene checks to distribution across 3 urban shelter zones in Bengaluru.",
  },
];

export default function FoundationBlogPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8FAF0] text-[#1C2410] dark:bg-black dark:text-slate-100">
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-14 sm:pb-8 bg-[#1C2410] text-white">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#FFC107]/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#798321]/25 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/30 bg-[#FFC107]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FFC107]">
            Blogs 
          </span>

          <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Transparency & Impact Journal
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/80 sm:leading-relaxed">
            Detailed reports, verifiable photo dispatches, and CSR case studies detailing how your contributions create lasting change across Bengaluru.
          </p>
        </div>
      </section>

      {/* ============ ARTICLES GRID ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {foundationPosts.map((post) => {
            const Icon = post.tagIcon;
            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#798321]/40 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#798321]/10 px-3 py-1 text-xs font-bold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                      <Icon size={13} /> {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold leading-snug text-[#1C2410] transition-colors dark:text-white">
                    {post.title}
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium dark:border-zinc-800">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar size={12} /> {post.date}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* ============ FOOTER DONATE CTA ============ */}
        <div className="mt-16 rounded-3xl bg-[#798321] p-8 text-center text-white shadow-xl sm:p-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFC107]">
            Make a Direct Difference
          </span>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            Sponsor a Nutritious Meal Today
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs text-white/80 sm:text-sm leading-relaxed">
            ₹90 feeds one person with complete photo verification and donor acknowledgement. 80G tax exemptions apply.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/foundation/donate"
              className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-7 py-3 text-xs font-bold text-[#1C2410] shadow-md transition-transform hover:scale-105"
            >
              Donate ₹90 Now <Heart size={14} />
            </Link>
            <Link
              href="/foundation/csr"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Corporate CSR Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}