"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";

import CreateSubAdminModal from "@/components/admin/sub-admins/CreateSubAdminModal";
import SubAdminTable from "@/components/admin/sub-admins/SubAdminTable";
import EditPermissionModal from "@/components/admin/sub-admins/EditPermissionModal";
import DepartmentCards from "@/components/admin/sub-admins/DepartmentCards";
import ViewSubAdminModal from "@/components/admin/sub-admins/ViewSubAdminModal";

interface Permission {
  dashboard: boolean;
  students: boolean;
  programs: boolean;
  payments: boolean;
  videos: boolean;
  materials: boolean;
  assignments: boolean;
  certificates: boolean;
  reports: boolean;
  settings: boolean;
}

interface SubAdmin {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  employee_id: string;
  department: string;
  status: string;
  role: string;
  created_at: string;
  admin_permissions: Permission[];
}

export default function SubAdminsPage() {
  const [admins, setAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);

  useEffect(() => {
    loadSubAdmins();
  }, []);

  async function loadSubAdmins() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/sub-admins");
      const json = await res.json();

      if (json.success) {
        setAdmins(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSubAdmin(id: string) {
    if (!window.confirm("Delete this Sub Admin?")) return;

    try {
      const res = await fetch(`/api/admin/sub-admins/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.message);
        return;
      }

      loadSubAdmins();
    } catch (error) {
      console.error(error);
      alert("Unable to delete.");
    }
  }

  function handleEdit(admin: SubAdmin) {
    setSelectedAdmin(admin);
    setEditOpen(true);
  }

  function handleView(admin: SubAdmin) {
    setSelectedAdmin(admin);
    setViewOpen(true);
  }

  return (
    <div className="space-y-6 px-6 pb-6 pt-2 -ml-5">
      {/* Professional Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B7328] to-[#FFC107] text-white shadow">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-[#24310F] dark:text-white tracking-tight">
              Sub Admins
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Manage team access and permissions
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] px-5 py-2 text-xs font-medium text-white shadow hover:brightness-110 active:scale-[0.985] transition-all"
        >
          <UserPlus size={16} />
          Add Sub Admin
        </button>
      </div>

      {/* Department Cards */}
      <DepartmentCards admins={admins} />

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <SubAdminTable
          data={admins}
          loading={loading}
          onDelete={deleteSubAdmin}
          onEdit={handleEdit}
          onView={handleView}
        />
      </div>

      {/* Modals */}
      <CreateSubAdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          loadSubAdmins();
        }}
      />

      <EditPermissionModal
        open={editOpen}
        admin={selectedAdmin}
        onClose={() => setEditOpen(false)}
        onSuccess={loadSubAdmins}
      />

      <ViewSubAdminModal
        open={viewOpen}
        admin={selectedAdmin}
        onClose={() => setViewOpen(false)}
      />
    </div>
  );
}