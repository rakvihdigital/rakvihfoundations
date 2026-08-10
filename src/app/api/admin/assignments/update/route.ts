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

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const due_date = formData.get("due_date")?.toString() || null;
    const status = formData.get("status")?.toString() || "Published";

    const file = formData.get("file") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    const updateData: any = {
      title,
      description,
      due_date,
      status,
      updated_at: new Date().toISOString(),
    };

    // Upload new assignment PDF
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("assignments")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("assignments")
        .getPublicUrl(fileName);

      updateData.file_url = publicUrl;
      updateData.file_name = file.name;
      updateData.file_size = file.size;
      updateData.file_type = file.type;
    }

    // Upload new thumbnail
    if (thumbnail && thumbnail.size > 0) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const thumbName = `${Date.now()}-${thumbnail.name}`;

      const { error } = await supabase.storage
        .from("assignment-thumbnails")
        .upload(thumbName, buffer, {
          contentType: thumbnail.type,
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("assignment-thumbnails")
        .getPublicUrl(thumbName);

      updateData.thumbnail = publicUrl;
    }

    const { data, error } = await supabase
      .from("assignments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      assignment: data,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}