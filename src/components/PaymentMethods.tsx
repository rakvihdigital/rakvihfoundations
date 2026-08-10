"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateEnrollment } from "@/lib/enrollment";
import {
  Smartphone,
  Landmark,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { createPayment } from "@/lib/payment";

interface Props {
  enrollmentId: number;
  amount: number | string;
  upiSettings?: {
    upi_id?: string;
    qr_code_image?: string;
    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
    account_name?: string;
  } | null;
}

export default function PaymentMethods({ enrollmentId, amount, upiSettings }: Props) {
  const router = useRouter();
  const [method, setMethod] = useState("upi");

  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function completePayment(methodName: string) {
    try {
      setLoading(true);

      if (!transactionId) {
        alert("Enter Transaction ID");
        return;
      }

      if (!paymentScreenshot) {
        alert("Upload Payment Screenshot");
        return;
      }

      const supabase = createClient();
      setUploading(true);

      const fileExt = paymentScreenshot.name.split(".").pop();
      const fileName = `${enrollmentId}-${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, paymentScreenshot);

      if (uploadError) {
        alert(JSON.stringify(uploadError, null, 2));
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(filePath);

      const screenshotUrl = publicUrlData.publicUrl;
      setUploading(false);

      const { error } = await createPayment({
        enrollment_id: enrollmentId,
        amount: Number(amount),
        payment_method: methodName,
        payment_status: "Paid",
        transaction_id: transactionId,
        receipt_url: screenshotUrl,
        receipt_name: fileName,
      });

      if (error) throw error;

      const { error: updateError } = await updateEnrollment(enrollmentId, {
        payment_status: "Paid",
        enrollment_status: "Pending",
        transaction_id: transactionId,
        payment_method: methodName,
        payment_screenshot: screenshotUrl,
      });

      if (updateError) {
        alert(updateError.message);
        return;
      }

      router.push(`/payment-success/${enrollmentId}`);
    } catch (err: any) {
      console.error("Payment Error:", err);
      alert(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-base font-black text-[#404d12] dark:text-white sm:text-lg">
          Select Payment Method
        </h2>
        <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
          Choose your preferred payment option.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full">
        <button
          type="button"
          onClick={() => setMethod("upi")}
          className={`min-h-[110px] w-full rounded-2xl border p-5 text-left transition ${
            method === "upi"
              ? "border-[#7a8b22] bg-[#fbfcf6] dark:border-[#8fd3ff] dark:bg-white/5"
              : "border-[#7a8b22]/15 bg-white hover:border-[#7a8b22]/40 dark:border-white/10 dark:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a8b22]/10 text-[#7a8b22] dark:bg-blue-500/10 dark:text-[#8fd3ff]">
              <Smartphone size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#404d12] dark:text-white">
                UPI
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                PhonePe, GPay, Paytm
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMethod("bank")}
          className={`rounded-2xl border p-4 text-left transition ${
            method === "bank"
              ? "border-[#7a8b22] bg-[#fbfcf6] dark:border-[#8fd3ff] dark:bg-white/5"
              : "border-[#7a8b22]/15 bg-white hover:border-[#7a8b22]/40 dark:border-white/10 dark:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a8b22]/10 text-[#7a8b22] dark:bg-blue-500/10 dark:text-[#8fd3ff]">
              <Landmark size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#404d12] dark:text-white">
                Bank
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Direct Bank Transfer
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-5 rounded-[26px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_55px_rgba(102,118,29,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a1728]/85">
        {method === "upi" && (
          <div>
            <h3 className="text-sm font-black text-[#404d12] dark:text-white">
              UPI Payment
            </h3>
            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Scan the QR code using any UPI app.
            </p>

            <div className="mt-5 flex flex-col items-center">
              <div className="rounded-3xl border border-[#7a8b22]/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <img
                  src={upiSettings?.qr_code_image || "/images/dummy-qr.png"}
                  alt="QR Scanner"
                  className="h-44 w-44 sm:h-52 sm:w-52 object-contain"
                />
              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-[3px] text-[#7a8b22] dark:text-[#8fd3ff]">
                UPI ID
              </p>
              <h4 className="mt-1 text-lg font-black text-[#404d12] dark:text-white sm:text-xl">
                {upiSettings?.upi_id || "rakvihfoundation@upi"}
              </h4>

              <div className="mt-5 w-full rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Amount
                  </span>
                  <span className="text-xl font-black text-[#7a8b22] dark:text-[#b7c86a]">
                    ₹{amount}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-[#404d12] dark:text-white">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter Transaction Reference Number"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-[#798321] focus:ring-4 focus:ring-[#798321]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-[#404d12] dark:text-white">
                    Upload Payment Screenshot
                  </label>
                  <label className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white transition hover:border-[#798321] hover:bg-[#fbfcf6] dark:border-white/10 dark:bg-white/5">
                    <div className="mb-2 text-4xl">📤</div>
                    <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Click to upload screenshot
                    </p>
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setPaymentScreenshot(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {paymentScreenshot && (
                    <p className="mt-2 text-center text-xs font-medium text-green-600">
                      ✓ {paymentScreenshot.name}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => completePayment("UPI")}
                disabled={loading || uploading}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#798321] to-[#FFC107] text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Complete Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {method === "bank" && (
          <div>
            <h3 className="text-sm font-black text-[#404d12] dark:text-white">
              Bank Transfer
            </h3>
            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Transfer the amount to the bank account below and upload proof.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] p-4 dark:border-white/10 dark:bg-white/5">
              <h4 className="text-sm font-semibold text-[#404d12] dark:text-white">
                {upiSettings?.bank_name || "Bank Details"}
              </h4>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-xs">Account Name</span>
                <span className="text-xs font-medium text-slate-800 dark:text-white">
                  {upiSettings?.account_name || "RAKVIH FOUNDATION"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-xs">Account Number</span>
                <span className="text-xs font-medium text-slate-800 dark:text-white">
                  {upiSettings?.account_number || "5020 0012 3456 78"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-xs">IFSC Code</span>
                <span className="text-xs font-medium text-slate-800 dark:text-white">
                  {upiSettings?.ifsc_code || "HDFC0001234"}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#7a8b22]/10 bg-[#fbfcf6] p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Amount</span>
                <span className="text-xl font-black text-[#7a8b22] dark:text-[#b7c86a]">
                  ₹{amount}
                </span>
              </div>
            </div>

            <div className="mt-6 w-full">
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#404d12] dark:text-white">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter Transaction Reference Number"
                  className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-5 text-sm outline-none focus:border-[#798321] focus:ring-2 focus:ring-[#798321]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-[#404d12] dark:text-white">
                  Upload Payment Screenshot
                </label>
                <label className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-[#fafaf7] transition hover:border-[#798321] dark:border-white/10 dark:bg-white/5">
                  <div className="mb-2 text-4xl">📤</div>
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Click to upload screenshot
                  </p>
                  <p className="mt-1 text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setPaymentScreenshot(e.target.files?.[0] || null)
                    }
                  />
                </label>
                {paymentScreenshot && (
                  <p className="mt-2 text-center text-xs font-medium text-green-600">
                    ✓ {paymentScreenshot.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => completePayment("BANK")}
              disabled={loading || uploading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7a8b22] via-[#9cb427] to-[#ffc107] px-6 py-4 text-xs font-black uppercase tracking-[3px] text-white shadow-[0_18px_40px_rgba(121,131,33,0.24)] transition disabled:opacity-60 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-400"
            >
              {loading || uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Landmark size={16} />
                  Complete Payment
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 px-1">
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
  );
}