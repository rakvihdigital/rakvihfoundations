import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact_name, company_name, email, phone, focus_area, project_details } = body;

    // Basic validation
    if (!contact_name || !company_name || !email || !phone || !focus_area || !project_details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert into Supabase table 'csr_proposals'
    const { data, error } = await supabaseAdmin
      .from("csr_proposals")
      .insert([
        {
          contact_name,
          company_name,
          email,
          phone,
          focus_area,
          project_details,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}