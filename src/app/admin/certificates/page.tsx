"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { useCertificates } from "@/hooks/useCertificates";
import Image from "next/image";


import CertificateStats from "@/components/admin/certificates/CertificateStats";
import CertificateFilters from "@/components/admin/certificates/CertificateFilters";
import CertificateTable from "@/components/admin/certificates/CertificateTable";
import ViewCertificateModal from "@/components/admin/certificates/ViewCertificateModal";
import DeleteCertificateModal from "@/components/admin/certificates/DeleteCertificateModal";

import { generateCertificate } from "@/lib/certificates/generateCertificate";
import { uploadCertificate } from "@/lib/certificates/uploadCertificate";

const supabase = createClient();

export default function CertificatesPage() {
  const {
    certificates,
    loading,
    refresh,
  } = useCertificates();

  const [eligibleStudents, setEligibleStudents] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("");
  const [status, setStatus] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    loadEligibleStudents();
    loadPrograms();
  }, []);

  async function loadPrograms() {
    const { data } = await supabase
      .from("programs")
      .select("id,title")
      .order("title");

    setPrograms(data ?? []);
  }

  async function loadEligibleStudents() {
    const { data } = await supabase
      .from("enrollments")
     .select(`
  id,
  full_name,
  email,
  profile_image,
  program_id,
  programs(title)
`)
      .eq("certificate_status", "Eligible")
      .eq("course_status", "Completed")
      .order("full_name");

    setEligibleStudents(data ?? []);
  }

  const filtered = useMemo(() => {
    return certificates.filter((item: any) => {

      const matchName =
        !search ||
        item.enrollments?.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchProgram =
        !program ||
        String(item.program_id) === program;

      const matchStatus =
        !status ||
        item.status === status;

      return (
        matchName &&
        matchProgram &&
        matchStatus
      );
    });
  }, [certificates, search, program, status]);

  const total = filtered.length;

  const issued = filtered.filter(
    (x) => x.status === "Issued"
  ).length;

  const pending = filtered.filter(
    (x) => x.status === "Pending"
  ).length;

  const thisMonth = filtered.filter((x) => {
    const d = new Date(x.created_at);
    const now = new Date();

    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleView = (certificate: any) => {
    setSelected(certificate);
    setViewOpen(true);
  };

  const handleDelete = (certificate: any) => {
    setSelected(certificate);
    setDeleteOpen(true);
  };
    // =====================================
  // Generate Certificate
  // =====================================

  const handleGenerateCertificate = async (
    student: any
  ) => {
    try {
      const certificateNumber = `RAKVIH-${Date.now()}`;

      const issueDate = new Date()
        .toISOString()
        .split("T")[0];

      const { pdfBytes, fileName } =
        await generateCertificate({
          studentName: student.full_name,
          programName:
            student.programs?.title ?? "",
          certificateNumber,
          issueDate,
        });

      const certificateUrl =
        await uploadCertificate({
          pdfBytes,
          fileName,
        });

      const { error } = await supabase
        .from("certificates")
        .insert({
          enrollment_id: student.id,
          program_id: student.program_id,
          title: `${student.programs?.title} Internship Certificate`,
          certificate_number:
            certificateNumber,
          certificate_url: certificateUrl,
          issue_date: issueDate,
          status: "Issued",
        });

      if (error) throw error;

      await supabase
        .from("enrollments")
        .update({
          certificate_status:
            "Generated",
        })
        .eq("id", student.id);

      await loadEligibleStudents();
      await refresh();

      alert("Certificate Generated Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to generate certificate");
    }
  };

  return (
    <div className="space-y-5 pt-3">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold dark:text-white">
            Certificates
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Generate and manage internship certificates
          </p>

        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-[#707A21]
            via-[#8A8F24]
            to-[#FFC107]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-lg
          "
        >
          <Plus size={17} />
          Generated Certificates
        </button>

      </div>

      <CertificateStats
        total={total}
        issued={issued}
        pending={pending}
        thisMonth={thisMonth}
      />

      <CertificateFilters
        search={search}
        setSearch={setSearch}
        program={program}
        setProgram={setProgram}
        status={status}
        setStatus={setStatus}
        programs={programs}
      />

      {/* Eligible Students */}

    <div className="overflow-hidden rounded-3xl bg-white dark:bg-[#0F172A] shadow-lg">

  {/* Header */}

  <div className="flex items-center justify-between px-7 py-5">

    <div>

      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
        Eligible Students
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Students who successfully completed the internship
      </p>

    </div>

    <div className="rounded-full bg-[#FFF8E1] px-4 py-1 text-xs font-medium text-[#6B7328] dark:bg-[#1E293B] dark:text-yellow-400">
      {eligibleStudents.length} Students
    </div>

  </div>

  <div className="px-6 pb-6">

    {eligibleStudents.length === 0 ? (

      <div className="flex h-36 items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-500 dark:bg-slate-800">
        No eligible students found.
      </div>

    ) : (

      <div className="space-y-3">

        {eligibleStudents.map((student) => (

          <div
            key={student.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              bg-gray-50
              dark:bg-slate-800
              px-5
              py-4
              transition-all
              hover:bg-[#FFFDF5]
              dark:hover:bg-slate-700
            "
          >

            <div className="flex items-center gap-4">

          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-[#FFC107] bg-gray-100">
<img
  src={student.profile_image || "/images/avatar.png"}
  alt={student.full_name}
  className="h-11 w-11 rounded-full object-cover border-2 border-[#FFC107]"
/>
</div>

              <div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {student.full_name}
                </h3>

                <p className="text-xs text-gray-500">
                  {student.email}
                </p>

              </div>

            </div>

            <div className="hidden md:block">

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {student.programs?.title}
              </span>

            </div>

            <button
              onClick={() => handleGenerateCertificate(student)}
              className="
                rounded-xl
                bg-gradient-to-r
                from-[#6B7328]
                to-[#FFC107]
                px-5
                py-2
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition-all
                hover:scale-105
                hover:shadow-md
              "
            >
              Generate Certificate
            </button>

          </div>

        ))}

      </div>

    )}

  </div>

</div>
            {/* Generated Certificates */}

      <CertificateTable
        certificates={filtered}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* View Certificate */}

      <ViewCertificateModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelected(null);
        }}
        certificate={selected}
      />

      {/* Delete Certificate */}

      <DeleteCertificateModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
        certificate={selected}
        loading={loading}
        onDelete={async () => {
          if (!selected) return;

          try {
            // Delete PDF from Storage
            const fileName =
              selected.certificate_url
                ?.split("/")
                ?.pop();

            if (fileName) {
              await supabase.storage
                .from("certificates")
                .remove([fileName]);
            }

            // Delete DB record
            const { error } = await supabase
              .from("certificates")
              .delete()
              .eq("id", selected.id);

            if (error) throw error;

            // Allow regeneration later
            await supabase
              .from("enrollments")
              .update({
                certificate_status: "Eligible",
              })
              .eq(
                "id",
                selected.enrollment_id
              );

            setDeleteOpen(false);
            setSelected(null);

            await loadEligibleStudents();
            await refresh();

            alert(
              "Certificate deleted successfully."
            );
          } catch (error) {
            console.error(error);

            alert(
              "Unable to delete certificate."
            );
          }
        }}
      />

    </div>
  );
}