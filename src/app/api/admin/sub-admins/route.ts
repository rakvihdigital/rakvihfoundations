import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("admins")
     .select(`
  id,
  auth_id,
  full_name,
  email,
  phone,
  employee_id,
  department,
  status,
  role,
  created_at,
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
      .eq("role", "sub_admin")
      .order("full_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Sub Admin API Error:", error);

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

const {
  full_name,
  email,
  password,
  phone,
  employee_id,
  department,
  status,
  permissions,
} = body;

    // Validation
    if (
  !full_name ||
  !email ||
  !phone ||
  !password ||
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

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        {
          status: 400,
        }
      );
    }

    // Duplicate Email
    const { data: existingEmail } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // Duplicate Employee ID
    const { data: existingEmployee } = await supabase
      .from("admins")
      .select("id")
      .eq("employee_id", employee_id)
      .maybeSingle();

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // Create Auth User
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    // Create Admin
    const { data: admin, error: adminError } = await supabase
      .from("admins")
     .insert({
  auth_id: authUser.user.id,
  full_name,
  email,
  phone,
  employee_id,
  department,
  status: status || "Active",
  role: "sub_admin",
})
      .select()
      .single();

    if (adminError) throw adminError;

    // Save Permissions
    const { error: permissionError } = await supabase
      .from("admin_permissions")
     .insert({
  admin_id: admin.id,
  dashboard: permissions?.dashboard ?? false,
  students: permissions?.students ?? false,
  programs: permissions?.programs ?? false,
  payments: permissions?.payments ?? false,
  videos: permissions?.videos ?? false,
  materials: permissions?.materials ?? false,
  assignments: permissions?.assignments ?? false,
  certificates: permissions?.certificates ?? false,
  reports: permissions?.reports ?? false,
  settings: permissions?.settings ?? false,
});

    if (permissionError) throw permissionError;

    return NextResponse.json({
      success: true,
      message: "Sub Admin created successfully.",
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