"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SectionTitle from "./SectionTitle";

export default function PasswordCard() {
  const supabase = createClient();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setSaving(false);
      alert(error.message);
      return;
    }

    alert("Password updated successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <SectionTitle
        title="Change Password"
        subtitle="Update your account password."
      />

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-br from-[#6B7328] to-[#FFC107] p-3">
          <Lock className="h-6 w-6 text-white" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Keep your account secure.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#FFC107]"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password must contain at least 8 characters.
          </p>
        </div>

        {/* Your Exact Gradient Button */}
        <button
          onClick={handleChangePassword}
          disabled={
            saving ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-4 py-2 text-xs font-medium text-white hover:brightness-110 transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>

      </div>
    </div>
  );
}