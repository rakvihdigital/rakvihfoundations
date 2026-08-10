"use client";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "organization", label: "Organization" },
  { id: "password", label: "Password" },
];

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}