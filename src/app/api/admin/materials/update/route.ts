import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Material ID is required.",
        },
        { status: 400 }
      );
    }

    const program_id = Number(formData.get("program_id"));
    const syllabus_id = Number(formData.get("syllabus_id"));
    const topic_id = Number(formData.get("topic_id"));

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const status = formData.get("status")?.toString() || "Published";

    const pdfFile = formData.get("file") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    const updateData: any = {
      program_id,
      syllabus_id,
      topic_id,
      title,
      description,
      status,
      updated_at: new Date().toISOString(),
    };

    // Upload new PDF
    if (pdfFile) {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfBuffer = Buffer.from(pdfBytes);

      const pdfName = `${Date.now()}-${pdfFile.name}`;

      const { error: pdfError } = await supabase.storage
        .from("materials")
        .upload(pdfName, pdfBuffer, {
          contentType: pdfFile.type,
          upsert: true,
        });

      if (pdfError) throw pdfError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("materials").getPublicUrl(pdfName);

      updateData.file_url = publicUrl;
      updateData.file_name = pdfFile.name;
      updateData.file_type = pdfFile.type;
      updateData.file_size = pdfFile.size;
    }

    // Upload new Thumbnail
    if (thumbnailFile) {
      const thumbBytes = await thumbnailFile.arrayBuffer();
      const thumbBuffer = Buffer.from(thumbBytes);

      const thumbName = `${Date.now()}-${thumbnailFile.name}`;

      const { error: thumbError } = await supabase.storage
        .from("material-thumbnails") // change if using another bucket
        .upload(thumbName, thumbBuffer, {
          contentType: thumbnailFile.type,
          upsert: true,
        });

      if (thumbError) throw thumbError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("material-thumbnails")
        .getPublicUrl(thumbName);

      updateData.thumbnail = publicUrl;
    }

    const { error } = await supabase
      .from("materials")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Material updated successfully.",
    });
  } catch (error: any) {
    console.error("Update Material Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to update material.",
      },
      { status: 500 }
    );
  }
}