"use client";

import { useEffect, useState } from "react";
import { CreditCard, UserPlus } from "lucide-react";

interface Activity {
  type: string;
  title: string;
  date: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/admin/dashboard/recent-activity")
      .then((res) => res.json())
      .then(setActivities);
  }, []);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diff = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return activityDate.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-[#081525] 
                    border border-gray-100 dark:border-blue-950 
                    rounded-2xl shadow-md p-3.5 h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl flex items-center justify-center text-xs shadow"
               style={{
                 background: "linear-gradient(90deg, #798321 0%, #E7B417 55%, #F5BC10 100%)"
               }}>
            📊
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-[9px] text-gray-500 dark:text-slate-400 -mt-0.5">
              Latest actions
            </p>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-slate-400 text-xs">
          No recent activity found.
        </div>
      ) : (
        <div className="max-h-[235px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="group flex items-center justify-between 
                         bg-white dark:bg-[#081525] 
                         border border-gray-200 dark:border-blue-900/50 
                         hover:border-[#E7B417] dark:hover:border-[#F5BC10]
                         rounded-xl p-3 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                  style={{
                    background: "linear-gradient(90deg, #798321 0%, #E7B417 55%, #F5BC10 100%)"
                  }}
                >
                  {activity.type === "Payment" ? (
                    <CreditCard size={15} className="text-white" />
                  ) : (
                    <UserPlus size={15} className="text-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-gray-900 dark:text-white leading-tight truncate">
                    {activity.title}
                  </h3>
                  <span 
                    className="inline-block mt-1 px-2 py-px text-[9px] font-medium rounded-full text-white"
                    style={{
                      background: "linear-gradient(90deg, #798321 0%, #E7B417 55%, #F5BC10 100%)"
                    }}
                  >
                    {activity.type}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-gray-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  {getTimeAgo(activity.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}