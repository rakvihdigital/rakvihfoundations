"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Program {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  students: string;
  image: string;
  description: string;

  courseDetails?: {
    overview: string;
    level: string;
    language: string;
    certificate: string;
    mentor: string;
    rating: number;
    reviews: number;
  };

  projects?: { id: number; project_name: string; description: string; }[];
  learning?: { id: number; title: string; }[];
  careers?: { id: number; title: string; }[];
  topics?: { id: number; topic: string; }[];
  syllabus?: { module: string; content: string; }[];
  faqs?: { question: string; answer: string; }[];
  reviews?: { id: number; student_name: string; rating: number; review: string; }[];
}

interface Props {
  open: boolean;
  onCloseAction: () => void;
  program: Program | null;
}

export default function ViewProgramModal({
  open,
  onCloseAction,
  program,
}: Props) {
  const [step, setStep] = useState(1);

  if (!open || !program) return null;

  const totalSteps = 9;

  const stepTitles = [
    "Overview",
    "Course Details",
    "Live Projects",
    "What You'll Learn",
    "Career Opportunities",
    "Course Syllabus",
    "Course Topics",
    "FAQs",
    "Student Reviews",
  ];

  const cardClass = "rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] p-5";
  const pillClass = "bg-[#6B7328]/10 dark:bg-[#6B7328]/20 rounded-2xl p-4 text-sm";
  const prevBtnClass = "px-6 py-2.5 text-xs border border-[#6B7328] text-[#6B7328] rounded-2xl hover:bg-[#F8FAF5]";
  const nextBtnClass = "px-8 py-2.5 text-xs bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white rounded-2xl font-medium";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] max-h-[92vh] overflow-hidden flex flex-col">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Program Details</h2>
            <p className="text-xs opacity-90 mt-0.5">{stepTitles[step - 1]}</p>
          </div>

          <div className="flex-1 max-w-xs mx-8">
            <div className="flex justify-between mb-1 text-xs font-medium">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <button onClick={onCloseAction} className="p-2 hover:bg-white/20 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row gap-5">
                <img
                  src={program.image}
                  alt={program.title}
                  className="h-44 w-44 rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {program.title}
                  </h1>
                  <span className="inline-block mt-2 rounded-full bg-[#6B7328]/10 px-3 py-1 text-xs font-semibold text-[#6B7328]">
                    {program.category}
                  </span>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    {program.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className={cardClass}>
                  <p className="text-[10px] text-[#6B7280]">Duration</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{program.duration}</p>
                </div>
                <div className={cardClass}>
                  <p className="text-[10px] text-[#6B7280]">Price</p>
                  <p className="text-base font-bold text-[#6B7328] mt-0.5">₹{program.price}</p>
                </div>
                <div className={cardClass}>
                  <p className="text-[10px] text-[#6B7280]">Students</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{program.students}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setStep(2)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 2: Course Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">Course Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {[
                    ["Overview", program.courseDetails?.overview],
                    ["Level", program.courseDetails?.level],
                    ["Language", program.courseDetails?.language],
                    ["Certificate", program.courseDetails?.certificate],
                    ["Mentor", program.courseDetails?.mentor],
                    ["Rating", `⭐ ${program.courseDetails?.rating || 0}`],
                    ["Reviews", program.courseDetails?.reviews],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] text-[#6B7280]">{label}</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm mt-0.5">{value || "-"}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(3)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 3: Live Projects */}
          {step === 3 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">Live Projects</h2>
                {program.projects?.length ? (
                  <div className="space-y-2">
                    {program.projects.map((p, i) => (
                      <div key={i} className={`flex items-center gap-3 ${pillClass}`}>
                        <div className="h-6 w-6 rounded-full bg-[#6B7328] text-white flex items-center justify-center text-xs">✓</div>
                        <span>{p.project_name}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No projects</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(4)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 4: What You'll Learn */}
          {step === 4 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">What You'll Learn</h2>
                {program.learning?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {program.learning.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 ${pillClass}`}>
                        <div className="h-6 w-6 rounded-full bg-[#FFC107] text-black flex items-center justify-center text-xs">✓</div>
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No learning topics</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(5)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 5: Career Opportunities */}
          {step === 5 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">Career Opportunities</h2>
                {program.careers?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {program.careers.map((c, i) => (
                      <div key={i} className={pillClass}>{c.title}</div>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No careers listed</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(4)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(6)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 6: Course Syllabus */}
          {step === 6 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">Course Syllabus</h2>
                {program.syllabus?.length ? (
                  <div className="space-y-4">
                    {program.syllabus.map((s, i) => (
                      <div key={i} className={pillClass}>
                        <div className="font-semibold text-sm mb-1">{s.module}</div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{s.content}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No syllabus</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(5)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(7)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 7: Course Topics */}
          {step === 7 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">Course Topics</h2>
                {program.topics?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {program.topics.map((t, i) => (
                      <span key={i} className="px-3 py-1 text-xs bg-[#6B7328]/10 dark:bg-[#6B7328]/20 border border-[#6B7328]/30 rounded-full">{t.topic}</span>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No topics</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(6)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(8)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 8: FAQs */}
          {step === 8 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">FAQs</h2>
                {program.faqs?.length ? (
                  <div className="space-y-4">
                    {program.faqs.map((f, i) => (
                      <div key={i} className={pillClass}>
                        <p className="font-medium text-sm">Q{i + 1}. {f.question}</p>
                        <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">{f.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No FAQs</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(7)} className={prevBtnClass}>← Prev</button>
                <button onClick={() => setStep(9)} className={nextBtnClass}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 9: Student Reviews */}
          {step === 9 && (
            <div className="space-y-5">
              <div className={cardClass}>
                <h2 className="text-sm font-semibold text-[#6B7328] mb-4">Student Reviews</h2>
                {program.reviews?.length ? (
                  <div className="space-y-5">
                    {program.reviews.map((r, i) => (
                      <div key={i} className={pillClass}>
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-sm">{r.student_name}</p>
                          <div className="flex text-yellow-400 text-lg">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs mt-3 text-gray-600 dark:text-gray-300">{r.review}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-[#6B7280]">No reviews yet</p>}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(8)} className={prevBtnClass}>← Prev</button>
                <button onClick={onCloseAction} className={nextBtnClass}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
