"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { X, Save } from "lucide-react";

interface Props {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
}

export default function AddProgramModal({
  open,
  onCloseAction,
  onSuccessAction,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 9;

  const stepTitles = [
    "Basic Information",
    "Course Details",
    "Projects",
    "What You'll Learn",
    "Career Opportunities",
    "Course Syllabus",
    "Course Topics",
    "FAQs",
    "Student Reviews",
  ];

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
  title: "",
  category: "",
  description: "",
  duration: "",
  price: "",
  students: "",
  image: "",
  status: "Active",
});

  const [courseDetails, setCourseDetails] = useState({
    overview: "",
    level: "",
    language: "",
    certificate: "",
    mentor: "",
    rating: "",
    reviews: "",
  });

  const [projects, setProjects] = useState([{ project_name: "" }]);
  const [learning, setLearning] = useState([{ title: "" }]);
  const [careers, setCareers] = useState([{ title: "" }]);
  const [syllabus, setSyllabus] = useState([{ module_name: "", content: "" }]);
  const [topics, setTopics] = useState([{ moduleIndex: 0, topic: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [reviews, setReviews] = useState([{ student_name: "", rating: "", review: "" }]);

  if (!open) return null;

  async function saveProgram() {
    try {
      setLoading(true);

      let imageUrl = "";

      // Upload image
      if (imageFile) {
        const fileName = `programs/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("program-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          alert("Image upload failed");
          console.error(uploadError);
          return;
        }

        const { data } = supabase.storage
          .from("program-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // Save main program
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
          courseDetails,
        }),
      });

      if (!res.ok) {
        alert("Failed to save program");
        return;
      }

      const result = await res.json();
      const programId = result.program.id;

      // Save Projects
      for (const project of projects) {
        if (!project.project_name.trim()) continue;
        await fetch("/api/admin/programs/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_id: programId,
            project_name: project.project_name,
          }),
        });
      }

      // Save Learning
      for (const item of learning) {
        if (!item.title.trim()) continue;
        await fetch("/api/admin/programs/learning", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_id: programId,
            title: item.title,
          }),
        });
      }

      // Save Careers
      for (const career of careers) {
        if (!career.title.trim()) continue;
        await fetch("/api/admin/programs/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_id: programId,
            title: career.title,
          }),
        });
      }

      // Save Syllabus & Topics
      const syllabusIds: number[] = [];
      for (const item of syllabus) {
        if (!item.module_name.trim()) continue;

        const resSyl = await fetch("/api/admin/programs/syllabus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_id: programId,
            module_name: item.module_name,
            content: item.content,
          }),
        });

        const data = await resSyl.json();
        syllabusIds.push(data.id);
      }

      for (const item of topics) {
        if (!item.topic.trim()) continue;
        await fetch("/api/admin/programs/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            syllabus_id: syllabusIds[item.moduleIndex],
            topic: item.topic,
          }),
        });
      }

      // Save FAQs
      for (const faq of faqs) {
        if (!faq.question.trim()) continue;
        await fetch("/api/admin/programs/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_id: programId,
            question: faq.question,
            answer: faq.answer,
          }),
        });
      }

      // Save Reviews
      for (const item of reviews) {
        if (!item.student_name.trim()) continue;
        await fetch("/api/admin/programs/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_id: programId,
            student_name: item.student_name,
            rating: Number(item.rating),
            review: item.review,
          }),
        });
      }

      onSuccessAction();
      onCloseAction();

      // Reset form
setForm({
  title: "",
  category: "",
  description: "",
  duration: "",
  price: "",
  students: "",
  image: "",
  status: "Active",
});
      setImageFile(null);
      setCourseDetails({
        overview: "",
        level: "",
        language: "",
        certificate: "",
        mentor: "",
        rating: "",
        reviews: "",
      });
      setProjects([{ project_name: "" }]);
      setLearning([{ title: "" }]);
      setCareers([{ title: "" }]);
      setSyllabus([{ module_name: "", content: "" }]);
      setTopics([{ moduleIndex: 0, topic: "" }]);
      setFaqs([{ question: "", answer: "" }]);
      setReviews([{ student_name: "", rating: "", review: "" }]);
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] px-4 py-2.5 text-sm focus:border-[#6B7328] bg-white dark:bg-[#0F172A] dark:text-white";
  const labelClass = "block text-xs font-medium text-[#6B7280] mb-1";
  const addBtnClass =
    "rounded-2xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-5 py-2.5 text-white text-xs font-medium";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] max-h-[92vh] overflow-hidden flex flex-col">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Add New Program</h2>
            <p className="text-xs opacity-90 mt-0.5">{stepTitles[currentStep - 1]}</p>
          </div>

          <div className="flex-1 max-w-xs mx-8">
            <div className="flex justify-between mb-1 text-xs font-medium">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <button onClick={onCloseAction} className="p-2 hover:bg-white/20 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>PROGRAM TITLE</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="Full Stack Java"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CATEGORY</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputClass}
                    placeholder="Software Development"
                  />
                </div>
                <div>
                  <label className={labelClass}>DURATION</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className={inputClass}
                    placeholder="3 Months"
                  />
                </div>
              </div>
<div className="grid md:grid-cols-3 gap-4">
  <div>
    <label className={labelClass}>PRICE (₹)</label>
    <input
      type="number"
      value={form.price}
      onChange={(e) => setForm({ ...form, price: e.target.value })}
      className={inputClass}
      placeholder="4999"
    />
  </div>

  <div>
    <label className={labelClass}>STUDENTS</label>
    <input
      value={form.students}
      onChange={(e) => setForm({ ...form, students: e.target.value })}
      className={inputClass}
      placeholder="250+"
    />
  </div>

  <div>
    <label className={labelClass}>STATUS</label>
    <select
      value={form.status}
      onChange={(e) => setForm({ ...form, status: e.target.value })}
      className={inputClass}
    >
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>
</div>

              <div>
                <label className={labelClass}>PROGRAM IMAGE</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
                  className={inputClass}
                />
                {imageFile && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-32 rounded-2xl object-cover border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                  placeholder="Enter program description..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Course Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-[#6B7328]">Course Details</h3>
              <div>
                <label className={labelClass}>OVERVIEW</label>
                <textarea
                  rows={4}
                  value={courseDetails.overview}
                  onChange={(e) => setCourseDetails({ ...courseDetails, overview: e.target.value })}
                  className={inputClass}
                  placeholder="Enter course overview"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Level", key: "level", placeholder: "Beginner" },
                  { label: "Language", key: "language", placeholder: "English" },
                  { label: "Certificate", key: "certificate", placeholder: "Yes" },
                  { label: "Mentor", key: "mentor", placeholder: "John Doe" },
                  { label: "Rating", key: "rating", placeholder: "4.8" },
                  { label: "Reviews", key: "reviews", placeholder: "250" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input
                      value={courseDetails[key as keyof typeof courseDetails]}
                      onChange={(e) => setCourseDetails({ ...courseDetails, [key]: e.target.value })}
                      className={inputClass}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Projects */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">Projects</h3>
              {projects.map((project, index) => (
                <div key={index}>
                  <label className={labelClass}>Project {index + 1}</label>
                  <input
                    value={project.project_name}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[index].project_name = e.target.value;
                      setProjects(updated);
                    }}
                    className={inputClass}
                    placeholder="Project Name"
                  />
                </div>
              ))}
              <button type="button" onClick={() => setProjects([...projects, { project_name: "" }])} className={addBtnClass}>
                + Add Project
              </button>
            </div>
          )}

          {/* Step 4: What You'll Learn */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">What You'll Learn</h3>
              {learning.map((item, index) => (
                <div key={index}>
                  <label className={labelClass}>Learning {index + 1}</label>
                  <input
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...learning];
                      updated[index].title = e.target.value;
                      setLearning(updated);
                    }}
                    className={inputClass}
                    placeholder="Enter learning topic"
                  />
                </div>
              ))}
              <button type="button" onClick={() => setLearning([...learning, { title: "" }])} className={addBtnClass}>
                + Add Learning
              </button>
            </div>
          )}

          {/* Step 5: Career Opportunities */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">Career Opportunities</h3>
              {careers.map((career, index) => (
                <div key={index}>
                  <label className={labelClass}>Career {index + 1}</label>
                  <input
                    value={career.title}
                    onChange={(e) => {
                      const updated = [...careers];
                      updated[index].title = e.target.value;
                      setCareers(updated);
                    }}
                    className={inputClass}
                    placeholder="Software Engineer"
                  />
                </div>
              ))}
              <button type="button" onClick={() => setCareers([...careers, { title: "" }])} className={addBtnClass}>
                + Add Career
              </button>
            </div>
          )}

          {/* Step 6: Course Syllabus */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">Course Syllabus</h3>
              {syllabus.map((item, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4">
                  <input
                    value={item.module_name}
                    onChange={(e) => {
                      const updated = [...syllabus];
                      updated[index].module_name = e.target.value;
                      setSyllabus(updated);
                    }}
                    placeholder={`Module ${index + 1}`}
                    className={inputClass}
                  />
                  <textarea
                    rows={3}
                    value={item.content}
                    onChange={(e) => {
                      const updated = [...syllabus];
                      updated[index].content = e.target.value;
                      setSyllabus(updated);
                    }}
                    placeholder="Module Content"
                    className={inputClass}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSyllabus([...syllabus, { module_name: "", content: "" }])}
                className={addBtnClass}
              >
                + Add Module
              </button>
            </div>
          )}

          {/* Step 7: Course Topics */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">Course Topics</h3>
              {topics.map((item, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4">
                  <select
                    value={item.moduleIndex}
                    onChange={(e) => {
                      const updated = [...topics];
                      updated[index].moduleIndex = Number(e.target.value);
                      setTopics(updated);
                    }}
                    className={inputClass}
                  >
                    {syllabus.map((module, i) => (
                      <option key={i} value={i}>
                        {module.module_name || `Module ${i + 1}`}
                      </option>
                    ))}
                  </select>
                  <input
                    value={item.topic}
                    onChange={(e) => {
                      const updated = [...topics];
                      updated[index].topic = e.target.value;
                      setTopics(updated);
                    }}
                    placeholder="Topic Name"
                    className={inputClass}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTopics([...topics, { moduleIndex: 0, topic: "" }])}
                className={addBtnClass}
              >
                + Add Topic
              </button>
            </div>
          )}

          {/* Step 8: FAQs */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">FAQs</h3>
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-3 rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] p-4">
                  <input
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[index].question = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Question"
                    className={inputClass}
                  />
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[index].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Answer"
                    className={inputClass}
                  />
                </div>
              ))}
              <button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className={addBtnClass}>
                + Add FAQ
              </button>
            </div>
          )}

          {/* Step 9: Student Reviews */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#6B7328]">Student Reviews</h3>
              {reviews.map((item, index) => (
                <div key={index} className="rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] p-4 space-y-3">
                  <input
                    value={item.student_name}
                    onChange={(e) => {
                      const updated = [...reviews];
                      updated[index].student_name = e.target.value;
                      setReviews(updated);
                    }}
                    placeholder="Student Name"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={item.rating}
                    onChange={(e) => {
                      const updated = [...reviews];
                      updated[index].rating = e.target.value;
                      setReviews(updated);
                    }}
                    placeholder="Rating (1-5)"
                    className={inputClass}
                  />
                  <textarea
                    rows={3}
                    value={item.review}
                    onChange={(e) => {
                      const updated = [...reviews];
                      updated[index].review = e.target.value;
                      setReviews(updated);
                    }}
                    placeholder="Review"
                    className={inputClass}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setReviews([...reviews, { student_name: "", rating: "", review: "" }])}
                className={addBtnClass}
              >
                + Add Review
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-[#E8ECE5] dark:border-[#1E3A5F]">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-6 py-2.5 text-xs border border-[#6B7328] text-[#6B7328] rounded-2xl hover:bg-[#F8FAF5] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-8 py-2.5 text-xs bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white rounded-2xl font-medium"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={saveProgram}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 text-xs bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white rounded-2xl font-medium disabled:opacity-50"
              >
                <Save size={16} /> {loading ? "Saving..." : "Save Program"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
