"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useDashboard() {
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  const [videos, setVideos] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [completedVideos, setCompletedVideos] = useState<any[]>([]);

  const [nextVideo, setNextVideo] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

 const [stats, setStats] = useState({
  videosCompleted: 0,
  totalVideos: 0,

  materialsCompleted: 0,
  totalMaterials: 0,

  assignmentsCompleted: 0,
  totalAssignments: 0,

  daysRemaining: 0,

  certificateUnlocked: false,
});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

    // =======================================
// Logged-in User
// =======================================

const {
  data: { user },
} = await supabase.auth.getUser();


console.log("Current User Email:", user?.email);
console.log("Current User ID:", user?.id);

if (!user) {
  setLoading(false);
  return;
}



// =======================================
// Enrollment + Program
// =======================================



const { data: enrollment, error: enrollmentError } = await supabase
  .from("enrollments")
  .select("*")
  .eq("user_id", user.id)
  .maybeSingle();

if (enrollmentError) {
  console.error(enrollmentError);
  return;
}

if (!enrollment) {
  console.log("Enrollment not found for user:", user.id);
  return;
}

setStudent({
  id: enrollment.id,
  full_name: enrollment.full_name,
  email: enrollment.email,
});

const studentId = enrollment.id;
const programId = enrollment.program_id;

// Load program separately
const { data: programData, error: programError } = await supabase
  .from("programs")
  .select("*")
  .eq("id", programId)
  .maybeSingle();

if (programError) {
  console.error(programError);
}

setProgram(programData);




const { data: moduleData = [] } = await supabase
  .from("course_syllabus")
  .select("*")
  .eq("program_id", programId)
  .order("id");
// =======================================
// Student Progress
// =======================================

const { data: progressData } = await supabase
  .from("student_progress")
  .select("*")
  .eq("student_id", studentId)
  .maybeSingle();

// =======================================
// Videos
// =======================================

const { data: videosData = [] } = await supabase
  .from("course_videos")
  .select(
    `
      *,
      course_topics(
        id,
        topic,
        syllabus_id,
        course_syllabus(
          id,
          module_name
        )
      )
    `
  )
  .eq("program_id", programId)
  .eq("status", "Published")
  .order("sort_order");

setVideos(videosData ?? []);
console.log("Videos:", videosData);

// =======================================
// Materials
// =======================================

const { data: materialsData = [] } = await supabase
  .from("materials")
  .select("*")
  .eq("program_id", programId)
  .eq("status", "Published")
  .order("created_at");

setMaterials(materialsData ?? []);
// =======================================
// Assignments
// =======================================

const { data: assignmentsData = [] } = await supabase
  .from("assignments")
  .select("*")
  .eq("program_id", programId)
  .eq("status", "Published")
  .order("created_at");



  
setAssignments(assignmentsData ?? []);


console.log("Materials:", materialsData);
// =======================================
// Completed Videos
// =======================================
   const videoIds = (videosData ?? []).map((v: any) => Number(v.id));

let completedVideoIds: number[] = [];
let completedData: any[] = [];

if (videoIds.length > 0) {
  const { data } = await supabase
    .from("student_video_progress")
    .select("*")
    .eq("student_id", studentId)
    .eq("completed", true)
    .in("video_id", videoIds);

  completedData = data ?? [];

  completedVideoIds = completedData.map((x: any) =>
    Number(x.video_id)
  );

  setCompletedVideos(completedData);
}

const videosCompleted = completedVideoIds.length;

// =======================================
// Read Materials
// =======================================

const { data: materialViews } = await supabase
  .from("student_material_views")
  .select("material_id")
  .eq("student_id", studentId);

const materialIds = new Set(
  (materialViews ?? []).map((x: any) =>
    Number(x.material_id)
  )
);

const materialsCompleted = materialIds.size;

// =======================================
// Submitted Assignments
// =======================================

const { data: submissionData } = await supabase
  .from("student_assignment_submissions")
  .select("assignment_id")
  .eq("student_id", studentId);

const assignmentIds = new Set(
  (submissionData ?? []).map((x: any) =>
    Number(x.assignment_id)
  )
);

const assignmentsCompleted = assignmentIds.size;
      // ----------------------------


// ----------------------------
// Continue Learning (LIVE)
// ----------------------------

