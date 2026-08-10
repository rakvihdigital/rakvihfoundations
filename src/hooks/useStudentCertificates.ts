"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface Certificate {
  id: number;
  enrollment_id: number;
  program_id: number;
  certificate_number: string;
  certificate_url: string;
  issue_date: string;
  status: string;
  created_at: string;
  programs?: {
    title: string;
  };
}

export default function useStudentCertificates() {
  const [loading, setLoading] = useState(true);

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [progress, setProgress] = useState(0);
  const [courseStatus, setCourseStatus] = useState("");
  const [certificateStatus, setCertificateStatus] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id, course_status, certificate_status")
        .eq("user_id", user.id)
        .single();

      if (enrollmentError || !enrollment) {
        console.error(enrollmentError);
        setLoading(false);
        return;
      }

      setCourseStatus(enrollment.course_status || "");
      setCertificateStatus(enrollment.certificate_status || "");

      // Get student progress
      const { data: progressData } = await supabase
        .from("student_progress")
        .select("progress")
        .eq("student_id", enrollment.id)
        .single();

      setProgress(progressData?.progress || 0);

      // Get certificates
      const { data: certificateData, error: certificateError } =
        await supabase
          .from("certificates")
          .select(
            `
              *,
              programs(title)
            `
          )
          .eq("enrollment_id", enrollment.id)
          .order("created_at", { ascending: false });

      if (certificateError) throw certificateError;

      setCertificates(certificateData || []);
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    certificates,
    progress,
    courseStatus,
    certificateStatus,
    refresh: fetchCertificates,
    hasCertificate: certificates.length > 0,
  };
}