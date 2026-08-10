import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    console.log("Step 1");

    const { userId, password } = await req.json();

    console.log("Step 2", userId);

    const { error: authError } =
      await supabase.auth.admin.updateUserById(userId, {
        password,
      });

    console.log("Step 3");

    if (authError) {
      console.log(authError);
      throw authError;
    }

    const { error: dbError } = await supabase
      .from("enrollments")
      .update({
        password_changed: true,
        temp_password: null,
      })
  .eq("user_id", userId);

    console.log("Step 4");

    if (dbError) {
      console.log(dbError);
      throw dbError;
    }

    console.log("Step 5");

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log("ERROR");
    console.log(err);

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