"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useInternship() {
  const [loading, setLoading] = useState(true);

  const [program, setProgram] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);

  const loadInternship = useCallback(async () => {
    try {
      setLoading(true);

      // ================================
      // 1. GET LOGGED-IN USER
      // ================================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProgram(null);
        return;
      }

      // ================================
      // 2. GET STUDENT ENROLLMENT
      // ================================

      const { data: enrollment, error: enrollmentError } =
        await supabase
          .from("enrollments")
          .select("id, program_id")
          .eq("user_id", user.id)
          .single();

      if (enrollmentError || !enrollment) {
        console.error(
          "Enrollment error:",
          enrollmentError
        );

        setProgram(null);
        return;
      }

      const enrollmentId = enrollment.id;
      const programId = enrollment.program_id;

      // ================================
      // 3. PROGRAM
      // ================================

      const { data: programData } = await supabase
        .from("programs")
        .select("*")
        .eq("id", programId)
        .single();

      // ================================
      // 4. MODULES
      // ================================

      const { data: moduleData } = await supabase
        .from("course_syllabus")
        .select("*")
        .eq("program_id", programId)
        .order("id");

      const currentModules = moduleData ?? [];

      const syllabusIds = currentModules.map(
        (module) => module.id
      );

      // ================================
      // 5. TOPICS
      // ================================

      let topicData: any[] = [];

      if (syllabusIds.length > 0) {
        const { data } = await supabase
          .from("course_topics")
          .select("*")
          .in("syllabus_id", syllabusIds)
          .order("id");

        topicData = data ?? [];
      }

      // ================================
      // 6. LIVE PUBLISHED VIDEOS
      // ================================
      // IMPORTANT:
      // Directly use program_id.
      //
      // Admin adds Published video
      // -> automatically included here.

      const { data: videoData, error: videoError } =
        await supabase
          .from("course_videos")
          .select("*")
          .eq("program_id", programId)
          .eq("status", "Published")
          .order("sort_order");

      if (videoError) {
        console.error("Video error:", videoError);
      }

      const currentVideos = videoData ?? [];

      // ================================
      // 7. MATERIALS
      // ================================

      const { data: materialData } = await supabase
        .from("materials")
        .select("*")
        .eq("program_id", programId)
        .order("created_at");

      // ================================
      // 8. ASSIGNMENTS
      // ================================

      const { data: assignmentData } = await supabase
        .from("assignments")
        .select("*")
        .eq("program_id", programId)
        .order("created_at");

        // ================================
// READ MATERIALS
// ================================

const { data: materialViews } = await supabase
 .from("student_material_views")
.select("material_id")
.eq("student_id", enrollmentId);

const readMaterials = (materialViews ?? []).length;

// ================================
// SUBMITTED ASSIGNMENTS
// ================================

const { data: submittedAssignmentsData } = await supabase
 .from("student_assignment_submissions")
.select("assignment_id")
.eq("student_id", enrollmentId);

const submittedAssignments =
  (submittedAssignmentsData ?? []).length;


// ================================
// 9. GET COMPLETED VIDEOS
// ================================



const currentVideoIds = currentVideos.map(
  (video) => Number(video.id)
);


let completedVideoIds: number[] = [];

if (currentVideoIds.length > 0) {
  const { data: completedData } = await supabase
    .from("student_video_progress")
    .select("video_id")
   .eq("student_id", enrollmentId)
    .eq("completed", true)
    .in("video_id", currentVideoIds);

  completedVideoIds = (completedData ?? []).map(
    (item) => Number(item.video_id)
  );
}
const completedVideos = completedVideoIds.length;


let nextType: "video" | "material" | "assignment" | null = null;

let nextVideoId: number | null = null;
let nextMaterialId: number | null = null;
let nextAssignmentId: number | null = null;

for (const module of currentModules) {
  // Next video in this module
  const video = currentVideos.find(
    (v) =>
      v.syllabus_id === module.id &&
      !completedVideoIds.includes(Number(v.id))
  );

  if (video) {
    nextType = "video";
    nextVideoId = video.id;
    break;
  }

  // Next material in this module
  const material = (materialData ?? []).find(
    (m) =>
      m.syllabus_id === module.id &&
      !(materialViews ?? []).some(
        (x) => Number(x.material_id) === Number(m.id)
      )
  );

  if (material) {
    nextType = "material";
    nextMaterialId = material.id;
    break;
  }

  // Next assignment in this module
  const assignment = (assignmentData ?? []).find(
    (a) =>
      a.syllabus_id === module.id &&
      !(submittedAssignmentsData ?? []).some(
        (x) => Number(x.assignment_id) === Number(a.id)
      )
  );

  if (assignment) {
    nextType = "assignment";
    nextAssignmentId = assignment.id;
    break;
  }
}



  // ================================
// MODULE STATUS (LIVE)
// ================================

const readMaterialIds = new Set(
  (materialViews ?? []).map((item) => Number(item.material_id))
);

const submittedAssignmentIds = new Set(
  (submittedAssignmentsData ?? []).map((item) =>
    Number(item.assignment_id)
  )
);

const modulesWithStatus = currentModules.map((module) => {
  // Videos
  const moduleVideos = currentVideos.filter(
    (video) => video.syllabus_id === module.id
  );

  const totalModuleVideos = moduleVideos.length;

  const completedModuleVideos = moduleVideos.filter((video) =>
    completedVideoIds.includes(Number(video.id))
  ).length;

  // Materials
  const moduleMaterials = (materialData ?? []).filter(
    (material) => material.syllabus_id === module.id
  );

  const totalModuleMaterials = moduleMaterials.length;

  const completedModuleMaterials = moduleMaterials.filter(
    (material) => readMaterialIds.has(Number(material.id))
  ).length;

  // Assignments
  const moduleAssignments = (assignmentData ?? []).filter(
    (assignment) => assignment.syllabus_id === module.id
  );

  const totalModuleAssignments = moduleAssignments.length;

  const completedModuleAssignments = moduleAssignments.filter(
    (assignment) =>
      submittedAssignmentIds.has(Number(assignment.id))
  ).length;

  const totalItems =
    totalModuleVideos +
    totalModuleMaterials +
    totalModuleAssignments;

  const completedItems =
    completedModuleVideos +
    completedModuleMaterials +
    completedModuleAssignments;

  let status = "Not Started";

  if (totalItems > 0 && completedItems === totalItems) {
    status = "Completed";
  } else if (completedItems > 0) {
    status = "In Progress";
  }

  return {
    ...module,

    totalVideos: totalModuleVideos,
    completedVideos: completedModuleVideos,

    totalMaterials: totalModuleMaterials,
    completedMaterials: completedModuleMaterials,

    totalAssignments: totalModuleAssignments,
    completedAssignments: completedModuleAssignments,

    status,
  };
});
      // ================================
      // 10. CALCULATE LIVE PROGRESS
      // ================================

  
const totalVideos = currentVideos.length;

const totalMaterials =
  (materialData ?? []).length;

const totalAssignments =
  (assignmentData ?? []).length;

const totalItems =
  totalVideos +
  totalMaterials +
  totalAssignments;

const completedItems =
  completedVideos +
  readMaterials +
  submittedAssignments;

const calculatedProgress =
  totalItems === 0
    ? 0
    : Math.round(
        (completedItems / totalItems) * 100
      );

const safeProgress = Math.min(
  100,
  Math.max(0, calculatedProgress)
);
      // ================================
      // 11. EXISTING STUDENT PROGRESS
      // ================================

      const { data: existingProgress } =
        await supabase
          .from("student_progress")
          .select("*")
         .eq("student_id", enrollmentId)
          .maybeSingle();

      /*
        We calculate the live values here.

        Example:

        Admin videos = 5
        Completed = 5
        Progress = 100%

        Admin later adds 5 videos

        Admin videos = 10
        Completed = 5
        Progress = 50%
      */

const liveProgress = {
  ...(existingProgress ?? {}),

student_id: enrollmentId,

  videos_completed: completedVideos,
  total_videos: totalVideos,

  materials_completed: readMaterials,
  total_materials: totalMaterials,

  assignments_completed: submittedAssignments,
  total_assignments: totalAssignments,

  progress: safeProgress,

  next_type: nextType,

next_video_id: nextVideoId,

next_material_id: nextMaterialId,

next_assignment_id: nextAssignmentId,
};


await supabase
  .from("student_progress")
  .upsert(
    {
      ...liveProgress,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "student_id",
    }
  );

if (safeProgress === 100) {
  await supabase
    .from("enrollments")
    .update({
      course_status: "Completed",
      certificate_status: "Eligible",
    })
.eq("id", enrollment.id);
} else {
  await supabase
    .from("enrollments")
    .update({
      course_status: "In Progress",
      certificate_status: "Pending",
    })
  .eq("id", enrollment.id);
}

      // ================================
      // 12. UPDATE UI
      // ================================

      setProgram(programData);
    setModules(modulesWithStatus);
      setTopics(topicData);

      setVideos(currentVideos);

      setMaterials(materialData ?? []);

      setAssignments(assignmentData ?? []);

      setProgress(liveProgress);
    } catch (error) {
      console.error(
        "Error loading internship:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInternship();
  }, [loadInternship]);

  return {
    loading,

    program,

    modules,

    topics,

    videos,

    materials,

    assignments,

    progress,

    reload: loadInternship,
  };
}