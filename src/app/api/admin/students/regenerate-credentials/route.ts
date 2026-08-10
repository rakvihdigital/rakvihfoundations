import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { customAlphabet } from "nanoid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const passwordGenerator = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",
  10
);

export async function POST(req: NextRequest) {
  try {
    const { enrollmentId } = await req.json();

    console.log("Enrollment ID Received:", enrollmentId);

    const { data: student, error } = await supabase
      .from("enrollments")
   .select("id, email, user_id")
      .eq("id", enrollmentId)
      .single();

    console.log("Student:", student);
    console.log("Error:", error);

    if (error || !student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
          error,
        },
        { status: 404 }
      );
    }

  if (!student.user_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Student is not approved yet.",
        },
        { status: 400 }
      );
    }

    const tempPassword = passwordGenerator();

    const { error: authError } = await supabase.auth.admin.updateUserById(
    student.user_id,
      {
        password: tempPassword,
      }
    );

    if (authError) {
      console.error("Auth Update Error:", authError);

      return NextResponse.json(
        {
          success: false,
          message: authError.message,
        },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("enrollments")
      .update({
        temp_password: tempPassword,
      })
      .eq("id", enrollmentId);

    if (updateError) {
      console.error("Update Error:", updateError);

      return NextResponse.json(
        {
          success: false,
          message: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      email: student.email,
      temp_password: tempPassword,
    });
  } catch (error: any) {
    console.error("Regenerate Credentials Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to generate credentials.",
      },
      { status: 500 }
    );
  }
}