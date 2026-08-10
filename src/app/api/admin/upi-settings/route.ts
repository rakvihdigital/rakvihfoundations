import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for backend admin updates
);

// 1. GET: Fetch the current settings from the table
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("upi_settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 means row not found
      throw error;
    }

    return NextResponse.json({ success: true, data: data || null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Save or Update (Upsert) settings in the table
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Map your frontend state fields to match your database column names
    const payload = {
      upi_id: body.upiId,
      qr_code_image: body.qrCodeImage,
      bank_name: body.bankName,
      account_number: body.accountNumber,
      ifsc_code: body.ifscCode,
      account_name: body.accountName || "RAKVIH FOUNDATION",
      updated_at: new Date().toISOString(),
    };

    // Check if a row already exists in upi_settings
    const { data: existingRow } = await supabase
      .from("upi_settings")
      .select("id")
      .limit(1)
      .single();

    let result;
    if (existingRow) {
      // UPDATE the existing row
      result = await supabase
        .from("upi_settings")
        .update(payload)
        .eq("id", existingRow.id);
    } else {
      // INSERT a new row if table is empty
      result = await supabase
        .from("upi_settings")
        .insert([payload]);
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true, message: "Saved & updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}