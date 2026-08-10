"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface Certificate {
  id: number;
  enrollment_id: number;
  program_id: number;
  title: string;
  certificate_number: string;
  certificate_url: string;
  issue_date: string;
  status: string;
  created_at: string;

  enrollments?: {
    full_name: string;
    email: string;
  };

  programs?: {
    title: string;
  };
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("certificates")
      .select(`
        *,
        enrollments(full_name,email),
        programs(title)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCertificates(data as Certificate[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return {
    certificates,
    loading,
    refresh: fetchCertificates,
  };
}