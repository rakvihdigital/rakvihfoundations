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

    // Fetch Student
    const { data: student, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single();

    if (error || !student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }


    if (student.payment_status !== "Completed") {
  return NextResponse.json(
    {
      success: false,
      message: "Payment is not approved yet.",
    },
    { status: 400 }
  );
}

    // Already Approved
if (student.user_id && student.temp_password) {
  return NextResponse.json(
    {
      success: false,
      message: "Student already approved",
    },
    { status: 400 }
  );
}

    const tempPassword = passwordGenerator();


    if (student.user_id && !student.temp_password) {
  const { error: updateAuthError } =
    await supabase.auth.admin.updateUserById(student.user_id, {
      password: tempPassword,
    });

  if (updateAuthError) {
    throw updateAuthError;
  }

  const { error: updateError } = await supabase
    .from("enrollments")
    .update({
      temp_password: tempPassword,
    })
    .eq("id", enrollmentId);

  if (updateError) {
    throw updateError;
  }

  return NextResponse.json({
    success: true,
    message: "Temporary password generated successfully",
    email: student.email,
    temporaryPassword: tempPassword,
  });
}

    // Create Auth User
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: student.email,
        password: tempPassword,
        email_confirm: true,
      });

console.log("Auth User:", authUser);
console.log("Auth Error:", authError);

    if (authError) {
      if (authError.code === "email_exists") {
        return NextResponse.json(
          {
            success: false,
            message:
              "This email already exists in Authentication. Please link the existing user manually.",
          },
          { status: 400 }
        );
      }

      throw authError;
    }

// Make sure auth user was created
if (!authUser?.user) {
  throw new Error("Auth user was not created.");
}

// Update Enrollment
const { error: updateError } = await supabase
  .from("enrollments")
  .update({
    user_id: authUser.user.id,
    temp_password: tempPassword,
  })
  .eq("id", enrollmentId);



    if (updateError) {
      throw updateError;
    }


    const { data: check } = await supabase
  .from("enrollments")
  .select("user_id,temp_password")
  .eq("id", enrollmentId)
  .single();

console.log("Saved Data:", check);

    return NextResponse.json({
      success: true,
      message: "Student Approved Successfully",
      email: student.email,
      temporaryPassword: tempPassword,
    });
  } catch (error) {
console.error("Approve Student Error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}