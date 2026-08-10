"use client";

import { useState } from "react";
import PermissionCheckboxes from "./PermissionCheckboxes";

interface Props {
  open: boolean;
  onClose: () => void;
}

const defaultPermissions = {
  dashboard: true,
  students: false,
  programs: false,
  payments: false,
  videos: false,
  materials: false,
  assignments: false,
  certificates: false,
  reports: false,
  settings: false,
};

export default function CreateSubAdminModal({ open, onClose }: Props) {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  async function createSubAdmin() {
  if (
  !fullName ||
  !email ||
  !phone ||
  !password ||
  !employeeId ||
  !department
) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/sub-admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  full_name: fullName,
  email,
  phone,
  password,
  employee_id: employeeId,
  department,
  status,
  role: "sub_admin",
  permissions,
}),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.message);
        return;
      }

      alert("Sub Admin Created");
onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="
          w-full max-w-3xl max-h-[90vh] overflow-y-auto 
          rounded-2xl bg-white dark:bg-gray-900 
          p-6 shadow-2xl scrollbar-thin 
          scrollbar-thumb-[#6B7328] scrollbar-track-gray-100
        "
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#6B7328] dark:text-[#FFC107]">
            Create Sub Admin
          </h2>

          <button 
            onClick={onClose} 
            className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          />
          <input
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          >
            <option value="">Select Department</option>
            <option>Administration</option>
            <option>Internship</option>
            <option>Training</option>
            <option>Finance</option>
            <option>Support</option>
            <option>Certificates</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-xs focus:border-[#FFC107] outline-none"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="flex flex-col col-span-2">
            <label className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              Role
            </label>
            <input
              value="Sub Admin"
              disabled
              className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 text-xs text-gray-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Permissions</h3>
          <PermissionCheckboxes
            permissions={permissions}
            setPermissions={setPermissions}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-2 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={createSubAdmin}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-6 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Sub Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}