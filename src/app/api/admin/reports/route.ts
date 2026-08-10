import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filter = searchParams.get("filter") || "month";

    let startDate = new Date();

    if (filter === "today") {
      startDate.setHours(0, 0, 0, 0);
    } 
    
    if (filter === "month") {
      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );
    }

    if (filter === "year") {
      startDate = new Date(
        startDate.getFullYear(),
        0,
        1
      );
    }


    // Run all database calls together
    const [
      studentsResult,
      programsCountResult,
      paymentsResult,
      enrollmentPaymentsResult,
      enrollmentsResult,
      programsResult,
      enrollmentsDataResult,

    ] = await Promise.all([

      supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString()),


      supabase
        .from("programs")
        .select("*", { count: "exact", head: true }),


      supabase
        .from("payments")
        .select(
          "amount,payment_status,created_at"
        )
        .gte(
          "created_at",
          startDate.toISOString()
        ),


      supabase
        .from("enrollments")
        .select("payment_status")
        .gte(
          "created_at",
          startDate.toISOString()
        ),


      supabase
        .from("enrollments")
        .select("created_at")
        .gte(
          "created_at",
          startDate.toISOString()
        ),


      supabase
        .from("programs")
        .select("id,title"),


      supabase
        .from("enrollments")
        .select("program_id"),

    ]);



    if (paymentsResult.error)
      throw paymentsResult.error;

    if (programsResult.error)
      throw programsResult.error;

    if (enrollmentsDataResult.error)
      throw enrollmentsDataResult.error;



    const totalStudents =
      studentsResult.count || 0;


    const totalPrograms =
      programsCountResult.count || 0;



    const payments =
      paymentsResult.data || [];


    const enrollmentPayments =
      enrollmentPaymentsResult.data || [];



    let totalRevenue = 0;

    const monthlyRevenue =
      Array(12).fill(0);



    payments.forEach((payment) => {

      if (
        payment.payment_status === "Completed" ||
        payment.payment_status === "Paid"
      ) {

        const amount =
          Number(payment.amount);

        totalRevenue += amount;


        const month =
          new Date(
            payment.created_at
          ).getMonth();


        monthlyRevenue[month] += amount;
      }

    });



    const completedPayments =
      enrollmentPayments.filter(
        (item) =>
          item.payment_status === "Completed" ||
          item.payment_status === "Paid"
      ).length;



    const pendingPayments =
      enrollmentPayments.filter(
        (item) =>
          item.payment_status === "Pending"
      ).length;



    const monthlyEnrollments =
      Array(12).fill(0);



    enrollmentsResult.data?.forEach(
      (item) => {

        const month =
          new Date(
            item.created_at
          ).getMonth();


        monthlyEnrollments[month]++;

      }
    );



    // Top Programs

    const programCounts: Record<
      string,
      number
    > = {};


    enrollmentsDataResult.data?.forEach(
      (item) => {

        if (!item.program_id)
          return;


        programCounts[item.program_id] =
          (programCounts[item.program_id] || 0) + 1;

      }
    );



    const topPrograms =
      (programsResult.data || [])
      .map((program)=>({

        title: program.title,

        students:
          programCounts[program.id] || 0

      }))
      .sort(
        (a,b)=>
          b.students-a.students
      );




    return NextResponse.json({

      totalStudents,

      totalPrograms,

      totalRevenue,

      completedPayments,

      pendingPayments,

      monthlyEnrollments,

      monthlyRevenue,

      topPrograms:
        topPrograms.slice(0,5),

    });



  } catch(error){

    console.error(error);


    return NextResponse.json(
      {
        error:
        "Failed to load reports"
      },
      {
        status:500
      }
    );

  }
}