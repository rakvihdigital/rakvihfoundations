"use client";

import { useState } from "react";

import SettingsHeader from "@/components/admin/settings/SettingsHeader";
import SettingsTabs from "@/components/admin/settings/SettingsTabs";

import ProfileCard from "@/components/admin/settings/ProfileCard";
import OrganizationCard from "@/components/admin/settings/OrganizationCard";
import PasswordCard from "@/components/admin/settings/PasswordCard";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6 p-6 -ml-5">
      <SettingsHeader />

      <SettingsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "profile" && <ProfileCard />}

      {activeTab === "organization" && <OrganizationCard />}

      {activeTab === "password" && <PasswordCard />}
    </div>
  );
}