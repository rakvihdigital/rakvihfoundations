"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import ProfileHero from "@/components/student/profile/ProfileHero";
import PersonalInformation from "@/components/student/profile/PersonalInformation";
import AcademicInformation from "@/components/student/profile/AcademicInformation";
import AccountInformation from "@/components/student/profile/AccountInformation";

const supabase = createClient();

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Enrollment
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!enrollment) {
        setLoading(false);
        return;
      }

      setStudent(enrollment);

      // Program
      const { data: programData } = await supabase
        .from("programs")
        .select("*")
        .eq("id", enrollment.program_id)
        .single();

      setProgram(programData);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FFC107] border-t-transparent" />

          <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Hero */}
      <ProfileHero
        student={student}
        program={program}
      />

      {/* Personal + Academic */}
      <div className="grid gap-5 xl:grid-cols-2">

        <PersonalInformation
          student={student}
        />

        <AcademicInformation
          student={student}
          program={program}
        />

      </div>

      {/* Account */}
      <AccountInformation
        student={student}
        program={program}
      />

    </div>
  );
}