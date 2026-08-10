import DashboardCards from "@/components/admin/DashboardCards";
import RevenueChart from "@/components/admin/RevenueChart";
import CourseDistribution from "@/components/admin/CourseDistribution";
import RecentRegistrations from "@/components/admin/RecentRegistrations";
import RecentPayments from "@/components/admin/RecentPayments";
import RecentActivity from "@/components/admin/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1
          className="
          text-4xl
          lg:text-5xl
          font-bold

          text-gray-900
          dark:text-white

          tracking-tight
          "
        >
          Dashboard
        </h1>

        <p
          className="
          mt-2

          text-sm
          lg:text-base

          text-gray-500
          dark:text-gray-400
          "
        >
          Welcome back! Here's an overview of your internship platform.
        </p>

      </div>

      {/* Dashboard Cards */}

      <DashboardCards />
      <RevenueChart />
      <CourseDistribution />
      <RecentRegistrations />
      <RecentPayments />
      <RecentActivity />
    </div>
  );
}