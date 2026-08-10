"use client";

import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
<div className="-mt-6 mb-6 flex items-center justify-between">     <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[#6B7328] to-[#FFC107] p-2.5">
            <Settings className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-[#6B7328] dark:text-[#FFC107]">
              Settings
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage your account and application settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}