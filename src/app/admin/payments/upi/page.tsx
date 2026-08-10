"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Building2, CreditCard, ShieldCheck, Save, UploadCloud } from "lucide-react";
import Image from "next/image";

export default function UPISettingsPage() {
const [formData, setFormData] = useState({
    upiId: "rakvih@upi",
    qrCodeImage: "/images/qr-code.png",
    bankName: "HDFC Bank",
    accountNumber: "12345678901234",
    ifscCode: "HDFC0001234",
    accountName: "RAKVIH FOUNDATION", // Add this line
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch from your database/API here e.g. fetch('/api/admin/upi-settings')
    const savedData = localStorage.getItem("rakvih_upi_settings");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, qrCodeImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

// 1. Fetch from Database API on load
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/upi-settings");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            upiId: json.data.upi_id || "",
            qrCodeImage: json.data.qr_code_image || "",
            bankName: json.data.bank_name || "",
            accountNumber: json.data.account_number || "",
            ifscCode: json.data.ifsc_code || "",
            accountName: json.data.account_name || "RAKVIH FOUNDATION",
          });
        }
      } catch (err) {
        console.error("Failed to load settings from database", err);
      }
    }
    fetchSettings();
  }, []);

  // 2. Submit and save/update in Database API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/upi-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save");

      setLoading(false);
      setSuccessMessage("UPI & Bank Details updated in database successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error saving data to database");
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header section with theme gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-gradient-to-r from-[#6B7328]/20 to-[#FFC107]/20 border border-[#6B7328]/30 dark:border-[#FFC107]/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-white dark:bg-[#081525] text-[#6B7328] dark:text-[#FFC107] shadow-xs">
              <QrCode size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              UPI & Bank Account Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Manage your organization's primary receiving QR scanner and account details (Single Config).
          </p>
        </div>
      </motion.div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold text-center"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Main Settings Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: QR Scanner Preview & Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-white dark:bg-[#081525] border border-gray-100 dark:border-[#1E3A5F] shadow-xl flex flex-col items-center justify-center text-center space-y-4"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Active UPI QR Code
          </h3>
          
          <div className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-[#6B7328]/40 dark:border-[#FFC107]/40 p-2 flex items-center justify-center bg-gray-50 dark:bg-[#132238] overflow-hidden group">
            {formData.qrCodeImage ? (
              <Image
                src={formData.qrCodeImage}
                alt="UPI QR Scanner"
                width={180}
                height={180}
                className="object-contain rounded-xl"
              />
            ) : (
              <QrCode size={48} className="text-gray-400" />
            )}
          </div>

          <div className="w-full space-y-2">
            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6B7328]/10 to-[#FFC107]/10 hover:from-[#6B7328]/20 hover:to-[#FFC107]/25 text-[#6B7328] dark:text-[#FFC107] text-xs font-bold cursor-pointer transition-all border border-[#6B7328]/30">
              <UploadCloud size={16} />
              <span>Upload QR Scanner Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
      
          </div>
        </motion.div>

        {/* Right Columns: UPI & Bank Details Inputs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#081525] border border-gray-100 dark:border-[#1E3A5F] shadow-xl space-y-6"
        >
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#1E3A5F] pb-4">
            <ShieldCheck size={18} className="text-[#6B7328] dark:text-[#FFC107]" />
            Active Payment Receiving Details
          </h3>

          <div className="space-y-4">
            {/* UPI ID Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                UPI ID (Virtual Payment Address)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <QrCode size={16} />
                </span>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. company@upi"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-[#132238] border border-gray-200 dark:border-[#1E3A5F] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B7328]"
                  required
                />
              </div>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Bank Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 size={16} />
                </span>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g. HDFC Bank"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-[#132238] border border-gray-200 dark:border-[#1E3A5F] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B7328]"
                  required
                />
              </div>
            </div>

            {/* Bank Account Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Bank Account Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <CreditCard size={16} />
                </span>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter Account Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-[#132238] border border-gray-200 dark:border-[#1E3A5F] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B7328]"
                  required
                />
              </div>
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                IFSC Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck size={16} />
                </span>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g. HDFC0001234"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm uppercase bg-gray-50 dark:bg-[#132238] border border-gray-200 dark:border-[#1E3A5F] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B7328]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white font-bold text-sm shadow-lg shadow-[#6B7328]/30 cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              <span>{loading ? "Updating Details..." : "Save Bank & UPI Details"}</span>
            </motion.button>
          </div>
        </motion.div>

      </form>
    </div>
  );
}