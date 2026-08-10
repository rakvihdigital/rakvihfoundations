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
          message: "Material ID is required.",
        },
        { status: 400 }
      );
    }

    // Get material details
    const { data: material, error: fetchError } = await supabase
      .from("materials")
      .select("id,file_url")
      .eq("id", id)
      .single();

    if (fetchError || !material) {
      return NextResponse.json(
        {
          success: false,
          message: "Material not found.",
        },
        { status: 404 }
      );
    }

    // Delete file from Storage
    if (material.file_url) {
      try {
        const filePath = decodeURIComponent(
          material.file_url.split("/materials/")[1]
        );

        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("materials")
            .remove([filePath]);

          if (storageError) {
            console.error("Storage delete error:", storageError);
          }
        }
      } catch (err) {
        console.error("Storage delete error:", err);
      }
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from("materials")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Material deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete Material Error:", error);

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