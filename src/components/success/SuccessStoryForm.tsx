"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SuccessStoryForm() {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    student_name: "",
    designation: "",
    company: "",
    course: "",
    package: "",
    review: "",
    rating: 5,
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "rating"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      let imageUrl = "";

      if (image) {

        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("success-stories")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("success-stories")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }
            const { error } = await supabase
        .from("success_stories")
        .insert([
          {
            student_name: formData.student_name,
            designation: formData.designation,
            company: formData.company,
            course: formData.course,
            package: formData.package,
            review: formData.review,
            rating: formData.rating,
            image: imageUrl,
            is_active: true,
          },
        ]);

      if (error) throw error;

      alert("Success Story Submitted!");

      setFormData({
        student_name: "",
        designation: "",
        company: "",
        course: "",
        package: "",
        review: "",
        rating: 5,
      });

      setImage(null);

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div
className="
  sticky
  top-24
  self-start
  hidden
  xl:block

  w-full
  max-w-[360px]

  h-[82vh]
  overflow-y-auto

  rounded-3xl
  border
  border-[#798321]/20
  dark:border-neutral-800

  bg-white
  dark:bg-[#0a0a0a]

  p-6
  shadow-xl

  scrollbar-thin
  scrollbar-thumb-[#798321]
  scrollbar-track-transparent
"
>

      <div className="mb-6 border-b border-gray-200 pb-5 dark:border-neutral-800">
        <h2 className="text-2xl font-black text-[#798321] dark:text-[#FFC107]">
          Share Your Journey
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
          Inspire future students.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
                {/* Student Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Student Name
          </label>

          <input
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            type="text"
            placeholder="Enter your name"
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
            required
          />
        </div>

        {/* Designation */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Designation
          </label>

          <input
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            type="text"
            placeholder="Software Engineer"
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Company
          </label>

          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            type="text"
            placeholder="Infosys"
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
            required
          />
        </div>

        {/* Course */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Course
          </label>

          <input
            name="course"
            value={formData.course}
            onChange={handleChange}
            type="text"
            placeholder="Java Full Stack"
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
            required
          />
        </div>

        {/* Package */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Package
          </label>

          <input
            name="package"
            value={formData.package}
            onChange={handleChange}
            type="text"
            placeholder="6 LPA"
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Rating
          </label>

          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>
        </div>

        {/* Review */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Success Story
          </label>

          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={6}
            placeholder="Share your internship experience..."
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] px-4 py-3 text-sm resize-none outline-none focus:border-[#798321] dark:text-white dark:focus:border-[#FFC107]"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-semibold dark:text-neutral-300">
            Profile Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#171717] p-3 text-sm dark:text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#798321]/10 file:text-[#798321] dark:file:bg-[#FFC107]/10 dark:file:text-[#FFC107] hover:file:bg-[#798321]/20"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-[#798321] to-[#5F6E1D] py-3.5 font-semibold text-white transition hover:scale-[1.02] dark:from-[#798321] dark:to-[#FFC107] dark:text-black"
        >
          {loading ? "Submitting..." : "Submit Success Story"}
        </button>

      </form>

    </div>
  );
}