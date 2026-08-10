"use client";

import {
  Users,
  UserCheck,
  IndianRupee,
  CreditCard,
  GraduationCap,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  pendingPayments: number;
  totalPrograms: number;
  certificatesIssued: number;
}

export default function DashboardCards() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalPrograms: 0,
    certificatesIssued: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadStats();
  }, []);

  const cards = [
    { title: "Total Students", value: stats.totalStudents, icon: Users },
    { title: "Active Students", value: stats.activeStudents, icon: UserCheck },
    { title: "Total Revenue", value: stats.totalRevenue, icon: IndianRupee, prefix: "₹" },
    { title: "Pending Payments", value: stats.pendingPayments, icon: CreditCard },
    { title: "Active Programs", value: stats.totalPrograms, icon: GraduationCap },
    { title: "Certificates Issued", value: stats.certificatesIssued, icon: Award },
  ];

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mt-6"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#1E3A5F] 
                       bg-white dark:bg-[#081525] p-3 shadow-sm transition-all duration-300
                       w-full h-[98px]"   // ← Ultra small height
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-1">
                <p className="text-[8px] font-bold uppercase tracking-[1px] text-[#5F6F8A] dark:text-[#C7D2FE]">
                  {card.title}
                </p>

<h2 className="mt-1 text-[16px] font-black text-[#17310F] dark:text-white leading-none">                  {card.prefix}
                  {inView && (
                    <CountUp
                      end={card.value}
                      duration={1.6}
                      separator=","
                    />
                  )}
                </h2>
              </div>

              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F7F8EE] dark:bg-[#10233B] flex-shrink-0">
                <Icon size={15} className="text-[#798321] dark:text-[#FFC107]" />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-2 left-3 right-3">
              <div className="flex items-center justify-between text-[7px]">
                <span className="font-medium text-[#798321] dark:text-[#FFC107]">
                  Now
                </span>
                <span className="text-[#9CA3AF] dark:text-[#64748B]">
                  30d
                </span>
              </div>

              <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-[#EEF2E2] dark:bg-[#10233B]">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#798321] via-[#C79A12] to-[#FFC107]" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}