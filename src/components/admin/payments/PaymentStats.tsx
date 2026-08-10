"use client";

import {
  CreditCard,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

export default function PaymentStats({ payments }: { payments: any[] }) {
  const total = payments.length;

 const paid = payments.filter(
  (p) => p.payment_status === "Paid"
).length;

const completed = payments.filter(
  (p) => p.payment_status === "Completed"
).length;
  const totalAmount = payments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

 const cards = [
  {
    label: "TOTAL PAYMENTS",
    value: total,
    color: "#6B7328",
    icon: CreditCard,
  },
  {
    label: "PAID",
    value: paid,
    color: "#6B7328",
    icon: CheckCircle2,
  },
  {
    label: "COMPLETED",
    value: completed,
    color: "#6B7328",
    icon: CheckCircle2,
  },
  {
    label: "TOTAL AMOUNT",
    value: `₹${totalAmount}`,
    color: "#6B7328",
    icon: IndianRupee,
  },
];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <div
            key={i}
          className="
  bg-white dark:bg-[#0F172A]
  border border-[#E8ECE5] dark:border-slate-700
  rounded-2xl p-3.5
  hover:shadow transition-all
"
          >
            {/* Label + Icon */}
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-slate-400 font-medium">
                {card.label}
              </p>

              <Icon
                size={18}
                strokeWidth={2}
                className="text-[#6B7328] dark:text-[#FFC107] flex-shrink-0"
              />
            </div>

            {/* Value */}
<p className="text-2xl font-bold text-[#24310F] dark:text-white mt-1.5">              {card.value}
            </p>

            {/* Animated Progress Line */}
            <div className="mt-4 h-0.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6B7328] to-[#FFC107] rounded-full animate-progress-fill"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}