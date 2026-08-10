"use client";
// Public page: app/tuition/pay/page.tsx
// Parent enters phone number, sees their tuition(s), pays outstanding fee via Razorpay.

import { useState } from "react";
import Script from "next/script";
import clsx from "clsx";

type TuitionResult = {
  application_id: number;
  assignment_id: number | null;
  student_name: string;
  subject: string;
  teacher_name: string | null;
  fee_amount: number | null;
  payment_status: string;
  application_status: string;
  total_paid: number;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const paymentStyles: Record<string, string> = {
  not_assigned: "bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400",
  unpaid: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  partial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-amber-400",
  paid: "bg-green-100 text-green-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function TuitionPayPage() {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<TuitionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/tuition/lookup?phone=${encodeURIComponent(phone.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setResults([]);
        return;
      }
      setResults(json.data || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (item: TuitionResult) => {
    if (!item.assignment_id || !item.fee_amount) return;
    setError("");
    setPayingId(item.assignment_id);

    try {
      // Step 1: create order on the server
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: item.assignment_id }),
      });
      const orderJson = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderJson.error || "Could not start payment.");
        setPayingId(null);
        return;
      }

      // Step 2: open Razorpay checkout
      const options = {
        key: orderJson.key_id,
        amount: orderJson.amount,
        currency: orderJson.currency,
        order_id: orderJson.order_id,
        name: "RAKVIH Solutions",
        description: `Tuition fee — ${item.student_name} (${item.subject})`,
        handler: async function (response: any) {
          // Step 3: verify payment on the server
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                assignment_id: item.assignment_id,
                amount: orderJson.amount / 100, // convert paise back to rupees
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) {
              setError(verifyJson.error || "Payment verification failed.");
            } else {
              handleSearch(); // refresh the list to show updated payment status
            }
          } catch {
            setError("Payment succeeded but verification failed. Please contact support.");
          } finally {
            setPayingId(null);
          }
        },
        modal: {
          ondismiss: () => setPayingId(null),
        },
        theme: { color: "#798321" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Something went wrong starting the payment.");
      setPayingId(null);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-3xl font-extrabold text-[#798321] dark:text-[#FFC107]">
          Pay Tuition Fee
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-300">
          Enter the phone number you used when applying to find your tuition and pay online.
        </p>

        <div className="mt-6 flex gap-3">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Registered phone number"
            className="flex-1 rounded-xl border border-[#798321]/25 px-4 py-3 text-sm outline-none focus:border-[#798321] dark:bg-[#0a0a0a] dark:border-neutral-800 dark:text-white dark:focus:border-[#FFC107]"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] px-6 py-3 text-sm font-bold text-white disabled:opacity-60 dark:text-black"
          >
            {loading ? "Searching..." : "Find"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}

        {searched && !loading && results.length === 0 && !error && (
          <p className="mt-8 text-center text-gray-400 dark:text-neutral-500">
            No tuition applications found for this phone number.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {results.map((item) => (
            <div
              key={item.application_id}
              className="rounded-2xl border border-[#E8ECE5] bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0a0a0a]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#24310F] dark:text-white">
                    {item.student_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    {item.subject}
                    {item.teacher_name && ` · Teacher: ${item.teacher_name}`}
                  </p>
                </div>
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                    paymentStyles[item.payment_status]
                  )}
                >
                  {item.payment_status.replace("_", " ")}
                </span>
              </div>

              {item.fee_amount ? (
                <div className="mt-4 flex items-center justify-between border-t border-[#E8ECE5] pt-4 dark:border-neutral-800">
                  <div className="text-sm">
                    <p className="text-gray-500 dark:text-neutral-400">
                      Total fee: <span className="font-semibold text-[#24310F] dark:text-white">₹{item.fee_amount}</span>
                    </p>
                    <p className="text-gray-500 dark:text-neutral-400">
                      Paid so far: <span className="font-semibold text-green-600 dark:text-emerald-400">₹{item.total_paid}</span>
                    </p>
                  </div>
                  {item.payment_status !== "paid" && (
                    <button
                      onClick={() => handlePay(item)}
                      disabled={payingId === item.assignment_id}
                      className="rounded-xl bg-[#798321] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6B7328] disabled:opacity-60 dark:bg-[#FFC107] dark:text-black dark:hover:bg-[#e6ae00]"
                    >
                      {payingId === item.assignment_id ? "Processing..." : "Pay Now"}
                    </button>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-400 dark:text-neutral-500">
                  A teacher hasn't been assigned yet — payment will be available once assigned.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}