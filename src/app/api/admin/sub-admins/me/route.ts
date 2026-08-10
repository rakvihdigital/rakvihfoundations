import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select(`
        id,
        full_name,
        email,
        role,
       admin_permissions (
  dashboard,
  students,
  programs,
  payments,
  videos,
 materials,
  assignments,
  certificates,
  reports,
  settings
)
      `)
      .eq("auth_id", user.id)
      .single();

    if (adminError) throw adminError;

    return NextResponse.json({
      success: true,
      data: admin,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}