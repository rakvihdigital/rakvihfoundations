// src/app/api/payments/razorpay/create-order/route.ts
// Creates a Razorpay order for the CURRENT DUE billing cycle on a tuition assignment.
// Frontend calls this first, then opens Razorpay checkout with the returned order.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { assignment_id } = await req.json();

    if (!assignment_id) {
      return NextResponse.json(
        { error: "assignment_id is required." },
        { status: 400 }
      );
    }

    // Confirm the assignment exists
    const { data: assignment, error: fetchError } = await supabaseAdmin
      .from("tuition_assignments")
      .select("id")
      .eq("id", assignment_id)
      .single();

    if (fetchError || !assignment) {
      return NextResponse.json(
        { error: "Tuition assignment not found." },
        { status: 404 }
      );
    }

    // Find the current due billing cycle for this assignment.
    // There should only ever be one 'due' cycle at a time per the unique
    // (assignment_id, period_start) constraint + generate_next_billing_cycle
    // trigger, but order by period_start just in case and take the earliest.
    const { data: cycle, error: cycleError } = await supabaseAdmin
      .from("tuition_billing_cycles")
      .select("id, amount_due, period_start, status")
      .eq("assignment_id", assignment_id)
      .eq("status", "due")
      .order("period_start", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (cycleError) {
      console.error("Error fetching billing cycle:", cycleError);
      return NextResponse.json({ error: cycleError.message }, { status: 500 });
    }

    if (!cycle) {
      return NextResponse.json(
        { error: "No outstanding payment is due for this tuition right now." },
        { status: 400 }
      );
    }

    const amountDue = Number(cycle.amount_due);

    // Razorpay expects amount in paise (smallest currency unit)
    const order = await razorpay.orders.create({
      amount: Math.round(amountDue * 100),
      currency: "INR",
      receipt: `tuition_${assignment_id}_cycle_${cycle.id}_${Date.now()}`,
      notes: {
        assignment_id: String(assignment_id),
        billing_cycle_id: String(cycle.id),
      },
    });

    // Stamp this order id onto the cycle row now, BEFORE returning to the
    // client. This is what lets /verify later match the payment back to
    // the exact cycle it was for.
    const { error: stampError } = await supabaseAdmin
      .from("tuition_billing_cycles")
      .update({ razorpay_order_id: order.id })
      .eq("id", cycle.id)
      .eq("status", "due");

    if (stampError) {
      console.error("Error stamping order id onto billing cycle:", stampError);
      return NextResponse.json(
        { error: "Failed to initialize payment for this cycle." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      billing_cycle_id: cycle.id,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return NextResponse.json(
      { error: "Failed to create payment order." },
      { status: 500 }
    );
  }
}