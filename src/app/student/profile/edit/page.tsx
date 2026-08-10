"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

import {
  ArrowLeft,
  Upload,
  User,
  Save,
} from "lucide-react";

const supabase = createClient();

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [studentId, setStudentId] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!enrollment) {
      setLoading(false);
      return;
    }

    setStudentId(enrollment.id);

    setFullName(enrollment.full_name || "");
    setEmail(enrollment.email || "");
    setPhone(enrollment.phone || "");
    setGender(enrollment.gender || "");
    setDob(enrollment.dob || "");
    setAddress(enrollment.address || "");

    setProfileImage(
      enrollment.profile_image ||
      enrollment.photo_url ||
      enrollment.avatar ||
      ""
    );

    setLoading(false);
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const preview = URL.createObjectURL(file);
    setProfileImage(preview);
  }

  async function handleSave() {
    try {
      setSaving(true);

      let imageUrl = profileImage;

      if (selectedImage) {
        const fileExt = selectedImage.name.split(".").pop();
        const fileName = `${studentId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, selectedImage, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("enrollments")
        .update({
          full_name: fullName,
          phone,
          gender,
          dob,
          address,
          profile_image: imageUrl,
        })
        .eq("id", studentId);

      if (error) throw error;

      alert("Profile updated successfully.");
      router.push("/student/profile");
    } catch (error) {
      console.error(error);
      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center text-gray-500 dark:text-neutral-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h1>
      </div>

      {/* Profile Image */}
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white dark:border-neutral-900 shadow-md">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500">
                <User size={48} />
              </div>
            )}
          </div>

          {/* Change Photo */}
          <label className="cursor-pointer rounded-xl bg-gradient-to-r from-[#6B7328] via-[#8A8F2E] to-[#FACC15] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 transition dark:text-black">
            <div className="flex items-center gap-2">
              <Upload size={17} />
              Change Photo
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-[#24310F] dark:text-white">
          Personal Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-[#171717] px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#6B7328] dark:focus:border-[#FFC107]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 px-4 py-2.5 text-sm text-gray-500 dark:text-neutral-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-[#171717] px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#6B7328] dark:focus:border-[#FFC107]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-[#171717] px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#6B7328] dark:focus:border-[#FFC107]"
            >
              <option value="" className="dark:bg-[#171717]">Select Gender</option>
              <option value="Male" className="dark:bg-[#171717]">Male</option>
              <option value="Female" className="dark:bg-[#171717]">Female</option>
              <option value="Other" className="dark:bg-[#171717]">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-[#171717] px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#6B7328] dark:focus:border-[#FFC107]"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300">Address</label>
          <textarea
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-[#171717] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#6B7328] dark:focus:border-[#FFC107]"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-gray-200 dark:border-neutral-800 px-5 py-3 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Cancel
        </button>

        {/* Save Changes */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B7328] via-[#8A8F2E] to-[#FACC15] px-6 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 transition disabled:opacity-70 dark:text-black"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}