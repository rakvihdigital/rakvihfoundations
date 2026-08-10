import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  // Total Students
  const { count: totalStudents, error: studentsError } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true });

  if (studentsError) throw studentsError;

  // Active Students (Confirmed)
  const { count: activeStudents, error: activeStudentsError } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_status", "Confirmed");

  if (activeStudentsError) throw activeStudentsError;

  // Active Programs
  const { count: totalPrograms, error: programsError } = await supabase
    .from("programs")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active");

  if (programsError) throw programsError;

  // Certificates Issued
  const { count: certificatesIssued, error: certificatesError } =
    await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true });

  if (certificatesError) throw certificatesError;

  // Payments
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("amount, payment_status");

  if (paymentsError) throw paymentsError;

  // Total Revenue (Paid + Completed)
  const totalRevenue =
    payments
      ?.filter(
        (payment) =>
          payment.payment_status === "Paid" ||
          payment.payment_status === "Completed"
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0) ?? 0;

  // Pending Payments
  const pendingPayments =
    payments?.filter(
      (payment) => payment.payment_status === "Pending"
    ).length ?? 0;

  return {
    totalStudents: totalStudents ?? 0,
    activeStudents: activeStudents ?? 0,
    totalRevenue,
    pendingPayments,
    totalPrograms: totalPrograms ?? 0,
    certificatesIssued: certificatesIssued ?? 0,
  };
}