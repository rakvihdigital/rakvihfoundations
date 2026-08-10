"use client";

import DashboardHero from "@/components/student/dashboard/DashboardHero";
import DashboardStats from "@/components/student/dashboard/DashboardStats";
import ContinueLearning from "@/components/student/dashboard/ContinueLearning";
import QuickActions from "@/components/student/dashboard/QuickActions";
import RecentActivity from "@/components/student/dashboard/RecentActivity";
import UpcomingAssignments from "@/components/student/dashboard/UpcomingAssignments";

import { useDashboard } from "@/hooks/useDashboard";

export default function StudentDashboardPage() {
  const {
    loading,
    student,
    program,
    progress,
    nextVideo,
    recentActivities,
    assignments,
    stats,
  } = useDashboard();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#FFC107] border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500 dark:text-neutral-400">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Hero */}
      <DashboardHero
        student={student}
        program={program}
        progress={progress}
        nextVideo={nextVideo}
      />

      {/* Stats */}
      <DashboardStats
        videosCompleted={stats.videosCompleted}
        totalVideos={stats.totalVideos}
        materialsCompleted={stats.materialsCompleted}
        totalMaterials={stats.totalMaterials}
        assignmentsCompleted={stats.assignmentsCompleted}
        totalAssignments={stats.totalAssignments}
        daysRemaining={stats.daysRemaining}
        certificateUnlocked={stats.certificateUnlocked}
      />

      {/* Continue Learning */}
      <ContinueLearning
        nextVideo={nextVideo}
        progress={progress}
      />

      {/* Quick Actions (if needed based on imports) */}
      <div className="hidden lg:block">
        {/* <QuickActions /> */}
      </div>

      {/* Recent Activity + Upcoming Assignments */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Activity */}
        <RecentActivity
          activities={recentActivities}
        />

        {/* Upcoming Assignments */}
        <UpcomingAssignments
          assignments={assignments.filter(
            (item: any) => item.status !== "Submitted"
          )}
        />

      </div>

    </div>
  );
}