"use client";

interface Props {
  permissions: any;
  setPermissions: any;
}

const items = [
  { key: "dashboard", label: "Dashboard" },
  { key: "students", label: "Students" },
  { key: "programs", label: "Programs" },
  { key: "payments", label: "Payments" },
  { key: "videos", label: "Videos" },
  { key: "materials", label: "Materials" },
  { key: "assignments", label: "Assignments" },
  { key: "certificates", label: "Certificates" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

export default function PermissionCheckboxes({
  permissions,
  setPermissions,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <label
          key={item.key}
          className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all
          ${
            permissions[item.key]
              ? "border-[#6B7328] bg-[#F7FAEC] dark:bg-[#374151]"
              : "border-gray-200 dark:border-gray-700 hover:border-[#6B7328]"
          }`}
        >
          <input
            type="checkbox"
            checked={permissions[item.key]}
            onChange={(e) =>
              setPermissions({
                ...permissions,
                [item.key]: e.target.checked,
              })
            }
            className="h-4 w-4 accent-[#FFC107]"
          />

          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
}