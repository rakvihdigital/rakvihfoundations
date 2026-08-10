import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inquiry_type, full_name, phone, email, message } = body;

    // Basic validation
    if (!inquiry_type || !full_name || !phone || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert into Supabase table 'Foundations_conact'
    const { data, error } = await supabaseAdmin
      .from("Foundations_conact")
      .insert([
        {
          inquiry_type,
          full_name,
          phone,
          email,
          message,
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