import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { is_active } = await req.json();
    const resolvedParams = await params;
    const applicationId = parseInt(resolvedParams.id, 10);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid Application ID" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("tuition_applications")
      .update({ is_active: Boolean(is_active) })
      .eq("id", applicationId)
      .select();

    if (error) {
      console.error("Supabase error updating active status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json(
      { error: "Failed to update active state." },
      { status: 500 }
    );
  }
}