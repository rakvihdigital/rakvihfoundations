import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenue = new Array(12).fill(0);

  const { data, error } = await supabase
    .from("payments")
    .select("amount, payment_status, created_at");

  if (error) {
    return NextResponse.json([]);
  }

  data?.forEach((payment) => {
    // Only completed payments
    if (payment.payment_status !== "Completed") return;

    const month = new Date(payment.created_at).getMonth();

    revenue[month] += Number(payment.amount);
  });

  const chartData = months.map((month, index) => ({
    month,
    revenue: revenue[index],
  }));

  return NextResponse.json(chartData);
}