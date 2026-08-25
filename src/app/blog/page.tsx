import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Calendar 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Career & Internship Insights Blog 2026 | RAKVIH Education",
  description: "Expert career guides, technical roadmaps, internship vs course comparisons, and student success tips to help you get hired in tech.",
  keywords: [
    "internship skills 2026",
    "internship vs certification",
    "web development internship roadmap",
    "AI ML internship roadmap",
    "home tuition guide Bangalore",
    "RAKVIH education blog",
  ],
};

const educationPosts = [
  {
    id: 1,
    title: "Top 8 Internship Skills Employers Look for in 2026",
    slug: "top-8-internship-skills-employers-look-for-2026",
    category: "Career Advice",
    readTime: "6 min read",
    date: "August 2026",
    featured: true,
    excerpt:
      "Hiring managers in 2026 prioritize hands-on problem solving, AI tool fluency, and real codebase experience over passive course certificates. Discover the exact 8 skills to build into your portfolio.",
    author: "RAKVIH Career Team",
  },
  {
    id: 2,
    title: "Internship vs Certification Course: Which Actually Gets You Hired?",
    slug: "internship-vs-certification-course-which-gets-you-hired",
    category: "Career Comparison",
    readTime: "5 min read",
    date: "August 2026",
    featured: false,
    excerpt:
      "Understand why 78% of recruiters filter out resumes that only list certificate courses and how verified live-project internships give you the real-world edge.",
    author: "Academic Mentorship Cell",
  },
  {
    id: 3,
    title: "How to Choose Between Web Development and Full Stack Internships",
    slug: "choose-between-web-development-and-full-stack-internships",
    category: "Tech Tracks",
    readTime: "7 min read",
    date: "August 2026",
    featured: false,
    excerpt:
      "A comprehensive guide breaking down frontend fundamentals vs end-to-end full-stack architectures to help college students pick the track that aligns with their career goals.",
    author: "Engineering Lead",
  },
  {
    id: 4,
    title: "AI & Machine Learning Internship Roadmap for Beginners",
    slug: "ai-machine-learning-internship-roadmap-beginners",
    category: "AI & Data Science",
    readTime: "8 min read",
    date: "July 2026",
    featured: false,
    excerpt:
      "Step-by-step roadmap from Python and linear algebra to model training, LLM integrations, and production deployment in modern ML pipelines.",
    author: "AI/ML Track Mentor",
  },
  {
    id: 5,
    title: "How Online Home Tuition Works: A Parent's Complete Guide",
    slug: "online-home-tuition-works-parents-guide",
    category: "Tuition & Academics",
    readTime: "5 min read",
    date: "July 2026",
    featured: false,
    excerpt:
      "How to choose between in-person home tutoring and live online 1-on-1 sessions, tutor screening standards, safety protocols, and transparent fee benchmarks.",
    author: "Academic Coordinator",
  },
];

export default function EducationBlogPage() {
  const featuredPost = educationPosts.find((p) => p.featured) || educationPosts[0];
  const regularPosts = educationPosts.filter((p) => p.id !== featuredPost.id);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-20 transition-colors duration-500">
        {/* ============ HERO SECTION ============ */}
        <section className="relative overflow-hidden py-12 lg:py-16 bg-[#F8FAF0] dark:bg-[#0a0a0a] border-b border-[#798321]/15 dark:border-neutral-800">
          <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#798321]/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#FFC107]/15 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#798321]/20 bg-[#798321]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#798321] dark:border-[#FFC107]/30 dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
              Career & Tech Insights
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#24310F] sm:text-5xl dark:text-white">
              The RAKVIH <span className="text-[#798321] dark:text-[#FFC107]">Education Blog</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base dark:text-neutral-300">
              Actionable guides on internships, technology roadmaps, career preparation, and personalized tutoring to accelerate your professional growth.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pt-12">
          {/* ============ FEATURED POST CARD ============ */}
          <div className="mb-14">
            <div className="group relative overflow-hidden rounded-3xl border border-[#798321]/20 bg-gradient-to-br from-[#F8FAF1] to-white p-8 shadow-sm transition-all duration-300 hover:border-[#798321]/50 hover:shadow-xl dark:border-neutral-800 dark:from-[#111111] dark:to-[#0a0a0a] md:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#798321] px-3.5 py-1 text-xs font-bold text-white dark:bg-[#FFC107] dark:text-black">
                  Featured
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">
                  {featuredPost.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400">
                  <Clock size={12} /> {featuredPost.readTime}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black text-[#24310F] transition-colors sm:text-3xl dark:text-white">
                {featuredPost.title}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base dark:text-neutral-300">
                {featuredPost.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200/60 pt-6 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-neutral-400">
                  <Calendar size={14} /> {featuredPost.date} &nbsp;·&nbsp; By {featuredPost.author}
                </div>
              </div>
            </div>
          </div>

          {/* ============ POSTS GRID ============ */}
          <div className="mb-16">
            <h3 className="mb-6 text-xl font-black text-[#24310F] dark:text-white">
              Latest Articles
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#798321]/40 hover:shadow-lg dark:border-neutral-800 dark:bg-[#0e0e0e]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400">
                      <span className="rounded-md bg-[#798321]/10 px-2.5 py-1 font-bold text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107]">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>

                    <h4 className="mt-4 text-lg font-bold text-[#24310F] transition-colors dark:text-white">
                      {post.title}
                    </h4>

                    <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-neutral-400">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium dark:border-neutral-800">
                    <span className="text-gray-400 dark:text-neutral-500">{post.date}</span>
                    <span className="text-gray-400 dark:text-neutral-500">By {post.author}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ============ NEWSLETTER / PROGRAM CTA ============ */}
          <div className="rounded-3xl bg-gradient-to-r from-[#24310F] via-[#2F3E14] to-[#798321] p-8 text-center text-white shadow-xl sm:p-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFC107]">
              Career Readiness
            </span>
            <h3 className="mt-2 text-2xl font-black sm:text-3xl">
              Ready to Turn Skills Into Job Offers?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-xs text-gray-200 sm:text-sm leading-relaxed">
              Explore RAKVIH's 8 industry tracks featuring real project building, verified certificates, and direct placement assistance.
            </p>
            <div className="mt-6">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-7 py-3 text-xs font-bold text-black shadow-md transition-transform hover:scale-105"
              >
                Browse Internship Programs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}