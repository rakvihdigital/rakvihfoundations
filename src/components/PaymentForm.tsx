"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { createPayment } from "@/lib/payment";
import { updateEnrollment } from "@/lib/enrollment";

interface Props {
  enrollmentId: number;
  amount: number;
}

export default function PaymentForm({ enrollmentId, amount }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const transactionId = "TXN" + Date.now();

      const payload = {
        enrollment_id: enrollmentId,
        amount,
        payment_method: "UPI",
        payment_status: "Paid",
        transaction_id: transactionId,
      };

console.log("Payload:", payload);

const { data, error } = await createPayment(payload);

console.log("Inserted Payment:", data);
console.log("Insert Error:", error);
if (error) {
  alert(error.message);
  return;
}

const { error: updateError } = await updateEnrollment(enrollmentId, {
  payment_status: "Paid",
  enrollment_status: "Confirmed",
  transaction_id: transactionId,
  payment_method: "UPI",
});

if (updateError) {
  alert(updateError.message);
  return;
}

router.push(`/payment-success/${enrollmentId}`);



    } catch (err) {
      console.error("Catch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_55px_rgba(102,118,29,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1728]/85">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-[#7a8b22]/10 p-2.5 dark:bg-white/5">
            <CreditCard size={18} className="text-[#7a8b22] dark:text-[#8fd3ff]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#404d12] dark:text-white">
              Payment Summary
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-[3px] text-[#7a8b22] dark:text-[#8fd3ff]">
              Secure Payment Gateway
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-3">
          {[
            { label: "Internship Fee", value: `₹${amount}` },
            { label: "GST (0%)", value: "₹0" },
            { label: "Platform Fee", value: "₹0" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <span className="font-semibold text-slate-700 dark:text-white">
                {item.value}
              </span>
            </div>
          ))}

          <div className="border-t border-dashed border-[#7a8b22]/20 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[3px] text-slate-400">
                Total Amount
              </span>
              <span className="text-xl font-black text-[#7a8b22] dark:text-[#b7c86a]">
                ₹{amount}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7a8b22] via-[#9cb427] to-[#ffc107] px-6 py-4 text-xs font-black uppercase tracking-[3px] text-white shadow-[0_18px_40px_rgba(121,131,33,0.24)] transition hover:shadow-[0_22px_52px_rgba(121,131,33,0.32)] disabled:opacity-70 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-400"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
          {loading ? "Processing..." : `Complete Payment ₹${amount}`}
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[2px] text-green-700/80 dark:text-green-400/80">
            <ShieldCheck size={13} />
            SSL Secured
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[2px] text-slate-400">
            <CheckCircle2 size={13} />
            100% Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}