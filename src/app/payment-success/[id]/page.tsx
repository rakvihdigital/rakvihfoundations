import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import DownloadReceiptButton from "@/components/DownloadReceiptButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaymentSuccessPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!enrollment) {
    notFound();
  }

 const { data: payment, error: paymentError } = await supabase
  .from("payments")
  .select("*")
  .eq("enrollment_id", enrollment.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

console.log("PAYMENT:", payment);
console.log("PAYMENT ERROR:", paymentError);

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", enrollment.program_id)
    .single();

  return (
    <main className="min-h-screen bg-[#F8FBF5] dark:bg-[#081525]">
      
      {/* Container for Back Button and Cards */}
      <section className="mx-auto max-w-3xl px-6 pt-6">
        
        {/* Back Button */}
        <Link
          href="/"
          className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#7a8b22]/20 bg-white text-[#7a8b22] shadow-sm transition hover:bg-[#7a8b22] hover:text-white dark:border-white/10 dark:bg-[#111827] dark:text-[#8fd3ff]"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Hero Card */}
        <div className="rounded-[30px] border border-[#7a8b22]/10 bg-white px-8 py-8 shadow-[0_18px_55px_rgba(102,118,29,0.10)] dark:border-white/10 dark:bg-[#111827]">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
              <CheckCircle2 size={30} className="text-green-600" />
            </div>
          </div>

          <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[4px] text-[#7a8b22] dark:text-[#8fd3ff]">
            PAYMENT COMPLETED
          </p>

          <h1 className="mt-2 text-center text-2xl font-black text-[#3E4A12] dark:text-white">
            Payment Successful
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-center text-[13px] leading-6 text-slate-500 dark:text-slate-400">
            Your internship enrollment has been confirmed successfully.
            Your payment has been verified and your receipt is ready.
          </p>
        </div>

        {/* Details Card */}
        <div className="mt-7 rounded-[30px] border border-[#7a8b22]/10 bg-white p-8 shadow-[0_18px_55px_rgba(102,118,29,0.10)] dark:border-white/10 dark:bg-[#111827]">
          <h2 className="text-lg font-black text-[#3E4A12] dark:text-white">
            Enrollment Details
          </h2>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            Payment verified successfully.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#7a8b22]">Student Name</p>
              <h3 className="mt-2 text-[15px] font-semibold text-slate-700 dark:text-white">{enrollment.full_name}</h3>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#7a8b22]">Course</p>
              <h3 className="mt-2 text-[15px] font-semibold text-slate-700 dark:text-white">{program?.title}</h3>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#7a8b22]">Transaction ID</p>
              <h3 className="mt-2 break-all text-[13px] font-semibold text-slate-700 dark:text-white">{payment?.transaction_id}</h3>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#7a8b22]">Payment Method</p>
              <h3 className="mt-2 text-[15px] font-semibold text-slate-700 dark:text-white">{payment?.payment_method}</h3>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#7a8b22]">Payment Status</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[13px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                  {payment?.payment_status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#7a8b22]">Amount Paid</p>
              <h2 className="mt-2 text-xl font-black text-[#7a8b22] dark:text-[#b7c86a]">₹{payment?.amount}</h2>
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-6 rounded-2xl border border-[#7a8b22]/10 bg-[#F8FBF3] p-4 dark:border-blue-500/20 dark:bg-[#0D2238]">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#405015] dark:text-blue-300">Enrollment Confirmed</h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-500 dark:text-slate-400">
                  Your payment has been received successfully. You can now download your payment receipt or continue to your student dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
        <div className="mt-6 flex justify-center">
  <DownloadReceiptButton
    enrollment={enrollment}
    payment={payment}
    program={program}
  />
</div>
        </div>
      </section>
    </main>
  );
}