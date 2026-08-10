import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
  CreditCard,
} from "lucide-react";
import PaymentMethods from "../../../components/PaymentMethods";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch enrollment details
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!enrollment) notFound();

  // 2. Fetch program details
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", enrollment.program_id)
    .single();

  // 3. Fetch course specifics
  const { data: details } = await supabase
    .from("course_details")
    .select("*")
    .eq("program_id", enrollment.program_id)
    .single();

  // 4. Fetch the single active UPI & Bank configurations from upi_settings table
  const { data: upiSettings } = await supabase
    .from("upi_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  const amount = details?.price || program?.price || 0;

  const infoItems = [
    { label: "Full Name", value: enrollment.full_name },
    { label: "Email Address", value: enrollment.email },
    { label: "Mobile Number", value: enrollment.phone },
    { label: "College Name", value: enrollment.college },
    { label: "Branch", value: enrollment.branch },
    { label: "Academic Year", value: enrollment.year },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6e8] text-slate-800 dark:bg-[#07111f] dark:text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#7a8b22]/15 blur-3xl" />
        <div className="absolute top-20 -right-20 h-80 w-80 rounded-full bg-[#ffc107]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#9ab12f]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#7a8b22_1px,transparent_1px),linear-gradient(to_bottom,#7a8b22_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <header className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href={`/programs/${program?.id}`}
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#798321]/20 bg-transparent text-[#798321] transition-all duration-300 hover:border-[#798321] hover:bg-[#798321]/10"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[5px] text-[#798321]">
              RAKVIH FOUNDATION
            </p>
            <h1 className="mt-1 text-xl font-black text-[#405015] dark:text-white">
              Secure Payment
            </h1>
          </div>

          <div className="flex items-center gap-2 text-[#798321]">
            <Lock size={16} />
            <span className="text-xs font-semibold uppercase tracking-[3px]">
              SSL Secure
            </span>
          </div>
        </div>
      </header>

      <section className="relative z-20 -mt-8 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2 lg:mt-10">
              <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/85 shadow-[0_18px_55px_rgba(102,118,29,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1728]/85">
                <div className="border-b border-[#7a8b22]/10 bg-[#fff8de] px-5 py-4 dark:border-white/10 dark:bg-[#0f1b2e] sm:px-7">
                  <p className="text-[9px] font-bold uppercase tracking-[4px] text-[#7a8b22] dark:text-[#b7c86a]">
                    Student Information
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#404d12] dark:text-white sm:text-2xl">
                    Enrollment Details
                  </h2>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:gap-4 sm:p-7">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] p-3 dark:border-white/10 dark:bg-white/5 sm:p-4"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[3px] text-[#7a8b22] dark:text-[#b7c86a]">
                        {item.label}
                      </p>
                      <h3 className="mt-2 text-xs font-semibold text-slate-700 dark:text-white sm:text-sm">
                        {item.value}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/85 shadow-[0_18px_55px_rgba(102,118,29,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1728]/85">
                <div className="border-b border-[#7a8b22]/10 px-5 py-4 dark:border-white/10 sm:px-7">
                  <p className="text-[9px] font-bold uppercase tracking-[4px] text-[#7a8b22] dark:text-[#b7c86a]">
                    Payment Method
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#404d12] dark:text-white sm:text-2xl">
                    Complete Payment
                  </h2>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400 sm:text-xs">
                    Select your preferred payment option and complete your internship enrollment securely.
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  {/* Passing fetched upiSettings to the Client Component */}
                  <PaymentMethods
                    enrollmentId={enrollment.id}
                    amount={amount}
                    upiSettings={upiSettings}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 lg:pt-10">
              <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/85 shadow-[0_18px_55px_rgba(102,118,29,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1728]/85">
                <div className="relative">
                  <Image
                    src={program?.image || "/images/course-placeholder.jpg"}
                    alt={program?.title || "Program"}
                    width={500}
                    height={250}
                    className="h-40 w-full object-cover sm:h-48"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="p-4 sm:p-5">
                  <span className="inline-flex rounded-full bg-[#7a8b22]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[3px] text-[#7a8b22] dark:bg-blue-500/10 dark:text-blue-300">
                    {program?.category}
                  </span>

                  <h2 className="mt-3 text-lg font-black text-[#404d12] dark:text-white sm:text-xl">
                    {program?.title}
                  </h2>

                  <div className="mt-4 space-y-2 rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] p-3 dark:border-white/10 dark:bg-white/5 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Duration
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-white">
                        {details?.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Course Fee
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-white">
                        ₹{amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        GST
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        ₹0
                      </span>
                    </div>

                    <div className="border-t border-dashed border-[#7a8b22]/20 pt-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          Total
                        </span>
                        <span className="text-xl font-black text-[#7a8b22]">
                          ₹{amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/85 shadow-[0_18px_55px_rgba(102,118,29,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1728]/85">
                <div className="bg-gradient-to-r from-[#66761d] via-[#7c8c24] to-[#f5bf18] px-4 py-3 sm:px-5">
                  <h3 className="text-base font-black text-white">
                    Secure Payment
                  </h3>
                  <p className="mt-1 text-[11px] text-white/80">
                    Your transaction is completely protected.
                  </p>
                </div>

                <div className="space-y-3 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7a8b22]/10">
                      <Lock size={16} className="text-[#7a8b22]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#404d12] dark:text-white">
                        SSL Encryption
                      </h4>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                        All payment information is encrypted using industry standard SSL security.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7a8b22]/10">
                      <ShieldCheck size={16} className="text-[#7a8b22]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#404d12] dark:text-white">
                        Trusted Payment
                      </h4>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                        Your payment will be verified instantly after successful checkout.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7a8b22]/10">
                      <CheckCircle2 size={16} className="text-[#7a8b22]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#404d12] dark:text-white">
                        Instant Activation
                      </h4>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                        Once payment is successful your enrollment will be activated immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    <BadgeCheck size={14} className="text-[#7a8b22]" />
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Designed for safe and smooth checkout.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] px-3 py-2 dark:border-white/10 dark:bg-white/5">
                    <CreditCard size={14} className="text-[#7a8b22]" />
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Multiple payment methods supported.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-20 mt-8 border-t border-[#7a8b22]/10 bg-white/70 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#081525]/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            © 2026 <span className="font-bold text-[#7a8b22]">RAKVIH Foundation</span>. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#7a8b22]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[3px] text-[#7a8b22]">
              Secure Checkout
            </span>
            <span className="rounded-full bg-[#f5bf18]/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[3px] text-[#b8860b]">
              SSL Protected
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}