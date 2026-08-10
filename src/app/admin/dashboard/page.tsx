import DashboardCards from "@/components/admin/DashboardCards";
import RevenueChart from "@/components/admin/RevenueChart";
import CourseDistribution from "@/components/admin/CourseDistribution";
import RecentActivity from "@/components/admin/RecentActivity";
import RecentPayments from "@/components/admin/RecentPayments";
import RecentRegistrations from "@/components/admin/RecentRegistrations";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
<h1 className="text-xl font-semibold text-[#24310F] dark:text-white tracking-tight">      
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Welcome to the RAKVIH Foundation Admin Dashboard
        </p>
      </div>

      {/* Statistics Cards */}
      <DashboardCards />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RevenueChart />
        <CourseDistribution />
      </div>

      {/* Recent Activity */}
      <RecentActivity />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentRegistrations />
        <RecentPayments />
      </div>
    </div>
  );
}