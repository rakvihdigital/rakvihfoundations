"use client";

import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  School,
  BookOpen,
  MapPin,
  CreditCard,
  IndianRupee,
  BadgeCheck,
  FileText,
  Image as ImageIcon,
  User,
} from "lucide-react";

interface StudentDetails {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  address: string;
  amount: number;
  payment_status: string;
  enrollment_status: string;
  transaction_id: string | null;
  payment_method: string | null;
  payment_screenshot: string | null;
  receipt_url: string | null;
  payment_date: string | null;
  program_title: string;
  photo_url: string | null;
  resume_url: string | null;
  created_at: string;
}

interface Student {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  program: string;
  status: string;
  created_at: string;
}

interface Props {
  open: boolean;
  student: Student | null;
  onClose: () => void;
}

export default function ViewStudentModal({
  open,
  student,
  onClose,
}: Props) {
  const [details, setDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    if (!open || !student) return;

    async function loadStudent() {
      setLoading(true);
      try {
        const currentStudent = student;
        if (!currentStudent) return;

      const res = await fetch(`/api/admin/students/${currentStudent.id}`);
const data = await res.json();

console.log(JSON.stringify(data, null, 2));

setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [open, student]);

  if (!open || !student) return null;

  if (loading || !details) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl px-6 py-5 max-w-sm w-full">
          <p className="text-sm text-center">Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto border border-[#E8ECE5] dark:border-[#1E3A5F]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8ECE5] dark:border-[#1E3A5F]">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Student Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#132238] rounded-xl"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5">
          {/* Header Info */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6B7328] to-[#FFC107] flex items-center justify-center flex-shrink-0">
              {details.photo_url ? (
                <img
                  src={details.photo_url}
                  alt={details.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {details.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#24310F] dark:text-white text-[15px] leading-tight">
                {details.full_name}
              </h3>
              <p className="text-xs text-[#6B7328] mt-0.5 truncate">
                {details.program_title}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-5">
            {["profile", "academic", "payment", "documents"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`py-1.5 rounded-xl text-[10px] font-medium capitalize transition ${
                  tab === item
                    ? "bg-[#6B7328] text-white"
                    : "bg-[#F3F4F6] dark:bg-[#132238] text-[#24310F] dark:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <Mail size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Email</p>
                  <p className="font-medium text-[#24310F] dark:text-white break-all">
                    {details.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <Phone size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Phone</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <GraduationCap size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Program</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.program_title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <Calendar size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Joined</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {new Date(details.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {tab === "academic" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <School size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">College</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.college}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <BookOpen size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Branch</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.branch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <GraduationCap size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Year</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.year}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <MapPin size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Address</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {tab === "payment" && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <IndianRupee size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Amount</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    ₹{details.amount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <BadgeCheck size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Payment Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-medium ${
                      details.payment_status === "Paid" ||
details.payment_status === "Completed"
  ? "bg-green-100 text-green-700"
  : details.payment_status === "Pending"
  ? "bg-yellow-100 text-yellow-700"
  : "bg-red-100 text-red-700"
                    }`}
                  >
                    {details.payment_status}
                  </span>
                </div>
              </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
  <FileText size={16} className="text-[#6B7328]" />

  <div className="text-xs w-full">
    <p className="text-[#6B7280]">Transaction ID</p>

    <p className="font-medium text-[#24310F] dark:text-white break-all">
      {details.transaction_id || "-"}
    </p>
  </div>
</div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
                <Calendar size={16} className="text-[#6B7328]" />
                <div className="text-xs">
                  <p className="text-[#6B7280]">Payment Date</p>
                  <p className="font-medium text-[#24310F] dark:text-white">
                    {details.payment_date
                      ? new Date(details.payment_date).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>
              </div>

<div className="rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <ImageIcon size={16} className="text-[#6B7328]" />

      <div>
        <p className="text-xs text-[#6B7280]">
          Payment Screenshot
        </p>

        <p className="text-xs font-medium text-[#24310F] dark:text-white">
          {details.receipt_url ? "Uploaded" : "Not Uploaded"}
        </p>
      </div>
    </div>

    {details.receipt_url && (
      <a
        href={details.receipt_url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-xl bg-[#6B7328] text-white text-xs font-medium hover:bg-[#556020] transition"
      >
        View
      </a>
    )}
  </div>
</div>
            </div>
          )}

          {/* Documents Tab */}
          {tab === "documents" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3.5">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-[#6B7328]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Profile Photo</p>


<p className="text-xs font-medium text-[#24310F] dark:text-white">
  {details.photo_url ? "Uploaded" : "Not Uploaded"}
</p>

                  </div>
                </div>
{details.photo_url && (
  <a
    href={details.photo_url}
    target="_blank"
    rel="noopener noreferrer"
    className="px-3 py-1.5 rounded-xl bg-[#6B7328] text-white text-[10px] font-medium"
  >
    View
  </a>
)}
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#F8FAF5] dark:bg-[#132238] p-3.5">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#6B7328]" />
                  <div>
                    <p className="text-xs text-[#6B7280]">Resume</p>
                    <p className="text-xs font-medium text-[#24310F] dark:text-white">
                      {details.resume_url ? "Uploaded" : "Not Uploaded"}
                    </p>
                  </div>
                </div>
                {details.resume_url && (
                  <a
                    href={details.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#6B7328] text-white text-[10px] font-medium"
                  >
                    View
                  </a>
                )}
              </div>
<div className="flex items-center justify-between rounded-2xl bg-[#F8F9F3] dark:bg-[#0F172A] p-4">
  <div className="flex items-center gap-3">
    <ImageIcon className="w-5 h-5 text-[#6B7328]" />

    <div>
      <p className="text-xs text-[#6B7280]">
        Payment Screenshot
      </p>

      <p className="text-xs font-medium text-[#24310F] dark:text-white">
        {details.receipt_url ? "Uploaded" : "Not Uploaded"}
      </p>
    </div>
  </div>

  {details.receipt_url && (
    <a
      href={details.receipt_url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1.5 rounded-xl bg-[#6B7328] text-white text-[10px] font-medium hover:bg-[#556020] transition"
    >
      View
    </a>
  )}
</div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gradient-to-r from-[#6B7328] to-[#FFC107] text-white py-2.5 rounded-2xl text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}