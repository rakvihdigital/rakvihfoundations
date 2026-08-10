import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Assignment ID is required.",
        },
        { status: 400 }
      );
    }

    // Get assignment details
    const { data: assignment, error: fetchError } = await supabase
      .from("assignments")
      .select("id,file_url")
      .eq("id", id)
      .single();

    if (fetchError || !assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Assignment not found.",
        },
        { status: 404 }
      );
    }

    // Delete file from Storage
    if (assignment.file_url) {
      try {
        const filePath = decodeURIComponent(
          assignment.file_url.split("/assignments/")[1]
        );

        if (filePath) {
          await supabase.storage
            .from("assignments")
            .remove([filePath]);
        }
      } catch (err) {
        console.error("Storage delete error:", err);
      }
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from("assignments")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Assignment deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete Assignment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}