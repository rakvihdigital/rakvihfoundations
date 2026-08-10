"use client";

import { useEffect, useState } from "react";
import { Camera, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SectionTitle from "./SectionTitle";

export default function ProfileCard() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    auth_id: "",
    full_name: "",
    email: "",
    phone: "",
    designation: "",
    address: "",
    bio: "",
    role: "",
    status: "",
    avatar: "",
    created_at: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (data) {
      setProfile({
        id: data.id,
        auth_id: data.auth_id,
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        designation: data.designation || "",
        address: data.address || "",
        bio: data.bio || "",
        role: data.role || "",
        status: data.status || "",
        avatar: data.avatar || "",
        created_at: data.created_at
          ? new Date(data.created_at).toISOString()
          : "",
      });
    }

    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("admins")
      .update({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        designation: profile.designation,
        address: profile.address,
        bio: profile.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    alert("Profile updated successfully.");
  }

  async function handleAvatarUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${profile.id}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("admins")
      .update({
        avatar: publicUrl,
      })
      .eq("id", profile.id);

    setProfile({
      ...profile,
      avatar: publicUrl,
    });
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 text-xs">
        Loading...
      </div>
    );
  }

  return (
<div className="h-[620px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 pt-4 pb-6 shadow-sm overflow-hidden flex flex-col">   <SectionTitle
        title="Profile"
        subtitle="Update your profile information."
      />

<div className="mb-3 flex items-center gap-3">        <div className="relative">

          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="h-16 w-16 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6B7328] to-[#FFC107]">
              <User className="h-7 w-7 text-white" />
            </div>
          )}

          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gradient-to-r from-[#6B7328] to-[#FFC107] p-2 text-white hover:brightness-110">
            <Camera size={13} />
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>

        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.full_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {profile.designation}
          </p>
        </div>
      </div>

 <div
  className="
    flex-1
    overflow-y-auto
    min-h-0
    pr-2
    space-y-4
    scrollbar-thin
    scrollbar-thumb-[#FFC107]
    scrollbar-track-transparent
  "
>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Full Name</label>
          <input
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs outline-none focus:border-[#FFC107] text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Email</label>
          <input
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs outline-none focus:border-[#FFC107] text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Phone</label>
          <input
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs outline-none focus:border-[#FFC107] text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Designation</label>
          <input
            value={profile.designation}
            onChange={(e) =>
              setProfile({ ...profile, designation: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Address</label>
          <input
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Bio</label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Role</label>
            <input
              value={profile.role}
              readOnly
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
            <input
              value={profile.status}
              readOnly
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Joined On</label>
          <input
            value={
              profile.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : ""
            }
            readOnly
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white"
          />
        </div>

        {/* Your Exact Gradient Button - Works in both light & dark */}
      <button
  onClick={handleSave}
  disabled={saving}
className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-4 py-2 text-xs font-medium text-white hover:brightness-110 transition-all">
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}