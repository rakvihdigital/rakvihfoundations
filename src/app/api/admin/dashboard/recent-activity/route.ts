import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const activities: any[] = [];

  // Recent Enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      full_name,
      created_at,
      programs(title)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  enrollments?.forEach((item: any) => {
    activities.push({
      type: "Enrollment",
      title: `${item.full_name} enrolled in ${item.programs?.title}`,
      date: item.created_at,
    });
  });

  // Recent Payments
  const { data: payments } = await supabase
    .from("payments")
    .select(`
      amount,
      payment_status,
      created_at,
      enrollments(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  payments?.forEach((item: any) => {
    activities.push({
      type: "Payment",
      title: `${item.enrollments?.full_name} paid ₹${item.amount}`,
      date: item.created_at,
    });
  });

  activities.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  return NextResponse.json(activities.slice(0, 10));
}