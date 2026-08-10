import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReceiptPage({
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

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("enrollment_id", enrollment.id)
    .single();

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", enrollment.program_id)
    .single();

  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl">

        <div className="border-b pb-8">

          <h1 className="text-4xl font-bold">
            RAKVIH Foundation
          </h1>

          <p className="mt-2 text-gray-500">
            Internship Payment Receipt
          </p>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div>

            <h3 className="mb-4 text-xl font-bold">
              Student Details
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {enrollment.full_name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {enrollment.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {enrollment.phone}
            </p>

            <p>
              <strong>College:</strong>{" "}
              {enrollment.college}
            </p>

            <p>
              <strong>Branch:</strong>{" "}
              {enrollment.branch}
            </p>

          </div>

          <div>

            <h3 className="mb-4 text-xl font-bold">
              Payment Details
            </h3>

            <p>
              <strong>Receipt No:</strong>{" "}
              RCPT-{payment?.id}
            </p>

            <p>
              <strong>Transaction ID:</strong>{" "}
              {payment?.transaction_id}
            </p>

            <p>
              <strong>Method:</strong>{" "}
              {payment?.payment_method}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {payment?.payment_status}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {payment?.created_at?.slice(0, 10)}
            </p>

          </div>

        </div>

        <div className="mt-10 rounded-2xl border">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Course
                </th>

                <th className="p-4 text-right">
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="p-4">
                  {program?.title}
                </td>

                <td className="p-4 text-right font-bold">
                  ₹{payment?.amount}
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <div className="mt-8 flex justify-end">

          <h2 className="text-3xl font-bold text-green-600">
            Paid ₹{payment?.amount}
          </h2>

        </div>

        <div className="mt-10 flex gap-4">

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-yellow-400 px-8 py-4 font-bold hover:bg-yellow-500"
          >
            Print Receipt
          </button>

          <Link
            href="/dashboard"
            className="rounded-xl bg-black px-8 py-4 font-bold text-white"
          >
            Student Dashboard
          </Link>

        </div>

      </div>

    </main>
  );
}