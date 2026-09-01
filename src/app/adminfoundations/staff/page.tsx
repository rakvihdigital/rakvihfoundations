"use client";

import { useState, useEffect, useTransition } from "react";
import { Fraunces } from "next/font/google";
import { ShieldAlert, UserPlus, Trash2, Edit3, Shield, Mail, Key, X, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "@/components/foundation/adminheader";
import { getStaff, createStaff, updateStaffAccount, deleteStaff, updateStaffStatus } from "./action";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

const AVAILABLE_MODULES = [
  { id: "dashboard", label: "Dashboard Overview" },
  { id: "donations", label: "Donations" },
  { id: "contact", label: "Contact Inquiries" },
  { id: "gallery", label: "Gallery" },
  { id: "csr", label: "CSR Proposals" },
  { id: "causes", label: "Causes & Pricing" },
  { id: "volunteers", label: "Manage Volunteers" },
  { id: "log-hours", label: "Log Hours" },
  { id: "events", label: "Events" },
  { id: "approvals", label: "Event Approvals" },
  { id: "announcements", label: "Notice Board" },
];

export default function AdminStaffPage() {
  const [isPending, startTransition] = useTransition();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getStaff();
      const onlyStaff = (data || []).filter((user: any) => user.role !== "admin");
      setStaffList(onlyStaff);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (staff: any | null = null) => {
    if (staff) {
      setEditingStaff(staff);
      setName(staff.name);
      setEmail(staff.email);
      setPassword(staff.password); // Load existing password so it can be edited
      setSelectedPermissions(staff.permissions || []);
    } else {
      setEditingStaff(null);
      setName("");
      setEmail("");
      setPassword("");
      setSelectedPermissions([]);
    }
    setIsModalOpen(true);
  };

  const togglePermission = (moduleId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    startTransition(async () => {
      try {
        await updateStaffStatus(id, newStatus);
        setStaffList(prev => prev.map(staff => staff.id === id ? { ...staff, is_active: newStatus } : staff));
      } catch (err: any) {
        alert("Error updating status: " + err.message);
      }
    });
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (editingStaff) {
          // Update permissions AND password
          await updateStaffAccount(editingStaff.id, selectedPermissions, password);
          alert("Staff account updated successfully!");
        } else {
          // Create brand new staff member
          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("password", password);
          await createStaff(formData, selectedPermissions);
          alert("New staff member added successfully!");
        }
        setIsModalOpen(false);
        await loadData();
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to completely remove this staff member?")) return;
    startTransition(async () => {
      try {
        await deleteStaff(id);
        await loadData();
      } catch (err: any) {
        alert("Error deleting staff: " + err.message);
      }
    });
  };

  return (
    <div className={`min-h-screen bg-black ${display.variable}`} style={{ fontFamily: "var(--font-display)" }}>
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Staff Management</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Add sub-admins, regenerate passwords, and control access levels.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#798321] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6b731d] dark:bg-[#FFC107] dark:text-black dark:hover:bg-[#e5ad06]"
          >
            <UserPlus size={16} /> Add New Staff
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <div className="py-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#798321] border-t-transparent" /></div>
          ) : staffList.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShieldAlert size={40} className="mx-auto text-slate-300 dark:text-zinc-700" />
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">No staff members created yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/75">
                    <th className="py-4 px-6">Staff Member & Login Info</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Permissions Access</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs dark:divide-zinc-800">
                  {staffList.map((staff) => {
                    const isActive = staff.is_active ?? true;
                    const isPassVisible = visiblePasswords[staff.id] || false;

                    return (
                      <tr key={staff.id} className={`hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition ${!isActive ? "opacity-60" : ""}`}>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield size={14} className="text-blue-500 shrink-0" />
                            {staff.name}
                            {staff.staff_id && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                {staff.staff_id}
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="flex items-center gap-1"><Mail size={10} /> {staff.email}</span>
                            <span className="hidden sm:inline text-zinc-700">•</span>
                            <span className="flex items-center gap-1.5">
                              <Key size={10} className="text-[#FFC107]" /> 
                              <span className="font-mono">{isPassVisible ? staff.password : "••••••••"}</span>
                              <button 
                                onClick={() => togglePasswordVisibility(staff.id)} 
                                className="ml-1 text-slate-400 hover:text-[#FFC107] transition"
                                title={isPassVisible ? "Hide Password" : "Show Password"}
                              >
                                {isPassVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">Sub-Admin</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(staff.id, isActive)}
                              disabled={isPending}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isActive ? "bg-emerald-600" : "bg-slate-300 dark:bg-zinc-700"
                              }`}
                            >
                              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-4" : "translate-x-0"}`} />
                            </button>
                            <span className={`text-[10px] font-bold ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                              {isActive ? "Active" : "Suspended"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {staff.permissions.map((perm: string) => (
                              <span key={perm} className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                {perm.replace("-", " ")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button onClick={() => openModal(staff)} title="Edit Account" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#798321] hover:text-white dark:bg-zinc-800 dark:text-zinc-300 transition">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(staff.id)} disabled={isPending} title="Delete Staff" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-950/40 dark:text-red-400 transition disabled:opacity-50">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="text-[#798321] dark:text-[#FFC107]" />
                  {editingStaff ? "Edit Staff Account" : "Add New Staff"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"><X size={18} /></button>
              </div>

              <form onSubmit={handleSaveStaff} className="space-y-6">
                
                {/* Account Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Full Name</span>
                      {editingStaff?.staff_id && (
                        <span className="text-[9px] bg-[#798321]/10 text-[#798321] dark:bg-[#FFC107]/10 dark:text-[#FFC107] px-1.5 py-0.5 rounded">
                          {editingStaff.staff_id}
                        </span>
                      )}
                    </label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={!!editingStaff} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321] disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1"><Mail size={12}/> Email / Login ID</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!editingStaff} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321] disabled:opacity-50" />
                  </div>
                  
                  {/* Password Field - Always visible now so you can regenerate it */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Key size={12}/> {editingStaff ? "Update / Regenerate Password" : "Initial Password"}
                    </label>
                    <input 
                      type="text" 
                      required 
                      minLength={6} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-mono dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:outline-none focus:border-[#798321]" 
                      placeholder="Type a new password here..." 
                    />
                  </div>
                </div>

                {/* Permissions Grid */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Module Permissions (Toggle to Grant Access)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AVAILABLE_MODULES.map((mod) => {
                      const isSelected = selectedPermissions.includes(mod.id);
                      return (
                        <div 
                          key={mod.id} 
                          onClick={() => togglePermission(mod.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-[#798321] bg-[#798321]/5 dark:border-[#FFC107] dark:bg-[#FFC107]/10" : "border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 hover:border-slate-300 dark:hover:border-zinc-700"}`}
                        >
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center border ${isSelected ? "bg-[#798321] border-[#798321] dark:bg-[#FFC107] dark:border-[#FFC107]" : "border-slate-300 dark:border-zinc-600"}`}>
                            {isSelected && <CheckCircle2 size={10} className="text-white dark:text-black" />}
                          </div>
                          <span className={`text-[11px] font-bold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                            {mod.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 transition hover:bg-slate-200 dark:hover:bg-zinc-700">Cancel</button>
                  <button type="submit" disabled={isPending || selectedPermissions.length === 0} className="rounded-xl bg-[#798321] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#6b731d] dark:bg-[#FFC107] dark:text-black disabled:opacity-50">
                    {editingStaff ? "Save Account Changes" : "Create Staff Account"}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}