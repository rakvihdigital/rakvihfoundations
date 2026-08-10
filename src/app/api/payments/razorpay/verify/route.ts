// src/app/api/payments/razorpay/verify/route.ts
// Called after Razorpay checkout succeeds on the frontend.
// Verifies the payment signature (proves it's a genuine, untampered payment
// from Razorpay) before recording it — never trust the frontend's "success"
// callback alone, since anyone could call this endpoint with fake data otherwise.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      assignment_id,
      amount, // in rupees, not paise — what the parent was shown/charged
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !assignment_id ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    // Recreate the expected signature: HMAC-SHA256 of "order_id|payment_id"
    // using your Razorpay secret key. If it doesn't match, the payment is
    // not genuine (or was tampered with) — reject it.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Razorpay signature mismatch — possible tampering.");
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Signature is valid — record the payment
// Signature is valid — record the payment
const { error: insertError } = await supabaseAdmin
  .from("tuition_payments")
  .insert({
    assignment_id,
    amount_paid: amount,
    payment_mode: "razorpay",
    transaction_ref: razorpay_payment_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paid_on: new Date().toISOString().slice(0, 10),
  });

if (insertError) {
  console.error("Error recording payment:", insertError);
  return NextResponse.json({ error: insertError.message }, { status: 500 });
}

// NEW: mark the current billing cycle as paid so the dashboard unlocks.
// Match on assignment_id + the order_id we generated for this cycle
// (set when the order was created) so we update the exact cycle that was
// being paid, not just "any due cycle" for this assignment.
const { data: updatedCycle, error: cycleError } = await supabaseAdmin
  .from("tuition_billing_cycles")
  .update({
    status: "paid",
    paid_at: new Date().toISOString(),
    razorpay_order_id,
    razorpay_payment_id,
  })
  .eq("assignment_id", assignment_id)
  .eq("razorpay_order_id", razorpay_order_id)
  .eq("status", "due")
  .select()
  .single();

if (cycleError) {
  // Don't fail the whole request — the payment itself is genuine and
  // already recorded. But log loudly since this is what unlocks the
  // dashboard and the parent will otherwise think payment failed.
  console.error("Error marking billing cycle as paid:", cycleError);
}

    // Move the assignment out of "not_started" once first payment lands
    await supabaseAdmin
      .from("tuition_assignments")
      .update({ status: "ongoing" })
      .eq("id", assignment_id)
      .eq("status", "not_started");

    // If tuition_admin_view is a MATERIALIZED view, it won't reflect this
    // new payment until refreshed. This RPC call refreshes it so the
    // dashboard shows correct totals immediately. If tuition_admin_view is
    // a regular (non-materialized) view, this RPC won't exist — the call
    // will fail silently (logged only) and can be removed once confirmed.
    const { error: refreshError } = await supabaseAdmin.rpc(
      "refresh_tuition_admin_view"
    );
    if (refreshError) {
      console.error(
        "Error refreshing tuition_admin_view (safe to ignore if it's a regular view, not materialized):",
        refreshError
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error verifying payment:", err);
    return NextResponse.json(
      { error: "Failed to verify payment." },
      { status: 500 }
    );
  }
}