import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;


    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select a file.",
        },
        { status: 400 }
      );
    }

    const program_id = Number(formData.get("program_id"));
    const syllabus_id = Number(formData.get("syllabus_id"));
    const topic_id = Number(formData.get("topic_id"));

    const title = formData.get("title")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "Published";

    if (!program_id || !syllabus_id || !topic_id || !title) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("materials")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("materials")
      .getPublicUrl(fileName);

      let thumbnailUrl: string | null = null;

if (thumbnail) {
  const thumbnailBytes = await thumbnail.arrayBuffer();
  const thumbnailBuffer = Buffer.from(thumbnailBytes);

  const thumbnailName = `thumbnail-${Date.now()}-${thumbnail.name}`;

  const { error: thumbnailUploadError } = await supabase.storage
    .from("material-thumbnails") // or "materials" if using the same bucket
    .upload(thumbnailName, thumbnailBuffer, {
      contentType: thumbnail.type,
      upsert: false,
    });

  if (thumbnailUploadError) {
    throw thumbnailUploadError;
  }

  const {
    data: { publicUrl: thumbPublicUrl },
  } = supabase.storage
    .from("material-thumbnails")
    .getPublicUrl(thumbnailName);

  thumbnailUrl = thumbPublicUrl;
}

    const { data, error } = await supabase
      .from("materials")
    .insert({
  program_id,
  syllabus_id,
  topic_id,
  title,
  description,
  thumbnail: thumbnailUrl,
  file_name: file.name,
  file_url: publicUrl,
  file_type: file.type,
  file_size: file.size,
  downloads: 0,
  status,
})
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Material uploaded successfully.",
      material: data,
    });
  } catch (error: any) {
    console.error("Upload Material Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}