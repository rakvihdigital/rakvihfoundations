import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ================= UPDATE =================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

   const {
  full_name,
  email,
  phone,
  employee_id,
  department,
  status,
  permissions,
} = body;

   if (
  !full_name ||
  !email ||
  !phone ||
  !employee_id ||
  !department
) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    const { error: adminError } = await supabase
      .from("admins")
     .update({
  full_name,
  email,
  phone,
  employee_id,
  department,
  status,
})
     .eq("id", id);

    if (adminError) throw adminError;

    const { error: permissionError } = await supabase
      .from("admin_permissions")
     .update({
  dashboard: permissions.dashboard,
  students: permissions.students,
  programs: permissions.programs,
  payments: permissions.payments,
  videos: permissions.videos,
  materials: permissions.materials,
  assignments: permissions.assignments,
  certificates: permissions.certificates,
  reports: permissions.reports,
  settings: permissions.settings,
})
   .eq("admin_id", id);

    if (permissionError) throw permissionError;

    return NextResponse.json({
      success: true,
      message: "Sub Admin updated successfully.",
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ================= DELETE =================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {

    // Get auth_id
    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("auth_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Delete permissions
    const { error: permissionError } = await supabase
      .from("admin_permissions")
      .delete()
      .eq("admin_id", id);

    if (permissionError) throw permissionError;

    // Delete admin
    const { error: adminError } = await supabase
      .from("admins")
      .delete()
      .eq("id", id);

    if (adminError) throw adminError;

    // Delete Auth User
    if (admin?.auth_id) {
      const { error: authError } =
        await supabase.auth.admin.deleteUser(admin.auth_id);

      if (authError) throw authError;
    }

    return NextResponse.json({
      success: true,
      message: "Sub Admin deleted successfully.",
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