let nextType: "video" | "material" | "assignment" | null = null;

let nextVideoId: number | null = null;
let nextMaterialId: number | null = null;
let nextAssignmentId: number | null = null;

for (const module of (moduleData ?? [])) {  // Next Video
  const video = (videosData ?? []).find(
    (v: any) =>
      Number(v.course_topics?.syllabus_id) === Number(module.id) &&
      !completedVideoIds.includes(Number(v.id))
  );

  if (video) {
    nextType = "video";
    nextVideoId = video.id;

    setNextVideo({
      ...video,
      type: "video",
      module_name: module.module_name,
      topic_name: video.course_topics?.topic,
    });

    break;
  }

  // Next Material
  const material = (materialsData ?? []).find(
    (m: any) =>
      Number(m.syllabus_id) === Number(module.id) &&
      !materialIds.has(Number(m.id))
  );

  if (material) {
    nextType = "material";
    nextMaterialId = material.id;

    setNextVideo({
      ...material,
      type: "material",
      module_name: module.module_name,
    });

    break;
  }

  // Next Assignment
  const assignment = (assignmentsData ?? []).find(
    (a: any) =>
      Number(a.syllabus_id) === Number(module.id) &&
      !assignmentIds.has(Number(a.id))
  );

  if (assignment) {
    nextType = "assignment";
    nextAssignmentId = assignment.id;

    setNextVideo({
      ...assignment,
      type: "assignment",
      module_name: module.module_name,
    });

    break;
  }
}

if (!nextType) {
  setNextVideo(null);
}
// ----------------------------
// Live Progress
// ----------------------------

const totalVideos = (videosData ?? []).length;
const totalMaterials = (materialsData ?? []).length;
const totalAssignments = (assignmentsData ?? []).length;

const totalItems =
  totalVideos +
  totalMaterials +
  totalAssignments;

const completedItems =
  videosCompleted +
  materialsCompleted +
  assignmentsCompleted;

const overallProgress =
  totalItems === 0
    ? 0
    : Math.round(
        (completedItems / totalItems) * 100
      );

// ----------------------------
// Days Remaining
// ----------------------------

let daysRemaining = 0;

const endDate =
  enrollment.course_end_date;

if (endDate) {
  daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(endDate).getTime() -
        Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

// ----------------------------
// Certificate
// ----------------------------

const certificateUnlocked =
  totalVideos > 0 &&
  totalMaterials > 0 &&
  totalAssignments > 0 &&
  videosCompleted === totalVideos &&
  materialsCompleted === totalMaterials &&
  assignmentsCompleted === totalAssignments;

// ----------------------------
// Live Progress Object
// ----------------------------

const liveProgress = {
  ...(progressData ?? {}),

  student_id: studentId,
  program_id: programId,

  videos_completed: videosCompleted,
  total_videos: totalVideos,

  materials_completed: materialsCompleted,
  total_materials: totalMaterials,

  assignments_completed: assignmentsCompleted,
  total_assignments: totalAssignments,

  progress: overallProgress,

  next_type: nextType,
next_video_id: nextVideoId,
next_material_id: nextMaterialId,
next_assignment_id: nextAssignmentId,
};

setProgress(liveProgress);

// ----------------------------
// Dashboard Stats
// ----------------------------

setStats({
  videosCompleted,
  totalVideos,

  materialsCompleted,
  totalMaterials,

  assignmentsCompleted,
  totalAssignments,

  daysRemaining,

  certificateUnlocked,
});



      // Recent Activity
      // ----------------------------

      const activities: any[] = [];

    (completedData ?? [])
  .slice(0,5)
        .forEach((item: any) => {
       const video = (videosData ?? []).find(
            (v: any) => Number(v.id) === Number(item.video_id)
          );

          if (!video) return;

          activities.push({
            id: item.id,
            type: "video",
            title: video.title,
            date: item.updated_at || item.created_at,
          });
        });

      setRecentActivities(
      activities.sort(
  (a: any, b: any) =>
    new Date(b.date).getTime() -
    new Date(a.date).getTime()
)
      );
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {


        
      setLoading(false);
    }
  };


  

  return {
    loading,

    student,
    program,
    progress,

    videos,
    materials,
    assignments,

    completedVideos,

    nextVideo,

    recentActivities,

    stats,
  };
}